"""
fix.py — patches DinoGamePlus.jsx:
  1. Fix timed passives firing every ~0.5s instead of every 30/40s
     (timers were in dt-units; convert to seconds by dividing threshold by 60)
  2. Add canvas visual effects when each passive activates
"""

import re, sys, pathlib

FILE = pathlib.Path(__file__).parent / "src" / "DinoGamePlus.jsx"
src  = FILE.read_text(encoding="utf-8")

# ─── PATCH 1: Fix timer thresholds ───────────────────────────────────────────
# The pattern  `30*FPS60/60`  evaluates to 30 (frames), not 30 seconds.
# We want 30 real seconds worth of dt accumulation.
# At ~60fps, dt≈1 per frame, so 30s = 1800 dt-units → threshold = 30*FPS60
# Replace every  `N*FPS60/60`  with  `N*FPS60`  (drop the /60)

src = re.sub(r'(\d+)\*FPS60/60', lambda m: f'{m.group(1)}*FPS60', src)

# ─── PATCH 2: Add passive visual effects ─────────────────────────────────────
# We inject a helper `drawPassiveEffect` right before the main component,
# then call it from each passive activation site.

EFFECT_FN = r"""
// ─── PASSIVE ACTIVATION EFFECTS ──────────────────────────────────────────────
function drawPassiveEffect(ctx, type, x, y, frame, progress) {
  // progress: 0→1 over the effect lifetime
  const alpha = Math.min(1, (1 - progress) * 2);
  ctx.save();
  ctx.globalAlpha = alpha;

  if (type === "phaseShift") {
    // Rippling ghost rings around dino
    const rings = 3;
    for (let i = 0; i < rings; i++) {
      const r = 28 + i * 18 + progress * 40;
      ctx.strokeStyle = "#66dd22";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + 20, y + 24, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Dashed outline flicker
    ctx.strokeStyle = `rgba(102,221,34,${0.6 - progress * 0.6})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(x - 4, y - 4, 48, 56);
    ctx.setLineDash([]);
  }

  else if (type === "thermalLift") {
    // Upward heat shimmer lines
    for (let i = 0; i < 5; i++) {
      const lx = x + 4 + i * 8;
      const ly = y + 48 - progress * 60;
      ctx.fillStyle = i % 2 === 0 ? "#44aaff" : "#88ddff";
      ctx.fillRect(lx, ly, 2, 8 + i * 2);
      ctx.fillRect(lx - 1, ly - 6, 4, 4);
    }
    // Wing glow
    ctx.fillStyle = "rgba(68,170,255,0.25)";
    ctx.fillRect(x - 20, y + 8, 80, 20);
  }

  else if (type === "pulseWave") {
    // Expanding shockwave rings
    const maxR = 180;
    for (let i = 0; i < 2; i++) {
      const r = progress * maxR + i * 30;
      const a = Math.max(0, 0.7 - r / maxR);
      ctx.strokeStyle = `rgba(255,170,0,${a})`;
      ctx.lineWidth = 3 - i;
      ctx.beginPath();
      ctx.arc(x + 20, y + 24, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Center flash
    if (progress < 0.2) {
      ctx.fillStyle = `rgba(255,200,50,${0.5 - progress * 2.5})`;
      ctx.fillRect(x - 30, y - 20, 100, 80);
    }
  }

  else if (type === "hornBurst") {
    // 8-directional spike lines from dino center
    const cx2 = x + 20, cy2 = y + 24;
    const len = 40 + progress * 120;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const ex = cx2 + Math.cos(angle) * len;
      const ey = cy2 + Math.sin(angle) * len;
      ctx.strokeStyle = `rgba(204,136,0,${0.8 - progress * 0.8})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx2, cy2);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      // Tip pixel
      ctx.fillStyle = "#ffcc44";
      ctx.fillRect(ex - 2, ey - 2, 4, 4);
    }
  }

  else if (type === "headbutt") {
    // Forward charge trail — horizontal streaks ahead of dino
    for (let i = 0; i < 4; i++) {
      const lx = x + 40 + i * 20 + progress * 60;
      ctx.fillStyle = `rgba(255,204,0,${0.6 - i * 0.12})`;
      ctx.fillRect(lx, y + 10 + i * 6, 18 - i * 3, 3);
    }
    // Head impact flash
    if (progress < 0.25) {
      ctx.fillStyle = `rgba(255,220,50,${0.5 - progress * 2})`;
      ctx.fillRect(x + 10, y, 30, 30);
    }
  }

  else if (type === "speedRush") {
    // Speed lines behind dino
    for (let i = 0; i < 5; i++) {
      const lx = x - 20 - i * 14 - progress * 30;
      const ly = y + 14 + i * 6;
      ctx.fillStyle = `rgba(0,204,102,${0.5 - i * 0.08})`;
      ctx.fillRect(lx, ly, 12 + i * 4, 2);
    }
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}
"""

# Insert the effect function just before "// ─── MAIN COMPONENT"
ANCHOR = "// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────"
if ANCHOR not in src:
    print("ERROR: anchor not found — check file hasn't changed"); sys.exit(1)
src = src.replace(ANCHOR, EFFECT_FN + "\n" + ANCHOR)

# ─── PATCH 3: Track active passive effects in gsRef.current ──────────────────
# Add `passiveEffects: []` to the startGame gsRef initializer
OLD_EFFECTS = "      floatingTexts:[],"
NEW_EFFECTS = "      floatingTexts:[],\n      passiveEffects:[],"
src = src.replace(OLD_EFFECTS, NEW_EFFECTS, 1)

# ─── PATCH 4: Helper to spawn a passive effect ───────────────────────────────
# Inject `addPassiveEffect` helper right after `addFloat` definition inside the loop
OLD_ADD_FLOAT = "    const addFloat=(gs,text,x,y,color=\"#ffdd44\")=>{\n      gs.floatingTexts.push({text,x,y,vy:-1.4,life:65,maxLife:65,color});\n    };"
NEW_ADD_FLOAT = (
    OLD_ADD_FLOAT + "\n\n"
    "    const addPassiveEffect=(gs,type,x,y)=>{\n"
    "      gs.passiveEffects.push({type,x,y,life:0,maxLife:45});\n"
    "    };"
)
src = src.replace(OLD_ADD_FLOAT, NEW_ADD_FLOAT, 1)

# ─── PATCH 5: Trigger effects on each passive activation ─────────────────────

# 5a. Raptor speed rush milestone
OLD_RAPTOR = (
    '            if(milestone>gs.raptorSpeedBonus){\n'
    '              gs.raptorSpeedBonus=milestone;\n'
    '              const pct=(milestone*0.5).toFixed(1);\n'
    '              addFloat(gs,`SPEED RUSH! +${pct}% bones`,80,80,"#00cc66");\n'
    '            }'
)
NEW_RAPTOR = (
    '            if(milestone>gs.raptorSpeedBonus){\n'
    '              gs.raptorSpeedBonus=milestone;\n'
    '              const pct=(milestone*0.5).toFixed(1);\n'
    '              addFloat(gs,`SPEED RUSH! +${pct}% bones`,80,80,"#00cc66");\n'
    '              addPassiveEffect(gs,"speedRush",gs.dino.x,gs.dino.y);\n'
    '            }'
)
src = src.replace(OLD_RAPTOR, NEW_RAPTOR, 1)

# 5b. Pterodac thermal lift
OLD_PTERO = (
    '            gs.pterodacFlyTimer=5*FPS60; // 5s in dt units (~300 frames)\n'
    '            gs.pterodacFlyCooldown=30*FPS60;\n'
    '            addFloat(gs,"FLY MODE!",gs.dino.x-10,gs.dino.y-28,"#44aaff");'
)
NEW_PTERO = (
    '            gs.pterodacFlyTimer=5*FPS60; // 5s in dt units (~300 frames)\n'
    '            gs.pterodacFlyCooldown=30*FPS60;\n'
    '            addFloat(gs,"FLY MODE!",gs.dino.x-10,gs.dino.y-28,"#44aaff");\n'
    '            addPassiveEffect(gs,"thermalLift",gs.dino.x,gs.dino.y);'
)
src = src.replace(OLD_PTERO, NEW_PTERO, 1)

# 5c. Anky pulse wave
OLD_ANKY = (
    '            if(cleared>0) addFloat(gs,`PULSE WAVE! x${cleared}`,gs.dino.x-20,gs.dino.y-36,"#ffaa00");\n'
    '            else addFloat(gs,"PULSE WAVE!",gs.dino.x-20,gs.dino.y-36,"#ffaa00");'
)
NEW_ANKY = (
    '            if(cleared>0) addFloat(gs,`PULSE WAVE! x${cleared}`,gs.dino.x-20,gs.dino.y-36,"#ffaa00");\n'
    '            else addFloat(gs,"PULSE WAVE!",gs.dino.x-20,gs.dino.y-36,"#ffaa00");\n'
    '            addPassiveEffect(gs,"pulseWave",gs.dino.x,gs.dino.y);'
)
src = src.replace(OLD_ANKY, NEW_ANKY, 1)

# 5d. Tri horn burst
OLD_TRI = (
    '            if(cleared>0) addFloat(gs,`HORN BURST! x${cleared}`,gs.dino.x-20,gs.dino.y-36,"#cc8800");\n'
    '            else addFloat(gs,"HORN BURST!",gs.dino.x-20,gs.dino.y-36,"#cc8800");'
)
NEW_TRI = (
    '            if(cleared>0) addFloat(gs,`HORN BURST! x${cleared}`,gs.dino.x-20,gs.dino.y-36,"#cc8800");\n'
    '            else addFloat(gs,"HORN BURST!",gs.dino.x-20,gs.dino.y-36,"#cc8800");\n'
    '            addPassiveEffect(gs,"hornBurst",gs.dino.x,gs.dino.y);'
)
src = src.replace(OLD_TRI, NEW_TRI, 1)

# 5e. Pachy headbutt
OLD_PACHY = '              addFloat(gs,"HEADBUTT!",gs.dino.x-10,gs.dino.y-28,"#ffcc00");'
NEW_PACHY = (
    '              addFloat(gs,"HEADBUTT!",gs.dino.x-10,gs.dino.y-28,"#ffcc00");\n'
    '              addPassiveEffect(gs,"headbutt",gs.dino.x,gs.dino.y);'
)
src = src.replace(OLD_PACHY, NEW_PACHY, 1)

# 5f. Dilopho phase shift
OLD_DILOPHO = '              addFloat(gs,"PHASE SHIFT!",gs.dino.x-10,gs.dino.y-28,"#66dd22");'
NEW_DILOPHO = (
    '              addFloat(gs,"PHASE SHIFT!",gs.dino.x-10,gs.dino.y-28,"#66dd22");\n'
    '              addPassiveEffect(gs,"phaseShift",gs.dino.x,gs.dino.y);'
)
src = src.replace(OLD_DILOPHO, NEW_DILOPHO, 1)

# ─── PATCH 6: Tick and render passive effects ─────────────────────────────────
# Tick: advance life counter (add after floatingTexts filter)
OLD_FLOAT_TICK = "        gs.floatingTexts=gs.floatingTexts.filter(t=>{t.y+=t.vy*dt;t.life-=dt;return t.life>0;});"
NEW_FLOAT_TICK = (
    OLD_FLOAT_TICK + "\n"
    "        gs.passiveEffects=gs.passiveEffects.filter(e=>{e.life+=dt;return e.life<e.maxLife;});"
)
src = src.replace(OLD_FLOAT_TICK, NEW_FLOAT_TICK, 1)

# Render: draw effects just before the dino draw call
OLD_DINO_DRAW = "      // Draw dino  Epass onGround so legs freeze mid-air\n      drawDino("
NEW_DINO_DRAW = (
    "      // Passive effects\n"
    "      for(const e of gs.passiveEffects){\n"
    "        drawPassiveEffect(ctx,e.type,e.x,e.y,gs.frame,e.life/e.maxLife);\n"
    "      }\n\n"
    "      // Draw dino  Epass onGround so legs freeze mid-air\n"
    "      drawDino("
)
src = src.replace(OLD_DINO_DRAW, NEW_DINO_DRAW, 1)

# ─── WRITE ────────────────────────────────────────────────────────────────────
FILE.write_text(src, encoding="utf-8")
print("OK Patched successfully:", FILE)
