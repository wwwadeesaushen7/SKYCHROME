# SKYCHROME v2.9.0

Editable continuation of the v2.7.0 browser game, with three distinct aircraft,
independent paint selection, X-wing/TIE space combat, working first-person
cockpits, and upgraded graphics.

## Downloads

- [Download the ready-to-host v2.9.0 website ZIP](https://github.com/wwwadeesaushen7/SKYCHROME/raw/refs/heads/main/artifacts/SKYCHROME-v2.9.0-website.zip)
- [Download the editable v2.9.0 source ZIP](https://github.com/wwwadeesaushen7/SKYCHROME/raw/refs/heads/main/artifacts/SKYCHROME-v2.9.0-source.zip)
- [Archive SHA-256 checksums](artifacts/checksums.json)

The editable project is also available directly in this repository. The website
ZIP is ready to extract and upload to Netlify; keep the source ZIP as a separate
development backup.

## What was recovered

The supplied archives contained compiled websites only. This project was
reconstructed from the exact v2.7.0 JavaScript and assets in
`Python-skychrome-website.zip`; it is not the lost original source tree. The
existing simulation, profiles, music, account integration and UI were retained
and formatted into editable modules. Some older identifiers remain abbreviated
to reduce migration risk. The original release ZIP is kept unchanged.

## Run and build

Use Node.js 22.12+ (validated with Node.js 24) and npm:

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview -- --port 4174
```

The build produces `dist/`, a complete static website. All paths support hosting
under a subdirectory. Browser source maps are included to help future recovery.
No server database is needed for guest play.

For browser regression checks, start preview on port 4174, then run:

```sh
npx playwright install chromium
SKYCHROME_BROWSER=/path/to/chromium npm run test:browser
npm run test:services
```

On the prepared cloud machine Chromium is available at `/usr/bin/chromium`.
`SKYCHROME_TEST_URL` overrides the default test address. Screenshots and results
are written to `test-results/`. The tests use software rendering; they do not
certify performance on a physical gaming PC.

## New features

### v2.9.0 sound, aiming and materials

- **Normal jet cannon:** a dry rotary burst with rapid pressure cracks, a deeper
  body and mechanical detail replaces the harsh amplified double pop. Peak
  level and gain are reduced. This is an original synthesized sound design,
  not a field recording. The X-wing/TIE laser sound is unchanged.
- **Enemy accuracy:** enemies lead moving aircraft more accurately and fire
  with tighter circular spread. Aces are slightly more precise. Shots predict
  once when fired and do not home, so changing direction still defeats them.
  Existing damage, firing intervals, rewards and save formats are unchanged.
- **Atmosphere:** the four maps now use separate rock/ground materials with
  slope blending, small-scale relief, wet shorelines and sand. Textures project
  along all three axes on cliffs to reduce stretching. Waves deform the ocean
  surface; its shader adds moving ripples, Fresnel sky reflections and sun
  glints. A new sky shader adds atmospheric haze and thin high clouds.
- **Space:** a detailed planet has separate land/ocean roughness, relief,
  rotating clouds, night-side lights and an illuminated atmospheric rim.
  Textured rocky asteroids, faint galactic dust and lower ambient light add
  depth. Low quality reduces stars, water subdivisions and cloud layers.

### Retained from v2.8.0

- **Aircraft:** F/A–27 Spectre stealth multirole, F–19 Kestrel delta interceptor,
  and A–12 Thunderbolt ground-attack aircraft. Each has different wings, tails,
  engine layout and details. Aircraft share existing atmospheric flight balance.
- **Paint:** all 21 existing finishes and their reward requirements remain
  separate from vehicle choice. Airframe preferences are saved on the device;
  paint rewards remain in the guest/account profile.
- **Space:** a separate Space tab offers Outer Rim patrol and a two-wave
  Squadron interception. Fly an X-wing against TIE fighters or the reverse.
  Space uses assisted inertial thrusters without ground impacts or aerodynamic
  stalls. The planet, orbital station and distant asteroid belt are scenery;
  navigation remains the game's bounded forward-flight combat format.
- **Cockpits:** press **V** or use CHASE/COCKPIT to switch views. Cockpit displays
  show simulated speed, altitude/sector height, attitude, vertical speed, radar,
  hull, energy and missile readiness. V can be remapped in Controls.
- **Graphics:** denser terrain meshes, surface relief, multi-layer water
  ripples, more clouds and ground details, physically based aircraft materials,
  shadow maps, antialiasing, and higher pixel budgets. The procedural art is
  original geometry and texture work, not photographic scans.

Campaign levels, ranked progression, rewards, four atmospheric maps, player
backups, guest/account separation, music imports, mobile controls, fullscreen
recovery, and existing graphics options remain available.

## Graphics target

High targets a 16 GB RAM PC with a capable GPU and hardware-accelerated browser.
RAM alone does not determine frame rate. Low, Balanced and High use budgets of
0.48, 1.44 and 3.84 million pixels. Balanced and High enable shadow maps; High
uses a 2048px shadow map. Automatic resolution remains opt-in, and selecting a
preset restores fixed resolution. Use Low or Boost FPS on slower devices.

## Accounts and saves

The original `skychrome-player-v1:*` storage keys and schema 1 profiles are
preserved. Keep the same website origin to retain browser saves and personal
music. Export a player backup before updating an existing deployment.

Optional live accounts require the owner's Supabase setup. Preserve your public
`account-config.json` when updating. The bundled file has empty values, exactly
as supplied. See `public/docs/ACCOUNTS.md` and `public/docs/supabase.sql`.
Private credentials must never go in website files.

## Source map

| File | Purpose |
| --- | --- |
| `src/simulation.js` | Atmospheric flight, enemies, projectiles, terrain collision, objectives |
| `src/profile.js` | Campaign/rank progression, 21 finishes, schema validation, profile storage |
| `src/controls.js` | Key defaults and migration including V |
| `src/fleet.js` | Five vehicle models and separate paint materials |
| `src/space.js` | Space missions and thruster physics |
| `src/cockpit.js` | 3D cockpit frames and live instruments |
| `src/world.js` | Upgraded scenery, shadows, orbital scene and vehicle rendering |
| `src/materials.js` | Terrain/planet textures, surface relief, sky and water shaders |
| `src/cannon-audio.js` | Original rotary-cannon sample synthesis |
| `src/enemy-aim.js` | Predictive hostile fire and bounded dispersion |
| `src/game.js` | Existing UI, renderer, audio, touch, fullscreen and account integration |
| `src/vendor/` | Exact Three.js r180 and account SDK bundles from v2.7.0 |
| `tests/` | Simulation/save tests and browser regression scenarios |

## Website delivery

The website ZIP contains the contents of `dist/` with `index.html` at its root.
Extract it and upload the resulting folder to your existing Netlify site when
you choose to deploy. The source ZIP contains the editable project and lockfile;
keep it separately from the website ZIP. Both release archives are retained in
`artifacts/` on GitHub. Building or pushing this repository does not itself deploy
the game to Netlify.

Historical documents under `public/docs/` describe earlier releases and their
original reported tests. They are retained as reference, not evidence that those
old test suites were recovered or rerun. Current validation is recorded in
`VALIDATION.md`.
