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
  // ── Ember Lizard — low crouching, forces duck ──────────────────────────
  } else if (o.otype === "emberlizard") {
    const lc1 = "#6a1a00", lc2 = "#cc3300", lc3 = Math.floor(frame/10)%2===0 ? "#ff6600" : "#ffaa00";
    // Tail
    ctx.fillStyle = lc1;
    ctx.fillRect(o.x+38,g-10,16,6); ctx.fillRect(o.x+50,g-14,8,5); ctx.fillRect(o.x+56,g-16,6,4);
    // Body
    ctx.fillRect(o.x+4,g-16,36,12); ctx.fillRect(o.x+2,g-12,38,8);
    // Head
    ctx.fillRect(o.x+28,g-20,16,12);
    ctx.fillStyle = lc2;
    ctx.fillRect(o.x+40,g-18,8,8); ctx.fillRect(o.x+44,g-14,6,5);
    // Forked tongue
    ctx.fillStyle = lc3;
    ctx.fillRect(o.x+48,g-14,6,2); ctx.fillRect(o.x+52,g-16,2,2); ctx.fillRect(o.x+52,g-12,2,2);
    // Eye
    ctx.fillStyle = "#ffcc00"; ctx.fillRect(o.x+32,g-20,4,4);
    ctx.fillStyle = "#1a0800"; ctx.fillRect(o.x+33,g-19,2,2);
    // Dorsal spines
    ctx.fillStyle = lc2;
    ctx.fillRect(o.x+8,g-20,4,6); ctx.fillRect(o.x+16,g-22,4,8); ctx.fillRect(o.x+24,g-20,4,6);
    ctx.fillStyle = lc3;
    ctx.fillRect(o.x+9,g-22,2,4); ctx.fillRect(o.x+17,g-24,2,4); ctx.fillRect(o.x+25,g-22,2,4);
    // Legs
    ctx.fillStyle = lc2;
    ctx.fillRect(o.x+6,g-4,6,4); ctx.fillRect(o.x+16,g-4,6,4); ctx.fillRect(o.x+26,g-4,6,4);

  // ── Ash Cloud — environmental wall, drifts and pushes dino ───────────────
  } else if (o.otype === "ashCloud") {
    const alpha = 0.50 + Math.sin(frame*0.07)*0.10;
    const swirl = (frame*0.05)%(Math.PI*2);
    ctx.save();
    ctx.globalAlpha = alpha*0.75; ctx.fillStyle = "#2a1a10";
    ctx.fillRect(o.x,0,30,GROUND_Y);
    ctx.globalAlpha = alpha*0.50;
    ctx.fillRect(o.x-8,0,12,GROUND_Y); ctx.fillRect(o.x+26,0,12,GROUND_Y);
    ctx.globalAlpha = alpha*0.25;
    ctx.fillRect(o.x-18,0,12,GROUND_Y); ctx.fillRect(o.x+36,0,12,GROUND_Y);
    const ashLayers = [
      {y:GROUND_Y*0.15,r:10,col:"#ff4400"},{y:GROUND_Y*0.35,r:12,col:"#ff6600"},
      {y:GROUND_Y*0.55,r:10,col:"#ffaa00"},{y:GROUND_Y*0.75,r:11,col:"#ff4400"},
    ];
    for(const l of ashLayers){
      ctx.globalAlpha = alpha*0.9; ctx.fillStyle = l.col;
      for(let i=0;i<4;i++){
        const a=swirl+(i/4)*Math.PI*2;
        ctx.fillRect(o.x+15+Math.cos(a)*l.r-2, l.y+Math.sin(a)*4-2, 4, 4);
      }
    }
    ctx.restore();

  // ── Magma Golem — big tank, shoots arcing lava chunks ────────────────────
  } else if (o.otype === "magmaGolem") {
    const mc1 = "#2a1008", mc2 = "#5a2010";
    const mglow = Math.floor(frame/8)%2===0 ? "#ff4400" : "#ff6600";
    // Legs
    ctx.fillStyle = mc1;
    ctx.fillRect(o.x+4,g-20,14,20); ctx.fillRect(o.x+24,g-20,14,20);
    // Body
    ctx.fillRect(o.x+2,g-52,40,34); ctx.fillRect(o.x,g-44,44,22);
    // Rock cracks
    ctx.fillStyle = mc2;
    ctx.fillRect(o.x+6,g-48,10,4); ctx.fillRect(o.x+22,g-44,12,4);
    ctx.fillRect(o.x+8,g-36,8,4);  ctx.fillRect(o.x+28,g-38,10,4);
    // Lava cracks
    ctx.fillStyle = mglow;
    ctx.fillRect(o.x+10,g-46,4,14); ctx.fillRect(o.x+24,g-42,3,12);
    ctx.fillRect(o.x+16,g-34,6,8);  ctx.fillRect(o.x+32,g-30,4,8);
    // Head
    ctx.fillStyle = mc1;
    ctx.fillRect(o.x+8,g-66,28,16); ctx.fillRect(o.x+10,g-70,24,6);
    // Eyes
    ctx.fillStyle = "#ff8800";
    ctx.fillRect(o.x+12,g-64,6,6); ctx.fillRect(o.x+26,g-64,6,6);
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(o.x+13,g-63,3,3); ctx.fillRect(o.x+27,g-63,3,3);
    // Arms
    ctx.fillStyle = mc1;
    ctx.fillRect(o.x-8,g-50,12,10); ctx.fillRect(o.x-12,g-54,8,8);
    ctx.fillRect(o.x+40,g-50,12,10); ctx.fillRect(o.x+44,g-54,8,8);
    // Lava chunk projectiles
    for(const b of (o.bullets||[])){
      ctx.fillStyle = "#cc2200";
      ctx.fillRect(b.x-6,b.y-6,12,12); ctx.fillRect(b.x-8,b.y-4,4,8); ctx.fillRect(b.x+4,b.y-4,4,8);
      ctx.fillStyle = mglow; ctx.fillRect(b.x-4,b.y-4,8,8);
      ctx.fillStyle = "#ffcc00"; ctx.fillRect(b.x-2,b.y-2,4,4);
    }

  // ── Lava Bat — aerial swooper, dives toward dino ─────────────────────────
  } else if (o.otype === "lavaBat") {
    const isDiving = o._vultureState===1;
    const wf = isDiving ? 1 : Math.floor(frame/6)%2;
    ctx.save();
    ctx.translate(o.x+20,0); ctx.scale(-1,1); ctx.translate(-o.x-20,0);
    // Body
    ctx.fillStyle = "#8a1a00";
    ctx.fillRect(o.x+10,o.y+4,20,12); ctx.fillRect(o.x+22,o.y,10,8);
    // Horns
    ctx.fillStyle = "#cc2200";
    ctx.fillRect(o.x+22,o.y-6,3,8); ctx.fillRect(o.x+29,o.y-6,3,8);
    // Eyes
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(o.x+24,o.y+1,3,3); ctx.fillRect(o.x+29,o.y+1,3,3);
    ctx.fillStyle = "#1a0800";
    ctx.fillRect(o.x+25,o.y+2,1,1); ctx.fillRect(o.x+30,o.y+2,1,1);
    // Wings
    ctx.fillStyle = "#cc3300";
    if(wf===0){
      ctx.fillRect(o.x-8,o.y+2,20,8); ctx.fillRect(o.x-14,o.y+4,8,5); ctx.fillRect(o.x-18,o.y+6,6,4);
      ctx.fillRect(o.x+30,o.y+2,18,8); ctx.fillRect(o.x+46,o.y+4,8,5); ctx.fillRect(o.x+52,o.y+6,6,4);
      ctx.fillStyle = "#8a1a00";
      ctx.fillRect(o.x-6,o.y+4,2,6); ctx.fillRect(o.x+32,o.y+4,2,6);
    } else {
      ctx.fillRect(o.x+2,o.y+8,10,6); ctx.fillRect(o.x-2,o.y+10,6,4);
      ctx.fillRect(o.x+30,o.y+8,10,6); ctx.fillRect(o.x+38,o.y+10,6,4);
    }
    // Ember glow
    ctx.fillStyle = "rgba(255,80,0,0.25)";
    ctx.fillRect(o.x+8,o.y+12,24,6);
    ctx.restore();

  // ── Volcanic Vent — ground trap, extends/retracts fire burst ─────────────
  } else if (o.otype === "volcanicVent") {
    const ventH = o._ventH || 0;
    // Base plate
    ctx.fillStyle = "#3a1a08";
    ctx.fillRect(o.x+2,g-10,40,10); ctx.fillRect(o.x+6,g-14,32,6);
    ctx.fillStyle = "#1a0800"; ctx.fillRect(o.x+12,g-12,20,8);
    ctx.fillStyle = "#5a2010";
    ctx.fillRect(o.x+4,g-8,6,4); ctx.fillRect(o.x+18,g-10,8,4); ctx.fillRect(o.x+32,g-8,6,4);
    // Fire burst
    if(ventH > 2){
      const vp = Math.floor(frame/6)%3;
      ctx.fillStyle = "#cc2200"; ctx.fillRect(o.x+10,g-10-ventH,24,ventH);
      ctx.fillStyle = "#ff4400"; ctx.fillRect(o.x+12,g-10-ventH-vp*4,20,ventH);
      ctx.fillStyle = "#ff8800"; ctx.fillRect(o.x+14,g-10-ventH-vp*6,16,ventH*0.7);
      ctx.fillStyle = "#ffcc00"; ctx.fillRect(o.x+16,g-10-ventH-vp*4,12,ventH*0.4);
      ctx.fillStyle = "#ffee88";
      ctx.fillRect(o.x+14,g-10-ventH-vp*6-6,4,4); ctx.fillRect(o.x+22,g-10-ventH-vp*4-4,4,4);
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
  if (tier === 0) {
    otype = r < 0.62 ? "cactus" : "bird";
    if (otype === "bird") oy = GROUND_Y - 88 - Math.random() * 48;
    return { otype, type, oy, bullets };
  }
  if      (r < 0.10) { otype="cactus"; type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1)); }
  else if (r < 0.17) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                       if(tier>=2&&Math.random()<0.35) oy=GROUND_Y-62;
                       if(tier>=2&&Math.random()<0.30) oy=GROUND_Y-36; }
  else if (r < 0.24) { otype="lavarock"; }
  else if (r < 0.31) { otype="emberlizard"; }
  else if (r < 0.38 && tier>=1) { otype="firePillar"; }
  else if (r < 0.45 && tier>=1) { otype="volcanicVent"; }
  else if (r < 0.52 && tier>=2) { otype="lavaburst"; bullets=[]; }
  else if (r < 0.59 && tier>=2) { otype="firewall"; }
  else if (r < 0.65 && tier>=2) { otype="lavaBat"; oy=GROUND_Y-88-Math.random()*30; }
  else if (r < 0.71 && tier>=2) { otype="ashCloud"; }
  else if (r < 0.78 && tier>=3) { otype="demon"; oy=GROUND_Y-120-Math.random()*10; bullets=[]; } // top
  else if (r < 0.83 && tier>=3) { otype="demon"; oy=GROUND_Y-80-Math.random()*10;  bullets=[]; } // mid
  else if (r < 0.88 && tier>=3) { otype="demon"; oy=GROUND_Y-52-Math.random()*10;  bullets=[]; } // low
  else if (r < 0.95 && tier>=3) { otype="magmaGolem"; bullets=[]; }
  else                           { otype="lavarock"; }
  return { otype, type, oy, bullets };
}
