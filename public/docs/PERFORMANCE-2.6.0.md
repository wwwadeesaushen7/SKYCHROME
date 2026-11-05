# SKYCHROME v2.6.0 — performance and validation

## Measured opening sortie

Headless Chromium with **SwiftShader software rendering**, fullscreen at 1440 × 1080 CSS pixels and device scale 1. Each case starts a fresh browser context, launches Azure Horizon, holds cannon/missile fire, warms up for 1.8 seconds and samples the next 7 seconds. No other browser tests ran during these samples. Both versions use the same fixed pixel budgets and input sequence. The flight model and geometry have changed, so the rendered frames are not identical.

These are short averages and 95th-percentile frame times, **not minimum-FPS guarantees**. No physical 4 GB/8 GB PC, phone GPU, or integrated GPU was available. GPU speed, screen size, browser hardware acceleration, thermals and other applications matter more than RAM capacity alone.

| Preset | v2.5.0 average FPS | v2.6.0 average FPS | v2.6.0 95th-percentile frame |
| --- | ---: | ---: | ---: |
| Low (fixed) | 56.8 | 57.7 | 16.8 ms |
| Balanced (fixed) | 45.5 | 40.3 | 33.4 ms |
| High (fixed) | 31.4 | 30.9 | 50.0 ms |
| Balanced + Automatic resolution | 59.1 | 55.0 | 33.4 ms |

The extra scenery has a cost, particularly on Balanced. High remains the highest-detail preset and can fall below 40 FPS on slow/software rendering. **Settings → Boost FPS** explicitly selects Low plus Automatic resolution. Manual presets never change themselves; automatic scaling only runs when enabled by the player. The interface and sight remain at the browser's native resolution.

Additional Low samples, using the same opening mission and controls:

| Theatre | Average FPS | Final-frame draw calls |
| --- | ---: | ---: |
| Glacier | 56.7 | 24 |
| Canyon | 56.9 | 24 |
| Caldera | 57.1 | 24 |

Raw measurements, timing, heap and renderer counters: [v2.6.0-performance-results.json](v2.6.0-performance-results.json). JavaScript heap counters do not measure the browser's complete RAM/GPU footprint.

## Cost controls

- Fixed base pixel limits remain Low 240,000, Balanced 480,000 and High 720,000.
- Terrain increased moderately to 20 × 22 cells per island; collision and rendering share this mesh. A denser experimental mesh cost too much in the software renderer and is not shipped.
- Island, coast and enemy geometry remain batched. Opening flight samples use approximately 24–25 draw calls and 23,000–24,500 triangles.
- High uses a small aircraft panel normal map. Precomputed mesh tangents avoid recalculating its coordinate basis for every fragment. Low/Balanced retain the color textures and reflections with cheaper aircraft shading.
- The projected ground silhouette uses one transparent pass, and is disabled on Low. No shadow-map, reflection capture, bloom or full-screen post-processing passes were added.
- Wing trails have a fixed 40-sample history and one shared geometry. Map changes dispose the previous terrain/coast meshes; repeated transitions do not accumulate GPU geometry.
- Existing enemy/projectile/particle/voice limits, fixed-step physics, 10 Hz HUD text updates, paused rendering, 30 FPS idle hangar and streaming custom music remain.
- New textures are generated once and shared; there are no added texture downloads or runtime dependencies.

## Verification

- **102 unit/integration tests passed**, including aerodynamic energy, inertia, stall recovery, lift loss, timestep consistency, aircraft/rendered transforms, texture projection, terrain occlusion, closest projectile impacts, exact gate crossing, key migration, progression and embedded-Postgres account permissions.
- **136 browser checks passed:** combat/general UI 29; campaign/accounts 21; audio 23; touch 21; lobby 16; fullscreen 9; worlds 8; aerodynamic flight 9.
- Real keyboard/touch inputs completed campaign levels 1 and 5, including saved stars/unlocks and the level-5 gift, plus Azure's two-stage recon/ace sortie. All four maps rendered without shader errors.
- Stall/recovery, brake remapping, native fullscreen resume, ground/mutual-aircraft collisions, one-missile kills, mouse aiming, mobile braking, portrait/landscape control bounds, custom music, account isolation and save restoration passed.
- OAuth/provider responses were simulated through the real account SDK. Existing Supabase projects still require their normal live provider configuration; this release does not activate an authentication service.

Run `npm test`, `npm run build`, the `test:*` browser scripts in package.json, and `npm run profile` to repeat these checks. Run performance cases separately from other browser tests.
