# SKYCHROME v3.1.0 validation

Validated on 10 November 2026 using Node.js 24.22.1, Vite 7.1.12 and Chromium
with SwiftShader software rendering.

## Results

- **125 automated checks passed.** Coverage includes all 100 campaign stage
  definitions, save/progression compatibility, collision, missiles, enemy lead,
  audio waveform bounds, space flight, cockpit telemetry and vehicle models.
  New checks compare terrain collision samples with the rendered triangle grid,
  verify the central cruise route and world wrapping, check periodic 3D cloud
  data and aircraft normal maps, and exercise explosion budgets, pausing,
  space gas behavior, expiry and light cleanup.
- **21 browser scenarios passed in a complete production run.** These cover
  aircraft and independent paints, all four terrain maps, campaign/ranked/space,
  cockpit switching, pause/fullscreen, resizing, every graphics preset and
  mobile touch controls. High checks include 3D cloud textures and reflected
  clouds; space and lower presets disable water reflection effects correctly.
- **8 service/audio scenarios passed.** Guest backups, personal music,
  simulated account syncing, normal cannon fire, space laser audio and returning
  from space to atmosphere without reloading were exercised.
- **1 additional High graphics scenario passed.** An actual player crash
  produced HDR fire/smoke, a pressure wave and local lighting. Returning to the
  deck cleared every effect and reset the light. A screenshot was inspected.
- No JavaScript, shader-compilation or HTTP asset errors were recorded in the
  browser regression run. The effects and service runs also reported no errors.
- A final High graphics check inspected the low-sun caldera in chase and
  cockpit views. Contact shading is limited to nearby surfaces to avoid distant
  depth banding; the check recorded no shader or asset errors.
- The production build succeeded. Vite retains its advisory about the preserved
  Three.js chunk exceeding 500 kB.

Machine-readable results are in `public/docs/v3.1.0-validation.json`
(`docs/v3.1.0-validation.json` inside the website). Earlier reports remain as
historical records.

## Delivery

The website ZIP contains `index.html` at its root, built assets, source maps,
photographic textures, HDR environments, credits/licenses, music, fonts and
account configuration. It is ready to extract and host as a static website.
The source ZIP contains editable modules, pinned dependencies, tests and the
unchanged original v2.7.0 website ZIP; installed dependencies and build output
are excluded.

Before delivery, the source archive is independently extracted, installed from
its lockfile, built and tested. The output is compared byte for byte with the
website archive. ZIP integrity and SHA-256 hashes are checked. Previous release
archives remain available under `artifacts/`.

## Scope and limits

- Terrain and asteroid materials include licensed photographic assets.
  Aircraft geometry/finish maps, terrain shapes, trees, planet and cloud density
  remain procedural. This is a Three.js/WebGL game with HDR postprocessing;
  it does not use Unreal Engine, ray tracing, Nanite or Lumen.
- High planar water reflections update every other frame and now include a
  lower-resolution pass of the volumetric clouds. The sun shadow map is reused
  between reflected and main views. Reflections remain an approximation over
  the visually displaced ocean surface.
- Terrain shapes and their collision surfaces changed together; the central
  cruise route remains open. Ocean waves remain visual. The planet, distant
  asteroids and orbital station remain scenery outside the forward-flight
  combat corridor. Explosions are bounded particle effects, not fluid physics.
- Tests use a software GPU. Physical gaming-PC frame rates have not been
  measured. Low, Balanced and High remain available, with HDR passes bypassed
  when floating-point render targets are unsupported.
- Normal cannon sound remains synthesized; space laser audio is unchanged.
  Tests verify signal generation and levels, not subjective sound quality.
- Live email, Google and Facebook sign-in require the owner's Supabase setup.
  The supplied public configuration remains empty. Account tests simulate
  provider responses; live authentication delivery is not verified.

The source and release ZIPs are delivered through GitHub. No Netlify deployment
is performed as part of this update.
