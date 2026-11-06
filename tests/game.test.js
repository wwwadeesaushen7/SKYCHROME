import test from "node:test";
import assert from "node:assert/strict";
import {
  ea as Simulation,
  as as quickMissions,
  Fe,
  ps,
} from "../src/simulation.js";
import {
  Ct as campaign,
  W as paints,
  Ge as ranks,
  os as newProfile,
  Q as validateProfile,
  ma as recordFlight,
  we as unlockedLevel,
  xe as unlockedPaint,
  Bs as rankedMission,
  Ga as ProfileStore,
} from "../src/profile.js";
import { SPACE_MISSIONS } from "../src/space.js";
import {
  AIRCRAFT,
  SPACECRAFT,
  createVehicle,
  disposeVehicle,
} from "../src/fleet.js";
import { instrumentTelemetry } from "../src/cockpit.js";
import { normalizeKeys } from "../src/controls.js";
import { enemyFiringSolution } from "../src/enemy-aim.js";
import { cannonSamples } from "../src/cannon-audio.js";
import { planetTextures } from "../src/materials.js";

const tick = (s, seconds, controls = {}) => {
  for (let i = 0; i < seconds * 60; i++) s.update(1 / 60, controls);
};
const free = () => {
  const s = new Simulation(quickMissions.find((m) => m.id === "free"));
  s.start();
  return s;
};

test("enemy lead materially reduces moving-target miss distance across campaign, rank and space", () => {
  for (const mission of [
    campaign[0],
    campaign[99],
    rankedMission(0),
    ...SPACE_MISSIONS,
  ]) {
    const enemy = { x: -18, y: 63, z: -240 };
    const player = { x: 10, y: 45, vx: 38, vy: 18 };
    const time = 240 / 280;
    const aim = enemyFiringSolution(enemy, player, mission, 90, () => 0.5);
    const miss = Math.hypot(
      enemy.x + aim.vx * time - player.x - player.vx * time,
      enemy.y + aim.vy * time - player.y - player.vy * time,
    );
    const oldMiss =
      Math.hypot(player.vx, player.vy) * time * (1 - mission.enemyAccuracy);
    assert.ok(miss < oldMiss * 0.65, `${mission.id}: ${miss} vs ${oldMiss}`);
    // A reversal after launch still defeats predictive fire; it is not homing.
    const evasiveMiss = Math.hypot(
      enemy.x + aim.vx * time - player.x + player.vx * time,
      enemy.y + aim.vy * time - player.y + player.vy * time,
    );
    assert.ok(evasiveMiss > 40);
  }
});
test("enemy aim retains bounded spread and finite close-range trajectories", () => {
  const p = { x: 0, y: 40, vx: 0, vy: 0 };
  for (let i = 0; i < 100; i++) {
    const e = { x: 20, y: 50, z: -200 };
    const shot = enemyFiringSolution(e, p, campaign[0], 90, () => i / 100);
    assert.ok(
      Math.hypot(
        e.x + (shot.vx * 200) / 280,
        e.y + (shot.vy * 200) / 280 - 40,
      ) <= 1.81,
    );
  }
  const shot = enemyFiringSolution({ x: 0, y: 40, z: 0 }, p, {}, 0, () => 0.5);
  assert.ok(Object.values(shot).every(Number.isFinite));
});
test("rotary cannon is bounded, click-free and varied at both common sample rates", () => {
  for (const rate of [44100, 48000]) {
    const variants = new Set();
    for (let v = 0; v < 4; v++) {
      const samples = cannonSamples(rate, v);
      assert.equal(samples[0], 0);
      assert.equal(Math.abs(samples.at(-1)), 0);
      let energy = 0,
        mean = 0,
        peak = 0;
      for (const s of samples) {
        assert.ok(Number.isFinite(s));
        energy += s * s;
        mean += s;
        peak = Math.max(peak, Math.abs(s));
      }
      assert.ok(peak < 0.721 && peak > 0.7);
      assert.ok(Math.abs(mean / samples.length) < 0.005);
      assert.ok(Math.sqrt(energy / samples.length) > 0.08);
      variants.add(samples[230]);
    }
    assert.equal(variants.size, 4);
  }
});
test("planet albedo, cloud, relief and roughness maps have continuous longitude seams", () => {
  const maps = planetTextures(64, 32);
  for (const tex of Object.values(maps)) {
    const { data, width, height } = tex.image;
    assert.equal(data.length, width * height * 4);
    for (let y = 0; y < height; y++)
      assert.deepEqual(
        data.slice(y * width * 4, y * width * 4 + 4),
        data.slice((y * width + width - 1) * 4, (y * width + width) * 4),
      );
    tex.dispose();
  }
});

for (const mission of campaign)
  test(`campaign ${mission.level}: all stages required, progression and replay protection`, () => {
    const s = new Simulation(mission);
    s.start();
    for (let index = 0; index < mission.stages.length; index++) {
      const stage = s.stage;
      s.stageKills = stage.kills;
      s.stageRings = stage.rings;
      s.stageScans = stage.scans || 0;
      s.stageAces = stage.aces || 0;
      s.stageRings--;
      s.checkObjectives();
      assert.equal(s.status, "playing");
      assert.equal(s.stageIndex, index);
      s.stageRings++;
      s.checkObjectives();
    }
    assert.equal(s.status, "won");
    assert.equal(s.completedStages, mission.stages.length);
    const profile = newProfile();
    for (let i = 1; i < mission.level; i++)
      profile.levels[i] = { stars: 3, score: 1000, time: 60 };
    const flight = {
      id: "test-" + mission.level,
      mode: "campaign",
      level: mission.level,
      result: "complete",
      health: 90,
      time: 40,
      score: 5000,
      kills: mission.kills,
      rings: mission.rings,
      mission: mission.name,
    };
    const result = recordFlight(profile, flight);
    assert.equal(result.profile.levels[mission.level].stars, 3);
    assert.equal(
      unlockedLevel(result.profile),
      Math.min(100, mission.level + 1),
    );
    assert.equal(recordFlight(result.profile, flight).duplicate, true);
  });

test("all existing paint rewards and rank thresholds survive source reconstruction", () => {
  assert.equal(paints.length, 21);
  assert.equal(campaign.length, 100);
  assert.equal(ranks.length, 8);
  const p = newProfile();
  assert.equal(paints.filter((s) => unlockedPaint(p, s)).length, 3);
  for (let i = 1; i <= 100; i++)
    p.levels[i] = { stars: 3, score: 100, time: 60 };
  p.peakRankPoints = 7000;
  assert.equal(paints.filter((s) => unlockedPaint(p, s)).length, 21);
});
test("ranked victory, defeat and retained peak rank", () => {
  let p = newProfile();
  p.rankPoints = p.peakRankPoints = 750;
  p = recordFlight(p, {
    id: "w",
    mode: "ranked",
    result: "complete",
    score: 15000,
  }).profile;
  assert.equal(p.rankPoints, 900);
  p = recordFlight(p, { id: "l", mode: "ranked", result: "lost" }).profile;
  assert.equal(p.rankPoints, 855);
  assert.equal(p.peakRankPoints, 900);
  for (const rank of ranks) {
    const m = rankedMission(rank.points);
    assert.ok(m.stages.length);
    assert.ok(m.kills > 0);
  }
});
test("old save schema, equipped reward, export/import and guest/account isolation", () => {
  const values = new Map(),
    storage = {
      getItem: (k) => values.get(k) || null,
      setItem: (k, v) => values.set(k, v),
    };
  const a = new ProfileStore(storage);
  let p = newProfile();
  p.name = "Original pilot";
  p.levels[1] = { stars: 2, score: 3200, time: 110 };
  p.equipped = "copper";
  a.change(p);
  const backup = a.export();
  a.switchOwner("account-user");
  assert.equal(a.profile.name, "Spectre");
  a.change({ ...a.profile, name: "Account pilot" });
  a.switchOwner("guest");
  assert.equal(a.profile.name, "Original pilot");
  assert.equal(a.profile.equipped, "copper");
  assert.equal(a.profile.levels[1].score, 3200);
  const b = new ProfileStore({ getItem: () => null, setItem: () => {} });
  b.import(backup);
  assert.deepEqual(b.profile.levels, p.levels);
  assert.equal(validateProfile(JSON.parse(backup).profile).schema, 1);
});
test("interrupted ranked sortie is recorded once", () => {
  const values = new Map(),
    storage = {
      getItem: (k) => values.get(k) || null,
      setItem: (k, v) => values.set(k, v),
    };
  const store = new ProfileStore(storage);
  store.change({ ...store.profile, rankPoints: 300, peakRankPoints: 300 });
  store.beginRanked("interrupted");
  const restored = new ProfileStore(storage);
  assert.equal(restored.profile.rankPoints, 255);
  assert.equal(restored.profile.activeRanked, null);
  assert.equal(new ProfileStore(storage).profile.rankPoints, 255);
});
test("ground collision remains fatal in atmospheric flight", () => {
  const s = free();
  s.player.y = -3;
  s.update(1 / 60, {});
  assert.equal(s.status, "lost");
  assert.match(s.reason, /impact/i);
});
test("boost, brake, pause/resume and cannon still affect simulation", () => {
  const s = free();
  tick(s, 1, { boost: true, fire: true });
  assert.ok(s.speed > 90);
  assert.ok(s.energy < 100);
  assert.ok(s.shots > 0);
  const t = s.time,
    shots = s.shots;
  s.pause();
  tick(s, 1, { fire: true });
  assert.equal(s.time, t);
  assert.equal(s.shots, shots);
  s.resume();
  tick(s, 1, { brake: true });
  assert.ok(s.flight.airbrake > 0.9);
  assert.ok(s.speed < 90);
});
test("homing missile destroys a full-health enemy through actual projectile movement", () => {
  const s = free();
  s.enemies = [
    {
      id: 99,
      x: 0,
      y: 38,
      z: -150,
      vx: 0,
      vy: 0,
      vz: 0,
      hp: 100,
      maxHP: 100,
      phase: 0,
      weave: 0,
      frequency: 0,
      cooldown: 999,
    },
  ];
  s.updateAim({});
  s.shoot(true);
  tick(s, 1.5);
  assert.equal(s.kills, 1);
  assert.equal(s.enemies.length, 0);
  assert.ok(s.missileCooldown > 0);
});
test("four terrain maps have finite surfaces and continuous collision detection", () => {
  for (const map of ["azure", "glacier", "canyon", "caldera"]) {
    assert.ok(Number.isFinite(Fe(300, -350, 0, map)));
    assert.ok(
      ps({ x: 0, y: 40, z: 0 }, { x: 0, y: -20, z: 0 }, 0, 0, map) <= 1,
    );
  }
});
for (const mission of SPACE_MISSIONS)
  test(`${mission.id}: no ground/stall, moving thrusters and objectives`, () => {
    const s = new Simulation(mission);
    s.start();
    s.player.y = -50;
    tick(s, 1, { x: 1, y: -1, brake: true });
    assert.equal(s.status, "playing");
    assert.equal(s.flight.stall, 0);
    assert.equal(s.flight.windX, 0);
    assert.ok(s.player.x > 0);
    assert.ok(s.player.y < -50);
    assert.ok(s.speed < 90);
    for (const stage of mission.stages) {
      s.stageKills = stage.kills;
      s.stageRings = stage.rings;
      s.stageScans = stage.scans || 0;
      s.stageAces = stage.aces || 0;
      s.checkObjectives();
    }
    assert.equal(s.status, "won");
    const p = recordFlight(newProfile(), {
      id: mission.id,
      mode: "space",
      result: "complete",
      score: 2000,
      mission: mission.name,
    }).profile;
    assert.equal(p.rankPoints, 0);
    assert.deepEqual(p.levels, {});
    assert.equal(p.history[0].mission, mission.name);
  });
test("cockpit instruments report real telemetry", () => {
  const s = free();
  tick(s, 0.5, { boost: true, y: 1 });
  s.health = 73;
  s.missileCooldown = 2;
  const d = instrumentTelemetry(s);
  assert.equal(d.speed, Math.round(s.speed * 3.6));
  assert.equal(d.hull, 73);
  assert.equal(d.altitude, Math.round(s.player.y + 2));
  assert.equal(d.missileReady, false);
  assert.ok(d.verticalSpeed > 0);
});
test("V camera migration resolves old bindings without duplicate keys", () => {
  const keys = normalizeKeys({ fire: "KeyV" }, 2);
  assert.equal(keys.camera, "KeyV");
  assert.notEqual(keys.fire, "KeyV");
  assert.equal(new Set(Object.values(keys)).size, Object.keys(keys).length);
  const remapped = normalizeKeys({ ...keys, camera: "KeyC" }, 3);
  assert.equal(remapped.camera, "KeyC");
});
test("five distinct vehicle meshes, independent paint materials and moving surfaces", () => {
  const signatures = new Set();
  for (const info of [...AIRCRAFT, ...SPACECRAFT]) {
    const model = createVehicle(info.id, {
      body: "#bbccdd",
      accent: "#f2a080",
    });
    assert.equal(model.userData.vehicleId, info.id);
    assert.notEqual(model.userData.metal, model.userData.accent);
    let count = 0;
    model.traverse((o) => {
      if (o.geometry) {
        for (const value of o.geometry.attributes.position.array)
          assert.ok(Number.isFinite(value));
        count += o.geometry.attributes.position.count;
      }
    });
    signatures.add(count);
    assert.ok(model.getObjectByName("airbrake"));
    assert.ok(model.getObjectByName("innerFlame"));
    disposeVehicle(model);
  }
  assert.equal(signatures.size, 5);
});
