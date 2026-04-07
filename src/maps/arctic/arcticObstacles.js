// ─── ARCTIC OBSTACLES ────────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawArcticObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  if (o.otype === "cactus") {
    const h = 40+(o.type||0)*12;
    ctx.fillStyle = "#88aabb";
    ctx.fillRect(o.x+10,g-h,12,h); ctx.fillRect(o.x+24,g-h*0.7,10,h*0.7); ctx.fillRect(o.x,g-h*0.5,10,h*0.5);
    ctx.fillStyle = "#ddeeff";
    ctx.fillRect(o.x+12,g-h,8,6); ctx.fillRect(o.x+26,g-h*0.7,6,4);
  } else if (o.otype === "icewall") {
    ctx.fillStyle = "#6699bb";
    ctx.fillRect(o.x,g-34,16,34);
    ctx.fillStyle = "#88bbdd";
    ctx.fillRect(o.x+2,g-34,12,6);
    ctx.fillRect(o.x+2,g-24,12,4);
    ctx.fillRect(o.x+2,g-14,12,4);
    ctx.fillStyle = "rgba(220,240,255,0.6)";
    ctx.fillRect(o.x+3,g-32,4,8);
  } else if (o.otype === "snowball") {
    const bounce = Math.abs(Math.sin(frame*0.14))*5;
    const rot = (frame*0.09)%(Math.PI*2);
    ctx.save();
    ctx.translate(o.x+16,g-18-bounce);
    ctx.rotate(rot);
    ctx.fillStyle = "#ddeeff";
    ctx.fillRect(-12,-6,24,12); ctx.fillRect(-8,-12,16,24);
    ctx.fillRect(-14,-4,28,8);
    ctx.fillStyle = "#aaccee";
    ctx.fillRect(-10,-10,4,4); ctx.fillRect(6,-10,4,4);
    ctx.fillRect(-10,6,4,4);   ctx.fillRect(6,6,4,4);
    ctx.restore();
  } else if (o.otype === "frostspike") {
    // Mid-tier: 3 upward ice spikes, shorter than icewall, taller than snowball
    ctx.fillStyle = "#88bbdd";
    for(let i=0;i<3;i++){
      const bx=o.x+i*14;
      ctx.fillRect(bx+2,g-32,10,32);
      ctx.fillStyle="#aaddff"; ctx.fillRect(bx+3,g-32,4,8); ctx.fillStyle="#88bbdd";
      ctx.beginPath(); ctx.moveTo(bx+2,g-32); ctx.lineTo(bx+7,g-44); ctx.lineTo(bx+12,g-32); ctx.fill();
      ctx.fillStyle="#ddeeff"; ctx.fillRect(bx+5,g-42,4,6); ctx.fillStyle="#88bbdd";
    }
  } else if (o.otype === "icicle") {
    const iy = o._icicleY ?? -20;
    ctx.fillStyle = "#aaddff";
    ctx.fillRect(o.x+4,iy,10,24);
    ctx.fillStyle = "#ddeeff";
    ctx.fillRect(o.x+5,iy,4,8);
    ctx.fillStyle = "#88ccee";
    ctx.beginPath();
    ctx.moveTo(o.x+4,iy+24); ctx.lineTo(o.x+9,iy+34); ctx.lineTo(o.x+14,iy+24);
    ctx.fill();
    if (iy > g-50) {
      ctx.fillStyle = "rgba(136,204,238,0.4)";
      ctx.fillRect(o.x,g-4,36,4);
    }
  } else if (o.otype === "yeti") {
    ctx.fillStyle = "#ddeeff";
    ctx.fillRect(o.x+6,g-52,32,52);
    ctx.fillRect(o.x+10,g-60,24,12);
    ctx.fillStyle = "#bbddee";
    for(let i=0;i<4;i++) ctx.fillRect(o.x+6+i*8,g-52,6,6);
    for(let i=0;i<4;i++) ctx.fillRect(o.x+6+i*8,g-38,6,6);
    ctx.fillStyle = "#ddeeff";
    ctx.fillRect(o.x,g-44,10,18);
    ctx.fillRect(o.x+34,g-44,10,18);
    ctx.fillStyle = "#aabbcc";
    ctx.fillRect(o.x-2,g-28,5,8); ctx.fillRect(o.x+3,g-28,5,8);
    ctx.fillRect(o.x+36,g-28,5,8); ctx.fillRect(o.x+41,g-28,5,8);
    ctx.fillStyle = "#ff2200";
    ctx.fillRect(o.x+13,g-58,6,6);
    ctx.fillRect(o.x+25,g-58,6,6);
    ctx.fillStyle = "#334455";
    ctx.fillRect(o.x+14,g-50,16,4);
    ctx.fillStyle = "#aaddff";
    for(const b of (o.bullets||[])) {
      ctx.fillRect(b.x,b.y,10,8);
      ctx.fillStyle = "#ddeeff"; ctx.fillRect(b.x+1,b.y+1,4,3); ctx.fillStyle = "#aaddff";
    }
  } else {
    ctx.fillStyle = "#88aabb";
    const h = 28;
    ctx.fillRect(o.x+10,g-h,12,h); ctx.fillRect(o.x+24,g-h*0.7,10,h*0.7);
    ctx.fillStyle = "#ddeeff"; ctx.fillRect(o.x+12,g-h,8,6);
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnArcticObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];
  if (tier === 0) {
    otype = r < 0.62 ? "cactus" : "bird";
    if (otype === "bird") oy = GROUND_Y - 88 - Math.random() * 48;
    return { otype, type, oy, bullets };
  }
  if      (r < 0.24) { otype="cactus"; type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1)); }
  else if (r < 0.38) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                       if(tier>=2&&Math.random()<0.35) oy=GROUND_Y-62;
                       if(tier>=2&&Math.random()<0.30) oy=GROUND_Y-36; }
  else if (r < 0.52) { otype="icewall"; }
  else if (r < 0.63 && tier>=1) { otype="snowball"; }
  else if (r < 0.73 && tier>=2) { otype="frostspike"; }
  else if (r < 0.83 && tier>=2) { otype="icicle"; oy=-20; }
  else if (r < 0.95 && tier>=3) { otype="yeti"; bullets=[]; }
  else                           { otype="cactus"; type=0; }
  return { otype, type, oy, bullets };
}
