// ─── INCOME UPGRADES ──────────────────────────────────────────────────────────

export const INCOME_UPGRADES = [
  // ── Pickup chain (core income) ────────────────────────────────────────────
  { id:"fossilValue", label:"Fossil Worth",      desc:"+1 fossil per pickup (stacks with multipliers)",  baseCost:10,  maxLevel:20, costMult:1.5, cat:"income", color:"#ffcc00" },
  { id:"fossilMult",  label:"Fossil Multiplier", desc:"Multiply all pickup fossils by +1x per level",    baseCost:400, maxLevel:4,  costMult:2.6, cat:"income", color:"#ff8800" },
  { id:"fossil",      label:"Fossil Sense",      desc:"+20% to fossil worth per level",                  baseCost:40,  maxLevel:10, costMult:2.0, cat:"income", color:"#cc9922" },
  // ── Skill-based income ────────────────────────────────────────────────────
  { id:"combo",       label:"Combo Hunger",      desc:"+12% fossil bonus per combo step/lv",             baseCost:60,  maxLevel:6,  costMult:2.0, cat:"income", color:"#dd4422" },
  // ── Time-based income ─────────────────────────────────────────────────────
  { id:"nightBonus",  label:"Night Sight",        desc:"+25% fossil pickups during night per level",      baseCost:120, maxLevel:4,  costMult:2.2, cat:"income", color:"#4466aa" },
  { id:"transBonus",  label:"Cycle Reward",       desc:"+25% to day/night transition fossil bonus/lv",    baseCost:140, maxLevel:4,  costMult:2.2, cat:"income", color:"#44aa88" },
  // ── Run-based income ──────────────────────────────────────────────────────
  { id:"runDrip",     label:"Fossil Trail",       desc:"Earn fossils passively while running per level",  baseCost:150, maxLevel:10, costMult:1.6, cat:"income", color:"#aacc44" },
  { id:"speedBonus",  label:"Speed Bonus",        desc:"+0.5x fossil trail rate per speed level",         baseCost:160, maxLevel:5,  costMult:2.0, cat:"income", color:"#cc6622" },
  // ── Utility ───────────────────────────────────────────────────────────────
  { id:"magnet",      label:"Fossil Magnet",      desc:"Attract nearby fossil pickups automatically",     baseCost:100, maxLevel:3,  costMult:2.2, cat:"income", color:"#9944cc" },
];
