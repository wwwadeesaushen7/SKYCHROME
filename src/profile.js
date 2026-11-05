// Existing v1 save schema, campaign progression and rank rewards retained.
import {
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
} from "./simulation.js";
const Ge = [
    { id: "cadet", name: "Cadet", points: 0, color: "#9aaca7" },
    { id: "bronze", name: "Bronze", points: 300, color: "#d6a17d" },
    { id: "silver", name: "Silver", points: 750, color: "#cedfe9" },
    { id: "gold", name: "Gold", points: 1400, color: "#f6cf67" },
    { id: "platinum", name: "Platinum", points: 2300, color: "#8ce7ce" },
    { id: "diamond", name: "Diamond", points: 3500, color: "#92cfff" },
    { id: "ace", name: "Ace", points: 5e3, color: "#c5a3ff" },
    { id: "legend", name: "Legend", points: 7e3, color: "#ff9fb6" },
  ],
  W = [
    { id: "arctic", name: "Arctic chrome", body: "#c8ced0", accent: "#557c8b" },
    {
      id: "graphite",
      name: "Midnight graphite",
      body: "#394b5d",
      accent: "#9dcaff",
    },
    {
      id: "copper",
      name: "Burnished copper",
      body: "#a56d4f",
      accent: "#ffe1a3",
    },
    {
      id: "lagoon",
      name: "Lagoon runner",
      body: "#239f95",
      accent: "#baffd8",
      level: 5,
    },
    {
      id: "cobalt",
      name: "Cobalt streak",
      body: "#315bbf",
      accent: "#68edff",
      level: 10,
    },
    {
      id: "ember",
      name: "Ember wing",
      body: "#c74c32",
      accent: "#ffc066",
      level: 20,
    },
    {
      id: "orchid",
      name: "Orchid pulse",
      body: "#824ab8",
      accent: "#ffa6eb",
      level: 30,
    },
    {
      id: "glacier",
      name: "Glacier glass",
      body: "#89c6d8",
      accent: "#ffffff",
      level: 40,
    },
    {
      id: "toxic",
      name: "Neon viper",
      body: "#253e2d",
      accent: "#bfff35",
      level: 50,
    },
    {
      id: "rose",
      name: "Rose titanium",
      body: "#bb6a89",
      accent: "#ffe0d3",
      level: 60,
    },
    {
      id: "inferno",
      name: "Inferno carbon",
      body: "#37232d",
      accent: "#ff6c24",
      level: 70,
    },
    {
      id: "aurora",
      name: "Aurora shift",
      body: "#396693",
      accent: "#d08eff",
      level: 80,
    },
    {
      id: "solar",
      name: "Solar flare",
      body: "#edc965",
      accent: "#ff8457",
      level: 90,
    },
    {
      id: "centurion",
      name: "Centurion chrome",
      body: "#f3e8c8",
      accent: "#ffce4f",
      level: 100,
    },
    {
      id: "bronze",
      name: "Bronze talon",
      body: "#b17a50",
      accent: "#f7d6a2",
      rank: "bronze",
    },
    {
      id: "silver",
      name: "Silver phantom",
      body: "#bccbd9",
      accent: "#c3f2ff",
      rank: "silver",
    },
    {
      id: "gold",
      name: "Golden eagle",
      body: "#d4a136",
      accent: "#fff0ab",
      rank: "gold",
    },
    {
      id: "platinum",
      name: "Platinum ghost",
      body: "#507e80",
      accent: "#90ffdc",
      rank: "platinum",
    },
    {
      id: "diamond",
      name: "Diamond edge",
      body: "#4d8cb8",
      accent: "#d6f5ff",
      rank: "diamond",
    },
    {
      id: "ace",
      name: "Ace eclipse",
      body: "#292842",
      accent: "#c39aff",
      rank: "ace",
    },
    {
      id: "legend",
      name: "Legend nova",
      body: "#702b4e",
      accent: "#ffcadf",
      rank: "legend",
    },
  ],
  Gs = [
    "First light",
    "Coastal wings",
    "Blue frontier",
    "Ember patrol",
    "Deep horizon",
    "Storm runners",
    "Nightfall squadron",
    "Skyward elite",
    "Edge of glory",
    "The final ascent",
  ],
  Ct = Array.from({ length: 100 }, (i, e) => {
    const s = e + 1,
      t = Math.floor(e / 10),
      n = e / 99,
      o = qi(s),
      r = Lt(6 + Math.floor(e * 0.38), 5 + Math.floor(e * 0.2), o, e),
      a = r.reduce((p, v) => p + v.kills, 0),
      c = r.reduce((p, v) => p + v.rings, 0),
      h = ta(s),
      l = 650 + e * 3,
      d = 8 - n * 2,
      u = 1;
    return Object.freeze({
      id: `campaign-${s}`,
      mode: "campaign",
      level: s,
      seed: 127 + s * 997,
      name: `Level ${String(s).padStart(2, "0")} · ${Gs[t]}`,
      mapId: h.id,
      region: h.region,
      type: "Campaign · Mixed objectives",
      description: `${o} ${o === 1 ? "stage" : "stages"} in ${h.name}: ${r.map((p) => p.name.toLowerCase()).join(" → ")}. Clear each stage’s combat and route goals plus any scan or marked ace. Optional contracts award bonus points.`,
      kills: a,
      rings: c,
      stages: r,
      ...Rt(a, c, l, d, o, u),
      gateSpacing: l,
      gateRadius: 12.8 - n * 3.3,
      routeSpread: 28 + n * 30,
      enemyInterval: d,
      squadSize: u,
      enemyHP: 16 + Math.floor(n * 12),
      enemyAgility: 1 + n * 0.35,
      enemyAimSpread: 9 - n * 4,
      fireInterval: 3 - n * 1.75,
      enemyDamage: 12 + Math.floor(n * 6),
      enemyAccuracy: 0.15 + n * 0.55,
      enemyWeave: 6 + n * 7,
      enemyFrequency: 1 + n * 0.5,
      difficulty: t < 3 ? "ROOKIE" : t < 7 ? "VETERAN" : "ELITE",
      palette: t % 2 ? "sunset" : "day",
    });
  }),
  De = (i) => Ge.findLast((e) => e.points <= i) || Ge[0],
  Ns = (i) => Ge.find((e) => e.points > i) || null;
function Bs(i) {
  const e = De(i),
    s = Ge.indexOf(e),
    t = 3 + Math.floor(s / 3),
    n = Lt(36 + s * 10, 24 + s * 5, t, 0),
    o = n.reduce((d, u) => d + u.kills, 0),
    r = n.reduce((d, u) => d + u.rings, 0),
    a = Ve[s % 4],
    c = 1080 + s * 20,
    h = 6.5 - s * 0.2,
    l = 1;
  return {
    id: "ranked",
    mode: "ranked",
    seed: 1709 + s * 131,
    name: `${e.name} · Ranked sortie`,
    mapId: a.id,
    region: a.region,
    type: "Ranked · Mixed AI operation",
    description: `Finish ${t} varied stages in ${a.name}: ${o} hostiles, ${r} gates and special objectives. Win for 120–150 RP; defeat or leaving costs 45 RP. Higher ranks add stronger attacks and tighter routes.`,
    kills: o,
    rings: r,
    stages: n,
    ...Rt(o, r, c, h, t, l),
    gateSpacing: c,
    gateRadius: 11 - s * 0.3,
    routeSpread: 48 + s * 2,
    enemyInterval: h,
    squadSize: l,
    enemyHP: 20 + s * 2,
    enemyAgility: 1.15 + s * 0.055,
    enemyAimSpread: 7 - s * 0.45,
    fireInterval: 1.8 - s * 0.13,
    enemyDamage: 15 + s,
    enemyAccuracy: 0.55 + s * 0.04,
    enemyWeave: 12 + s * 1.5,
    enemyFrequency: 1.3 + s * 0.08,
    difficulty: e.name.toUpperCase(),
    palette: "sunset",
  };
}
const N = (i, e = 1e9) =>
    Number.isFinite(i) ? Math.max(0, Math.min(e, Math.floor(i))) : 0,
  js = () =>
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
function os() {
  return {
    schema: 1,
    name: "Spectre",
    levels: {},
    rankPoints: 0,
    peakRankPoints: 0,
    xp: 0,
    equipped: "arctic",
    stats: { flights: 0, wins: 0, kills: 0, gates: 0, seconds: 0 },
    history: [],
    processed: [],
    activeRanked: null,
    updatedAt: new Date().toISOString(),
  };
}
function Q(i) {
  if (!i || typeof i != "object" || i.schema !== 1)
    throw new Error("This is not a supported Skychrome player save.");
  const e = os();
  e.name =
    (typeof i.name == "string" && i.name.trim().slice(0, 24)) || "Spectre";
  for (let t = 1; t <= 100; t++) {
    const n = i.levels?.[t];
    n &&
      typeof n == "object" &&
      (e.levels[t] = {
        stars: Math.max(1, N(n.stars, 3)),
        score: N(n.score),
        time: N(n.time, 3600),
      });
  }
  let s = !1;
  for (let t = 1; t <= 100; t++)
    e.levels[t] ? s && delete e.levels[t] : (s = !0);
  ((e.rankPoints = N(i.rankPoints, 1e6)),
    (e.peakRankPoints = Math.max(e.rankPoints, N(i.peakRankPoints, 1e6))),
    (e.xp = N(i.xp)));
  for (const t of Object.keys(e.stats)) e.stats[t] = N(i.stats?.[t]);
  return (
    (e.processed = Array.isArray(i.processed)
      ? i.processed
          .filter((t) => typeof t == "string" && t.length < 100)
          .slice(-512)
      : []),
    (e.history = Array.isArray(i.history)
      ? i.history
          .filter((t) => t && typeof t.mission == "string")
          .slice(0, 30)
          .map((t) => ({
            mission: t.mission.slice(0, 100),
            score: N(t.score),
            kills: N(t.kills),
            rings: N(t.rings),
            time: N(t.time, 86400),
            result: ["complete", "lost", "practice"].includes(t.result)
              ? t.result
              : "practice",
            date: Number.isFinite(Date.parse(t.date))
              ? new Date(t.date).toISOString()
              : new Date().toISOString(),
          }))
      : []),
    (e.activeRanked =
      typeof i.activeRanked == "string" && i.activeRanked.length < 100
        ? i.activeRanked
        : null),
    (e.updatedAt = Number.isFinite(Date.parse(i.updatedAt))
      ? new Date(i.updatedAt).toISOString()
      : e.updatedAt),
    (e.equipped = W.some((t) => t.id === i.equipped && xe(e, t))
      ? i.equipped
      : "arctic"),
    e
  );
}
function we(i) {
  for (let e = 1; e <= 100; e++) if (!i.levels[e]) return e;
  return 100;
}
function xe(i, e) {
  return (
    (!e.level || !!i.levels[e.level]) &&
    (!e.rank || i.peakRankPoints >= Ge.find((s) => s.id === e.rank).points)
  );
}
const fa = (i) =>
  i.level
    ? `Complete level ${i.level}`
    : i.rank
      ? `Reach ${Ge.find((e) => e.id === i.rank).name}`
      : "Starter finish";
function ma(i, e) {
  const s = Q(i);
  if (!e.id || s.processed.includes(e.id))
    return { profile: s, rewards: [], rp: 0, stars: 0, duplicate: !0 };
  const t = new Set(W.filter((a) => xe(s, a)).map((a) => a.id)),
    n = e.result === "complete";
  let o = 0,
    r = 0;
  if (
    e.mode === "campaign" &&
    n &&
    Number.isInteger(e.level) &&
    e.level >= 1 &&
    e.level <= we(s)
  ) {
    o =
      1 +
      (e.health >= 50 ? 1 : 0) +
      (e.time <= Ct[e.level - 1].duration * 0.65 ? 1 : 0);
    const a = s.levels[e.level];
    s.levels[e.level] = {
      stars: Math.max(o, a?.stars || 0),
      score: Math.max(N(e.score), a?.score || 0),
      time: a ? Math.min(N(e.time), a.time) : N(e.time),
    };
  }
  return (
    e.mode === "ranked" &&
      ((r = n
        ? 120 + Math.min(30, Math.floor(N(e.score) / 500))
        : -Math.min(45, s.rankPoints)),
      (s.rankPoints += r),
      (s.peakRankPoints = Math.max(s.peakRankPoints, s.rankPoints)),
      (s.activeRanked = null)),
    s.stats.flights++,
    (s.stats.wins += n ? 1 : 0),
    (s.stats.kills += N(e.kills)),
    (s.stats.gates += N(e.rings)),
    (s.stats.seconds += N(e.time)),
    (s.xp += Math.min(5e3, N(e.score)) + (n ? 500 : 0)),
    s.history.unshift({
      mission: String(e.mission || "Sortie").slice(0, 100),
      score: N(e.score),
      kills: N(e.kills),
      rings: N(e.rings),
      time: N(e.time),
      result: e.result,
      date: new Date().toISOString(),
    }),
    (s.history = s.history.slice(0, 30)),
    s.processed.push(e.id),
    (s.processed = s.processed.slice(-512)),
    (s.updatedAt = new Date().toISOString()),
    {
      profile: s,
      rewards: W.filter((a) => xe(s, a) && !t.has(a.id)),
      rp: r,
      stars: o,
      duplicate: !1,
    }
  );
}

export { Ge, W, Gs, Ct, De, Ns, Bs, N, js, os, Q, we, xe, fa, ma };

class Ga {
  constructor(e = globalThis.localStorage) {
    ((this.storage = e),
      (this.owner = "guest"),
      (this.dirty = !1),
      (this.onchange = () => {}),
      (this.error = ""),
      (this.profile = this.read("guest")),
      this.recoverRanked());
  }
  key(e = this.owner) {
    return `skychrome-player-v1:${e}`;
  }
  read(e) {
    try {
      const t = this.storage.getItem(this.key(e));
      if (t) return Q(JSON.parse(t));
    } catch {
      this.error =
        "Your saved profile could not be read. Import a backup to recover it.";
    }
    const s = os();
    if (e === "guest")
      try {
        const t = JSON.parse(this.storage.getItem("skychrome-records") || "[]");
        Array.isArray(t) && (s.history = t);
        const n = JSON.parse(
          this.storage.getItem("skychrome-settings") || "{}",
        );
        return (
          ["arctic", "graphite", "copper"].includes(n.finish) &&
            (s.equipped = n.finish),
          Q(s)
        );
      } catch {}
    return s;
  }
  persist() {
    try {
      return (
        this.storage.setItem(this.key(), JSON.stringify(this.profile)),
        (this.error = ""),
        !0
      );
    } catch {
      return (
        (this.error =
          "Browser storage is full or blocked. Export a backup to keep your progress."),
        !1
      );
    }
  }
  change(e) {
    ((this.profile = Q(e)),
      (this.profile.updatedAt = new Date().toISOString()),
      (this.dirty = !0),
      this.persist(),
      this.onchange());
  }
  recoverRanked() {
    this.profile.activeRanked &&
      this.record({
        id: this.profile.activeRanked,
        mode: "ranked",
        result: "lost",
        mission: "Ranked · interrupted sortie",
        score: 0,
        kills: 0,
        rings: 0,
        time: 0,
      });
  }
  switchOwner(e, s) {
    ((this.owner = e || "guest"),
      (this.profile = s ? Q(s) : this.read(this.owner)),
      (this.dirty = !1),
      this.persist(),
      this.recoverRanked(),
      this.onchange());
  }
  beginRanked(e = js()) {
    return (this.change({ ...this.profile, activeRanked: e }), e);
  }
  record(e) {
    const s = ma(this.profile, e);
    return (s.duplicate || this.change(s.profile), s);
  }
  export() {
    return JSON.stringify(
      {
        game: "SKYCHROME",
        exportedAt: new Date().toISOString(),
        profile: this.profile,
      },
      null,
      2,
    );
  }
  import(e) {
    const s = JSON.parse(e);
    if (s.game !== "SKYCHROME")
      throw new Error("Choose a Skychrome player backup.");
    this.change(Q(s.profile));
  }
}

export { Ga };
