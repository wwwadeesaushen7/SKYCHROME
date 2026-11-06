# SKYCHROME v3.0.0 validation

Validated on 6 November 2026 using Node.js 24.22.1, Vite 7.1.12 and Chromium
with SwiftShader software rendering.

## Results

- **121 automated checks passed.** These include all 100 campaign stage
  definitions, progression/save compatibility, collision, missiles, enemy lead,
  cannon waveform bounds, space flight, cockpit telemetry and vehicle models.
  New checks cover known HDR intensities, corrupt/truncated HDR input, the two
  bundled HDR captures, all ten photographic asset checksums/licenses, and
  finite scenery geometry/normals.
- **21 browser scenarios passed in a complete production run.** Aircraft and
  independent paints, all four terrain maps, campaign/ranked/space flight,
  cockpit switching, pause/fullscreen, resizing, graphics presets and mobile
  controls were exercised. High checks verify all ten assets, HDR rendering,
  4096px shadows, multisampling, volumetric clouds and water reflections; space
  disables atmospheric clouds and water reflections.
- **2 portrait follow-up checks passed** after aligning the new cockpit bezel
  with the mobile instrument panel. Touch controls remain accessible.
- **8 service/audio scenarios passed.** Guest backup roundtrips, personal music,
  simulated account integration, normal cannon fire, space laser audio and
  returning from space to atmospheric flight without reloading were exercised.
- No JavaScript, shader-compilation or HTTP asset errors were recorded in the
  successful runs. The first parallel service run timed out at browser startup;
  the complete sequential rerun passed with a 90-second test timeout.
- The production build succeeded. Vite still reports its advisory about the
  preserved Three.js chunk exceeding 500 kB.

Machine-readable results are in `public/docs/v3.0.0-validation.json`
(`docs/v3.0.0-validation.json` inside the website). Historical reports describe
previous releases and remain available separately.

## Delivery

The website ZIP contains `index.html` at its root, built assets, source maps,
photographic textures, HDR environments, credits/licenses, music, fonts and
account configuration. It is ready to extract and host as a static website.
The source ZIP contains editable modules, pinned dependencies, tests and the
unchanged original v2.7.0 website ZIP; installed dependencies and local build
output are excluded.

Before delivery, the source archive is independently extracted, installed from
its lockfile, built and tested. The rebuilt output is compared byte for byte
with the packaged website. ZIP integrity and SHA-256 hashes are checked.
Previous v2.8.0 and v2.9.0 archives remain available under `artifacts/`.

## Scope and limits

- Terrain and asteroid materials now include licensed photographic assets.
  Aircraft geometry, terrain shapes, trees, the planet, nebula and cloud density
  remain procedural. This is a Three.js/WebGL game with HDR postprocessing;
  it does not use Unreal Engine, ray tracing, Nanite or Lumen.
- Planar water reflections are High-only and update every other frame. They
  reflect scene geometry and the sky background; the separately composited
  volumetric cloud pass is not included in that reflection.
- Planet, distant asteroids and station remain scenery outside the bounded
  forward-flight combat corridor. Ocean waves are visual; collision surfaces
  and mission routes retain their existing behavior.
- Tests use a software GPU. No gaming-PC frame-rate guarantee is made. Low,
  Balanced and High remain available; the extra HDR render passes are bypassed
  when floating-point render targets are unsupported.
- The normal cannon is synthesized audio; space laser audio is unchanged.
  Signal tests verify generation and levels, not subjective sound quality.
- Live email, Google and Facebook sign-in require the owner's Supabase setup.
  The supplied public configuration remains empty. Account tests intercept
  provider requests locally; live authentication delivery is not verified.

The source and release ZIPs are delivered through GitHub. No Netlify deployment
is performed as part of this update.
