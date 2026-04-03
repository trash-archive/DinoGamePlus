// ─── SHARED GAME DATA ────────────────────────────────────────────────────────

// Progressive cost: baseCost * 2.2^level (steeper than before)
export function getUpgradeCost(up, level) {
  return Math.floor(up.baseCost * Math.pow(2.2, level));
}

export const UPGRADES = [
  // ── MOVEMENT ──────────────────────────────────────────────────────────────
  { id:"jump",       label:"Stronger Legs",    desc:"+1.8 jump power per level", baseCost:30,   maxLevel:6,  icon:"ↁ",  cat:"movement" },
  { id:"dblJump",    label:"Double Jump",       desc:"Jump again mid-air",        baseCost:150,  maxLevel:1,  icon:"⇁",  cat:"movement" },
  { id:"dash",       label:"Forward Dash",      desc:"Right arrow to dash fwd",   baseCost:200,  maxLevel:1,  icon:"▶▶", cat:"movement" },
  { id:"backdash",   label:"Back Dash",         desc:"Left arrow to dash back",   baseCost:200,  maxLevel:1,  icon:"◀◀", cat:"movement" },
  { id:"fastdrop",   label:"Fast Drop",         desc:"Down arrow drops fast",     baseCost:100,  maxLevel:1,  icon:"↓",  cat:"movement" },
  { id:"duck",       label:"Duck",              desc:"Down arrow to crouch",      baseCost:80,   maxLevel:1,  icon:"⬁",  cat:"movement" },
  { id:"dashCd",     label:"Dash Cooldown",     desc:"Reduce dash delay 10f/lv",  baseCost:120,  maxLevel:4,  icon:"↻",  cat:"movement" },
  // ── INCOME ────────────────────────────────────────────────────────────────
  { id:"fossil",     label:"Fossil Sense",      desc:"+20% bones earned/level",   baseCost:50,   maxLevel:10, icon:"◈",  cat:"income" },
  { id:"combo",      label:"Combo Hunger",      desc:"+0.12 combo mult/level",    baseCost:80,   maxLevel:6,  icon:"Á",  cat:"income" },
  { id:"magnet",     label:"Bone Magnet",       desc:"Attract nearby bones",      baseCost:120,  maxLevel:3,  icon:"◈",  cat:"income" },
  { id:"nearMiss",   label:"Near Miss",         desc:"+3 bones on near misses",   baseCost:100,  maxLevel:4,  icon:"!",  cat:"income" },
  { id:"nightBonus", label:"Night Sight",       desc:"+25% bones at night/lv",    baseCost:160,  maxLevel:4,  icon:"☾",  cat:"income" },
  { id:"transBonus", label:"Cycle Reward",      desc:"+25% day/night bonus/lv",   baseCost:180,  maxLevel:4,  icon:"◈",  cat:"income" },
  { id:"speedBonus", label:"Speed Bonus",       desc:"+0.5 bones/sec per speed",  baseCost:200,  maxLevel:5,  icon:"»",  cat:"income" },
  // ── SURVIVAL ──────────────────────────────────────────────────────────────
  { id:"shield",     label:"Bone Armor",        desc:"6% auto-revive chance/lv",  baseCost:70,   maxLevel:5,  icon:"◈",  cat:"survival" },
  { id:"speed",      label:"Safe Start",        desc:"Start each run 15% slower", baseCost:50,   maxLevel:4,  icon:"◀",  cat:"survival" },
  { id:"extraLife",  label:"Extra Life",        desc:"Start with +1 life",        baseCost:350,  maxLevel:3,  icon:"♥",  cat:"survival" },
  { id:"invFrames",  label:"I-Frames",          desc:"+8 invincible frames/hit",  baseCost:250,  maxLevel:4,  icon:"☁",  cat:"survival" },
  // ── IDLE ──────────────────────────────────────────────────────────────────
  { id:"miner",      label:"Bone Miner",        desc:"+0.3 bones/sec passive",    baseCost:200,  maxLevel:6,  icon:"⛁",  cat:"idle" },
  { id:"camp",       label:"Bone Camp",         desc:"+0.8 bones/sec idle",       baseCost:400,  maxLevel:4,  icon:"⌁",  cat:"idle" },
  { id:"research",   label:"Research Lab",      desc:"+1.5 bones/sec passive",    baseCost:800,  maxLevel:3,  icon:"⚁",  cat:"idle" },
  // ── POWERUP UPGRADES ──────────────────────────────────────────────────────
  // Each upgrade is gated behind owning the powerup (enforced in ShopScreen)
  { id:"pwShieldDur",   label:"Shield Durability", desc:"+1 hit absorbed per shield",      baseCost:600,  maxLevel:6, icon:"◈",  cat:"powerups" },
  { id:"pwSpeedMult",   label:"Speed Power",        desc:"+0.25x speed boost multiplier",  baseCost:500,  maxLevel:6, icon:"▶+", cat:"powerups" },
  { id:"pwGiantDur",    label:"Giant Duration",     desc:"+60 frames of giant time",       baseCost:550,  maxLevel:6, icon:"▲+", cat:"powerups" },
  { id:"pwMagnetRng",   label:"Magnet Range",       desc:"+80px magnet pickup range",      baseCost:450,  maxLevel:6, icon:"◈",  cat:"powerups" },
  { id:"pwFrenzyDur",   label:"Frenzy Duration",    desc:"+60 frames of frenzy time",      baseCost:600,  maxLevel:6, icon:"☁",  cat:"powerups" },
  { id:"pwRareDrop",    label:"Powerup Luck",       desc:"+5% powerup spawn chance/lv",   baseCost:700,  maxLevel:6, icon:"✦",  cat:"powerups" },
  { id:"pwHeartChance", label:"Life Drop",           desc:"+3% heart spawn chance/lv",     baseCost:800,  maxLevel:6, icon:"♥+", cat:"powerups" },
  { id:"pwGhostDur",    label:"Ghost Duration",     desc:"+60 frames of ghost time",       baseCost:550,  maxLevel:6, icon:"◈",  cat:"powerups" },
  { id:"pwTinyDur",     label:"Tiny Duration",      desc:"+60 frames of tiny time",        baseCost:450,  maxLevel:6, icon:"▽+", cat:"powerups" },
  { id:"pwMeteorCount", label:"Meteor Blast",       desc:"+2 extra obstacles cleared",     baseCost:900,  maxLevel:6, icon:"☁",  cat:"powerups" },
  { id:"pwDoublerDur",  label:"Doubler Duration",   desc:"+60 frames of doubler time",     baseCost:600,  maxLevel:6, icon:"Á",  cat:"powerups" },
  { id:"pwSlowDur",     label:"Slow Duration",      desc:"+60 frames of slow time",        baseCost:450,  maxLevel:6, icon:"⏱+", cat:"powerups" },
  { id:"pwWindfallDur", label:"Windfall Duration",  desc:"+60 frames of windfall time",    baseCost:500,  maxLevel:6, icon:"◈",  cat:"powerups" },
];

export const UPGRADE_CATS = ["movement","income","survival","idle","powerups"];

export const POWERUP_DEFS = [
  // Unlock costs are now much higher — powerups are rare rewards, not freebies
  { id:"shield_pw",    color:"#4488dd", label:"SHIELD",   duration:0,   desc:"Absorbs hits until broken",    unlockCost:800  },
  { id:"giant_pw",     color:"#cc4400", label:"GIANT",    duration:200, desc:"Crushes all obstacles",        unlockCost:1200 },
  { id:"magnet_pw",    color:"#9944cc", label:"MAGNET",   duration:360, desc:"Attracts all nearby bones",    unlockCost:1000 },
  { id:"slowmo_pw",    color:"#22bbaa", label:"SLOW",     duration:280, desc:"Slows world to a crawl",       unlockCost:900  },
  { id:"frenzy_pw",    color:"#dd2266", label:"FRENZY",   duration:220, desc:"3x all bones earned",          unlockCost:1500 },
  { id:"coinmania_pw", color:"#ddaa00", label:"WINDFALL", duration:260, desc:"Bones rain from the sky",      unlockCost:1300 },
  { id:"ghost_pw",     color:"#8888cc", label:"GHOST",    duration:180, desc:"Phase through everything",     unlockCost:1400 },
  { id:"tiny_pw",      color:"#44ccaa", label:"TINY",     duration:320, desc:"Shrink for a tiny hitbox",     unlockCost:800  },
  { id:"meteor_pw",    color:"#ee6600", label:"METEOR",   duration:1,   desc:"Wipes the entire screen",      unlockCost:2000 },
  { id:"doubler_pw",   color:"#ffdd22", label:"DOUBLER",  duration:300, desc:"2x all bone gains",            unlockCost:1600 },
  { id:"heart_pw",     color:"#dd2244", label:"HEART",    duration:0,   desc:"Gain +1 life (max 4)",         unlockCost:1800 },
];
