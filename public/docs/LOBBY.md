# Skychrome v2.4.0 — game hangar lobby

The lobby is a viewport-filling game menu with an actual 3D aircraft hangar. It replaces the previous website-style dashboard while retaining the complete game and player features.

## Your aircraft

The center of the hangar shows the currently equipped F/A–27 Spectre and its skin. Drag the aircraft background horizontally with a mouse or finger to inspect it; use the reset icon beside the aircraft label to restore the view. Inspection never steers, fires or advances a mission. The landing gear, platform, floor markings, lights and hangar structure belong to the showroom only.

Choose **HANGAR**, the skin-count tile or **Customize** to browse all 21 aircraft finishes. Locked finishes keep their existing level/rank requirements. Equipping a skin updates the showroom immediately and preserves the existing save behavior.

## All existing feature routes

| Feature | Lobby access |
| --- | --- |
| Campaign, Ranked, Quick flight | Mode buttons in the deployment panel |
| 100-level map and locked/unlocked levels | Campaign count tile or View all levels |
| Eight-rank ladder and rewards | Rank tile or ranked-mode Rank rewards |
| Azure, Crimson, peaceful free flight | Quick flight, then choose an operation |
| Current aircraft and all 21 skins | HANGAR, skin-count tile, or Customize |
| Player profile and callsign | Player tile or P1 avatar |
| Email/Gmail, Google, Facebook | Player account, after owner activation |
| Guest/account saves, sync/conflicts, backup import/export | Player account |
| Flight history | MISSION LOG |
| Personal best | PERSONAL BEST tile |
| Keyboard bindings or mobile control preferences | CONTROLS tile |
| Graphics presets and optional automatic resolution | GRAPHICS tile or settings icon |
| Master/effects/music volume and custom lobby/match songs | Settings icon |
| Flight manual | GUIDE |
| Mute/unmute | Sound icon |
| Native lobby fullscreen | Fullscreen icon |
| Start the chosen operation | PLAY |

PLAY continues to request fullscreen gameplay with a fallback where unsupported. Launching from native lobby fullscreen also fills the available flight area. Returning from a flight restores the hangar and its menus. Pauses, mission results, real objectives, levels, ranks, gifts, collisions, weapons and cursor behavior keep their previous rules.

## Mobile layout

Portrait phones place the jet above a compact deployment panel. Landscape phones use a side panel. The Play button stays separate from the internally scrolling briefing, so longer mission descriptions never push it off-screen. Profile, rank, campaign, skins, settings, sound, account, guide and log controls remain reachable on small screens. The existing touch flight controller starts when the match begins; lobby inspection uses its own pointer handling.

## Performance and preserved data

The showroom uses the existing WebGL renderer and context. Its aircraft clone shares geometry and materials with the flight aircraft. Static hangar pieces are batched by material, and the floor uses simple painted shadow shapes rather than rendered shadow maps or reflections. Typical lobby frames use 18 draw calls and about 3,600 triangles. Pixel limits and selected graphics presets remain the same; the idle menu retains its 30 FPS cap, with fresh renders during inspection. Reduced motion disables the subtle idle aircraft movement.

No additional texture downloads, model downloads or runtime libraries are required. The flight simulation, damage/enemy balance, AI, controls, account code, audio, save schema and progression rules remain unchanged. Real Google/Facebook/email login still needs your configured Supabase project; the new lobby does not activate providers automatically.

## Update your website

Extract the new website ZIP and upload its folder containing `index.html`, `assets/`, `audio/` and `account-config.json` to the existing Netlify site's Deploys page. Keep your configured `account-config.json` if accounts are enabled. Refresh and check the version listed in the included README. Use the same website address to retain local saves, controls and custom songs.
