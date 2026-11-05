# SKYCHROME v2.8.0 validation

Validated on 5 November 2026 using Node.js 24.22.1, Vite 7.1.12 and
Chromium with SwiftShader software rendering.

## Results

- Production build completed. Vite reports an advisory about the preserved
  Three.js chunk exceeding 500 kB; there are no build errors.
- **113 automated simulation, progression, save and model checks passed.**
  These cover all 100 campaign stage definitions, reward/rank rules, profile
  compatibility, collision, cannon/missile damage, both space missions,
  cockpit telemetry, key migration and five distinct vehicle meshes.
- **18 browser scenarios passed across the production runs and targeted
  reruns.** Coverage includes three aircraft, independent paint persistence,
  campaign/ranked launch, pause/fullscreen, all four terrain maps, X-wing and
  TIE combat/cockpits, return from space to atmospheric flight, High graphics
  with shadows, and mobile touch firing/camera switching.
- **6 service/audio scenarios passed.** These cover save backup import/export,
  custom music persistence, account SDK initialization, email login request
  construction, cloud profile revision handling, guest restoration on sign-out,
  and space laser/ion-drive audio. Account requests used a simulated backend.
- The final browser/service runs reported no JavaScript, shader or HTTP errors.

The first production browser run hit a mobile navigation timeout while another
software-rendered context was still open. The test now closes that context
before starting mobile checks. Mobile testing also found a hidden camera button;
a dedicated touch VIEW button was added. Mobile and affected rendering/audio
scenarios passed after these fixes. Counts above include each scenario once;
they are not the sum of duplicate reruns.

The consolidated scenario report is in `public/docs/v2.8.0-validation.json`
(or `docs/v2.8.0-validation.json` in the website ZIP). Historical reports for
earlier releases were supplied with the old website and are not current test
evidence.

## Delivery checks

Both archives are checked for ZIP integrity. The website has `index.html` at
its root, all generated assets, source maps, audio, fonts, account configuration
and documentation. The source archive contains the editable modules, tests,
lockfile and unchanged original v2.7.0 ZIP. It excludes installed dependencies,
build output, local screenshots and Git metadata.

The source archive is independently extracted, installed from the pinned
lockfile, built and tested before delivery. `artifacts/checksums.json` records
the SHA-256 and size of each final download.

## Practical limits

- Software rendering confirms behavior and shader compatibility. It does not
  measure frame rates on a physical 16 GB PC or certify a particular GPU.
- Live email, Google and Facebook authentication require the owner's Supabase
  configuration. The supplied configuration is empty, so guest play is enabled
  and live sign-in remains unverified. Account integration tests intercept all
  provider requests locally.
- Space combat uses the existing bounded forward-flight mission format with
  inertial thrusters. The distant planet, station and asteroid belt are scenery.
- New models and textures are procedural. Cockpit instruments display game
  telemetry; this is not a full aircraft systems simulator.

No GitHub push or Netlify deployment was performed. Keep the source archive
alongside the ready-to-host website archive for future development.
