// ─── POWERUP ICON RENDERERS ───────────────────────────────────────────────────
// Each function draws a 22x22 pixel-art icon at (x, y) on ctx.
// Called with ctx.save/restore wrapping for alpha/transform.

function drawPowerupShield(ctx, x, y, col) {
  // Pixel shield shape
  ctx.fillStyle = col;
  ctx.fillRect(x+4,  y+1,  14, 3);
  ctx.fillRect(x+2,  y+4,  18, 8);
  ctx.fillRect(x+4,  y+12, 14, 4);
  ctx.fillRect(x+6,  y+16, 10, 3);
  ctx.fillRect(x+8,  y+19, 6,  2);
  ctx.fillRect(x+10, y+21, 2,  1);
  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fillRect(x+5,  y+2,  5, 2);
  ctx.fillRect(x+3,  y+5,  4, 4);
}

function drawPowerupGiant(ctx, x, y, col) {
  // Big up-arrow
  ctx.fillStyle = col;
  ctx.fillRect(x+9,  y+1,  4,  8);
  ctx.fillRect(x+5,  y+5,  12, 4);
  ctx.fillRect(x+3,  y+7,  16, 4);
  ctx.fillRect(x+1,  y+9,  20, 4);
  // Stem
  ctx.fillRect(x+7,  y+13, 8,  8);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(x+10, y+2,  2,  6);
}

function drawPowerupMagnet(ctx, x, y, col) {
  // Horseshoe magnet (U shape)
  ctx.fillStyle = col;
  // Left arm
  ctx.fillRect(x+2,  y+2,  6, 14);
  // Right arm
  ctx.fillRect(x+14, y+2,  6, 14);
  // Top bar
  ctx.fillRect(x+2,  y+2,  18, 5);
  // Poles (red/blue tips)
  ctx.fillStyle = "#ff3333";
  ctx.fillRect(x+2,  y+16, 6, 4);
  ctx.fillStyle = "#3366ff";
  ctx.fillRect(x+14, y+16, 6, 4);
  // Field lines
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x+9,  y+14, 4, 2);
  ctx.fillRect(x+8,  y+17, 6, 2);
}

function drawPowerupSlowmo(ctx, x, y, col) {
  // Hourglass
  ctx.fillStyle = col;
  // Top half
  ctx.fillRect(x+2,  y+1,  18, 3);
  ctx.fillRect(x+4,  y+4,  14, 3);
  ctx.fillRect(x+6,  y+7,  10, 2);
  ctx.fillRect(x+8,  y+9,  6,  2);
  // Waist
  ctx.fillRect(x+9,  y+10, 4,  2);
  // Bottom half
  ctx.fillRect(x+8,  y+12, 6,  2);
  ctx.fillRect(x+6,  y+14, 10, 2);
  ctx.fillRect(x+4,  y+16, 14, 3);
  ctx.fillRect(x+2,  y+19, 18, 2);
  // Sand (bright fill in bottom)
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x+6,  y+15, 10, 4);
}

function drawPowerupFrenzy(ctx, x, y, col) {
  // Lightning bolt
  ctx.fillStyle = col;
  ctx.fillRect(x+10, y+1,  8,  2);
  ctx.fillRect(x+8,  y+3,  8,  2);
  ctx.fillRect(x+6,  y+5,  8,  2);
  ctx.fillRect(x+4,  y+7,  12, 2);
  ctx.fillRect(x+6,  y+9,  10, 2);
  ctx.fillRect(x+8,  y+11, 8,  2);
  ctx.fillRect(x+6,  y+13, 8,  2);
  ctx.fillRect(x+4,  y+15, 8,  2);
  ctx.fillRect(x+2,  y+17, 8,  2);
  ctx.fillRect(x+2,  y+19, 6,  2);
  // Glow core
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(x+8,  y+5,  4,  2);
  ctx.fillRect(x+6,  y+9,  4,  2);
}

function drawPowerupWindfall(ctx, x, y, col) {
  // Coin shower — 3 coins falling
  const coinPositions = [[x+3,y+2],[x+13,y+6],[x+7,y+13]];
  for(const [cx,cy] of coinPositions) {
    ctx.fillStyle = col;
    ctx.fillRect(cx+1, cy,   4, 1);
    ctx.fillRect(cx,   cy+1, 6, 4);
    ctx.fillRect(cx+1, cy+5, 4, 1);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(cx+1, cy+1, 2, 2);
  }
  // Sparkles
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x+1,  y+1,  2, 2);
  ctx.fillRect(x+18, y+3,  2, 2);
  ctx.fillRect(x+4,  y+18, 2, 2);
  ctx.fillRect(x+16, y+16, 2, 2);
}

function drawPowerupGhost(ctx, x, y, col) {
  // Ghost silhouette
  ctx.fillStyle = col;
  // Head dome
  ctx.fillRect(x+5,  y+1,  12, 2);
  ctx.fillRect(x+3,  y+3,  16, 2);
  ctx.fillRect(x+2,  y+5,  18, 10);
  // Body
  ctx.fillRect(x+2,  y+15, 18, 4);
  // Wavy bottom
  ctx.fillRect(x+2,  y+19, 4,  2);
  ctx.fillRect(x+9,  y+19, 4,  2);
  ctx.fillRect(x+16, y+19, 4,  2);
  // Eyes (dark cutouts)
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x+6,  y+7,  4, 4);
  ctx.fillRect(x+12, y+7,  4, 4);
  // Eye shine
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillRect(x+7,  y+8,  2, 2);
  ctx.fillRect(x+13, y+8,  2, 2);
}

function drawPowerupTiny(ctx, x, y, col) {
  // Small dino silhouette (centered, small)
  ctx.fillStyle = col;
  // Body
  ctx.fillRect(x+6,  y+10, 10, 7);
  // Head
  ctx.fillRect(x+12, y+7,  6,  5);
  // Tail
  ctx.fillRect(x+2,  y+12, 6,  3);
  ctx.fillRect(x+1,  y+14, 3,  2);
  // Legs
  ctx.fillRect(x+7,  y+17, 3,  4);
  ctx.fillRect(x+12, y+17, 3,  4);
  // Eye
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillRect(x+16, y+8,  2,  2);
  // Down arrow below to indicate "tiny"
  ctx.fillStyle = col;
  ctx.fillRect(x+9,  y+3,  4,  3);
  ctx.fillRect(x+7,  y+5,  8,  2);
  ctx.fillRect(x+5,  y+7,  12, 2);
}

function drawPowerupSpeed(ctx, x, y, col) {
  // Double chevron / speed lines
  ctx.fillStyle = col;
  // First chevron
  ctx.fillRect(x+2,  y+5,  2, 2);
  ctx.fillRect(x+4,  y+7,  2, 2);
  ctx.fillRect(x+6,  y+9,  2, 2);
  ctx.fillRect(x+4,  y+11, 2, 2);
  ctx.fillRect(x+2,  y+13, 2, 2);
  // Second chevron
  ctx.fillRect(x+8,  y+5,  2, 2);
  ctx.fillRect(x+10, y+7,  2, 2);
  ctx.fillRect(x+12, y+9,  2, 2);
  ctx.fillRect(x+10, y+11, 2, 2);
  ctx.fillRect(x+8,  y+13, 2, 2);
  // Third chevron
  ctx.fillRect(x+14, y+5,  2, 2);
  ctx.fillRect(x+16, y+7,  2, 2);
  ctx.fillRect(x+18, y+9,  2, 2);
  ctx.fillRect(x+16, y+11, 2, 2);
  ctx.fillRect(x+14, y+13, 2, 2);
  // Speed lines
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x+2,  y+17, 18, 2);
  ctx.fillRect(x+4,  y+20, 14, 2);
}

function drawPowerupMeteor(ctx, x, y, col) {
  // Falling meteor with trail
  ctx.fillStyle = col;
  // Trail (top-left)
  ctx.fillStyle = "rgba(255,200,100,0.5)";
  ctx.fillRect(x+1,  y+1,  3, 3);
  ctx.fillRect(x+3,  y+3,  3, 3);
  ctx.fillRect(x+5,  y+5,  3, 3);
  // Rock body
  ctx.fillStyle = col;
  ctx.fillRect(x+7,  y+6,  12, 10);
  ctx.fillRect(x+9,  y+4,  8,  4);
  ctx.fillRect(x+11, y+16, 6,  4);
  ctx.fillRect(x+13, y+18, 4,  2);
  // Glow
  ctx.fillStyle = "rgba(255,150,50,0.4)";
  ctx.fillRect(x+6,  y+5,  14, 12);
  // Crater marks
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(x+10, y+8,  3,  3);
  ctx.fillRect(x+15, y+11, 2,  2);
}

function drawPowerupDoubler(ctx, x, y, col) {
  // "x2" text style with stars
  ctx.fillStyle = col;
  // "x" shape
  ctx.fillRect(x+2,  y+3,  2, 2);
  ctx.fillRect(x+4,  y+5,  2, 2);
  ctx.fillRect(x+6,  y+7,  2, 2);
  ctx.fillRect(x+4,  y+9,  2, 2);
  ctx.fillRect(x+2,  y+11, 2, 2);
  ctx.fillRect(x+8,  y+3,  2, 2);
  ctx.fillRect(x+6,  y+5,  2, 2);
  ctx.fillRect(x+8,  y+9,  2, 2);
  ctx.fillRect(x+10, y+11, 2, 2);
  // "2" shape
  ctx.fillRect(x+12, y+3,  8,  2);
  ctx.fillRect(x+18, y+5,  2,  4);
  ctx.fillRect(x+12, y+9,  8,  2);
  ctx.fillRect(x+12, y+11, 2,  4);
  ctx.fillRect(x+12, y+15, 8,  2);
  // Stars
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillRect(x+1,  y+17, 2, 2);
  ctx.fillRect(x+10, y+19, 2, 2);
  ctx.fillRect(x+18, y+18, 2, 2);
  ctx.fillRect(x+5,  y+20, 2, 2);
}

function drawPowerupHeart(ctx, x, y, col) {
  // Matches the HUD drawHeart style, scaled to 22px
  const s = 22;
  ctx.fillStyle = col;
  ctx.fillRect(x + s*0.08, y,           s*0.35, s*0.4);
  ctx.fillRect(x + s*0.55, y,           s*0.35, s*0.4);
  ctx.fillRect(x,           y + s*0.25, s,      s*0.38);
  ctx.fillRect(x + s*0.08, y + s*0.6,  s*0.84, s*0.22);
  ctx.fillRect(x + s*0.22, y + s*0.8,  s*0.55, s*0.15);
  ctx.fillRect(x + s*0.38, y + s*0.92, s*0.25, s*0.08);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(x + s*0.15, y + s*0.05, s*0.15, s*0.2);
}

// ─── DISPATCH ─────────────────────────────────────────────────────────────────
export function drawPowerupIcon(ctx, id, x, y, col) {
  switch(id) {
    case "shield_pw":    drawPowerupShield(ctx, x, y, col);   break;
    case "giant_pw":     drawPowerupGiant(ctx, x, y, col);    break;
    case "magnet_pw":    drawPowerupMagnet(ctx, x, y, col);   break;
    case "slowmo_pw":    drawPowerupSlowmo(ctx, x, y, col);   break;
    case "frenzy_pw":    drawPowerupFrenzy(ctx, x, y, col);   break;
    case "coinmania_pw": drawPowerupWindfall(ctx, x, y, col); break;
    case "ghost_pw":     drawPowerupGhost(ctx, x, y, col);    break;
    case "tiny_pw":      drawPowerupTiny(ctx, x, y, col);     break;
    case "speed_pw":     drawPowerupSpeed(ctx, x, y, col);    break;
    case "meteor_pw":    drawPowerupMeteor(ctx, x, y, col);   break;
    case "doubler_pw":   drawPowerupDoubler(ctx, x, y, col);  break;
    case "heart_pw":     drawPowerupHeart(ctx, x, y, col);    break;
    default:
      ctx.fillStyle = col;
      ctx.fillRect(x, y, 22, 22);
  }
}
