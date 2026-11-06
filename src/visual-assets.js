import * as T from "./three.js";

export const visualAssets = { loaded: 0, total: 0, pending: 0, errors: [] };
export const photographicBlend = { value: 0 };
const cache = new Map();
const url = (name) => new URL(`./textures/${name}`, location.href).href;
function track(promise, name) {
  visualAssets.total++;
  visualAssets.pending++;
  return promise
    .then((value) => {
      visualAssets.loaded++;
      return value;
    })
    .catch((error) => {
      visualAssets.errors.push(`${name}: ${error.message}`);
      throw error;
    })
    .finally(() => visualAssets.pending--);
}
function image(name, color = false) {
  if (cache.has(name)) return cache.get(name);
  const texture = new T.Texture();
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.magFilter = T.LinearFilter;
  texture.minFilter = T.LinearMipmapLinearFilter;
  texture.anisotropy = 8;
  if (color) texture.colorSpace = T.SRGBColorSpace;
  const ready = track(
    new Promise((resolve, reject) => {
      const bitmap = new Image();
      bitmap.onload = () => {
        texture.image = bitmap;
        texture.needsUpdate = true;
        resolve(texture);
      };
      bitmap.onerror = () =>
        reject(new Error("Bundled texture could not be loaded"));
      bitmap.src = url(name);
    }),
    name,
  );
  const entry = { texture, ready };
  cache.set(name, entry);
  return entry;
}
let terrain;
export function photographicTerrain(mapId) {
  if (!terrain) {
    terrain = {
      rock: image("rock-color.png", true),
      normal: image("rock-normal.png"),
      rough: image("rock-rough.png"),
      grass: image("grass-color.jpg", true),
      sand: image("sand-color.jpg", true),
      ice: image("ice-color.jpg", true),
      iceNormal: image("ice-normal.jpg"),
      iceRough: image("ice-rough.jpg"),
    };
    Promise.all(Object.values(terrain).map((v) => v.ready))
      .then(() => (photographicBlend.value = 1))
      .catch(() => {});
  }
  const frozen = mapId === "glacier";
  return {
    rock: (frozen ? terrain.ice : terrain.rock).texture,
    ground: (frozen
      ? terrain.ice
      : mapId === "azure"
        ? terrain.grass
        : terrain.rock
    ).texture,
    normal: (frozen ? terrain.iceNormal : terrain.normal).texture,
    rough: (frozen ? terrain.iceRough : terrain.rough).texture,
    sand: (frozen ? terrain.ice : terrain.sand).texture,
  };
}

// Radiance RGBE scanlines. Bundled HDRI Haven maps use modern per-channel RLE.
export function decodeRadiance(buffer) {
  const bytes = new Uint8Array(buffer);
  let offset = 0;
  const line = () => {
    let s = "";
    while (offset < bytes.length) {
      const c = bytes[offset++];
      if (c === 10) break;
      s += String.fromCharCode(c);
    }
    return s.trim();
  };
  if (!line().startsWith("#?")) throw new Error("Invalid Radiance header");
  let header;
  do {
    header = line();
  } while (header && offset < bytes.length);
  const match = /^-Y (\d+) \+X (\d+)$/.exec(line());
  if (!match) throw new Error("Unsupported HDR image orientation");
  const height = Number(match[1]),
    width = Number(match[2]);
  if (width < 8 || width > 8192 || height < 1 || height > 4096)
    throw new Error("Unsupported HDR dimensions");
  const data = new Float32Array(width * height * 4),
    scan = new Uint8Array(width * 4);
  for (let y = 0; y < height; y++) {
    if (
      bytes[offset++] !== 2 ||
      bytes[offset++] !== 2 ||
      ((bytes[offset++] << 8) | bytes[offset++]) !== width
    )
      throw new Error("Invalid HDR scanline");
    for (let channel = 0; channel < 4; channel++) {
      let x = 0;
      while (x < width) {
        const code = bytes[offset++];
        if (!code) throw new Error("Invalid HDR run");
        if (code > 128) {
          const count = code - 128,
            value = bytes[offset++];
          if (value === undefined) throw new Error("Truncated HDR data");
          if (x + count > width) throw new Error("HDR run overflow");
          scan.fill(value, channel * width + x, channel * width + x + count);
          x += count;
        } else {
          if (x + code > width || offset + code > bytes.length)
            throw new Error("Truncated HDR data");
          scan.set(bytes.subarray(offset, offset + code), channel * width + x);
          offset += code;
          x += code;
        }
      }
    }
    for (let x = 0; x < width; x++) {
      const p = (y * width + x) * 4,
        e = scan[width * 3 + x];
      const scale = e ? Math.pow(2, e - 128) / 256 : 0;
      data[p] = scan[x] * scale;
      data[p + 1] = scan[width + x] * scale;
      data[p + 2] = scan[width * 2 + x] * scale;
      data[p + 3] = 1;
    }
  }
  return { data, width, height };
}
async function hdr(name) {
  return track(
    fetch(url(name))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.arrayBuffer();
      })
      .then((buffer) => {
        const { data, width, height } = decodeRadiance(buffer);
        // Neutral daylight white balance for the purple dawn capture.
        if (name === "sky-dawn.hdr") {
          for (let i = 0; i < data.length; i += 4) {
            data[i] *= 0.85;
            data[i + 1] *= 1.15;
            data[i + 2] *= 0.7;
          }
        }
        const t = new T.DataTexture(data, width, height);
        t.type = 1015;
        t.mapping = 303;
        t.flipY = true;
        t.minFilter = t.magFilter = T.LinearFilter;
        t.needsUpdate = true;
        return t;
      }),
    name,
  );
}
export function loadLighting(owner, onready) {
  for (const [name, target] of [
    ["sky-dawn.hdr", "outdoor"],
    ["hangar.hdr", "hangar"],
  ]) {
    hdr(name)
      .then((texture) => {
        const environment = owner.pmrem.fromEquirectangular(texture);
        texture.dispose();
        onready(target, environment);
        owner.needsRender = true;
      })
      .catch(() => {});
  }
}
