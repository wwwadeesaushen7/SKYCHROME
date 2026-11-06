const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// The world scrolls toward the player; hostile rounds close at speed + 190.
// Predict once at launch. Rounds never steer after firing, so changing direction
// still defeats the lead and early campaign missions retain wider aim spread.
export function enemyFiringSolution(enemy, player, mission, speed, random) {
  const time = Math.max(0.08, -enemy.z / (190 + Math.max(0, speed)));
  const skill = clamp(mission.enemyAccuracy ?? 0.35, 0, 1);
  const lead = Math.min(0.98, 0.72 + skill * 0.25 + (enemy.ace ? 0.03 : 0));
  const spread =
    Math.max(0, mission.enemyAimSpread ?? 7) * (enemy.ace ? 0.28 : 0.4);
  // Uniform circular dispersion avoids directional bias and corner outliers.
  const angle = random() * Math.PI * 2;
  const radius = Math.sqrt(random()) * spread * 0.5;
  return {
    vx:
      (player.x +
        player.vx * time * lead -
        enemy.x +
        Math.cos(angle) * radius) /
      time,
    vy:
      (player.y +
        player.vy * time * lead -
        enemy.y +
        Math.sin(angle) * radius) /
      time,
    vz: 190,
  };
}
