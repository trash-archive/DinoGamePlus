import { GROUND_Y } from "../constants";

// ─── OBSTACLE HITBOXES ────────────────────────────────────────────────────────
export function getObstacleHitbox(o) {
  const g = GROUND_Y;
  if(o.otype==="bird")          return{x:o.x+4,  y:o.y+2,              w:30, h:14};
  if(o.otype==="hawk")          return{x:o.x+4,  y:o.y+4,              w:36, h:16};
  if(o.otype==="rock")          return{x:o.x+2,  y:g-22,               w:32, h:22};
  if(o.otype==="spike")         return{x:o.x+2,  y:g-26,               w:38, h:26};
  if(o.otype==="thornbush")     return{x:o.x+4,  y:g-34,               w:34, h:34};
  if(o.otype==="stump")         return{x:o.x+2,  y:g-20,               w:40, h:20};
  if(o.otype==="bush")          return{x:o.x+2,  y:g-26,               w:44, h:26};
  if(o.otype==="turret")        return{x:o.x+4,  y:g-36,               w:38, h:36};
  if(o.otype==="wall")          return{x:o.x,    y:g-56,               w:22, h:56};
  if(o.otype==="tree") {
    const t = o.type||0;
    if(t===0) return{x:o.x+2,  y:g-62,  w:32, h:62};  // full canopy top to ground
    if(t===1) return{x:o.x,    y:g-74,  w:38, h:74};  // full canopy top to ground
    return          {x:o.x+2,  y:g-40,  w:32, h:40};  // dead tree trunk+branches
  }
  if(o.otype==="log")           return{x:o.x+2,  y:g-32,               w:42, h:32};
  if(o.otype==="spike_cluster") return{x:o.x,    y:g-30,               w:60, h:30};
  if(o.otype==="dune")          return{x:o.x+4,  y:g-22,               w:48, h:22};
  if(o.otype==="tumbleweed")    return{x:o.x+4,  y:g-30,               w:28, h:26};
  if(o.otype==="vulture")       return{x:o.x+4,  y:o.y+4,              w:32, h:14};
  if(o.otype==="dust_devil")    return{x:o.x+4,  y:g-72,               w:40, h:72};
  if(o.otype==="skull")         return{x:o.x,    y:g-18,               w:36, h:18};
  if(o.otype==="sandworm")      return{x:o.x+8,  y:g-(o._wormH||0),    w:24, h:o._wormH||0};
  if(o.otype==="scorpion")      return{x:o.x+2,  y:g-20,               w:40, h:20};
  if(o.otype==="icewall")       return{x:o.x,    y:g-34,               w:16, h:34};
  if(o.otype==="snowball")      return{x:o.x+2,  y:g-28,               w:28, h:24};
  if(o.otype==="frostspike")    return{x:o.x+2,  y:g-44,               w:40, h:44};
  if(o.otype==="icicle")        return{x:o.x+4,  y:o._icicleY||(-20),  w:10, h:28};
  if(o.otype==="snowdrift")     return{x:o.x+6,  y:g-22,               w:52, h:22};
  if(o.otype==="frozenTree")    return{x:o.x+10, y:g-58,               w:16, h:58};
  if(o.otype==="arcticFox")     return{x:o.x+6,  y:g-18,               w:38, h:18};
  if(o.otype==="frozenMammoth") return{x:o.x+2,  y:g-68,               w:64, h:68};
  if(o.otype==="walrus")        return{x:o.x+4,  y:g-30,               w:48, h:30};
  if(o.otype==="snowGolem")     return{x:o.x+6,  y:g-54,               w:28, h:54};
  if(o.otype==="iceBat")        return{x:o.x+8,  y:o.y+2,              w:28, h:14};
  if(o.otype==="blizzardWall")  return{x:o.x,    y:0,                  w:28, h:g};
  if(o.otype==="polarBear")     return{x:o.x+4,  y:g-28,               w:44, h:28};
  if(o.otype==="yeti")          return{x:o.x+4,  y:g-52,               w:36, h:52};
  if(o.otype==="lavarock")      return{x:o.x+2,  y:g-30,               w:42, h:30};
  if(o.otype==="firePillar")    return{x:o.x+10, y:g-56,               w:16, h:56};
  if(o.otype==="lavaburst")     return{x:o.x+6,  y:g-16,               w:28, h:16};
  if(o.otype==="firewall")      return{x:o.x+1,  y:g-60,               w:12, h:60};
  if(o.otype==="demon")         return{x:o.x+10, y:o.y+2,              w:24, h:32};
  if(o.otype==="emberlizard")   return{x:o.x+4,  y:g-20,               w:54, h:20};
  if(o.otype==="ashCloud")      return{x:o.x,    y:0,                  w:30, h:g};
  if(o.otype==="magmaGolem")    return{x:o.x+4,  y:g-70,               w:36, h:70};
  if(o.otype==="lavaBat")       return{x:o.x+8,  y:o.y+2,              w:26, h:18};
  if(o.otype==="volcanicVent")  return{x:o.x+10, y:g-10-(o._ventH||0), w:24, h:10+(o._ventH||0)};
  if(o.otype==="jungleTree") {
    const t = o.type||0;
    if(t===0) return{x:o.x+2,  y:g-92, w:38, h:92};
    if(t===1) return{x:o.x+4,  y:g-114,w:36, h:114};
    return          {x:o.x+2,  y:g-90, w:38, h:90};
  }
  if(o.otype==="giantMushroom") return{x:o.x+2,  y:g-50,               w:38, h:50};
  if(o.otype==="piranha")       return{x:o.x+6,  y:g-62,               w:28, h:26};
  if(o.otype==="gorilla")       return{x:o.x+6,  y:g-62,               w:32, h:62};
  if(o.otype==="jungleSerpent") return{x:o.x+8,  y:g-56,               w:24, h:56};
  if(o.otype==="fallingLog")    return{x:o.x+2,  y:o._logY!==undefined?o._logY:-30,  w:40, h:18};
  if(o.otype==="poisonFrog")    return{x:o.x+4,  y:g-20-(o._hopY||0),  w:32, h:20};
  if(o.otype==="jungleSpider")  return{x:o.x+8,  y:o._spiderY!==undefined?o._spiderY:-20, w:24, h:20};
  if(o.otype==="pterosaur")     return{x:o.x+6,  y:o.y+2,              w:38, h:16};
  if(o.otype==="thornWall")     return{x:o.x+2,  y:g-76,               w:32, h:76};
  if(o.otype==="jungleBoar")    return{x:o.x+2,  y:g-28,               w:40, h:28};
  if(o.otype==="scarab")        return{x:o.x+2,  y:g-18,               w:40, h:18};
  if(o.otype==="wraith")        return{x:o.x+6,  y:o.y+2,              w:32, h:36};
  if(o.otype==="fallingBlock")  return{x:o.x+2,  y:o._blockY!==undefined?o._blockY:-40, w:40, h:24};
  if(o.otype==="cursedWall")    return{x:o.x,    y:0,                  w:26, h:g};
  if(o.otype==="ankh")          return{x:o.x+6,  y:o.y-26,             w:28, h:54};
  if(o.otype==="sandTrap")      return{x:o.x+2,  y:g-6,                w:56, h:6};
  if(o.otype==="ruinsLaser")    return{x:o.x+1,  y:(o._laserState||0)===1?0:GROUND_Y, w:6, h:(o._laserState||0)===1?g:0};
  if(o.otype==="pillar")        return{x:o.x+6,  y:g-56,               w:24, h:56};
  if(o.otype==="statue")        return{x:o.x+4,  y:g-52,               w:28, h:52};
  if(o.otype==="spiketrap")     return{x:o.x+2,  y:g-(o._spikeH||0),   w:40, h:o._spikeH||0};
  if(o.otype==="boulder")       return{x:o.x+2,  y:g-28,               w:28, h:24};
  if(o.otype==="golem")         return{x:o.x+4,  y:g-58,               w:34, h:58};
  if(o.otype==="crystalSpire")  return{x:o.x+8,  y:g-60,               w:20, h:60};
  if(o.otype==="crystalCluster")return{x:o.x+2,  y:g-28,               w:48, h:28};
  if(o.otype==="stalactite")    return{x:o.x+4,  y:o._stalY||(-30),    w:12, h:32};
  if(o.otype==="crystalGolem")  return{x:o.x+4,  y:g-60,               w:34, h:60};
  if(o.otype==="voidPortal")    return{x:o.x+6,  y:g-64,               w:28, h:64};
  if(o.otype==="crystalMine")   return{x:o.x+2,  y:o.y-6,              w:20, h:28};
  if(o.otype==="crystalBat")    return{x:o.x+6,  y:o.y+3,              w:16, h:12};
  if(o.otype==="geodeSpitter")  return{x:o.x+6,  y:g-54,               w:28, h:54};
  if(o.otype==="crystalGas")    return{x:o.x+2,  y:g-58,               w:32, h:58};
  if(o.otype==="crystalCeiling"){
    const cy = o._ceilY??0;
    // Hitbox covers slab face only (22px), active only once descending
    // descendTarget is GROUND_Y-72=138, slab bottom=160, ducking dino top=189 — safe gap
    return{x:o.x+4, y:cy, w:40, h:cy>2?22:0};
  }
  if(o.otype==="runeCircle")    return{x:o.x+4,  y:g-4,                w:32, h:4};
  if(o.otype==="crystalWall")   return{x:o.x+2,  y:g-30,               w:40, h:30};
  const heights=[44,62,52,36,34], widths=[28,22,44,44,38];
  return{x:o.x+4, y:g-(heights[o.type||0]||44), w:widths[o.type||0]||28, h:heights[o.type||0]||44};
}

export function rectsOverlap(ax,ay,aw,ah,bx,by,bw,bh) {
  return ax<bx+bw && ax+aw>bx && ay<by+bh && ay+ah>by;
}
