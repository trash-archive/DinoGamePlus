import { GROUND_Y, CANVAS_W } from "../constants";

// ─── BOSS ATTACK ANIMATIONS ───────────────────────────────────────────────────
// drawBossAttacks(ctx, projectiles, frame, bossX, bossY)
// drawBossTelegraph(ctx, attack, attackTimer, bossX, bossY, dinoX, dinoY, frame)

// ── Helpers ───────────────────────────────────────────────────────────────────
function pixelCircle(ctx, cx, cy, r, col) {
  // Pixel-art approximation of a circle using rects
  ctx.fillStyle = col;
  const steps = Math.max(4, Math.floor(r * 2));
  for(let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const px = Math.round(cx + Math.cos(a) * r);
    const py = Math.round(cy + Math.sin(a) * r);
    ctx.fillRect(px - 1, py - 1, 3, 3);
  }
}

function drawTrail(ctx, p, frame, col, count = 4, spacing = 8) {
  for(let i = 1; i <= count; i++) {
    const tx = p.x + (p.vx > 0 ? -1 : 1) * i * spacing;
    const alpha = (1 - i / (count + 1)) * 0.35;
    ctx.fillStyle = col.replace(")", `,${alpha})`).replace("rgb(", "rgba(");
    ctx.globalAlpha = alpha;
    ctx.fillRect(tx, p.y, p.w, p.h);
  }
  ctx.globalAlpha = 1;
}

// ── wave_low / wave_high ──────────────────────────────────────────────────────
function drawWaveProjectile(ctx, p, frame) {
  const pulse  = Math.floor(frame / 5) % 2;
  const wobble = Math.sin(frame * 0.22 + p.x * 0.04) * 2;

  // Trail
  for(let i = 1; i <= 5; i++) {
    const tx = p.x + i * 10;
    ctx.globalAlpha = (1 - i / 6) * 0.28;
    ctx.fillStyle = "#660000";
    ctx.fillRect(tx, p.y + wobble, p.w - i, p.h - i);
  }
  ctx.globalAlpha = 1;

  // Outer shell
  ctx.fillStyle = pulse ? "#aa0000" : "#770000";
  ctx.fillRect(p.x,     p.y + wobble,     p.w,     p.h);
  // Inner bright core
  ctx.fillStyle = pulse ? "#ff4422" : "#cc2200";
  ctx.fillRect(p.x + 3, p.y + wobble + 3, p.w - 6, p.h - 6);
  // Bright center pixel
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(p.x + Math.floor(p.w/2) - 1, p.y + wobble + Math.floor(p.h/2) - 1, 3, 3);

  // Side spikes (pixel art)
  ctx.fillStyle = pulse ? "#ff2200" : "#880000";
  ctx.fillRect(p.x - 5, p.y + wobble + 4, 5, 4);
  ctx.fillRect(p.x + p.w, p.y + wobble + 4, 5, 4);
}

// ── aimed_shot ────────────────────────────────────────────────────────────────
function drawAimedShot(ctx, p, frame) {
  const spd = Math.abs(p.vx);

  // Speed lines behind
  for(let i = 1; i <= 6; i++) {
    const tx = p.x + i * (spd * 0.6);
    const lh = Math.max(1, p.h - i);
    ctx.globalAlpha = (1 - i / 7) * 0.4;
    ctx.fillStyle = "#ff2200";
    ctx.fillRect(tx, p.y + (p.h - lh) / 2, p.w * 0.6, lh);
  }
  ctx.globalAlpha = 1;

  // Needle body
  ctx.fillStyle = "#cc0000";
  ctx.fillRect(p.x,     p.y + 2, p.w,     p.h - 4);
  ctx.fillStyle = "#ff3300";
  ctx.fillRect(p.x + 1, p.y + 3, p.w - 2, p.h - 6);
  // Bright tip (left side, moving left)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(p.x,     p.y + Math.floor(p.h/2) - 1, 3, 3);
  // Tail flare
  ctx.fillStyle = "#ff6600";
  ctx.fillRect(p.x + p.w - 2, p.y + 1, 4, p.h - 2);
  ctx.fillRect(p.x + p.w,     p.y + 3, 3, p.h - 6);
}

// ── ground_slam ───────────────────────────────────────────────────────────────
function drawGroundSlam(ctx, p, frame) {
  const crack = Math.floor(frame / 3) % 3;

  // Glow aura under shockwave
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#ff4400";
  ctx.fillRect(p.x - 12, p.y - 8, p.w + 24, p.h + 14);
  ctx.globalAlpha = 1;

  // Main shockwave body
  ctx.fillStyle = "#cc2200";
  ctx.fillRect(p.x, p.y, p.w, p.h);

  // Jagged top edge (pixel cracks)
  ctx.fillStyle = "#ff4400";
  for(let i = 0; i < Math.floor(p.w / 6); i++) {
    const jx = p.x + i * 6;
    const jh = (crack + i) % 3 === 0 ? 6 : 3;
    ctx.fillRect(jx, p.y - jh, 4, jh + 2);
  }

  // Bright leading edge
  ctx.fillStyle = "#ff8844";
  ctx.fillRect(p.x, p.y, 4, p.h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(p.x, p.y + 4, 2, p.h - 8);

  // Ground crack trail behind
  for(let i = 1; i <= 4; i++) {
    const tx = p.x + i * 14;
    ctx.globalAlpha = (1 - i / 5) * 0.5;
    ctx.fillStyle = "#880000";
    ctx.fillRect(tx, GROUND_Y - 4, 8, 4);
    ctx.fillRect(tx + 2, GROUND_Y - 7, 4, 3);
  }
  ctx.globalAlpha = 1;
}

// ── ceiling_drop ──────────────────────────────────────────────────────────────
function drawCeilingDrop(ctx, p, frame) {
  const falling = !p._landed;
  const wobble  = Math.sin(frame * 0.3 + p.x * 0.05) * 1.5;

  // Warning shadow on ground (only while falling)
  if(falling) {
    const shadowAlpha = Math.min(0.5, (p.y + 20) / GROUND_Y * 0.6);
    ctx.globalAlpha = shadowAlpha;
    ctx.fillStyle = "#440000";
    ctx.fillRect(p.x - 4, GROUND_Y - 3, p.w + 8, 4);
    ctx.globalAlpha = 1;
  }

  // Debris chunk — dark void rock
  ctx.fillStyle = "#1a0030";
  ctx.fillRect(p.x,     p.y + wobble,     p.w,     p.h);
  ctx.fillStyle = "#2a0050";
  ctx.fillRect(p.x + 2, p.y + wobble + 2, p.w - 4, p.h - 4);

  // Cracks on the chunk
  ctx.fillStyle = "#440066";
  ctx.fillRect(p.x + 4, p.y + wobble + 2, 2, p.h - 4);
  ctx.fillRect(p.x + 9, p.y + wobble + 5, p.w - 12, 2);

  // Glint
  ctx.fillStyle = "#8844aa";
  ctx.fillRect(p.x + 2, p.y + wobble + 2, 3, 3);

  // Impact dust when landed
  if(p._landed) {
    const dustAge = p._landed;
    for(let i = 0; i < 5; i++) {
      const dx = p.x - 10 + i * 10;
      const dy = GROUND_Y - 4 - dustAge * 0.4;
      ctx.globalAlpha = Math.max(0, 0.6 - dustAge * 0.015);
      ctx.fillStyle = "#330044";
      ctx.fillRect(dx, dy, 4, 4);
    }
    ctx.globalAlpha = 1;
  }
}

// ── void_orb ──────────────────────────────────────────────────────────────────
function drawVoidOrb(ctx, p, frame) {
  const spin  = frame * 0.08;
  const pulse = 0.55 + Math.sin(frame * 0.14) * 0.45;
  const cx    = p.x + p.w / 2;
  const cy    = p.y + p.h / 2;
  const r     = p.w / 2;

  // Outer homing aura
  ctx.globalAlpha = pulse * 0.22;
  ctx.fillStyle = "#6600cc";
  ctx.fillRect(cx - r - 8, cy - r - 8, (r + 8) * 2, (r + 8) * 2);
  ctx.globalAlpha = 1;

  // Rotating diamond (4 rects at 45° offset using pixel art)
  const arms2 = [
    [Math.cos(spin),       Math.sin(spin)],
    [Math.cos(spin + Math.PI/2), Math.sin(spin + Math.PI/2)],
    [Math.cos(spin + Math.PI),   Math.sin(spin + Math.PI)],
    [Math.cos(spin + Math.PI*1.5), Math.sin(spin + Math.PI*1.5)],
  ];
  ctx.fillStyle = "#8800cc";
  for(const [ax, ay] of arms2) {
    ctx.fillRect(Math.round(cx + ax * r) - 2, Math.round(cy + ay * r) - 2, 5, 5);
    ctx.fillRect(Math.round(cx + ax * r * 0.5) - 1, Math.round(cy + ay * r * 0.5) - 1, 3, 3);
  }

  // Core
  ctx.fillStyle = `rgba(150,0,255,${pulse})`;
  ctx.fillRect(cx - r + 2, cy - r + 2, (r - 2) * 2, (r - 2) * 2);
  ctx.fillStyle = "#cc44ff";
  ctx.fillRect(cx - 4, cy - 4, 8, 8);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cx - 2, cy - 2, 4, 4);

  // Homing trail
  for(let i = 1; i <= 4; i++) {
    const tx = p.x + i * 6;
    ctx.globalAlpha = (1 - i / 5) * 0.3;
    ctx.fillStyle = "#6600cc";
    ctx.fillRect(tx, p.y + 2, p.w - 4, p.h - 4);
  }
  ctx.globalAlpha = 1;
}

// ── tentacle ──────────────────────────────────────────────────────────────────
function drawTentacle(ctx, p, frame) {
  const segW  = 12;
  const segH  = p.h;
  const segs  = Math.ceil(p.w / segW);

  for(let i = 0; i < segs; i++) {
    const sx    = p.x + i * segW;
    const wave  = Math.sin(frame * 0.18 + i * 0.7) * 5;
    const dark  = i % 2 === 0;

    // Segment body
    ctx.fillStyle = dark ? "#060008" : "#0e0018";
    ctx.fillRect(sx, p.y + wave, segW - 1, segH);

    // Segment highlight
    ctx.fillStyle = dark ? "#1a0030" : "#220040";
    ctx.fillRect(sx + 1, p.y + wave + 1, segW - 3, 3);

    // Sucker dots
    ctx.fillStyle = "#440066";
    ctx.fillRect(sx + 4, p.y + wave + segH - 5, 4, 4);
  }

  // Leading tip — brighter and pointed
  ctx.fillStyle = "#330055";
  ctx.fillRect(p.x - 6, p.y + Math.sin(frame * 0.18) * 5, 8, segH);
  ctx.fillStyle = "#660088";
  ctx.fillRect(p.x - 4, p.y + Math.sin(frame * 0.18) * 5 + 4, 4, segH - 8);

  // Glow aura along bottom
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#440066";
  ctx.fillRect(p.x - 8, p.y + segH - 2, p.w + 16, 8);
  ctx.globalAlpha = 1;
}

// ─── TELEGRAPH ANIMATIONS ─────────────────────────────────────────────────────
// Drawn during warmup frames — shows the player what's coming and from where
export function drawBossTelegraph(ctx, attack, attackTimer, warmup, bossX, bossY, dinoX, dinoY, frame) {
  if(attackTimer >= warmup) return;
  const progress = attackTimer / warmup;       // 0 → 1 as warmup counts up
  const pulse    = 0.4 + Math.sin(frame * 0.35) * 0.4;
  const alpha    = Math.min(1, progress * 2) * pulse;

  ctx.save();
  ctx.globalAlpha = alpha;

  switch(attack.type) {
    case "wave_low": {
      // Horizontal line from boss to left edge at ground level
      ctx.fillStyle = "#cc0000";
      ctx.fillRect(0, GROUND_Y - 20, bossX - 40, 3);
      // Arrow head
      ctx.fillRect(0, GROUND_Y - 26, 8, 14);
      // Pulsing floor glow
      ctx.globalAlpha = alpha * 0.15;
      ctx.fillStyle = "#ff2200";
      ctx.fillRect(0, GROUND_Y - 24, bossX, 24);
      break;
    }
    case "wave_high": {
      // Horizontal line at mid-air height
      const lineY = GROUND_Y - 95;
      ctx.fillStyle = "#cc0000";
      ctx.fillRect(0, lineY, bossX - 40, 3);
      ctx.fillRect(0, lineY - 6, 8, 14);
      ctx.globalAlpha = alpha * 0.12;
      ctx.fillStyle = "#ff2200";
      ctx.fillRect(0, lineY - 8, bossX, 20);
      break;
    }
    case "aimed_shot": {
      // Line from boss to dino's current position
      const dx = dinoX - bossX;
      const dy = dinoY - bossY;
      const len = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.floor(len / 8);
      ctx.fillStyle = "#ff2200";
      for(let i = 0; i < steps; i++) {
        const t  = i / steps;
        const px = Math.round(bossX + dx * t);
        const py = Math.round(bossY + dy * t);
        ctx.fillRect(px - 1, py - 1, 3, 3);
      }
      // Target reticle on dino
      ctx.fillStyle = "#ff4400";
      ctx.fillRect(dinoX - 12, dinoY + 10, 8, 2);
      ctx.fillRect(dinoX + 4,  dinoY + 10, 8, 2);
      ctx.fillRect(dinoX,      dinoY - 2,  2, 8);
      ctx.fillRect(dinoX,      dinoY + 14, 2, 8);
      break;
    }
    case "ground_slam": {
      // Crack lines spreading from boss along the floor
      const spread = progress * (bossX - 20);
      ctx.fillStyle = "#ff4400";
      ctx.fillRect(bossX - spread, GROUND_Y - 3, spread, 3);
      // Jagged crack teeth
      for(let i = 0; i < Math.floor(spread / 20); i++) {
        const cx2 = bossX - spread + i * 20;
        ctx.fillRect(cx2, GROUND_Y - 7, 3, 4);
      }
      break;
    }
    case "ceiling_drop": {
      // Shadow circles on the ground where debris will land
      const dropCount = 3;
      for(let i = 0; i < dropCount; i++) {
        // Use seeded positions matching spawnAttack logic approximation
        const sx = 80 + (i / dropCount) * (CANVAS_W - 280) + 40;
        ctx.fillStyle = "#440000";
        ctx.fillRect(sx - 10, GROUND_Y - 4, 28, 4);
        // Crosshair
        ctx.fillStyle = "#cc0000";
        ctx.fillRect(sx + 4, GROUND_Y - 10, 4, 12);
        ctx.fillRect(sx - 4, GROUND_Y - 4,  20, 4);
      }
      break;
    }
    case "void_orb": {
      // Swirling charge-up on the boss body
      const orbR = 6 + progress * 14;
      const spin = frame * 0.2;
      ctx.fillStyle = "#8800cc";
      for(let i = 0; i < 6; i++) {
        const a  = spin + (i / 6) * Math.PI * 2;
        const px = Math.round(bossX + Math.cos(a) * orbR);
        const py = Math.round(bossY - 20 + Math.sin(a) * orbR);
        ctx.fillRect(px - 2, py - 2, 5, 5);
      }
      ctx.fillStyle = "#cc44ff";
      ctx.fillRect(bossX - 4, bossY - 24, 8, 8);
      break;
    }
    case "tentacle": {
      // Tentacle tip emerging from boss bottom, growing leftward
      const tipLen = progress * 80;
      const segW2  = 10;
      const segs2  = Math.ceil(tipLen / segW2);
      for(let i = 0; i < segs2; i++) {
        const sx   = bossX - 30 - i * segW2;
        const wave = Math.sin(frame * 0.18 + i * 0.7) * 4;
        ctx.fillStyle = i % 2 === 0 ? "#060008" : "#0e0018";
        ctx.fillRect(sx, GROUND_Y - 28 + wave, segW2 - 1, 24);
      }
      break;
    }
    default: break;
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

// ─── MAIN DRAW DISPATCH ───────────────────────────────────────────────────────
export function drawBossAttacks(ctx, projectiles, frame) {
  for(const p of projectiles) {
    ctx.save();
    switch(p.type) {
      case "wave_low":
      case "wave_high":    drawWaveProjectile(ctx, p, frame); break;
      case "aimed_shot":   drawAimedShot(ctx, p, frame);      break;
      case "ground_slam":  drawGroundSlam(ctx, p, frame);     break;
      case "ceiling_drop": drawCeilingDrop(ctx, p, frame);    break;
      case "void_orb":     drawVoidOrb(ctx, p, frame);        break;
      case "tentacle":     drawTentacle(ctx, p, frame);       break;
      default: break;
    }
    ctx.restore();
  }
}
