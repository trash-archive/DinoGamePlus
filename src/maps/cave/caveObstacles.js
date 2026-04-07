// ─── CRYSTAL CAVE OBSTACLES ───────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawCaveObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  const pulse = Math.floor(frame/10)%2;
  const glow1 = pulse===0 ? "#cc88ff" : "#aa55dd";
  const glow2 = pulse===0 ? "#8844ff" : "#6622cc";
  const glow3 = pulse===0 ? "#ff88ff" : "#dd55dd";

  if (o.otype === "cactus") {
    const t = o.type||0;
    const h = 30+t*10;
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+10,g-h,10,h);
    ctx.fillRect(o.x+24,g-h*0.7,8,h*0.7);
    ctx.fillRect(o.x,g-h*0.5,8,h*0.5);
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+12,g-h,6,5);
    ctx.fillRect(o.x+26,g-h*0.7,4,4);
    ctx.fillStyle = `rgba(136,68,255,0.15)`;
    ctx.fillRect(o.x-4,g-h-8,44,h+8);
  } else if (o.otype === "crystalSpire") {
    const t = o.type||0;
    const h = 48+t*10;
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+10,g-h,16,h);
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+12,g-h,6,8);
    ctx.fillRect(o.x+14,g-h*0.6,4,6);
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+26,g-h*0.75,10,h*0.75);
    ctx.fillRect(o.x,g-h*0.55,10,h*0.55);
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+28,g-h*0.75,4,5);
    ctx.fillRect(o.x+2,g-h*0.55,4,4);
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+14,g-h+8,4,h-20);
    ctx.fillStyle = `rgba(136,68,255,0.18)`;
    ctx.fillRect(o.x-6,g-h-10,48,h+10);
    if(pulse===0){
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(o.x+8,g-h-4,2,2);
      ctx.fillRect(o.x+28,g-h*0.8,2,2);
      ctx.fillRect(o.x+18,g-h*0.4,2,2);
    }
  } else if (o.otype === "crystalCluster") {
    const heights = [28,22,32,18,26,20,30];
    for(let i=0;i<7;i++){
      const cx = o.x+i*8;
      const ch = heights[i];
      ctx.fillStyle = i%2===0 ? glow2 : "#5522aa";
      ctx.fillRect(cx+1,g-ch,6,ch);
      ctx.fillStyle = glow1;
      ctx.fillRect(cx+2,g-ch,3,4);
      ctx.fillStyle = glow3;
      ctx.fillRect(cx+3,g-ch+5,2,ch-10);
    }
    ctx.fillStyle = "rgba(136,68,255,0.2)";
    ctx.fillRect(o.x-2,g-34,56,34);
  } else if (o.otype === "stalactite") {
    const sy = o._stalY ?? -30;
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+4,sy,12,28);
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+5,sy,5,6);
    ctx.fillRect(o.x+7,sy+10,3,4);
    ctx.fillStyle = glow3;
    ctx.beginPath();
    ctx.moveTo(o.x+4,sy+28); ctx.lineTo(o.x+10,sy+42); ctx.lineTo(o.x+16,sy+28);
    ctx.fill();
    ctx.fillStyle = "rgba(136,68,255,0.2)";
    ctx.fillRect(o.x,sy-2,20,46);
    if(sy > g-60){
      ctx.fillStyle = glow1;
      ctx.fillRect(o.x+8,sy+44,3,3);
      ctx.fillRect(o.x+4,sy+40,2,2);
      ctx.fillRect(o.x+14,sy+42,2,2);
    }
  } else if (o.otype === "crystalGolem") {
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+6, g-60,30,60);
    ctx.fillRect(o.x+8, g-70,26,14);
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+2, g-54,6,10);
    ctx.fillRect(o.x+34,g-54,6,10);
    ctx.fillRect(o.x+10,g-68,6,10);
    ctx.fillRect(o.x+26,g-68,6,10);
    ctx.fillRect(o.x+18,g-74,6,8);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+12,g-66,6,6); ctx.fillRect(o.x+24,g-66,6,6);
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+13,g-65,4,4); ctx.fillRect(o.x+25,g-65,4,4);
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x-4,g-50,12,20);
    ctx.fillRect(o.x+34,g-50,12,20);
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x-6,g-52,5,8); ctx.fillRect(o.x+43,g-52,5,8);
    ctx.fillStyle = "rgba(200,100,255,0.2)";
    ctx.fillRect(o.x+6,g-60,30,60);
    for(const b of (o.bullets||[])){
      ctx.fillStyle = glow1;
      ctx.fillRect(b.x,b.y,8,4);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(b.x+1,b.y+1,3,2);
    }
  } else if (o.otype === "voidPortal") {
    const spin = Math.floor(frame/6)%4;
    ctx.fillStyle = "#0a0010";
    ctx.fillRect(o.x+8, g-58,20,50);
    ctx.fillRect(o.x+4, g-54,28,42);
    ctx.fillRect(o.x+2, g-48,32,34);
    const ringCols = ["#8844ff","#aa22ff","#6622cc","#cc44ff"];
    ctx.fillStyle = ringCols[spin];
    ctx.fillRect(o.x,   g-50,6,34);
    ctx.fillRect(o.x+30,g-50,6,34);
    ctx.fillRect(o.x+6, g-64,24,8);
    ctx.fillRect(o.x+6, g-14,24,8);
    ctx.fillStyle = ringCols[(spin+2)%4];
    ctx.fillRect(o.x+10,g-56,16,6);
    ctx.fillRect(o.x+10,g-20,16,6);
    ctx.fillRect(o.x+2, g-46,6,24);
    ctx.fillRect(o.x+28,g-46,6,24);
    ctx.fillStyle = "#cc44ff";
    ctx.fillRect(o.x+14,g-38,8,8);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+16,g-36,4,4);
    ctx.fillStyle = "rgba(100,20,200,0.15)";
    ctx.fillRect(o.x-8,g-72,52,72);
  } else if (o.otype === "crystalMine") {
    const my = o.y;
    const bob = Math.sin(frame*0.08)*4;
    const exploding = o._exploding||0;
    if(exploding > 0){
      ctx.fillStyle = glow1;
      for(const b of (o.bullets||[])){
        ctx.fillRect(b.x,b.y,6,6);
        ctx.fillStyle = "#ffffff"; ctx.fillRect(b.x+1,b.y+1,2,2); ctx.fillStyle = glow1;
      }
    } else {
      ctx.fillStyle = glow2;
      ctx.fillRect(o.x+4, my+bob+2,16,16);
      ctx.fillRect(o.x+2, my+bob+6,20,8);
      ctx.fillRect(o.x+6, my+bob,12,20);
      ctx.fillStyle = glow1;
      ctx.fillRect(o.x+10,my+bob-4,4,6);
      ctx.fillRect(o.x+10,my+bob+18,4,6);
      ctx.fillRect(o.x-2, my+bob+8,6,4);
      ctx.fillRect(o.x+20,my+bob+8,6,4);
      ctx.fillStyle = glow3;
      ctx.fillRect(o.x+8, my+bob+6,8,8);
      ctx.fillStyle = "rgba(200,100,255,0.3)";
      ctx.fillRect(o.x,   my+bob-6,24,32);
      ctx.fillStyle = `rgba(255,100,255,${0.06+Math.sin(frame*0.3)*0.04})`;
      ctx.fillRect(o.x-10,my+bob-10,44,44);
    }
  } else {
    ctx.fillStyle = glow2;
    const h = 28;
    ctx.fillRect(o.x+8,g-h,10,h); ctx.fillRect(o.x+22,g-h*0.8,10,h*0.8);
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+10,g-h,6,4); ctx.fillRect(o.x+24,g-h*0.8,6,4);
    ctx.fillStyle = "rgba(160,80,255,0.15)";
    ctx.fillRect(o.x,g-h-10,44,h+10);
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnCaveObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];
  if (tier === 0) {
    otype = r < 0.62 ? "cactus" : "bird";
    if (otype === "bird") oy = GROUND_Y - 88 - Math.random() * 48;
    return { otype, type, oy, bullets };
  }
  if      (r < 0.18) { otype="cactus"; type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1)); }
  else if (r < 0.32) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                       if(tier>=2&&Math.random()<0.35) oy=GROUND_Y-62;
                       if(tier>=2&&Math.random()<0.30) oy=GROUND_Y-36; }
  else if (r < 0.46) { otype="crystalSpire"; type=Math.floor(Math.random()*3); }
  else if (r < 0.58 && tier>=1) { otype="crystalCluster"; }
  else if (r < 0.68 && tier>=2) { otype="stalactite"; oy=-30; }
  else if (r < 0.78 && tier>=2) { otype="crystalMine"; oy=GROUND_Y-80-Math.random()*60; bullets=[]; }
  else if (r < 0.89 && tier>=3) { otype="crystalGolem"; bullets=[]; }
  else if (r < 0.97 && tier>=3) { otype="voidPortal"; }
  else                           { otype="crystalSpire"; type=0; }
  return { otype, type, oy, bullets };
}
