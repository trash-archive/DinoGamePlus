// ─── UPGRADE ICON RENDERERS ───────────────────────────────────────────────────
// Each draws a 22x22 pixel-art icon at (x, y). Same convention as drawPowerups.js.

function drawIconJump(ctx, x, y, col) {
  // Up arrow (spring / legs)
  ctx.fillStyle = col;
  ctx.fillRect(x+9,  y+1,  4,  2);
  ctx.fillRect(x+7,  y+3,  8,  2);
  ctx.fillRect(x+5,  y+5,  12, 2);
  ctx.fillRect(x+3,  y+7,  16, 2);
  // Stem
  ctx.fillRect(x+9,  y+9,  4,  8);
  // Feet
  ctx.fillRect(x+5,  y+17, 5,  3);
  ctx.fillRect(x+12, y+17, 5,  3);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x+10, y+2,  2,  4);
}

function drawIconDoubleJump(ctx, x, y, col) {
  // Two stacked up-arrows
  ctx.fillStyle = col;
  // Top arrow
  ctx.fillRect(x+9,  y+1,  4,  2);
  ctx.fillRect(x+7,  y+3,  8,  2);
  ctx.fillRect(x+5,  y+5,  12, 2);
  // Bottom arrow
  ctx.fillRect(x+9,  y+8,  4,  2);
  ctx.fillRect(x+7,  y+10, 8,  2);
  ctx.fillRect(x+5,  y+12, 12, 2);
  // Stem
  ctx.fillRect(x+9,  y+14, 4,  6);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(x+10, y+2,  2,  3);
  ctx.fillRect(x+10, y+9,  2,  3);
}

function drawIconDash(ctx, x, y, col) {
  // Three right-pointing chevrons
  ctx.fillStyle = col;
  for (let i = 0; i < 3; i++) {
    const ox = x + 2 + i * 6;
    ctx.fillRect(ox,   y+5,  2, 2);
    ctx.fillRect(ox+2, y+7,  2, 2);
    ctx.fillRect(ox+4, y+9,  2, 2);
    ctx.fillRect(ox+2, y+11, 2, 2);
    ctx.fillRect(ox,   y+13, 2, 2);
  }
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x+2, y+17, 18, 2);
  ctx.fillRect(x+4, y+20, 14, 2);
}

function drawIconBackDash(ctx, x, y, col) {
  // Three left-pointing chevrons
  ctx.fillStyle = col;
  for (let i = 0; i < 3; i++) {
    const ox = x + 18 - i * 6;
    ctx.fillRect(ox,   y+5,  2, 2);
    ctx.fillRect(ox-2, y+7,  2, 2);
    ctx.fillRect(ox-4, y+9,  2, 2);
    ctx.fillRect(ox-2, y+11, 2, 2);
    ctx.fillRect(ox,   y+13, 2, 2);
  }
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x+2, y+17, 18, 2);
  ctx.fillRect(x+4, y+20, 14, 2);
}

function drawIconFastDrop(ctx, x, y, col) {
  // Down arrow with speed lines
  ctx.fillStyle = col;
  ctx.fillRect(x+9,  y+1,  4,  8);
  ctx.fillRect(x+3,  y+7,  16, 2);
  ctx.fillRect(x+5,  y+9,  12, 2);
  ctx.fillRect(x+7,  y+11, 8,  2);
  ctx.fillRect(x+9,  y+13, 4,  2);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x+2,  y+17, 18, 2);
  ctx.fillRect(x+4,  y+20, 14, 2);
}

function drawIconDuck(ctx, x, y, col) {
  // Crouching dino silhouette
  ctx.fillStyle = col;
  // Body (low, wide)
  ctx.fillRect(x+3,  y+12, 14, 6);
  // Head (forward)
  ctx.fillRect(x+14, y+9,  6,  5);
  // Tail
  ctx.fillRect(x+1,  y+13, 4,  3);
  // Legs (short, crouched)
  ctx.fillRect(x+5,  y+18, 3,  3);
  ctx.fillRect(x+11, y+18, 3,  3);
  // Eye
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillRect(x+18, y+10, 2,  2);
  // Down arrow above
  ctx.fillStyle = col;
  ctx.fillRect(x+9,  y+1,  4,  4);
  ctx.fillRect(x+7,  y+4,  8,  2);
  ctx.fillRect(x+5,  y+6,  12, 2);
  ctx.fillRect(x+7,  y+8,  8,  2);
  ctx.fillRect(x+9,  y+10, 4,  2);
}

function drawIconDashCooldown(ctx, x, y, col) {
  // Circular arrow (refresh/cooldown)
  ctx.fillStyle = col;
  // Arc top
  ctx.fillRect(x+7,  y+2,  8,  2);
  ctx.fillRect(x+4,  y+4,  4,  2);
  ctx.fillRect(x+14, y+4,  4,  2);
  ctx.fillRect(x+2,  y+6,  3,  4);
  ctx.fillRect(x+17, y+6,  3,  4);
  ctx.fillRect(x+2,  y+10, 3,  4);
  ctx.fillRect(x+17, y+10, 3,  4);
  ctx.fillRect(x+4,  y+14, 4,  2);
  ctx.fillRect(x+14, y+14, 4,  2);
  ctx.fillRect(x+7,  y+16, 8,  2);
  // Arrow tip (right side, pointing down-right)
  ctx.fillRect(x+17, y+13, 4,  2);
  ctx.fillRect(x+15, y+15, 4,  2);
  ctx.fillRect(x+13, y+17, 4,  2);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x+8,  y+3,  4,  2);
}

// ─── SURVIVAL ICONS ──────────────────────────────────────────────────────────

function drawIconShield(ctx, x, y, col) {
  // Classic kite shield
  ctx.fillStyle = col;
  ctx.fillRect(x+4,  y+1,  14, 3);
  ctx.fillRect(x+2,  y+4,  18, 8);
  ctx.fillRect(x+4,  y+12, 14, 4);
  ctx.fillRect(x+6,  y+16, 10, 3);
  ctx.fillRect(x+8,  y+19, 6,  2);
  ctx.fillRect(x+10, y+21, 2,  1);
  // Cross emblem
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fillRect(x+10, y+5,  2,  8);
  ctx.fillRect(x+7,  y+8,  8,  2);
}

function drawIconSafeStart(ctx, x, y, col) {
  // Turtle shell (slow/safe)
  ctx.fillStyle = col;
  // Shell dome
  ctx.fillRect(x+5,  y+4,  12, 2);
  ctx.fillRect(x+3,  y+6,  16, 8);
  ctx.fillRect(x+5,  y+14, 12, 3);
  // Shell segments
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(x+10, y+6,  2,  8);
  ctx.fillRect(x+3,  y+10, 16, 2);
  // Head
  ctx.fillStyle = col;
  ctx.fillRect(x+15, y+8,  5,  4);
  ctx.fillRect(x+18, y+7,  3,  2);
  // Legs
  ctx.fillRect(x+4,  y+17, 4,  4);
  ctx.fillRect(x+14, y+17, 4,  4);
  // Shine
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(x+6,  y+6,  4,  3);
}

function drawIconExtraLife(ctx, x, y, col) {
  // Pixel heart
  ctx.fillStyle = col;
  ctx.fillRect(x+2,  y+4,  6,  2);
  ctx.fillRect(x+12, y+4,  6,  2);
  ctx.fillRect(x+1,  y+6,  8,  6);
  ctx.fillRect(x+13, y+6,  8,  6);
  ctx.fillRect(x+1,  y+8,  20, 6);
  ctx.fillRect(x+3,  y+14, 16, 3);
  ctx.fillRect(x+5,  y+17, 12, 3);
  ctx.fillRect(x+7,  y+20, 8,  2);
  // "+1" overlay
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillRect(x+4,  y+6,  3,  3);
  ctx.fillRect(x+14, y+6,  3,  3);
}

function drawIconIFrames(ctx, x, y, col) {
  // Dino outline with flash/glow rings
  ctx.fillStyle = col;
  // Dino body (small, centered)
  ctx.fillRect(x+5,  y+10, 8,  6);
  ctx.fillRect(x+11, y+8,  5,  4);
  ctx.fillRect(x+3,  y+11, 4,  3);
  ctx.fillRect(x+6,  y+16, 3,  4);
  ctx.fillRect(x+10, y+16, 3,  4);
  // Glow rings (concentric dashes)
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(x+1,  y+7,  2,  2);
  ctx.fillRect(x+19, y+7,  2,  2);
  ctx.fillRect(x+1,  y+13, 2,  2);
  ctx.fillRect(x+19, y+13, 2,  2);
  ctx.fillRect(x+7,  y+1,  2,  2);
  ctx.fillRect(x+13, y+1,  2,  2);
  ctx.fillRect(x+7,  y+19, 2,  2);
  ctx.fillRect(x+13, y+19, 2,  2);
  ctx.fillStyle = col;
  ctx.fillRect(x+3,  y+3,  2,  2);
  ctx.fillRect(x+17, y+3,  2,  2);
  ctx.fillRect(x+3,  y+17, 2,  2);
  ctx.fillRect(x+17, y+17, 2,  2);
}

// ─── INCOME ICONS ─────────────────────────────────────────────────────────────

function drawIconFossil(ctx, x, y, col) {
  // Bone shape: two end knobs + center bar
  ctx.fillStyle = col;
  // Center bar
  ctx.fillRect(x+7,  y+9,  8, 4);
  // Left knob
  ctx.fillRect(x+2,  y+7,  6, 3);
  ctx.fillRect(x+3,  y+6,  4, 2);
  ctx.fillRect(x+2,  y+12, 6, 3);
  ctx.fillRect(x+3,  y+15, 4, 2);
  // Right knob
  ctx.fillRect(x+14, y+7,  6, 3);
  ctx.fillRect(x+15, y+6,  4, 2);
  ctx.fillRect(x+14, y+12, 6, 3);
  ctx.fillRect(x+15, y+15, 4, 2);
  // Shine
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x+3,  y+7,  2, 2);
  ctx.fillRect(x+15, y+7,  2, 2);
}

function drawIconCombo(ctx, x, y, col) {
  // Stacked "x" multiplier marks — 3 rising hits
  ctx.fillStyle = col;
  const hits = [[x+2,y+14],[x+8,y+8],[x+14,y+2]];
  for (const [hx, hy] of hits) {
    ctx.fillRect(hx,   hy,   2, 2);
    ctx.fillRect(hx+2, hy+2, 2, 2);
    ctx.fillRect(hx+4, hy+4, 2, 2);
    ctx.fillRect(hx+2, hy,   2, 2); // cross
    ctx.fillRect(hx,   hy+4, 2, 2);
    ctx.fillRect(hx+4, hy,   2, 2);
  }
  // Rising line
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(x+1,  y+19, 20, 2);
}

function drawIconMagnetIncome(ctx, x, y, col) {
  // Horseshoe magnet pulling a bone dot
  ctx.fillStyle = col;
  ctx.fillRect(x+3,  y+2,  5, 12);
  ctx.fillRect(x+14, y+2,  5, 12);
  ctx.fillRect(x+3,  y+2,  16, 4);
  ctx.fillStyle = "#ff4444";
  ctx.fillRect(x+3,  y+14, 5, 3);
  ctx.fillStyle = "#4466ff";
  ctx.fillRect(x+14, y+14, 5, 3);
  // Bone dot being attracted
  ctx.fillStyle = col;
  ctx.fillRect(x+9,  y+18, 4, 4);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x+10, y+19, 2, 2);
}

function drawIconNearMiss(ctx, x, y, col) {
  // Exclamation mark + swoosh line
  ctx.fillStyle = col;
  // "!" body
  ctx.fillRect(x+9,  y+1,  4, 11);
  ctx.fillRect(x+9,  y+14, 4, 4);
  // Swoosh (obstacle passing close)
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(x+1,  y+10, 6, 2);
  ctx.fillRect(x+2,  y+12, 4, 2);
  ctx.fillRect(x+15, y+10, 6, 2);
  ctx.fillRect(x+16, y+12, 4, 2);
}

function drawIconNightBonus(ctx, x, y, col) {
  // Crescent moon
  ctx.fillStyle = col;
  // Outer circle fill
  ctx.fillRect(x+6,  y+1,  10, 2);
  ctx.fillRect(x+4,  y+3,  14, 4);
  ctx.fillRect(x+2,  y+7,  16, 8);
  ctx.fillRect(x+4,  y+15, 14, 4);
  ctx.fillRect(x+6,  y+19, 10, 2);
  // Inner cutout (makes crescent)
  ctx.fillStyle = "#f0ede6";
  ctx.fillRect(x+10, y+3,  8,  2);
  ctx.fillRect(x+10, y+5,  10, 4);
  ctx.fillRect(x+10, y+9,  10, 6);
  ctx.fillRect(x+10, y+15, 8,  2);
  // Stars
  ctx.fillStyle = col;
  ctx.fillRect(x+2,  y+2,  2, 2);
  ctx.fillRect(x+18, y+18, 2, 2);
}

function drawIconCycleReward(ctx, x, y, col) {
  // Half sun / half moon split icon
  ctx.fillStyle = col;
  // Sun side (left) — rays
  ctx.fillRect(x+1,  y+10, 3, 2);
  ctx.fillRect(x+2,  y+5,  2, 3);
  ctx.fillRect(x+2,  y+14, 2, 3);
  ctx.fillRect(x+4,  y+3,  2, 2);
  ctx.fillRect(x+4,  y+17, 2, 2);
  // Sun circle (left half)
  ctx.fillRect(x+6,  y+6,  5, 10);
  ctx.fillRect(x+7,  y+4,  4, 2);
  ctx.fillRect(x+7,  y+16, 4, 2);
  // Moon side (right) — crescent
  ctx.fillRect(x+11, y+4,  6, 2);
  ctx.fillRect(x+10, y+6,  8, 10);
  ctx.fillRect(x+11, y+16, 6, 2);
  ctx.fillStyle = "#f0ede6";
  ctx.fillRect(x+13, y+6,  6, 10);
  ctx.fillRect(x+12, y+8,  6, 6);
  // Divider
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(x+10, y+3,  2, 16);
}

function drawIconSpeedBonus(ctx, x, y, col) {
  // Speedometer needle + bone
  ctx.fillStyle = col;
  // Arc
  ctx.fillRect(x+4,  y+14, 14, 2);
  ctx.fillRect(x+2,  y+10, 3,  4);
  ctx.fillRect(x+17, y+10, 3,  4);
  ctx.fillRect(x+4,  y+7,  3,  3);
  ctx.fillRect(x+15, y+7,  3,  3);
  ctx.fillRect(x+8,  y+4,  6,  3);
  // Needle pointing upper-right
  ctx.fillRect(x+10, y+13, 2,  2);
  ctx.fillRect(x+12, y+11, 2,  2);
  ctx.fillRect(x+14, y+9,  2,  2);
  ctx.fillRect(x+16, y+7,  2,  2);
  // Bone dot at tip
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillRect(x+16, y+6,  3,  3);
}

function drawIconFossilWorth(ctx, x, y, col) {
  // Diamond gem with a +1 notch
  ctx.fillStyle = col;
  // Diamond top
  ctx.fillRect(x+9,  y+1,  4,  2);
  ctx.fillRect(x+7,  y+3,  8,  2);
  ctx.fillRect(x+5,  y+5,  12, 2);
  // Diamond middle
  ctx.fillRect(x+3,  y+7,  16, 4);
  // Diamond bottom
  ctx.fillRect(x+5,  y+11, 12, 2);
  ctx.fillRect(x+7,  y+13, 8,  2);
  ctx.fillRect(x+9,  y+15, 4,  2);
  ctx.fillRect(x+10, y+17, 2,  2);
  // Shine
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(x+6,  y+7,  4,  2);
  ctx.fillRect(x+7,  y+5,  2,  2);
  // +1 tag bottom-right
  ctx.fillStyle = col;
  ctx.fillRect(x+14, y+15, 2,  6);
  ctx.fillRect(x+13, y+16, 2,  2);
  ctx.fillRect(x+14, y+21, 4,  1);
}

function drawIconFossilMultiplier(ctx, x, y, col) {
  // Two stacked diamonds with an x between
  ctx.fillStyle = col;
  // Left diamond (small)
  ctx.fillRect(x+2,  y+8,  2,  2);
  ctx.fillRect(x+1,  y+10, 4,  2);
  ctx.fillRect(x+2,  y+12, 2,  2);
  // Right diamond (small)
  ctx.fillRect(x+16, y+8,  2,  2);
  ctx.fillRect(x+15, y+10, 4,  2);
  ctx.fillRect(x+16, y+12, 2,  2);
  // x symbol in center
  ctx.fillRect(x+9,  y+9,  2,  2);
  ctx.fillRect(x+11, y+11, 2,  2);
  ctx.fillRect(x+9,  y+13, 2,  2);
  ctx.fillRect(x+11, y+9,  2,  2);
  ctx.fillRect(x+9,  y+11, 4,  2);
  // Shine dots
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(x+2,  y+9,  1,  1);
  ctx.fillRect(x+16, y+9,  1,  1);
  // Arrow lines suggesting multiplication
  ctx.fillStyle = col;
  ctx.fillRect(x+5,  y+4,  12, 2);
  ctx.fillRect(x+5,  y+16, 12, 2);
  ctx.fillRect(x+4,  y+5,  2,  2);
  ctx.fillRect(x+16, y+5,  2,  2);
  ctx.fillRect(x+4,  y+15, 2,  2);
  ctx.fillRect(x+16, y+15, 2,  2);
}

function drawIconFossilTrail(ctx, x, y, col) {
  // Dino footprint trail with fossil diamonds
  ctx.fillStyle = col;
  // Three fossil diamonds shrinking into the distance
  // Large (foreground)
  ctx.fillRect(x+14, y+13, 2,  2);
  ctx.fillRect(x+13, y+15, 4,  2);
  ctx.fillRect(x+14, y+17, 2,  2);
  // Medium
  ctx.fillRect(x+8,  y+9,  2,  2);
  ctx.fillRect(x+7,  y+11, 4,  2);
  ctx.fillRect(x+8,  y+13, 2,  2);
  // Small (background)
  ctx.fillRect(x+3,  y+5,  2,  2);
  ctx.fillRect(x+2,  y+7,  4,  2);
  ctx.fillRect(x+3,  y+9,  2,  2);
  // Trail dots connecting them
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x+6,  y+12, 2,  2);
  ctx.fillRect(x+11, y+15, 2,  2);
  ctx.fillRect(x+5,  y+8,  2,  2);
  ctx.fillRect(x+10, y+11, 2,  2);
}

// ─── IDLE ICONS ───────────────────────────────────────────────────────────────

function drawIconMiner(ctx, x, y, col) {
  // Pickaxe
  ctx.fillStyle = col;
  ctx.fillRect(x+3,  y+15, 3, 3);
  ctx.fillRect(x+6,  y+12, 3, 3);
  ctx.fillRect(x+9,  y+9,  3, 3);
  ctx.fillRect(x+12, y+6,  3, 3);
  // Head
  ctx.fillRect(x+13, y+2,  6, 3);
  ctx.fillRect(x+15, y+5,  4, 3);
  ctx.fillRect(x+11, y+4,  4, 3);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(x+14, y+3,  2, 2);
}

function drawIconCamp(ctx, x, y, col) {
  // Campfire: logs + flame
  ctx.fillStyle = col;
  ctx.fillRect(x+3,  y+14, 4, 3);
  ctx.fillRect(x+5,  y+12, 4, 3);
  ctx.fillRect(x+15, y+14, 4, 3);
  ctx.fillRect(x+13, y+12, 4, 3);
  ctx.fillRect(x+8,  y+15, 6, 3);
  ctx.fillRect(x+7,  y+10, 8, 4);
  ctx.fillRect(x+8,  y+7,  6, 4);
  ctx.fillRect(x+9,  y+4,  4, 4);
  ctx.fillRect(x+10, y+2,  2, 3);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fillRect(x+10, y+5,  2, 4);
  ctx.fillRect(x+9,  y+9,  2, 3);
}

function drawIconResearch(ctx, x, y, col) {
  // Flask / beaker
  ctx.fillStyle = col;
  ctx.fillRect(x+8,  y+1,  6, 2);
  ctx.fillRect(x+7,  y+3,  8, 4);
  ctx.fillRect(x+5,  y+7,  12, 2);
  ctx.fillRect(x+3,  y+9,  16, 8);
  ctx.fillRect(x+5,  y+17, 12, 3);
  ctx.fillRect(x+7,  y+20, 8,  2);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(x+6,  y+11, 3, 3);
  ctx.fillRect(x+13, y+13, 2, 2);
  ctx.fillRect(x+9,  y+15, 2, 2);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(x+8,  y+3,  2, 3);
}

// ─── DISPATCH ─────────────────────────────────────────────────────────────────

function drawIconLock(ctx, x, y, col) {
  ctx.fillStyle = col;
  // Shackle (top arc)
  ctx.fillRect(x+7,  y+2,  8,  2);
  ctx.fillRect(x+5,  y+4,  4,  2);
  ctx.fillRect(x+13, y+4,  4,  2);
  ctx.fillRect(x+4,  y+6,  3,  5);
  ctx.fillRect(x+15, y+6,  3,  5);
  // Body
  ctx.fillRect(x+3,  y+11, 16, 10);
  // Keyhole
  ctx.fillStyle = "#f0ede6";
  ctx.fillRect(x+9,  y+14, 4,  2);
  ctx.fillRect(x+10, y+16, 2,  3);
}
export function drawLockIcon(ctx, x, y, col) { drawIconLock(ctx, x, y, col); }

export function drawUpgradeIcon(ctx, id, x, y, col) {
  switch (id) {
    // Movement
    case "jump":       drawIconJump(ctx, x, y, col);         break;
    case "dblJump":    drawIconDoubleJump(ctx, x, y, col);   break;
    case "dash":       drawIconDash(ctx, x, y, col);         break;
    case "backdash":   drawIconBackDash(ctx, x, y, col);     break;
    case "fastdrop":   drawIconFastDrop(ctx, x, y, col);     break;
    case "duck":       drawIconDuck(ctx, x, y, col);         break;
    case "dashCd":     drawIconDashCooldown(ctx, x, y, col); break;
    // Income
    case "fossil":      drawIconFossil(ctx, x, y, col);           break;
    case "fossilValue": drawIconFossilWorth(ctx, x, y, col);      break;
    case "fossilMult":  drawIconFossilMultiplier(ctx, x, y, col); break;
    case "runDrip":     drawIconFossilTrail(ctx, x, y, col);      break;
    case "combo":       drawIconCombo(ctx, x, y, col);            break;
    case "magnet":      drawIconMagnetIncome(ctx, x, y, col);     break;
    case "nightBonus":  drawIconNightBonus(ctx, x, y, col);       break;
    case "transBonus":  drawIconCycleReward(ctx, x, y, col);      break;
    case "speedBonus":  drawIconSpeedBonus(ctx, x, y, col);       break;
    // Survival
    case "shield":     drawIconShield(ctx, x, y, col);       break;
    case "speed":      drawIconSafeStart(ctx, x, y, col);    break;
    case "extraLife":  drawIconExtraLife(ctx, x, y, col);    break;
    case "invFrames":  drawIconIFrames(ctx, x, y, col);      break;
    // Idle
    case "miner":      drawIconMiner(ctx, x, y, col);        break;
    case "camp":       drawIconCamp(ctx, x, y, col);         break;
    case "research":   drawIconResearch(ctx, x, y, col);     break;
    default:
      ctx.fillStyle = col;
      ctx.fillRect(x+4, y+4, 14, 14);
  }
}
