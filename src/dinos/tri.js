const DINO_H = 48;
const DUCK_H = 26;

export function drawTri(ctx, x, y, dead, c, ec, ac, pc, fc, isDucking, f) {
  if (isDucking) {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+4, y+DINO_H-DUCK_H, 34, DUCK_H-2);
    ctx.fillRect(x+16, y+DINO_H-DUCK_H-14, 24, 18);
    ctx.fillStyle = dead ? "#777" : pc;
    ctx.fillRect(x+30, y+DINO_H-DUCK_H-10, 5, 12);
    ctx.fillRect(x+36, y+DINO_H-DUCK_H-8,  4, 10);
    ctx.fillRect(x+24, y+DINO_H-DUCK_H-8,  4, 10);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, y+DINO_H-DUCK_H-8, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+DINO_H-DUCK_H-6, 3, 3);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+4,  y+12, 30, 26);
    ctx.fillRect(x+16, y+2,  24, 16);
    ctx.fillStyle = dead ? "#666" : fc;
    ctx.fillRect(x+14, y-6,  22, 10);
    ctx.fillRect(x+16, y-10, 18, 6);
    ctx.fillStyle = dead ? "#777" : pc;
    ctx.fillRect(x+33, y-2, 5, 14);
    ctx.fillRect(x+38, y+4, 4, 10);
    ctx.fillRect(x+27, y+4, 4, 10);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x-4,  y+22, 10, 5);
    ctx.fillRect(x-10, y+25, 8,  4);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, y+4, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+6, 3, 3);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+26,y+6,8,2); ctx.fillRect(x+29,y+4,2,6); }
    ctx.fillStyle = dead ? "#888" : c;
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+8,  y+38, 8, 10); ctx.fillRect(x+8,  y+48, 11, 4);
        ctx.fillRect(x+22, y+38, 8, 5);  ctx.fillRect(x+22, y+43, 11, 5); ctx.fillRect(x+29, y+48, 8, 4);
      } else {
        ctx.fillRect(x+8,  y+38, 8, 5);  ctx.fillRect(x+8,  y+43, 11, 5); ctx.fillRect(x+15, y+48, 8, 4);
        ctx.fillRect(x+22, y+38, 8, 10); ctx.fillRect(x+22, y+48, 11, 4);
      }
    } else {
      ctx.fillRect(x+8, y+38, 8, 12); ctx.fillRect(x+22, y+38, 8, 12);
    }
  }
}
