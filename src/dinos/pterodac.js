const DINO_H = 48;

export function drawPterodac(ctx, x, y, dead, c, ec, ac, fc, wf, isDucking) {
  const C  = dead ? "#888" : c;
  const AC = dead ? "#777" : ac;
  const FC = dead ? "#666" : fc;
  const EC = dead ? "#555" : ec;

  if (isDucking) {
    const db = y + 28;
    // body low to ground
    ctx.fillStyle = C;
    ctx.fillRect(x+4,  db,    32, 14);
    // head/beak tucked forward
    ctx.fillRect(x+22, db-8,  16, 12);
    ctx.fillRect(x+34, db-4,  10,  6); // beak
    // wings folded down tight against body
    ctx.fillStyle = AC;
    ctx.fillRect(x+0,  db+2,  10,  5); // left wing folded
    ctx.fillRect(x+30, db+2,  10,  5); // right wing folded
    // crest
    ctx.fillStyle = FC;
    ctx.fillRect(x+22, db-14,  4, 8);
    ctx.fillRect(x+26, db-12,  4, 6);
    // eye
    ctx.fillStyle = EC;
    ctx.fillRect(x+32, db-6,  5, 5);
    ctx.fillStyle = "#000"; ctx.fillRect(x+33, db-5, 3, 3);
    // feet
    ctx.fillStyle = C;
    ctx.fillRect(x+8,  y+42,  7, 6);
    ctx.fillRect(x+22, y+42,  7, 6);
    return;
  }

  // ── BODY ──────────────────────────────────────────────────────────────────
  ctx.fillStyle = C;
  ctx.fillRect(x+10, y+16, 24, 16);
  ctx.fillRect(x+20, y+6,  18, 13);
  ctx.fillRect(x+30, y+2,  14,  4);

  // ── CREST ─────────────────────────────────────────────────────────────────
  ctx.fillStyle = FC;
  ctx.fillRect(x+10, y+10, 3, 8);
  ctx.fillRect(x+13, y+7,  3, 11);
  ctx.fillRect(x+16, y+5,  3, 13);

  // ── WINGS (animated) ──────────────────────────────────────────────────────
  ctx.fillStyle = AC;
  if (wf === 0) {
    ctx.fillRect(x-10, y+4,  22, 8);
    ctx.fillRect(x-16, y+2,  8,  6);
    ctx.fillRect(x+32, y+4,  20, 8);
    ctx.fillRect(x+50, y+2,  8,  6);
  } else {
    ctx.fillRect(x-6,  y+14, 18, 6);
    ctx.fillRect(x-10, y+18, 6,  5);
    ctx.fillRect(x+30, y+14, 18, 6);
    ctx.fillRect(x+46, y+18, 6,  5);
  }

  // ── WING CONNECTORS ───────────────────────────────────────────────────────
  ctx.fillStyle = C;
  ctx.fillRect(x+0,  y+20, 12, 3);
  ctx.fillRect(x+32, y+20, 12, 3);

  // ── EYE ───────────────────────────────────────────────────────────────────
  ctx.fillStyle = EC;
  ctx.fillRect(x+32, y+8, 5, 5);
  ctx.fillStyle = "#000"; ctx.fillRect(x+33, y+9, 3, 3);
  if (dead) { ctx.fillStyle = "#777"; ctx.fillRect(x+30,y+9,7,2); ctx.fillRect(x+33,y+7,2,5); }

  // ── FEET ──────────────────────────────────────────────────────────────────
  ctx.fillStyle = C;
  ctx.fillRect(x+14, y+32, 5, 8); ctx.fillRect(x+10, y+40, 8, 3);
  ctx.fillRect(x+24, y+32, 5, 8); ctx.fillRect(x+22, y+40, 8, 3);
}
