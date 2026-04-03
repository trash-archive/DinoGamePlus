const DINO_H = 48;
const DUCK_H = 26;

export function drawBrachio(ctx, x, y, dead, c, ec, ac, isDucking, f) {
  if (isDucking) {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+2,  y+DINO_H-DUCK_H, 36, DUCK_H);
    ctx.fillRect(x+20, y+DINO_H-DUCK_H-10, 12, 16);
    ctx.fillRect(x+10, y+DINO_H-DUCK_H-14, 12, 8);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+26, y+DINO_H-DUCK_H-8, 5, 5);
    ctx.fillStyle = "#000"; ctx.fillRect(x+28, y+DINO_H-DUCK_H-6, 3, 3);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+0,  y+18, 40, 20);
    ctx.fillRect(x+24, y+2,  10, 20);
    ctx.fillRect(x+22, y-6,  12, 12);
    ctx.fillStyle = dead ? "#666" : ac;
    ctx.fillRect(x+22, y+6,  10, 6);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x-6,  y+24, 10, 5);
    ctx.fillRect(x-12, y+27, 8,  4);
    ctx.fillRect(x-18, y+29, 8,  3);
    ctx.fillRect(x-22, y+31, 6,  2);
    ctx.fillRect(x+8,  y+22, 8, 5);
    ctx.fillRect(x+8,  y+27, 6, 3);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, y-4, 5, 5);
    ctx.fillStyle = "#000"; ctx.fillRect(x+29, y-3, 3, 3);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+26,y-2,7,2); ctx.fillRect(x+29,y-4,2,5); }
    ctx.fillStyle = dead ? "#888" : c;
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+4,  y+38, 9, 10); ctx.fillRect(x+4,  y+48, 12, 3);
        ctx.fillRect(x+14, y+38, 9, 6);  ctx.fillRect(x+14, y+44, 12, 4); ctx.fillRect(x+22, y+48, 8, 3);
        ctx.fillRect(x+24, y+38, 8, 9);  ctx.fillRect(x+24, y+47, 11, 4);
        ctx.fillRect(x+32, y+38, 7, 5);
      } else {
        ctx.fillRect(x+4,  y+38, 9, 5);  ctx.fillRect(x+4,  y+43, 12, 5); ctx.fillRect(x+12, y+48, 8, 3);
        ctx.fillRect(x+14, y+38, 9, 10); ctx.fillRect(x+14, y+48, 12, 3);
        ctx.fillRect(x+24, y+38, 8, 5);
        ctx.fillRect(x+32, y+38, 7, 9);  ctx.fillRect(x+32, y+47, 10, 4);
      }
    } else {
      ctx.fillRect(x+4,y+38,9,12); ctx.fillRect(x+16,y+38,9,12); ctx.fillRect(x+28,y+38,8,12);
    }
  }
}
