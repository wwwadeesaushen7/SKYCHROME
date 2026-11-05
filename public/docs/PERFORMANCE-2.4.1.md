# Version 2.4.1 performance and fullscreen recovery

Measured sequentially in the same cloud environment with headless Chromium and SwiftShader **software rendering**, a 1440×1080 fullscreen viewport, and DPR 1. Each fresh-context Azure patrol holds cannon fire and missile launch, warms up for 1.8 seconds, then samples requestAnimationFrame intervals for 7 seconds. No other test browsers ran during measurement. All samples remained in playable flight without uncaught errors. This short opening patrol does not represent worst-case or whole-mission minimum FPS.

| Setting | v2.4.0 FPS | v2.4.1 FPS | Old render dimensions | New render dimensions |
| --- | ---: | ---: | --- | --- |
| Low, fixed | 42.0 | 59.8 | 692×519 | 565×424 |
| Balanced, fixed | 28.9 | 47.5 | 923×692 | 800×600 |
| High, fixed | 18.5 | 37.2 | 1264×948 | 979×734 |
| Balanced, Automatic resolution | 55.7 | 57.6 | 491×368 | 688×516 |

These preset comparisons include deliberately lower fixed pixel budgets: Low 360k → 240k, Balanced 640k → 480k, High 1.2m → 720k. Lower internal resolution trades some scenery sharpness for GPU headroom. HUD text, sights and menu controls remain at native browser resolution. Presets never silently change because FPS drops; Automatic resolution remains an explicit opt-in. **Settings → Boost FPS** selects Low plus Automatic resolution when the player requests it.

To separate code improvements from lower resolution, a second sequential run used **800×600 actual rendering pixels in both builds**, Balanced fixed, with the same warmup/sample and input. FPS improved **43.0 → 54.4** (about 26.5%). Layout time over the sample fell **72.7 → 14.7 ms**, with layout events falling **132 → 42**. Timing varies between runs; neither result is a hardware guarantee.

## Changes

- Water and sky use a compact filmic display curve instead of evaluating the full HDR/color pipeline for every background pixel. Animated ripples, glints, fog and the aircraft's original shiny materials remain.
- Projected sights and mobile aiming reuse cached viewport dimensions. Pointer movement reuses bounds updated by resize/scroll or at the start of a stick gesture.
- HUD and mobile status writes are deduplicated; target text updates at 10 Hz while sight positions and input stay responsive each frame.
- Active-flight controls use tinted backgrounds without expensive backdrop blur. Lobby and paused menu presentation remain available.
- Rendering, particles and clouds have lower fixed budgets. Existing instancing, bounded entities, fixed 60 Hz simulation, idle lobby cap and paused rendering are retained.

## Fullscreen behavior

P and the pause button preserve fullscreen. Native Escape/browser exits pause safely. Resume requests fullscreen again inside the player's click or key gesture, then resumes the existing simulation. Denied or unsupported fullscreen requests fall back to a playable window. Transition guards prevent a temporary browser focus change from immediately pausing the resumed flight.

The dedicated browser checks cover native launch; P pause/resume; three successive fullscreen exits followed by Resume; unchanged mission, health, score, progress and elapsed time; pause/settings; API rejection; missing API; lobby fullscreen → flight → exit → Resume; and the explicit FPS boost/manual High controls.

## Reproduce and limits

```bash
npm run build
npm run test:fullscreen
npm run profile
# To compare an older compatible compiled website:
node tests/performance.mjs /path/to/older/dist
```

For equal-resolution sampling, set `SKYCHROME_PROFILE_CASE` to `{"quality":"balanced","adaptive":false,"viewport":{"width":800,"height":600}}`. The profiler serves each build locally, launches Chromium at `/usr/bin/chromium`, and closes the browser/server afterward. Raw results, including render sizes, frame timing, browser CPU metrics and JS heap estimates, are in [v2.4.1-performance-results.json](v2.4.1-performance-results.json).

No physical 4 GB/8 GB PC or phone was available. GPU, browser, display resolution, hardware acceleration and thermal limits affect real performance. High remained below 40 FPS in this software-rendered sample; use Low/Boost FPS for the most headroom. Estimated JS heap excludes browser, audio, operating system and GPU memory. RAM capacity alone cannot establish a minimum frame rate.
