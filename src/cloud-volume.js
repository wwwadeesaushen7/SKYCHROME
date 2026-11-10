import * as T from "./three.js";
const wrap = (x, n) => ((x % n) + n) % n;
function random(x, y, z, seed = 0) {
  let h =
    Math.imul(x + seed, 374761393) ^
    Math.imul(y, 668265263) ^
    Math.imul(z, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
export function volumeNoise(x, y, z, cells) {
  x *= cells;
  y *= cells;
  z *= cells;
  const ix = Math.floor(x),
    iy = Math.floor(y),
    iz = Math.floor(z);
  const smooth = (a) => a * a * (3 - 2 * a);
  const fx = smooth(x - ix),
    fy = smooth(y - iy),
    fz = smooth(z - iz);
  let n = 0;
  for (let a = 0; a < 2; a++)
    for (let b = 0; b < 2; b++)
      for (let c = 0; c < 2; c++)
        n +=
          random(
            wrap(ix + a, cells),
            wrap(iy + b, cells),
            wrap(iz + c, cells),
          ) *
          (a ? fx : 1 - fx) *
          (b ? fy : 1 - fy) *
          (c ? fz : 1 - fz);
  return n;
}
function worley(x, y, z, cells) {
  x *= cells;
  y *= cells;
  z *= cells;
  const ix = Math.floor(x),
    iy = Math.floor(y),
    iz = Math.floor(z);
  let nearest = 3;
  for (let a = -1; a <= 1; a++)
    for (let b = -1; b <= 1; b++)
      for (let c = -1; c <= 1; c++) {
        const px = wrap(ix + a, cells),
          py = wrap(iy + b, cells),
          pz = wrap(iz + c, cells);
        const dx = ix + a + random(px, py, pz, 13) - x;
        const dy = iy + b + random(px, py, pz, 29) - y;
        const dz = iz + c + random(px, py, pz, 43) - z;
        nearest = Math.min(nearest, dx * dx + dy * dy + dz * dz);
      }
  return 1 - Math.min(1, Math.sqrt(nearest));
}
export function cloudVolumeData(size = 64) {
  const data = new Uint8Array(size ** 3 * 4);
  for (let z = 0; z < size; z++)
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const u = x / size,
          v = y / size,
          w = z / size,
          i = ((z * size + y) * size + x) * 4;
        data[i] =
          (volumeNoise(u, v, w, 4) * 0.65 + volumeNoise(u, v, w, 8) * 0.35) *
          255;
        data[i + 1] = worley(u, v, w, 8) * 255;
        data[i + 2] =
          (volumeNoise(u, v, w, 16) * 0.65 + volumeNoise(u, v, w, 32) * 0.35) *
          255;
        data[i + 3] = 255;
      }
  return data;
}
export function cloudVolume() {
  const texture = new T.Data3DTexture(cloudVolumeData(), 64, 64, 64);
  texture.wrapS = texture.wrapT = texture.wrapR = T.RepeatWrapping;
  texture.minFilter = texture.magFilter = T.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
