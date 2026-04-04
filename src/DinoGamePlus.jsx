import { useState, useEffect, useRef, useCallback } from "react";
import { submitScore, fetchLeaderboard } from "./leaderboard";
import { getSavedName, getPlayerId } from "./supabase";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { GRAVITY, JUMP_FORCE, GROUND_Y, DINO_W, DINO_H, CANVAS_W, CANVAS_H, DAY_CYCLE, DUCK_H } from "./constants";
import { lerp, clamp, drawFossilDiamond } from "./utils/helpers";
import { getSceneryColors, getHudColors } from "./utils/scenery";
import { getObstacleHitbox, rectsOverlap } from "./utils/collision";
import { drawDino, drawHeart, drawPassiveEffect } from "./rendering/drawDino";
import { drawObstacleForScenery } from "./rendering/drawObstacles";
import { drawStars, drawPixelSun, drawPixelMoon, drawClouds, drawGround, drawBonePickup, drawEntitySilhouette } from "./rendering/drawWorld";
import { drawPowerupIcon } from "./rendering/drawPowerups";
import GameOverScreen from "./GameOverScreen";
import MenuScreen from "./MenuScreen";
import AchievementsScreen, { ACHIEVEMENTS } from "./AchievementsScreen";
import LeaderboardScreen from "./LeaderboardScreen";
import ShopScreen from "./ShopScreen";
import SkinsScreen from "./SkinsScreen";
import { UPGRADES, POWERUP_DEFS, getUpgradeCost } from "./data/gameData";
import { spawnWastelandObstacle } from "./maps/wasteland/wastelandObstacles";
import { spawnGrasslandsObstacle } from "./maps/grasslands/grasslandsObstacles";
import { spawnDesertObstacle } from "./maps/desert/desertObstacles";
import { spawnArcticObstacle } from "./maps/arctic/arcticObstacles";
import { spawnVolcanoObstacle } from "./maps/volcano/volcanoObstacles";
import { spawnJungleObstacle } from "./maps/jungle/jungleObstacles";
import { spawnRuinsObstacle } from "./maps/ruins/ruinsObstacles";
import { spawnCaveObstacle } from "./maps/cave/caveObstacles";
import { SCENERIES, SKINS, DINO_DESIGNS, DINO_PASSIVES, PASSIVE_ICONS, REGULAR_SCENERY_IDS } from "./data/collectionData.jsx";
import BossFightScreen from "./BossFightScreen";




// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DinoIncremental() {
  const canvasRef   = useRef(null);
  const gsRef       = useRef(null);
  const animRef     = useRef(null);
  const lastTimeRef = useRef(null);
  const keysRef     = useRef({});
  const prevKeysRef = useRef({});
  const touchStartRef = useRef(null);

  const [screen,         setScreen]         = useState("menu");
  const [fossils,        setFossils]        = useLocalStorage("dino_fossils", 0);
  const [totalFossils,   setTotalFossils]   = useLocalStorage("dino_totalFossils", 0);
  const [bestDist,       setBestDist]       = useLocalStorage("dino_bestDist", 0);
  const [totalRuns,      setTotalRuns]      = useLocalStorage("dino_totalRuns", 0);
  const [upgradeLevels,  setUpgradeLevels]  = useLocalStorage("dino_upgradeLevels", {});
  const [ownedSkins,     setOwnedSkins]     = useLocalStorage("dino_ownedSkins", ["classic"]);
  const [equippedSkin,   setEquippedSkin]   = useLocalStorage("dino_equippedSkin", "classic");
  const [ownedDesigns,   setOwnedDesigns]   = useLocalStorage("dino_ownedDesigns", ["raptor"]);
  const [equippedDesign, setEquippedDesign] = useLocalStorage("dino_equippedDesign", "raptor");
  const [ownedSceneries, setOwnedSceneries] = useLocalStorage("dino_ownedSceneries", ["classic"]);
  const [activeScenery,  setActiveScenery]  = useLocalStorage("dino_activeScenery", "classic");
  const [lastRun,        setLastRun]        = useState(null);
  const [passiveRate,    setPassiveRate]    = useState(0);
  const [notification,   setNotification]   = useState(null);
  const [shopTab,        setShopTab]        = useState("movement");
  const [achievStats,    setAchievStats]    = useLocalStorage("dino_achievStats", {
    totalRuns:0, bestDist:0, totalBones:0, totalUpgrades:0,
    ownedSkins:1, ownedSceneries:1, maxCombo:0, nightCycles:0,
    totalNearMiss:0, giantCrushes:0, bestDistNoDash:0, passiveEarned:0, allMovementMax:false,
    totalPlayTime:0, powerupUses:{}, totalPowerupUses:0, hasimKills:0,
    dinoDistances:{}, bestDistNoHit:0, menuIdleUnlock:false,
  });
  const [unlockedAch,    setUnlockedAch]    = useLocalStorage("dino_unlockedAch", []);
  const [pendingAch,     setPendingAch]     = useState([]);
  const [achivNotif,     setAchivNotif]     = useState(null);
  const [unlockedPowerups, setUnlockedPowerups] = useLocalStorage("dino_unlockedPowerups", []);
  const [lbData,           setLbData]           = useState([]);
  const [lbLoading,        setLbLoading]        = useState(false);
  const [lastRunRank,      setLastRunRank]       = useState(null);
  const [bossKey,          setBossKey]           = useState(0);


  const getStats = useCallback((levels) => {
    const ul = levels || {};
    return {
      jumpBoost:      (ul.jump||0)*1.8,
      fossilMult:     1+(ul.fossil||0)*0.20,
      shieldChance:   (ul.shield||0)*0.06,
      speedReduction: (ul.speed||0)*0.15,
      hasMagnet:      (ul.magnet||0)>0,
      magnetLevel:    ul.magnet||0,
      hasDoubleJump:  (ul.dblJump||0)>0,
      hasDash:        (ul.dash||0)>0,
      hasBackDash:    (ul.backdash||0)>0,
      hasFastDrop:    (ul.fastdrop||0)>0,
      hasDuck:        (ul.duck||0)>0,
      dashCdReduction:(ul.dashCd||0)*10,
      comboBonus:     (ul.combo||0)*0.12,
      nearMissBonus:  (ul.nearMiss||0)*3,
      extraLives:     ul.extraLife||0,
      invFramesBonus: (ul.invFrames||0)*8,
      nightBonus:     (ul.nightBonus||0)*0.25,
      transBonus:     (ul.transBonus||0)*0.25,
      speedBonusMult: (ul.speedBonus||0)*0.5,
      passiveFossils: (ul.miner||0)*0.3+(ul.camp||0)*0.8+(ul.research||0)*1.5,
      shieldHits:     1+(ul.pwShieldDur||0),
      speedMult:      2.0+(ul.pwSpeedMult||0)*0.25,
      giantDurBonus:    (ul.pwGiantDur||0)*60,
      magnetRngBonus:   (ul.pwMagnetRng||0)*80,
      frenzyDurBonus:   (ul.pwFrenzyDur||0)*60,
      rareDrop:         (ul.pwRareDrop||0)*0.05,
      heartChance:      (ul.pwHeartChance||0)*0.03,
      ghostDurBonus:    (ul.pwGhostDur||0)*60,
      tinyDurBonus:     (ul.pwTinyDur||0)*60,
      meteorCountBonus: (ul.pwMeteorCount||0)*2,
      doublerDurBonus:  (ul.pwDoublerDur||0)*60,
      slowDurBonus:     (ul.pwSlowDur||0)*60,
      windfallDurBonus: (ul.pwWindfallDur||0)*60,
    };
  }, []);

  // Passive income
  useEffect(() => {
    const rate = getStats(upgradeLevels).passiveFossils;
    setPassiveRate(rate);
    if(rate<=0) return;
    const id = setInterval(()=>{
      const gained = rate*0.5;
      setFossils(f=>+(f+gained).toFixed(1));
      setTotalFossils(f=>+(f+gained).toFixed(1));
      setAchievStats(prev=>({...prev, passiveEarned:prev.passiveEarned+gained, totalBones:prev.totalBones+gained}));
    },500);
    return ()=>clearInterval(id);
  },[upgradeLevels,getStats]);

  // Achievement checker
  useEffect(()=>{
    const newUnlocked=[];
    ACHIEVEMENTS.forEach(a=>{
      if(!unlockedAch.includes(a.id)&&a.req(achievStats)) newUnlocked.push(a);
    });
    if(newUnlocked.length>0){
      const ids=newUnlocked.map(a=>a.id);
      setUnlockedAch(prev=>[...prev,...ids]);
      const totalReward=newUnlocked.reduce((s,a)=>s+a.reward,0);
      setFossils(f=>f+totalReward);
      setTotalFossils(f=>f+totalReward);
      setPendingAch(prev=>[...prev,...newUnlocked]);
    }
  },[achievStats]);

  useEffect(()=>{
    if(pendingAch.length>0){
      const a=pendingAch[0];
      setAchivNotif(`🏆 ${a.label} (+${a.rewardLabel || `${a.reward} fossils`})`);
      const t=setTimeout(()=>{ setAchivNotif(null); setPendingAch(prev=>prev.slice(1)); },3000);
      return ()=>clearTimeout(t);
    }
  },[pendingAch]);

  // Auto-fetch leaderboard when screen opens
  useEffect(()=>{
    if(screen!=="leaderboard") return;
    setLbLoading(true);
    fetchLeaderboard().then(data=>{ setLbData(data); setLbLoading(false); });
  },[screen]);

  const showNotif = useCallback((msg)=>{
    setNotification(msg);
    const t=setTimeout(()=>setNotification(null),2200);
    return ()=>clearTimeout(t);
  },[]);

  const currentSkin    = SKINS.find(s=>s.id===equippedSkin)||SKINS[0];
  const currentDesign  = DINO_DESIGNS.find(d=>d.id===equippedDesign)||DINO_DESIGNS[0];
  const currentScenery = SCENERIES.find(s=>s.id===activeScenery)||SCENERIES[0];

  // Menu dino preview
  const menuCanvasRef = useRef(null);
  const menuAnimRef   = useRef(null);
  const [menuDinoClicks, setMenuDinoClicks] = useState(0);
  const [showCredit, setShowCredit] = useState(false);
  useEffect(()=>{
    if(screen!=="menu"){ cancelAnimationFrame(menuAnimRef.current); return; }
    let f=0;
    const tick=()=>{
      f++;
      const el=menuCanvasRef.current;
      if(el){
        const c=el.getContext("2d");
        c.clearRect(0,0,80,70);
        drawDino(c,16,8,f,false,
          SKINS.find(s=>s.id===equippedSkin)||SKINS[0],
          DINO_DESIGNS.find(d=>d.id===equippedDesign)||DINO_DESIGNS[0],
          false,false,false,false,0,true,null);
      }
      menuAnimRef.current=requestAnimationFrame(tick);
    };
    menuAnimRef.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(menuAnimRef.current);
  },[screen,equippedSkin,equippedDesign]);

  // Menu idle timer — tracks uninterrupted idle time on menu
  const menuIdleRef = useRef(0);
  const menuIdleActiveRef = useRef(false);
  useEffect(()=>{
    if(screen!=="menu"||achievStats.menuIdleUnlock){
      menuIdleActiveRef.current=false;
      return;
    }
    menuIdleActiveRef.current=true;
    const interval = setInterval(()=>{
      if(!menuIdleActiveRef.current) return;
      menuIdleRef.current+=1;
      if(menuIdleRef.current>=2400){
        setAchievStats(prev=>({...prev,menuIdleUnlock:true}));
      }
    },1000);
    const reset=()=>{ menuIdleRef.current=0; };
    window.addEventListener("keydown",reset);
    window.addEventListener("mousemove",reset);
    window.addEventListener("click",reset);
    return ()=>{
      clearInterval(interval);
      window.removeEventListener("keydown",reset);
      window.removeEventListener("mousemove",reset);
      window.removeEventListener("click",reset);
    };
  },[screen,achievStats.menuIdleUnlock]);

  const startGame = useCallback(()=>{
    const stats   = getStats(upgradeLevels);
    const scenery = SCENERIES.find(s=>s.id===activeScenery)||SCENERIES[0];
    const design  = DINO_DESIGNS.find(d=>d.id===equippedDesign)||DINO_DESIGNS[0];
    gsRef.current = {
      dino:{ x:70, y:GROUND_Y-DINO_H, vy:0, onGround:true, doubleJumped:false, dead:false,
             dashTimer:0, dashDir:0, dashCooldown:0, ducking:false, invTimer:0 },
      deathAnim: null, // { angle, vy, y }
      obstacles:[],
      pickups:[],
      powerupPickups:[],
      unlockedPowerups:[...unlockedPowerups],
      floatingTexts:[],
      passiveEffects:[],
      activePowerups:{},
      clouds: scenery.id==="cave"
        ? Array.from({length:10},(_,i)=>({x:i*80+10, y:0, h:20+Math.random()*40, speed:0.15+Math.random()*0.2}))
        : Array.from({length:6},(_,i)=>({x:i*160+40, y:12+Math.random()*48, speed:0.2+Math.random()*0.3})),
      stars: Array.from({length:45},()=>({x:Math.random()*CANVAS_W, y:Math.random()*140, size:1+Math.floor(Math.random()*2), bright:0.4+Math.random()*0.6})),
      speed: Math.max(3.5,5-(stats.speedReduction*5)),
      baseSpeed: Math.max(3.5,5-(stats.speedReduction*5)),
      distance:0, fossilsEarned:0, frame:0, groundOffset:0,
      lastObstacleFrame:0, lastPickupFrame:0, lastPowerupFrame:0,
      coinManiaTimer:0,
      stats, lives:(equippedDesign==="trex"?2:1)+stats.extraLives, combo:0, comboTimer:0,
      alive:true, nightBlend:0, inNight:false,
      lastCycleNight:false, nightCycleCount:0,
      nearMissTimer:0, shieldHitsLeft:0,
      sunX:CANVAS_W+20, sunY:30, moonX:CANVAS_W+200, moonY:28,
      sunAlpha:1, moonAlpha:0,
      skin:currentSkin, design, scenery,
      maxComboThisRun:0, nearMissCount:0, giantCrushes:0, usedDash:false, hitTaken:false,
      runStartTime: Date.now(),
      // Per-run passive state
      raptorSpeedBonus:0,    // raptor: distance milestones -> bone % (cap 10%)
      pachyReviveUsed:false, // pachy: one free revive (legacy, kept for bullet hit)
      // Timed passive cooldowns (in frames)
      pterodacFlyTimer:0, pterodacFlyCooldown:30*60,   // fly 5s/30s — first lift after 30s
      ankyPulseTimer:0,                                 // pulse every 40s
      triHornTimer:0,                                   // horn burst every 30s
      pachyHeadbuttTimer:0, pachyHeadbuttActive:0,      // headbutt 5s/30s
      dilophoPhaseTimer:0, dilophoPhaseActive:0,        // phase 5s/30s
      // Tri: first obstacle destroyed (legacy)
      triFirstDestroyed:false,
      // Spino: night bonus tracked in render
      // Entity silhouette state
      entity:{ x: CANVAS_W * 0.65, y: 60, alpha: 0, visible: false, timer: 0, fadeDir: 0 },
    };
    keysRef.current={};
    prevKeysRef.current={};
    setScreen("game");
  },[upgradeLevels, getStats, equippedSkin, equippedDesign, activeScenery, currentSkin, currentDesign]);

  const doJump = useCallback(()=>{
    const gs=gsRef.current;
    if(!gs||!gs.alive) return;
    if(gs.activePowerups.speed_pw) return;
    if(gs.dino.ducking){gs.dino.ducking=false; return;}
    if(gs.dino.onGround){
      gs.dino.vy=JUMP_FORCE-gs.stats.jumpBoost*0.42;
      gs.dino.onGround=false; gs.dino.doubleJumped=false;
    } else if(gs.stats.hasDoubleJump&&!gs.dino.doubleJumped){
      gs.dino.vy=JUMP_FORCE-gs.stats.jumpBoost*0.28;
      gs.dino.doubleJumped=true;
    }
  },[]);

  useEffect(()=>{
    if(screen!=="gameover") return;
    const onKey=(e)=>{if(e.code==="Enter"||e.code==="Space") startGame();};
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[screen,startGame]);

  useEffect(()=>{
    if(screen!=="game") return;
    const onDown=(e)=>{
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyW","KeyS"].includes(e.code)) e.preventDefault();
      keysRef.current[e.code]=true;
    };
    const onUp=(e)=>{keysRef.current[e.code]=false;};
    window.addEventListener("keydown",onDown);
    window.addEventListener("keyup",onUp);
    return ()=>{window.removeEventListener("keydown",onDown);window.removeEventListener("keyup",onUp);};
  },[screen]);

  useEffect(()=>{
    if(screen!=="game") return;
    const applyGesture=(dx,dy)=>{
      const absDx=Math.abs(dx), absDy=Math.abs(dy);
      if(absDx<12&&absDy<12){ doJump(); return; }
      if(absDy>absDx){
        if(dy<0){ doJump(); }
        else{ keysRef.current["ArrowDown"]=true; setTimeout(()=>{keysRef.current["ArrowDown"]=false;},120); }
      } else {
        if(dx>0){ keysRef.current["ArrowRight"]=true; setTimeout(()=>{keysRef.current["ArrowRight"]=false;},80); }
        else    { keysRef.current["ArrowLeft"]=true;  setTimeout(()=>{keysRef.current["ArrowLeft"]=false;}, 80); }
      }
    };
    const onTouchStart=(e)=>{ if(e.cancelable) e.preventDefault(); touchStartRef.current={x:e.touches[0].clientX,y:e.touches[0].clientY}; };
    const onTouchEnd=(e)=>{
      if(e.cancelable) e.preventDefault();
      if(!touchStartRef.current) return;
      const dx=e.changedTouches[0].clientX-touchStartRef.current.x;
      const dy=e.changedTouches[0].clientY-touchStartRef.current.y;
      touchStartRef.current=null;
      applyGesture(dx,dy);
    };
    const onMouseDown=(e)=>{ touchStartRef.current={x:e.clientX,y:e.clientY}; };
    const onMouseUp=(e)=>{
      if(!touchStartRef.current) return;
      const dx=e.clientX-touchStartRef.current.x;
      const dy=e.clientY-touchStartRef.current.y;
      touchStartRef.current=null;
      applyGesture(dx,dy);
    };
    window.addEventListener("touchstart",onTouchStart,{passive:false});
    window.addEventListener("touchend",onTouchEnd,{passive:false});
    window.addEventListener("mousedown",onMouseDown);
    window.addEventListener("mouseup",onMouseUp);
    return ()=>{
      window.removeEventListener("touchstart",onTouchStart);
      window.removeEventListener("touchend",onTouchEnd);
      window.removeEventListener("mousedown",onMouseDown);
      window.removeEventListener("mouseup",onMouseUp);
    };
  },[screen,doJump]);

  useEffect(()=>{
    if(screen!=="game"&&screen!=="gameover"){ if(animRef.current) cancelAnimationFrame(animRef.current); return; }
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");

    const addFloat=(gs,text,x,y,color="#ffdd44")=>{
      gs.floatingTexts.push({text,x,y,vy:-1.4,life:65,maxLife:65,color});
    };

    const addPassiveEffect=(gs,type,x,y)=>{
      gs.passiveEffects.push({type,x,y,life:0,maxLife:45});
    };

    const triggerDeath=(gs)=>{
      gs.dino.dead=true;
      gs.deathAnim={ angle:0, angVel:0.18, vy:-7, vx:3.5 };
    };

    const endGame=(gs)=>{
      if(!gs.alive) return;
      gs.alive=false;
      triggerDeath(gs);
      const earned=Math.floor(gs.fossilsEarned), dist=Math.floor(gs.distance);
      setFossils(f=>f+earned);
      setTotalFossils(f=>f+earned);
      setTotalRuns(r=>r+1);
      setBestDist(b=>Math.max(b,dist));
      setLastRun({fossils:earned,dist});
      setAchievStats(prev=>{
        const newPowerupUses = {...(prev.powerupUses||{})};
        for(const [pid,cnt] of Object.entries(gs.powerupUseLog||{})){
          newPowerupUses[pid]=(newPowerupUses[pid]||0)+cnt;
        }
        const newDinoDist = {...(prev.dinoDistances||{})};
        const did = gs.design?.id;
        if(did) newDinoDist[did]=Math.max(newDinoDist[did]||0,dist);
        const playedSecs = Math.floor((Date.now()-gs.runStartTime)/1000);
        return {
          ...prev,
          totalRuns:prev.totalRuns+1,
          bestDist:Math.max(prev.bestDist,dist),
          totalBones:prev.totalBones+earned,
          nightCycles:prev.nightCycles+gs.nightCycleCount,
          maxCombo:Math.max(prev.maxCombo,gs.maxComboThisRun),
          totalNearMiss:prev.totalNearMiss+gs.nearMissCount,
          giantCrushes:prev.giantCrushes+gs.giantCrushes,
          bestDistNoDash:gs.usedDash?prev.bestDistNoDash:Math.max(prev.bestDistNoDash,dist),
          bestDistNoHit:gs.hitTaken?prev.bestDistNoHit:Math.max(prev.bestDistNoHit||0,dist),
          totalPlayTime:(prev.totalPlayTime||0)+playedSecs,
          powerupUses:newPowerupUses,
          totalPowerupUses:(prev.totalPowerupUses||0)+(gs.totalPowerupUsesThisRun||0),
          hasimKills:did==="hasim"?(prev.hasimKills||0)+1:prev.hasimKills||0,
          dinoDistances:newDinoDist,
        };
      });
      // Auto-submit run and check if it makes top 50
      const playerName = getSavedName();
      submitScore(playerName, dist, earned).then(async()=>{
        const board = await fetchLeaderboard();
        const myId = getPlayerId();
        // Find rank of this specific run (same dist)
        const myEntry = board.find(r => r.player_id === myId && r.best_dist === dist && r.best_fossils === earned);
        const rank = myEntry
          ? board.filter(r =>
              r.best_dist > myEntry.best_dist ||
              (r.best_dist === myEntry.best_dist && r.best_fossils > myEntry.best_fossils) ||
              (r.best_dist === myEntry.best_dist && r.best_fossils === myEntry.best_fossils && r.updated_at < myEntry.updated_at)
            ).length + 1
          : null;
        setLastRunRank(rank);
      });
      setTimeout(()=>setScreen("gameover"),1800);
    };

    const loop=(ts)=>{
      if(!lastTimeRef.current) lastTimeRef.current=ts;
      const dt=Math.min((ts-lastTimeRef.current)/16.67,3);
      lastTimeRef.current=ts;
      const gs=gsRef.current;
      if(!gs) return;

      const k=keysRef.current, pk=prevKeysRef.current;
      const hasSpdPw   = !!gs.activePowerups.speed_pw;
      const hasSlowPw  = !!gs.activePowerups.slowmo_pw;
      const hasGiant   = !!gs.activePowerups.giant_pw;
      const hasGhost   = !!gs.activePowerups.ghost_pw;
      const hasTiny    = !!gs.activePowerups.tiny_pw;
      const hasFrenzy  = !!gs.activePowerups.frenzy_pw;
      const hasDoubler = !!gs.activePowerups.doubler_pw;
      const hasWind    = !!gs.activePowerups.coinmania_pw;
      const designId   = gs.design?.id || "raptor";

      // ── Death animation ─────────────────────────────────────────────────────
      if(gs.deathAnim && !gs.alive) {
        const da = gs.deathAnim;
        da.angle  += da.angVel * dt;
        da.vy     += GRAVITY * 1.2 * dt;
        gs.dino.y += da.vy * dt;
        gs.dino.x += da.vx * dt;
        // Stop loop once dino is fully off screen
        if(gs.dino.y > CANVAS_H + 60) { animRef.current = null; return; }
      }

      if(gs.alive){
        gs.frame++;
        gs.speed=Math.min(gs.baseSpeed+gs.distance*0.0016,22);
        gs.distance+=gs.speed*dt*0.1;
        gs.groundOffset=(gs.groundOffset+gs.speed*dt)%(CANVAS_W*4);

        // ── Raptor passive: +0.5% per 500m, cap 10% (20 milestones) ──────────
        if(designId==="raptor"){
          const milestone=Math.min(20,Math.floor(gs.distance/500));
          if(milestone>gs.raptorSpeedBonus){
            gs.raptorSpeedBonus=milestone;
            const pct=(milestone*0.5).toFixed(1);
            addFloat(gs,`SPEED RUSH! +${pct}% bones`,80,80,"#00cc66");
            addPassiveEffect(gs,"speedRush",gs.dino.x,gs.dino.y);
          }
        }

        // ── Timed passives (60fps base) ──────────────────────────────────────
        const FPS60 = 60; // timers in frames at ~60fps
        if(designId==="pterodac"){
          if(gs.pterodacFlyCooldown>0) gs.pterodacFlyCooldown-=dt;
          if(gs.pterodacFlyTimer>0){
            gs.pterodacFlyTimer-=dt;
            // Force airborne during fly mode
            if(gs.dino.onGround){ gs.dino.vy=JUMP_FORCE*0.7; gs.dino.onGround=false; }
          } else if(gs.pterodacFlyCooldown<=0){
            gs.pterodacFlyTimer=5*FPS60; // 5s in dt units (~300 frames)
            gs.pterodacFlyCooldown=30*FPS60;
            addFloat(gs,"FLY MODE!",gs.dino.x-10,gs.dino.y-28,"#44aaff");
            addPassiveEffect(gs,"thermalLift",gs.dino.x,gs.dino.y);
          }
        }
        if(designId==="anky"){
          gs.ankyPulseTimer=(gs.ankyPulseTimer||0)+dt;
          if(gs.ankyPulseTimer>=40*FPS60){
            gs.ankyPulseTimer=0;
            const before=gs.obstacles.length;
            gs.obstacles=gs.obstacles.filter(o=>{
              const hb=getObstacleHitbox(o);
              const dx=hb.x+hb.w/2-(gs.dino.x+DINO_W/2);
              const dy=hb.y+hb.h/2-(gs.dino.y+DINO_H/2);
              return Math.sqrt(dx*dx+dy*dy)>160;
            });
            const cleared=before-gs.obstacles.length;
            if(cleared>0) addFloat(gs,`PULSE WAVE! x${cleared}`,gs.dino.x-20,gs.dino.y-36,"#ffaa00");
            else addFloat(gs,"PULSE WAVE!",gs.dino.x-20,gs.dino.y-36,"#ffaa00");
            addPassiveEffect(gs,"pulseWave",gs.dino.x,gs.dino.y);
          }
        }
        if(designId==="tri"){
          gs.triHornTimer=(gs.triHornTimer||0)+dt;
          if(gs.triHornTimer>=30*FPS60){
            gs.triHornTimer=0;
            // Destroy all obstacles and bullets on screen
            const cleared=gs.obstacles.length;
            gs.obstacles=[];
            if(cleared>0) addFloat(gs,`HORN BURST! x${cleared}`,gs.dino.x-20,gs.dino.y-36,"#cc8800");
            else addFloat(gs,"HORN BURST!",gs.dino.x-20,gs.dino.y-36,"#cc8800");
            addPassiveEffect(gs,"hornBurst",gs.dino.x,gs.dino.y);
          }
        }
        if(designId==="pachy"){
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
            if(gs.pachyHeadbuttTimer>=30*FPS60){
              gs.pachyHeadbuttTimer=0;
              gs.pachyHeadbuttActive=5*FPS60;
              addFloat(gs,"HEADBUTT!",gs.dino.x-10,gs.dino.y-28,"#ffcc00");
              addPassiveEffect(gs,"headbutt",gs.dino.x,gs.dino.y);
            }
          }
        }
        if(designId==="dilopho"){
          if(gs.dilophoPhaseActive>0){
            gs.dilophoPhaseActive-=dt;
          } else {
            gs.dilophoPhaseTimer=(gs.dilophoPhaseTimer||0)+dt;
            if(gs.dilophoPhaseTimer>=30*FPS60){
              gs.dilophoPhaseTimer=0;
              gs.dilophoPhaseActive=5*FPS60;
              addFloat(gs,"PHASE SHIFT!",gs.dino.x-10,gs.dino.y-28,"#66dd22");
              addPassiveEffect(gs,"phaseShift",gs.dino.x,gs.dino.y);
            }
          }
        }

        // ── Celestial cycle ──────────────────────────────────────────────────
        const cycleLen=DAY_CYCLE*2;
        const cyclePos=gs.distance%cycleLen;
        const transZone=200;
        let targetBlend;
        if(cyclePos<DAY_CYCLE-transZone)     targetBlend=0;
        else if(cyclePos<DAY_CYCLE)           targetBlend=(cyclePos-(DAY_CYCLE-transZone))/transZone;
        else if(cyclePos<cycleLen-transZone) targetBlend=1;
        else                                 targetBlend=1-(cyclePos-(cycleLen-transZone))/transZone;
        targetBlend=clamp(targetBlend,0,1);
        gs.nightBlend=lerp(gs.nightBlend,targetBlend,0.018*dt);

        gs.sunX -= 0.18*dt;
        if(gs.sunX < -50) gs.sunX = CANVAS_W+50;
        gs.sunAlpha = clamp(1-gs.nightBlend*2.2,0,1);

        if(gs.nightBlend > 0.35 && gs.moonX > CANVAS_W+30) gs.moonX = CANVAS_W+30;
        if(gs.moonX <= CANVAS_W+30){ gs.moonX -= 0.12*dt; if(gs.moonX < -50) gs.moonX = CANVAS_W+80; }
        gs.moonAlpha = clamp((gs.nightBlend-0.3)*3.5,0,1);
        gs.sunY=36; gs.moonY=36;

        const isNightNow=targetBlend>0.5;
        if(isNightNow!==gs.inNight){
          gs.inNight=isNightNow;
          if(isNightNow) gs.nightCycleCount++;
          const baseB=25+Math.floor(gs.distance/80)*4;
          // Spino passive: +30% night bonus
          const spinoMult = designId==="spino" && isNightNow ? 1.30 : 1;
          const bonus=Math.floor(baseB*(1+gs.stats.transBonus)*spinoMult);
          gs.fossilsEarned+=bonus;
          addFloat(gs,`+${bonus} ${isNightNow?"DUSK BONUS":"DAWN BONUS"}`,CANVAS_W/2-50,70,isNightNow?"#aaaaff":"#ffdd44");
          if(!isNightNow){ gs.moonAlpha=0; }
        }

        // ── Powerup ticks ────────────────────────────────────────────────────
        for(const [pid,p] of Object.entries(gs.activePowerups)){
          if(p.duration>0){p.timer-=dt; if(p.timer<=0) delete gs.activePowerups[pid];}
        }
        if(hasWind){
          gs.coinManiaTimer-=dt;
          if(gs.coinManiaTimer<=0){
            gs.pickups.push({x:gs.dino.x+60+Math.random()*200, y:GROUND_Y-24-Math.random()*100, collected:false});
            gs.coinManiaTimer=7;
          }
        }
        if(gs.activePowerups.meteor_pw&&!gs.activePowerups.meteor_pw.fired){
          gs.activePowerups.meteor_pw.fired=true;
          const n=gs.obstacles.length; gs.obstacles=[];
          const bonus=gs.stats.meteorCountBonus||0;
          if(n>0){gs.fossilsEarned+=n*(4+bonus);addFloat(gs,`METEOR! +${n*(4+bonus)}`,60,60,"#ee6600");}
          delete gs.activePowerups.meteor_pw;
        }

        // ── Physics ──────────────────────────────────────────────────────────
        if(hasSpdPw){
          gs.dino.vy+=GRAVITY*dt; gs.dino.y+=gs.dino.vy*dt;
          if(gs.dino.y>=GROUND_Y-DINO_H){gs.dino.y=GROUND_Y-DINO_H;gs.dino.vy=0;gs.dino.onGround=true;}
        } else {
          if(gs.dino.invTimer>0) gs.dino.invTimer-=dt;
          if(gs.dino.dashCooldown>0) gs.dino.dashCooldown-=dt;
          const baseDashCd=Math.max(15,45-gs.stats.dashCdReduction);

          if((k["Space"]||k["ArrowUp"]||k["KeyW"])&&!(pk["Space"]||pk["ArrowUp"]||pk["KeyW"])) doJump();

          // Dash  Efull canvas bounds (10 to CANVAS_W-60)
          if(gs.stats.hasDash&&k["ArrowRight"]&&!pk["ArrowRight"]&&gs.dino.dashTimer<=0&&gs.dino.dashCooldown<=0){
            gs.dino.dashTimer=10; gs.dino.dashDir=1; gs.dino.dashCooldown=baseDashCd; gs.usedDash=true;
          }
          if(gs.stats.hasBackDash&&k["ArrowLeft"]&&!pk["ArrowLeft"]&&gs.dino.dashTimer<=0&&gs.dino.dashCooldown<=0){
            gs.dino.dashTimer=10; gs.dino.dashDir=-1; gs.dino.dashCooldown=baseDashCd; gs.usedDash=true;
          }
          if(gs.stats.hasDuck&&gs.dino.onGround){
            gs.dino.ducking=(k["ArrowDown"]||k["KeyS"]);
          } else if(!gs.dino.onGround){
            if(gs.stats.hasFastDrop&&(k["ArrowDown"]||k["KeyS"])) gs.dino.vy+=GRAVITY*2.5*dt;
            gs.dino.ducking=false;
          }

          gs.dino.vy+=GRAVITY*dt;
          gs.dino.y+=gs.dino.vy*dt;

          if(gs.dino.dashTimer>0){
            gs.dino.x+=gs.dino.dashDir*7*dt;
            gs.dino.dashTimer-=dt;
            // Allow dashing across full map width
            gs.dino.x=Math.max(10, Math.min(CANVAS_W-60, gs.dino.x));
          }
          if(gs.dino.y>=GROUND_Y-DINO_H){
            gs.dino.y=GROUND_Y-DINO_H;
            gs.dino.vy=0;
            gs.dino.onGround=true;
            gs.dino.doubleJumped=false;
          }
        }

        prevKeysRef.current={...k};

        let effSpeed=gs.speed;
        if(hasSpdPw)  effSpeed*=gs.stats.speedMult;
        if(hasSlowPw) effSpeed*=0.38;

        // ── Spawn obstacles ──────────────────────────────────────────────────
        if(gs.comboTimer>0){ gs.comboTimer-=dt; if(gs.comboTimer<=0) gs.combo=0; }
        if(gs.nearMissTimer>0) gs.nearMissTimer-=dt;

        const tier=Math.min(10,Math.floor(gs.distance/180));
        const minGap=Math.max(44,140-effSpeed*5-tier*2.5);
        if(gs.frame-gs.lastObstacleFrame>minGap){
          const r=Math.random();
          const sid2=gs.scenery?.id||"classic";
          let otype,type=0,oy=0,bullets=[];
          if(sid2==="classic") {
            ({otype,type,oy,bullets}=spawnWastelandObstacle(r,tier));
          } else if(sid2==="desert") {
            ({otype,type,oy,bullets}=spawnDesertObstacle(r,tier));
          } else if(sid2==="arctic") {
            ({otype,type,oy,bullets}=spawnArcticObstacle(r,tier));
          } else if(sid2==="volcano") {
            ({otype,type,oy,bullets}=spawnVolcanoObstacle(r,tier));
          } else if(sid2==="jungle") {
            ({otype,type,oy,bullets}=spawnJungleObstacle(r,tier));
          } else if(sid2==="ruins") {
            ({otype,type,oy,bullets}=spawnRuinsObstacle(r,tier));
          } else if(sid2==="cave") {
            ({otype,type,oy,bullets}=spawnCaveObstacle(r,tier));
          } else {
            // plains / grasslands
            ({otype,type,oy,bullets}=spawnGrasslandsObstacle(r,tier));
          }
          gs.obstacles.push({x:CANVAS_W+10,otype,type,y:oy,w:44,bullets,_shootTimer:0});
          // Cluster: ground static obstacles sometimes spawn 1-2 more of the same type close together
          const clusterTypes=["cactus","rock","spike","spike_cluster","wall","log","dune","icewall","lavarock","pillar","boulder","crystalSpire","crystalCluster"];
          if(clusterTypes.includes(otype)&&tier>=1){
            const clusterChance=0.28+tier*0.02; // ~28-48% chance of a cluster
            const count=Math.random()<clusterChance?(Math.random()<0.3?2:1):0;
            for(let ci=0;ci<count;ci++){
              const gap=38+Math.random()*28; // tight gap between cluster members
              const prevX=gs.obstacles[gs.obstacles.length-1].x;
              const clusterType=Math.random()<0.5?type:Math.floor(Math.random()*(Math.min(4,Math.floor(tier/1.5)+1)+1));
              gs.obstacles.push({x:prevX+gap,otype,type:clusterType,y:oy,w:44,bullets:[],_shootTimer:0});
            }
          }
          gs.lastObstacleFrame=gs.frame;
        }

        // ── Spawn pickups / powerups ─────────────────────────────────────────
        if(gs.frame-gs.lastPickupFrame>90){
          if(Math.random()<0.38) gs.pickups.push({x:CANVAS_W+10,y:GROUND_Y-30-Math.random()*90,collected:false});
          gs.lastPickupFrame=gs.frame;
        }
        // Heart: separate low-chance spawn check every ~120 frames
        if(gs.unlockedPowerups.includes("heart_pw")&&gs.frame%120===0){
          if(Math.random()<0.02+gs.stats.heartChance){
            const hdef=POWERUP_DEFS.find(d=>d.id==="heart_pw");
            gs.powerupPickups.push({x:CANVAS_W+10,y:GROUND_Y-32-Math.random()*58,def:hdef,collected:false});
          }
        }
        const spawnThresh=Math.max(300,900-gs.stats.rareDrop*1200);
        if(gs.frame-gs.lastPowerupFrame>spawnThresh){
          const eligible=POWERUP_DEFS.filter(d=>d.id!=="heart_pw"&&(d.id!=="meteor_pw"||tier>=4)&&gs.unlockedPowerups.includes(d.id));
          gs.lastPowerupFrame=gs.frame;
          if(eligible.length>0){
            const def=eligible[Math.floor(Math.random()*eligible.length)];
            gs.powerupPickups.push({x:CANVAS_W+10,y:GROUND_Y-32-Math.random()*58,def,collected:false});
          }
        }

        // ── Move everything ──────────────────────────────────────────────────
        gs.obstacles=gs.obstacles.filter(o=>{
          o.x-=effSpeed*dt;
          // Turret: shoot horizontal bullets, fires when 1/4 body visible
          if(o.otype==="turret"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(70,130-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-10){
              o._entryShot=true;
              o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:GROUND_Y-32,vx:(-7-tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt;return b.x>-20;});
          }
          // Sandworm: animate height based on dino proximity
          if(o.otype==="sandworm"){
            const dist=Math.abs(o.x-gs.dino.x);
            const maxH=36+tier*4;
            if(dist<420) o._wormH=Math.min(maxH,(o._wormH||0)+2.5*dt);
            else         o._wormH=Math.max(0,(o._wormH||0)-2*dt);
          }
          // Icicle: drop from sky when dino is nearby
          if(o.otype==="icicle"){
            if(o._icicleY===undefined) o._icicleY=-20;
            const dist=Math.abs(o.x-gs.dino.x);
            if(dist<260||o._icicleY>-20){
              o._icicleY=Math.min(GROUND_Y-34,(o._icicleY||0)+5*dt);
            }
          }
          // Lavaburst: shoots lava blobs upward in arc, fires when 1/4 body visible
          if(o.otype==="lavaburst"&&o.x<CANVAS_W-10&&o.x>-60){
            const dist=Math.abs(o.x-gs.dino.x);
            const shootInterval=Math.max(80,140-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-10){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            if(dist<300){
              o._shootTimer=(o._shootTimer||0)+dt;
              if(o._shootTimer>=shootInterval){
                o._shootTimer=0;
                const bSpd=effSpeed/gs.baseSpeed;
                o.bullets.push({x:o.x+14,y:GROUND_Y-22,vx:-1*bSpd,vy:(-8-tier*0.3)*bSpd});
                o.bullets.push({x:o.x+20,y:GROUND_Y-22,vx:-3*bSpd,vy:(-9-tier*0.3)*bSpd});
                o.bullets.push({x:o.x+20,y:GROUND_Y-22,vx:0,      vy:(-7-tier*0.3)*bSpd});
              }
            }
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=0.45*dt;
              return b.x>-30&&b.y<GROUND_Y;
            });
          }
          // Demon: flies and shoots fireballs, fires when 1/4 body visible
          if(o.otype==="demon"&&o.x<CANVAS_W-10&&o.x>-80){
            const shootInterval=Math.max(80,150-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:o.y+14,vx:(-8-tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Yeti: throw ice chunks, fires when 1/4 body visible
          if(o.otype==="yeti"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true;
              o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:GROUND_Y-44,vx:-(7+tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Scorpion: arc venom shots (parabolic), fires when 1/4 body visible
          if(o.otype==="scorpion"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true;
              o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+36,y:GROUND_Y-40,vx:-(6+tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // VineTrap: snap shut when dino is close
          if(o.otype==="vineTrap"){
            const dist=Math.abs(o.x+20-gs.dino.x);
            o._snapState = dist<80 ? Math.min(1,(o._snapState||0)+0.15*dt) : Math.max(0,(o._snapState||0)-0.08*dt);
          }
          // Gorilla: throw coconuts in arc, fires when 1/4 body visible
          if(o.otype==="gorilla"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+2,y:GROUND_Y-50,vx:-(7+tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Spiketrap: extend/retract on timer
          if(o.otype==="spiketrap"){
            o._spikeTimer=(o._spikeTimer||0)+dt;
            const cycle=Math.max(60,100-tier*5);
            const phase=(o._spikeTimer%cycle)/cycle;
            o._spikeH = phase<0.5 ? Math.min(28,phase*2*28) : Math.max(0,(1-phase)*2*28);
          }
          // Statue: shoot horizontal curse beam when dino is nearby, fires when 1/4 body visible
          if(o.otype==="statue"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-9){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            const dist=Math.abs(o.x-gs.dino.x);
            if(dist<320){
              o._shootTimer=(o._shootTimer||0)+dt;
              if(o._shootTimer>=shootInterval){
                o._shootTimer=0;
                const bSpd=effSpeed/gs.baseSpeed;
                o.bullets.push({x:o.x+4,y:GROUND_Y-52,vx:-(7+tier*0.3)*bSpd,vy:0});
              }
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Golem: throw rubble in arc, fires when 1/4 body visible
          if(o.otype==="golem"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+34,y:GROUND_Y-52,vx:-(7+tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Stalactite: drop from ceiling when dino is nearby
          if(o.otype==="stalactite"){
            if(o._stalY===undefined) o._stalY=-30;
            const dist=Math.abs(o.x-gs.dino.x);
            if(dist<280||o._stalY>-30) o._stalY=Math.min(GROUND_Y-42,(o._stalY||0)+5.5*dt);
          }
          // CrystalGolem: shoot 3-way crystal shard spread, fires when 1/4 body visible
          if(o.otype==="crystalGolem"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:GROUND_Y-50,vx:-(7+tier*0.3)*bSpd,vy:0});
              o.bullets.push({x:o.x+4,y:GROUND_Y-60,vx:-(6+tier*0.25)*bSpd,vy:0});
              o.bullets.push({x:o.x+4,y:GROUND_Y-40,vx:-(6+tier*0.25)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt;
              return b.x>-20&&b.y>0&&b.y<GROUND_Y;
            });
          }
          // VoidPortal: pull dino toward it when close (gravity well)
          if(o.otype==="voidPortal"&&o.x<CANVAS_W-10&&o.x>-60&&gs.dino.invTimer<=0&&!hasGhost){
            const dist=gs.dino.x-(o.x+18);
            if(Math.abs(dist)<200&&dist>0){
              const pull=(1-Math.abs(dist)/200)*1.8*dt;
              gs.dino.x=Math.max(10,gs.dino.x-pull);
            }
          }
          // CrystalMine: explode into 4 shards when dino is close
          if(o.otype==="crystalMine"&&!o._exploding){
            const dist=Math.sqrt(Math.pow(o.x+12-gs.dino.x,2)+Math.pow(o.y+12-gs.dino.y,2));
            if(dist<60){
              o._exploding=1;
              o.bullets=[
                {x:o.x+12,y:o.y+12,vx:-6,vy:-6},
                {x:o.x+12,y:o.y+12,vx:6,vy:-6},
                {x:o.x+12,y:o.y+12,vx:-6,vy:4},
                {x:o.x+12,y:o.y+12,vx:6,vy:4},
              ];
            }
          }
          if(o.otype==="crystalMine"&&o._exploding){
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=0.3*dt;
              return b.x>-20&&b.y<GROUND_Y;
            });
            if(o.bullets.length===0) o._exploding=2; // fully done
          }
          return o.x>-100 && o._exploding!==2;
        });

        const magnetRange=gs.activePowerups.magnet_pw?(180+gs.stats.magnetRngBonus):(gs.stats.magnetLevel>0?55+gs.stats.magnetLevel*28:0);
        // Brachio passive: +120px magnet range
        const brachioMagnet = designId==="brachio" ? 60 : 0;
        const effectiveMagnet = magnetRange + brachioMagnet;

        gs.pickups=gs.pickups.filter(p=>{
          p.x-=effSpeed*dt;
          if(effectiveMagnet>0){
            const dx=gs.dino.x+DINO_W/2-(p.x+7),dy=gs.dino.y+DINO_H/2-(p.y+7);
            const d=Math.sqrt(dx*dx+dy*dy);
            if(d<effectiveMagnet&&d>1){p.x+=dx/d*effSpeed*2.2*dt;p.y+=dy/d*effSpeed*2.2*dt;}
          }
          return p.x>-24&&!p.collected;
        });
        gs.powerupPickups=gs.powerupPickups.filter(p=>{p.x-=effSpeed*dt;return p.x>-32&&!p.collected;});
        for(const c of gs.clouds){c.x-=(c.speed||0.25)*dt;if(c.x<-100) c.x=CANVAS_W+100;}

        // ── Hitboxes ─────────────────────────────────────────────────────────
        const effH=gs.dino.ducking?DUCK_H:DINO_H;
        const sc=hasGiant?1.9:hasTiny?0.6:1;
        const DW=(DINO_W-14)*sc, DH=effH*0.82*sc;
        const DX=gs.dino.x+DINO_W/2-DW/2, DY=gs.dino.y+DINO_H-effH*sc;

        // Tri: horn burst handled by timed passive above

        // ── Bullet collision (separate from obstacle body) ───────────────────
        // Giant mode: silently destroy all projectiles, no fossils awarded
        if(hasGiant||hasSpdPw){
          for(const o of gs.obstacles){
            if(o.bullets&&o.bullets.length>0){
              o.bullets=o.bullets.filter(b=>!rectsOverlap(DX,DY,DW,DH,b.x,b.y,8,4));
            }
          }
        }
        if(!hasGhost&&!hasGiant&&!hasSpdPw&&gs.dino.invTimer<=0&&!(designId==="dilopho"&&gs.dilophoPhaseActive>0)){
          for(const o of gs.obstacles){
            if((o.otype!=="turret"&&o.otype!=="scorpion"&&o.otype!=="yeti"&&o.otype!=="lavaburst"&&o.otype!=="demon"&&o.otype!=="gorilla"&&o.otype!=="statue"&&o.otype!=="golem"&&o.otype!=="crystalGolem"&&o.otype!=="crystalMine")||!o.bullets) continue;
            for(let bi=o.bullets.length-1;bi>=0;bi--){
              const b=o.bullets[bi];
              if(rectsOverlap(DX,DY,DW,DH,b.x,b.y,8,4)){
                o.bullets.splice(bi,1);
                if(gs.activePowerups.shield_pw){
                  gs.shieldHitsLeft--; if(gs.shieldHitsLeft<=0) delete gs.activePowerups.shield_pw;
                  gs.dino.invTimer=20+gs.stats.invFramesBonus; gs.hitTaken=true;
                } else if(gs.stats.shieldChance>Math.random()){
                  gs.dino.invTimer=20+gs.stats.invFramesBonus; gs.hitTaken=true;
                } else if(gs.lives>1){
                  gs.lives--; gs.dino.invTimer=30+gs.stats.invFramesBonus; gs.hitTaken=true;
                  addFloat(gs,"-1 LIFE",gs.dino.x,gs.dino.y-24,"#ee3344");
                } else {
                  gs.hitTaken=true; endGame(gs); return;
                }
                break;
              }
            }
          }
        }

        // Giant / speed crush
        if(hasGiant||hasSpdPw){
          const giantBonusPerKill = designId==="trex" ? 5 : 4;
          gs.obstacles=gs.obstacles.filter(o=>{
            const hb=getObstacleHitbox(o);
            if(rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h)){
              gs.fossilsEarned+=giantBonusPerKill; gs.giantCrushes++;
              if(o.bullets) o.bullets=[];
              addFloat(gs,`+${giantBonusPerKill}`,hb.x+hb.w/2,hb.y-10,"#cc4400");
              return false;
            }
            return true;
          });
        } else if(!hasGhost){
          for(let i=gs.obstacles.length-1;i>=0;i--){
            const o=gs.obstacles[i];
            const hb=getObstacleHitbox(o);

            // Dilopho passive: phase through everything when active
            if(designId==="dilopho"&&gs.dilophoPhaseActive>0) continue;

            // Anky passive: near miss destroys obstacle
            if(designId==="anky"&&!rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h)&&
               rectsOverlap(DX,DY,DW,DH,hb.x-12,hb.y-8,hb.w+24,hb.h+16)){
              gs.obstacles.splice(i,1);
              addFloat(gs,"CLUB SWEEP!",hb.x,hb.y-10,"#ffaa00");
              gs.nearMissCount++;
              continue;
            }

            // Near miss detection
            if(!rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h)&&
               rectsOverlap(DX,DY,DW,DH,hb.x-12,hb.y-8,hb.w+24,hb.h+16)&&gs.nearMissTimer<=0){
              gs.nearMissTimer=38; gs.nearMissCount++;
              if(gs.stats.nearMissBonus>0){
                gs.fossilsEarned+=gs.stats.nearMissBonus;
                addFloat(gs,`NR MISS +${gs.stats.nearMissBonus}`,gs.dino.x-8,gs.dino.y-22,"#ffaa00");
              }
            }

            // Collision
            if(gs.dino.invTimer<=0&&rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h)){
              if(gs.activePowerups.shield_pw){
                gs.shieldHitsLeft--; if(gs.shieldHitsLeft<=0) delete gs.activePowerups.shield_pw;
                gs.obstacles.splice(i,1); gs.dino.invTimer=20+gs.stats.invFramesBonus; gs.hitTaken=true;
              } else if(gs.stats.shieldChance>Math.random()){
                gs.obstacles.splice(i,1); gs.dino.invTimer=20+gs.stats.invFramesBonus; gs.hitTaken=true;
              } else if(gs.lives>1){
                gs.lives--;
                gs.obstacles.splice(i,1);
                gs.dino.invTimer=30+gs.stats.invFramesBonus; gs.hitTaken=true;
                addFloat(gs,"-1 LIFE",gs.dino.x,gs.dino.y-24,"#ee3344");
              } else {
                gs.hitTaken=true; endGame(gs); return;
              }
              break;
            }
          }
        }

        // ── Collect bones ────────────────────────────────────────────────────
        const nightM  = 1+(gs.nightBlend*gs.stats.nightBonus);
        const frenzyM = hasFrenzy?3:1;
        const doubM   = hasDoubler?2:1;
        // Raptor speed rush: +3% per milestone
        const raptorM = designId==="raptor" ? 1+(gs.raptorSpeedBonus*0.005) : 1;

        for(const p of gs.pickups){
          if(!p.collected&&rectsOverlap(DX,DY,DW,DH,p.x,p.y,14,14)){
            p.collected=true; gs.combo++; gs.comboTimer=120;
            if(gs.combo>gs.maxComboThisRun) gs.maxComboThisRun=gs.combo;
            // Para passive: combo timer 25% longer, cap combo at 20
            if(designId==="para"){ gs.comboTimer=150; if(gs.combo>20) gs.combo=20; }
            // Pterodac passive: airborne pickups worth 1.5x
            const pteroM = (designId==="pterodac"&&!gs.dino.onGround) ? 1.5 : 1;
            const earned=gs.stats.fossilMult*(1+gs.combo*(0.08+gs.stats.comboBonus))*nightM*frenzyM*doubM*raptorM*pteroM*1.3;
            gs.fossilsEarned+=earned;
          }
        }
        for(const p of gs.powerupPickups){
          if(!p.collected&&rectsOverlap(DX,DY,DW,DH,p.x,p.y,22,22)){
            p.collected=true;
            const def=p.def;
            if(def.id==="shield_pw"){gs.activePowerups.shield_pw={timer:Infinity,duration:0};gs.shieldHitsLeft=gs.stats.shieldHits;}
            else if(def.id==="meteor_pw"){gs.activePowerups.meteor_pw={timer:1,duration:1,fired:false};}
            else if(def.id==="heart_pw"){
              if(gs.lives<4){gs.lives++;addFloat(gs,"+1 LIFE!",gs.dino.x-10,gs.dino.y-28,"#dd2244");}
              else{const b=Math.floor(20*gs.stats.fossilMult);gs.fossilsEarned+=b;addFloat(gs,`FULL HP +${b}`,gs.dino.x-10,gs.dino.y-28,"#ffdd44");}
            }
            else{
              const dBonus=def.id==="giant_pw"?gs.stats.giantDurBonus
                :def.id==="frenzy_pw"?gs.stats.frenzyDurBonus
                :def.id==="ghost_pw"?gs.stats.ghostDurBonus
                :def.id==="tiny_pw"?gs.stats.tinyDurBonus
                :def.id==="doubler_pw"?gs.stats.doublerDurBonus
                :def.id==="slowmo_pw"?gs.stats.slowDurBonus
                :def.id==="coinmania_pw"?gs.stats.windfallDurBonus
                :0;
              gs.activePowerups[def.id]={timer:def.duration+dBonus,duration:def.duration+dBonus};
            }
            if(def.id!=="heart_pw") addFloat(gs,def.label+"!",CANVAS_W/2-28,96,def.color);
            // Track powerup use
            gs.powerupUseLog = gs.powerupUseLog || {};
            gs.powerupUseLog[def.id] = (gs.powerupUseLog[def.id]||0)+1;
            gs.totalPowerupUsesThisRun = (gs.totalPowerupUsesThisRun||0)+1;
          }
        }

        gs.fossilsEarned+=gs.speed*0.0015*gs.stats.fossilMult*nightM*frenzyM*doubM*raptorM*dt;
        gs.floatingTexts=gs.floatingTexts.filter(t=>{t.y+=t.vy*dt;t.life-=dt;return t.life>0;});
        gs.passiveEffects=gs.passiveEffects.filter(e=>{e.life+=dt;return e.life<e.maxLife;});

        // ── Entity silhouette update ─────────────────────────────────────────
        const ent = gs.entity;
        if(!ent.visible) {
          // 1% chance per ~60 frames (once per second check)
          if(gs.frame % 60 === 0 && Math.random() < 0.01) {
            ent.visible = true;
            ent.fadeDir = 1;
            ent.x = CANVAS_W * (0.5 + Math.random() * 0.35);
            ent.y = 30 + Math.random() * 40;
          }
        } else {
          if(ent.fadeDir === 1) {
            ent.alpha = Math.min(0.72, ent.alpha + 0.012 * dt);
            if(ent.alpha >= 0.72) { ent.fadeDir = 0; ent.timer = 180 + Math.random() * 240; }
          } else if(ent.fadeDir === 0) {
            ent.timer -= dt;
            if(ent.timer <= 0) ent.fadeDir = -1;
          } else {
            ent.alpha = Math.max(0, ent.alpha - 0.002 * dt);
            if(ent.alpha <= 0) ent.visible = false;
          }
        }
      }

      // ══╁ERENDER ════════════════════════════════════════════════════════════
      const B   = gs.nightBlend;
      const SCN = gs.scenery||SCENERIES[0];
      const SC  = getSceneryColors(SCN,B);

      ctx.fillStyle=SC.bg; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      if(B>0.05) drawStars(ctx,gs.stars,B);
      drawPixelSun(ctx,gs.sunX,gs.sunY,gs.sunAlpha);
      drawPixelMoon(ctx,gs.moonX,gs.moonY,gs.moonAlpha);
      drawClouds(ctx,gs.clouds,SCN);
      if(gs.entity.alpha>0) drawEntitySilhouette(ctx,gs.entity.x,gs.entity.y,gs.frame,gs.entity.alpha,SCN);
      drawGround(ctx,gs.groundOffset,SCN,B);

      for(const o of gs.obstacles){ o._nightBlend=B; }
      for(const o of gs.obstacles) drawObstacleForScenery(ctx,o,SCN,gs.frame);

      const HUD = getHudColors(SCN, B);
      for(const p of gs.pickups){ if(!p.collected) drawBonePickup(ctx,p.x,p.y,HUD.bonePick); }

      for(const p of gs.powerupPickups){
        if(!p.collected){
          const pulse=0.8+Math.sin(gs.frame*0.14)*0.2;
          ctx.save(); ctx.globalAlpha=pulse;
          drawPowerupIcon(ctx,p.def.id,p.x,p.y,p.def.color);
          ctx.restore();
        }
      }

      // Powerup overlays
      const hasSpdPwR  = !!gs.activePowerups.speed_pw;
      const hasGiantR  = !!gs.activePowerups.giant_pw;
      const hasGhostR  = !!gs.activePowerups.ghost_pw;
      const hasSlowPwR = !!gs.activePowerups.slowmo_pw;
      const hasFrenzyR = !!gs.activePowerups.frenzy_pw;
      const hasDoublerR= !!gs.activePowerups.doubler_pw;
      const hasTinyR   = !!gs.activePowerups.tiny_pw;

      if(gs.activePowerups.shield_pw){
        ctx.strokeStyle="#4488dd";ctx.lineWidth=2;ctx.beginPath();
        ctx.arc(gs.dino.x+DINO_W/2,gs.dino.y+DINO_H/2,DINO_W,0,Math.PI*2);ctx.stroke();
      }
      if(hasSpdPwR){const sc2=gs.skin?.color||"#2a2a2a";for(let i=1;i<=4;i++){ctx.fillStyle=sc2;ctx.globalAlpha=0.1;ctx.fillRect(gs.dino.x-i*14,gs.dino.y+4,DINO_W,DINO_H-8);}ctx.globalAlpha=1;}
      for(const e of gs.passiveEffects) drawPassiveEffect(ctx,e.type,e.x,e.y,gs.frame,e.life/e.maxLife);
      if(hasSlowPwR){ctx.fillStyle="rgba(34,187,170,0.06)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
      if(hasGiantR){ctx.fillStyle="rgba(200,68,0,0.07)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
      if(hasGhostR){ctx.fillStyle="rgba(136,136,200,0.07)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
      if(hasFrenzyR){ctx.fillStyle=`rgba(220,30,100,${0.04+Math.sin(gs.frame*0.18)*0.03})`;ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
      if(hasDoublerR){ctx.fillStyle="rgba(255,220,30,0.06)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}

      // Draw dino  Epass onGround so legs freeze mid-air
      drawDino(ctx,gs.dino.x,gs.dino.y,gs.frame,gs.dino.dead,
        gs.skin,gs.design,hasGiantR,gs.dino.ducking,hasTinyR,hasGhostR,
        gs.dino.invTimer, gs.dino.onGround, gs.deathAnim);

      // Floating texts
      for(const t of gs.floatingTexts){
        const a=Math.min(1,t.life/t.maxLife*2);
        ctx.globalAlpha=a; ctx.fillStyle=t.color; ctx.font="bold 11px 'Courier New'";
        ctx.fillText(t.text,t.x,t.y); ctx.globalAlpha=1;
      }

      // HUD
      ctx.font="bold 14px 'Courier New'"; ctx.fillStyle=HUD.hud;
      ctx.textAlign="right";
      ctx.fillText(`${Math.floor(gs.distance)}m`,CANVAS_W-8,24);
      ctx.textAlign="left";
      drawFossilDiamond(ctx,10+13/2,8+13/2,13,HUD.fossil);
      ctx.font="bold 13px 'Courier New'"; ctx.fillStyle=HUD.hud;
      ctx.fillText(`${Math.floor(gs.fossilsEarned)}`,28,20);

      // Hearts
      if(gs.lives>0){
        const heartSize=14,heartGap=4;
        const totalW=gs.lives*(heartSize+heartGap)-heartGap;
        const startX=CANVAS_W-totalW-8,heartY=CANVAS_H-heartSize-8;
        for(let i=0;i<gs.lives;i++) drawHeart(ctx,startX+i*(heartSize+heartGap),heartY,heartSize,HUD.heart);
      }

      // Combo
      if(gs.combo>1){
        ctx.fillStyle=HUD.hud;ctx.font="11px 'Courier New'";
        ctx.fillText(`x${gs.combo} COMBO`,12,40);
      }

      // Active dino passive indicator
      const designId2 = gs.design?.id || "raptor";
      const passive = DINO_PASSIVES[designId2];
      if(passive){
        ctx.fillStyle=HUD.hud; ctx.globalAlpha=0.55;
        ctx.font="9px 'Courier New'";
        ctx.fillText(`[${passive.label}]`,12,54);
        ctx.globalAlpha=1;
      }

      // Day/night label
      if(B>0.08&&B<0.92){
        const lbl=gs.inNight?"DUSK":"DAWN";
        const a=Math.sin(gs.frame*0.07)*0.3+0.55;
        ctx.fillStyle=`rgba(180,160,80,${a})`;ctx.font="bold 10px 'Courier New'";
        ctx.textAlign="center";ctx.fillText(lbl,CANVAS_W/2,24);ctx.textAlign="left";
      }

      // Dash cooldown bar
      if((gs.stats.hasDash||gs.stats.hasBackDash)&&gs.dino.dashCooldown>0){
        const baseCd=Math.max(15,45-gs.stats.dashCdReduction);
        const frac=gs.dino.dashCooldown/baseCd;
        ctx.fillStyle="rgba(0,0,0,0.22)";ctx.fillRect(gs.dino.x,gs.dino.y-8,DINO_W,3);
        ctx.fillStyle="#ffaa44";ctx.fillRect(gs.dino.x,gs.dino.y-8,Math.floor(DINO_W*(1-frac)),3);
      }

      // Powerup bars
      let barY=44;
      for(const [pid,p] of Object.entries(gs.activePowerups)){
        const def=POWERUP_DEFS.find(d=>d.id===pid);
        if(!def) continue;
        if(def.duration>0&&p.duration>0){
          const frac=Math.max(0,p.timer/p.duration);
          ctx.fillStyle="rgba(0,0,0,0.22)";ctx.fillRect(CANVAS_W-88,barY,76,6);
          ctx.fillStyle=def.color;ctx.fillRect(CANVAS_W-88,barY,Math.floor(76*frac),6);
          ctx.fillStyle=HUD.hud;ctx.font="9px 'Courier New'";
          ctx.fillText(def.label,CANVAS_W-88,barY+17);barY+=20;
        } else if(def.duration===0){
          ctx.fillStyle=def.color;ctx.font="bold 9px 'Courier New'";
          ctx.fillText(`[${def.label}] x${gs.shieldHitsLeft}`,CANVAS_W-92,barY+8);barY+=16;
        }
      }

      // Raptor speed rush indicator
      if(designId2==="raptor"&&gs.raptorSpeedBonus>0){
        ctx.fillStyle=HUD.hud;ctx.font="9px 'Courier New'";
        ctx.fillText(`RUSH +${(gs.raptorSpeedBonus*0.5).toFixed(1)}% (${gs.raptorSpeedBonus}/20)`,12,68);
      }

      animRef.current=requestAnimationFrame(loop);
    };

    lastTimeRef.current=null;
    animRef.current=requestAnimationFrame(loop);
    return ()=>{ if(animRef.current) cancelAnimationFrame(animRef.current); };
  },[screen,doJump]);

  // ─── BUY FUNCTIONS ───────────────────────────────────────────────────────
  const buyUpgrade = useCallback((up)=>{
    setFossils(cur=>{
      const level=upgradeLevels[up.id]||0;
      if(level>=up.maxLevel){showNotif("Already maxed!");return cur;}
      const cost=getUpgradeCost(up,level);
      if(cur<cost){showNotif("Not enough bones!");return cur;}
      setUpgradeLevels(prev=>({...prev,[up.id]:(prev[up.id]||0)+1}));
      setAchievStats(prev=>{
        const nu=prev.totalUpgrades+1;
        const mvIds=["jump","dblJump","dash","backdash","fastdrop","duck","dashCd"];
        const allMax=mvIds.every(id=>(upgradeLevels[id]||0)>=(UPGRADES.find(u=>u.id===id)?.maxLevel||1));
        return {...prev,totalUpgrades:nu,allMovementMax:allMax};
      });
      showNotif(`${up.label} upgraded!`);
      return +(cur-cost).toFixed(1);
    });
  },[upgradeLevels,showNotif]);

  const buySkin = useCallback((sk)=>{
    if(ownedSkins.includes(sk.id)){setEquippedSkin(sk.id);showNotif(`${sk.label} equipped!`);return;}
    setFossils(cur=>{
      if(cur<sk.cost){showNotif("Not enough bones!");return cur;}
      setOwnedSkins(p=>[...p,sk.id]); setEquippedSkin(sk.id);
      setAchievStats(prev=>({...prev,ownedSkins:prev.ownedSkins+1}));
      showNotif(`${sk.label} skin unlocked!`);
      return cur-sk.cost;
    });
  },[ownedSkins,showNotif]);

  const buyDesign = useCallback((d)=>{
    if(ownedDesigns.includes(d.id)){setEquippedDesign(d.id);showNotif(`${d.label} equipped!`);return;}
    if(d.unlockDist&&bestDist<d.unlockDist){showNotif(`Reach ${d.unlockDist}m to unlock!`);return;}
    if(d.cost>0){
      setFossils(cur=>{
        if(cur<d.cost){showNotif("Not enough bones!");return cur;}
        setOwnedDesigns(p=>[...p,d.id]); setEquippedDesign(d.id);
        showNotif(`${d.label} unlocked!`);
        return cur-d.cost;
      });
    } else {
      setOwnedDesigns(p=>[...p,d.id]); setEquippedDesign(d.id);
      showNotif(`${d.label} unlocked!`);
    }
  },[ownedDesigns,bestDist,showNotif]);

  const buyScenery = useCallback((s)=>{
    if(ownedSceneries.includes(s.id)){setActiveScenery(s.id);showNotif(`${s.label} activated!`);return;}
    setFossils(cur=>{
      if(cur<s.cost){showNotif("Not enough bones!");return cur;}
      setOwnedSceneries(p=>[...p,s.id]); setActiveScenery(s.id);
      setAchievStats(prev=>({...prev,ownedSceneries:prev.ownedSceneries+1}));
      showNotif(`${s.label} unlocked!`);
      return cur-s.cost;
    });
  },[ownedSceneries,showNotif]);

  const unlockPowerup = useCallback((def)=>{
    if(unlockedPowerups.includes(def.id)){showNotif(`${def.label} already unlocked!`);return;}
    setFossils(cur=>{
      if(cur<def.unlockCost){showNotif("Not enough bones!");return cur;}
      setUnlockedPowerups(p=>[...p,def.id]);
      showNotif(`${def.label} powerup unlocked!`);
      return cur-def.unlockCost;
    });
  },[unlockedPowerups,showNotif]);

  const stats=getStats(upgradeLevels);

  // ─── ABYSS UNLOCK ────────────────────────────────────────────────────────
  const abyssUnlocked = REGULAR_SCENERY_IDS.every(id => ownedSceneries.includes(id));

  const startBossFight = useCallback(() => {
    setScreen("bossfight");
  }, []);

  // Bite skill derived from upgrades
  const hasBiteSkill = (upgradeLevels.bite || 0) >= 1;

  // ─── STYLES ──────────────────────────────────────────────────────────────
  const F      = "'Courier New', monospace";
  const BG     = "#f0ede6";
  const DARK   = "#1a1a1a";
  const BORDER = "#2a2a2a";
  const MUTED  = "#888";

  const outer={minHeight:"100vh",background:BG,fontFamily:F,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",userSelect:"none",boxSizing:"border-box",width:"100%",overflowX:"hidden"};
  const wrap=(maxW=560)=>({width:"100%",maxWidth:maxW,padding:"20px 16px",boxSizing:"border-box",margin:"0 auto"});
  const btn=(primary=false,small=false)=>({background:primary?DARK:BG,color:primary?BG:DARK,border:`2px solid ${BORDER}`,padding:small?"5px 12px":"10px 20px",fontSize:small?10:12,fontFamily:F,cursor:"pointer",letterSpacing:2,fontWeight:"bold",boxSizing:"border-box",transition:"opacity 0.1s"});
  const notifBox={position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:DARK,color:BG,padding:"9px 22px",fontSize:11,letterSpacing:2,zIndex:999,whiteSpace:"nowrap",border:`1px solid #555`};
  const achivNotifBox={position:"fixed",top:24,left:"50%",transform:"translateX(-50%)",background:"#1a1a2a",color:"#ffdd44",padding:"10px 24px",fontSize:11,letterSpacing:2,zIndex:999,whiteSpace:"nowrap",border:`1px solid #ffdd44`};


  // ─── SCREENS ─────────────────────────────────────────────────────────────
  if(screen==="menu") return (
    <MenuScreen
      menuCanvasRef={menuCanvasRef}
      menuDinoClicks={menuDinoClicks} setMenuDinoClicks={setMenuDinoClicks}
      showCredit={showCredit} setShowCredit={setShowCredit}
      startGame={startGame} setScreen={setScreen}
      totalRuns={totalRuns} bestDist={bestDist} fossils={fossils} passiveRate={passiveRate}
      notification={notification} achivNotif={achivNotif}
      ownedSkins={ownedSkins} ownedDesigns={ownedDesigns} ownedSceneries={ownedSceneries}
      F={F} BG={BG} DARK={DARK} BORDER={BORDER} MUTED={MUTED}
    />
  );

  if(screen==="game"||screen==="gameover") return (
    <div style={{...outer,justifyContent:"center",padding:0}}>
      <div style={{width:"100%",maxWidth:CANVAS_W,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 4px",boxSizing:"border-box",fontFamily:F,fontSize:11,color:MUTED}}>
          <span style={{letterSpacing:3,fontSize:10}}>DINO REIMAGINED</span>
          <span style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:14,color:DARK}}>◈</span>
            <b style={{color:DARK,fontSize:13}}>{Math.floor(fossils)}</b>
          </span>
        </div>
        <div style={{border:`2px solid ${BORDER}`,lineHeight:0,width:"100%"}}>
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{display:"block",width:"100%"}}/>
          {screen==="gameover"&&(
            <GameOverScreen
              lastRun={lastRun}
              bestDist={bestDist}
              lastRunRank={lastRunRank}
              getSavedName={getSavedName}
              onRunAgain={startGame}
              onUpgrades={()=>setScreen("shop")}
              onMenu={()=>setScreen("menu")}
            />
          )}
        </div>
      </div>
      {notification&&<div style={notifBox}>{notification}</div>}
      {achivNotif&&<div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );

  if(screen==="shop") return (
    <ShopScreen
      fossils={fossils} passiveRate={passiveRate}
      shopTab={shopTab} setShopTab={setShopTab}
      upgradeLevels={upgradeLevels}
      unlockedPowerups={unlockedPowerups}
      buyUpgrade={buyUpgrade} unlockPowerup={unlockPowerup}
      stats={stats}
      startGame={startGame} setScreen={setScreen}
      notification={notification} achivNotif={achivNotif}
      abyssUnlocked={abyssUnlocked}
      startBossFight={startBossFight}
    />
  );

  if(screen==="skins") return (
    <SkinsScreen
      fossils={fossils} bestDist={bestDist}
      ownedSkins={ownedSkins} ownedDesigns={ownedDesigns} ownedSceneries={ownedSceneries}
      equippedSkin={equippedSkin} equippedDesign={equippedDesign} activeScenery={activeScenery}
      buySkin={buySkin} buyDesign={buyDesign} buyScenery={buyScenery}
      startGame={startGame} setScreen={setScreen}
      notification={notification} achivNotif={achivNotif}
    />
  );

  if(screen==="achievements") return (
    <AchievementsScreen
      unlockedAch={unlockedAch}
      notification={notification} achivNotif={achivNotif}
      onBack={()=>setScreen("menu")}
      F={F} BG={BG} DARK={DARK} BORDER={BORDER} MUTED={MUTED}
    />
  );

  if(screen==="leaderboard") return (
    <LeaderboardScreen
      lbData={lbData} setLbData={setLbData}
      lbLoading={lbLoading} setLbLoading={setLbLoading}
      onBack={()=>setScreen("menu")}
      showNotif={showNotif}
    />
  );

  if(screen==="bossfight") return (
    <BossFightScreen
      key={bossKey}
      skin={currentSkin}
      design={currentDesign}
      stats={{ ...stats, hasBite: hasBiteSkill }}
      lives={(equippedDesign==="trex"?2:1)+stats.extraLives}
      fossils={fossils}
      onWin={()=>{
        setFossils(f => f + 5000);
        setTotalFossils(f => f + 5000);
        showNotif("+5000 FOSSILS! The Horror Entity is defeated!");
        setScreen("menu");
      }}
      onDeath={()=>setBossKey(k => k + 1)}
      onMenu={()=>setScreen("menu")}
      notification={notification}
      achivNotif={achivNotif}
    />
  );

  return null;
}