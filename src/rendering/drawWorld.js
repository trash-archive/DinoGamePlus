import { CANVAS_W, CANVAS_H, GROUND_Y } from "../constants";
import { SCENERIES } from "../data/collectionData.jsx";

// ─── STARS ────────────────────────────────────────────────────────────────────
export function drawStars(ctx, stars, blend) {
  for(const s of stars){
    ctx.fillStyle=`rgba(255,255,255,${s.bright*blend})`;
    ctx.fillRect(s.x,s.y,s.size,s.size);
  }
}

// ─── SUN ──────────────────────────────────────────────────────────────────────
export function drawPixelSun(ctx, x, y, alpha) {
  if(alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  const S = 14;
  ctx.fillStyle = "#f5c842";
  ctx.fillRect(x-S+3, y-S+3, (S-3)*2, (S-3)*2);
  ctx.fillRect(x-3, y-S-6, 6, 6);
  ctx.fillRect(x-3, y+S+1, 6, 6);
  ctx.fillRect(x-S-6, y-3, 6, 6);
  ctx.fillRect(x+S+1, y-3, 6, 6);
  ctx.fillStyle = "#e8b830";
  ctx.fillRect(x+S-2, y-S-3, 4, 4);
  ctx.fillRect(x-S-2, y-S-3, 4, 4);
  ctx.fillRect(x+S-2, y+S,   4, 4);
  ctx.fillRect(x-S-2, y+S,   4, 4);
  ctx.fillStyle = "#fff8cc";
  ctx.fillRect(x-4, y-6, 5, 5);
  ctx.globalAlpha = 1; ctx.restore();
}

// ─── MOON ─────────────────────────────────────────────────────────────────────
export function drawPixelMoon(ctx, x, y, alpha) {
  if(alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  const pixels = [[-4,-12],[0,-12],[4,-12],[-8,-8],[-4,-8],[0,-8],[4,-8],[-12,-4],[-8,-4],[-4,-4],[0,-4],[-12,0],[-8,0],[-4,0],[-12,4],[-8,4],[-4,4],[0,4],[-8,8],[-4,8],[0,8],[-4,12],[0,12]];
  ctx.fillStyle = "#e8e0aa";
  for(const [px,py] of pixels) ctx.fillRect(x+px, y+py, 4, 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x+18, y-8, 2, 2); ctx.fillRect(x+24, y+4, 2, 2); ctx.fillRect(x+14, y+14, 2, 2);
  ctx.globalAlpha = 1; ctx.restore();
}

// ─── CLOUDS ───────────────────────────────────────────────────────────────────
export function drawClouds(ctx, clouds, scenery) {
  const s = scenery || SCENERIES[0];
  for(const c of clouds){
    if(s.id==="cave"){
      // Stalactite formations hanging from ceiling
      const h = c.h || 20;
      const pulse = Math.sin(c.x * 0.07 + c.y * 0.03) * 0.5 + 0.5;
      // Main stalactite body — two-tone layered
      ctx.fillStyle = "#2a1a4a";
      ctx.fillRect(c.x + 1, 0, 6, h);
      ctx.fillStyle = "#4a2a7a";
      ctx.fillRect(c.x + 2, 0, 4, h);
      ctx.fillStyle = "#7733cc";
      ctx.fillRect(c.x + 3, 0, 2, Math.floor(h * 0.55));
      // Drip tip — pointed crystal end
      ctx.fillStyle = "#5522aa";
      ctx.fillRect(c.x + 1, h,     6, 4);
      ctx.fillRect(c.x + 2, h + 4, 4, 4);
      ctx.fillRect(c.x + 3, h + 8, 2, 4);
      // Crystal tip glow dot
      ctx.fillStyle = pulse > 0.6 ? "#cc88ff" : "#9944dd";
      ctx.fillRect(c.x + 3, h + 10, 2, 2);
      // Side micro-crystals
      ctx.fillStyle = "#6622bb";
      ctx.fillRect(c.x - 1, Math.floor(h * 0.3), 3, 6);
      ctx.fillRect(c.x + 6, Math.floor(h * 0.45), 3, 5);
      ctx.fillStyle = "#9944dd";
      ctx.fillRect(c.x,     Math.floor(h * 0.3), 2, 3);
      ctx.fillRect(c.x + 6, Math.floor(h * 0.45), 2, 2);
    } else if(s.id==="classic") {
      ctx.fillStyle="#dddddd";
      ctx.fillRect(c.x+10,c.y+8,38,9);ctx.fillRect(c.x+4,c.y+3,18,14);
      ctx.fillRect(c.x+20,c.y,22,18); ctx.fillRect(c.x+42,c.y+5,16,12);
    } else if(s.id==="desert") {
      // Heat haze wisps — flat, wide, semi-transparent streaks
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = s.cloudColor;
      ctx.fillRect(c.x,     c.y+6,  64, 4);
      ctx.fillRect(c.x+8,   c.y+2,  48, 4);
      ctx.fillRect(c.x+18,  c.y,    28, 3);
      ctx.fillRect(c.x-10,  c.y+8,  18, 2);
      ctx.fillRect(c.x+58,  c.y+8,  16, 2);
      ctx.globalAlpha = 0.14;
      ctx.fillRect(c.x+4,   c.y+4,  6,  2);
      ctx.fillRect(c.x+22,  c.y+1,  4,  2);
      ctx.fillRect(c.x+44,  c.y+4,  5,  2);
      ctx.fillRect(c.x+60,  c.y+6,  4,  2);
      ctx.restore();
    } else if(s.id==="arctic") {
      // Blizzard streaks — slightly lighter than the dark sky
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = s.cloudColor;
      ctx.fillRect(c.x,     c.y+4,  80, 5);
      ctx.fillRect(c.x+6,   c.y,    60, 4);
      ctx.fillRect(c.x+16,  c.y-3,  40, 3);
      ctx.fillRect(c.x-14,  c.y+6,  22, 3);
      ctx.fillRect(c.x+72,  c.y+6,  18, 2);
      ctx.fillRect(c.x+86,  c.y+8,  12, 2);
      ctx.globalAlpha = 0.15;
      ctx.fillRect(c.x+2,   c.y+2,  4,  2);
      ctx.fillRect(c.x+24,  c.y-1,  3,  2);
      ctx.fillRect(c.x+50,  c.y+2,  4,  2);
      ctx.fillRect(c.x+68,  c.y+5,  3,  2);
      ctx.restore();
    } else if(s.id==="volcano") {
      // Ash plume clouds — dark billowing masses with ember glow edges
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = s.cloudColor; // dark ash grey
      ctx.fillRect(c.x+8,  c.y+10, 44, 12);
      ctx.fillRect(c.x+2,  c.y+6,  24, 16);
      ctx.fillRect(c.x+22, c.y+2,  28, 18);
      ctx.fillRect(c.x+46, c.y+8,  18, 12);
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#ff4400"; // ember glow on underside
      ctx.fillRect(c.x+6,  c.y+18, 48, 4);
      ctx.fillRect(c.x+14, c.y+20, 32, 2);
      ctx.restore();
    } else if(s.id==="jungle") {
      // Low canopy mist — thin layered wisps, semi-transparent
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = "#aaddbb";
      ctx.fillRect(c.x,      c.y+8,  80, 6);
      ctx.fillRect(c.x+10,   c.y+4,  60, 5);
      ctx.fillRect(c.x+24,   c.y,    40, 4);
      ctx.fillRect(c.x-12,   c.y+10, 24, 4);
      ctx.fillRect(c.x+72,   c.y+10, 20, 3);
      ctx.globalAlpha = 0.10;
      ctx.fillRect(c.x+4,    c.y+6,  8,  3);
      ctx.fillRect(c.x+36,   c.y+2,  6,  2);
      ctx.fillRect(c.x+60,   c.y+6,  7,  2);
      ctx.restore();
    } else if(s.id==="ruins") {
      // Drifting dust wisps mixed with faint ghostly mist tendrils
      const swirl = Math.sin(c.x * 0.02 + c.y * 0.01) * 6;
      ctx.save();
      // Dust wisps — warm sandy tone
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#c4b070";
      ctx.fillRect(c.x,      c.y+6,  72, 4);
      ctx.fillRect(c.x+10,   c.y+2,  52, 3);
      ctx.fillRect(c.x+28,   c.y-1,  32, 3);
      ctx.fillRect(c.x-8,    c.y+8,  20, 2);
      ctx.fillRect(c.x+64,   c.y+8,  18, 2);
      // Ghost mist tendrils — faint purple
      ctx.globalAlpha = 0.10;
      ctx.fillStyle = "#aa88cc";
      ctx.fillRect(c.x+swirl,    c.y+4,  14, 3);
      ctx.fillRect(c.x+swirl+22, c.y+1,  10, 2);
      ctx.fillRect(c.x+swirl+44, c.y+5,  12, 2);
      ctx.fillRect(c.x+swirl+62, c.y+3,   8, 2);
      // Dust particle dots
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = "#d4c080";
      ctx.fillRect(c.x+6,    c.y+4,  4, 2);
      ctx.fillRect(c.x+34,   c.y,    3, 2);
      ctx.fillRect(c.x+56,   c.y+4,  4, 2);
      ctx.restore();
    } else {
      ctx.fillStyle=s.cloudColor;
      ctx.fillRect(c.x+10,c.y+8,38,9);ctx.fillRect(c.x+4,c.y+3,18,14);
      ctx.fillRect(c.x+20,c.y,22,18); ctx.fillRect(c.x+42,c.y+5,16,12);
    }
  }
}

// ─── GROUND ───────────────────────────────────────────────────────────────────
export function drawGround(ctx, offset, scenery, nightBlend) {
  const s = scenery || SCENERIES[0];
  if(s.id === "classic") {
    const groundCol = nightBlend > 0.5 ? "#aaaaaa" : "#222222";
    const gravelCol = nightBlend > 0.5 ? "#555566" : "#bbbbbb";
    ctx.fillStyle = groundCol; ctx.fillRect(0, GROUND_Y+2, CANVAS_W, 3);
    ctx.fillStyle = gravelCol;
    const GRAV_STRIDE = 76, GRAV_COUNT = 22, GRAV_PERIOD = GRAV_STRIDE * GRAV_COUNT;
    const gOff = offset % GRAV_PERIOD;
    for(let i=0;i<GRAV_COUNT;i++){
      const rx = ((i*GRAV_STRIDE - gOff) % GRAV_PERIOD + GRAV_PERIOD) % GRAV_PERIOD;
      if(rx > CANVAS_W) continue;
      ctx.fillRect(rx, GROUND_Y+7, 18+(i%3)*7, 2);
      ctx.fillRect(rx+4, GROUND_Y+11, 9, 2);
    }
    return;
  }
  if(s.id === "plains") {
    // Grass top strip
    const grassCol  = nightBlend > 0.5 ? "#2a5a18" : "#3a8a20";
    const grassHi   = nightBlend > 0.5 ? "#3a7a28" : "#55aa38";
    const soilCol   = nightBlend > 0.5 ? "#2a1a08" : "#5a3a18";
    const soilDark  = nightBlend > 0.5 ? "#1a0e04" : "#3a2010";
    ctx.fillStyle = grassCol; ctx.fillRect(0, GROUND_Y, CANVAS_W, 5);
    ctx.fillStyle = grassHi;  ctx.fillRect(0, GROUND_Y, CANVAS_W, 2);
    ctx.fillStyle = soilCol;  ctx.fillRect(0, GROUND_Y+5, CANVAS_W, CANVAS_H-GROUND_Y-5);
    // Soil texture streaks
    ctx.fillStyle = soilDark;
    const SOIL_STRIDE = 88, SOIL_COUNT = 18, SOIL_PERIOD = SOIL_STRIDE * SOIL_COUNT;
    const soilOff = offset % SOIL_PERIOD;
    for(let i=0;i<SOIL_COUNT;i++){
      const rx = ((i*SOIL_STRIDE - soilOff) % SOIL_PERIOD + SOIL_PERIOD) % SOIL_PERIOD;
      if(rx > CANVAS_W) continue;
      ctx.fillRect(rx, GROUND_Y+8,  22+(i%3)*8, 2);
      ctx.fillRect(rx+6, GROUND_Y+13, 12, 2);
    }
    // Embedded stones and fossil fragments — scroll with the ground
    const stoneCol  = nightBlend > 0.5 ? "#3a3a32" : "#7a7060";
    const stoneHi   = nightBlend > 0.5 ? "#4a4a40" : "#9a9080";
    const fossilCol = nightBlend > 0.5 ? "#5a4a28" : "#aa8840";
    // Stones
    const STONE_STRIDE = 113, STONE_COUNT = 14, STONE_PERIOD = STONE_STRIDE * STONE_COUNT;
    const stoneOff = offset % STONE_PERIOD;
    for(let i=0;i<STONE_COUNT;i++){
      const rx = ((i*STONE_STRIDE - stoneOff) % STONE_PERIOD + STONE_PERIOD) % STONE_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 10 + (i%4)*8;
      const sw = 8+(i%3)*5;
      ctx.fillStyle = stoneCol; ctx.fillRect(rx,ry,sw,sw*0.6|0);
      ctx.fillStyle = stoneHi;  ctx.fillRect(rx+1,ry,sw-2,2);
    }
    // Small pebbles
    const PEB_STRIDE = 67, PEB_COUNT = 20, PEB_PERIOD = PEB_STRIDE * PEB_COUNT;
    const pebOff = offset % PEB_PERIOD;
    for(let i=0;i<PEB_COUNT;i++){
      const rx = ((i*PEB_STRIDE - pebOff) % PEB_PERIOD + PEB_PERIOD) % PEB_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 7 + (i%5)*6;
      ctx.fillStyle = stoneCol; ctx.fillRect(rx,ry,4,3);
    }
    // Fossil fragments
    const FOSS_STRIDE = 157, FOSS_COUNT = 8, FOSS_PERIOD = FOSS_STRIDE * FOSS_COUNT;
    const fossOff = offset % FOSS_PERIOD;
    for(let i=0;i<FOSS_COUNT;i++){
      const rx = ((i*FOSS_STRIDE - fossOff) % FOSS_PERIOD + FOSS_PERIOD) % FOSS_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 12 + (i%3)*9;
      ctx.fillStyle = fossilCol;
      ctx.fillRect(rx,ry,8,2);
      ctx.fillRect(rx,ry-2,3,2); ctx.fillRect(rx+5,ry-2,3,2);
    }
    // Grass tufts along the top edge — pseudo-random spacing, no wrap duplication
    ctx.fillStyle = grassCol;
    const TUFT_PERIOD = CANVAS_W + 60;
    for(let i=0;i<22;i++){
      // Seeded spacing: base every ~52px with ±18px jitter per slot
      const seed = i * 1.618;
      const jitter = ((seed % 1) * 36) | 0;
      const base = i * 52 + jitter;
      const rx = ((base - offset % TUFT_PERIOD) + TUFT_PERIOD * 2) % TUFT_PERIOD;
      if(rx > CANVAS_W) continue;
      ctx.fillRect(rx,   GROUND_Y-4, 2, 4);
      ctx.fillRect(rx+4, GROUND_Y-4, 2, 4);
      ctx.fillRect(rx+8, GROUND_Y-4, 2, 4);
    }
    return;
  }
  if(s.id === "desert") {
    const sandTop  = nightBlend > 0.5 ? "#a06828" : "#e0a850";
    const sandBase = nightBlend > 0.5 ? "#7a4a18" : "#c4883a";
    const sandDark = nightBlend > 0.5 ? "#5a3410" : "#a86c28";
    const rippleCol= nightBlend > 0.5 ? "#8a5820" : "#d4a050";
    const pebbleCol= nightBlend > 0.5 ? "#4a2e0e" : "#8a5a22";
    const pebbleHi = nightBlend > 0.5 ? "#6a4218" : "#b07a3a";
    ctx.fillStyle = sandTop;  ctx.fillRect(0, GROUND_Y,   CANVAS_W, 4);
    ctx.fillStyle = sandBase; ctx.fillRect(0, GROUND_Y+4, CANVAS_W, CANVAS_H-GROUND_Y-4);
    const RIP_STRIDE = 58, RIP_COUNT = 24, RIP_PERIOD = RIP_STRIDE * RIP_COUNT;
    const ripOff = offset % RIP_PERIOD;
    for(let i=0;i<RIP_COUNT;i++){
      const rx = ((i*RIP_STRIDE - ripOff) % RIP_PERIOD + RIP_PERIOD) % RIP_PERIOD;
      if(rx > CANVAS_W) continue;
      const depth = i % 4;
      const ry = GROUND_Y + 6 + depth * 7;
      const rw = 12 + (i%3)*10;
      ctx.fillStyle = rippleCol;
      ctx.fillRect(rx, ry, rw, 1);
      ctx.fillRect(rx+4, ry+2, rw-6, 1);
    }
    const SHA_STRIDE = 94, SHA_COUNT = 14, SHA_PERIOD = SHA_STRIDE * SHA_COUNT;
    const shaOff = offset % SHA_PERIOD;
    for(let i=0;i<SHA_COUNT;i++){
      const rx = ((i*SHA_STRIDE - shaOff) % SHA_PERIOD + SHA_PERIOD) % SHA_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 9 + (i%3)*8;
      ctx.fillStyle = sandDark;
      ctx.fillRect(rx, ry, 20+(i%4)*8, 2);
    }
    const PEB_STRIDE = 103, PEB_COUNT = 16, PEB_PERIOD = PEB_STRIDE * PEB_COUNT;
    const pebOff = offset % PEB_PERIOD;
    for(let i=0;i<PEB_COUNT;i++){
      const rx = ((i*PEB_STRIDE - pebOff) % PEB_PERIOD + PEB_PERIOD) % PEB_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 8 + (i%5)*6;
      const pw = 4+(i%3)*3;
      ctx.fillStyle = pebbleCol; ctx.fillRect(rx, ry, pw, pw*0.6|0);
      ctx.fillStyle = pebbleHi;  ctx.fillRect(rx+1, ry, pw-2, 1);
    }
    return;
  }
  if(s.id === "arctic") {
    const snowTop  = nightBlend > 0.5 ? "#8ab8d8" : "#c8e8ff";
    const snowBase = nightBlend > 0.5 ? "#3a5a70" : "#6a9ab8";
    const iceVein  = nightBlend > 0.5 ? "#2a4055" : "#4a7a9a";
    const icePatch = nightBlend > 0.5 ? "#5a8aaa" : "#a8d0e8";
    const snowDrift= nightBlend > 0.5 ? "#6a9ab8" : "#b8daf0";
    // Base snow surface
    ctx.fillStyle = snowTop;  ctx.fillRect(0, GROUND_Y,   CANVAS_W, 5);
    ctx.fillStyle = snowBase; ctx.fillRect(0, GROUND_Y+5, CANVAS_W, CANVAS_H-GROUND_Y-5);
    // Frost crack lines — thin jagged horizontal veins
    const CRACK_STRIDE = 72, CRACK_COUNT = 20, CRACK_PERIOD = CRACK_STRIDE * CRACK_COUNT;
    const crackOff = offset % CRACK_PERIOD;
    for(let i=0;i<CRACK_COUNT;i++){
      const rx = ((i*CRACK_STRIDE - crackOff) % CRACK_PERIOD + CRACK_PERIOD) % CRACK_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 7 + (i%4)*7;
      const rw = 14 + (i%3)*12;
      ctx.fillStyle = iceVein;
      ctx.fillRect(rx,    ry,   rw,   1);
      ctx.fillRect(rx+3,  ry+2, rw-6, 1);
      ctx.fillRect(rx+rw-4, ry+1, 4, 1); // jagged end
    }
    // Ice patch highlights — bright reflective spots
    const PATCH_STRIDE = 119, PATCH_COUNT = 12, PATCH_PERIOD = PATCH_STRIDE * PATCH_COUNT;
    const patchOff = offset % PATCH_PERIOD;
    for(let i=0;i<PATCH_COUNT;i++){
      const rx = ((i*PATCH_STRIDE - patchOff) % PATCH_PERIOD + PATCH_PERIOD) % PATCH_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 6 + (i%3)*9;
      const pw = 6+(i%3)*5;
      ctx.fillStyle = icePatch; ctx.fillRect(rx, ry, pw, 3);
      ctx.fillStyle = snowTop;  ctx.fillRect(rx+1, ry, pw-2, 1); // bright top edge
    }
    // Small snow drift bumps along the surface edge
    const DRIFT_STRIDE = 88, DRIFT_COUNT = 16, DRIFT_PERIOD = DRIFT_STRIDE * DRIFT_COUNT;
    const driftOff = offset % DRIFT_PERIOD;
    for(let i=0;i<DRIFT_COUNT;i++){
      const rx = ((i*DRIFT_STRIDE - driftOff) % DRIFT_PERIOD + DRIFT_PERIOD) % DRIFT_PERIOD;
      if(rx > CANVAS_W) continue;
      const dw = 10 + (i%4)*6;
      ctx.fillStyle = snowDrift;
      ctx.fillRect(rx,      GROUND_Y-2, dw,   3);
      ctx.fillRect(rx+2,    GROUND_Y-4, dw-4, 2);
      ctx.fillRect(rx+4,    GROUND_Y-5, dw-8, 1);
    }
    return;
  }
  if(s.id === "volcano") {
    const baseTop  = nightBlend > 0.5 ? "#5a2008" : "#8a3010";
    const baseMid  = nightBlend > 0.5 ? "#3a1408" : "#6a2208";
    const rockCol  = nightBlend > 0.5 ? "#2a1008" : "#3a1a08";
    const crackGlow= nightBlend > 0.5 ? "#dd3300" : "#ff6600";
    const crackHot = nightBlend > 0.5 ? "#ff5500" : "#ffaa00";
    const ashCol   = nightBlend > 0.5 ? "#2a1808" : "#4a2a10";
    // Base rock surface
    ctx.fillStyle = baseTop;  ctx.fillRect(0, GROUND_Y,   CANVAS_W, 5);
    ctx.fillStyle = baseMid;  ctx.fillRect(0, GROUND_Y+5, CANVAS_W, CANVAS_H-GROUND_Y-5);
    // Glowing lava crack veins
    const CRACK_STRIDE = 68, CRACK_COUNT = 22, CRACK_PERIOD = CRACK_STRIDE * CRACK_COUNT;
    const crackOff = offset % CRACK_PERIOD;
    for(let i=0;i<CRACK_COUNT;i++){
      const rx = ((i*CRACK_STRIDE - crackOff) % CRACK_PERIOD + CRACK_PERIOD) % CRACK_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 6 + (i%4)*7;
      const rw = 10 + (i%3)*14;
      ctx.fillStyle = crackGlow;
      ctx.fillRect(rx,   ry,   rw,   2);
      ctx.fillRect(rx+3, ry+3, rw-6, 1);
      ctx.fillStyle = crackHot;
      ctx.fillRect(rx+2, ry,   rw-4, 1);
    }
    // Dark rock chunks embedded in the surface
    const ROCK_STRIDE = 107, ROCK_COUNT = 14, ROCK_PERIOD = ROCK_STRIDE * ROCK_COUNT;
    const rockOff = offset % ROCK_PERIOD;
    for(let i=0;i<ROCK_COUNT;i++){
      const rx = ((i*ROCK_STRIDE - rockOff) % ROCK_PERIOD + ROCK_PERIOD) % ROCK_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 8 + (i%4)*7;
      const rw = 8+(i%3)*6;
      ctx.fillStyle = rockCol; ctx.fillRect(rx, ry, rw, rw*0.5|0);
      ctx.fillStyle = ashCol;  ctx.fillRect(rx+1, ry+1, rw-2, 2);
    }
    // Ash dust streaks
    const ASH_STRIDE = 83, ASH_COUNT = 18, ASH_PERIOD = ASH_STRIDE * ASH_COUNT;
    const ashOff = offset % ASH_PERIOD;
    for(let i=0;i<ASH_COUNT;i++){
      const rx = ((i*ASH_STRIDE - ashOff) % ASH_PERIOD + ASH_PERIOD) % ASH_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 10 + (i%3)*9;
      ctx.fillStyle = ashCol;
      ctx.fillRect(rx, ry, 18+(i%4)*8, 1);
    }
    return;
  }
  if(s.id === "jungle") {
    // Base colours stay true to the original palette
    const groundTop  = nightBlend > 0.5 ? "#1a3a10" : "#2a5a18";
    const groundBase = nightBlend > 0.5 ? "#0e2208" : "#1a3a10";
    // Subtle darker shade for texture details
    const rootCol  = nightBlend > 0.5 ? "#0e2a0a" : "#1e4a12";
    const rootHi   = nightBlend > 0.5 ? "#2a5a18" : "#3a7a22";
    const leafCol  = nightBlend > 0.5 ? "#122e0c" : "#224a14";
    const puddleCol= nightBlend > 0.5 ? "#122a18" : "#1e4228";
    const puddleHi = nightBlend > 0.5 ? "#1a3a22" : "#2a5a38";
    ctx.fillStyle = groundTop;  ctx.fillRect(0, GROUND_Y,   CANVAS_W, 5);
    ctx.fillStyle = groundBase; ctx.fillRect(0, GROUND_Y+5, CANVAS_W, CANVAS_H-GROUND_Y-5);
    // Root veins — subtle, close to base colour
    const ROOT_STRIDE = 94, ROOT_COUNT = 16, ROOT_PERIOD = ROOT_STRIDE * ROOT_COUNT;
    const rootOff = offset % ROOT_PERIOD;
    for(let i=0;i<ROOT_COUNT;i++){
      const rx = ((i*ROOT_STRIDE - rootOff) % ROOT_PERIOD + ROOT_PERIOD) % ROOT_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 7 + (i%4)*7;
      const rw = 18 + (i%3)*14;
      ctx.fillStyle = rootCol;
      ctx.fillRect(rx,   ry,   rw, 2);
      ctx.fillRect(rx+4, ry+3, rw-8, 1);
      ctx.fillStyle = rootHi;
      ctx.fillRect(rx+1, ry,   rw-4, 1);
    }
    // Leaf litter
    const LEAF_STRIDE = 71, LEAF_COUNT = 20, LEAF_PERIOD = LEAF_STRIDE * LEAF_COUNT;
    const leafOff = offset % LEAF_PERIOD;
    for(let i=0;i<LEAF_COUNT;i++){
      const rx = ((i*LEAF_STRIDE - leafOff) % LEAF_PERIOD + LEAF_PERIOD) % LEAF_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 6 + (i%5)*5;
      ctx.fillStyle = leafCol;
      ctx.fillRect(rx,   ry,   6, 3);
      ctx.fillRect(rx+2, ry-2, 2, 2);
    }
    // Puddles
    const PUD_STRIDE = 137, PUD_COUNT = 10, PUD_PERIOD = PUD_STRIDE * PUD_COUNT;
    const pudOff = offset % PUD_PERIOD;
    for(let i=0;i<PUD_COUNT;i++){
      const rx = ((i*PUD_STRIDE - pudOff) % PUD_PERIOD + PUD_PERIOD) % PUD_PERIOD;
      if(rx > CANVAS_W) continue;
      const pw = 10 + (i%3)*8;
      ctx.fillStyle = puddleCol; ctx.fillRect(rx, GROUND_Y+2, pw, 3);
      ctx.fillStyle = puddleHi;  ctx.fillRect(rx+2, GROUND_Y+2, pw-4, 1);
    }
    return;
  }
  if(s.id === "cave") {
    const baseTop  = "#1e0e38";
    const baseMid  = "#150a28";
    const veinGlow = "#7722cc";
    const veinBright = "#aa44ff";
    const shardCol = "#4a2a7a";
    const shardHi  = "#7744bb";
    const mineralCol = "#331166";
    const mineralHi  = "#6633aa";
    const tealVein   = "#226688";
    const tealBright = "#44aacc";
    // Base cave floor
    ctx.fillStyle = baseTop;  ctx.fillRect(0, GROUND_Y,   CANVAS_W, 5);
    ctx.fillStyle = baseMid;  ctx.fillRect(0, GROUND_Y+5, CANVAS_W, CANVAS_H-GROUND_Y-5);
    // Glowing crystal vein cracks — purple
    const VEIN_STRIDE = 62, VEIN_COUNT = 24, VEIN_PERIOD = VEIN_STRIDE * VEIN_COUNT;
    const veinOff = offset % VEIN_PERIOD;
    for(let i=0;i<VEIN_COUNT;i++){
      const rx = ((i*VEIN_STRIDE - veinOff) % VEIN_PERIOD + VEIN_PERIOD) % VEIN_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 6 + (i%4)*7;
      const rw = 10 + (i%3)*14;
      ctx.fillStyle = veinGlow;
      ctx.fillRect(rx,   ry,   rw, 2);
      ctx.fillRect(rx+4, ry+3, rw-8, 1);
      ctx.fillStyle = veinBright;
      ctx.fillRect(rx+2, ry,   rw-4, 1);
      // Short vertical branch crack
      if(i%4===0) { ctx.fillStyle = veinGlow; ctx.fillRect(rx+rw/2|0, ry, 1, 5); }
    }
    // Teal/cyan accent veins — scattered between purple ones
    const TEAL_STRIDE = 97, TEAL_COUNT = 14, TEAL_PERIOD = TEAL_STRIDE * TEAL_COUNT;
    const tealOff = offset % TEAL_PERIOD;
    for(let i=0;i<TEAL_COUNT;i++){
      const rx = ((i*TEAL_STRIDE - tealOff) % TEAL_PERIOD + TEAL_PERIOD) % TEAL_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 9 + (i%3)*9;
      const rw = 8 + (i%3)*10;
      ctx.fillStyle = tealVein;
      ctx.fillRect(rx,   ry,   rw, 1);
      ctx.fillStyle = tealBright;
      ctx.fillRect(rx+2, ry,   rw-4, 1);
    }
    // Embedded crystal shards poking up from the surface edge
    const SHARD_STRIDE = 83, SHARD_COUNT = 18, SHARD_PERIOD = SHARD_STRIDE * SHARD_COUNT;
    const shardOff = offset % SHARD_PERIOD;
    for(let i=0;i<SHARD_COUNT;i++){
      const rx = ((i*SHARD_STRIDE - shardOff) % SHARD_PERIOD + SHARD_PERIOD) % SHARD_PERIOD;
      if(rx > CANVAS_W) continue;
      const sh = 4 + (i%3)*3;
      ctx.fillStyle = shardCol;
      ctx.fillRect(rx,   GROUND_Y-sh, 4, sh);
      ctx.fillRect(rx+5, GROUND_Y-(sh-2), 3, sh-2);
      ctx.fillStyle = shardHi;
      ctx.fillRect(rx+1, GROUND_Y-sh, 2, 2);
      ctx.fillRect(rx+5, GROUND_Y-(sh-2), 1, 2);
    }
    // Small glowing mineral deposits in the floor
    const MIN_STRIDE = 113, MIN_COUNT = 14, MIN_PERIOD = MIN_STRIDE * MIN_COUNT;
    const minOff = offset % MIN_PERIOD;
    for(let i=0;i<MIN_COUNT;i++){
      const rx = ((i*MIN_STRIDE - minOff) % MIN_PERIOD + MIN_PERIOD) % MIN_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 8 + (i%4)*7;
      const mw = 5 + (i%3)*4;
      ctx.fillStyle = mineralCol; ctx.fillRect(rx, ry, mw, mw*0.5|0);
      ctx.fillStyle = mineralHi;  ctx.fillRect(rx+1, ry, mw-2, 1);
      // Teal mineral variant every 3rd
      if(i%3===2){
        ctx.fillStyle = tealVein;   ctx.fillRect(rx+mw+3, ry+2, mw-2, (mw*0.5|0)-1);
        ctx.fillStyle = tealBright; ctx.fillRect(rx+mw+4, ry+2, mw-4, 1);
      }
    }
    return;
  }
  if(s.id === "ruins") {
    const stoneTop  = nightBlend > 0.5 ? "#5a5040" : "#8a7a5a";
    const stoneBase = nightBlend > 0.5 ? "#3a3028" : "#6a5a40";
    const crackCol  = nightBlend > 0.5 ? "#1a1410" : "#3a2e20";
    const mossCol   = nightBlend > 0.5 ? "#1a2a10" : "#3a5a20";
    const mossHi    = nightBlend > 0.5 ? "#243818" : "#4a7a28";
    const shardCol  = nightBlend > 0.5 ? "#6a5a38" : "#aa9060";
    const shardHi   = nightBlend > 0.5 ? "#7a6a48" : "#c4aa78";
    const glyphCol  = nightBlend > 0.5 ? "#4a3a28" : "#7a6040";
    // Base stone surface
    ctx.fillStyle = stoneTop;  ctx.fillRect(0, GROUND_Y,   CANVAS_W, 5);
    ctx.fillStyle = stoneBase; ctx.fillRect(0, GROUND_Y+5, CANVAS_W, CANVAS_H-GROUND_Y-5);
    // Stone tile cracks — horizontal and short vertical lines
    const CRACK_STRIDE = 64, CRACK_COUNT = 22, CRACK_PERIOD = CRACK_STRIDE * CRACK_COUNT;
    const crackOff = offset % CRACK_PERIOD;
    for(let i=0;i<CRACK_COUNT;i++){
      const rx = ((i*CRACK_STRIDE - crackOff) % CRACK_PERIOD + CRACK_PERIOD) % CRACK_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 6 + (i%4)*7;
      const rw = 10 + (i%3)*12;
      ctx.fillStyle = crackCol;
      ctx.fillRect(rx,    ry,   rw, 1);
      ctx.fillRect(rx+3,  ry+2, rw-6, 1);
      // Short vertical crack branch
      if(i%3===0) ctx.fillRect(rx+rw/2|0, ry, 1, 5);
    }
    // Moss patches growing in cracks
    const MOSS_STRIDE = 109, MOSS_COUNT = 14, MOSS_PERIOD = MOSS_STRIDE * MOSS_COUNT;
    const mossOff = offset % MOSS_PERIOD;
    for(let i=0;i<MOSS_COUNT;i++){
      const rx = ((i*MOSS_STRIDE - mossOff) % MOSS_PERIOD + MOSS_PERIOD) % MOSS_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 5 + (i%3)*8;
      const mw = 6 + (i%3)*5;
      ctx.fillStyle = mossCol; ctx.fillRect(rx, ry, mw, 3);
      ctx.fillStyle = mossHi;  ctx.fillRect(rx+1, ry, mw-2, 1);
    }
    // Broken pottery shards
    const SHARD_STRIDE = 131, SHARD_COUNT = 12, SHARD_PERIOD = SHARD_STRIDE * SHARD_COUNT;
    const shardOff = offset % SHARD_PERIOD;
    for(let i=0;i<SHARD_COUNT;i++){
      const rx = ((i*SHARD_STRIDE - shardOff) % SHARD_PERIOD + SHARD_PERIOD) % SHARD_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 7 + (i%4)*6;
      const sw = 5 + (i%3)*4;
      ctx.fillStyle = shardCol; ctx.fillRect(rx, ry, sw, sw*0.5|0);
      ctx.fillStyle = shardHi;  ctx.fillRect(rx+1, ry, sw-2, 1);
      // Shard chip
      ctx.fillStyle = crackCol; ctx.fillRect(rx+sw-2, ry, 2, 2);
    }
    // Carved hieroglyph fragments
    const GLYPH_STRIDE = 173, GLYPH_COUNT = 8, GLYPH_PERIOD = GLYPH_STRIDE * GLYPH_COUNT;
    const glyphOff = offset % GLYPH_PERIOD;
    for(let i=0;i<GLYPH_COUNT;i++){
      const rx = ((i*GLYPH_STRIDE - glyphOff) % GLYPH_PERIOD + GLYPH_PERIOD) % GLYPH_PERIOD;
      if(rx > CANVAS_W) continue;
      const ry = GROUND_Y + 10 + (i%3)*8;
      ctx.fillStyle = glyphCol;
      ctx.fillRect(rx,   ry,   8, 2);
      ctx.fillRect(rx+2, ry-3, 2, 3);
      ctx.fillRect(rx+6, ry-2, 2, 2);
    }
    return;
  }
  ctx.fillStyle = s.groundTop;
  ctx.fillRect(0, GROUND_Y, CANVAS_W, 4);
  ctx.fillStyle = s.groundColor;
  ctx.fillRect(0, GROUND_Y+4, CANVAS_W, CANVAS_H-GROUND_Y-4);
  ctx.fillStyle = s.groundTop + "88";
  const GEN_STRIDE = 76, GEN_COUNT = 22, GEN_PERIOD = GEN_STRIDE * GEN_COUNT;
  const genOff = offset % GEN_PERIOD;
  for(let i=0;i<GEN_COUNT;i++){
    const rx = ((i*GEN_STRIDE - genOff) % GEN_PERIOD + GEN_PERIOD) % GEN_PERIOD;
    if(rx > CANVAS_W) continue;
    ctx.fillRect(rx,GROUND_Y+6,16+(i%3)*6,2);
  }
}

// ─── BONE PICKUP ──────────────────────────────────────────────────────────────
export function drawBonePickup(ctx, x, y, col) {
  // drawFossilDiamond inline to avoid circular dep
  const cx = x + 7, cy = y + 7, size = 14;
  const h = size / 2;
  ctx.strokeStyle = col;
  ctx.lineWidth = Math.max(1, size * 0.06);
  ctx.beginPath();
  ctx.moveTo(cx, cy - h); ctx.lineTo(cx + h, cy);
  ctx.lineTo(cx, cy + h); ctx.lineTo(cx - h, cy);
  ctx.closePath(); ctx.stroke();
  const ih = h * 0.48;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ih); ctx.lineTo(cx + ih, cy);
  ctx.lineTo(cx, cy + ih); ctx.lineTo(cx - ih, cy);
  ctx.closePath(); ctx.fill();
}

// ─── BOSS RENDERER ───────────────────────────────────────────────────────────
export function drawBoss(ctx, cx, cy, frame, phase, hpFrac, blindWindow, hitFlash) {
  ctx.save();

  const breathe  = Math.sin(frame * 0.022) * (phase === 2 ? 8 : 5);
  const twave    = (i, s) => Math.sin(frame * (0.04 + phase * 0.012) + i * 1.1 + s) * (8 + phase * 3);
  const flash    = hitFlash > 0;

  // ── Color palette ──
  // Body: deep purple-black with visible contrast against the void bg
  const bodyBase  = flash ? "#ff3300" : "#2a0a44";   // deep purple
  const bodyMid   = flash ? "#ff5500" : "#3d1460";   // mid purple highlight
  const bodyEdge  = flash ? "#ff7700" : "#5a1e88";   // bright purple edge
  const limbBase  = flash ? "#cc2200" : "#1e0833";   // darker limb
  const limbEdge  = flash ? "#ff4400" : "#4a1270";   // limb highlight
  const spineCol  = flash ? "#ff6600" : "#8833cc";   // vivid purple spines
  const spineGlow = flash ? "#ffaa00" : "#cc66ff";   // spine tip glow
  const eyeCol    = phase === 2 ? "#ff2200" : phase === 1 ? "#ff6600" : "#ff4488";
  const eyeGlow   = phase === 2 ? "#ff8800" : phase === 1 ? "#ffaa44" : "#ff88cc";
  const eyePulse  = Math.floor(frame * 0.07) % 3 === 0;

  // ── Outer glow aura (drawn first, behind everything) ──
  const auraAlpha = 0.12 + Math.sin(frame * 0.04) * 0.06;
  ctx.globalAlpha = auraAlpha;
  ctx.fillStyle = flash ? "#ff4400" : "#6600cc";
  ctx.fillRect(cx - 80, cy - 90 + breathe, 160, 160);
  ctx.globalAlpha = 1;

  // ── Core body ──
  // Outer shell
  ctx.fillStyle = bodyBase;
  ctx.fillRect(cx-38, cy-30+breathe, 76, 60);
  ctx.fillRect(cx-52, cy-16+breathe, 104, 38);
  ctx.fillRect(cx-28, cy-48+breathe, 56, 22);
  ctx.fillRect(cx-20, cy-60+breathe, 40, 16);
  // Mid highlight layer
  ctx.fillStyle = bodyMid;
  ctx.fillRect(cx-30, cy-26+breathe, 60, 48);
  ctx.fillRect(cx-44, cy-12+breathe, 88, 28);
  ctx.fillRect(cx-22, cy-44+breathe, 44, 16);
  // Edge highlight (brightest)
  ctx.fillStyle = bodyEdge;
  ctx.fillRect(cx-20, cy-22+breathe, 40, 36);
  ctx.fillRect(cx-32, cy-8+breathe,  64, 18);
  ctx.fillRect(cx-14, cy-40+breathe, 28, 10);

  // ── Side masses ──
  const sideW = 20 + phase * 8;
  ctx.fillStyle = bodyBase;
  ctx.fillRect(cx+34,       cy-24+breathe, sideW,     32);
  ctx.fillRect(cx-34-sideW, cy-24+breathe, sideW,     32);
  ctx.fillStyle = bodyMid;
  ctx.fillRect(cx+36,       cy-20+breathe, sideW - 6, 22);
  ctx.fillRect(cx-32-sideW, cy-20+breathe, sideW - 6, 22);
  // Outer knuckle bumps
  ctx.fillStyle = bodyEdge;
  ctx.fillRect(cx+46,       cy-14+breathe, 10, 12);
  ctx.fillRect(cx-56,       cy-14+breathe, 10, 12);
  if(phase >= 1) {
    ctx.fillStyle = limbBase;
    ctx.fillRect(cx+54+sideW-20, cy-10+breathe, 14, 20);
    ctx.fillRect(cx-54-sideW+6,  cy-10+breathe, 14, 20);
    ctx.fillStyle = limbEdge;
    ctx.fillRect(cx+56+sideW-20, cy-8+breathe,  10, 14);
    ctx.fillRect(cx-52-sideW+6,  cy-8+breathe,  10, 14);
  }

  // ── Tentacles (bottom) ──
  const tentacles = [
    {ox:-40,len:5,dir:1},{ox:-26,len:6,dir:-1},{ox:-12,len:7,dir:1},
    {ox:2,  len:6,dir:-1},{ox:16,len:5,dir:1},{ox:30,len:7,dir:-1},
    {ox:-54,len:4,dir:1},{ox:44,len:4,dir:-1},
  ];
  tentacles.forEach((t, i) => {
    let tx = cx + t.ox, ty = cy + 30 + breathe;
    for(let s = 0; s < t.len; s++) {
      const w   = Math.max(3, 9 - s);
      const wav = twave(i, s * 0.5) * t.dir;
      // Alternate base/edge for visible segmentation
      ctx.fillStyle = s % 2 === 0 ? limbBase : bodyBase;
      ctx.fillRect(tx + wav - w/2, ty + s * 10, w, 11);
      // Highlight stripe on each segment
      ctx.fillStyle = s % 2 === 0 ? limbEdge : bodyMid;
      ctx.fillRect(tx + wav - w/2 + 1, ty + s * 10 + 1, Math.max(1, w - 3), 3);
    }
  });

  // ── Arms (top) ──
  const arms = [{ox:-30,dir:-1},{ox:30,dir:1},{ox:-12,dir:-1},{ox:12,dir:1}];
  arms.forEach((a, i) => {
    let ax = cx + a.ox, ay = cy - 46 + breathe;
    for(let s = 0; s < 4 + phase; s++) {
      const w   = Math.max(3, 8 - s);
      const wav = twave(i + 8, s * 0.6) * a.dir;
      ctx.fillStyle = s % 2 === 0 ? limbBase : bodyBase;
      ctx.fillRect(ax + wav - w/2, ay - s * 11, w, 12);
      ctx.fillStyle = s % 2 === 0 ? limbEdge : bodyMid;
      ctx.fillRect(ax + wav - w/2 + 1, ay - s * 11 + 1, Math.max(1, w - 3), 3);
    }
  });

  // ── Spines (crown) ──
  const spineCount = 7 + phase * 3;
  for(let i = 0; i < spineCount; i++) {
    const sx = cx - 34 + i * (68 / (spineCount - 1));
    const sh = 12 + (i % 3) * 7 + Math.sin(frame * 0.035 + i) * 5;
    // Spine base
    ctx.fillStyle = spineCol;
    ctx.fillRect(sx - 3, cy - 60 - sh + breathe, 6, sh);
    // Spine highlight
    ctx.fillStyle = spineGlow;
    ctx.fillRect(sx - 1, cy - 60 - sh + breathe, 2, Math.floor(sh * 0.4));
    // Spine tip glow dot
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(sx - 1, cy - 60 - sh + breathe, 2, 2);
  }

  // ── Texture details on body ──
  ctx.fillStyle = bodyEdge;
  // Horizontal ribbing
  for(let r = 0; r < 3; r++) {
    const ry = cy - 18 + r * 12 + breathe;
    ctx.fillRect(cx - 28, ry, 56, 2);
  }
  // Vertical crack lines
  ctx.fillStyle = limbBase;
  ctx.fillRect(cx - 6, cy - 24 + breathe, 3, 40);
  ctx.fillRect(cx + 4, cy - 20 + breathe, 3, 36);

  // ── Eyes ──
  // Eye glow halo
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = eyeGlow;
  ctx.fillRect(cx-22, cy-38+breathe, 14, 10);
  ctx.fillRect(cx+8,  cy-34+breathe, 14, 10);
  ctx.fillRect(cx-8,  cy-46+breathe, 12, 8);
  ctx.globalAlpha = 1;
  // Eye whites
  ctx.fillStyle = "#ffeecc";
  ctx.fillRect(cx-20, cy-36+breathe, 10, 7);
  ctx.fillRect(cx+10, cy-32+breathe, 10, 7);
  ctx.fillRect(cx-6,  cy-44+breathe, 8,  6);
  // Eye pupils
  ctx.fillStyle = eyePulse ? eyeCol : eyeGlow;
  ctx.fillRect(cx-18, cy-35+breathe, 6, 5);
  ctx.fillRect(cx+12, cy-31+breathe, 6, 5);
  ctx.fillRect(cx-4,  cy-43+breathe, 5, 4);
  // Phase 1+ extra eyes
  if(phase >= 1) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = eyeGlow;
    ctx.fillRect(cx+22, cy-24+breathe, 10, 8);
    ctx.fillRect(cx-34, cy-20+breathe, 10, 8);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffeecc";
    ctx.fillRect(cx+24, cy-23+breathe, 7, 6);
    ctx.fillRect(cx-32, cy-19+breathe, 7, 6);
    ctx.fillStyle = eyePulse ? eyeCol : eyeGlow;
    ctx.fillRect(cx+25, cy-22+breathe, 5, 4);
    ctx.fillRect(cx-31, cy-18+breathe, 5, 4);
  }
  if(phase >= 2) {
    ctx.fillStyle = eyePulse ? eyeCol : eyeGlow;
    ctx.fillRect(cx-10, cy-22+breathe, 5, 4);
    ctx.fillRect(cx+6,  cy-26+breathe, 5, 4);
  }

  // ── Mouth ──
  const mouthOpen = Math.sin(frame * 0.03) > 0.2;
  // Mouth cavity
  ctx.fillStyle = "#0a0010";
  ctx.fillRect(cx-22, cy-6+breathe, 44, mouthOpen ? 10 : 4);
  if(mouthOpen) {
    // Inner mouth glow
    ctx.fillStyle = "#660022";
    ctx.fillRect(cx-18, cy-5+breathe, 36, 8);
    ctx.fillStyle = "#cc0044";
    ctx.fillRect(cx-12, cy-4+breathe, 24, 5);
    // Teeth
    ctx.fillStyle = "#ffddcc";
    for(let t = 0; t < 5; t++) {
      ctx.fillRect(cx - 18 + t * 9, cy - 6 + breathe, 5, 5);
      ctx.fillRect(cx - 16 + t * 9, cy + 3  + breathe, 5, 4);
    }
  }

  // ── Blind spot glow (weak point) ──
  if(blindWindow) {
    const glowPulse = 0.5 + Math.sin(frame * 0.25) * 0.5;
    // Wide aura
    ctx.globalAlpha = 0.22 + glowPulse * 0.18;
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(cx-60, cy-70+breathe, 120, 140);
    ctx.globalAlpha = 1;
    // Bright core weak point
    ctx.fillStyle = `rgba(255,230,50,${0.75 + glowPulse * 0.25})`;
    ctx.fillRect(cx-10, cy-14+breathe, 20, 20);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx-5,  cy-9+breathe,  10, 10);
    ctx.fillStyle = "#ffff88";
    ctx.fillRect(cx-2,  cy-6+breathe,  4,  4);
    // Pulsing ring
    ctx.globalAlpha = glowPulse * 0.6;
    ctx.strokeStyle = "#ffdd00";
    ctx.lineWidth = 3;
    ctx.strokeRect(cx-18, cy-22+breathe, 36, 36);
    ctx.globalAlpha = 1;
  }

  // ── HP bar ──
  const barW = 220, barX = cx - barW/2, barY = cy - 100;
  // Bar background
  ctx.fillStyle = "#1a0030";
  ctx.fillRect(barX - 3, barY - 3, barW + 6, 16);
  ctx.fillStyle = "#0a0018";
  ctx.fillRect(barX, barY, barW, 10);
  // Bar fill
  const barCol = phase === 2 ? "#ff2200" : phase === 1 ? "#ff6600" : "#cc44ff";
  const barFill = Math.floor(barW * hpFrac);
  ctx.fillStyle = barCol;
  ctx.fillRect(barX, barY, barFill, 10);
  // Bar shine
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(barX, barY, barFill, 3);
  // Label
  ctx.fillStyle = "#ffccff";
  ctx.font = "bold 9px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText("THE HORROR ENTITY", cx, barY - 5);
  ctx.textAlign = "left";

  ctx.globalAlpha = 1;
  ctx.restore();
}

export function drawEntitySilhouette(ctx, x, y, frame, alpha, scenery) {
  if(alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  const sid = scenery?.id || "classic";
  const silTints = {
    classic:"#080808", plains:"#040e02", desert:"#180800", arctic:"#020810",
    volcano:"#180200", jungle:"#020e04", ruins:"#0e0a04", cave:"#0a0018",
  };
  const tint = silTints[sid] || "#080808";
  ctx.fillStyle = tint;

  const breathe = Math.sin(frame * 0.018) * 4;
  const tentacleWave = (i, t) => Math.sin(frame * 0.04 + i * 1.1 + t) * 6;
  const cx = x, cy = y;

  ctx.fillRect(cx-28, cy-20+breathe, 56, 44);
  ctx.fillRect(cx-36, cy-10+breathe, 72, 28);
  ctx.fillRect(cx-20, cy-32+breathe, 40, 16);
  ctx.fillRect(cx-14, cy-40+breathe, 28, 12);
  ctx.fillRect(cx+18, cy-28+breathe, 18, 20);
  ctx.fillRect(cx-38, cy-18+breathe, 14, 24);
  ctx.fillRect(cx+30, cy-8+breathe,  12, 18);
  ctx.fillRect(cx-44, cy-4+breathe,  10, 14);

  const tentacles = [
    {ox:-30,len:5,dir:1},{ox:-18,len:6,dir:-1},{ox:-6,len:7,dir:1},{ox:6,len:6,dir:-1},
    {ox:18,len:5,dir:1},{ox:28,len:7,dir:-1},{ox:-40,len:4,dir:1},{ox:38,len:4,dir:-1},
  ];
  tentacles.forEach((t, i) => {
    let tx = cx + t.ox, ty = cy + 22 + breathe;
    for(let s = 0; s < t.len; s++) {
      const w = Math.max(2, 7 - s);
      const wave = tentacleWave(i, s * 0.5) * t.dir;
      ctx.fillRect(tx + wave - w/2, ty + s*8, w, 9);
    }
  });

  const arms = [{ox:-22,dir:-1},{ox:22,dir:1},{ox:-8,dir:-1},{ox:8,dir:1}];
  arms.forEach((a, i) => {
    let ax = cx + a.ox, ay = cy - 32 + breathe;
    for(let s = 0; s < 4; s++) {
      const w = Math.max(2, 6 - s);
      const wave = tentacleWave(i + 8, s * 0.6) * a.dir;
      ctx.fillRect(ax + wave - w/2, ay - s*9, w, 10);
    }
  });

  const eyePulse = Math.floor(frame * 0.06) % 3 === 0;
  ctx.fillStyle = eyePulse ? "#ff0000" : "#cc0000";
  ctx.fillRect(cx-14, cy-26+breathe, 5, 4);
  ctx.fillRect(cx+10, cy-22+breathe, 5, 4);
  ctx.fillRect(cx-2,  cy-30+breathe, 4, 3);
  ctx.fillRect(cx+22, cy-14+breathe, 4, 4);
  ctx.fillRect(cx-28, cy-10+breathe, 3, 3);

  const mouthOpen = Math.sin(frame * 0.025) > 0.3;
  ctx.fillStyle = "#000000";
  ctx.fillRect(cx-16, cy-4+breathe, 32, mouthOpen ? 5 : 2);
  if(mouthOpen) {
    ctx.fillStyle = "#330000";
    ctx.fillRect(cx-12, cy-4+breathe, 4, 4);
    ctx.fillRect(cx-2,  cy-4+breathe, 4, 4);
    ctx.fillRect(cx+8,  cy-4+breathe, 4, 4);
  }

  ctx.fillStyle = tint;
  for(let i = 0; i < 7; i++) {
    const sx = cx - 24 + i * 8;
    const sh = 8 + (i % 3) * 5 + Math.sin(frame * 0.03 + i) * 3;
    ctx.fillRect(sx, cy - 40 - sh + breathe, 3, sh);
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}
