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
  else if(id==="pterodac") drawPterodac(ctx, x, y, dead, c, ec, ac, fc, wf);
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
    else if(id==="pterodac") drawPterodac(ctx, nx, ny, dead, col, col, col, col, wf);
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
  const alpha = Math.min(1, (1 - progress) * 2);
  ctx.save();
  ctx.globalAlpha = alpha;

  if(type === "phaseShift") {
    for(let i = 0; i < 3; i++) {
      const r = 28 + i * 18 + progress * 40;
      ctx.strokeStyle = "#66dd22"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x + 20, y + 24, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.strokeStyle = `rgba(102,221,34,${0.6 - progress * 0.6})`;
    ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.strokeRect(x - 4, y - 4, 48, 56);
    ctx.setLineDash([]);
  } else if(type === "thermalLift") {
    for(let i = 0; i < 5; i++) {
      const lx = x + 4 + i * 8, ly = y + 48 - progress * 60;
      ctx.fillStyle = i % 2 === 0 ? "#44aaff" : "#88ddff";
      ctx.fillRect(lx, ly, 2, 8 + i * 2); ctx.fillRect(lx - 1, ly - 6, 4, 4);
    }
    ctx.fillStyle = "rgba(68,170,255,0.25)"; ctx.fillRect(x - 20, y + 8, 80, 20);
  } else if(type === "pulseWave") {
    const maxR = 180;
    for(let i = 0; i < 2; i++) {
      const r = progress * maxR + i * 30;
      const a = Math.max(0, 0.7 - r / maxR);
      ctx.strokeStyle = `rgba(255,170,0,${a})`; ctx.lineWidth = 3 - i;
      ctx.beginPath(); ctx.arc(x + 20, y + 24, r, 0, Math.PI * 2); ctx.stroke();
    }
    if(progress < 0.2) {
      ctx.fillStyle = `rgba(255,200,50,${0.5 - progress * 2.5})`;
      ctx.fillRect(x - 30, y - 20, 100, 80);
    }
  } else if(type === "hornBurst") {
    const cx2 = x + 20, cy2 = y + 24;
    const len = 40 + progress * 120;
    for(let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const ex = cx2 + Math.cos(angle) * len, ey = cy2 + Math.sin(angle) * len;
      ctx.strokeStyle = `rgba(204,136,0,${0.8 - progress * 0.8})`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.fillStyle = "#ffcc44"; ctx.fillRect(ex - 2, ey - 2, 4, 4);
    }
  } else if(type === "headbutt") {
    for(let i = 0; i < 4; i++) {
      const lx = x + 40 + i * 20 + progress * 60;
      ctx.fillStyle = `rgba(255,204,0,${0.6 - i * 0.12})`;
      ctx.fillRect(lx, y + 10 + i * 6, 18 - i * 3, 3);
    }
    if(progress < 0.25) {
      ctx.fillStyle = `rgba(255,220,50,${0.5 - progress * 2})`;
      ctx.fillRect(x + 10, y, 30, 30);
    }
  } else if(type === "speedRush") {
    for(let i = 0; i < 5; i++) {
      const lx = x - 20 - i * 14 - progress * 30, ly = y + 14 + i * 6;
      ctx.fillStyle = `rgba(0,204,102,${0.5 - i * 0.08})`;
      ctx.fillRect(lx, ly, 12 + i * 4, 2);
    }
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}
