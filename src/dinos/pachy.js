const DINO_H = 48;
const DUCK_H = 26;

export function drawPachy(ctx, x, y, dead, c, ec, ac, pc, isDucking, f) {
  if (isDucking) {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+4, y+DINO_H-DUCK_H, 32, DUCK_H-4);
    ctx.fillRect(x+18, y+DINO_H-DUCK_H-12, 18, 16);
    ctx.fillStyle = dead ? "#666" : pc;
    ctx.fillRect(x+18, y+DINO_H-DUCK_H-18, 18, 8);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, y+DINO_H-DUCK_H-9, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+DINO_H-DUCK_H-7, 3, 3);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+8,  y+14, 26, 22);
    ctx.fillRect(x+18, y+6,  18, 12);
    ctx.fillStyle = dead ? "#666" : pc;
    ctx.fillRect(x+18, y-4,  18, 12);
    ctx.fillRect(x+20, y-8,  14, 6);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+18, y+6,  18, 8);
    ctx.fillRect(x+12, y+18, 8, 5);
    ctx.fillRect(x+12, y+23, 6, 3);
    ctx.fillRect(x+2,  y+24, 10, 5);
    ctx.fillRect(x-4,  y+26, 8,  4);
    ctx.fillRect(x-8,  y+28, 6,  3);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+30, y+8, 5, 5);
    ctx.fillStyle = "#000"; ctx.fillRect(x+31, y+9, 3, 3);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+28,y+9,7,2); ctx.fillRect(x+31,y+7,2,5); }
    ctx.fillStyle = dead ? "#888" : c;
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+10, y+36, 7, 12); ctx.fillRect(x+10, y+48, 10, 4);
        ctx.fillRect(x+22, y+36, 7, 6);  ctx.fillRect(x+22, y+42, 10, 6); ctx.fillRect(x+28, y+48, 8, 4);
      } else {
        ctx.fillRect(x+10, y+36, 7, 6);  ctx.fillRect(x+10, y+42, 10, 6); ctx.fillRect(x+16, y+48, 8, 4);
        ctx.fillRect(x+22, y+36, 7, 12); ctx.fillRect(x+22, y+48, 10, 4);
      }
    } else {
      ctx.fillRect(x+10, y+36, 7, 14); ctx.fillRect(x+22, y+36, 7, 14);
    }
  }
}
