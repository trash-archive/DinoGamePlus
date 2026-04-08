import { GROUND_Y } from "../constants";
import { drawWastelandObstacle }  from "../maps/wasteland/wastelandObstacles";
import { drawGrasslandsObstacle } from "../maps/grasslands/grasslandsObstacles";
import { drawDesertObstacle }     from "../maps/desert/desertObstacles";
import { drawArcticObstacle }     from "../maps/arctic/arcticObstacles";
import { drawVolcanoObstacle }    from "../maps/volcano/volcanoObstacles";
import { drawJungleObstacle }     from "../maps/jungle/jungleObstacles";
import { drawRuinsObstacle }      from "../maps/ruins/ruinsObstacles";
import { drawCaveObstacle }       from "../maps/cave/caveObstacles";

// ─── BIRD VARIANTS ────────────────────────────────────────────────────────────
function drawBird(ctx, o, sid, fw) {
  ctx.save();
  ctx.translate(o.x+20, 0); ctx.scale(-1, 1); ctx.translate(-o.x-20, 0);

  if(sid==="classic") {
    const col = o._nightBlend > 0.5 ? "#dddddd" : "#333333";
    ctx.fillStyle = col;
    ctx.fillRect(o.x+4,o.y+8,32,8); ctx.fillRect(o.x+12,o.y+2,16,8); ctx.fillRect(o.x+26,o.y+4,10,6);
    if(fw===0){ ctx.fillRect(o.x,o.y-6,20,8); ctx.fillRect(o.x+22,o.y+14,16,6); }
    else       { ctx.fillRect(o.x+2,o.y+2,18,6); ctx.fillRect(o.x+22,o.y+16,14,5); }
  } else if(sid==="plains") {
    // Small songbird — warm brown, distinct from the hawk
    ctx.fillStyle="#8a6a30";
    ctx.fillRect(o.x+6,o.y+6,28,10); ctx.fillRect(o.x+22,o.y+2,14,8); ctx.fillRect(o.x+34,o.y+4,8,4);
    ctx.fillStyle="#c49a50"; ctx.fillRect(o.x+24,o.y+3,6,4);
    ctx.fillStyle="#2a1a08"; ctx.fillRect(o.x+28,o.y+4,3,3);
    ctx.fillStyle="#8a6a30";
    if(fw===0){ ctx.fillRect(o.x-2,o.y-4,22,8); ctx.fillRect(o.x+26,o.y+14,14,6); }
    else       { ctx.fillRect(o.x,o.y+4,20,6);  ctx.fillRect(o.x+26,o.y+16,12,5); }
  } else if(sid==="desert") {
    ctx.fillStyle="#5a3a18";
    ctx.fillRect(o.x+8,o.y+8,26,10); ctx.fillRect(o.x+22,o.y+2,12,10);
    ctx.fillStyle="#e09060"; ctx.fillRect(o.x+24,o.y+2,8,6);
    ctx.fillStyle="#3a2010"; ctx.fillRect(o.x+30,o.y+4,3,3);
    ctx.fillStyle="#5a3a18";
    if(fw===0){ ctx.fillRect(o.x-6,o.y+2,28,7); ctx.fillRect(o.x+28,o.y+2,20,7); }
    else       { ctx.fillRect(o.x-2,o.y+8,24,5); ctx.fillRect(o.x+28,o.y+8,16,5); }
  } else if(sid==="arctic") {
    ctx.fillStyle="#ddeeff";
    ctx.fillRect(o.x+6,o.y+4,26,14); ctx.fillRect(o.x+18,o.y,14,10);
    ctx.fillStyle="#ffdd44"; ctx.fillRect(o.x+20,o.y+2,4,4); ctx.fillRect(o.x+26,o.y+2,4,4);
    ctx.fillStyle="#aabbcc"; ctx.fillRect(o.x+22,o.y+6,4,3);
    ctx.fillStyle="#ddeeff";
    if(fw===0){ ctx.fillRect(o.x-2,o.y-2,20,8); ctx.fillRect(o.x+30,o.y-2,14,8); }
    else       { ctx.fillRect(o.x+2,o.y+6,16,6); ctx.fillRect(o.x+30,o.y+6,10,6); }
  } else if(sid==="volcano") {
    ctx.fillStyle="#6a1800";
    ctx.fillRect(o.x+8,o.y+6,22,12); ctx.fillRect(o.x+18,o.y+2,12,8);
    ctx.fillStyle="#ff4400"; ctx.fillRect(o.x+20,o.y+3,4,4); ctx.fillRect(o.x+26,o.y+3,4,4);
    ctx.fillStyle="#6a1800";
    if(fw===0){
      ctx.fillRect(o.x-8,o.y-4,20,10); ctx.fillRect(o.x-14,o.y-8,10,8);
      ctx.fillRect(o.x+28,o.y-4,16,10); ctx.fillRect(o.x+42,o.y-8,8,8);
    } else {
      ctx.fillRect(o.x-4,o.y+10,16,8); ctx.fillRect(o.x-8,o.y+14,8,6);
      ctx.fillRect(o.x+28,o.y+10,12,8); ctx.fillRect(o.x+38,o.y+14,6,6);
    }
  } else if(sid==="jungle") {
    ctx.fillStyle="#1a1a1a";
    ctx.fillRect(o.x+6,o.y+6,26,12); ctx.fillRect(o.x+18,o.y+2,14,10);
    ctx.fillStyle="#ffffff"; ctx.fillRect(o.x+8,o.y+8,14,8);
    ctx.fillStyle="#ff8800"; ctx.fillRect(o.x+30,o.y+2,14,6);
    ctx.fillStyle="#ffdd00"; ctx.fillRect(o.x+30,o.y+2,6,3);
    ctx.fillStyle="#ffffff"; ctx.fillRect(o.x+20,o.y+3,4,4);
    ctx.fillStyle="#1a1a1a";
    if(fw===0){ ctx.fillRect(o.x-2,o.y-2,22,8); ctx.fillRect(o.x+26,o.y+14,14,6); }
    else       { ctx.fillRect(o.x+2,o.y+4,18,6); ctx.fillRect(o.x+26,o.y+16,12,5); }
  } else if(sid==="ruins") {
    ctx.fillStyle="#7a5a30";
    ctx.fillRect(o.x+6,o.y+6,26,10); ctx.fillRect(o.x+20,o.y+2,14,8); ctx.fillRect(o.x+32,o.y+4,8,4);
    ctx.fillStyle="#aa8850"; ctx.fillRect(o.x+8,o.y+8,10,4); ctx.fillRect(o.x+20,o.y+8,8,4);
    ctx.fillStyle="#2a1a08"; ctx.fillRect(o.x+24,o.y+3,3,3);
    ctx.fillStyle="#7a5a30";
    if(fw===0){ ctx.fillRect(o.x-2,o.y-4,22,8); ctx.fillRect(o.x+26,o.y+14,14,6); }
    else       { ctx.fillRect(o.x+2,o.y+4,18,6); ctx.fillRect(o.x+26,o.y+16,12,5); }
  } else if(sid==="cave") {
    ctx.fillStyle="#6633aa";
    ctx.fillRect(o.x+8,o.y+6,22,12); ctx.fillRect(o.x+18,o.y+2,12,8);
    ctx.fillStyle="#cc88ff"; ctx.fillRect(o.x+20,o.y+3,4,4); ctx.fillRect(o.x+26,o.y+3,4,4);
    ctx.fillStyle="rgba(160,80,255,0.3)"; ctx.fillRect(o.x+4,o.y,30,18);
    ctx.fillStyle="#6633aa";
    if(fw===0){
      ctx.fillRect(o.x-8,o.y-4,20,10); ctx.fillRect(o.x-14,o.y-8,10,8);
      ctx.fillRect(o.x+28,o.y-4,16,10); ctx.fillRect(o.x+42,o.y-8,8,8);
    } else {
      ctx.fillRect(o.x-4,o.y+10,16,8); ctx.fillRect(o.x-8,o.y+14,8,6);
      ctx.fillRect(o.x+28,o.y+10,12,8); ctx.fillRect(o.x+38,o.y+14,6,6);
    }
  } else {
    ctx.fillStyle="#888";
    ctx.fillRect(o.x+2,o.y+8,36,9); ctx.fillRect(o.x+10,o.y+2,20,8); ctx.fillRect(o.x+28,o.y+4,12,7);
    if(fw===0){ ctx.fillRect(o.x+4,o.y-8,18,9); ctx.fillRect(o.x+18,o.y+16,16,7); }
    else       { ctx.fillRect(o.x+4,o.y+2,18,6); ctx.fillRect(o.x+18,o.y+18,14,6); }
  }

  ctx.restore();
}

// ─── HAWK (GRASSLANDS) ───────────────────────────────────────────────────────
function drawHawk(ctx, o, frame) {
  const isDiving = o._vultureState === 1;
  const fw = isDiving ? 1 : Math.floor(frame/7)%2; // wings tucked while diving
  ctx.save();
  ctx.translate(o.x+22, 0); ctx.scale(-1,1); ctx.translate(-o.x-22, 0);
  // Body
  ctx.fillStyle="#6a3a10";
  ctx.fillRect(o.x+6,  o.y+6,  28, 12);
  // Neck + head
  ctx.fillRect(o.x+24, o.y+2,  12,  8);
  ctx.fillRect(o.x+30, o.y,    10,  8); // head bump
  // White head patch
  ctx.fillStyle="#eeeeee"; ctx.fillRect(o.x+30,o.y,10,7);
  // Hooked beak
  ctx.fillStyle="#ddaa00"; ctx.fillRect(o.x+38,o.y+3,6,3); ctx.fillRect(o.x+42,o.y+5,3,2);
  // Eye
  ctx.fillStyle="#ffaa00"; ctx.fillRect(o.x+32,o.y+1,4,4);
  ctx.fillStyle="#1a0800"; ctx.fillRect(o.x+33,o.y+2,2,2);
  // Talons
  ctx.fillStyle="#4a2008";
  ctx.fillRect(o.x+8,  o.y+16, 4, 4);
  ctx.fillRect(o.x+14, o.y+16, 4, 4);
  // Wings
  ctx.fillStyle="#6a3a10";
  if(fw===0){
    // Soaring — wings spread wide
    ctx.fillRect(o.x-8, o.y-4, 22, 9); ctx.fillRect(o.x-14,o.y-8,8,6); ctx.fillRect(o.x-18,o.y-10,6,4);
    ctx.fillRect(o.x+26,o.y+14,20, 8); ctx.fillRect(o.x+44,o.y+18,10,6); ctx.fillRect(o.x+52,o.y+20,6,4);
    ctx.fillStyle="#4a2008";
    ctx.fillRect(o.x-8,o.y-4,6,7); ctx.fillRect(o.x+26,o.y+14,6,6); // wing shadow
    // Wing highlight stripe
    ctx.fillStyle="#8a5a28";
    ctx.fillRect(o.x-6,o.y-2,14,3); ctx.fillRect(o.x+28,o.y+16,12,3);
  } else {
    // Diving — wings swept back tight
    ctx.fillRect(o.x-2, o.y+4, 14, 7); ctx.fillRect(o.x-6, o.y+7, 6, 5);
    ctx.fillRect(o.x+28,o.y+4, 12, 7); ctx.fillRect(o.x+38,o.y+7, 6, 5);
    ctx.fillStyle="#4a2008";
    ctx.fillRect(o.x-2,o.y+4,4,5); ctx.fillRect(o.x+28,o.y+4,4,5);
  }
  // Tail feathers
  ctx.fillStyle="#6a3a10"; ctx.fillRect(o.x+2,o.y+14,14,6); ctx.fillRect(o.x+4,o.y+18,10,4);
  ctx.fillStyle="#8a5a28"; ctx.fillRect(o.x+4,o.y+14,6,3); // tail highlight
  ctx.restore();
}

// ─── DISPATCH ─────────────────────────────────────────────────────────────────
export function drawObstacleForScenery(ctx, o, scenery, frame) {
  const set = scenery?.obstacleSet || "plants";
  const sid = scenery?.id || "classic";

  if(o.otype === "bird") {
    drawBird(ctx, o, sid, Math.floor(frame/8)%2);
    return;
  }

  if(o.otype === "hawk") {
    drawHawk(ctx, o, frame);
    return;
  }

  if     (sid==="classic")  drawWastelandObstacle(ctx, o, frame);
  else if(set==="desert")   drawDesertObstacle(ctx, o, frame);
  else if(set==="arctic")   drawArcticObstacle(ctx, o, frame);
  else if(set==="volcano")  drawVolcanoObstacle(ctx, o, frame);
  else if(set==="jungle")   drawJungleObstacle(ctx, o, frame);
  else if(set==="ruins")    drawRuinsObstacle(ctx, o, frame);
  else if(set==="cave")     drawCaveObstacle(ctx, o, frame);
  else                      drawGrasslandsObstacle(ctx, o, frame);
}
