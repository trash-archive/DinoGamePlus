const DINO_H = 48;
const DUCK_H = 26;

export function drawSpino(ctx, x, y, dead, c, ec, ac, fc, isDucking, f) {
  if (isDucking) {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+2, y+DINO_H-DUCK_H, 36, DUCK_H-4);
    ctx.fillRect(x+18, y+DINO_H-DUCK_H-12, 20, 16);
    ctx.fillStyle = dead ? "#666" : fc;
    for(let i=0;i<4;i++) ctx.fillRect(x+8+i*7, y+DINO_H-DUCK_H-3, 4, 5);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+30, y+DINO_H-DUCK_H-9, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+DINO_H-DUCK_H-7, 3, 3);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+4,  y+12, 30, 24);
    ctx.fillRect(x+20, y+2,  18, 14);
    ctx.fillRect(x+32, y+6, 10, 5);
    ctx.fillStyle = dead ? "#666" : fc;
    const sailH = [8, 14, 18, 22, 18, 14, 8];
    for(let i=0;i<7;i++) ctx.fillRect(x+4+i*5, y+8-sailH[i], 4, sailH[i]);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x-4,  y+22, 10, 6);
    ctx.fillRect(x-10, y+25, 8,  5);
    ctx.fillRect(x-16, y+28, 6,  4);
    ctx.fillRect(x+10, y+16, 10, 6);
    ctx.fillRect(x+10, y+22, 8,  4);
    ctx.fillRect(x+12, y+26, 6,  3);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+30, y+4, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+6, 3, 3);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+28,y+6,8,2); ctx.fillRect(x+31,y+4,2,6); }
    ctx.fillStyle = dead ? "#888" : c;
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+8,  y+36, 8, 12); ctx.fillRect(x+8,  y+48, 11, 4);
        ctx.fillRect(x+22, y+36, 8, 6);  ctx.fillRect(x+22, y+42, 11, 6); ctx.fillRect(x+29, y+48, 8, 4);
      } else {
        ctx.fillRect(x+8,  y+36, 8, 6);  ctx.fillRect(x+8,  y+42, 11, 6); ctx.fillRect(x+15, y+48, 8, 4);
        ctx.fillRect(x+22, y+36, 8, 12); ctx.fillRect(x+22, y+48, 11, 4);
      }
    } else {
      ctx.fillRect(x+8, y+36, 8, 14); ctx.fillRect(x+22, y+36, 8, 14);
    }
  }
}
