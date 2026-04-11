// ─── RUINS OBSTACLES ─────────────────────────────────────────────────────────
import { GROUND_Y } from "../../maps/mapConstants";

// ── Draw ──────────────────────────────────────────────────────────────────────
export function drawRuinsObstacle(ctx, o, frame) {
  const g = GROUND_Y;

  if (o.otype === "cactus") {
    const t = o.type||0;
    const h = 32+(t*10);
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x+6,g-h,24,h);
    ctx.fillStyle = "#8a7a60";
    ctx.fillRect(o.x+2,g-8,32,8);
    ctx.fillStyle = "#6a5a40";
    ctx.fillRect(o.x+6,g-h,8,5); ctx.fillRect(o.x+20,g-h+3,8,4);
    ctx.fillStyle = "#5a4a38";
    ctx.fillRect(o.x+14,g-h+6,2,h-14); ctx.fillRect(o.x+9,g-h+16,2,12);
    ctx.fillStyle = "#4a6a30";
    ctx.fillRect(o.x+8,g-h+8,5,4); ctx.fillRect(o.x+18,g-h+20,4,3);
  } else if (o.otype === "pillar") {
    const t = o.type||0;
    const h = 44+t*8;
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x+6,g-h,24,h);
    ctx.fillStyle = "#8a7a60";
    ctx.fillRect(o.x+2,g-h,32,7);
    ctx.fillRect(o.x+2,g-10,32,10);
    ctx.fillStyle = "#d4c8a0";
    ctx.fillRect(o.x+22,g-h,12,10); ctx.fillRect(o.x+6,g-h+4,8,6);
    ctx.fillStyle = "#6a5a40";
    ctx.fillRect(o.x+6,g-h*0.5,24,4);
    ctx.fillStyle = "#4a3a28";
    ctx.fillRect(o.x+12,g-h+8,2,h-18); ctx.fillRect(o.x+20,g-h+14,2,h*0.4);
    ctx.fillStyle = "#3a5a28";
    ctx.fillRect(o.x+8,g-h+10,6,4); ctx.fillRect(o.x+18,g-h*0.5+6,5,3);
  } else if (o.otype === "statue") {
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x+4,g-52,28,52);
    ctx.fillRect(o.x+8,g-60,20,12);
    ctx.fillStyle = "#5a4a38";
    ctx.fillRect(o.x+10,g-56,5,5);
    ctx.fillRect(o.x+21,g-56,5,5);
    ctx.fillRect(o.x+12,g-50,12,3);
    const eyeGlow = Math.floor(frame/12)%2===0 ? "#ffaa00" : "#ff6600";
    ctx.fillStyle = eyeGlow;
    ctx.fillRect(o.x+11,g-55,3,3); ctx.fillRect(o.x+22,g-55,3,3);
    ctx.fillStyle = "#8a7a60";
    ctx.fillRect(o.x+6,g-64,24,6);
    ctx.fillRect(o.x+10,g-68,16,6);
    ctx.fillRect(o.x+14,g-72,8,6);
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x,g-44,8,16); ctx.fillRect(o.x+28,g-44,8,16);
    for(const b of (o.bullets||[])) {
      ctx.fillStyle = "#ffaa00"; ctx.fillRect(b.x,b.y,12,4);
      ctx.fillStyle = "#ff6600"; ctx.fillRect(b.x+2,b.y+1,6,2);
    }
  } else if (o.otype === "spiketrap") {
    const sh = o._spikeH||0;
    ctx.fillStyle = "#6a5a40";
    ctx.fillRect(o.x,g-6,44,6);
    ctx.fillStyle = "#8a7a60";
    for(let i=0;i<5;i++){
      const sx = o.x+2+i*9;
      ctx.beginPath();
      ctx.moveTo(sx,g-6);
      ctx.lineTo(sx+4,g-6-sh);
      ctx.lineTo(sx+8,g-6);
      ctx.fill();
    }
    if(sh>8){
      ctx.fillStyle = "#ccbbaa";
      for(let i=0;i<5;i++) ctx.fillRect(o.x+5+i*9,g-6-sh,2,3);
    }
  } else if (o.otype === "boulder") {
    const rot = (frame*0.06)%(Math.PI*2);
    const bounce = Math.abs(Math.sin(frame*0.12))*4;
    ctx.save();
    ctx.translate(o.x+16,g-16-bounce);
    ctx.rotate(rot);
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(-14,-8,28,16); ctx.fillRect(-10,-14,20,28);
    ctx.fillRect(-16,-4,32,8);
    ctx.fillStyle = "#5a4a38";
    ctx.fillRect(-8,-10,2,8); ctx.fillRect(4,-8,2,10);
    ctx.fillRect(-4,2,8,2);
    ctx.fillStyle = "#3a5a28";
    ctx.fillRect(-10,-6,4,4); ctx.fillRect(6,2,4,4);
    ctx.restore();
  } else if (o.otype === "scarab") {
    // Giant golden scarab beetle — low profile ground creature
    const legFrame = Math.floor(frame/5)%2;
    const sc1 = "#c8a820"; // gold shell
    const sc2 = "#e8c840"; // highlight
    const sc3 = "#8a6a10"; // shadow/underside
    const sc4 = "#2a1a08"; // legs/antennae
    // Shell (elytra) — wide oval body
    ctx.fillStyle = sc1;
    ctx.fillRect(o.x+4,  g-14, 36, 14);
    ctx.fillRect(o.x+2,  g-10, 40, 10);
    ctx.fillRect(o.x+8,  g-18, 28,  6);
    // Shell highlight stripe down the middle
    ctx.fillStyle = sc2;
    ctx.fillRect(o.x+18, g-18,  8, 18);
    ctx.fillRect(o.x+10, g-14, 24,  4);
    // Shell shadow edges
    ctx.fillStyle = sc3;
    ctx.fillRect(o.x+4,  g-4,  36,  4);
    ctx.fillRect(o.x+2,  g-10,  4, 10);
    ctx.fillRect(o.x+38, g-10,  4, 10);
    // Center line split between elytra
    ctx.fillStyle = sc3;
    ctx.fillRect(o.x+21, g-18,  2, 18);
    // Head — small, forward-facing (left)
    ctx.fillStyle = sc1;
    ctx.fillRect(o.x,    g-12, 10, 10);
    ctx.fillStyle = sc2;
    ctx.fillRect(o.x+2,  g-12,  6,  4);
    // Eyes
    ctx.fillStyle = "#000000";
    ctx.fillRect(o.x+1,  g-11,  3,  3);
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(o.x+2,  g-10,  2,  2);
    // Antennae
    ctx.fillStyle = sc4;
    ctx.fillRect(o.x-4,  g-16,  6,  2);
    ctx.fillRect(o.x-6,  g-18,  4,  2);
    ctx.fillRect(o.x-4,  g-14,  6,  2);
    ctx.fillRect(o.x-6,  g-12,  4,  2);
    // Legs — 3 pairs, animate alternating
    ctx.fillStyle = sc4;
    if(legFrame===0){
      ctx.fillRect(o.x+8,  g,    4, 4); ctx.fillRect(o.x+6,  g+2,  4, 2); // front pair down
      ctx.fillRect(o.x+20, g-2,  4, 4); ctx.fillRect(o.x+18, g+1,  4, 2); // mid pair up
      ctx.fillRect(o.x+32, g,    4, 4); ctx.fillRect(o.x+30, g+2,  4, 2); // rear pair down
    } else {
      ctx.fillRect(o.x+8,  g-2,  4, 4); ctx.fillRect(o.x+6,  g+1,  4, 2); // front pair up
      ctx.fillRect(o.x+20, g,    4, 4); ctx.fillRect(o.x+18, g+2,  4, 2); // mid pair down
      ctx.fillRect(o.x+32, g-2,  4, 4); ctx.fillRect(o.x+30, g+1,  4, 2); // rear pair up
    }
    // Underside legs (other side, mirrored)
    if(legFrame===0){
      ctx.fillRect(o.x+10, g,    4, 3); ctx.fillRect(o.x+22, g-2,  4, 3); ctx.fillRect(o.x+34, g,    4, 3);
    } else {
      ctx.fillRect(o.x+10, g-2,  4, 3); ctx.fillRect(o.x+22, g,    4, 3); ctx.fillRect(o.x+34, g-2,  4, 3);
    }
  } else if (o.otype === "wraith") {
    // Ghostly spirit — shaped outline only, no background fill
    const isDiving = o._vultureState === 1;
    const bob = Math.sin(frame * 0.12) * 4;
    const wc1 = "#cc99ff";
    const wc3 = "#8844cc";
    ctx.save();
    ctx.globalAlpha = 0.88;
    // Robe/body
    ctx.fillStyle = wc1;
    ctx.fillRect(o.x+8,  o.y+bob+10, 28, 20);
    ctx.fillRect(o.x+4,  o.y+bob+14, 36, 12);
    ctx.fillRect(o.x+10, o.y+bob+4,  24, 10);
    // Wispy tail strips
    ctx.fillStyle = wc3;
    ctx.fillRect(o.x+8,  o.y+bob+28, 6,  8);
    ctx.fillRect(o.x+18, o.y+bob+30, 8,  6);
    ctx.fillRect(o.x+30, o.y+bob+28, 6,  8);
    ctx.fillRect(o.x+10, o.y+bob+34, 4,  4);
    ctx.fillRect(o.x+20, o.y+bob+34, 6,  4);
    ctx.fillRect(o.x+30, o.y+bob+34, 4,  4);
    // Hood/head
    ctx.fillStyle = wc1;
    ctx.fillRect(o.x+10, o.y+bob-4,  24, 14);
    ctx.fillRect(o.x+8,  o.y+bob,    28,  8);
    ctx.fillRect(o.x+14, o.y+bob-10, 16,  8);
    // Hood shadow cutouts — punch holes to show transparency
    ctx.globalAlpha = 0;
    ctx.fillRect(o.x+14, o.y+bob-8,  8,  6);
    ctx.fillRect(o.x+24, o.y+bob-6,  6,  5);
    ctx.globalAlpha = 0.88;
    // Hood dark recesses
    ctx.fillStyle = wc3;
    ctx.fillRect(o.x+10, o.y+bob-2,  8,  8);
    ctx.fillRect(o.x+26, o.y+bob-2,  8,  8);
    // Glowing eyes
    const eyePulse = Math.floor(frame/10)%2===0;
    ctx.fillStyle = eyePulse ? "#ff88ff" : "#dd44ff";
    ctx.fillRect(o.x+14, o.y+bob,    5,  5);
    ctx.fillRect(o.x+25, o.y+bob,    5,  5);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(o.x+15, o.y+bob+1,  2,  2);
    ctx.fillRect(o.x+26, o.y+bob+1,  2,  2);
    // Arms
    ctx.fillStyle = wc1;
    if(!isDiving){
      ctx.fillRect(o.x-4,  o.y+bob+10, 14, 6);
      ctx.fillRect(o.x-8,  o.y+bob+12,  6, 4);
      ctx.fillRect(o.x+34, o.y+bob+10, 14, 6);
      ctx.fillRect(o.x+46, o.y+bob+12,  6, 4);
    } else {
      ctx.fillRect(o.x+2,  o.y+bob+18, 10, 5);
      ctx.fillRect(o.x+32, o.y+bob+18, 10, 5);
    }
    ctx.restore();
  } else if (o.otype === "fallingBlock") {
    const by = o._blockY !== undefined ? o._blockY : -40;
    if (by <= -36) return;
    // Shadow on ground — fades in as block descends
    const shadowAlpha = Math.max(0, 0.4 * (by / (GROUND_Y - 24)));
    if (shadowAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = shadowAlpha;
      ctx.fillStyle = "#000000";
      ctx.fillRect(o.x+2, g-3, 40, 5);
      ctx.restore();
    }
    // Block body — heavy carved stone
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x,    by,    44, 24);
    // Top face highlight
    ctx.fillStyle = "#9a8a68";
    ctx.fillRect(o.x,    by,    44,  6);
    // Bottom shadow
    ctx.fillStyle = "#5a4a38";
    ctx.fillRect(o.x,    by+20, 44,  4);
    // Left face shadow
    ctx.fillStyle = "#5a4a38";
    ctx.fillRect(o.x,    by+6,   4, 14);
    // Right face highlight
    ctx.fillStyle = "#8a7a60";
    ctx.fillRect(o.x+40, by+6,   4, 14);
    // Carved hieroglyph markings on face
    ctx.fillStyle = "#4a3a28";
    ctx.fillRect(o.x+8,  by+8,  10,  3);
    ctx.fillRect(o.x+26, by+8,  10,  3);
    ctx.fillRect(o.x+16, by+14,  12,  3);
    ctx.fillRect(o.x+10, by+8,   3,  9);
    ctx.fillRect(o.x+31, by+8,   3,  9);
    // Corner chips — worn stone look
    ctx.fillStyle = "#6a5a40";
    ctx.fillRect(o.x+2,  by+2,   4,  4);
    ctx.fillRect(o.x+38, by+2,   4,  4);
    ctx.fillRect(o.x+2,  by+18,  4,  4);
    ctx.fillRect(o.x+38, by+18,  4,  4);
    // Dust puff when just landed
    if(o._blockLanded && (o._blockDustTimer||0) > 0){
      const dt2 = o._blockDustTimer / 18;
      ctx.save();
      ctx.globalAlpha = dt2 * 0.5;
      ctx.fillStyle = "#c4b890";
      ctx.fillRect(o.x-8,  g-10, 12, 8);
      ctx.fillRect(o.x+40, g-10, 12, 8);
      ctx.globalAlpha = dt2 * 0.3;
      ctx.fillRect(o.x-14, g-16, 10, 6);
      ctx.fillRect(o.x+44, g-16, 10, 6);
      ctx.restore();
    }
  } else if (o.otype === "cursedWall") {
    // Slow-drifting wall of purple curse energy — slows dino on contact
    const pulse = Math.sin(frame * 0.08) * 0.18 + 0.72;
    const swirl = (frame * 0.06) % (Math.PI * 2);
    ctx.save();
    ctx.globalAlpha = pulse * 0.82;
    ctx.fillStyle = "#6622aa";
    ctx.fillRect(o.x,    0, 10, g);
    ctx.globalAlpha = pulse * 0.60;
    ctx.fillStyle = "#9944dd";
    ctx.fillRect(o.x+8,  0, 10, g);
    ctx.globalAlpha = pulse * 0.38;
    ctx.fillStyle = "#bb66ff";
    ctx.fillRect(o.x+16, 0, 10, g);
    ctx.restore();
    // Orbiting curse runes
    const runeHeights = [g*0.15, g*0.35, g*0.58, g*0.78];
    for(let ri=0; ri<4; ri++){
      const ra = swirl + ri * (Math.PI * 0.5);
      const rx = o.x + 10 + Math.cos(ra) * 7;
      const ry = runeHeights[ri] + Math.sin(ra * 1.3) * 5;
      ctx.save();
      ctx.globalAlpha = 0.55 + Math.sin(ra * 2) * 0.3;
      ctx.fillStyle = ri % 2 === 0 ? "#ffaaff" : "#cc44ff";
      ctx.fillRect(rx-3, ry-1, 6, 2);
      ctx.fillRect(rx-1, ry-3, 2, 6);
      ctx.fillRect(rx-1, ry-1, 2, 2);
      ctx.restore();
    }
    // Wispy streaks
    for(let pi=0; pi<5; pi++){
      const py = (g * 0.1) + pi * (g * 0.18);
      const px = o.x + 2 + Math.sin(swirl + pi * 1.2) * 6;
      ctx.save();
      ctx.globalAlpha = 0.25 + Math.sin(swirl * 1.5 + pi) * 0.15;
      ctx.fillStyle = "#dd88ff";
      ctx.fillRect(px-8, py, 10, 2);
      ctx.fillRect(px-14, py+1, 6, 1);
      ctx.restore();
    }
    ctx.save();
    ctx.globalAlpha = pulse * 0.22;
    ctx.fillStyle = "#cc44ff";
    ctx.fillRect(o.x-4, 0, 6, g);
    ctx.restore();
  } else if (o.otype === "ankh") {
    // Floating golden ankh — orbits up/down, fires radial curse burst when close
    const bob = Math.sin(frame * 0.09) * 8;
    const spin = (frame * 0.04) % (Math.PI * 2);
    const ac1 = "#e8c840";
    const ac2 = "#ffee88";
    const ac3 = "#aa8810";
    const ax = o.x + 20, ay = o.y + bob;
    ctx.save();
    ctx.globalAlpha = 1;
    // Cross shaft (vertical)
    ctx.fillStyle = ac1;
    ctx.fillRect(ax-4,  ay-8,  8, 28);
    ctx.fillStyle = ac2;
    ctx.fillRect(ax-2,  ay-8,  3, 28);
    ctx.fillStyle = ac3;
    ctx.fillRect(ax+2,  ay-8,  2, 28);
    // Cross bar (horizontal)
    ctx.fillStyle = ac1;
    ctx.fillRect(ax-14, ay+2,  28,  8);
    ctx.fillStyle = ac2;
    ctx.fillRect(ax-14, ay+2,  28,  3);
    ctx.fillStyle = ac3;
    ctx.fillRect(ax-14, ay+7,  28,  2);
    // Loop top — teardrop shape
    ctx.fillStyle = ac1;
    ctx.fillRect(ax-6,  ay-20,  12, 14);
    ctx.fillRect(ax-4,  ay-24,   8,  6);
    ctx.fillRect(ax-2,  ay-26,   4,  4);
    // Loop hollow
    ctx.fillStyle = "#c8a820";
    ctx.fillRect(ax-3,  ay-19,   6,  8);
    ctx.fillRect(ax-2,  ay-21,   4,  4);
    // Highlight on loop
    ctx.fillStyle = ac2;
    ctx.fillRect(ax-5,  ay-22,   3,  6);
    // Orbiting sparkles
    for(let si=0; si<4; si++){
      const sa = spin + si * (Math.PI * 0.5);
      const sx = ax + Math.cos(sa) * 16;
      const sy = ay + Math.sin(sa) * 10;
      ctx.globalAlpha = 0.6 + Math.sin(sa * 2) * 0.3;
      ctx.fillStyle = ac2;
      ctx.fillRect(sx-2, sy-2, 4, 4);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(sx-1, sy-1, 2, 2);
    }
    ctx.globalAlpha = 1;
    // Curse beam bullets
    for(const b of (o.bullets||[])){
      ctx.fillStyle = "#ffdd44";
      ctx.fillRect(b.x-3, b.y-3, 6, 6);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(b.x-1, b.y-1, 2, 2);
    }
    ctx.restore();
  } else if (o.otype === "sandTrap") {
    // Launch pad — ancient stone catapult plate, launches dino into the air
    const armed = !(o._launched);
    const lp1 = "#8a7a50"; // stone plate
    const lp2 = "#a89868"; // highlight
    const lp3 = "#5a4a30"; // shadow
    const lp4 = armed ? "#ffcc00" : "#6a5a38"; // rune glow when armed
    // Base plate
    ctx.fillStyle = lp1;
    ctx.fillRect(o.x,    g-6,  60, 6);
    ctx.fillStyle = lp2;
    ctx.fillRect(o.x,    g-6,  60, 2); // top highlight
    ctx.fillStyle = lp3;
    ctx.fillRect(o.x,    g-2,  60, 2); // bottom shadow
    // Side bevels
    ctx.fillStyle = lp3;
    ctx.fillRect(o.x,    g-6,  4,  6);
    ctx.fillRect(o.x+56, g-6,  4,  6);
    // Center rune — upward arrow glyph, glows when armed
    ctx.fillStyle = lp4;
    ctx.fillRect(o.x+27, g-14, 6,  8); // arrow shaft
    ctx.fillRect(o.x+22, g-14, 16, 3); // arrow head base
    ctx.fillRect(o.x+24, g-17, 12, 3);
    ctx.fillRect(o.x+27, g-20, 6,  3); // arrow tip
    // Rune side marks
    ctx.fillRect(o.x+10, g-5,  8,  2);
    ctx.fillRect(o.x+42, g-5,  8,  2);
    ctx.fillRect(o.x+10, g-9,  4,  2);
    ctx.fillRect(o.x+46, g-9,  4,  2);
    // Armed glow pulse — rune only, no background
    if(armed){
      ctx.fillStyle = "#ffee44";
      ctx.fillRect(o.x+27, g-14, 6,  8);
      ctx.fillRect(o.x+22, g-14, 16, 3);
      ctx.fillRect(o.x+24, g-17, 12, 3);
      ctx.fillRect(o.x+27, g-20, 6,  3);
    }
  } else if (o.otype === "ruinsLaser") {
    // Violet laser beam — warning cue then fires
    const lx = o.x + 4;
    if((o._laserState||0) === 0){
      // Warning phase: pulsing thin beam from sky
      const warn = Math.sin(frame * 0.35) * 0.5 + 0.5;
      ctx.save();
      ctx.globalAlpha = 0.25 + warn * 0.35;
      ctx.fillStyle = "#cc44ff";
      ctx.fillRect(lx-1, 0, 2, GROUND_Y);
      // Warning diamond at ground level
      ctx.globalAlpha = 0.5 + warn * 0.4;
      ctx.fillStyle = "#ff88ff";
      ctx.fillRect(lx-4, GROUND_Y-8, 8, 4);
      ctx.fillRect(lx-2, GROUND_Y-12, 4, 4);
      ctx.fillRect(lx-2, GROUND_Y-4,  4, 4);
      ctx.restore();
    } else {
      // Fire phase: full bright beam
      const fade = Math.max(0, 1 - (o._laserFireTimer||0) / 18);
      ctx.save();
      // Outer glow
      ctx.globalAlpha = fade * 0.28;
      ctx.fillStyle = "#cc44ff";
      ctx.fillRect(lx-6, 0, 12, GROUND_Y);
      // Mid beam
      ctx.globalAlpha = fade * 0.70;
      ctx.fillStyle = "#dd66ff";
      ctx.fillRect(lx-3, 0, 6, GROUND_Y);
      // Core
      ctx.globalAlpha = fade;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(lx-1, 0, 2, GROUND_Y);
      // Impact flash at ground
      ctx.globalAlpha = fade * 0.8;
      ctx.fillStyle = "#ff88ff";
      ctx.fillRect(lx-10, GROUND_Y-6, 20, 6);
      ctx.restore();
    }
  } else if (o.otype === "golem") {
    const stomp = Math.floor(frame/20)%2;
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x+6, g-58,30,58);
    ctx.fillRect(o.x+8, g-68,26,14);
    ctx.fillStyle = "#5a4a38";
    ctx.fillRect(o.x+12,g-64,6,6);
    ctx.fillRect(o.x+24,g-64,6,6);
    ctx.fillRect(o.x+14,g-56,14,4);
    ctx.fillStyle = "#88aaff";
    ctx.fillRect(o.x+13,g-63,4,4); ctx.fillRect(o.x+25,g-63,4,4);
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(o.x-2,g-52,10,24);
    if(stomp===0){
      ctx.fillRect(o.x+34,g-58,10,20);
    } else {
      ctx.fillRect(o.x+34,g-46,10,20);
    }
    ctx.fillStyle = "#6a5a40";
    ctx.fillRect(o.x-4,g-30,12,10); ctx.fillRect(o.x+34,stomp===0?g-40:g-28,12,10);
    ctx.fillRect(o.x+8,g-50,26,3); ctx.fillRect(o.x+8,g-38,26,3);
    ctx.fillStyle = "#8a7a60";
    for(const b of (o.bullets||[])) {
      ctx.fillRect(b.x,b.y,10,8);
      ctx.fillStyle = "#6a5a40"; ctx.fillRect(b.x+2,b.y+2,4,3); ctx.fillStyle = "#8a7a60";
    }
  } else {
    const h = 32;
    ctx.fillStyle = "#7a6a50"; ctx.fillRect(o.x+4,g-h,32,h);
    ctx.fillStyle = "#8a7a60"; ctx.fillRect(o.x+2,g-h,36,6);
  }
}

// ── Spawn ─────────────────────────────────────────────────────────────────────
export function spawnRuinsObstacle(r, tier) {
  let otype, type = 0, oy = 0, bullets = [];

  // Tier 0 (~0-180m): pillar + cactus + bird + scarab already
  if (tier === 0) {
    if      (r < 0.38) { otype="cactus"; }
    else if (r < 0.55) { otype="pillar"; type=0; }
    else if (r < 0.70) { otype="scarab"; }
    else if (r < 0.82) { otype="sandTrap"; }
    else               { otype="bird"; oy=GROUND_Y-88-Math.random()*48; }
    return { otype, type, oy, bullets };
  }

  // Tier 1 (~180-360m): + boulder, spiketrap, wraith, fallingBlock
  if (tier === 1) {
    if      (r < 0.12) { otype="cactus"; }
    else if (r < 0.22) { otype="bird"; oy=GROUND_Y-88-Math.random()*48; }
    else if (r < 0.33) { otype="pillar"; type=Math.floor(Math.random()*2); }
    else if (r < 0.43) { otype="boulder"; }
    else if (r < 0.53) { otype="scarab"; }
    else if (r < 0.62) { otype="sandTrap"; }
    else if (r < 0.72) { otype="spiketrap"; }
    else if (r < 0.82) { otype="wraith"; oy=GROUND_Y-96-Math.random()*36; }
    else if (r < 0.92) { otype="fallingBlock"; }
    else               { otype="pillar"; type=0; }
    return { otype, type, oy, bullets };
  }

  // Tier 2+ (~360m+): full roster
  if      (r < 0.10) { otype="cactus"; type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1)); }
  else if (r < 0.18) { otype="bird"; oy=GROUND_Y-88-Math.random()*48;
                       if(Math.random()<0.35) oy=GROUND_Y-62;
                       if(Math.random()<0.30) oy=GROUND_Y-36; }
  else if (r < 0.27) { otype="pillar"; type=Math.floor(Math.random()*3); }
  else if (r < 0.34) { otype="boulder"; }
  else if (r < 0.41) { otype="scarab"; }
  else if (r < 0.48) { otype="sandTrap"; }
  else if (r < 0.55) { otype="spiketrap"; }
  else if (r < 0.62) { otype="wraith"; oy=GROUND_Y-96-Math.random()*36; }
  else if (r < 0.68) { otype="fallingBlock"; }
  else if (r < 0.74) { otype="ankh"; oy=GROUND_Y-80-Math.random()*40; bullets=[]; }
  else if (r < 0.80) { otype="ruinsLaser"; }
  else if (r < 0.87) { otype="statue"; bullets=[]; }
  else if (r < 0.93 && tier>=3) { otype="golem"; bullets=[]; }
  else if (r < 0.98 && tier>=3) { otype="cursedWall"; }
  else               { otype="pillar"; type=0; }
  return { otype, type, oy, bullets };
}
