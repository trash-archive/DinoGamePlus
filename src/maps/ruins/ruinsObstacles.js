// ─── RUINS OBSTACLES ─────────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawRuinsObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  if (o.otype === "cactus") {
    const t = o.type||0;
    const h = 32+(t*10);
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x+6,g-h,24,h);
    ctx.fillStyle = "#8a7a60";
    ctx.fillRect(o.x+2,g-8,32,8);
    ctx.fillStyle = "#6a5a40";
    ctx.fillRect(o.x+6,g-h,8,5); ctx.fillRect(o.x+20,g-h+3,8,4);
    ctx.fillStyle = "#5a4a38";
    ctx.fillRect(o.x+14,g-h+6,2,h-14); ctx.fillRect(o.x+9,g-h+16,2,12);
    ctx.fillStyle = "#4a6a30";
    ctx.fillRect(o.x+8,g-h+8,5,4); ctx.fillRect(o.x+18,g-h+20,4,3);
  } else if (o.otype === "pillar") {
    const t = o.type||0;
    const h = 44+t*8;
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x+6,g-h,24,h);
    ctx.fillStyle = "#8a7a60";
    ctx.fillRect(o.x+2,g-h,32,7);
    ctx.fillRect(o.x+2,g-10,32,10);
    ctx.fillStyle = "#d4c8a0";
    ctx.fillRect(o.x+22,g-h,12,10); ctx.fillRect(o.x+6,g-h+4,8,6);
    ctx.fillStyle = "#6a5a40";
    ctx.fillRect(o.x+6,g-h*0.5,24,4);
    ctx.fillStyle = "#4a3a28";
    ctx.fillRect(o.x+12,g-h+8,2,h-18); ctx.fillRect(o.x+20,g-h+14,2,h*0.4);
    ctx.fillStyle = "#3a5a28";
    ctx.fillRect(o.x+8,g-h+10,6,4); ctx.fillRect(o.x+18,g-h*0.5+6,5,3);
  } else if (o.otype === "statue") {
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x+4,g-52,28,52);
    ctx.fillRect(o.x+8,g-60,20,12);
    ctx.fillStyle = "#5a4a38";
    ctx.fillRect(o.x+10,g-56,5,5);
    ctx.fillRect(o.x+21,g-56,5,5);
    ctx.fillRect(o.x+12,g-50,12,3);
    const eyeGlow = Math.floor(frame/12)%2===0 ? "#ffaa00" : "#ff6600";
    ctx.fillStyle = eyeGlow;
    ctx.fillRect(o.x+11,g-55,3,3); ctx.fillRect(o.x+22,g-55,3,3);
    ctx.fillStyle = "#8a7a60";
    ctx.fillRect(o.x+6,g-64,24,6);
    ctx.fillRect(o.x+10,g-68,16,6);
    ctx.fillRect(o.x+14,g-72,8,6);
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x,g-44,8,16); ctx.fillRect(o.x+28,g-44,8,16);
    for(const b of (o.bullets||[])) {
      ctx.fillStyle = "#ffaa00"; ctx.fillRect(b.x,b.y,12,4);
      ctx.fillStyle = "#ff6600"; ctx.fillRect(b.x+2,b.y+1,6,2);
    }
  } else if (o.otype === "spiketrap") {
    const sh = o._spikeH||0;
    ctx.fillStyle = "#6a5a40";
    ctx.fillRect(o.x,g-6,44,6);
    ctx.fillStyle = "#8a7a60";
    for(let i=0;i<5;i++){
      const sx = o.x+2+i*9;
      ctx.beginPath();
      ctx.moveTo(sx,g-6);
      ctx.lineTo(sx+4,g-6-sh);
      ctx.lineTo(sx+8,g-6);
      ctx.fill();
    }
    if(sh>8){
      ctx.fillStyle = "#ccbbaa";
      for(let i=0;i<5;i++) ctx.fillRect(o.x+5+i*9,g-6-sh,2,3);
    }
  } else if (o.otype === "boulder") {
    const rot = (frame*0.06)%(Math.PI*2);
    const bounce = Math.abs(Math.sin(frame*0.12))*4;
    ctx.save();
    ctx.translate(o.x+16,g-16-bounce);
    ctx.rotate(rot);
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(-14,-8,28,16); ctx.fillRect(-10,-14,20,28);
    ctx.fillRect(-16,-4,32,8);
    ctx.fillStyle = "#5a4a38";
    ctx.fillRect(-8,-10,2,8); ctx.fillRect(4,-8,2,10);
    ctx.fillRect(-4,2,8,2);
    ctx.fillStyle = "#3a5a28";
    ctx.fillRect(-10,-6,4,4); ctx.fillRect(6,2,4,4);
    ctx.restore();
  } else if (o.otype === "golem") {
    const stomp = Math.floor(frame/20)%2;
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x+6, g-58,30,58);
    ctx.fillRect(o.x+8, g-68,26,14);
    ctx.fillStyle = "#5a4a38";
    ctx.fillRect(o.x+12,g-64,6,6);
    ctx.fillRect(o.x+24,g-64,6,6);
    ctx.fillRect(o.x+14,g-56,14,4);
    ctx.fillStyle = "#88aaff";
    ctx.fillRect(o.x+13,g-63,4,4); ctx.fillRect(o.x+25,g-63,4,4);
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x-2,g-52,10,24);
    if(stomp===0){
      ctx.fillRect(o.x+34,g-58,10,20);
    } else {
      ctx.fillRect(o.x+34,g-46,10,20);
    }
    ctx.fillStyle = "#6a5a40";
    ctx.fillRect(o.x-4,g-30,12,10); ctx.fillRect(o.x+34,stomp===0?g-40:g-28,12,10);
    ctx.fillRect(o.x+8,g-50,26,3); ctx.fillRect(o.x+8,g-38,26,3);
    ctx.fillStyle = "#8a7a60";
    for(const b of (o.bullets||[])) {
      ctx.fillRect(b.x,b.y,10,8);
      ctx.fillStyle = "#6a5a40"; ctx.fillRect(b.x+2,b.y+2,4,3); ctx.fillStyle = "#8a7a60";
    }
  } else {
    const h = 32;
    ctx.fillStyle = "#7a6a50"; ctx.fillRect(o.x+4,g-h,32,h);
    ctx.fillStyle = "#8a7a60"; ctx.fillRect(o.x+2,g-h,36,6);
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnRuinsObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];
  if(r<0.26){otype="cactus";type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1));}
  else if(r<0.40){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
  else if(r<0.54){otype="pillar";type=Math.floor(Math.random()*3);}
  else if(r<0.66&&tier>=1){otype="boulder";}
  else if(r<0.76&&tier>=2){otype="spiketrap";}
  else if(r<0.87&&tier>=2){otype="statue";bullets=[];}
  else if(r<0.96&&tier>=3){otype="golem";bullets=[];}
  else{otype="pillar";type=0;}
  return { otype, type, oy, bullets };
}
