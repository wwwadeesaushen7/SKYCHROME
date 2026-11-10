// Shared by visible terrain and collision sampling. Deterministic across saves.
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const ease = (v) => {
  v = clamp(v);
  return v * v * (3 - 2 * v);
};
export function terrainNoise(x, z, seed = 0) {
  const ix = Math.floor(x),
    iz = Math.floor(z),
    fx = ease(x - ix),
    fz = ease(z - iz);
  const hash = (a, b) => {
    let n =
      Math.imul(a, 374761393) ^
      Math.imul(b, 668265263) ^
      Math.imul(seed + 31, 1274126177);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  };
  return (
    (hash(ix, iz) * (1 - fx) + hash(ix + 1, iz) * fx) * (1 - fz) +
    (hash(ix, iz + 1) * (1 - fx) + hash(ix + 1, iz + 1) * fx) * fz
  );
}
export function ridges(x, z, seed = 0, octaves = 4) {
  let sum = 0,
    weight = 0.56,
    total = 0;
  for (let i = 0; i < octaves; i++) {
    const ridge = 1 - Math.abs(terrainNoise(x, z, seed + i * 17) * 2 - 1);
    sum += ridge * ridge * weight;
    total += weight;
    const nx = x * 1.72 + z * 1.03;
    z = z * 1.72 - x * 1.03;
    x = nx;
    weight *= 0.5;
  }
  return sum / total;
}
export function islandHeight(x, z, island) {
  const seed = island.id + 71,
    u = x / island.size,
    v = z / island.size;
  const wx = (terrainNoise(u * 2 + 11, v * 2, seed) - 0.5) * 0.24;
  const wz = (terrainNoise(u * 2, v * 2 + 17, seed) - 0.5) * 0.24;
  const radius = Math.hypot(u / 1.3, v / 1.5);
  // Preserve the original island extents and leave the flight corridor open.
  const coast =
    1 -
    radius +
    Math.sin(x * 0.036 + island.id) * 0.15 +
    Math.cos(z * 0.035 + x * 0.012) * 0.12 +
    Math.sin(z * 0.08 - x * 0.053) * 0.05;
  if (coast <= 0) return -3;
  const body = Math.pow(coast, 1.28);
  const ridge = ridges((u + wx) * 2.3, (v + wz) * 2.3, seed);
  const drainage = Math.pow(
    1 - Math.abs(terrainNoise((u + wx) * 8, (v + wz) * 8, seed + 29) * 2 - 1),
    10,
  );
  let height = island.height * body * (0.35 + ridge * 1.03 - drainage * 0.16);
  if (island.mapId === "glacier")
    height =
      island.height *
      Math.pow(coast, 1.05) *
      (0.36 + Math.pow(ridge, 1.5) * 1.2 - drainage * 0.1);
  if (island.mapId === "canyon") {
    const shelf = ease((coast - 0.06) / 0.45);
    const top =
      island.height * shelf * (0.8 + terrainNoise(u * 3, v * 3, seed) * 0.22);
    const step = 11,
      q = top / step,
      fraction = q - Math.floor(q);
    height =
      (Math.floor(q) + ease((fraction - 0.2) / 0.65)) * step -
      drainage * shelf * 7;
  }
  if (island.mapId === "caldera") {
    const crater = Math.exp(-Math.pow(radius / 0.25, 4));
    height = Math.max(-1.5, height - crater * island.height * 0.7);
  }
  return Math.max(
    -3,
    height +
      (terrainNoise(x * 0.1, z * 0.1, seed) - 0.5) * 1.3 * ease(coast * 8),
  );
}

export function distantHeight(x, z, layer, mapId) {
  const scale = mapId === "glacier" ? 900 : mapId === "canyon" ? 450 : 650;
  const envelope = Math.pow(Math.max(0, 1 - Math.abs(z) / 600), 0.75);
  const ridge = ridges(x * 0.0018, z * 0.003 + layer * 13, 187 + layer, 5);
  let height = scale * (0.15 + ridge * 0.95) * envelope;
  if (mapId === "canyon") height = Math.min(height, scale * 0.65);
  return height - 45;
}
