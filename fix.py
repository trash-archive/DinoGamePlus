import re

# ─── collectionData.jsx: update DINO_PASSIVES descriptions ───────────────────
with open("src/data/collectionData.jsx", "r", encoding="utf-8") as f:
    col = f.read()

old_passives = """export const DINO_PASSIVES = {
  raptor:    { label:\"Speed Rush\",      desc:\"Every 400m grants +3% bone income this run. Builds slowly over distance.\" },
  trex:      { label:\"Apex Predator\",   desc:\"Obstacles destroyed while giant give +5 bones instead of 4.\" },
  stego:     { label:\"Plate Armor\",     desc:\"Shield proc chance increased by 50%. The back plates absorb punishment.\" },
  pterodac:  { label:\"Thermal Lift\",    desc:\"Airborne bone pickups give 1.5x value. Soar high for greater rewards.\" },
  anky:      { label:\"Club Sweep\",      desc:\"Near misses destroy the obstacle. No bonus bones — just survival.\" },
  tri:       { label:\"Horn Charge\",     desc:\"First obstacle each run is automatically destroyed. Charge through!\" },
  brachio:   { label:\"Long Reach\",      desc:\"Bone magnet range +60px. The long neck scoops up nearby bones.\" },
  spino:     { label:\"Sail Power\",      desc:\"+15% bones earned during night only. The sail thrives in moonlight.\" },
  pachy:     { label:\"Headbutt\",        desc:\"Dying grants 1 free auto-revive per run (once). Short invincibility.\" },
  para:      { label:\"Resonance\",       desc:\"Combo timer lasts 25% longer. The crest sustains your momentum.\" },
  dilopho:   { label:\"Venom Spit\",      desc:\"8% chance each obstacle is dissolved before contact. Toxic aura!\" },
};"""

new_passives = """export const DINO_PASSIVES = {
  raptor:    { label:\"Speed Rush\",      desc:\"Every 500m grants +0.5% bone income (max 10%). Builds over distance.\" },
  trex:      { label:\"Apex Predator\",   desc:\"Starts every run with 2 hearts. Raw power from the start.\" },
  stego:     { label:\"Plate Armor\",     desc:\"Shield proc chance increased by 50%. The back plates absorb punishment.\" },
  pterodac:  { label:\"Thermal Lift\",    desc:\"Activates fly mode for 5s every 30s — airborne pickups worth 1.5x.\" },
  anky:      { label:\"Pulse Wave\",      desc:\"Every 40s emits a shockwave that destroys all surrounding obstacles.\" },
  tri:       { label:\"Horn Burst\",      desc:\"Every 30s fires horns in all directions, destroying obstacles & projectiles.\" },
  brachio:   { label:\"Long Reach\",      desc:\"Permanent +60px bone collection range. The long neck scoops up nearby bones.\" },
  spino:     { label:\"Sail Power\",      desc:\"+30% bones earned during night only. The sail thrives in moonlight.\" },
  pachy:     { label:\"Headbutt\",        desc:\"Every 30s headbutts forward for 5s, destroying front obstacles & projectiles.\" },
  para:      { label:\"Resonance\",       desc:\"Combo timer lasts 25% longer, capped at 20 combo. The crest sustains momentum.\" },
  dilopho:   { label:\"Phase Shift\",     desc:\"Every 30s phases through everything for 5s. Untouchable!\" },
};"""

col = col.replace(old_passives, new_passives)
with open("src/data/collectionData.jsx", "w", encoding="utf-8") as f:
    f.write(col)
print("collectionData.jsx updated")

# ─── DinoGamePlus.jsx patches ────────────────────────────────────────────────
with open("src/DinoGamePlus.jsx", "r", encoding="utf-8") as f:
    src = f.read()

# 1. startGame: trex starts with 2 hearts, init passive timers
old_init = """      // Per-run passive state
      raptorSpeedBonus:0,    // raptor: distance milestones -> bone %
      trexDeathKillsDone:0,  // not needed here
      pachyReviveUsed:false, // pachy: one free revive
      paraComboDecayRate:0,  // para: combo decays slower
      dilophoVenomActive:true,
      // Tri: first obstacle destroyed
      triFirstDestroyed:false,"""

new_init = """      // Per-run passive state
      raptorSpeedBonus:0,    // raptor: distance milestones -> bone % (cap 10%)
      pachyReviveUsed:false, // pachy: one free revive (legacy, kept for bullet hit)
      // Timed passive cooldowns (in frames)
      pterodacFlyTimer:0, pterodacFlyCooldown:0,   // fly 5s/30s
      ankyPulseTimer:0,                             // pulse every 40s
      triHornTimer:0,                               // horn burst every 30s
      pachyHeadbuttTimer:0, pachyHeadbuttActive:0,  // headbutt 5s/30s
      dilophoPhaseTimer:0, dilophoPhaseActive:0,    // phase 5s/30s
      // Tri: first obstacle destroyed (legacy)
      triFirstDestroyed:false,"""

src = src.replace(old_init, new_init)

# 2. startGame: trex gets 2 lives
old_lives = "      stats, lives:1+stats.extraLives, combo:0, comboTimer:0,"
new_lives = "      stats, lives:(equippedDesign===\"trex\"?2:1)+stats.extraLives, combo:0, comboTimer:0,"
src = src.replace(old_lives, new_lives)

# 3. Raptor passive: change 400m->500m, 3%->0.5%, cap at 10%
old_raptor_passive = """        // ── Raptor passive: speed rush every 200m ────────────────────────────
        if(designId===\"raptor\"){
          const milestone=Math.floor(gs.distance/400);
          if(milestone>gs.raptorSpeedBonus){
            gs.raptorSpeedBonus=milestone;
            addFloat(gs,`SPEED RUSH! +3% bones`,80,80,\"#00cc66\");
          }
        }"""

new_raptor_passive = """        // ── Raptor passive: +0.5% per 500m, cap 10% (20 milestones) ──────────
        if(designId===\"raptor\"){
          const milestone=Math.min(20,Math.floor(gs.distance/500));
          if(milestone>gs.raptorSpeedBonus){
            gs.raptorSpeedBonus=milestone;
            const pct=(milestone*0.5).toFixed(1);
            addFloat(gs,`SPEED RUSH! +${pct}% bones`,80,80,\"#00cc66\");
          }
        }"""

src = src.replace(old_raptor_passive, new_raptor_passive)

# 4. Raptor multiplier: change 0.03 -> 0.005
old_raptor_mult = "        const raptorM = designId===\"raptor\" ? 1+(gs.raptorSpeedBonus*0.03) : 1;"
new_raptor_mult = "        const raptorM = designId===\"raptor\" ? 1+(gs.raptorSpeedBonus*0.005) : 1;"
src = src.replace(old_raptor_mult, new_raptor_mult)

# 5. Spino: change 1.15 -> 1.30
old_spino = "          const spinoMult = designId===\"spino\" && isNightNow ? 1.15 : 1;"
new_spino = "          const spinoMult = designId===\"spino\" && isNightNow ? 1.30 : 1;"
src = src.replace(old_spino, new_spino)

# 6. Para: add combo cap at 20
old_para_combo = """            // Para passive: combo decays slower (handled via comboTimer boost)
            if(designId===\"para\") gs.comboTimer=150; // 25% longer"""
new_para_combo = """            // Para passive: combo timer 25% longer, cap combo at 20
            if(designId===\"para\"){ gs.comboTimer=150; if(gs.combo>20) gs.combo=20; }"""
src = src.replace(old_para_combo, new_para_combo)

# 7. Replace the timed passive block — insert after the raptor passive block
# We'll insert the timed passives (pterodac, anky, tri, pachy, dilopho) right after raptor block
# and before the celestial cycle block

old_celestial = "        // ── Celestial cycle ──────────────────────────────────────────────────"
new_timed_passives = """        // ── Timed passives (60fps base) ──────────────────────────────────────
        const FPS60 = 60; // timers in frames at ~60fps
        if(designId===\"pterodac\"){
          if(gs.pterodacFlyCooldown>0) gs.pterodacFlyCooldown-=dt;
          if(gs.pterodacFlyTimer>0){
            gs.pterodacFlyTimer-=dt;
            // Force airborne during fly mode
            if(gs.dino.onGround){ gs.dino.vy=JUMP_FORCE*0.7; gs.dino.onGround=false; }
          } else if(gs.pterodacFlyCooldown<=0){
            gs.pterodacFlyTimer=5*FPS60/60; // 5s in dt units (~300 frames)
            gs.pterodacFlyCooldown=30*FPS60/60;
            addFloat(gs,\"FLY MODE!\",gs.dino.x-10,gs.dino.y-28,\"#44aaff\");
          }
        }
        if(designId===\"anky\"){
          gs.ankyPulseTimer=(gs.ankyPulseTimer||0)+dt;
          if(gs.ankyPulseTimer>=40*FPS60/60){
            gs.ankyPulseTimer=0;
            const before=gs.obstacles.length;
            gs.obstacles=gs.obstacles.filter(o=>{
              const hb=getObstacleHitbox(o);
              const dx=hb.x+hb.w/2-(gs.dino.x+DINO_W/2);
              const dy=hb.y+hb.h/2-(gs.dino.y+DINO_H/2);
              return Math.sqrt(dx*dx+dy*dy)>160;
            });
            const cleared=before-gs.obstacles.length;
            if(cleared>0) addFloat(gs,`PULSE WAVE! x${cleared}`,gs.dino.x-20,gs.dino.y-36,\"#ffaa00\");
            else addFloat(gs,\"PULSE WAVE!\",gs.dino.x-20,gs.dino.y-36,\"#ffaa00\");
          }
        }
        if(designId===\"tri\"){
          gs.triHornTimer=(gs.triHornTimer||0)+dt;
          if(gs.triHornTimer>=30*FPS60/60){
            gs.triHornTimer=0;
            // Destroy all obstacles and bullets on screen
            const cleared=gs.obstacles.length;
            gs.obstacles=[];
            if(cleared>0) addFloat(gs,`HORN BURST! x${cleared}`,gs.dino.x-20,gs.dino.y-36,\"#cc8800\");
            else addFloat(gs,\"HORN BURST!\",gs.dino.x-20,gs.dino.y-36,\"#cc8800\");
          }
        }
        if(designId===\"pachy\"){
          if(gs.pachyHeadbuttActive>0){
            gs.pachyHeadbuttActive-=dt;
            // Destroy obstacles/bullets in front (within 120px ahead)
            gs.obstacles=gs.obstacles.filter(o=>{
              const hb=getObstacleHitbox(o);
              if(hb.x>gs.dino.x-10&&hb.x<gs.dino.x+120){
                if(o.bullets) o.bullets=[];
                return false;
              }
              return true;
            });
          } else {
            gs.pachyHeadbuttTimer=(gs.pachyHeadbuttTimer||0)+dt;
            if(gs.pachyHeadbuttTimer>=30*FPS60/60){
              gs.pachyHeadbuttTimer=0;
              gs.pachyHeadbuttActive=5*FPS60/60;
              addFloat(gs,\"HEADBUTT!\",gs.dino.x-10,gs.dino.y-28,\"#ffcc00\");
            }
          }
        }
        if(designId===\"dilopho\"){
          if(gs.dilophoPhaseActive>0){
            gs.dilophoPhaseActive-=dt;
          } else {
            gs.dilophoPhaseTimer=(gs.dilophoPhaseTimer||0)+dt;
            if(gs.dilophoPhaseTimer>=30*FPS60/60){
              gs.dilophoPhaseTimer=0;
              gs.dilophoPhaseActive=5*FPS60/60;
              addFloat(gs,\"PHASE SHIFT!\",gs.dino.x-10,gs.dino.y-28,\"#66dd22\");
            }
          }
        }

        // ── Celestial cycle ──────────────────────────────────────────────────"""

src = src.replace(old_celestial, new_timed_passives)

# 8. Pterodac: airborne pickup bonus — keep existing 1.5x but also active during fly mode
# The existing pteroM already checks !gs.dino.onGround, fly mode forces airborne so it works naturally

# 9. Dilopho: replace old 8% venom dissolve with phase-through (dilophoPhaseActive)
old_dilopho_passive = """            // Dilopho passive: 8% venom dissolve
            if(designId===\"dilopho\"&&Math.random()<0.08&&rectsOverlap(DX,DY,DW+30,DH,hb.x,hb.y,hb.w,hb.h)){
              gs.obstacles.splice(i,1);
              addFloat(gs,\"VENOM!\",hb.x,hb.y-10,\"#66dd22\");
              continue;
            }"""

new_dilopho_passive = """            // Dilopho passive: phase through everything when active
            if(designId===\"dilopho\"&&gs.dilophoPhaseActive>0) continue;"""

src = src.replace(old_dilopho_passive, new_dilopho_passive)

# 10. Ghost check: also skip collision when dilopho phase is active
# The dilopho phase is handled by the continue above, but we also need bullet immunity
# Add dilopho phase to the ghost/giant bullet immunity check
old_bullet_immune = "        if(!hasGhost&&!hasGiant&&!hasSpdPw&&gs.dino.invTimer<=0){"
new_bullet_immune = "        if(!hasGhost&&!hasGiant&&!hasSpdPw&&gs.dino.invTimer<=0&&!(designId===\"dilopho\"&&gs.dilophoPhaseActive>0)){"
src = src.replace(old_bullet_immune, new_bullet_immune)

# 11. Raptor HUD indicator: update % display
old_raptor_hud = """      // Raptor speed rush indicator
      if(designId2===\"raptor\"&&gs.raptorSpeedBonus>0){
        ctx.fillStyle=HUD.hud;ctx.font=\"9px 'Courier New'\";
        ctx.fillText(`RUSH x${gs.raptorSpeedBonus} (+${(gs.raptorSpeedBonus*3)}%)`,12,68);
      }"""

new_raptor_hud = """      // Raptor speed rush indicator
      if(designId2===\"raptor\"&&gs.raptorSpeedBonus>0){
        ctx.fillStyle=HUD.hud;ctx.font=\"9px 'Courier New'\";
        ctx.fillText(`RUSH +${(gs.raptorSpeedBonus*0.5).toFixed(1)}% (${gs.raptorSpeedBonus}/20)`,12,68);
      }"""

src = src.replace(old_raptor_hud, new_raptor_hud)

# 12. Pachy: old headbutt revive on obstacle collision — keep for bullet hits but remove from obstacle collision
# The old pachy revive on obstacle collision block:
old_pachy_obstacle = """                // Pachy passive: one free revive per run
                if(designId===\"pachy\"&&!gs.pachyReviveUsed){
                  gs.pachyReviveUsed=true;
                  gs.obstacles.splice(i,1);
                  gs.dino.invTimer=30;
                  addFloat(gs,\"HARD HEAD! REVIVED!\",gs.dino.x-20,gs.dino.y-30,\"#ffcc00\");
                } else {
                  endGame(gs); return;
                }"""

new_pachy_obstacle = """                endGame(gs); return;"""

src = src.replace(old_pachy_obstacle, new_pachy_obstacle)

# 13. Pachy: old headbutt revive on bullet hit — remove too
old_pachy_bullet = """                } else if(designId===\"pachy\"&&!gs.pachyReviveUsed){
                  gs.pachyReviveUsed=true; gs.dino.invTimer=30;
                  addFloat(gs,\"HARD HEAD! REVIVED!\",gs.dino.x-20,gs.dino.y-30,\"#ffcc00\");
                } else {
                  endGame(gs); return;
                }"""

new_pachy_bullet = """                } else {
                  endGame(gs); return;
                }"""

src = src.replace(old_pachy_bullet, new_pachy_bullet)

# 14. Tri: remove old "first obstacle destroyed" logic (replaced by timed horn burst)
old_tri_first = """        // Tri passive: destroy first obstacle automatically
        if(designId===\"tri\"&&!gs.triFirstDestroyed&&gs.obstacles.length>0){
          gs.triFirstDestroyed=true;
          gs.obstacles.splice(0,1);
          addFloat(gs,\"HORN CHARGE!\",80,80,\"#cc8800\");
        }"""

new_tri_first = """        // Tri: horn burst handled by timed passive above"""

src = src.replace(old_tri_first, new_tri_first)

with open("src/DinoGamePlus.jsx", "w", encoding="utf-8") as f:
    f.write(src)
print("DinoGamePlus.jsx updated")
print("All passive changes applied!")
