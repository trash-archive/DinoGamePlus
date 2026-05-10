// ─── BOSS TICK ────────────────────────────────────────────────────────────────
import { GRAVITY, JUMP_FORCE, GROUND_Y, DINO_W, DINO_H, CANVAS_W, DUCK_H } from "../constants";
import { BOSS_MAX_HP, BOSS_X, BOSS_Y, BOSS_POSITIONS, BITE_RANGE,
         BLIND_DURATION, BARRAGE_GAP, TELEPORT_FLICKER, buildBarrage } from "./bossConstants";
import { playBite } from "../hooks/useSoundEffects";

// ─── PARTICLE HELPERS ─────────────────────────────────────────────────────────
export function spawnExplosion(gs, x, y, col1, col2, count = 10) {
  for(let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const spd   = 1.5 + Math.random() * 3.5;
    gs.particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - 1,
      life: 20 + Math.random() * 25, maxLife: 45,
      size: 2 + Math.floor(Math.random() * 4),
      col: Math.random() < 0.5 ? col1 : col2,
    });
  }
}

export function spawnShockwave(gs, x, y) {
  gs.particles.push({ x, y, vx:0, vy:0, life:30, maxLife:30, size:4, col:"#ff4400", ring:true, r:10 });
}

export function addShake(gs, trauma) {
  gs.shake.trauma = Math.min(1, gs.shake.trauma + trauma);
}

// ─── SPAWN PROJECTILES ────────────────────────────────────────────────────────
function spawnAttack(gs, attack) {
  const phase = gs.bossPhase;
  const spd = 4 + phase * 1.5; // was 1.2 — faster projectiles each phase

  const bx = gs.bossX, by = gs.bossY;
  switch(attack.type) {
    case "wave_low":
      for(let i = 0; i < 3 + phase; i++)
        gs.projectiles.push({ x: bx-40-i*80, y: GROUND_Y-18, vx:-(spd+i*0.4), vy:0, w:14, h:14, type:"wave_low" });
      break;
    case "wave_high":
      for(let i = 0; i < 3 + phase; i++)
        gs.projectiles.push({ x: bx-40-i*80, y: GROUND_Y-90-Math.random()*30, vx:-(spd+i*0.4), vy:0, w:14, h:14, type:"wave_high" });
      break;
    case "aimed_shot":
      gs.projectiles.push({ x:bx-50, y:gs.dino.y+DINO_H/2, vx:-(spd*1.8), vy:0, w:10, h:10, type:"aimed_shot" });
      if(phase >= 1)
        gs.projectiles.push({ x:bx-50, y:gs.dino.y+DINO_H/2-20, vx:-(spd*1.6), vy:0, w:10, h:10, type:"aimed_shot" });
      break;
    case "ground_slam":
      gs.projectiles.push({ x:bx-20, y:GROUND_Y-10, vx:-(spd*1.4), vy:0, w:40, h:20, type:"ground_slam" });
      if(phase >= 2)
        gs.projectiles.push({ x:bx-20, y:GROUND_Y-10, vx:-(spd*0.9), vy:0, w:40, h:20, type:"ground_slam" });
      break;
    case "ceiling_drop":
      for(let i = 0; i < 3 + phase; i++)
        gs.projectiles.push({ x:80+Math.random()*(CANVAS_W-200), y:-20, vx:(Math.random()-0.5)*1.5, vy:3+Math.random()*2+phase, w:16, h:16, type:"ceiling_drop" });
      break;
    case "void_orb":
      gs.projectiles.push({ x:bx-60, y:by-20, vx:-2, vy:0, w:18, h:18, type:"void_orb", homing:true });
      if(phase >= 2)
        gs.projectiles.push({ x:bx-60, y:by+10, vx:-1.8, vy:0, w:18, h:18, type:"void_orb", homing:true });
      break;
    case "tentacle":
      gs.projectiles.push({ x:bx-30, y:GROUND_Y-30, vx:-(spd*1.2), vy:0, w:60, h:30, type:"tentacle" });
      break;
    case "tentacle_sweep":
      // Wide slow sweep across the full ground — must jump over it
      gs.projectiles.push({ x:bx, y:GROUND_Y-38, vx:-(spd*0.7), vy:0, w:90, h:38, type:"tentacle_sweep" });
      break;
    case "tentacle_combo": {
      // 4 rapid consecutive pokes at alternating heights, staggered by 18 frames each
      const heights = [GROUND_Y-28, GROUND_Y-80, GROUND_Y-28, GROUND_Y-60];
      for(let i = 0; i < 4; i++)
        gs.projectiles.push({ x:bx-20, y:heights[i], vx:-(spd*1.6+i*0.3), vy:0, w:22, h:22,
          type:"tentacle_combo", _delay: i * 18, _active: false });
      break;
    }
    case "ground_pound":
      // Primary shockwave — fast and wide
      gs.projectiles.push({ x:bx-10, y:GROUND_Y-14, vx:-(spd*1.5), vy:0, w:50, h:14, type:"ground_pound", _wave:0 });
      // Second smaller wave follows 30 frames later (phase 1+)
      if(phase >= 1)
        gs.projectiles.push({ x:bx-10, y:GROUND_Y-10, vx:-(spd*1.1), vy:0, w:34, h:10, type:"ground_pound", _wave:1, _delay:30, _active:false });
      break;
    case "void_burst": {
      // Fan of 6+phase orbs at spread heights — player must find the gap
      // gap is always in the middle third so it's never trivially at top/bottom
      const count = 6 + phase;
      const gap   = 1 + Math.floor(Math.random() * (count - 2));
      for(let i = 0; i < count; i++) {
        if(i === gap) continue;
        const t  = i / (count - 1);
        const fy = GROUND_Y - 20 - t * (GROUND_Y - 40);
        gs.projectiles.push({ x:bx-50, y:fy, vx:-(spd*1.4+i*0.15), vy:0, w:14, h:14,
          type:"void_burst", _gap: gap, _idx: i, _total: count });
      }
      break;
    }
    case "tracking_beam": {
      // Horizontal beam that sweeps top-to-bottom; _sweepY ticks in movement loop
      // _life matches the attack duration so it self-expires cleanly
      const beamDuration = 240;
      gs.projectiles.push({ x:0, y:20, vx:0, vy:0, w:bx-10, h:12,
        type:"tracking_beam", _sweepY:20, _sweepDir:1, _sweepSpd:0.6+phase*0.25,
        _life: beamDuration });
      break;
    }
    case "spike_rain": {
      // Dense ceiling drops covering ~85% of screen, 2 seeded safe gaps
      const safeA = 60  + Math.floor(Math.random() * 120);
      const safeB = 380 + Math.floor(Math.random() * 120);
      const cols  = 18 + phase * 2;
      for(let i = 0; i < cols; i++) {
        const sx = 20 + i * ((CANVAS_W - 40) / cols);
        const inSafeA = Math.abs(sx - safeA) < 44;
        const inSafeB = Math.abs(sx - safeB) < 44;
        if(inSafeA || inSafeB) continue;
        gs.projectiles.push({ x:sx, y:-24, vx:(Math.random()-0.5)*0.6,
          vy:2.8+Math.random()*1.4+phase*0.4, w:14, h:14,
          type:"spike_rain", _safeA:safeA, _safeB:safeB });
      }
      break;
    }
    default: break;
  }
}

// ─── MAIN TICK ────────────────────────────────────────────────────────────────
export function tickBoss(gs, keys, prevKeys, dt, onDeath, onWin) {
  if(!gs.alive || gs.won) return;

  // Shake decay
  gs.shake.trauma = Math.max(0, gs.shake.trauma - 0.04 * dt);
  const shakeAmt  = gs.shake.trauma * gs.shake.trauma * 14;
  gs.shake.x = (Math.random() * 2 - 1) * shakeAmt;
  gs.shake.y = (Math.random() * 2 - 1) * shakeAmt;
  if(gs.phaseFlash > 0) gs.phaseFlash -= dt;

  gs.frame++;
  gs.groundOffset = (gs.groundOffset + 2 * dt) % (CANVAS_W * 4);

  // ── Dino physics ────────────────────────────────────────────────────────────
  const d = gs.dino;
  if(d.invTimer > 0)    d.invTimer    -= dt;
  if(d.dashCooldown > 0) d.dashCooldown -= dt;

  if((keys["Space"]||keys["ArrowUp"]||keys["KeyW"]) && !(prevKeys["Space"]||prevKeys["ArrowUp"]||prevKeys["KeyW"])) {
    if(d.ducking) { d.ducking = false; }
    else if(d.onGround) { d.vy = JUMP_FORCE-(gs.stats.jumpBoost||0)*0.42; d.onGround=false; d.doubleJumped=false; }
    else if(gs.stats.hasDoubleJump && !d.doubleJumped) { d.vy = JUMP_FORCE-(gs.stats.jumpBoost||0)*0.28; d.doubleJumped=true; }
  }
  if(gs.stats.hasDash && keys["ArrowRight"] && !prevKeys["ArrowRight"] && d.dashTimer<=0 && d.dashCooldown<=0) {
    d.dashTimer=10; d.dashDir=1; d.dashCooldown=Math.max(15,45-(gs.stats.dashCdReduction||0));
  }
  if(gs.stats.hasBackDash && keys["ArrowLeft"] && !prevKeys["ArrowLeft"] && d.dashTimer<=0 && d.dashCooldown<=0) {
    d.dashTimer=10; d.dashDir=-1; d.dashCooldown=Math.max(15,45-(gs.stats.dashCdReduction||0));
  }
  if(gs.stats.hasDuck && d.onGround) {
    d.ducking = !!(keys["ArrowDown"]||keys["KeyS"]);
  } else if(!d.onGround) {
    if(gs.stats.hasFastDrop && (keys["ArrowDown"]||keys["KeyS"])) d.vy += GRAVITY*2.5*dt;
    d.ducking = false;
  }
  d.vy += GRAVITY * dt;
  d.y  += d.vy * dt;
  if(d.dashTimer > 0) { d.x += d.dashDir*7*dt; d.dashTimer -= dt; d.x = Math.max(10, Math.min(CANVAS_W*0.55, d.x)); }
  if(d.y >= GROUND_Y - DINO_H) { d.y = GROUND_Y-DINO_H; d.vy=0; d.onGround=true; d.doubleJumped=false; }

  // ── Teleport tick ───────────────────────────────────────────────────────────────────────
  if(gs.teleportFlicker > 0) {
    gs.teleportFlicker -= dt;
    if(gs.teleportFlicker <= 0 && gs.teleportTarget !== null) {
      gs.bossX = gs.teleportTarget;
      gs.teleportTarget = null;
      spawnExplosion(gs, gs.bossX, gs.bossY, "#8800cc", "#cc44ff", 20);
      spawnShockwave(gs, gs.bossX, gs.bossY);
      addShake(gs, 0.4);
    }
  }

  // ── Bite ────────────────────────────────────────────────────────────────────────────
  if(gs.biteCooldown > 0) gs.biteCooldown -= dt;
  if(gs.biteFlash > 0)    gs.biteFlash    -= dt;
  if(gs.biteAnim  > 0)    gs.biteAnim     -= dt;

  if(keys["KeyF"] && !prevKeys["KeyF"] && gs.biteCooldown <= 0 && gs.stats.hasBite) {
    gs.biteCooldown = 45;
    gs.biteAnim = 18;
    playBite();
    if(gs.blindWindow) {
      const range = BITE_RANGE[gs.bossPhase];
      const dist  = gs.bossX - (d.x + DINO_W);
      if(dist > range) {
        gs.floatingTexts.push({ text:"TOO FAR!", x:d.x, y:d.y-28, vy:-1.4, life:45, maxLife:45, color:"#ff6600" });
      } else {
        gs.bossHp = Math.max(0, gs.bossHp - 1);
        gs.biteFlash = 12;
        gs.floatingTexts.push({ text:"BITE!", x:d.x, y:d.y-28, vy:-1.4, life:55, maxLife:55, color:"#ffdd00" });
        spawnExplosion(gs, gs.bossX, gs.bossY-10, "#ffdd00", "#ff8800", 14);
        addShake(gs, 0.35);
        // phase thresholds: 0→1 at 10hp, 1→2 at 5hp (out of 15)
        const newPhase = gs.bossHp <= 5 ? 2 : gs.bossHp <= 10 ? 1 : 0;
        if(newPhase > gs.bossPhase) {
          gs.bossPhase = newPhase; gs.phaseFlash = 25;
          gs.floatingTexts.push({ text:`PHASE ${newPhase+1}!`, x:CANVAS_W/2-30, y:60, vy:-0.8, life:90, maxLife:90, color:"#ff4400" });
          spawnExplosion(gs, gs.bossX, gs.bossY, "#ff2200", "#ff8800", 28);
          spawnShockwave(gs, gs.bossX, gs.bossY);
          addShake(gs, 0.9);
        }
        if(gs.bossHp <= 0) { gs.won = true; onWin(); return; }
        gs.blindWindow = false; gs.bossOpen = false; gs.blindTimer = 0; gs.barrage = []; gs.barrageGap = BARRAGE_GAP[gs.bossPhase];
      }
    } else {
      gs.floatingTexts.push({ text:"MISS!", x:d.x, y:d.y-28, vy:-1.4, life:40, maxLife:40, color:"#888888" });
    }
  }

  // ── Attack sequencing ────────────────────────────────────────────────────────
  if(gs.barrageGap > 0) {
    gs.barrageGap -= dt;
  } else if(gs.blindWindow) {
    gs.blindTimer -= dt;
    if(gs.blindTimer <= 0) { gs.blindWindow = false; gs.bossOpen = false; gs.barrageGap = BARRAGE_GAP[gs.bossPhase] + Math.random()*30; }
  } else {
    if(gs.barrage.length === 0) { gs.barrage = buildBarrage(gs.bossPhase); gs.attackIndex = 0; gs.attackTimer = 0; }
    const cur = gs.barrage[gs.attackIndex];
    gs.attackTimer += dt;
    if(gs.attackTimer >= cur.warmup && gs.attackTimer - dt < cur.warmup) spawnAttack(gs, cur);
    if(gs.attackTimer >= cur.duration) {
      gs.attackTimer = 0; gs.attackIndex++;
      if(gs.attackIndex >= gs.barrage.length) {
        gs.barrage = []; gs.blindWindow = true; gs.bossOpen = true;
        gs.blindTimer = BLIND_DURATION[gs.bossPhase];
        gs.projectiles = [];
        // Teleport on blind window open (phase 1+)
        if(gs.bossPhase >= 1 && gs.teleportFlicker <= 0) {
          const positions = Object.values(BOSS_POSITIONS);
          const current   = gs.bossX;
          const choices   = positions.filter(p => Math.abs(p - current) > 60);
          gs.teleportTarget  = choices[Math.floor(Math.random() * choices.length)];
          gs.teleportFlicker = TELEPORT_FLICKER[gs.bossPhase];
          gs.floatingTexts.push({ text:"!", x:gs.bossX, y:gs.bossY-80, vy:-0.6, life:35, maxLife:35, color:"#cc44ff" });
        }
      }
    }
  }

  // ── Move projectiles ─────────────────────────────────────────────────────────
  gs.projectiles = gs.projectiles.filter(p => {
    // Delayed projectiles sit frozen until their delay expires
    if(p._delay !== undefined && p._delay > 0) { p._delay -= dt; return true; }
    if(p._delay !== undefined && !p._active)    { p._active = true; }
    p.x += p.vx * dt; p.y += p.vy * dt;
    // tracking_beam sweeps vertically instead of moving horizontally
    if(p.type === "tracking_beam") {
      p._sweepY += p._sweepDir * p._sweepSpd * dt;
      if(p._sweepY > GROUND_Y - 20) { p._sweepY = GROUND_Y - 20; p._sweepDir = -1; }
      if(p._sweepY < 10)            { p._sweepY = 10;             p._sweepDir =  1; }
      p.y = p._sweepY;
      p._life -= dt;
      if(p._life <= 0) return false;
    }
    if(p.homing) {
      const dy = (d.y+DINO_H/2) - (p.y+p.h/2);
      p.vy += Math.sign(dy)*0.08*dt; p.vy = Math.max(-3, Math.min(3, p.vy));
    }
    if((p.type === "ceiling_drop" || p.type === "spike_rain") && p.y+p.h >= GROUND_Y) {
      p.y = GROUND_Y-p.h; p.vy = 0;
      p._landed = (p._landed||0) + dt;
      if(p._landed > 45) return false;
    }
    if(p.x+p.w < 0 && !p._exited) { p._exited = true; spawnExplosion(gs, 8, p.y+p.h/2, "#660000", "#330000", 5); }
    return p.x > -80 && p.x < CANVAS_W+40 && p.y < GROUND_Y+20;
  });

  // ── Projectile collision ──────────────────────────────────────────────────────
  if(d.invTimer <= 0) {
    const effH = d.ducking ? DUCK_H : DINO_H;
    const DW = DINO_W-14, DH = effH*0.82;
    const DX = d.x+DINO_W/2-DW/2, DY = d.y+DINO_H-effH;
    for(let i = gs.projectiles.length-1; i >= 0; i--) {
      const p = gs.projectiles[i];
      if(p._landed) continue;
      if(p._delay !== undefined && !p._active) continue;
      if(DX < p.x+p.w && DX+DW > p.x && DY < p.y+p.h && DY+DH > p.y) {
        gs.projectiles.splice(i, 1);
        if(gs.lives > 1) {
          gs.lives--; d.invTimer = 40;
          spawnExplosion(gs, d.x+DINO_W/2, d.y+DINO_H/2, "#ff2244", "#ff8800", 10);
          addShake(gs, 0.55);
          gs.floatingTexts.push({ text:"-1 LIFE", x:d.x, y:d.y-24, vy:-1.4, life:55, maxLife:55, color:"#ee3344" });
        } else {
          spawnExplosion(gs, d.x+DINO_W/2, d.y+DINO_H/2, "#ff2244", "#ffffff", 18);
          addShake(gs, 1.0); gs.alive = false; onDeath(); return;
        }
        break;
      }
    }
  }

  // ── Particles + floating texts ───────────────────────────────────────────────
  gs.particles = gs.particles.filter(p => {
    p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 0.18*dt;
    if(p.ring) p.r += 4*dt;
    p.life -= dt; return p.life > 0;
  });
  gs.floatingTexts = gs.floatingTexts.filter(t => { t.y += t.vy*dt; t.life -= dt; return t.life > 0; });
}
