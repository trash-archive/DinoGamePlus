// ─── DESERT OBSTACLES ────────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawDesertObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  if (o.otype === "cactus") {
    const t = o.type||0;
    const col = o._nightBlend > 0.5 ? "#a06828" : "#c87820";
    ctx.fillStyle = col;
    if (o._flipped) {
      const cx = o.x + 22;
      ctx.save();
      ctx.translate(cx * 2, 0); ctx.scale(-1, 1);
    }
    if(t===0){ctx.fillRect(o.x+10,g-44,10,44);ctx.fillRect(o.x+2,g-28,28,8);ctx.fillRect(o.x+2,g-36,10,12);ctx.fillRect(o.x+22,g-34,10,10);}
    else if(t===1){ctx.fillRect(o.x+8,g-62,10,62);ctx.fillRect(o.x,g-42,26,8);ctx.fillRect(o.x,g-54,10,15);ctx.fillRect(o.x+20,g-50,10,13);ctx.fillRect(o.x+20,g-60,14,10);}
    else if(t===2){
      ctx.fillRect(o.x+10, g-52, 10, 52);
      ctx.fillRect(o.x,    g-38,  12, 8);
      ctx.fillRect(o.x,    g-50,   8, 14);
      ctx.fillRect(o.x+20, g-28,  14, 8);
      ctx.fillRect(o.x+26, g-42,   8, 16);
      ctx.fillRect(o.x+28, g-18,   8, 18);
      ctx.fillRect(o.x+36, g-14,   8, 6);
      ctx.fillRect(o.x+38, g-22,   6, 10);
    }
    else if(t===3){for(let i=0;i<3;i++){ctx.fillRect(o.x+i*16+4,g-36,8,36);ctx.fillRect(o.x+i*16,g-24,16,7);}}
    else{ctx.fillRect(o.x+14,g-34,12,34);ctx.fillRect(o.x,g-20,40,8);ctx.fillRect(o.x,g-28,14,10);ctx.fillRect(o.x+28,g-30,14,12);ctx.fillRect(o.x,g-34,14,8);ctx.fillRect(o.x+28,g-36,14,8);}
    if (o._flipped) ctx.restore();
  } else if (o.otype === "dune") {
    // Smooth sand dune — wide gentle mound with crest and shadow
    const dc1 = o._nightBlend > 0.5 ? "#a06828" : "#e0a850";
    const dc2 = o._nightBlend > 0.5 ? "#c08030" : "#f0c060";
    const dc3 = o._nightBlend > 0.5 ? "#7a4e18" : "#c08838";
    // Main dune body — wide smooth arc built from stacked rects
    ctx.fillStyle = dc1;
    ctx.fillRect(o.x,    g-4,  72, 4);   // base
    ctx.fillRect(o.x+2,  g-8,  68, 4);
    ctx.fillRect(o.x+6,  g-13, 60, 5);
    ctx.fillRect(o.x+12, g-18, 48, 5);
    ctx.fillRect(o.x+18, g-23, 36, 5);
    ctx.fillRect(o.x+24, g-27, 24, 4);
    ctx.fillRect(o.x+28, g-30, 16, 3);
    ctx.fillRect(o.x+30, g-32, 12, 2);
    ctx.fillRect(o.x+32, g-33,  8, 1);
    // Windswept crest highlight
    ctx.fillStyle = dc2;
    ctx.fillRect(o.x+22, g-24, 28, 2);
    ctx.fillRect(o.x+26, g-28, 18, 2);
    ctx.fillRect(o.x+30, g-31, 10, 1);
    // Shadow on the lee side (right)
    ctx.fillStyle = dc3;
    ctx.fillRect(o.x+44, g-18, 14, 5);
    ctx.fillRect(o.x+50, g-13, 10, 5);
    ctx.fillRect(o.x+56, g-8,   8, 4);
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
  } else if (o.otype === "dust_devil") {
    const cx = o.x + 20;
    const spin = (frame * 0.18) % (Math.PI * 2);
    // Funnel body — wide top, narrow bottom
    ctx.fillStyle = "rgba(210,160,60,0.38)";
    ctx.beginPath(); ctx.moveTo(cx-22,g-72); ctx.lineTo(cx+22,g-72); ctx.lineTo(cx+5,g); ctx.lineTo(cx-5,g); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(230,180,80,0.28)";
    ctx.beginPath(); ctx.moveTo(cx-16,g-72); ctx.lineTo(cx+16,g-72); ctx.lineTo(cx+3,g-20); ctx.lineTo(cx-3,g-20); ctx.closePath(); ctx.fill();
    // Spinning sand particles at 3 heights
    const layers = [{r:20,y:g-60,count:6},{r:13,y:g-38,count:5},{r:6,y:g-18,count:4}];
    ctx.fillStyle = "#e0a840";
    for(const l of layers){
      for(let i=0;i<l.count;i++){
        const a = spin + (i/l.count)*Math.PI*2;
        const px = cx + Math.cos(a)*l.r;
        const py = l.y + Math.sin(a)*3;
        ctx.fillRect(px-2,py-2,4,4);
      }
    }
    // Dark core
    ctx.fillStyle = "rgba(120,70,10,0.45)";
    ctx.fillRect(cx-3,g-68,6,60);
  } else if (o.otype === "scorpion") {
    const sc1 = "#6a3a08";
    const sc2 = "#9a5a18";
    const sc3 = "#cc2200";
    // Tail raise amount based on proximity stored in _wormH reuse pattern
    const raise = Math.min(28, o._tailRaise||0);
    // Body — wide flat
    ctx.fillStyle = sc1;
    ctx.fillRect(o.x+8,  g-12, 28, 12);
    ctx.fillRect(o.x+4,  g-10, 36, 8);
    // Head (front, facing left toward player)
    ctx.fillRect(o.x+30, g-14, 12, 10);
    // Eyes
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(o.x+33, g-13, 3, 3);
    ctx.fillRect(o.x+38, g-13, 3, 3);
    // Pincers
    ctx.fillStyle = sc2;
    ctx.fillRect(o.x+40, g-18, 6, 4);
    ctx.fillRect(o.x+44, g-14, 6, 4);
    ctx.fillRect(o.x+40, g-10, 8, 3);
    ctx.fillStyle = sc1;
    ctx.fillRect(o.x+46, g-18, 4, 8);
    ctx.fillStyle = sc2;
    ctx.fillRect(o.x-2,  g-18, 6, 4);
    ctx.fillRect(o.x-4,  g-14, 6, 4);
    ctx.fillRect(o.x-4,  g-10, 8, 3);
    ctx.fillStyle = sc1;
    ctx.fillRect(o.x-4,  g-18, 4, 8);
    // Legs
    ctx.fillStyle = sc1;
    for(let i=0;i<4;i++){
      ctx.fillRect(o.x+10+i*6, g-4, 4, 4);
      ctx.fillRect(o.x+12+i*6, g-8, 2, 4);
      ctx.fillRect(o.x+10+i*6, g,   4, 3);
    }
    // Tail — extends toward player (left), raise animates upward
    ctx.fillStyle = sc2;
    ctx.fillRect(o.x+4,  g-14,        8, 5);           // seg 1 base
    ctx.fillRect(o.x+2,  g-14-raise*0.25|0, 7, 6);     // seg 2
    ctx.fillRect(o.x-4,  g-16-raise*0.55|0, 6, 6);     // seg 3 moves left+up
    ctx.fillRect(o.x-10, g-14-raise*0.80|0, 6, 5);     // seg 4
    ctx.fillRect(o.x-15, g-12-raise,        5, 5);      // seg 5 tip
    // Stinger
    ctx.fillStyle = sc3;
    ctx.fillRect(o.x-19, g-13-raise,        5, 4);
    ctx.fillRect(o.x-22, g-16-raise,        3, 4);
    ctx.fillRect(o.x-23, g-19-raise,        2, 3);
  } else if (o.otype === "vulture") {
    const isDiving = o._vultureState === 1;
    const fw = isDiving ? 1 : Math.floor(frame/7)%2;
    ctx.save();
    ctx.translate(o.x+20, 0); ctx.scale(-1,1); ctx.translate(-o.x-20, 0);
    // Body — dark brown desert vulture
    ctx.fillStyle = "#3a2008";
    ctx.fillRect(o.x+6, o.y+6,  26, 14);
    // Neck (bare/red)
    ctx.fillStyle = "#cc4422";
    ctx.fillRect(o.x+22, o.y+2, 10, 8);
    // Head
    ctx.fillStyle = "#3a2008";
    ctx.fillRect(o.x+28, o.y,   10, 8);
    // Bald red head patch
    ctx.fillStyle = "#dd3311"; ctx.fillRect(o.x+28,o.y,10,6);
    // Hooked beak
    ctx.fillStyle = "#cc9900"; ctx.fillRect(o.x+36,o.y+2,6,3); ctx.fillRect(o.x+40,o.y+4,3,2);
    // Eye
    ctx.fillStyle = "#ffcc00"; ctx.fillRect(o.x+30,o.y+1,4,4);
    ctx.fillStyle = "#1a0800"; ctx.fillRect(o.x+31,o.y+2,2,2);
    // Talons
    ctx.fillStyle = "#2a1408";
    ctx.fillRect(o.x+8,  o.y+18, 4, 4);
    ctx.fillRect(o.x+14, o.y+18, 4, 4);
    // Wings
    ctx.fillStyle = "#3a2008";
    if(fw===0){
      ctx.fillRect(o.x-10,o.y-2,22,8); ctx.fillRect(o.x-16,o.y-6,8,6); ctx.fillRect(o.x-20,o.y-8,6,4);
      ctx.fillRect(o.x+28,o.y+16,18,8); ctx.fillRect(o.x+44,o.y+20,10,5); ctx.fillRect(o.x+52,o.y+22,6,4);
      ctx.fillStyle = "#5a3a18";
      ctx.fillRect(o.x-8,o.y-1,14,3); ctx.fillRect(o.x+30,o.y+17,12,3);
    } else {
      ctx.fillRect(o.x-2, o.y+6, 14, 7); ctx.fillRect(o.x-6, o.y+9, 6, 5);
      ctx.fillRect(o.x+28,o.y+6, 12, 7); ctx.fillRect(o.x+38,o.y+9, 6, 5);
    }
    // Tail
    ctx.fillStyle = "#3a2008"; ctx.fillRect(o.x+2,o.y+16,12,6); ctx.fillRect(o.x+4,o.y+20,8,4);
    ctx.restore();
  } else if (o.otype === "mummy") {
    // Wrapped mummy — cream bandages, dark gaps
    ctx.fillStyle = "#d4c8a0";
    ctx.fillRect(o.x+8, g-52, 22, 52); // body
    ctx.fillRect(o.x+4, g-52, 30, 14); // shoulders
    ctx.fillRect(o.x+10,g-64, 18, 14); // head
    // Bandage wrap lines
    ctx.fillStyle = "#a89870";
    for(let i=0;i<5;i++) ctx.fillRect(o.x+4,g-48+i*9,30,2);
    ctx.fillRect(o.x+10,g-62,18,2); ctx.fillRect(o.x+10,g-56,18,2);
    // Eyes — glowing teal
    ctx.fillStyle = "#00ddcc";
    ctx.fillRect(o.x+13,g-60,5,4);
    ctx.fillRect(o.x+20,g-60,5,4);
    ctx.fillStyle = "#aaffee"; ctx.fillRect(o.x+14,g-59,2,2); ctx.fillRect(o.x+21,g-59,2,2);
    // Trailing bandage strips
    ctx.fillStyle = "#c4b890";
    ctx.fillRect(o.x+2, g-30, 4, 18);
    ctx.fillRect(o.x+32,g-26, 4, 14);
    // Bullets (bandage wraps shot horizontally)
    ctx.fillStyle = "#d4c8a0";
    for(const b of (o.bullets||[])) {
      ctx.fillRect(b.x,b.y-2,14,4);
      ctx.fillStyle="#a89870"; ctx.fillRect(b.x+2,b.y-1,10,2); ctx.fillStyle="#d4c8a0";
    }
  } else if (o.otype === "obelisk") {
    // Tall stone obelisk with hieroglyph markings
    ctx.fillStyle = "#c8a870";
    ctx.fillRect(o.x+12,g-80, 16, 80); // shaft
    ctx.fillRect(o.x+8, g-80, 24, 10); // base cap
    // Pyramid tip
    ctx.fillStyle = "#e0c080";
    ctx.beginPath(); ctx.moveTo(o.x+20,g-96); ctx.lineTo(o.x+10,g-80); ctx.lineTo(o.x+30,g-80); ctx.closePath(); ctx.fill();
    // Hieroglyph markings
    ctx.fillStyle = "#8a6030";
    ctx.fillRect(o.x+15,g-72,10,3);
    ctx.fillRect(o.x+15,g-62,10,3);
    ctx.fillRect(o.x+15,g-52,10,3);
    ctx.fillRect(o.x+17,g-68,3,5); ctx.fillRect(o.x+22,g-68,3,5);
    ctx.fillRect(o.x+17,g-58,6,3);
    // Gold tip glow
    ctx.fillStyle = "#ffdd44";
    ctx.fillRect(o.x+18,g-96,4,4);
    // Curse beam bullets
    ctx.fillStyle = "#ffaa00";
    for(const b of (o.bullets||[])) {
      ctx.fillRect(b.x,b.y-2,12,4);
      ctx.fillStyle="#ffee88"; ctx.fillRect(b.x+2,b.y-1,8,2); ctx.fillStyle="#ffaa00";
    }
  } else {
    ctx.fillStyle = "#d4a050";
    ctx.fillRect(o.x,g-16,44,16); ctx.fillRect(o.x+4,g-24,36,10);
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnDesertObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];

  // Tier 0: only cactus and bird
  if (tier === 0) {
    otype = r < 0.65 ? "cactus" : "bird";
    if (otype === "bird") oy = GROUND_Y - 88 - Math.random() * 48;
    const flipped0 = otype === "cactus" && Math.random() < 0.5;
    return { otype, type, oy, bullets, _flipped: flipped0 };
  }

  // Tiers 1+: full roster with tier-gated unlocks
  if      (r < 0.20) { otype="cactus"; type=Math.floor(Math.random()*(Math.min(4,Math.floor(tier/1.5)+1)+1)); }
  else if (r < 0.30) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                       if(tier>=2&&Math.random()<0.35) oy=GROUND_Y-62;
                       if(tier>=2&&Math.random()<0.30) oy=GROUND_Y-36; }
  else if (r < 0.40) { otype="dune"; }
  else if (r < 0.50) { otype="tumbleweed"; }
  else if (r < 0.60 && tier>=2) { otype="sandworm"; }
  else if (r < 0.68 && tier>=2) { otype="dust_devil"; }
  else if (r < 0.76 && tier>=3) { otype="scorpion"; }
  else if (r < 0.83 && tier>=3) { otype="vulture"; oy=GROUND_Y-90-Math.random()*40; }
  else if (r < 0.90 && tier>=4) { otype="mummy"; bullets=[]; }
  else if (r < 0.96 && tier>=5) { otype="obelisk"; bullets=[]; }
  else                           { otype="cactus"; type=0; }

  const flipped = otype === "cactus" && Math.random() < 0.5;
  return { otype, type, oy, bullets, _flipped: flipped };
}
