// ─── JUNGLE OBSTACLES ────────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawJungleObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  if (o.otype === "cactus") {
    const t = o.type||0;
    if (t === 0) {
      ctx.fillStyle = "#5a3a10";
      ctx.fillRect(o.x+12,g-58,8,58);
      ctx.fillStyle = "#1a6a10";
      ctx.fillRect(o.x-10,g-62,18,8); ctx.fillRect(o.x+24,g-62,18,8);
      ctx.fillRect(o.x-4, g-70,14,10); ctx.fillRect(o.x+22,g-70,14,10);
      ctx.fillRect(o.x+6, g-74,20,12);
      ctx.fillStyle = "#2a8a20";
      ctx.fillRect(o.x+8,g-72,16,6);
    } else if (t === 1) {
      ctx.fillStyle = "#4a2a08";
      ctx.fillRect(o.x+8, g-50,16,50);
      ctx.fillRect(o.x,   g-30,8, 30);
      ctx.fillRect(o.x+24,g-30,8, 30);
      ctx.fillStyle = "#1a5a10";
      ctx.fillRect(o.x-12,g-56,56,18);
      ctx.fillStyle = "#2a7a18";
      ctx.fillRect(o.x-6, g-68,44,16);
      ctx.fillStyle = "#3a9a22";
      ctx.fillRect(o.x+2, g-78,28,14);
      ctx.fillStyle = "#1a4a08";
      ctx.fillRect(o.x+4, g-56,3,20); ctx.fillRect(o.x+26,g-56,3,24);
    } else {
      ctx.fillStyle = "#6a3a18";
      ctx.fillRect(o.x+12,g-40,12,40);
      ctx.fillStyle = "#cc3322";
      ctx.fillRect(o.x-4, g-58,44,22);
      ctx.fillRect(o.x+2, g-66,32,12);
      ctx.fillRect(o.x+8, g-72,20,10);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(o.x+4, g-58,6,6); ctx.fillRect(o.x+18,g-62,5,5);
      ctx.fillRect(o.x+28,g-56,6,6); ctx.fillRect(o.x+12,g-54,4,4);
    }
  } else if (o.otype === "rock") {
    ctx.fillStyle = "#2a4a18";
    ctx.fillRect(o.x+2, g-20,40,20); ctx.fillRect(o.x+6, g-26,32,8);
    ctx.fillStyle = "#3a6a28";
    ctx.fillRect(o.x,   g-22,44,5);
    ctx.fillStyle = "#1a3a10";
    ctx.fillRect(o.x+8, g-18,6,6); ctx.fillRect(o.x+22,g-16,5,5);
  } else if (o.otype === "vineTrap") {
    const snap = o._snapState||0;
    ctx.fillStyle = "#1a5a10";
    ctx.fillRect(o.x,g-60,40,6);
    ctx.fillStyle = "#2a7a18";
    const openL = snap>0.5 ? 4 : 14;
    ctx.fillRect(o.x+2,    g-54, 6, 54-openL);
    ctx.fillRect(o.x+2,    g-openL, 14, openL);
    const openR = snap>0.5 ? 4 : 14;
    ctx.fillRect(o.x+32,   g-54, 6, 54-openR);
    ctx.fillRect(o.x+24,   g-openR, 14, openR);
    ctx.fillStyle = "#88ff44";
    for(let i=0;i<3;i++) ctx.fillRect(o.x+4+i*5, g-openL, 3, 5);
    for(let i=0;i<3;i++) ctx.fillRect(o.x+26+i*5,g-openR, 3, 5);
  } else if (o.otype === "giantMushroom") {
    ctx.fillStyle = "#6a3a18";
    ctx.fillRect(o.x+16,g-28,10,28);
    ctx.fillStyle = "#dd4422";
    ctx.fillRect(o.x,   g-36,42,12);
    ctx.fillRect(o.x+4, g-44,34,10);
    ctx.fillRect(o.x+10,g-50,22,8);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+6, g-40,5,5); ctx.fillRect(o.x+20,g-44,4,4);
    ctx.fillRect(o.x+30,g-38,5,5);
    if(Math.floor(frame/20)%2===0){
      ctx.fillStyle = "rgba(255,200,100,0.4)";
      ctx.fillRect(o.x+8,g-54,6,6); ctx.fillRect(o.x+28,g-52,5,5);
    }
  } else if (o.otype === "piranha") {
    const chomp = Math.floor(frame/18)%3===0;
    ctx.fillStyle = "#1a6a10";
    ctx.fillRect(o.x+16,g-40,8,40);
    ctx.fillRect(o.x+10,g-44,20,6);
    ctx.fillStyle = "#cc2244";
    ctx.fillRect(o.x+6, g-60,28,18);
    if (chomp) {
      ctx.fillStyle = "#ff4466";
      ctx.fillRect(o.x+8, g-56,24,10);
      ctx.fillStyle = "#ffffff";
      for(let i=0;i<4;i++) ctx.fillRect(o.x+9+i*6,g-56,4,5);
      for(let i=0;i<4;i++) ctx.fillRect(o.x+9+i*6,g-48,4,5);
    } else {
      ctx.fillStyle = "#aa1133";
      ctx.fillRect(o.x+8, g-52,24,4);
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+10,g-62,6,6); ctx.fillRect(o.x+24,g-62,6,6);
    ctx.fillStyle = "#000000";
    ctx.fillRect(o.x+12,g-60,3,3); ctx.fillRect(o.x+26,g-60,3,3);
  } else if (o.otype === "gorilla") {
    ctx.fillStyle = "#2a1a08";
    ctx.fillRect(o.x+6, g-52,32,52);
    ctx.fillRect(o.x+10,g-62,24,14);
    ctx.fillStyle = "#1a0a04";
    ctx.fillRect(o.x+10,g-62,24,5);
    ctx.fillStyle = "#cc8844";
    ctx.fillRect(o.x+14,g-58,6,6); ctx.fillRect(o.x+24,g-58,6,6);
    ctx.fillStyle = "#000";
    ctx.fillRect(o.x+16,g-56,3,3); ctx.fillRect(o.x+26,g-56,3,3);
    ctx.fillStyle = "#1a0a04";
    ctx.fillRect(o.x+16,g-50,4,3); ctx.fillRect(o.x+24,g-50,4,3);
    ctx.fillStyle = "#2a1a08";
    ctx.fillRect(o.x-2, g-46,12,22);
    ctx.fillRect(o.x+34,g-46,12,22);
    ctx.fillRect(o.x-4, g-26,10,8); ctx.fillRect(o.x+38,g-26,10,8);
    ctx.fillStyle = "#6a4a20";
    for(const b of (o.bullets||[])) {
      ctx.fillRect(b.x,b.y,10,10);
      ctx.fillStyle = "#4a2a10"; ctx.fillRect(b.x+2,b.y+2,3,3); ctx.fillStyle = "#6a4a20";
    }
  } else {
    ctx.fillStyle = "#1a5a10";
    for(let i=0;i<3;i++){ctx.fillRect(o.x+i*14,g-34,8,34); ctx.fillRect(o.x+i*14-2,g-36,12,6);}
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnJungleObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];
  if (tier === 0) {
    otype = r < 0.62 ? "cactus" : "bird";
    type = 0;
    if (otype === "bird") oy = GROUND_Y - 88 - Math.random() * 48;
    return { otype, type, oy, bullets };
  }
  if      (r < 0.24) { otype="cactus"; type=Math.floor(Math.random()*3); }
  else if (r < 0.38) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                       if(tier>=2&&Math.random()<0.35) oy=GROUND_Y-62;
                       if(tier>=2&&Math.random()<0.30) oy=GROUND_Y-36; }
  else if (r < 0.50) { otype="rock"; }
  else if (r < 0.62 && tier>=1) { otype="giantMushroom"; }
  else if (r < 0.72 && tier>=1) { otype="vineTrap"; }
  else if (r < 0.82 && tier>=2) { otype="piranha"; }
  else if (r < 0.96 && tier>=3) { otype="gorilla"; bullets=[]; }
  else                           { otype="cactus"; type=0; }
  return { otype, type, oy, bullets };
}
