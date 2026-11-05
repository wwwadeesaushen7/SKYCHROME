# SKYCHROME v2.8.0 — ready-to-host website

This folder is the compiled game. Keep `index.html`, `assets/`, `audio/`, and
`account-config.json` together. Serve over HTTP or upload the whole folder to
your existing Netlify site when ready.

New: three distinct jets with separate paint rewards, X-wing/TIE fighter space
missions, V camera switching, working 3D cockpits, upgraded terrain/water,
lighting/shadows, and a High preset aimed at 16 GB PCs with capable GPUs.

Choose **Hangar** to select an airframe and paint. Choose **Space** for orbital
combat, then choose an X-wing or TIE fighter in the hangar. Press **V** or tap
**COCKPIT** in flight. Existing campaign, ranked, maps, music, saves, mobile
controls and fullscreen remain available.

Keep the same site address to retain browser saves and imported songs. Export a
player backup before updating. Preserve your configured public
`account-config.json`; the supplied file has accounts disabled until you connect
your own Supabase project. See `docs/ACCOUNTS.md`.

Also keep the separate **SKYCHROME-v2.8.0-source.zip**: it contains the editable
project, dependencies and tests. This website includes source maps to aid future
recovery, but the source archive is the primary development backup.

Earlier release documents under `docs/` are historical. Current checks and
hardware/provider limitations are in `VALIDATION.md`.
