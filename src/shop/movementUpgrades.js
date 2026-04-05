// ─── MOVEMENT UPGRADES ────────────────────────────────────────────────────────

export const MOVEMENT_UPGRADES = [
  { id:"jump",     label:"Stronger Legs",  desc:"Hold jump longer to reach greater heights per level",     baseCost:10,  maxLevel:6, linearCost:10, cat:"movement", color:"#2a2a2a" },
  { id:"dblJump",  label:"Double Jump",    desc:"Jump a second time while airborne",                       baseCost:500, maxLevel:1, cat:"movement", color:"#4466cc" },
  { id:"dash",     label:"Forward Dash",   desc:"Dash forward to dodge or reposition quickly",             baseCost:200, maxLevel:1, cat:"movement", color:"#cc6622" },
  { id:"backdash", label:"Back Dash",      desc:"Dash backward to avoid incoming obstacles",               baseCost:200, maxLevel:1, cat:"movement", color:"#cc6622" },
  { id:"fastdrop", label:"Fast Drop",      desc:"Drop to the ground instantly while airborne",             baseCost:100, maxLevel:1, cat:"movement", color:"#2a2a2a" },
  { id:"duck",     label:"Duck Slide",     desc:"Crouch to slide under high obstacles and beams",          baseCost:80,  maxLevel:1, cat:"movement", color:"#448844" },
  { id:"dashCd",   label:"Dash Cooldown",  desc:"Reduces the cooldown between dashes per level",           baseCost:120, maxLevel:4, costMult:2.0, cat:"movement", color:"#884488" },
  { id:"bite",     label:"Primal Bite",    desc:"Unlocks a powerful bite — the only way to wound the Horror Entity", baseCost:5000, maxLevel:1, cat:"movement", color:"#cc0000", abyssOnly:true },
];
