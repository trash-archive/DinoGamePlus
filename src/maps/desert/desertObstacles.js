// ─── DESERT OBSTACLES ────────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawDesertObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  if (o.otype === "cactus") {
    const t = o.type||0; ctx.fillStyle = "#c87820";
    if(t===0){ctx.fillRect(o.x+10,g-48,10,48);ctx.fillRect(o.x+2,g-30,28,8);ctx.fillRect(o.x+2,g-38,10,12);ctx.fillRect(o.x+22,g-36,10,10);}
    else if(t===1){ctx.fillRect(o.x+8,g-66,10,66);ctx.fillRect(o.x,g-44,26,8);ctx.fillRect(o.x,g-56,10,15);ctx.fillRect(o.x+20,g-52,10,13);ctx.fillRect(o.x+20,g-64,14,10);}
    else{ctx.fillRect(o.x+4,g-44,9,44);ctx.fillRect(o.x+20,g-44,9,44);ctx.fillRect(o.x+4,g-56,9,15);ctx.fillRect(o.x+18,g-56,12,10);ctx.fillRect(o.x,g-28,32,8);}
  } else if (o.otype === "dune") {
    ctx.fillStyle = "#e0a850";
    ctx.beginPath(); ctx.moveTo(o.x,g); ctx.lineTo(o.x+8,g-22); ctx.lineTo(o.x+28,g-22);
    ctx.lineTo(o.x+56,g); ctx.fill();
    ctx.fillStyle = "#f0c060";
    ctx.beginPath(); ctx.moveTo(o.x+10,g-18); ctx.lineTo(o.x+20,g-22); ctx.lineTo(o.x+36,g-22);
    ctx.lineTo(o.x+46,g-18); ctx.fill();
    ctx.fillStyle = "#c89040";
    ctx.fillRect(o.x+14,g-14,18,2); ctx.fillRect(o.x+18,g-10,12,2);
  } else if (o.otype === "tumbleweed") {
    const rot = (frame*0.12)%(Math.PI*2);
    const bounce = Math.abs(Math.sin(frame*0.18))*6;
    ctx.save();
    ctx.translate(o.x+18, g-18-bounce);
    ctx.rotate(rot);
    ctx.strokeStyle = "#8a5a20"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-14,0); ctx.lineTo(14,0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-14); ctx.lineTo(0,14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-10,-10); ctx.lineTo(10,10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10,-10); ctx.lineTo(-10,10); ctx.stroke();
    ctx.strokeStyle = "#6a4010"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.stroke();
    ctx.restore();
  } else if (o.otype === "sandworm") {
    const wh = o._wormH||0;
    if (wh > 2) {
      ctx.fillStyle = "#c87820";
      ctx.fillRect(o.x+8,g-wh,24,wh);
      ctx.fillStyle = "#e09030";
      ctx.fillRect(o.x+10,g-wh,20,8);
      ctx.fillStyle = "#2a1a08";
      ctx.fillRect(o.x+13,g-wh+2,5,4);
      ctx.fillRect(o.x+22,g-wh+2,5,4);
      ctx.fillStyle = "#f0f0e0";
      for(let i=0;i<4;i++) ctx.fillRect(o.x+11+i*5,g-wh+6,3,4);
      ctx.fillStyle = "rgba(224,168,80,0.5)";
      ctx.fillRect(o.x+2,g-8,36,8);
    }
  } else if (o.otype === "scorpion") {
    ctx.fillStyle = "#8a4a10";
    ctx.fillRect(o.x+6,g-14,32,14);
    ctx.fillRect(o.x+2,g-10,8,10);
    ctx.fillRect(o.x+34,g-10,8,10);
    ctx.fillRect(o.x,g-8,6,6);
    ctx.fillRect(o.x+38,g-8,6,6);
    ctx.fillStyle = "#aa6020";
    ctx.fillRect(o.x+28,g-20,8,8);
    ctx.fillRect(o.x+32,g-30,7,12);
    ctx.fillRect(o.x+34,g-38,6,10);
    ctx.fillStyle = "#cc2200";
    ctx.fillRect(o.x+35,g-44,5,8);
    ctx.fillStyle = "#ff4400";
    ctx.fillRect(o.x+12,g-18,5,5);
    ctx.fillRect(o.x+27,g-18,5,5);
    ctx.fillStyle = "#88ff00";
    for(const b of (o.bullets||[])) {
      ctx.fillRect(b.x,b.y,7,7);
      ctx.fillStyle = "#ccff44"; ctx.fillRect(b.x+2,b.y+2,3,3); ctx.fillStyle = "#88ff00";
    }
  } else {
    ctx.fillStyle = "#d4a050";
    ctx.fillRect(o.x,g-16,44,16); ctx.fillRect(o.x+4,g-24,36,10);
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnDesertObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];
  if (tier === 0) {
    otype = r < 0.62 ? "cactus" : "bird";
    if (otype === "bird") oy = GROUND_Y - 88 - Math.random() * 48;
    return { otype, type, oy, bullets };
  }
  if      (r < 0.26) { otype="cactus"; type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1)); }
  else if (r < 0.40) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                       if(tier>=2&&Math.random()<0.35) oy=GROUND_Y-62;
                       if(tier>=2&&Math.random()<0.30) oy=GROUND_Y-36; }
  else if (r < 0.54) { otype="dune"; }
  else if (r < 0.66 && tier>=1) { otype="tumbleweed"; }
  else if (r < 0.78 && tier>=2) { otype="sandworm"; }
  else if (r < 0.92 && tier>=3) { otype="scorpion"; bullets=[]; }
  else                           { otype="cactus"; type=0; }
  return { otype, type, oy, bullets };
}
