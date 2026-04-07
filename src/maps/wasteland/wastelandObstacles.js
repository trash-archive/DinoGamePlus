// ─── WASTELAND OBSTACLES ─────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawWastelandObstacle(ctx, o, frame) {
  const g   = GROUND_Y;
  const col = o._nightBlend > 0.5 ? "#dddddd" : "#222222";

  if (o.otype === "rock") {
    ctx.fillStyle = o._nightBlend > 0.5 ? "#aaaaaa" : "#555555";
    ctx.fillRect(o.x+4,g-18,28,18); ctx.fillRect(o.x+2,g-12,32,12); ctx.fillRect(o.x+8,g-22,18,6);

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

  } else if (o.otype === "tumbleweed") {
    // Spinning tumbleweed — black/white, rotates based on frame
    const cx = o.x + 18, cy = g - 16;
    const angle = (frame * 0.14) % (Math.PI * 2);
    const tw1 = col;                                          // main spokes
    const tw2 = o._nightBlend > 0.5 ? "#ffffff" : "#444444"; // highlight
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    // Outer ring segments (8 directions)
    ctx.fillStyle = tw1;
    ctx.fillRect(-14,-3,28,6);   // horizontal
    ctx.fillRect(-3,-14,6,28);   // vertical
    ctx.fillRect(-11,-11,6,6);   // TL
    ctx.fillRect(5,-11,6,6);     // TR
    ctx.fillRect(-11,5,6,6);     // BL
    ctx.fillRect(5,5,6,6);       // BR
    // Inner hub
    ctx.fillStyle = tw2;
    ctx.fillRect(-4,-4,8,8);
    ctx.restore();

  } else if (o.otype === "vulture") {
    // Aerial vulture — black/white, dives toward dino when close
    const vc  = col;
    const vc2 = o._nightBlend > 0.5 ? "#ffffff" : "#444444";
    const fw  = Math.floor(frame / 7) % 2;
    ctx.save();
    ctx.translate(o.x + 20, 0); ctx.scale(-1, 1); ctx.translate(-o.x - 20, 0);
    // Body
    ctx.fillStyle = vc;
    ctx.fillRect(o.x+6,  o.y+6,  24, 10);
    // Neck + bald head
    ctx.fillRect(o.x+22, o.y+2,  10,  8);
    ctx.fillRect(o.x+28, o.y,     8,  8); // head bump
    // Eye
    ctx.fillStyle = vc2;
    ctx.fillRect(o.x+30, o.y+2,   4,  4);
    ctx.fillStyle = vc;
    ctx.fillRect(o.x+31, o.y+3,   2,  2); // pupil
    // Hooked beak
    ctx.fillStyle = vc;
    ctx.fillRect(o.x+34, o.y+5,   6,  3);
    ctx.fillRect(o.x+38, o.y+7,   3,  2);
    // Wings
    if(fw===0){ ctx.fillRect(o.x-6,o.y-5,24,8); ctx.fillRect(o.x-12,o.y-8,8,5); ctx.fillRect(o.x+24,o.y+14,18,7); ctx.fillRect(o.x+40,o.y+18,8,5); }
    else       { ctx.fillRect(o.x-2,o.y+3,20,6); ctx.fillRect(o.x-6,o.y+6,6,4);  ctx.fillRect(o.x+24,o.y+16,16,5); ctx.fillRect(o.x+38,o.y+19,6,4); }
    // Talons
    ctx.fillRect(o.x+8,  o.y+14,  4,  4);
    ctx.fillRect(o.x+14, o.y+14,  4,  4);
    ctx.restore();

  } else if (o.otype === "bonepile") {
    // Wide low obstacle — black/white bones
    const bc  = col;
    const bc2 = o._nightBlend > 0.5 ? "#ffffff" : "#555555";
    // Ground mound
    ctx.fillStyle = bc2;
    ctx.fillRect(o.x+2,  g-8,  44, 8);
    ctx.fillRect(o.x+8,  g-12, 32, 5);
    // Bone 1 — horizontal long bone (left)
    ctx.fillStyle = bc;
    ctx.fillRect(o.x+4,  g-18,  3,  3); // left knob top
    ctx.fillRect(o.x+4,  g-22,  3,  3); // left knob bottom
    ctx.fillRect(o.x+7,  g-20, 10,  2); // shaft
    ctx.fillRect(o.x+17, g-18,  3,  3); // right knob top
    ctx.fillRect(o.x+17, g-22,  3,  3); // right knob bottom
    // Bone 2 — diagonal (mid), drawn as two offset rects
    ctx.fillRect(o.x+20, g-24,  3,  3);
    ctx.fillRect(o.x+20, g-20,  3,  3);
    ctx.fillRect(o.x+23, g-22, 10,  2);
    ctx.fillRect(o.x+33, g-24,  3,  3);
    ctx.fillRect(o.x+33, g-20,  3,  3);
    // Bone 3 — vertical bone (right)
    ctx.fillRect(o.x+38, g-26,  2,  3); // top knob
    ctx.fillRect(o.x+37, g-26,  4,  2);
    ctx.fillRect(o.x+38, g-23,  2, 10); // shaft
    ctx.fillRect(o.x+38, g-13,  2,  3); // bottom knob
    ctx.fillRect(o.x+37, g-13,  4,  2);
    // Skull hint (circle-ish)
    ctx.fillRect(o.x+10, g-28,  8,  6); // skull top
    ctx.fillRect(o.x+8,  g-24,  4,  4); // left
    ctx.fillRect(o.x+16, g-24,  4,  4); // right
    ctx.fillStyle = bc2;
    ctx.fillRect(o.x+11, g-27,  2,  2); // eye socket L
    ctx.fillRect(o.x+15, g-27,  2,  2); // eye socket R

  } else if (o.otype === "dust_devil") {
    // Wide spinning dust funnel — black/white, orbiting debris
    const spin = (frame * 0.18) % (Math.PI * 2);
    const dc1 = col;
    const dc2 = o._nightBlend > 0.5 ? "#bbbbbb" : "#555555";
    const dc3 = o._nightBlend > 0.5 ? "rgba(220,220,220," : "rgba(60,60,60,";
    // Funnel body — wide at top, narrow at base
    ctx.fillStyle = dc3 + "0.70)";
    ctx.fillRect(o.x,    g-72, 48, 14); // top wide band
    ctx.fillStyle = dc3 + "0.60)";
    ctx.fillRect(o.x+4,  g-58, 40, 14);
    ctx.fillStyle = dc3 + "0.65)";
    ctx.fillRect(o.x+8,  g-44, 32, 14);
    ctx.fillStyle = dc3 + "0.70)";
    ctx.fillRect(o.x+12, g-30, 24, 14);
    ctx.fillStyle = dc3 + "0.80)";
    ctx.fillRect(o.x+16, g-16, 16, 16); // narrow base
    // Spinning debris orbiting the funnel at 3 heights
    const debrisPositions = [
      { r: 22, cy: g-60, size: 4 },
      { r: 16, cy: g-42, size: 3 },
      { r: 10, cy: g-24, size: 3 },
    ];
    for(const {r, cy, size} of debrisPositions) {
      const a1 = spin;
      const a2 = spin + Math.PI * 0.66;
      const a3 = spin + Math.PI * 1.33;
      ctx.fillStyle = dc1;
      ctx.fillRect(o.x+24 + Math.cos(a1)*r - size/2, cy - size/2, size, size);
      ctx.fillStyle = dc2;
      ctx.fillRect(o.x+24 + Math.cos(a2)*r - size/2, cy - size/2, size, size);
      ctx.fillStyle = dc1;
      ctx.fillRect(o.x+24 + Math.cos(a3)*r - size/2, cy - size/2, size, size);
    }

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

  // Tier 0: cactus + bird only
  if (tier === 0) {
    if (r < 0.60) { otype = "cactus"; type = 0; }
    else          { otype = "bird"; oy = GROUND_Y - 88 - Math.random() * 48; }
    return { otype, type, oy, bullets };
  }

  // Tier 1+: introduce rock, wall, tumbleweed
  // Tier 2+: spike, spike_cluster, bonepile
  // Tier 3+: turret, dust_devil
  // Tier 4+: vulture (dives)
  // Bird: 3 heights from tier 2 (high / mid / low)

  if      (r < 0.28) { otype="cactus"; type=Math.floor(Math.random()*(Math.min(4,Math.floor(tier/1.5)+1)+1)); }
  else if (r < 0.40) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                       if(tier>=2&&Math.random()<0.35) oy=GROUND_Y-62; // mid height
                       if(tier>=2&&Math.random()<0.30) oy=GROUND_Y-36; // low — must jump, ducking doesn't help
                     }
  else if (r < 0.48 && tier>=1) { otype="vulture"; oy=GROUND_Y-88-Math.random()*30; }
  else if (r < 0.56) { otype="rock"; }
  else if (r < 0.63 && tier>=2) { otype="spike"; }
  else if (r < 0.70 && tier>=2) { otype="spike_cluster"; }
  else if (r < 0.76 && tier>=2) { otype="bonepile"; }
  else if (r < 0.82 && tier>=1) { otype="tumbleweed"; }
  else if (r < 0.88 && tier>=3) { otype="turret"; bullets=[]; }
  else if (r < 0.93 && tier>=3) { otype="dust_devil"; }
  else if (tier>=1)              { otype="wall"; }
  else                           { otype="cactus"; type=0; }

  return { otype, type, oy, bullets };
}
