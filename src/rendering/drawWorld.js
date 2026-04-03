import { CANVAS_W, CANVAS_H, GROUND_Y } from "../constants";
import { SCENERIES } from "../data/collectionData.jsx";

// ─── STARS ────────────────────────────────────────────────────────────────────
export function drawStars(ctx, stars, blend) {
  for(const s of stars){
    ctx.fillStyle=`rgba(255,255,255,${s.bright*blend})`;
    ctx.fillRect(s.x,s.y,s.size,s.size);
  }
}

// ─── SUN ──────────────────────────────────────────────────────────────────────
export function drawPixelSun(ctx, x, y, alpha) {
  if(alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  const S = 14;
  ctx.fillStyle = "#f5c842";
  ctx.fillRect(x-S+3, y-S+3, (S-3)*2, (S-3)*2);
  ctx.fillRect(x-3, y-S-6, 6, 6);
  ctx.fillRect(x-3, y+S+1, 6, 6);
  ctx.fillRect(x-S-6, y-3, 6, 6);
  ctx.fillRect(x+S+1, y-3, 6, 6);
  ctx.fillStyle = "#e8b830";
  ctx.fillRect(x+S-2, y-S-3, 4, 4);
  ctx.fillRect(x-S-2, y-S-3, 4, 4);
  ctx.fillRect(x+S-2, y+S,   4, 4);
  ctx.fillRect(x-S-2, y+S,   4, 4);
  ctx.fillStyle = "#fff8cc";
  ctx.fillRect(x-4, y-6, 5, 5);
  ctx.globalAlpha = 1; ctx.restore();
}

// ─── MOON ─────────────────────────────────────────────────────────────────────
export function drawPixelMoon(ctx, x, y, alpha) {
  if(alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  const pixels = [[-4,-12],[0,-12],[4,-12],[-8,-8],[-4,-8],[0,-8],[4,-8],[-12,-4],[-8,-4],[-4,-4],[0,-4],[-12,0],[-8,0],[-4,0],[-12,4],[-8,4],[-4,4],[0,4],[-8,8],[-4,8],[0,8],[-4,12],[0,12]];
  ctx.fillStyle = "#e8e0aa";
  for(const [px,py] of pixels) ctx.fillRect(x+px, y+py, 4, 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x+18, y-8, 2, 2); ctx.fillRect(x+24, y+4, 2, 2); ctx.fillRect(x+14, y+14, 2, 2);
  ctx.globalAlpha = 1; ctx.restore();
}

// ─── CLOUDS ───────────────────────────────────────────────────────────────────
export function drawClouds(ctx, clouds, scenery) {
  const s = scenery || SCENERIES[0];
  for(const c of clouds){
    if(s.id==="cave"){
      ctx.fillStyle=s.cloudColor;
      ctx.fillRect(c.x,0,8,c.h||20); ctx.fillRect(c.x+2,c.h||20,4,4);
    } else if(s.id==="classic") {
      ctx.fillStyle="#dddddd";
      ctx.fillRect(c.x+10,c.y+8,38,9);ctx.fillRect(c.x+4,c.y+3,18,14);
      ctx.fillRect(c.x+20,c.y,22,18); ctx.fillRect(c.x+42,c.y+5,16,12);
    } else {
      ctx.fillStyle=s.cloudColor;
      ctx.fillRect(c.x+10,c.y+8,38,9);ctx.fillRect(c.x+4,c.y+3,18,14);
      ctx.fillRect(c.x+20,c.y,22,18); ctx.fillRect(c.x+42,c.y+5,16,12);
    }
  }
}

// ─── GROUND ───────────────────────────────────────────────────────────────────
export function drawGround(ctx, offset, scenery, nightBlend) {
  const s = scenery || SCENERIES[0];
  if(s.id === "classic") {
    const groundCol = nightBlend > 0.5 ? "#aaaaaa" : "#222222";
    const gravelCol = nightBlend > 0.5 ? "#555566" : "#bbbbbb";
    ctx.fillStyle = groundCol; ctx.fillRect(0, GROUND_Y+2, CANVAS_W, 3);
    ctx.fillStyle = gravelCol;
    for(let i=0;i<22;i++){
      const rx=((i*76-(offset%76))+CANVAS_W*4)%CANVAS_W;
      ctx.fillRect(rx, GROUND_Y+7, 18+(i%3)*7, 2);
      ctx.fillRect(rx+4, GROUND_Y+11, 9, 2);
    }
    return;
  }
  ctx.fillStyle = s.groundTop;
  ctx.fillRect(0, GROUND_Y, CANVAS_W, 4);
  ctx.fillStyle = s.groundColor;
  ctx.fillRect(0, GROUND_Y+4, CANVAS_W, CANVAS_H-GROUND_Y-4);
  ctx.fillStyle = s.groundTop + "88";
  for(let i=0;i<22;i++){
    const rx=((i*76-(offset%76))+CANVAS_W*4)%CANVAS_W;
    ctx.fillRect(rx,GROUND_Y+6,16+(i%3)*6,2);
  }
}

// ─── BONE PICKUP ──────────────────────────────────────────────────────────────
export function drawBonePickup(ctx, x, y, col) {
  // drawFossilDiamond inline to avoid circular dep
  const cx = x + 7, cy = y + 7, size = 14;
  const h = size / 2;
  ctx.strokeStyle = col;
  ctx.lineWidth = Math.max(1, size * 0.06);
  ctx.beginPath();
  ctx.moveTo(cx, cy - h); ctx.lineTo(cx + h, cy);
  ctx.lineTo(cx, cy + h); ctx.lineTo(cx - h, cy);
  ctx.closePath(); ctx.stroke();
  const ih = h * 0.48;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ih); ctx.lineTo(cx + ih, cy);
  ctx.lineTo(cx, cy + ih); ctx.lineTo(cx - ih, cy);
  ctx.closePath(); ctx.fill();
}

// ─── ENTITY SILHOUETTE ────────────────────────────────────────────────────────
export function drawEntitySilhouette(ctx, x, y, frame, alpha, scenery) {
  if(alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  const sid = scenery?.id || "classic";
  const silTints = {
    classic:"#080808", plains:"#040e02", desert:"#180800", arctic:"#020810",
    volcano:"#180200", jungle:"#020e04", ruins:"#0e0a04", cave:"#0a0018",
  };
  const tint = silTints[sid] || "#080808";
  ctx.fillStyle = tint;

  const breathe = Math.sin(frame * 0.018) * 4;
  const tentacleWave = (i, t) => Math.sin(frame * 0.04 + i * 1.1 + t) * 6;
  const cx = x, cy = y;

  ctx.fillRect(cx-28, cy-20+breathe, 56, 44);
  ctx.fillRect(cx-36, cy-10+breathe, 72, 28);
  ctx.fillRect(cx-20, cy-32+breathe, 40, 16);
  ctx.fillRect(cx-14, cy-40+breathe, 28, 12);
  ctx.fillRect(cx+18, cy-28+breathe, 18, 20);
  ctx.fillRect(cx-38, cy-18+breathe, 14, 24);
  ctx.fillRect(cx+30, cy-8+breathe,  12, 18);
  ctx.fillRect(cx-44, cy-4+breathe,  10, 14);

  const tentacles = [
    {ox:-30,len:5,dir:1},{ox:-18,len:6,dir:-1},{ox:-6,len:7,dir:1},{ox:6,len:6,dir:-1},
    {ox:18,len:5,dir:1},{ox:28,len:7,dir:-1},{ox:-40,len:4,dir:1},{ox:38,len:4,dir:-1},
  ];
  tentacles.forEach((t, i) => {
    let tx = cx + t.ox, ty = cy + 22 + breathe;
    for(let s = 0; s < t.len; s++) {
      const w = Math.max(2, 7 - s);
      const wave = tentacleWave(i, s * 0.5) * t.dir;
      ctx.fillRect(tx + wave - w/2, ty + s*8, w, 9);
    }
  });

  const arms = [{ox:-22,dir:-1},{ox:22,dir:1},{ox:-8,dir:-1},{ox:8,dir:1}];
  arms.forEach((a, i) => {
    let ax = cx + a.ox, ay = cy - 32 + breathe;
    for(let s = 0; s < 4; s++) {
      const w = Math.max(2, 6 - s);
      const wave = tentacleWave(i + 8, s * 0.6) * a.dir;
      ctx.fillRect(ax + wave - w/2, ay - s*9, w, 10);
    }
  });

  const eyePulse = Math.floor(frame * 0.06) % 3 === 0;
  ctx.fillStyle = eyePulse ? "#ff0000" : "#cc0000";
  ctx.fillRect(cx-14, cy-26+breathe, 5, 4);
  ctx.fillRect(cx+10, cy-22+breathe, 5, 4);
  ctx.fillRect(cx-2,  cy-30+breathe, 4, 3);
  ctx.fillRect(cx+22, cy-14+breathe, 4, 4);
  ctx.fillRect(cx-28, cy-10+breathe, 3, 3);

  const mouthOpen = Math.sin(frame * 0.025) > 0.3;
  ctx.fillStyle = "#000000";
  ctx.fillRect(cx-16, cy-4+breathe, 32, mouthOpen ? 5 : 2);
  if(mouthOpen) {
    ctx.fillStyle = "#330000";
    ctx.fillRect(cx-12, cy-4+breathe, 4, 4);
    ctx.fillRect(cx-2,  cy-4+breathe, 4, 4);
    ctx.fillRect(cx+8,  cy-4+breathe, 4, 4);
  }

  ctx.fillStyle = tint;
  for(let i = 0; i < 7; i++) {
    const sx = cx - 24 + i * 8;
    const sh = 8 + (i % 3) * 5 + Math.sin(frame * 0.03 + i) * 3;
    ctx.fillRect(sx, cy - 40 - sh + breathe, 3, sh);
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}
