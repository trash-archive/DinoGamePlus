// ─── VOLCANO OBSTACLES ───────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawVolcanoObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  if (o.otype === "cactus" || o.otype === "spike") {
    ctx.fillStyle = "#5a1800";
    ctx.fillRect(o.x+4,g-40,14,40); ctx.fillRect(o.x+20,g-30,14,30); ctx.fillRect(o.x,g-20,10,20);
    ctx.fillStyle = "#cc3300";
    ctx.fillRect(o.x+6,g-42,10,4); ctx.fillRect(o.x+22,g-32,10,4);
    ctx.fillStyle = "#ff6600";
    if(Math.floor(frame/15)%2===0){ctx.fillRect(o.x+10,g-38,4,6); ctx.fillRect(o.x+25,g-28,3,5);}
  } else if (o.otype === "lavarock") {
    ctx.fillStyle = "#3a1a08";
    ctx.fillRect(o.x+4,g-26,38,26); ctx.fillRect(o.x,g-18,46,18); ctx.fillRect(o.x+8,g-30,28,6);
    ctx.fillStyle = "#5a2a10";
    ctx.fillRect(o.x+2,g-22,8,6); ctx.fillRect(o.x+14,g-28,10,6); ctx.fillRect(o.x+30,g-24,10,6);
    const glow = Math.floor(frame/10)%2===0 ? "#ff4400" : "#ff6600";
    ctx.fillStyle = glow;
    ctx.fillRect(o.x+8,g-20,4,12); ctx.fillRect(o.x+20,g-24,3,16);
    ctx.fillRect(o.x+30,g-18,4,10); ctx.fillRect(o.x+14,g-14,6,8);
    ctx.fillStyle = "rgba(255,100,0,0.3)";
    ctx.fillRect(o.x,g-32,46,6);
  } else if (o.otype === "firePillar") {
    const pulse = Math.floor(frame/8)%3;
    const ph = 38 + pulse*6;
    ctx.fillStyle = "#3a1a08";
    ctx.fillRect(o.x+8,g-16,20,16);
    ctx.fillStyle = "#cc2200";
    ctx.fillRect(o.x+10,g-ph,16,ph-16);
    ctx.fillStyle = "#ff4400";
    ctx.fillRect(o.x+12,g-ph-8,12,ph-10);
    ctx.fillStyle = "#ff8800";
    ctx.fillRect(o.x+14,g-ph-14,8,ph-16);
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(o.x+16,g-ph-18,4,10);
    if(pulse===0){
      ctx.fillStyle = "#ff6600";
      ctx.fillRect(o.x+10,g-ph-20,4,6); ctx.fillRect(o.x+22,g-ph-16,4,6);
    }
  } else if (o.otype === "lavaburst") {
    ctx.fillStyle = "#5a1800";
    ctx.fillRect(o.x+4,g-16,32,16);
    ctx.fillStyle = "#882200";
    ctx.fillRect(o.x+10,g-20,20,6);
    ctx.fillStyle = "#ff4400";
    ctx.fillRect(o.x+14,g-22,12,4);
    for(const b of (o.bullets||[])){
      const bsize = 8+Math.sin(frame*0.2)*2;
      ctx.fillStyle = "#ff4400";
      ctx.fillRect(b.x-bsize/2,b.y-bsize/2,bsize,bsize);
      ctx.fillStyle = "#ffaa00";
      ctx.fillRect(b.x-bsize/2+2,b.y-bsize/2+2,bsize-4,bsize-4);
    }
  } else if (o.otype === "firewall") {
    ctx.fillStyle = "#3a1a08";
    ctx.fillRect(o.x+2,g-60,10,60);
    const fw = Math.floor(frame/6)%3;
    ctx.fillStyle = "#cc2200";
    ctx.fillRect(o.x,g-60,14,60);
    ctx.fillStyle = "#ff4400";
    ctx.fillRect(o.x+1,g-60-fw*4,12,60);
    ctx.fillStyle = "#ff8800";
    ctx.fillRect(o.x+3,g-58-fw*6,8,50);
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(o.x+5,g-52-fw*4,4,30);
    ctx.fillStyle = "#ffee88";
    ctx.fillRect(o.x+6,g-62-fw*6,2,8);
  } else if (o.otype === "demon") {
    const dy = o.y;
    const wf = Math.floor(frame/5)%2;
    ctx.fillStyle = "#8a1a00";
    ctx.fillRect(o.x+10,dy+8,24,20);
    ctx.fillRect(o.x+14,dy+2,16,10);
    ctx.fillStyle = "#cc2200";
    ctx.fillRect(o.x+14,dy-6,4,10);
    ctx.fillRect(o.x+26,dy-6,4,10);
    ctx.fillStyle = "#cc3300";
    if(wf===0){
      ctx.fillRect(o.x-14,dy+2,26,10); ctx.fillRect(o.x-20,dy,10,8);
      ctx.fillRect(o.x+32,dy+2,18,10); ctx.fillRect(o.x+48,dy,8,8);
    } else {
      ctx.fillRect(o.x-8,dy+12,20,8);  ctx.fillRect(o.x-12,dy+16,8,6);
      ctx.fillRect(o.x+32,dy+12,16,8); ctx.fillRect(o.x+46,dy+16,6,6);
    }
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(o.x+15,dy+4,5,5);
    ctx.fillRect(o.x+24,dy+4,5,5);
    ctx.fillStyle = "#8a1a00";
    ctx.fillRect(o.x+4,dy+20,10,6); ctx.fillRect(o.x,dy+24,8,5);
    ctx.fillStyle = "#ff4400"; ctx.fillRect(o.x-2,dy+26,6,4);
    ctx.fillStyle = "#ff6600";
    for(const b of (o.bullets||[])){
      ctx.fillRect(b.x,b.y,10,8);
      ctx.fillStyle = "#ffcc00"; ctx.fillRect(b.x+2,b.y+2,4,3); ctx.fillStyle = "#ff6600";
    }
  } else {
    ctx.fillStyle = "#5a1800";
    ctx.fillRect(o.x,g-22,44,22); ctx.fillRect(o.x+4,g-28,36,8);
    ctx.fillStyle = "#882200"; ctx.fillRect(o.x+2,g-24,40,3);
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnVolcanoObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];
  if(r<0.26){otype="cactus";type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1));}
  else if(r<0.40){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
  else if(r<0.54){otype="lavarock";}
  else if(r<0.66&&tier>=1){otype="firePillar";}
  else if(r<0.76&&tier>=2){otype="lavaburst";bullets=[];}
  else if(r<0.86&&tier>=2){otype="firewall";}
  else if(r<0.96&&tier>=3){otype="demon";oy=GROUND_Y-110-Math.random()*40;bullets=[];}
  else{otype="lavarock";}
  return { otype, type, oy, bullets };
}
