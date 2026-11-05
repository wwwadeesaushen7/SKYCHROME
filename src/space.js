// Separate mission descriptors and flight model. Campaign and rank progression
// continue to use the v2.7.0 simulation and profile schema.
export const SPACE_MISSIONS = Object.freeze([
  {
    id: "space-patrol",
    mode: "space",
    mapId: "space",
    name: "Outer Rim patrol",
    region: "OUTER RIM · ORBITAL SECTOR",
    type: "Space combat · Patrol",
    description:
      "Fly your X-wing or TIE fighter through the orbital navigation gates and defeat six opposing starfighters. Inertial thrusters replace aerodynamic lift; there is no ground or stall.",
    kills: 6,
    rings: 4,
    stages: [{ name: "Orbital patrol", kind: "patrol", kills: 6, rings: 4 }],
    duration: 300,
    expectedSeconds: 180,
    gateSpacing: 900,
    gateRadius: 16,
    routeSpread: 40,
    enemyInterval: 7,
    enemyHP: 18,
    enemyAgility: 1.1,
    enemyDamage: 12,
    enemyAccuracy: 0.5,
    difficulty: "PILOT",
    palette: "space",
    seed: 2811,
  },
  {
    id: "space-intercept",
    mode: "space",
    mapId: "space",
    name: "Squadron interception",
    region: "OUTER RIM · BLOCKADE",
    type: "Space combat · Two waves",
    description:
      "Break the blockade in two combat waves. Destroy eight starfighters and clear six navigation gates. Fly either faction; your selected craft determines the opposing squadron.",
    kills: 8,
    rings: 6,
    stages: [
      { name: "Screening squadron", kind: "patrol", kills: 4, rings: 3 },
      { name: "Blockade wing", kind: "intercept", kills: 4, rings: 3, aces: 1 },
    ],
    duration: 420,
    expectedSeconds: 300,
    gateSpacing: 850,
    gateRadius: 14,
    routeSpread: 48,
    enemyInterval: 6,
    enemyHP: 22,
    enemyAgility: 1.3,
    enemyDamage: 15,
    enemyAccuracy: 0.65,
    difficulty: "VETERAN",
    palette: "space",
    seed: 2812,
  },
]);
export function updateSpaceFlight(state, dt, controls = {}) {
  const p = state.player,
    f = state.flight;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const blend = (a, b, s) => a + (b - a) * (1 - Math.exp(-s * dt));
  const x = clamp(controls.x || 0, -1, 1),
    y = clamp(controls.y || 0, -1, 1);
  p.rollRate = blend(p.rollRate, (controls.roll || 0) * 2.2, 7);
  p.roll += p.rollRate * dt;
  if (!controls.roll) p.roll = blend(p.roll, 0, 2.5);
  p.roll = Math.atan2(Math.sin(p.roll), Math.cos(p.roll));
  const sx = x * Math.cos(p.roll) - y * Math.sin(p.roll),
    sy = x * Math.sin(p.roll) + y * Math.cos(p.roll);
  const oldSpeed = state.speed;
  state.speed = blend(
    state.speed,
    controls.brake ? 35 : state.boosting ? 165 : 100,
    controls.brake ? 2.6 : 0.8,
  );
  p.vx = blend(p.vx, sx * 58, controls.brake ? 4 : 1.8);
  p.vy = blend(p.vy, sy * 46, controls.brake ? 4 : 1.8);
  p.x = clamp(p.x + p.vx * dt, -600, 600);
  p.y = clamp(p.y + p.vy * dt, -160, 240);
  if (Math.abs(p.x) === 600) p.vx = 0;
  if (p.y === -160 || p.y === 240) p.vy = 0;
  p.bank = blend(p.bank, -sx * 0.55, 5);
  p.pitch = blend(p.pitch, Math.atan2(p.vy, state.speed) * 0.4, 4);
  p.yaw = blend(p.yaw, -Math.atan2(p.vx, state.speed) * 0.4, 4);
  f.thrust = blend(f.thrust, state.boosting ? 44 : 12.15, 3);
  f.airbrake = blend(f.airbrake, controls.brake ? 1 : 0, 4);
  f.acceleration = (state.speed - oldSpeed) / dt;
  f.load = Math.hypot(sx, sy) * 1.8;
  f.verticalSpeed = p.vy;
  f.stall = 0;
  f.aoa = 0;
  f.windX = f.windY = 0;
  return state.speed * dt;
}
