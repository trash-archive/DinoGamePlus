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

  // Trail — pixel dots, not rect outlines
  for(let i = 1; i <= 5; i++) {
    const tx = p.x + (p.vx > 0 ? -i : i) * 10;
    ctx.globalAlpha = (1 - i / 6) * 0.5;
    ctx.fillStyle = "#aa0000";
    ctx.fillRect(tx + p.w/2 - 2, p.y + wobble + p.h/2 - 2, 4, 4);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = pulse ? "#aa0000" : "#770000";
  ctx.fillRect(p.x,     p.y + wobble,     p.w,     p.h);
  ctx.fillStyle = pulse ? "#ff4422" : "#cc2200";
  ctx.fillRect(p.x + 3, p.y + wobble + 3, p.w - 6, p.h - 6);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(p.x + Math.floor(p.w/2) - 1, p.y + wobble + Math.floor(p.h/2) - 1, 3, 3);
  ctx.fillStyle = pulse ? "#ff2200" : "#880000";
  ctx.fillRect(p.x - 5, p.y + wobble + 4, 5, 4);
  ctx.fillRect(p.x + p.w, p.y + wobble + 4, 5, 4);
}

// ── aimed_shot ────────────────────────────────────────────────────────────────
function drawAimedShot(ctx, p, frame) {
  const spd = Math.abs(p.vx);
  const trailDir = p.vx > 0 ? -1 : 1;

  // Speed lines — thin pixel streaks, not rect outlines
  for(let i = 1; i <= 6; i++) {
    const tx = p.x + trailDir * i * (spd * 0.6);
    ctx.globalAlpha = (1 - i / 7) * 0.5;
    ctx.fillStyle = "#ff2200";
    ctx.fillRect(tx, p.y + p.h/2 - 1, 3, 2);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#cc0000";
  ctx.fillRect(p.x,     p.y + 2, p.w,     p.h - 4);
  ctx.fillStyle = "#ff3300";
  ctx.fillRect(p.x + 1, p.y + 3, p.w - 2, p.h - 6);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(p.vx > 0 ? p.x + p.w - 3 : p.x, p.y + Math.floor(p.h/2) - 1, 3, 3);
  ctx.fillStyle = "#ff6600";
  const tailX = p.vx > 0 ? p.x : p.x + p.w - 4;
  ctx.fillRect(tailX, p.y + 1, 4, p.h - 2);
  ctx.fillRect(tailX + (p.vx > 0 ? -3 : 4), p.y + 3, 3, p.h - 6);
}

// ── ground_slam ───────────────────────────────────────────────────────────────
function drawGroundSlam(ctx, p, frame) {
  const crack = Math.floor(frame / 3) % 3;

  ctx.fillStyle = "#cc2200";
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = "#ff4400";
  for(let i = 0; i < Math.floor(p.w / 6); i++) {
    const jx = p.x + i * 6;
    const jh = (crack + i) % 3 === 0 ? 6 : 3;
    ctx.fillRect(jx, p.y - jh, 4, jh + 2);
  }
  ctx.fillStyle = "#ff8844";
  ctx.fillRect(p.x, p.y, 4, p.h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(p.x, p.y + 4, 2, p.h - 8);
  for(let i = 1; i <= 4; i++) {
    const tx = p.x + (p.vx > 0 ? -i : i) * 14;
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

  const arms2 = [
    [Math.cos(spin),             Math.sin(spin)],
    [Math.cos(spin+Math.PI/2),   Math.sin(spin+Math.PI/2)],
    [Math.cos(spin+Math.PI),     Math.sin(spin+Math.PI)],
    [Math.cos(spin+Math.PI*1.5), Math.sin(spin+Math.PI*1.5)],
  ];
  ctx.fillStyle = "#8800cc";
  for(const [ax, ay] of arms2) {
    ctx.fillRect(Math.round(cx + ax*r)-2,     Math.round(cy + ay*r)-2,     5, 5);
    ctx.fillRect(Math.round(cx + ax*r*0.5)-1, Math.round(cy + ay*r*0.5)-1, 3, 3);
  }
  ctx.fillStyle = `rgba(150,0,255,${pulse})`;
  ctx.fillRect(cx - r + 2, cy - r + 2, (r-2)*2, (r-2)*2);
  ctx.fillStyle = "#cc44ff";
  ctx.fillRect(cx - 4, cy - 4, 8, 8);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cx - 2, cy - 2, 4, 4);

  // Trail — pixel dots only
  const trailDir = p.vx > 0 ? -1 : 1;
  for(let i = 1; i <= 4; i++) {
    ctx.globalAlpha = (1 - i / 5) * 0.5;
    ctx.fillStyle = "#6600cc";
    ctx.fillRect(cx + trailDir*i*7 - 2, cy - 2, 4, 4);
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

// ── tentacle_sweep ───────────────────────────────────────────────────────────
function drawTentacleSweep(ctx, p, frame) {
  const segW = 14;
  const segs = Math.ceil(p.w / segW);
  // Thick sweeping arm — taller and darker than the regular tentacle
  for(let i = 0; i < segs; i++) {
    const sx   = p.x + i * segW;
    const wave = Math.sin(frame * 0.14 + i * 0.5) * 6;
    const dark = i % 2 === 0;
    ctx.fillStyle = dark ? "#0a000e" : "#140020";
    ctx.fillRect(sx, p.y + wave, segW - 1, p.h);
    ctx.fillStyle = dark ? "#220038" : "#2e0050";
    ctx.fillRect(sx + 1, p.y + wave + 2, segW - 3, 4);
    // Sucker row
    ctx.fillStyle = "#550077";
    ctx.fillRect(sx + 3, p.y + wave + p.h - 7, 5, 5);
  }
  // Glowing leading tip
  ctx.fillStyle = "#440066";
  ctx.fillRect(p.x - 8, p.y + Math.sin(frame * 0.14) * 6, 10, p.h);
  ctx.fillStyle = "#8800cc";
  ctx.fillRect(p.x - 6, p.y + Math.sin(frame * 0.14) * 6 + 6, 6, p.h - 12);
  // Ground glow
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#550077";
  ctx.fillRect(p.x - 10, GROUND_Y - 6, p.w + 20, 6);
  ctx.globalAlpha = 1;
}

// ── tentacle_combo ────────────────────────────────────────────────────────────
function drawTentacleCombo(ctx, p, frame) {
  if(!p._active) return; // don’t draw until activated
  const pulse = Math.floor(frame / 3) % 2;
  // Sharp narrow poke — bright tip, dark body
  ctx.fillStyle = pulse ? "#1a0030" : "#0e0020";
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = pulse ? "#6600aa" : "#440088";
  ctx.fillRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);
  // Bright piercing tip
  ctx.fillStyle = "#cc44ff";
  ctx.fillRect(p.x, p.y + Math.floor(p.h / 2) - 2, 6, 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(p.x, p.y + Math.floor(p.h / 2) - 1, 3, 2);
  // Speed trail
  for(let i = 1; i <= 3; i++) {
    ctx.globalAlpha = (1 - i / 4) * 0.3;
    ctx.fillStyle = "#440066";
    ctx.fillRect(p.x + i * 8, p.y + 2, p.w - 4, p.h - 4);
  }
  ctx.globalAlpha = 1;
}

// ── ground_pound ──────────────────────────────────────────────────────────────
function drawGroundPound(ctx, p, frame) {
  if(p._delay !== undefined && !p._active) return;
  const crack = Math.floor(frame / 2) % 3;
  const isSecond = p._wave === 1;
  ctx.fillStyle = isSecond ? "#880033" : "#cc1100";
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = isSecond ? "#cc0044" : "#ff3300";
  for(let i = 0; i < Math.floor(p.w / 7); i++) {
    const jx = p.x + i * 7;
    const jh = (crack + i) % 3 === 0 ? 7 : 3;
    ctx.fillRect(jx, p.y - jh, 5, jh + 2);
  }
  ctx.fillStyle = isSecond ? "#ff4488" : "#ff6600";
  ctx.fillRect(p.x, p.y, 5, p.h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(p.x, p.y + 3, 2, p.h - 6);
  const trailDir = p.vx > 0 ? -1 : 1;
  for(let i = 1; i <= 5; i++) {
    const tx = p.x + trailDir * i * 12;
    ctx.globalAlpha = (1 - i / 6) * 0.45;
    ctx.fillStyle = isSecond ? "#660022" : "#880000";
    ctx.fillRect(tx, GROUND_Y - 5, 9, 5);
    ctx.fillRect(tx + 2, GROUND_Y - 8, 5, 3);
  }
  ctx.globalAlpha = 1;
}

// ── void_burst ───────────────────────────────────────────────────────────────
function drawVoidBurst(ctx, p, frame) {
  const pulse = 0.5 + Math.sin(frame * 0.18 + p._idx * 0.9) * 0.5;
  const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
  ctx.fillStyle = "#6600aa";
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = "#aa22ee";
  ctx.fillRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);
  ctx.fillStyle = "#ee88ff";
  ctx.fillRect(cx - 3, cy - 3, 6, 6);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cx - 1, cy - 1, 3, 3);
  // Trail — pixel dots
  const trailDir = p.vx > 0 ? -1 : 1;
  for(let i = 1; i <= 4; i++) {
    ctx.globalAlpha = (1 - i / 5) * 0.4;
    ctx.fillStyle = "#8800cc";
    ctx.fillRect(cx + trailDir*i*7 - 2, cy - 2, 4, 4);
  }
  ctx.globalAlpha = 1;
}

// ── tracking_beam ──────────────────────────────────────────────────────────
function drawTrackingBeam(ctx, p, frame) {
  const pulse = Math.floor(frame / 4) % 2;
  const by    = p._sweepY;
  // Outer glow band
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#ff2200";
  ctx.fillRect(0, by - 8, p.w, p.h + 16);
  ctx.globalAlpha = 1;
  // Main beam body
  ctx.fillStyle = pulse ? "#cc1100" : "#991100";
  ctx.fillRect(0, by, p.w, p.h);
  // Bright core stripe
  ctx.fillStyle = pulse ? "#ff4422" : "#dd2200";
  ctx.fillRect(0, by + 3, p.w, p.h - 6);
  // Hot center line
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, by + Math.floor(p.h / 2) - 1, p.w, 2);
  // Leading edge glow
  ctx.fillStyle = "#ff8844";
  ctx.fillRect(p.w - 6, by, 6, p.h);
}

// ── spike_rain ────────────────────────────────────────────────────────────────
function drawSpikeRain(ctx, p, frame) {
  const falling = !p._landed;
  const wobble  = Math.sin(frame * 0.28 + p.x * 0.06) * 1.5;
  // Warning shadow
  if(falling) {
    const shadowAlpha = Math.min(0.55, (p.y + 24) / GROUND_Y * 0.65);
    ctx.globalAlpha = shadowAlpha;
    ctx.fillStyle = "#550000";
    ctx.fillRect(p.x - 3, GROUND_Y - 3, p.w + 6, 3);
    ctx.globalAlpha = 1;
  }
  // Spike body — dark red crystal
  ctx.fillStyle = "#3a0010";
  ctx.fillRect(p.x, p.y + wobble, p.w, p.h);
  ctx.fillStyle = "#660022";
  ctx.fillRect(p.x + 2, p.y + wobble + 2, p.w - 4, p.h - 4);
  // Pointed tip
  ctx.fillStyle = "#cc0044";
  ctx.fillRect(p.x + 4, p.y + wobble, p.w - 8, 4);
  ctx.fillStyle = "#ff2266";
  ctx.fillRect(p.x + 5, p.y + wobble, p.w - 10, 2);
  // Glint
  ctx.fillStyle = "#ff88aa";
  ctx.fillRect(p.x + 2, p.y + wobble + 2, 3, 3);
  // Impact dust
  if(p._landed) {
    for(let i = 0; i < 4; i++) {
      const dx = p.x - 8 + i * 9;
      const dy = GROUND_Y - 4 - p._landed * 0.35;
      ctx.globalAlpha = Math.max(0, 0.55 - p._landed * 0.018);
      ctx.fillStyle = "#550022";
      ctx.fillRect(dx, dy, 4, 4);
    }
    ctx.globalAlpha = 1;
  }
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
    case "tentacle_sweep": {
      // Full ground-level danger zone highlight
      ctx.fillStyle = "#550077";
      ctx.fillRect(0, GROUND_Y - 42, bossX, 3);
      ctx.globalAlpha = alpha * 0.12;
      ctx.fillStyle = "#8800cc";
      ctx.fillRect(0, GROUND_Y - 42, bossX, 42);
      ctx.globalAlpha = alpha;
      ctx.fillRect(0, GROUND_Y - 48, 10, 16);
      break;
    }
    case "tentacle_combo": {
      // 4 small reticles at alternating heights
      const comboHeights = [GROUND_Y - 28, GROUND_Y - 80, GROUND_Y - 28, GROUND_Y - 60];
      for(let i = 0; i < 4; i++) {
        const cx2 = 60 + i * 30;
        const cy2 = comboHeights[i];
        ctx.fillStyle = i % 2 === 0 ? "#cc44ff" : "#8800cc";
        ctx.fillRect(cx2 - 8, cy2 + 8,  6, 2);
        ctx.fillRect(cx2 + 4, cy2 + 8,  6, 2);
        ctx.fillRect(cx2,     cy2,       2, 6);
        ctx.fillRect(cx2,     cy2 + 12,  2, 6);
      }
      break;
    }
    case "ground_pound": {
      // Spreading crack from boss, wider than ground_slam
      const spread2 = progress * (bossX - 10);
      ctx.fillStyle = "#ff2200";
      ctx.fillRect(bossX - spread2, GROUND_Y - 4, spread2, 4);
      for(let i = 0; i < Math.floor(spread2 / 16); i++) {
        const cx2 = bossX - spread2 + i * 16;
        ctx.fillRect(cx2, GROUND_Y - 9, 4, 5);
      }
      // Second wave hint
      ctx.globalAlpha = alpha * 0.4;
      ctx.fillStyle = "#ff0044";
      ctx.fillRect(bossX - spread2 * 0.6, GROUND_Y - 3, spread2 * 0.6, 3);
      break;
    }
    case "void_burst": {
      // Fan lines from boss — highlight the gap row in dark, others in purple
      const vbCount = attack._vbCount ?? 7;
      const vbGap   = attack._vbGap   ?? Math.floor(vbCount / 2);
      for(let i = 0; i < vbCount; i++) {
        const t   = i / (vbCount - 1);
        const fy  = GROUND_Y - 20 - t * (GROUND_Y - 40);
        const len2 = progress * 60;
        // Gap row shown as dark/empty, others as danger
        ctx.fillStyle = i === vbGap ? "#220033" : "#8800cc";
        ctx.fillRect(bossX - 50 - len2, fy, len2, 3);
        // Bright safe-gap marker
        if(i === vbGap) {
          ctx.globalAlpha = alpha * 0.5;
          ctx.fillStyle = "#00ff88";
          ctx.fillRect(0, fy - 6, bossX - 50, 14);
          ctx.globalAlpha = alpha;
        }
      }
      // Charge glow on boss
      ctx.globalAlpha = alpha * 0.3;
      ctx.fillStyle = "#cc00ff";
      ctx.fillRect(bossX - 30, bossY - 40, 60, 80);
      break;
    }
    case "tracking_beam": {
      // Sweeping red line preview from left edge to boss
      const sweepY = 20 + progress * (GROUND_Y - 40);
      ctx.fillStyle = "#cc1100";
      ctx.fillRect(0, sweepY, bossX - 10, 4);
      ctx.globalAlpha = alpha * 0.1;
      ctx.fillStyle = "#ff2200";
      ctx.fillRect(0, sweepY - 6, bossX - 10, 16);
      break;
    }
    case "spike_rain": {
      // Shadow columns where spikes will fall, gaps left clear
      const safeA = attack._srSafeA ?? 100;
      const safeB = attack._srSafeB ?? 420;
      const cols2 = 10;
      for(let i = 0; i < cols2; i++) {
        const sx = 20 + i * ((CANVAS_W - 40) / cols2);
        ctx.fillStyle = "#440011";
        ctx.fillRect(sx, 0, (CANVAS_W - 40) / cols2 - 4, GROUND_Y);
      }
      // Bright safe-zone markers at actual gap positions
      ctx.globalAlpha = alpha * 0.6;
      ctx.fillStyle = "#00ff88";
      ctx.fillRect(safeA - 44, GROUND_Y - 6, 88, 6);
      ctx.fillRect(safeB - 44, GROUND_Y - 6, 88, 6);
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
      case "tentacle_sweep":  drawTentacleSweep(ctx, p, frame);  break;
      case "tentacle_combo":  drawTentacleCombo(ctx, p, frame);  break;
      case "ground_pound":    drawGroundPound(ctx, p, frame);    break;
      case "void_burst":      drawVoidBurst(ctx, p, frame);      break;
      case "tracking_beam":   drawTrackingBeam(ctx, p, frame);   break;
      case "spike_rain":      drawSpikeRain(ctx, p, frame);      break;
      default: break;
    }
    ctx.restore();
  }
}
