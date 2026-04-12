// ─── CRYSTAL CAVE OBSTACLES ───────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawCaveObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  const pulse = Math.floor(frame/10)%2;
  const glow1 = pulse===0 ? "#cc88ff" : "#aa55dd";
  const glow2 = pulse===0 ? "#8844ff" : "#6622cc";
  const glow3 = pulse===0 ? "#ff88ff" : "#dd55dd";
  const dark1  = "#1a0a30";
  const dark2  = "#2a1248";

  if (o.otype === "cactus") {
    // Crystal stalagmite formation — replaces the cactus shape in cave context
    const t = o.type||0;
    const h = 30+t*10;
    // Shadow base
    ctx.fillStyle = dark2;
    ctx.fillRect(o.x+9,  g-h,   12, h);
    ctx.fillRect(o.x+23, g-Math.floor(h*0.7), 10, Math.floor(h*0.7));
    ctx.fillRect(o.x-1,  g-Math.floor(h*0.5), 10, Math.floor(h*0.5));
    // Main body
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+10, g-h,   10, h);
    ctx.fillRect(o.x+24, g-Math.floor(h*0.7), 8, Math.floor(h*0.7));
    ctx.fillRect(o.x,    g-Math.floor(h*0.5), 8, Math.floor(h*0.5));
    // Inner vein stripe
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+13, g-h+4, 3, h-8);
    ctx.fillRect(o.x+26, g-Math.floor(h*0.7)+3, 2, Math.floor(h*0.7)-6);
    // Bright tip facets
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+11, g-h,   6, 4);
    ctx.fillRect(o.x+25, g-Math.floor(h*0.7), 4, 3);
    ctx.fillRect(o.x+1,  g-Math.floor(h*0.5), 4, 3);
    // Tip sparkle
    if(pulse===0){
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(o.x+13, g-h-2, 2, 2);
    }

  } else if (o.otype === "crystalSpire") {
    const t = o.type||0;
    const h = 48+t*10;
    // Shadow layer
    ctx.fillStyle = dark2;
    ctx.fillRect(o.x+9,  g-h,            18, h);
    ctx.fillRect(o.x+25, g-Math.floor(h*0.75), 12, Math.floor(h*0.75));
    ctx.fillRect(o.x-1,  g-Math.floor(h*0.55), 12, Math.floor(h*0.55));
    // Main spire body
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+10, g-h,            16, h);
    ctx.fillRect(o.x+26, g-Math.floor(h*0.75), 10, Math.floor(h*0.75));
    ctx.fillRect(o.x,    g-Math.floor(h*0.55), 10, Math.floor(h*0.55));
    // Inner glow vein
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+14, g-h+6,  4, h-14);
    ctx.fillRect(o.x+28, g-Math.floor(h*0.75)+4, 3, Math.floor(h*0.75)-8);
    ctx.fillRect(o.x+2,  g-Math.floor(h*0.55)+3, 3, Math.floor(h*0.55)-6);
    // Bright facet edges
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+10, g-h,   6, 6);
    ctx.fillRect(o.x+26, g-Math.floor(h*0.75), 4, 4);
    ctx.fillRect(o.x,    g-Math.floor(h*0.55), 4, 3);
    ctx.fillRect(o.x+24, g-Math.floor(h*0.75)+3, 3, 3);
    ctx.fillRect(o.x+2,  g-Math.floor(h*0.55)+2, 3, 3);
    // Tip sparkles
    if(pulse===0){
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(o.x+12, g-h-2, 2, 2);
      ctx.fillRect(o.x+27, g-Math.floor(h*0.75)-2, 2, 2);
      ctx.fillRect(o.x+1,  g-Math.floor(h*0.55)-2, 2, 2);
    }

  } else if (o.otype === "crystalCluster") {
    const heights = [28,22,36,18,30,20,34];
    const veins   = [glow2,"#5522aa",glow2,"#441188",glow2,"#5522aa",glow2];
    for(let i=0;i<7;i++){
      const cx = o.x+i*8;
      const ch = heights[i];
      // Shadow
      ctx.fillStyle = dark2;
      ctx.fillRect(cx,   g-ch, 8, ch);
      // Body
      ctx.fillStyle = veins[i];
      ctx.fillRect(cx+1, g-ch, 6, ch);
      // Inner vein
      ctx.fillStyle = glow3;
      ctx.fillRect(cx+3, g-ch+4, 2, ch-8);
      // Tip facet
      ctx.fillStyle = glow1;
      ctx.fillRect(cx+2, g-ch,   3, 3);
      // Tip sparkle on tallest
      if(pulse===0 && ch>=30){
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(cx+3, g-ch-2, 2, 2);
      }
    }

  } else if (o.otype === "stalactite") {
    const sy = o._stalY ?? -30;
    // Shadow
    ctx.fillStyle = dark2;
    ctx.fillRect(o.x+3, sy, 14, 30);
    // Main body — two-tone
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+4, sy, 12, 28);
    ctx.fillStyle = dark1;
    ctx.fillRect(o.x+4, sy, 4, 28);   // left dark face
    // Inner vein
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+8, sy+4, 3, 20);
    // Bright top facet
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+5, sy,   5, 5);
    ctx.fillRect(o.x+7, sy+10,3, 4);
    // Pointed tip — stacked pixel rows
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+4,  sy+28, 12, 4);
    ctx.fillRect(o.x+6,  sy+32, 8,  4);
    ctx.fillRect(o.x+7,  sy+36, 6,  3);
    ctx.fillRect(o.x+8,  sy+39, 4,  3);
    ctx.fillRect(o.x+9,  sy+42, 2,  2);
    // Tip glow dot
    ctx.fillStyle = pulse===0 ? "#ffffff" : glow1;
    ctx.fillRect(o.x+9, sy+43, 2, 2);
    // Drip drops when close to ground
    if(sy > g-70){
      ctx.fillStyle = glow1;
      ctx.fillRect(o.x+9,  sy+46, 2, 3);
      ctx.fillRect(o.x+8,  sy+50, 2, 2);
      ctx.fillRect(o.x+10, sy+49, 2, 2);
    }

  } else if (o.otype === "crystalGolem") {
    // Legs
    ctx.fillStyle = dark2;
    ctx.fillRect(o.x+8,  g-20, 10, 20);
    ctx.fillRect(o.x+24, g-20, 10, 20);
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+9,  g-20, 8,  20);
    ctx.fillRect(o.x+25, g-20, 8,  20);
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+9,  g-20, 3,  20);
    ctx.fillRect(o.x+25, g-20, 3,  20);
    // Torso
    ctx.fillStyle = dark2;
    ctx.fillRect(o.x+5,  g-62, 32, 44);
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+6,  g-60, 30, 42);
    // Torso vein
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+18, g-58, 4,  36);
    ctx.fillRect(o.x+10, g-50, 22, 3);
    // Torso highlight edge
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+6,  g-60, 5,  42);
    // Head
    ctx.fillStyle = dark2;
    ctx.fillRect(o.x+7,  g-74, 28, 16);
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+8,  g-72, 26, 14);
    // Crown spikes
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+10, g-78, 4,  6);
    ctx.fillRect(o.x+18, g-80, 4,  8);
    ctx.fillRect(o.x+26, g-76, 4,  4);
    // Eyes
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+12, g-68, 6, 6);
    ctx.fillRect(o.x+24, g-68, 6, 6);
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+13, g-67, 4, 4);
    ctx.fillRect(o.x+25, g-67, 4, 4);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+14, g-66, 2, 2);
    ctx.fillRect(o.x+26, g-66, 2, 2);
    // Arms
    ctx.fillStyle = dark2;
    ctx.fillRect(o.x-5,  g-54, 13, 22);
    ctx.fillRect(o.x+34, g-54, 13, 22);
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x-4,  g-52, 10, 20);
    ctx.fillRect(o.x+36, g-52, 10, 20);
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x-4,  g-52, 3,  20);
    ctx.fillRect(o.x+36, g-52, 3,  20);
    // Fist crystal knuckles
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x-6,  g-54, 4, 6);
    ctx.fillRect(o.x+44, g-54, 4, 6);
    // Bullets
    for(const b of (o.bullets||[])){
      ctx.fillStyle = dark2;
      ctx.fillRect(b.x-1, b.y-1, 10, 6);
      ctx.fillStyle = glow1;
      ctx.fillRect(b.x,   b.y,   8,  4);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(b.x+1, b.y+1, 3,  2);
    }

  } else if (o.otype === "voidPortal") {
    const spin = Math.floor(frame/6)%4;
    // Dark void interior
    ctx.fillStyle = "#04000e";
    ctx.fillRect(o.x+8,  g-58, 20, 50);
    ctx.fillRect(o.x+4,  g-54, 28, 42);
    ctx.fillRect(o.x+2,  g-48, 32, 34);
    // Spinning ring — 4-frame rotation
    const ringCols = ["#8844ff","#aa22ff","#6622cc","#cc44ff"];
    ctx.fillStyle = ringCols[spin];
    ctx.fillRect(o.x,    g-50, 6,  34);
    ctx.fillRect(o.x+30, g-50, 6,  34);
    ctx.fillRect(o.x+6,  g-64, 24, 8);
    ctx.fillRect(o.x+6,  g-14, 24, 8);
    // Counter-spin inner ring
    ctx.fillStyle = ringCols[(spin+2)%4];
    ctx.fillRect(o.x+10, g-56, 16, 5);
    ctx.fillRect(o.x+10, g-21, 16, 5);
    ctx.fillRect(o.x+2,  g-46, 5,  24);
    ctx.fillRect(o.x+29, g-46, 5,  24);
    // Bright ring edge highlights
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+1,  g-50, 2,  34);
    ctx.fillRect(o.x+33, g-50, 2,  34);
    ctx.fillRect(o.x+6,  g-65, 24, 3);
    ctx.fillRect(o.x+6,  g-13, 24, 3);
    // Core
    ctx.fillStyle = "#cc44ff";
    ctx.fillRect(o.x+14, g-38, 8,  8);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+16, g-36, 4,  4);
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+17, g-35, 2,  2);
    // Ground anchor shards
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+2,  g-8,  6,  8);
    ctx.fillRect(o.x+28, g-6,  6,  6);
    ctx.fillRect(o.x+14, g-10, 8,  10);

  } else if (o.otype === "crystalMine") {
    const my = o.y;
    const bob = Math.sin(frame*0.08)*4;
    const exploding = o._exploding||0;
    if(exploding > 0){
      for(const b of (o.bullets||[])){
        ctx.fillStyle = dark2;
        ctx.fillRect(b.x-1, b.y-1, 8, 8);
        ctx.fillStyle = glow1;
        ctx.fillRect(b.x,   b.y,   6, 6);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(b.x+1, b.y+1, 2, 2);
      }
    } else {
      // Outer shell
      ctx.fillStyle = dark2;
      ctx.fillRect(o.x+3,  my+bob+1, 18, 18);
      ctx.fillRect(o.x+1,  my+bob+5, 22, 10);
      ctx.fillRect(o.x+5,  my+bob-1, 14, 22);
      // Body
      ctx.fillStyle = glow2;
      ctx.fillRect(o.x+4,  my+bob+2, 16, 16);
      ctx.fillRect(o.x+2,  my+bob+6, 20, 8);
      ctx.fillRect(o.x+6,  my+bob,   12, 20);
      // Core glow
      ctx.fillStyle = glow3;
      ctx.fillRect(o.x+8,  my+bob+6, 8,  8);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(o.x+10, my+bob+8, 4,  4);
      // Crystal spikes radiating out
      ctx.fillStyle = glow1;
      ctx.fillRect(o.x+10, my+bob-5, 4,  6);   // top
      ctx.fillRect(o.x+10, my+bob+19,4,  6);   // bottom
      ctx.fillRect(o.x-3,  my+bob+8, 6,  4);   // left
      ctx.fillRect(o.x+21, my+bob+8, 6,  4);   // right
      // Diagonal spike tips
      ctx.fillStyle = glow2;
      ctx.fillRect(o.x+1,  my+bob+1, 4,  4);
      ctx.fillRect(o.x+19, my+bob+1, 4,  4);
      ctx.fillRect(o.x+1,  my+bob+15,4,  4);
      ctx.fillRect(o.x+19, my+bob+15,4,  4);
    }

  } else if (o.otype === "crystalBat") {
    // Flying bat — dives at dino, splits into 2 minibats on hit
    const bx = o.x, by = o.y;
    const fw = Math.floor(frame/6)%2;
    const isDiving = o._vultureState === 1;
    // Body
    ctx.fillStyle = dark2;
    ctx.fillRect(bx+7,  by+6, 14, 10);
    ctx.fillStyle = "#441188";
    ctx.fillRect(bx+8,  by+7, 12, 8);
    // Head
    ctx.fillStyle = "#5522aa";
    ctx.fillRect(bx+10, by+3, 8,  6);
    // Ears
    ctx.fillStyle = glow2;
    ctx.fillRect(bx+9,  by,   3,  4);
    ctx.fillRect(bx+16, by,   3,  4);
    ctx.fillStyle = glow3;
    ctx.fillRect(bx+10, by+1, 1,  2);
    ctx.fillRect(bx+17, by+1, 1,  2);
    // Eyes
    ctx.fillStyle = glow3;
    ctx.fillRect(bx+11, by+4, 2,  2);
    ctx.fillRect(bx+15, by+4, 2,  2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bx+11, by+4, 1,  1);
    ctx.fillRect(bx+15, by+4, 1,  1);
    // Wings
    ctx.fillStyle = "#330066";
    if(!isDiving && fw===0){
      // Spread
      ctx.fillRect(bx-8,  by+2,  10, 6);
      ctx.fillRect(bx-14, by,    8,  4);
      ctx.fillRect(bx+18, by+2,  10, 6);
      ctx.fillRect(bx+22, by,    8,  4);
    } else if(!isDiving){
      // Mid-flap
      ctx.fillRect(bx-4,  by+6,  8,  5);
      ctx.fillRect(bx-8,  by+8,  6,  4);
      ctx.fillRect(bx+18, by+6,  8,  5);
      ctx.fillRect(bx+22, by+8,  6,  4);
    } else {
      // Tucked dive
      ctx.fillRect(bx-2,  by+8,  6,  4);
      ctx.fillRect(bx+18, by+8,  6,  4);
    }
    ctx.fillStyle = glow2;
    ctx.fillRect(bx-6,  by+3,  3,  3);
    ctx.fillRect(bx+21, by+3,  3,  3);
    // Split minibats
    for(const mb of (o._miniBats||[])){
      ctx.fillStyle = "#441188";
      ctx.fillRect(mb.x+3, mb.y+3, 8, 6);
      ctx.fillStyle = "#330066";
      const mfw = Math.floor(frame/5)%2;
      if(mfw===0){
        ctx.fillRect(mb.x-4, mb.y+2, 8, 4);
        ctx.fillRect(mb.x+9, mb.y+2, 8, 4);
      } else {
        ctx.fillRect(mb.x-2, mb.y+5, 6, 3);
        ctx.fillRect(mb.x+9, mb.y+5, 6, 3);
      }
      ctx.fillStyle = glow3;
      ctx.fillRect(mb.x+5, mb.y+4, 2, 2);
    }

  } else if (o.otype === "geodeSpitter") {
    // Ground turret — fires V-spread: one high shard, one low shard
    ctx.fillStyle = dark2;
    ctx.fillRect(o.x+2,  g-22, 40, 22);
    ctx.fillStyle = "#2a1248";
    ctx.fillRect(o.x+4,  g-20, 36, 20);
    // Geode body — cracked open crystal egg
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+8,  g-36, 28, 18);
    ctx.fillRect(o.x+6,  g-32, 32, 14);
    ctx.fillStyle = dark1;
    ctx.fillRect(o.x+10, g-34, 24, 14);
    // Interior crystal lining
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+12, g-32, 4,  10);
    ctx.fillRect(o.x+18, g-33, 4,  12);
    ctx.fillRect(o.x+24, g-31, 4,  9);
    // Outer shell facets
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+8,  g-36, 6,  4);
    ctx.fillRect(o.x+30, g-36, 6,  4);
    ctx.fillRect(o.x+6,  g-32, 4,  4);
    ctx.fillRect(o.x+34, g-32, 4,  4);
    // Barrel nozzle — left-facing
    ctx.fillStyle = "#5522aa";
    ctx.fillRect(o.x,    g-30, 8,  8);
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+1,  g-29, 6,  6);
    ctx.fillStyle = dark1;
    ctx.fillRect(o.x+2,  g-28, 4,  4);
    // Bullets — high shard bright, low shard pink
    for(const b of (o.bullets||[])){
      ctx.fillStyle = dark2;
      ctx.fillRect(b.x-1, b.y-1, 9, 5);
      ctx.fillStyle = b._high ? glow1 : glow3;
      ctx.fillRect(b.x,   b.y,   7,  3);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(b.x+1, b.y,   2,  1);
    }

  } else if (o.otype === "voidCrawler") {
    // Ground creeper — 4-legged crystal spider that speeds up when close
    const legPhase = Math.floor(frame/8)%2;
    // Shadow
    ctx.fillStyle = dark2;
    ctx.fillRect(o.x+4,  g-18, 36, 18);
    // Body
    ctx.fillStyle = "#1a0838";
    ctx.fillRect(o.x+6,  g-16, 32, 14);
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+8,  g-14, 28, 10);
    // Body vein
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+20, g-13, 3,  8);
    ctx.fillRect(o.x+12, g-10, 20, 2);
    // Head — front-facing
    ctx.fillStyle = "#2a1248";
    ctx.fillRect(o.x,    g-14, 10, 10);
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+1,  g-13, 8,  8);
    // Mandibles
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x-3,  g-12, 5,  2);
    ctx.fillRect(o.x-3,  g-9,  5,  2);
    // Eyes
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+2,  g-12, 2,  2);
    ctx.fillRect(o.x+5,  g-12, 2,  2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+2,  g-12, 1,  1);
    ctx.fillRect(o.x+5,  g-12, 1,  1);
    // Legs — alternating phase
    ctx.fillStyle = "#5522aa";
    if(legPhase===0){
      ctx.fillRect(o.x+10, g-4,  4, 4);  ctx.fillRect(o.x+20, g-4,  4, 4);
      ctx.fillRect(o.x+30, g-4,  4, 4);  ctx.fillRect(o.x+38, g-4,  4, 4);
      ctx.fillRect(o.x+10, g-18, 4, 4);  ctx.fillRect(o.x+30, g-18, 4, 4);
    } else {
      ctx.fillRect(o.x+14, g-4,  4, 4);  ctx.fillRect(o.x+24, g-4,  4, 4);
      ctx.fillRect(o.x+34, g-4,  4, 4);
      ctx.fillRect(o.x+14, g-18, 4, 4);  ctx.fillRect(o.x+24, g-18, 4, 4);
    }
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+10, g-6,  4, 2);  ctx.fillRect(o.x+20, g-6,  4, 2);
    ctx.fillRect(o.x+30, g-6,  4, 2);  ctx.fillRect(o.x+38, g-6,  4, 2);
    // Speed flash when charging — streaks on the LEFT (front) side
    if((o._crawlerSpeed||0) > 3.5){
      ctx.fillStyle = glow3;
      ctx.fillRect(o.x-6, g-12, 4, 2);
      ctx.fillRect(o.x-8, g-10, 3, 2);
      ctx.fillRect(o.x-8, g-14, 3, 2);
    }

  } else if (o.otype === "crystalCeiling") {
    // Ceiling slab that descends then retracts — forces duck
    const cy = o._ceilY ?? 0;
    const slabH = 22;
    // Ceiling anchor (always at top)
    ctx.fillStyle = dark2;
    ctx.fillRect(o.x,    0,    48, cy + slabH + 4);
    ctx.fillStyle = "#1a0838";
    ctx.fillRect(o.x+1,  0,    46, cy + slabH + 2);
    // Slab face
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x,    cy,   48, slabH);
    ctx.fillStyle = dark1;
    ctx.fillRect(o.x,    cy,   6,  slabH);  // left shadow face
    // Slab vein
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+10, cy+4, 28, 3);
    ctx.fillRect(o.x+16, cy+10,16, 3);
    // Slab bottom edge highlight
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+6,  cy+slabH-3, 40, 3);
    // Bottom crystal teeth
    ctx.fillStyle = glow2;
    for(let i=0;i<5;i++){
      const tx = o.x + 4 + i*9;
      const th = 6 + (i%2)*4;
      ctx.fillRect(tx,   cy+slabH,   6, th);
      ctx.fillStyle = glow1;
      ctx.fillRect(tx+1, cy+slabH,   3, 3);
      ctx.fillStyle = glow2;
    }
    // Warning flash when descending
    if((o._ceilDescending) && cy < 60){
      ctx.fillStyle = pulse===0 ? glow3 : glow1;
      ctx.fillRect(o.x+2, cy+slabH+10, 44, 2);
    }

  } else if (o.otype === "runeCircle") {
    // Floor trap — glows as warning then fires 4-way shard burst
    const rx = o.x + 20, ry = g - 4;
    const charged = (o._runeCharge||0);
    const firing  = (o._runeFiring||0) > 0;
    // Ground rune base — carved circle
    ctx.fillStyle = dark2;
    ctx.fillRect(rx-18, ry-4,  36, 4);
    ctx.fillStyle = "#1a0838";
    ctx.fillRect(rx-16, ry-3,  32, 3);
    // Rune ring segments
    const ringCol = firing ? "#ffffff" : charged > 0.6 ? glow1 : charged > 0.2 ? glow2 : "#3a1a5a";
    ctx.fillStyle = ringCol;
    ctx.fillRect(rx-18, ry-4,  4,  4);   // left
    ctx.fillRect(rx+14, ry-4,  4,  4);   // right
    ctx.fillRect(rx-8,  ry-8,  4,  4);   // top-left
    ctx.fillRect(rx+4,  ry-8,  4,  4);   // top-right
    ctx.fillRect(rx-2,  ry-10, 4,  4);   // top
    // Inner glyph cross
    ctx.fillStyle = charged > 0.4 ? glow3 : "#2a1248";
    ctx.fillRect(rx-1,  ry-8,  2,  8);
    ctx.fillRect(rx-6,  ry-4,  12, 2);
    // Center gem
    ctx.fillStyle = firing ? "#ffffff" : charged > 0.7 ? glow3 : "#3a1a5a";
    ctx.fillRect(rx-2,  ry-5,  4,  4);
    if(firing || charged > 0.85){
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(rx-1, ry-4,  2,  2);
    }
    // Fired shards
    for(const b of (o.bullets||[])){
      ctx.fillStyle = dark2;
      ctx.fillRect(b.x-1, b.y-1, 7, 7);
      ctx.fillStyle = glow1;
      ctx.fillRect(b.x,   b.y,   5, 5);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(b.x+1, b.y+1, 2, 2);
    }

  } else if (o.otype === "crystalGas") {
    // Toxic crystal gas cloud — drifts slowly, inverts controls on contact
    if(o._ddBaseX===undefined) o._ddBaseX=o.x;
    const gx = o._ddBaseX;
    const gasPhase = Math.floor(frame/12)%3;
    const gasAlpha = 0.38 + Math.sin(frame*0.04)*0.12;
    // Vent source at ground level — cracked crystal emitter
    ctx.fillStyle = "#1a0a30";
    ctx.fillRect(gx+10, g-10, 16, 10);
    ctx.fillStyle = "#3a1a5a";
    ctx.fillRect(gx+12, g-8,  12, 8);
    ctx.fillStyle = glow3;
    ctx.fillRect(gx+14, g-10, 4,  3);
    ctx.fillRect(gx+20, g-10, 4,  3);
    // Gas cloud layers — stacked semi-transparent blobs rising upward
    ctx.save();
    const gasCol = "#44ff88"; // toxic green
    ctx.globalAlpha = gasAlpha * 0.55;
    ctx.fillStyle = gasCol;
    // Layer 1 — widest, lowest
    ctx.fillRect(gx+2,  g-28, 32, 18);
    ctx.fillRect(gx,    g-24, 36, 14);
    // Layer 2 — mid
    ctx.globalAlpha = gasAlpha * 0.45;
    ctx.fillRect(gx+4,  g-44, 28, 18);
    ctx.fillRect(gx+2,  g-40, 32, 14);
    // Layer 3 — top wisp
    ctx.globalAlpha = gasAlpha * 0.28;
    ctx.fillRect(gx+8,  g-58, 20, 16);
    ctx.fillRect(gx+6,  g-54, 24, 12);
    // Animated bubble dots
    ctx.globalAlpha = gasAlpha * 0.7;
    ctx.fillStyle = "#88ffaa";
    if(gasPhase===0){ ctx.fillRect(gx+14,g-32,4,4); ctx.fillRect(gx+22,g-48,3,3); }
    if(gasPhase===1){ ctx.fillRect(gx+18,g-36,4,4); ctx.fillRect(gx+10,g-52,3,3); }
    if(gasPhase===2){ ctx.fillRect(gx+20,g-30,4,4); ctx.fillRect(gx+16,g-46,3,3); }
    ctx.restore();
    // Inverted controls indicator — flashing ! when active
    if((o._gasActive||0)>0){
      ctx.save();
      ctx.globalAlpha = Math.sin(frame*0.3)*0.5+0.5;
      ctx.fillStyle = "#44ff88";
      ctx.font = "bold 11px 'Courier New'";
      ctx.fillText("!", gx+16, g-62);
      ctx.restore();
    }

  } else {
    // Generic fallback — small crystal pair
    ctx.fillStyle = dark2;
    ctx.fillRect(o.x+7,  g-30, 12, 30);
    ctx.fillRect(o.x+21, g-24, 10, 24);
    ctx.fillStyle = glow2;
    ctx.fillRect(o.x+8,  g-28, 10, 28);
    ctx.fillRect(o.x+22, g-22, 8,  22);
    ctx.fillStyle = glow3;
    ctx.fillRect(o.x+11, g-24, 3,  20);
    ctx.fillRect(o.x+25, g-18, 2,  14);
    ctx.fillStyle = glow1;
    ctx.fillRect(o.x+9,  g-28, 4,  3);
    ctx.fillRect(o.x+23, g-22, 3,  3);
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnCaveObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];

  if (tier === 0) {
    otype = r < 0.55 ? "cactus" : r < 0.80 ? "bird" : "crystalSpire";
    if (otype === "bird") oy = GROUND_Y - 88 - Math.random() * 48;
    return { otype, type, oy, bullets };
  }

  if (tier <= 2) {
    // Early tiers: basic obstacles + first new ones
    if      (r < 0.14) { otype="cactus"; type=Math.floor(Math.random()*(Math.min(2,tier)+1)); }
    else if (r < 0.26) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                         if(Math.random()<0.35) oy=GROUND_Y-62; }
    else if (r < 0.40) { otype="crystalSpire"; type=Math.floor(Math.random()*3); }
    else if (r < 0.54) { otype="crystalCluster"; }
    else if (r < 0.66) { otype="stalactite"; oy=-30; }
    else if (r < 0.78) { otype="crystalBat"; oy=GROUND_Y-100-Math.random()*50; }
    else if (r < 0.90) { otype="voidCrawler"; }
    else               { otype="geodeSpitter"; bullets=[]; }
    return { otype, type, oy, bullets };
  }

  if (tier <= 5) {
    // Mid tiers: all obstacles, new ones weighted heavier
    if      (r < 0.10) { otype="cactus"; type=Math.floor(Math.random()*3); }
    else if (r < 0.18) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                         if(Math.random()<0.40) oy=GROUND_Y-62;
                         if(Math.random()<0.30) oy=GROUND_Y-36; }
    else if (r < 0.27) { otype="crystalSpire"; type=Math.floor(Math.random()*3); }
    else if (r < 0.35) { otype="crystalCluster"; }
    else if (r < 0.43) { otype="stalactite"; oy=-30; }
    else if (r < 0.52) { otype="crystalMine"; oy=GROUND_Y-80-Math.random()*60; bullets=[]; }
    else if (r < 0.62) { otype="crystalBat"; oy=GROUND_Y-100-Math.random()*50; }
    else if (r < 0.71) { otype="geodeSpitter"; bullets=[]; }
    else if (r < 0.80) { otype="voidCrawler"; }
    else if (r < 0.88) { otype="crystalCeiling"; }
    else if (r < 0.94) { otype="crystalGolem"; bullets=[]; }
    else if (r < 0.98) { otype="runeCircle"; bullets=[]; }
    else               { otype="voidPortal"; }
    return { otype, type, oy, bullets };
  }

  // Tier 6+: brutal — new hard obstacles dominate
  if      (r < 0.07) { otype="cactus"; type=2; }
  else if (r < 0.13) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                       if(Math.random()<0.5) oy=GROUND_Y-62;
                       if(Math.random()<0.4) oy=GROUND_Y-36; }
  else if (r < 0.20) { otype="stalactite"; oy=-30; }
  else if (r < 0.28) { otype="crystalMine"; oy=GROUND_Y-80-Math.random()*60; bullets=[]; }
  else if (r < 0.38) { otype="crystalBat"; oy=GROUND_Y-100-Math.random()*50; }
  else if (r < 0.48) { otype="geodeSpitter"; bullets=[]; }
  else if (r < 0.58) { otype="voidCrawler"; }
  else if (r < 0.68) { otype="crystalCeiling"; }
  else if (r < 0.76) { otype="runeCircle"; bullets=[]; }
  else if (r < 0.84) { otype="crystalGolem"; bullets=[]; }
  else if (r < 0.92) { otype="voidPortal"; }
  else               { otype="crystalSpire"; type=2; }
  return { otype, type, oy, bullets };
}
