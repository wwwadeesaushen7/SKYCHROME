import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const base = process.env.SKYCHROME_TEST_URL || "http://127.0.0.1:4174/";
const executablePath = process.env.SKYCHROME_BROWSER || "/usr/bin/chromium";
const output = "test-results";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const results = [],
  errors = [];
const context = await browser.newContext({
  viewport: { width: 1000, height: 700 },
});
await context.addInitScript(() => {
  if (!localStorage.getItem("skychrome-settings"))
    localStorage.setItem(
      "skychrome-settings",
      JSON.stringify({ quality: "low", muted: true }),
    );
});
const page = await context.newPage();
page.setDefaultTimeout(90000);
function watch(p) {
  p.on("pageerror", (e) => errors.push(e.stack));
  p.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  p.on("response", (r) => {
    if (r.status() >= 400) errors.push(r.status() + " " + r.url());
  });
}
watch(page);
const state = () => page.evaluate(() => window.__SKYCHROME__.getState());
async function load() {
  await page.goto(base);
  await page.waitForFunction(
    () => window.__SKYCHROME__?.getState().render?.frames > 1,
  );
}
async function check(name, fn) {
  if (
    process.env.SKYCHROME_TEST_FILTER &&
    !new RegExp(process.env.SKYCHROME_TEST_FILTER).test(name)
  )
    return;
  try {
    await fn();
    results.push({ name, status: "passed" });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "failed", error: e.stack });
    console.log("FAIL", name, e.message);
    await page.screenshot({ path: output + "/failure.png" }).catch(() => {});
    throw e;
  }
}
async function launch() {
  await page.locator("#launch-button").click();
  await page.waitForFunction(() => window.__SKYCHROME__.getState().time > 0.25);
}
try {
  await load();
  await check(
    "release, lobby, guest profile and preserved reward count",
    async () => {
      const s = await state();
      assert.equal(s.version, "3.1.0");
      assert.equal(s.mode, "deck");
      assert.equal(s.profile.unlockedLevel, 1);
      assert.equal(s.profile.skins.length, 3);
      assert.equal(await page.locator("[data-flight-mode]").count(), 4);
    },
  );
  for (const vehicle of ["kestrel", "thunderbolt", "spectre"])
    await check("select and render " + vehicle, async () => {
      await page.locator("#hangar-nav").click();
      await page.locator(`[data-vehicle="${vehicle}"]`).click();
      await page.locator("#aircraft-done").click();
      await page.waitForFunction(
        (v) => window.__SKYCHROME__.getState().vehicle === v,
        vehicle,
      );
      await page.waitForTimeout(500);
      assert.equal((await state()).profile.equipped, "arctic");
      await page.screenshot({ path: `${output}/${vehicle}.png` });
    });
  await check("paint is independent of airframe and persists", async () => {
    await page.locator("#hangar-nav").click();
    await page.locator('[data-finish="graphite"]').click();
    await page.locator("#aircraft-done").click();
    await load();
    const s = await state();
    assert.equal(s.vehicle, "spectre");
    assert.equal(s.profile.equipped, "graphite");
  });
  await check("campaign launch, firing, boosting and V cockpit", async () => {
    await launch();
    assert.equal((await state()).fullscreen, true);
    await page.keyboard.down("Space");
    await page.keyboard.down("Shift");
    await page.keyboard.down("w");
    await page.waitForFunction(() => {
      const s = window.__SKYCHROME__.getState();
      return s.shots > 0 && s.speed > 95 && s.player.y > 39;
    });
    await page.keyboard.up("w");
    await page.keyboard.up("Shift");
    await page.keyboard.up("Space");
    await page.keyboard.press("v");
    await page.waitForFunction(
      () => window.__SKYCHROME__.getState().render.cockpitVisible,
    );
    const s = await state();
    assert.equal(s.cameraView, "cockpit");
    assert.equal(s.instruments.hull, Math.ceil(s.health));
    assert.ok(Math.abs(s.instruments.speed - s.speed * 3.6) < 20);
    await page.screenshot({ path: output + "/cockpit.png" });
    await page.keyboard.press("v");
    await page.waitForFunction(
      () => !window.__SKYCHROME__.getState().render.cockpitVisible,
    );
  });
  await check(
    "pause freezes simulation and fullscreen exit pauses safely",
    async () => {
      await page.keyboard.press("p");
      await page.waitForFunction(
        () => window.__SKYCHROME__.getState().mode === "paused",
      );
      const before = (await state()).time;
      await page.waitForTimeout(450);
      assert.equal((await state()).time, before);
      await page.locator("#resume-button").click();
      await page.waitForFunction(
        () => window.__SKYCHROME__.getState().mode === "playing",
      );
      await page.evaluate(() => document.exitFullscreen());
      await page.waitForFunction(
        () => window.__SKYCHROME__.getState().mode === "paused",
      );
    },
  );
  for (const map of ["azure", "glacier", "canyon", "caldera"])
    await check("render atmospheric theatre " + map, async () => {
      await load();
      await page.locator('[data-flight-mode="quick"]').click();
      await page.locator('[data-mission="free"]').click();
      await page.locator(`[data-map="${map}"]`).click();
      await launch();
      assert.equal((await state()).mapId, map);
      assert.equal((await state()).render.spaceVisible, false);
      assert.match((await state()).render.terrainShader, /triplanar/);
      assert.ok((await state()).render.waterVertices > 2000);
      assert.equal((await state()).status, "playing");
      await page.screenshot({ path: `${output}/${map}.png` });
    });
  for (const vehicle of ["xwing", "tie"])
    await check(
      "space combat, opposing fleet and cockpit: " + vehicle,
      async () => {
        await load();
        await page.locator('[data-flight-mode="space"]').click();
        await page.locator("#hangar-nav").click();
        await page.locator(`[data-vehicle="${vehicle}"]`).click();
        await page.locator("#aircraft-done").click();
        await page.screenshot({ path: `${output}/${vehicle}-hangar.png` });
        await launch();
        await page.waitForFunction(
          () => window.__SKYCHROME__.getState().enemies > 0,
        );
        let s = await state();
        assert.equal(s.operationMode, "space");
        assert.equal(s.vehicle, vehicle);
        assert.equal(s.render.spaceVisible, true);
        assert.equal(s.flight.stall, 0);
        assert.ok(
          s.render.enemyVehicles.includes(vehicle === "tie" ? "xwing" : "tie"),
        );
        await page.screenshot({ path: `${output}/${vehicle}-space.png` });
        await page.keyboard.press("v");
        await page.waitForFunction(
          () => window.__SKYCHROME__.getState().render.cockpitVisible,
        );
        s = await state();
        assert.equal(s.instruments.space, true);
        await page.screenshot({ path: `${output}/${vehicle}-cockpit.png` });
      },
    );
  await check(
    "space wave selection and return to atmospheric fleet",
    async () => {
      await load();
      await page.locator('[data-flight-mode="space"]').click();
      await page.locator('[data-space-mission="space-intercept"]').click();
      assert.equal((await state()).operation.stages, 2);
      await page.locator('[data-flight-mode="campaign"]').click();
      const s = await state();
      assert.equal(s.vehicle, "spectre");
      assert.equal(s.render.spaceVisible, false);
      assert.equal(s.profile.equipped, "graphite");
    },
  );
  await check("ranked launch retains ranked mission rules", async () => {
    await page.locator('[data-flight-mode="ranked"]').click();
    await launch();
    assert.equal((await state()).operationMode, "ranked");
    assert.equal((await state()).enemyLimit, 4);
  });
  await check(
    "high quality renders with shadows and fixed resolution",
    async () => {
      await load();
      await page.locator("#settings-button").click();
      await page.locator('[data-quality="high"]').click();
      await page.locator("#close-modal").click();
      await launch();
      await page.keyboard.press("v");
      await page.waitForFunction(
        () => window.__SKYCHROME__.getState().render.cockpitVisible,
      );
      const s = await state();
      assert.equal(s.quality, "high");
      assert.equal(s.render.shadows, true);
      assert.equal(s.adaptiveResolution, false);
      assert.equal(s.render.resolutionScale, 1);
      await page.waitForFunction(
        () => window.__SKYCHROME__.getState().render.assets.pending === 0,
      );
      const render = (await state()).render;
      assert.deepEqual(render.assets.errors, []);
      assert.equal(render.assets.loaded, 10);
      assert.equal(render.cinematic, true);
      assert.equal(render.volumetricClouds, true);
      assert.equal(render.cloudVolume, true);
      assert.equal(render.reflectedClouds, true);
      assert.equal(render.planarReflection, true);
      assert.equal(render.photographedLighting, true);
      assert.equal(render.shadowResolution, 4096);
      assert.equal(render.renderBuffer.samples, 4);
      await page.screenshot({ path: output + "/high-cockpit.png" });
    },
  );
  await check(
    "high space planet relief, separate clouds and orbital lighting",
    async () => {
      await load();
      await page.locator('[data-flight-mode="space"]').click();
      await launch();
      const s = await state();
      assert.equal(s.render.planetRelief, true);
      assert.equal(s.render.planetClouds, true);
      assert.ok(s.render.spaceAmbient < 0.2);
      assert.equal(s.render.cinematic, true);
      assert.equal(s.render.volumetricClouds, false);
      assert.equal(s.render.reflectedClouds, false);
      assert.equal(s.render.planarReflection, false);
      await page.screenshot({ path: output + "/high-space.png" });
    },
  );
  await check("high atmospheric rendering and resize", async () => {
    await load();
    await page.locator('[data-flight-mode="quick"]').click();
    await page.locator('[data-mission="free"]').click();
    await launch();
    await page.setViewportSize({ width: 1200, height: 760 });
    await page.waitForFunction(() => {
      const r = window.__SKYCHROME__.getState().render;
      return (
        r.renderBuffer.width === r.width &&
        r.renderBuffer.height === r.height &&
        r.width === 1200 &&
        r.volumetricClouds &&
        r.planarReflection
      );
    });
    await page.screenshot({ path: output + "/high-coast.png" });
    await page.setViewportSize({ width: 1000, height: 700 });
  });
  await check(
    "balanced and low presets reduce expensive atmospheric effects",
    async () => {
      for (const quality of ["balanced", "low"]) {
        await load();
        await page.locator("#settings-button").click();
        await page.locator(`[data-quality="${quality}"]`).click();
        await page.locator("#close-modal").click();
        await launch();
        const s = await state();
        assert.equal(s.quality, quality);
        assert.equal(s.render.cinematic, quality === "balanced");
        assert.equal(s.render.volumetricClouds, quality === "balanced");
        assert.equal(s.render.planarReflection, false);
        assert.equal(s.render.reflectedClouds, false);
        assert.equal(s.render.shadows, quality === "balanced");
      }
    },
  );
  await check("mobile layout, touch firing and camera button", async () => {
    // Release the desktop WebGL context before testing on the software GPU.
    await context.close();
    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
    });
    await mobile.addInitScript(() =>
      localStorage.setItem(
        "skychrome-settings",
        JSON.stringify({ quality: "low", muted: true }),
      ),
    );
    const p = await mobile.newPage();
    watch(p);
    await p.goto(base);
    await p.waitForFunction(
      () => window.__SKYCHROME__?.getState().render?.frames > 1,
    );
    assert.equal(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      true,
    );
    await p.locator("#launch-button").tap();
    await p.waitForFunction(
      () => window.__SKYCHROME__.getState().mode === "playing",
    );
    assert.equal(
      await p.evaluate(
        () => window.__SKYCHROME__.getState().touchControls.enabled,
      ),
      true,
    );
    const box = await p.locator("#touch-fire").boundingBox();
    assert.ok(box);
    const session = await mobile.newCDPSession(p);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [
        { x: box.x + box.width / 2, y: box.y + box.height / 2, id: 1 },
      ],
    });
    await p.waitForFunction(() => window.__SKYCHROME__.getState().shots > 0);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await p.locator("#touch-camera").tap();
    await p.waitForFunction(
      () => window.__SKYCHROME__.getState().render.cockpitVisible,
    );
    await p.screenshot({ path: output + "/mobile-cockpit.png" });
    await mobile.close();
  });
  await check("no JavaScript, shader or HTTP errors", async () =>
    assert.deepEqual(errors, []),
  );
} catch (e) {
  process.exitCode = 1;
} finally {
  await fs.writeFile(
    output +
      "/" +
      (process.env.SKYCHROME_TEST_REPORT || "browser-results.json"),
    JSON.stringify(
      { base, renderer: "Chromium / SwiftShader", results, errors },
      null,
      2,
    ),
  );
  await browser.close();
  console.log(
    `${results.filter((r) => r.status === "passed").length}/${results.length} browser scenarios passed`,
  );
}
