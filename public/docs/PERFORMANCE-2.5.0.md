# Version 2.5.0 graphics and performance

New aircraft and terrain detail uses small textures generated once on the device: a shared 512×512 panel/rivet/weathering map, a shared 256×256 terrain tile and six 64×64 baked reflection faces. The tiles are converted to linear light at startup and use mipmaps with bilinear filtering. This avoids expensive anisotropic/trilinear texture reads on integrated or software GPUs. Aircraft retain Phong lighting; terrain stays batched into one draw call. Reflections require no extra scene render. There are no new model/photo downloads, real-time shadows or screen-space post-processing passes.

Every map has its own CPU height field, shared by rendering and collisions. Only the selected terrain is uploaded; switching maps disposes its old geometry/material while reusing textures. The browser checks visit all maps and verify that GPU geometry counts do not accumulate.

Fixed base pixel budgets are unchanged from v2.4.1: Low 240k, Balanced 480k, High 720k. Manual presets never drop automatically. Automatic resolution is opt-in, and **Boost FPS** explicitly selects Low plus Automatic resolution. Text and HUD sights remain at the browser's native resolution. Simulation/collision checks stay at 60 Hz with the existing bounded enemy/projectile/effect limits. The blue recon beacons add one instanced draw call while active.

## Software-rendering samples

Headless Chromium with SwiftShader, fullscreen 1440×1080 viewport, DPR 1. Each case uses a fresh context, Azure quick flight, continuous cannon/missile input, 1.8 seconds of warmup and a 7-second requestAnimationFrame sample. Cases run sequentially with no other test browsers. Map samples use the same opening flight on that map. Different mission objectives mean these opening samples do not represent a complete or worst-case mission.

| Setting | Average FPS |
| --- | ---: |
| Low, fixed | 58.4 |
| Balanced, fixed | 42.9 |
| High, fixed | 32.4 |
| Balanced, Automatic resolution | 58.4 |
| Glacier / Low, fixed | 56.7 |
| Canyon / Low, fixed | 53.4 |
| Caldera / Low, fixed | 58.8 |

The complete samples, including the other maps and Automatic resolution, are in [v2.5.0-performance-results.json](v2.5.0-performance-results.json). Timing varies by run. New textures add detail and GPU work; High may be unsuitable for a slower device. Choose Low or Boost FPS for the most headroom.

No physical 4 GB/8 GB PC or phone was available. Graphics hardware, hardware acceleration, browser, thermals and display size affect actual FPS; no universal 40–60 minimum is promised. JS heap estimates exclude the browser, audio, GPU and operating system.

## Reproduce

```bash
npm run build
npm run profile
npm run test:worlds
```

The profiler accepts `SKYCHROME_PROFILE_CASE` for one JSON case or `SKYCHROME_PROFILE_CASES` for an array. Add `"mapId":"glacier"`, `"canyon"` or `"caldera"` to sample another map. It serves the production build locally and closes its browser/server afterward. Use `node tests/performance.mjs /path/to/compatible/build` for an older website.
