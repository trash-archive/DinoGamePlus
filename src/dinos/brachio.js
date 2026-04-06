const DINO_H = 48;
const DUCK_H = 26;

export function drawBrachio(ctx, x, y, dead, c, ec, ac, isDucking, f) {
  if (isDucking) {
    const db = y + 26;
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+2,  db,    36, 16);
    ctx.fillRect(x+20, db-10, 12, 14);
    ctx.fillRect(x+10, db-14, 12,  8);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+26, db-8, 5, 5);
    ctx.fillStyle = "#000"; ctx.fillRect(x+28, db-6, 3, 3);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+4,  y+42, 9, 6);
    ctx.fillRect(x+16, y+42, 9, 6);
    ctx.fillRect(x+28, y+42, 8, 6);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+0,  y+18, 40, 20);
    ctx.fillRect(x+24, y+2,  10, 20);
    ctx.fillRect(x+22, y-6,  12, 12);
    ctx.fillStyle = dead ? "#666" : ac;
    ctx.fillRect(x+22, y+6,  10,  6);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x-6,  y+24, 10, 5);
    ctx.fillRect(x-12, y+27,  8, 4);
    ctx.fillRect(x-18, y+29,  8, 3);
    ctx.fillRect(x-22, y+31,  6, 2);
    ctx.fillRect(x+8,  y+22,  8, 5);
    ctx.fillRect(x+8,  y+27,  6, 3);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, y-4, 5, 5);
    ctx.fillStyle = "#000"; ctx.fillRect(x+29, y-3, 3, 3);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+26,y-2,7,2); ctx.fillRect(x+29,y-4,2,5); }
    ctx.fillStyle = dead ? "#888" : c;
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+4,  y+36, 9, 7); ctx.fillRect(x+2,  y+43, 8, 5); ctx.fillRect(x+1,  y+46, 10, 2);
        ctx.fillRect(x+14, y+36, 9, 4); ctx.fillRect(x+16, y+40, 8, 5); ctx.fillRect(x+15, y+44, 10, 2);
        ctx.fillRect(x+26, y+36, 8, 7); ctx.fillRect(x+24, y+43, 8, 5); ctx.fillRect(x+23, y+46, 10, 2);
      } else {
        ctx.fillRect(x+4,  y+36, 9, 4); ctx.fillRect(x+6,  y+40, 8, 5); ctx.fillRect(x+5,  y+44, 10, 2);
        ctx.fillRect(x+14, y+36, 9, 7); ctx.fillRect(x+12, y+43, 8, 5); ctx.fillRect(x+11, y+46, 10, 2);
        ctx.fillRect(x+26, y+36, 8, 4); ctx.fillRect(x+28, y+40, 8, 5); ctx.fillRect(x+27, y+44, 10, 2);
      }
    } else {
      ctx.fillRect(x+4,y+36,9,12); ctx.fillRect(x+16,y+36,9,12); ctx.fillRect(x+28,y+36,8,12);
    }
  }
}
