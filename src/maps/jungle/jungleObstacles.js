// ─── JUNGLE OBSTACLES ────────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawJungleObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  if (o.otype === "jungleTree") {
    const t = o.type||0;
    if (t === 0) {
      // Wide tropical tree with buttress roots
      ctx.fillStyle = "#3a2008";
      ctx.fillRect(o.x+14,g-58,14,58); // trunk
      ctx.fillStyle = "#2a1406";
      ctx.fillRect(o.x+14,g-58,5,58);  // trunk shadow
      ctx.fillStyle = "#4a2a10";
      ctx.fillRect(o.x+18,g-56,6,56);  // trunk highlight
      // Buttress roots
      ctx.fillStyle = "#3a2008";
      ctx.fillRect(o.x+4, g-24,12,24); ctx.fillRect(o.x+2, g-14,12,14);
      ctx.fillRect(o.x+26,g-20,12,20); ctx.fillRect(o.x+28,g-12,10,12);
      ctx.fillStyle = "#2a1406";
      ctx.fillRect(o.x+4, g-24,4,24);  ctx.fillRect(o.x+26,g-20,4,20);
      // Broad canopy
      ctx.fillStyle = "#1a5a08";
      ctx.fillRect(o.x-8, g-68,58,18);
      ctx.fillRect(o.x-2, g-78,46,14);
      ctx.fillRect(o.x+4, g-86,34,12);
      ctx.fillRect(o.x+8, g-92,24,8);
      ctx.fillStyle = "#2a7a10";
      ctx.fillRect(o.x-4, g-70,50,8);
      ctx.fillRect(o.x+2, g-80,38,8);
      ctx.fillStyle = "#3a9a18";
      ctx.fillRect(o.x,   g-72,42,5);
      ctx.fillRect(o.x+6, g-82,28,5);
      // Dark underside shadow
      ctx.fillStyle = "#0e3a06";
      ctx.fillRect(o.x-6, g-62,54,6);
    } else if (t === 1) {
      // Tall emergent tree towering above the canopy
      ctx.fillStyle = "#3a2008";
      ctx.fillRect(o.x+16,g-90,12,90); // tall trunk
      ctx.fillStyle = "#2a1406";
      ctx.fillRect(o.x+16,g-90,4,90);
      ctx.fillStyle = "#4a2a10";
      ctx.fillRect(o.x+20,g-88,5,88);
      // Side branches
      ctx.fillStyle = "#3a2008";
      ctx.fillRect(o.x+2, g-60,16,6);  ctx.fillRect(o.x-4,g-64,10,5);
      ctx.fillRect(o.x+28,g-50,14,6);  ctx.fillRect(o.x+38,g-54,8,5);
      // Canopy — wide spreading crown
      ctx.fillStyle = "#1a5a08";
      ctx.fillRect(o.x-10,g-96,64,16);
      ctx.fillRect(o.x-4, g-104,52,12);
      ctx.fillRect(o.x+2, g-110,40,10);
      ctx.fillRect(o.x+8, g-114,28,8);
      ctx.fillStyle = "#2a7a10";
      ctx.fillRect(o.x-6, g-98,56,8);
      ctx.fillRect(o.x,   g-106,44,8);
      ctx.fillStyle = "#3a9a18";
      ctx.fillRect(o.x-2, g-100,48,5);
      // Branch leaf clusters
      ctx.fillStyle = "#1a5a08";
      ctx.fillRect(o.x-8, g-66,18,10); ctx.fillRect(o.x+34,g-56,16,10);
      ctx.fillStyle = "#2a7a10";
      ctx.fillRect(o.x-6, g-68,12,6);  ctx.fillRect(o.x+36,g-58,10,6);
    } else {
      // Strangler fig — gnarled multi-trunk with aerial roots
      // Left trunk
      ctx.fillStyle = "#3a2a10";
      ctx.fillRect(o.x+4, g-70,10,70);
      ctx.fillStyle = "#2a1a08";
      ctx.fillRect(o.x+4, g-70,3,70);
      // Right trunk
      ctx.fillRect(o.x+26,g-60,10,60);
      ctx.fillRect(o.x+26,g-60,3,60);
      // Connecting arch
      ctx.fillStyle = "#3a2a10";
      ctx.fillRect(o.x+12,g-68,16,8);
      // Aerial roots hanging down
      ctx.fillStyle = "#2a1a08";
      ctx.fillRect(o.x+8, g-50,3,38); ctx.fillRect(o.x+16,g-44,2,32);
      ctx.fillRect(o.x+22,g-48,3,36); ctx.fillRect(o.x+30,g-40,2,28);
      // Canopy — irregular lumpy shape
      ctx.fillStyle = "#1a5a08";
      ctx.fillRect(o.x-4, g-76,50,16);
      ctx.fillRect(o.x,   g-84,40,12);
      ctx.fillRect(o.x+4, g-90,28,10);
      ctx.fillStyle = "#2a7a10";
      ctx.fillRect(o.x-2, g-78,44,8);
      ctx.fillRect(o.x+2, g-86,32,8);
      ctx.fillStyle = "#3a9a18";
      ctx.fillRect(o.x+2, g-80,36,5);
      // Moss and epiphytes on trunks
      ctx.fillStyle = "#2a6a10";
      ctx.fillRect(o.x+6, g-52,5,6); ctx.fillRect(o.x+28,g-44,5,6);
      ctx.fillRect(o.x+6, g-34,4,5); ctx.fillRect(o.x+28,g-30,4,5);
    }
  } else if (o.otype === "rock") {
    ctx.fillStyle = "#2a4a18";
    ctx.fillRect(o.x+2, g-20,40,20); ctx.fillRect(o.x+6, g-26,32,8);
    ctx.fillStyle = "#3a6a28";
    ctx.fillRect(o.x,   g-22,44,5);
    ctx.fillStyle = "#1a3a10";
    ctx.fillRect(o.x+8, g-18,6,6); ctx.fillRect(o.x+22,g-16,5,5);
  } else if (o.otype === "vineTrap") {
    const snap = o._snapState||0;
    ctx.fillStyle = "#1a5a10";
    ctx.fillRect(o.x,g-60,40,6);
    ctx.fillStyle = "#2a7a18";
    const openL = snap>0.5 ? 4 : 14;
    ctx.fillRect(o.x+2,    g-54, 6, 54-openL);
    ctx.fillRect(o.x+2,    g-openL, 14, openL);
    const openR = snap>0.5 ? 4 : 14;
    ctx.fillRect(o.x+32,   g-54, 6, 54-openR);
    ctx.fillRect(o.x+24,   g-openR, 14, openR);
    ctx.fillStyle = "#88ff44";
    for(let i=0;i<3;i++) ctx.fillRect(o.x+4+i*5, g-openL, 3, 5);
    for(let i=0;i<3;i++) ctx.fillRect(o.x+26+i*5,g-openR, 3, 5);
  } else if (o.otype === "giantMushroom") {
    ctx.fillStyle = "#6a3a18";
    ctx.fillRect(o.x+16,g-28,10,28);
    ctx.fillStyle = "#dd4422";
    ctx.fillRect(o.x,   g-36,42,12);
    ctx.fillRect(o.x+4, g-44,34,10);
    ctx.fillRect(o.x+10,g-50,22,8);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+6, g-40,5,5); ctx.fillRect(o.x+20,g-44,4,4);
    ctx.fillRect(o.x+30,g-38,5,5);
    if(Math.floor(frame/20)%2===0){
      ctx.fillStyle = "rgba(255,200,100,0.4)";
      ctx.fillRect(o.x+8,g-54,6,6); ctx.fillRect(o.x+28,g-52,5,5);
    }
  } else if (o.otype === "piranha") {
    const chomp = Math.floor(frame/18)%3===0;
    ctx.fillStyle = "#1a6a10";
    ctx.fillRect(o.x+16,g-40,8,40);
    ctx.fillRect(o.x+10,g-44,20,6);
    ctx.fillStyle = "#cc2244";
    ctx.fillRect(o.x+6, g-60,28,18);
    if (chomp) {
      ctx.fillStyle = "#ff4466";
      ctx.fillRect(o.x+8, g-56,24,10);
      ctx.fillStyle = "#ffffff";
      for(let i=0;i<4;i++) ctx.fillRect(o.x+9+i*6,g-56,4,5);
      for(let i=0;i<4;i++) ctx.fillRect(o.x+9+i*6,g-48,4,5);
    } else {
      ctx.fillStyle = "#aa1133";
      ctx.fillRect(o.x+8, g-52,24,4);
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+10,g-62,6,6); ctx.fillRect(o.x+24,g-62,6,6);
    ctx.fillStyle = "#000000";
    ctx.fillRect(o.x+12,g-60,3,3); ctx.fillRect(o.x+26,g-60,3,3);
  } else if (o.otype === "gorilla") {
    ctx.fillStyle = "#2a1a08";
    ctx.fillRect(o.x+6, g-52,32,52);
    ctx.fillRect(o.x+10,g-62,24,14);
    ctx.fillStyle = "#1a0a04";
    ctx.fillRect(o.x+10,g-62,24,5);
    ctx.fillStyle = "#cc8844";
    ctx.fillRect(o.x+14,g-58,6,6); ctx.fillRect(o.x+24,g-58,6,6);
    ctx.fillStyle = "#000";
    ctx.fillRect(o.x+16,g-56,3,3); ctx.fillRect(o.x+26,g-56,3,3);
    ctx.fillStyle = "#1a0a04";
    ctx.fillRect(o.x+16,g-50,4,3); ctx.fillRect(o.x+24,g-50,4,3);
    ctx.fillStyle = "#2a1a08";
    ctx.fillRect(o.x-2, g-46,12,22);
    ctx.fillRect(o.x+34,g-46,12,22);
    ctx.fillRect(o.x-4, g-26,10,8); ctx.fillRect(o.x+38,g-26,10,8);
    // Arcing coconut bullets
    for(const b of (o.bullets||[])) {
      ctx.fillStyle = "#6a4a20";
      ctx.fillRect(b.x,b.y,10,10);
      ctx.fillStyle = "#4a2a10"; ctx.fillRect(b.x+2,b.y+2,3,3);
      ctx.fillStyle = "#8a6a30"; ctx.fillRect(b.x+1,b.y+1,3,2);
    }
  } else if (o.otype === "jungleSpider") {
    // Hangs on silk thread, drops when dino is close
    const sy = o._spiderY !== undefined ? o._spiderY : -20;
    if (sy <= -16) return;
    // Silk thread from top of screen
    ctx.fillStyle = "#aaddaa";
    ctx.fillRect(o.x+18, 0, 2, sy+16);
    // Body
    ctx.fillStyle = "#1a1a08";
    ctx.fillRect(o.x+10, sy,    20, 14);
    ctx.fillRect(o.x+12, sy-6,  16, 8);
    // Abdomen markings
    ctx.fillStyle = "#cc2200";
    ctx.fillRect(o.x+14, sy+2,  12, 4);
    ctx.fillRect(o.x+16, sy+6,   8, 4);
    // Eyes
    ctx.fillStyle = "#ff4400";
    ctx.fillRect(o.x+13, sy-4,  3, 3);
    ctx.fillRect(o.x+18, sy-4,  3, 3);
    ctx.fillRect(o.x+23, sy-4,  3, 3);
    // Legs — 4 each side
    ctx.fillStyle = "#1a1a08";
    for(let i=0;i<4;i++){
      ctx.fillRect(o.x+2-i*2,  sy+2+i*3, 10, 2); // left legs
      ctx.fillRect(o.x+28+i*2, sy+2+i*3, 10, 2); // right legs
    }
  } else if (o.otype === "thornWall") {
    // Tall wall of packed thorns — forces a jump
    ctx.fillStyle = "#2a5a10";
    ctx.fillRect(o.x+4,  g-68, 28, 68);
    ctx.fillStyle = "#1a4008";
    ctx.fillRect(o.x+4,  g-68, 8,  68); // shadow side
    ctx.fillStyle = "#3a7a18";
    ctx.fillRect(o.x+10, g-68, 8,  68); // highlight strip
    // Thorn spikes along the top and sides
    ctx.fillStyle = "#88cc22";
    for(let i=0;i<5;i++){
      const tx = o.x+4+i*6;
      ctx.fillRect(tx,   g-72, 4, 6);  // top spikes
      ctx.fillRect(tx+1, g-76, 2, 4);
    }
    ctx.fillStyle = "#66aa18";
    // Left side thorns
    ctx.fillRect(o.x,    g-56, 6, 3);
    ctx.fillRect(o.x-2,  g-42, 6, 3);
    ctx.fillRect(o.x,    g-28, 6, 3);
    // Right side thorns
    ctx.fillRect(o.x+30, g-50, 6, 3);
    ctx.fillRect(o.x+30, g-36, 6, 3);
    ctx.fillRect(o.x+30, g-22, 6, 3);
    // Leaf clusters
    ctx.fillStyle = "#2a8a10";
    ctx.fillRect(o.x+2,  g-64, 10, 6);
    ctx.fillRect(o.x+18, g-58, 10, 6);
    ctx.fillRect(o.x+6,  g-44, 8,  5);
    ctx.fillRect(o.x+20, g-32, 8,  5);
  } else if (o.otype === "pterosaur") {
    const isDiving = o._vultureState === 1;
    const fw = isDiving ? 1 : Math.floor(frame/7)%2;
    ctx.save();
    ctx.translate(o.x+22, 0); ctx.scale(-1,1); ctx.translate(-o.x-22, 0);
    // Body
    ctx.fillStyle = "#1a5a08";
    ctx.fillRect(o.x+8,  o.y+6,  26, 12);
    // Neck
    ctx.fillRect(o.x+24, o.y+2,  12,  8);
    // Head
    ctx.fillRect(o.x+30, o.y,    12, 10);
    // Crest — sits on top of head (after mirror, head is on the left/front side)
    ctx.fillStyle = "#cc4400";
    ctx.fillRect(o.x+30, o.y-6,   8,  8);
    ctx.fillRect(o.x+32, o.y-10,  5,  6);
    ctx.fillRect(o.x+34, o.y-13,  3,  4);
    // Beak — short forward-pointing
    ctx.fillStyle = "#ddaa00";
    ctx.fillRect(o.x+40, o.y+2,   8,  4);
    ctx.fillRect(o.x+46, o.y+3,   4,  2);
    // Eye
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(o.x+32, o.y+1,   5,  5);
    ctx.fillStyle = "#1a0800";
    ctx.fillRect(o.x+33, o.y+2,   3,  3);
    // Belly
    ctx.fillStyle = "#2a7a18";
    ctx.fillRect(o.x+10, o.y+8,  18,  8);
    // Wings
    ctx.fillStyle = "#1a5a08";
    if(fw===0){
      ctx.fillRect(o.x-8,  o.y-2, 20, 8); ctx.fillRect(o.x-14,o.y-6,8,5); ctx.fillRect(o.x-18,o.y-8,6,4);
      ctx.fillRect(o.x+28, o.y+14,18, 7); ctx.fillRect(o.x+44,o.y+18,8,5); ctx.fillRect(o.x+50,o.y+20,6,4);
      ctx.fillStyle = "#2a7a18";
      ctx.fillRect(o.x-6, o.y-1, 12, 3); ctx.fillRect(o.x+30,o.y+15,10,3);
    } else {
      ctx.fillRect(o.x-2,  o.y+4, 12, 7); ctx.fillRect(o.x-6, o.y+7,6,5);
      ctx.fillRect(o.x+28, o.y+4, 10, 7); ctx.fillRect(o.x+36,o.y+7,6,5);
    }
    // Tail
    ctx.fillStyle = "#1a5a08";
    ctx.fillRect(o.x+2, o.y+14, 10, 5); ctx.fillRect(o.x+4,o.y+18,6,4);
    ctx.restore();
  } else if (o.otype === "jungleBoar") {
    const legFrame = Math.floor(frame/5)%2;
    // Body
    ctx.fillStyle = "#2a1a08";
    ctx.fillRect(o.x+4, g-28,34,20);
    ctx.fillStyle = "#1a0e04";
    ctx.fillRect(o.x+4, g-28,8,20);  // body shadow
    ctx.fillStyle = "#3a2a10";
    ctx.fillRect(o.x+6, g-26,18,8);  // body highlight
    // Rump hump
    ctx.fillStyle = "#2a1a08";
    ctx.fillRect(o.x+28,g-34,12,10);
    ctx.fillStyle = "#3a2a10";
    ctx.fillRect(o.x+30,g-32,8,6);
    // Head
    ctx.fillStyle = "#2a1a08";
    ctx.fillRect(o.x,   g-30,14,18);
    ctx.fillStyle = "#1a0e04";
    ctx.fillRect(o.x,   g-30,4,18);
    // Snout
    ctx.fillStyle = "#3a2010";
    ctx.fillRect(o.x-6, g-26,10,10);
    ctx.fillStyle = "#1a0e08";
    ctx.fillRect(o.x-6, g-24,3,3); ctx.fillRect(o.x-6,g-20,3,3); // nostrils
    // Tusks — longer and more prominent for jungle boar
    ctx.fillStyle = "#ddd8aa";
    ctx.fillRect(o.x-10,g-24,8,3);
    ctx.fillRect(o.x-12,g-22,5,2);
    // Eye
    ctx.fillStyle = "#1a0e08";
    ctx.fillRect(o.x+2, g-28,4,4);
    ctx.fillStyle = "#cc2200";
    ctx.fillRect(o.x+3, g-27,2,2);
    // Ear
    ctx.fillStyle = "#1a0e04";
    ctx.fillRect(o.x+8, g-34,6,8);
    ctx.fillStyle = "#2a1a08";
    ctx.fillRect(o.x+9, g-33,4,5);
    // Mud patches — jungle boar is muddy
    ctx.fillStyle = "#1a1208";
    ctx.fillRect(o.x+10,g-22,6,4); ctx.fillRect(o.x+22,g-18,5,4);
    ctx.fillRect(o.x+30,g-26,4,4);
    // Legs
    ctx.fillStyle = "#1a0e04";
    if(legFrame===0){
      ctx.fillRect(o.x+6, g-10,6,10); ctx.fillRect(o.x+16,g-8, 6,8);
      ctx.fillRect(o.x+26,g-8, 6,8);  ctx.fillRect(o.x+34,g-10,6,10);
    } else {
      ctx.fillRect(o.x+6, g-8, 6,8);  ctx.fillRect(o.x+16,g-10,6,10);
      ctx.fillRect(o.x+26,g-10,6,10); ctx.fillRect(o.x+34,g-8, 6,8);
    }
    // Tail
    ctx.fillStyle = "#2a1a08";
    ctx.fillRect(o.x+36,g-32,6,4); ctx.fillRect(o.x+40,g-30,4,4);
    // Leaf debris kicked up
    const dustA = 0.25+Math.sin(frame*0.3)*0.1;
    ctx.fillStyle = `rgba(30,80,10,${dustA})`;
    ctx.fillRect(o.x+34,g-10,8,6); ctx.fillRect(o.x+38,g-14,6,5);
  } else if (o.otype === "poisonFrog") {
    const hopUp = (o._hopY||0) > 2;
    const g2 = g - (o._hopY||0);
    // Shadow
    ctx.save();
    ctx.globalAlpha = Math.max(0.1, 0.4 - (o._hopY||0) * 0.01);
    ctx.fillStyle = "#000000";
    ctx.fillRect(o.x+6, g-2, 28, 4);
    ctx.restore();
    // Body
    ctx.fillStyle = "#22aa22";
    ctx.fillRect(o.x+4,  g2-16, 32, 14);
    ctx.fillRect(o.x+8,  g2-20, 24, 6);
    // Belly
    ctx.fillStyle = "#88ee44";
    ctx.fillRect(o.x+10, g2-14, 18, 10);
    // Poison spots
    ctx.fillStyle = "#aa2288";
    ctx.fillRect(o.x+6,  g2-16, 5, 5);
    ctx.fillRect(o.x+18, g2-18, 4, 4);
    ctx.fillRect(o.x+28, g2-15, 5, 5);
    // Eyes — bulge up when hopping
    const eyeY = hopUp ? g2-24 : g2-22;
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(o.x+8,  eyeY, 7, 7);
    ctx.fillRect(o.x+25, eyeY, 7, 7);
    ctx.fillStyle = "#000000";
    ctx.fillRect(o.x+10, eyeY+2, 3, 3);
    ctx.fillRect(o.x+27, eyeY+2, 3, 3);
    // Legs — splayed when on ground, tucked when hopping
    ctx.fillStyle = "#1a8818";
    if(hopUp){
      ctx.fillRect(o.x,    g2-10, 6, 6);
      ctx.fillRect(o.x+34, g2-10, 6, 6);
    } else {
      ctx.fillRect(o.x-4,  g2-8,  10, 5);
      ctx.fillRect(o.x+34, g2-8,  10, 5);
      ctx.fillRect(o.x,    g2-4,  8,  4);
      ctx.fillRect(o.x+32, g2-4,  8,  4);
    }
  } else if (o.otype === "fallingLog") {
    const ly = o._logY !== undefined ? o._logY : -30;
    if (ly <= -20) return; // not yet visible
    // Shadow on ground when log is above
    const shadowAlpha = Math.max(0, 0.35 - (ly / (GROUND_Y - 30)) * 0.35);
    if (shadowAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = shadowAlpha;
      ctx.fillStyle = "#000000";
      ctx.fillRect(o.x + 4, GROUND_Y - 2, 36, 4);
      ctx.restore();
    }
    // Log body
    ctx.fillStyle = "#5a3a10";
    ctx.fillRect(o.x,    ly,    44, 18);
    ctx.fillStyle = "#7a5a28";
    ctx.fillRect(o.x,    ly,    44,  6); // top highlight
    ctx.fillStyle = "#3a2008";
    ctx.fillRect(o.x,    ly+14, 44,  4); // bottom shadow
    // End caps
    ctx.fillStyle = "#8a6a38";
    ctx.fillRect(o.x,    ly+2,   6, 14);
    ctx.fillRect(o.x+38, ly+2,   6, 14);
    // Ring grain on end caps
    ctx.fillStyle = "#6a4a20";
    ctx.fillRect(o.x+1,  ly+5,   4,  2);
    ctx.fillRect(o.x+39, ly+5,   4,  2);
    // Bark texture streaks
    ctx.fillStyle = "#4a2a08";
    ctx.fillRect(o.x+10, ly+2,   3, 14);
    ctx.fillRect(o.x+22, ly+2,   2, 14);
    ctx.fillRect(o.x+32, ly+2,   3, 14);
    // Moss patches
    ctx.fillStyle = "#2a6a10";
    ctx.fillRect(o.x+8,  ly,     8,  3);
    ctx.fillRect(o.x+26, ly,     6,  3);
  } else if (o.otype === "jungleSerpent") {
    // Body coiled on ground, head raised
    ctx.fillStyle = "#1a6a10";
    ctx.fillRect(o.x+4, g-14,36,14); // base coil
    ctx.fillRect(o.x+8, g-22,28,10);
    ctx.fillStyle = "#2a8a18";
    ctx.fillRect(o.x+6, g-12,32,8);  // coil highlight
    // Raised neck
    ctx.fillStyle = "#1a6a10";
    ctx.fillRect(o.x+14,g-44,14,24);
    ctx.fillStyle = "#2a8a18";
    ctx.fillRect(o.x+16,g-44,8,24);
    // Head
    ctx.fillStyle = "#1a6a10";
    ctx.fillRect(o.x+10,g-56,20,14);
    ctx.fillStyle = "#2a8a18";
    ctx.fillRect(o.x+12,g-54,16,10);
    // Eyes
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(o.x+12,g-54,4,4); ctx.fillRect(o.x+24,g-54,4,4);
    ctx.fillStyle = "#000000";
    ctx.fillRect(o.x+13,g-53,2,2); ctx.fillRect(o.x+25,g-53,2,2);
    // Forked tongue
    const flick = Math.floor(frame/12)%2===0;
    ctx.fillStyle = "#ff4444";
    if(flick){
      ctx.fillRect(o.x+18,g-58,4,4);
      ctx.fillRect(o.x+16,g-62,2,4); ctx.fillRect(o.x+22,g-62,2,4);
    } else {
      ctx.fillRect(o.x+18,g-58,4,6);
    }
    // Scale pattern
    ctx.fillStyle = "#0a4a08";
    ctx.fillRect(o.x+10,g-48,4,3); ctx.fillRect(o.x+18,g-42,4,3); ctx.fillRect(o.x+10,g-36,4,3);
    // Poison blob bullets
    for(const b of (o.bullets||[])) {
      ctx.fillStyle = "#44cc22";
      ctx.fillRect(b.x,b.y,8,8);
      ctx.fillStyle = "#88ff44"; ctx.fillRect(b.x+1,b.y+1,3,3);
      ctx.fillStyle = "#22aa00"; ctx.fillRect(b.x+4,b.y+4,3,3);
    }
  } else {
    ctx.fillStyle = "#1a5a10";
    for(let i=0;i<3;i++){ctx.fillRect(o.x+i*14,g-34,8,34); ctx.fillRect(o.x+i*14-2,g-36,12,6);}
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnJungleObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];
  if (tier === 0) {
    otype = r < 0.62 ? "jungleTree" : "bird";
    type = 0;
    if (otype === "bird") oy = GROUND_Y - 88 - Math.random() * 48;
    return { otype, type, oy, bullets };
  }
  if      (r < 0.15) { otype="jungleTree"; type=Math.floor(Math.random()*3); }
  else if (r < 0.26) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                       if(tier>=2&&Math.random()<0.35) oy=GROUND_Y-62;
                       if(tier>=2&&Math.random()<0.30) oy=GROUND_Y-36; }
  else if (r < 0.35) { otype="rock"; }
  else if (r < 0.43 && tier>=1) { otype="giantMushroom"; }
  else if (r < 0.50 && tier>=1) { otype="vineTrap"; }
  else if (r < 0.57 && tier>=1) { otype="poisonFrog"; }
  else if (r < 0.63 && tier>=1) { otype="thornWall"; }
  else if (r < 0.69 && tier>=2) { otype="piranha"; }
  else if (r < 0.74 && tier>=2) { otype="fallingLog"; }
  else if (r < 0.79 && tier>=2) { otype="jungleSpider"; }
  else if (r < 0.84 && tier>=2) { otype="pterosaur"; oy=GROUND_Y-90-Math.random()*30; }
  else if (r < 0.90 && tier>=2) { otype="jungleSerpent"; bullets=[]; }
  else if (r < 0.94 && tier>=3) { otype="jungleBoar"; }
  else if (r < 0.97 && tier>=3) { otype="gorilla"; bullets=[]; }
  else                           { otype="jungleTree"; type=0; }
  return { otype, type, oy, bullets };
}
