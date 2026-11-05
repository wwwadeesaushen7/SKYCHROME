// All account-service responses below are intercepted locally. No email or real
// provider request is sent, and no live credentials are used.
import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { os as newProfile } from "../src/profile.js";
const base = process.env.SKYCHROME_TEST_URL || "http://127.0.0.1:4174/";
const browser = await chromium.launch({
  executablePath: process.env.SKYCHROME_BROWSER || "/usr/bin/chromium",
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const results = [],
  errors = [];
await fs.mkdir("test-results", { recursive: true });
const check = async (name, fn) => {
  try {
    await fn();
    results.push({ name, status: "passed" });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "failed", error: e.stack });
    throw e;
  }
};
const watch = (p) => {
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
};
async function context() {
  const c = await browser.newContext({
    viewport: { width: 1000, height: 700 },
  });
  await c.addInitScript(() => {
    if (!localStorage.getItem("skychrome-settings"))
      localStorage.setItem(
        "skychrome-settings",
        JSON.stringify({ quality: "low", muted: true }),
      );
  });
  return c;
}
try {
  const c = await context(),
    p = await c.newPage();
  watch(p);
  await p.goto(base);
  await p.waitForFunction(
    () => window.__SKYCHROME__?.getState().accountStatus === "disabled",
  );
  await check(
    "unconfigured accounts remain disabled; guest backup roundtrip works",
    async () => {
      await p.locator("#account-button").click();
      assert.equal(await p.locator("#google-login").isDisabled(), true);
      await p.locator("#pilot-name-input").fill("Recovered pilot");
      await p.locator("#pilot-name-form button").click();
      const download = p.waitForEvent("download");
      await p.locator("#export-save").click();
      const file = await download;
      const backup = JSON.parse(await fs.readFile(await file.path(), "utf8"));
      assert.equal(backup.profile.name, "Recovered pilot");
      backup.profile.name = "Backup pilot";
      await p
        .locator("#import-save")
        .setInputFiles({
          name: "backup.json",
          mimeType: "application/json",
          buffer: Buffer.from(JSON.stringify(backup)),
        });
      await p.locator("#confirm-import").click();
      assert.equal(
        await p.locator("#pilot-name").textContent(),
        "Backup pilot",
      );
      await p.locator("#close-modal").click();
    },
  );
  await check(
    "custom music persists in IndexedDB and restores built-in tracks",
    async () => {
      const wav = Buffer.alloc(44 + 16000);
      wav.write("RIFF");
      wav.writeUInt32LE(wav.length - 8, 4);
      wav.write("WAVE", 8);
      wav.write("fmt ", 12);
      wav.writeUInt32LE(16, 16);
      wav.writeUInt16LE(1, 20);
      wav.writeUInt16LE(1, 22);
      wav.writeUInt32LE(8000, 24);
      wav.writeUInt32LE(16000, 28);
      wav.writeUInt16LE(2, 32);
      wav.writeUInt16LE(16, 34);
      wav.write("data", 36);
      wav.writeUInt32LE(16000, 40);
      await p.locator("#settings-button").click();
      await p
        .locator("#lobby-music-file")
        .setInputFiles({
          name: "Test theme.wav",
          mimeType: "audio/wav",
          buffer: wav,
        });
      await p.waitForFunction(
        () => window.__SKYCHROME__.getState().audio.tracks.lobby.custom,
      );
      assert.equal(
        await p.evaluate(
          () => window.__SKYCHROME__.getState().audio.tracks.match.custom,
        ),
        false,
      );
      await p.reload();
      await p.waitForFunction(
        () => window.__SKYCHROME__?.getState().audio.tracks.lobby.custom,
      );
      assert.equal(
        await p.evaluate(
          () => window.__SKYCHROME__.getState().audio.tracks.lobby.persisted,
        ),
        true,
      );
      await p.locator("#settings-button").click();
      await p.locator("#lobby-music-reset").click();
      await p.waitForFunction(
        () => !window.__SKYCHROME__.getState().audio.tracks.lobby.custom,
      );
    },
  );
  await c.close();
  const auth = await context(),
    requests = [];
  const user = {
    id: "11111111-1111-4111-8111-111111111111",
    email: "pilot@example.invalid",
    aud: "authenticated",
    role: "authenticated",
  };
  let cloud = {
    ...newProfile(),
    name: "Cloud pilot",
    levels: { 1: { stars: 3, score: 4200, time: 90 } },
  };
  await auth.route("**/account-config.json", (r) =>
    r.fulfill({
      json: {
        supabaseUrl: "https://skychrome-test.supabase.co",
        supabasePublishableKey: "sb_publishable_test_fixture_only",
      },
    }),
  );
  await auth.route("https://skychrome-test.supabase.co/**", async (r) => {
    const req = r.request(),
      url = new URL(req.url());
    requests.push({
      path: url.pathname,
      method: req.method(),
      body: req.postDataJSON(),
    });
    const headers = {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "*",
    };
    if (req.method() === "OPTIONS") return r.fulfill({ status: 200, headers });
    if (url.pathname === "/auth/v1/user")
      return r.fulfill({ json: user, headers });
    if (url.pathname === "/rest/v1/player_saves")
      return r.fulfill({ json: { progress: cloud, revision: 7 }, headers });
    if (url.pathname === "/rest/v1/rpc/save_player_progress") {
      cloud = req.postDataJSON().payload;
      return r.fulfill({ json: 8, headers });
    }
    return r.fulfill({ json: {}, headers });
  });
  const ap = await auth.newPage();
  watch(ap);
  await ap.goto(base);
  await ap.waitForFunction(
    () => window.__SKYCHROME__?.getState().accountStatus === "guest",
  );
  await check(
    "real account SDK loads and email login submits PKCE to a simulated provider",
    async () => {
      await ap.locator("#account-button").click();
      assert.equal(await ap.locator("#google-login").isEnabled(), true);
      assert.equal(await ap.locator("#facebook-login").isEnabled(), true);
      await ap.locator("#login-email").fill("pilot@example.invalid");
      await ap.locator("#email-login button").click();
      await ap.waitForFunction(() =>
        document
          .querySelector("#account-feedback")
          ?.textContent.includes("Check your inbox"),
      );
      const req = requests.find((r) => r.path === "/auth/v1/otp");
      assert.equal(req.body.email, "pilot@example.invalid");
      assert.ok(req.body.code_challenge);
    },
  );
  await check(
    "cloud profile loads, saves with revision and restores guest on sign-out (simulated backend)",
    async () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const enc = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
      const token =
        enc({ alg: "HS256", typ: "JWT" }) +
        "." +
        enc({ sub: user.id, exp, aud: "authenticated" }) +
        ".test-signature";
      await ap.evaluate(
        ({ token, user, exp }) => {
          localStorage.setItem(
            "sb-skychrome-test-auth-token",
            JSON.stringify({
              access_token: token,
              refresh_token: "test-refresh",
              token_type: "bearer",
              expires_at: exp,
              expires_in: 3600,
              user,
            }),
          );
        },
        { token, user, exp },
      );
      await ap.reload();
      await ap.waitForFunction(
        () => window.__SKYCHROME__?.getState().accountStatus === "synced",
      );
      assert.equal(
        await ap.locator("#pilot-name").textContent(),
        "Cloud pilot",
      );
      assert.equal(
        await ap.evaluate(
          () => window.__SKYCHROME__.getState().profile.completedLevels,
        ),
        1,
      );
      await ap.locator("#account-button").click();
      await ap.locator("#pilot-name-input").fill("Synced pilot");
      await ap.locator("#pilot-name-form button").click();
      await ap.waitForFunction(
        () => window.__SKYCHROME__.getState().accountStatus === "synced",
      );
      const save = requests.find(
        (r) => r.path === "/rest/v1/rpc/save_player_progress",
      );
      assert.equal(save.body.expected_revision, 7);
      assert.equal(save.body.payload.name, "Synced pilot");
      await ap.locator("#sign-out").click();
      await ap.waitForFunction(
        () => window.__SKYCHROME__.getState().accountStatus === "guest",
      );
      assert.equal(await ap.locator("#pilot-name").textContent(), "Spectre");
    },
  );
  await check("space laser audio and separate ion-drive environment", async () => {
    await ap.locator('#close-modal').click();
    await ap.locator('#sound-button').click();
    await ap.locator('[data-flight-mode="space"]').click();
    await ap.locator('#launch-button').click();
    await ap.waitForFunction(() => window.__SKYCHROME__.getState().mode === 'playing');
    await ap.keyboard.down('Space');
    await ap.waitForFunction(() => { const s=window.__SKYCHROME__.getState(); return s.shots>0 && s.audio.weaponRms>0; });
    assert.equal(await ap.evaluate(()=>window.__SKYCHROME__.getState().audio.environment), 'Ion drive · sealed cockpit');
    await ap.keyboard.up('Space');
  });
  await auth.close();
  await check("no service integration JavaScript errors", async () =>
    assert.deepEqual(errors, []),
  );
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  await fs.writeFile(
    "test-results/services-results.json",
    JSON.stringify({ results, errors, backend: "simulated" }, null, 2),
  );
  await browser.close();
}
