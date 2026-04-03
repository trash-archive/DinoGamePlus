const DINO_H = 48;
const DUCK_H = 26;

export function drawDilopho(ctx, x, y, dead, c, ec, ac, fc, isDucking, f) {
  if (isDucking) {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+2, y+DINO_H-DUCK_H, 34, DUCK_H-6);
    ctx.fillRect(x+18, y+DINO_H-DUCK_H-10, 20, 14);
    ctx.fillStyle = dead ? "#666" : fc;
    ctx.fillRect(x+28, y+DINO_H-DUCK_H-16, 12, 8);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, y+DINO_H-DUCK_H-7, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+DINO_H-DUCK_H-5, 3, 3);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+6,  y+14, 26, 22);
    ctx.fillRect(x+20, y+2,  18, 14);
    ctx.fillStyle = dead ? "#666" : fc;
    ctx.fillRect(x+22, y-6, 4, 10);
    ctx.fillRect(x+28, y-6, 4, 10);
    ctx.fillRect(x+20, y-8, 16, 4);
    ctx.fillRect(x+34, y+4, 10, 6);
    ctx.fillRect(x+36, y+2, 6,  10);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x-2,  y+22, 10, 4);
    ctx.fillRect(x-8,  y+24, 8,  3);
    ctx.fillRect(x-14, y+26, 7,  3);
    ctx.fillRect(x-18, y+28, 6,  2);
    ctx.fillRect(x+12, y+17, 9, 5);
    ctx.fillRect(x+12, y+22, 7, 3);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+30, y+4, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+6, 3, 3);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+28,y+6,8,2); ctx.fillRect(x+31,y+4,2,6); }
    ctx.fillStyle = dead ? "#888" : c;
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+8,  y+36, 7, 12); ctx.fillRect(x+8,  y+48, 10, 4);
        ctx.fillRect(x+20, y+36, 7, 5);  ctx.fillRect(x+20, y+41, 10, 7); ctx.fillRect(x+26, y+48, 8, 4);
      } else {
        ctx.fillRect(x+8,  y+36, 7, 5);  ctx.fillRect(x+8,  y+41, 10, 7); ctx.fillRect(x+14, y+48, 8, 4);
        ctx.fillRect(x+20, y+36, 7, 12); ctx.fillRect(x+20, y+48, 10, 4);
      }
    } else {
      ctx.fillRect(x+8, y+36, 7, 14); ctx.fillRect(x+20, y+36, 7, 14);
    }
  }
}
