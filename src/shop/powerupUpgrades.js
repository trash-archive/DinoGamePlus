// ─── POWERUP SUB-UPGRADES ─────────────────────────────────────────────────────
// Each upgrade is gated behind owning the parent powerup (enforced in ShopScreen).
// Colors match the parent POWERUP_DEFS color for progress bar tinting.

export const POWERUP_UPGRADES = [
  { id:"pwShieldDur",   label:"Shield Durability", desc:"+1 hit absorbed per shield",     baseCost:600, maxLevel:6, cat:"powerups", color:"#4488dd" },
  { id:"pwSpeedMult",   label:"Speed Power",        desc:"+0.25x speed boost multiplier", baseCost:500, maxLevel:6, cat:"powerups", color:"#cc6622" },
  { id:"pwGiantDur",    label:"Giant Duration",     desc:"+60 frames of giant time",      baseCost:550, maxLevel:6, cat:"powerups", color:"#cc4400" },
  { id:"pwMagnetRng",   label:"Magnet Range",       desc:"+80px magnet pickup range",     baseCost:450, maxLevel:6, cat:"powerups", color:"#9944cc" },
  { id:"pwFrenzyDur",   label:"Frenzy Duration",    desc:"+60 frames of frenzy time",     baseCost:600, maxLevel:6, cat:"powerups", color:"#dd2266" },
  { id:"pwRareDrop",    label:"Powerup Luck",       desc:"+5% powerup spawn chance/lv",  baseCost:700, maxLevel:6, cat:"powerups", color:"#ddaa00" },
  { id:"pwHeartChance", label:"Life Drop",           desc:"+3% heart spawn chance/lv",    baseCost:800, maxLevel:6, cat:"powerups", color:"#dd2244" },
  { id:"pwGhostDur",    label:"Ghost Duration",     desc:"+60 frames of ghost time",      baseCost:550, maxLevel:6, cat:"powerups", color:"#8888cc" },
  { id:"pwTinyDur",     label:"Tiny Duration",      desc:"+60 frames of tiny time",       baseCost:450, maxLevel:6, cat:"powerups", color:"#44ccaa" },
  { id:"pwMeteorCount", label:"Meteor Blast",       desc:"+2 extra obstacles cleared",    baseCost:900, maxLevel:6, cat:"powerups", color:"#ee6600" },
  { id:"pwDoublerDur",  label:"Doubler Duration",   desc:"+60 frames of doubler time",    baseCost:600, maxLevel:6, cat:"powerups", color:"#ffdd22" },
  { id:"pwSlowDur",     label:"Slow Duration",      desc:"+60 frames of slow time",       baseCost:450, maxLevel:6, cat:"powerups", color:"#22bbaa" },
  { id:"pwWindfallDur", label:"Windfall Duration",  desc:"+60 frames of windfall time",   baseCost:500, maxLevel:6, cat:"powerups", color:"#ddaa00" },
];
