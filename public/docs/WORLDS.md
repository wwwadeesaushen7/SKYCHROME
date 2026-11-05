# Skychrome v2.5.0 — four theatres and varied sorties

Choose **Quick flight → Select theatre** to fly any existing quick mission on any map. Map choice saves on this device. Campaign changes theatre every five levels; ranked uses a theatre based on your current rank. Local profiles, earned skins, accounts and custom music remain compatible.

| Theatre | Landscape and atmosphere | Sound |
| --- | --- | --- |
| Azure Archipelago | Green coastal islands, tiled rock, turquoise water and tropical haze | Coastal wind, short gun tail |
| Glacier Reach | Taller ridged fjords, snow/ice colors, steel-blue water and cool light | Alpine wind and brighter reflections |
| Saffron Canyon | Flat sandstone mesas, steep walls, riverlands and dusty warm light | Lower canyon wind and longer gun echoes |
| Ember Caldera | Cratered volcanic islands, dark basalt, dusk light and ash haze | Low volcanic rumble and restrained echoes |

All four have distinct height fields. The visible triangles and aircraft collision checks use the same field, rotation and recycled positions. Gates are placed above the active map's terrain. Switching maps disposes old terrain geometry/materials and retains shared textures. Backdrop mountains remain distant scenery.

## Objectives that change how you fly

- **Patrol:** complete the stage's hostile and gate goals.
- **Terrain run:** follow lower gates while watching clearance and enemy fire. Higher levels also tighten gate radius.
- **Reconnaissance:** fly inside the blue corridor at cruise speed until the scan reaches 100%. Stay within its lateral/vertical boundary during the pass. A missed corridor is replaced; time spent elsewhere cannot complete a scan. Complete the other stage goals too.
- **Ace interception:** destroy the gold marked aircraft as well as the displayed combat/route goals. The ace maneuvers faster and has more hull. One missile impact still destroys it. If it escapes, another marked ace can arrive within the existing enemy cap.

The HUD describes the current objective and shows scan/ace progress. Every required objective must be complete before advancing or winning. The timer is a failure deadline. Early kills cannot skip later stages, and extra combat score cannot replace a scan or an ace.

## Replay contracts

Each non-practice launch offers one optional contract, which changes on consecutive replays:

| Contract | Goal | Bonus on victory |
| --- | --- | ---: |
| Clean wings | Finish with at least 75% hull | 1,000 |
| Gunslinger | Destroy at least three aircraft using cannons | 900 |
| Perfect route | Finish without missing a gate | 800 |
| Fast lane | Clear three gates while boosting | 800 |

Contracts award score that participates in the existing capped XP/score rewards. They do not block a mission win or change skin unlock conditions. A loss never pays a contract bonus; a win pays it once. Free flight has no contract.

## Graphics, audio and performance

Aircraft panels, seams, rivets and weathering use a shared 512×512 texture. A small 64-pixel-per-face baked cube adds metal/canopy reflections without rendering a second view. Terrain uses one shared 256×256 tiled texture. These are original procedural assets, not downloaded photographs. Sky/water keep their lighter shaders; no real-time shadows or full-screen post-processing are added. Manual graphics presets and pixel budgets remain fixed, with optional Automatic resolution and Boost FPS.

Audio adds a reusable turbine/combustion sample, throttle spool, boost transients, map ambience/echo, distance attenuation and moving stereo/Doppler flybys. Original lobby/match music and local file choices remain available. The sound is synthesized rather than captured from real jets. Effects still use bounded shared buffers and at most 24 voices.

Use Low or **Settings → Boost FPS** on slower devices. See the v2.5.0 section of [PERFORMANCE.md](PERFORMANCE.md) for measurements and hardware limits.
