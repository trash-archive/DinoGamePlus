import { GROUND_Y, DINO_W, DINO_H } from "../constants";
import { drawRaptor }  from "../dinos/raptor";
import { drawTrex }    from "../dinos/trex";
import { drawStego }   from "../dinos/stego";
import { drawPterodac }from "../dinos/pterodac";
import { drawAnky }    from "../dinos/anky";
import { drawTri }     from "../dinos/tri";
import { drawBrachio } from "../dinos/brachio";
import { drawSpino }   from "../dinos/spino";
import { drawPachy }   from "../dinos/pachy";
import { drawPara }    from "../dinos/para";
import { drawDilopho } from "../dinos/dilopho";
import { drawHasim }   from "../dinos/hasim";

// ─── DINO DISPATCH ────────────────────────────────────────────────────────────
export function drawDino(ctx, x, y, frame, dead, skin, design, isGiant, isDucking, isTiny, isGhost, invTimer, onGround, deathAnim) {
  const c  = skin?.color      || "#2a2a2a";
  const ec = skin?.eyeColor   || "#f0f0f0";
  const ac = skin?.accent     || "#3a3a3a";
  const pc = skin?.plateColor || "#333";
  const fc = skin?.frillColor || "#444";
  const id = design?.id || "raptor";

  ctx.save();

  if(isGhost) ctx.globalAlpha = 0.5;
  if(invTimer > 0 && Math.floor(invTimer/4)%2 === 0) { ctx.restore(); return; }

  const scale = isGiant ? 1.9 : isTiny ? 0.6 : 1;
  if(scale !== 1) {
    const bx = x + DINO_W/2, by = y + DINO_H;
    ctx.translate(bx,by); ctx.scale(scale,scale); ctx.translate(-bx,-by);
  }

  if(dead && deathAnim) {
    const cx2 = x + DINO_W/2, cy2 = y + DINO_H/2;
    ctx.translate(cx2, cy2);
    ctx.rotate(deathAnim.angle || 0);
    ctx.translate(-cx2, -cy2);
  }

  const animLegs = onGround && !dead;
  const f  = animLegs ? Math.floor(frame/5)%2 : 0;
  const f3 = animLegs ? Math.floor(frame/4)%3 : 0;
  const wf = Math.floor(frame/6)%2;

  if     (id==="raptor")   drawRaptor(ctx, x, y, dead, c, ec, ac, isDucking, f);
  else if(id==="trex")     drawTrex(ctx, x, y, dead, c, ec, ac, isDucking, f);
  else if(id==="stego")    drawStego(ctx, x, y, dead, c, ec, pc, isDucking, f);
  else if(id==="pterodac") drawPterodac(ctx, x, y, dead, c, ec, ac, fc, wf, isDucking);
  else if(id==="anky")     drawAnky(ctx, x, y, dead, c, ec, ac, pc, isDucking, f);
  else if(id==="tri")      drawTri(ctx, x, y, dead, c, ec, ac, pc, fc, isDucking, f);
  else if(id==="brachio")  drawBrachio(ctx, x, y, dead, c, ec, ac, isDucking, f);
  else if(id==="spino")    drawSpino(ctx, x, y, dead, c, ec, ac, fc, isDucking, f);
  else if(id==="pachy")    drawPachy(ctx, x, y, dead, c, ec, ac, pc, isDucking, f);
  else if(id==="para")     drawPara(ctx, x, y, dead, c, ec, ac, fc, isDucking, f);
  else if(id==="dilopho")  drawDilopho(ctx, x, y, dead, c, ec, ac, fc, isDucking, f);
  else if(id==="hasim")    drawHasim(ctx, x, y, dead, c, ec, ac, pc, fc, isDucking, f);

  ctx.restore();
}

// ─── SHIELD OUTLINE ───────────────────────────────────────────────────────────
// Draws the dino shape offset in 4 directions with a blue color to create an outline effect.
export function drawShieldOutline(ctx, x, y, frame, dead, skin, design, isGiant, isDucking, isTiny, onGround, deathAnim, shieldHits) {
  const id = design?.id || "raptor";
  const animLegs = onGround && !dead;
  const f  = animLegs ? Math.floor(frame/5)%2 : 0;
  const wf = Math.floor(frame/6)%2;
  // Pulse between two blues based on hits remaining
  const pulse = 0.7 + Math.sin(frame * 0.15) * 0.3;
  const col = `rgba(68,136,221,${pulse})`;
  const offsets = [[-2,0],[2,0],[0,-2],[0,2]];

  ctx.save();
  const scale = isGiant ? 1.9 : isTiny ? 0.6 : 1;
  if(scale !== 1){
    const bx = x + DINO_W/2, by = y + DINO_H;
    ctx.translate(bx,by); ctx.scale(scale,scale); ctx.translate(-bx,-by);
  }
  if(dead && deathAnim){
    const cx2 = x + DINO_W/2, cy2 = y + DINO_H/2;
    ctx.translate(cx2,cy2); ctx.rotate(deathAnim.angle||0); ctx.translate(-cx2,-cy2);
  }

  for(const [ox,oy] of offsets){
    const nx = x+ox, ny = y+oy;
    if     (id==="raptor")   drawRaptor(ctx, nx, ny, dead, col, col, col, isDucking, f);
    else if(id==="trex")     drawTrex(ctx, nx, ny, dead, col, col, col, isDucking, f);
    else if(id==="stego")    drawStego(ctx, nx, ny, dead, col, col, col, isDucking, f);
    else if(id==="pterodac") drawPterodac(ctx, nx, ny, dead, col, col, col, col, wf, isDucking);
    else if(id==="anky")     drawAnky(ctx, nx, ny, dead, col, col, col, col, isDucking, f);
    else if(id==="tri")      drawTri(ctx, nx, ny, dead, col, col, col, col, col, isDucking, f);
    else if(id==="brachio")  drawBrachio(ctx, nx, ny, dead, col, col, col, isDucking, f);
    else if(id==="spino")    drawSpino(ctx, nx, ny, dead, col, col, col, col, isDucking, f);
    else if(id==="pachy")    drawPachy(ctx, nx, ny, dead, col, col, col, col, isDucking, f);
    else if(id==="para")     drawPara(ctx, nx, ny, dead, col, col, col, col, isDucking, f);
    else if(id==="dilopho")  drawDilopho(ctx, nx, ny, dead, col, col, col, col, isDucking, f);
    else if(id==="hasim")    drawHasim(ctx, nx, ny, dead, col, col, col, col, col, isDucking, f);
  }
  ctx.restore();
}

// ─── PTERODAC FLY OUTLINE ─────────────────────────────────────────────────────
export function drawPterodacFlyOutline(ctx, x, y, frame, isDucking, isGiant, isTiny) {
  const pulse = 0.5 + Math.sin(frame * 0.15) * 0.5;
  const col = `rgba(68,170,255,${pulse})`;
  const wf = Math.floor(frame/6)%2;
  ctx.save();
  const scale = isGiant ? 1.9 : isTiny ? 0.6 : 1;
  if(scale !== 1) {
    const bx = x + DINO_W/2, by = y + DINO_H;
    ctx.translate(bx,by); ctx.scale(scale,scale); ctx.translate(-bx,-by);
  }
  for(const [ox,oy] of [[-3,0],[3,0],[0,-3],[0,3]])
    drawPterodac(ctx, x+ox, y+oy, false, col, col, col, col, wf, isDucking);
  ctx.restore();
}

// ─── SPEED RUSH OUTLINE ──────────────────────────────────────────────────────
export function drawSpeedRushOutline(ctx, x, y, frame, isDucking, timer, isGiant, isTiny) {
  const fade = Math.min(1, timer / 60);
  const pulse = (0.5 + Math.sin(frame * 0.18) * 0.5) * fade;
  const col = `rgba(0,220,100,${pulse})`;
  const f = Math.floor(frame/5)%2;
  const scale = isGiant ? 1.9 : isTiny ? 0.6 : 1;
  ctx.save();
  if(scale !== 1) {
    const bx = x + DINO_W/2, by = y + DINO_H;
    ctx.translate(bx,by); ctx.scale(scale,scale); ctx.translate(-bx,-by);
  }
  for(const [ox,oy] of [[-3,0],[3,0],[0,-3],[0,3]])
    drawRaptor(ctx, x+ox, y+oy, false, col, col, col, isDucking, f);
  ctx.restore();
}

// ─── PACHY HEADBUTT ACTIVE OUTLINE ───────────────────────────────────────────
export function drawPachyHeadbuttOutline(ctx, x, y, frame, isDucking, activeTimer, isGiant, isTiny) {
  const pulse = 0.6 + Math.sin(frame * 0.25) * 0.4;
  const col = `rgba(255,220,0,${pulse})`;
  const f = Math.floor(frame/5)%2;
  const scale = isGiant ? 1.9 : isTiny ? 0.6 : 1;
  ctx.save();
  if(scale !== 1) {
    const bx = x + DINO_W/2, by = y + DINO_H;
    ctx.translate(bx,by); ctx.scale(scale,scale); ctx.translate(-bx,-by);
  }
  // Yellow pulsing outline
  for(const [ox,oy] of [[-3,0],[3,0],[0,-3],[0,3]])
    drawPachy(ctx, x+ox, y+oy, false, col, col, col, col, isDucking, f);
  // Forward speed streaks from the head
  const streakAlpha = 0.5 + Math.sin(frame * 0.3) * 0.3;
  ctx.globalAlpha = streakAlpha;
  for(let i = 0; i < 5; i++) {
    const lx = x + 38 + i * 12 + (frame % 8) * 2;
    const ly = y + 6 + i * 5;
    ctx.fillStyle = i % 2 === 0 ? "#ffee44" : "#ffaa00";
    ctx.fillRect(lx, ly, 16 - i * 2, 3);
  }
  ctx.restore();
}

// ─── HEART ────────────────────────────────────────────────────────────────────
export function drawHeart(ctx, x, y, size = 12, color = "#dd2244") {
  ctx.fillStyle = color;
  ctx.fillRect(x+size*0.08, y,           size*0.35, size*0.4);
  ctx.fillRect(x+size*0.55, y,           size*0.35, size*0.4);
  ctx.fillRect(x,           y+size*0.25, size,      size*0.38);
  ctx.fillRect(x+size*0.08, y+size*0.6,  size*0.84, size*0.22);
  ctx.fillRect(x+size*0.22, y+size*0.8,  size*0.55, size*0.15);
  ctx.fillRect(x+size*0.38, y+size*0.92, size*0.25, size*0.08);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(x+size*0.15, y+size*0.05, size*0.15, size*0.2);
}

// ─── PASSIVE EFFECTS ──────────────────────────────────────────────────────────
export function drawPassiveEffect(ctx, type, x, y, frame, progress) {
  const fade = Math.min(1, (1 - progress) * 2);
  const cx = x + 20, cy = y + 24;
  ctx.save();

  if(type === "phaseShift") {
    // Subtle fade-in ripple — just 2 soft expanding rings
    for(let i = 0; i < 2; i++) {
      const r = 14 + i * 16 + progress * 60;
      const a = Math.max(0, fade * (0.35 - i * 0.12));
      ctx.globalAlpha = a;
      ctx.strokeStyle = "#88ff88";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    }

  } else if(type === "thermalLift") {
    // Big upward thermal column + rising sparks
    ctx.globalAlpha = fade * 0.35;
    ctx.fillStyle = "#44aaff";
    ctx.fillRect(x - 30, y - 40 + progress * 40, 100, 80);
    ctx.globalAlpha = fade;
    for(let i = 0; i < 8; i++) {
      const lx = x - 10 + i * 10;
      const ly = y + 50 - progress * 120 - (i % 3) * 14;
      const w = 4 - (i % 2);
      ctx.fillStyle = i % 2 === 0 ? "#44aaff" : "#aaddff";
      ctx.fillRect(lx, ly, w, 10 + i * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(lx, ly - 4, w, 4);
    }
    // Horizontal wind lines
    for(let i = 0; i < 4; i++) {
      ctx.globalAlpha = fade * (0.5 - i * 0.1);
      ctx.fillStyle = "#88ccff";
      ctx.fillRect(x - 40 + i * 5, y + 10 + i * 8, 30 + i * 10, 2);
    }

  } else if(type === "pulseWave") {
    // 4 expanding shockwave rings
    for(let i = 0; i < 4; i++) {
      const r = progress * 220 + i * 28;
      const a = Math.max(0, fade * (0.85 - r / 220));
      ctx.globalAlpha = a;
      ctx.strokeStyle = i % 2 === 0 ? "#ffaa00" : "#ffdd44";
      ctx.lineWidth = 4 - i;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    }
    // Flash burst at start
    if(progress < 0.15) {
      ctx.globalAlpha = fade * (0.8 - progress * 5);
      ctx.fillStyle = "#ffcc00";
      ctx.fillRect(x - 50, y - 40, 140, 100);
    }
    // Debris particles flying outward
    for(let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const r = progress * 160;
      ctx.globalAlpha = fade * 0.7;
      ctx.fillStyle = i % 2 === 0 ? "#ffaa00" : "#ff6600";
      ctx.fillRect(cx + Math.cos(angle)*r - 3, cy + Math.sin(angle)*r - 3, 6, 6);
    }

  } else if(type === "hornBurst") {
    // 8 thick horn beams + tip diamonds
    const len = 50 + progress * 180;
    for(let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const ex = cx + Math.cos(angle) * len, ey = cy + Math.sin(angle) * len;
      ctx.globalAlpha = fade * (0.9 - progress * 0.7);
      ctx.strokeStyle = i % 2 === 0 ? "#cc8800" : "#ffcc00";
      ctx.lineWidth = 5 - progress * 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
      // Tip flash
      ctx.globalAlpha = fade * 0.9;
      ctx.fillStyle = "#ffee44";
      ctx.fillRect(ex - 4, ey - 4, 8, 8);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(ex - 2, ey - 2, 4, 4);
    }
    // Center flash
    if(progress < 0.2) {
      ctx.globalAlpha = fade * (1 - progress * 5);
      ctx.fillStyle = "#ffdd00";
      ctx.fillRect(cx - 20, cy - 20, 40, 40);
    }

  } else if(type === "headbutt") {
    // Loop the blast animation every ~45 frames for the full duration
    const loopProgress = (progress * (300/45)) % 1;
    const loopFade = Math.min(1, (1 - loopProgress) * 2);
    // Forward shockwave — big horizontal blast to the right
    for(let i = 0; i < 5; i++) {
      const lx = x + 36 + i * 24 + loopProgress * 140;
      const h  = 28 - i * 4;
      ctx.globalAlpha = loopFade * (0.8 - i * 0.13);
      ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#ff8800";
      ctx.fillRect(lx, cy - h/2, 18 - i*2, h);
    }
    // Impact flash at head
    if(loopProgress < 0.2) {
      ctx.globalAlpha = loopFade * (1 - loopProgress * 5);
      ctx.fillStyle = "#ffee44";
      ctx.fillRect(x + 20, y - 4, 36, 36);
    }
    // Shockwave ring forward
    const rw = loopProgress * 180;
    ctx.globalAlpha = loopFade * Math.max(0, 0.7 - loopProgress);
    ctx.strokeStyle = "#ffaa00"; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(x + 40 + loopProgress * 60, cy, rw * 0.3, rw * 0.6, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Debris chunks
    for(let i = 0; i < 6; i++) {
      const dx = x + 40 + i * 20 + loopProgress * 100;
      const dy = cy - 20 + i * 8 - loopProgress * 30;
      ctx.globalAlpha = loopFade * 0.8;
      ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#cc6600";
      ctx.fillRect(dx, dy, 8, 8);
    }

  } else if(type === "speedRush") {
    // Only speed streaks at the effect spawn position — no dino outline here
    for(let i = 0; i < 6; i++) {
      const lx   = x - 18 - i * 16 - progress * 40;
      const ly   = y + 10 + i * 6;
      const len2 = 14 + i * 6;
      ctx.globalAlpha = fade * (0.65 - i * 0.08);
      ctx.fillStyle = i % 2 === 0 ? "#00dd66" : "#88ffcc";
      ctx.fillRect(lx, ly, len2, 2);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(lx + len2 - 3, ly, 3, 2);
    }
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}
