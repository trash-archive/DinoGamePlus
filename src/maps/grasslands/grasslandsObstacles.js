// ─── GRASSLANDS OBSTACLES ─────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawGrasslandsObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  if (o.otype === "rock") {
    ctx.fillStyle = "#667755";
    ctx.fillRect(o.x+4,g-18,28,18); ctx.fillRect(o.x,g-12,36,12); ctx.fillRect(o.x+8,g-22,18,6);
  } else if (o.otype === "spike") {
    ctx.fillStyle = "#334422";
    for(let i=0;i<3;i++){const bx=o.x+i*14;ctx.beginPath();ctx.moveTo(bx+2,g);ctx.lineTo(bx+7,g-26);ctx.lineTo(bx+12,g);ctx.fill();}
  } else if (o.otype === "log") {
    const logRot = (frame*0.08)%(Math.PI*2);
    ctx.save();
    ctx.translate(o.x+22, g-9);
    ctx.rotate(logRot);
    ctx.fillStyle = "#7a4a1a"; ctx.fillRect(-20,-9,40,18);
    ctx.fillStyle = "#5a3010"; ctx.fillRect(-20,-2,40,4);
    ctx.fillStyle = "#9a6a3a"; ctx.fillRect(-20,-9,40,3);
    ctx.restore();
  } else if (o.otype === "turret") {
    ctx.fillStyle = "#3a5a2a";
    ctx.fillRect(o.x+4,g-28,32,28);
    ctx.fillRect(o.x+8,g-36,24,10);
    ctx.fillRect(o.x+28,g-32,14,6);
    ctx.fillStyle = "#cc2200";
    ctx.fillRect(o.x+10,g-34,6,6);
    ctx.fillStyle = "#ffcc00";
    for(const b of (o.bullets||[])) ctx.fillRect(b.x,b.y,8,4);
  } else if (o.otype === "wall") {
    ctx.fillStyle = "#5a7a3a";
    ctx.fillRect(o.x,g-28,18,28);
    ctx.fillStyle = "#7a9a5a";
    for(let r=0;r<3;r++) ctx.fillRect(o.x+2,g-28+r*10,14,2);
  } else {
    // cactus variants (type 0–2)
    const t = o.type||0; ctx.fillStyle = "#334422";
    if(t===0){ctx.fillRect(o.x+10,g-44,10,44);ctx.fillRect(o.x+2,g-28,28,8);ctx.fillRect(o.x+2,g-36,10,12);ctx.fillRect(o.x+22,g-34,10,10);}
    else if(t===1){ctx.fillRect(o.x+8,g-62,10,62);ctx.fillRect(o.x,g-42,26,8);ctx.fillRect(o.x,g-54,10,15);ctx.fillRect(o.x+20,g-50,10,13);ctx.fillRect(o.x+20,g-60,14,10);}
    else{ctx.fillRect(o.x+4,g-40,9,40);ctx.fillRect(o.x+20,g-40,9,40);ctx.fillRect(o.x+4,g-52,9,14);ctx.fillRect(o.x+18,g-52,12,9);ctx.fillRect(o.x,g-26,32,8);}
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnGrasslandsObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];
  if(r<0.36){otype="cactus";type=Math.floor(Math.random()*(Math.min(3,Math.floor(tier/1.5)+1)+1));}
  else if(r<0.52){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
  else if(r<0.64&&tier>=1){otype="rock";}
  else if(r<0.74&&tier>=2){otype="spike";}
  else if(r<0.84&&tier>=1){otype="log";}
  else if(r<0.93&&tier>=3){otype="turret";bullets=[];}
  else if(tier>=1){otype="wall";}
  else{otype="cactus";type=0;}
  return { otype, type, oy, bullets };
}
