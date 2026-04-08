// ─── GRASSLANDS OBSTACLES ─────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawGrasslandsObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  if (o.otype === "rock") {
    // Mossy field boulder
    ctx.fillStyle = "#7a7a6a"; ctx.fillRect(o.x+6,g-20,28,20); ctx.fillRect(o.x+2,g-14,36,14); ctx.fillRect(o.x+10,g-26,18,8);
    ctx.fillStyle = "#5a5a4a"; ctx.fillRect(o.x+2,g-14,8,14); ctx.fillRect(o.x+10,g-26,6,8);  // shadow
    ctx.fillStyle = "#9aaa7a"; ctx.fillRect(o.x+8,g-26,10,4); ctx.fillRect(o.x+4,g-16,12,4); ctx.fillRect(o.x+22,g-18,10,3); // moss
    ctx.fillStyle = "#aabb88"; ctx.fillRect(o.x+10,g-27,6,2); ctx.fillRect(o.x+6,g-17,6,2);  // moss highlight
  } else if (o.otype === "spike") {
    // Thornbush — organic cluster of thorny branches
    ctx.fillStyle = "#3a2a10";
    ctx.fillRect(o.x+4,g-8,34,8);                                    // base
    // Main branches
    ctx.fillRect(o.x+8,g-28,5,22); ctx.fillRect(o.x+18,g-34,5,26); ctx.fillRect(o.x+28,g-24,5,18);
    // Side thorns
    ctx.fillRect(o.x+2,g-22,8,4); ctx.fillRect(o.x+14,g-16,8,4); ctx.fillRect(o.x+24,g-20,8,4);
    ctx.fillRect(o.x+6,g-30,6,4); ctx.fillRect(o.x+20,g-36,6,4); ctx.fillRect(o.x+30,g-26,6,4);
    // Thorn tips
    ctx.fillStyle = "#1a1208";
    ctx.fillRect(o.x+2,g-24,3,3); ctx.fillRect(o.x+20,g-38,3,3); ctx.fillRect(o.x+34,g-28,3,3);
    // Sparse leaves
    ctx.fillStyle = "#2a5a10";
    ctx.fillRect(o.x+6,g-32,6,5); ctx.fillRect(o.x+16,g-38,8,5); ctx.fillRect(o.x+26,g-28,6,5);
  } else if (o.otype === "log") {
    // Running boar — charging toward the dino
    const legFrame = Math.floor(frame / 5) % 2;
    // Body
    ctx.fillStyle = "#5a3a20"; ctx.fillRect(o.x+4,g-26,34,18);    // main body
    ctx.fillStyle = "#3a2010"; ctx.fillRect(o.x+4,g-26,8,18);     // body shadow
    ctx.fillStyle = "#7a5a38"; ctx.fillRect(o.x+6,g-24,20,8);     // body highlight
    // Rump hump
    ctx.fillStyle = "#5a3a20"; ctx.fillRect(o.x+28,g-32,12,10);
    ctx.fillStyle = "#7a5a38"; ctx.fillRect(o.x+30,g-30,8,6);
    // Head (left side, facing dino)
    ctx.fillStyle = "#5a3a20"; ctx.fillRect(o.x,g-28,14,16);
    ctx.fillStyle = "#3a2010"; ctx.fillRect(o.x,g-28,4,16);       // head shadow
    // Snout
    ctx.fillStyle = "#7a5040"; ctx.fillRect(o.x-6,g-24,10,10);
    ctx.fillStyle = "#5a3830"; ctx.fillRect(o.x-6,g-24,3,10);
    ctx.fillStyle = "#2a1810"; ctx.fillRect(o.x-6,g-22,3,3); ctx.fillRect(o.x-6,g-18,3,3); // nostrils
    // Tusk
    ctx.fillStyle = "#eeddaa"; ctx.fillRect(o.x-8,g-22,6,3);
    // Eye
    ctx.fillStyle = "#1a1008"; ctx.fillRect(o.x+2,g-26,4,4);
    ctx.fillStyle = "#ff4400"; ctx.fillRect(o.x+3,g-25,2,2);      // angry red eye
    // Ear
    ctx.fillStyle = "#4a2a10"; ctx.fillRect(o.x+8,g-32,6,8);
    ctx.fillStyle = "#7a4a28"; ctx.fillRect(o.x+9,g-31,4,5);
    // Legs
    ctx.fillStyle = "#4a2a10";
    if(legFrame===0){
      ctx.fillRect(o.x+6, g-10,6,10); ctx.fillRect(o.x+16,g-8, 6,8);  // front pair
      ctx.fillRect(o.x+26,g-8, 6,8);  ctx.fillRect(o.x+34,g-10,6,10); // back pair
    } else {
      ctx.fillRect(o.x+6, g-8, 6,8);  ctx.fillRect(o.x+16,g-10,6,10);
      ctx.fillRect(o.x+26,g-10,6,10); ctx.fillRect(o.x+34,g-8, 6,8);
    }
    // Tail (short curly stub)
    ctx.fillStyle = "#5a3a20"; ctx.fillRect(o.x+36,g-30,6,4); ctx.fillRect(o.x+40,g-28,4,4);
    // Dust puff behind boar
    const dustAlpha = 0.3 + Math.sin(frame * 0.3) * 0.15;
    ctx.fillStyle = `rgba(180,160,120,${dustAlpha})`;
    ctx.fillRect(o.x+34,g-10,8,6); ctx.fillRect(o.x+38,g-14,6,5); ctx.fillRect(o.x+32,g-6,10,4);
  } else if (o.otype === "turret") {
    // Scarecrow — visual capped at g-66 to match hitbox
    ctx.fillStyle = "#7a5a20"; ctx.fillRect(o.x+17,g-52,6,52);     // post
    ctx.fillRect(o.x+4,g-44,32,5);                                   // crossbeam
    ctx.fillStyle = "#5a3a10"; ctx.fillRect(o.x+17,g-52,3,52);     // post shadow
    // Body
    ctx.fillStyle = "#8a6a30"; ctx.fillRect(o.x+8,g-42,24,20);
    ctx.fillStyle = "#6a4a18"; ctx.fillRect(o.x+8,g-42,6,20);
    ctx.fillStyle = "#aa8840"; ctx.fillRect(o.x+10,g-40,6,4); ctx.fillRect(o.x+22,g-38,6,4);
    // Sleeves
    ctx.fillStyle = "#8a6a30";
    ctx.fillRect(o.x+2,g-44,8,10); ctx.fillRect(o.x+30,g-44,8,10);
    ctx.fillStyle = "#6a4a18"; ctx.fillRect(o.x+2,g-44,3,10); ctx.fillRect(o.x+30,g-44,3,10);
    // Head — top at g-62
    ctx.fillStyle = "#ccaa60"; ctx.fillRect(o.x+11,g-58,18,14);
    ctx.fillStyle = "#aa8840"; ctx.fillRect(o.x+11,g-58,5,14);
    ctx.fillStyle = "#3a2a08"; ctx.fillRect(o.x+14,g-53,4,4); ctx.fillRect(o.x+21,g-53,4,4);
    ctx.fillRect(o.x+15,g-47,8,2);
    // Hat — crown top at g-66 (matches hitbox)
    ctx.fillStyle = "#cc9920"; ctx.fillRect(o.x+8,g-62,24,5);      // brim
    ctx.fillRect(o.x+12,g-66,16,6);                                  // crown
    ctx.fillStyle = "#aa7a10"; ctx.fillRect(o.x+12,g-66,5,6);
    // Straw
    ctx.fillStyle = "#ddbb44";
    ctx.fillRect(o.x+4,g-44,4,3); ctx.fillRect(o.x+36,g-44,4,3);
    ctx.fillRect(o.x+9,g-24,3,6); ctx.fillRect(o.x+28,g-24,3,6);
    // Crow bullets — bright orange-red, visible day and night
    for(const b of (o.bullets||[])) {
      ctx.fillStyle = "#cc3300";
      ctx.fillRect(b.x,b.y+2,10,5); ctx.fillRect(b.x+2,b.y,6,4);
      ctx.fillStyle = "#ff6622"; ctx.fillRect(b.x+3,b.y+1,4,2);
      ctx.fillStyle = "#cc3300";
      const fw2=Math.floor(frame/6)%2;
      if(fw2===0){ ctx.fillRect(b.x-4,b.y-2,6,4); ctx.fillRect(b.x+8,b.y+6,5,3); }
      else        { ctx.fillRect(b.x-2,b.y+2,5,3); ctx.fillRect(b.x+8,b.y+4,4,3); }
    }
  } else if (o.otype === "wall") {
    // Wooden fence — two posts with rails between
    ctx.fillStyle = "#8a6a30"; ctx.fillRect(o.x+2,g-36,8,36); ctx.fillRect(o.x+28,g-36,8,36); // posts
    ctx.fillStyle = "#6a4a18"; ctx.fillRect(o.x+2,g-36,3,36); ctx.fillRect(o.x+28,g-36,3,36); // post shadow
    ctx.fillStyle = "#aa8840"; ctx.fillRect(o.x+2,g-36,8,4); ctx.fillRect(o.x+28,g-36,8,4);   // post tops
    ctx.fillStyle = "#8a6a30"; ctx.fillRect(o.x+8,g-30,22,6); ctx.fillRect(o.x+8,g-16,22,6);  // rails
    ctx.fillStyle = "#6a4a18"; ctx.fillRect(o.x+8,g-30,4,6); ctx.fillRect(o.x+8,g-16,4,6);    // rail shadow
    ctx.fillStyle = "#ccaa55"; ctx.fillRect(o.x+10,g-29,8,2); ctx.fillRect(o.x+10,g-15,8,2);  // rail highlight
  } else if (o.otype === "bonepile") {
    ctx.fillStyle = "#c8b88a"; ctx.fillRect(o.x+2,g-10,44,10); ctx.fillRect(o.x+6,g-14,36,6);
    ctx.fillStyle = "#a89868";
    ctx.fillRect(o.x+4, g-12,14,3); ctx.fillRect(o.x+8, g-15,3,6); ctx.fillRect(o.x+16,g-15,3,6);
    ctx.fillRect(o.x+22,g-13,12,3); ctx.fillRect(o.x+22,g-16,3,5); ctx.fillRect(o.x+30,g-16,3,5);
    ctx.fillRect(o.x+34,g-12,10,3); ctx.fillRect(o.x+34,g-15,3,5); ctx.fillRect(o.x+40,g-15,3,5);
    // Grass tufts around the pile
    ctx.fillStyle = "#3a7a18";
    ctx.fillRect(o.x,g-8,3,8); ctx.fillRect(o.x+2,g-12,2,4);       // left tuft
    ctx.fillRect(o.x+44,g-8,3,8); ctx.fillRect(o.x+43,g-12,2,4);   // right tuft
    ctx.fillRect(o.x+20,g-16,2,4); ctx.fillRect(o.x+23,g-18,2,5);  // top tuft
  } else if (o.otype === "stump") {
    // Wide low tree stump with visible rings
    ctx.fillStyle = "#5a3a10"; ctx.fillRect(o.x+2,g-18,40,18);     // stump body
    ctx.fillStyle = "#3a1a06"; ctx.fillRect(o.x+2,g-18,6,18);      // left shadow
    ctx.fillStyle = "#7a5a30"; ctx.fillRect(o.x+4,g-20,36,4);      // cut top
    ctx.fillStyle = "#5a3a10"; ctx.fillRect(o.x+8,g-20,4,4);       // ring 1
    ctx.fillRect(o.x+16,g-20,4,4);                                   // ring 2
    ctx.fillRect(o.x+26,g-20,4,4);                                   // ring 3
    ctx.fillStyle = "#3a6a10"; ctx.fillRect(o.x,g-6,6,6);          // moss left
    ctx.fillRect(o.x+36,g-6,8,6);                                    // moss right
    ctx.fillRect(o.x+14,g-22,8,4);                                   // moss top
  } else if (o.otype === "bush") {
    // Wide low thorny bush
    ctx.fillStyle = "#2a5a10"; ctx.fillRect(o.x,g-16,48,16);       // base
    ctx.fillStyle = "#3a7a18"; ctx.fillRect(o.x+2,g-22,14,10);     // left mound
    ctx.fillRect(o.x+16,g-26,18,14);                                 // center mound (tallest)
    ctx.fillRect(o.x+32,g-20,14,10);                                 // right mound
    ctx.fillStyle = "#1a3a08"; ctx.fillRect(o.x,g-14,8,6);         // shadow left
    ctx.fillRect(o.x+38,g-14,10,6);                                  // shadow right
    ctx.fillStyle = "#4a9a20"; ctx.fillRect(o.x+4,g-20,8,4);       // highlight left
    ctx.fillRect(o.x+18,g-24,10,4);                                  // highlight center
    ctx.fillRect(o.x+34,g-18,8,4);                                   // highlight right
    // Thorns
    ctx.fillStyle = "#1a2a08";
    ctx.fillRect(o.x+6,g-28,2,6); ctx.fillRect(o.x+20,g-32,2,6); ctx.fillRect(o.x+36,g-26,2,6);
  } else if (o.otype === "tree") {
    const t = o.type||0;
    if (t === 0) {
      // Short oak — lowered so a normal jump clears it, hitbox covers full tree
      ctx.fillStyle = "#5a3a10"; ctx.fillRect(o.x+13,g-42,10,42); // trunk
      ctx.fillStyle = "#3a1a06"; ctx.fillRect(o.x+13,g-42,4,42);  // trunk shadow
      ctx.fillStyle = "#2a6a10"; ctx.fillRect(o.x+2,g-42,32,18);  // canopy base
      ctx.fillRect(o.x+6,g-54,24,16);                               // canopy mid
      ctx.fillRect(o.x+10,g-62,16,12);                              // canopy top
      ctx.fillStyle = "#3a8a18"; ctx.fillRect(o.x+4,g-44,28,8);   // highlight
      ctx.fillRect(o.x+8,g-56,18,8);
      ctx.fillStyle = "#1a4a08"; ctx.fillRect(o.x+2,g-40,6,8);    // shadow left
      ctx.fillRect(o.x+28,g-40,6,8);                               // shadow right
    } else if (t === 1) {
      // Tall oak — lowered, hitbox covers full tree
      ctx.fillStyle = "#5a3a10"; ctx.fillRect(o.x+14,g-50,10,50); // trunk
      ctx.fillStyle = "#3a1a06"; ctx.fillRect(o.x+14,g-50,4,50);  // trunk shadow
      ctx.fillStyle = "#5a3a10"; ctx.fillRect(o.x+2,g-38,12,6);   // left branch
      ctx.fillRect(o.x+24,g-34,12,6);                              // right branch
      ctx.fillStyle = "#2a6a10"; ctx.fillRect(o.x,g-50,38,22);    // canopy base
      ctx.fillRect(o.x+4,g-64,30,18);                              // canopy mid
      ctx.fillRect(o.x+8,g-74,22,14);                              // canopy top
      ctx.fillStyle = "#3a8a18"; ctx.fillRect(o.x+2,g-52,34,10);  // highlight
      ctx.fillRect(o.x+6,g-66,24,10);
      ctx.fillStyle = "#1a4a08"; ctx.fillRect(o.x,g-48,8,10);     // shadow left
      ctx.fillRect(o.x+30,g-48,8,10);                              // shadow right
      ctx.fillStyle = "#2a6a10"; ctx.fillRect(o.x-4,g-44,14,10); ctx.fillRect(o.x+28,g-40,14,10); // branch leaves
    } else {
      // Dead tree — lowered, hitbox covers trunk + branches
      ctx.fillStyle = "#4a3a28"; ctx.fillRect(o.x+13,g-40,10,40); // trunk
      ctx.fillStyle = "#2a1a0a"; ctx.fillRect(o.x+13,g-40,4,40);  // trunk shadow
      ctx.fillStyle = "#4a3a28";
      ctx.fillRect(o.x+2,g-30,12,5);  ctx.fillRect(o.x,g-34,8,5); // left branch
      ctx.fillRect(o.x+24,g-24,12,5); ctx.fillRect(o.x+32,g-28,8,5); // right branch
      ctx.fillRect(o.x+6,g-38,8,5);   ctx.fillRect(o.x+3,g-40,6,4);  // upper left
      ctx.fillRect(o.x+22,g-34,8,5);  ctx.fillRect(o.x+26,g-38,6,4); // upper right
      ctx.fillStyle = "#2a1a0a";
      ctx.fillRect(o.x+2,g-30,4,3); ctx.fillRect(o.x+24,g-24,4,3);
    }
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnGrasslandsObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];
  if (tier === 0) {
    otype = r < 0.62 ? "tree" : "bird";
    if (otype === "bird") oy = GROUND_Y - 88 - Math.random() * 48;
    return { otype, type, oy, bullets };
  }
  if      (r < 0.28) { otype="tree"; type=Math.floor(Math.random()*(Math.min(3,Math.floor(tier/1.5)+1)+1)); }
  else if (r < 0.42) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                       if(tier>=2&&Math.random()<0.35) oy=GROUND_Y-62;
                       if(tier>=2&&Math.random()<0.30) oy=GROUND_Y-36; }
  else if (r < 0.54) { otype="rock"; }
  else if (r < 0.61 && tier>=1) { otype="stump"; }
  else if (r < 0.67 && tier>=1) { otype="bush"; }
  else if (r < 0.73 && tier>=2) { otype="spike"; }
  else if (r < 0.80 && tier>=1) { otype="log"; }
  else if (r < 0.86 && tier>=2) { otype="bonepile"; }
  else if (r < 0.91 && tier>=3) { otype="turret"; bullets=[]; }
  else if (r < 0.96 && tier>=2) { otype="hawk"; oy=GROUND_Y-90-Math.random()*30; }
  else if (tier>=1)              { otype="wall"; }
  else                           { otype="tree"; type=0; }
  return { otype, type, oy, bullets };
}
