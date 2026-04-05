// ─── SHARED GAME DATA ────────────────────────────────────────────────────────
import { MOVEMENT_UPGRADES } from "../shop/movementUpgrades";
import { INCOME_UPGRADES }   from "../shop/incomeUpgrades";
import { SURVIVAL_UPGRADES } from "../shop/survivalUpgrades";
import { IDLE_UPGRADES }     from "../shop/idleUpgrades";
import { POWERUP_UPGRADES }  from "../shop/powerupUpgrades";

// Progressive cost: baseCost * 2.2^level (steeper than before)
export function getUpgradeCost(up, level) {
  if(up.linearCost) return up.baseCost + level * up.linearCost;
  return Math.floor(up.baseCost * Math.pow(up.costMult || 2.2, level));
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
  { id:"shield_pw",    color:"#4488dd", label:"SHIELD",   duration:0,   desc:"Absorbs hits until broken",             unlockCost:300  },
  { id:"giant_pw",     color:"#cc4400", label:"GIANT",    duration:200, desc:"Crush all obstacles for fossil rewards", unlockCost:500  },
  { id:"magnet_pw",    color:"#9944cc", label:"MAGNET",   duration:360, desc:"Attracts all nearby fossil pickups",     unlockCost:400  },
  { id:"slowmo_pw",    color:"#22bbaa", label:"SLOW",     duration:280, desc:"Slows the world to a crawl",            unlockCost:350  },
  { id:"frenzy_pw",    color:"#dd2266", label:"FRENZY",   duration:220, desc:"3x all fossils earned",                 unlockCost:700  },
  { id:"coinmania_pw", color:"#ddaa00", label:"WINDFALL", duration:260, desc:"Fossil pickups spawn rapidly around you", unlockCost:600  },
  { id:"ghost_pw",     color:"#8888cc", label:"GHOST",    duration:240, desc:"Phase through everything",              unlockCost:650  },
  { id:"tiny_pw",      color:"#44ccaa", label:"TINY",     duration:320, desc:"Shrink for a much smaller hitbox",      unlockCost:450  },
  { id:"meteor_pw",    color:"#ee6600", label:"METEOR",   duration:180, desc:"Meteors rain down destroying all obstacles", unlockCost:900  },
  { id:"doubler_pw",   color:"#ffdd22", label:"DOUBLER",  duration:300, desc:"2x all fossil gains",                  unlockCost:750  },
  { id:"heart_pw",     color:"#dd2244", label:"HEART",    duration:0,   desc:"Gain +1 life (max 4)",                  unlockCost:800  },
];
