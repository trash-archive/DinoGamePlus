const DINO_H = 48;
const DUCK_H = 26;

export function drawAnky(ctx, x, y, dead, c, ec, ac, pc, isDucking, f) {
  if (isDucking) {
    const db = y + 26;
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+0,  db,    40, 16);
    ctx.fillRect(x+16, db-10, 20, 14);
    ctx.fillStyle = dead ? "#666" : pc;
    for(let i=0;i<5;i++) ctx.fillRect(x+2+i*7, db-4, 6, 6);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, db-6, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+30, db-4, 3, 3);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+4,  y+42, 9, 6);
    ctx.fillRect(x+22, y+42, 9, 6);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+0,  y+12, 40, 26);
    ctx.fillRect(x+16, y+4,  20, 12);
    ctx.fillStyle = dead ? "#666" : pc;
    for(let i=0;i<6;i++) ctx.fillRect(x+2+i*6, y+8, 5, 6);
    ctx.fillStyle = dead ? "#777" : ac;
    ctx.fillRect(x+2,  y+18, 36, 3);
    ctx.fillRect(x+2,  y+26, 36, 3);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x-6,  y+20, 10, 6);
    ctx.fillRect(x-12, y+18,  8, 10);
    ctx.fillStyle = dead ? "#666" : pc;
    ctx.fillRect(x-18, y+17, 10, 12);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, y+6, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+8, 3, 3);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+26,y+8,8,2); ctx.fillRect(x+29,y+6,2,6); }
    ctx.fillStyle = dead ? "#888" : c;
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+4,  y+36, 9, 7); ctx.fillRect(x+2,  y+43, 8, 5); ctx.fillRect(x+1,  y+46, 10, 2);
        ctx.fillRect(x+22, y+36, 9, 4); ctx.fillRect(x+24, y+40, 8, 5); ctx.fillRect(x+23, y+44, 10, 2);
      } else {
        ctx.fillRect(x+4,  y+36, 9, 4); ctx.fillRect(x+6,  y+40, 8, 5); ctx.fillRect(x+5,  y+44, 10, 2);
        ctx.fillRect(x+22, y+36, 9, 7); ctx.fillRect(x+20, y+43, 8, 5); ctx.fillRect(x+19, y+46, 10, 2);
      }
    } else {
      ctx.fillRect(x+4, y+36, 9, 12); ctx.fillRect(x+22, y+36, 9, 12);
    }
  }
}
