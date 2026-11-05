Latest release measurements: [v2.7.0 graphics and performance](PERFORMANCE-2.7.0.md). The comparisons below describe earlier releases.

# Version 1.1 performance comparison

Measured in the same cloud environment using Chromium with SwiftShader software rendering, a 1440×1080 CSS viewport, and device pixel ratio 1. The old deployed build and the revised production build were served as static files sequentially. Each scenario uses a fresh browser context, a 1-second gameplay warmup, and a 5-second requestAnimationFrame sample. No other test browsers were running during measurement. Both builds use their normal adaptive graphics behavior.

| Scenario | Preset | Before FPS | After FPS | Ratio | Final draw calls | Final render buffer |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Free flight | Low | 12.1 | 57.6 | 4.8× | 53 → 18 | 894×546 → 660×403 |
| Free flight | Balanced | 12.3 | 50.5 | 4.1× | 62 → 18 | 894×546 → 752×459 |
| Combat (cannon + missiles held) | Balanced | 9.8 | 51.7 | 5.3× | 93 → 19 | 894×586 → 628×412 |

These are end-to-end observations, not a guarantee for an 8 GB PC or a controlled equal-resolution GPU benchmark. The improvements include the intended reduction of internal render resolution as well as lighter shaders, merged terrain, instanced entities, and fewer triangles. UI text and aiming overlays keep native browser resolution. Cold shader compilation and other machine workloads can affect short samples. Raw results include frame intervals, draw calls, geometry counts, render dimensions, and heap estimates in `performance-results.json`.

The combat scenario continuously fires cannons and requests guided missiles while enemies spawn. Final draw calls are a single frame observation, not the peak over the sample. Functional browser tests separately check live kills, bounded rendering work, mouse sight alignment, touch controls, fatal surface impact, and a mutual aircraft collision.

## Reproduce

```bash
npm run build
npm run benchmark
```

The benchmark starts and stops a local static server. It defaults to `/usr/bin/chromium`; set `CHROMIUM_PATH` for a different executable. `node tests/benchmark.mjs /path/to/another/build` benchmarks another built website with the same game UI and read-only diagnostics. The original build used for this comparison is retained locally at `/tmp/skychrome-before/` for this workspace session.

A physical 4 GB or 8 GB Windows PC was not available in this environment. If a browser uses software rendering despite having a GPU, the settings dialog identifies that condition; enabling browser hardware acceleration can improve results further.

## Version 2.0 fullscreen check

After adding the 100-level campaign, ranks, rewards, and profiles, the same software-rendering environment was sampled again in **fullscreen** at 1440×1080. Automatic resolution was explicitly enabled for this benchmark. The production default remains fixed resolution; these figures do not describe fixed High performance.

| Scenario | Preset | Sample FPS | Final draw calls | Estimated JS heap |
| --- | --- | ---: | ---: | ---: |
| Free flight | Low | 56.8 | 18 | 11 MB |
| Free flight | Balanced | 50.1 | 18 | 9 MB |
| Combat | Balanced | 50.7 | 20 | 10 MB |

The sample uses a different aspect ratio from the earlier embedded stage, so it is not an equal-resolution comparison. The heap estimate excludes browser, GPU, and operating-system memory. No physical 4 GB or 8 GB PC was tested. New features keep the same render budgets and do not download additional models or skin textures. The account SDK is a separate lazy-loaded chunk and is not requested when accounts are unconfigured. Raw results: `v2-performance-results.json`.
