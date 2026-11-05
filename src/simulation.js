// Reconstructed from the shipped v2.7.0 game; readable simulation and terrain core.
import { updateSpaceFlight } from "./space.js";
const re = (i, e, s) => Math.max(e, Math.min(s, i)),
  le = (i, e, s, t) => i + (e - i) * (1 - Math.exp(-s * t)),
  dt = 9.81,
  Pi = 90,
  Oi = 54;
function Fi() {
  return {
    thrust: 12.15,
    airbrake: 0,
    load: 1,
    aoa: 0,
    stall: 0,
    windX: 0,
    windY: 0,
    verticalSpeed: 0,
    acceleration: 0,
  };
}
function Di(i, e, s = {}) {
  if (i.mission.mode === "space") return updateSpaceFlight(i, e, s);
  const t = i.player,
    n = i.flight;
  let o = re(Number(s.x) || 0, -1, 1),
    r = re(Number(s.y) || 0, -1, 1);
  const a = Math.max(1, Math.hypot(o, r));
  ((o /= a), (r /= a));
  const c = re(Number(s.roll) || 0, -1, 1);
  if (c)
    ((t.rollRate = le(t.rollRate, c * 2.6, 9, e)), (t.roll += t.rollRate * e));
  else {
    const O = Math.exp(-6 * e),
      j = t.rollRate + 6 * t.roll;
    ((t.roll = (t.roll + j * e) * O),
      (t.rollRate = (t.rollRate - 6 * j * e) * O),
      Math.abs(t.roll) < 0.001 &&
        Math.abs(t.rollRate) < 0.01 &&
        ((t.roll = 0), (t.rollRate = 0)));
  }
  t.roll = Math.atan2(Math.sin(t.roll), Math.cos(t.roll));
  const h = Math.cos(t.roll),
    l = Math.sin(t.roll),
    d = o * h - r * l,
    u = o * l + r * h;
  ((n.airbrake = le(n.airbrake, s.brake ? 1 : 0, 4, e)),
    (n.thrust = le(n.thrust, i.boosting ? 44 : 12.15, 3, e)));
  const p = Math.max(20, i.speed),
    v = 1.7 * (d * d + u * u) + Math.abs(t.rollRate) * 0.55;
  ((n.acceleration =
    n.thrust - (0.0015 + n.airbrake * 0.0042) * p * p - v - (dt * t.vy) / p),
    (i.speed = Math.max(25, i.speed + n.acceleration * e)));
  const w = re((i.speed / Pi) ** 2, 0.25, 1.32),
    y = re((Oi - i.speed) / 14, 0, 1);
  n.stall = le(n.stall, y, 3, e);
  const m =
    { azure: 0.6, glacier: 1.35, canyon: 0.9, caldera: 1.1 }[i.mission.mapId] ||
    0.6;
  ((n.windX =
    m * (Math.sin(i.time * 0.43) * 0.6 + Math.sin(i.distance * 0.007) * 0.4)),
    (n.windY = m * Math.sin(i.time * 0.67 + i.distance * 0.002) * 0.2));
  const b = t.vy,
    S = d * 40 * Math.sqrt(w) + n.windX,
    M = u * 32 * Math.sqrt(w) + n.windY,
    $ = re((S - t.vx) * (d ? 4.5 : 5.5), -42 * w, 42 * w),
    z = dt * (1 - h) * 0.5 + n.stall * dt * 1.8,
    k = re((M - t.vy) * (u ? 4 : 5), -34 * w, 34 * w) * (1 - n.stall * 0.7) - z;
  ((t.vx += $ * e),
    (t.vy += k * e),
    (t.x += t.vx * e),
    (t.y += t.vy * e),
    t.x > 600
      ? ((t.x = 600), (t.vx = Math.min(0, t.vx)))
      : t.x < -600 && ((t.x = -600), (t.vx = Math.max(0, t.vx))),
    t.y > 180 && ((t.y = 180), (t.vy = Math.min(0, t.vy))));
  const T = Math.hypot($ / dt, 1 + (t.vy - b) / e);
  ((n.load = le(n.load, re(T, 0, 6), 5, e)),
    (n.aoa = le(
      n.aoa,
      re(0.035 + (n.load * 0.018) / Math.max(0.3, w) + n.stall * 0.23, 0, 0.36),
      5,
      e,
    )),
    (n.verticalSpeed = t.vy));
  const L = -d * 0.65;
  return (
    (t.bank = le(t.bank, L, 5, e)),
    (t.pitch = le(t.pitch, Math.atan2(t.vy, i.speed) + n.aoa - 0.053, 5, e)),
    (t.yaw = le(t.yaw, -Math.atan2(t.vx - n.windX, i.speed) * 0.55, 4, e)),
    i.speed * e
  );
}
const be = -2,
  ae = 3900,
  ee = 48,
  ue = 52,
  Gi = (i, e) => ((((i + e + 3400) % ae) + ae) % ae) - 3400;
function Ni(i, e, s) {
  const t = Math.hypot(i / (s.size * 1.3), e / (s.size * 1.5)),
    n =
      Math.sin(i * 0.036 + s.id) * 0.15 +
      Math.cos(e * 0.035 + i * 0.012) * 0.12 +
      Math.sin(e * 0.08 - i * 0.053) * 0.05,
    o = 1 - t + n,
    r =
      0.8 +
      0.2 *
        Math.abs(
          Math.sin(i * 0.021 + e * 0.014 + s.id) * Math.cos(e * 0.024 - s.id),
        );
  return (
    (o > 0 ? Math.pow(o, 1.65) * s.height * r : -3) +
    (o > 0.08 ? Math.sin(i * 0.1) * Math.cos(e * 0.09) * 2 : 0)
  );
}
const Bi = (i = "azure") =>
    Array.from({ length: 16 }, (e, s) => {
      const t = {
        id: s,
        size: 95 + ((s * 37) % 95),
        height: 45 + ((s * 23) % 95),
        x: (s % 2 === 0 ? -1 : 1) * (220 + ((s * 73) % 270)),
        z: -340 - Math.floor(s / 2) * 430,
        angle: s * 0.73,
      };
      ((t.mapId = i),
        i === "glacier" &&
          ((t.size = 110 + ((s * 31) % 80)),
          (t.height = 110 + ((s * 19) % 95)),
          (t.x = (s % 2 ? -1 : 1) * (300 + ((s * 47) % 240))),
          (t.angle = s * 0.4)),
        i === "canyon" &&
          ((t.size = 110 + ((s * 23) % 65)),
          (t.height = 65 + ((s * 17) % 80)),
          (t.x = (s % 2 ? -1 : 1) * (260 + ((s * 53) % 230))),
          (t.angle = s * 0.19)),
        i === "caldera" &&
          ((t.size = 110 + ((s * 17) % 65)),
          (t.height = 85 + ((s * 31) % 105)),
          (t.x = (s % 2 ? -1 : 1) * (285 + ((s * 37) % 250))),
          (t.angle = s * 0.57)),
        (t.cos = Math.cos(t.angle)),
        (t.sin = Math.sin(t.angle)),
        (t.width = t.size * 2.8),
        (t.depth = t.size * 3.3),
        (t.cos = Math.cos(t.angle)),
        (t.sin = Math.sin(t.angle)),
        (t.radius = Math.hypot(t.width, t.depth) / 2),
        (t.heights = new Float32Array((ee + 1) * (ue + 1))));
      for (let n = 0; n <= ue; n++)
        for (let o = 0; o <= ee; o++) {
          const r = (o / ee - 0.5) * t.width,
            a = (n / ue - 0.5) * t.depth;
          let c = Ni(r, a, t),
            h = Math.hypot(r / (t.size * 1.3), a / (t.size * 1.5));
          (i === "glacier" &&
            c > 0 &&
            (c =
              c * (0.8 + Math.abs(Math.sin(r * 0.027 + a * 0.019)) * 0.35) +
              Math.max(0, 1 - h) * 12),
            i === "canyon" &&
              (c =
                h < 0.85
                  ? Math.min(t.height, Math.max(0, (0.94 - h) * 5) * t.height) +
                    Math.sin(a * 0.08) * 2
                  : -3),
            i === "caldera" &&
              c > 0 &&
              (c = Math.max(
                0,
                c - Math.max(0, 1 - h / 0.22) * t.height * 0.58,
              )),
            (t.heights[n * (ee + 1) + o] = c));
        }
      return t;
    }),
  Os = Object.fromEntries(
    ["azure", "glacier", "canyon", "caldera"].map((i) => [i, Bi(i)]),
  ),
  ji = Os.azure,
  Et = (i) => Os[i] || ji;
function Fs(i, e, s) {
  const t = (e / i.width + 0.5) * ee,
    n = (s / i.depth + 0.5) * ue;
  if (t < 0 || n < 0 || t > ee || n > ue) return -1 / 0;
  const o = Math.min(ee - 1, Math.floor(t)),
    r = Math.min(ue - 1, Math.floor(n)),
    a = t - o,
    c = n - r,
    h = ee + 1,
    l = r * h + o,
    d = i.heights[l],
    u = i.heights[l + h],
    p = i.heights[l + 1],
    v = i.heights[l + h + 1];
  return a + c <= 1
    ? d + (p - d) * a + (u - d) * c
    : v + (u - v) * (1 - a) + (p - v) * (1 - c);
}
function Fe(i, e, s, t = "azure") {
  if (t === "space") return -1e6;
  let n = be;
  for (const o of Et(t)) {
    const r = i - o.x,
      a = e - Gi(o.z, s);
    Math.abs(r) > o.radius ||
      Math.abs(a) > o.radius ||
      (n = Math.max(n, Fs(o, o.cos * r - o.sin * a, o.sin * r + o.cos * a)));
  }
  return n;
}
function ps(i, e, s, t, n = "azure") {
  if (n === "space") return Infinity;
  const o = e.x - i.x,
    r = e.y - i.y,
    a = e.z - i.z,
    c = t - s,
    h = (d) => i.y + r * d <= Fe(i.x + o * d, i.z + a * d, s + c * d, n);
  if (h(0)) return 0;
  const l = Math.max(1, Math.ceil(Math.hypot(o, r, a - c) / 4));
  for (let d = 1; d <= l; d++)
    if (h(d / l)) {
      let u = (d - 1) / l,
        p = d / l;
      for (let v = 0; v < 5; v++) {
        const w = (u + p) * 0.5;
        h(w) ? (p = w) : (u = w);
      }
      return p;
    }
  return 1 / 0;
}
const fs = [
  "Ingress patrol",
  "Forward sweep",
  "Hostile interception",
  "Deep strike",
  "Coastal gauntlet",
  "Airspace lockdown",
  "Final approach",
  "Sky superiority",
  "Extraction corridor",
];
function Hi(i, e, s) {
  return Array.from({ length: s }, (t, n) =>
    Object.freeze({
      name: fs[n % fs.length],
      kills: Math.floor(i / s) + (n < i % s ? 1 : 0),
      rings: Math.floor(e / s) + (n < e % s ? 1 : 0),
    }),
  );
}
const ms = ["patrol", "precision", "recon", "intercept"],
  Ui = {
    patrol: "Airspace patrol",
    precision: "Terrain run",
    recon: "Reconnaissance",
    intercept: "Ace interception",
  };
function Lt(i, e, s, t = 0) {
  return Hi(i, e, s).map((n, o) => {
    const r = ms[(t + o) % ms.length];
    return Object.freeze({
      ...n,
      kind: r,
      name: Ui[r],
      kills: r === "recon" ? Math.max(1, Math.ceil(n.kills * 0.5)) : n.kills,
      scans: r === "recon" ? 1 : 0,
      aces: r === "intercept" ? 1 : 0,
    });
  });
}
const qi = (i) => (i <= 5 ? 1 : i <= 20 ? 2 : i <= 50 ? 3 : i <= 80 ? 4 : 5),
  et = Object.freeze([
    {
      id: "clean",
      name: "Clean wings",
      description: "Finish with at least 75% hull",
      bonus: 1e3,
    },
    {
      id: "cannon",
      name: "Gunslinger",
      description: "Destroy 3 jets with cannons",
      bonus: 900,
    },
    {
      id: "precision",
      name: "Perfect route",
      description: "Finish without missing a gate",
      bonus: 800,
    },
    {
      id: "boost",
      name: "Fast lane",
      description: "Clear 3 gates while boosting",
      bonus: 800,
    },
  ]);
function Ki(i, e = Math.random) {
  const s = et.findIndex((t) => t.id === i);
  return et[
    s < 0
      ? Math.floor(e() * et.length)
      : (s + 1 + Math.floor(e() * (et.length - 1))) % et.length
  ];
}
function Vi(i) {
  return i.contract
    ? i.contract.id === "clean"
      ? i.health >= 75
      : i.contract.id === "cannon"
        ? i.cannonKills >= 3
        : i.contract.id === "precision"
          ? i.missedGates === 0
          : i.boostGates >= 3
    : !1;
}
function Rt(i, e, s, t, n, o = 1) {
  const r = (e * s) / 90,
    a = (i * t) / o,
    c = Math.ceil((Math.max(r, a) + n * 8) / 60) * 60;
  return { expectedSeconds: c, duration: Math.ceil((c * 1.5 + 90) / 60) * 60 };
}
const ce = (i, e, s) => Math.max(e, Math.min(s, i)),
  Yi = ["Interceptor", "Flanker", "Diver", "Sweeper"];
function Wi(i, e = 0) {
  const { player: s, mission: t } = i,
    n = i.id++,
    o = n % 4,
    r = i.random() < 0.5 ? -1 : 1,
    a = t.enemyHP || 16,
    c = i.random() * Math.PI * 2;
  return {
    id: n,
    ai: !0,
    role: o,
    roleName: Yi[o],
    side: r,
    phase: c,
    age: 0,
    state: "approach",
    x: ce(s.x + r * (55 + i.random() * 65), -560, 560),
    y: ce(s.y + 10 + i.random() * 55, 30, 150),
    z: -590 - e * 85,
    hp: a,
    maxHP: a,
    vx: 0,
    vy: 0,
    vz: i.speed + 22,
    bank: 0,
    pitch: 0,
    yaw: Math.PI,
    anchorX: s.x,
    anchorY: s.y,
    cooldown: 2 + i.random(),
    evadeUntil: 0,
    evadeReady: 2 + i.random() * 2,
    flyby: !1,
  };
}
function _i(i, e) {
  !i.ai ||
    e < i.evadeReady ||
    ((i.evadeUntil = e + 1.05), (i.evadeReady = e + 5.5), (i.side *= -1));
}
function Xi(i, e, s) {
  const t = i,
    n = e.player,
    o = e.mission;
  ((t.age += s),
    (t.anchorX += (n.x - t.anchorX) * Math.min(1, s * 0.65)),
    (t.anchorY += (n.y - t.anchorY) * Math.min(1, s * 0.45)));
  const r = t.age,
    a = t.phase,
    c = (o.enemyAgility || 1) * (t.ace ? 1.2 : 1);
  let h = t.anchorX,
    l = t.anchorY + 15,
    d = -300;
  (t.age < 3.3
    ? ((t.state = "approach"),
      (h += Math.sin(r * 0.9 + a) * 45),
      (l += Math.cos(r * 0.7 + a) * 20),
      (d = -225))
    : t.role === 0
      ? ((t.state = "intercept"),
        (h += Math.sin(r * 0.8 + a) * 65),
        (l += Math.cos(r * 0.6 + a) * 22),
        (d = -210 + Math.sin(r * 0.55 + a) * 65))
      : t.role === 1
        ? ((t.state = "flank"),
          (h += Math.sin(r * 0.62 + a) * 120),
          (l += 30 + Math.sin(r * 0.8 + a) * 23),
          (d = -360 + Math.cos(r * 0.47 + a) * 110))
        : t.role === 2
          ? ((t.state = "dive"),
            (h += Math.cos(r * 0.75 + a) * 75),
            (l += 30 + Math.sin(r * 0.58 + a) * 45),
            (d = -270 + Math.sin(r * 0.5 + a) * 95))
          : ((t.state = "sweep"),
            (h += Math.sin(r * 0.72 + a) * 110),
            (l += Math.cos(r * 0.9 + a) * 30),
            (d = -320 + Math.sin(r * 0.4 + a) * 100)),
    r > 13 + t.role * 2.3 &&
      ((t.state = "pass"),
      (d = 115),
      (h = t.anchorX + t.side * 28 + Math.sin(r * 1.1 + a) * 28),
      (l = t.anchorY + Math.cos(r * 0.8 + a) * 17)),
    e.time < t.evadeUntil &&
      ((t.state = "evade"),
      (h += t.side * 85),
      (l += Math.sin(a) > 0 ? 28 : -20),
      (d -= 75)),
    (h = ce(h, -575, 575)),
    (l = ce(Math.max(l, Fe(t.x, t.z, e.distance, o.mapId) + 18), 25, 168)));
  const u = ce((h - t.x) * 1.9, -46 * c, 46 * c),
    p = ce((l - t.y) * 1.8, -28 * c, 28 * c),
    v =
      t.state === "pass"
        ? e.speed + 32
        : ce((d - t.z) * 1.25, -95, e.speed + 30),
    w = 1 - Math.exp(-s * 3.5),
    y = t.vx;
  ((t.vx += (u - t.vx) * w),
    (t.vy += (p - t.vy) * w),
    (t.vz += (v - t.vz) * w),
    (t.x += t.vx * s),
    (t.y = ce(t.y + t.vy * s, 22, 170)),
    (t.z += t.vz * s));
  const m = t.vz - e.speed,
    b = ce((-(t.vx - y) / Math.max(s, 0.001)) * 0.012, -1.05, 1.05);
  ((t.bank += (b - t.bank) * Math.min(1, s * 5)),
    (t.yaw = Math.atan2(-t.vx, -m)),
    (t.pitch = Math.atan2(t.vy, Math.hypot(t.vx, m))),
    !t.flyby &&
      t.z > -110 &&
      ((t.flyby = !0),
      e.emit("flyby", {
        x: t.x,
        y: t.y,
        z: t.z,
        vx: t.vx,
        vy: t.vy,
        vz: t.vz,
      })),
    t.age > 30 && (t.escaped = !0));
}
function Zi(i, e, s = 450) {
  const t = e.vx || 0,
    n = e.vy || 0,
    o = e.vz || 0,
    r = e.x - i.x,
    a = e.y - i.y,
    c = e.z - i.z,
    h = t * t + n * n + o * o - s * s,
    l = 2 * (r * t + a * n + c * o),
    d = r * r + a * a + c * c,
    u = l * l - 4 * h * d;
  let p =
    u >= 0 && Math.abs(h) > 0.001
      ? (-l - Math.sqrt(u)) / (2 * h)
      : Math.sqrt(d) / s;
  return (
    (!Number.isFinite(p) || p < 0) && (p = Math.sqrt(d) / s),
    (p = Math.min(p, 2)),
    { x: e.x + t * p, y: e.y + n * p, z: e.z + o * p }
  );
}
const Ji = 3,
  gs = Lt(16, 12, 2, 2),
  vs = Lt(27, 18, 3, 0),
  as = [
    {
      id: "azure",
      name: "Azure Horizon",
      region: "AZURE ARCHIPELAGO",
      type: "Recon & interception",
      description:
        "Two varied stages: align with the blue recon corridor, then hunt a marked ace. Clear the combat and gate objectives in each stage. Choose any theatre below.",
      rings: 12,
      kills: gs.reduce((i, e) => i + e.kills, 0),
      stages: gs,
      gateSpacing: 850,
      ...Rt(12, 12, 850, 8, 2),
      difficulty: "ROOKIE",
      enemyHP: 16,
      enemyInterval: 8,
      palette: "day",
    },
    {
      id: "crimson",
      name: "Crimson Skies",
      region: "EMBER COAST",
      type: "Patrol, terrain run & recon",
      description:
        "Three focused stages: secure the airspace, fly a tighter low route and complete a recon pass. Single enemy arrivals keep combat readable.",
      rings: 18,
      kills: vs.reduce((i, e) => i + e.kills, 0),
      stages: vs,
      gateSpacing: 950,
      ...Rt(23, 18, 950, 6.5, 3),
      difficulty: "VETERAN",
      enemyInterval: 6.5,
      squadSize: 1,
      enemyHP: 20,
      fireInterval: 1.5,
      enemyDamage: 15,
      enemyAccuracy: 0.5,
      palette: "sunset",
    },
    {
      id: "free",
      name: "Open Horizon",
      region: "AZURE ARCHIPELAGO",
      type: "Free flight",
      description:
        "No clock. No hostiles. Just you, the ocean, and an endless horizon. Collect gates at your own pace.",
      rings: 0,
      kills: 0,
      duration: 0,
      difficulty: "RELAXED",
      enemyInterval: 1 / 0,
      palette: "day",
    },
  ],
  Ae = (i, e, s) => Math.max(e, Math.min(s, i));
function ys(i, e, s) {
  const t = e.x - i.x,
    n = e.y - i.y,
    o = e.z - i.z,
    r = t * t + n * n + o * o,
    a = i.x * i.x + i.y * i.y + i.z * i.z - s * s;
  if (a <= 0) return 0;
  if (r < 1e-12) return 1 / 0;
  const c = i.x * t + i.y * n + i.z * o,
    h = c * c - r * a;
  if (h < 0) return 1 / 0;
  const l = (-c - Math.sqrt(h)) / r;
  return l >= 0 && l <= 1 ? l : 1 / 0;
}
function Ot(i, e, s) {
  let t = 0,
    n = 1;
  for (const o of ["x", "y", "z"]) {
    const r = e[o] - i[o];
    if (Math.abs(r) < 1e-9) {
      if (Math.abs(i[o]) > s[o]) return !1;
      continue;
    }
    const a = (-s[o] - i[o]) / r,
      c = (s[o] - i[o]) / r;
    if (
      ((t = Math.max(t, Math.min(a, c))),
      (n = Math.min(n, Math.max(a, c))),
      t > n)
    )
      return !1;
  }
  return !0;
}
function Ds(i, e, s, t = 450, n = 90) {
  if (e.ai) return Zi(i, e, t);
  const o = Math.sin(s * (e.frequency || 1) + e.phase) * (e.weave ?? 6),
    r = n + 13,
    a = e.x - i.x,
    c = e.y - i.y,
    h = e.z - i.z,
    l = o * o + r * r - t * t,
    d = 2 * (a * o + h * r),
    u = a * a + c * c + h * h,
    p = Math.max(0, d * d - 4 * l * u);
  let v = Math.max(0, (-d - Math.sqrt(p)) / (2 * l));
  const w = e.frequency || 1,
    y = e.weave ?? 6,
    m = s * w + e.phase,
    b = (S) => e.x + ((Math.cos(m) - Math.cos(m + w * S)) * y) / w;
  for (let S = 0; S < 5; S++) v = Math.hypot(b(v) - i.x, c, h + r * v) / t;
  return { x: b(v), y: e.y, z: e.z + r * v };
}
const Qi = [
  [0, -0.8, 0],
  [0, 0, -8.5],
  [-6.8, -0.15, 2.8],
  [6.8, -0.15, 2.8],
  [0, -0.5, 5.8],
];
function it(i, e, s, t) {
  const n = i.bank + (i.roll || 0),
    o = Math.cos(n),
    r = Math.sin(n),
    a = Math.cos(i.pitch),
    c = Math.sin(i.pitch),
    h = o * e - r * s,
    l = r * e + o * s,
    d = Math.cos(i.yaw || 0),
    u = Math.sin(i.yaw || 0),
    p = -u * h + d * t;
  return { x: i.x + d * h + u * t, y: i.y + a * l - c * p, z: c * l + a * p };
}
class ea {
  constructor(e = as[0], s = 127) {
    this.reset(e, s);
  }
  reset(e = this.mission, s = 127) {
    ((this.mission = e),
      (this.seed = s),
      (this.time = 0),
      (this.distance = 0),
      (this.status = "ready"),
      (this.reason = null),
      (this.player = {
        x: 0,
        y: 38,
        z: 0,
        vx: 0,
        vy: 0,
        bank: 0,
        pitch: 0,
        roll: 0,
        rollRate: 0,
        yaw: 0,
      }),
      (this.flight = Fi()),
      (this.aim = { x: 0, y: 38, z: -240 }),
      (this.targetId = null),
      (this.leadPoint = null),
      (this.assistLocked = !1),
      (this.clearance = 39),
      (this.health = 100),
      (this.energy = 100),
      (this.speed = 90),
      (this.score = 0),
      (this.kills = 0),
      (this.ringsCollected = 0),
      (this.shots = 0),
      (this.hits = 0),
      (this.boosting = !1),
      (this.boostLocked = !1),
      (this.enemies = []),
      (this.bullets = []),
      (this.hostileBullets = []),
      (this.events = []),
      (this.enemyLimit = e.mode === "ranked" ? 4 : 3),
      (this.spawnInterval = Math.max(
        e.enemyInterval || 6,
        e.mode === "ranked" ? 5 : 6,
      )),
      (this.cooldown = 0),
      (this.missileCooldown = 0),
      (this.invincible = 0),
      (this.spawnTimer = 2),
      (this.id = 0),
      (this.stages = e.stages?.length ? e.stages : null),
      (this.stageIndex = 0),
      (this.completedStages = 0),
      (this.stageKills = 0),
      (this.stageRings = 0),
      (this.objectiveKills = 0),
      (this.objectiveRings = 0),
      (this.stageScans = 0),
      (this.stageAces = 0),
      (this.scan = null),
      (this.contract = null),
      (this.contractBonus = 0),
      (this.cannonKills = 0),
      (this.boostGates = 0),
      (this.missedGates = 0),
      (this.rings = Array.from({ length: 6 }, (t, n) => ({
        id: this.id++,
        x: n === 0 ? 0 : Math.sin(n * 1.4) * 32,
        y: n === 0 ? 38 : 38 + Math.sin(n * 2) * 17,
        z: -210 - n * 300,
        active: !0,
      }))),
      this.stages && (this.resetRoute(), this.resetSpecial()));
  }
  get stage() {
    return this.stages?.[this.stageIndex] || null;
  }
  resetRoute() {
    const e = this.mission.gateSpacing || 930;
    this.rings.forEach((s, t) => {
      ((s.active = !!this.stage?.rings),
        (s.z = -(t + 1) * e),
        this.placeGate(s, t === 0 && this.stageIndex === 0));
    });
  }
  placeGate(e, s = !1) {
    const t = this.mission.routeSpread || (this.stages ? 36 : 45);
    e.x = s ? 0 : (this.random() - 0.5) * t * 2;
    const n = s
      ? 38
      : this.stage?.kind === "precision"
        ? 24 + this.random() * 20
        : this.stages
          ? 38 + this.random() * 48
          : 28 + this.random() * 52;
    ((e.y = Math.max(
      n,
      Fe(e.x, 0, this.distance - e.z, this.mission.mapId) + 22,
    )),
      e.y > 160 &&
        ((e.x = 0),
        (e.y = Math.max(
          n,
          Fe(0, 0, this.distance - e.z, this.mission.mapId) + 22,
        ))),
      (e.y = Math.min(165, e.y)));
  }
  resetSpecial() {
    ((this.stageScans = 0),
      (this.stageAces = 0),
      (this.scan = this.stage?.scans
        ? {
            x: this.stageIndex % 2 ? -22 : 22,
            y: 74,
            z: -(this.mission.gateSpacing || 650) - 400,
            progress: 0,
            required: 2.5 + (this.mission.level || 1) / 180,
            radius: 28,
          }
        : null));
  }
  updateSpecial(e, s) {
    const t = this.scan;
    if (!t || this.stageScans >= (this.stage?.scans || 0)) return;
    t.z += s;
    const n =
      Math.abs(t.z) < 260 &&
      Math.hypot(this.player.x - t.x, this.player.y - t.y) < t.radius;
    ((t.progress = Ae(t.progress + (n ? e : -e * 0.65), 0, t.required)),
      t.progress >= t.required
        ? (this.stageScans++,
          (this.score += 600),
          this.emit("scan", { x: t.x, y: t.y, z: t.z }))
        : t.z > 310 &&
          ((t.z = -850), (t.progress = 0), this.emit("scanMissed")));
  }
  checkObjectives() {
    if (!(this.status !== "playing" || this.mission.id === "free"))
      if (this.stages) {
        if (
          this.stageKills < this.stage.kills ||
          this.stageRings < this.stage.rings ||
          this.stageScans < (this.stage.scans || 0) ||
          this.stageAces < (this.stage.aces || 0)
        )
          return;
        if (
          (this.completedStages++, this.completedStages === this.stages.length)
        ) {
          this.finish(!0, "All stages and objectives complete");
          return;
        }
        (this.stageIndex++,
          (this.stageKills = 0),
          (this.stageRings = 0),
          this.resetRoute(),
          this.resetSpecial(),
          (this.spawnTimer = Math.min(this.spawnTimer, 2)),
          this.emit("stage", {
            number: this.stageIndex + 1,
            total: this.stages.length,
            name: this.stage.name,
          }));
      } else
        this.kills >= this.mission.kills &&
          this.ringsCollected >= this.mission.rings &&
          this.finish(!0, "All objectives complete");
  }
  random() {
    return (
      (this.seed = (Math.imul(1664525, this.seed) + 1013904223) >>> 0),
      this.seed / 4294967296
    );
  }
  start() {
    this.status === "ready" && (this.status = "playing");
  }
  pause() {
    this.status === "playing" && (this.status = "paused");
  }
  resume() {
    this.status === "paused" && (this.status = "playing");
  }
  emit(e, s = {}) {
    this.events.push({ type: e, ...s });
  }
  damage(e) {
    this.invincible > 0 ||
      this.status !== "playing" ||
      ((this.health = Math.max(0, this.health - e)),
      (this.invincible = 0.7),
      this.emit("damage"),
      this.health === 0 && this.crash("Aircraft lost"));
  }
  crash(e) {
    this.status === "playing" &&
      ((this.health = 0),
      (this.boosting = !1),
      this.emit("explosion", {
        x: this.player.x,
        y: this.player.y,
        z: 0,
        player: !0,
      }),
      this.finish(!1, e));
  }
  finish(e, s) {
    this.status === "playing" &&
      (e &&
        Vi(this) &&
        ((this.contractBonus = this.contract.bonus),
        (this.score += this.contractBonus),
        this.emit("contract", {
          name: this.contract.name,
          bonus: this.contractBonus,
        })),
      (this.status = e ? "won" : "lost"),
      (this.reason = s),
      this.emit("finish", { won: e, reason: s }));
  }
  updateAim(e) {
    const s = this.player,
      t = e.aimOffset
        ? { x: s.x + e.aimOffset.x, y: s.y + e.aimOffset.y }
        : e.aimPoint;
    ((this.aim.x =
      t && Number.isFinite(t.x) ? Ae(t.x, s.x - 160, s.x + 160) : s.x),
      (this.aim.y =
        t && Number.isFinite(t.y) ? Ae(t.y, s.y - 120, s.y + 120) : s.y),
      (this.aim.z = -240));
    const n = this.aim.x - s.x,
      o = this.aim.y - s.y,
      r = this.aim.z + 8,
      a = Math.hypot(n, o, r);
    let c = null,
      h = 1 / 0;
    for (const l of this.enemies) {
      if (l.dead || l.z >= -15 || l.z < -650) continue;
      const d = l.x - s.x,
        u = l.y - s.y,
        p = l.z + 8,
        v = Math.hypot(d, u, p),
        w = Math.acos(Ae((d * n + u * o + p * r) / (v * a), -1, 1)),
        y = w * (l.id === this.targetId ? 0.82 : 1);
      y < h && ((h = y), (c = { enemy: l, angle: w }));
    }
    ((this.targetId = c && c.angle < 0.32 ? c.enemy.id : null),
      (this.leadPoint =
        this.targetId !== null
          ? Ds({ x: s.x, y: s.y, z: -8 }, c.enemy, this.time, 450, this.speed)
          : null),
      (this.assistLocked = !!(
        e.assist !== !1 &&
        c &&
        c.angle < 0.065 &&
        c.enemy.z > -500
      )));
  }
  shoot(e = !1) {
    const s = this.player;
    if (this.bullets.length >= 92) return;
    if (e) {
      if (this.missileCooldown > 0) return;
      let n = this.enemies.find(
        (o) => o.id === this.targetId && !o.dead && o.z < -12,
      );
      if (!n)
        for (const o of this.enemies)
          !o.dead && o.z < -12 && (!n || o.z > n.z) && (n = o);
      if (!n) return;
      ((this.missileCooldown = 7),
        this.bullets.push({
          id: this.id++,
          ...it(s, 0, -1, -8),
          vx: 0,
          vy: 0,
          vz: -220,
          life: 4,
          missile: !0,
          target: n.id,
        }),
        this.shots++,
        this.emit("missile"));
      return;
    }
    if (this.cooldown > 0 || this.bullets.length > 90) return;
    ((this.cooldown = 0.13), (this.shots += 2));
    const t = this.assistLocked && this.leadPoint ? this.leadPoint : this.aim;
    for (const n of [-1, 1]) {
      const { x: o, y: r, z: a } = it(s, n * 1.6, 0, -8),
        c = t.x - o,
        h = t.y - r,
        l = t.z - a,
        d = Math.hypot(c, h, l) || 1;
      this.bullets.push({
        id: this.id++,
        x: o,
        y: r,
        z: a,
        vx: (c / d) * 450,
        vy: (h / d) * 450,
        vz: (l / d) * 450,
        life: 2.1,
      });
    }
    this.emit("shoot");
  }
  destroy(e) {
    e.dead ||
      ((e.dead = !0),
      (e.hp = 0),
      this.kills++,
      e.ace &&
        this.stage?.aces &&
        (this.stageAces = Math.min(this.stage.aces, this.stageAces + 1)),
      this.stage &&
        this.stageKills < this.stage.kills &&
        (this.stageKills++, this.objectiveKills++),
      (this.score += e.ace ? 800 : 500),
      this.emit("explosion", { x: e.x, y: e.y, z: e.z }));
  }
  checkGround(e, s) {
    if (this.mission.mode === "space") {
      this.clearance = 1e6;
      return false;
    }
    const t = this.player,
      n = Math.max(1, Math.ceil((this.distance - s) / 3));
    this.clearance = 1 / 0;
    for (let o = 1; o <= n; o++) {
      const r = o / n,
        a = e.x + (t.x - e.x) * r,
        c = e.y + (t.y - e.y) * r,
        h = s + (this.distance - s) * r;
      for (const [l, d, u] of Qi) {
        const p = it(t, l, d, u),
          v = a + p.x - t.x,
          w = c + p.y - t.y,
          y = p.z,
          m = Fe(v, y, h, this.mission.mapId),
          b = w - m;
        if (((this.clearance = Math.min(this.clearance, b)), b <= 0))
          return (
            this.crash(m > be + 0.1 ? "Terrain impact" : "Water impact"),
            !0
          );
      }
    }
    return !1;
  }
  update(e, s = {}) {
    if (
      this.status !== "playing" ||
      ((e = Ae(e, 0, 0.05)), !Number.isFinite(e) || e === 0)
    )
      return;
    ((this.time += e),
      (this.cooldown = Math.max(0, this.cooldown - e)),
      (this.missileCooldown = Math.max(0, this.missileCooldown - e)),
      (this.invincible = Math.max(0, this.invincible - e)),
      this.energy <= 1 && (this.boostLocked = !0),
      this.energy > 24 && (this.boostLocked = !1),
      (this.boosting = !!s.boost && !this.boostLocked),
      (this.energy = Ae(this.energy + (this.boosting ? -26 : 12) * e, 0, 100)));
    const t = this.player,
      n = { x: t.x, y: t.y, z: 0 },
      o = this.distance,
      r = Di(this, e, s);
    if (((this.distance += r), !this.checkGround(n, o))) {
      (this.updateAim(s),
        s.fire && this.shoot(),
        s.missile && this.shoot(!0),
        this.updateSpecial(e, r));
      for (const a of this.rings) {
        if (a.active === !1) continue;
        const c = a.z;
        if (((a.z += r), c < 0 && a.z >= 0)) {
          const h = Ae(-c / r, 0, 1),
            l = n.x + (t.x - n.x) * h,
            d = n.y + (t.y - n.y) * h;
          if (
            Math.hypot(l - a.x, d - a.y) < (this.mission.gateRadius || 12.8)
          ) {
            if (
              (this.ringsCollected++,
              this.boosting && this.boostGates++,
              this.stage && (this.stageRings++, this.objectiveRings++),
              (this.score += 250),
              (this.health = Math.min(100, this.health + 7)),
              (this.energy = Math.min(100, this.energy + 20)),
              this.emit("ring", { x: a.x, y: a.y, z: 0 }),
              this.stage && this.stageRings >= this.stage.rings)
            ) {
              this.rings.forEach((u) => (u.active = !1));
              break;
            }
          } else (this.missedGates++, this.emit("missedRing"));
        }
        a.z > 65 &&
          ((a.z =
            Math.min(...this.rings.map((h) => h.z)) -
            (this.mission.gateSpacing || 300)),
          this.placeGate(a));
      }
      if (
        ((this.spawnTimer -= e),
        this.spawnTimer <= 0 &&
          this.mission.id !== "free" &&
          ((this.spawnTimer = this.spawnInterval),
          this.enemies.length < this.enemyLimit &&
            (!this.stage ||
              this.stageKills < this.stage.kills ||
              this.stageAces < (this.stage.aces || 0))))
      ) {
        const a = Wi(this);
        (this.stageAces < (this.stage?.aces || 0) &&
          !this.enemies.some((c) => c.ace) &&
          ((a.ace = !0),
          (a.roleName = "ACE · Interceptor"),
          (a.hp = Math.ceil(a.hp * 1.35)),
          (a.maxHP = a.hp),
          (a.role = 0)),
          this.enemies.push(a));
      }
      for (const a of this.enemies) {
        if (
          ((a.previous = { x: a.x, y: a.y, z: a.z }),
          a.ai
            ? Xi(a, this, e)
            : ((a.z += (this.speed + 13) * e),
              (a.x +=
                Math.sin(this.time * (a.frequency || 1) + a.phase) *
                e *
                (a.weave || 6))),
          (a.cooldown -= e),
          a.cooldown <= 0 &&
            a.z > -300 &&
            a.z < -35 &&
            this.hostileBullets.length < 48)
        ) {
          a.cooldown =
            this.mission.fireInterval ||
            (this.mission.id === "crimson" ? 1.2 : 2.2);
          const v = Math.abs(a.z) / (190 + this.speed),
            w = this.mission.enemyAccuracy || 0,
            y = a.ai ? (this.mission.enemyAimSpread ?? 7) : 0;
          (this.hostileBullets.push({
            id: this.id++,
            x: a.x,
            y: a.y,
            z: a.z,
            vx: (t.x + t.vx * v * w - a.x + (this.random() - 0.5) * y) / v,
            vy: (t.y + t.vy * v * w - a.y + (this.random() - 0.5) * y) / v,
            vz: 190,
            life: 4,
          }),
            this.emit("enemyShoot", { x: a.x, y: a.y, z: a.z }));
        }
        const c = {
            x: a.previous.x - n.x,
            y: a.previous.y - n.y,
            z: a.previous.z,
          },
          h = { x: a.x - t.x, y: a.y - t.y, z: a.z },
          l = t.bank + (t.roll || 0),
          d = a.ai
            ? a.bank
            : Math.sin(this.time * (a.frequency || 1) + a.phase) * 0.25,
          u = 1 + Math.abs(Math.sin(l)) * 6.8 + Math.abs(Math.sin(d)) * 6.8,
          p = Math.abs(Math.cos(l)) * 6.8 + Math.abs(Math.cos(d)) * 6.8;
        if (
          Ot(c, h, { x: 3, y: 3.5, z: 15 }) ||
          Ot(c, h, { x: p, y: u, z: 4.5 }) ||
          Ot(c, h, { x: 8, y: 2, z: 9 })
        ) {
          ((a.dead = !0),
            (a.hp = 0),
            this.emit("explosion", { x: a.x, y: a.y, z: a.z }),
            (this.enemies = this.enemies.filter((v) => !v.dead)),
            this.crash("Mid-air collision"));
          return;
        }
      }
      for (const a of this.bullets) {
        if (a.life <= 0) continue;
        const c = { x: a.x, y: a.y, z: a.z };
        if (a.missile) {
          const d = this.enemies.find((u) => u.id === a.target && !u.dead);
          if (d) {
            const u = d.x - a.x,
              p = d.y - a.y,
              v = d.z - a.z,
              w = Math.hypot(u, p, v) || 1;
            ((a.vx = (u / w) * 265),
              (a.vy = (p / w) * 265),
              (a.vz = (v / w) * 265));
          }
        }
        ((a.x += a.vx * e),
          (a.y += a.vy * e),
          (a.z += a.vz * e),
          (a.life -= e));
        let h = ps(c, a, o, this.distance, this.mission.mapId),
          l = null;
        for (const d of this.enemies)
          if (!d.dead) {
            const u = d.previous || d,
              p = { x: c.x - u.x, y: c.y - u.y, z: c.z - u.z },
              v = { x: a.x - d.x, y: a.y - d.y, z: a.z - d.z },
              w = ys(p, v, a.missile ? 7 : 3.5);
            w < h && ((h = w), (l = d));
          }
        if (h <= 1)
          if (((a.life = 0), l)) {
            const d = l;
            ((d.hp = a.missile ? 0 : Math.max(0, d.hp - Ji)),
              this.hits++,
              this.emit("hit", {
                x: d.x,
                y: d.y,
                z: d.z,
                hp: d.hp,
                maxHP: d.maxHP,
              }),
              d.hp <= 0
                ? (a.missile || this.cannonKills++, this.destroy(d))
                : _i(d, this.time));
          } else
            this.emit("surfaceHit", {
              x: c.x + (a.x - c.x) * h,
              y: c.y + (a.y - c.y) * h,
              z: c.z + (a.z - c.z) * h,
            });
      }
      for (const a of this.hostileBullets) {
        if (a.life <= 0) continue;
        const c = { x: a.x, y: a.y, z: a.z };
        ((a.x += a.vx * e),
          (a.y += a.vy * e),
          (a.z += (a.vz + this.speed) * e),
          (a.life -= e));
        const h = ys(
            { x: c.x - n.x, y: c.y - n.y, z: c.z },
            { x: a.x - t.x, y: a.y - t.y, z: a.z },
            2.8,
          ),
          l = ps(c, a, o, this.distance, this.mission.mapId);
        h <= 1 && h < l
          ? (this.damage(this.mission.enemyDamage || 12), (a.life = 0))
          : l <= 1 && (a.life = 0);
      }
      ((this.enemies = this.enemies.filter(
        (a) => !a.dead && !a.escaped && a.z < 80,
      )),
        (this.bullets = this.bullets.filter(
          (a) => a.life > 0 && a.z > -1100 && a.z < 60,
        )),
        (this.hostileBullets = this.hostileBullets.filter(
          (a) => a.life > 0 && a.z < 60,
        )),
        this.checkObjectives(),
        this.mission.duration &&
          this.time >= this.mission.duration &&
          this.finish(!1, "Mission time expired"));
    }
  }
  drainEvents() {
    const e = this.events;
    return ((this.events = []), e);
  }
}
const Ve = Object.freeze([
    {
      id: "azure",
      name: "Azure Archipelago",
      region: "AZURE ARCHIPELAGO",
      tag: "Tropical coast",
      weather: "27°C · SEA BREEZE · WIND 8 KT",
      sky: 2255276,
      horizon: 13097189,
      fog: 10270925,
      water: 474201,
      sun: 16772571,
      ground: 3422768,
      density: 32e-5,
      land: [12497547, 6517573, 5593423, 9144440],
      sunDirection: [-0.45, 0.38, -0.81],
      shallow: 4368032,
      ambient: "Coastal wind",
    },
    {
      id: "glacier",
      name: "Glacier Reach",
      region: "GLACIER REACH",
      tag: "Alpine fjords",
      weather: "−12°C · HIGH CLOUD · WIND 18 KT",
      sky: 3897525,
      horizon: 13885672,
      fog: 10862031,
      water: 1260629,
      sun: 15987948,
      ground: 4344659,
      density: 38e-5,
      land: [10268340, 6778741, 11451844, 15265263],
      sunDirection: [-0.48, 0.32, -0.81],
      shallow: 5610670,
      ambient: "Alpine wind",
    },
    {
      id: "canyon",
      name: "Saffron Canyon",
      region: "SAFFRON CANYON",
      tag: "Sandstone riverlands",
      weather: "34°C · DUST HAZE · WIND 12 KT",
      sky: 4749985,
      horizon: 14009518,
      fog: 11908014,
      water: 2640722,
      sun: 16765858,
      ground: 5849909,
      density: 36e-5,
      land: [12823944, 11701086, 8543554, 13019778],
      sunDirection: [-0.4, 0.24, -0.89],
      shallow: 7181706,
      ambient: "Canyon wind",
    },
    {
      id: "caldera",
      name: "Ember Caldera",
      region: "EMBER CALDERA",
      tag: "Volcanic coast at dusk",
      weather: "19°C · ASH HAZE · WIND 16 KT",
      sky: 2505825,
      horizon: 12625568,
      fog: 9083819,
      water: 1256768,
      sun: 16758916,
      ground: 3158061,
      density: 4e-4,
      land: [6644060, 5265739, 4277064, 9266256],
      sunDirection: [-0.32, 0.15, -0.94],
      shallow: 4618879,
      ambient: "Volcanic rumble",
    },
  ]),
  Ye = (i) => Ve.find((e) => e.id === i) || Ve[0],
  ta = (i) => Ve[Math.floor((i - 1) / 5) % Ve.length];
export {
  re,
  le,
  dt,
  Pi,
  Oi,
  Fi,
  Di,
  be,
  ae,
  ee,
  ue,
  Gi,
  Ni,
  Bi,
  Os,
  ji,
  Et,
  Fs,
  Fe,
  ps,
  fs,
  Hi,
  ms,
  Ui,
  Lt,
  qi,
  et,
  Ki,
  Vi,
  Rt,
  ce,
  Yi,
  Wi,
  _i,
  Xi,
  Zi,
  Ji,
  gs,
  vs,
  as,
  Ae,
  ys,
  Ot,
  Ds,
  Qi,
  it,
  ea,
  Ve,
  Ye,
  ta,
};
