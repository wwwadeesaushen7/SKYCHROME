# Skychrome v2.5.0 — shorter early levels and varied objectives

Existing campaign completions, earned gifts, RP and player profiles remain compatible. Levels are still sequential: all 100 are playable, and completing a level unlocks the next.

## Campaign pacing

| Levels | Stages |
| --- | ---: |
| 1–5 | 1 |
| 6–20 | 2 |
| 21–50 | 3 |
| 51–80 | 4 |
| 81–100 | 5 |

Each operation mixes patrol, lower terrain routes, timed reconnaissance or marked-ace interception. All displayed combat and gate goals still matter; a recon/ace objective adds a requirement to that particular stage. Enemy hull, maneuvering, fire frequency/damage/aim and route spread grow with level, while gate radius tightens. Different stage types change the objective mix, so total kills need not rise on every single adjacent level.

Campaign cycles four theatres every five levels. Active aircraft remain capped at three, arriving one at a time 6–8 seconds apart. Reinforcements stop when both the stage's combat and ace goals are met, and resume in the next stage. Projectiles, particles and pixel budgets remain bounded.

| Operation | Stages | Hostiles | Gates | Cruise estimate | Deadline |
| --- | ---: | ---: | ---: | --- | --- |
| Level 1 | 1 | 6 | 5 | ~1 min | 3 min |
| Level 5 | 1 | 7 | 5 | ~2 min | 5 min |
| Level 6 | 2 | 6 | 6 | ~2 min | 5 min |
| Level 20 | 2 | 13 | 8 | ~2 min | 5 min |
| Level 21 | 3 | 11 | 9 | ~2 min | 5 min |
| Level 50 | 3 | 20 | 14 | ~3 min | 6 min |
| Level 51 | 4 | 22 | 15 | ~4 min | 8 min |
| Level 80 | 4 | 32 | 20 | ~4 min | 8 min |
| Level 81 | 5 | 33 | 21 | ~5 min | 9 min |
| Level 100 | 5 | 39 | 24 | ~5 min | 9 min |

Cruise estimates describe route/combat budgets, not a forced survival timer. Scanning, missed gates/corridors, detours and skill change actual duration. Finish the objectives to win immediately; exceeding the deadline fails the mission.

## How the objectives work

- **Patrol:** clear the stage's hostile and gate counts.
- **Terrain run:** follow a lower route while watching ground clearance and enemy fire.
- **Recon:** hold inside the blue corridor at cruise speed until the scan reaches 100%. Waiting elsewhere does not count. Missed passes are replaced. Complete that stage's remaining combat and gate goals too.
- **Ace interception:** destroy the gold marked aircraft, plus the stage's other objectives. The ace has stronger hull and faster maneuvering. One missile impact still downs it. If it escapes, a replacement can arrive.
- **Optional contract:** each non-free-flight launch offers a hull, cannon, perfect-route or boost challenge for 800–1,000 bonus score on victory. Replays choose a different contract. Bonuses use the existing score/XP caps and never block the required mission objectives.

The fullscreen HUD describes the current objective, scan/ace progress and optional contract. Extra early kills cannot satisfy later stages. Missing a gate recycles a replacement rather than failing the whole mission. Pause/Resume preserves the flight and restores fullscreen after a native exit.

## Ranked

Ranked remains a solo AI ladder, with 3–5 varied stages. Higher ranks increase targets, routes, attack strength and precision demands. Theatre changes by rank; at most four enemies are active, arriving singly 5.1–6.5 seconds apart.

| Rank | Stages | Hostiles | Gates | Cruise estimate | Deadline |
| --- | ---: | ---: | ---: | --- | --- |
| Cadet | 3 | 30 | 24 | ~6 min | 11 min |
| Bronze | 3 | 39 | 29 | ~7 min | 12 min |
| Silver | 3 | 47 | 34 | ~8 min | 14 min |
| Gold | 4 | 58 | 39 | ~9 min | 15 min |
| Platinum | 4 | 67 | 44 | ~10 min | 17 min |
| Diamond | 4 | 76 | 49 | ~12 min | 20 min |
| Ace | 5 | 87 | 54 | ~13 min | 21 min |
| Legend | 5 | 96 | 59 | ~14 min | 23 min |

Wins award 120–150 RP. Defeats, quits and interrupted ranked flights cost up to 45 RP. Earned rank skins remain unlocked after demotion. This is not online PvP.

## Quick flight and controls

Quick flight retains Azure Horizon (two recon/interception stages), Crimson Skies (three patrol/terrain/recon stages), and unlimited peaceful Open Horizon. Every quick mission supports all four maps via **Select theatre**. See [WORLDS.md](WORLDS.md) for map and texture details.

WASD/arrows steer; mouse aims; left click/Space fires; Shift boosts; Q/E rolls; F launches a missile; P/Escape pauses. Release Q/E to recover to level. Customized keys remain available in Controls. Mobile retains independent flight/aim sticks, target tracking and separate fire/boost/missile/roll buttons. Ground contact crashes your jet; aircraft collisions destroy both aircraft.
