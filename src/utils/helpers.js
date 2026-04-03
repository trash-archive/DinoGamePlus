// ─── MATH HELPERS ─────────────────────────────────────────────────────────────
export function lerp(a, b, t) { return a + (b - a) * t; }
export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
export function hexToRgb(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}
export function mixHex(a, b, t) {
  const [ar,ag,ab] = hexToRgb(a), [br,bg,bb] = hexToRgb(b);
  return `rgb(${Math.round(lerp(ar,br,t))},${Math.round(lerp(ag,bg,t))},${Math.round(lerp(ab,bb,t))})`;
}

// ─── CANVAS HELPERS ───────────────────────────────────────────────────────────
export function px(ctx, text, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px "Courier New", monospace`;
  ctx.fillText(text, x, y);
}

export function drawFossilDiamond(ctx, cx, cy, size, color) {
  const h = size / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.06);
  ctx.beginPath();
  ctx.moveTo(cx, cy - h); ctx.lineTo(cx + h, cy);
  ctx.lineTo(cx, cy + h); ctx.lineTo(cx - h, cy);
  ctx.closePath(); ctx.stroke();
  const ih = h * 0.48;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ih); ctx.lineTo(cx + ih, cy);
  ctx.lineTo(cx, cy + ih); ctx.lineTo(cx - ih, cy);
  ctx.closePath(); ctx.fill();
}

export function drawBoneCoin(ctx, x, y, size = 10) {
  drawFossilDiamond(ctx, x + size / 2, y + size / 2, size, "#888888");
}
