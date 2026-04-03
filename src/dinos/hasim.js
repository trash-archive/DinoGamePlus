const DINO_H = 48;
const DUCK_H = 26;

export function drawHasim(ctx, x, y, dead, c, ec, ac, pc, fc, isDucking, f) {
  const skin2 = dead ? "#888" : (c  || "#f5c89a");
  const shirt  = dead ? "#666" : (ac || "#3a7acc");
  const pants  = dead ? "#555" : (pc || "#2a2a6a");
  const hair   = dead ? "#555" : (fc || "#2a1a08");

  if (isDucking) {
    const by = y + DINO_H - DUCK_H;
    ctx.fillStyle = skin2;
    ctx.fillRect(x+22, by-2, 14, 12);
    ctx.fillStyle = hair;
    ctx.fillRect(x+22, by-2, 14, 4);
    ctx.fillRect(x+20, by-1, 4, 6);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+30, by+4, 3, 3);
    ctx.fillStyle = "#000"; ctx.fillRect(x+31, by+5, 2, 2);
    if (!dead) {
      ctx.fillStyle = "#1a0a00";
      ctx.fillRect(x+25, by+8, 2, 2);
      ctx.fillRect(x+27, by+9, 4, 1);
      ctx.fillRect(x+31, by+8, 2, 2);
    }
    ctx.fillStyle = shirt;
    ctx.fillRect(x+4, by+2, 22, 12);
    ctx.fillStyle = skin2;
    ctx.fillRect(x+2,  by+4, 6, 8);
    ctx.fillRect(x+26, by+2, 6, 8);
    ctx.fillStyle = pants;
    ctx.fillRect(x+4, by+14, 20, 6);
    ctx.fillRect(x+4,  by+20, 9, 6);
    ctx.fillRect(x+17, by+20, 9, 6);
    ctx.fillStyle = dead ? "#666" : "#1a1a1a";
    ctx.fillRect(x+2,  by+DUCK_H-4, 13, 4);
    ctx.fillRect(x+17, by+DUCK_H-4, 13, 4);
  } else {
    ctx.fillStyle = skin2;
    ctx.fillRect(x+13, y+1, 16, 12);
    ctx.fillStyle = hair;
    ctx.fillRect(x+13, y+1, 16, 4);
    ctx.fillRect(x+11, y+2, 4,  6);
    ctx.fillStyle = dead ? "#555" : ec;
    ctx.fillRect(x+15, y+6, 3, 3);
    ctx.fillRect(x+23, y+6, 3, 3);
    ctx.fillStyle = "#000";
    ctx.fillRect(x+16, y+7, 2, 2);
    ctx.fillRect(x+24, y+7, 2, 2);
    if (dead) {
      ctx.fillStyle = "#777";
      ctx.fillRect(x+13, y+7, 5, 2); ctx.fillRect(x+15, y+5, 2, 5);
      ctx.fillRect(x+21, y+7, 5, 2); ctx.fillRect(x+23, y+5, 2, 5);
    }
    ctx.fillStyle = dead ? "#666" : "#1a0a00";
    ctx.fillRect(x+15, y+10, 2, 2);
    ctx.fillRect(x+17, y+11, 2, 1);
    ctx.fillRect(x+19, y+12, 4, 1);
    ctx.fillRect(x+23, y+11, 2, 1);
    ctx.fillRect(x+25, y+10, 2, 2);
    if (!dead) {
      ctx.fillStyle = "rgba(220,100,80,0.45)";
      ctx.fillRect(x+13, y+8, 4, 3);
      ctx.fillRect(x+25, y+8, 4, 3);
    }
    ctx.fillStyle = shirt;
    ctx.fillRect(x+9,  y+13, 24, 16);
    ctx.fillStyle = skin2;
    ctx.fillRect(x+3,  y+13, 7, 12);
    ctx.fillRect(x+32, y+13, 7, 12);
    ctx.fillRect(x+3,  y+25, 7, 4);
    ctx.fillRect(x+32, y+25, 7, 4);
    ctx.fillStyle = pants;
    ctx.fillRect(x+9,  y+29, 24, 5);
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+10, y+34, 9, 10);
        ctx.fillRect(x+23, y+34, 9, 5);
        ctx.fillRect(x+23, y+39, 11, 5);
      } else {
        ctx.fillRect(x+10, y+34, 9, 5);
        ctx.fillRect(x+10, y+39, 11, 5);
        ctx.fillRect(x+23, y+34, 9, 10);
      }
    } else {
      ctx.fillRect(x+10, y+34, 9, 10);
      ctx.fillRect(x+23, y+34, 9, 10);
    }
    ctx.fillStyle = dead ? "#666" : "#1a1a1a";
    if (!dead) {
      if (f === 0) {
        ctx.fillRect(x+8,  y+44, 13, 4);
        ctx.fillRect(x+22, y+44, 14, 4);
      } else {
        ctx.fillRect(x+8,  y+44, 14, 4);
        ctx.fillRect(x+22, y+44, 13, 4);
      }
    } else {
      ctx.fillRect(x+8,  y+44, 13, 4);
      ctx.fillRect(x+22, y+44, 13, 4);
    }
  }
}
