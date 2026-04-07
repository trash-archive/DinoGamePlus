import { GROUND_Y } from "../constants";

// ─── OBSTACLE HITBOXES ────────────────────────────────────────────────────────
export function getObstacleHitbox(o) {
  const g = GROUND_Y;
  if(o.otype==="bird")          return{x:o.x+4,  y:o.y+2,              w:30, h:14};
  if(o.otype==="rock")          return{x:o.x+4,  y:g-22,               w:32, h:22};
  if(o.otype==="spike")         return{x:o.x+2,  y:g-26,               w:38, h:26};
  if(o.otype==="turret")        return{x:o.x+4,  y:g-32,               w:32, h:32};
  if(o.otype==="wall")          return{x:o.x,    y:g-28,               w:18, h:28};
  if(o.otype==="log")           return{x:o.x+2,  y:g-18,               w:40, h:18};
  if(o.otype==="spike_cluster") return{x:o.x+2,  y:g-30,               w:58, h:30};
  if(o.otype==="dune")          return{x:o.x+4,  y:g-22,               w:48, h:22};
  if(o.otype==="tumbleweed")    return{x:o.x+4,  y:g-26,               w:28, h:22};
  if(o.otype==="vulture")       return{x:o.x+4,  y:o.y+4,              w:32, h:14};
  if(o.otype==="bonepile")      return{x:o.x+2,  y:g-14,               w:44, h:14};
  if(o.otype==="dust_devil")    return{x:o.x+2,  y:g-72,               w:44, h:72};
  if(o.otype==="sandworm")      return{x:o.x+8,  y:g-(o._wormH||0),    w:24, h:o._wormH||0};
  if(o.otype==="scorpion")      return{x:o.x+2,  y:g-20,               w:40, h:20};
  if(o.otype==="icewall")       return{x:o.x,    y:g-34,               w:16, h:34};
  if(o.otype==="snowball")      return{x:o.x+2,  y:g-28,               w:28, h:24};
  if(o.otype==="frostspike")    return{x:o.x+2,  y:g-44,               w:40, h:44};
  if(o.otype==="icicle")        return{x:o.x+4,  y:o._icicleY||(-20),  w:10, h:28};
  if(o.otype==="yeti")          return{x:o.x+4,  y:g-52,               w:36, h:52};
  if(o.otype==="lavarock")      return{x:o.x+2,  y:g-26,               w:42, h:26};
  if(o.otype==="firePillar")    return{x:o.x+8,  y:g-48,               w:20, h:48};
  if(o.otype==="lavaburst")     return{x:o.x+6,  y:g-16,               w:28, h:16};
  if(o.otype==="firewall")      return{x:o.x,    y:g-60,               w:14, h:60};
  if(o.otype==="demon")         return{x:o.x+4,  y:o.y+4,              w:36, h:28};
  if(o.otype==="vineTrap")      return{x:o.x+2,  y:g-60,               w:36, h:60};
  if(o.otype==="giantMushroom") return{x:o.x+2,  y:g-50,               w:38, h:50};
  if(o.otype==="piranha")       return{x:o.x+6,  y:g-62,               w:28, h:26};
  if(o.otype==="gorilla")       return{x:o.x+6,  y:g-62,               w:32, h:62};
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
  const heights=[44,62,40,36,34], widths=[28,22,28,44,38];
  return{x:o.x+4, y:g-(heights[o.type||0]||44), w:widths[o.type||0]||28, h:heights[o.type||0]||44};
}

export function rectsOverlap(ax,ay,aw,ah,bx,by,bw,bh) {
  return ax<bx+bw && ax+aw>bx && ay<by+bh && ay+ah>by;
}
