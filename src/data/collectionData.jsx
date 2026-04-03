// ─── COLLECTION DATA ─────────────────────────────────────────────────────────
// Sceneries, skins, dino designs, passives, and passive icons

export { SCENERIES } from "./sceneryData.js";

export { SKINS } from "./paletteData.js";

// ─── DINO DESIGNS ─────────────────────────────────────────────────────────────
export const DINO_DESIGNS = [
  { id:"raptor",   label:"Raptor",        cost:0,    desc:"Fast and lean  Ethe classic runner" },
  { id:"trex",     label:"T-Rex",         cost:2500,  desc:"Stocky and powerful apex predator" },
  { id:"stego",    label:"Stegosaurus",   cost:3500,  desc:"Armored with iconic back plates" },
  { id:"pterodac", label:"Pterodactyl",   cost:5000,  desc:"Winged flyer, soars above danger" },
  { id:"anky",     label:"Ankylosaurus",  cost:7000,  desc:"Club tail, heavy armored tank" },
  { id:"tri",      label:"Triceratops",   cost:9000,  desc:"Three-horned charging powerhouse" },
  { id:"brachio",  label:"Brachiosaurus", cost:12000, desc:"Towering long-neck gentle giant" },
  { id:"spino",    label:"Spinosaurus",   cost:18000, desc:"Sail-backed river predator" },
  { id:"pachy",    label:"Pachycephalosaurus", cost:15000, desc:"Dome-headed headbutter" },
  { id:"para",     label:"Parasaurolophus", cost:20000, desc:"Crested hadrosaur, crest resonates" },
  { id:"dilopho",  label:"Dilophosaurus", cost:30000, desc:"Frilled venomous sprinter" },
  { id:"hasim",    label:"Hasim",          cost:0,     desc:"Just happy to be here.", unlockDist:55000 },
];

// ─── DINO PASSIVE SKILLS ──────────────────────────────────────────────────────
export const DINO_PASSIVES = {
  raptor:    { label:"Speed Rush",      desc:"Every 500m grants +0.5% bone income (max 10%). Builds over distance." },
  trex:      { label:"Apex Predator",   desc:"Starts every run with 2 hearts. Raw power from the start." },
  stego:     { label:"Plate Armor",     desc:"Shield proc chance increased by 50%. The back plates absorb punishment." },
  pterodac:  { label:"Thermal Lift",    desc:"Activates fly mode for 5s every 30s — airborne pickups worth 1.5x." },
  anky:      { label:"Pulse Wave",      desc:"Every 40s emits a shockwave that destroys all surrounding obstacles." },
  tri:       { label:"Horn Burst",      desc:"Every 30s fires horns in all directions, destroying obstacles & projectiles." },
  brachio:   { label:"Long Reach",      desc:"Permanent +60px bone collection range. The long neck scoops up nearby bones." },
  spino:     { label:"Sail Power",      desc:"+30% bones earned during night only. The sail thrives in moonlight." },
  pachy:     { label:"Headbutt",        desc:"Every 30s headbutts forward for 5s, destroying front obstacles & projectiles." },
  para:      { label:"Resonance",       desc:"Combo timer lasts 25% longer, capped at 20 combo. The crest sustains momentum." },
  dilopho:   { label:"Phase Shift",     desc:"Every 30s phases through everything for 5s. Untouchable!" },
  hasim:     { label:"Nothing",          desc:"Does absolutely nothing. He's just happy to be here." },
};

// ─── PASSIVE ICONS ────────────────────────────────────────────────────────────
// Pixel-style SVG icons for dino passives — inline, theme-consistent
const S = {display:"inline",verticalAlign:"middle",marginRight:3,shapeRendering:"crispEdges"};
export const PASSIVE_ICONS = {
  raptor:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="5" y="0" width="3" height="4" fill="currentColor"/>
      <rect x="2" y="3" width="6" height="3" fill="currentColor"/>
      <rect x="2" y="6" width="3" height="4" fill="currentColor"/>
    </svg>,
  trex:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      {/* Two hearts side by side */}
      <rect x="0" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="2" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="1" y="0" width="2" height="1" fill="currentColor"/>
      <rect x="0" y="3" width="4" height="2" fill="currentColor"/>
      <rect x="1" y="5" width="2" height="1" fill="currentColor"/>
      <rect x="6" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="8" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="7" y="0" width="2" height="1" fill="currentColor"/>
      <rect x="6" y="3" width="4" height="2" fill="currentColor"/>
      <rect x="7" y="5" width="2" height="1" fill="currentColor"/>
    </svg>,
  stego:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="1" y="0" width="8" height="6" fill="currentColor"/>
      <rect x="2" y="6" width="6" height="2" fill="currentColor"/>
      <rect x="3" y="8" width="4" height="1" fill="currentColor"/>
      <rect x="4" y="9" width="2" height="1" fill="currentColor"/>
    </svg>,
  pterodac:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      {/* Clock circle with wings */}
      <rect x="3" y="0" width="4" height="1" fill="currentColor"/>
      <rect x="1" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="7" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="0" y="3" width="1" height="4" fill="currentColor"/>
      <rect x="9" y="3" width="1" height="4" fill="currentColor"/>
      <rect x="1" y="7" width="2" height="2" fill="currentColor"/>
      <rect x="7" y="7" width="2" height="2" fill="currentColor"/>
      <rect x="3" y="9" width="4" height="1" fill="currentColor"/>
      <rect x="4" y="2" width="1" height="3" fill="currentColor"/>
      <rect x="5" y="4" width="2" height="1" fill="currentColor"/>
    </svg>,
  anky:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      {/* Shockwave rings radiating from center */}
      <rect x="4" y="4" width="2" height="2" fill="currentColor"/>
      <rect x="3" y="2" width="4" height="1" fill="currentColor"/>
      <rect x="3" y="7" width="4" height="1" fill="currentColor"/>
      <rect x="2" y="3" width="1" height="4" fill="currentColor"/>
      <rect x="7" y="3" width="1" height="4" fill="currentColor"/>
      <rect x="1" y="1" width="2" height="1" fill="currentColor"/>
      <rect x="7" y="1" width="2" height="1" fill="currentColor"/>
      <rect x="1" y="8" width="2" height="1" fill="currentColor"/>
      <rect x="7" y="8" width="2" height="1" fill="currentColor"/>
      <rect x="0" y="2" width="1" height="2" fill="currentColor"/>
      <rect x="9" y="2" width="1" height="2" fill="currentColor"/>
      <rect x="0" y="6" width="1" height="2" fill="currentColor"/>
      <rect x="9" y="6" width="1" height="2" fill="currentColor"/>
    </svg>,
  tri:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      {/* Spikes/arrows radiating in all 8 directions from center */}
      <rect x="4" y="4" width="2" height="2" fill="currentColor"/>
      <rect x="4" y="0" width="2" height="3" fill="currentColor"/>
      <rect x="4" y="7" width="2" height="3" fill="currentColor"/>
      <rect x="0" y="4" width="3" height="2" fill="currentColor"/>
      <rect x="7" y="4" width="3" height="2" fill="currentColor"/>
      <rect x="1" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="7" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="1" y="7" width="2" height="2" fill="currentColor"/>
      <rect x="7" y="7" width="2" height="2" fill="currentColor"/>
    </svg>,
  brachio:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="0" y="0" width="3" height="7" fill="currentColor"/>
      <rect x="7" y="0" width="3" height="7" fill="currentColor"/>
      <rect x="3" y="7" width="4" height="3" fill="currentColor"/>
      <rect x="0" y="0" width="3" height="3" fill="#cc2200"/>
      <rect x="7" y="0" width="3" height="3" fill="#2255cc"/>
    </svg>,
  spino:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="2" y="0" width="5" height="2" fill="currentColor"/>
      <rect x="1" y="2" width="3" height="6" fill="currentColor"/>
      <rect x="2" y="8" width="5" height="2" fill="currentColor"/>
      <rect x="6" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="7" y="3" width="2" height="4" fill="currentColor"/>
      <rect x="6" y="7" width="2" height="2" fill="currentColor"/>
    </svg>,
  pachy:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="3" y="0" width="4" height="1" fill="currentColor"/>
      <rect x="2" y="1" width="6" height="2" fill="currentColor"/>
      <rect x="1" y="3" width="8" height="3" fill="currentColor"/>
      <rect x="0" y="7" width="10" height="2" fill="currentColor"/>
    </svg>,
  para:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      <rect x="0" y="3" width="2" height="4" fill="currentColor"/>
      <rect x="3" y="1" width="2" height="8" fill="currentColor"/>
      <rect x="6" y="1" width="2" height="8" fill="currentColor"/>
      <rect x="9" y="3" width="1" height="4" fill="currentColor"/>
    </svg>,
  dilopho:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      {/* Ghost/phase outline — dashed dino silhouette */}
      <rect x="3" y="0" width="4" height="1" fill="currentColor"/>
      <rect x="1" y="1" width="2" height="1" fill="currentColor"/>
      <rect x="7" y="1" width="2" height="1" fill="currentColor"/>
      <rect x="0" y="3" width="1" height="2" fill="currentColor"/>
      <rect x="9" y="3" width="1" height="2" fill="currentColor"/>
      <rect x="1" y="6" width="2" height="1" fill="currentColor"/>
      <rect x="7" y="6" width="2" height="1" fill="currentColor"/>
      <rect x="3" y="8" width="1" height="2" fill="currentColor"/>
      <rect x="6" y="8" width="1" height="2" fill="currentColor"/>
      <rect x="4" y="4" width="2" height="2" fill="currentColor"/>
    </svg>,
  hasim:
    <svg width="12" height="12" viewBox="0 0 10 10" style={S}>
      {/* Shrug — two arms raised, dot in center */}
      <rect x="4" y="4" width="2" height="2" fill="currentColor"/>
      <rect x="0" y="2" width="3" height="2" fill="currentColor"/>
      <rect x="7" y="2" width="3" height="2" fill="currentColor"/>
      <rect x="2" y="0" width="2" height="3" fill="currentColor"/>
      <rect x="6" y="0" width="2" height="3" fill="currentColor"/>
    </svg>,
};
