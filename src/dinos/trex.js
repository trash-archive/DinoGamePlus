const DINO_H = 48;
const DUCK_H = 26;

export function drawTrex(ctx, x, y, dead, c, ec, ac, isDucking, f) {
  if (isDucking) {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+2, y+DINO_H-DUCK_H, 36, DUCK_H-4);
    ctx.fillRect(x+16, y+DINO_H-DUCK_H-14, 22, 18);
    ctx.fillRect(x+14, y+DINO_H-DUCK_H+2, 8, 5);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+30, y+DINO_H-DUCK_H-10, 7, 7);
    ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+DINO_H-DUCK_H-8, 4, 4);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+8,  y+DINO_H-5, 9, 5);
    ctx.fillRect(x+24, y+DINO_H-5, 9, 5);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+2,  y+10, 34, 28);
    ctx.fillRect(x+16, y+0,  22, 14);
    ctx.fillRect(x-4,  y+20, 8,  6);
    ctx.fillRect(x-10, y+24, 8,  5);
    ctx.fillRect(x-14, y+27, 6,  4);
    ctx.fillStyle = dead ? "#777" : ac;
    ctx.fillRect(x+10, y+16, 10, 6);
    ctx.fillRect(x+10, y+22, 7,  3);
    ctx.fillRect(x+17, y+24, 5,  3);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+32, y+2, 7, 7);
    ctx.fillStyle = "#000"; ctx.fillRect(x+34, y+4, 4, 4);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+30,y+4,8,2); ctx.fillRect(x+33,y+2,2,6); }
    ctx.fillStyle = dead ? "#888" : c;
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+6,  y+38, 9, 10); ctx.fillRect(x+6,  y+48, 13, 4);
        ctx.fillRect(x+22, y+38, 9, 5);  ctx.fillRect(x+22, y+43, 12, 5); ctx.fillRect(x+30, y+48, 8, 4);
      } else {
        ctx.fillRect(x+6,  y+38, 9, 5);  ctx.fillRect(x+6,  y+43, 12, 5); ctx.fillRect(x+14, y+48, 8, 4);
        ctx.fillRect(x+22, y+38, 9, 10); ctx.fillRect(x+22, y+48, 13, 4);
      }
    } else {
      ctx.fillRect(x+6, y+38, 9, 12); ctx.fillRect(x+22, y+38, 9, 12);
    }
  }
}
