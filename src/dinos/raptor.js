const DINO_H = 48;
const DUCK_H = 26;

export function drawRaptor(ctx, x, y, dead, c, ec, ac, isDucking, f) {
  if (isDucking) {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+2, y+DINO_H-DUCK_H, 34, DUCK_H-6);
    ctx.fillRect(x+16, y+DINO_H-DUCK_H-10, 22, 14);
    ctx.fillRect(x-8, y+DINO_H-DUCK_H+2, 12, 5);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+30, y+DINO_H-DUCK_H-8, 6, 6);
    ctx.fillStyle = "#000";
    ctx.fillRect(x+32, y+DINO_H-DUCK_H-6, 3, 3);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+8,  y+DINO_H-6, 7, 6);
    ctx.fillRect(x+22, y+DINO_H-6, 7, 6);
  } else {
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x+6, y+14, 28, 22);
    ctx.fillRect(x+20, y+2, 20, 16);
    ctx.fillStyle = dead ? "#666" : ac;
    ctx.fillRect(x+8, y+26, 24, 6);
    ctx.fillStyle = dead ? "#888" : c;
    ctx.fillRect(x-4,  y+22, 12, 5);
    ctx.fillRect(x-10, y+26, 8,  4);
    ctx.fillRect(x-14, y+28, 6,  3);
    ctx.fillRect(x+12, y+18, 8, 5);
    ctx.fillRect(x+12, y+23, 6, 3);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+32, y+3, 6, 6);
    ctx.fillStyle = "#000";
    ctx.fillRect(x+34, y+5, 3, 3);
    ctx.fillStyle = dead ? "#666" : ac;
    ctx.fillRect(x+38, y+5, 2, 2);
    if (dead) {
      ctx.fillStyle = "#777";
      ctx.fillRect(x+30, y+5, 8, 2);
      ctx.fillRect(x+33, y+3, 2, 6);
    }
    ctx.fillStyle = dead ? "#888" : c;
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+9,  y+36, 7, 10);
        ctx.fillRect(x+9,  y+46, 10, 3);
        ctx.fillRect(x+22, y+36, 7, 5);
        ctx.fillRect(x+22, y+41, 10, 4);
        ctx.fillRect(x+28, y+45, 8,  3);
      } else {
        ctx.fillRect(x+9,  y+36, 7, 5);
        ctx.fillRect(x+9,  y+41, 10, 4);
        ctx.fillRect(x+15, y+45, 8,  3);
        ctx.fillRect(x+22, y+36, 7, 10);
        ctx.fillRect(x+22, y+46, 10, 3);
      }
    } else {
      ctx.fillRect(x+9,  y+36, 7, 12);
      ctx.fillRect(x+22, y+36, 7, 12);
    }
  }
}
