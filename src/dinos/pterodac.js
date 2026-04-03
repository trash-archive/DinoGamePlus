export function drawPterodac(ctx, x, y, dead, c, ec, ac, fc, wf) {
  ctx.fillStyle = dead ? "#888" : c;
  ctx.fillRect(x+10, y+16, 24, 16);
  ctx.fillRect(x+20, y+6,  18, 13);
  ctx.fillRect(x+30, y+2,  14, 4);
  ctx.fillStyle = dead ? "#666" : fc;
  ctx.fillRect(x+10, y+10, 3, 8);
  ctx.fillRect(x+13, y+7,  3, 11);
  ctx.fillRect(x+16, y+5,  3, 13);
  ctx.fillStyle = dead ? "#777" : ac;
  if (wf === 0) {
    ctx.fillRect(x-10, y+4,  22, 8);
    ctx.fillRect(x-16, y+2,  8,  6);
    ctx.fillRect(x+32, y+4,  20, 8);
    ctx.fillRect(x+50, y+2,  8,  6);
  } else {
    ctx.fillRect(x-6,  y+14, 18, 6);
    ctx.fillRect(x-10, y+18, 6,  5);
    ctx.fillRect(x+30, y+14, 18, 6);
    ctx.fillRect(x+46, y+18, 6,  5);
  }
  ctx.fillStyle = dead ? "#777" : c;
  ctx.fillRect(x+0,  y+20, 12, 3);
  ctx.fillRect(x+32, y+20, 12, 3);
  ctx.fillStyle = dead ? "#555" : ec;
  ctx.fillRect(x+32, y+8, 5, 5);
  ctx.fillStyle = "#000"; ctx.fillRect(x+33, y+9, 3, 3);
  if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+30,y+9,7,2); ctx.fillRect(x+33,y+7,2,5); }
  ctx.fillStyle = dead ? "#888" : c;
  ctx.fillRect(x+14, y+32, 5, 8); ctx.fillRect(x+10, y+40, 8, 3);
  ctx.fillRect(x+24, y+32, 5, 8); ctx.fillRect(x+22, y+40, 8, 3);
}
