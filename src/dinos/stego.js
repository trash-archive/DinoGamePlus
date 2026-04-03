const DINO_H = 48;
const DUCK_H = 26;

export function drawStego(ctx, x, y, dead, c, ec, pc, isDucking, f) {
  if (isDucking) {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+4, y+DINO_H-DUCK_H, 34, DUCK_H-4);
    ctx.fillRect(x+16, y+DINO_H-DUCK_H-12, 20, 16);
    ctx.fillStyle = dead ? "#666" : pc;
    for(let i=0;i<3;i++) ctx.fillRect(x+10+i*9, y+DINO_H-DUCK_H-5-i*2, 5, 7+i*2);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, y+DINO_H-DUCK_H-8, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+DINO_H-DUCK_H-6, 3, 3);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+4, y+14, 30, 24);
    ctx.fillRect(x+18, y+4, 18, 14);
    ctx.fillStyle = dead ? "#666" : pc;
    const plateHeights = [10, 14, 16, 14, 10, 7];
    for(let i=0;i<6;i++) {
      const ph = plateHeights[i];
      ctx.fillRect(x+6+i*5, y+10-ph, 4, ph);
    }
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x-4,  y+22, 10, 5);
    ctx.fillRect(x-10, y+24, 8,  5);
    ctx.fillStyle = dead ? "#666" : pc;
    ctx.fillRect(x-14, y+22, 8,  9);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+10, y+20, 7, 5);
    ctx.fillRect(x+10, y+25, 5, 3);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+28, y+6, 6, 6);
    ctx.fillStyle = "#000"; ctx.fillRect(x+30, y+8, 3, 3);
    if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+26,y+8,8,2); ctx.fillRect(x+29,y+6,2,6); }
    ctx.fillStyle = dead ? "#888" : c;
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+8,  y+38, 8, 10); ctx.fillRect(x+8,  y+48, 10, 3);
        ctx.fillRect(x+22, y+38, 8, 6);  ctx.fillRect(x+22, y+44, 10, 4); ctx.fillRect(x+28, y+48, 6, 3);
      } else {
        ctx.fillRect(x+8,  y+38, 8, 6);  ctx.fillRect(x+8,  y+44, 10, 4); ctx.fillRect(x+14, y+48, 6, 3);
        ctx.fillRect(x+22, y+38, 8, 10); ctx.fillRect(x+22, y+48, 10, 3);
      }
    } else {
      ctx.fillRect(x+8, y+38, 8, 10); ctx.fillRect(x+22, y+38, 8, 10);
    }
  }
}
