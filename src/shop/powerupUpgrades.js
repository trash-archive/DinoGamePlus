// ─── POWERUP SUB-UPGRADES ─────────────────────────────────────────────────────
// Each upgrade is gated behind owning the parent powerup (enforced in ShopScreen).
// Colors match the parent POWERUP_DEFS color for progress bar tinting.

export const POWERUP_UPGRADES = [
  { id:"powerupLuck",  label:"Powerup Luck",     desc:"All powerups spawn more frequently per level", baseCost:120, maxLevel:8, costMult:1.9, cat:"powerups", color:"#ddaa00" },
  { id:"pwShieldChance", label:"Shield Drop",       desc:"+3% chance for a shield to spawn per level",  baseCost:200, maxLevel:6, costMult:1.8, cat:"powerups", color:"#4488dd" },
  { id:"pwGiantDur",    label:"Giant Duration",     desc:"+1 second of giant time per level",           baseCost:130, maxLevel:6, costMult:1.8, cat:"powerups", color:"#cc4400" },
  { id:"pwMagnetRng",   label:"Magnet Range",       desc:"+80px fossil attraction range per level",     baseCost:100, maxLevel:6, costMult:1.8, cat:"powerups", color:"#9944cc" },
  { id:"pwFrenzyDur",   label:"Frenzy Duration",    desc:"+1 second of frenzy time per level",          baseCost:150, maxLevel:6, costMult:1.8, cat:"powerups", color:"#dd2266" },
  { id:"pwRareDrop",    label:"Powerup Luck",       desc:"All powerups spawn more frequently per level", baseCost:180, maxLevel:6, costMult:1.8, cat:"powerups", color:"#ddaa00" },
  { id:"pwHeartChance", label:"Life Drop",           desc:"+3% chance for a heart to spawn per level",  baseCost:200, maxLevel:6, costMult:1.8, cat:"powerups", color:"#dd2244" },
  { id:"pwGhostDur",    label:"Ghost Duration",     desc:"+1 second of ghost time per level",           baseCost:130, maxLevel:6, costMult:1.8, cat:"powerups", color:"#8888cc" },
  { id:"pwTinyDur",     label:"Tiny Duration",      desc:"+1 second of tiny time per level",            baseCost:100, maxLevel:6, costMult:1.8, cat:"powerups", color:"#44ccaa" },
  { id:"pwMeteorCount", label:"Meteor Duration",  desc:"+1 second of meteor rain per level",      baseCost:220, maxLevel:6, costMult:1.8, cat:"powerups", color:"#ee6600" },
  { id:"pwDoublerDur",  label:"Doubler Duration",   desc:"+1 second of doubler time per level",         baseCost:150, maxLevel:6, costMult:1.8, cat:"powerups", color:"#ffdd22" },
  { id:"pwSlowDur",     label:"Slow Duration",      desc:"+1 second of slow time per level",            baseCost:100, maxLevel:6, costMult:1.8, cat:"powerups", color:"#22bbaa" },
  { id:"pwWindfallDur", label:"Windfall Duration",  desc:"+1 second of windfall time per level",        baseCost:120, maxLevel:6, costMult:1.8, cat:"powerups", color:"#ddaa00" },
];
