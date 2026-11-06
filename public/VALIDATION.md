# SKYCHROME v2.9.0 validation

Validated on 6 November 2026 using Node.js 24.22.1, Vite 7.1.12 and Chromium
with SwiftShader software rendering.

## Results

- **117 automated checks passed.** These include all 100 campaign stage
  definitions, progression/save compatibility, collision, missiles, space flight,
  cockpit telemetry and vehicle models. New checks verify reduced moving-target
  miss distance, bounded enemy dispersion, evasive reversals, cannon waveform
  bounds at 44.1/48 kHz, and continuous planet texture seams.
- **19 browser scenarios passed in one complete production run.** These cover
  all aircraft, independent skins, four terrain maps, campaign/ranked/space,
  cockpit switching, pause/fullscreen, High graphics and mobile touch controls.
  New checks cover terrain shader selection, wave geometry, planet relief,
  the separate cloud layer and orbital lighting.
- **7 service/audio scenarios passed.** Save backup roundtrips, custom music
  persistence, simulated account integration, sustained normal-jet cannon fire
  and the unchanged space laser audio were exercised in Chromium.
- No JavaScript, shader-compilation or HTTP asset errors were recorded.
- The production build succeeded. The preserved Three.js chunk still produces
  Vite's advisory about chunks exceeding 500 kB; it is not a build failure.

Current machine-readable results are in `public/docs/v2.9.0-validation.json`
(`docs/v2.9.0-validation.json` inside the website ZIP). Older reports describe
previous releases and are retained as historical records.

## Delivery

The ready-to-host ZIP contains `index.html` at its root, built assets, source
maps, music, fonts and account configuration. The separate editable-source ZIP
contains source modules, pinned dependencies, tests and the unchanged original
v2.7.0 website ZIP; it excludes installed dependencies and local build output.
Before delivery, the source archive is extracted into a separate directory,
installed from its lockfile, built and tested. ZIP integrity and SHA-256 hashes
are checked. Previous v2.8.0 archives remain available under `artifacts/`.

## Limits

- The normal cannon sound is original synthesized rotary-cannon audio, not a
  field recording. The space laser sound remains unchanged. Audio tests check
  signal generation and bounded levels, not a listener's subjective preference.
- Terrain, planet and nebula textures are procedural, not photographic scans.
  The planet, distant asteroids and station remain scenery outside the bounded
  forward-flight combat corridor. Ocean waves are visual; existing collision
  surfaces and mission routes are unchanged.
- Tests use a software GPU. High targets a 16 GB PC with a capable physical GPU;
  these checks do not certify gaming-PC frame rates.
- Live email, Google and Facebook sign-in require the owner's Supabase setup.
  The supplied public configuration is empty. Account tests intercept provider
  requests locally; live authentication delivery is not verified.

The source and release ZIPs are delivered through GitHub. No Netlify deployment
is performed by building or pushing these files.
