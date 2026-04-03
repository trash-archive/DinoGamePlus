import { SCENERIES } from "../data/collectionData.jsx";
import { lerp, mixHex } from "./helpers";

// ─── SCENERY COLORS ───────────────────────────────────────────────────────────
export function getSceneryColors(scenery, nightBlend) {
  const s = scenery || SCENERIES[0];
  return {
    bg:        mixHex(s.dayBg,    s.nightBg,   nightBlend),
    ground:    s.groundColor,
    groundTop: s.groundTop,
    cloud:     s.cloudColor,
    accent:    s.accentColor,
  };
}

// ─── HUD PALETTES ─────────────────────────────────────────────────────────────
const SCENERY_HUD = {
  classic: { hud:["#222222","#dddddd"], fossil:["#888888","#ccccaa"], heart:["#dd2244","#ff4466"], bonePick:["#888888","#cccc99"] },
  plains:  { hud:["#2a4a10","#aaddaa"], fossil:["#5a8a30","#88cc55"], heart:["#cc3322","#ff5544"], bonePick:["#6a9a40","#aadd66"] },
  desert:  { hud:["#7a3a00","#ffcc66"], fossil:["#cc7700","#ffaa22"], heart:["#cc4400","#ff6622"], bonePick:["#cc8820","#ffcc44"] },
  arctic:  { hud:["#224466","#aaddff"], fossil:["#4488bb","#88ccff"], heart:["#2255aa","#44aaff"], bonePick:["#5599cc","#aaddff"] },
  volcano: { hud:["#ff6600","#ffaa44"], fossil:["#ff4400","#ff8844"], heart:["#ff2200","#ff6600"], bonePick:["#ff5500","#ffaa22"] },
  jungle:  { hud:["#1a5a10","#88ff44"], fossil:["#2a8a10","#66dd22"], heart:["#228822","#44ff44"], bonePick:["#3a9a20","#88ee44"] },
  ruins:   { hud:["#5a4a28","#ddcc88"], fossil:["#8a6a30","#ccaa55"], heart:["#884422","#cc7744"], bonePick:["#9a7a40","#ccaa55"] },
  cave:    { hud:["#8844ff","#cc88ff"], fossil:["#aa44ff","#dd99ff"], heart:["#8822cc","#cc44ff"], bonePick:["#9933ee","#cc77ff"] },
};

export function getHudColors(scenery, nightBlend) {
  const p = SCENERY_HUD[scenery?.id] || SCENERY_HUD.classic;
  const t = Math.min(1, nightBlend * 2);
  return {
    hud:      t < 0.5 ? p.hud[0]     : p.hud[1],
    fossil:   t < 0.5 ? p.fossil[0]  : p.fossil[1],
    heart:    t < 0.5 ? p.heart[0]   : p.heart[1],
    bonePick: t < 0.5 ? p.bonePick[0]: p.bonePick[1],
  };
}
