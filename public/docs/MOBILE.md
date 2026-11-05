# Skychrome v2.3.1 — mobile flight controls

The mobile flight system activates when the browser reports a coarse primary pointer, as on phones and tablets. Desktop mouse/keyboard controls and layout stay the same. The v2.3.1 combat balance applies to both mobile and PC: fewer enemies, triple cannon damage and a one-hit missile kill. The dual-stick controls from v2.3.0 remain the same.

## Fly and aim independently

- **Left stick — STEER:** drag to fly horizontally or vertically. Small movements give precise analog input; the dead zone ignores thumb jitter. Let go to stop steering input; the aircraft retains its normal momentum.
- **Right stick — AIM + FIRE:** drag to move the gun sight independently of the aircraft. Holding the stick fires by default, so two thumbs can steer, aim and shoot together. Let go to stop firing and hold the sight where you left it.
- **LOCK / NEXT:** tap LOCK to track a visible hostile's predicted lead closest to your sight. Once tracking, NEXT cycles eligible visible enemies. Tracking only aims; hold the aim stick near its center or use FIRE to shoot. Cannon rounds deal three hull damage each; a missile impact destroys the target. Tracking ends if the hostile is destroyed, passes behind you or leaves the visible aiming area. Dragging the aim stick immediately takes over manual aiming. Tracking does not fly or dodge for you.
- **CENTER:** release tracking and return the sight to the middle of the screen.
- **FIRE:** a separate hold button, also useful with aim-and-fire switched off.
- **BOOST / MISSILE:** hold boost for afterburners; hold missile to fire whenever its normal seven-second recharge is ready. The mobile missile label shows recharge time.
- **BRAKE (v2.6.0):** hold to slow down; release and use BOOST to recover from a stall. Inputs clear on pause, cancellation or focus loss.
- **ROLL arrows:** hold to rotate the aircraft; release to recover to level flight as before.

Each finger has independent capture. Releasing one does not release another. Canceled touches, pause, focus loss, returning to the lobby and a device rotation clear held inputs so firing or steering cannot remain stuck. Rotating the device pauses the game; resume after the layout settles.

## Tune the controls

Tap the control-settings button (☷) at the top of the flight, or open Settings → Mobile controls / All controls on mobile. Opening it pauses the flight.

- **Aim sensitivity:** 0.50–2.00×. Lower values make small adjustments easier.
- **Stick dead zone:** 4–30%. Increase it to ignore more accidental thumb motion.
- **Control size:** 85–120% for the two sticks. Action buttons retain at least 44px touch targets.
- **Aim and fire:** enabled by default; switch off to use the aim stick only for aiming and FIRE separately.
- **Target tracking:** enable or disable LOCK/NEXT without changing desktop flight-assist settings.
- **Left-handed layout:** swaps the sticks and action groups. The labels and instructions follow the new sides.
- **Reset mobile controls:** restores these mobile defaults. Keyboard bindings, volume and graphics settings are unaffected.

Preferences are saved under `skychrome-touch-v1` on this browser/device, separately from keyboard bindings and player progress. Clearing website data removes them. They are not uploaded to accounts or included in player backups.

## Screen layout and performance

Portrait, landscape and tablet layouts have separate space for both sticks, weapon/roll controls, target/center buttons, health, boost and objectives. Mobile flights fill the visible viewport even when the browser does not support native fullscreen. The layout uses safe-area insets for camera cutouts and the home indicator; leaving a flight restores normal lobby scrolling. Landscape offers a wider view of the airspace, while portrait remains playable.

Aiming moves at the same rate at 20, 30 and 60 rendered FPS, with a curved response for small adjustments and bounded movement after a stalled frame. Touch input does not add scene objects, textures, shaders or post-processing. The existing fixed simulation, renderer budgets and graphics presets remain unchanged.

## Install this update

Download and extract the website ZIP, then upload the folder containing `index.html`, `assets/` and `audio/` to the existing site's Netlify Deploys page. Keep your configured `account-config.json` if accounts are enabled. Refresh and check v2.3.1. Keeping the same website address retains local profiles and custom songs.
