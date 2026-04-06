const DINO_H = 48;
const DUCK_H = 26;

export function drawPara(ctx, x, y, dead, c, ec, ac, fc, isDucking, f) {
  if (isDucking) {
    const db = y + 28;
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+4,  db,    32, 14);
    ctx.fillRect(x+18, db-10, 18, 14);
    ctx.fillStyle = dead ? "#666" : fc;
    ctx.fillRect(x+10, db-18, 20,  6);
    ctx.fillRect(x+6,  db-14, 12,  5);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, db-7, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+30, db-5, 3, 3);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+8,  y+42, 8, 6);
    ctx.fillRect(x+22, y+42, 8, 6);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+6,  y+14, 28, 22);
    ctx.fillRect(x+18, y+4,  18, 14);
    ctx.fillStyle = dead ? "#666" : fc;
    ctx.fillRect(x+18, y-4,   8, 10);
    ctx.fillRect(x+10, y-8,  10,  6);
    ctx.fillRect(x+0,  y-10, 12,  5);
    ctx.fillRect(x-6,  y-8,   8,  4);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+34, y+8,  8, 5);
    ctx.fillRect(x+34, y+6,  6, 3);
    ctx.fillRect(x+0,  y+24, 10, 5);
    ctx.fillRect(x-6,  y+26,  8, 4);
    ctx.fillRect(x-10, y+28,  6, 3);
    ctx.fillRect(x+12, y+18,  8, 5);
    ctx.fillRect(x+12, y+23,  6, 3);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+30, y+6, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+8, 3, 3);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+28,y+8,8,2); ctx.fillRect(x+31,y+6,2,6); }
    ctx.fillStyle = dead ? "#888" : c;
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+8,  y+36, 8, 7); ctx.fillRect(x+6,  y+43, 7, 5); ctx.fillRect(x+5,  y+46, 10, 2);
        ctx.fillRect(x+22, y+36, 8, 4); ctx.fillRect(x+24, y+40, 7, 5); ctx.fillRect(x+23, y+44, 10, 2);
      } else {
        ctx.fillRect(x+8,  y+36, 8, 4); ctx.fillRect(x+10, y+40, 7, 5); ctx.fillRect(x+9,  y+44, 10, 2);
        ctx.fillRect(x+22, y+36, 8, 7); ctx.fillRect(x+20, y+43, 7, 5); ctx.fillRect(x+19, y+46, 10, 2);
      }
    } else {
      ctx.fillRect(x+8, y+36, 8, 14); ctx.fillRect(x+22, y+36, 8, 14);
    }
  }
}
