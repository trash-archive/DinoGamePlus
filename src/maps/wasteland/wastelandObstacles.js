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
    const sp2 = o._nightBlend > 0.5 ? "#dddddd" : "#222222";
    ctx.fillStyle = sp2;
    for(const [bx,h] of [[2,22],[15,30],[28,20]]) {
      ctx.beginPath(); ctx.moveTo(o.x+bx,g); ctx.lineTo(o.x+bx+7,g-h); ctx.lineTo(o.x+bx+14,g); ctx.fill();
    }

  } else if (o.otype === "spike_cluster") {
    const sp2 = o._nightBlend > 0.5 ? "#dddddd" : "#222222";
    ctx.fillStyle = sp2;
    for(const [bx,h] of [[0,20],[11,30],[22,34],[33,28],[46,18]]) {
      ctx.beginPath(); ctx.moveTo(o.x+bx,g); ctx.lineTo(o.x+bx+7,g-h); ctx.lineTo(o.x+bx+14,g); ctx.fill();
    }

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
    const wc1 = o._nightBlend > 0.5 ? "#aaaaaa" : "#2a2a2a";
    const wc2 = o._nightBlend > 0.5 ? "#cccccc" : "#484848";
    const wc3 = o._nightBlend > 0.5 ? "#888888" : "#111111";
    const wx = o.x;
    ctx.fillStyle = wc1;
    // Main wall body
    ctx.fillRect(wx,    g-48, 22, 48);
    // Two crenellations on top
    ctx.fillRect(wx,    g-56,  8,  8);
    ctx.fillRect(wx+14, g-56,  8,  8);
    // Left edge highlight
    ctx.fillStyle = wc2;
    ctx.fillRect(wx, g-48, 2, 48);
    ctx.fillRect(wx, g-56, 2,  8);
    ctx.fillRect(wx+14, g-56, 2, 8);
    // Single horizontal crack line for detail
    ctx.fillStyle = wc3;
    ctx.fillRect(wx+2, g-24, 18, 2);
    ctx.fillRect(wx+2, g-38, 18, 2);

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

  } else if (o.otype === "skull") {
    const sc  = o._nightBlend > 0.5 ? "#dddddd" : "#2e2e2e";
    const sc2 = o._nightBlend > 0.5 ? "#aaaaaa" : "#111111";
    const sc3 = o._nightBlend > 0.5 ? "#ffffff" : "#555555";
    ctx.fillStyle = sc;
    // Cranium
    ctx.fillRect(o.x+2,  g-16, 14, 16);
    ctx.fillRect(o.x+4,  g-18, 10,  4);
    ctx.fillRect(o.x,    g-12, 18,  6);
    // Brow + upper snout
    ctx.fillRect(o.x+14, g-14,  6,  3);
    ctx.fillRect(o.x+18, g-12, 16,  5);
    // Lower jaw
    ctx.fillRect(o.x+20, g-7,  12,  7);
    // Snout tip
    ctx.fillRect(o.x+32, g-12,  4, 12);
    // Eye socket
    ctx.fillStyle = sc2;
    ctx.fillRect(o.x+4,  g-14,  6,  6);
    // Jaw gap
    ctx.fillRect(o.x+20, g-7,  12,  2);
    // Teeth
    ctx.fillStyle = sc3;
    ctx.fillRect(o.x+21, g-5,   2,  3);
    ctx.fillRect(o.x+25, g-5,   2,  3);
    ctx.fillRect(o.x+29, g-5,   2,  3);

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
    // cactus variants (type 0–4), with optional horizontal mirror
    const t = o.type || 0;
    ctx.fillStyle = col;
    if (o._flipped) {
      const cx = o.x + 22;
      ctx.save();
      ctx.translate(cx * 2, 0); ctx.scale(-1, 1);
    }
    if(t===0){ctx.fillRect(o.x+10,g-44,10,44);ctx.fillRect(o.x+2,g-28,28,8);ctx.fillRect(o.x+2,g-36,10,12);ctx.fillRect(o.x+22,g-34,10,10);}
    else if(t===1){ctx.fillRect(o.x+8,g-62,10,62);ctx.fillRect(o.x,g-42,26,8);ctx.fillRect(o.x,g-54,10,15);ctx.fillRect(o.x+20,g-50,10,13);ctx.fillRect(o.x+20,g-60,14,10);}
    else if(t===2){
      // Main trunk (tall, center-left)
      ctx.fillRect(o.x+10, g-52, 10, 52);
      // Left arm: horizontal stub then upward tip
      ctx.fillRect(o.x,    g-38,  12, 8);  // horizontal
      ctx.fillRect(o.x,    g-50,   8, 14); // upward tip
      // Right arm: horizontal stub at a different height then upward tip
      ctx.fillRect(o.x+20, g-28,  14, 8);  // horizontal
      ctx.fillRect(o.x+26, g-42,   8, 16); // upward tip
      // Small side trunk (shorter, right) with its own right arm
      ctx.fillRect(o.x+28, g-18,   8, 18);
      ctx.fillRect(o.x+36, g-14,   8, 6);  // right arm stub (connected to side trunk)
      ctx.fillRect(o.x+38, g-22,   6, 10); // upward tip of side arm
    }
    else if(t===3){for(let i=0;i<3;i++){ctx.fillRect(o.x+i*16+4,g-36,8,36);ctx.fillRect(o.x+i*16,g-24,16,7);}}
    else{ctx.fillRect(o.x+14,g-34,12,34);ctx.fillRect(o.x,g-20,40,8);ctx.fillRect(o.x,g-28,14,10);ctx.fillRect(o.x+28,g-30,14,12);ctx.fillRect(o.x,g-34,14,8);ctx.fillRect(o.x+28,g-36,14,8);}
    if (o._flipped) ctx.restore();
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnWastelandObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];

  // Tier 0: cactus + bird only
  if (tier === 0) {
    if (r < 0.60) { otype = "cactus"; type = 0; }
    else          { otype = "bird"; oy = GROUND_Y - 88 - Math.random() * 48; }
    const flipped0 = otype === "cactus" && Math.random() < 0.5;
    return { otype, type, oy, bullets, _flipped: flipped0 };
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
  else if (r < 0.76 && tier>=2) { otype="spike_cluster"; }
  else if (r < 0.82 && tier>=1) { otype="tumbleweed"; }
  else if (r < 0.88 && tier>=1) { otype="skull"; }
  else if (r < 0.92 && tier>=3) { otype="turret"; bullets=[]; }
  else if (r < 0.96 && tier>=3) { otype="dust_devil"; }
  else if (tier>=1)              { otype="wall"; }
  else                           { otype="cactus"; type=0; }

  const flipped = otype === "cactus" && Math.random() < 0.5;
  return { otype, type, oy, bullets, _flipped: flipped };
}
