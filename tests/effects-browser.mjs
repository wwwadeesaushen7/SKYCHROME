import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const browser = await chromium.launch({
  executablePath: process.env.SKYCHROME_BROWSER || "/usr/bin/chromium",
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const errors = [],
  results = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1000, height: 700 },
  });
  page.setDefaultTimeout(120000);
  page.on("pageerror", (e) => errors.push(e.stack));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.addInitScript(() =>
    localStorage.setItem(
      "skychrome-settings",
      JSON.stringify({ quality: "high", muted: true }),
    ),
  );
  await page.goto(process.env.SKYCHROME_TEST_URL || "http://127.0.0.1:4174/");
  await page.waitForFunction(
    () => window.__SKYCHROME__?.getState().render?.assets.loaded === 10,
  );
  await page.locator('[data-flight-mode="quick"]').click();
  await page.locator('[data-mission="free"]').click();
  await page.locator('[data-map="azure"]').click();
  await page.locator("#launch-button").click();
  await page.waitForFunction(() => window.__SKYCHROME__.getState().time > 0.25);
  await page.keyboard.down("s");
  await page.waitForFunction(() => {
    const s = window.__SKYCHROME__.getState();
    return (
      s.status === "lost" &&
      s.render.smokeParticles > 0 &&
      s.render.blastLight > 0
    );
  });
  await page.keyboard.up("s");
  const state = await page.evaluate(() => window.__SKYCHROME__.getState());
  assert.equal(state.render.cinematic, true);
  assert.ok(state.render.blastWaves > 0);
  await fs.mkdir("test-results", { recursive: true });
  await page.screenshot({ path: "test-results/v3.1-explosion.png" });
  await page.waitForFunction(
    () => window.__SKYCHROME__.getState().mode === "result",
  );
  await page.locator("#result-deck").click();
  await page.waitForFunction(
    () => window.__SKYCHROME__.getState().mode === "deck",
  );
  const reset = await page.evaluate(
    () => window.__SKYCHROME__.getState().render,
  );
  assert.equal(reset.smokeParticles, 0);
  assert.equal(reset.blastWaves, 0);
  assert.equal(reset.blastLight, 0);
  assert.deepEqual(errors, []);
  results.push({
    name: "High HDR explosion, pressure wave, local light and return-to-deck cleanup",
    status: "passed",
  });
  console.log("PASS", results[0].name);
} catch (e) {
  results.push({
    name: "High HDR explosion and cleanup",
    status: "failed",
    error: e.stack,
  });
  console.error(e);
  process.exitCode = 1;
} finally {
  await fs.mkdir("test-results", { recursive: true });
  await fs.writeFile(
    "test-results/effects-results.json",
    JSON.stringify(
      { results, errors, renderer: "Chromium / SwiftShader" },
      null,
      2,
    ),
  );
  await browser.close();
}
