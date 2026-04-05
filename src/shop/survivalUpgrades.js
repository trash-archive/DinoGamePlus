// ─── SURVIVAL UPGRADES ────────────────────────────────────────────────────────

export const SURVIVAL_UPGRADES = [
  { id:"shield",    label:"Bone Armor",  desc:"6% chance to auto-block a hit per level", baseCost:120, maxLevel:5, costMult:2.4, cat:"survival", color:"#4488dd" },
  { id:"speed",     label:"Safe Start",  desc:"Start each run 8% slower per level",      baseCost:60,  maxLevel:4, costMult:2.0, cat:"survival", color:"#44aa66" },
  { id:"extraLife", label:"Extra Life",  desc:"Start every run with +1 life per level",  baseCost:500, maxLevel:3, costMult:2.5, cat:"survival", color:"#dd2244" },
  { id:"invFrames", label:"I-Frames",    desc:"+8 frames of damage immunity after each hit/level", baseCost:200, maxLevel:4, costMult:2.3, cat:"survival", color:"#aaaadd" },
];
