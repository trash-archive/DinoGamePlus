const DINO_H = 48;
const DUCK_H = 26;

export function drawPara(ctx, x, y, dead, c, ec, ac, fc, isDucking, f) {
  if (isDucking) {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+4, y+DINO_H-DUCK_H, 32, DUCK_H-4);
    ctx.fillRect(x+18, y+DINO_H-DUCK_H-12, 18, 16);
    ctx.fillStyle = dead ? "#666" : fc;
    ctx.fillRect(x+10, y+DINO_H-DUCK_H-20, 20, 6);
    ctx.fillRect(x+6,  y+DINO_H-DUCK_H-16, 12, 5);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, y+DINO_H-DUCK_H-8, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+DINO_H-DUCK_H-6, 3, 3);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+6,  y+14, 28, 22);
    ctx.fillRect(x+18, y+4,  18, 14);
    ctx.fillStyle = dead ? "#666" : fc;
    ctx.fillRect(x+18, y-4,  8,  10);
    ctx.fillRect(x+10, y-8,  10, 6);
    ctx.fillRect(x+0,  y-10, 12, 5);
    ctx.fillRect(x-6,  y-8,  8,  4);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+34, y+8, 8,  5);
    ctx.fillRect(x+34, y+6, 6,  3);
    ctx.fillRect(x+0,  y+24, 10, 5);
    ctx.fillRect(x-6,  y+26, 8,  4);
    ctx.fillRect(x-10, y+28, 6,  3);
    ctx.fillRect(x+12, y+18, 8, 5);
    ctx.fillRect(x+12, y+23, 6, 3);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+30, y+6, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+8, 3, 3);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+28,y+8,8,2); ctx.fillRect(x+31,y+6,2,6); }
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
