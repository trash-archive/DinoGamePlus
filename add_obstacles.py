import re

# ─── 1. caveObstacles.js ──────────────────────────────────────────────────────
cave_path = r'c:\Users\user\Desktop\FUN IDEAS\dino-game-plus\src\maps\cave\caveObstacles.js'
with open(cave_path, 'r', encoding='utf-8') as f:
    cave = f.read()

# Draw code — insert before the generic fallback else block
draw_insert = r"""
  } else if (o.otype === "crystalWall") {
    // Left-edge crystal wall — pushes dino forward on contact
    const wx = o.x;
    // Dark backing
    ctx.fillStyle = dark2;
    ctx.fillRect(wx,    0,    18, GROUND_Y);
    // Main wall body
    ctx.fillStyle = glow2;
    ctx.fillRect(wx+2,  0,    14, GROUND_Y);
    // Left shadow face
    ctx.fillStyle = dark1;
    ctx.fillRect(wx+2,  0,    4,  GROUND_Y);
    // Vein stripes
    ctx.fillStyle = glow3;
    for(let vy=0; vy<GROUND_Y; vy+=40){
      ctx.fillRect(wx+8, vy+4, 3, 28);
    }
    // Right highlight edge
    ctx.fillStyle = glow1;
    ctx.fillRect(wx+14, 0,    3,  GROUND_Y);
    // Crystal teeth on right edge — point toward dino
    for(let ty=10; ty<GROUND_Y-10; ty+=22){
      ctx.fillStyle = glow1;
      ctx.fillRect(wx+16, ty,    8, 4);
      ctx.fillRect(wx+20, ty+1,  5, 2);
      ctx.fillRect(wx+23, ty+1,  3, 2);
      ctx.fillStyle = glow2;
      ctx.fillRect(wx+17, ty+1,  4, 2);
    }
    // Pulse glow on right face
    if(pulse===0){
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(wx+15, 20,  2, 2);
      ctx.fillRect(wx+15, 80,  2, 2);
      ctx.fillRect(wx+15, 140, 2, 2);
    }

  } else if (o.otype === "prismBeam") {
    // Bouncing light beam — crystal emitter on right wall, beam bounces top/bottom
    const bx = o.x;
    const by = o._beamY ?? 20;
    const bdir = o._beamDir ?? 1;
    // Emitter housing on right side
    ctx.fillStyle = dark2;
    ctx.fillRect(bx+2,  by-8,  20, 20);
    ctx.fillStyle = glow2;
    ctx.fillRect(bx+4,  by-6,  16, 16);
    ctx.fillStyle = glow3;
    ctx.fillRect(bx+8,  by-2,  8,  8);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bx+10, by,    4,  4);
    // Emitter crystal spikes
    ctx.fillStyle = glow1;
    ctx.fillRect(bx+4,  by-10, 4,  4);
    ctx.fillRect(bx+16, by-10, 4,  4);
    ctx.fillRect(bx+4,  by+10, 4,  4);
    ctx.fillRect(bx+16, by+10, 4,  4);
    // The beam itself — horizontal ray shooting left from emitter
    const beamLen = bx + 4;  // beam goes from x=0 to emitter
    ctx.save();
    ctx.globalAlpha = 0.85;
    // Outer glow
    ctx.fillStyle = glow2;
    ctx.fillRect(0, by-3, beamLen, 10);
    // Mid beam
    ctx.globalAlpha = 1;
    ctx.fillStyle = glow1;
    ctx.fillRect(0, by-1, beamLen, 6);
    // Core
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, by+1,  beamLen, 2);
    ctx.restore();
    // Bounce flash at top/bottom wall
    if(by <= 8 || by >= GROUND_Y - 30){
      ctx.save();
      ctx.globalAlpha = pulse===0 ? 0.7 : 0.4;
      ctx.fillStyle = glow1;
      ctx.fillRect(0, by <= 8 ? 0 : GROUND_Y-20, 60, 20);
      ctx.restore();
    }

"""

cave = cave.replace(
    '  } else {\n    // Generic fallback',
    draw_insert + '  } else {\n    // Generic fallback'
)

# Spawn — add to all three tiers
# Tier 0: no change (too early)
# Tier 1-2: add crystalWall and prismBeam at end
cave = cave.replace(
    "    else               { otype=\"crystalGas\"; }\n    return { otype, type, oy, bullets };\n  }\n\n  if (tier <= 5) {",
    "    else if (r < 0.95) { otype=\"crystalGas\"; }\n    else if (r < 0.97) { otype=\"crystalWall\"; }\n    else               { otype=\"prismBeam\"; }\n    return { otype, type, oy, bullets };\n  }\n\n  if (tier <= 5) {"
)

# Tier 3-5
cave = cave.replace(
    "    else if (r < 0.95) { otype=\"crystalGas\"; }\n    else               { otype=\"voidPortal\"; }\n    return { otype, type, oy, bullets };\n  }\n\n  // Tier 6+",
    "    else if (r < 0.91) { otype=\"crystalGas\"; }\n    else if (r < 0.94) { otype=\"crystalWall\"; }\n    else if (r < 0.97) { otype=\"prismBeam\"; }\n    else               { otype=\"voidPortal\"; }\n    return { otype, type, oy, bullets };\n  }\n\n  // Tier 6+"
)

# Tier 6+
cave = cave.replace(
    "  else if (r < 0.91) { otype=\"voidPortal\"; }\n  else               { otype=\"crystalSpire\"; type=2; }",
    "  else if (r < 0.87) { otype=\"voidPortal\"; }\n  else if (r < 0.93) { otype=\"crystalWall\"; }\n  else if (r < 0.97) { otype=\"prismBeam\"; }\n  else               { otype=\"crystalSpire\"; type=2; }"
)

# Add GROUND_Y import usage — it's already imported, but the draw function needs CANVAS_H
# The draw function uses GROUND_Y already; CANVAS_H is needed for prismBeam bounce
# Add CANVAS_H to the import
cave = cave.replace(
    'import { GROUND_Y } from "../../maps/mapConstants";',
    'import { GROUND_Y, CANVAS_H } from "../../maps/mapConstants";'
)

with open(cave_path, 'w', encoding='utf-8') as f:
    f.write(cave)
print("caveObstacles.js updated")

# ─── 2. mapConstants.js — ensure CANVAS_H is exported ────────────────────────
import os
constants_path = r'c:\Users\user\Desktop\FUN IDEAS\dino-game-plus\src\maps\mapConstants.js'
if os.path.exists(constants_path):
    with open(constants_path, 'r', encoding='utf-8') as f:
        mc = f.read()
    if 'CANVAS_H' not in mc:
        mc = mc.rstrip() + '\nexport const CANVAS_H = 270;\n'
        with open(constants_path, 'w', encoding='utf-8') as f:
            f.write(mc)
        print("mapConstants.js: added CANVAS_H")
    else:
        print("mapConstants.js: CANVAS_H already present")
else:
    print(f"WARNING: {constants_path} not found — skipping")

# ─── 3. collision.js — add hitboxes ──────────────────────────────────────────
coll_path = r'c:\Users\user\Desktop\FUN IDEAS\dino-game-plus\src\utils\collision.js'
with open(coll_path, 'r', encoding='utf-8') as f:
    coll = f.read()

coll = coll.replace(
    "  if(o.otype===\"runeCircle\")    return{x:o.x+4,  y:g-4,                w:32, h:4};",
    "  if(o.otype===\"runeCircle\")    return{x:o.x+4,  y:g-4,                w:32, h:4};\n"
    "  if(o.otype===\"crystalWall\")   return{x:o.x+14, y:0,                  w:14, h:g};  // teeth side only\n"
    "  if(o.otype===\"prismBeam\")     return{x:0,       y:(o._beamY??20)-1,   w:o.x+4, h:8};"
)

with open(coll_path, 'w', encoding='utf-8') as f:
    f.write(coll)
print("collision.js updated")

# ─── 4. DinoGamePlus.jsx — game logic ────────────────────────────────────────
game_path = r'c:\Users\user\Desktop\FUN IDEAS\dino-game-plus\src\DinoGamePlus.jsx'
with open(game_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line: "          // CrystalGas: slow drift, inverts dino controls on overlap"
# and insert crystalWall + prismBeam logic just before it
insert_before = '          // CrystalGas: slow drift, inverts dino controls on overlap\n'
insert_idx = None
for i, line in enumerate(lines):
    if line == insert_before:
        insert_idx = i
        break

if insert_idx is None:
    print("ERROR: insertion point not found in DinoGamePlus.jsx")
else:
    new_logic = [
        '          // CrystalWall: stationary at left edge, pushes dino forward on contact\n',
        '          if(o.otype===\"crystalWall\"){\n',
        '            // Does not scroll — stays pinned at x=0\n',
        '            o.x = 0;\n',
        '            if(!hasGhost&&!hasGiant&&gs.dino.invTimer<=0){\n',
        '              const hb=getObstacleHitbox(o);\n',
        '              if(rectsOverlap(gs.dino.x,gs.dino.y,DINO_W,DINO_H,hb.x,hb.y,hb.w,hb.h)){\n',
        '                // Push dino forward\n',
        '                const pushForce = 5 + tier * 0.3;\n',
        '                gs.dino.x = Math.min(CANVAS_W - 60, gs.dino.x + pushForce * dt);\n',
        '                gs.dino.vy = Math.min(gs.dino.vy, -3); // small upward kick\n',
        '                gs.dino.invTimer = 20 + gs.stats.invFramesBonus;\n',
        '                gs.hitTaken = true;\n',
        '                if(gs.activePowerups.shield_pw){\n',
        '                  gs.shieldHitsLeft--; if(gs.shieldHitsLeft<=0) delete gs.activePowerups.shield_pw;\n',
        '                } else if((gs.stats.shieldChance)<=Math.random()&&gs.lives>1){\n',
        '                  gs.lives--; playDie(); addFloat(gs,"-1 LIFE",gs.dino.x,gs.dino.y-24,"#ee3344");\n',
        '                } else if(gs.lives<=1&&(gs.stats.shieldChance)<=Math.random()){\n',
        '                  gs.lives=0; endGame(gs); return;\n',
        '                }\n',
        '              }\n',
        '            }\n',
        '          }\n',
        '          // PrismBeam: bouncing horizontal light beam from right side\n',
        '          if(o.otype===\"prismBeam\"){\n',
        '            if(o._beamY===undefined){ o._beamY=20; o._beamDir=1; }\n',
        '            const beamSpd = (3 + tier * 0.25) * Math.max(1, effSpeed/gs.baseSpeed);\n',
        '            o._beamY += o._beamDir * beamSpd * dt;\n',
        '            if(o._beamY >= GROUND_Y - 28){ o._beamY = GROUND_Y - 28; o._beamDir = -1; }\n',
        '            if(o._beamY <= 6)            { o._beamY = 6;             o._beamDir =  1; }\n',
        '            // Beam hitbox collision handled via getObstacleHitbox\n',
        '          }\n',
    ]
    lines = lines[:insert_idx] + new_logic + lines[insert_idx:]
    print(f"DinoGamePlus.jsx: inserted {len(new_logic)} lines at line {insert_idx+1}")

# Also add crystalWall and prismBeam to the special-spawn block so crystalWall spawns at x=0
# Find the obstacle push line: gs.obstacles.push({x:CANVAS_W+10,...
# We need to override x for crystalWall to 0 and prismBeam to CANVAS_W-26
# The existing spawn already has a ruinsLaser override pattern — add similar
push_line = '            ...(otype===\"ruinsLaser\" ? {x: 80+Math.floor(Math.random()*(CANVAS_W-160))} : {}),\n'
new_push_line = (
    '            ...(otype===\"ruinsLaser\" ? {x: 80+Math.floor(Math.random()*(CANVAS_W-160))} : {}),\n'
    '            ...(otype===\"crystalWall\" ? {x: 0} : {}),\n'
    '            ...(otype===\"prismBeam\"   ? {x: CANVAS_W-26} : {}),\n'
)
replaced = False
for i, line in enumerate(lines):
    if line == push_line:
        lines[i] = new_push_line
        replaced = True
        print(f"DinoGamePlus.jsx: spawn overrides added at line {i+1}")
        break
if not replaced:
    print("WARNING: spawn override line not found")

# crystalWall should NOT be scrolled by the normal o.x -= effSpeed*dt line
# The scroll exclusion list: "dust_devil","blizzardWall","ashCloud","cursedWall","ruinsLaser"
scroll_excl = 'if(o.otype!==\"dust_devil\"&&o.otype!==\"blizzardWall\"&&o.otype!==\"ashCloud\"&&o.otype!==\"cursedWall\"&&o.otype!==\"ruinsLaser\") o.x-=effSpeed*dt;\n'
new_scroll_excl = 'if(o.otype!==\"dust_devil\"&&o.otype!==\"blizzardWall\"&&o.otype!==\"ashCloud\"&&o.otype!==\"cursedWall\"&&o.otype!==\"ruinsLaser\"&&o.otype!==\"crystalWall\"&&o.otype!==\"prismBeam\") o.x-=effSpeed*dt;\n'
replaced2 = False
for i, line in enumerate(lines):
    if 'dust_devil' in line and 'blizzardWall' in line and 'o.x-=effSpeed*dt' in line:
        lines[i] = new_scroll_excl
        replaced2 = True
        print(f"DinoGamePlus.jsx: scroll exclusion updated at line {i+1}")
        break
if not replaced2:
    print("WARNING: scroll exclusion line not found")

# crystalWall cull: keep it alive as long as it's on screen (x=0 always)
# prismBeam: cull when x < -100 (scrolled off) — but prismBeam doesn't scroll
# Add prismBeam to the cull exclusion so it stays until manually removed
# The cull line: return o.x>-100 && o._exploding!==2 && o._laserState!==2;
cull_line = '          return o.x>-100 && o._exploding!==2 && o._laserState!==2;\n'
new_cull_line = '          // crystalWall and prismBeam are stationary — cull after a fixed lifetime\n          if(o.otype===\"crystalWall\"||o.otype===\"prismBeam\"){\n            o._lifetime=(o._lifetime||0)+dt;\n            return o._lifetime < 420; // ~7s at 60fps\n          }\n          return o.x>-100 && o._exploding!==2 && o._laserState!==2;\n'
replaced3 = False
for i, line in enumerate(lines):
    if line == cull_line:
        lines[i] = new_cull_line
        replaced3 = True
        print(f"DinoGamePlus.jsx: cull logic updated at line {i+1}")
        break
if not replaced3:
    print("WARNING: cull line not found")

# crystalWall body collision: add to the skip list (it handles its own push above)
# The body collision skip list includes blizzardWall, ashCloud, cursedWall, sandTrap, ruinsLaser, runeCircle
body_skip = '            if(o.otype===\"blizzardWall\"||o.otype===\"ashCloud\"||o.otype===\"cursedWall\"||o.otype===\"sandTrap\"||o.otype===\"ruinsLaser\"||o.otype===\"runeCircle\") continue;\n'
new_body_skip = '            if(o.otype===\"blizzardWall\"||o.otype===\"ashCloud\"||o.otype===\"cursedWall\"||o.otype===\"sandTrap\"||o.otype===\"ruinsLaser\"||o.otype===\"runeCircle\"||o.otype===\"crystalWall\"||o.otype===\"crystalGas\") continue;\n'
replaced4 = False
for i, line in enumerate(lines):
    if line == body_skip:
        lines[i] = new_body_skip
        replaced4 = True
        print(f"DinoGamePlus.jsx: body skip list updated at line {i+1}")
        break
if not replaced4:
    print("WARNING: body skip line not found")

# prismBeam bullet collision: add prismBeam to the shooter list so its beam hitbox deals damage
# The shooter check list: "turret","yeti","walrus",...,"geodeSpitter","runeCircle"
shooter_check = '            if((o.otype!==\"turret\"&&o.otype!==\"yeti\"&&o.otype!==\"walrus\"&&o.otype!==\"snowGolem\"&&o.otype!==\"lavaburst\"&&o.otype!==\"demon\"&&o.otype!==\"gorilla\"&&o.otype!==\"jungleSerpent\"&&o.otype!==\"statue\"&&o.otype!==\"golem\"&&o.otype!==\"crystalGolem\"&&o.otype!==\"crystalMine\"&&o.otype!==\"mummy\"&&o.otype!==\"obelisk\"&&o.otype!==\"magmaGolem\"&&o.otype!==\"ankh\"&&o.otype!==\"geodeSpitter\"&&o.otype!==\"runeCircle\")||!o.bullets) continue;\n'
# prismBeam uses hitbox collision not bullets, so we handle it via body collision
# Instead, add prismBeam to the body collision path (remove from skip) — already done above
# Just confirm it's not in the shooter list (it has no bullets array)

with open(game_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("DinoGamePlus.jsx updated")
print("\nAll done.")
