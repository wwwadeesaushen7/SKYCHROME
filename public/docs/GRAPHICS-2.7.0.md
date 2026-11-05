# SKYCHROME v2.7.0 — graphics and sound

This release rebuilds the material, lighting and sound presentation while retaining all four playable maps, campaign/ranked objectives, 21 skins, gifts, profiles, account integration, desktop/mobile controls and personal music.

## Aircraft and scenery

- **Aircraft paint:** physically based metallic/roughness shading, small panel/rivet/weathering maps and map-specific prefiltered environment reflections. High adds panel normal-map relief. The canopy has a separate clear-coat highlight. Flight and hangar share the same aircraft geometry/materials.
- **Color and light:** new theatre palettes, a clearer sky gradient, a smaller sun disc, layered distant ridges and more restrained haze. Sky, water and aircraft reflections follow the same sun direction. The green overlay over active flight is replaced with a subtle neutral edge shade.
- **Terrain:** separate packed textures for coastal grass/rock, glacier snow, canyon sediment and volcanic basalt. Height, slope and broad surface variation affect color. Cliff texture coordinates include elevation to reduce stretching. The shared terrain/collision mesh now uses 24 × 26 cells per island, with less uniform ridgelines.
- **Water:** animated packed ripple normals, viewing-angle reflections, restrained sun glints and distant haze. Contours traced from the actual land mesh create shallow-water color and moving surf. Simplifying the contours reduces their vertex count substantially.
- **Small details:** Balanced and High add bounded instanced vegetation/rocks, using the existing island positions and world scrolling. These are decorative objects; the terrain remains the collision surface.
- **Combat:** capped camera-facing fire/smoke particles expand and fade, accompanied by smaller sparks. The pool freezes during pause and clears for a new sortie.
- **HUD fix:** total mission progress follows the variable-height recon/contract text instead of overlapping it.

Textures, aircraft and sounds are original procedural assets. The terrain is not photogrammetry, and the lighting uses a small baked environment rather than real-time ray tracing. This remains an assisted arcade flight game.

## Audio

The rebuilt engine mixes combustion, faint turbine harmonics, rumble and airflow. A stereo afterburner bed follows thrust and sounds softer from the cockpit. Cannon variants add a fast pressure crack, low body and mechanical ringing; missiles, metal hits and explosions have dedicated reusable samples. Explosions retain their sound tail when the aircraft crashes. Nearby flybys pan across the listener with a bounded Doppler shift.

A single short stereo outdoor impulse supplies map-dependent early reflections; canyon effects have stronger tails than coastal effects. The existing separate lobby/match music, custom local songs, volume controls, mute and cannon mix ducking remain available. Effects use synthesis, not real aircraft recordings. See [AUDIO.md](AUDIO.md).

## Presets and cost controls

Low, Balanced and High keep their fixed 240k / 480k / 720k base pixel budgets. Manual settings never lower themselves. High has aircraft surface relief and more scenery; Low removes the decorative ground instances and projected aircraft shadow. Automatic resolution remains an explicit choice, and **Settings → Boost FPS** enables Low plus Auto.

Opaque land/aircraft draw before water and sky, allowing depth rejection to avoid shading covered pixels. Broad sky and terrain lighting are evaluated at vertices, while texture relief, ripple normals, Fresnel and specular detail remain in the fragment shaders. There are no full-screen bloom, shadow-map or live reflection-capture passes. Textures and reflection maps are cached in small, bounded sets; map replacement disposes old scenery geometry. Effects keep fixed particle and audio-voice limits.

See [PERFORMANCE-2.7.0.md](PERFORMANCE-2.7.0.md) for the measured tradeoff and device-testing limits.
