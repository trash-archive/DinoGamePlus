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
  plains:  { hud:["#222222","#dddddd"], fossil:["#888888","#ccccaa"], heart:["#dd2244","#ff4466"], bonePick:["#888888","#cccc99"] },
  desert:  { hud:["#222222","#dddddd"], fossil:["#888888","#ccccaa"], heart:["#dd2244","#ff4466"], bonePick:["#888888","#cccc99"] },
  arctic:  { hud:["#222222","#dddddd"], fossil:["#888888","#ccccaa"], heart:["#dd2244","#ff4466"], bonePick:["#888888","#cccc99"] },
  volcano: { hud:["#222222","#dddddd"], fossil:["#888888","#ccccaa"], heart:["#dd2244","#ff4466"], bonePick:["#888888","#cccc99"] },
  jungle:  { hud:["#222222","#dddddd"], fossil:["#888888","#ccccaa"], heart:["#dd2244","#ff4466"], bonePick:["#888888","#cccc99"] },
  ruins:   { hud:["#222222","#dddddd"], fossil:["#222222","#dddddd"], heart:["#dd2244","#ff4466"], bonePick:["#888888","#cccc99"] },
  cave:    { hud:["#8844ff","#cc88ff"], fossil:["#aa44ff","#dd99ff"], heart:["#8822cc","#cc44ff"], bonePick:["#9933ee","#cc77ff"] },
  abyss:   { hud:["#cc88ff","#ee99ff"], fossil:["#aa44ff","#cc88ff"], heart:["#ff2244","#ff6688"], bonePick:["#9933ee","#cc77ff"] },
};

export function getHudColors(scenery, nightBlend) {
  const p = SCENERY_HUD[scenery?.id] || SCENERY_HUD.classic;
  const t = Math.min(1, nightBlend * 2);
  const fossil = t < 0.5 ? p.fossil[0] : p.fossil[1];
  return {
    hud:      t < 0.5 ? p.hud[0]     : p.hud[1],
    hudText:  fossil,
    fossil,
    heart:    t < 0.5 ? p.heart[0]   : p.heart[1],
    bonePick: t < 0.5 ? p.bonePick[0]: p.bonePick[1],
  };
}
