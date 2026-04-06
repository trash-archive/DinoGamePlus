const DINO_H = 48;
const DUCK_H = 26;

export function drawSpino(ctx, x, y, dead, c, ec, ac, fc, isDucking, f) {
  if (isDucking) {
    const db = y + 28;
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+2,  db,    36, 14);
    ctx.fillRect(x+18, db-10, 20, 14);
    ctx.fillStyle = dead ? "#666" : fc;
    for(let i=0;i<4;i++) ctx.fillRect(x+8+i*7, db-3, 4, 5);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+30, db-7, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+32, db-5, 3, 3);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+8,  y+42, 8, 6);
    ctx.fillRect(x+22, y+42, 8, 6);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+4,  y+12, 30, 24);
    ctx.fillRect(x+20, y+2,  18, 14);
    ctx.fillRect(x+32, y+6,  10,  5);
    ctx.fillStyle = dead ? "#666" : fc;
    const sailH = [8, 14, 18, 22, 18, 14, 8];
    for(let i=0;i<7;i++) ctx.fillRect(x+4+i*5, y+8-sailH[i], 4, sailH[i]);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x-4,  y+22, 10, 6);
    ctx.fillRect(x-10, y+25,  8, 5);
    ctx.fillRect(x-16, y+28,  6, 4);
    ctx.fillRect(x+10, y+16, 10, 6);
    ctx.fillRect(x+10, y+22,  8, 4);
    ctx.fillRect(x+12, y+26,  6, 3);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+30, y+4, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+32, y+6, 3, 3);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+28,y+6,8,2); ctx.fillRect(x+31,y+4,2,6); }
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
