import { useEffect, useRef, useState } from "react";
import { GRAVITY, JUMP_FORCE, GROUND_Y, DINO_W, DINO_H, CANVAS_W, CANVAS_H, DUCK_H } from "./constants";
import { drawDino } from "./rendering/drawDino";
import { drawBoss, drawGround } from "./rendering/drawWorld";
import { drawBossAttacks, drawBossTelegraph } from "./rendering/drawBossAttacks";
import { getHudColors } from "./utils/scenery";
import { SCENERIES } from "./data/collectionData.jsx";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const BOSS_MAX_HP   = 12;          // 4 hits per phase × 3 phases
const WIN_REWARD    = 5000;        // flat fossil reward on victory
const BOSS_X        = CANVAS_W * 0.72; // boss center X (right side)
const BOSS_Y        = GROUND_Y - 60;   // boss center Y (above ground)
const ABYSS_SCENERY = SCENERIES.find(s => s.id === "abyss") || SCENERIES[0];
const HUD           = getHudColors(ABYSS_SCENERY, 1);

// ─── ATTACK PATTERNS ─────────────────────────────────────────────────────────
// Each attack: { type, dodge, duration, warmup }
// type        = identifier used in spawn logic
// dodge       = hint shown to player
// duration    = frames the attack is active
// warmup      = frames of warning before projectiles spawn
const ATTACK_POOL = [
  { type:"wave_low",    dodge:"JUMP!",       duration:180, warmup:60  },
  { type:"wave_high",   dodge:"DUCK!",       duration:180, warmup:60  },
  { type:"aimed_shot",  dodge:"DASH!",       duration:120, warmup:50  },
  { type:"ground_slam", dodge:"JUMP!",       duration:150, warmup:70  },
  { type:"ceiling_drop",dodge:"STAY LOW!",   duration:150, warmup:70  },
  { type:"void_orb",    dodge:"MOVE!",       duration:200, warmup:40  },
  { type:"tentacle",    dodge:"JUMP HIGH!",  duration:160, warmup:55  },
];

// Phase 0 uses first 3, phase 1 uses first 5, phase 2 uses all
const ATTACKS_BY_PHASE = [
  ATTACK_POOL.slice(0, 3),
  ATTACK_POOL.slice(0, 5),
  ATTACK_POOL,
];

// Barrage = 2–4 attacks in sequence, then a blind window
const BARRAGE_SIZE = [2, 3, 4]; // by phase

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function pickAttack(phase) {
  const pool = ATTACKS_BY_PHASE[phase];
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildBarrage(phase) {
  const size = BARRAGE_SIZE[phase];
  return Array.from({ length: size }, () => pickAttack(phase));
}

// ─── INITIAL BOSS STATE ───────────────────────────────────────────────────────
export function initBossState(stats, skin, design, lives) {
  return {
    // Dino
    dino: {
      x: 80, y: GROUND_Y - DINO_H, vy: 0,
      onGround: true, doubleJumped: false,
      dashTimer: 0, dashDir: 0, dashCooldown: 0,
      ducking: false, invTimer: 0,
    },
    lives,
    stats,
    skin,
    design,
    // Boss
    bossHp:    BOSS_MAX_HP,
    bossPhase: 0,           // 0/1/2
    hitFlash:  0,           // frames of red flash after being hit
    // Attack sequencing
    barrage:      [],       // current queue of attacks
    attackIndex:  0,
    attackTimer:  0,        // counts up within current attack
    blindTimer:   0,        // counts down during blind window
    blindWindow:  false,
    barrageGap:   0,        // short pause between barrages
    // Projectiles on screen
    projectiles: [],
    // Particles (explosions, impacts)
    particles: [],
    // Screen shake
    shake: { x: 0, y: 0, trauma: 0 },
    // Phase transition flash
    phaseFlash: 0,
    // Bite
    biteCooldown: 0,
    biteFlash:    0,        // visual feedback on successful bite
    // Misc
    frame:        0,
    groundOffset: 0,
    alive:        true,
    won:          false,
    floatingTexts:[],
  };
}

// ─── SPAWN PROJECTILES ────────────────────────────────────────────────────────
function spawnAttack(gs, attack) {
  const phase = gs.bossPhase;
  const spd   = 4 + phase * 1.2;

  switch(attack.type) {
    case "wave_low":
      // 3 horizontal projectiles at ground level, staggered
      for(let i = 0; i < 3 + phase; i++) {
        gs.projectiles.push({
          x: BOSS_X - 40 - i * 80, y: GROUND_Y - 18,
          vx: -(spd + i * 0.4), vy: 0,
          w: 14, h: 14, type: "wave_low",
        });
      }
      break;

    case "wave_high":
      // 3 projectiles at mid-air height
      for(let i = 0; i < 3 + phase; i++) {
        gs.projectiles.push({
          x: BOSS_X - 40 - i * 80, y: GROUND_Y - 90 - Math.random() * 30,
          vx: -(spd + i * 0.4), vy: 0,
          w: 14, h: 14, type: "wave_high",
        });
      }
      break;

    case "aimed_shot":
      // Single fast shot aimed at dino's current Y
      gs.projectiles.push({
        x: BOSS_X - 50, y: gs.dino.y + DINO_H / 2,
        vx: -(spd * 1.8), vy: 0,
        w: 10, h: 10, type: "aimed_shot",
      });
      if(phase >= 1) {
        gs.projectiles.push({
          x: BOSS_X - 50, y: gs.dino.y + DINO_H / 2 - 20,
          vx: -(spd * 1.6), vy: 0,
          w: 10, h: 10, type: "aimed_shot",
        });
      }
      break;

    case "ground_slam":
      // Shockwave along the floor — must jump over it
      gs.projectiles.push({
        x: BOSS_X - 20, y: GROUND_Y - 10,
        vx: -(spd * 1.4), vy: 0,
        w: 40, h: 20, type: "ground_slam",
      });
      if(phase >= 2) {
        gs.projectiles.push({
          x: BOSS_X - 20, y: GROUND_Y - 10,
          vx: -(spd * 0.9), vy: 0,
          w: 40, h: 20, type: "ground_slam",
        });
      }
      break;

    case "ceiling_drop":
      // Debris falls from top — stay low / duck
      for(let i = 0; i < 3 + phase; i++) {
        gs.projectiles.push({
          x: 80 + Math.random() * (CANVAS_W - 200),
          y: -20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 3 + Math.random() * 2 + phase,
          w: 16, h: 16, type: "ceiling_drop",
        });
      }
      break;

    case "void_orb":
      // Slow homing orb that drifts toward dino
      gs.projectiles.push({
        x: BOSS_X - 60, y: BOSS_Y - 20,
        vx: -2, vy: 0,
        w: 18, h: 18, type: "void_orb",
        homing: true,
      });
      if(phase >= 2) {
        gs.projectiles.push({
          x: BOSS_X - 60, y: BOSS_Y + 10,
          vx: -1.8, vy: 0,
          w: 18, h: 18, type: "void_orb",
          homing: true,
        });
      }
      break;

    case "tentacle":
      // Ground-level sweeping tentacle — must jump + double jump
      gs.projectiles.push({
        x: BOSS_X - 30, y: GROUND_Y - 30,
        vx: -(spd * 1.2), vy: 0,
        w: 60, h: 30, type: "tentacle",
      });
      break;

    default: break;
  }
}

// ─── PARTICLE HELPERS ────────────────────────────────────────────────────────
function spawnExplosion(gs, x, y, col1, col2, count = 10) {
  for(let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const spd   = 1.5 + Math.random() * 3.5;
    gs.particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - 1,
      life: 20 + Math.random() * 25,
      maxLife: 45,
      size: 2 + Math.floor(Math.random() * 4),
      col: Math.random() < 0.5 ? col1 : col2,
    });
  }
}

function spawnShockwave(gs, x, y) {
  // A single expanding ring particle
  gs.particles.push({ x, y, vx: 0, vy: 0, life: 30, maxLife: 30, size: 4, col: "#ff4400", ring: true, r: 10 });
}

function addShake(gs, trauma) {
  gs.shake.trauma = Math.min(1, gs.shake.trauma + trauma);
}

// ─── TICK (update) ────────────────────────────────────────────────────────────
export function tickBoss(gs, keys, prevKeys, dt, onDeath, onWin) {
  if(!gs.alive || gs.won) return;

  // ── Screen shake decay ────────────────────────────────────────────────────────────
  gs.shake.trauma = Math.max(0, gs.shake.trauma - 0.04 * dt);
  const shakeAmt  = gs.shake.trauma * gs.shake.trauma * 14;
  gs.shake.x = (Math.random() * 2 - 1) * shakeAmt;
  gs.shake.y = (Math.random() * 2 - 1) * shakeAmt;

  // ── Phase flash decay ────────────────────────────────────────────────────────────
  if(gs.phaseFlash > 0) gs.phaseFlash -= dt;

  gs.frame++;
  gs.groundOffset = (gs.groundOffset + 2 * dt) % (CANVAS_W * 4);

  // ── Dino physics ────────────────────────────────────────────────────────────
  const d = gs.dino;
  if(d.invTimer > 0) d.invTimer -= dt;
  if(d.dashCooldown > 0) d.dashCooldown -= dt;

  // Jump
  if((keys["Space"] || keys["ArrowUp"] || keys["KeyW"]) &&
     !(prevKeys["Space"] || prevKeys["ArrowUp"] || prevKeys["KeyW"])) {
    if(d.ducking) { d.ducking = false; }
    else if(d.onGround) {
      d.vy = JUMP_FORCE - (gs.stats.jumpBoost || 0) * 0.42;
      d.onGround = false; d.doubleJumped = false;
    } else if(gs.stats.hasDoubleJump && !d.doubleJumped) {
      d.vy = JUMP_FORCE - (gs.stats.jumpBoost || 0) * 0.28;
      d.doubleJumped = true;
    }
  }

  // Dash forward
  if(gs.stats.hasDash && keys["ArrowRight"] && !prevKeys["ArrowRight"] &&
     d.dashTimer <= 0 && d.dashCooldown <= 0) {
    d.dashTimer = 10; d.dashDir = 1;
    d.dashCooldown = Math.max(15, 45 - (gs.stats.dashCdReduction || 0));
  }
  // Dash backward
  if(gs.stats.hasBackDash && keys["ArrowLeft"] && !prevKeys["ArrowLeft"] &&
     d.dashTimer <= 0 && d.dashCooldown <= 0) {
    d.dashTimer = 10; d.dashDir = -1;
    d.dashCooldown = Math.max(15, 45 - (gs.stats.dashCdReduction || 0));
  }
  // Duck
  if(gs.stats.hasDuck && d.onGround) {
    d.ducking = !!(keys["ArrowDown"] || keys["KeyS"]);
  } else if(!d.onGround) {
    if(gs.stats.hasFastDrop && (keys["ArrowDown"] || keys["KeyS"])) d.vy += GRAVITY * 2.5 * dt;
    d.ducking = false;
  }

  d.vy += GRAVITY * dt;
  d.y  += d.vy * dt;
  if(d.dashTimer > 0) {
    d.x += d.dashDir * 7 * dt;
    d.dashTimer -= dt;
    d.x = Math.max(10, Math.min(CANVAS_W * 0.55, d.x));
  }
  if(d.y >= GROUND_Y - DINO_H) {
    d.y = GROUND_Y - DINO_H; d.vy = 0;
    d.onGround = true; d.doubleJumped = false;
  }

  // ── Bite ────────────────────────────────────────────────────────────────────
  if(gs.biteCooldown > 0) gs.biteCooldown -= dt;
  if(gs.biteFlash > 0)    gs.biteFlash -= dt;

  const bitePressed = keys["KeyF"] && !prevKeys["KeyF"];
  if(bitePressed && gs.biteCooldown <= 0 && gs.stats.hasBite) {
    gs.biteCooldown = 45; // ~0.75s cooldown
    if(gs.blindWindow) {
      // Hit! damage boss
      gs.bossHp = Math.max(0, gs.bossHp - 1);
      gs.biteFlash = 12;
      gs.floatingTexts.push({ text: "BITE!", x: d.x, y: d.y - 28, vy: -1.4, life: 55, maxLife: 55, color: "#ffdd00" });
      // Bite impact particles on boss
      spawnExplosion(gs, BOSS_X, BOSS_Y - 10, "#ffdd00", "#ff8800", 14);
      addShake(gs, 0.35);
      // Phase transitions
      const newPhase = gs.bossHp <= 4 ? 2 : gs.bossHp <= 8 ? 1 : 0;
      if(newPhase > gs.bossPhase) {
        gs.bossPhase = newPhase;
        gs.phaseFlash = 25;
        gs.floatingTexts.push({ text: `PHASE ${newPhase + 1}!`, x: CANVAS_W / 2 - 30, y: 60, vy: -0.8, life: 90, maxLife: 90, color: "#ff4400" });
        spawnExplosion(gs, BOSS_X, BOSS_Y, "#ff2200", "#ff8800", 28);
        spawnShockwave(gs, BOSS_X, BOSS_Y);
        addShake(gs, 0.9);
      }
      if(gs.bossHp <= 0) { gs.won = true; onWin(); return; }
      // End blind window after a hit
      gs.blindWindow = false;
      gs.blindTimer  = 0;
      gs.barrage     = [];
      gs.barrageGap  = 90;
    } else {
      gs.floatingTexts.push({ text: "MISS!", x: d.x, y: d.y - 28, vy: -1.4, life: 40, maxLife: 40, color: "#888888" });
    }
  }

  // ── Attack sequencing ────────────────────────────────────────────────────────
  if(gs.barrageGap > 0) {
    gs.barrageGap -= dt;
  } else if(gs.blindWindow) {
    gs.blindTimer -= dt;
    if(gs.blindTimer <= 0) {
      gs.blindWindow = false;
      gs.barrageGap  = 60 + Math.random() * 60;
    }
  } else {
    // Build new barrage if empty
    if(gs.barrage.length === 0) {
      gs.barrage      = buildBarrage(gs.bossPhase);
      gs.attackIndex  = 0;
      gs.attackTimer  = 0;
    }

    const currentAttack = gs.barrage[gs.attackIndex];
    gs.attackTimer += dt;

    // Spawn projectiles after warmup (use threshold, not exact equality)
    if(gs.attackTimer >= currentAttack.warmup && gs.attackTimer - dt < currentAttack.warmup) {
      spawnAttack(gs, currentAttack);
    }

    // Advance to next attack in barrage
    if(gs.attackTimer >= currentAttack.duration) {
      gs.attackTimer = 0;
      gs.attackIndex++;
      if(gs.attackIndex >= gs.barrage.length) {
        // Barrage done — open blind window
        gs.barrage      = [];
        gs.blindWindow  = true;
        const windowLen = Math.max(55, 90 - gs.bossPhase * 15);
        gs.blindTimer   = windowLen;
        gs.projectiles  = []; // clear screen for the window
      }
    }
  }

  // ── Move projectiles ─────────────────────────────────────────────────────────
  gs.projectiles = gs.projectiles.filter(p => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    // Homing orbs drift toward dino
    if(p.homing) {
      const dy = (d.y + DINO_H / 2) - (p.y + p.h / 2);
      p.vy += Math.sign(dy) * 0.08 * dt;
      p.vy  = Math.max(-3, Math.min(3, p.vy));
    }
    // Ceiling drops stop at ground
    if(p.type === "ceiling_drop" && p.y + p.h >= GROUND_Y) {
      p.y = GROUND_Y - p.h; p.vy = 0;
      p._landed = (p._landed || 0) + dt;
      if(p._landed > 60) return false;
    }
    // Spawn small impact burst when projectile exits left edge
    if(p.x + p.w < 0 && !p._exited) {
      p._exited = true;
      spawnExplosion(gs, 8, p.y + p.h/2, "#660000", "#330000", 5);
    }
    return p.x > -80 && p.x < CANVAS_W + 40 && p.y < GROUND_Y + 20;
  });

  // ── Projectile collision ──────────────────────────────────────────────────────
  if(d.invTimer <= 0) {
    const effH = d.ducking ? DUCK_H : DINO_H;
    const DW = DINO_W - 14, DH = effH * 0.82;
    const DX = d.x + DINO_W / 2 - DW / 2, DY = d.y + DINO_H - effH;

    for(let i = gs.projectiles.length - 1; i >= 0; i--) {
      const p = gs.projectiles[i];
      if(p._landed) continue; // landed debris only hurts if still falling
      const hit = DX < p.x + p.w && DX + DW > p.x && DY < p.y + p.h && DY + DH > p.y;
      if(hit) {
        gs.projectiles.splice(i, 1);
        if(gs.lives > 1) {
          gs.lives--;
          d.invTimer = 40;
          spawnExplosion(gs, d.x + DINO_W/2, d.y + DINO_H/2, "#ff2244", "#ff8800", 10);
          addShake(gs, 0.55);
          gs.floatingTexts.push({ text: "-1 LIFE", x: d.x, y: d.y - 24, vy: -1.4, life: 55, maxLife: 55, color: "#ee3344" });
        } else {
          spawnExplosion(gs, d.x + DINO_W/2, d.y + DINO_H/2, "#ff2244", "#ffffff", 18);
          addShake(gs, 1.0);
          gs.alive = false;
          onDeath();
          return;
        }
        break;
      }
    }
  }

  // ── Tick particles ────────────────────────────────────────────────────────────
  gs.particles = gs.particles.filter(p => {
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.vy += 0.18 * dt; // gravity on particles
    if(p.ring) p.r += 4 * dt;
    p.life -= dt;
    return p.life > 0;
  });

  // ── Floating texts ────────────────────────────────────────────────────────────
  gs.floatingTexts = gs.floatingTexts.filter(t => {
    t.y += t.vy * dt; t.life -= dt; return t.life > 0;
  });
}

// ─── RENDER ───────────────────────────────────────────────────────────────────
function renderBoss(ctx, gs) {
  const f = gs.frame;

  // ── Apply screen shake ──
  ctx.save();
  ctx.translate(Math.round(gs.shake.x), Math.round(gs.shake.y));

  // ── Living void background ──
  // Deep purple void instead of pure black
  ctx.fillStyle = "#0d0018";
  ctx.fillRect(-20, -20, CANVAS_W + 40, CANVAS_H + 40);

  // Ambient tendrils radiating from boss, intensify per phase
  const tendrilCount = 6 + gs.bossPhase * 4;
  for(let i = 0; i < tendrilCount; i++) {
    const angle = (i / tendrilCount) * Math.PI * 2 + f * 0.004;
    const len   = 70 + gs.bossPhase * 35 + Math.sin(f * 0.02 + i) * 20;
    ctx.globalAlpha = 0.10 + gs.bossPhase * 0.04;
    ctx.fillStyle = "#6600cc";
    for(let s = 0; s < 5; s++) {
      const r  = (s / 5) * len;
      const px = Math.round(BOSS_X + Math.cos(angle + s * 0.15) * r);
      const py = Math.round(BOSS_Y + Math.sin(angle + s * 0.15) * r);
      ctx.fillRect(px - 2, py - 2, 5 - s, 5 - s);
    }
  }
  ctx.globalAlpha = 1;

  // Floating void particles in background
  const particleSeed = Math.floor(f * 0.3);
  for(let i = 0; i < 12; i++) {
    const px = ((i * 137 + particleSeed * 7) % CANVAS_W);
    const py = ((i * 89  + particleSeed * 3) % (GROUND_Y - 20));
    ctx.globalAlpha = 0.15 + (i % 3) * 0.08;
    ctx.fillStyle = i % 2 === 0 ? "#8833cc" : "#cc44ff";
    ctx.fillRect(px, py, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Pulsing purple vignette (much more visible than red)
  const vigAmt = (0.10 + gs.bossPhase * 0.05) + Math.sin(f * 0.025) * 0.04;
  ctx.fillStyle = `rgba(60,0,100,${vigAmt})`;
  ctx.fillRect(-20, -20, CANVAS_W + 40, CANVAS_H + 40);

  // Phase 2: red scanlines
  if(gs.bossPhase >= 2) {
    const distAmt = Math.sin(f * 0.15) * 0.04 + 0.04;
    ctx.fillStyle = `rgba(120,0,60,${distAmt})`;
    for(let y = 0; y < CANVAS_H; y += 4) ctx.fillRect(-20, y, CANVAS_W + 40, 2);
  }

  // Phase transition flash
  if(gs.phaseFlash > 0) {
    ctx.fillStyle = `rgba(180,50,255,${(gs.phaseFlash / 25) * 0.65})`;
    ctx.fillRect(-20, -20, CANVAS_W + 40, CANVAS_H + 40);
  }

  // ── Ground ──
  drawGround(ctx, gs.groundOffset, ABYSS_SCENERY, 1);

  // ── Boss ──
  const hpFrac = gs.bossHp / BOSS_MAX_HP;
  drawBoss(ctx, BOSS_X, BOSS_Y, f, gs.bossPhase, hpFrac, gs.blindWindow, gs.hitFlash);
  if(gs.hitFlash > 0) gs.hitFlash--;

  // ── Telegraph ──
  if(!gs.blindWindow && gs.barrage.length > 0 && gs.attackIndex < gs.barrage.length) {
    const atk = gs.barrage[gs.attackIndex];
    if(gs.attackTimer < atk.warmup)
      drawBossTelegraph(ctx, atk, gs.attackTimer, atk.warmup, BOSS_X, BOSS_Y, gs.dino.x + 20, gs.dino.y + 24, f);
  }

  // ── Projectiles ──
  drawBossAttacks(ctx, gs.projectiles, f);

  // ── Particles ──
  for(const p of gs.particles) {
    const a = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = a;
    if(p.ring) {
      ctx.strokeStyle = p.col;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.col;
      ctx.fillRect(Math.round(p.x - p.size / 2), Math.round(p.y - p.size / 2), p.size, p.size);
    }
  }
  ctx.globalAlpha = 1;

  // ── Dino ──
  drawDino(ctx, gs.dino.x, gs.dino.y, f, false,
    gs.skin, gs.design, false, gs.dino.ducking, false, false,
    gs.dino.invTimer, gs.dino.onGround, null);

  // ── Floating texts ──
  for(const t of gs.floatingTexts) {
    const a = Math.min(1, t.life / t.maxLife * 2);
    ctx.globalAlpha = a;
    ctx.fillStyle = t.color;
    ctx.font = "bold 11px 'Courier New'";
    ctx.fillText(t.text, t.x, t.y);
    ctx.globalAlpha = 1;
  }

  // ── Restore shake transform (HUD drawn outside shake) ──
  ctx.restore();

  // ── HUD — lives ──
  const heartSize = 14, heartGap = 4;
  const totalW = gs.lives * (heartSize + heartGap) - heartGap;
  const startX = CANVAS_W - totalW - 8, heartY = CANVAS_H - heartSize - 8;
  for(let i = 0; i < gs.lives; i++) {
    const hx = startX + i * (heartSize + heartGap), hy = heartY;
    ctx.fillStyle = "#ff2244";
    ctx.fillRect(hx + 1, hy,     6,  4);
    ctx.fillRect(hx + 7, hy,     6,  4);
    ctx.fillRect(hx,     hy + 3, 14, 5);
    ctx.fillRect(hx + 1, hy + 8, 12, 3);
    ctx.fillRect(hx + 3, hy + 11, 8, 2);
    ctx.fillRect(hx + 5, hy + 13, 4, 1);
  }

  // ── HUD — bite cooldown bar ──
  if(gs.stats.hasBite) {
    const biteReady = gs.biteCooldown <= 0;
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(8, CANVAS_H - 28, 60, 6);
    ctx.fillStyle = biteReady ? "#ffdd00" : "#884400";
    const frac = biteReady ? 1 : 1 - gs.biteCooldown / 45;
    ctx.fillRect(8, CANVAS_H - 28, Math.floor(60 * frac), 6);
    ctx.fillStyle = biteReady ? "#ffdd00" : "#666";
    ctx.font = "bold 9px 'Courier New'";
    ctx.fillText(biteReady ? "[F] BITE READY" : "[F] BITE...", 8, CANVAS_H - 14);
  }

  // ── HUD — dodge hint during telegraph ──
  if(!gs.blindWindow && gs.barrage.length > 0 && gs.attackIndex < gs.barrage.length) {
    const atk = gs.barrage[gs.attackIndex];
    if(gs.attackTimer < atk.warmup) {
      ctx.globalAlpha = 0.5 + Math.sin(f * 0.35) * 0.5;
      ctx.fillStyle = "#ff4400";
      ctx.font = "bold 11px 'Courier New'";
      ctx.textAlign = "center";
      ctx.fillText(atk.dodge, CANVAS_W / 2, CANVAS_H - 10);
      ctx.textAlign = "left";
      ctx.globalAlpha = 1;
    }
  }

  // ── HUD — blind window prompt ──
  if(gs.blindWindow) {
    ctx.fillStyle = `rgba(255,220,0,${0.7 + Math.sin(f * 0.3) * 0.3})`;
    ctx.font = "bold 13px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText("BLIND SPOT! PRESS [F] TO BITE!", CANVAS_W / 2, 40);
    ctx.textAlign = "left";
  }

  // ── Phase label ──
  ctx.fillStyle = "rgba(255,50,0,0.5)";
  ctx.font = "9px 'Courier New'";
  ctx.fillText(`PHASE ${gs.bossPhase + 1}  |  HP ${gs.bossHp}/${BOSS_MAX_HP}`, 8, 20);
}

// ─── REACT COMPONENT ──────────────────────────────────────────────────────────





// ─── CRACK OVERLAY ────────────────────────────────────────────────────────────
// Pixel-art cracks radiating outward from the canvas border into the BG.
// Built from chains of 3x3 pixel rects — pure pixel aesthetic.
function CrackOverlay() {
  const PX = 3; // pixel block size

  // Each crack: { ox, oy, steps, col }
  // ox/oy = origin on the border edge (canvas coords 720x270)
  // steps = array of [dx,dy] in pixel-block units (each unit = PX px)
  // col   = color of this crack
  const CRACKS = [
    // ── TOP EDGE (y=0, going up into negative y) ──────────────────────────
    { ox:50,  oy:0, col:"#2a0044", steps:[[0,-1],[1,-1],[0,-1],[-1,-1],[0,-2],[1,-1]] },
    { ox:110, oy:0, col:"#0d0018", steps:[[0,-1],[0,-1],[1,-1],[0,-1]] },
    { ox:180, oy:0, col:"#4a0077", steps:[[0,-1],[-1,-1],[0,-2],[1,-1],[0,-1],[1,-1],[0,-1]] },
    { ox:240, oy:0, col:"#1a0030", steps:[[0,-1],[1,-1],[0,-1],[0,-1]] },
    { ox:310, oy:0, col:"#6622aa", steps:[[0,-1],[0,-1],[-1,-1],[0,-2],[1,-1],[0,-1],[-1,-1],[0,-1]] },
    { ox:370, oy:0, col:"#2a0044", steps:[[0,-1],[1,-1],[0,-1]] },
    { ox:430, oy:0, col:"#3a0066", steps:[[0,-1],[-1,-1],[0,-1],[1,-1],[0,-2],[0,-1]] },
    { ox:500, oy:0, col:"#0d0018", steps:[[0,-1],[0,-1],[1,-1],[0,-1],[-1,-1]] },
    { ox:560, oy:0, col:"#5a0099", steps:[[0,-1],[1,-1],[0,-1],[0,-2],[-1,-1],[0,-1],[1,-1],[0,-1]] },
    { ox:620, oy:0, col:"#1a0030", steps:[[0,-1],[-1,-1],[0,-1],[0,-1]] },
    { ox:680, oy:0, col:"#4a0077", steps:[[0,-1],[0,-1],[1,-1],[0,-2],[0,-1]] },

    // ── BOTTOM EDGE (y=270, going down) ───────────────────────────────────
    { ox:30,  oy:270, col:"#3a0066", steps:[[0,1],[1,1],[0,1],[-1,1],[0,2]] },
    { ox:90,  oy:270, col:"#0d0018", steps:[[0,1],[0,1],[-1,1],[0,1]] },
    { ox:155, oy:270, col:"#5a0099", steps:[[0,1],[1,1],[0,2],[-1,1],[0,1],[1,1],[0,1]] },
    { ox:220, oy:270, col:"#2a0044", steps:[[0,1],[-1,1],[0,1],[0,1]] },
    { ox:285, oy:270, col:"#7733bb", steps:[[0,1],[0,1],[1,1],[0,2],[-1,1],[0,1],[1,1],[0,1]] },
    { ox:350, oy:270, col:"#1a0030", steps:[[0,1],[1,1],[0,1]] },
    { ox:415, oy:270, col:"#4a0077", steps:[[0,1],[-1,1],[0,1],[1,1],[0,2],[0,1]] },
    { ox:480, oy:270, col:"#0d0018", steps:[[0,1],[0,1],[-1,1],[0,1],[1,1]] },
    { ox:545, oy:270, col:"#6622aa", steps:[[0,1],[1,1],[0,1],[0,2],[-1,1],[0,1]] },
    { ox:610, oy:270, col:"#2a0044", steps:[[0,1],[-1,1],[0,1],[0,1]] },
    { ox:670, oy:270, col:"#3a0066", steps:[[0,1],[0,1],[1,1],[0,2]] },

    // ── LEFT EDGE (x=0, going left) ───────────────────────────────────────
    { ox:0, oy:30,  col:"#2a0044", steps:[[-1,0],[-1,1],[-1,0],[-2,0],[-1,-1]] },
    { ox:0, oy:70,  col:"#0d0018", steps:[[-1,0],[-1,0],[-1,1],[-1,0]] },
    { ox:0, oy:110, col:"#5a0099", steps:[[-1,0],[-1,-1],[-2,0],[-1,1],[-1,0],[-1,-1],[-1,0]] },
    { ox:0, oy:150, col:"#1a0030", steps:[[-1,0],[-1,1],[-1,0],[-1,0]] },
    { ox:0, oy:190, col:"#6622aa", steps:[[-1,0],[-2,0],[-1,-1],[-1,0],[-1,1],[-2,0],[-1,0]] },
    { ox:0, oy:230, col:"#3a0066", steps:[[-1,0],[-1,1],[-1,0],[-2,0]] },

    // ── RIGHT EDGE (x=720, going right) ───────────────────────────────────
    { ox:720, oy:20,  col:"#3a0066", steps:[[1,0],[1,-1],[2,0],[1,1],[1,0]] },
    { ox:720, oy:60,  col:"#0d0018", steps:[[1,0],[1,0],[1,-1],[1,0]] },
    { ox:720, oy:100, col:"#4a0077", steps:[[1,0],[2,0],[1,1],[1,0],[1,-1],[1,0]] },
    { ox:720, oy:140, col:"#1a0030", steps:[[1,0],[1,1],[1,0],[1,0]] },
    { ox:720, oy:180, col:"#7733bb", steps:[[1,0],[1,-1],[2,0],[1,0],[1,1],[2,0],[1,0]] },
    { ox:720, oy:220, col:"#2a0044", steps:[[1,0],[2,0],[1,-1],[1,0]] },
    { ox:720, oy:255, col:"#5a0099", steps:[[1,0],[1,1],[1,0],[2,0],[1,-1]] },
  ];

  // Build rect elements for each crack
  const rects = [];
  CRACKS.forEach((crack, ci) => {
    let x = crack.ox, y = crack.oy;
    // Starting block right on the border
    rects.push(
      <rect key={`${ci}_0`} x={x} y={y} width={PX} height={PX}
        fill={crack.col} opacity="0.9" shapeRendering="crispEdges" />
    );
    crack.steps.forEach(([dx, dy], si) => {
      x += dx * PX;
      y += dy * PX;
      // Fade slightly toward the tip
      const op = Math.max(0.4, 0.9 - si * 0.07);
      rects.push(
        <rect key={`${ci}_${si+1}`} x={x} y={y} width={PX} height={PX}
          fill={crack.col} opacity={op.toFixed(2)} shapeRendering="crispEdges" />
      );
    });
  });

  return (
    <svg
      viewBox="0 0 720 270"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: "-5%",
        width: "110%",
        height: "110%",
        pointerEvents: "none",
        zIndex: 10,
        overflow: "visible",
        imageRendering: "pixelated",
      }}
    >
      {rects}
    </svg>
  );
}

export default function BossFightScreen({
  skin, design, stats, lives,
  onWin, onDeath, onMenu,
  fossils,
  notification, achivNotif,
}) {
  const canvasRef   = useRef(null);
  const gsRef       = useRef(null);
  const animRef     = useRef(null);
  const lastTimeRef = useRef(null);
  const keysRef     = useRef({});
  const prevKeysRef = useRef({});
  const [overlay, setOverlay] = useState(null); // null | "won" | "dead"
  const overlayRef  = useRef(null); // mirrors overlay without causing loop re-run

  const triggerOverlay = (val) => {
    overlayRef.current = val;
    setOverlay(val);
  };

  const F      = "'Courier New', monospace";
  const DARK   = "#1a1a1a";
  const BG     = "#f0ede6";
  const BORDER = "#2a2a2a";
  const MUTED  = "#888";

  const notifBox     = { position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:DARK, color:BG, padding:"9px 22px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #555" };
  const achivNotifBox= { position:"fixed", top:24,    left:"50%", transform:"translateX(-50%)", background:"#1a1a2a", color:"#ffdd44", padding:"10px 24px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #ffdd44" };

  // Key listeners — separate stable effect
  useEffect(() => {
    const onDown = e => {
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyW","KeyS","KeyF"].includes(e.code)) e.preventDefault();
      keysRef.current[e.code] = true;
    };
    const onUp = e => { keysRef.current[e.code] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup",   onUp);
    };
  }, []);

  // Init game state + main loop (merged to guarantee init before first tick)
  useEffect(() => {
    gsRef.current = initBossState(stats, skin, design, lives);
    keysRef.current = {};
    prevKeysRef.current = {};

    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");

    const loop = ts => {
      if(!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = Math.min((ts - lastTimeRef.current) / 16.67, 3);
      lastTimeRef.current = ts;

      const gs = gsRef.current;
      if(!gs) { animRef.current = requestAnimationFrame(loop); return; }

      if(gs.alive && !gs.won) {
        tickBoss(
          gs,
          keysRef.current,
          prevKeysRef.current,
          dt,
          () => triggerOverlay("dead"),
          () => triggerOverlay("won"),
        );
        prevKeysRef.current = { ...keysRef.current };
      }

      renderBoss(ctx, gs);
      animRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = null;
    animRef.current = requestAnimationFrame(loop);
    return () => { if(animRef.current) cancelAnimationFrame(animRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const btn = (primary=false) => ({
    background: primary ? "#1a1a1a" : "#f0ede6",
    color:      primary ? "#f0ede6" : "#1a1a1a",
    border: "2px solid #2a2a2a",
    padding: "10px 20px", fontSize:12, fontFamily:F,
    cursor:"pointer", letterSpacing:2, fontWeight:"bold",
  });

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden" }}>
      <div style={{ width:"100%", maxWidth:CANVAS_W, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 0 20px" }}>

        {/* Top bar — same style as regular game screen */}
        <div style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 4px", boxSizing:"border-box", fontFamily:F, fontSize:11, color:MUTED }}>
          <span style={{ letterSpacing:3, fontSize:10 }}>THE ABYSS</span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:14, color:DARK }}>◈</span>
            <b style={{ color:DARK, fontSize:13 }}>{Math.floor(fossils)}</b>
          </span>
        </div>

        <div style={{ border:`2px solid ${BORDER}`, lineHeight:0, width:"100%", position:"relative" }}>
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{ display:"block", width:"100%" }} />
          <CrackOverlay />


          {/* Win overlay */}
          {overlay === "won" && (
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
              <div style={{ fontSize:10, letterSpacing:4, color:"#ffdd44" }}>VICTORY</div>
              <div style={{ fontSize:22, fontWeight:"bold", color:"#ffdd44", letterSpacing:2 }}>YOU SURVIVED</div>
              <div style={{ fontSize:12, color:"#ffaa44", letterSpacing:2 }}>+{WIN_REWARD} FOSSILS</div>
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <button style={btn(true)}  onClick={onWin}>[ CLAIM REWARD ]</button>
                <button style={btn(false)} onClick={onMenu}>[ MENU ]</button>
              </div>
            </div>
          )}

          {/* Death overlay */}
          {overlay === "dead" && (
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
              <div style={{ fontSize:10, letterSpacing:4, color:"#cc0000" }}>DEFEATED</div>
              <div style={{ fontSize:22, fontWeight:"bold", color:"#cc0000", letterSpacing:2 }}>IT CONSUMED YOU</div>
              <div style={{ fontSize:10, color:"#880000", letterSpacing:2, maxWidth:300, textAlign:"center" }}>
                Upgrade your skills and try again.
              </div>
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <button style={btn(true)}  onClick={onDeath}>[ TRY AGAIN ]</button>
                <button style={btn(false)} onClick={onMenu}>[ MENU ]</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {notification  && <div style={notifBox}>{notification}</div>}
      {achivNotif    && <div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );
}
