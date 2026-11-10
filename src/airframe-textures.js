import * as T from "./three.js";
import { hash } from "./materials.js";
let cached;
export function airframeTextures() {
  if (cached) return cached;
  const size = 1024,
    albedo = new Uint8Array(size * size * 4),
    normal = albedo.slice(),
    rough = albedo.slice(),
    height = new Float32Array(size * size);
  const rows = [0, 128, 320, 416, 640, 800, 1024];
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const row = rows.findIndex((end, i) => i && y < end) - 1;
      const py = y - rows[row],
        h = rows[row + 1] - rows[row];
      const width = [256, 128, 512, 256, 128, 256][row];
      const px = (x + (row % 2) * 64) % width;
      const edge = Math.min(px, width - px, py, h - py);
      const seam = edge < 1.6 ? 1 : edge < 3 ? 0.3 : 0;
      const rivet =
        ((py === 7 || py === h - 7) && px % 28 < 2) ||
        ((px === 7 || px === width - 7) && py % 28 < 2);
      const panel = hash(Math.floor((x + (row % 2) * 64) / width), row, 53);
      const grain = hash(x, y, 37);
      const grime = Math.max(0, 1 - edge / 13) * (0.4 + panel * 0.6);
      const scratch =
        hash(Math.floor(x / 2), Math.floor(y / 21), 71) > 0.995 && x % 2 === 0;
      const access =
        (px > 28 && px < 81 && Math.abs(py - 42) < 1) ||
        (px > 28 && px < 81 && Math.abs(py - 68) < 1) ||
        ((px === 28 || px === 80) && py >= 42 && py <= 68);
      const value =
        242 +
        panel * 9 +
        (grain - 0.5) * 4 -
        seam * 58 -
        grime * 15 -
        (rivet ? 30 : 0) -
        (access ? 24 : 0);
      const i = (y * size + x) * 4;
      albedo.set([value, value + 0.6, value + 1.1, 255], i);
      rough.set(
        [
          255,
          166 + panel * 30 + grime * 36 + grain * 9 - (scratch ? 70 : 0),
          255,
          255,
        ],
        i,
      );
      height[y * size + x] =
        -0.1 * seam +
        (rivet ? 0.06 : 0) -
        (access ? 0.035 : 0) +
        (grain - 0.5) * 0.004;
    }
  const sample = (x, y) =>
    height[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const dx = (sample(x - 1, y) - sample(x + 1, y)) * 3;
      const dy = (sample(x, y - 1) - sample(x, y + 1)) * 3;
      const len = Math.hypot(dx, dy, 1);
      normal.set(
        [128 + (dx / len) * 127, 128 + (dy / len) * 127, 128 + 127 / len, 255],
        (y * size + x) * 4,
      );
    }
  const make = (data, color) => {
    const t = new T.DataTexture(data, size, size);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.magFilter = T.LinearFilter;
    t.minFilter = T.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.anisotropy = 8;
    if (color) t.colorSpace = T.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  };
  cached = {
    panels: make(albedo, true),
    panelNormal: make(normal),
    paintRoughness: make(rough),
  };
  return cached;
}
