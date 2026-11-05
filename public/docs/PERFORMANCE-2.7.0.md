# SKYCHROME v2.7.0 — performance and validation

## Same-environment comparison

Headless Chromium uses **SwiftShader software rendering**, fullscreen at 1440 × 1080 CSS pixels and DPR 1. Each fresh context launches Azure Horizon, holds cannon/missile fire, warms up for 1.8 seconds and samples the following 7 seconds. No other test browser runs during profiling. The baseline is the saved published v2.6.0 build, measured again in this environment. Both builds use the same fixed pixel budgets and inputs; the scenery, materials and shaders differ.

| Preset | v2.6.0 average FPS | v2.7.0 average FPS | v2.7.0 95th-percentile frame | Final render buffer |
| --- | ---: | ---: | ---: | --- |
| Low, fixed | 55.9 | 48.4 | 33.4 ms | 565 × 424 |
| Balanced, fixed | 38.8 | 38.4 | 33.4 ms | 800 × 600 |
| High, fixed | 31.5 | 29.9 | 50.0 ms | 979 × 734 |
| Balanced + Automatic resolution | 56.2 | 58.9 | 16.8 ms | 495 × 371 |

The richer materials and scenery have a measurable cost. Fixed Balanced/High can remain below 40 FPS on software rendering. Auto trades sharpness for frame rate; its result is **not an equal-resolution comparison**. The interface and aiming overlays remain at native browser resolution. Manual presets never change themselves. **Settings → Boost FPS** explicitly selects Low plus Auto for more headroom.

These are short opening-sortie averages, not minimum-FPS guarantees or physical-PC benchmarks. RAM capacity alone does not determine frame rate. No physical 4 GB/8 GB PC, phone GPU or integrated GPU was available; graphics hardware, hardware acceleration, thermals, screen size and other applications affect the result.

Additional Low samples use the same opening mission and inputs:

| Map | Average FPS | Final-frame draw calls |
| --- | ---: | ---: |
| Glacier | 57.1 | 23 |
| Canyon | 55.8 | 23 |
| Caldera | 55.3 | 23 |

Raw before/after timings, renderer counters, render dimensions and JavaScript heap samples: [v2.7.0-performance-results.json](v2.7.0-performance-results.json). Heap counters exclude much of the browser, native audio and GPU memory.

## Rendering and memory limits

- Fixed pixel budgets remain 240k / 480k / 720k for Low / Balanced / High. Auto is off by default and must be enabled by the player.
- The player airframe uses physically based shading and a small prefiltered environment; High adds the existing panel normal map. The canopy has clear-coat highlights. Enemy aircraft remain instanced with cheaper lighting.
- Terrain and collision share a 24 × 26 height grid per island. Broad terrain lighting/fog and sky gradients run at vertices; packed texture relief, water ripple normals, Fresnel and sunlight detail run per fragment. Opaque scenery writes depth before water and sky to reduce hidden-pixel shading.
- Four 256² terrain maps, one 128² ripple map and one 256 × 128 cloud map use less than 1.3 MiB before mipmaps. There are no new texture/model downloads. Reflections are generated once per palette and reused; switching maps does not grow the geometry count. High used 11 textures initially and 17 after visiting all four maps; the extra Azure sunset palette stays within an 18-texture limit.
- The traced Azure shoreline uses roughly 3,046 vertices, down from 14,262 in v2.6.0, through contour welding/simplification. There are no shadow-map, live reflection-capture or full-screen post-processing passes.
- Ground-detail instance limits are 0 / 96 / 128. Smoke/fire pools cap at 24 / 48 / 72, alongside the existing bounded spark pools and 40-sample wing trails. Smoke freezes on pause and releases after a crash.
- New shared combat/afterburner/outdoor-impulse buffers total under 2 MB of PCM at 48 kHz. One convolver serves all transients. The 24-voice cap, streaming music, 10 Hz HUD, fixed-step physics and 30 FPS idle hangar remain.

## Verification

- **108 unit/integration tests passed**, including safe routes across 100 levels, exact terrain/collision correspondence, aerodynamic behavior, weapon/collision rules, progression, account permissions, packed-texture budgets, shoreline geometry, smoke cleanup and finite/bounded audio buffers.
- **146 browser checks passed:** general combat/UI 29; progression/accounts 21; audio/music 23; touch 21; lobby 16; fullscreen 9; worlds/objectives 8; aerodynamic flight 9; new art/audio/layout checks 10.
- Every map rendered at High without shader errors; repeated map changes reused resources. Actual keyboard flight completed campaign levels 1 and 5 plus the two-stage recon/ace sortie. Ground/aircraft collisions, one-missile kills, stall recovery, aiming, fullscreen resume, fixed High selection, skin gifts, saves, music import and mobile controls passed.
- New tests check actual afterburner output, crash smoke and explosion tails, voice/particle cleanup, retry, and non-overlapping mission text, gauges and messages on desktop, portrait, 320 px phones and landscape.
- Account tests exercise the real Supabase SDK with simulated provider responses and embedded PostgreSQL access-rule tests. Live login providers still need the project's activation/configuration described in [ACCOUNTS.md](ACCOUNTS.md).

Run `npm test`, `npm run build`, the `test:*` scripts in package.json and `npm run profile` to reproduce. Run performance separately from other browser tests.
