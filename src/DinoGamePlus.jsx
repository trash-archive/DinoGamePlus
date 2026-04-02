import { useState, useEffect, useRef, useCallback } from "react";
import { submitScore, fetchLeaderboard, isNameTaken } from "./leaderboard";
import { getSavedName, savePlayerName, getPlayerId } from "./supabase";

// ─── LOCAL STORAGE HOOK ───────────────────────────────────────────────────────
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}
import { drawPowerupIcon } from "./rendering/drawPowerups";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const GRAVITY    = 0.55;
const JUMP_FORCE = -13.5;
const GROUND_Y   = 210;
const DINO_W     = 40;
const DINO_H     = 48;
const CANVAS_W   = 720;
const CANVAS_H   = 270;
const DAY_CYCLE  = 2000;
const DUCK_H     = 26;

// ─── PIXEL FONT HELPER ───────────────────────────────────────────────────────
function px(ctx, text, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px "Courier New", monospace`;
  ctx.fillText(text, x, y);
}

// ─── CURRENCY ICON ───────────────────────────────────────────────────────────
function drawFossilDiamond(ctx, cx, cy, size, color) {
  const h = size / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.06);
  ctx.beginPath();
  ctx.moveTo(cx, cy - h); ctx.lineTo(cx + h, cy);
  ctx.lineTo(cx, cy + h); ctx.lineTo(cx - h, cy);
  ctx.closePath(); ctx.stroke();
  const ih = h * 0.48;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ih); ctx.lineTo(cx + ih, cy);
  ctx.lineTo(cx, cy + ih); ctx.lineTo(cx - ih, cy);
  ctx.closePath(); ctx.fill();
}

function drawBoneCoin(ctx, x, y, size = 10) {
  drawFossilDiamond(ctx, x + size / 2, y + size / 2, size, "#888888");
}

// ─── SCENERIES ────────────────────────────────────────────────────────────────
const SCENERIES = [
  { id:"classic",  label:"Wasteland",     cost:0,    desc:"The digital wasteland  Ewhere it all began",  dayBg:"#f5f5f0", nightBg:"#111118", groundColor:"#222222", groundTop:"#444444", cloudColor:"#dddddd", obstacleSet:"plants",  accentColor:"#444444" },
  { id:"plains",   label:"Grasslands",    cost:3000,  desc:"The classic prehistoric plains",               dayBg:"#e8f4d4", nightBg:"#0d1a0a", groundColor:"#5a3e1b", groundTop:"#6b8c3e", cloudColor:"#c8ddb0", obstacleSet:"plants",  accentColor:"#6b8c3e" },
  { id:"desert",   label:"Desert",        cost:6000,  desc:"Scorching sands and ancient dunes",            dayBg:"#f5dfa0", nightBg:"#1a0d00", groundColor:"#c4883a", groundTop:"#e0a850", cloudColor:"#f0d080", obstacleSet:"desert",  accentColor:"#e07020" },
  { id:"arctic",   label:"Arctic Tundra", cost:10000, desc:"Frozen wastes from the ice age",              dayBg:"#d8eeff", nightBg:"#050a14", groundColor:"#8ab0cc", groundTop:"#ddeeff", cloudColor:"#eef6ff", obstacleSet:"arctic",  accentColor:"#88ccee" },
  { id:"volcano",  label:"Volcanic Rift", cost:18000, desc:"Lava flows and volcanic fury",                dayBg:"#2a0800", nightBg:"#0a0200", groundColor:"#3a1a08", groundTop:"#8a2a00", cloudColor:"#6a2a10", obstacleSet:"volcano", accentColor:"#ff4400" },
  { id:"jungle",   label:"Dense Jungle",  cost:25000, desc:"Ancient overgrown rainforest",                dayBg:"#0a2a10", nightBg:"#020a04", groundColor:"#1a3a10", groundTop:"#2a5a18", cloudColor:"#1a3a20", obstacleSet:"jungle",  accentColor:"#44aa22" },
  { id:"ruins",    label:"Ancient Ruins", cost:40000, desc:"Crumbling stone temples of the ancients",     dayBg:"#d4c8a0", nightBg:"#0a0808", groundColor:"#8a7a5a", groundTop:"#a89878", cloudColor:"#c4b888", obstacleSet:"ruins",   accentColor:"#a08050" },
  { id:"cave",     label:"Crystal Cave",  cost:75000, desc:"Glowing crystals in the deep earth",          dayBg:"#080418", nightBg:"#020108", groundColor:"#2a1a4a", groundTop:"#3a2a6a", cloudColor:"#3a2a6a", obstacleSet:"cave",    accentColor:"#8844ff" },
];

// ─── DINO PASSIVE SKILLS ──────────────────────────────────────────────────────
// Each dino has a unique passive that modifies gameplay
// Pixel-style SVG icons for dino passives — inline, theme-consistent
const S = {display:"inline",verticalAlign:"middle",marginRight:3,shapeRendering:"crispEdges"};
const PASSIVE_ICONS = {
  // Lightning bolt — centred on 10×10
  raptor:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="5" y="0" width="3" height="4" fill="currentColor"/>
      <rect x="2" y="3" width="6" height="3" fill="currentColor"/>
      <rect x="2" y="6" width="3" height="4" fill="currentColor"/>
    </svg>,
  // Skull — symmetric 8-wide dome + 2 eye holes + 2 fangs
  trex:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="1" y="1" width="8" height="5" fill="currentColor"/>
      <rect x="0" y="3" width="2" height="3" fill="currentColor"/>
      <rect x="8" y="3" width="2" height="3" fill="currentColor"/>
      <rect x="2" y="6" width="2" height="3" fill="currentColor"/>
      <rect x="6" y="6" width="2" height="3" fill="currentColor"/>
      <rect x="2" y="2" width="2" height="2" fill="#f0ede6"/>
      <rect x="6" y="2" width="2" height="2" fill="#f0ede6"/>
    </svg>,
  // Shield — symmetric kite shape
  stego:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="1" y="0" width="8" height="6" fill="currentColor"/>
      <rect x="2" y="6" width="6" height="2" fill="currentColor"/>
      <rect x="3" y="8" width="4" height="1" fill="currentColor"/>
      <rect x="4" y="9" width="2" height="1" fill="currentColor"/>
    </svg>,
  // Wing sweep — diagonal S-curve, symmetric about centre
  pterodac:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="0" y="1" width="4" height="2" fill="currentColor"/>
      <rect x="1" y="0" width="2" height="1" fill="currentColor"/>
      <rect x="3" y="3" width="4" height="2" fill="currentColor"/>
      <rect x="6" y="5" width="4" height="2" fill="currentColor"/>
      <rect x="7" y="7" width="2" height="1" fill="currentColor"/>
    </svg>,
  // Club on handle — centred
  anky:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="4" y="0" width="2" height="4" fill="currentColor"/>
      <rect x="1" y="4" width="8" height="4" fill="currentColor"/>
      <rect x="0" y="5" width="2" height="2" fill="currentColor"/>
      <rect x="8" y="5" width="2" height="2" fill="currentColor"/>
    </svg>,
  // Right-pointing arrow — centred vertically
  tri:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="0" y="4" width="6" height="2" fill="currentColor"/>
      <rect x="4" y="2" width="2" height="2" fill="currentColor"/>
      <rect x="4" y="6" width="2" height="2" fill="currentColor"/>
      <rect x="6" y="1" width="2" height="3" fill="currentColor"/>
      <rect x="6" y="6" width="2" height="3" fill="currentColor"/>
      <rect x="8" y="3" width="2" height="4" fill="currentColor"/>
    </svg>,
  // U-magnet — perfectly symmetric, coloured poles
  brachio:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="0" y="0" width="3" height="7" fill="currentColor"/>
      <rect x="7" y="0" width="3" height="7" fill="currentColor"/>
      <rect x="3" y="7" width="4" height="3" fill="currentColor"/>
      <rect x="0" y="0" width="3" height="3" fill="#cc2200"/>
      <rect x="7" y="0" width="3" height="3" fill="#2255cc"/>
    </svg>,
  // Crescent moon — open on right side
  spino:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="2" y="0" width="5" height="2" fill="currentColor"/>
      <rect x="1" y="2" width="3" height="6" fill="currentColor"/>
      <rect x="2" y="8" width="5" height="2" fill="currentColor"/>
      <rect x="6" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="7" y="3" width="2" height="4" fill="currentColor"/>
      <rect x="6" y="7" width="2" height="2" fill="currentColor"/>
    </svg>,
  // Dome head — wide flat base + rounded top
  pachy:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="3" y="0" width="4" height="1" fill="currentColor"/>
      <rect x="2" y="1" width="6" height="2" fill="currentColor"/>
      <rect x="1" y="3" width="8" height="3" fill="currentColor"/>
      <rect x="0" y="7" width="10" height="2" fill="currentColor"/>
    </svg>,
  // Sound wave bars — 4 bars symmetric around centre
  para:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="0" y="3" width="2" height="4" fill="currentColor"/>
      <rect x="3" y="1" width="2" height="8" fill="currentColor"/>
      <rect x="6" y="1" width="2" height="8" fill="currentColor"/>
      <rect x="9" y="3" width="1" height="4" fill="currentColor"/>
    </svg>,
  // Venom drop — symmetric teardrop
  dilopho:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="4" y="0" width="2" height="3" fill="currentColor"/>
      <rect x="3" y="3" width="4" height="2" fill="currentColor"/>
      <rect x="2" y="5" width="6" height="2" fill="currentColor"/>
      <rect x="3" y="7" width="4" height="2" fill="currentColor"/>
      <rect x="4" y="9" width="2" height="1" fill="currentColor"/>
    </svg>,
};

const DINO_PASSIVES = {
  raptor:    { label:"Speed Rush",      desc:"Every 200m grants +5% bone income permanently this run. Sprint energy!" },
  trex:      { label:"Apex Predator",   desc:"Obstacles destroyed while giant give +8 bones instead of 4. Dominance!" },
  stego:     { label:"Plate Armor",     desc:"Shield proc chance doubled. The back plates absorb punishment." },
  pterodac:  { label:"Thermal Lift",    desc:"Airborne bone pickups give 2x value. Soar high for greater rewards." },
  anky:      { label:"Club Sweep",      desc:"Near misses also destroy the obstacle. The club tail clears the path." },
  tri:       { label:"Horn Charge",     desc:"First obstacle each run is automatically destroyed. Charge through!" },
  brachio:   { label:"Long Reach",      desc:"Bone magnet range +120px. The long neck scoops up everything nearby." },
  spino:     { label:"Sail Power",      desc:"+30% bones earned during night. The solar sail thrives in moonlight." },
  pachy:     { label:"Headbutt",        desc:"Dying grants 1 free auto-revive per run (once). Hard-headed survivor." },
  para:      { label:"Resonance",       desc:"Combo multiplier decays 40% slower. The crest amplifies momentum." },
  dilopho:   { label:"Venom Spit",      desc:"15% chance each obstacle is dissolved before contact. Toxic aura!" },
};

// ─── DINO DESIGNS ─────────────────────────────────────────────────────────────
const DINO_DESIGNS = [
  { id:"raptor",   label:"Raptor",        cost:0,    desc:"Fast and lean  Ethe classic runner" },
  { id:"trex",     label:"T-Rex",         cost:2500,  desc:"Stocky and powerful apex predator" },
  { id:"stego",    label:"Stegosaurus",   cost:3500,  desc:"Armored with iconic back plates" },
  { id:"pterodac", label:"Pterodactyl",   cost:5000,  desc:"Winged flyer, soars above danger" },
  { id:"anky",     label:"Ankylosaurus",  cost:7000,  desc:"Club tail, heavy armored tank" },
  { id:"tri",      label:"Triceratops",   cost:9000,  desc:"Three-horned charging powerhouse" },
  { id:"brachio",  label:"Brachiosaurus", cost:12000, desc:"Towering long-neck gentle giant" },
  { id:"spino",    label:"Spinosaurus",   cost:18000, desc:"Sail-backed river predator" },
  { id:"pachy",    label:"Pachycephalosaurus", cost:15000, desc:"Dome-headed headbutter" },
  { id:"para",     label:"Parasaurolophus", cost:20000, desc:"Crested hadrosaur, crest resonates" },
  { id:"dilopho",  label:"Dilophosaurus", cost:30000, desc:"Frilled venomous sprinter" },
];

// ─── SKINS ────────────────────────────────────────────────────────────────────
const SKINS = [
  { id:"classic",  label:"Classic",   cost:0,   color:"#2a2a2a", eyeColor:"#f0f0f0", accent:"#3a3a3a", plateColor:"#333",    frillColor:"#444" },
  { id:"bone",     label:"Bone",      cost:1500,  color:"#d4c9a8", eyeColor:"#3a6a2a", accent:"#c0b48e", plateColor:"#c8bd9c", frillColor:"#b8a880" },
  { id:"neon",     label:"Neon",      cost:2500,  color:"#00cc66", eyeColor:"#ffffff", accent:"#00aa44", plateColor:"#00aa55", frillColor:"#00ff88" },
  { id:"shadow",   label:"Shadow",    cost:3500,  color:"#1a1a1a", eyeColor:"#dd3333", accent:"#0a0a0a", plateColor:"#151515", frillColor:"#222" },
  { id:"robo",     label:"Robo",      cost:5000,  color:"#5599aa", eyeColor:"#ffdd00", accent:"#336688", plateColor:"#446688", frillColor:"#6699bb" },
  { id:"gold",     label:"Gold",      cost:8000,  color:"#d4a820", eyeColor:"#2a2a2a", accent:"#b89010", plateColor:"#c09810", frillColor:"#e8c030" },
  { id:"lava",     label:"Lava",      cost:10000, color:"#aa2200", eyeColor:"#ffaa00", accent:"#661100", plateColor:"#882200", frillColor:"#cc3300" },
  { id:"ice",      label:"Ice",       cost:12000, color:"#88ccee", eyeColor:"#003388", accent:"#66aacc", plateColor:"#77bbdd", frillColor:"#aaddff" },
  { id:"void",     label:"Void",      cost:20000, color:"#110022", eyeColor:"#aa33ff", accent:"#0a0015", plateColor:"#1a0033", frillColor:"#220044" },
  { id:"crystal",  label:"Crystal",   cost:25000, color:"#cc77ee", eyeColor:"#ffffff", accent:"#994dbb", plateColor:"#bb66dd", frillColor:"#dd99ff" },
  { id:"rust",     label:"Rust",      cost:6000,  color:"#8a3a18", eyeColor:"#ffcc55", accent:"#5a2a10", plateColor:"#6a3015", frillColor:"#aa4422" },
  { id:"obsidian", label:"Obsidian",  cost:35000, color:"#1a1a2a", eyeColor:"#44ddff", accent:"#0a0a18", plateColor:"#15152a", frillColor:"#2a2a3a" },
];

// ─── UPGRADES ─────────────────────────────────────────────────────────────────
const UPGRADES = [
  { id:"jump",       label:"Stronger Legs",    desc:"+1.8 jump power per level", baseCost:30,  maxLevel:6, icon:"ↁ",  cat:"movement" },
  { id:"dblJump",    label:"Double Jump",       desc:"Jump again mid-air",        baseCost:150, maxLevel:1, icon:"⇁",  cat:"movement" },
  { id:"dash",       label:"Forward Dash",      desc:"Right arrow to dash fwd",   baseCost:200, maxLevel:1, icon:"▶▶", cat:"movement" },
  { id:"backdash",   label:"Back Dash",         desc:"Left arrow to dash back",   baseCost:200, maxLevel:1, icon:"◀◀", cat:"movement" },
  { id:"fastdrop",   label:"Fast Drop",         desc:"Down arrow drops fast",     baseCost:100, maxLevel:1, icon:"↓�", cat:"movement" },
  { id:"duck",       label:"Duck",              desc:"Down arrow to crouch",      baseCost:80,  maxLevel:1, icon:"⬁",  cat:"movement" },
  { id:"dashCd",     label:"Dash Cooldown",     desc:"Reduce dash delay 10f/lv",  baseCost:120, maxLevel:4, icon:"↻",  cat:"movement" },
  { id:"fossil",     label:"Fossil Sense",      desc:"+20% bones earned/level",   baseCost:50,  maxLevel:10,icon:"◈",  cat:"income" },
  { id:"combo",      label:"Combo Hunger",      desc:"+0.12 combo mult/level",    baseCost:80,  maxLevel:6, icon:"Á",  cat:"income" },
  { id:"magnet",     label:"Bone Magnet",       desc:"Attract nearby bones",      baseCost:120, maxLevel:3, icon:"◈",  cat:"income" },
  { id:"nearMiss",   label:"Near Miss",         desc:"+3 bones on near misses",   baseCost:100, maxLevel:4, icon:"!",  cat:"income" },
  { id:"nightBonus", label:"Night Sight",       desc:"+25% bones at night/lv",    baseCost:160, maxLevel:4, icon:"☾",  cat:"income" },
  { id:"transBonus", label:"Cycle Reward",      desc:"+25% day/night bonus/lv",   baseCost:180, maxLevel:4, icon:"◈",  cat:"income" },
  { id:"speedBonus", label:"Speed Bonus",       desc:"+0.5 bones/sec per speed",  baseCost:200, maxLevel:5, icon:"»",  cat:"income" },
  { id:"shield",     label:"Bone Armor",        desc:"6% auto-revive chance/lv",  baseCost:70,  maxLevel:5, icon:"◈",  cat:"survival" },
  { id:"speed",      label:"Safe Start",        desc:"Start each run 15% slower", baseCost:50,  maxLevel:4, icon:"◀",  cat:"survival" },
  { id:"extraLife",  label:"Extra Life",        desc:"Start with +1 life",        baseCost:350, maxLevel:3, icon:"♥",  cat:"survival" },
  { id:"invFrames",  label:"I-Frames",          desc:"+8 invincible frames/hit",  baseCost:250, maxLevel:4, icon:"☁",  cat:"survival" },
  { id:"miner",      label:"Bone Miner",        desc:"+0.3 bones/sec passive",    baseCost:200, maxLevel:6, icon:"⛁",  cat:"idle" },
  { id:"camp",       label:"Bone Camp",         desc:"+0.8 bones/sec idle",       baseCost:400, maxLevel:4, icon:"⌁",  cat:"idle" },
  { id:"research",   label:"Research Lab",      desc:"+1.5 bones/sec passive",    baseCost:800, maxLevel:3, icon:"⚁",  cat:"idle" },
  { id:"pwShieldDur",   label:"Shield Durability", desc:"+1 hit per shield",          baseCost:250, maxLevel:4, icon:"◈", cat:"powerups" },
  { id:"pwSpeedMult",   label:"Speed Power",        desc:"+0.25x speed boost power",   baseCost:200, maxLevel:3, icon:"▶+", cat:"powerups" },
  { id:"pwGiantDur",    label:"Giant Duration",     desc:"+50 frames giant time",      baseCost:220, maxLevel:3, icon:"▲+", cat:"powerups" },
  { id:"pwMagnetRng",   label:"Magnet Range",       desc:"+60px magnet powerup range", baseCost:180, maxLevel:3, icon:"◈", cat:"powerups" },
  { id:"pwFrenzyDur",   label:"Frenzy Duration",    desc:"+50 frames frenzy time",     baseCost:240, maxLevel:3, icon:"☁", cat:"powerups" },
  { id:"pwRareDrop",    label:"Powerup Luck",       desc:"+6% powerup spawn rate/lv",  baseCost:160, maxLevel:5, icon:"✦",  cat:"powerups" },
  { id:"pwHeartChance", label:"Life Drop",           desc:"+4% heart spawn chance/lv",  baseCost:300, maxLevel:5, icon:"♥+", cat:"powerups" },
  { id:"pwGhostDur",    label:"Ghost Duration",     desc:"+50 frames ghost time",      baseCost:220, maxLevel:3, icon:"◈", cat:"powerups" },
  { id:"pwTinyDur",     label:"Tiny Duration",      desc:"+50 frames tiny time",       baseCost:180, maxLevel:3, icon:"▽+", cat:"powerups" },
  { id:"pwMeteorCount", label:"Meteor Blast",       desc:"+2 extra meteor clears",     baseCost:350, maxLevel:3, icon:"☁", cat:"powerups" },
  { id:"pwDoublerDur",  label:"Doubler Duration",   desc:"+50 frames doubler time",    baseCost:200, maxLevel:3, icon:"Á", cat:"powerups" },
  { id:"pwSlowDur",     label:"Slow Duration",      desc:"+50 frames slow time",       baseCost:180, maxLevel:3, icon:"⏱+", cat:"powerups" },
  { id:"pwWindfallDur", label:"Windfall Duration",  desc:"+50 frames windfall time",   baseCost:200, maxLevel:3, icon:"◈", cat:"powerups" },
];

const UPGRADE_CATS = ["movement","income","survival","idle","powerups"];

// ─── POWERUP DEFINITIONS ──────────────────────────────────────────────────────
const POWERUP_DEFS = [
  { id:"shield_pw",    color:"#4488dd", label:"SHIELD",   duration:0,   desc:"Absorbs hits",          unlockCost:80  },
  { id:"giant_pw",     color:"#cc4400", label:"GIANT",    duration:200, desc:"Crushes obstacles",      unlockCost:120 },
  { id:"magnet_pw",    color:"#9944cc", label:"MAGNET",   duration:360, desc:"Attracts all bones",     unlockCost:100 },
  { id:"slowmo_pw",    color:"#22bbaa", label:"SLOW",     duration:280, desc:"Slows time",             unlockCost:90  },
  { id:"frenzy_pw",    color:"#dd2266", label:"FRENZY",   duration:220, desc:"3x bones earned",        unlockCost:150 },
  { id:"coinmania_pw", color:"#ddaa00", label:"WINDFALL", duration:260, desc:"Bones rain down",        unlockCost:130 },
  { id:"ghost_pw",     color:"#8888cc", label:"GHOST",    duration:180, desc:"Pass through all",       unlockCost:140 },
  { id:"tiny_pw",      color:"#44ccaa", label:"TINY",     duration:320, desc:"Tiny hitbox",            unlockCost:80  },
  { id:"meteor_pw",    color:"#ee6600", label:"METEOR",   duration:1,   desc:"Destroys screen",        unlockCost:200 },
  { id:"doubler_pw",   color:"#ffdd22", label:"DOUBLER",  duration:300, desc:"2x all bone gains",      unlockCost:160 },
  { id:"heart_pw",     color:"#dd2244", label:"HEART",    duration:0,   desc:"Gain +1 life (max 4)",    unlockCost:180 },
];

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id:"first_run",    label:"First Steps",      desc:"Complete your first run",               req:(s)=>s.totalRuns>=1,       reward:10,  tier:"bronze" },
  { id:"run10",        label:"Getting Started",   desc:"Complete 10 runs",                      req:(s)=>s.totalRuns>=10,      reward:25,  tier:"bronze" },
  { id:"dist100",      label:"Century Run",       desc:"Run 100m in a single run",              req:(s)=>s.bestDist>=100,      reward:20,  tier:"bronze" },
  { id:"earn50",       label:"Bone Collector",    desc:"Earn 50 bones total",                   req:(s)=>s.totalBones>=50,     reward:15,  tier:"bronze" },
  { id:"first_upgrade",label:"Evolution Begins",  desc:"Buy your first upgrade",                req:(s)=>s.totalUpgrades>=1,   reward:15,  tier:"bronze" },
  { id:"first_skin",   label:"Fashion Forward",   desc:"Unlock a new skin",                     req:(s)=>s.ownedSkins>=2,      reward:20,  tier:"bronze" },
  { id:"combo5",       label:"Combo Starter",     desc:"Reach a x5 combo",                      req:(s)=>s.maxCombo>=5,        reward:25,  tier:"bronze" },
  { id:"run50",        label:"Seasoned Runner",   desc:"Complete 50 runs",                      req:(s)=>s.totalRuns>=50,      reward:60,  tier:"silver" },
  { id:"dist500",      label:"Long Haul",         desc:"Run 500m in a single run",              req:(s)=>s.bestDist>=500,      reward:50,  tier:"silver" },
  { id:"dist1000",     label:"Marathoner",        desc:"Run 1000m in a single run",             req:(s)=>s.bestDist>=1000,     reward:100, tier:"silver" },
  { id:"earn500",      label:"Fossil Hunter",     desc:"Earn 500 bones total",                  req:(s)=>s.totalBones>=500,    reward:75,  tier:"silver" },
  { id:"earn2000",     label:"Bone Hoarder",      desc:"Earn 2,000 bones total",                req:(s)=>s.totalBones>=2000,   reward:150, tier:"silver" },
  { id:"upgrade10",    label:"Evolving Fast",     desc:"Buy 10 upgrades",                       req:(s)=>s.totalUpgrades>=10,  reward:80,  tier:"silver" },
  { id:"combo15",      label:"Combo Artist",      desc:"Reach a x15 combo",                     req:(s)=>s.maxCombo>=15,       reward:75,  tier:"silver" },
  { id:"night3",       label:"Night Owl",         desc:"Survive 3 full night cycles",           req:(s)=>s.nightCycles>=3,     reward:80,  tier:"silver" },
  { id:"nearmiss20",   label:"Daredevil",         desc:"Land 20 near misses",                   req:(s)=>s.totalNearMiss>=20,  reward:60,  tier:"silver" },
  { id:"skin5",        label:"Collector",         desc:"Own 5 skins",                           req:(s)=>s.ownedSkins>=5,      reward:100, tier:"silver" },
  { id:"scenery3",     label:"World Traveler",    desc:"Own 3 sceneries",                       req:(s)=>s.ownedSceneries>=3,  reward:120, tier:"silver" },
  { id:"all_movement", label:"Full Mobility",     desc:"Max all movement upgrades",             req:(s)=>s.allMovementMax,     reward:200, tier:"silver" },
  { id:"run200",       label:"Unstoppable",       desc:"Complete 200 runs",                     req:(s)=>s.totalRuns>=200,     reward:250, tier:"gold" },
  { id:"dist3000",     label:"Jurassic Journey",  desc:"Run 3,000m in a single run",            req:(s)=>s.bestDist>=3000,     reward:300, tier:"gold" },
  { id:"dist5000",     label:"Epoch Runner",      desc:"Run 5,000m in a single run",            req:(s)=>s.bestDist>=5000,     reward:500, tier:"gold" },
  { id:"earn10k",      label:"Fossil Fortune",    desc:"Earn 10,000 bones total",               req:(s)=>s.totalBones>=10000,  reward:400, tier:"gold" },
  { id:"earn50k",      label:"Bone Baron",        desc:"Earn 50,000 bones total",               req:(s)=>s.totalBones>=50000,  reward:1000,tier:"gold" },
  { id:"combo30",      label:"Combo God",         desc:"Reach a x30 combo",                     req:(s)=>s.maxCombo>=30,       reward:300, tier:"gold" },
  { id:"night10",      label:"Creature of Night", desc:"Survive 10 full night cycles",          req:(s)=>s.nightCycles>=10,    reward:350, tier:"gold" },
  { id:"upgrade30",    label:"Fully Evolved",     desc:"Buy 30 upgrades total",                 req:(s)=>s.totalUpgrades>=30,  reward:400, tier:"gold" },
  { id:"all_skins",    label:"Wardrobe Complete", desc:"Own all 12 skins",                      req:(s)=>s.ownedSkins>=12,     reward:600, tier:"gold" },
  { id:"giant10",      label:"Giant Slayer",      desc:"Crush 10 obstacles as GIANT",           req:(s)=>s.giantCrushes>=10,   reward:200, tier:"gold" },
  { id:"dist15000",    label:"Endless Wanderer",  desc:"Run 15,000m in a single run",           req:(s)=>s.bestDist>=15000,    reward:2000,tier:"legend" },
  { id:"earn500k",     label:"Fossil King",       desc:"Earn 500,000 bones total",              req:(s)=>s.totalBones>=500000, reward:5000,tier:"legend" },
  { id:"run1000",      label:"The Long Game",     desc:"Complete 1,000 runs",                   req:(s)=>s.totalRuns>=1000,    reward:3000,tier:"legend" },
  { id:"combo60",      label:"Untouchable",       desc:"Reach a x60 combo in one run",          req:(s)=>s.maxCombo>=60,       reward:1500,tier:"legend" },
  { id:"nearmiss200",  label:"Ghost of the Plains",desc:"Land 200 near misses total",           req:(s)=>s.totalNearMiss>=200, reward:2000,tier:"legend" },
  { id:"dist1_nodash", label:"Pure Runner",       desc:"Run 2,000m without ever dashing",       req:(s)=>s.bestDistNoDash>=2000,reward:2500,tier:"legend" },
  { id:"all_sceneries",label:"Master Explorer",   desc:"Own all sceneries",                     req:(s)=>s.ownedSceneries>=8,  reward:4000,tier:"legend" },
  { id:"passive100",   label:"The Idle One",      desc:"Earn 100 bones passively in one session",req:(s)=>s.passiveEarned>=100,reward:1500,tier:"legend" },
];


// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getUpgradeCost(up, level) { return Math.floor(up.baseCost * Math.pow(1.8, level)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function hexToRgb(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}
function mixHex(a, b, t) {
  const [ar,ag,ab] = hexToRgb(a), [br,bg,bb] = hexToRgb(b);
  return `rgb(${Math.round(lerp(ar,br,t))},${Math.round(lerp(ag,bg,t))},${Math.round(lerp(ab,bb,t))})`;
}

// ─── SCENERY HELPERS ──────────────────────────────────────────────────────────
function getSceneryColors(scenery, nightBlend) {
  const s = scenery || SCENERIES[0];
  return {
    bg:        mixHex(s.dayBg,    s.nightBg,   nightBlend),
    ground:    s.groundColor,
    groundTop: s.groundTop,
    cloud:     s.cloudColor,
    accent:    s.accentColor,
  };
}

// Per-scenery HUD palette: { hud, fossil, heart, bonePick }
// hud = text/score color, fossil = diamond icon color, heart = heart fill, bonePick = pickup diamond
const SCENERY_HUD = {
  classic: { hud:["#222222","#dddddd"], fossil:["#888888","#ccccaa"], heart:["#dd2244","#ff4466"], bonePick:["#888888","#cccc99"] },
  plains:  { hud:["#2a4a10","#aaddaa"], fossil:["#5a8a30","#88cc55"], heart:["#cc3322","#ff5544"], bonePick:["#6a9a40","#aadd66"] },
  desert:  { hud:["#7a3a00","#ffcc66"], fossil:["#cc7700","#ffaa22"], heart:["#cc4400","#ff6622"], bonePick:["#cc8820","#ffcc44"] },
  arctic:  { hud:["#224466","#aaddff"], fossil:["#4488bb","#88ccff"], heart:["#2255aa","#44aaff"], bonePick:["#5599cc","#aaddff"] },
  volcano: { hud:["#ff6600","#ffaa44"], fossil:["#ff4400","#ff8844"], heart:["#ff2200","#ff6600"], bonePick:["#ff5500","#ffaa22"] },
  jungle:  { hud:["#1a5a10","#88ff44"], fossil:["#2a8a10","#66dd22"], heart:["#228822","#44ff44"], bonePick:["#3a9a20","#88ee44"] },
  ruins:   { hud:["#5a4a28","#ddcc88"], fossil:["#8a6a30","#ccaa55"], heart:["#884422","#cc7744"], bonePick:["#9a7a40","#ccaa55"] },
  cave:    { hud:["#8844ff","#cc88ff"], fossil:["#aa44ff","#dd99ff"], heart:["#8822cc","#cc44ff"], bonePick:["#9933ee","#cc77ff"] },
};
function getHudColors(scenery, nightBlend) {
  const p = SCENERY_HUD[scenery?.id] || SCENERY_HUD.classic;
  const t = Math.min(1, nightBlend * 2); // 0=day, 1=night
  return {
    hud:     t < 0.5 ? p.hud[0]    : p.hud[1],
    fossil:  t < 0.5 ? p.fossil[0] : p.fossil[1],
    heart:   t < 0.5 ? p.heart[0]  : p.heart[1],
    bonePick:t < 0.5 ? p.bonePick[0]: p.bonePick[1],
  };
}

// ─── DRAW: CELESTIAL BODIES ───────────────────────────────────────────────────
function drawPixelSun(ctx, x, y, alpha) {
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

function drawPixelMoon(ctx, x, y, alpha) {
  if(alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  const pixels = [[-4,-12],[0,-12],[4,-12],[-8,-8],[-4,-8],[0,-8],[4,-8],[-12,-4],[-8,-4],[-4,-4],[0,-4],[-12,0],[-8,0],[-4,0],[-12,4],[-8,4],[-4,4],[0,4],[-8,8],[-4,8],[0,8],[-4,12],[0,12]];
  ctx.fillStyle = "#e8e0aa";
  for(const [px,py] of pixels) ctx.fillRect(x+px, y+py, 4, 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x+18, y-8, 2, 2); ctx.fillRect(x+24, y+4, 2, 2); ctx.fillRect(x+14, y+14, 2, 2);
  ctx.globalAlpha = 1; ctx.restore();
}

// ─── DRAW: DINO DESIGNS ───────────────────────────────────────────────────────
// onGround controls whether legs run (false = airborne = legs frozen mid-stride)
function drawDino(ctx, x, y, frame, dead, skin, design, isGiant, isDucking, isTiny, isGhost, invTimer, onGround, deathAnim) {
  const c  = skin?.color      || "#2a2a2a";
  const ec = skin?.eyeColor   || "#f0f0f0";
  const ac = skin?.accent     || "#3a3a3a";
  const pc = skin?.plateColor || "#333";
  const fc = skin?.frillColor || "#444";
  const id = design?.id || "raptor";

  ctx.save();

  if(isGhost) ctx.globalAlpha = 0.5;
  if(invTimer > 0 && Math.floor(invTimer/4)%2 === 0) { ctx.restore(); return; }

  const scale = isGiant ? 1.9 : isTiny ? 0.6 : 1;
  if(scale !== 1) {
    const bx = x + DINO_W/2, by = y + DINO_H;
    ctx.translate(bx,by); ctx.scale(scale,scale); ctx.translate(-bx,-by);
  }

  // Death tumble: rotate around center
  if(dead && deathAnim) {
    const cx2 = x + DINO_W/2, cy2 = y + DINO_H/2;
    const angle = Math.min(deathAnim.angle || 0, Math.PI * 1.1);
    ctx.translate(cx2, cy2);
    ctx.rotate(angle);
    ctx.translate(-cx2, -cy2);
  }

  // Leg frame: only animate when on ground and not dead
  // When airborne, freeze legs in a fixed mid-stride pose (f=0)
  const animLegs = onGround && !dead;
  const f  = animLegs ? Math.floor(frame/5)%2 : 0;
  const f3 = animLegs ? Math.floor(frame/4)%3 : 0; // 3-frame cycle
  // Wing flap always animates (pterodactyl)
  const wf = Math.floor(frame/6)%2;

  const g = GROUND_Y;

  // ── RAPTOR ────────────────────────────────────────────────────────────────
  if(id === "raptor") {
    if(isDucking) {
      // Duck: low crouched profile
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+2, y+DINO_H-DUCK_H, 34, DUCK_H-6);
      ctx.fillRect(x+16, y+DINO_H-DUCK_H-10, 22, 14);
      // Tail flush
      ctx.fillRect(x-8, y+DINO_H-DUCK_H+2, 12, 5);
      // Neck connects cleanly  ENO stripe here
      // Eye
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+30, y+DINO_H-DUCK_H-8, 6, 6);
      ctx.fillStyle = "#000";
      ctx.fillRect(x+32, y+DINO_H-DUCK_H-6, 3, 3);
      // Feet tucked
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+8,  y+DINO_H-6, 7, 6);
      ctx.fillRect(x+22, y+DINO_H-6, 7, 6);
    } else {
      // Body  Eone unified shape, no stripe
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+6, y+14, 28, 22);   // torso
      // Neck+head as one block  ENO neck stripe
      ctx.fillRect(x+20, y+2, 20, 16);   // head+neck block
      // Belly accent  Eonly on belly, not the neck
      ctx.fillStyle = dead ? "#666" : ac;
      ctx.fillRect(x+8, y+26, 24, 6);    // belly stripe only on lower torso
      // Tail
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x-4,  y+22, 12, 5);
      ctx.fillRect(x-10, y+26, 8,  4);
      ctx.fillRect(x-14, y+28, 6,  3);
      // Arms (tiny raptor arms)
      ctx.fillRect(x+12, y+18, 8, 5);
      ctx.fillRect(x+12, y+23, 6, 3);
      // Eye
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+32, y+3, 6, 6);
      ctx.fillStyle = "#000";
      ctx.fillRect(x+34, y+5, 3, 3);
      // Nostril
      ctx.fillStyle = dead ? "#666" : ac;
      ctx.fillRect(x+38, y+5, 2, 2);
      // Death X eyes
      if(dead) {
        ctx.fillStyle = "#777";
        ctx.fillRect(x+30, y+5, 8, 2);
        ctx.fillRect(x+33, y+3, 2, 6);
      }
      // Legs
      ctx.fillStyle = dead ? "#888" : c;
      if(!dead) {
        if(f === 0) {
          // Left leg back, right leg forward
          ctx.fillRect(x+9,  y+36, 7, 10); // back leg straight
          ctx.fillRect(x+9,  y+46, 10, 3); // back foot
          ctx.fillRect(x+22, y+36, 7, 5);  // front leg up
          ctx.fillRect(x+22, y+41, 10, 4); // front shin angled
          ctx.fillRect(x+28, y+45, 8,  3); // front foot
        } else {
          ctx.fillRect(x+9,  y+36, 7, 5);  // back leg up
          ctx.fillRect(x+9,  y+41, 10, 4); // back shin
          ctx.fillRect(x+15, y+45, 8,  3); // back foot
          ctx.fillRect(x+22, y+36, 7, 10); // front leg straight
          ctx.fillRect(x+22, y+46, 10, 3); // front foot
        }
      } else {
        ctx.fillRect(x+9,  y+36, 7, 12);
        ctx.fillRect(x+22, y+36, 7, 12);
      }
    }

  // ── T-REX ─────────────────────────────────────────────────────────────────
  } else if(id === "trex") {
    if(isDucking) {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+2, y+DINO_H-DUCK_H, 36, DUCK_H-4);
      ctx.fillRect(x+16, y+DINO_H-DUCK_H-14, 22, 18);
      // Tiny arms even when ducking
      ctx.fillRect(x+14, y+DINO_H-DUCK_H+2, 8, 5);
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+30, y+DINO_H-DUCK_H-10, 7, 7);
      ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+DINO_H-DUCK_H-8, 4, 4);
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+8,  y+DINO_H-5, 9, 5);
      ctx.fillRect(x+24, y+DINO_H-5, 9, 5);
    } else {
      // Stocky body  Eunified, no neck stripe
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+2,  y+10, 34, 28);  // big torso
      ctx.fillRect(x+16, y+0,  22, 14);  // head block
      // Tail
      ctx.fillRect(x-4,  y+20, 8,  6);
      ctx.fillRect(x-10, y+24, 8,  5);
      ctx.fillRect(x-14, y+27, 6,  4);
      // Tiny T-Rex arms (iconic!)
      ctx.fillStyle = dead ? "#777" : ac;
      ctx.fillRect(x+10, y+16, 10, 6);
      ctx.fillRect(x+10, y+22, 7,  3);
      ctx.fillRect(x+17, y+24, 5,  3);
      // Belly
      ctx.fillStyle = dead ? "#888" : c;
      // Eye
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+32, y+2, 7, 7);
      ctx.fillStyle = "#000"; ctx.fillRect(x+34, y+4, 4, 4);
      if(dead) { ctx.fillStyle="#777"; ctx.fillRect(x+30,y+4,8,2); ctx.fillRect(x+33,y+2,2,6); }
      // Legs
      ctx.fillStyle = dead ? "#888" : c;
      if(!dead) {
        if(f === 0) {
          ctx.fillRect(x+6,  y+38, 9, 10); ctx.fillRect(x+6,  y+48, 13, 4);
          ctx.fillRect(x+22, y+38, 9, 5);  ctx.fillRect(x+22, y+43, 12, 5); ctx.fillRect(x+30, y+48, 8, 4);
        } else {
          ctx.fillRect(x+6,  y+38, 9, 5);  ctx.fillRect(x+6,  y+43, 12, 5); ctx.fillRect(x+14, y+48, 8, 4);
          ctx.fillRect(x+22, y+38, 9, 10); ctx.fillRect(x+22, y+48, 13, 4);
        }
      } else {
        ctx.fillRect(x+6, y+38, 9, 12); ctx.fillRect(x+22, y+38, 9, 12);
      }
    }

  // ── STEGOSAURUS ───────────────────────────────────────────────────────────
  } else if(id === "stego") {
    if(isDucking) {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+4, y+DINO_H-DUCK_H, 34, DUCK_H-4);
      ctx.fillRect(x+16, y+DINO_H-DUCK_H-12, 20, 16);
      ctx.fillStyle = dead ? "#666" : pc;
      for(let i=0;i<3;i++) ctx.fillRect(x+10+i*9, y+DINO_H-DUCK_H-5-i*2, 5, 7+i*2);
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+28, y+DINO_H-DUCK_H-8, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+DINO_H-DUCK_H-6, 3, 3);
    } else {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+4, y+14, 30, 24);  // torso
      ctx.fillRect(x+18, y+4, 18, 14); // head/neck unified
      // Back plates  Ealternating heights
      ctx.fillStyle = dead ? "#666" : pc;
      const plateHeights = [10, 14, 16, 14, 10, 7];
      for(let i=0;i<6;i++) {
        const ph = plateHeights[i];
        ctx.fillRect(x+6+i*5, y+10-ph, 4, ph);
      }
      ctx.fillStyle = dead ? "#888" : c;
      // Club tail
      ctx.fillRect(x-4,  y+22, 10, 5);
      ctx.fillRect(x-10, y+24, 8,  5);
      ctx.fillStyle = dead ? "#666" : pc;
      ctx.fillRect(x-14, y+22, 8,  9); // club
      ctx.fillStyle = dead ? "#888" : c;
      // Short arms
      ctx.fillRect(x+10, y+20, 7, 5);
      ctx.fillRect(x+10, y+25, 5, 3);
      // Eye
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+28, y+6, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+8, 3, 3);
      if(dead) { ctx.fillStyle="#777"; ctx.fillRect(x+26,y+8,8,2); ctx.fillRect(x+29,y+6,2,6); }
      // Legs  Estego has 4 stout legs drawn as 2 pairs visible
      ctx.fillStyle = dead ? "#888" : c;
      if(!dead) {
        if(f === 0) {
          ctx.fillRect(x+8,  y+38, 8, 10); ctx.fillRect(x+8,  y+48, 10, 3);
          ctx.fillRect(x+22, y+38, 8, 6);  ctx.fillRect(x+22, y+44, 10, 4); ctx.fillRect(x+28, y+48, 6, 3);
        } else {
          ctx.fillRect(x+8,  y+38, 8, 6);  ctx.fillRect(x+8,  y+44, 10, 4); ctx.fillRect(x+14, y+48, 6, 3);
          ctx.fillRect(x+22, y+38, 8, 10); ctx.fillRect(x+22, y+48, 10, 3);
        }
      } else {
        ctx.fillRect(x+8, y+38, 8, 10); ctx.fillRect(x+22, y+38, 8, 10);
      }
    }

  // ── PTERODACTYL ───────────────────────────────────────────────────────────
  } else if(id === "pterodac") {
    // Pterodactyl always "flies"  Eno ground legs, wings always animate
    ctx.fillStyle = dead ? "#888" : c;
    // Body
    ctx.fillRect(x+10, y+16, 24, 16);
    // Neck + head  Eno stripe
    ctx.fillRect(x+20, y+6,  18, 13);
    // Long beak/crest
    ctx.fillRect(x+30, y+2,  14, 4);
    // Back crest
    ctx.fillStyle = dead ? "#666" : fc;
    ctx.fillRect(x+10, y+10, 3, 8);
    ctx.fillRect(x+13, y+7,  3, 11);
    ctx.fillRect(x+16, y+5,  3, 13);
    // Wings  Eflap based on frame (always animates regardless of ground)
    ctx.fillStyle = dead ? "#777" : ac;
    if(wf === 0) {
      // Wings up
      ctx.fillRect(x-10, y+4,  22, 8);
      ctx.fillRect(x-16, y+2,  8,  6);
      ctx.fillRect(x+32, y+4,  20, 8);
      ctx.fillRect(x+50, y+2,  8,  6);
    } else {
      // Wings mid
      ctx.fillRect(x-6,  y+14, 18, 6);
      ctx.fillRect(x-10, y+18, 6,  5);
      ctx.fillRect(x+30, y+14, 18, 6);
      ctx.fillRect(x+46, y+18, 6,  5);
    }
    // Membrane texture
    ctx.fillStyle = dead ? "#777" : c;
    ctx.fillRect(x+0,  y+20, 12, 3);
    ctx.fillRect(x+32, y+20, 12, 3);
    // Eye
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+32, y+8, 5, 5);
    ctx.fillStyle = "#000"; ctx.fillRect(x+33, y+9, 3, 3);
    if(dead) { ctx.fillStyle="#777"; ctx.fillRect(x+30,y+9,7,2); ctx.fillRect(x+33,y+7,2,5); }
    // Feet/talons dangling
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+14, y+32, 5, 8); ctx.fillRect(x+10, y+40, 8, 3);
    ctx.fillRect(x+24, y+32, 5, 8); ctx.fillRect(x+22, y+40, 8, 3);

  // ── ANKYLOSAURUS ──────────────────────────────────────────────────────────
  } else if(id === "anky") {
    if(isDucking) {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+0, y+DINO_H-DUCK_H, 40, DUCK_H);
      ctx.fillRect(x+16, y+DINO_H-DUCK_H-10, 20, 14);
      ctx.fillStyle = dead ? "#666" : pc;
      for(let i=0;i<5;i++) ctx.fillRect(x+2+i*7, y+DINO_H-DUCK_H-4, 6, 6);
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+28, y+DINO_H-DUCK_H-6, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+DINO_H-DUCK_H-4, 3, 3);
    } else {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+0,  y+12, 40, 26);  // wide body
      ctx.fillRect(x+16, y+4,  20, 12);  // head unified
      // Armor scutes on back
      ctx.fillStyle = dead ? "#666" : pc;
      for(let i=0;i<6;i++) ctx.fillRect(x+2+i*6, y+8, 5, 6);
      // Armor rows on sides
      ctx.fillStyle = dead ? "#777" : ac;
      ctx.fillRect(x+2,  y+18, 36, 3);
      ctx.fillRect(x+2,  y+26, 36, 3);
      ctx.fillStyle = dead ? "#888" : c;
      // Club tail  Ebig
      ctx.fillRect(x-6,  y+20, 10, 6);
      ctx.fillRect(x-12, y+18, 8,  10);
      ctx.fillStyle = dead ? "#666" : pc;
      ctx.fillRect(x-18, y+17, 10, 12); // club head
      ctx.fillStyle = dead ? "#888" : c;
      // Eye
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+28, y+6, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+8, 3, 3);
      if(dead) { ctx.fillStyle="#777"; ctx.fillRect(x+26,y+8,8,2); ctx.fillRect(x+29,y+6,2,6); }
      // Legs  E4 stout legs
      ctx.fillStyle = dead ? "#888" : c;
      if(!dead) {
        if(f === 0) {
          ctx.fillRect(x+4,  y+38, 9, 10); ctx.fillRect(x+4,  y+48, 12, 4);
          ctx.fillRect(x+22, y+38, 9, 6);  ctx.fillRect(x+22, y+44, 12, 4); ctx.fillRect(x+30, y+48, 8, 4);
        } else {
          ctx.fillRect(x+4,  y+38, 9, 6);  ctx.fillRect(x+4,  y+44, 12, 4); ctx.fillRect(x+12, y+48, 8, 4);
          ctx.fillRect(x+22, y+38, 9, 10); ctx.fillRect(x+22, y+48, 12, 4);
        }
      } else {
        ctx.fillRect(x+4, y+38, 9, 12); ctx.fillRect(x+22, y+38, 9, 12);
      }
    }

  // ── TRICERATOPS ───────────────────────────────────────────────────────────
  } else if(id === "tri") {
    if(isDucking) {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+4, y+DINO_H-DUCK_H, 34, DUCK_H-2);
      ctx.fillRect(x+16, y+DINO_H-DUCK_H-14, 24, 18);
      ctx.fillStyle = dead ? "#777" : pc;
      ctx.fillRect(x+30, y+DINO_H-DUCK_H-10, 5, 12);
      ctx.fillRect(x+36, y+DINO_H-DUCK_H-8,  4, 10);
      ctx.fillRect(x+24, y+DINO_H-DUCK_H-8,  4, 10);
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+28, y+DINO_H-DUCK_H-8, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+DINO_H-DUCK_H-6, 3, 3);
    } else {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+4,  y+12, 30, 26);  // body
      ctx.fillRect(x+16, y+2,  24, 16);  // head
      // Neck frill  Edramatic
      ctx.fillStyle = dead ? "#666" : fc;
      ctx.fillRect(x+14, y-6,  22, 10);
      ctx.fillRect(x+16, y-10, 18, 6);
      ctx.fillStyle = dead ? "#777" : pc;
      // Three horns
      ctx.fillRect(x+33, y-2, 5, 14);   // main horn
      ctx.fillRect(x+38, y+4, 4, 10);   // right horn
      ctx.fillRect(x+27, y+4, 4, 10);   // left horn
      ctx.fillStyle = dead ? "#888" : c;
      // Tail
      ctx.fillRect(x-4,  y+22, 10, 5);
      ctx.fillRect(x-10, y+25, 8,  4);
      // Eye
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+28, y+4, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+6, 3, 3);
      if(dead) { ctx.fillStyle="#777"; ctx.fillRect(x+26,y+6,8,2); ctx.fillRect(x+29,y+4,2,6); }
      // Legs
      ctx.fillStyle = dead ? "#888" : c;
      if(!dead) {
        if(f === 0) {
          ctx.fillRect(x+8,  y+38, 8, 10); ctx.fillRect(x+8,  y+48, 11, 4);
          ctx.fillRect(x+22, y+38, 8, 5);  ctx.fillRect(x+22, y+43, 11, 5); ctx.fillRect(x+29, y+48, 8, 4);
        } else {
          ctx.fillRect(x+8,  y+38, 8, 5);  ctx.fillRect(x+8,  y+43, 11, 5); ctx.fillRect(x+15, y+48, 8, 4);
          ctx.fillRect(x+22, y+38, 8, 10); ctx.fillRect(x+22, y+48, 11, 4);
        }
      } else {
        ctx.fillRect(x+8, y+38, 8, 12); ctx.fillRect(x+22, y+38, 8, 12);
      }
    }

  // ── BRACHIOSAURUS ─────────────────────────────────────────────────────────
  } else if(id === "brachio") {
    if(isDucking) {
      // Brachio crouches, long neck bends down
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+2,  y+DINO_H-DUCK_H, 36, DUCK_H);
      ctx.fillRect(x+20, y+DINO_H-DUCK_H-10, 12, 16);
      // Neck angled down
      ctx.fillRect(x+10, y+DINO_H-DUCK_H-14, 12, 8);
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+26, y+DINO_H-DUCK_H-8, 5, 5);
      ctx.fillStyle = "#000"; ctx.fillRect(x+28, y+DINO_H-DUCK_H-6, 3, 3);
    } else {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+0,  y+18, 40, 20);  // wide low body
      // Long neck going up (brachio's defining feature)
      ctx.fillRect(x+24, y+2,  10, 20);  // neck segment 1
      ctx.fillRect(x+22, y-6,  12, 12);  // head
      // Small head bump
      ctx.fillStyle = dead ? "#666" : ac;
      ctx.fillRect(x+22, y+6,  10, 6);   // neck shading
      ctx.fillStyle = dead ? "#888" : c;
      // Tail  Elong sweeping
      ctx.fillRect(x-6,  y+24, 10, 5);
      ctx.fillRect(x-12, y+27, 8,  4);
      ctx.fillRect(x-18, y+29, 8,  3);
      ctx.fillRect(x-22, y+31, 6,  2);
      // Tiny arms
      ctx.fillRect(x+8,  y+22, 8, 5);
      ctx.fillRect(x+8,  y+27, 6, 3);
      // Eye high up
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+28, y-4, 5, 5);
      ctx.fillStyle = "#000"; ctx.fillRect(x+29, y-3, 3, 3);
      if(dead) { ctx.fillStyle="#777"; ctx.fillRect(x+26,y-2,7,2); ctx.fillRect(x+29,y-4,2,5); }
      // 4 column legs
      ctx.fillStyle = dead ? "#888" : c;
      if(!dead) {
        if(f === 0) {
          ctx.fillRect(x+4,  y+38, 9, 10); ctx.fillRect(x+4,  y+48, 12, 3);
          ctx.fillRect(x+14, y+38, 9, 6);  ctx.fillRect(x+14, y+44, 12, 4); ctx.fillRect(x+22, y+48, 8, 3);
          ctx.fillRect(x+24, y+38, 8, 9);  ctx.fillRect(x+24, y+47, 11, 4);
          ctx.fillRect(x+32, y+38, 7, 5);
        } else {
          ctx.fillRect(x+4,  y+38, 9, 5);  ctx.fillRect(x+4,  y+43, 12, 5); ctx.fillRect(x+12, y+48, 8, 3);
          ctx.fillRect(x+14, y+38, 9, 10); ctx.fillRect(x+14, y+48, 12, 3);
          ctx.fillRect(x+24, y+38, 8, 5);
          ctx.fillRect(x+32, y+38, 7, 9);  ctx.fillRect(x+32, y+47, 10, 4);
        }
      } else {
        ctx.fillRect(x+4,y+38,9,12); ctx.fillRect(x+16,y+38,9,12); ctx.fillRect(x+28,y+38,8,12);
      }
    }

  // ── SPINOSAURUS ───────────────────────────────────────────────────────────
  } else if(id === "spino") {
    if(isDucking) {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+2, y+DINO_H-DUCK_H, 36, DUCK_H-4);
      ctx.fillRect(x+18, y+DINO_H-DUCK_H-12, 20, 16);
      // Sail flattened
      ctx.fillStyle = dead ? "#666" : fc;
      for(let i=0;i<4;i++) ctx.fillRect(x+8+i*7, y+DINO_H-DUCK_H-3, 4, 5);
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+30, y+DINO_H-DUCK_H-9, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+DINO_H-DUCK_H-7, 3, 3);
    } else {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+4,  y+12, 30, 24);  // body
      ctx.fillRect(x+20, y+2,  18, 14);  // head (croc-like snout)
      // Extended croc snout
      ctx.fillRect(x+32, y+6, 10, 5);   // snout extension
      // Neural sail  Edramatic fin on back
      ctx.fillStyle = dead ? "#666" : fc;
      const sailH = [8, 14, 18, 22, 18, 14, 8];
      for(let i=0;i<7;i++) ctx.fillRect(x+4+i*5, y+8-sailH[i], 4, sailH[i]);
      ctx.fillStyle = dead ? "#888" : c;
      // Tail
      ctx.fillRect(x-4,  y+22, 10, 6);
      ctx.fillRect(x-10, y+25, 8,  5);
      ctx.fillRect(x-16, y+28, 6,  4);
      // Arms (spino had longer arms than trex)
      ctx.fillRect(x+10, y+16, 10, 6);
      ctx.fillRect(x+10, y+22, 8,  4);
      ctx.fillRect(x+12, y+26, 6,  3);
      // Eye
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+30, y+4, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+6, 3, 3);
      if(dead) { ctx.fillStyle="#777"; ctx.fillRect(x+28,y+6,8,2); ctx.fillRect(x+31,y+4,2,6); }
      // Legs
      ctx.fillStyle = dead ? "#888" : c;
      if(!dead) {
        if(f === 0) {
          ctx.fillRect(x+8,  y+36, 8, 12); ctx.fillRect(x+8,  y+48, 11, 4);
          ctx.fillRect(x+22, y+36, 8, 6);  ctx.fillRect(x+22, y+42, 11, 6); ctx.fillRect(x+29, y+48, 8, 4);
        } else {
          ctx.fillRect(x+8,  y+36, 8, 6);  ctx.fillRect(x+8,  y+42, 11, 6); ctx.fillRect(x+15, y+48, 8, 4);
          ctx.fillRect(x+22, y+36, 8, 12); ctx.fillRect(x+22, y+48, 11, 4);
        }
      } else {
        ctx.fillRect(x+8, y+36, 8, 14); ctx.fillRect(x+22, y+36, 8, 14);
      }
    }

  // ── PACHYCEPHALOSAURUS ────────────────────────────────────────────────────
  } else if(id === "pachy") {
    if(isDucking) {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+4, y+DINO_H-DUCK_H, 32, DUCK_H-4);
      ctx.fillRect(x+18, y+DINO_H-DUCK_H-12, 18, 16);
      // Dome still visible
      ctx.fillStyle = dead ? "#666" : pc;
      ctx.fillRect(x+18, y+DINO_H-DUCK_H-18, 18, 8);
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+28, y+DINO_H-DUCK_H-9, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+DINO_H-DUCK_H-7, 3, 3);
    } else {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+8,  y+14, 26, 22); // compact body
      ctx.fillRect(x+18, y+6,  18, 12); // neck
      // DOME HEAD  Edefining feature
      ctx.fillStyle = dead ? "#666" : pc;
      ctx.fillRect(x+18, y-4,  18, 12); // dome
      ctx.fillRect(x+20, y-8,  14, 6);  // dome top
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+18, y+6,  18, 8);  // lower head
      // Small arms
      ctx.fillRect(x+12, y+18, 8, 5);
      ctx.fillRect(x+12, y+23, 6, 3);
      // Tail
      ctx.fillRect(x+2,  y+24, 10, 5);
      ctx.fillRect(x-4,  y+26, 8,  4);
      ctx.fillRect(x-8,  y+28, 6,  3);
      // Eye
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+30, y+8, 5, 5);
      ctx.fillStyle = "#000"; ctx.fillRect(x+31, y+9, 3, 3);
      if(dead) { ctx.fillStyle="#777"; ctx.fillRect(x+28,y+9,7,2); ctx.fillRect(x+31,y+7,2,5); }
      // Legs  Ebipedal agile
      ctx.fillStyle = dead ? "#888" : c;
      if(!dead) {
        if(f === 0) {
          ctx.fillRect(x+10, y+36, 7, 12); ctx.fillRect(x+10, y+48, 10, 4);
          ctx.fillRect(x+22, y+36, 7, 6);  ctx.fillRect(x+22, y+42, 10, 6); ctx.fillRect(x+28, y+48, 8, 4);
        } else {
          ctx.fillRect(x+10, y+36, 7, 6);  ctx.fillRect(x+10, y+42, 10, 6); ctx.fillRect(x+16, y+48, 8, 4);
          ctx.fillRect(x+22, y+36, 7, 12); ctx.fillRect(x+22, y+48, 10, 4);
        }
      } else {
        ctx.fillRect(x+10, y+36, 7, 14); ctx.fillRect(x+22, y+36, 7, 14);
      }
    }

  // ── PARASAUROLOPHUS ───────────────────────────────────────────────────────
  } else if(id === "para") {
    if(isDucking) {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+4, y+DINO_H-DUCK_H, 32, DUCK_H-4);
      ctx.fillRect(x+18, y+DINO_H-DUCK_H-12, 18, 16);
      ctx.fillStyle = dead ? "#666" : fc;
      // Crest goes back when ducking
      ctx.fillRect(x+10, y+DINO_H-DUCK_H-20, 20, 6);
      ctx.fillRect(x+6,  y+DINO_H-DUCK_H-16, 12, 5);
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+28, y+DINO_H-DUCK_H-8, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+DINO_H-DUCK_H-6, 3, 3);
    } else {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+6,  y+14, 28, 22); // body
      ctx.fillRect(x+18, y+4,  18, 14); // head
      // Long tubular crest sweeping backward  Eiconic
      ctx.fillStyle = dead ? "#666" : fc;
      ctx.fillRect(x+18, y-4,  8,  10); // crest base
      ctx.fillRect(x+10, y-8,  10, 6);  // crest mid
      ctx.fillRect(x+0,  y-10, 12, 5);  // crest tip
      ctx.fillRect(x-6,  y-8,  8,  4);  // crest end
      ctx.fillStyle = dead ? "#888" : c;
      // Bill (flat duck bill)
      ctx.fillRect(x+34, y+8, 8,  5);
      ctx.fillRect(x+34, y+6, 6,  3);
      // Tail
      ctx.fillRect(x+0,  y+24, 10, 5);
      ctx.fillRect(x-6,  y+26, 8,  4);
      ctx.fillRect(x-10, y+28, 6,  3);
      // Arms
      ctx.fillRect(x+12, y+18, 8, 5);
      ctx.fillRect(x+12, y+23, 6, 3);
      // Eye
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+30, y+6, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+8, 3, 3);
      if(dead) { ctx.fillStyle="#777"; ctx.fillRect(x+28,y+8,8,2); ctx.fillRect(x+31,y+6,2,6); }
      // Legs
      ctx.fillStyle = dead ? "#888" : c;
      if(!dead) {
        if(f === 0) {
          ctx.fillRect(x+8,  y+36, 8, 12); ctx.fillRect(x+8,  y+48, 11, 4);
          ctx.fillRect(x+22, y+36, 8, 6);  ctx.fillRect(x+22, y+42, 11, 6); ctx.fillRect(x+29, y+48, 8, 4);
        } else {
          ctx.fillRect(x+8,  y+36, 8, 6);  ctx.fillRect(x+8,  y+42, 11, 6); ctx.fillRect(x+15, y+48, 8, 4);
          ctx.fillRect(x+22, y+36, 8, 12); ctx.fillRect(x+22, y+48, 11, 4);
        }
      } else {
        ctx.fillRect(x+8, y+36, 8, 14); ctx.fillRect(x+22, y+36, 8, 14);
      }
    }

  // ── DILOPHOSAURUS ─────────────────────────────────────────────────────────
  } else if(id === "dilopho") {
    if(isDucking) {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+2, y+DINO_H-DUCK_H, 34, DUCK_H-6);
      ctx.fillRect(x+18, y+DINO_H-DUCK_H-10, 20, 14);
      // Frill fanned
      ctx.fillStyle = dead ? "#666" : fc;
      ctx.fillRect(x+28, y+DINO_H-DUCK_H-16, 12, 8);
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+28, y+DINO_H-DUCK_H-7, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+DINO_H-DUCK_H-5, 3, 3);
    } else {
      ctx.fillStyle = dead ? "#888" : c;
      ctx.fillRect(x+6,  y+14, 26, 22); // slender body
      ctx.fillRect(x+20, y+2,  18, 14); // head
      // Double head crest (2 parallel crests)
      ctx.fillStyle = dead ? "#666" : fc;
      ctx.fillRect(x+22, y-6, 4, 10);   // crest 1
      ctx.fillRect(x+28, y-6, 4, 10);   // crest 2
      ctx.fillRect(x+20, y-8, 16, 4);   // crest base
      // Neck frill (fan-shaped)
      ctx.fillStyle = dead ? "#666" : fc;
      ctx.fillRect(x+34, y+4, 10, 6);   // frill right
      ctx.fillRect(x+36, y+2, 6,  10);  // frill fan
      ctx.fillStyle = dead ? "#888" : c;
      // Slender tail
      ctx.fillRect(x-2,  y+22, 10, 4);
      ctx.fillRect(x-8,  y+24, 8,  3);
      ctx.fillRect(x-14, y+26, 7,  3);
      ctx.fillRect(x-18, y+28, 6,  2);
      // Arms  Emedium length
      ctx.fillRect(x+12, y+17, 9, 5);
      ctx.fillRect(x+12, y+22, 7, 3);
      // Eye
      ctx.fillStyle = dead ? "#555" : ec;
      ctx.fillRect(x+30, y+4, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+6, 3, 3);
      if(dead) { ctx.fillStyle="#777"; ctx.fillRect(x+28,y+6,8,2); ctx.fillRect(x+31,y+4,2,6); }
      // Legs  Every agile sprinter
      ctx.fillStyle = dead ? "#888" : c;
      if(!dead) {
        if(f === 0) {
          ctx.fillRect(x+8,  y+36, 7, 12); ctx.fillRect(x+8,  y+48, 10, 4);
          ctx.fillRect(x+20, y+36, 7, 5);  ctx.fillRect(x+20, y+41, 10, 7); ctx.fillRect(x+26, y+48, 8, 4);
        } else {
          ctx.fillRect(x+8,  y+36, 7, 5);  ctx.fillRect(x+8,  y+41, 10, 7); ctx.fillRect(x+14, y+48, 8, 4);
          ctx.fillRect(x+20, y+36, 7, 12); ctx.fillRect(x+20, y+48, 10, 4);
        }
      } else {
        ctx.fillRect(x+8, y+36, 7, 14); ctx.fillRect(x+20, y+36, 7, 14);
      }
    }
  }

  ctx.restore();
}

// ─── DRAW: HEARTS ─────────────────────────────────────────────────────────────
function drawHeart(ctx, x, y, size = 12, color = "#dd2244") {
  const s = size / 12;
  ctx.fillStyle = color;
  ctx.fillRect(x+size*0.08, y,          size*0.35, size*0.4);
  ctx.fillRect(x+size*0.55, y,          size*0.35, size*0.4);
  ctx.fillRect(x,           y+size*0.25,size,       size*0.38);
  ctx.fillRect(x+size*0.08, y+size*0.6, size*0.84,  size*0.22);
  ctx.fillRect(x+size*0.22, y+size*0.8, size*0.55,  size*0.15);
  ctx.fillRect(x+size*0.38, y+size*0.92,size*0.25,  size*0.08);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(x+size*0.15, y+size*0.05,size*0.15,  size*0.2);
}

// ─── DRAW: OBSTACLES ──────────────────────────────────────────────────────────
function drawObstacleForScenery(ctx, o, scenery, frame) {
  const set = scenery?.obstacleSet || "plants";
  const sid = scenery?.id || "classic";
  const g   = GROUND_Y;

  if(o.otype === "bird") {
    const fw = Math.floor(frame/8)%2;
    // All birds face left  Eflip horizontally around bird center
    ctx.save();
    ctx.translate(o.x+20, 0);
    ctx.scale(-1, 1);
    ctx.translate(-o.x-20, 0);
    if(sid==="classic") {
      // Wasteland: angular pixel crow/raven, dark with sharp wings
      const col = o._nightBlend > 0.5 ? "#dddddd" : "#333333";
      ctx.fillStyle = col;
      ctx.fillRect(o.x+4,  o.y+8, 32, 8);   // body
      ctx.fillRect(o.x+12, o.y+2, 16, 8);   // head
      ctx.fillRect(o.x+26, o.y+4, 10, 6);   // beak
      if(fw===0){ ctx.fillRect(o.x,o.y-6,20,8); ctx.fillRect(o.x+22,o.y+14,16,6); }
      else       { ctx.fillRect(o.x+2,o.y+2,18,6); ctx.fillRect(o.x+22,o.y+16,14,5); }
    } else if(sid==="plains") {
      // Grasslands: plump round pterosaur-like bird, brown/tan
      ctx.fillStyle="#8a6a30";
      ctx.fillRect(o.x+6,  o.y+6, 28, 10);  // body
      ctx.fillRect(o.x+22, o.y+2, 14, 8);   // head
      ctx.fillRect(o.x+34, o.y+4, 8,  4);   // beak
      ctx.fillStyle="#c49a50";
      ctx.fillRect(o.x+24, o.y+3, 6, 4);    // eye patch
      ctx.fillStyle="#2a1a08"; ctx.fillRect(o.x+28,o.y+4,3,3); // eye
      ctx.fillStyle="#8a6a30";
      if(fw===0){ ctx.fillRect(o.x-2,o.y-4,22,8); ctx.fillRect(o.x+26,o.y+14,14,6); }
      else       { ctx.fillRect(o.x,o.y+4,20,6);  ctx.fillRect(o.x+26,o.y+16,12,5); }
    } else if(sid==="desert") {
      // Desert: vulture  Ehunched, bald head, wide soaring wings
      ctx.fillStyle="#5a3a18";
      ctx.fillRect(o.x+8,  o.y+8, 26, 10);  // body
      ctx.fillRect(o.x+22, o.y+2, 12, 10);  // hunched neck
      ctx.fillStyle="#e09060"; ctx.fillRect(o.x+24,o.y+2,8,6); // bald head
      ctx.fillStyle="#3a2010"; ctx.fillRect(o.x+30,o.y+4,3,3); // eye
      ctx.fillStyle="#5a3a18";
      if(fw===0){ ctx.fillRect(o.x-6,o.y+2,28,7); ctx.fillRect(o.x+28,o.y+2,20,7); } // wide soar
      else       { ctx.fillRect(o.x-2,o.y+8,24,5); ctx.fillRect(o.x+28,o.y+8,16,5); }
    } else if(sid==="arctic") {
      // Arctic: snowy owl  Eround white body, yellow eyes
      ctx.fillStyle="#ddeeff";
      ctx.fillRect(o.x+6,  o.y+4, 26, 14);  // round body
      ctx.fillRect(o.x+18, o.y,   14, 10);  // round head
      ctx.fillStyle="#ffdd44"; // yellow eyes
      ctx.fillRect(o.x+20,o.y+2,4,4); ctx.fillRect(o.x+26,o.y+2,4,4);
      ctx.fillStyle="#aabbcc"; ctx.fillRect(o.x+22,o.y+6,4,3); // beak
      ctx.fillStyle="#ddeeff";
      if(fw===0){ ctx.fillRect(o.x-2,o.y-2,20,8); ctx.fillRect(o.x+30,o.y-2,14,8); }
      else       { ctx.fillRect(o.x+2,o.y+6,16,6); ctx.fillRect(o.x+30,o.y+6,10,6); }
    } else if(sid==="volcano") {
      // Volcano: fire bat  Edark red, leathery wings, glowing eyes
      ctx.fillStyle="#6a1800";
      ctx.fillRect(o.x+8,  o.y+6, 22, 12);  // body
      ctx.fillRect(o.x+18, o.y+2, 12, 8);   // head
      ctx.fillStyle="#ff4400"; // glowing eyes
      ctx.fillRect(o.x+20,o.y+3,4,4); ctx.fillRect(o.x+26,o.y+3,4,4);
      ctx.fillStyle="#6a1800";
      if(fw===0){ // bat wings up
        ctx.fillRect(o.x-8,o.y-4,20,10); ctx.fillRect(o.x-14,o.y-8,10,8);
        ctx.fillRect(o.x+28,o.y-4,16,10); ctx.fillRect(o.x+42,o.y-8,8,8);
      } else {
        ctx.fillRect(o.x-4,o.y+10,16,8); ctx.fillRect(o.x-8,o.y+14,8,6);
        ctx.fillRect(o.x+28,o.y+10,12,8); ctx.fillRect(o.x+38,o.y+14,6,6);
      }
    } else if(sid==="jungle") {
      // Jungle: toucan  Ebright orange beak, black body, white chest
      ctx.fillStyle="#1a1a1a";
      ctx.fillRect(o.x+6,  o.y+6, 26, 12);  // body
      ctx.fillRect(o.x+18, o.y+2, 14, 10);  // head
      ctx.fillStyle="#ffffff"; ctx.fillRect(o.x+8,o.y+8,14,8); // white chest
      ctx.fillStyle="#ff8800"; ctx.fillRect(o.x+30,o.y+2,14,6); // big orange beak
      ctx.fillStyle="#ffdd00"; ctx.fillRect(o.x+30,o.y+2,6,3); // beak tip
      ctx.fillStyle="#ffffff"; ctx.fillRect(o.x+20,o.y+3,4,4); // eye
      ctx.fillStyle="#1a1a1a";
      if(fw===0){ ctx.fillRect(o.x-2,o.y-2,22,8); ctx.fillRect(o.x+26,o.y+14,14,6); }
      else       { ctx.fillRect(o.x+2,o.y+4,18,6); ctx.fillRect(o.x+26,o.y+16,12,5); }
    } else if(sid==="ruins") {
      // Ruins: archaeopteryx  Efeathered, brownish, primitive
      ctx.fillStyle="#7a5a30";
      ctx.fillRect(o.x+6,  o.y+6, 26, 10);  // body
      ctx.fillRect(o.x+20, o.y+2, 14, 8);   // head
      ctx.fillRect(o.x+32, o.y+4, 8,  4);   // beak
      ctx.fillStyle="#aa8850"; // feather detail
      ctx.fillRect(o.x+8,o.y+8,10,4); ctx.fillRect(o.x+20,o.y+8,8,4);
      ctx.fillStyle="#2a1a08"; ctx.fillRect(o.x+24,o.y+3,3,3);
      ctx.fillStyle="#7a5a30";
      if(fw===0){ ctx.fillRect(o.x-2,o.y-4,22,8); ctx.fillRect(o.x+26,o.y+14,14,6); }
      else       { ctx.fillRect(o.x+2,o.y+4,18,6); ctx.fillRect(o.x+26,o.y+16,12,5); }
    } else if(sid==="cave") {
      // Cave: glowing crystal bat  Epurple, bioluminescent
      ctx.fillStyle="#6633aa";
      ctx.fillRect(o.x+8,  o.y+6, 22, 12);  // body
      ctx.fillRect(o.x+18, o.y+2, 12, 8);   // head
      ctx.fillStyle="#cc88ff"; // glowing eyes
      ctx.fillRect(o.x+20,o.y+3,4,4); ctx.fillRect(o.x+26,o.y+3,4,4);
      ctx.fillStyle="rgba(160,80,255,0.3)"; ctx.fillRect(o.x+4,o.y,30,18); // glow
      ctx.fillStyle="#6633aa";
      if(fw===0){
        ctx.fillRect(o.x-8,o.y-4,20,10); ctx.fillRect(o.x-14,o.y-8,10,8);
        ctx.fillRect(o.x+28,o.y-4,16,10); ctx.fillRect(o.x+42,o.y-8,8,8);
      } else {
        ctx.fillRect(o.x-4,o.y+10,16,8); ctx.fillRect(o.x-8,o.y+14,8,6);
        ctx.fillRect(o.x+28,o.y+10,12,8); ctx.fillRect(o.x+38,o.y+14,6,6);
      }
    } else {
      // Default fallback
      ctx.fillStyle="#888";
      ctx.fillRect(o.x+2,o.y+8,36,9); ctx.fillRect(o.x+10,o.y+2,20,8); ctx.fillRect(o.x+28,o.y+4,12,7);
      if(fw===0){ ctx.fillRect(o.x+4,o.y-8,18,9); ctx.fillRect(o.x+18,o.y+16,16,7); }
      else       { ctx.fillRect(o.x+4,o.y+2,18,6); ctx.fillRect(o.x+18,o.y+18,14,6); }
    }
    ctx.restore();
    return;
  }

  if(sid === "classic") {
    const col = o._nightBlend > 0.5 ? "#dddddd" : "#222222";
    if(o.otype==="rock") {
      ctx.fillStyle = o._nightBlend > 0.5 ? "#aaaaaa" : "#555555";
      ctx.fillRect(o.x+4,g-18,28,18); ctx.fillRect(o.x,g-12,36,12); ctx.fillRect(o.x+8,g-22,18,6);
    } else if(o.otype==="spike") {
      ctx.fillStyle = col;
      for(let i=0;i<3;i++){const bx=o.x+i*14;ctx.beginPath();ctx.moveTo(bx+2,g);ctx.lineTo(bx+7,g-26);ctx.lineTo(bx+12,g);ctx.fill();}
    } else if(o.otype==="spike_cluster") {
      ctx.fillStyle = col;
      for(let i=0;i<5;i++){const bx=o.x+i*12;ctx.beginPath();ctx.moveTo(bx,g);ctx.lineTo(bx+6,g-30);ctx.lineTo(bx+12,g);ctx.fill();}
    } else if(o.otype==="turret") {
      const tc = o._nightBlend > 0.5 ? "#aaaaaa" : "#444444";
      ctx.fillStyle=tc;
      ctx.fillRect(o.x+4,g-28,32,28);  // base
      ctx.fillRect(o.x+8,g-36,24,10);  // turret body
      ctx.fillRect(o.x+28,g-32,14,6);  // barrel
      ctx.fillStyle=o._nightBlend>0.5?"#ff4444":"#cc0000";
      ctx.fillRect(o.x+10,g-34,6,6);   // eye/light
      // bullets
      ctx.fillStyle=o._nightBlend>0.5?"#ffff88":"#ffcc00";
      for(const b of (o.bullets||[])) ctx.fillRect(b.x,b.y,8,4);
    } else if(o.otype==="wall") {
      ctx.fillStyle = o._nightBlend > 0.5 ? "#999999" : "#333333";
      ctx.fillRect(o.x,g-28,18,28);
      ctx.fillStyle = o._nightBlend > 0.5 ? "#bbbbbb" : "#555555";
      for(let r=0;r<3;r++) ctx.fillRect(o.x+2,g-28+r*10,14,2);
    } else {
      const t=o.type||0; ctx.fillStyle=col;
      if(t===0){ctx.fillRect(o.x+10,g-44,10,44);ctx.fillRect(o.x+2,g-28,28,8);ctx.fillRect(o.x+2,g-36,10,12);ctx.fillRect(o.x+22,g-34,10,10);}
      else if(t===1){ctx.fillRect(o.x+8,g-62,10,62);ctx.fillRect(o.x,g-42,26,8);ctx.fillRect(o.x,g-54,10,15);ctx.fillRect(o.x+20,g-50,10,13);ctx.fillRect(o.x+20,g-60,14,10);}
      else if(t===2){ctx.fillRect(o.x+4,g-40,9,40);ctx.fillRect(o.x+20,g-40,9,40);ctx.fillRect(o.x+4,g-52,9,14);ctx.fillRect(o.x+18,g-52,12,9);ctx.fillRect(o.x,g-26,32,8);}
      else if(t===3){for(let i=0;i<3;i++){ctx.fillRect(o.x+i*16+4,g-36,8,36);ctx.fillRect(o.x+i*16,g-24,16,7);}}
      else{ctx.fillRect(o.x+14,g-34,12,34);ctx.fillRect(o.x,g-20,40,8);ctx.fillRect(o.x,g-28,14,10);ctx.fillRect(o.x+28,g-30,14,12);ctx.fillRect(o.x,g-34,14,8);ctx.fillRect(o.x+28,g-36,14,8);}
    }
  } else if(set === "desert") {
    if(o.otype==="cactus") {
      const t=o.type||0; ctx.fillStyle="#c87820";
      if(t===0){ctx.fillRect(o.x+10,g-48,10,48);ctx.fillRect(o.x+2,g-30,28,8);ctx.fillRect(o.x+2,g-38,10,12);ctx.fillRect(o.x+22,g-36,10,10);}
      else if(t===1){ctx.fillRect(o.x+8,g-66,10,66);ctx.fillRect(o.x,g-44,26,8);ctx.fillRect(o.x,g-56,10,15);ctx.fillRect(o.x+20,g-52,10,13);ctx.fillRect(o.x+20,g-64,14,10);}
      else{ctx.fillRect(o.x+4,g-44,9,44);ctx.fillRect(o.x+20,g-44,9,44);ctx.fillRect(o.x+4,g-56,9,15);ctx.fillRect(o.x+18,g-56,12,10);ctx.fillRect(o.x,g-28,32,8);}
    } else if(o.otype==="dune") {
      // Sand dune  Ewide mound, must jump over
      ctx.fillStyle="#e0a850";
      ctx.beginPath(); ctx.moveTo(o.x,g); ctx.lineTo(o.x+8,g-22); ctx.lineTo(o.x+28,g-22);
      ctx.lineTo(o.x+56,g); ctx.fill();
      ctx.fillStyle="#f0c060";
      ctx.beginPath(); ctx.moveTo(o.x+10,g-18); ctx.lineTo(o.x+20,g-22); ctx.lineTo(o.x+36,g-22);
      ctx.lineTo(o.x+46,g-18); ctx.fill();
      // Sand ripple lines
      ctx.fillStyle="#c89040";
      ctx.fillRect(o.x+14,g-14,18,2); ctx.fillRect(o.x+18,g-10,12,2);
    } else if(o.otype==="tumbleweed") {
      // Rolling tumbleweed  Ebounces as it moves
      const rot=(frame*0.12)%(Math.PI*2);
      const bounce=Math.abs(Math.sin(frame*0.18))*6;
      ctx.save();
      ctx.translate(o.x+18, g-18-bounce);
      ctx.rotate(rot);
      ctx.strokeStyle="#8a5a20"; ctx.lineWidth=3;
      // Cross sticks
      ctx.beginPath(); ctx.moveTo(-14,0); ctx.lineTo(14,0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-14); ctx.lineTo(0,14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-10,-10); ctx.lineTo(10,10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10,-10); ctx.lineTo(-10,10); ctx.stroke();
      // Outer ring
      ctx.strokeStyle="#6a4010"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.stroke();
      ctx.restore();
    } else if(o.otype==="sandworm") {
      // Sandworm  Ebursts from ground, animated height
      const wh = o._wormH||0;
      if(wh>2){
        ctx.fillStyle="#c87820";
        ctx.fillRect(o.x+8,g-wh,24,wh);  // body
        ctx.fillStyle="#e09030";
        ctx.fillRect(o.x+10,g-wh,20,8);  // head
        ctx.fillStyle="#2a1a08";
        ctx.fillRect(o.x+13,g-wh+2,5,4); // left eye
        ctx.fillRect(o.x+22,g-wh+2,5,4); // right eye
        // Teeth
        ctx.fillStyle="#f0f0e0";
        for(let i=0;i<4;i++) ctx.fillRect(o.x+11+i*5,g-wh+6,3,4);
        // Sand spray at base
        ctx.fillStyle="rgba(224,168,80,0.5)";
        ctx.fillRect(o.x+2,g-8,36,8);
      }
    } else if(o.otype==="scorpion") {
      // Scorpion  Elow ground enemy with raised stinger tail
      ctx.fillStyle="#8a4a10";
      ctx.fillRect(o.x+6,g-14,32,14);   // body
      ctx.fillRect(o.x+2,g-10,8,10);    // left claw
      ctx.fillRect(o.x+34,g-10,8,10);   // right claw
      ctx.fillRect(o.x,g-8,6,6);        // claw tip L
      ctx.fillRect(o.x+38,g-8,6,6);     // claw tip R
      // Segmented tail curving up
      ctx.fillStyle="#aa6020";
      ctx.fillRect(o.x+28,g-20,8,8);    // tail seg 1
      ctx.fillRect(o.x+32,g-30,7,12);   // tail seg 2
      ctx.fillRect(o.x+34,g-38,6,10);   // tail seg 3
      ctx.fillStyle="#cc2200";
      ctx.fillRect(o.x+35,g-44,5,8);    // stinger
      // Eyes
      ctx.fillStyle="#ff4400";
      ctx.fillRect(o.x+12,g-18,5,5);
      ctx.fillRect(o.x+27,g-18,5,5);
      // Venom projectiles
      ctx.fillStyle="#88ff00";
      for(const b of (o.bullets||[])) {
        ctx.fillRect(b.x,b.y,6,6);
        ctx.fillRect(b.x+2,b.y-2,2,2); // drip
      }
    } else {
      // fallback rock
      ctx.fillStyle="#d4a050"; ctx.fillRect(o.x,g-16,44,16); ctx.fillRect(o.x+4,g-24,36,10);
    }
  } else if(set === "arctic") {
    if(o.otype==="cactus") {
      // Ice spire
      const h=40+(o.type||0)*12;
      ctx.fillStyle="#88aabb";
      ctx.fillRect(o.x+10,g-h,12,h); ctx.fillRect(o.x+24,g-h*0.7,10,h*0.7); ctx.fillRect(o.x,g-h*0.5,10,h*0.5);
      ctx.fillStyle="#ddeeff"; ctx.fillRect(o.x+12,g-h,8,6); ctx.fillRect(o.x+26,g-h*0.7,6,4);
    } else if(o.otype==="icewall") {
      // Thick ice wall  Efrosted blue blocks
      ctx.fillStyle="#6699bb";
      ctx.fillRect(o.x,g-34,16,34);
      ctx.fillStyle="#88bbdd";
      ctx.fillRect(o.x+2,g-34,12,6);  // top frost cap
      ctx.fillRect(o.x+2,g-24,12,4);  // mid crack
      ctx.fillRect(o.x+2,g-14,12,4);  // lower crack
      // Ice glint
      ctx.fillStyle="rgba(220,240,255,0.6)";
      ctx.fillRect(o.x+3,g-32,4,8);
    } else if(o.otype==="snowball") {
      // Rolling snowball with bounce
      const bounce=Math.abs(Math.sin(frame*0.14))*5;
      const rot=(frame*0.09)%(Math.PI*2);
      ctx.save();
      ctx.translate(o.x+16,g-16-bounce);
      ctx.rotate(rot);
      ctx.fillStyle="#ddeeff";
      // Pixel circle approximation
      ctx.fillRect(-12,-6,24,12); ctx.fillRect(-8,-12,16,24);
      ctx.fillRect(-14,-4,28,8);
      ctx.fillStyle="#aaccee";
      ctx.fillRect(-10,-10,4,4); ctx.fillRect(6,-10,4,4);
      ctx.fillRect(-10,6,4,4);   ctx.fillRect(6,6,4,4);
      ctx.restore();
    } else if(o.otype==="icicle") {
      // Falling icicle  Edrops from top of screen
      const iy = o._icicleY ?? -20;
      ctx.fillStyle="#aaddff";
      ctx.fillRect(o.x+4,iy,10,24);
      ctx.fillStyle="#ddeeff";
      ctx.fillRect(o.x+5,iy,4,8);  // glint
      // Pointy tip
      ctx.fillStyle="#88ccee";
      ctx.beginPath();
      ctx.moveTo(o.x+4,iy+24); ctx.lineTo(o.x+9,iy+34); ctx.lineTo(o.x+14,iy+24);
      ctx.fill();
      // Impact crack if near ground
      if(iy>g-50){
        ctx.fillStyle="rgba(136,204,238,0.4)";
        ctx.fillRect(o.x,g-4,36,4);
      }
    } else if(o.otype==="yeti") {
      // Yeti  Elarge white furry creature
      ctx.fillStyle="#ddeeff";
      ctx.fillRect(o.x+6,g-52,32,52);  // body
      ctx.fillRect(o.x+10,g-60,24,12); // head
      // Fur texture bumps
      ctx.fillStyle="#bbddee";
      for(let i=0;i<4;i++) ctx.fillRect(o.x+6+i*8,g-52,6,6);
      for(let i=0;i<4;i++) ctx.fillRect(o.x+6+i*8,g-38,6,6);
      // Arms
      ctx.fillStyle="#ddeeff";
      ctx.fillRect(o.x,g-44,10,18);    // left arm
      ctx.fillRect(o.x+34,g-44,10,18); // right arm
      // Claws
      ctx.fillStyle="#aabbcc";
      ctx.fillRect(o.x-2,g-28,5,8); ctx.fillRect(o.x+3,g-28,5,8);
      ctx.fillRect(o.x+36,g-28,5,8); ctx.fillRect(o.x+41,g-28,5,8);
      // Eyes  Eangry red
      ctx.fillStyle="#ff2200";
      ctx.fillRect(o.x+13,g-58,6,6);
      ctx.fillRect(o.x+25,g-58,6,6);
      // Mouth
      ctx.fillStyle="#334455";
      ctx.fillRect(o.x+14,g-50,16,4);
      // Ice chunk projectiles
      ctx.fillStyle="#aaddff";
      for(const b of (o.bullets||[])) {
        ctx.fillRect(b.x,b.y,10,8);
        ctx.fillStyle="#ddeeff"; ctx.fillRect(b.x+1,b.y+1,4,3); ctx.fillStyle="#aaddff";
      }
    } else {
      ctx.fillStyle="#88aabb";
      const h=28;
      ctx.fillRect(o.x+10,g-h,12,h); ctx.fillRect(o.x+24,g-h*0.7,10,h*0.7);
      ctx.fillStyle="#ddeeff"; ctx.fillRect(o.x+12,g-h,8,6);
    }
  } else if(set === "volcano") {
    if(o.otype==="cactus"||o.otype==="spike") {
      // Keep original lava spire for cactus/spike
      ctx.fillStyle="#5a1800";
      ctx.fillRect(o.x+4,g-40,14,40); ctx.fillRect(o.x+20,g-30,14,30); ctx.fillRect(o.x,g-20,10,20);
      ctx.fillStyle="#cc3300"; ctx.fillRect(o.x+6,g-42,10,4); ctx.fillRect(o.x+22,g-32,10,4);
      ctx.fillStyle="#ff6600";
      if(Math.floor(frame/15)%2===0){ctx.fillRect(o.x+10,g-38,4,6); ctx.fillRect(o.x+25,g-28,3,5);}
    } else if(o.otype==="lavarock") {
      // Jagged molten boulder with glowing cracks
      ctx.fillStyle="#3a1a08";
      ctx.fillRect(o.x+4,g-26,38,26); ctx.fillRect(o.x,g-18,46,18); ctx.fillRect(o.x+8,g-30,28,6);
      // Jagged top
      ctx.fillStyle="#5a2a10";
      ctx.fillRect(o.x+2,g-22,8,6); ctx.fillRect(o.x+14,g-28,10,6); ctx.fillRect(o.x+30,g-24,10,6);
      // Glowing lava cracks
      const glow = Math.floor(frame/10)%2===0 ? "#ff4400" : "#ff6600";
      ctx.fillStyle=glow;
      ctx.fillRect(o.x+8,g-20,4,12); ctx.fillRect(o.x+20,g-24,3,16);
      ctx.fillRect(o.x+30,g-18,4,10); ctx.fillRect(o.x+14,g-14,6,8);
      // Ember glow
      ctx.fillStyle="rgba(255,100,0,0.3)";
      ctx.fillRect(o.x,g-32,46,6);
    } else if(o.otype==="firePillar") {
      // Pulsing fire column
      const pulse = Math.floor(frame/8)%3;
      const ph = 38 + pulse*6;
      // Stone base
      ctx.fillStyle="#3a1a08";
      ctx.fillRect(o.x+8,g-16,20,16);
      // Fire layers bottom to top
      ctx.fillStyle="#cc2200";
      ctx.fillRect(o.x+10,g-ph,16,ph-16);
      ctx.fillStyle="#ff4400";
      ctx.fillRect(o.x+12,g-ph-8,12,ph-10);
      ctx.fillStyle="#ff8800";
      ctx.fillRect(o.x+14,g-ph-14,8,ph-16);
      ctx.fillStyle="#ffcc00";
      ctx.fillRect(o.x+16,g-ph-18,4,10);
      // Flickering top embers
      if(pulse===0){
        ctx.fillStyle="#ff6600";
        ctx.fillRect(o.x+10,g-ph-20,4,6); ctx.fillRect(o.x+22,g-ph-16,4,6);
      }
    } else if(o.otype==="lavaburst") {
      // Lava geyser base + animated lava blobs
      ctx.fillStyle="#5a1800";
      ctx.fillRect(o.x+4,g-16,32,16);
      ctx.fillStyle="#882200";
      ctx.fillRect(o.x+10,g-20,20,6);
      // Vent opening
      ctx.fillStyle="#ff4400";
      ctx.fillRect(o.x+14,g-22,12,4);
      // Lava blobs (projectiles)
      for(const b of (o.bullets||[])){
        const bsize=8+Math.sin(frame*0.2)*2;
        ctx.fillStyle="#ff4400";
        ctx.fillRect(b.x-bsize/2,b.y-bsize/2,bsize,bsize);
        ctx.fillStyle="#ffaa00";
        ctx.fillRect(b.x-bsize/2+2,b.y-bsize/2+2,bsize-4,bsize-4);
      }
    } else if(o.otype==="firewall") {
      // Tall wall of flames  Emust jump over
      ctx.fillStyle="#3a1a08";
      ctx.fillRect(o.x+2,g-60,10,60);
      // Flame layers
      const fw=Math.floor(frame/6)%3;
      ctx.fillStyle="#cc2200";
      ctx.fillRect(o.x,g-60,14,60);
      ctx.fillStyle="#ff4400";
      ctx.fillRect(o.x+1,g-60-fw*4,12,60);
      ctx.fillStyle="#ff8800";
      ctx.fillRect(o.x+3,g-58-fw*6,8,50);
      ctx.fillStyle="#ffcc00";
      ctx.fillRect(o.x+5,g-52-fw*4,4,30);
      // Flame tips
      ctx.fillStyle="#ffee88";
      ctx.fillRect(o.x+6,g-62-fw*6,2,8);
    } else if(o.otype==="demon") {
      // Winged fire demon flying at mid height
      const dy = o.y;
      const wf = Math.floor(frame/5)%2;
      // Body
      ctx.fillStyle="#8a1a00";
      ctx.fillRect(o.x+10,dy+8,24,20);
      ctx.fillRect(o.x+14,dy+2,16,10); // head
      // Horns
      ctx.fillStyle="#cc2200";
      ctx.fillRect(o.x+14,dy-6,4,10);
      ctx.fillRect(o.x+26,dy-6,4,10);
      // Wings
      ctx.fillStyle="#cc3300";
      if(wf===0){
        ctx.fillRect(o.x-14,dy+2,26,10); ctx.fillRect(o.x-20,dy,10,8);
        ctx.fillRect(o.x+32,dy+2,18,10); ctx.fillRect(o.x+48,dy,8,8);
      } else {
        ctx.fillRect(o.x-8,dy+12,20,8);  ctx.fillRect(o.x-12,dy+16,8,6);
        ctx.fillRect(o.x+32,dy+12,16,8); ctx.fillRect(o.x+46,dy+16,6,6);
      }
      // Eyes
      ctx.fillStyle="#ffcc00";
      ctx.fillRect(o.x+15,dy+4,5,5);
      ctx.fillRect(o.x+24,dy+4,5,5);
      // Tail
      ctx.fillStyle="#8a1a00";
      ctx.fillRect(o.x+4,dy+20,10,6); ctx.fillRect(o.x,dy+24,8,5);
      ctx.fillStyle="#ff4400"; ctx.fillRect(o.x-2,dy+26,6,4);
      // Fireballs
      ctx.fillStyle="#ff6600";
      for(const b of (o.bullets||[])){
        ctx.fillRect(b.x,b.y,10,8);
        ctx.fillStyle="#ffcc00"; ctx.fillRect(b.x+2,b.y+2,4,3); ctx.fillStyle="#ff6600";
      }
    } else {
      ctx.fillStyle="#5a1800";
      ctx.fillRect(o.x,g-22,44,22); ctx.fillRect(o.x+4,g-28,36,8);
      ctx.fillStyle="#882200"; ctx.fillRect(o.x+2,g-24,40,3);
    }
  } else if(set === "jungle") {
    if(o.otype==="cactus") {
      // Jungle trees  E3 distinct types based on type index
      const t=o.type||0;
      if(t===0) {
        // Tall palm tree  Ethin trunk, fan of leaves at top
        ctx.fillStyle="#5a3a10";
        ctx.fillRect(o.x+12,g-58,8,58);  // trunk
        ctx.fillStyle="#1a6a10";
        // Fan leaves
        ctx.fillRect(o.x-10,g-62,18,8); ctx.fillRect(o.x+24,g-62,18,8);
        ctx.fillRect(o.x-4, g-70,14,10); ctx.fillRect(o.x+22,g-70,14,10);
        ctx.fillRect(o.x+6, g-74,20,12); // top center
        ctx.fillStyle="#2a8a20";
        ctx.fillRect(o.x+8,g-72,16,6);
      } else if(t===1) {
        // Wide banyan tree  Ethick trunk, broad layered canopy
        ctx.fillStyle="#4a2a08";
        ctx.fillRect(o.x+8, g-50,16,50); // main trunk
        ctx.fillRect(o.x,   g-30,8, 30); // left root
        ctx.fillRect(o.x+24,g-30,8, 30); // right root
        ctx.fillStyle="#1a5a10";
        ctx.fillRect(o.x-12,g-56,56,18); // lower canopy
        ctx.fillStyle="#2a7a18";
        ctx.fillRect(o.x-6, g-68,44,16); // mid canopy
        ctx.fillStyle="#3a9a22";
        ctx.fillRect(o.x+2, g-78,28,14); // top canopy
        // Hanging vines
        ctx.fillStyle="#1a4a08";
        ctx.fillRect(o.x+4, g-56,3,20); ctx.fillRect(o.x+26,g-56,3,24);
      } else {
        // Mushroom tree  Efat spotted cap on stubby trunk
        ctx.fillStyle="#6a3a18";
        ctx.fillRect(o.x+12,g-40,12,40); // trunk
        ctx.fillStyle="#cc3322"; // red cap
        ctx.fillRect(o.x-4, g-58,44,22);
        ctx.fillRect(o.x+2, g-66,32,12);
        ctx.fillRect(o.x+8, g-72,20,10);
        ctx.fillStyle="#ffffff"; // white spots
        ctx.fillRect(o.x+4, g-58,6,6); ctx.fillRect(o.x+18,g-62,5,5);
        ctx.fillRect(o.x+28,g-56,6,6); ctx.fillRect(o.x+12,g-54,4,4);
      }
    } else if(o.otype==="rock") {
      // Mossy jungle boulder
      ctx.fillStyle="#2a4a18";
      ctx.fillRect(o.x+2, g-20,40,20); ctx.fillRect(o.x+6, g-26,32,8);
      ctx.fillStyle="#3a6a28"; // moss top
      ctx.fillRect(o.x,   g-22,44,5);
      ctx.fillStyle="#1a3a10";
      ctx.fillRect(o.x+8, g-18,6,6); ctx.fillRect(o.x+22,g-16,5,5);
    } else if(o.otype==="vineTrap") {
      // Vine trap  Ehanging vines that snap shut (animated)
      const snap = o._snapState||0; // 0=open, 1=closing, 2=closed
      ctx.fillStyle="#1a5a10";
      // Anchor bar at top
      ctx.fillRect(o.x,g-60,40,6);
      // Left vine
      ctx.fillStyle="#2a7a18";
      const openL = snap>0.5 ? 4 : 14;
      ctx.fillRect(o.x+2,    g-54, 6, 54-openL);
      ctx.fillRect(o.x+2,    g-openL, 14, openL); // jaw
      // Right vine
      const openR = snap>0.5 ? 4 : 14;
      ctx.fillRect(o.x+32,   g-54, 6, 54-openR);
      ctx.fillRect(o.x+24,   g-openR, 14, openR); // jaw
      // Teeth
      ctx.fillStyle="#88ff44";
      for(let i=0;i<3;i++) ctx.fillRect(o.x+4+i*5, g-openL, 3, 5);
      for(let i=0;i<3;i++) ctx.fillRect(o.x+26+i*5,g-openR, 3, 5);
    } else if(o.otype==="giantMushroom") {
      // Giant mushroom  Ewide low obstacle, must jump over
      ctx.fillStyle="#6a3a18";
      ctx.fillRect(o.x+16,g-28,10,28); // stalk
      ctx.fillStyle="#dd4422"; // cap
      ctx.fillRect(o.x,   g-36,42,12);
      ctx.fillRect(o.x+4, g-44,34,10);
      ctx.fillRect(o.x+10,g-50,22,8);
      ctx.fillStyle="#ffffff"; // spots
      ctx.fillRect(o.x+6, g-40,5,5); ctx.fillRect(o.x+20,g-44,4,4);
      ctx.fillRect(o.x+30,g-38,5,5);
      // Spore puffs
      if(Math.floor(frame/20)%2===0){
        ctx.fillStyle="rgba(255,200,100,0.4)";
        ctx.fillRect(o.x+8,g-54,6,6); ctx.fillRect(o.x+28,g-52,5,5);
      }
    } else if(o.otype==="piranha") {
      // Piranha plant  Esnapping mouth on a stem, chomps periodically
      const chomp = Math.floor(frame/18)%3===0;
      ctx.fillStyle="#1a6a10";
      ctx.fillRect(o.x+16,g-40,8,40); // stem
      ctx.fillRect(o.x+10,g-44,20,6); // collar
      // Head
      ctx.fillStyle="#cc2244";
      ctx.fillRect(o.x+6, g-60,28,18); // head body
      // Mouth open/closed
      if(chomp) {
        ctx.fillStyle="#ff4466";
        ctx.fillRect(o.x+8, g-56,24,10); // open mouth
        ctx.fillStyle="#ffffff";
        for(let i=0;i<4;i++) ctx.fillRect(o.x+9+i*6,g-56,4,5); // top teeth
        for(let i=0;i<4;i++) ctx.fillRect(o.x+9+i*6,g-48,4,5); // bottom teeth
      } else {
        ctx.fillStyle="#aa1133";
        ctx.fillRect(o.x+8, g-52,24,4); // closed mouth line
      }
      // Eyes
      ctx.fillStyle="#ffffff";
      ctx.fillRect(o.x+10,g-62,6,6); ctx.fillRect(o.x+24,g-62,6,6);
      ctx.fillStyle="#000000";
      ctx.fillRect(o.x+12,g-60,3,3); ctx.fillRect(o.x+26,g-60,3,3);
    } else if(o.otype==="gorilla") {
      // Gorilla  Elarge ape that throws coconuts
      ctx.fillStyle="#2a1a08";
      ctx.fillRect(o.x+6, g-52,32,52); // body
      ctx.fillRect(o.x+10,g-62,24,14); // head
      // Brow ridge
      ctx.fillStyle="#1a0a04";
      ctx.fillRect(o.x+10,g-62,24,5);
      // Eyes
      ctx.fillStyle="#cc8844";
      ctx.fillRect(o.x+14,g-58,6,6); ctx.fillRect(o.x+24,g-58,6,6);
      ctx.fillStyle="#000"; ctx.fillRect(o.x+16,g-56,3,3); ctx.fillRect(o.x+26,g-56,3,3);
      // Nostrils
      ctx.fillStyle="#1a0a04";
      ctx.fillRect(o.x+16,g-50,4,3); ctx.fillRect(o.x+24,g-50,4,3);
      // Arms
      ctx.fillStyle="#2a1a08";
      ctx.fillRect(o.x-2, g-46,12,22); // left arm
      ctx.fillRect(o.x+34,g-46,12,22); // right arm
      // Knuckles on ground
      ctx.fillRect(o.x-4, g-26,10,8); ctx.fillRect(o.x+38,g-26,10,8);
      // Coconut projectiles
      ctx.fillStyle="#6a4a20";
      for(const b of (o.bullets||[])) {
        ctx.fillRect(b.x,b.y,10,10);
        ctx.fillStyle="#4a2a10"; ctx.fillRect(b.x+2,b.y+2,3,3); ctx.fillStyle="#6a4a20";
      }
    } else {
      ctx.fillStyle="#1a5a10";
      for(let i=0;i<3;i++){ctx.fillRect(o.x+i*14,g-34,8,34); ctx.fillRect(o.x+i*14-2,g-36,12,6);}
    }
  } else if(set === "ruins") {
    if(o.otype==="cactus") {
      // Stone pillar stubs  Eshort broken columns
      const t=o.type||0;
      const h=32+(t*10);
      ctx.fillStyle="#7a6a50";
      ctx.fillRect(o.x+6,g-h,24,h);
      // Base plinth
      ctx.fillStyle="#8a7a60";
      ctx.fillRect(o.x+2,g-8,32,8);
      // Broken top edge
      ctx.fillStyle="#6a5a40";
      ctx.fillRect(o.x+6,g-h,8,5); ctx.fillRect(o.x+20,g-h+3,8,4);
      // Crack lines
      ctx.fillStyle="#5a4a38";
      ctx.fillRect(o.x+14,g-h+6,2,h-14); ctx.fillRect(o.x+9,g-h+16,2,12);
      // Moss patches
      ctx.fillStyle="#4a6a30";
      ctx.fillRect(o.x+8,g-h+8,5,4); ctx.fillRect(o.x+18,g-h+20,4,3);
    } else if(o.otype==="pillar") {
      // Tall crumbling column  E3 height variants
      const t=o.type||0;
      const h=44+t*8;
      ctx.fillStyle="#7a6a50";
      ctx.fillRect(o.x+6,g-h,24,h);
      // Capital (top decoration)
      ctx.fillStyle="#8a7a60";
      ctx.fillRect(o.x+2,g-h,32,7);
      // Base
      ctx.fillRect(o.x+2,g-10,32,10);
      // Broken chunks missing from top
      ctx.fillStyle="#d4c8a0"; // background color to "erase" chunks
      ctx.fillRect(o.x+22,g-h,12,10); ctx.fillRect(o.x+6,g-h+4,8,6);
      // Horizontal band
      ctx.fillStyle="#6a5a40";
      ctx.fillRect(o.x+6,g-h*0.5,24,4);
      // Deep cracks
      ctx.fillStyle="#4a3a28";
      ctx.fillRect(o.x+12,g-h+8,2,h-18); ctx.fillRect(o.x+20,g-h+14,2,h*0.4);
      // Moss
      ctx.fillStyle="#3a5a28";
      ctx.fillRect(o.x+8,g-h+10,6,4); ctx.fillRect(o.x+18,g-h*0.5+6,5,3);
    } else if(o.otype==="statue") {
      // Stone idol  Eface with glowing eyes, shoots curse beam
      ctx.fillStyle="#7a6a50";
      ctx.fillRect(o.x+4,g-52,28,52);  // body/pedestal
      ctx.fillRect(o.x+8,g-60,20,12); // head
      // Face features
      ctx.fillStyle="#5a4a38";
      ctx.fillRect(o.x+10,g-56,5,5);  // left eye socket
      ctx.fillRect(o.x+21,g-56,5,5);  // right eye socket
      ctx.fillRect(o.x+12,g-50,12,3); // mouth
      // Glowing eyes (pulse)
      const eyeGlow = Math.floor(frame/12)%2===0 ? "#ffaa00" : "#ff6600";
      ctx.fillStyle=eyeGlow;
      ctx.fillRect(o.x+11,g-55,3,3); ctx.fillRect(o.x+22,g-55,3,3);
      // Headdress
      ctx.fillStyle="#8a7a60";
      ctx.fillRect(o.x+6,g-64,24,6);
      ctx.fillRect(o.x+10,g-68,16,6);
      ctx.fillRect(o.x+14,g-72,8,6);
      // Arm stubs
      ctx.fillStyle="#7a6a50";
      ctx.fillRect(o.x,g-44,8,16); ctx.fillRect(o.x+28,g-44,8,16);
      // Curse beam projectiles
      ctx.fillStyle="#ffaa00";
      for(const b of (o.bullets||[])) {
        ctx.fillStyle="#ffaa00"; ctx.fillRect(b.x,b.y,12,4);
        ctx.fillStyle="#ff6600"; ctx.fillRect(b.x+2,b.y+1,6,2);
      }
    } else if(o.otype==="spiketrap") {
      // Floor spikes that extend/retract on timer
      const sh = o._spikeH||0;
      // Stone base plate
      ctx.fillStyle="#6a5a40";
      ctx.fillRect(o.x,g-6,44,6);
      // Spikes
      ctx.fillStyle="#8a7a60";
      for(let i=0;i<5;i++){
        const sx=o.x+2+i*9;
        ctx.beginPath();
        ctx.moveTo(sx,g-6);
        ctx.lineTo(sx+4,g-6-sh);
        ctx.lineTo(sx+8,g-6);
        ctx.fill();
      }
      // Tip glint
      if(sh>8){
        ctx.fillStyle="#ccbbaa";
        for(let i=0;i<5;i++) ctx.fillRect(o.x+5+i*9,g-6-sh,2,3);
      }
    } else if(o.otype==="boulder") {
      // Rolling stone boulder
      const rot=(frame*0.06)%(Math.PI*2);
      const bounce=Math.abs(Math.sin(frame*0.12))*4;
      ctx.save();
      ctx.translate(o.x+16,g-16-bounce);
      ctx.rotate(rot);
      ctx.fillStyle="#7a6a50";
      ctx.fillRect(-14,-8,28,16); ctx.fillRect(-10,-14,20,28);
      ctx.fillRect(-16,-4,32,8);
      // Crack texture
      ctx.fillStyle="#5a4a38";
      ctx.fillRect(-8,-10,2,8); ctx.fillRect(4,-8,2,10);
      ctx.fillRect(-4,2,8,2);
      // Moss spots
      ctx.fillStyle="#3a5a28";
      ctx.fillRect(-10,-6,4,4); ctx.fillRect(6,2,4,4);
      ctx.restore();
    } else if(o.otype==="golem") {
      // Stone golem  Estomps and throws rubble
      const stomp=Math.floor(frame/20)%2;
      ctx.fillStyle="#7a6a50";
      ctx.fillRect(o.x+6, g-58,30,58); // body
      ctx.fillRect(o.x+8, g-68,26,14); // head
      // Stone face
      ctx.fillStyle="#5a4a38";
      ctx.fillRect(o.x+12,g-64,6,6);   // left eye
      ctx.fillRect(o.x+24,g-64,6,6);   // right eye
      ctx.fillRect(o.x+14,g-56,14,4);  // mouth
      // Glowing eyes
      ctx.fillStyle="#88aaff";
      ctx.fillRect(o.x+13,g-63,4,4); ctx.fillRect(o.x+25,g-63,4,4);
      // Arms  Eone raised when stomping
      ctx.fillStyle="#7a6a50";
      ctx.fillRect(o.x-2,g-52,10,24);  // left arm
      if(stomp===0){
        ctx.fillRect(o.x+34,g-58,10,20); // right arm raised
      } else {
        ctx.fillRect(o.x+34,g-46,10,20); // right arm down
      }
      // Fist
      ctx.fillStyle="#6a5a40";
      ctx.fillRect(o.x-4,g-30,12,10); ctx.fillRect(o.x+34,stomp===0?g-40:g-28,12,10);
      // Stone texture lines
      ctx.fillStyle="#6a5a40";
      ctx.fillRect(o.x+8,g-50,26,3); ctx.fillRect(o.x+8,g-38,26,3);
      // Rubble projectiles
      ctx.fillStyle="#8a7a60";
      for(const b of (o.bullets||[])) {
        ctx.fillRect(b.x,b.y,10,8);
        ctx.fillStyle="#6a5a40"; ctx.fillRect(b.x+2,b.y+2,4,3); ctx.fillStyle="#8a7a60";
      }
    } else {
      // fallback
      const h=32;
      ctx.fillStyle="#7a6a50"; ctx.fillRect(o.x+4,g-h,32,h);
      ctx.fillStyle="#8a7a60"; ctx.fillRect(o.x+2,g-h,36,6);
    }
  } else if(set === "cave") {
    // Shared pulse animation
    const pulse = Math.floor(frame/10)%2;
    const glow1 = pulse===0 ? "#cc88ff" : "#aa55dd";
    const glow2 = pulse===0 ? "#8844ff" : "#6622cc";
    const glow3 = pulse===0 ? "#ff88ff" : "#dd55dd";

    if(o.otype==="cactus") {
      // Crystal spire stubs  Eshort formations
      const t=o.type||0;
      const h=30+t*10;
      ctx.fillStyle=glow2;
      ctx.fillRect(o.x+10,g-h,10,h);
      ctx.fillRect(o.x+24,g-h*0.7,8,h*0.7);
      ctx.fillRect(o.x,g-h*0.5,8,h*0.5);
      ctx.fillStyle=glow1;
      ctx.fillRect(o.x+12,g-h,6,5);
      ctx.fillRect(o.x+26,g-h*0.7,4,4);
      // Glow aura
      ctx.fillStyle=`rgba(136,68,255,0.15)`;
      ctx.fillRect(o.x-4,g-h-8,44,h+8);
    } else if(o.otype==="crystalSpire") {
      // Tall glowing crystal formation  E3 variants
      const t=o.type||0;
      const h=48+t*10;
      // Main spire
      ctx.fillStyle=glow2;
      ctx.fillRect(o.x+10,g-h,16,h);
      // Facets
      ctx.fillStyle=glow1;
      ctx.fillRect(o.x+12,g-h,6,8);   // tip glint
      ctx.fillRect(o.x+14,g-h*0.6,4,6); // mid glint
      // Side crystals
      ctx.fillStyle=glow2;
      ctx.fillRect(o.x+26,g-h*0.75,10,h*0.75);
      ctx.fillRect(o.x,g-h*0.55,10,h*0.55);
      ctx.fillStyle=glow1;
      ctx.fillRect(o.x+28,g-h*0.75,4,5);
      ctx.fillRect(o.x+2,g-h*0.55,4,4);
      // Inner light
      ctx.fillStyle=glow3;
      ctx.fillRect(o.x+14,g-h+8,4,h-20);
      // Glow aura
      ctx.fillStyle=`rgba(136,68,255,0.18)`;
      ctx.fillRect(o.x-6,g-h-10,48,h+10);
      // Sparkle particles
      if(pulse===0){
        ctx.fillStyle="#ffffff";
        ctx.fillRect(o.x+8,g-h-4,2,2);
        ctx.fillRect(o.x+28,g-h*0.8,2,2);
        ctx.fillRect(o.x+18,g-h*0.4,2,2);
      }
    } else if(o.otype==="crystalCluster") {
      // Wide low cluster  Emust jump over
      const heights=[28,22,32,18,26,20,30];
      for(let i=0;i<7;i++){
        const cx=o.x+i*8;
        const ch=heights[i];
        ctx.fillStyle=i%2===0?glow2:"#5522aa";
        ctx.fillRect(cx+1,g-ch,6,ch);
        ctx.fillStyle=glow1;
        ctx.fillRect(cx+2,g-ch,3,4); // tip
        // Inner glow stripe
        ctx.fillStyle=glow3;
        ctx.fillRect(cx+3,g-ch+5,2,ch-10);
      }
      // Base glow
      ctx.fillStyle="rgba(136,68,255,0.2)";
      ctx.fillRect(o.x-2,g-34,56,34);
    } else if(o.otype==="stalactite") {
      // Hanging crystal stalactite  Edrops from ceiling
      const sy = o._stalY ?? -30;
      // Main crystal
      ctx.fillStyle=glow2;
      ctx.fillRect(o.x+4,sy,12,28);
      // Facets
      ctx.fillStyle=glow1;
      ctx.fillRect(o.x+5,sy,5,6);
      ctx.fillRect(o.x+7,sy+10,3,4);
      // Pointy tip
      ctx.fillStyle=glow3;
      ctx.beginPath();
      ctx.moveTo(o.x+4,sy+28); ctx.lineTo(o.x+10,sy+42); ctx.lineTo(o.x+16,sy+28);
      ctx.fill();
      // Glow aura
      ctx.fillStyle="rgba(136,68,255,0.2)";
      ctx.fillRect(o.x,sy-2,20,46);
      // Drip sparkle near ground
      if(sy>g-60){
        ctx.fillStyle=glow1;
        ctx.fillRect(o.x+8,sy+44,3,3);
        ctx.fillRect(o.x+4,sy+40,2,2);
        ctx.fillRect(o.x+14,sy+42,2,2);
      }
    } else if(o.otype==="crystalGolem") {
      // Crystal golem  Emade of jagged crystal shards
      ctx.fillStyle=glow2;
      ctx.fillRect(o.x+6, g-60,30,60); // body
      ctx.fillRect(o.x+8, g-70,26,14); // head
      // Crystal shard protrusions on body
      ctx.fillStyle=glow1;
      ctx.fillRect(o.x+2, g-54,6,10);  // left shard
      ctx.fillRect(o.x+34,g-54,6,10);  // right shard
      ctx.fillRect(o.x+10,g-68,6,10);  // head shard L
      ctx.fillRect(o.x+26,g-68,6,10);  // head shard R
      ctx.fillRect(o.x+18,g-74,6,8);   // top shard
      // Glowing eyes
      ctx.fillStyle="#ffffff";
      ctx.fillRect(o.x+12,g-66,6,6); ctx.fillRect(o.x+24,g-66,6,6);
      ctx.fillStyle=glow3;
      ctx.fillRect(o.x+13,g-65,4,4); ctx.fillRect(o.x+25,g-65,4,4);
      // Arms
      ctx.fillStyle=glow2;
      ctx.fillRect(o.x-4,g-50,12,20);
      ctx.fillRect(o.x+34,g-50,12,20);
      // Crystal arm shards
      ctx.fillStyle=glow1;
      ctx.fillRect(o.x-6,g-52,5,8); ctx.fillRect(o.x+43,g-52,5,8);
      // Inner glow
      ctx.fillStyle="rgba(200,100,255,0.2)";
      ctx.fillRect(o.x+6,g-60,30,60);
      // Crystal shard projectiles
      for(const b of (o.bullets||[])){
        ctx.fillStyle=glow1;
        ctx.fillRect(b.x,b.y,8,4);
        ctx.fillStyle="#ffffff"; ctx.fillRect(b.x+1,b.y+1,3,2);
      }
    } else if(o.otype==="voidPortal") {
      // Swirling void portal  Edark with purple ring
      const spin=Math.floor(frame/6)%4;
      // Dark void center
      ctx.fillStyle="#0a0010";
      ctx.fillRect(o.x+8, g-58,20,50);
      ctx.fillRect(o.x+4, g-54,28,42);
      ctx.fillRect(o.x+2, g-48,32,34);
      // Outer ring segments (spinning)
      const ringCols=["#8844ff","#aa22ff","#6622cc","#cc44ff"];
      ctx.fillStyle=ringCols[spin];
      ctx.fillRect(o.x,   g-50,6,34);   // left
      ctx.fillRect(o.x+30,g-50,6,34);   // right
      ctx.fillRect(o.x+6, g-64,24,8);   // top
      ctx.fillRect(o.x+6, g-14,24,8);   // bottom
      // Inner swirl
      ctx.fillStyle=ringCols[(spin+2)%4];
      ctx.fillRect(o.x+10,g-56,16,6);
      ctx.fillRect(o.x+10,g-20,16,6);
      ctx.fillRect(o.x+2, g-46,6,24);
      ctx.fillRect(o.x+28,g-46,6,24);
      // Void eye
      ctx.fillStyle="#cc44ff";
      ctx.fillRect(o.x+14,g-38,8,8);
      ctx.fillStyle="#ffffff";
      ctx.fillRect(o.x+16,g-36,4,4);
      // Glow
      ctx.fillStyle="rgba(100,20,200,0.15)";
      ctx.fillRect(o.x-8,g-72,52,72);
    } else if(o.otype==="crystalMine") {
      // Floating crystal mine  Eexplodes into shards when close
      const my = o.y;
      const bob = Math.sin(frame*0.08)*4;
      const exploding = o._exploding||0;
      if(exploding>0){
        // Explosion: 4 shards flying out
        ctx.fillStyle=glow1;
        for(const b of (o.bullets||[])){
          ctx.fillRect(b.x,b.y,6,6);
          ctx.fillStyle="#ffffff"; ctx.fillRect(b.x+1,b.y+1,2,2); ctx.fillStyle=glow1;
        }
      } else {
        // Mine body
        ctx.fillStyle=glow2;
        ctx.fillRect(o.x+4, my+bob+2,16,16);
        ctx.fillRect(o.x+2, my+bob+6,20,8);
        ctx.fillRect(o.x+6, my+bob,12,20);
        // Crystal spikes on mine
        ctx.fillStyle=glow1;
        ctx.fillRect(o.x+10,my+bob-4,4,6);  // top spike
        ctx.fillRect(o.x+10,my+bob+18,4,6); // bottom spike
        ctx.fillRect(o.x-2, my+bob+8,6,4);  // left spike
        ctx.fillRect(o.x+20,my+bob+8,6,4);  // right spike
        // Glowing core
        ctx.fillStyle=glow3;
        ctx.fillRect(o.x+8, my+bob+6,8,8);
        ctx.fillStyle="rgba(200,100,255,0.3)";
        ctx.fillRect(o.x,   my+bob-6,24,32);
        // Danger pulse
        ctx.fillStyle=`rgba(255,100,255,${0.06+Math.sin(frame*0.3)*0.04})`;
        ctx.fillRect(o.x-10,my+bob-10,44,44);
      }
    } else {
      ctx.fillStyle=glow2;
      const h=28;
      ctx.fillRect(o.x+8,g-h,10,h); ctx.fillRect(o.x+22,g-h*0.8,10,h*0.8);
      ctx.fillStyle=glow1; ctx.fillRect(o.x+10,g-h,6,4); ctx.fillRect(o.x+24,g-h*0.8,6,4);
      ctx.fillStyle="rgba(160,80,255,0.15)"; ctx.fillRect(o.x,g-h-10,44,h+10);
    }
  } else {
    // Plains / default
    if(o.otype==="rock"){
      ctx.fillStyle="#667755"; ctx.fillRect(o.x+4,g-18,28,18); ctx.fillRect(o.x,g-12,36,12); ctx.fillRect(o.x+8,g-22,18,6);
    } else if(o.otype==="spike"){
      ctx.fillStyle="#334422";
      for(let i=0;i<3;i++){const bx=o.x+i*14;ctx.beginPath();ctx.moveTo(bx+2,g);ctx.lineTo(bx+7,g-26);ctx.lineTo(bx+12,g);ctx.fill();}
    } else if(o.otype==="log") {
      // Rolling log  Egrasslands
      const logRot = (frame*0.08)%(Math.PI*2);
      ctx.save();
      ctx.translate(o.x+22, g-9);
      ctx.rotate(logRot);
      ctx.fillStyle="#7a4a1a"; ctx.fillRect(-20,-9,40,18);
      ctx.fillStyle="#5a3010"; ctx.fillRect(-20,-2,40,4);
      ctx.fillStyle="#9a6a3a"; ctx.fillRect(-20,-9,40,3);
      ctx.restore();
    } else if(o.otype==="turret") {
      ctx.fillStyle="#3a5a2a";
      ctx.fillRect(o.x+4,g-28,32,28);
      ctx.fillRect(o.x+8,g-36,24,10);
      ctx.fillRect(o.x+28,g-32,14,6);
      ctx.fillStyle="#cc2200";
      ctx.fillRect(o.x+10,g-34,6,6);
      ctx.fillStyle="#ffcc00";
      for(const b of (o.bullets||[])) ctx.fillRect(b.x,b.y,8,4);
    } else if(o.otype==="wall") {
      ctx.fillStyle="#5a7a3a";
      ctx.fillRect(o.x,g-28,18,28);
      ctx.fillStyle="#7a9a5a";
      for(let r=0;r<3;r++) ctx.fillRect(o.x+2,g-28+r*10,14,2);
    } else {
      const t=o.type||0; ctx.fillStyle="#334422";
      if(t===0){ctx.fillRect(o.x+10,g-44,10,44);ctx.fillRect(o.x+2,g-28,28,8);ctx.fillRect(o.x+2,g-36,10,12);ctx.fillRect(o.x+22,g-34,10,10);}
      else if(t===1){ctx.fillRect(o.x+8,g-62,10,62);ctx.fillRect(o.x,g-42,26,8);ctx.fillRect(o.x,g-54,10,15);ctx.fillRect(o.x+20,g-50,10,13);ctx.fillRect(o.x+20,g-60,14,10);}
      else{ctx.fillRect(o.x+4,g-40,9,40);ctx.fillRect(o.x+20,g-40,9,40);ctx.fillRect(o.x+4,g-52,9,14);ctx.fillRect(o.x+18,g-52,12,9);ctx.fillRect(o.x,g-26,32,8);}
    }
  }
}

// ─── DRAW: GROUND ─────────────────────────────────────────────────────────────
function drawGround(ctx, offset, scenery, nightBlend) {
  const s = scenery || SCENERIES[0];
  if(s.id === "classic") {
    const groundCol = nightBlend > 0.5 ? "#aaaaaa" : "#222222";
    const gravelCol = nightBlend > 0.5 ? "#555566" : "#bbbbbb";
    ctx.fillStyle = groundCol; ctx.fillRect(0, GROUND_Y+2, CANVAS_W, 3);
    ctx.fillStyle = gravelCol;
    for(let i=0;i<22;i++){
      const rx=((i*76-(offset%76))+CANVAS_W*4)%CANVAS_W;
      ctx.fillRect(rx, GROUND_Y+7, 18+(i%3)*7, 2);
      ctx.fillRect(rx+4, GROUND_Y+11, 9, 2);
    }
    return;
  }
  ctx.fillStyle = s.groundTop;
  ctx.fillRect(0, GROUND_Y, CANVAS_W, 4);
  ctx.fillStyle = s.groundColor;
  ctx.fillRect(0, GROUND_Y+4, CANVAS_W, CANVAS_H-GROUND_Y-4);
  ctx.fillStyle = s.groundTop + "88";
  for(let i=0;i<22;i++){
    const rx=((i*76-(offset%76))+CANVAS_W*4)%CANVAS_W;
    ctx.fillRect(rx,GROUND_Y+6,16+(i%3)*6,2);
  }
}

// ─── DRAW: CLOUDS ─────────────────────────────────────────────────────────────
function drawClouds(ctx, clouds, scenery) {
  const s = scenery || SCENERIES[0];
  for(const c of clouds){
    if(s.id==="cave"){
      ctx.fillStyle=s.cloudColor;
      ctx.fillRect(c.x,0,8,c.h||20); ctx.fillRect(c.x+2,c.h||20,4,4);
    } else if(s.id==="classic") {
      ctx.fillStyle="#dddddd";
      ctx.fillRect(c.x+10,c.y+8,38,9);ctx.fillRect(c.x+4,c.y+3,18,14);
      ctx.fillRect(c.x+20,c.y,22,18); ctx.fillRect(c.x+42,c.y+5,16,12);
    } else {
      ctx.fillStyle=s.cloudColor;
      ctx.fillRect(c.x+10,c.y+8,38,9);ctx.fillRect(c.x+4,c.y+3,18,14);
      ctx.fillRect(c.x+20,c.y,22,18); ctx.fillRect(c.x+42,c.y+5,16,12);
    }
  }
}

// ─── DRAW: BONE PICKUP ────────────────────────────────────────────────────────
function drawBonePickup(ctx, x, y, col) {
  drawFossilDiamond(ctx, x + 7, y + 7, 14, col);
}

// ─── DRAW: ENTITY SILHOUETTE ────────────────────────────────────────────────
// The Unknown  Ea Lovecraftian horror glimpsed behind the clouds
function drawEntitySilhouette(ctx, x, y, frame, alpha, scenery) {
  if(alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  const sid = scenery?.id || "classic";
  const silTints = {
    classic: "#080808",
    plains:  "#040e02",
    desert:  "#180800",
    arctic:  "#020810",
    volcano: "#180200",
    jungle:  "#020e04",
    ruins:   "#0e0a04",
    cave:    "#0a0018",
  };
  const tint = silTints[sid] || "#080808";
  ctx.fillStyle = tint;

  // Slow undulating breathe
  const breathe = Math.sin(frame * 0.018) * 4;
  const tentacleWave = (i, t) => Math.sin(frame * 0.04 + i * 1.1 + t) * 6;

  const cx = x, cy = y;

  // ── Massive central body  Eamorphous blob ─────────────────────────────────
  ctx.fillRect(cx-28, cy-20+breathe, 56, 44);
  ctx.fillRect(cx-36, cy-10+breathe, 72, 28);
  ctx.fillRect(cx-20, cy-32+breathe, 40, 16);
  ctx.fillRect(cx-14, cy-40+breathe, 28, 12);
  // Asymmetric lumps  Eit is not symmetrical
  ctx.fillRect(cx+18, cy-28+breathe, 18, 20);
  ctx.fillRect(cx-38, cy-18+breathe, 14, 24);
  ctx.fillRect(cx+30, cy-8+breathe,  12, 18);
  ctx.fillRect(cx-44, cy-4+breathe,  10, 14);

  // ── Writhing tentacles  E8 of them, each unique ───────────────────────────
  const tentacles = [
    { ox:-30, len:5, dir: 1 }, { ox:-18, len:6, dir:-1 },
    { ox: -6, len:7, dir: 1 }, { ox:  6, len:6, dir:-1 },
    { ox: 18, len:5, dir: 1 }, { ox: 28, len:7, dir:-1 },
    { ox:-40, len:4, dir: 1 }, { ox: 38, len:4, dir:-1 },
  ];
  tentacles.forEach((t, i) => {
    let tx = cx + t.ox, ty = cy + 22 + breathe;
    for(let s = 0; s < t.len; s++) {
      const w = Math.max(2, 7 - s);
      const wave = tentacleWave(i, s * 0.5) * t.dir;
      ctx.fillRect(tx + wave - w/2, ty + s*8, w, 9);
    }
  });

  // ── Upper appendages  Ereaching upward ────────────────────────────────────
  const arms = [
    { ox:-22, dir:-1 }, { ox: 22, dir: 1 }, { ox:-8, dir:-1 }, { ox: 8, dir: 1 },
  ];
  arms.forEach((a, i) => {
    let ax = cx + a.ox, ay = cy - 32 + breathe;
    for(let s = 0; s < 4; s++) {
      const w = Math.max(2, 6 - s);
      const wave = tentacleWave(i + 8, s * 0.6) * a.dir;
      ctx.fillRect(ax + wave - w/2, ay - s*9, w, 10);
    }
  });

  // ── Eyes  Ewrong number, wrong placement ──────────────────────────────────
  // 5 eyes, none where you'd expect them
  const eyePulse = Math.floor(frame * 0.06) % 3 === 0;
  const eyeColor = eyePulse ? "#ff0000" : "#cc0000";
  ctx.fillStyle = eyeColor;
  ctx.fillRect(cx-14, cy-26+breathe, 5, 4);
  ctx.fillRect(cx+10, cy-22+breathe, 5, 4);
  ctx.fillRect(cx-2,  cy-30+breathe, 4, 3);
  ctx.fillRect(cx+22, cy-14+breathe, 4, 4);
  ctx.fillRect(cx-28, cy-10+breathe, 3, 3);

  // ── Mouth  Ea horizontal gash that shouldn't be there ─────────────────────
  const mouthOpen = Math.sin(frame * 0.025) > 0.3;
  ctx.fillStyle = "#000000";
  ctx.fillRect(cx-16, cy-4+breathe, 32, mouthOpen ? 5 : 2);
  if(mouthOpen) {
    ctx.fillStyle = "#330000";
    ctx.fillRect(cx-12, cy-4+breathe, 4, 4);
    ctx.fillRect(cx-2,  cy-4+breathe, 4, 4);
    ctx.fillRect(cx+8,  cy-4+breathe, 4, 4);
  }

  // ── Fringe spines on top  Elike a crown of bone ───────────────────────────
  ctx.fillStyle = tint;
  for(let i = 0; i < 7; i++) {
    const sx = cx - 24 + i * 8;
    const sh = 8 + (i % 3) * 5 + Math.sin(frame * 0.03 + i) * 3;
    ctx.fillRect(sx, cy - 40 - sh + breathe, 3, sh);
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

// ─── DRAW: STARS ─────────────────────────────────────────────────────────────
function drawStars(ctx, stars, blend) {
  for(const s of stars){
    ctx.fillStyle=`rgba(255,255,255,${s.bright*blend})`;
    ctx.fillRect(s.x,s.y,s.size,s.size);
  }
}

// ─── OBSTACLE HITBOX ──────────────────────────────────────────────────────────
function getObstacleHitbox(o) {
  const g=GROUND_Y;
  if(o.otype==="bird")    return{x:o.x+4, y:o.y+2,  w:30,h:14};
  if(o.otype==="rock")    return{x:o.x+2, y:g-22,   w:40,h:22};
  if(o.otype==="spike")   return{x:o.x+2, y:g-26,   w:38,h:26};
  if(o.otype==="turret")      return{x:o.x+4, y:g-32,   w:32,h:32};
  if(o.otype==="wall")        return{x:o.x,   y:g-28,   w:18,h:28};
  if(o.otype==="log")         return{x:o.x+2, y:g-18,   w:40,h:18};
  if(o.otype==="spike_cluster") return{x:o.x+2, y:g-30, w:52,h:30};
  if(o.otype==="dune")        return{x:o.x+4, y:g-22,   w:48,h:22};
  if(o.otype==="tumbleweed")  return{x:o.x+4, y:g-20,   w:28,h:20};
  if(o.otype==="sandworm")    return{x:o.x+8, y:g-(o._wormH||0), w:24,h:o._wormH||0};
  if(o.otype==="scorpion")    return{x:o.x+2, y:g-20,   w:40,h:20};
  if(o.otype==="icewall")     return{x:o.x,   y:g-34,   w:16,h:34};
  if(o.otype==="snowball")    return{x:o.x+2, y:g-22,   w:28,h:22};
  if(o.otype==="icicle")      return{x:o.x+4, y:o._icicleY||(-20), w:10,h:28};
  if(o.otype==="yeti")        return{x:o.x+4, y:g-52,   w:36,h:52};
  if(o.otype==="lavarock")    return{x:o.x+2, y:g-26,   w:42,h:26};
  if(o.otype==="firePillar")  return{x:o.x+8, y:g-48,   w:20,h:48};
  if(o.otype==="lavaburst")   return{x:o.x+6, y:g-16,   w:28,h:16};
  if(o.otype==="firewall")    return{x:o.x,   y:g-60,   w:14,h:60};
  if(o.otype==="demon")       return{x:o.x+4, y:o.y+4,  w:36,h:28};
  if(o.otype==="vineTrap")    return{x:o.x+2, y:g-60,   w:36,h:60};
  if(o.otype==="giantMushroom")return{x:o.x+2,y:g-50,   w:38,h:50};
  if(o.otype==="piranha")     return{x:o.x+8, y:g-60,   w:24,h:22};
  if(o.otype==="gorilla")     return{x:o.x+6, y:g-62,   w:32,h:62};
  if(o.otype==="pillar")      return{x:o.x+6, y:g-56,   w:24,h:56};
  if(o.otype==="statue")      return{x:o.x+4, y:g-52,   w:28,h:52};
  if(o.otype==="spiketrap")   return{x:o.x+2, y:g-(o._spikeH||0), w:40,h:o._spikeH||0};
  if(o.otype==="boulder")     return{x:o.x+2, y:g-24,   w:28,h:24};
  if(o.otype==="golem")       return{x:o.x+4, y:g-58,   w:34,h:58};
  if(o.otype==="crystalSpire") return{x:o.x+8, y:g-60,   w:20,h:60};
  if(o.otype==="crystalCluster")return{x:o.x+2,y:g-28,   w:48,h:28};
  if(o.otype==="stalactite")   return{x:o.x+4, y:o._stalY||(-30), w:12,h:32};
  if(o.otype==="crystalGolem") return{x:o.x+4, y:g-60,   w:34,h:60};
  if(o.otype==="voidPortal")   return{x:o.x+6, y:g-64,   w:28,h:64};
  if(o.otype==="crystalMine")  return{x:o.x+2, y:o.y+2,  w:20,h:20};
  const heights=[44,62,40,36,34], widths=[28,22,28,44,38];
  return{x:o.x+4,y:g-(heights[o.type||0]||44),w:widths[o.type||0]||28,h:heights[o.type||0]||44};
}

function rectsOverlap(ax,ay,aw,ah,bx,by,bw,bh){
  return ax<bx+bw && ax+aw>bx && ay<by+bh && ay+ah>by;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DinoIncremental() {
  const canvasRef   = useRef(null);
  const gsRef       = useRef(null);
  const animRef     = useRef(null);
  const lastTimeRef = useRef(null);
  const keysRef     = useRef({});
  const prevKeysRef = useRef({});

  const [screen,         setScreen]         = useState("menu");
  const [fossils,        setFossils]        = useLocalStorage("dino_fossils", 0);
  const [totalFossils,   setTotalFossils]   = useLocalStorage("dino_totalFossils", 0);
  const [bestDist,       setBestDist]       = useLocalStorage("dino_bestDist", 0);
  const [totalRuns,      setTotalRuns]      = useLocalStorage("dino_totalRuns", 0);
  const [upgradeLevels,  setUpgradeLevels]  = useLocalStorage("dino_upgradeLevels", {});
  const [ownedSkins,     setOwnedSkins]     = useLocalStorage("dino_ownedSkins", ["classic"]);
  const [equippedSkin,   setEquippedSkin]   = useLocalStorage("dino_equippedSkin", "classic");
  const [ownedDesigns,   setOwnedDesigns]   = useLocalStorage("dino_ownedDesigns", ["raptor"]);
  const [equippedDesign, setEquippedDesign] = useLocalStorage("dino_equippedDesign", "raptor");
  const [ownedSceneries, setOwnedSceneries] = useLocalStorage("dino_ownedSceneries", ["classic"]);
  const [activeScenery,  setActiveScenery]  = useLocalStorage("dino_activeScenery", "classic");
  const [lastRun,        setLastRun]        = useState(null);
  const [passiveRate,    setPassiveRate]    = useState(0);
  const [notification,   setNotification]   = useState(null);
  const [shopTab,        setShopTab]        = useState("movement");
  const [achievStats,    setAchievStats]    = useLocalStorage("dino_achievStats", {
    totalRuns:0, bestDist:0, totalBones:0, totalUpgrades:0,
    ownedSkins:1, ownedSceneries:1, maxCombo:0, nightCycles:0,
    totalNearMiss:0, giantCrushes:0, bestDistNoDash:0, passiveEarned:0, allMovementMax:false,
  });
  const [unlockedAch,    setUnlockedAch]    = useLocalStorage("dino_unlockedAch", []);
  const [pendingAch,     setPendingAch]     = useState([]);
  const [achivNotif,     setAchivNotif]     = useState(null);
  const [skinTab,        setSkinTab]        = useState("dino");
  const [passivePreviewId, setPassivePreviewId] = useState(null);
  const [unlockedPowerups, setUnlockedPowerups] = useLocalStorage("dino_unlockedPowerups", []);
  const [lbData,           setLbData]           = useState([]);
  const [lbLoading,        setLbLoading]        = useState(false);
  const [lastRunRank,      setLastRunRank]       = useState(null);
  const [lbRenaming,       setLbRenaming]        = useState(false);
  const [lbNewName,        setLbNewName]         = useState("");
  const [lbNameError,      setLbNameError]       = useState("");

  const getStats = useCallback((levels) => {
    const ul = levels || {};
    return {
      jumpBoost:      (ul.jump||0)*1.8,
      fossilMult:     1+(ul.fossil||0)*0.20,
      shieldChance:   (ul.shield||0)*0.06,
      speedReduction: (ul.speed||0)*0.15,
      hasMagnet:      (ul.magnet||0)>0,
      magnetLevel:    ul.magnet||0,
      hasDoubleJump:  (ul.dblJump||0)>0,
      hasDash:        (ul.dash||0)>0,
      hasBackDash:    (ul.backdash||0)>0,
      hasFastDrop:    (ul.fastdrop||0)>0,
      hasDuck:        (ul.duck||0)>0,
      dashCdReduction:(ul.dashCd||0)*10,
      comboBonus:     (ul.combo||0)*0.12,
      nearMissBonus:  (ul.nearMiss||0)*3,
      extraLives:     ul.extraLife||0,
      invFramesBonus: (ul.invFrames||0)*8,
      nightBonus:     (ul.nightBonus||0)*0.25,
      transBonus:     (ul.transBonus||0)*0.25,
      speedBonusMult: (ul.speedBonus||0)*0.5,
      passiveFossils: (ul.miner||0)*0.3+(ul.camp||0)*0.8+(ul.research||0)*1.5,
      shieldHits:     1+(ul.pwShieldDur||0),
      speedMult:      2.0+(ul.pwSpeedMult||0)*0.25,
      giantDurBonus:    (ul.pwGiantDur||0)*50,
      magnetRngBonus:   (ul.pwMagnetRng||0)*60,
      frenzyDurBonus:   (ul.pwFrenzyDur||0)*50,
      rareDrop:         (ul.pwRareDrop||0)*0.06,
      heartChance:      (ul.pwHeartChance||0)*0.04,
      ghostDurBonus:    (ul.pwGhostDur||0)*50,
      tinyDurBonus:     (ul.pwTinyDur||0)*50,
      meteorCountBonus: (ul.pwMeteorCount||0)*2,
      doublerDurBonus:  (ul.pwDoublerDur||0)*50,
      slowDurBonus:     (ul.pwSlowDur||0)*50,
      windfallDurBonus: (ul.pwWindfallDur||0)*50,
    };
  }, []);

  // Passive income
  useEffect(() => {
    const rate = getStats(upgradeLevels).passiveFossils;
    setPassiveRate(rate);
    if(rate<=0) return;
    const id = setInterval(()=>{
      const gained = rate*0.5;
      setFossils(f=>+(f+gained).toFixed(1));
      setTotalFossils(f=>+(f+gained).toFixed(1));
      setAchievStats(prev=>({...prev, passiveEarned:prev.passiveEarned+gained, totalBones:prev.totalBones+gained}));
    },500);
    return ()=>clearInterval(id);
  },[upgradeLevels,getStats]);

  // Achievement checker
  useEffect(()=>{
    const newUnlocked=[];
    ACHIEVEMENTS.forEach(a=>{
      if(!unlockedAch.includes(a.id)&&a.req(achievStats)) newUnlocked.push(a);
    });
    if(newUnlocked.length>0){
      const ids=newUnlocked.map(a=>a.id);
      setUnlockedAch(prev=>[...prev,...ids]);
      const totalReward=newUnlocked.reduce((s,a)=>s+a.reward,0);
      setFossils(f=>f+totalReward);
      setTotalFossils(f=>f+totalReward);
      setPendingAch(prev=>[...prev,...newUnlocked]);
    }
  },[achievStats]);

  useEffect(()=>{
    if(pendingAch.length>0){
      const a=pendingAch[0];
      setAchivNotif(`🏆 ${a.label} (+${a.reward} bones)`);
      const t=setTimeout(()=>{ setAchivNotif(null); setPendingAch(prev=>prev.slice(1)); },3000);
      return ()=>clearTimeout(t);
    }
  },[pendingAch]);

  // Auto-fetch leaderboard when screen opens
  useEffect(()=>{
    if(screen!=="leaderboard") return;
    setLbLoading(true);
    fetchLeaderboard().then(data=>{ setLbData(data); setLbLoading(false); });
  },[screen]);

  const showNotif = useCallback((msg)=>{
    setNotification(msg);
    const t=setTimeout(()=>setNotification(null),2200);
    return ()=>clearTimeout(t);
  },[]);

  const currentSkin    = SKINS.find(s=>s.id===equippedSkin)||SKINS[0];
  const currentDesign  = DINO_DESIGNS.find(d=>d.id===equippedDesign)||DINO_DESIGNS[0];
  const currentScenery = SCENERIES.find(s=>s.id===activeScenery)||SCENERIES[0];

  // Menu dino preview
  const menuCanvasRef = useRef(null);
  const menuAnimRef   = useRef(null);
  const [menuDinoClicks, setMenuDinoClicks] = useState(0);
  const [showCredit, setShowCredit] = useState(false);
  useEffect(()=>{
    if(screen!=="menu"){ cancelAnimationFrame(menuAnimRef.current); return; }
    let f=0;
    const tick=()=>{
      f++;
      const el=menuCanvasRef.current;
      if(el){
        const c=el.getContext("2d");
        c.clearRect(0,0,80,70);
        drawDino(c,16,8,f,false,
          SKINS.find(s=>s.id===equippedSkin)||SKINS[0],
          DINO_DESIGNS.find(d=>d.id===equippedDesign)||DINO_DESIGNS[0],
          false,false,false,false,0,true,null);
      }
      menuAnimRef.current=requestAnimationFrame(tick);
    };
    menuAnimRef.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(menuAnimRef.current);
  },[screen,equippedSkin,equippedDesign]);

  const startGame = useCallback(()=>{
    const stats   = getStats(upgradeLevels);
    const scenery = SCENERIES.find(s=>s.id===activeScenery)||SCENERIES[0];
    const design  = DINO_DESIGNS.find(d=>d.id===equippedDesign)||DINO_DESIGNS[0];
    gsRef.current = {
      dino:{ x:70, y:GROUND_Y-DINO_H, vy:0, onGround:true, doubleJumped:false, dead:false,
             dashTimer:0, dashDir:0, dashCooldown:0, ducking:false, invTimer:0 },
      deathAnim: null, // { angle, vy, y }
      obstacles:[],
      pickups:[],
      powerupPickups:[],
      unlockedPowerups:[...unlockedPowerups],
      floatingTexts:[],
      activePowerups:{},
      clouds: scenery.id==="cave"
        ? Array.from({length:10},(_,i)=>({x:i*80+10, y:0, h:20+Math.random()*40, speed:0.15+Math.random()*0.2}))
        : Array.from({length:6},(_,i)=>({x:i*160+40, y:12+Math.random()*48, speed:0.2+Math.random()*0.3})),
      stars: Array.from({length:45},()=>({x:Math.random()*CANVAS_W, y:Math.random()*140, size:1+Math.floor(Math.random()*2), bright:0.4+Math.random()*0.6})),
      speed: Math.max(3.5,5-(stats.speedReduction*5)),
      baseSpeed: Math.max(3.5,5-(stats.speedReduction*5)),
      distance:0, fossilsEarned:0, frame:0, groundOffset:0,
      lastObstacleFrame:0, lastPickupFrame:0, lastPowerupFrame:0,
      coinManiaTimer:0,
      stats, lives:1+stats.extraLives, combo:0, comboTimer:0,
      alive:true, nightBlend:0, inNight:false,
      lastCycleNight:false, nightCycleCount:0,
      nearMissTimer:0, shieldHitsLeft:0,
      sunX:CANVAS_W+20, sunY:30, moonX:CANVAS_W+200, moonY:28,
      sunAlpha:1, moonAlpha:0,
      skin:currentSkin, design, scenery,
      maxComboThisRun:0, nearMissCount:0, giantCrushes:0, usedDash:false,
      // Per-run passive state
      raptorSpeedBonus:0,    // raptor: distance milestones -> bone %
      trexDeathKillsDone:0,  // not needed here
      pachyReviveUsed:false, // pachy: one free revive
      paraComboDecayRate:0,  // para: combo decays slower
      dilophoVenomActive:true,
      // Tri: first obstacle destroyed
      triFirstDestroyed:false,
      // Spino: night bonus tracked in render
      // Entity silhouette state
      entity:{ x: CANVAS_W * 0.65, y: 60, alpha: 0, visible: false, timer: 0, fadeDir: 0 },
    };
    keysRef.current={};
    prevKeysRef.current={};
    setScreen("game");
  },[upgradeLevels, getStats, equippedSkin, equippedDesign, activeScenery, currentSkin, currentDesign]);

  const doJump = useCallback(()=>{
    const gs=gsRef.current;
    if(!gs||!gs.alive) return;
    if(gs.activePowerups.speed_pw) return;
    if(gs.dino.ducking){gs.dino.ducking=false; return;}
    if(gs.dino.onGround){
      gs.dino.vy=JUMP_FORCE-gs.stats.jumpBoost*0.42;
      gs.dino.onGround=false; gs.dino.doubleJumped=false;
    } else if(gs.stats.hasDoubleJump&&!gs.dino.doubleJumped){
      gs.dino.vy=JUMP_FORCE-gs.stats.jumpBoost*0.28;
      gs.dino.doubleJumped=true;
    }
  },[]);

  useEffect(()=>{
    if(screen!=="gameover") return;
    const onKey=(e)=>{if(e.code==="Enter"||e.code==="Space") startGame();};
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[screen,startGame]);

  useEffect(()=>{
    if(screen!=="game") return;
    const onDown=(e)=>{
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyW","KeyS"].includes(e.code)) e.preventDefault();
      keysRef.current[e.code]=true;
    };
    const onUp=(e)=>{keysRef.current[e.code]=false;};
    window.addEventListener("keydown",onDown);
    window.addEventListener("keyup",onUp);
    return ()=>{window.removeEventListener("keydown",onDown);window.removeEventListener("keyup",onUp);};
  },[screen]);

  useEffect(()=>{
    if(screen!=="game"){ if(animRef.current) cancelAnimationFrame(animRef.current); return; }
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");

    const addFloat=(gs,text,x,y,color="#ffdd44")=>{
      gs.floatingTexts.push({text,x,y,vy:-1.4,life:65,maxLife:65,color});
    };

    const triggerDeath=(gs)=>{
      gs.dino.dead=true;
      gs.deathAnim={ angle:0, angVel:0.12, vy:-5, timeLeft:80 };
    };

    const endGame=(gs)=>{
      if(!gs.alive) return;
      gs.alive=false;
      triggerDeath(gs);
      const earned=Math.floor(gs.fossilsEarned), dist=Math.floor(gs.distance);
      setFossils(f=>f+earned);
      setTotalFossils(f=>f+earned);
      setTotalRuns(r=>r+1);
      setBestDist(b=>Math.max(b,dist));
      setLastRun({fossils:earned,dist});
      setAchievStats(prev=>({
        ...prev,
        totalRuns:prev.totalRuns+1,
        bestDist:Math.max(prev.bestDist,dist),
        totalBones:prev.totalBones+earned,
        nightCycles:prev.nightCycles+gs.nightCycleCount,
        maxCombo:Math.max(prev.maxCombo,gs.maxComboThisRun),
        totalNearMiss:prev.totalNearMiss+gs.nearMissCount,
        giantCrushes:prev.giantCrushes+gs.giantCrushes,
        bestDistNoDash:gs.usedDash?prev.bestDistNoDash:Math.max(prev.bestDistNoDash,dist),
      }));
      // Auto-submit run and check if it makes top 50
      const playerName = getSavedName();
      submitScore(playerName, dist, earned).then(async()=>{
        const board = await fetchLeaderboard();
        const myId = getPlayerId();
        // Find rank of this specific run (same dist)
        const rank = board.findIndex(r => r.player_id === myId && r.best_dist === dist);
        setLastRunRank(rank >= 0 ? rank + 1 : null);
      });
      setTimeout(()=>setScreen("gameover"),1100);
    };

    const loop=(ts)=>{
      if(!lastTimeRef.current) lastTimeRef.current=ts;
      const dt=Math.min((ts-lastTimeRef.current)/16.67,3);
      lastTimeRef.current=ts;
      const gs=gsRef.current;
      if(!gs) return;

      const k=keysRef.current, pk=prevKeysRef.current;
      const hasSpdPw   = !!gs.activePowerups.speed_pw;
      const hasSlowPw  = !!gs.activePowerups.slowmo_pw;
      const hasGiant   = !!gs.activePowerups.giant_pw;
      const hasGhost   = !!gs.activePowerups.ghost_pw;
      const hasTiny    = !!gs.activePowerups.tiny_pw;
      const hasFrenzy  = !!gs.activePowerups.frenzy_pw;
      const hasDoubler = !!gs.activePowerups.doubler_pw;
      const hasWind    = !!gs.activePowerups.coinmania_pw;
      const designId   = gs.design?.id || "raptor";

      // ── Death animation ─────────────────────────────────────────────────────
      if(gs.deathAnim && !gs.alive) {
        const da = gs.deathAnim;
        da.angle    += da.angVel * dt;
        da.vy       += GRAVITY * dt;
        gs.dino.y   += da.vy * dt;
        da.timeLeft -= dt;
        // Render frame then continue loop
        // (full render below, we don't skip it)
      }

      if(gs.alive){
        gs.frame++;
        gs.speed=Math.min(gs.baseSpeed+gs.distance*0.0016,22);
        gs.distance+=gs.speed*dt*0.1;
        gs.groundOffset=(gs.groundOffset+gs.speed*dt)%(CANVAS_W*4);

        // ── Raptor passive: speed rush every 200m ────────────────────────────
        if(designId==="raptor"){
          const milestone=Math.floor(gs.distance/200);
          if(milestone>gs.raptorSpeedBonus){
            gs.raptorSpeedBonus=milestone;
            addFloat(gs,`SPEED RUSH! +5% bones`,80,80,"#00cc66");
          }
        }

        // ── Celestial cycle ──────────────────────────────────────────────────
        const cycleLen=DAY_CYCLE*2;
        const cyclePos=gs.distance%cycleLen;
        const transZone=200;
        let targetBlend;
        if(cyclePos<DAY_CYCLE-transZone)     targetBlend=0;
        else if(cyclePos<DAY_CYCLE)           targetBlend=(cyclePos-(DAY_CYCLE-transZone))/transZone;
        else if(cyclePos<cycleLen-transZone) targetBlend=1;
        else                                 targetBlend=1-(cyclePos-(cycleLen-transZone))/transZone;
        targetBlend=clamp(targetBlend,0,1);
        gs.nightBlend=lerp(gs.nightBlend,targetBlend,0.018*dt);

        gs.sunX -= 0.18*dt;
        if(gs.sunX < -50) gs.sunX = CANVAS_W+50;
        gs.sunAlpha = clamp(1-gs.nightBlend*2.2,0,1);

        if(gs.nightBlend > 0.35 && gs.moonX > CANVAS_W+30) gs.moonX = CANVAS_W+30;
        if(gs.moonX <= CANVAS_W+30){ gs.moonX -= 0.12*dt; if(gs.moonX < -50) gs.moonX = CANVAS_W+80; }
        gs.moonAlpha = clamp((gs.nightBlend-0.3)*3.5,0,1);
        gs.sunY=36; gs.moonY=36;

        const isNightNow=targetBlend>0.5;
        if(isNightNow!==gs.inNight){
          gs.inNight=isNightNow;
          if(isNightNow) gs.nightCycleCount++;
          const baseB=25+Math.floor(gs.distance/80)*4;
          // Spino passive: +30% night bonus
          const spinoMult = designId==="spino" && isNightNow ? 1.3 : 1;
          const bonus=Math.floor(baseB*(1+gs.stats.transBonus)*spinoMult);
          gs.fossilsEarned+=bonus;
          addFloat(gs,`+${bonus} ${isNightNow?"DUSK BONUS":"DAWN BONUS"}`,CANVAS_W/2-50,70,isNightNow?"#aaaaff":"#ffdd44");
          if(!isNightNow){ gs.moonAlpha=0; }
        }

        // ── Powerup ticks ────────────────────────────────────────────────────
        for(const [pid,p] of Object.entries(gs.activePowerups)){
          if(p.duration>0){p.timer-=dt; if(p.timer<=0) delete gs.activePowerups[pid];}
        }
        if(hasWind){
          gs.coinManiaTimer-=dt;
          if(gs.coinManiaTimer<=0){
            gs.pickups.push({x:gs.dino.x+60+Math.random()*200, y:GROUND_Y-24-Math.random()*100, collected:false});
            gs.coinManiaTimer=7;
          }
        }
        if(gs.activePowerups.meteor_pw&&!gs.activePowerups.meteor_pw.fired){
          gs.activePowerups.meteor_pw.fired=true;
          const n=gs.obstacles.length; gs.obstacles=[];
          const bonus=gs.stats.meteorCountBonus||0;
          if(n>0){gs.fossilsEarned+=n*(4+bonus);addFloat(gs,`METEOR! +${n*(4+bonus)}`,60,60,"#ee6600");}
          delete gs.activePowerups.meteor_pw;
        }

        // ── Physics ──────────────────────────────────────────────────────────
        if(hasSpdPw){
          gs.dino.vy+=GRAVITY*dt; gs.dino.y+=gs.dino.vy*dt;
          if(gs.dino.y>=GROUND_Y-DINO_H){gs.dino.y=GROUND_Y-DINO_H;gs.dino.vy=0;gs.dino.onGround=true;}
        } else {
          if(gs.dino.invTimer>0) gs.dino.invTimer-=dt;
          if(gs.dino.dashCooldown>0) gs.dino.dashCooldown-=dt;
          const baseDashCd=Math.max(15,45-gs.stats.dashCdReduction);

          if((k["Space"]||k["ArrowUp"]||k["KeyW"])&&!(pk["Space"]||pk["ArrowUp"]||pk["KeyW"])) doJump();

          // Dash  Efull canvas bounds (10 to CANVAS_W-60)
          if(gs.stats.hasDash&&k["ArrowRight"]&&!pk["ArrowRight"]&&gs.dino.dashTimer<=0&&gs.dino.dashCooldown<=0){
            gs.dino.dashTimer=10; gs.dino.dashDir=1; gs.dino.dashCooldown=baseDashCd; gs.usedDash=true;
          }
          if(gs.stats.hasBackDash&&k["ArrowLeft"]&&!pk["ArrowLeft"]&&gs.dino.dashTimer<=0&&gs.dino.dashCooldown<=0){
            gs.dino.dashTimer=10; gs.dino.dashDir=-1; gs.dino.dashCooldown=baseDashCd; gs.usedDash=true;
          }
          if(gs.stats.hasDuck&&gs.dino.onGround){
            gs.dino.ducking=(k["ArrowDown"]||k["KeyS"]);
          } else if(!gs.dino.onGround){
            if(gs.stats.hasFastDrop&&(k["ArrowDown"]||k["KeyS"])) gs.dino.vy+=GRAVITY*2.5*dt;
            gs.dino.ducking=false;
          }

          gs.dino.vy+=GRAVITY*dt;
          gs.dino.y+=gs.dino.vy*dt;

          if(gs.dino.dashTimer>0){
            gs.dino.x+=gs.dino.dashDir*7*dt;
            gs.dino.dashTimer-=dt;
            // Allow dashing across full map width
            gs.dino.x=Math.max(10, Math.min(CANVAS_W-60, gs.dino.x));
          }
          if(gs.dino.y>=GROUND_Y-DINO_H){
            gs.dino.y=GROUND_Y-DINO_H;
            gs.dino.vy=0;
            gs.dino.onGround=true;
            gs.dino.doubleJumped=false;
          }
        }

        prevKeysRef.current={...k};

        let effSpeed=gs.speed;
        if(hasSpdPw)  effSpeed*=gs.stats.speedMult;
        if(hasSlowPw) effSpeed*=0.38;

        // ── Spawn obstacles ──────────────────────────────────────────────────
        if(gs.comboTimer>0){ gs.comboTimer-=dt; if(gs.comboTimer<=0) gs.combo=0; }
        if(gs.nearMissTimer>0) gs.nearMissTimer-=dt;

        const tier=Math.min(10,Math.floor(gs.distance/180));
        const minGap=Math.max(44,140-effSpeed*5-tier*2.5);
        if(gs.frame-gs.lastObstacleFrame>minGap){
          const r=Math.random();
          const sid2=gs.scenery?.id||"classic";
          let otype,type=0,oy=0,bullets=[];
          if(sid2==="classic") {
            if(r<0.38){otype="cactus";type=Math.floor(Math.random()*(Math.min(4,Math.floor(tier/1.5)+1)+1));}
            else if(r<0.55){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
            else if(r<0.66&&tier>=1){otype="rock";}
            else if(r<0.76&&tier>=2){otype="spike";}
            else if(r<0.86&&tier>=2){otype="spike_cluster";}
            else if(r<0.94&&tier>=3){otype="turret";bullets=[];}
            else if(tier>=1){otype="wall";}
            else{otype="cactus";type=0;}
          } else if(sid2==="desert") {
            if(r<0.30){otype="cactus";type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1));}
            else if(r<0.48){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
            else if(r<0.62){otype="dune";}
            else if(r<0.74&&tier>=1){otype="tumbleweed";}
            else if(r<0.84&&tier>=2){otype="sandworm";}
            else if(r<0.94&&tier>=3){otype="scorpion";bullets=[];}
            else{otype="cactus";type=0;}
          } else if(sid2==="arctic") {
            if(r<0.28){otype="cactus";type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1));}
            else if(r<0.44){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
            else if(r<0.58){otype="icewall";}
            else if(r<0.70&&tier>=1){otype="snowball";}
            else if(r<0.82&&tier>=2){otype="icicle";oy=-20;}
            else if(r<0.94&&tier>=3){otype="yeti";bullets=[];}
            else{otype="cactus";type=0;}
          } else if(sid2==="volcano") {
            if(r<0.26){otype="cactus";type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1));}
            else if(r<0.40){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
            else if(r<0.54){otype="lavarock";}
            else if(r<0.66&&tier>=1){otype="firePillar";}
            else if(r<0.76&&tier>=2){otype="lavaburst";bullets=[];}
            else if(r<0.86&&tier>=2){otype="firewall";}
            else if(r<0.96&&tier>=3){otype="demon";oy=GROUND_Y-110-Math.random()*40;bullets=[];}
            else{otype="lavarock";}
          } else if(sid2==="jungle") {
            if(r<0.28){otype="cactus";type=Math.floor(Math.random()*3);}
            else if(r<0.42){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
            else if(r<0.54){otype="rock";}
            else if(r<0.66&&tier>=1){otype="giantMushroom";}
            else if(r<0.76&&tier>=1){otype="vineTrap";}
            else if(r<0.86&&tier>=2){otype="piranha";}
            else if(r<0.96&&tier>=3){otype="gorilla";bullets=[];}
            else{otype="cactus";type=0;}
          } else if(sid2==="ruins") {
            if(r<0.26){otype="cactus";type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1));}
            else if(r<0.40){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
            else if(r<0.54){otype="pillar";type=Math.floor(Math.random()*3);}
            else if(r<0.66&&tier>=1){otype="boulder";}
            else if(r<0.76&&tier>=2){otype="spiketrap";}
            else if(r<0.87&&tier>=2){otype="statue";bullets=[];}
            else if(r<0.96&&tier>=3){otype="golem";bullets=[];}
            else{otype="pillar";type=0;}
          } else if(sid2==="cave") {
            if(r<0.22){otype="cactus";type=Math.floor(Math.random()*(Math.min(2,Math.floor(tier/2))+1));}
            else if(r<0.36){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
            else if(r<0.50){otype="crystalSpire";type=Math.floor(Math.random()*3);}
            else if(r<0.62&&tier>=1){otype="crystalCluster";}
            else if(r<0.72&&tier>=2){otype="stalactite";oy=-30;}
            else if(r<0.82&&tier>=2){otype="crystalMine";oy=GROUND_Y-80-Math.random()*60;bullets=[];}
            else if(r<0.91&&tier>=3){otype="crystalGolem";bullets=[];}
            else if(r<0.97&&tier>=3){otype="voidPortal";}
            else{otype="crystalSpire";type=0;}
          } else {
            // plains / grasslands
            if(r<0.36){otype="cactus";type=Math.floor(Math.random()*(Math.min(3,Math.floor(tier/1.5)+1)+1));}
            else if(r<0.52){otype="bird";oy=GROUND_Y-88-Math.random()*48;if(tier>2&&Math.random()<0.45)oy=GROUND_Y-44;}
            else if(r<0.64&&tier>=1){otype="rock";}
            else if(r<0.74&&tier>=2){otype="spike";}
            else if(r<0.84&&tier>=1){otype="log";}
            else if(r<0.93&&tier>=3){otype="turret";bullets=[];}
            else if(tier>=1){otype="wall";}
            else{otype="cactus";type=0;}
          }
          gs.obstacles.push({x:CANVAS_W+10,otype,type,y:oy,w:44,bullets,_shootTimer:0});
          // Cluster: ground static obstacles sometimes spawn 1-2 more of the same type close together
          const clusterTypes=["cactus","rock","spike","spike_cluster","wall","log","dune","icewall","lavarock","pillar","boulder","crystalSpire","crystalCluster"];
          if(clusterTypes.includes(otype)&&tier>=1){
            const clusterChance=0.28+tier*0.02; // ~28-48% chance of a cluster
            const count=Math.random()<clusterChance?(Math.random()<0.3?2:1):0;
            for(let ci=0;ci<count;ci++){
              const gap=38+Math.random()*28; // tight gap between cluster members
              const prevX=gs.obstacles[gs.obstacles.length-1].x;
              const clusterType=Math.random()<0.5?type:Math.floor(Math.random()*(Math.min(4,Math.floor(tier/1.5)+1)+1));
              gs.obstacles.push({x:prevX+gap,otype,type:clusterType,y:oy,w:44,bullets:[],_shootTimer:0});
            }
          }
          gs.lastObstacleFrame=gs.frame;
        }

        // ── Spawn pickups / powerups ─────────────────────────────────────────
        if(gs.frame-gs.lastPickupFrame>90){
          if(Math.random()<0.38) gs.pickups.push({x:CANVAS_W+10,y:GROUND_Y-30-Math.random()*90,collected:false});
          gs.lastPickupFrame=gs.frame;
        }
        // Heart: separate low-chance spawn check every ~120 frames
        if(gs.unlockedPowerups.includes("heart_pw")&&gs.frame%120===0){
          if(Math.random()<0.04+gs.stats.heartChance){
            const hdef=POWERUP_DEFS.find(d=>d.id==="heart_pw");
            gs.powerupPickups.push({x:CANVAS_W+10,y:GROUND_Y-32-Math.random()*58,def:hdef,collected:false});
          }
        }
        const spawnThresh=300-gs.stats.rareDrop*200;
        if(gs.frame-gs.lastPowerupFrame>spawnThresh){
          const eligible=POWERUP_DEFS.filter(d=>d.id!=="heart_pw"&&(d.id!=="meteor_pw"||tier>=4)&&gs.unlockedPowerups.includes(d.id));
          gs.lastPowerupFrame=gs.frame;
          if(eligible.length>0){
            const def=eligible[Math.floor(Math.random()*eligible.length)];
            gs.powerupPickups.push({x:CANVAS_W+10,y:GROUND_Y-32-Math.random()*58,def,collected:false});
          }
        }

        // ── Move everything ──────────────────────────────────────────────────
        gs.obstacles=gs.obstacles.filter(o=>{
          o.x-=effSpeed*dt;
          // Turret: shoot horizontal bullets, fires when 1/4 body visible
          if(o.otype==="turret"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(70,130-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-10){
              o._entryShot=true;
              o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:GROUND_Y-32,vx:(-7-tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt;return b.x>-20;});
          }
          // Sandworm: animate height based on dino proximity
          if(o.otype==="sandworm"){
            const dist=Math.abs(o.x-gs.dino.x);
            const maxH=36+tier*4;
            if(dist<420) o._wormH=Math.min(maxH,(o._wormH||0)+2.5*dt);
            else         o._wormH=Math.max(0,(o._wormH||0)-2*dt);
          }
          // Icicle: drop from sky when dino is nearby
          if(o.otype==="icicle"){
            if(o._icicleY===undefined) o._icicleY=-20;
            const dist=Math.abs(o.x-gs.dino.x);
            if(dist<260||o._icicleY>-20){
              o._icicleY=Math.min(GROUND_Y-34,(o._icicleY||0)+5*dt);
            }
          }
          // Lavaburst: shoots lava blobs upward in arc, fires when 1/4 body visible
          if(o.otype==="lavaburst"&&o.x<CANVAS_W-10&&o.x>-60){
            const dist=Math.abs(o.x-gs.dino.x);
            const shootInterval=Math.max(80,140-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-10){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            if(dist<300){
              o._shootTimer=(o._shootTimer||0)+dt;
              if(o._shootTimer>=shootInterval){
                o._shootTimer=0;
                const bSpd=effSpeed/gs.baseSpeed;
                o.bullets.push({x:o.x+14,y:GROUND_Y-22,vx:-1*bSpd,vy:(-8-tier*0.3)*bSpd});
                o.bullets.push({x:o.x+20,y:GROUND_Y-22,vx:-3*bSpd,vy:(-9-tier*0.3)*bSpd});
                o.bullets.push({x:o.x+20,y:GROUND_Y-22,vx:0,      vy:(-7-tier*0.3)*bSpd});
              }
            }
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=0.45*dt;
              return b.x>-30&&b.y<GROUND_Y;
            });
          }
          // Demon: flies and shoots fireballs, fires when 1/4 body visible
          if(o.otype==="demon"&&o.x<CANVAS_W-10&&o.x>-80){
            const shootInterval=Math.max(80,150-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:o.y+14,vx:(-8-tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Yeti: throw ice chunks, fires when 1/4 body visible
          if(o.otype==="yeti"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true;
              o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:GROUND_Y-44,vx:-(7+tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Scorpion: arc venom shots (parabolic), fires when 1/4 body visible
          if(o.otype==="scorpion"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true;
              o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+36,y:GROUND_Y-40,vx:-(6+tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // VineTrap: snap shut when dino is close
          if(o.otype==="vineTrap"){
            const dist=Math.abs(o.x+20-gs.dino.x);
            o._snapState = dist<80 ? Math.min(1,(o._snapState||0)+0.15*dt) : Math.max(0,(o._snapState||0)-0.08*dt);
          }
          // Gorilla: throw coconuts in arc, fires when 1/4 body visible
          if(o.otype==="gorilla"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+2,y:GROUND_Y-50,vx:-(7+tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Spiketrap: extend/retract on timer
          if(o.otype==="spiketrap"){
            o._spikeTimer=(o._spikeTimer||0)+dt;
            const cycle=Math.max(60,100-tier*5);
            const phase=(o._spikeTimer%cycle)/cycle;
            o._spikeH = phase<0.5 ? Math.min(28,phase*2*28) : Math.max(0,(1-phase)*2*28);
          }
          // Statue: shoot horizontal curse beam when dino is nearby, fires when 1/4 body visible
          if(o.otype==="statue"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-9){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            const dist=Math.abs(o.x-gs.dino.x);
            if(dist<320){
              o._shootTimer=(o._shootTimer||0)+dt;
              if(o._shootTimer>=shootInterval){
                o._shootTimer=0;
                const bSpd=effSpeed/gs.baseSpeed;
                o.bullets.push({x:o.x+4,y:GROUND_Y-52,vx:-(7+tier*0.3)*bSpd,vy:0});
              }
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Golem: throw rubble in arc, fires when 1/4 body visible
          if(o.otype==="golem"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+34,y:GROUND_Y-52,vx:-(7+tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Stalactite: drop from ceiling when dino is nearby
          if(o.otype==="stalactite"){
            if(o._stalY===undefined) o._stalY=-30;
            const dist=Math.abs(o.x-gs.dino.x);
            if(dist<280||o._stalY>-30) o._stalY=Math.min(GROUND_Y-42,(o._stalY||0)+5.5*dt);
          }
          // CrystalGolem: shoot 3-way crystal shard spread, fires when 1/4 body visible
          if(o.otype==="crystalGolem"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:GROUND_Y-50,vx:-(7+tier*0.3)*bSpd,vy:0});
              o.bullets.push({x:o.x+4,y:GROUND_Y-60,vx:-(6+tier*0.25)*bSpd,vy:0});
              o.bullets.push({x:o.x+4,y:GROUND_Y-40,vx:-(6+tier*0.25)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt;
              return b.x>-20&&b.y>0&&b.y<GROUND_Y;
            });
          }
          // VoidPortal: pull dino toward it when close (gravity well)
          if(o.otype==="voidPortal"&&o.x<CANVAS_W-10&&o.x>-60&&gs.dino.invTimer<=0&&!hasGhost){
            const dist=gs.dino.x-(o.x+18);
            if(Math.abs(dist)<200&&dist>0){
              const pull=(1-Math.abs(dist)/200)*1.8*dt;
              gs.dino.x=Math.max(10,gs.dino.x-pull);
            }
          }
          // CrystalMine: explode into 4 shards when dino is close
          if(o.otype==="crystalMine"&&!o._exploding){
            const dist=Math.sqrt(Math.pow(o.x+12-gs.dino.x,2)+Math.pow(o.y+12-gs.dino.y,2));
            if(dist<60){
              o._exploding=1;
              o.bullets=[
                {x:o.x+12,y:o.y+12,vx:-6,vy:-6},
                {x:o.x+12,y:o.y+12,vx:6,vy:-6},
                {x:o.x+12,y:o.y+12,vx:-6,vy:4},
                {x:o.x+12,y:o.y+12,vx:6,vy:4},
              ];
            }
          }
          if(o.otype==="crystalMine"&&o._exploding){
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=0.3*dt;
              return b.x>-20&&b.y<GROUND_Y;
            });
            if(o.bullets.length===0) o._exploding=2; // fully done
          }
          return o.x>-100 && o._exploding!==2;
        });

        const magnetRange=gs.activePowerups.magnet_pw?(180+gs.stats.magnetRngBonus):(gs.stats.magnetLevel>0?55+gs.stats.magnetLevel*28:0);
        // Brachio passive: +120px magnet range
        const brachioMagnet = designId==="brachio" ? 120 : 0;
        const effectiveMagnet = magnetRange + brachioMagnet;

        gs.pickups=gs.pickups.filter(p=>{
          p.x-=effSpeed*dt;
          if(effectiveMagnet>0){
            const dx=gs.dino.x+DINO_W/2-(p.x+7),dy=gs.dino.y+DINO_H/2-(p.y+7);
            const d=Math.sqrt(dx*dx+dy*dy);
            if(d<effectiveMagnet&&d>1){p.x+=dx/d*effSpeed*2.2*dt;p.y+=dy/d*effSpeed*2.2*dt;}
          }
          return p.x>-24&&!p.collected;
        });
        gs.powerupPickups=gs.powerupPickups.filter(p=>{p.x-=effSpeed*dt;return p.x>-32&&!p.collected;});
        for(const c of gs.clouds){c.x-=(c.speed||0.25)*dt;if(c.x<-100) c.x=CANVAS_W+100;}

        // ── Hitboxes ─────────────────────────────────────────────────────────
        const effH=gs.dino.ducking?DUCK_H:DINO_H;
        const sc=hasGiant?1.9:hasTiny?0.6:1;
        const DW=(DINO_W-14)*sc, DH=effH*0.82*sc;
        const DX=gs.dino.x+DINO_W/2-DW/2, DY=gs.dino.y+DINO_H-effH*sc;

        // Tri passive: destroy first obstacle automatically
        if(designId==="tri"&&!gs.triFirstDestroyed&&gs.obstacles.length>0){
          gs.triFirstDestroyed=true;
          gs.obstacles.splice(0,1);
          addFloat(gs,"HORN CHARGE!",80,80,"#cc8800");
        }

        // ── Bullet collision (separate from obstacle body) ───────────────────
        // Giant mode: silently destroy all projectiles, no fossils awarded
        if(hasGiant||hasSpdPw){
          for(const o of gs.obstacles){
            if(o.bullets&&o.bullets.length>0){
              o.bullets=o.bullets.filter(b=>!rectsOverlap(DX,DY,DW,DH,b.x,b.y,8,4));
            }
          }
        }
        if(!hasGhost&&!hasGiant&&!hasSpdPw&&gs.dino.invTimer<=0){
          for(const o of gs.obstacles){
            if((o.otype!=="turret"&&o.otype!=="scorpion"&&o.otype!=="yeti"&&o.otype!=="lavaburst"&&o.otype!=="demon"&&o.otype!=="gorilla"&&o.otype!=="statue"&&o.otype!=="golem"&&o.otype!=="crystalGolem"&&o.otype!=="crystalMine")||!o.bullets) continue;
            for(let bi=o.bullets.length-1;bi>=0;bi--){
              const b=o.bullets[bi];
              if(rectsOverlap(DX,DY,DW,DH,b.x,b.y,8,4)){
                o.bullets.splice(bi,1);
                if(gs.activePowerups.shield_pw){
                  gs.shieldHitsLeft--; if(gs.shieldHitsLeft<=0) delete gs.activePowerups.shield_pw;
                  gs.dino.invTimer=20+gs.stats.invFramesBonus;
                } else if(gs.stats.shieldChance>Math.random()){
                  gs.dino.invTimer=20+gs.stats.invFramesBonus;
                } else if(gs.lives>1){
                  gs.lives--; gs.dino.invTimer=30+gs.stats.invFramesBonus;
                  addFloat(gs,"-1 LIFE",gs.dino.x,gs.dino.y-24,"#ee3344");
                } else if(designId==="pachy"&&!gs.pachyReviveUsed){
                  gs.pachyReviveUsed=true; gs.dino.invTimer=50;
                  addFloat(gs,"HARD HEAD! REVIVED!",gs.dino.x-20,gs.dino.y-30,"#ffcc00");
                } else {
                  endGame(gs); return;
                }
                break;
              }
            }
          }
        }

        // Giant / speed crush
        if(hasGiant||hasSpdPw){
          const giantBonusPerKill = designId==="trex" ? 8 : 4;
          gs.obstacles=gs.obstacles.filter(o=>{
            const hb=getObstacleHitbox(o);
            if(rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h)){
              gs.fossilsEarned+=giantBonusPerKill; gs.giantCrushes++;
              if(o.bullets) o.bullets=[];
              addFloat(gs,`+${giantBonusPerKill}`,hb.x+hb.w/2,hb.y-10,"#cc4400");
              return false;
            }
            return true;
          });
        } else if(!hasGhost){
          for(let i=gs.obstacles.length-1;i>=0;i--){
            const o=gs.obstacles[i];
            const hb=getObstacleHitbox(o);

            // Dilopho passive: 15% venom dissolve
            if(designId==="dilopho"&&Math.random()<0.15&&rectsOverlap(DX,DY,DW+30,DH,hb.x,hb.y,hb.w,hb.h)){
              gs.obstacles.splice(i,1);
              addFloat(gs,"VENOM!",hb.x,hb.y-10,"#66dd22");
              continue;
            }

            // Anky passive: near miss destroys obstacle
            if(designId==="anky"&&!rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h)&&
               rectsOverlap(DX,DY,DW,DH,hb.x-12,hb.y-8,hb.w+24,hb.h+16)){
              gs.obstacles.splice(i,1);
              addFloat(gs,"CLUB SWEEP!",hb.x,hb.y-10,"#ffaa00");
              if(gs.stats.nearMissBonus>0){gs.fossilsEarned+=gs.stats.nearMissBonus;}
              gs.nearMissCount++;
              continue;
            }

            // Near miss detection
            if(!rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h)&&
               rectsOverlap(DX,DY,DW,DH,hb.x-12,hb.y-8,hb.w+24,hb.h+16)&&gs.nearMissTimer<=0){
              gs.nearMissTimer=38; gs.nearMissCount++;
              if(gs.stats.nearMissBonus>0){
                gs.fossilsEarned+=gs.stats.nearMissBonus;
                addFloat(gs,`NR MISS +${gs.stats.nearMissBonus}`,gs.dino.x-8,gs.dino.y-22,"#ffaa00");
              }
            }

            // Collision
            if(gs.dino.invTimer<=0&&rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h)){
              if(gs.activePowerups.shield_pw){
                gs.shieldHitsLeft--; if(gs.shieldHitsLeft<=0) delete gs.activePowerups.shield_pw;
                gs.obstacles.splice(i,1); gs.dino.invTimer=20+gs.stats.invFramesBonus;
              } else if(gs.stats.shieldChance>Math.random()){
                // Stego passive: doubled shield chance already handled (shield level multiplied at stats time, but here we have separate)
                // For stego, the shieldChance is already correct from upgrades
                gs.obstacles.splice(i,1); gs.dino.invTimer=20+gs.stats.invFramesBonus;
              } else if(gs.lives>1){
                gs.lives--;
                gs.obstacles.splice(i,1);
                gs.dino.invTimer=30+gs.stats.invFramesBonus;
                addFloat(gs,"-1 LIFE",gs.dino.x,gs.dino.y-24,"#ee3344");
              } else {
                // Pachy passive: one free revive per run
                if(designId==="pachy"&&!gs.pachyReviveUsed){
                  gs.pachyReviveUsed=true;
                  gs.obstacles.splice(i,1);
                  gs.dino.invTimer=50;
                  addFloat(gs,"HARD HEAD! REVIVED!",gs.dino.x-20,gs.dino.y-30,"#ffcc00");
                } else {
                  endGame(gs); return;
                }
              }
              break;
            }
          }
        }

        // ── Collect bones ────────────────────────────────────────────────────
        const nightM  = 1+(gs.nightBlend*gs.stats.nightBonus);
        const frenzyM = hasFrenzy?3:1;
        const doubM   = hasDoubler?2:1;
        // Raptor speed rush: +5% per milestone
        const raptorM = designId==="raptor" ? 1+(gs.raptorSpeedBonus*0.05) : 1;

        for(const p of gs.pickups){
          if(!p.collected&&rectsOverlap(DX,DY,DW,DH,p.x,p.y,14,14)){
            p.collected=true; gs.combo++; gs.comboTimer=120;
            if(gs.combo>gs.maxComboThisRun) gs.maxComboThisRun=gs.combo;
            // Para passive: combo decays slower (handled via comboTimer boost)
            if(designId==="para") gs.comboTimer=180; // 50% longer
            // Pterodac passive: airborne pickups worth 2x
            const pteroM = (designId==="pterodac"&&!gs.dino.onGround) ? 2 : 1;
            const earned=gs.stats.fossilMult*(1+gs.combo*(0.08+gs.stats.comboBonus))*nightM*frenzyM*doubM*raptorM*pteroM*1.3;
            gs.fossilsEarned+=earned;
          }
        }
        for(const p of gs.powerupPickups){
          if(!p.collected&&rectsOverlap(DX,DY,DW,DH,p.x,p.y,22,22)){
            p.collected=true;
            const def=p.def;
            if(def.id==="shield_pw"){gs.activePowerups.shield_pw={timer:Infinity,duration:0};gs.shieldHitsLeft=gs.stats.shieldHits;}
            else if(def.id==="meteor_pw"){gs.activePowerups.meteor_pw={timer:1,duration:1,fired:false};}
            else if(def.id==="heart_pw"){
              if(gs.lives<4){gs.lives++;addFloat(gs,"+1 LIFE!",gs.dino.x-10,gs.dino.y-28,"#dd2244");}
              else{const b=Math.floor(20*gs.stats.fossilMult);gs.fossilsEarned+=b;addFloat(gs,`FULL HP +${b}`,gs.dino.x-10,gs.dino.y-28,"#ffdd44");}
            }
            else{
              const dBonus=def.id==="giant_pw"?gs.stats.giantDurBonus
                :def.id==="frenzy_pw"?gs.stats.frenzyDurBonus
                :def.id==="ghost_pw"?gs.stats.ghostDurBonus
                :def.id==="tiny_pw"?gs.stats.tinyDurBonus
                :def.id==="doubler_pw"?gs.stats.doublerDurBonus
                :def.id==="slowmo_pw"?gs.stats.slowDurBonus
                :def.id==="coinmania_pw"?gs.stats.windfallDurBonus
                :0;
              gs.activePowerups[def.id]={timer:def.duration+dBonus,duration:def.duration+dBonus};
            }
            if(def.id!=="heart_pw") addFloat(gs,def.label+"!",CANVAS_W/2-28,96,def.color);
          }
        }

        gs.fossilsEarned+=gs.speed*0.0015*gs.stats.fossilMult*nightM*frenzyM*doubM*raptorM*dt;
        gs.floatingTexts=gs.floatingTexts.filter(t=>{t.y+=t.vy*dt;t.life-=dt;return t.life>0;});

        // ── Entity silhouette update ─────────────────────────────────────────
        const ent = gs.entity;
        if(!ent.visible) {
          // 1% chance per ~60 frames (once per second check)
          if(gs.frame % 60 === 0 && Math.random() < 0.01) {
            ent.visible = true;
            ent.fadeDir = 1;
            ent.x = CANVAS_W * (0.5 + Math.random() * 0.35);
            ent.y = 30 + Math.random() * 40;
          }
        } else {
          if(ent.fadeDir === 1) {
            ent.alpha = Math.min(0.72, ent.alpha + 0.012 * dt);
            if(ent.alpha >= 0.72) { ent.fadeDir = 0; ent.timer = 180 + Math.random() * 240; }
          } else if(ent.fadeDir === 0) {
            ent.timer -= dt;
            if(ent.timer <= 0) ent.fadeDir = -1;
          } else {
            ent.alpha = Math.max(0, ent.alpha - 0.002 * dt);
            if(ent.alpha <= 0) ent.visible = false;
          }
        }
      }

      // ══╁ERENDER ════════════════════════════════════════════════════════════
      const B   = gs.nightBlend;
      const SCN = gs.scenery||SCENERIES[0];
      const SC  = getSceneryColors(SCN,B);

      ctx.fillStyle=SC.bg; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      if(B>0.05) drawStars(ctx,gs.stars,B);
      drawPixelSun(ctx,gs.sunX,gs.sunY,gs.sunAlpha);
      drawPixelMoon(ctx,gs.moonX,gs.moonY,gs.moonAlpha);
      drawClouds(ctx,gs.clouds,SCN);
      if(gs.entity.alpha>0) drawEntitySilhouette(ctx,gs.entity.x,gs.entity.y,gs.frame,gs.entity.alpha,SCN);
      drawGround(ctx,gs.groundOffset,SCN,B);

      for(const o of gs.obstacles){ o._nightBlend=B; }
      for(const o of gs.obstacles) drawObstacleForScenery(ctx,o,SCN,gs.frame);

      const HUD = getHudColors(SCN, B);
      for(const p of gs.pickups){ if(!p.collected) drawBonePickup(ctx,p.x,p.y,HUD.bonePick); }

      for(const p of gs.powerupPickups){
        if(!p.collected){
          const pulse=0.8+Math.sin(gs.frame*0.14)*0.2;
          ctx.save(); ctx.globalAlpha=pulse;
          drawPowerupIcon(ctx,p.def.id,p.x,p.y,p.def.color);
          ctx.restore();
        }
      }

      // Powerup overlays
      const hasSpdPwR  = !!gs.activePowerups.speed_pw;
      const hasGiantR  = !!gs.activePowerups.giant_pw;
      const hasGhostR  = !!gs.activePowerups.ghost_pw;
      const hasSlowPwR = !!gs.activePowerups.slowmo_pw;
      const hasFrenzyR = !!gs.activePowerups.frenzy_pw;
      const hasDoublerR= !!gs.activePowerups.doubler_pw;
      const hasTinyR   = !!gs.activePowerups.tiny_pw;

      if(gs.activePowerups.shield_pw){
        ctx.strokeStyle="#4488dd";ctx.lineWidth=2;ctx.beginPath();
        ctx.arc(gs.dino.x+DINO_W/2,gs.dino.y+DINO_H/2,DINO_W,0,Math.PI*2);ctx.stroke();
      }
      if(hasSpdPwR){const sc2=gs.skin?.color||"#2a2a2a";for(let i=1;i<=4;i++){ctx.fillStyle=sc2;ctx.globalAlpha=0.1;ctx.fillRect(gs.dino.x-i*14,gs.dino.y+4,DINO_W,DINO_H-8);}ctx.globalAlpha=1;}
      if(hasSlowPwR){ctx.fillStyle="rgba(34,187,170,0.06)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
      if(hasGiantR){ctx.fillStyle="rgba(200,68,0,0.07)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
      if(hasGhostR){ctx.fillStyle="rgba(136,136,200,0.07)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
      if(hasFrenzyR){ctx.fillStyle=`rgba(220,30,100,${0.04+Math.sin(gs.frame*0.18)*0.03})`;ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
      if(hasDoublerR){ctx.fillStyle="rgba(255,220,30,0.06)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}

      // Draw dino  Epass onGround so legs freeze mid-air
      drawDino(ctx,gs.dino.x,gs.dino.y,gs.frame,gs.dino.dead,
        gs.skin,gs.design,hasGiantR,gs.dino.ducking,hasTinyR,hasGhostR,
        gs.dino.invTimer, gs.dino.onGround, gs.deathAnim);

      // Floating texts
      for(const t of gs.floatingTexts){
        const a=Math.min(1,t.life/t.maxLife*2);
        ctx.globalAlpha=a; ctx.fillStyle=t.color; ctx.font="bold 11px 'Courier New'";
        ctx.fillText(t.text,t.x,t.y); ctx.globalAlpha=1;
      }

      // HUD
      ctx.font="bold 14px 'Courier New'"; ctx.fillStyle=HUD.hud;
      ctx.textAlign="right";
      ctx.fillText(`${Math.floor(gs.distance)}m`,CANVAS_W-8,24);
      ctx.textAlign="left";
      drawFossilDiamond(ctx,10+13/2,8+13/2,13,HUD.fossil);
      ctx.font="bold 13px 'Courier New'"; ctx.fillStyle=HUD.hud;
      ctx.fillText(`${Math.floor(gs.fossilsEarned)}`,28,20);

      // Hearts
      if(gs.lives>0){
        const heartSize=14,heartGap=4;
        const totalW=gs.lives*(heartSize+heartGap)-heartGap;
        const startX=CANVAS_W-totalW-8,heartY=CANVAS_H-heartSize-8;
        for(let i=0;i<gs.lives;i++) drawHeart(ctx,startX+i*(heartSize+heartGap),heartY,heartSize,HUD.heart);
      }

      // Combo
      if(gs.combo>1){
        ctx.fillStyle=HUD.hud;ctx.font="11px 'Courier New'";
        ctx.fillText(`x${gs.combo} COMBO`,12,40);
      }

      // Active dino passive indicator
      const designId2 = gs.design?.id || "raptor";
      const passive = DINO_PASSIVES[designId2];
      if(passive){
        ctx.fillStyle=HUD.hud; ctx.globalAlpha=0.55;
        ctx.font="9px 'Courier New'";
        ctx.fillText(`[${passive.label}]`,12,54);
        ctx.globalAlpha=1;
      }

      // Day/night label
      if(B>0.08&&B<0.92){
        const lbl=gs.inNight?"DUSK":"DAWN";
        const a=Math.sin(gs.frame*0.07)*0.3+0.55;
        ctx.fillStyle=`rgba(180,160,80,${a})`;ctx.font="bold 10px 'Courier New'";
        ctx.textAlign="center";ctx.fillText(lbl,CANVAS_W/2,24);ctx.textAlign="left";
      }

      // Dash cooldown bar
      if((gs.stats.hasDash||gs.stats.hasBackDash)&&gs.dino.dashCooldown>0){
        const baseCd=Math.max(15,45-gs.stats.dashCdReduction);
        const frac=gs.dino.dashCooldown/baseCd;
        ctx.fillStyle="rgba(0,0,0,0.22)";ctx.fillRect(gs.dino.x,gs.dino.y-8,DINO_W,3);
        ctx.fillStyle="#ffaa44";ctx.fillRect(gs.dino.x,gs.dino.y-8,Math.floor(DINO_W*(1-frac)),3);
      }

      // Powerup bars
      let barY=44;
      for(const [pid,p] of Object.entries(gs.activePowerups)){
        const def=POWERUP_DEFS.find(d=>d.id===pid);
        if(!def) continue;
        if(def.duration>0&&p.duration>0){
          const frac=Math.max(0,p.timer/p.duration);
          ctx.fillStyle="rgba(0,0,0,0.22)";ctx.fillRect(CANVAS_W-88,barY,76,6);
          ctx.fillStyle=def.color;ctx.fillRect(CANVAS_W-88,barY,Math.floor(76*frac),6);
          ctx.fillStyle=HUD.hud;ctx.font="9px 'Courier New'";
          ctx.fillText(def.label,CANVAS_W-88,barY+17);barY+=20;
        } else if(def.duration===0){
          ctx.fillStyle=def.color;ctx.font="bold 9px 'Courier New'";
          ctx.fillText(`[${def.label}] x${gs.shieldHitsLeft}`,CANVAS_W-92,barY+8);barY+=16;
        }
      }

      // Raptor speed rush indicator
      if(designId2==="raptor"&&gs.raptorSpeedBonus>0){
        ctx.fillStyle=HUD.hud;ctx.font="9px 'Courier New'";
        ctx.fillText(`RUSH x${gs.raptorSpeedBonus} (+${(gs.raptorSpeedBonus*5)}%)`,12,68);
      }

      animRef.current=requestAnimationFrame(loop);
    };

    lastTimeRef.current=null;
    animRef.current=requestAnimationFrame(loop);
    return ()=>{ if(animRef.current) cancelAnimationFrame(animRef.current); };
  },[screen,doJump]);

  // ─── BUY FUNCTIONS ───────────────────────────────────────────────────────
  const buyUpgrade = useCallback((up)=>{
    setFossils(cur=>{
      const level=upgradeLevels[up.id]||0;
      if(level>=up.maxLevel){showNotif("Already maxed!");return cur;}
      const cost=getUpgradeCost(up,level);
      if(cur<cost){showNotif("Not enough bones!");return cur;}
      setUpgradeLevels(prev=>({...prev,[up.id]:(prev[up.id]||0)+1}));
      setAchievStats(prev=>{
        const nu=prev.totalUpgrades+1;
        const mvIds=["jump","dblJump","dash","backdash","fastdrop","duck","dashCd"];
        const allMax=mvIds.every(id=>(upgradeLevels[id]||0)>=(UPGRADES.find(u=>u.id===id)?.maxLevel||1));
        return {...prev,totalUpgrades:nu,allMovementMax:allMax};
      });
      showNotif(`${up.label} upgraded!`);
      return +(cur-cost).toFixed(1);
    });
  },[upgradeLevels,showNotif]);

  const buySkin = useCallback((sk)=>{
    if(ownedSkins.includes(sk.id)){setEquippedSkin(sk.id);showNotif(`${sk.label} equipped!`);return;}
    setFossils(cur=>{
      if(cur<sk.cost){showNotif("Not enough bones!");return cur;}
      setOwnedSkins(p=>[...p,sk.id]); setEquippedSkin(sk.id);
      setAchievStats(prev=>({...prev,ownedSkins:prev.ownedSkins+1}));
      showNotif(`${sk.label} skin unlocked!`);
      return cur-sk.cost;
    });
  },[ownedSkins,showNotif]);

  const buyDesign = useCallback((d)=>{
    if(ownedDesigns.includes(d.id)){setEquippedDesign(d.id);showNotif(`${d.label} equipped!`);return;}
    setFossils(cur=>{
      if(cur<d.cost){showNotif("Not enough bones!");return cur;}
      setOwnedDesigns(p=>[...p,d.id]); setEquippedDesign(d.id);
      showNotif(`${d.label} unlocked!`);
      return cur-d.cost;
    });
  },[ownedDesigns,showNotif]);

  const buyScenery = useCallback((s)=>{
    if(ownedSceneries.includes(s.id)){setActiveScenery(s.id);showNotif(`${s.label} activated!`);return;}
    setFossils(cur=>{
      if(cur<s.cost){showNotif("Not enough bones!");return cur;}
      setOwnedSceneries(p=>[...p,s.id]); setActiveScenery(s.id);
      setAchievStats(prev=>({...prev,ownedSceneries:prev.ownedSceneries+1}));
      showNotif(`${s.label} unlocked!`);
      return cur-s.cost;
    });
  },[ownedSceneries,showNotif]);

  const unlockPowerup = useCallback((def)=>{
    if(unlockedPowerups.includes(def.id)){showNotif(`${def.label} already unlocked!`);return;}
    setFossils(cur=>{
      if(cur<def.unlockCost){showNotif("Not enough bones!");return cur;}
      setUnlockedPowerups(p=>[...p,def.id]);
      showNotif(`${def.label} powerup unlocked!`);
      return cur-def.unlockCost;
    });
  },[unlockedPowerups,showNotif]);

  const stats=getStats(upgradeLevels);

  // ─── STYLES ──────────────────────────────────────────────────────────────
  const F      = "'Courier New', monospace";
  const BG     = "#f0ede6";
  const DARK   = "#1a1a1a";
  const BORDER = "#2a2a2a";
  const MUTED  = "#888";

  const outer={minHeight:"100vh",background:BG,fontFamily:F,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",userSelect:"none",boxSizing:"border-box",width:"100%",overflowX:"hidden"};
  const wrap=(maxW=560)=>({width:"100%",maxWidth:maxW,padding:"20px 16px",boxSizing:"border-box",margin:"0 auto"});
  const card={background:"#faf8f4",border:`2px solid ${BORDER}`,padding:"28px",boxSizing:"border-box",width:"100%"};
  const btn=(primary=false,small=false)=>({background:primary?DARK:BG,color:primary?BG:DARK,border:`2px solid ${BORDER}`,padding:small?"5px 12px":"10px 20px",fontSize:small?10:12,fontFamily:F,cursor:"pointer",letterSpacing:2,fontWeight:"bold",boxSizing:"border-box",transition:"opacity 0.1s"});
  const notifBox={position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:DARK,color:BG,padding:"9px 22px",fontSize:11,letterSpacing:2,zIndex:999,whiteSpace:"nowrap",border:`1px solid #555`};
  const achivNotifBox={position:"fixed",top:24,left:"50%",transform:"translateX(-50%)",background:"#1a1a2a",color:"#ffdd44",padding:"10px 24px",fontSize:11,letterSpacing:2,zIndex:999,whiteSpace:"nowrap",border:`1px solid #ffdd44`};
  const tierColors={bronze:"#cd7f32",silver:"#aaa",gold:"#d4a820",legend:"#9944cc"};

  const renderDinoCanvas=(el,skin,design)=>{
    if(!el) return;
    const c=el.getContext("2d");
    c.clearRect(0,0,60,58);
    drawDino(c,10,6,0,false,skin,design,false,false,false,false,0,true,null);
  };

  // ─── SCREENS ─────────────────────────────────────────────────────────────
  if(screen==="menu") return (
    <div style={{...outer,justifyContent:"center"}}>
      <div style={{...wrap(480),display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={card}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:36,fontWeight:"bold",letterSpacing:4,marginBottom:2}}>DINO</div>
            <div style={{fontSize:14,letterSpacing:6,marginBottom:16,color:MUTED}}>REIMAGINED</div>
            <div style={{position:"relative",display:"inline-block",margin:"0 auto 16px"}}>
              <canvas ref={menuCanvasRef} width={80} height={70} style={{display:"block",cursor:"pointer"}}
                onClick={()=>{
                  const next=menuDinoClicks+1;
                  setMenuDinoClicks(next);
                  if(next>=5){setShowCredit(true);setMenuDinoClicks(0);setTimeout(()=>setShowCredit(false),3000);}
                }}/>
              {showCredit&&<div style={{position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)",fontSize:9,color:"#888",whiteSpace:"nowrap",letterSpacing:1,pointerEvents:"none"}}>By Hasim Tordios</div>}
            </div>
            <p style={{fontSize:11,color:MUTED,marginBottom:22,lineHeight:2,letterSpacing:1}}>
              Run. Collect bones. Upgrade. Evolve.<br/>Outlast the digital extinction.
            </p>
          </div>
          <div style={{marginBottom:8}}>
            <button style={{...btn(true),width:"100%",fontSize:14,padding:"13px 0",letterSpacing:4}} onClick={startGame}>[ RUN ]</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <button style={{...btn(false),width:"100%"}} onClick={()=>setScreen("shop")}>[ UPGRADES ]</button>
            <button style={{...btn(false),width:"100%"}} onClick={()=>setScreen("skins")}>[ COLLECTION ]</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <button style={{...btn(false),width:"100%",padding:"10px 2px",letterSpacing:0}} onClick={()=>setScreen("achievements")}>[ ACHIEVEMENTS ]</button>
            <button style={{...btn(false),width:"100%",padding:"10px 2px",letterSpacing:0}} onClick={()=>setScreen("leaderboard")}>[ LEADERBOARDS ]</button>
          </div>
          {totalRuns>0&&(
            <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid #ddd",fontSize:11,color:MUTED,textAlign:"center",lineHeight:2}}>
              <div>BEST <b style={{color:DARK}}>{bestDist}m</b> &nbsp;|&nbsp; RUNS <b style={{color:DARK}}>{totalRuns}</b></div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                <span style={{fontSize:16,color:DARK}}>◈</span>
                <b style={{color:DARK}}>{Math.floor(fossils)}</b>
                {passiveRate>0&&<span style={{color:MUTED,fontSize:10}}>(+{passiveRate.toFixed(1)}/s)</span>}
              </div>
            </div>
          )}
        </div>
      </div>
      {notification&&<div style={notifBox}>{notification}</div>}
      {achivNotif&&<div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );

  if(screen==="gameover") return (
    <div style={{...outer,justifyContent:"center"}}>
      <div style={{...wrap(460),display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={card}>
          <div style={{textAlign:"center",marginBottom:22}}>
            <div style={{fontSize:11,letterSpacing:5,color:MUTED,marginBottom:6}}>EXTINCT</div>
            <div style={{fontSize:28,fontWeight:"bold",letterSpacing:3}}>GAME OVER</div>
          </div>
          {lastRun&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:22}}>
              {[["DISTANCE",`${lastRun.dist}m`],["BONES EARNED",`${lastRun.fossils}`],["BEST DIST",`${bestDist}m`],["TOTAL BONES",`${Math.floor(fossils)}`]].map(([l,v])=>(
                <div key={l} style={{background:"#f0ede6",border:"1px solid #ddd",padding:"10px 8px",textAlign:"center"}}>
                  <div style={{fontSize:9,letterSpacing:2,color:MUTED,marginBottom:4}}>{l}</div>
                  <div style={{fontSize:16,fontWeight:"bold"}}>{v}</div>
                </div>
              ))}
            </div>
          )}
          {/* ── Auto-submitted rank badge ── */}
          {lastRunRank !== null && (
            <div style={{marginBottom:16,padding:"12px 14px",background:DARK,color:BG,textAlign:"center",letterSpacing:2,fontSize:11}}>
              🏆 YOUR RUN RANKED <span style={{color:lastRunRank<=3?tierColors[lastRunRank===1?"gold":lastRunRank===2?"silver":"bronze"]:BG,fontWeight:"bold",fontSize:14}}>#{lastRunRank}</span> ON THE LEADERBOARD!
              <div style={{fontSize:9,color:"#aaa",marginTop:4,letterSpacing:1}}>as {getSavedName()}</div>
            </div>
          )}
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:10}}>
            <button style={btn(true)} onClick={startGame}>[ RUN AGAIN ]</button>
            <button style={btn(false)} onClick={()=>setScreen("shop")}>[ UPGRADES ]</button>
          </div>
          <button style={{...btn(false),width:"100%",borderColor:"#ddd",color:MUTED,fontSize:10}} onClick={()=>setScreen("menu")}>[ MENU ]</button>
          <div style={{textAlign:"center",marginTop:12,fontSize:10,color:MUTED,letterSpacing:1}}>PRESS ENTER OR SPACE TO RUN AGAIN</div>
        </div>
      </div>
      {notification&&<div style={notifBox}>{notification}</div>}
      {achivNotif&&<div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );

  if(screen==="game") return (
    <div style={{...outer,justifyContent:"center",padding:0}}>
      <div style={{width:"100%",maxWidth:CANVAS_W,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 4px",boxSizing:"border-box",fontFamily:F,fontSize:11,color:MUTED}}>
          <span style={{letterSpacing:3,fontSize:10}}>DINO REIMAGINED</span>
          <span style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:14,color:DARK}}>◈</span>
            <b style={{color:DARK,fontSize:13}}>{Math.floor(fossils)}</b>
          </span>
        </div>
        <div style={{border:`2px solid ${BORDER}`,lineHeight:0,width:"100%"}}>
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{display:"block",width:"100%"}} onClick={doJump}/>
        </div>
      </div>
    </div>
  );

  if(screen==="shop") {
    const catUpgrades=UPGRADES.filter(u=>u.cat===shopTab);
    return (
      <div style={outer}>
        <div style={{...wrap(620)}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={{fontSize:10,letterSpacing:4,color:MUTED}}>UPGRADE LAB</div>
              <div style={{fontSize:20,fontWeight:"bold",letterSpacing:2}}>FOSSIL SHOP</div>
            </div>
            <div style={{textAlign:"right",display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:16}}>◈</span>
              <div>
                <div style={{fontSize:16,fontWeight:"bold"}}>{Math.floor(fossils)}</div>
                {passiveRate>0&&<div style={{fontSize:9,color:MUTED}}>+{passiveRate.toFixed(1)}/sec</div>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            {UPGRADE_CATS.map(cat=>(
              <button key={cat} style={btn(shopTab===cat,true)} onClick={()=>setShopTab(cat)}>{cat.toUpperCase()}</button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {catUpgrades.filter(up=>shopTab!=="powerups").map(up=>{
              const level=upgradeLevels[up.id]||0;
              const maxed=level>=up.maxLevel;
              const cost=maxed?0:getUpgradeCost(up,level);
              const canAfford=fossils>=cost;
              return (
                <div key={up.id} onClick={()=>!maxed&&buyUpgrade(up)} style={{background:maxed?"#ebe8e2":"#faf8f4",border:`2px solid ${maxed?"#ccc":canAfford?BORDER:"#ccc"}`,padding:"11px",cursor:maxed?"default":canAfford?"pointer":"not-allowed",opacity:maxed?0.65:1,boxSizing:"border-box"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"flex-start"}}>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{fontSize:14,color:DARK}}>{up.icon}</span>
                      <span style={{fontSize:11,fontWeight:"bold"}}>{up.label}</span>
                    </div>
                    <span style={{fontSize:9,color:MUTED}}>{level}/{up.maxLevel}</span>
                  </div>
                  <div style={{fontSize:10,color:MUTED,marginBottom:7,lineHeight:1.6}}>{up.desc}</div>
                  <div style={{height:2,background:"#e0ddd8",marginBottom:7,overflow:"hidden"}}>
                    <div style={{height:"100%",background:DARK,width:`${Math.min(100,(level/up.maxLevel)*100)}%`}}/>
                  </div>
                  <div style={{fontSize:11,fontWeight:"bold",color:maxed?"#bbb":canAfford?DARK:"#bbb"}}>
                    {maxed?"MAX":`◈ ${cost}`}
                  </div>
                </div>
              );
            })}
          </div>
          {shopTab==="powerups"&&(()=>{
            const pwUpgradeMap={
              shield_pw:    ["pwShieldDur"],
              speed_pw:     ["pwSpeedMult"],
              giant_pw:     ["pwGiantDur"],
              magnet_pw:    ["pwMagnetRng"],
              frenzy_pw:    ["pwFrenzyDur"],
              coinmania_pw: ["pwRareDrop","pwWindfallDur"],
              ghost_pw:     ["pwGhostDur"],
              tiny_pw:      ["pwTinyDur"],
              meteor_pw:    ["pwMeteorCount"],
              doubler_pw:   ["pwRareDrop","pwDoublerDur"],
              heart_pw:     ["pwHeartChance"],
              slowmo_pw:    ["pwSlowDur"],
            };
            return (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {POWERUP_DEFS.map(def=>{
                  const owned=unlockedPowerups.includes(def.id);
                  const canAffordUnlock=fossils>=def.unlockCost;
                  const relatedUps=(pwUpgradeMap[def.id]||[]).map(uid=>UPGRADES.find(u=>u.id===uid)).filter(Boolean);
                  return (
                    <div key={def.id} style={{background:owned?"#faf8f4":"#f5f2ec",border:`2px solid ${owned?BORDER:canAffordUnlock?"#aaa":"#ccc"}`,padding:"11px",boxSizing:"border-box",minHeight:160}}>
                      {/* Header: icon + name */}
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                        <canvas width={22} height={22} style={{display:"block",flexShrink:0,background:"transparent"}}
                          ref={el=>{ if(!el) return; const c=el.getContext("2d"); c.clearRect(0,0,22,22); drawPowerupIcon(c,def.id,0,0,def.color); }}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:11,fontWeight:"bold",letterSpacing:1}}>{def.label}</div>
                          <div style={{fontSize:9,color:MUTED,lineHeight:1.4}}>{def.desc}</div>
                        </div>
                      </div>
                      {/* Unlock button  Eonly shown when not yet unlocked */}
                      {!owned&&(
                        <div onClick={()=>unlockPowerup(def)}
                          style={{fontSize:10,fontWeight:"bold",padding:"4px 8px",marginBottom:relatedUps.length?8:0,
                            background:canAffordUnlock?DARK:"#ccc",
                            color:"#f0ede6",cursor:canAffordUnlock?"pointer":"not-allowed",
                            textAlign:"center",letterSpacing:1}}>
                          {`◈ ${def.unlockCost} UNLOCK`}
                        </div>
                      )}
                      {/* Inline upgrades  Eonly shown once unlocked */}
                      {owned&&relatedUps.map(up=>{
                        const level=upgradeLevels[up.id]||0;
                        const maxed=level>=up.maxLevel;
                        const cost=maxed?0:getUpgradeCost(up,level);
                        const canAfford=fossils>=cost;
                        return (
                          <div key={up.id} onClick={()=>!maxed&&buyUpgrade(up)}
                            style={{borderTop:"1px solid #ddd",paddingTop:6,cursor:maxed?"default":canAfford?"pointer":"not-allowed",opacity:maxed?0.6:1}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                              <span style={{fontSize:10,fontWeight:"bold"}}>{up.label}</span>
                              <span style={{fontSize:9,color:MUTED}}>{level}/{up.maxLevel}</span>
                            </div>
                            <div style={{fontSize:9,color:MUTED,marginBottom:4,lineHeight:1.4}}>{up.desc}</div>
                            <div style={{height:2,background:"#e0ddd8",marginBottom:4,overflow:"hidden"}}>
                              <div style={{height:"100%",background:def.color,width:`${Math.min(100,(level/up.maxLevel)*100)}%`}}/>
                            </div>
                            <div style={{fontSize:10,fontWeight:"bold",color:maxed?"#bbb":canAfford?DARK:"#bbb"}}>
                              {maxed?"MAX":`◈ ${cost}`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })()}
          <div style={{padding:"12px",border:"1px solid #ddd",background:"#f5f2ec",marginBottom:12,fontSize:10,color:MUTED}}>
            <div style={{letterSpacing:3,marginBottom:8,fontSize:9}}>CURRENT STATS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
              {[["Jump",`+${stats.jumpBoost.toFixed(1)}`],["Bone x",`${stats.fossilMult.toFixed(2)}`],["Shield",`${(stats.shieldChance*100).toFixed(0)}%`],["Passive",`${stats.passiveFossils.toFixed(1)}/s`],["Combo+",`${stats.comboBonus.toFixed(2)}`],["Lives",`${1+stats.extraLives}`]].map(([l,v])=>(
                <div key={l}><span style={{color:"#aaa"}}>{l}: </span><b style={{color:DARK}}>{v}</b></div>
              ))}
            </div>
            <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>
              {[stats.hasDoubleJump&&"DBL JUMP",stats.hasDash&&"DASH FWD",stats.hasBackDash&&"DASH BCK",stats.hasFastDrop&&"FAST DRP",stats.hasDuck&&"DUCK",stats.hasMagnet&&"MAGNET"].filter(Boolean).map(s=>(
                <span key={s} style={{background:DARK,color:BG,fontSize:9,padding:"2px 7px",letterSpacing:1}}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{...btn(true),flex:1}} onClick={startGame}>[ RUN ]</button>
            <button style={{...btn(false),flex:1}} onClick={()=>setScreen("skins")}>[ COLLECTION ]</button>
            <button style={{...btn(false),flex:1}} onClick={()=>setScreen("menu")}>[ MENU ]</button>
          </div>
        </div>
        {notification&&<div style={notifBox}>{notification}</div>}
        {achivNotif&&<div style={achivNotifBox}>{achivNotif}</div>}
      </div>
    );
  }

  if(screen==="skins") {
    return (
      <div style={outer}>
        <div style={{...wrap(660)}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={{fontSize:10,letterSpacing:4,color:MUTED}}>COLLECTION</div>
              <div style={{fontSize:20,fontWeight:"bold",letterSpacing:2}}>CUSTOMIZE</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:16}}>◈</span>
              <b style={{fontSize:15}}>{Math.floor(fossils)}</b>
            </div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {["dino","palette","scenery"].map(t=>(
              <button key={t} style={btn(skinTab===t,true)} onClick={()=>setSkinTab(t)}>{t.toUpperCase()}</button>
            ))}
          </div>

          {skinTab==="dino"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {DINO_DESIGNS.map(d=>{
                const owned=ownedDesigns.includes(d.id);
                const active=equippedDesign===d.id;
                const passive=DINO_PASSIVES[d.id];
                const showingPassive=passivePreviewId===d.id;
                return (
                  <div key={d.id} onClick={()=>{
                    if(active&&passive){setPassivePreviewId(showingPassive?null:d.id);return;}
                    buyDesign(d);
                  }} style={{background:active?"#ece8e0":"#faf8f4",border:`2px solid ${active?BORDER:"#ddd"}`,padding:"12px 10px",textAlign:"center",cursor:"pointer",position:"relative",overflow:"hidden"}}>
                    {showingPassive&&(
                      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"10px",zIndex:2}}>
                        <div style={{fontSize:10,color:"#88dd88",fontWeight:"bold",marginBottom:6,letterSpacing:1,display:"flex",alignItems:"center"}}>{PASSIVE_ICONS[d.id]}{passive.label}</div>
                        <div style={{fontSize:9,color:"#ddd",lineHeight:1.6,textAlign:"center"}}>{passive.desc}</div>
                        <div style={{fontSize:8,color:"#888",marginTop:8}}>tap to close</div>
                      </div>
                    )}
                    <canvas width={60} height={58} style={{display:"block",margin:"0 auto 6px"}}
                      ref={el=>renderDinoCanvas(el,currentSkin,d)}/>
                    <div style={{fontSize:12,fontWeight:"bold",letterSpacing:1}}>{d.label}</div>
                    <div style={{fontSize:9,color:MUTED,margin:"3px 0 4px",lineHeight:1.5}}>{d.desc}</div>
                    {passive&&(
                      <div style={{fontSize:9,color:"#448844",margin:"3px 0 6px",lineHeight:1.4,textAlign:"left",background:"#e8f0e8",padding:"4px 6px",display:"flex",alignItems:"center",gap:4}}>
                        <span style={{color:"#448844",flexShrink:0}}>{PASSIVE_ICONS[d.id]}</span>
                        <b>{passive.label}</b>{active&&<span style={{color:MUTED,fontSize:8}}> (tap)</span>}
                      </div>
                    )}
                    <div style={{fontSize:11,fontWeight:"bold",color:active?"#aaa":owned?"#448844":DARK}}>
                      {active?"ACTIVE":owned?"[ SELECT ]":`◈ ${d.cost}`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {skinTab==="palette"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {SKINS.map(sk=>{
                const owned=ownedSkins.includes(sk.id);
                const active=equippedSkin===sk.id;
                return (
                  <div key={sk.id} onClick={()=>buySkin(sk)} style={{background:active?"#ece8e0":"#faf8f4",border:`2px solid ${active?BORDER:"#ddd"}`,padding:"14px 10px",textAlign:"center",cursor:"pointer"}}>
                    <canvas width={60} height={58} style={{display:"block",margin:"0 auto 8px"}}
                      ref={el=>renderDinoCanvas(el,sk,currentDesign)}/>
                    <div style={{fontSize:12,fontWeight:"bold",letterSpacing:1}}>{sk.label}</div>
                    <div style={{fontSize:11,fontWeight:"bold",color:active?"#aaa":owned?"#448844":DARK,marginTop:8}}>
                      {active?"ACTIVE":owned?"[ SELECT ]":sk.cost===0?"FREE":`◈ ${sk.cost}`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {skinTab==="scenery"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {SCENERIES.map(s=>{
                const owned=ownedSceneries.includes(s.id);
                const active=activeScenery===s.id;
                return (
                  <div key={s.id} onClick={()=>buyScenery(s)} style={{background:active?"#ece8e0":"#faf8f4",border:`2px solid ${active?BORDER:"#ddd"}`,padding:"14px",cursor:"pointer",boxSizing:"border-box"}}>
                    <div style={{width:"100%",height:36,background:s.dayBg,marginBottom:8,position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",bottom:0,left:0,right:0,height:10,background:s.groundTop}}/>
                      <div style={{position:"absolute",bottom:0,left:0,right:0,height:6,background:s.groundColor}}/>
                      <div style={{position:"absolute",top:6,left:"30%",width:20,height:8,background:s.cloudColor}}/>
                    </div>
                    <div style={{fontSize:12,fontWeight:"bold",letterSpacing:1}}>{s.label}</div>
                    <div style={{fontSize:10,color:MUTED,margin:"4px 0 8px",lineHeight:1.5}}>{s.desc}</div>
                    <div style={{fontSize:11,fontWeight:"bold",color:active?"#aaa":owned?"#448844":DARK}}>
                      {active?"ACTIVE":owned?"[ SELECT ]":s.cost===0?"FREE":`◈ ${s.cost}`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button style={{...btn(true),flex:1}} onClick={startGame}>[ RUN ]</button>
            <button style={{...btn(false),flex:1}} onClick={()=>setScreen("menu")}>[ MENU ]</button>
          </div>
        </div>
        {notification&&<div style={notifBox}>{notification}</div>}
        {achivNotif&&<div style={achivNotifBox}>{achivNotif}</div>}
      </div>
    );
  }

  if(screen==="achievements") return (
    <div style={outer}>
      <div style={{...wrap(600)}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div>
            <div style={{fontSize:10,letterSpacing:4,color:MUTED}}>HALL OF FAME</div>
            <div style={{fontSize:20,fontWeight:"bold",letterSpacing:2}}>ACHIEVEMENTS</div>
          </div>
          <div style={{fontSize:12,color:MUTED}}>{unlockedAch.length}/{ACHIEVEMENTS.length}</div>
        </div>
        {["bronze","silver","gold","legend"].map(tier=>{
          const tierAchs=ACHIEVEMENTS.filter(a=>a.tier===tier);
          return (
            <div key={tier} style={{marginBottom:18}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:10,height:10,background:tierColors[tier]}}/>
                <span style={{fontSize:10,letterSpacing:3,color:tierColors[tier],fontWeight:"bold"}}>{tier.toUpperCase()}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {tierAchs.map(a=>{
                  const done=unlockedAch.includes(a.id);
                  return (
                    <div key={a.id} style={{background:done?"#faf8f4":"#ebe8e2",border:`1px solid ${done?tierColors[a.tier]:"#ccc"}`,padding:"10px",boxSizing:"border-box",opacity:done?1:0.5}}>
                      <div style={{fontSize:11,fontWeight:"bold",marginBottom:3,color:done?DARK:MUTED}}>{a.label}</div>
                      <div style={{fontSize:9,color:MUTED,marginBottom:5,lineHeight:1.6}}>{a.desc}</div>
                      <div style={{fontSize:9,color:done?tierColors[a.tier]:MUTED,fontWeight:"bold"}}>
                        {done?"UNLOCKED":`+${a.reward} bones`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <button style={{...btn(false),width:"100%"}} onClick={()=>setScreen("menu")}>[ BACK ]</button>
      </div>
      {notification&&<div style={notifBox}>{notification}</div>}
      {achivNotif&&<div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );

  if(screen==="leaderboard") {
    const myId=getPlayerId();
    const top3=lbData.slice(0,3);
    const rest=lbData.slice(3);
    // Podium slot order: 2nd (left), 1st (center), 3rd (right)
    const podiumSlots=[{pos:1,h:88,color:tierColors.silver,label:"2ND"},{pos:0,h:120,color:tierColors.gold,label:"1ST"},{pos:2,h:64,color:tierColors.bronze,label:"3RD"}];
    return (
      <div style={outer}>
        <div style={{...wrap(520)}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={{fontSize:10,letterSpacing:4,color:MUTED}}>GLOBAL</div>
              <div style={{fontSize:20,fontWeight:"bold",letterSpacing:2}}>LEADERBOARD</div>
            </div>
            <button style={{...btn(false,true),fontSize:9}} onClick={async()=>{
              setLbLoading(true);
              const data=await fetchLeaderboard();
              setLbData(data);
              setLbLoading(false);
            }}>[ REFRESH ]</button>
          </div>

          {/* Rename */}
          <div style={{marginBottom:14,padding:"10px 12px",background:"#f5f2ec",border:"1px solid #ddd"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"nowrap",overflow:"hidden"}}>
              <span style={{fontSize:10,color:MUTED,letterSpacing:1}}>YOUR NAME:</span>
              {lbRenaming ? (
                <>
                  <input autoFocus value={lbNewName}
                    onChange={e=>{ setLbNewName(e.target.value.toUpperCase().slice(0,20)); setLbNameError(""); }}
                    onKeyDown={e=>{
                      if(e.key==="Enter"){
                        const t=lbNewName.trim();
                        if(!t) return;
                        isNameTaken(t).then(taken=>{
                          if(taken){ setLbNameError("Name already taken!"); }
                          else { savePlayerName(t); showNotif("Name updated!"); setLbRenaming(false); setLbNameError(""); }
                        });
                      }
                      if(e.key==="Escape"){ setLbRenaming(false); setLbNameError(""); }
                    }}
                    style={{fontFamily:F,fontSize:11,fontWeight:"bold",padding:"4px 8px",border:`2px solid ${lbNameError?"#cc2200":BORDER}`,background:BG,letterSpacing:2,width:130,textTransform:"uppercase"}}
                    maxLength={20} placeholder="ENTER NAME"
                  />
                  <button style={btn(true,true)} onClick={()=>{
                    const t=lbNewName.trim();
                    if(!t) return;
                    isNameTaken(t).then(taken=>{
                      if(taken){ setLbNameError("Name already taken!"); }
                      else { savePlayerName(t); showNotif("Name updated!"); setLbRenaming(false); setLbNameError(""); }
                    });
                  }}>[ SAVE ]</button>
                  <button style={btn(false,true)} onClick={()=>{ setLbRenaming(false); setLbNameError(""); }}>[ CANCEL ]</button>
                </>
              ) : (
                <>
                  <span style={{fontSize:11,fontWeight:"bold",letterSpacing:2,color:DARK}}>{getSavedName()}</span>
                  <button style={btn(false,true)} onClick={()=>{ setLbNewName(getSavedName()); setLbRenaming(true); setLbNameError(""); }}>[ RENAME ]</button>
                </>
              )}
            </div>
            {lbNameError&&<div style={{fontSize:10,color:"#cc2200",marginTop:6,letterSpacing:1}}>{lbNameError}</div>}
          </div>

          {lbLoading ? (
            <div style={{textAlign:"center",padding:40,fontSize:11,color:MUTED,letterSpacing:3}}>LOADING...</div>
          ) : lbData.length===0 ? (
            <div style={{textAlign:"center",padding:40,fontSize:11,color:MUTED,letterSpacing:2,border:"1px solid #ddd",marginBottom:16}}>No scores yet. Be the first!</div>
          ) : (
            <>
              {/* ── Podium (top 3) ── */}
              <div style={{background:"#faf8f4",border:`2px solid ${BORDER}`,padding:"20px 16px 0",marginBottom:0}}>
                <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:8}}>
                  {podiumSlots.map(({pos,h,color,label})=>{
                    const entry=top3[pos];
                    if(!entry) return <div key={pos} style={{width:120}}/> ;
                    const isMe=entry.player_id===myId;
                    return (
                      <div key={pos} style={{display:"flex",flexDirection:"column",alignItems:"center",width:120}}>
                        <div style={{fontSize:11,fontWeight:"bold",color,letterSpacing:1,textAlign:"center",maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>
                          {entry.name}{isMe&&" ◀"}
                        </div>
                        <div style={{fontSize:10,color:MUTED,marginBottom:6}}>{entry.best_dist.toLocaleString()}m</div>
                        <div style={{width:"100%",height:h,background:color,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",paddingTop:10,boxSizing:"border-box",outline:isMe?`3px solid #448844`:"none"}}>
                          <div style={{fontSize:18,fontWeight:"bold",color:"#fff",letterSpacing:2}}>{label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Ranks 4 E0 ── */}
              {rest.length>0&&(
                <div style={{border:"1px solid #ddd",borderTop:"none",marginBottom:14}}>
                  {rest.map((r,i)=>{
                    const isMe=r.player_id===myId;
                    return (
                      <div key={r.id} style={{display:"grid",gridTemplateColumns:"36px 1fr 72px",padding:"7px 12px",fontSize:11,fontWeight:"bold",background:isMe?"#e8f0e8":i%2===0?"#faf8f4":"#f5f2ec",borderBottom:"1px solid #e8e5e0",borderLeft:isMe?`3px solid #448844`:"3px solid transparent"}}>
                        <span style={{color:MUTED,fontSize:10}}>{i+4}</span>
                        <span style={{letterSpacing:1,color:isMe?"#448844":DARK,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}{isMe&&" ◀"}</span>
                        <span style={{textAlign:"right",color:MUTED}}>{r.best_dist.toLocaleString()}m</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
          <button style={{...btn(false),width:"100%",marginTop:lbData.length>0?0:0}} onClick={()=>setScreen("menu")}>[ BACK ]</button>
        </div>
      </div>
    );
  }

  return null;
}