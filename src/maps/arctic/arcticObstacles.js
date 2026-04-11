// ─── ARCTIC OBSTACLES ────────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawArcticObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  if (o.otype === "cactus") {
    const h = 40+(o.type||0)*12;
    ctx.fillStyle = "#88aabb";
    ctx.fillRect(o.x+10,g-h,12,h); ctx.fillRect(o.x+24,g-h*0.7,10,h*0.7); ctx.fillRect(o.x,g-h*0.5,10,h*0.5);
    ctx.fillStyle = "#ddeeff";
    ctx.fillRect(o.x+12,g-h,8,6); ctx.fillRect(o.x+26,g-h*0.7,6,4);

  } else if (o.otype === "icewall") {
    ctx.fillStyle = "#6699bb";
    ctx.fillRect(o.x,g-34,16,34);
    ctx.fillStyle = "#88bbdd";
    ctx.fillRect(o.x+2,g-34,12,6);
    ctx.fillRect(o.x+2,g-24,12,4);
    ctx.fillRect(o.x+2,g-14,12,4);
    ctx.fillStyle = "rgba(220,240,255,0.6)";
    ctx.fillRect(o.x+3,g-32,4,8);

  } else if (o.otype === "snowball") {
    const bounce = Math.abs(Math.sin(frame*0.14))*5;
    const rot = (frame*0.09)%(Math.PI*2);
    ctx.save();
    ctx.translate(o.x+16,g-18-bounce);
    ctx.rotate(rot);
    ctx.fillStyle = "#ddeeff";
    ctx.fillRect(-12,-6,24,12); ctx.fillRect(-8,-12,16,24);
    ctx.fillRect(-14,-4,28,8);
    ctx.fillStyle = "#aaccee";
    ctx.fillRect(-10,-10,4,4); ctx.fillRect(6,-10,4,4);
    ctx.fillRect(-10,6,4,4);   ctx.fillRect(6,6,4,4);
    ctx.restore();

  } else if (o.otype === "frostspike") {
    ctx.fillStyle = "#88bbdd";
    for(let i=0;i<3;i++){
      const bx=o.x+i*14;
      ctx.fillRect(bx+2,g-32,10,32);
      ctx.fillStyle="#aaddff"; ctx.fillRect(bx+3,g-32,4,8); ctx.fillStyle="#88bbdd";
      ctx.beginPath(); ctx.moveTo(bx+2,g-32); ctx.lineTo(bx+7,g-44); ctx.lineTo(bx+12,g-32); ctx.fill();
      ctx.fillStyle="#ddeeff"; ctx.fillRect(bx+5,g-42,4,6); ctx.fillStyle="#88bbdd";
    }

  } else if (o.otype === "icicle") {
    const iy = o._icicleY ?? -20;
    ctx.fillStyle = "#aaddff";
    ctx.fillRect(o.x+4,iy,10,24);
    ctx.fillStyle = "#ddeeff";
    ctx.fillRect(o.x+5,iy,4,8);
    ctx.fillStyle = "#88ccee";
    ctx.beginPath();
    ctx.moveTo(o.x+4,iy+24); ctx.lineTo(o.x+9,iy+34); ctx.lineTo(o.x+14,iy+24);
    ctx.fill();
    if (iy > g-50) {
      ctx.fillStyle = "rgba(136,204,238,0.4)";
      ctx.fillRect(o.x,g-4,36,4);
    }

  } else if (o.otype === "snowdrift") {
    // Wide low snow mound — gentle obstacle, clusters well
    const dc1 = o._nightBlend > 0.5 ? "#aaccdd" : "#ddeeff";
    const dc2 = o._nightBlend > 0.5 ? "#88aacc" : "#c8e4f8";
    const dc3 = o._nightBlend > 0.5 ? "#6688aa" : "#aaccee";
    ctx.fillStyle = dc1;
    ctx.fillRect(o.x,    g-4,  68, 4);
    ctx.fillRect(o.x+2,  g-8,  64, 4);
    ctx.fillRect(o.x+6,  g-13, 56, 5);
    ctx.fillRect(o.x+12, g-18, 44, 5);
    ctx.fillRect(o.x+18, g-22, 32, 4);
    ctx.fillRect(o.x+24, g-25, 20, 3);
    ctx.fillRect(o.x+28, g-27, 12, 2);
    // Windswept crest highlight
    ctx.fillStyle = dc2;
    ctx.fillRect(o.x+20, g-20, 26, 2);
    ctx.fillRect(o.x+24, g-24, 16, 2);
    // Shadow on lee side
    ctx.fillStyle = dc3;
    ctx.fillRect(o.x+42, g-16, 12, 4);
    ctx.fillRect(o.x+48, g-11,  8, 4);
    ctx.fillRect(o.x+54, g-7,   6, 3);

  } else if (o.otype === "frozenTree") {
    // Dead bare frost-covered tree — tall and thin
    const tc1 = o._nightBlend > 0.5 ? "#6688aa" : "#8aaabb";
    const tc2 = o._nightBlend > 0.5 ? "#aaccdd" : "#cce4f4";
    const tc3 = o._nightBlend > 0.5 ? "#ddeeff" : "#eef8ff";
    // Trunk
    ctx.fillStyle = tc1;
    ctx.fillRect(o.x+14, g-58, 8, 58);
    // Main branches
    ctx.fillRect(o.x+2,  g-46, 14, 5);  // left branch
    ctx.fillRect(o.x+22, g-38, 16, 4);  // right branch
    ctx.fillRect(o.x+6,  g-30, 10, 4);  // left lower
    ctx.fillRect(o.x+20, g-22, 12, 3);  // right lower
    // Frost/snow on branches
    ctx.fillStyle = tc2;
    ctx.fillRect(o.x+2,  g-48, 14, 3);
    ctx.fillRect(o.x+22, g-40, 16, 3);
    ctx.fillRect(o.x+6,  g-32, 10, 3);
    ctx.fillRect(o.x+20, g-24, 12, 2);
    // Snow cap on top of trunk
    ctx.fillStyle = tc3;
    ctx.fillRect(o.x+12, g-60, 12, 4);
    ctx.fillRect(o.x+13, g-62,  9, 2);
    // Ice crystal tips on branch ends
    ctx.fillStyle = tc2;
    ctx.fillRect(o.x,    g-50, 4, 6);
    ctx.fillRect(o.x+36, g-42, 4, 5);
    ctx.fillRect(o.x+4,  g-34, 3, 5);
    ctx.fillRect(o.x+30, g-26, 3, 4);

  } else if (o.otype === "arcticFox") {
    // Small low crouching fox — forces duck or precise jump
    const fc1 = o._nightBlend > 0.5 ? "#aa8866" : "#cc9944";
    const fc2 = o._nightBlend > 0.5 ? "#884422" : "#aa6622";
    const fc3 = o._nightBlend > 0.5 ? "#ccaa88" : "#eeccaa";
    const fcd = "#1a1008";
    // Tail (behind body, drawn first)
    ctx.fillStyle = fc1;
    ctx.fillRect(o.x+36, g-14, 14, 6);
    ctx.fillRect(o.x+46, g-18,  8, 6);
    ctx.fillStyle = fc3;
    ctx.fillRect(o.x+48, g-20,  6, 4); // white tail tip
    // Body
    ctx.fillStyle = fc1;
    ctx.fillRect(o.x+4,  g-18, 34, 14);
    ctx.fillRect(o.x+2,  g-14, 36, 10);
    // Head (facing left toward player)
    ctx.fillRect(o.x+28, g-24, 16, 14);
    // Snout
    ctx.fillStyle = fc2;
    ctx.fillRect(o.x+40, g-20, 8, 8);
    ctx.fillRect(o.x+44, g-16, 6, 5);
    // Nose
    ctx.fillStyle = fcd;
    ctx.fillRect(o.x+46, g-18, 3, 2);
    // Eye
    ctx.fillStyle = fcd;
    ctx.fillRect(o.x+32, g-23, 3, 3);
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(o.x+33, g-23, 2, 2); // eye shine
    // Ears (pointy)
    ctx.fillStyle = fc1;
    ctx.fillRect(o.x+30, g-28, 4, 6);
    ctx.fillRect(o.x+36, g-28, 4, 6);
    ctx.fillStyle = fc2;
    ctx.fillRect(o.x+31, g-27, 2, 4); // inner ear
    ctx.fillRect(o.x+37, g-27, 2, 4);
    // Legs — short stubby
    ctx.fillStyle = fc2;
    ctx.fillRect(o.x+6,  g-6,  6, 6);
    ctx.fillRect(o.x+16, g-6,  6, 6);
    ctx.fillRect(o.x+24, g-6,  6, 6);
    // Belly stripe
    ctx.fillStyle = fc3;
    ctx.fillRect(o.x+8,  g-14, 20, 4);

  } else if (o.otype === "frozenMammoth") {
    // Proper side-profile mammoth encased in ice
    const ic1 = o._nightBlend > 0.5 ? "#1a3a4a" : "#2a5a78"; // dark ice shell
    const ic2 = o._nightBlend > 0.5 ? "#2a5060" : "#4a88aa"; // mid ice
    const ic3 = o._nightBlend > 0.5 ? "#88bbcc" : "#b8ddf0"; // bright highlight
    const fur  = o._nightBlend > 0.5 ? "#2a1a0e" : "#3a2810"; // dark fur
    const tusk = o._nightBlend > 0.5 ? "#99bbcc" : "#cce8f8"; // icy ivory
    // ── Ice block outer shell ──
    ctx.fillStyle = ic1;
    ctx.fillRect(o.x,    g-68, 72, 68);
    ctx.fillStyle = ic2;
    ctx.fillRect(o.x+2,  g-66, 68, 64);
    // ── Fur body silhouette (mammoth side profile) ──
    ctx.fillStyle = fur;
    // High shoulder hump (left side, tallest point)
    ctx.fillRect(o.x+6,  g-60, 22, 52); // shoulder column
    ctx.fillRect(o.x+4,  g-64, 26, 10); // hump top
    ctx.fillRect(o.x+2,  g-62, 10, 8);  // hump left peak
    // Back slopes down toward rump
    ctx.fillRect(o.x+26, g-54, 14, 46);
    ctx.fillRect(o.x+38, g-48, 10, 40);
    ctx.fillRect(o.x+46, g-44, 8,  36);
    // Rump (right side, lower)
    ctx.fillRect(o.x+52, g-40, 8,  32);
    // Neck connecting hump to head
    ctx.fillRect(o.x+26, g-58, 10, 12);
    // Head (right of hump, lower)
    ctx.fillRect(o.x+34, g-62, 18, 24);
    ctx.fillRect(o.x+36, g-64, 14, 6);  // top of skull
    // Trunk hanging down from head
    ctx.fillRect(o.x+50, g-44, 7,  18); // trunk upper
    ctx.fillRect(o.x+52, g-28, 5,  12); // trunk lower
    ctx.fillRect(o.x+54, g-18, 4,   8); // trunk tip curl
    ctx.fillRect(o.x+56, g-14, 6,   4); // curl end
    // Legs — 4 stubby pillars
    ctx.fillRect(o.x+8,  g-16, 10, 16);
    ctx.fillRect(o.x+20, g-14, 10, 14);
    ctx.fillRect(o.x+34, g-14, 10, 14);
    ctx.fillRect(o.x+46, g-12, 10, 12);
    // ── Eye ──
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(o.x+46, g-58, 5, 5);
    ctx.fillStyle = "#1a1008";
    ctx.fillRect(o.x+47, g-57, 3, 3);
    // ── Tusks — long curved ivory ──
    ctx.fillStyle = tusk;
    // Upper tusk: sweeps forward and curves down
    ctx.fillRect(o.x+50, g-40, 18, 5);  // base horizontal
    ctx.fillRect(o.x+64, g-40, 6,  10); // curve down
    ctx.fillRect(o.x+66, g-32, 5,  10); // lower curve
    ctx.fillRect(o.x+65, g-24, 4,   6); // tip
    // Lower tusk (shorter)
    ctx.fillRect(o.x+50, g-34, 12, 4);
    ctx.fillRect(o.x+60, g-34, 4,  7);
    // ── Ice crack lines ──
    ctx.fillStyle = ic3;
    ctx.fillRect(o.x+4,  g-58, 16, 2);
    ctx.fillRect(o.x+10, g-56,  2, 14);
    ctx.fillRect(o.x+22, g-50, 14, 2);
    ctx.fillRect(o.x+28, g-48,  2, 10);
    ctx.fillRect(o.x+38, g-38, 10, 2);
    ctx.fillRect(o.x+42, g-36,  2,  8);
    // ── Ice highlight edges ──
    ctx.fillStyle = ic3;
    ctx.fillRect(o.x,    g-68,  3, 68); // left edge
    ctx.fillRect(o.x,    g-68, 72,  3); // top edge

  } else if (o.otype === "walrus") {
    // Wide squat body, shoots ice tusks horizontally
    const wc1 = o._nightBlend > 0.5 ? "#8899aa" : "#aabbcc";
    const wc2 = o._nightBlend > 0.5 ? "#667788" : "#8899aa";
    const wc3 = o._nightBlend > 0.5 ? "#aaccdd" : "#ddeeff";
    // Body — wide and very low
    ctx.fillStyle = wc1;
    ctx.fillRect(o.x+2,  g-30, 46, 30);
    ctx.fillRect(o.x,    g-22, 50, 18);
    // Head (front, facing left)
    ctx.fillRect(o.x+32, g-36, 20, 18);
    // Snout / muzzle
    ctx.fillStyle = wc2;
    ctx.fillRect(o.x+46, g-30, 10, 12);
    // Tusks — long horizontal ivory
    ctx.fillStyle = wc3;
    ctx.fillRect(o.x+50, g-26,  16, 4);  // upper tusk
    ctx.fillRect(o.x+50, g-20,  14, 3);  // lower tusk
    // Nose
    ctx.fillStyle = "#223344";
    ctx.fillRect(o.x+52, g-28,  5, 4);
    // Eyes
    ctx.fillStyle = "#223344";
    ctx.fillRect(o.x+36, g-34,  4, 4);
    ctx.fillStyle = "#aaddff";
    ctx.fillRect(o.x+37, g-34,  2, 2);
    // Flippers
    ctx.fillStyle = wc2;
    ctx.fillRect(o.x+4,  g-8,  12, 8);
    ctx.fillRect(o.x+20, g-8,  12, 8);
    ctx.fillRect(o.x+36, g-8,  10, 8);
    // Fur texture
    ctx.fillStyle = wc2;
    ctx.fillRect(o.x+6,  g-26, 32, 2);
    ctx.fillRect(o.x+8,  g-20, 28, 2);
    // Tusk projectiles
    for(const b of (o.bullets||[])) {
      ctx.fillStyle = wc3;
      ctx.fillRect(b.x,   b.y-2, 18, 4);
      ctx.fillRect(b.x+2, b.y-4,  6, 2); // tusk tip
      ctx.fillStyle = wc2;
      ctx.fillRect(b.x+4, b.y-1, 10, 2);
    }

  } else if (o.otype === "snowGolem") {
    // 3-stack snowball body, shoots arcing bouncing snowball
    const sg1 = o._nightBlend > 0.5 ? "#aaccdd" : "#ddeeff";
    const sg2 = o._nightBlend > 0.5 ? "#7799aa" : "#aaccee";
    const sg3 = o._nightBlend > 0.5 ? "#556677" : "#88aabb";
    // Bottom ball (largest)
    ctx.fillStyle = sg1;
    ctx.fillRect(o.x+2,  g-22, 36, 22);
    ctx.fillRect(o.x,    g-16, 40, 14);
    ctx.fillStyle = sg2;
    ctx.fillRect(o.x+4,  g-20, 10, 6);  // shadow left
    ctx.fillRect(o.x+28, g-18,  8, 5);  // shadow right
    // Mid ball
    ctx.fillStyle = sg1;
    ctx.fillRect(o.x+6,  g-40, 28, 20);
    ctx.fillRect(o.x+4,  g-36, 32, 14);
    ctx.fillStyle = sg2;
    ctx.fillRect(o.x+8,  g-38,  8, 5);
    ctx.fillRect(o.x+24, g-36,  6, 4);
    // Top ball (head)
    ctx.fillStyle = sg1;
    ctx.fillRect(o.x+10, g-54, 20, 16);
    ctx.fillRect(o.x+8,  g-50, 24, 12);
    // Eyes — dark coal
    ctx.fillStyle = "#1a1a2a";
    ctx.fillRect(o.x+12, g-50,  4, 4);
    ctx.fillRect(o.x+22, g-50,  4, 4);
    // Mouth dots
    ctx.fillRect(o.x+13, g-44,  2, 2);
    ctx.fillRect(o.x+17, g-43,  2, 2);
    ctx.fillRect(o.x+21, g-44,  2, 2);
    // Stick arms
    ctx.fillStyle = sg3;
    ctx.fillRect(o.x-6,  g-38,  8, 4);  // left arm
    ctx.fillRect(o.x-10, g-40,  6, 3);  // left arm tip
    ctx.fillRect(o.x+38, g-38,  8, 4);  // right arm
    ctx.fillRect(o.x+44, g-40,  6, 3);  // right arm tip
    // Snowball projectiles — arcing
    for(const b of (o.bullets||[])) {
      ctx.fillStyle = sg1;
      ctx.fillRect(b.x-6, b.y-6, 12, 12);
      ctx.fillRect(b.x-8, b.y-4,  4,  8);
      ctx.fillRect(b.x+4, b.y-4,  4,  8);
      ctx.fillStyle = sg2;
      ctx.fillRect(b.x-4, b.y-4,  4,  4);
      ctx.fillRect(b.x+2, b.y+2,  3,  3);
    }

  } else if (o.otype === "iceBat") {
    // Aerial swooper — dark body, icy wing membranes
    const isDiving = o._vultureState === 1;
    const fw = isDiving ? 1 : Math.floor(frame/6)%2;
    const bc1 = o._nightBlend > 0.5 ? "#aaccdd" : "#c8e4f4"; // wing membrane
    const bc2 = o._nightBlend > 0.5 ? "#223344" : "#2a3a4a"; // dark body
    ctx.save();
    ctx.translate(o.x+20, 0); ctx.scale(-1,1); ctx.translate(-o.x-20, 0);
    // Body
    ctx.fillStyle = bc2;
    ctx.fillRect(o.x+10, o.y+4,  20, 12);
    // Head
    ctx.fillRect(o.x+22, o.y,    10,  8);
    // Ears (pointy)
    ctx.fillRect(o.x+22, o.y-6,   4,  8);
    ctx.fillRect(o.x+28, o.y-6,   4,  8);
    // Eyes
    ctx.fillStyle = "#aaddff";
    ctx.fillRect(o.x+24, o.y+1,   3,  3);
    ctx.fillRect(o.x+29, o.y+1,   3,  3);
    // Wings
    ctx.fillStyle = bc1;
    if(fw===0){
      // Spread
      ctx.fillRect(o.x-8,  o.y+2,  20, 8);
      ctx.fillRect(o.x-14, o.y+4,   8, 5);
      ctx.fillRect(o.x-18, o.y+6,   6, 4);
      ctx.fillRect(o.x+30, o.y+2,  18, 8);
      ctx.fillRect(o.x+46, o.y+4,   8, 5);
      ctx.fillRect(o.x+52, o.y+6,   6, 4);
    } else {
      // Folded
      ctx.fillRect(o.x+2,  o.y+8,  10, 6);
      ctx.fillRect(o.x-2,  o.y+10,  6, 4);
      ctx.fillRect(o.x+30, o.y+8,  10, 6);
      ctx.fillRect(o.x+38, o.y+10,  6, 4);
    }
    // Wing bone lines
    ctx.fillStyle = bc2;
    if(fw===0){
      ctx.fillRect(o.x-6,  o.y+4,   2, 6);
      ctx.fillRect(o.x+32, o.y+4,   2, 6);
    }
    ctx.restore();

  } else if (o.otype === "blizzardWall") {
    // Tall churning snow column — semi-transparent environmental hazard
    const alpha = 0.55 + Math.sin(frame * 0.08) * 0.12;
    const swirl = (frame * 0.06) % (Math.PI * 2);
    ctx.save();
    // Main column — 3 layered bands of decreasing opacity
    ctx.globalAlpha = alpha * 0.7;
    ctx.fillStyle = "#c8e8ff";
    ctx.fillRect(o.x,    0, 28, GROUND_Y);
    ctx.globalAlpha = alpha * 0.5;
    ctx.fillRect(o.x-8,  0, 12, GROUND_Y);
    ctx.fillRect(o.x+24, 0, 12, GROUND_Y);
    ctx.globalAlpha = alpha * 0.25;
    ctx.fillRect(o.x-18, 0, 12, GROUND_Y);
    ctx.fillRect(o.x+34, 0, 12, GROUND_Y);
    // Swirling snow particles at 4 heights
    ctx.globalAlpha = alpha * 0.9;
    ctx.fillStyle = "#eef8ff";
    const layers = [
      { y: GROUND_Y*0.15, r: 10 },
      { y: GROUND_Y*0.35, r: 12 },
      { y: GROUND_Y*0.55, r: 10 },
      { y: GROUND_Y*0.75, r: 11 },
    ];
    for(const l of layers){
      for(let i=0;i<4;i++){
        const a = swirl + (i/4)*Math.PI*2;
        const px = o.x+14 + Math.cos(a)*l.r;
        const py = l.y    + Math.sin(a)*4;
        ctx.fillRect(px-2, py-2, 4, 4);
      }
    }
    ctx.restore();

  } else if (o.otype === "polarBear") {
    // Chunky white polar bear — solid body obstacle
    const bc1 = o._nightBlend > 0.5 ? "#aaccdd" : "#ddeeff";
    const bc2 = o._nightBlend > 0.5 ? "#88aacc" : "#bbddee";
    const bc3 = o._nightBlend > 0.5 ? "#6688aa" : "#99bbcc";
    const nose = "#1a1a2a";
    const eye  = "#1a1a2a";
    // Body — wide and low
    ctx.fillStyle = bc1;
    ctx.fillRect(o.x+2,  g-28, 40, 28);
    ctx.fillRect(o.x,    g-22, 44, 18);
    // Head (front, facing left toward player)
    ctx.fillRect(o.x+30, g-38, 18, 18);
    ctx.fillRect(o.x+34, g-42, 14, 8);  // top of head
    // Snout
    ctx.fillStyle = bc2;
    ctx.fillRect(o.x+44, g-32, 8, 8);
    ctx.fillRect(o.x+46, g-28, 8, 6);
    // Nose
    ctx.fillStyle = nose;
    ctx.fillRect(o.x+50, g-30, 4, 3);
    // Eye
    ctx.fillStyle = eye;
    ctx.fillRect(o.x+36, g-38, 4, 4);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+37, g-38, 2, 2); // eye shine
    // Ear
    ctx.fillStyle = bc1;
    ctx.fillRect(o.x+34, g-44, 6, 5);
    ctx.fillStyle = bc3;
    ctx.fillRect(o.x+35, g-43, 4, 3); // inner ear
    // Legs
    ctx.fillStyle = bc2;
    ctx.fillRect(o.x+4,  g-8,  10, 8);
    ctx.fillRect(o.x+16, g-8,  10, 8);
    ctx.fillRect(o.x+28, g-8,  10, 8);
    // Paws
    ctx.fillStyle = bc3;
    ctx.fillRect(o.x+3,  g-4,  12, 4);
    ctx.fillRect(o.x+15, g-4,  12, 4);
    ctx.fillRect(o.x+27, g-4,  12, 4);
    // Fur texture — subtle shading lines
    ctx.fillStyle = bc2;
    ctx.fillRect(o.x+6,  g-24, 28, 2);
    ctx.fillRect(o.x+8,  g-18, 24, 2);
    ctx.fillRect(o.x+10, g-12, 18, 2);

  } else if (o.otype === "yeti") {
    ctx.fillStyle = "#ddeeff";
    ctx.fillRect(o.x+6,g-52,32,52);
    ctx.fillRect(o.x+10,g-60,24,12);
    ctx.fillStyle = "#bbddee";
    for(let i=0;i<4;i++) ctx.fillRect(o.x+6+i*8,g-52,6,6);
    for(let i=0;i<4;i++) ctx.fillRect(o.x+6+i*8,g-38,6,6);
    ctx.fillStyle = "#ddeeff";
    ctx.fillRect(o.x,g-44,10,18);
    ctx.fillRect(o.x+34,g-44,10,18);
    ctx.fillStyle = "#aabbcc";
    ctx.fillRect(o.x-2,g-28,5,8); ctx.fillRect(o.x+3,g-28,5,8);
    ctx.fillRect(o.x+36,g-28,5,8); ctx.fillRect(o.x+41,g-28,5,8);
    ctx.fillStyle = "#ff2200";
    ctx.fillRect(o.x+13,g-58,6,6);
    ctx.fillRect(o.x+25,g-58,6,6);
    ctx.fillStyle = "#334455";
    ctx.fillRect(o.x+14,g-50,16,4);
    // Ice chunk projectiles — jagged pixel chunks instead of plain rects
    for(const b of (o.bullets||[])) {
      ctx.fillStyle = "#aaddff";
      ctx.fillRect(b.x,   b.y-4, 12, 8);
      ctx.fillRect(b.x+2, b.y-6,  8, 4);
      ctx.fillRect(b.x+4, b.y+4,  6, 3);
      ctx.fillStyle = "#ddeeff";
      ctx.fillRect(b.x+1, b.y-3,  4, 3);
      ctx.fillRect(b.x+6, b.y-5,  3, 2);
      ctx.fillStyle = "#6699bb";
      ctx.fillRect(b.x+8, b.y-2,  4, 4);
    }

  } else {
    ctx.fillStyle = "#88aabb";
    const h = 28;
    ctx.fillRect(o.x+10,g-h,12,h); ctx.fillRect(o.x+24,g-h*0.7,10,h*0.7);
    ctx.fillStyle = "#ddeeff"; ctx.fillRect(o.x+12,g-h,8,6);
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnArcticObstacle(r, tier) {
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
  else if (r < 0.24) { otype="icewall"; }
  else if (r < 0.31) { otype="snowdrift"; }
  else if (r < 0.37 && tier>=1) { otype="snowball"; }
  else if (r < 0.43 && tier>=1) { otype="arcticFox"; }
  else if (r < 0.49 && tier>=2) { otype="frozenTree"; }
  else if (r < 0.54 && tier>=2) { otype="frostspike"; }
  else if (r < 0.59 && tier>=2) { otype="icicle"; oy=-20; }
  else if (r < 0.64 && tier>=2) { otype="walrus"; bullets=[]; }
  else if (r < 0.69 && tier>=2) { otype="iceBat"; oy=GROUND_Y-88-Math.random()*30; }
  else if (r < 0.74 && tier>=3) { otype="snowGolem"; bullets=[]; }
  else if (r < 0.79 && tier>=3) { otype="polarBear"; }
  else if (r < 0.84 && tier>=3) { otype="yeti"; bullets=[]; }
  else if (r < 0.89 && tier>=3) { otype="blizzardWall"; }
  else if (r < 0.95 && tier>=4) { otype="frozenMammoth"; }
  else                           { otype="cactus"; type=0; }
  return { otype, type, oy, bullets };
}
