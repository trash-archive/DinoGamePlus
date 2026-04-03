"""
extract_boss_render.py
Extracts the renderBoss function and CrackOverlay rects from BossFightScreen.jsx
and writes them into src/boss/bossRender.js
"""
import re

SRC  = r"c:\Users\user\Desktop\FUN IDEAS\dino-game-plus\src\BossFightScreen.jsx"
DEST = r"c:\Users\user\Desktop\FUN IDEAS\dino-game-plus\src\boss\bossRender.js"

with open(SRC, "r", encoding="utf-8") as f:
    content = f.read()

# ── Extract all <rect .../> lines from CrackOverlay ──
rect_lines = re.findall(r'      <rect key="[^"]*"[^\n]+/>', content)
print(f"Found {len(rect_lines)} crack rect lines")

crack_jsx = "\n".join(rect_lines)

render_js = f"""// \u2500\u2500\u2500 BOSS RENDER \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
import {{ CANVAS_W, CANVAS_H, GROUND_Y }} from "../constants";
import {{ drawDino }}                      from "../rendering/drawDino";
import {{ drawBoss, drawGround }}          from "../rendering/drawWorld";
import {{ drawBossAttacks, drawBossTelegraph }} from "../rendering/drawBossAttacks";
import {{ BOSS_MAX_HP, BOSS_X, BOSS_Y, ABYSS_SCENERY }} from "./bossConstants";

// \u2500\u2500\u2500 CRACK OVERLAY \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
export function CrackOverlay() {{
  return (
    <svg viewBox="0 0 720 270" preserveAspectRatio="none"
      style={{{{ position:"absolute", inset:"-6%", width:"112%", height:"112%",
               pointerEvents:"none", zIndex:10, overflow:"visible", imageRendering:"pixelated" }}}}>
{crack_jsx}
    </svg>
  );
}}

// \u2500\u2500\u2500 RENDER BOSS FRAME \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
export function renderBoss(ctx, gs) {{
  const f = gs.frame;

  ctx.save();
  ctx.translate(Math.round(gs.shake.x), Math.round(gs.shake.y));

  // Background
  ctx.fillStyle = "#0d0018";
  ctx.fillRect(-20, -20, CANVAS_W+40, CANVAS_H+40);

  // Tendrils
  const tendrilCount = 6 + gs.bossPhase * 4;
  for(let i = 0; i < tendrilCount; i++) {{
    const angle = (i / tendrilCount) * Math.PI * 2 + f * 0.004;
    const len   = 70 + gs.bossPhase * 35 + Math.sin(f * 0.02 + i) * 20;
    ctx.globalAlpha = 0.10 + gs.bossPhase * 0.04;
    ctx.fillStyle = "#6600cc";
    for(let s = 0; s < 5; s++) {{
      const r  = (s / 5) * len;
      const px = Math.round(BOSS_X + Math.cos(angle + s * 0.15) * r);
      const py = Math.round(BOSS_Y + Math.sin(angle + s * 0.15) * r);
      ctx.fillRect(px-2, py-2, 5-s, 5-s);
    }}
  }}
  ctx.globalAlpha = 1;

  // Void particles
  const particleSeed = Math.floor(f * 0.3);
  for(let i = 0; i < 12; i++) {{
    const px = ((i*137 + particleSeed*7) % CANVAS_W);
    const py = ((i*89  + particleSeed*3) % (GROUND_Y - 20));
    ctx.globalAlpha = 0.15 + (i%3)*0.08;
    ctx.fillStyle = i%2===0 ? "#8833cc" : "#cc44ff";
    ctx.fillRect(px, py, 2, 2);
  }}
  ctx.globalAlpha = 1;

  // Vignette
  ctx.fillStyle = `rgba(60,0,100,${{(0.10 + gs.bossPhase*0.05) + Math.sin(f*0.025)*0.04}})`;
  ctx.fillRect(-20, -20, CANVAS_W+40, CANVAS_H+40);

  // Phase 2 scanlines
  if(gs.bossPhase >= 2) {{
    ctx.fillStyle = `rgba(120,0,60,${{Math.sin(f*0.15)*0.04+0.04}})`;
    for(let y = 0; y < CANVAS_H; y += 4) ctx.fillRect(-20, y, CANVAS_W+40, 2);
  }}

  // Phase flash
  if(gs.phaseFlash > 0) {{
    ctx.fillStyle = `rgba(180,50,255,${{(gs.phaseFlash/25)*0.65}})`;
    ctx.fillRect(-20, -20, CANVAS_W+40, CANVAS_H+40);
  }}

  drawGround(ctx, gs.groundOffset, ABYSS_SCENERY, 1);

  const hpFrac = gs.bossHp / BOSS_MAX_HP;
  drawBoss(ctx, BOSS_X, BOSS_Y, f, gs.bossPhase, hpFrac, gs.blindWindow, gs.hitFlash);
  if(gs.hitFlash > 0) gs.hitFlash--;

  // Telegraph
  if(!gs.blindWindow && gs.barrage.length > 0 && gs.attackIndex < gs.barrage.length) {{
    const atk = gs.barrage[gs.attackIndex];
    if(gs.attackTimer < atk.warmup)
      drawBossTelegraph(ctx, atk, gs.attackTimer, atk.warmup, BOSS_X, BOSS_Y, gs.dino.x+20, gs.dino.y+24, f);
  }}

  drawBossAttacks(ctx, gs.projectiles, f);

  // Particles
  for(const p of gs.particles) {{
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    if(p.ring) {{
      ctx.strokeStyle = p.col; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.stroke();
    }} else {{
      ctx.fillStyle = p.col;
      ctx.fillRect(Math.round(p.x-p.size/2), Math.round(p.y-p.size/2), p.size, p.size);
    }}
  }}
  ctx.globalAlpha = 1;

  drawDino(ctx, gs.dino.x, gs.dino.y, f, false,
    gs.skin, gs.design, false, gs.dino.ducking, false, false,
    gs.dino.invTimer, gs.dino.onGround, null);

  // Floating texts
  for(const t of gs.floatingTexts) {{
    ctx.globalAlpha = Math.min(1, t.life/t.maxLife*2);
    ctx.fillStyle = t.color; ctx.font = "bold 11px 'Courier New'";
    ctx.fillText(t.text, t.x, t.y); ctx.globalAlpha = 1;
  }}

  ctx.restore(); // end shake

  // HUD — lives
  const heartSize = 14, heartGap = 4;
  const totalW = gs.lives*(heartSize+heartGap)-heartGap;
  const startX = CANVAS_W-totalW-8, heartY = CANVAS_H-heartSize-8;
  for(let i = 0; i < gs.lives; i++) {{
    const hx = startX+i*(heartSize+heartGap), hy = heartY;
    ctx.fillStyle = "#ff2244";
    ctx.fillRect(hx+1,hy,6,4); ctx.fillRect(hx+7,hy,6,4);
    ctx.fillRect(hx,hy+3,14,5); ctx.fillRect(hx+1,hy+8,12,3);
    ctx.fillRect(hx+3,hy+11,8,2); ctx.fillRect(hx+5,hy+13,4,1);
  }}

  // HUD — bite bar
  if(gs.stats.hasBite) {{
    const biteReady = gs.biteCooldown <= 0;
    ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fillRect(8, CANVAS_H-28, 60, 6);
    ctx.fillStyle = biteReady ? "#ffdd00" : "#884400";
    ctx.fillRect(8, CANVAS_H-28, Math.floor(60*(biteReady?1:1-gs.biteCooldown/45)), 6);
    ctx.fillStyle = biteReady ? "#ffdd00" : "#666";
    ctx.font = "bold 9px 'Courier New'";
    ctx.fillText(biteReady ? "[F] BITE READY" : "[F] BITE...", 8, CANVAS_H-14);
  }}

  // HUD — dodge hint
  if(!gs.blindWindow && gs.barrage.length > 0 && gs.attackIndex < gs.barrage.length) {{
    const atk = gs.barrage[gs.attackIndex];
    if(gs.attackTimer < atk.warmup) {{
      ctx.globalAlpha = 0.5 + Math.sin(f*0.35)*0.5;
      ctx.fillStyle = "#ff4400"; ctx.font = "bold 11px 'Courier New'";
      ctx.textAlign = "center"; ctx.fillText(atk.dodge, CANVAS_W/2, CANVAS_H-10);
      ctx.textAlign = "left"; ctx.globalAlpha = 1;
    }}
  }}

  // HUD — blind window
  if(gs.blindWindow) {{
    ctx.fillStyle = `rgba(255,220,0,${{0.7+Math.sin(f*0.3)*0.3}})`;
    ctx.font = "bold 13px 'Courier New'"; ctx.textAlign = "center";
    ctx.fillText("BLIND SPOT! PRESS [F] TO BITE!", CANVAS_W/2, 40);
    ctx.textAlign = "left";
  }}

  // HUD — phase label
  ctx.fillStyle = "rgba(255,50,0,0.5)"; ctx.font = "9px 'Courier New'";
  ctx.fillText(`PHASE ${{gs.bossPhase+1}}  |  HP ${{gs.bossHp}}/${{BOSS_MAX_HP}}`, 8, 20);
}}
"""

with open(DEST, "w", encoding="utf-8") as f:
    f.write(render_js)

print(f"Written {DEST}")
print(f"  {len(rect_lines)} crack rects included")
