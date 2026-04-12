// ─── COLLECTION DATA ─────────────────────────────────────────────────────────
// Sceneries, skins, dino designs, passives, and passive icons

import { SCENERY_WASTELAND } from "../maps/wasteland/wasteland";
import { SCENERY_GRASSLANDS } from "../maps/grasslands/grasslands";
import { SCENERY_DESERT } from "../maps/desert/desert";
import { SCENERY_ARCTIC } from "../maps/arctic/arctic";
import { SCENERY_VOLCANO } from "../maps/volcano/volcano";
import { SCENERY_JUNGLE } from "../maps/jungle/jungle";
import { SCENERY_RUINS } from "../maps/ruins/ruins";
import { SCENERY_CAVE }  from "../maps/cave/cave";
import { SCENERY_ABYSS } from "../maps/abyss/abyss";

export const SCENERIES = [
  SCENERY_WASTELAND,
  SCENERY_GRASSLANDS,
  SCENERY_DESERT,
  SCENERY_ARCTIC,
  SCENERY_VOLCANO,
  SCENERY_JUNGLE,
  SCENERY_RUINS,
  SCENERY_CAVE,
  SCENERY_ABYSS,
];

// ─── MAP ICONS ───────────────────────────────────────────────────────────────
const I = { display:"block", shapeRendering:"crispEdges" };
export const MAP_ICONS = {
  // Wasteland — pixel cactus
  classic:
    <svg width="16" height="16" viewBox="0 0 10 10" style={I}>
      <rect x="4" y="1" width="2" height="7" fill="currentColor"/>
      <rect x="2" y="3" width="2" height="2" fill="currentColor"/>
      <rect x="6" y="4" width="2" height="2" fill="currentColor"/>
      <rect x="1" y="5" width="2" height="1" fill="currentColor"/>
      <rect x="7" y="6" width="2" height="1" fill="currentColor"/>
      <rect x="3" y="8" width="4" height="2" fill="currentColor"/>
    </svg>,
  // Grasslands — pixel sun over hills
  plains:
    <svg width="16" height="16" viewBox="0 0 10 10" style={I}>
      <rect x="4" y="0" width="2" height="1" fill="currentColor"/>
      <rect x="3" y="1" width="4" height="2" fill="currentColor"/>
      <rect x="4" y="3" width="2" height="1" fill="currentColor"/>
      <rect x="0" y="6" width="4" height="4" fill="currentColor"/>
      <rect x="3" y="5" width="4" height="5" fill="currentColor"/>
      <rect x="6" y="7" width="4" height="3" fill="currentColor"/>
    </svg>,
  // Desert — pixel pyramid
  desert:
    <svg width="16" height="16" viewBox="0 0 10 10" style={I}>
      <rect x="4" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="3" y="3" width="4" height="2" fill="currentColor"/>
      <rect x="2" y="5" width="6" height="2" fill="currentColor"/>
      <rect x="1" y="7" width="8" height="2" fill="currentColor"/>
      <rect x="0" y="9" width="10" height="1" fill="currentColor"/>
    </svg>,
  // Arctic — pixel snowflake
  arctic:
    <svg width="16" height="16" viewBox="0 0 10 10" style={I}>
      <rect x="4" y="0" width="2" height="10" fill="currentColor"/>
      <rect x="0" y="4" width="10" height="2" fill="currentColor"/>
      <rect x="1" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="7" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="1" y="7" width="2" height="2" fill="currentColor"/>
      <rect x="7" y="7" width="2" height="2" fill="currentColor"/>
    </svg>,
  // Volcano — pixel erupting volcano
  volcano:
    <svg width="16" height="16" viewBox="0 0 10 10" style={I}>
      <rect x="3" y="0" width="2" height="2" fill="currentColor"/>
      <rect x="6" y="1" width="2" height="1" fill="currentColor"/>
      <rect x="4" y="2" width="2" height="2" fill="currentColor"/>
      <rect x="3" y="4" width="4" height="2" fill="currentColor"/>
      <rect x="2" y="6" width="6" height="2" fill="currentColor"/>
      <rect x="1" y="8" width="8" height="2" fill="currentColor"/>
    </svg>,
  // Jungle — pixel tree
  jungle:
    <svg width="16" height="16" viewBox="0 0 10 10" style={I}>
      <rect x="3" y="0" width="4" height="2" fill="currentColor"/>
      <rect x="2" y="2" width="6" height="2" fill="currentColor"/>
      <rect x="1" y="4" width="8" height="3" fill="currentColor"/>
      <rect x="4" y="7" width="2" height="3" fill="currentColor"/>
    </svg>,
  // Ruins — pixel pillar / arch
  ruins:
    <svg width="16" height="16" viewBox="0 0 10 10" style={I}>
      <rect x="1" y="0" width="2" height="8" fill="currentColor"/>
      <rect x="7" y="0" width="2" height="8" fill="currentColor"/>
      <rect x="1" y="0" width="8" height="2" fill="currentColor"/>
      <rect x="0" y="8" width="4" height="2" fill="currentColor"/>
      <rect x="6" y="8" width="4" height="2" fill="currentColor"/>
    </svg>,
  // Crystal Cave — pixel crystal cluster
  cave:
    <svg width="16" height="16" viewBox="0 0 10 10" style={I}>
      <rect x="1" y="4" width="2" height="6" fill="currentColor"/>
      <rect x="0" y="3" width="4" height="1" fill="currentColor"/>
      <rect x="4" y="2" width="2" height="8" fill="currentColor"/>
      <rect x="3" y="1" width="4" height="1" fill="currentColor"/>
      <rect x="7" y="4" width="2" height="6" fill="currentColor"/>
      <rect x="6" y="3" width="4" height="1" fill="currentColor"/>
    </svg>,
};

// Runnable maps shown in leaderboards (excludes The Abyss which is boss-only)
export const RUNNABLE_SCENERIES = SCENERIES.filter(s => s.id !== "abyss");

// The 8 regular maps that must all be owned to unlock The Abyss
export const REGULAR_SCENERY_IDS = [
  "classic","plains","desert","arctic","volcano","jungle","ruins","cave",
];

export const SKINS = [
  { id:"classic",  label:"Classic",   cost:0,     color:"#2a2a2a", eyeColor:"#f0f0f0", accent:"#3a3a3a", plateColor:"#333",    frillColor:"#444" },
  { id:"bone",     label:"Bone",      cost:1500,  color:"#d4c9a8", eyeColor:"#3a6a2a", accent:"#c0b48e", plateColor:"#c8bd9c", frillColor:"#b8a880" },
  { id:"neon",     label:"Neon",      cost:2500,  color:"#00cc66", eyeColor:"#ffffff", accent:"#00aa44", plateColor:"#00aa55", frillColor:"#00ff88" },
  { id:"shadow",   label:"Shadow",    cost:3500,  color:"#1a1a1a", eyeColor:"#dd3333", accent:"#0a0a0a", plateColor:"#151515", frillColor:"#222" },
  { id:"robo",     label:"Robo",      cost:5000,  color:"#5599aa", eyeColor:"#ffdd00", accent:"#336688", plateColor:"#446688", frillColor:"#6699bb" },
  { id:"gold",     label:"Gold",      cost:8000,  color:"#d4a820", eyeColor:"#2a2a2a", accent:"#b89010", plateColor:"#c09810", frillColor:"#e8c030" },
  { id:"lava",     label:"Lava",      cost:10000, color:"#aa2200", eyeColor:"#ffaa00", accent:"#661100", plateColor:"#882200", frillColor:"#cc3300" },
  { id:"ice",      label:"Ice",       cost:12000, color:"#88ccee", eyeColor:"#003388", accent:"#66aacc", plateColor:"#77bbdd", frillColor:"#aaddff" },
  { id:"void",     label:"Void",      cost:20000, color:"#110022", eyeColor:"#aa33ff", accent:"#0a0015", plateColor:"#1a0033", frillColor:"#220044" },
  { id:"crystal",  label:"Crystal",   cost:25000, color:"#cc77ee", eyeColor:"#ffffff", accent:"#994dbb", plateColor:"#bb66dd", frillColor:"#dd99ff" },
  { id:"rust",     label:"Rust",      cost:6000,  color:"#8a3a18", eyeColor:"#ffcc55", accent:"#5a2a10", plateColor:"#6a3015", frillColor:"#aa4422" },
  { id:"obsidian", label:"Obsidian",  cost:35000, color:"#1a1a2a", eyeColor:"#44ddff", accent:"#0a0a18", plateColor:"#15152a", frillColor:"#2a2a3a" },
];

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
  { id:"hasim",    label:"Hasim",          cost:0,     desc:"Just happy to be here.", unlockDist:10000 },
];

// ─── DINO PASSIVE SKILLS ──────────────────────────────────────────────────────
export const DINO_PASSIVES = {
  raptor:    { label:"Speed Rush",      desc:"Every 500m grants +0.5% bone income (max 10%). Builds over distance." },
  trex:      { label:"Apex Predator",   desc:"Starts every run with 2 hearts. Raw power from the start." },
  stego:     { label:"Plate Armor",     desc:"Has a 20% chance to block any hit for free. The plates absorb the damage so you don't lose a life." },
  pterodac:  { label:"Thermal Lift",    desc:"Every 30s, enters fly mode for 10s. Use Up/Down to fly freely anywhere on screen. Bones picked up while airborne are worth 1.5x." },
  anky:      { label:"Pulse Wave",      desc:"Every 15s, the club tail slams the ground and destroys all nearby obstacles and bullets." },
  tri:       { label:"Horn Burst",      desc:"Every 20s, fires 5 horns that fly across the screen and destroys every obstacle and bullet." },
  brachio:   { label:"Long Reach",      desc:"Permanent +120px bone collection range. The long neck scoops up nearby bones from far away." },
  spino:     { label:"Sail Power",      desc:"+50% bones earned during night. Surviving a full night cycle awards bonus fossils. The sail thrives in moonlight." },
  pachy:     { label:"Headbutt",        desc:"Every 30s headbutts forward for 5s, destroying front obstacles & projectiles within 160px." },
  para:      { label:"Resonance",       desc:"Combo timer lasts 25% longer, capped at 20 combo. The crest sustains momentum." },
  dilopho:   { label:"Phase Shift",     desc:"Every 30s phases through everything for 7s. Untouchable!" },
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
