// ─── SHARED GAME DATA ────────────────────────────────────────────────────────
import { MOVEMENT_UPGRADES } from "../shop/movementUpgrades";
import { INCOME_UPGRADES }   from "../shop/incomeUpgrades";
import { SURVIVAL_UPGRADES } from "../shop/survivalUpgrades";
import { IDLE_UPGRADES }     from "../shop/idleUpgrades";
import { POWERUP_UPGRADES }  from "../shop/powerupUpgrades";

// Progressive cost: baseCost * 2.2^level (steeper than before)
export function getUpgradeCost(up, level) {
  return Math.floor(up.baseCost * Math.pow(2.2, level));
}

export const UPGRADES = [
  // ── MOVEMENT ──────────────────────────────────────────────────────────────
  ...MOVEMENT_UPGRADES,
  // ── INCOME ────────────────────────────────────────────────────────────────
  ...INCOME_UPGRADES,
  // ── SURVIVAL ──────────────────────────────────────────────────────────────
  ...SURVIVAL_UPGRADES,
  // ── IDLE ──────────────────────────────────────────────────────────────────
  ...IDLE_UPGRADES,
  // ── POWERUP UPGRADES ──────────────────────────────────────────────────────
  ...POWERUP_UPGRADES,
];

export const UPGRADE_CATS = ["movement","income","survival","idle","powerups"];

export const POWERUP_DEFS = [
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
