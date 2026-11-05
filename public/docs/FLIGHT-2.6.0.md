# SKYCHROME v2.6.0 — aerodynamic flight and scenery

The new flight model uses metres, seconds, force-based acceleration and a fixed 60 Hz simulation. It is an assisted combat game: keyboard/touch inputs still command a flight direction, and stability assistance trims ordinary flight. It is not a full six-degree-of-freedom aircraft simulator.

## Handling

- Thrust spools up, drag grows with airspeed, and afterburner accelerates the aircraft rather than setting its velocity. Momentum remains after releasing boost.
- Climbing and loaded turns spend forward energy. Descending regains it. Control authority weakens as the aircraft slows.
- Acceleration limits make changes of direction progressive. Pitch follows the flight path and angle of attack; the aircraft yaws into lateral movement.
- Q/E still roll through 360 degrees and return smoothly to level on release. Axial rolls and inverted flight lose lift. The aiming camera remains level.
- Each theatre has small, deterministic wind disturbances. Stability assistance limits drift so the sight stays usable.
- **Hold B for the airbrake**, or hold **BRAKE** on mobile. It can be rebound in All controls without overwriting older custom bindings. The visible brake extends and wind noise increases. Boost and brake may be used together, but doing so wastes boost energy.
- Prolonged braking below approximately **195 km/h** loses lift. A stall warning and tone accompany the descent. **Release BRAKE, level the wings and use BOOST** to restore airspeed. Practise with altitude to spare in Open Horizon.
- Airspace limits stop outward velocity rather than retaining momentum against an invisible boundary. Terrain and water contacts remain fatal.

## Instruments

Airspeed is now `metres/second × 3.6`, and altitude is actual height above the simulated sea. Earlier releases displayed exaggerated values (speed × 8.8 and altitude × 10). A normal cruise is approximately 324 km/h at 40 m above sea level; the corrected numbers do not mean the game suddenly runs more slowly.

The additional readout shows **G** (smoothed load), **V/S** (vertical speed in m/s) and **AGL** (minimum aircraft probe clearance above terrain/water). The airbrake, low-speed and stall warnings explain what needs attention. Ground clearance warnings are retained.

## Visual changes

- Finer shared terrain meshes, slope-aware cliff/snow colors and darkened wet shore edges. Rendering and collision queries use the same triangles.
- Animated shoreline surf strips traced from the actual terrain/water boundary. Ocean detail now scrolls at the aircraft's world speed.
- On High, small aircraft panel normal maps with precomputed surface tangents improve seam/rivet highlights without screen-wide post-processing.
- Ailerons respond to banking/roll; a physical dorsal airbrake extends when braking.
- Wing vapor follows the rotated wing tips during manoeuvres and boost, using a fixed 40-sample history. History clears on restart.
- Balanced/High include a small projected aircraft silhouette that follows the real ground/water surface. It is an inexpensive approximation, not a shadow-map pass. Low omits this effect.

The same fixed pixel budgets remain: Low 240,000, Balanced 480,000, High 720,000. Automatic resolution remains opt-in. All maps, campaign levels, ranked progression, cosmetics, accounts, saves, soundtracks, custom songs, aiming, mobile controls and fullscreen recovery remain available.

## Collision corrections

Player and enemy rounds now collide with terrain/water along their swept paths. An island can block a shot before it reaches an aircraft. When a projectile intersects multiple aircraft in one step, the closest impact wins regardless of array order. Already-spent rounds cannot hit again. Missiles still destroy a jet with one direct hit; terrain can intercept them.

Gate collection now checks the interpolated aircraft position at the exact time it crosses the gate plane, avoiding false misses while moving quickly sideways.

## Verification

`npm test` covers force/energy changes, momentum, stall/recovery, roll lift loss, varying control authority, 60/120 Hz numerical consistency, boundary behaviour, pause/reset, nearest-projectile impact, terrain occlusion and gate crossing, alongside the existing game/account tests.

`npm run test:flight` flies the game using real browser inputs through climb, brake deployment, stall, pause/fullscreen recovery, boost recovery, roll trails, key remapping and restart. `npm run test:touch` also checks the mobile brake and control bounds. Other browser suites cover complete missions, all maps, saves/unlocks, audio, combat, lobby and fullscreen. See the performance report for measured results and hardware limits.
