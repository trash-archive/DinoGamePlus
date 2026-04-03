// ─── MOVEMENT UPGRADES ────────────────────────────────────────────────────────

export const MOVEMENT_UPGRADES = [
  { id:"jump",     label:"Stronger Legs",  desc:"+1.8 jump power per level",   baseCost:30,  maxLevel:6, cat:"movement", color:"#2a2a2a" },
  { id:"dblJump",  label:"Double Jump",    desc:"Jump again mid-air",           baseCost:150, maxLevel:1, cat:"movement", color:"#4466cc" },
  { id:"dash",     label:"Forward Dash",   desc:"D key to dash forward",        baseCost:200, maxLevel:1, cat:"movement", color:"#cc6622" },
  { id:"backdash", label:"Back Dash",      desc:"A key to dash backward",       baseCost:200, maxLevel:1, cat:"movement", color:"#cc6622" },
  { id:"fastdrop", label:"Fast Drop",      desc:"S / ↓ drops fast",             baseCost:100, maxLevel:1, cat:"movement", color:"#2a2a2a" },
  { id:"duck",     label:"Duck Slide",     desc:"S / ↓ to crouch under beams",  baseCost:80,  maxLevel:1, cat:"movement", color:"#448844" },
  { id:"dashCd",   label:"Dash Cooldown",  desc:"Reduce dash delay 10f/level",  baseCost:120, maxLevel:4, cat:"movement", color:"#884488" },
];
