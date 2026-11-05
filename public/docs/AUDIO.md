# Skychrome — audio and your own music

The game includes separate original instrumental music for the lobby and the match, plus procedural aircraft and combat sound effects. No music account, external stream, or plugin is required.

## Built-in audio

- **Lobby:** Blue Horizon, a calm ambient theme at 80 BPM.
- **Match:** Afterburn, a more energetic combat theme at 120 BPM.
- Both are original 48-second loops bundled with the website. They crossfade when starting or leaving a match; pausing reduces music level. Browser audio starts after your first click, tap or keypress, and hidden tabs go silent.
- Aircraft audio layers engine/exhaust noise, turbine whine, rumble and airflow. Afterburners raise engine power; first-person view softens wind. Cannons, missiles, impacts, explosions and nearby passes have separate effects, distance attenuation and stereo placement. These are synthesized effects, not recordings from real fighter aircraft.

## Cannon fire

Player cannons use three reusable, original synthesized twin-cannon bursts with a sharp muzzle crack, falling low-frequency thump, mechanical ring and short tail. Holding left mouse or Space triggers the sound for each actual cannon volley. Enemy fire has a quieter, position-aware variation. While the player fires, engine and music levels dip briefly so the cannon remains audible; the background returns smoothly after release. Master mute and sound-effects volume control all gunfire. Samples total about 107 KB at 48 kHz and reuse the existing 24-voice budget. They do not require network downloads or real aircraft recordings.

## Settings

Open **Settings**, then use **Master volume**, **Sound effects volume**, **Background music**, and **Music volume**. Master mute silences both effects and music. Turning music off keeps aircraft and weapon sounds available.

## Use music from your own files

1. Open **Settings → Your soundtrack**.
2. Under **Lobby**, choose a file for the flight deck. Under **Match**, choose another file for gameplay. You can use either or both slots.
3. Use a browser-supported audio file, such as MP3, WAV, OGG, M4A, FLAC or AAC, under **50 MB per track**. Format support depends on the browser. An unsupported/corrupt file leaves your previous selection intact.
4. The filename and save status appear under that slot. **Saved on this device** means the browser retained the file. If browser storage is blocked/full, **This session only** means it will need selecting again next time.
5. **Preview 10s** previews that slot, then returns to the current lobby/match soundtrack. Starting or leaving a flight also ends a preview. Sound/music must be enabled and their volumes above zero.
6. **Use default** removes the saved custom selection and restores the built-in theme for that slot.

Files stay inside this browser's IndexedDB. They are never uploaded to Supabase or another server and are not included in account/player backups. The choice belongs to this device and website address. Clearing site data removes it. Keep the same website address when updating and retain the original audio files if you want to move them to another device.

Custom songs are streamed through HTML audio; the game does not allocate a full decoded song buffer. Only two music players are retained, old object URLs are revoked on replacement, and short sound effects share a small noise buffer with a 24-voice limit. This keeps audio memory use bounded during long matches.

## Website updates

Keep `audio/` beside `index.html` and `assets/` in the extracted deployment folder. It contains the two MP3 themes. No Python, NumPy, FFmpeg or Node.js installation is needed to play the finished website.

Source contributors can regenerate the original music with `python scripts/create-music.py` if NumPy and FFmpeg are installed. Those are authoring tools, not runtime dependencies.

## v2.5.0 aircraft and environment mix

A shared two-second combustion/turbine buffer adds stochastic pressure, low rumble and harmonics; playback rate and filter settings follow throttle with a short spool delay. Afterburner engagement adds a pressure transient. Four theatre-specific filtered wind/rumble beds vary with time. Canyon gun tails use a longer echo; glacier reflections are shorter, and coast/caldera tails are restrained. A single filtered feedback path serves all cannon shots.

Flybys now sweep across stereo space, attenuate with distance and apply a bounded radial Doppler shift. Cockpit wind is quieter and low clearance produces a restrained repeating warning. The 24-effect-voice cap and cleanup remain active; all new buffers/filters are shared and bounded. These are original synthesized effects, not recordings of a real aircraft. Existing music, local file import, mute and volume preferences remain compatible.

## v2.7.0 combat and turbine upgrade

The continuous engine combines a combustion/turbine sample, quiet rotational harmonics and wind with a new three-second stereo afterburner layer. Boost power drives its level, rate and filtering; the cockpit softens the upper frequencies. Three reusable cannon variants mix a sharp crack, pressure pulse, low body and metallic mechanism. New reusable buffers add metallic impact ringing, missile ignition/burn and a pressure-wave explosion with a debris tail. Flybys reuse the turbine sample with moving stereo and a falling Doppler rate.

A shared 0.65-second stereo outdoor impulse adds early reflections, strongest in the canyon and lighter over open water. It serves all effects without creating a convolver for each shot. The new combat, afterburner and impulse buffers total under 2 MB of PCM at 48 kHz; existing music continues to stream separately. Transient voices retain the 24-voice cap and disconnect after playback. Pausing fades weapon effects; crashing lets the explosion finish. The master limiter, per-category volume, cannon mix ducking and local custom music all remain.

These are original synthesized effects, not real jet recordings. The upgrade aims for richer pressure, mechanical detail and spatial cues while keeping downloads and memory small.
