import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const GRAVITY      = 0.55;
const JUMP_FORCE   = -13.5;
const GROUND_Y     = 210;
const DINO_W       = 40;
const DINO_H       = 48;
const CANVAS_W     = 720;
const CANVAS_H     = 270;
const DAY_CYCLE    = 1000;   // doubled from 500
const DUCK_H       = 28;     // crouched height

// ─── SKINS ────────────────────────────────────────────────────────────────────
const SKINS = [
  { id:"classic",  label:"Classic",    cost:0,    color:"#222222", eyeColor:"#ffffff", accent:"#444444", desc:"The original dino" },
  { id:"bone",     label:"Bone",       cost:80,   color:"#d4c9a8", eyeColor:"#558844", accent:"#b8ad90", desc:"Fossil white" },
  { id:"neon",     label:"Neon",       cost:150,  color:"#00ee88", eyeColor:"#ffffff", accent:"#00aa55", desc:"Glowing green" },
  { id:"shadow",   label:"Shadow",     cost:200,  color:"#444444", eyeColor:"#ff5555", accent:"#222222", desc:"Dark with red eye" },
  { id:"robo",     label:"Robo",       cost:300,  color:"#66aaaa", eyeColor:"#ffee00", accent:"#336688", desc:"Cybernetic dino" },
  { id:"gold",     label:"Gold",       cost:500,  color:"#f0c040", eyeColor:"#222222", accent:"#c89a20", desc:"Shiny fossil gold" },
  { id:"lava",     label:"Lava",       cost:400,  color:"#cc3300", eyeColor:"#ffaa00", accent:"#882200", desc:"Volcanic fury" },
  { id:"ice",      label:"Ice",        cost:350,  color:"#aaddff", eyeColor:"#0055cc", accent:"#77bbee", desc:"Frozen in time" },
  { id:"void",     label:"Void",       cost:600,  color:"#220044", eyeColor:"#cc44ff", accent:"#110022", desc:"From the dark dimension" },
  { id:"crystal",  label:"Crystal",    cost:450,  color:"#dd88ff", eyeColor:"#ffffff", accent:"#aa55cc", desc:"Prismatic beauty" },
  { id:"rust",     label:"Rusty",      cost:250,  color:"#9b4a1c", eyeColor:"#ffdd88", accent:"#7a3a12", desc:"Battle-worn veteran" },
  { id:"mint",     label:"Mint",       cost:180,  color:"#44ccaa", eyeColor:"#ffffff", accent:"#22aa88", desc:"Fresh and minty" },
];

// ─── UPGRADES ─────────────────────────────────────────────────────────────────
const UPGRADES = [
  { id:"jump",       label:"Stronger Legs",   desc:"+1.5 jump height per level",   baseCost:15,  maxLevel:6, icon:"↑",  cat:"movement" },
  { id:"dblJump",    label:"Double Jump",      desc:"Jump again while airborne",    baseCost:80,  maxLevel:1, icon:"⇑",  cat:"movement" },
  { id:"dash",       label:"Front Dash",       desc:"Press D to dash forward",      baseCost:120, maxLevel:1, icon:"▶▶", cat:"movement" },
  { id:"backdash",   label:"Back Dash",        desc:"Press A to dash back",         baseCost:120, maxLevel:1, icon:"◀◀", cat:"movement" },
  { id:"fastdrop",   label:"Fast Drop",        desc:"Press S to drop fast mid-air", baseCost:60,  maxLevel:1, icon:"↓↓", cat:"movement" },
  { id:"duck",       label:"Duck & Weave",     desc:"Press S to duck under birds",  baseCost:50,  maxLevel:1, icon:"⬇",  cat:"movement" },
  { id:"dashCd",     label:"Dash Cooldown",    desc:"Reduce dash cooldown by 8f/lv",baseCost:70,  maxLevel:4, icon:"⚡", cat:"movement" },
  { id:"fossil",     label:"Fossil Sense",     desc:"+25% fossils per level",       baseCost:25,  maxLevel:8, icon:"◈",  cat:"income" },
  { id:"combo",      label:"Combo Hunger",     desc:"+0.15 combo mult per level",   baseCost:45,  maxLevel:5, icon:"×",  cat:"income" },
  { id:"magnet",     label:"Fossil Magnet",    desc:"Auto-attract nearby fossils",  baseCost:70,  maxLevel:3, icon:"◉",  cat:"income" },
  { id:"nearMiss",   label:"Near Miss Bonus",  desc:"+2 fossils on near misses",    baseCost:55,  maxLevel:4, icon:"!",  cat:"income" },
  { id:"nightBonus", label:"Night Vision",     desc:"+30% fossils in night/level",  baseCost:90,  maxLevel:3, icon:"☾",  cat:"income" },
  { id:"transBonus", label:"Transition Rush",  desc:"+20% day/night bonus/level",   baseCost:110, maxLevel:4, icon:"◑",  cat:"income" },
  { id:"shield",     label:"Bone Armor",       desc:"5% auto-revive chance/level",  baseCost:40,  maxLevel:5, icon:"◎",  cat:"survival" },
  { id:"speed",      label:"Slow Start",       desc:"Start each run slower",        baseCost:30,  maxLevel:4, icon:"◀",  cat:"survival" },
  { id:"extraLife",  label:"Extra Life",       desc:"Start run with extra life",    baseCost:180, maxLevel:3, icon:"♥",  cat:"survival" },
  { id:"miner",      label:"Hatchling Miner",  desc:"+0.5 fossils/sec passive",     baseCost:100, maxLevel:5, icon:"⛏",  cat:"idle" },
  { id:"camp",       label:"Fossil Camp",      desc:"+1 fossil/sec idle",           baseCost:200, maxLevel:3, icon:"⌂",  cat:"idle" },
  { id:"research",   label:"Research Lab",     desc:"+2 fossils/sec passive",       baseCost:400, maxLevel:3, icon:"⚗",  cat:"idle" },
  // Powerup upgrades
  { id:"pwShieldDur",label:"Shield Upgrade",   desc:"+1 hit per shield (starts at 1)",baseCost:150,maxLevel:3,icon:"◎+", cat:"powerups" },
  { id:"pwSpeedMult",label:"Speed Boost+",     desc:"+0.3× speed powerup power",   baseCost:120, maxLevel:3, icon:">>+",cat:"powerups" },
  { id:"pwGiantDur", label:"Giant Duration+",  desc:"+60 frames giant duration",    baseCost:130, maxLevel:3, icon:"BG+",cat:"powerups" },
  { id:"pwMagnetRng",label:"Magnet Range+",    desc:"+50px magnet powerup range",   baseCost:100, maxLevel:3, icon:"()+",cat:"powerups" },
  { id:"pwSlowoPwr", label:"Slowmo Power+",    desc:"+0.15 slowmo strength/level",  baseCost:110, maxLevel:3, icon:"~~+",cat:"powerups" },
  { id:"pwFrenzyDur",label:"Frenzy Duration+", desc:"+60 frames frenzy duration",   baseCost:140, maxLevel:3, icon:"★+", cat:"powerups" },
  { id:"pwCoinDur",  label:"Coin Mania+",      desc:"+60 frames coin mania dur",    baseCost:120, maxLevel:3, icon:"◈+", cat:"powerups" },
  { id:"pwRareDrop", label:"Powerup Luck",     desc:"+8% powerup spawn rate/level", baseCost:90,  maxLevel:4, icon:"✦",  cat:"powerups" },
];

const UPGRADE_CATS = ["movement","income","survival","idle","powerups"];

// ─── POWERUPS ─────────────────────────────────────────────────────────────────
const POWERUP_DEFS = [
  { id:"shield_pw",  color:"#5599ff", label:"SHIELD",  icon:"◎",  duration:0   },
  { id:"speed_pw",   color:"#ffcc00", label:"SPEED",   icon:">>", duration:300 },
  { id:"giant_pw",   color:"#ff6633", label:"GIANT",   icon:"BG", duration:220 },
  { id:"magnet_pw",  color:"#cc66ff", label:"MAGNET",  icon:"()", duration:360 },
  { id:"slowmo_pw",  color:"#44ddaa", label:"SLOW",    icon:"~~", duration:300 },
  { id:"frenzy_pw",  color:"#ff4488", label:"FRENZY",  icon:"★",  duration:240 },  // +3× fossils
  { id:"coinmania_pw",color:"#ffdd00",label:"COINS",   icon:"◈",  duration:280 },  // fossils rain down
  { id:"ghost_pw",   color:"#aaaaff", label:"GHOST",   icon:"ψ",  duration:200 },  // pass through obstacles
  { id:"tiny_pw",    color:"#88ffcc", label:"TINY",    icon:"▾",  duration:350 },  // smaller hitbox
  { id:"meteor_pw",  color:"#ff8833", label:"METEOR",  icon:"☄",  duration:180 },  // destroys all obstacles on screen
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getUpgradeCost(up, level) {
  return Math.floor(up.baseCost * Math.pow(1.65, level));
}

function lerp(a, b, t) { return a + (b - a) * t; }

function getThemeColors(blend) {
  // blend: 0 = full day, 1 = full night
  const day = { bg:"#f5f5f0", ground:"#222222", gravel:"#bbbbbb", cloud:"#dddddd", hud:"#333333", obstacle:"#222222", fossil:"#888888", sky1:"#cce8ff", sky2:"#f5f5f0" };
  const night = { bg:"#111118", ground:"#aaaaaa", gravel:"#555566", cloud:"#2a2a44", hud:"#cccccc", obstacle:"#dddddd", fossil:"#cccc99", sky1:"#050510", sky2:"#111118" };
  const mix = (dc, nc) => {
    const dr = parseInt(dc.slice(1,3),16), dg = parseInt(dc.slice(3,5),16), db = parseInt(dc.slice(5,7),16);
    const nr = parseInt(nc.slice(1,3),16), ng = parseInt(nc.slice(3,5),16), nb = parseInt(nc.slice(5,7),16);
    const r = Math.round(lerp(dr,nr,blend)), g = Math.round(lerp(dg,ng,blend)), b = Math.round(lerp(db,nb,blend));
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  };
  return { bg:mix(day.bg,night.bg), ground:mix(day.ground,night.ground), gravel:mix(day.gravel,night.gravel), cloud:mix(day.cloud,night.cloud), hud:mix(day.hud,night.hud), obstacle:mix(day.obstacle,night.obstacle), fossil:mix(day.fossil,night.fossil) };
}

// ─── DRAW FUNCTIONS ───────────────────────────────────────────────────────────
function drawPixelDino(ctx, x, y, frame, dead, skin, isGiant, isDucking, isTiny) {
  const c = skin?.color || "#222222";
  const ec = skin?.eyeColor || "#ffffff";
  const ac = skin?.accent || "#444444";
  ctx.save();

  const scale = isGiant ? 1.9 : isTiny ? 0.55 : 1;
  if (scale !== 1) {
    // scale from bottom-center so feet stay on ground
    const bx = x + DINO_W / 2;
    const by = y + DINO_H;
    ctx.translate(bx, by);
    ctx.scale(scale, scale);
    ctx.translate(-bx, -by);
  }

  ctx.fillStyle = dead ? "#888888" : c;
  if (isDucking) {
    // Squat body
    ctx.fillRect(x + 4, y + DINO_H - DUCK_H, 32, DUCK_H - 8);
    ctx.fillRect(x + 18, y + DINO_H - DUCK_H - 10, 22, 14);
    // Eye
    ctx.fillStyle = dead ? "#555555" : ec;
    ctx.fillRect(x + 32, y + DINO_H - DUCK_H - 7, 6, 6);
    ctx.fillStyle = "#222222";
    ctx.fillRect(x + 34, y + DINO_H - DUCK_H - 5, 3, 3);
    // Legs
    ctx.fillStyle = dead ? "#888888" : c;
    const f = Math.floor(frame / 4) % 2;
    ctx.fillRect(x + 8,  y + DINO_H - 8, 7, 8);
    ctx.fillRect(x + 20, y + DINO_H - 8, 7, 8);
    // Accent stripe
    ctx.fillStyle = ac;
    ctx.fillRect(x + 8, y + DINO_H - DUCK_H + 2, 28, 3);
  } else {
    // Full body
    ctx.fillRect(x + 8, y + 14, 26, 22);
    ctx.fillRect(x + 18, y, 22, 18);
    ctx.fillRect(x, y + 22, 14, 7);
    ctx.fillRect(x - 4, y + 26, 10, 5);
    // Accent
    ctx.fillStyle = dead ? "#666666" : ac;
    ctx.fillRect(x + 8, y + 16, 26, 3);
    // Eye
    ctx.fillStyle = dead ? "#555555" : ec;
    ctx.fillRect(x + 32, y + 3, 6, 6);
    ctx.fillStyle = dead ? "#777777" : "#222222";
    ctx.fillRect(x + 34, y + 5, 3, 3);
    if (dead) {
      ctx.fillStyle = "#777777";
      ctx.fillRect(x + 22, y + 12, 10, 3);
      ctx.fillRect(x + 26, y + 8, 2, 4);
    }
    ctx.fillStyle = dead ? "#888888" : c;
    if (!dead) {
      const f = Math.floor(frame / 5) % 2;
      if (f === 0) {
        ctx.fillRect(x + 8,  y + 35, 7, 13);
        ctx.fillRect(x + 22, y + 35, 7, 7);
        ctx.fillRect(x + 22, y + 42, 12, 5);
      } else {
        ctx.fillRect(x + 8,  y + 35, 7, 7);
        ctx.fillRect(x + 8,  y + 42, 12, 5);
        ctx.fillRect(x + 22, y + 35, 7, 13);
      }
    } else {
      ctx.fillRect(x + 8,  y + 35, 7, 13);
      ctx.fillRect(x + 22, y + 35, 7, 13);
    }
  }
  ctx.restore();
}

function drawCactus(ctx, x, type, col) {
  ctx.fillStyle = col;
  const g = GROUND_Y;
  if (type === 0) { ctx.fillRect(x+10,g-44,10,44); ctx.fillRect(x+2,g-28,28,8); ctx.fillRect(x+2,g-36,10,12); ctx.fillRect(x+22,g-34,10,10); }
  else if (type===1) { ctx.fillRect(x+8,g-62,10,62); ctx.fillRect(x,g-42,26,8); ctx.fillRect(x,g-54,10,15); ctx.fillRect(x+20,g-50,10,13); ctx.fillRect(x+20,g-60,14,10); }
  else if (type===2) { ctx.fillRect(x+4,g-40,9,40); ctx.fillRect(x+20,g-40,9,40); ctx.fillRect(x+4,g-52,9,14); ctx.fillRect(x+18,g-52,12,9); ctx.fillRect(x,g-26,32,8); }
  else if (type===3) { for(let i=0;i<3;i++){ctx.fillRect(x+i*16+4,g-36,8,36);ctx.fillRect(x+i*16,g-24,16,7);} }
  else if (type===4) { ctx.fillRect(x+14,g-34,12,34); ctx.fillRect(x,g-20,40,8); ctx.fillRect(x,g-28,14,10); ctx.fillRect(x+28,g-30,14,12); ctx.fillRect(x,g-34,14,8); ctx.fillRect(x+28,g-36,14,8); }
}

function drawBird(ctx, x, y, frame, col) {
  ctx.fillStyle = col;
  ctx.fillRect(x+2,y+8,36,9); ctx.fillRect(x+10,y+2,20,8); ctx.fillRect(x+28,y+4,12,7);
  const f = Math.floor(frame/8)%2;
  if(f===0){ctx.fillRect(x+4,y-8,18,9);ctx.fillRect(x+18,y+16,16,7);}
  else{ctx.fillRect(x+4,y+2,18,6);ctx.fillRect(x+18,y+18,14,6);}
}

function drawRock(ctx, x, col) {
  ctx.fillStyle = col;
  ctx.fillRect(x+4,GROUND_Y-18,28,18); ctx.fillRect(x,GROUND_Y-12,36,12); ctx.fillRect(x+8,GROUND_Y-22,18,6);
}

function drawSpike(ctx, x, col) {
  ctx.fillStyle = col;
  for(let i=0;i<3;i++){const bx=x+i*14;ctx.beginPath();ctx.moveTo(bx+2,GROUND_Y);ctx.lineTo(bx+7,GROUND_Y-26);ctx.lineTo(bx+12,GROUND_Y);ctx.fill();}
}

function drawCloud(ctx, x, y, col) {
  ctx.fillStyle = col;
  ctx.fillRect(x+10,y+8,38,9); ctx.fillRect(x+4,y+3,18,14); ctx.fillRect(x+20,y,22,18); ctx.fillRect(x+42,y+5,16,12);
}

function drawFossil(ctx, x, y, col) {
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x+7,y+7,7,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#ffffff"; ctx.globalAlpha = 0.4;
  ctx.fillRect(x+3,y+5,8,2); ctx.fillRect(x+4,y+3,6,2); ctx.fillRect(x+4,y+8,6,2);
  ctx.globalAlpha = 1;
}

function drawGround(ctx, offset, blend) {
  const gc = blend < 0.5 ? `rgb(${Math.round(lerp(34,170,blend*2))},${Math.round(lerp(34,170,blend*2))},${Math.round(lerp(34,170,blend*2))})` : `rgb(${Math.round(lerp(170,170,1))},${Math.round(lerp(170,170,1))},${Math.round(lerp(170,170,1))})`;
  // Simplified: use getThemeColors approach
  const T = getThemeColors(blend);
  ctx.fillStyle = T.ground;
  ctx.fillRect(0, GROUND_Y+2, CANVAS_W, 3);
  ctx.fillStyle = T.gravel;
  for(let i=0;i<22;i++){
    const rx=((i*76-(offset%76))+CANVAS_W*4)%CANVAS_W;
    ctx.fillRect(rx,GROUND_Y+7,18+(i%3)*7,2);
    ctx.fillRect(rx+4,GROUND_Y+11,9,2);
  }
}

function drawStars(ctx, stars, blend) {
  for(const s of stars){
    ctx.fillStyle = `rgba(255,255,255,${s.bright * blend})`;
    ctx.fillRect(s.x,s.y,s.size,s.size);
  }
}

function drawMoon(ctx, x, y, blend) {
  ctx.globalAlpha = blend;
  ctx.fillStyle = "#ddd8aa";
  ctx.beginPath(); ctx.arc(x,y,18,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#111118";
  ctx.beginPath(); ctx.arc(x+7,y-4,15,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
}

function drawSun(ctx, x, y, blend) {
  ctx.globalAlpha = 1 - blend;
  ctx.fillStyle = "#ffdd88";
  ctx.beginPath(); ctx.arc(x,y,16,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle = "#ffcc44"; ctx.lineWidth = 2;
  for(let i=0;i<8;i++){
    const a = (i/8)*Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(x+Math.cos(a)*20, y+Math.sin(a)*20);
    ctx.lineTo(x+Math.cos(a)*26, y+Math.sin(a)*26);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function getObstacleHitbox(o) {
  const g = GROUND_Y;
  if(o.otype==="bird")  return{x:o.x+4, y:o.y+2,   w:30,h:14};
  if(o.otype==="rock")  return{x:o.x+2, y:g-20,     w:32,h:20};
  if(o.otype==="spike") return{x:o.x+2, y:g-24,     w:38,h:24};
  const heights=[44,62,40,36,34], widths=[28,22,28,44,38];
  return{x:o.x+4,y:g-(heights[o.type]||44),w:widths[o.type]||28,h:heights[o.type]||44};
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

  const [screen,        setScreen]        = useState("menu");
  const [fossils,       setFossils]       = useState(0);
  const [totalFossils,  setTotalFossils]  = useState(0);
  const [bestDist,      setBestDist]      = useState(0);
  const [totalRuns,     setTotalRuns]     = useState(0);
  const [upgradeLevels, setUpgradeLevels] = useState({});
  const [ownedSkins,    setOwnedSkins]    = useState(["classic"]);
  const [equippedSkin,  setEquippedSkin]  = useState("classic");
  const [lastRun,       setLastRun]       = useState(null);
  const [passiveRate,   setPassiveRate]   = useState(0);
  const [notification,  setNotification]  = useState(null);
  const [shopTab,       setShopTab]       = useState("movement");
  // Use ref for fossils inside game loop to avoid stale closure
  const fossilsRef = useRef(0);
  useEffect(() => { fossilsRef.current = fossils; }, [fossils]);

  const getStats = useCallback((levels) => {
    const ul = levels || {};
    return {
      jumpBoost:      (ul.jump||0)*1.6,
      fossilMult:     1+(ul.fossil||0)*0.25,
      shieldChance:   (ul.shield||0)*0.05,
      speedReduction: (ul.speed||0)*0.3,
      hasMagnet:      (ul.magnet||0)>0,
      magnetLevel:    ul.magnet||0,
      hasDoubleJump:  (ul.dblJump||0)>0,
      hasDash:        (ul.dash||0)>0,
      hasBackDash:    (ul.backdash||0)>0,
      hasFastDrop:    (ul.fastdrop||0)>0,
      hasDuck:        (ul.duck||0)>0,
      dashCdReduction:(ul.dashCd||0)*8,
      comboBonus:     (ul.combo||0)*0.15,
      nearMissBonus:  (ul.nearMiss||0)*2,
      extraLives:     ul.extraLife||0,
      nightBonus:     (ul.nightBonus||0)*0.3,
      transBonus:     (ul.transBonus||0)*0.2,
      passiveFossils: (ul.miner||0)*0.5+(ul.camp||0)*1+(ul.research||0)*2,
      // Powerup upgrades
      shieldHits:     1+(ul.pwShieldDur||0),
      speedMult:      2.2+(ul.pwSpeedMult||0)*0.3,
      giantDurBonus:  (ul.pwGiantDur||0)*60,
      magnetRngBonus: (ul.pwMagnetRng||0)*50,
      slowStrength:   0.4-(ul.pwSlowoPwr||0)*0.08,
      frenzyDurBonus: (ul.pwFrenzyDur||0)*60,
      coinDurBonus:   (ul.pwCoinDur||0)*60,
      rareDrop:       (ul.pwRareDrop||0)*0.08,
    };
  }, []);

  useEffect(() => {
    const rate = getStats(upgradeLevels).passiveFossils;
    setPassiveRate(rate);
    if(rate<=0) return;
    const id = setInterval(() => {
      setFossils(f => +(f+rate*0.5).toFixed(1));
      setTotalFossils(f => +(f+rate*0.5).toFixed(1));
    }, 500);
    return () => clearInterval(id);
  }, [upgradeLevels, getStats]);

  const showNotif = useCallback((msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2200);
  }, []);

  const currentSkin = SKINS.find(s => s.id === equippedSkin) || SKINS[0];

  const startGame = useCallback(() => {
    const stats = getStats(upgradeLevels);
    gsRef.current = {
      dino: { x:70, y:GROUND_Y-DINO_H, vy:0, onGround:true, doubleJumped:false, dead:false, dashTimer:0, dashDir:0, dashCooldown:0, ducking:false },
      obstacles: [],
      pickups: [],
      powerupPickups: [],
      floatingTexts: [],
      activePowerups: {},
      clouds: Array.from({length:5},(_,i)=>({x:i*170+60, y:15+Math.random()*45, speed:0.25+Math.random()*0.3})),
      stars: Array.from({length:40},()=>({x:Math.random()*CANVAS_W, y:Math.random()*140, size:1+Math.floor(Math.random()*2), bright:0.3+Math.random()*0.7})),
      speed: Math.max(3.5,5-stats.speedReduction),
      baseSpeed: Math.max(3.5,5-stats.speedReduction),
      distance: 0,
      fossilsEarned: 0,
      frame: 0,
      groundOffset: 0,
      lastObstacleFrame: 0,
      lastPickupFrame: 0,
      lastPowerupFrame: 0,
      coinManiaTimer: 0,
      stats,
      lives: 1+stats.extraLives,
      combo: 0,
      comboTimer: 0,
      alive: true,
      nightBlend: 0,        // 0=day, 1=night, smooth transition
      transitionDir: 1,     // 1 = going toward night, -1 = going toward day
      inNight: false,
      lastWasNight: false,
      transitionBonus: false,
      nearMissTimer: 0,
      moonX: CANVAS_W*0.7,
      sunX: CANVAS_W*0.3,
      shieldHitsLeft: 0,
      skin: SKINS.find(s=>s.id===equippedSkin)||SKINS[0],
    };
    keysRef.current = {};
    prevKeysRef.current = {};
    setScreen("game");
  }, [upgradeLevels, getStats, equippedSkin]);

  const doJump = useCallback(() => {
    const gs = gsRef.current;
    if(!gs||!gs.alive) return;
    if(gs.dino.ducking) { gs.dino.ducking = false; return; }
    if(gs.dino.onGround){
      gs.dino.vy = JUMP_FORCE - gs.stats.jumpBoost*0.45;
      gs.dino.onGround = false;
      gs.dino.doubleJumped = false;
    } else if(gs.stats.hasDoubleJump&&!gs.dino.doubleJumped){
      gs.dino.vy = JUMP_FORCE - gs.stats.jumpBoost*0.3;
      gs.dino.doubleJumped = true;
    }
  }, []);

  useEffect(() => {
    if(screen!=="game") return;
    const onDown = (e) => {
      if(["Space","ArrowUp","ArrowDown","KeyW","KeyA","KeyS","KeyD"].includes(e.code)) e.preventDefault();
      keysRef.current[e.code] = true;
    };
    const onUp = (e) => { keysRef.current[e.code] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown",onDown); window.removeEventListener("keyup",onUp); };
  }, [screen]);

  useEffect(() => {
    if(screen!=="game"){ if(animRef.current) cancelAnimationFrame(animRef.current); return; }
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");

    const addFloatText = (gs, text, x, y, color="#ffdd00") => {
      gs.floatingTexts.push({ text, x, y, vy:-1.5, life:60, maxLife:60, color });
    };

    const endGame = (gs) => {
      if(!gs.alive) return;
      gs.alive = false;
      gs.dino.dead = true;
      const earned = Math.floor(gs.fossilsEarned);
      const dist   = Math.floor(gs.distance);
      setFossils(f => f+earned);
      setTotalFossils(f => f+earned);
      setTotalRuns(r => r+1);
      setBestDist(b => Math.max(b,dist));
      setLastRun({ fossils:earned, dist });
      setTimeout(() => setScreen("gameover"), 900);
    };

    const loop = (ts) => {
      if(!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = Math.min((ts-lastTimeRef.current)/16.67, 3);
      lastTimeRef.current = ts;
      const gs = gsRef.current;
      if(!gs) return;

      const k  = keysRef.current;
      const pk = prevKeysRef.current;

      if(gs.alive){
        gs.frame++;
        gs.speed = Math.min(gs.baseSpeed+gs.distance*0.0018, 20);
        gs.distance += gs.speed*dt*0.1;
        gs.groundOffset = (gs.groundOffset+gs.speed*dt)%(CANVAS_W*4);

        // ── Smooth day/night transition ──────────────────────────────────────
        const cycleLen  = DAY_CYCLE * 2;
        const cyclePos  = gs.distance % cycleLen;
        const transZone = 120; // distance units to blend

        let targetBlend;
        if(cyclePos < DAY_CYCLE - transZone) {
          targetBlend = 0;  // full day
        } else if(cyclePos < DAY_CYCLE) {
          targetBlend = (cyclePos-(DAY_CYCLE-transZone))/transZone; // dawn→dusk blend
        } else if(cyclePos < DAY_CYCLE+transZone) {
          targetBlend = 1-(cyclePos-DAY_CYCLE)/transZone*0; // stay night briefly (day 1 transition done)
          targetBlend = 1;
        } else if(cyclePos < cycleLen-transZone) {
          targetBlend = 1; // full night
        } else {
          targetBlend = 1-(cyclePos-(cycleLen-transZone))/transZone; // night→day blend
        }

        // Smooth lerp toward target
        gs.nightBlend = lerp(gs.nightBlend, targetBlend, 0.025*dt);
        const isNightNow = targetBlend > 0.5;

        // Detect transition events for bonus
        if(isNightNow !== gs.inNight) {
          gs.inNight = isNightNow;
          const baseBonus = 20 + Math.floor(gs.distance/100)*5;
          const bonusMult = 1 + gs.stats.transBonus;
          const bonus = Math.floor(baseBonus * bonusMult);
          gs.fossilsEarned += bonus;
          addFloatText(gs, `+${bonus} ${isNightNow ? "NIGHT!" : "DAWN!"}`, CANVAS_W/2-30, 80, isNightNow ? "#8888ff" : "#ffdd44");
        }

        // ── Powerups tick ────────────────────────────────────────────────────
        for(const [pid,p] of Object.entries(gs.activePowerups)){
          if(p.duration>0){ p.timer-=dt; if(p.timer<=0) delete gs.activePowerups[pid]; }
        }

        // Coin mania: spawn fossils constantly
        if(gs.activePowerups.coinmania_pw){
          gs.coinManiaTimer -= dt;
          if(gs.coinManiaTimer<=0){
            gs.pickups.push({ x: gs.dino.x+Math.random()*CANVAS_W*0.3+60, y:GROUND_Y-20-Math.random()*120, collected:false });
            gs.coinManiaTimer = 8;
          }
        }

        // Meteor: destroy all on screen
        if(gs.activePowerups.meteor_pw && !gs.activePowerups.meteor_pw.fired){
          gs.activePowerups.meteor_pw.fired = true;
          const count = gs.obstacles.length;
          gs.obstacles = [];
          if(count>0){
            gs.fossilsEarned += count*3;
            addFloatText(gs, `METEOR! +${count*3}`, 60, 60, "#ff8833");
          }
          delete gs.activePowerups.meteor_pw;
        }

        // ── Input ────────────────────────────────────────────────────────────
        if(gs.dino.dashCooldown>0) gs.dino.dashCooldown -= dt;

        const baseDashCd = 40 - (gs.stats.dashCdReduction||0);
        if((k["Space"]||k["ArrowUp"]||k["KeyW"])&&!(pk["Space"]||pk["ArrowUp"]||pk["KeyW"])) doJump();
        if(gs.stats.hasDash    && k["KeyD"]&&!pk["KeyD"]&&gs.dino.dashTimer<=0&&gs.dino.dashCooldown<=0){ gs.dino.dashTimer=10; gs.dino.dashDir=1;  gs.dino.dashCooldown=baseDashCd; }
        if(gs.stats.hasBackDash&& k["KeyA"]&&!pk["KeyA"]&&gs.dino.dashTimer<=0&&gs.dino.dashCooldown<=0){ gs.dino.dashTimer=10; gs.dino.dashDir=-1; gs.dino.dashCooldown=baseDashCd; }

        // Duck (S key, on ground, has duck upgrade)
        if(gs.stats.hasDuck && gs.dino.onGround){
          gs.dino.ducking = (k["ArrowDown"]||k["KeyS"]);
        } else if(!gs.dino.onGround){
          // Fast drop mid-air
          if(gs.stats.hasFastDrop && (k["ArrowDown"]||k["KeyS"])) {
            gs.dino.vy += GRAVITY*2.5*dt;
          }
          gs.dino.ducking = false;
        }

        prevKeysRef.current = {...k};

        // ── Physics ──────────────────────────────────────────────────────────
        gs.dino.vy += GRAVITY*dt;
        gs.dino.y  += gs.dino.vy*dt;

        if(gs.dino.dashTimer>0){
          gs.dino.x += gs.dino.dashDir*6*dt;
          gs.dino.dashTimer -= dt;
          gs.dino.x = Math.max(20,Math.min(180,gs.dino.x));
        }

        const dinoBottom = GROUND_Y - DINO_H;
        if(gs.dino.y >= dinoBottom){
          gs.dino.y        = dinoBottom;
          gs.dino.vy       = 0;
          gs.dino.onGround = true;
          gs.dino.doubleJumped = false;
        }

        // ── Combo timer ──────────────────────────────────────────────────────
        if(gs.comboTimer>0){ gs.comboTimer-=dt; if(gs.comboTimer<=0) gs.combo=0; }
        if(gs.nearMissTimer>0) gs.nearMissTimer-=dt;

        // ── Spawn obstacles ──────────────────────────────────────────────────
        const hasSpdPw  = !!gs.activePowerups.speed_pw;
        const hasSlowPw = !!gs.activePowerups.slowmo_pw;
        const hasGiant  = !!gs.activePowerups.giant_pw;
        const hasGhost  = !!gs.activePowerups.ghost_pw;
        const hasTiny   = !!gs.activePowerups.tiny_pw;
        const hasFrenzy = !!gs.activePowerups.frenzy_pw;
        let effSpeed = gs.speed;
        if(hasSpdPw)  effSpeed *= gs.stats.speedMult;
        if(hasSlowPw) effSpeed *= gs.stats.slowStrength;

        const tier = Math.min(8, Math.floor(gs.distance/200));
        const minGap = Math.max(46, 130-effSpeed*5-tier*3);

        if(gs.frame-gs.lastObstacleFrame > minGap){
          const r = Math.random();
          let otype, type=0, oy=0;
          if(r<0.52){ otype="cactus"; const maxT=Math.min(4,Math.floor(tier/1.3)); type=Math.floor(Math.random()*(maxT+1)); }
          else if(r<0.72){ otype="bird"; oy=GROUND_Y-85-Math.random()*50; if(tier>2&&Math.random()<0.3) oy=GROUND_Y-42; }
          else if(r<0.86&&tier>=1){ otype="rock"; }
          else if(tier>=2){ otype="spike"; }
          else { otype="cactus"; type=0; }
          gs.obstacles.push({x:CANVAS_W+10, otype, type, y:oy, w:44});
          gs.lastObstacleFrame = gs.frame;
        }

        // ── Spawn fossils ────────────────────────────────────────────────────
        if(gs.frame-gs.lastPickupFrame>78){
          if(Math.random()<0.42) gs.pickups.push({x:CANVAS_W+10, y:GROUND_Y-28-Math.random()*88, collected:false});
          gs.lastPickupFrame = gs.frame;
        }

        // ── Spawn powerups ───────────────────────────────────────────────────
        const spawnRate = 270+Math.random()*190 - (gs.stats.rareDrop||0)*100;
        if(gs.frame-gs.lastPowerupFrame > spawnRate){
          const defs = POWERUP_DEFS.filter(d=>d.id!=="meteor_pw"||tier>=3); // meteor only later
          const def = defs[Math.floor(Math.random()*defs.length)];
          gs.powerupPickups.push({x:CANVAS_W+10, y:GROUND_Y-30-Math.random()*60, def, collected:false});
          gs.lastPowerupFrame = gs.frame;
        }

        // ── Move obstacles ───────────────────────────────────────────────────
        gs.obstacles = gs.obstacles.filter(o=>{ o.x-=effSpeed*dt; return o.x>-90; });

        // ── Magnet ───────────────────────────────────────────────────────────
        const magnetRange = gs.activePowerups.magnet_pw
          ? 200+(gs.stats.magnetRngBonus||0)
          : (gs.stats.magnetLevel>0 ? 60+gs.stats.magnetLevel*30 : 0);

        gs.pickups = gs.pickups.filter(p => {
          p.x -= effSpeed*dt;
          if(magnetRange>0){
            const dx = gs.dino.x+DINO_W/2-(p.x+7);
            const dy = gs.dino.y+DINO_H/2-(p.y+7);
            const d  = Math.sqrt(dx*dx+dy*dy);
            if(d<magnetRange&&d>1){ p.x+=dx/d*effSpeed*2*dt; p.y+=dy/d*effSpeed*2*dt; }
          }
          return p.x>-20&&!p.collected;
        });
        gs.powerupPickups = gs.powerupPickups.filter(p=>{ p.x-=effSpeed*dt; return p.x>-30&&!p.collected; });

        // ── Hitboxes ─────────────────────────────────────────────────────────
        const effectiveH = gs.dino.ducking ? DUCK_H : DINO_H;
        const tinyScale  = hasTiny ? 0.55 : 1;
        const giantScale = hasGiant ? 1.9 : 1;
        const actualScale= hasGiant ? giantScale : tinyScale;

        const DW = (DINO_W-16)*actualScale;
        const DH = effectiveH*0.85*actualScale;
        const DX = gs.dino.x+DINO_W/2 - DW/2 + (gs.dino.ducking?4:0);
        const DY = gs.dino.y + DINO_H - effectiveH + (DINO_H-effectiveH*actualScale)/2;

        // ── Giant crushes obstacles → fossils ────────────────────────────────
        if(hasGiant){
          gs.obstacles = gs.obstacles.filter(o=>{
            const hb = getObstacleHitbox(o);
            if(rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h)){
              const bonus = 3;
              gs.fossilsEarned += bonus;
              addFloatText(gs, `+${bonus}`, hb.x+hb.w/2, hb.y-10, "#ff6633");
              return false; // remove obstacle
            }
            return true;
          });
        } else if(!hasGhost){
          for(let i=gs.obstacles.length-1;i>=0;i--){
            const o = gs.obstacles[i];
            const hb = getObstacleHitbox(o);
            const ex=hb.x-10, ey=hb.y-10, ew=hb.w+20, eh=hb.h+20;
            if(!rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h) &&
                rectsOverlap(DX,DY,DW,DH,ex,ey,ew,eh) && gs.nearMissTimer<=0){
              gs.nearMissTimer = 35;
              const nm = gs.stats.nearMissBonus;
              if(nm>0){ gs.fossilsEarned+=nm; addFloatText(gs,`NEAR MISS +${nm}`,gs.dino.x-10,gs.dino.y-20,"#ffaa00"); }
            }
            if(rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h)){
              if(gs.activePowerups.shield_pw){
                gs.shieldHitsLeft--;
                if(gs.shieldHitsLeft<=0) delete gs.activePowerups.shield_pw;
                gs.obstacles.splice(i,1);
              } else if(gs.stats.shieldChance>Math.random()){
                gs.obstacles.splice(i,1);
              } else if(gs.lives>1){
                gs.lives--;
                gs.obstacles.splice(i,1);
                addFloatText(gs,"-1 LIFE",gs.dino.x,gs.dino.y-20,"#ee5555");
              } else {
                endGame(gs); return;
              }
              break;
            }
          }
        }

        // ── Collect fossils ──────────────────────────────────────────────────
        const nightMult  = 1+(gs.nightBlend*gs.stats.nightBonus);
        const frenzyMult = hasFrenzy ? 3 : 1;
        for(const p of gs.pickups){
          if(!p.collected && rectsOverlap(DX,DY,DW,DH,p.x,p.y,14,14)){
            p.collected = true;
            gs.combo++; gs.comboTimer=110;
            const earned = gs.stats.fossilMult*(1+gs.combo*(0.1+gs.stats.comboBonus))*nightMult*frenzyMult*1.5;
            gs.fossilsEarned += earned;
          }
        }
        for(const p of gs.powerupPickups){
          if(!p.collected && rectsOverlap(DX,DY,DW,DH,p.x,p.y,20,20)){
            p.collected = true;
            const def = p.def;
            if(def.id==="shield_pw"){
              gs.activePowerups.shield_pw = {timer:Infinity,duration:0};
              gs.shieldHitsLeft = gs.stats.shieldHits;
            } else if(def.id==="meteor_pw"){
              gs.activePowerups.meteor_pw = {timer:1,duration:1,fired:false};
            } else {
              const durBonus =
                def.id==="giant_pw"   ? gs.stats.giantDurBonus :
                def.id==="frenzy_pw"  ? gs.stats.frenzyDurBonus :
                def.id==="coinmania_pw" ? gs.stats.coinDurBonus : 0;
              gs.activePowerups[def.id] = {timer:def.duration+durBonus, duration:def.duration+durBonus};
            }
            addFloatText(gs, def.label+"!", CANVAS_W/2-25, 100, def.color);
          }
        }

        gs.fossilsEarned += gs.speed*0.0018*gs.stats.fossilMult*nightMult*frenzyMult*dt;

        // ── Floating texts ───────────────────────────────────────────────────
        gs.floatingTexts = gs.floatingTexts.filter(t=>{
          t.y += t.vy*dt; t.life -= dt;
          return t.life>0;
        });

        // ── Move clouds & celestials ─────────────────────────────────────────
        for(const c of gs.clouds){ c.x-=c.speed*dt; if(c.x<-80) c.x=CANVAS_W+80; }
        gs.moonX -= 0.18*dt; if(gs.moonX<-30) gs.moonX=CANVAS_W+50;
        gs.sunX  -= 0.12*dt; if(gs.sunX<-30)  gs.sunX=CANVAS_W+50;
      }

      // ─── RENDER ────────────────────────────────────────────────────────────
      const B = gs.nightBlend;
      const T = getThemeColors(B);

      // Sky gradient
      ctx.fillStyle = T.bg;
      ctx.fillRect(0,0,CANVAS_W,CANVAS_H);

      if(B>0.05) drawStars(ctx,gs.stars,B);
      drawSun(ctx,gs.sunX,36,B);
      if(B>0.05) drawMoon(ctx,gs.moonX,36,B);

      for(const c of gs.clouds) drawCloud(ctx,c.x,c.y,T.cloud);
      drawGround(ctx,gs.groundOffset,B);

      const oc = T.obstacle;
      for(const o of gs.obstacles){
        if(o.otype==="bird")       drawBird(ctx,o.x,o.y,gs.frame,oc);
        else if(o.otype==="rock")  drawRock(ctx,o.x,oc);
        else if(o.otype==="spike") drawSpike(ctx,o.x,oc);
        else                       drawCactus(ctx,o.x,o.type,oc);
      }

      for(const p of gs.pickups)       if(!p.collected) drawFossil(ctx,p.x,p.y,T.fossil);

      for(const p of gs.powerupPickups){
        if(!p.collected){
          const pulse = 0.82+Math.sin(gs.frame*0.13)*0.18;
          ctx.save(); ctx.globalAlpha=pulse;
          ctx.fillStyle=p.def.color;
          ctx.fillRect(p.x-1,p.y-1,22,22);
          ctx.fillStyle="#000000"; ctx.font="bold 10px monospace"; ctx.textAlign="center";
          ctx.fillText(p.def.icon,p.x+10,p.y+14);
          ctx.textAlign="left"; ctx.restore();
        }
      }

      // Powerup visuals
      if(gs.activePowerups.shield_pw){
        ctx.strokeStyle="#5599ff"; ctx.lineWidth=3;
        ctx.beginPath(); ctx.arc(gs.dino.x+DINO_W/2,gs.dino.y+DINO_H/2,DINO_W,0,Math.PI*2); ctx.stroke();
        // Show hits left
        ctx.fillStyle="#5599ff"; ctx.font="9px monospace";
        ctx.fillText(`x${gs.shieldHitsLeft}`,gs.dino.x+DINO_W+4,gs.dino.y+DINO_H/2);
      }
      if(gs.activePowerups.speed_pw){
        const sc = gs.skin?.color||"#222";
        for(let i=1;i<=3;i++){ ctx.fillStyle=sc; ctx.globalAlpha=0.12; ctx.fillRect(gs.dino.x-i*13,gs.dino.y+4,DINO_W,DINO_H-8); }
        ctx.globalAlpha=1;
      }
      if(gs.activePowerups.slowmo_pw){ ctx.fillStyle="rgba(68,220,170,0.06)"; ctx.fillRect(0,0,CANVAS_W,CANVAS_H); }
      if(gs.activePowerups.giant_pw){ ctx.fillStyle="rgba(255,100,50,0.08)"; ctx.fillRect(0,0,CANVAS_W,CANVAS_H); }
      if(gs.activePowerups.ghost_pw){ ctx.fillStyle="rgba(170,170,255,0.08)"; ctx.fillRect(0,0,CANVAS_W,CANVAS_H); }
      if(gs.activePowerups.frenzy_pw){
        ctx.fillStyle=`rgba(255,68,136,${0.05+Math.sin(gs.frame*0.15)*0.03})`;
        ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      }
      if(gs.activePowerups.tiny_pw){
        ctx.strokeStyle="#88ffcc"; ctx.lineWidth=1;
        ctx.strokeRect(gs.dino.x+2,gs.dino.y+2,DINO_W-4,DINO_H-4);
      }

      drawPixelDino(ctx,gs.dino.x,gs.dino.y,gs.frame,gs.dino.dead,gs.skin,!!gs.activePowerups.giant_pw,gs.dino.ducking,!!gs.activePowerups.tiny_pw);

      // Floating texts
      for(const t of gs.floatingTexts){
        const a = t.life/t.maxLife;
        ctx.globalAlpha = Math.min(1,a*2);
        ctx.fillStyle = t.color; ctx.font="bold 11px monospace";
        ctx.fillText(t.text, t.x, t.y);
        ctx.globalAlpha = 1;
      }

      // HUD
      ctx.font="bold 15px monospace"; ctx.fillStyle=T.hud;
      ctx.fillText(`${Math.floor(gs.distance)}m`,CANVAS_W-90,26);
      ctx.fillText(`o ${Math.floor(gs.fossilsEarned)}`,12,26);
      if(gs.lives>1){ ctx.fillStyle="#ee5555"; ctx.fillText(`H ${gs.lives}`,CANVAS_W/2-18,26); }
      if(gs.combo>1){ ctx.fillStyle=T.hud; ctx.font="11px monospace"; ctx.fillText(`x${gs.combo} COMBO`,12,44); }

      // Night/day indicator when blending
      if(B>0.1&&B<0.9){
        const label = gs.inNight ? "DUSK..." : "DAWN...";
        ctx.fillStyle=`rgba(200,180,100,${Math.sin(gs.frame*0.08)*0.3+0.5})`;
        ctx.font="bold 10px monospace"; ctx.textAlign="center";
        ctx.fillText(label,CANVAS_W/2,26); ctx.textAlign="left";
      } else if(B>0.9){
        ctx.fillStyle="rgba(136,136,200,0.6)"; ctx.font="10px monospace"; ctx.textAlign="center";
        ctx.fillText("NIGHT MODE",CANVAS_W/2,26); ctx.textAlign="left";
      }

      // Dash cooldown indicator
      if((gs.stats.hasDash||gs.stats.hasBackDash)&&gs.dino.dashCooldown>0){
        const baseCd = 40-(gs.stats.dashCdReduction||0);
        const frac = gs.dino.dashCooldown/baseCd;
        ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(gs.dino.x,gs.dino.y-10,DINO_W,4);
        ctx.fillStyle="#ffaa44"; ctx.fillRect(gs.dino.x,gs.dino.y-10,DINO_W*(1-frac),4);
      }

      let barY=46;
      for(const [pid,p] of Object.entries(gs.activePowerups)){
        const def = POWERUP_DEFS.find(d=>d.id===pid);
        if(!def) continue;
        if(def.duration>0&&p.timer!==Infinity&&p.duration>0){
          const frac = Math.max(0,p.timer/p.duration);
          ctx.fillStyle="rgba(0,0,0,0.25)"; ctx.fillRect(CANVAS_W-90,barY,78,7);
          ctx.fillStyle=def.color; ctx.fillRect(CANVAS_W-90,barY,Math.floor(78*frac),7);
          ctx.fillStyle=T.hud; ctx.font="9px monospace";
          ctx.fillText(def.label,CANVAS_W-90,barY+18); barY+=22;
        } else {
          ctx.fillStyle=def.color; ctx.font="10px monospace";
          ctx.fillText(`${def.icon} ${def.label}`,CANVAS_W-90,barY+8); barY+=18;
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = null;
    animRef.current = requestAnimationFrame(loop);
    return () => { if(animRef.current) cancelAnimationFrame(animRef.current); };
  }, [screen, doJump]);

  // ─── BUY UPGRADE (fixed: atomic fossil check) ─────────────────────────────
  const buyUpgrade = useCallback((up) => {
    setFossils(currentFossils => {
      const level = upgradeLevels[up.id]||0;
      if(level>=up.maxLevel) { showNotif("Already maxed!"); return currentFossils; }
      const cost = getUpgradeCost(up, level);
      if(currentFossils < cost) { showNotif("Not enough fossils!"); return currentFossils; }
      setUpgradeLevels(prev => ({ ...prev, [up.id]:(prev[up.id]||0)+1 }));
      showNotif(`${up.label} upgraded!`);
      return +(currentFossils - cost).toFixed(1);
    });
  }, [upgradeLevels, showNotif]);

  const buySkin = useCallback((sk) => {
    if(ownedSkins.includes(sk.id)){ setEquippedSkin(sk.id); showNotif(`${sk.label} equipped!`); return; }
    setFossils(currentFossils => {
      if(currentFossils < sk.cost){ showNotif("Not enough fossils!"); return currentFossils; }
      setOwnedSkins(p => [...p,sk.id]);
      setEquippedSkin(sk.id);
      showNotif(`${sk.label} skin unlocked!`);
      return currentFossils - sk.cost;
    });
  }, [ownedSkins, showNotif]);

  const stats = getStats(upgradeLevels);

  // ─── STYLES ───────────────────────────────────────────────────────────────
  const F    = "monospace";
  const BG   = "#f5f5f0";
  const DARK = "#222222";

  const outerWrap = {
    minHeight:"100vh", background:BG, fontFamily:F,
    display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", padding:"12px 0",
    userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden",
  };

  const scrollWrap = {
    width:"100%", display:"flex", flexDirection:"column", alignItems:"center",
    padding:"12px 12px", boxSizing:"border-box",
  };

  const card = {
    background:"#ffffff", border:`2px solid ${DARK}`,
    padding:"28px", width:"100%", maxWidth:500,
    textAlign:"center", boxSizing:"border-box",
  };

  const btn = (primary, small) => ({
    background:primary?DARK:"#ffffff", color:primary?BG:DARK,
    border:`2px solid ${DARK}`, padding:small?"6px 14px":"10px 22px",
    fontSize:small?11:13, fontFamily:F, cursor:"pointer",
    letterSpacing:2, fontWeight:"bold", boxSizing:"border-box",
  });

  const sBox = {background:"#f5f5f0",border:"1px solid #dddddd",padding:"10px 8px",textAlign:"center"};
  const notifStyle = {position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:DARK,color:BG,padding:"8px 20px",fontSize:12,letterSpacing:2,zIndex:999,whiteSpace:"nowrap"};

  // ─── SCREENS ──────────────────────────────────────────────────────────────
  if(screen==="menu") return (
    <div style={outerWrap}>
      <div style={card}>
        <div style={{fontSize:10,letterSpacing:5,color:"#aaaaaa",marginBottom:6}}>NO INTERNET</div>
        <div style={{fontSize:34,fontWeight:"bold",letterSpacing:3,marginBottom:2}}>DINO</div>
        <div style={{fontSize:15,letterSpacing:5,marginBottom:6}}>INCREMENTAL</div>
        <div style={{fontSize:10,color:"#cccccc",marginBottom:22,letterSpacing:2}}>o FOSSIL EDITION o</div>
        <canvas width={80} height={70} style={{display:"block",margin:"0 auto 18px"}}
          ref={el=>{if(!el)return;const c=el.getContext("2d");c.clearRect(0,0,80,70);drawPixelDino(c,16,8,0,false,currentSkin,false,false,false);}} />
        <p style={{fontSize:12,color:"#666666",marginBottom:20,lineHeight:1.9}}>
          Run. Collect fossils. Upgrade. Evolve.<br/>Survive the digital wasteland.
        </p>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
          <button style={btn(true,false)}  onClick={startGame}>[ RUN ]</button>
          <button style={btn(false,false)} onClick={()=>setScreen("shop")}>[ UPGRADES ]</button>
          <button style={btn(false,false)} onClick={()=>setScreen("skins")}>[ SKINS ]</button>
        </div>
        {totalRuns>0&&(
          <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid #eeeeee",fontSize:12,color:"#666666"}}>
            <div>Best: <b>{bestDist}m</b> &nbsp;|&nbsp; Runs: <b>{totalRuns}</b></div>
            <div>Fossils: <b>o {Math.floor(fossils)}</b>{passiveRate>0&&<span style={{color:"#aaaaaa"}}> (+{passiveRate}/s)</span>}</div>
          </div>
        )}
        <div style={{marginTop:14,fontSize:10,color:"#cccccc",lineHeight:1.8}}>
          SPACE/↑ jump &nbsp;|&nbsp; S/↓ duck &nbsp;|&nbsp; D dash fwd &nbsp;|&nbsp; A dash back
        </div>
      </div>
      {notification&&<div style={notifStyle}>{notification}</div>}
    </div>
  );

  if(screen==="gameover") return (
    <div style={outerWrap}>
      <div style={card}>
        <div style={{fontSize:10,letterSpacing:5,color:"#aaaaaa",marginBottom:6}}>EXTINCT</div>
        <div style={{fontSize:28,fontWeight:"bold",letterSpacing:3,marginBottom:20}}>GAME OVER</div>
        {lastRun&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:22}}>
            {[["DISTANCE",`${lastRun.dist}m`],["FOSSILS",`o ${lastRun.fossils}`],["BEST RUN",`${bestDist}m`],["TOTAL FOSSILS",`o ${Math.floor(fossils)}`]].map(([l,v])=>(
              <div key={l} style={sBox}>
                <div style={{fontSize:9,letterSpacing:2,color:"#aaaaaa",marginBottom:4}}>{l}</div>
                <div style={{fontSize:17,fontWeight:"bold"}}>{v}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button style={btn(true,false)}  onClick={startGame}>[ RUN AGAIN ]</button>
          <button style={btn(false,false)} onClick={()=>setScreen("shop")}>[ SHOP ]</button>
        </div>
        <button style={{...btn(false,false),marginTop:10,width:"100%",borderColor:"#eeeeee",color:"#aaaaaa",fontSize:11}} onClick={()=>setScreen("menu")}>[ MENU ]</button>
      </div>
      {notification&&<div style={notifStyle}>{notification}</div>}
    </div>
  );

  if(screen==="game") return (
    <div style={{...outerWrap,justifyContent:"center",padding:0}}>
      <div style={{width:"100%",maxWidth:CANVAS_W,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:"100%",maxWidth:CANVAS_W,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,fontFamily:F,fontSize:12,color:"#888888",padding:"0 2px",boxSizing:"border-box"}}>
          <span style={{letterSpacing:2}}>DINO INCREMENTAL</span>
          <span style={{fontWeight:"bold",fontSize:14,color:DARK}}>o {Math.floor(fossils)}</span>
        </div>
        <div style={{border:`2px solid ${DARK}`,lineHeight:0,width:"100%",maxWidth:CANVAS_W}}>
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{display:"block",width:"100%",maxWidth:CANVAS_W}} onClick={doJump} />
        </div>
        <div style={{marginTop:6,fontSize:10,color:"#aaaaaa",letterSpacing:1,display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",padding:"0 4px"}}>
          <span>SPACE/↑ jump</span>
          {stats.hasDuck&&<span>S/↓ duck</span>}
          {stats.hasDash&&<span>D: dash fwd</span>}
          {stats.hasBackDash&&<span>A: dash back</span>}
          {stats.hasFastDrop&&!stats.hasDuck&&<span>S: fast drop</span>}
          {stats.hasDoubleJump&&<span>double jump ✓</span>}
        </div>
      </div>
    </div>
  );

  if(screen==="skins") return (
    <div style={{...outerWrap,justifyContent:"flex-start"}}>
      <div style={{...scrollWrap,maxWidth:600}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,width:"100%"}}>
          <div>
            <div style={{fontSize:10,letterSpacing:4,color:"#aaaaaa"}}>COSMETICS</div>
            <div style={{fontSize:22,fontWeight:"bold",letterSpacing:2}}>DINO SKINS</div>
          </div>
          <div style={{fontSize:18,fontWeight:"bold"}}>o {Math.floor(fossils)}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,width:"100%"}}>
          {SKINS.map(sk=>{
            const owned   = ownedSkins.includes(sk.id);
            const equipped= equippedSkin===sk.id;
            return (
              <div key={sk.id} onClick={()=>buySkin(sk)} style={{background:equipped?"#f0f0e8":"#ffffff",border:`2px solid ${equipped?DARK:"#dddddd"}`,padding:"14px 10px",textAlign:"center",cursor:"pointer"}}>
                <canvas width={60} height={55} style={{display:"block",margin:"0 auto 8px"}}
                  ref={el=>{if(!el)return;const c=el.getContext("2d");c.clearRect(0,0,60,55);drawPixelDino(c,8,2,0,false,sk,false,false,false);}} />
                <div style={{fontSize:12,fontWeight:"bold",letterSpacing:1}}>{sk.label}</div>
                <div style={{fontSize:10,color:"#888888",margin:"4px 0 8px",lineHeight:1.4}}>{sk.desc}</div>
                <div style={{fontSize:11,fontWeight:"bold",color:equipped?"#aaaaaa":owned?"#448844":DARK}}>
                  {equipped?"EQUIPPED":owned?"[ EQUIP ]":`o ${sk.cost}`}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:10,marginTop:14,width:"100%"}}>
          <button style={{...btn(true,false),flex:1}}  onClick={startGame}>[ RUN ]</button>
          <button style={{...btn(false,false),flex:1}} onClick={()=>setScreen("menu")}>[ MENU ]</button>
        </div>
      </div>
      {notification&&<div style={notifStyle}>{notification}</div>}
    </div>
  );

  if(screen==="shop"){
    const catUpgrades = UPGRADES.filter(u=>u.cat===shopTab);
    return (
      <div style={{...outerWrap,justifyContent:"flex-start"}}>
        <div style={{...scrollWrap,maxWidth:620}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,width:"100%"}}>
            <div>
              <div style={{fontSize:10,letterSpacing:4,color:"#aaaaaa"}}>UPGRADE LAB</div>
              <div style={{fontSize:22,fontWeight:"bold",letterSpacing:2}}>FOSSIL SHOP</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:18,fontWeight:"bold"}}>o {Math.floor(fossils)}</div>
              {passiveRate>0&&<div style={{fontSize:10,color:"#aaaaaa"}}>+{passiveRate}/sec</div>}
            </div>
          </div>

          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",width:"100%"}}>
            {UPGRADE_CATS.map(cat=>(
              <button key={cat} style={{...btn(shopTab===cat,true),textTransform:"uppercase"}} onClick={()=>setShopTab(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%"}}>
            {catUpgrades.map(up=>{
              const level   = upgradeLevels[up.id]||0;
              const maxed   = level>=up.maxLevel;
              const cost    = maxed?0:getUpgradeCost(up,level);
              const canAfford = fossils>=cost;
              return (
                <div key={up.id} onClick={()=>!maxed&&buyUpgrade(up)} style={{
                  background:maxed?"#f5f5f0":"#ffffff",
                  border:`2px solid ${maxed?"#cccccc":canAfford?DARK:"#dddddd"}`,
                  padding:"12px", cursor:maxed?"default":canAfford?"pointer":"not-allowed",
                  opacity:maxed?0.7:1, boxSizing:"border-box",
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"flex-start"}}>
                    <div style={{display:"flex",gap:7,alignItems:"center"}}>
                      <span style={{fontSize:15}}>{up.icon}</span>
                      <span style={{fontSize:12,fontWeight:"bold"}}>{up.label}</span>
                    </div>
                    <span style={{fontSize:9,letterSpacing:1,color:"#aaaaaa",background:"#f0f0ec",padding:"2px 5px"}}>{level}/{up.maxLevel}</span>
                  </div>
                  <div style={{fontSize:10,color:"#777777",marginBottom:8,lineHeight:1.6}}>{up.desc}</div>
                  <div style={{height:3,background:"#eeeeee",marginBottom:8}}>
                    <div style={{height:"100%",background:DARK,width:`${(level/up.maxLevel)*100}%`}} />
                  </div>
                  <div style={{fontSize:12,fontWeight:"bold",color:maxed?"#bbbbbb":canAfford?DARK:"#cccccc"}}>
                    {maxed?"MAX":`o ${cost}`}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{marginTop:14,padding:"12px",border:"1px solid #eeeeee",background:"#f9f9f6",width:"100%",boxSizing:"border-box"}}>
            <div style={{fontSize:10,letterSpacing:3,color:"#aaaaaa",marginBottom:8}}>CURRENT STATS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,fontSize:11,color:"#666666"}}>
              {[["Jump",`+${stats.jumpBoost.toFixed(1)}`],["Fossil x",`${stats.fossilMult.toFixed(2)}`],["Shield%",`${(stats.shieldChance*100).toFixed(0)}%`],["Passive",`+${stats.passiveFossils}/s`],["Combo+",`+${stats.comboBonus.toFixed(2)}`],["Lives",`${1+stats.extraLives}`]].map(([l,v])=>(
                <div key={l}><span style={{color:"#aaaaaa"}}>{l}: </span><b>{v}</b></div>
              ))}
            </div>
            <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:6}}>
              {[stats.hasDoubleJump&&"DBL JUMP",stats.hasDash&&"DASH FWD",stats.hasBackDash&&"DASH BACK",stats.hasFastDrop&&"FAST DROP",stats.hasDuck&&"DUCK",stats.hasMagnet&&"MAGNET"].filter(Boolean).map(s=>(
                <span key={s} style={{background:DARK,color:BG,fontSize:10,padding:"2px 8px",letterSpacing:1}}>{s}</span>
              ))}
            </div>
          </div>

          <div style={{marginTop:10,padding:"10px 12px",border:"1px solid #eeeeee",background:"#f5f5f0",fontSize:11,color:"#888888",width:"100%",boxSizing:"border-box"}}>
            <div style={{fontSize:10,letterSpacing:3,color:"#aaaaaa",marginBottom:6}}>IN-RUN POWERUPS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {POWERUP_DEFS.map(d=>(
                <div key={d.id} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:14,height:14,background:d.color,flexShrink:0}} />
                  <span style={{fontSize:10}}><b>{d.label}</b>{d.duration===0?" (1 hit)":""} — {
                    d.id==="shield_pw"?"absorbs hits":
                    d.id==="speed_pw"?"speed boost":
                    d.id==="giant_pw"?"crush obstacles":
                    d.id==="magnet_pw"?"attract fossils":
                    d.id==="slowmo_pw"?"slow time":
                    d.id==="frenzy_pw"?"3× fossils":
                    d.id==="coinmania_pw"?"fossil rain":
                    d.id==="ghost_pw"?"pass through":
                    d.id==="tiny_pw"?"tiny hitbox":
                    d.id==="meteor_pw"?"destroy all":"?"
                  }</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"flex",gap:10,marginTop:12,width:"100%"}}>
            <button style={{...btn(true,false),flex:1}}  onClick={startGame}>[ RUN ]</button>
            <button style={{...btn(false,false),flex:1}} onClick={()=>setScreen("skins")}>[ SKINS ]</button>
            <button style={{...btn(false,false),flex:1}} onClick={()=>setScreen("menu")}>[ MENU ]</button>
          </div>
        </div>
        {notification&&<div style={notifStyle}>{notification}</div>}
      </div>
    );
  }

  return null;
}