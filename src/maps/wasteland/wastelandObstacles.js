// ─── WASTELAND OBSTACLES ─────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawWastelandObstacle(ctx, o, frame) {
  const g   = GROUND_Y;
  const col = o._nightBlend > 0.5 ? "#dddddd" : "#222222";

  if (o.otype === "rock") {
    ctx.fillStyle = o._nightBlend > 0.5 ? "#aaaaaa" : "#555555";
    ctx.fillRect(o.x+4,g-18,28,18); ctx.fillRect(o.x,g-12,36,12); ctx.fillRect(o.x+8,g-22,18,6);
  } else if (o.otype === "spike") {
    ctx.fillStyle = col;
    for(let i=0;i<3;i++){const bx=o.x+i*14;ctx.beginPath();ctx.moveTo(bx+2,g);ctx.lineTo(bx+7,g-26);ctx.lineTo(bx+12,g);ctx.fill();}
  } else if (o.otype === "spike_cluster") {
    ctx.fillStyle = col;
    for(let i=0;i<5;i++){const bx=o.x+i*12;ctx.beginPath();ctx.moveTo(bx,g);ctx.lineTo(bx+6,g-30);ctx.lineTo(bx+12,g);ctx.fill();}
  } else if (o.otype === "turret") {
    const tc = o._nightBlend > 0.5 ? "#aaaaaa" : "#444444";
    ctx.fillStyle=tc;
    ctx.fillRect(o.x+4,g-28,32,28);
    ctx.fillRect(o.x+8,g-36,24,10);
    ctx.fillRect(o.x+28,g-32,14,6);
    ctx.fillStyle=o._nightBlend>0.5?"#ff4444":"#cc0000";
    ctx.fillRect(o.x+10,g-34,6,6);
    ctx.fillStyle=o._nightBlend>0.5?"#ffff88":"#ffcc00";
    for(const b of (o.bullets||[])) ctx.fillRect(b.x,b.y,8,4);
  } else if (o.otype === "wall") {
    ctx.fillStyle = o._nightBlend > 0.5 ? "#999999" : "#333333";
    ctx.fillRect(o.x,g-28,18,28);
    ctx.fillStyle = o._nightBlend > 0.5 ? "#bbbbbb" : "#555555";
    for(let r=0;r<3;r++) ctx.fillRect(o.x+2,g-28+r*10,14,2);
  } else {
    // cactus variants (type 0–4)
    const t=o.type||0; ctx.fillStyle=col;
    if(t===0){ctx.fillRect(o.x+10,g-44,10,44);ctx.fillRect(o.x+2,g-28,28,8);ctx.fillRect(o.x+2,g-36,10,12);ctx.fillRect(o.x+22,g-34,10,10);}
    else if(t===1){ctx.fillRect(o.x+8,g-62,10,62);ctx.fillRect(o.x,g-42,26,8);ctx.fillRect(o.x,g-54,10,15);ctx.fillRect(o.x+20,g-50,10,13);ctx.fillRect(o.x+20,g-60,14,10);}
    else if(t===2){ctx.fillRect(o.x+4,g-40,9,40);ctx.fillRect(o.x+20,g-40,9,40);ctx.fillRect(o.x+4,g-52,9,14);ctx.fillRect(o.x+18,g-52,12,9);ctx.fillRect(o.x,g-26,32,8);}
    else if(t===3){for(let i=0;i<3;i++){ctx.fillRect(o.x+i*16+4,g-36,8,36);ctx.fillRect(o.x+i*16,g-24,16,7);}}
    else{ctx.fillRect(o.x+14,g-34,12,34);ctx.fillRect(o.x,g-20,40,8);ctx.fillRect(o.x,g-28,14,10);ctx.fillRect(o.x+28,g-30,14,12);ctx.fillRect(o.x,g-34,14,8);ctx.fillRect(o.x+28,g-36,14,8);}
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnWastelandObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];
  if(r<0.38){otype="cactus";type=Math.floor(Math.random()*(Math.min(4,Math.floor(tier/1.5)+1)+1));}
  else if(r<0.55){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
  else if(r<0.66&&tier>=1){otype="rock";}
  else if(r<0.76&&tier>=2){otype="spike";}
  else if(r<0.86&&tier>=2){otype="spike_cluster";}
  else if(r<0.94&&tier>=3){otype="turret";bullets=[];}
  else if(tier>=1){otype="wall";}
  else{otype="cactus";type=0;}
  return { otype, type, oy, bullets };
}
