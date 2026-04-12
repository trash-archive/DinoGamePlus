import { useState, useEffect, useRef, useCallback } from "react";
import { submitScore, fetchLeaderboard, fetchMapLeaderboard, fetchAllPlayerRanks } from "./leaderboard";
import { getSavedName, getPlayerId } from "./supabase";
import { useLocalStorage } from "./hooks/useLocalStorage";
import useCozyMusic from "./hooks/useCozyMusic";
import useSoundEffects, { playDashForward, playDashBack, playFastDrop, playDuckSlide } from "./hooks/useSoundEffects";
import { GRAVITY, JUMP_FORCE, JUMP_HOLD_FORCE, JUMP_HOLD_FRAMES, GROUND_Y, DINO_W, DINO_H, CANVAS_W, CANVAS_H, DAY_CYCLE, DUCK_H } from "./constants";
import { lerp, clamp, drawFossilDiamond } from "./utils/helpers";
import { getSceneryColors, getHudColors } from "./utils/scenery";
import { getObstacleHitbox, rectsOverlap } from "./utils/collision";
import { drawDino, drawHeart, drawShieldIcon, drawPassiveEffect, drawShieldOutline, drawSpeedRushOutline, drawPterodacFlyOutline, drawPachyHeadbuttOutline } from "./rendering/drawDino";
import { drawStego } from "./dinos/stego";
import { drawAnky }  from "./dinos/anky";
import { drawTri }   from "./dinos/tri";
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
import FeedbackScreen from "./FeedbackScreen";
import TouchButtons from "./TouchButtons";
import useHistoryNav from "./hooks/useHistoryNav";




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
  const { navigate, exitWarning } = useHistoryNav(screen, setScreen, ["menu", "game"]);
  const { muted: musicMuted, setMuted: setMusicMuted, volume: musicVolume, setVolume: setMusicVolume } = useCozyMusic(screen === "game" || screen === "gameover");
  const { playJump, playPoint, playDie } = useSoundEffects();
  const playJumpRef = useRef(playJump);
  useEffect(()=>{ playJumpRef.current = playJump; },[playJump]);
  const [fossils,        setFossils]        = useLocalStorage("dino_fossils", 0);
  const [totalFossils,   setTotalFossils]   = useLocalStorage("dino_totalFossils", 0);
  const [bestDist,       setBestDist]       = useLocalStorage("dino_bestDist", 0);
  const [totalRuns,      setTotalRuns]      = useLocalStorage("dino_totalRuns", 0);
  const [upgradeLevels,  setUpgradeLevels]  = useLocalStorage("dino_upgradeLevels", {});
  // Sanitize: clamp any stored level that exceeds its maxLevel (fixes corrupted saves)
  useEffect(() => {
    const clamped = { ...upgradeLevels };
    let dirty = false;
    UPGRADES.forEach(u => {
      if ((clamped[u.id] || 0) > u.maxLevel) { clamped[u.id] = u.maxLevel; dirty = true; }
    });
    if (dirty) setUpgradeLevels(clamped);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
  const [claimableAch,   setClaimableAch]   = useLocalStorage("dino_claimableAch", []);
  const [pendingAch,     setPendingAch]     = useState([]);
  const [achivNotif,     setAchivNotif]     = useState(null);
  const [unlockedPowerups, setUnlockedPowerups] = useLocalStorage("dino_unlockedPowerups", []);
  const [lbData,           setLbData]           = useState([]);
  const [lbLoading,        setLbLoading]        = useState(false);
  const [lastRunRank,      setLastRunRank]       = useState(null);

  const [bossKey,          setBossKey]           = useState(0);
  const [playerMenuRank,   setPlayerMenuRank]    = useState(null);
  const [allMenuRanks,     setAllMenuRanks]      = useState([]);
  const [displayRankIdx,   setDisplayRankIdx]    = useLocalStorage("dino_displayRankIdx", 0);
  const [touchButtonOpacity, setTouchButtonOpacity] = useLocalStorage("dino_touchButtonOpacity", 0.88);
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  const [touchButtons,     setTouchButtons]     = useLocalStorage("dino_touchButtons_v2", isTouchDevice);
  const [controlsToastSeen, setControlsToastSeen] = useLocalStorage("dino_controlsToastSeen", false);
  const [landscapeToastSeen, setLandscapeToastSeen] = useLocalStorage("dino_landscapeToastSeen", false);


  const getStats = useCallback((levels) => {
    const ul = levels || {};
    return {
      jumpBoost:      (ul.jump||0)*2.5,
      shieldChance:   (ul.shield||0)*0.06,
      speedReduction: (ul.speed||0)*0.08,
      hasMagnet:      (ul.magnet||0)>0,
      magnetLevel:    ul.magnet||0,
      hasDoubleJump:  (ul.dblJump||0)>0,
      hasDash:        (ul.dash||0)>0,
      hasBackDash:    (ul.backdash||0)>0,
      hasFastDrop:    (ul.fastdrop||0)>0,
      hasDuck:        (ul.duck||0)>0,
      dashCdReduction:(ul.dashCd||0)*10,
      fossilSenseMult: 1+(ul.fossil||0)*0.20,
      comboBonus:     (ul.combo||0)*0.12,
      extraLives:     ul.extraLife||0,
      invFramesBonus: (ul.invFrames||0)*8,
      nightBonus:     (ul.nightBonus||0)*0.25,
      transBonus:     (ul.transBonus||0)*0.25,
      speedBonusMult: (ul.speedBonus||0)*0.5,
      fossilValue:    1+(ul.fossilValue||0),
      fossilPickupMult: 1+(ul.fossilMult||0),
      runDripRate:    (ul.runDrip||0)*0.0003,
      passiveFossils: (ul.miner||0)*0.15+(ul.camp||0)*0.5+(ul.research||0)*1.5,
      shieldSpawnChance: (ul.pwShieldChance||0)*0.03,
      giantDurBonus:    (ul.pwGiantDur||0)*60,
      magnetRngBonus:   (ul.pwMagnetRng||0)*80,
      frenzyDurBonus:   (ul.pwFrenzyDur||0)*60,
      rareDrop:         (ul.powerupLuck||0)*0.05,
      heartChance:      (ul.pwHeartChance||0)*0.03,
      ghostDurBonus:    (ul.pwGhostDur||0)*60,
      tinyDurBonus:     (ul.pwTinyDur||0)*60,
      meteorDurBonus:  (ul.pwMeteorCount||0)*60,
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
      setAchievStats(prev=>({...prev, passiveEarned:prev.passiveEarned+gained}));
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
      setClaimableAch(prev=>[...prev,...ids]);
      setPendingAch(prev=>[...prev,...newUnlocked]);
    }
  },[achievStats, unlockedAch]);

  useEffect(()=>{
    if(pendingAch.length>0){
      const a=pendingAch[0];
      setAchivNotif(`${a.label} — Go claim your reward!`);
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

  // Fetch player's ranks across all boards for menu banner
  useEffect(()=>{
    if(screen!=="menu") return;
    const myId = getPlayerId();
    fetchAllPlayerRanks(myId).then(ranks => {
      setAllMenuRanks(ranks);
      // Clamp saved index in case ranks list shrank since last session
      setDisplayRankIdx(prev => Math.min(prev, Math.max(0, ranks.length - 1)));
      setPlayerMenuRank(ranks.length > 0 ? ranks[0].rank : null);
    });
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
             dashTimer:0, dashDir:0, dashCooldown:0, ducking:false, invTimer:0, jumpHoldTimer:0, jumpBuffer:0 },
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
      shieldHitsLeft:0,
      sunX:CANVAS_W+60, sunY:36, moonX:CANVAS_W+80, moonY:36,
      sunAlpha:1, moonAlpha:0,
      skin:currentSkin, design, scenery,
      maxComboThisRun:0, giantCrushes:0, usedDash:false, hitTaken:false,
      runStartTime: Date.now(),
      // Per-run passive state
      raptorSpeedBonus:0,    // raptor: distance milestones -> bone % (cap 10%)
      raptorOutlineTimer:0,  // frames to show green outline after milestone
      stegoFlashTimer:0,     // frames to show plate armor flash on proc
      pachyReviveUsed:false, // pachy: one free revive (legacy, kept for bullet hit)
      // Timed passive cooldowns (in frames)
      pterodacFlyTimer:0, pterodacFlyCooldown:30*60,   // fly 10s/30s — first lift after 30s
      ankyPulseTimer:0,                                 // pulse every 40s
      triHornTimer:0,                                   // horn burst every 30s
      triHorns:[],                                       // flying horn projectiles
      pachyHeadbuttTimer:0, pachyHeadbuttActive:0,      // headbutt 5s/30s
      dilophoPhaseTimer:0, dilophoPhaseActive:0,        // phase 7s/30s
      // Tri: first obstacle destroyed (legacy)
      triFirstDestroyed:false,
      // Spino: night bonus tracked in render
      // Entity silhouette state
      entity:{ x: CANVAS_W * 0.65, y: 60, alpha: 0, visible: false, timer: 0, fadeDir: 0 },
      meteorAnim: [],
      meteorSpawnTimer: 0,
    };
    keysRef.current={};
    prevKeysRef.current={};
    navigate("game");
  },[upgradeLevels, getStats, equippedSkin, equippedDesign, activeScenery, currentSkin, currentDesign]);

  const doJump = useCallback(()=>{
    const gs=gsRef.current;
    if(!gs||!gs.alive) return;
    if(gs.dino.ducking){gs.dino.ducking=false; return;}
    if(gs.dino.onGround){
      gs.dino.vy=JUMP_FORCE;
      gs.dino.onGround=false; gs.dino.doubleJumped=false;
      gs.dino.jumpHoldTimer=JUMP_HOLD_FRAMES+gs.stats.jumpBoost;
      playJump();
    } else if(gs.stats.hasDoubleJump&&!gs.dino.doubleJumped){
      gs.dino.vy=JUMP_FORCE;
      gs.dino.doubleJumped=true;
      gs.dino.jumpHoldTimer=JUMP_HOLD_FRAMES+gs.stats.jumpBoost;
      playJump();
    } else {
      // Buffer the jump for up to 8 frames in case we land shortly
      gs.dino.jumpBuffer = 8;
    }
  },[playJump]);

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

  const touchButtonsRef = useRef(touchButtons);
  useEffect(() => { touchButtonsRef.current = touchButtons; }, [touchButtons]);

  useEffect(()=>{
    if(screen!=="game") return;
    // When on-screen buttons are enabled, skip gesture handling — buttons cover all input
    if(touchButtonsRef.current) return;

    // Scale CSS pixel deltas to canvas pixel space so gesture thresholds
    // are consistent regardless of how small the canvas is rendered on screen.
    const getScale=()=>{
      const el=canvasRef.current;
      if(!el) return 1;
      return CANVAS_W / el.getBoundingClientRect().width;
    };

    const applyGesture=(cssDx,cssDy)=>{
      const scale=getScale();
      const dx=cssDx*scale, dy=cssDy*scale;
      const absDx=Math.abs(dx), absDy=Math.abs(dy);
      // Tap: tiny movement in canvas space → jump
      if(absDx<18&&absDy<18){ doJump(); return; }
      if(absDy>absDx){
        if(dy<0){ doJump(); }
        else{ keysRef.current["ArrowDown"]=true; setTimeout(()=>{keysRef.current["ArrowDown"]=false;},120); }
      } else {
        if(dx>0){ keysRef.current["ArrowRight"]=true; setTimeout(()=>{keysRef.current["ArrowRight"]=false;},80); }
        else    { keysRef.current["ArrowLeft"]=true;  setTimeout(()=>{keysRef.current["ArrowLeft"]=false;}, 80); }
      }
    };

    const onTouchStart=(e)=>{
      if(e.cancelable) e.preventDefault();
      touchStartRef.current={x:e.touches[0].clientX,y:e.touches[0].clientY};
      // Simulate Space keydown so the hold-jump logic runs every frame while finger is down
      keysRef.current["Space"]=true;
    };
    const onTouchEnd=(e)=>{
      if(e.cancelable) e.preventDefault();
      // Release the simulated Space key so jumpHoldTimer stops
      keysRef.current["Space"]=false;
      if(!touchStartRef.current) return;
      const dx=e.changedTouches[0].clientX-touchStartRef.current.x;
      const dy=e.changedTouches[0].clientY-touchStartRef.current.y;
      touchStartRef.current=null;
      applyGesture(dx,dy);
    };
    const onMouseDown=(e)=>{
      touchStartRef.current={x:e.clientX,y:e.clientY};
      keysRef.current["Space"]=true;
    };
    const onMouseUp=(e)=>{
      keysRef.current["Space"]=false;
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
      playDie();
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
      // Auto-submit run and check rank on both global and map boards
      const playerName = getSavedName();
      submitScore(playerName, dist, earned, gs.scenery?.id || null).then(async () => {
        const myId     = getPlayerId();
        const mapId    = gs.scenery?.id || null;
        const RUNNABLE_MAP_LABELS = {
          classic:"WASTELAND", plains:"GRASSLANDS", desert:"DESERT",
          arctic:"ARCTIC TUNDRA", volcano:"VOLCANIC RIFT",
          jungle:"DENSE JUNGLE", ruins:"ANCIENT RUINS", cave:"CRYSTAL CAVE",
        };

        const calcRank = (board, entry) => board.filter(r =>
          r.best_dist > entry.best_dist ||
          (r.best_dist === entry.best_dist && r.best_fossils > entry.best_fossils) ||
          (r.best_dist === entry.best_dist && r.best_fossils === entry.best_fossils && r.updated_at < entry.updated_at)
        ).length + 1;

        // Fetch both boards in parallel
        const [globalBoard, mapBoard] = await Promise.all([
          fetchLeaderboard(),
          mapId ? fetchMapLeaderboard(mapId) : Promise.resolve([]),
        ]);

        // Check global rank
        const globalEntry = globalBoard.find(r => r.player_id === myId && r.best_dist === dist && r.best_fossils === earned);
        const globalRank  = globalEntry ? calcRank(globalBoard, globalEntry) : null;

        // Check map rank
        const mapEntry = mapBoard.find(r => r.player_id === myId && r.best_dist === dist && r.best_fossils === earned);
        const mapRank  = mapEntry ? calcRank(mapBoard, mapEntry) : null;

        // Prefer global rank; fall back to map rank
        if (globalRank !== null) {
          setLastRunRank({ rank: globalRank, boardLabel: "GLOBAL" });
        } else if (mapRank !== null && mapId) {
          setLastRunRank({ rank: mapRank, boardLabel: RUNNABLE_MAP_LABELS[mapId] || mapId.toUpperCase() });
        } else {
          setLastRunRank(null);
        }
      });
      setTimeout(()=>setScreen("gameover"),450);
    };

    const loop=(ts)=>{
      if(!lastTimeRef.current) lastTimeRef.current=ts;
      const dt=Math.min((ts-lastTimeRef.current)/16.67,3);
      lastTimeRef.current=ts;
      const gs=gsRef.current;
      if(!gs) return;

      const k=keysRef.current, pk=prevKeysRef.current;
      const hasSpdPw   = false; // speed_pw removed — not in shop
      const hasSlowPw  = !!gs.activePowerups.slowmo_pw;
      // Ease back from slow-mo: ramp effSpeed multiplier from 0.38 → 1 over 120 frames
      if(!hasSlowPw && (gs.slowmoEaseTimer||0) > 0) gs.slowmoEaseTimer -= dt;
      if(hasSlowPw) gs.slowmoEaseTimer = 120;

      // Tick powerup timers first so all flags below reflect the current frame
      for(const [pid,p] of Object.entries(gs.activePowerups)){
        if(p.duration>0){p.timer-=dt; if(p.timer<=0) delete gs.activePowerups[pid];}
      }

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

        // ── Raptor passive: +0.5% per 500m, cap 10% (20 milestones) ──────────
        if(designId==="raptor"){
          const milestone=Math.min(20,Math.floor(gs.distance/500));
          if(milestone>gs.raptorSpeedBonus){
            gs.raptorSpeedBonus=milestone;
            gs.raptorOutlineTimer=180; // show outline for ~3s
            const pct=(milestone*0.5).toFixed(1);
            addFloat(gs,`SPEED RUSH! +${pct}% bones`,80,80,"#00cc66");
            addPassiveEffect(gs,"speedRush",gs.dino.x,gs.dino.y);
          }
          if(gs.raptorOutlineTimer>0) gs.raptorOutlineTimer-=dt;
        }

        // ── Timed passives (60fps base) ──────────────────────────────────────
        const FPS60 = 60; // timers in frames at ~60fps
        if(designId==="pterodac"){
          if(gs.pterodacFlyTimer>0){
            gs.pterodacFlyTimer-=dt;
            // Free flight: vertical by up/down, horizontal dash still works
            const flyUp   = k["Space"]||k["ArrowUp"]||k["KeyW"];
            const flyDown = k["ArrowDown"]||k["KeyS"];
            const flySpeed = 3.5;
            if(flyUp)   gs.dino.y = Math.max(10,              gs.dino.y - flySpeed*dt);
            if(flyDown) gs.dino.y = Math.min(GROUND_Y-DINO_H, gs.dino.y + flySpeed*dt);
            gs.dino.vy = 0;
            gs.dino.onGround = false;
            // Dash works during fly mode
            if(gs.dino.invTimer>0) gs.dino.invTimer-=dt;
            if(gs.dino.dashCooldown>0) gs.dino.dashCooldown-=dt;
            const flyDashCd = Math.max(15,45-gs.stats.dashCdReduction);
            if(gs.stats.hasDash&&k["ArrowRight"]&&!pk["ArrowRight"]&&gs.dino.dashTimer<=0&&gs.dino.dashCooldown<=0){
              gs.dino.dashTimer=10; gs.dino.dashDir=1; gs.dino.dashCooldown=flyDashCd; gs.usedDash=true;
              playDashForward();
            }
            if(gs.stats.hasBackDash&&k["ArrowLeft"]&&!pk["ArrowLeft"]&&gs.dino.dashTimer<=0&&gs.dino.dashCooldown<=0){
              gs.dino.dashTimer=10; gs.dino.dashDir=-1; gs.dino.dashCooldown=flyDashCd; gs.usedDash=true;
              playDashBack();
            }
            if(gs.dino.dashTimer>0){
              gs.dino.x+=gs.dino.dashDir*7*dt;
              gs.dino.dashTimer-=dt;
              gs.dino.x=Math.max(10, Math.min(CANVAS_W-60, gs.dino.x));
            }
            if(gs.pterodacFlyTimer<=0)
              addFloat(gs,"FLY MODE ENDED",gs.dino.x-20,gs.dino.y-28,"#44aaff");
          } else {
            if(gs.pterodacFlyCooldown>0){
              gs.pterodacFlyCooldown-=dt;
            } else {
              gs.pterodacFlyTimer  = 10*FPS60;
              gs.pterodacFlyCooldown = 30*FPS60;
              addFloat(gs,"FLY MODE!",gs.dino.x-10,gs.dino.y-28,"#44aaff");
            }
          }
        }
        if(designId==="anky"){
          gs.ankyPulseTimer=(gs.ankyPulseTimer||0)+dt;
          if(gs.ankyPulseTimer>=15*FPS60){
            gs.ankyPulseTimer=0;
            const before=gs.obstacles.length;
            // Clear ALL obstacles and their bullets on screen
            gs.obstacles=gs.obstacles.filter(o=>{
              const hb=getObstacleHitbox(o);
              const dx=hb.x+hb.w/2-(gs.dino.x+DINO_W/2);
              const dy=hb.y+hb.h/2-(gs.dino.y+DINO_H/2);
              if(Math.sqrt(dx*dx+dy*dy)<=220){
                if(o.bullets) o.bullets=[];
                return false;
              }
              return true;
            });
            const cleared=before-gs.obstacles.length;
            if(cleared>0) addFloat(gs,`PULSE WAVE! x${cleared}`,gs.dino.x-20,gs.dino.y-36,"#ffaa00");
            else addFloat(gs,"PULSE WAVE!",gs.dino.x-20,gs.dino.y-36,"#ffaa00");
            addPassiveEffect(gs,"pulseWave",gs.dino.x,gs.dino.y);
            gs.ankyFlashTimer = 50;
          }
          if((gs.ankyFlashTimer||0)>0) gs.ankyFlashTimer-=dt;
        }
        if(designId==="tri"){
          gs.triHornTimer=(gs.triHornTimer||0)+dt;
          if(gs.triHornTimer>=20*FPS60){
            gs.triHornTimer=0;
            // Destroy all obstacles AND their bullets on screen
            const cleared=gs.obstacles.length;
            gs.obstacles.forEach(o=>{ if(o.bullets) o.bullets=[]; });
            gs.obstacles=[];
            if(cleared>0) addFloat(gs,`HORN BURST! x${cleared}`,gs.dino.x-20,gs.dino.y-36,"#cc8800");
            else addFloat(gs,"HORN BURST!",gs.dino.x-20,gs.dino.y-36,"#cc8800");
            // Launch 5 horn projectiles in spread pattern
            gs.triHorns = [
              { x:gs.dino.x+36, y:gs.dino.y+10, vx:18, vy:0    },  // straight forward
              { x:gs.dino.x+36, y:gs.dino.y+10, vx:15, vy:-8   },  // up-right
              { x:gs.dino.x+36, y:gs.dino.y+10, vx:15, vy: 8   },  // down-right
              { x:gs.dino.x+36, y:gs.dino.y+10, vx:11, vy:-14  },  // steep up
              { x:gs.dino.x+36, y:gs.dino.y+10, vx:11, vy: 14  },  // steep down
            ];
            gs.triFlashTimer=50;
          }
          if((gs.triFlashTimer||0)>0) gs.triFlashTimer-=dt;
          // Move horn projectiles
          if(gs.triHorns && gs.triHorns.length>0){
            gs.triHorns = gs.triHorns.filter(h=>{
              h.x += h.vx * dt;
              h.y += h.vy * dt;
              return h.x < CANVAS_W + 20 && h.y > -20 && h.y < CANVAS_H + 20;
            });
          }
        }
        if(designId==="pachy"){
          if(gs.pachyHeadbuttActive>0){
            gs.pachyHeadbuttActive-=dt;
            // Destroy obstacles/bullets in front (within 160px ahead)
            gs.obstacles=gs.obstacles.filter(o=>{
              const hb=getObstacleHitbox(o);
              if(hb.x>gs.dino.x-10&&hb.x<gs.dino.x+160){
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
              gs.passiveEffects.push({type:"headbutt",x:gs.dino.x,y:gs.dino.y,life:0,maxLife:5*FPS60});
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
              gs.dilophoPhaseActive=7*FPS60;
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

        // Sun travels right→left across the day half (cyclePos 0..DAY_CYCLE)
        const sunT = clamp(cyclePos / DAY_CYCLE, 0, 1);
        gs.sunX = CANVAS_W + 60 - sunT * (CANVAS_W + 120);
        gs.sunAlpha = clamp(1 - gs.nightBlend * 2.2, 0, 1);

        // Moon travels right→left across the night half (cyclePos DAY_CYCLE..cycleLen)
        const moonT = cyclePos >= DAY_CYCLE ? clamp((cyclePos - DAY_CYCLE) / DAY_CYCLE, 0, 1) : 0;
        gs.moonX = cyclePos >= DAY_CYCLE ? CANVAS_W + 60 - moonT * (CANVAS_W + 120) : CANVAS_W + 80;
        gs.moonAlpha = clamp((gs.nightBlend - 0.3) * 3.5, 0, 1);
        gs.sunY=36; gs.moonY=36;

        const isNightNow=targetBlend>0.5;
        if(isNightNow!==gs.inNight){
          gs.inNight=isNightNow;
          if(isNightNow) gs.nightCycleCount++;
          const baseB=25+Math.floor(gs.distance/80)*4;
          // Spino passive: +30% night bonus
          const spinoMult = designId==="spino" && isNightNow ? 1.50 : 1;
          const bonus=Math.floor(baseB*(1+gs.stats.transBonus)*spinoMult);
          gs.fossilsEarned+=bonus;
          addFloat(gs,`+${bonus} ${isNightNow?"DUSK BONUS":"DAWN BONUS"}`,CANVAS_W/2-50,70,isNightNow?"#aaaaff":"#ffdd44");
          // Spino passive: bonus fossils for surviving a full night cycle
          if(!isNightNow && designId==="spino"){
            const spinoCycleBonus = Math.floor(15 + gs.distance * 0.04);
            gs.fossilsEarned += spinoCycleBonus;
            addFloat(gs,`+${spinoCycleBonus} SAIL CYCLE!`,CANVAS_W/2-50,90,"#88aaff");
          }
          if(!isNightNow){ gs.moonAlpha=0; }
        }

        // ── Powerup ticks ────────────────────────────────────────────────────
        // (timers already ticked at top of loop before flag reads)
        if(hasWind){
          gs.coinManiaTimer-=dt;
          if(gs.coinManiaTimer<=0){
            gs.pickups.push({x:gs.dino.x+60+Math.random()*200, y:GROUND_Y-24-Math.random()*100, collected:false});
            gs.coinManiaTimer=7;
          }
        }
        // Meteor rain: spawn falling meteors periodically while active
        if(gs.activePowerups.meteor_pw){
          gs.meteorSpawnTimer = (gs.meteorSpawnTimer||0) + dt;
          if(gs.meteorSpawnTimer >= 12){
            gs.meteorSpawnTimer = 0;
            const mx = 20 + Math.random() * (CANVAS_W - 40);
            gs.meteorAnim = gs.meteorAnim || [];
            gs.meteorAnim.push({ x:mx, y:-20, vy:14+Math.random()*8, vx:(Math.random()-0.5)*2 });
          }
        } else {
          gs.meteorSpawnTimer = 0;
        }
        // Update falling meteors
        if(gs.meteorAnim && gs.meteorAnim.length > 0){
          gs.meteorAnim = gs.meteorAnim.filter(ma => {
            ma.y += ma.vy;
            ma.x += ma.vx;
            ma.vy += 0.8;
            if(ma.y >= GROUND_Y){
              // On impact: destroy nearby obstacles and bullets, award fossils
              const impactX = ma.x;
              gs.obstacles = gs.obstacles.filter(o => {
                const hb = getObstacleHitbox(o);
                if(Math.abs(hb.x + hb.w/2 - impactX) < 80){
                  if(o.bullets) o.bullets = [];
                  gs.fossilsEarned += 3;
                  addFloat(gs, `+3`, hb.x, hb.y - 10, "#ee6600");
                  return false;
                }
                return true;
              });
              return false; // remove meteor
            }
            return true;
          });
        }

        // ── Physics (skipped for pterodac during fly mode) ─────────────────
        if(hasSpdPw){
          gs.dino.vy+=GRAVITY*dt; gs.dino.y+=gs.dino.vy*dt;
          if(gs.dino.y>=GROUND_Y-DINO_H){gs.dino.y=GROUND_Y-DINO_H;gs.dino.vy=0;gs.dino.onGround=true;}
        } else if(!(designId==="pterodac" && gs.pterodacFlyTimer>0)) {
          if(gs.dino.invTimer>0) gs.dino.invTimer-=dt;
          if(gs.dino.dashCooldown>0) gs.dino.dashCooldown-=dt;
          const baseDashCd=Math.max(15,45-gs.stats.dashCdReduction);

          if((k["Space"]||k["ArrowUp"]||k["KeyW"])&&!(pk["Space"]||pk["ArrowUp"]||pk["KeyW"])) doJump();

          // Variable jump: hold key to extend jump height
          const jumpHeld = k["Space"]||k["ArrowUp"]||k["KeyW"];
          if(jumpHeld && gs.dino.jumpHoldTimer>0 && gs.dino.vy<0){
            gs.dino.vy -= JUMP_HOLD_FORCE*dt;
            gs.dino.jumpHoldTimer -= dt;
          } else if(!jumpHeld){
            gs.dino.jumpHoldTimer=0;
          }

          // Dash  Efull canvas bounds (10 to CANVAS_W-60)
          if(gs.stats.hasDash&&k["ArrowRight"]&&!pk["ArrowRight"]&&gs.dino.dashTimer<=0&&gs.dino.dashCooldown<=0){
            gs.dino.dashTimer=10; gs.dino.dashDir=1; gs.dino.dashCooldown=baseDashCd; gs.usedDash=true;
            playDashForward();
          }
          if(gs.stats.hasBackDash&&k["ArrowLeft"]&&!pk["ArrowLeft"]&&gs.dino.dashTimer<=0&&gs.dino.dashCooldown<=0){
            gs.dino.dashTimer=10; gs.dino.dashDir=-1; gs.dino.dashCooldown=baseDashCd; gs.usedDash=true;
            playDashBack();
          }
          if(gs.stats.hasDuck&&gs.dino.onGround){
            const wasDucking=gs.dino.ducking;
            gs.dino.ducking=(k["ArrowDown"]||k["KeyS"]);
            if(gs.dino.ducking&&!wasDucking) playDuckSlide();
          } else if(!gs.dino.onGround){
            if(gs.stats.hasFastDrop&&(k["ArrowDown"]||k["KeyS"])&&!(pk["ArrowDown"]||pk["KeyS"])) playFastDrop();
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
            // Consume buffered jump on landing
            if(gs.dino.jumpBuffer>0){
              gs.dino.jumpBuffer=0;
              gs.dino.vy=JUMP_FORCE;
              gs.dino.onGround=false;
              gs.dino.jumpHoldTimer=JUMP_HOLD_FRAMES+gs.stats.jumpBoost;
              playJumpRef.current();
            }
          }
          // Tick down jump buffer
          if(gs.dino.jumpBuffer>0) gs.dino.jumpBuffer-=dt;
        }

        prevKeysRef.current={...k};

        let effSpeed=gs.speed;
        if(hasSlowPw) effSpeed*=0.38;
        else if((gs.slowmoEaseTimer||0)>0){
          const t = gs.slowmoEaseTimer/120;
          effSpeed *= 0.38 + (1-0.38)*(1-t);
        }
        // CursedWall slow: ramp down to 0.55x while active, ease back over 90 frames
        if((gs.curseSlowTimer||0)>0){
          gs.curseSlowTimer-=dt;
          const t=Math.min(1,gs.curseSlowTimer/90);
          effSpeed*=0.55+(1-0.55)*(1-t);
        }
        gs.groundOffset+=effSpeed*dt;

        // ── Spawn obstacles ──────────────────────────────────────────────────
        if(gs.comboTimer>0){ gs.comboTimer-=dt; if(gs.comboTimer<=0) gs.combo=0; }

        const tier=Math.min(10,Math.floor(gs.distance/180));
        const minGap=Math.max(44,140-effSpeed*5-tier*2.5);
        // Ruins: tighter gap since ruinsLaser eats spawn slots without adding right-edge obstacles
        const effectiveMinGap = (gs.scenery?.id==="ruins") ? Math.max(38, minGap-18) : minGap;
        if(gs.frame-gs.lastObstacleFrame>effectiveMinGap){
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
          gs.obstacles.push({x:CANVAS_W+10,otype,type,y:oy,w:44,bullets,_shootTimer:0,
            _spikeTimer: otype==="spiketrap" ? Math.max(30,50-tier*2.5) : undefined,
            // RuinsLaser spawns at a random x on screen, not off the right edge
            ...(otype==="ruinsLaser" ? {x: 80+Math.floor(Math.random()*(CANVAS_W-160))} : {}),
          });
          // Cluster: ground static obstacles sometimes spawn 1-2 more of the same type close together
          const clusterTypes=["jungleTree","tree","stump","bush","rock","spike","spike_cluster","wall","dune","icewall","snowdrift","frozenTree","arcticFox","lavarock","emberlizard","pillar","boulder","scarab","crystalSpire","crystalCluster","tumbleweed","frostspike"];
          if(clusterTypes.includes(otype)&&tier>=1){
            const clusterChance=0.28+tier*0.02; // ~28-48% chance of a cluster
            const count=Math.random()<clusterChance?(Math.random()<0.3?2:1):0;
            for(let ci=0;ci<count;ci++){
              const gap=38+Math.random()*28; // tight gap between cluster members
              const prevX=gs.obstacles[gs.obstacles.length-1].x;
              const clusterType = otype==="jungleTree"
                ? Math.floor(Math.random()*3)
                : Math.random()<0.5?type:Math.floor(Math.random()*(Math.min(4,Math.floor(tier/1.5)+1)+1));
              gs.obstacles.push({x:prevX+gap,otype,type:clusterType,y:oy,w:44,bullets:[],_shootTimer:0});
            }
          }
          gs.lastObstacleFrame=gs.frame;
        }
        if(gs.frame-gs.lastPickupFrame>90){
          if(Math.random()<0.38) gs.pickups.push({x:CANVAS_W+10,y:GROUND_Y-30-Math.random()*90,collected:false});
          gs.lastPickupFrame=gs.frame;
        }
        // Shield: separate low-chance spawn check every ~120 frames
        if(gs.unlockedPowerups.includes("shield_pw")&&gs.frame%120===0){
          const shieldSpawnChance = 0.02 + gs.stats.shieldSpawnChance + gs.stats.rareDrop * 0.5;
          if(Math.random()<shieldSpawnChance){
            const sdef=POWERUP_DEFS.find(d=>d.id==="shield_pw");
            const spawnX=CANVAS_W+10;
            const PW=22,PH=22;
            let spawnY=null;
            for(let attempt=0;attempt<8;attempt++){
              const tryY=GROUND_Y-32-Math.random()*58;
              const blocked=gs.obstacles.some(o=>{
                const hb=getObstacleHitbox(o);
                return rectsOverlap(spawnX,tryY,PW,PH,hb.x,hb.y,hb.w,hb.h);
              });
              if(!blocked){spawnY=tryY;break;}
            }
            if(spawnY!==null) gs.powerupPickups.push({x:spawnX,y:spawnY,def:sdef,collected:false});
          }
        }
        // Heart: separate low-chance spawn check every ~120 frames
        if(gs.unlockedPowerups.includes("heart_pw")&&gs.frame%120===0){
          const heartSpawnChance = 0.02 + gs.stats.heartChance + gs.stats.rareDrop * 0.5;
          if(Math.random()<heartSpawnChance){
            const hdef=POWERUP_DEFS.find(d=>d.id==="heart_pw");
            const spawnX=CANVAS_W+10;
            const PW=22,PH=22;
            let spawnY=null;
            for(let attempt=0;attempt<8;attempt++){
              const tryY=GROUND_Y-32-Math.random()*58;
              const blocked=gs.obstacles.some(o=>{
                const hb=getObstacleHitbox(o);
                return rectsOverlap(spawnX,tryY,PW,PH,hb.x,hb.y,hb.w,hb.h);
              });
              if(!blocked){spawnY=tryY;break;}
            }
            if(spawnY!==null) gs.powerupPickups.push({x:spawnX,y:spawnY,def:hdef,collected:false});
          }
        }
        const spawnThresh=Math.max(300,900-gs.stats.rareDrop*1200);
        if(gs.frame-gs.lastPowerupFrame>spawnThresh){
          const eligible=POWERUP_DEFS.filter(d=>d.id!=="heart_pw"&&d.id!=="shield_pw"&&(d.id!=="meteor_pw"||tier>=4)&&gs.unlockedPowerups.includes(d.id));
          gs.lastPowerupFrame=gs.frame;
          if(eligible.length>0){
            const def=eligible[Math.floor(Math.random()*eligible.length)];
            const spawnX=CANVAS_W+10;
            const PW=22,PH=22;
            let spawnY=null;
            for(let attempt=0;attempt<8;attempt++){
              const tryY=GROUND_Y-32-Math.random()*58;
              const blocked=gs.obstacles.some(o=>{
                const hb=getObstacleHitbox(o);
                return rectsOverlap(spawnX,tryY,PW,PH,hb.x,hb.y,hb.w,hb.h);
              });
              if(!blocked){spawnY=tryY;break;}
            }
            if(spawnY!==null) gs.powerupPickups.push({x:spawnX,y:spawnY,def,collected:false});
          }
        }

        // ── Move everything ──────────────────────────────────────────────────
        gs.obstacles=gs.obstacles.filter(o=>{
          if(o.otype!=="dust_devil"&&o.otype!=="blizzardWall"&&o.otype!=="ashCloud"&&o.otype!=="cursedWall"&&o.otype!=="ruinsLaser") o.x-=effSpeed*dt;
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
              // Grasslands scarecrow: shoot at mid-height so player can duck under
              // Slow base speed like wasteland turret — scales with game speed naturally
              const bY = gs.scenery?.id==="plains" ? GROUND_Y-44 : GROUND_Y-32;
              const bBaseSpd = gs.scenery?.id==="plains" ? (-3.5-tier*0.25) : (-7-tier*0.3);
              o.bullets.push({x:o.x+4,y:bY,vx:bBaseSpd*bSpd,vy:0});
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
          // Scorpion: raise tail toward player when close
          if(o.otype==="scorpion"){
            const dist=Math.abs(o.x-gs.dino.x);
            if(dist<300) o._tailRaise=Math.min(28,(o._tailRaise||0)+2*dt);
            else         o._tailRaise=Math.max(0,(o._tailRaise||0)-1.5*dt);
          }
          // Icicle: drop from sky when dino is nearby
          if(o.otype==="icicle"){
            if(o._icicleY===undefined) o._icicleY=-20;
            const dist=Math.abs(o.x-gs.dino.x);
            if(dist<260||o._icicleY>-20){
              o._icicleY=Math.min(GROUND_Y-34,(o._icicleY||0)+3*dt);
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
                const bSpd=Math.min(effSpeed/gs.baseSpeed, 1.6);
                o.bullets.push({x:o.x+14,y:GROUND_Y-22,vx:-1*bSpd,vy:Math.max(-11,(-8-tier*0.3)*bSpd)});
                o.bullets.push({x:o.x+20,y:GROUND_Y-22,vx:-3*bSpd,vy:Math.max(-12,(-9-tier*0.3)*bSpd)});
                o.bullets.push({x:o.x+20,y:GROUND_Y-22,vx:0,      vy:Math.max(-10,(-7-tier*0.3)*bSpd)});
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
              const bSpd=Math.min(effSpeed/gs.baseSpeed, 1.6);
              // Bullet spawns at bottom of demon body so it aligns with ducking dino
              o.bullets.push({x:o.x+4,y:o.y+26,vx:(-8-tier*0.3)*bSpd,vy:0});
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
          // Walrus: shoot horizontal ice tusks at low height, fires when 1/4 body visible
          if(o.otype==="walrus"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(80,150-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:GROUND_Y-20,vx:-(6+tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // SnowGolem: shoot arcing snowball that bounces once on ground
          if(o.otype==="snowGolem"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:GROUND_Y-48,vx:-(5+tier*0.25)*bSpd,vy:(-6-tier*0.2)*bSpd,_bounced:false});
            }
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=0.4*dt;
              // Bounce once on ground
              if(!b._bounced&&b.y>=GROUND_Y-12){
                b.y=GROUND_Y-12; b.vy=-(Math.abs(b.vy)*0.55); b._bounced=true;
              }
              return b.x>-20&&b.y<GROUND_Y+4;
            });
          }
          // Mummy: shoot horizontal bandage wraps, fires when 1/4 body visible
          if(o.otype==="mummy"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:GROUND_Y-44,vx:-(6+tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Obelisk: shoot horizontal curse beam, fires when 1/4 body visible
          if(o.otype==="obelisk"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(80,150-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-9){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=effSpeed/gs.baseSpeed;
              o.bullets.push({x:o.x+4,y:GROUND_Y-58,vx:-(7+tier*0.3)*bSpd,vy:0});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Vulture: dive toward dino when close, then pull back up
          if(o.otype==="vulture"||o.otype==="hawk"){
            const dist=Math.abs(o.x-gs.dino.x);
            if(o._vultureState===undefined){ o._vultureState=0; o._vultureBaseY=o.y; }
            if(o._vultureState===0&&dist<200){
              o._vultureTargetY = o.otype==="hawk" ? gs.dino.y+8 : GROUND_Y-52;
              o._vultureState=1;
            }
            if(o._vultureState===1){
              o.y=Math.min(o._vultureTargetY, o.y+3.5*dt);
              if(o.y>=o._vultureTargetY) o._vultureState=2;
            } else if(o._vultureState===2){
              o.y=Math.max(o._vultureBaseY, o.y-2.5*dt);
              if(o.y<=o._vultureBaseY) o._vultureState=0;
            }
          }
          // IceBat: dive toward dino when close, same state machine as vulture
          if(o.otype==="iceBat"){
            const dist=Math.abs(o.x-gs.dino.x);
            if(o._vultureState===undefined){ o._vultureState=0; o._vultureBaseY=o.y; }
            if(o._vultureState===0&&dist<220){
              o._vultureTargetY=gs.dino.y+6;
              o._vultureState=1;
            }
            if(o._vultureState===1){
              o.y=Math.min(o._vultureTargetY, o.y+4*dt);
              if(o.y>=o._vultureTargetY) o._vultureState=2;
            } else if(o._vultureState===2){
              o.y=Math.max(o._vultureBaseY, o.y-3*dt);
              if(o.y<=o._vultureBaseY) o._vultureState=0;
            }
          }
          // Dust devil: slow horizontal drift (wobble left/right)
          if(o.otype==="dust_devil"){
            if(o._ddBaseX===undefined) o._ddBaseX=o.x;
            o._ddPhase=(o._ddPhase||0)+0.04*dt;
            o._ddBaseX-=effSpeed*dt;
            o.x=o._ddBaseX+Math.sin(o._ddPhase)*14;
          }
          // AshCloud: slow drift like blizzardWall + ember push on dino
          if(o.otype==="ashCloud"){
            if(o._ddBaseX===undefined) o._ddBaseX=o.x;
            o._ddPhase=(o._ddPhase||0)+0.03*dt;
            o._ddBaseX-=effSpeed*0.55*dt;
            o.x=o._ddBaseX+Math.sin(o._ddPhase)*8;
            if(!hasGhost&&!hasGiant&&gs.dino.invTimer<=0){
              const hb=getObstacleHitbox(o);
              if(rectsOverlap(gs.dino.x,gs.dino.y,DINO_W,DINO_H,hb.x,hb.y,hb.w,hb.h)){
                const pushStrength=1.1*(effSpeed/gs.baseSpeed);
                gs.dino.x=Math.max(10,gs.dino.x-pushStrength*dt);
              }
            }
          }
          // MagmaGolem: throw arcing lava chunks, fires when 1/4 body visible
          if(o.otype==="magmaGolem"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=Math.min(effSpeed/gs.baseSpeed, 1.6);
              o.bullets.push({x:o.x+4, y:GROUND_Y-52,vx:-(6+tier*0.3)*bSpd,vy:Math.max(-12,(-8-tier*0.3)*bSpd)});
              o.bullets.push({x:o.x+20,y:GROUND_Y-52,vx:-(4+tier*0.2)*bSpd,vy:Math.max(-13,(-9-tier*0.3)*bSpd)});
            }
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=0.45*dt;
              return b.x>-30&&b.y<GROUND_Y;
            });
          }
          // LavaBat: dive toward dino when close, same state machine as iceBat
          if(o.otype==="lavaBat"){
            const dist=Math.abs(o.x-gs.dino.x);
            if(o._vultureState===undefined){ o._vultureState=0; o._vultureBaseY=o.y; }
            if(o._vultureState===0&&dist<220){
              // Aim at dino feet so it hits whether standing or ducking
              o._vultureTargetY=gs.dino.y+DINO_H-20;
              o._vultureState=1;
            }
            if(o._vultureState===1){
              o.y=Math.min(o._vultureTargetY,o.y+4*dt);
              if(o.y>=o._vultureTargetY) o._vultureState=2;
            } else if(o._vultureState===2){
              o.y=Math.max(o._vultureBaseY,o.y-3*dt);
              if(o.y<=o._vultureBaseY) o._vultureState=0;
            }
          }
          // VolcanicVent: extend/retract fire on timer
          if(o.otype==="volcanicVent"){
            if(o._ventTimer===undefined) o._ventTimer=Math.max(30,50-tier*2.5);
            o._ventTimer+=dt;
            const cycle=Math.max(60,100-tier*5);
            const phase=(o._ventTimer%cycle)/cycle;
            o._ventH = phase<0.5 ? Math.min(36,phase*2*36) : Math.max(0,(1-phase)*2*36);
          }
          // CursedWall: slow drift + curse slow on dino (ruins-exclusive)
          if(o.otype==="cursedWall"){
            if(o._ddBaseX===undefined) o._ddBaseX=o.x;
            o._ddPhase=(o._ddPhase||0)+0.028*dt;
            o._ddBaseX-=effSpeed*0.58*dt;
            o.x=o._ddBaseX+Math.sin(o._ddPhase)*10;
            // Curse slow: while overlapping, ramp effSpeed down; tracked via gs.curseSlowTimer
            if(!hasGhost&&!hasGiant){
              const hb=getObstacleHitbox(o);
              if(rectsOverlap(gs.dino.x,gs.dino.y,DINO_W,DINO_H,hb.x,hb.y,hb.w,hb.h)){
                gs.curseSlowTimer=90; // hold slow for 1.5s after exiting
              }
            }
          }
          // BlizzardWall: slow drift like dust devil + gentle wind push on dino
          if(o.otype==="blizzardWall"){
            if(o._ddBaseX===undefined) o._ddBaseX=o.x;
            o._ddPhase=(o._ddPhase||0)+0.025*dt;
            o._ddBaseX-=effSpeed*0.6*dt;
            o.x=o._ddBaseX+Math.sin(o._ddPhase)*8;
            // Wind push: nudge dino left when overlapping, scales with game speed
            if(!hasGhost&&!hasGiant&&gs.dino.invTimer<=0){
              const hb=getObstacleHitbox(o);
              if(rectsOverlap(gs.dino.x,gs.dino.y,DINO_W,DINO_H,hb.x,hb.y,hb.w,hb.h)){
                const pushStrength = 1.2 * (effSpeed / gs.baseSpeed);
                gs.dino.x=Math.max(10, gs.dino.x-pushStrength*dt);
              }
            }
          }
          // VineTrap: snap shut when dino is close
          if(o.otype==="vineTrap"){
            const dist=Math.abs(o.x+20-gs.dino.x);
            o._snapState = dist<80 ? Math.min(1,(o._snapState||0)+0.15*dt) : Math.max(0,(o._snapState||0)-0.12*dt);
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
              const bSpd=Math.min(effSpeed/gs.baseSpeed,1.5);
              o.bullets.push({x:o.x+2,y:GROUND_Y-52,vx:-(6+tier*0.25)*bSpd,vy:(-7-tier*0.3)*bSpd});
            }
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=0.42*dt;
              return b.x>-20&&b.y<GROUND_Y;
            });
          }
          // JungleSerpent: spit poison blobs in arc, fires when 1/4 body visible
          if(o.otype==="jungleSerpent"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(85,150-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=Math.min(effSpeed/gs.baseSpeed,1.5);
              o.bullets.push({x:o.x+16,y:GROUND_Y-54,vx:(-5-tier*0.25)*bSpd,vy:(-8-tier*0.3)*bSpd});
              o.bullets.push({x:o.x+16,y:GROUND_Y-54,vx:(-3-tier*0.2)*bSpd, vy:(-9-tier*0.3)*bSpd});
            }
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=0.40*dt;
              return b.x>-20&&b.y<GROUND_Y;
            });
          }
          // Spiketrap: extend/retract on timer — start mid-cycle so always visible on entry
          if(o.otype==="spiketrap"){
            if(o._spikeTimer===undefined) o._spikeTimer=0;
            o._spikeTimer+=dt;
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
                o.bullets.push({x:o.x+4,y:GROUND_Y-44,vx:-(7+tier*0.3)*bSpd,vy:0});
              }
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // Golem: throw arcing rubble chunks, fires when 1/4 body visible
          if(o.otype==="golem"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(90,160-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=Math.min(effSpeed/gs.baseSpeed,1.5);
              o.bullets.push({x:o.x+34,y:GROUND_Y-52,vx:-(6+tier*0.3)*bSpd,vy:(-5-tier*0.2)*bSpd});
            }
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=0.42*dt;
              return b.x>-20&&b.y<GROUND_Y;
            });
          }
          // Ankh: float up/down, fire radial 4-way burst when dino is close
          if(o.otype==="ankh"&&o.x<CANVAS_W-10&&o.x>-60){
            const dist=Math.abs(o.x+20-gs.dino.x);
            const shootInterval=Math.max(100,180-tier*10);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            if(dist<280){
              o._shootTimer=(o._shootTimer||0)+dt;
              if(o._shootTimer>=shootInterval){
                o._shootTimer=0;
                const bSpd=Math.min(effSpeed/gs.baseSpeed,1.5);
                const bx=o.x+20, by=o.y+(Math.sin(gs.frame*0.09)*8);
                // 4-way radial burst: left, straight-down-left, up, down
                o.bullets.push({x:bx,y:by,vx:-(7+tier*0.3)*bSpd,vy:0});                        // left
                o.bullets.push({x:bx,y:by,vx:-(5+tier*0.2)*bSpd,vy: (5+tier*0.2)*bSpd});       // down-left diagonal
                o.bullets.push({x:bx,y:by,vx:0,               vy:-(7+tier*0.3)*bSpd});          // up
                o.bullets.push({x:bx,y:by,vx:0,               vy: (5+tier*0.2)*bSpd});          // down
              }
            }
            o.bullets=o.bullets.filter(b=>{
              b.x+=b.vx*dt; b.y+=b.vy*dt;
              return b.x>-20&&b.x<CANVAS_W+20&&b.y>-20&&b.y<GROUND_Y;
            });
          }
          // SandTrap: launch dino into the air when stepped on (one-shot per pass)
          if(o.otype==="sandTrap"&&!hasGiant&&!hasGhost&&!o._launched){
            const hb=getObstacleHitbox(o);
            if(gs.dino.onGround&&rectsOverlap(gs.dino.x,gs.dino.y+DINO_H-4,DINO_W,4,hb.x,hb.y,hb.w,hb.h)){
              // Launch force = max jump force + full jump upgrade bonus
              const launchForce = JUMP_FORCE - gs.stats.jumpBoost * 0.18 - 4.5;
              gs.dino.vy = launchForce;
              gs.dino.onGround = false;
              gs.dino.doubleJumped = false;
              o._launched = true;
              addFloat(gs, "LAUNCHED!", gs.dino.x-10, gs.dino.y-28, "#ffcc00");
            }
          }
          // RuinsLaser: warning phase then fire phase
          if(o.otype==="ruinsLaser"){
            if(o._laserState===undefined){ o._laserState=0; o._laserWarnTimer=0; o._laserFireTimer=0; }
            if(o._laserState===0){
              // Warning phase: 90 frames (~1.5s)
              o._laserWarnTimer+=dt;
              if(o._laserWarnTimer>=90){ o._laserState=1; o._laserFireTimer=18; }
            } else if(o._laserState===1){
              // Fire phase: 18 frames (~0.3s)
              o._laserFireTimer-=dt;
              if(o._laserFireTimer<=0) o._laserState=2; // done
            }
          }
          // Stalactite: drop from ceiling when dino is nearby
          if(o.otype==="stalactite"){
            if(o._stalY===undefined) o._stalY=-30;
            const dist=Math.abs(o.x-gs.dino.x);
            if(dist<280||o._stalY>-30) o._stalY=Math.min(GROUND_Y-42,(o._stalY||0)+5.5*dt);
          }
          // FallingLog: drops from canopy when dino is nearby, lands and stays
          if(o.otype==="fallingLog"){
            if(o._logY===undefined) o._logY=-30;
            if(o._logLanded) {
              // already on ground — just scroll with everything else, no extra logic
            } else {
              const dist=Math.abs(o.x+22-gs.dino.x);
              if(dist<300||o._logY>-30){
                o._logY=Math.min(GROUND_Y-18,(o._logY||0)+6*dt);
                if(o._logY>=GROUND_Y-18) o._logLanded=true;
              }
            }
          }
          // FallingBlock: heavy stone drops from ceiling when dino is nearby, lands and stays briefly
          if(o.otype==="fallingBlock"){
            if(o._blockY===undefined) o._blockY=-40;
            if(o._blockLanded){
              if((o._blockDustTimer||0)>0) o._blockDustTimer-=dt;
            } else {
              const dist=Math.abs(o.x+22-gs.dino.x);
              if(dist<260||o._blockY>-40){
                o._blockY=Math.min(GROUND_Y-24,(o._blockY||0)+8*dt);
                if(o._blockY>=GROUND_Y-24){ o._blockLanded=true; o._blockDustTimer=18; }
              }
            }
          }
          // JungleSpider: drops on silk thread when dino is nearby, retracts when far
          if(o.otype==="jungleSpider"){
            if(o._spiderY===undefined) o._spiderY=-20;
            const dist=Math.abs(o.x+18-gs.dino.x);
            if(dist<260||o._spiderY>-20){
              o._spiderY=Math.min(GROUND_Y-34,(o._spiderY||0)+3.5*dt);
            } else {
              o._spiderY=Math.max(-20,(o._spiderY||0)-2*dt);
            }
          }
          // Pterosaur: dives toward dino when close, same state machine as vulture
          if(o.otype==="pterosaur"){
            const dist=Math.abs(o.x-gs.dino.x);
            if(o._vultureState===undefined){ o._vultureState=0; o._vultureBaseY=o.y; }
            if(o._vultureState===0&&dist<220){
              o._vultureTargetY=gs.dino.y+6;
              o._vultureState=1;
            }
            if(o._vultureState===1){
              o.y=Math.min(o._vultureTargetY,o.y+4*dt);
              if(o.y>=o._vultureTargetY) o._vultureState=2;
            } else if(o._vultureState===2){
              o.y=Math.max(o._vultureBaseY,o.y-3*dt);
              if(o.y<=o._vultureBaseY) o._vultureState=0;
            }
          }
          // Wraith: dives toward dino when close, pulls back up — faster dive than vulture
          if(o.otype==="wraith"){
            const dist=Math.abs(o.x-gs.dino.x);
            if(o._vultureState===undefined){ o._vultureState=0; o._vultureBaseY=o.y; }
            if(o._vultureState===0&&dist<240){
              o._vultureTargetY=gs.dino.y+4;
              o._vultureState=1;
            }
            if(o._vultureState===1){
              o.y=Math.min(o._vultureTargetY,o.y+5*dt);
              if(o.y>=o._vultureTargetY) o._vultureState=2;
            } else if(o._vultureState===2){
              o.y=Math.max(o._vultureBaseY,o.y-3.5*dt);
              if(o.y<=o._vultureBaseY) o._vultureState=0;
            }
          }
          // JungleBoar: static ground charger, no extra logic needed
          // Chameleon removed — replaced by jungleBoar
          // PoisonFrog: hops toward dino with a low arc, reverses at screen edge
          if(o.otype==="poisonFrog"){
            if(o._hopY===undefined){ o._hopY=0; o._hopVy=0; o._hopTimer=0; o._hopDir=-1; }
            o._hopTimer+=dt;
            // Trigger a new hop every ~55 frames when on ground
            const hopInterval = Math.max(30, 55 - tier*3);
            if(o._hopY<=0 && o._hopTimer>=hopInterval){
              o._hopTimer=0;
              o._hopVy = -(5 + tier*0.4);
            }
            // Apply hop arc gravity
            if(o._hopY>0 || o._hopVy<0){
              o._hopVy += 0.55*dt;
              o._hopY = Math.max(0, o._hopY - o._hopVy*dt);
            }
            // Horizontal lurch toward dino while airborne
            if(o._hopY>0){
              const lurch = (1.2 + tier*0.1) * dt;
              o.x -= lurch; // always moves left toward dino
            }
            // Clamp so it doesn't hop off the left edge before being culled
            o.x = Math.max(-60, o.x);
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
            if(dist<80){
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
            if(o.bullets.length===0) o._exploding=2;
          }
          // CrystalBat: dive at dino, split into 2 minibats on body hit
          if(o.otype==="crystalBat"){
            if(o._vultureState===undefined){ o._vultureState=0; o._vultureBaseY=o.y; o._splitDone=false; o._miniBats=[]; }
            const dist=Math.abs(o.x-gs.dino.x);
            if(o._vultureState===0&&dist<240){
              o._vultureState=1;
            }
            if(o._vultureState===1){
              // Aim at standing dino top — ducking dino is lower so bat flies over
              o._vultureTargetY = GROUND_Y - DINO_H + 4;
              o.y=Math.min(o._vultureTargetY,o.y+5*dt);
              if(o.y>=o._vultureTargetY) o._vultureState=2;
            } else if(o._vultureState===2){
              o.y=Math.max(o._vultureBaseY,o.y-3.5*dt);
              if(o.y<=o._vultureBaseY) o._vultureState=0;
            }
            // Move and cull minibats
            if(o._miniBats&&o._miniBats.length>0){
              o._miniBats=o._miniBats.filter(mb=>{
                mb.x+=mb.vx*dt; mb.y+=mb.vy*dt;
                mb.vy+=0.18*dt; // slight gravity
                return mb.x>-60&&mb.x<CANVAS_W+60&&mb.y<GROUND_Y+20;
              });
            }
          }
          // GeodeSpitter: V-spread — one high shard, one low shard
          if(o.otype==="geodeSpitter"&&o.x<CANVAS_W-20&&o.x>-60){
            const shootInterval=Math.max(80,150-tier*8);
            if(!o._entryShot&&o.x<=CANVAS_W-11){
              o._entryShot=true; o._shootTimer=shootInterval;
            }
            o._shootTimer=(o._shootTimer||0)+dt;
            if(o._shootTimer>=shootInterval){
              o._shootTimer=0;
              const bSpd=Math.min(effSpeed/gs.baseSpeed,1.6);
              // High shard — must jump over
              o.bullets.push({x:o.x,y:GROUND_Y-52,vx:-(7+tier*0.3)*bSpd,vy:0,_high:true});
              // Low shard — must jump (can't duck under, forces jump read)
              o.bullets.push({x:o.x,y:GROUND_Y-18,vx:-(6+tier*0.25)*bSpd,vy:0,_high:false});
            }
            o.bullets=o.bullets.filter(b=>{b.x+=b.vx*dt; return b.x>-20;});
          }
          // VoidCrawler: creeps toward dino, speeds up when close
          // Moves at effSpeed (scroll) + chargeSpeed (active pursuit) so it always advances on screen
          if(o.otype==="voidCrawler"){
            const dist=Math.abs(o.x-gs.dino.x);
            const baseCreep = 0.8+tier*0.12;
            const chargeSpeed = dist<180 ? baseCreep*2.8 : baseCreep;
            o._crawlerSpeed = chargeSpeed;
            // Extra pursuit on top of normal world scroll
            o.x -= chargeSpeed*dt;
          }
          // CrystalCeiling: descend on timer, hold, then retract
          if(o.otype==="crystalCeiling"){
            if(o._ceilY===undefined){ o._ceilY=0; o._ceilState=0; o._ceilTimer=0; }
            const descendTarget = GROUND_Y - 72; // slab bottom at 138+22=160, ducking dino top at 189 — 29px gap
            const holdFrames    = Math.max(60, 100-tier*5);
            const warnFrames    = 50;
            if(o._ceilState===0){
              // Warning: flash in place
              o._ceilTimer+=dt;
              o._ceilDescending=false;
              if(o._ceilTimer>=warnFrames){ o._ceilState=1; o._ceilTimer=0; }
            } else if(o._ceilState===1){
              // Descend
              o._ceilDescending=true;
              o._ceilY=Math.min(descendTarget,o._ceilY+5.5*dt);
              if(o._ceilY>=descendTarget){ o._ceilState=2; o._ceilTimer=0; }
            } else if(o._ceilState===2){
              // Hold
              o._ceilDescending=false;
              o._ceilTimer+=dt;
              if(o._ceilTimer>=holdFrames) o._ceilState=3;
            } else {
              // Retract
              o._ceilY=Math.max(0,o._ceilY-4*dt);
              if(o._ceilY<=0){ o._ceilState=0; o._ceilTimer=0; } // loop
            }
          }
          // RuneCircle: telegraph glow then 4-way shard burst, repeating
          if(o.otype==="runeCircle"){
            const chargeFrames = Math.max(60,100-tier*5);
            const fireFrames   = 12;
            if(o._runeState===undefined){ o._runeState=0; o._runeTimer=0; o._runeCharge=0; }
            if(o._runeState===0){
              // Charging
              o._runeTimer+=dt;
              o._runeCharge=Math.min(1,o._runeTimer/chargeFrames);
              o._runeFiring=false;
              if(o._runeTimer>=chargeFrames){
                o._runeState=1; o._runeTimer=0;
                const bSpd=Math.min(effSpeed/gs.baseSpeed,1.5);
                const bx=o.x+20, by=GROUND_Y-4;
                o.bullets=[
                  {x:bx,y:by,vx:-(7+tier*0.3)*bSpd,vy:0},           // left
                  {x:bx,y:by,vx: (5+tier*0.2)*bSpd,vy:0},           // right
                  {x:bx,y:by,vx:0,vy:-(8+tier*0.3)*bSpd},           // up
                  {x:bx,y:by,vx:-(5+tier*0.2)*bSpd,vy:-(6+tier*0.2)*bSpd}, // up-left
                ];
              }
            } else {
              // Firing — shards fly, then reset
              o._runeFiring=true;
              o._runeTimer+=dt;
              o.bullets=o.bullets.filter(b=>{
                b.x+=b.vx*dt; b.y+=b.vy*dt;
                return b.x>-20&&b.x<CANVAS_W+20&&b.y>-20&&b.y<GROUND_Y;
              });
              if(o._runeTimer>=fireFrames&&o.bullets.length===0){
                o._runeState=0; o._runeTimer=0; o._runeCharge=0;
              }
            }
          }
          // Cull split bat once all minibats are gone
          if(o.otype==="crystalBat"&&o._splitDone&&(o._miniBats||[]).length===0) return false;
          return o.x>-100 && o._exploding!==2 && o._laserState!==2;
        });

        const magnetRange=gs.activePowerups.magnet_pw?(180+gs.stats.magnetRngBonus):(gs.stats.magnetLevel>0?55+gs.stats.magnetLevel*28:0);
        // Brachio passive: +120px collection range
        const brachioMagnet = designId==="brachio" ? 120 : 0;
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
        const DX=gs.dino.x+DINO_W/2-DW/2;
        // Anchor hitbox to dino feet — works correctly on ground and in air
        const DY=(gs.dino.y+DINO_H)-DH;

        // Tri: horn burst handled by timed passive above

        if(gs.stegoFlashTimer>0) gs.stegoFlashTimer-=dt;

        // ── Per-frame passive multipliers (needed by collision + collect) ────
        const raptorM = designId==="raptor" ? 1+(gs.raptorSpeedBonus*0.005) : 1;
        const spinoPickupM = (designId==="spino" && gs.nightBlend > 0.5) ? 1.50 : 1;
        const stegoShieldBonus = designId==="stego" ? 0.20 + gs.stats.shieldChance * 0.5 : 0;

        // ── Bullet collision (separate from obstacle body) ───────────────────
        // Giant mode: silently destroy all projectiles, no fossils awarded
        if(hasGiant||hasSpdPw){
          for(const o of gs.obstacles){
            if(o.bullets&&o.bullets.length>0){
              o.bullets=o.bullets.filter(b=>{
                const bw = o.otype==="mummy" ? 14 : o.otype==="obelisk" ? 12 : 8;
                const bh = o.otype==="demon" ? 8 : 4;
                return !rectsOverlap(DX,DY,DW,DH,b.x,b.y,bw,bh);
              });
            }
          }
        }
        if(!hasGhost&&!hasGiant&&!hasSpdPw&&gs.dino.invTimer<=0&&!(designId==="dilopho"&&gs.dilophoPhaseActive>0)){
          for(const o of gs.obstacles){
            if((o.otype!=="turret"&&o.otype!=="yeti"&&o.otype!=="walrus"&&o.otype!=="snowGolem"&&o.otype!=="lavaburst"&&o.otype!=="demon"&&o.otype!=="gorilla"&&o.otype!=="jungleSerpent"&&o.otype!=="statue"&&o.otype!=="golem"&&o.otype!=="crystalGolem"&&o.otype!=="crystalMine"&&o.otype!=="mummy"&&o.otype!=="obelisk"&&o.otype!=="magmaGolem"&&o.otype!=="ankh"&&o.otype!=="geodeSpitter"&&o.otype!=="runeCircle")||!o.bullets) continue;
            for(let bi=o.bullets.length-1;bi>=0;bi--){
              const b=o.bullets[bi];
              const bw = o.otype==="mummy" ? 14 : o.otype==="obelisk" ? 12 : 8;
              const bh = o.otype==="demon" ? 8 : 4;
              if(rectsOverlap(DX,DY,DW,DH,b.x,b.y,bw,bh)){
                o.bullets.splice(bi,1);
                if(gs.activePowerups.shield_pw){
                  gs.shieldHitsLeft--; if(gs.shieldHitsLeft<=0) delete gs.activePowerups.shield_pw;
                  gs.dino.invTimer=20+gs.stats.invFramesBonus; gs.hitTaken=true;
                } else if((gs.stats.shieldChance + stegoShieldBonus)>Math.random()){
                  gs.dino.invTimer=20+gs.stats.invFramesBonus; gs.hitTaken=true;
                  if(designId==="stego"){ gs.stegoFlashTimer=40; addFloat(gs,"PLATE ARMOR!",gs.dino.x-10,gs.dino.y-28,"#ffcc00"); }
                } else if(gs.lives>1){
                  gs.lives--; gs.dino.invTimer=30+gs.stats.invFramesBonus; gs.hitTaken=true;
                  playDie();
                  addFloat(gs,"-1 LIFE",gs.dino.x,gs.dino.y-24,"#ee3344");
                } else {
                  gs.lives=0; gs.hitTaken=true; endGame(gs); return;
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
            if(o.otype==="crystalBat"&&o._splitDone) return true; // parked split bat — skip
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
            // BlizzardWall and AshCloud only push — never deal body collision damage
            if(o.otype==="blizzardWall"||o.otype==="ashCloud"||o.otype==="cursedWall"||o.otype==="sandTrap"||o.otype==="ruinsLaser"||o.otype==="runeCircle") continue;
            const hb=getObstacleHitbox(o);

            // Dilopho passive: phase through everything when active
            if(designId==="dilopho"&&gs.dilophoPhaseActive>0) continue;

            const actualHit = gs.dino.invTimer<=0&&rectsOverlap(DX,DY,DW,DH,hb.x,hb.y,hb.w,hb.h);

            // CrystalBat: on first body hit, split into 2 minibats instead of dealing damage
            if(o.otype==="crystalBat"&&actualHit&&!o._splitDone&&!hasGiant&&!hasGhost){
              o._splitDone=true;
              o._vultureState=99; // park the main bat off-screen logic
              o._miniBats=[
                {x:o.x,    y:o.y, vx:-(4+tier*0.2), vy:-(3+tier*0.1)},
                {x:o.x+14, y:o.y, vx:-(2+tier*0.15),vy:-(4+tier*0.1)},
              ];
              gs.dino.invTimer=8; // brief grace so split doesn't immediately re-hit
              continue;
            }
            // CrystalBat minibat collision
            if(o.otype==="crystalBat"&&o._miniBats&&o._miniBats.length>0&&!hasGiant&&!hasGhost&&gs.dino.invTimer<=0){
              let mbHit=false;
              o._miniBats=o._miniBats.filter(mb=>{
                if(!mbHit&&rectsOverlap(DX,DY,DW,DH,mb.x+2,mb.y+2,10,8)){
                  mbHit=true; return false;
                }
                return true;
              });
              if(mbHit){
                if(gs.activePowerups.shield_pw){
                  gs.shieldHitsLeft--; if(gs.shieldHitsLeft<=0) delete gs.activePowerups.shield_pw;
                  gs.dino.invTimer=20+gs.stats.invFramesBonus; gs.hitTaken=true;
                } else if((gs.stats.shieldChance+stegoShieldBonus)>Math.random()){
                  gs.dino.invTimer=20+gs.stats.invFramesBonus; gs.hitTaken=true;
                  if(designId==="stego"){ gs.stegoFlashTimer=40; addFloat(gs,"PLATE ARMOR!",gs.dino.x-10,gs.dino.y-28,"#ffcc00"); }
                } else if(gs.lives>1){
                  gs.lives--; gs.dino.invTimer=30+gs.stats.invFramesBonus; gs.hitTaken=true;
                  playDie(); addFloat(gs,"-1 LIFE",gs.dino.x,gs.dino.y-24,"#ee3344");
                } else {
                  gs.lives=0; gs.hitTaken=true; endGame(gs); return;
                }
              }
              continue;
            }
            // Collision first
            if(actualHit){
              if(gs.activePowerups.shield_pw){
                gs.shieldHitsLeft--; if(gs.shieldHitsLeft<=0) delete gs.activePowerups.shield_pw;
                gs.obstacles.splice(i,1); gs.dino.invTimer=20+gs.stats.invFramesBonus; gs.hitTaken=true;
              } else if((gs.stats.shieldChance + stegoShieldBonus)>Math.random()){
                gs.obstacles.splice(i,1); gs.dino.invTimer=20+gs.stats.invFramesBonus; gs.hitTaken=true;
                if(designId==="stego"){ gs.stegoFlashTimer=40; addFloat(gs,"PLATE ARMOR!",gs.dino.x-10,gs.dino.y-28,"#ffcc00"); }
              } else if(gs.lives>1){
                gs.lives--;
                gs.obstacles.splice(i,1);
                gs.dino.invTimer=30+gs.stats.invFramesBonus; gs.hitTaken=true;
                playDie();
                addFloat(gs,"-1 LIFE",gs.dino.x,gs.dino.y-24,"#ee3344");
              } else {
                gs.lives=0; gs.hitTaken=true; endGame(gs); return;
              }
              break;
            }

          }
        }

        // ── Collect bones ────────────────────────────────────────────────────
        const nightM  = 1+(gs.nightBlend*gs.stats.nightBonus);
        const frenzyM = hasFrenzy?3:1;
        const doubM   = hasDoubler?2:1;

        for(const p of gs.pickups){
          if(!p.collected&&rectsOverlap(DX,DY,DW,DH,p.x,p.y,14,14)){
            p.collected=true; gs.combo++; gs.comboTimer=120;
            playPoint();
            if(gs.combo>gs.maxComboThisRun) gs.maxComboThisRun=gs.combo;
            // Para passive: combo timer 25% longer, cap combo at 20
            if(designId==="para"){ gs.comboTimer=150; if(gs.combo>20) gs.combo=20; }
            // Pterodac passive: airborne pickups worth 1.5x
            const pteroM = (designId==="pterodac"&&!gs.dino.onGround) ? 1.5 : 1;
            const comboM = Math.min(2.5, 1 + gs.combo * (0.08 + gs.stats.comboBonus));
            const earned = gs.stats.fossilValue * gs.stats.fossilSenseMult * gs.stats.fossilPickupMult * comboM * nightM * frenzyM * doubM * raptorM * pteroM * spinoPickupM;
            gs.fossilsEarned+=earned;
            if(earned>1) addFloat(gs,`+${Math.floor(earned)}`,p.x,p.y-10,"#ffdd44");
          }
        }
        for(const p of gs.powerupPickups){
          if(!p.collected&&rectsOverlap(DX,DY,DW,DH,p.x,p.y,22,22)){
            p.collected=true;
            const def=p.def;
            if(def.id==="shield_pw"){
              gs.shieldHitsLeft = Math.min(4, (gs.shieldHitsLeft||0) + 1);
              gs.activePowerups.shield_pw={timer:Infinity,duration:0};
              addFloat(gs,`SHIELD x${gs.shieldHitsLeft}`,gs.dino.x-10,gs.dino.y-28,"#4488dd");
            }
            else if(def.id==="heart_pw"){
              const baseLives = gs.design?.id==="trex" ? 2 : 1;
              const maxLives = baseLives + gs.stats.extraLives;
              if(gs.lives < maxLives){ gs.lives++; addFloat(gs,"+1 LIFE!",gs.dino.x-10,gs.dino.y-28,"#dd2244"); }
              else{ const b=Math.floor(10*gs.stats.fossilSenseMult); gs.fossilsEarned+=b; addFloat(gs,`+${b}`,gs.dino.x-10,gs.dino.y-28,"#ffdd44"); }
            }
            else{
              const dBonus=def.id==="giant_pw"?gs.stats.giantDurBonus
                :def.id==="frenzy_pw"?gs.stats.frenzyDurBonus
                :def.id==="ghost_pw"?gs.stats.ghostDurBonus
                :def.id==="tiny_pw"?gs.stats.tinyDurBonus
                :def.id==="doubler_pw"?gs.stats.doublerDurBonus
                :def.id==="slowmo_pw"?gs.stats.slowDurBonus
                :def.id==="coinmania_pw"?gs.stats.windfallDurBonus
                :def.id==="meteor_pw"?gs.stats.meteorDurBonus
                :0;
              gs.activePowerups[def.id]={timer:def.duration+dBonus,duration:def.duration+dBonus};
            }
            if(def.id!=="heart_pw"&&def.id!=="shield_pw") addFloat(gs,def.label+"!",CANVAS_W/2-28,96,def.color);
            // Track powerup use
            gs.powerupUseLog = gs.powerupUseLog || {};
            gs.powerupUseLog[def.id] = (gs.powerupUseLog[def.id]||0)+1;
            gs.totalPowerupUsesThisRun = (gs.totalPowerupUsesThisRun||0)+1;
          }
        }

        if(gs.stats.runDripRate>0) gs.fossilsEarned+=gs.speed*gs.stats.runDripRate*(1+gs.stats.speedBonusMult)*frenzyM*doubM*dt;
        gs.floatingTexts=gs.floatingTexts.filter(t=>{t.y+=t.vy*dt;t.life-=dt;return t.life>0;});
        gs.passiveEffects=gs.passiveEffects.filter(e=>{
          e.life+=dt;
          // Headbutt effect tracks the dino position for the full duration
          if(e.type==="headbutt") { e.x=gs.dino.x; e.y=gs.dino.y; }
          return e.life<e.maxLife;
        });

        // ── Entity silhouette update ─────────────────────────────────────────
        const ent = gs.entity;
        if(!ent.visible) {
          // 0.02% chance per ~60 frames (once per ~83 min of play)
          if(gs.frame % 60 === 0 && Math.random() < 0.0002) {
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
      if(SCN.id==="cave"){
        // Bioluminescent glow patches on the back wall — static per-position shimmer
        const glowPatches = [
          {x:38,  y:28, rx:28, ry:18, col:"#6611cc"},
          {x:110, y:52, rx:20, ry:14, col:"#224488"},
          {x:185, y:18, rx:34, ry:20, col:"#441188"},
          {x:270, y:44, rx:22, ry:16, col:"#116644"},
          {x:340, y:22, rx:30, ry:18, col:"#5511aa"},
          {x:420, y:50, rx:18, ry:12, col:"#224466"},
          {x:490, y:30, rx:26, ry:16, col:"#330088"},
          {x:560, y:48, rx:20, ry:14, col:"#115533"},
        ];
        for(const p of glowPatches){
          const pulse = 0.06 + Math.sin(gs.frame*0.022 + p.x*0.04)*0.03;
          ctx.save();
          ctx.globalAlpha = pulse;
          ctx.fillStyle = p.col;
          // Pixel-art ellipse approximation — 3 stacked rects
          ctx.fillRect(p.x - p.rx*0.5|0, p.y - p.ry,     p.rx,   p.ry*2);
          ctx.fillRect(p.x - p.rx,       p.y - p.ry*0.5|0, p.rx*2, p.ry);
          ctx.fillRect(p.x - p.rx*0.7|0, p.y - p.ry*0.8|0, p.rx*1.4|0, p.ry*1.6|0);
          ctx.restore();
        }
        // Crystal cluster silhouettes on the back wall mid-layer
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = "#3a1a6a";
        const wallClusters = [60,150,240,330,430,520];
        for(const wx of wallClusters){
          ctx.fillRect(wx,    55, 6, 28);
          ctx.fillRect(wx+8,  48, 8, 35);
          ctx.fillRect(wx+18, 58, 5, 25);
          ctx.fillRect(wx+25, 52, 7, 31);
        }
        ctx.restore();
      } else {
        if(B>0.05) drawStars(ctx,gs.stars,B);
        drawPixelSun(ctx,gs.sunX,gs.sunY,gs.sunAlpha);
        drawPixelMoon(ctx,gs.moonX,gs.moonY,gs.moonAlpha);
      }
      drawClouds(ctx,gs.clouds,SCN);
      if(gs.entity.alpha>0) drawEntitySilhouette(ctx,gs.entity.x,gs.entity.y,gs.frame,gs.entity.alpha,SCN);
      drawGround(ctx,gs.groundOffset,SCN,B);

      for(const o of gs.obstacles){ o._nightBlend=B; }
      for(const o of gs.obstacles) drawObstacleForScenery(ctx,o,SCN,gs.frame);

      const HUD = getHudColors(SCN, B);
      for(const p of gs.pickups){ if(!p.collected) drawBonePickup(ctx,p.x,p.y,HUD.bonePick); }

      for(const p of gs.powerupPickups){
        if(!p.collected){
          if(p.def.id==="heart_pw"||p.def.id==="shield_pw"){
            drawPowerupIcon(ctx,p.def.id,p.x,p.y,p.def.color);
          } else {
            const pulse=0.8+Math.sin(gs.frame*0.14)*0.2;
            ctx.save(); ctx.globalAlpha=pulse;
            drawPowerupIcon(ctx,p.def.id,p.x,p.y,p.def.color);
            ctx.restore();
          }
        }
      }

      // Powerup overlays
      const hasSpdPwR  = false;
      const hasGiantR  = !!gs.activePowerups.giant_pw;
      const hasGhostR  = !!gs.activePowerups.ghost_pw;
      const hasSlowPwR = !!gs.activePowerups.slowmo_pw;
      const hasFrenzyR = !!gs.activePowerups.frenzy_pw;
      const hasDoublerR= !!gs.activePowerups.doubler_pw;
      const hasTinyR   = !!gs.activePowerups.tiny_pw;

      if(gs.activePowerups.shield_pw){
        drawShieldOutline(ctx,gs.dino.x,gs.dino.y,gs.frame,gs.dino.dead,
          gs.skin,gs.design,hasGiantR,gs.dino.ducking,hasTinyR,gs.dino.onGround,
          gs.deathAnim,gs.shieldHitsLeft);
      }
      if(hasSpdPwR){const sc2=gs.skin?.color||"#2a2a2a";for(let i=1;i<=4;i++){ctx.fillStyle=sc2;ctx.globalAlpha=0.1;ctx.fillRect(gs.dino.x-i*14,gs.dino.y+4,DINO_W,DINO_H-8);}ctx.globalAlpha=1;}
      for(const e of gs.passiveEffects) drawPassiveEffect(ctx,e.type,e.x,e.y,gs.frame,e.life/e.maxLife);
      if(hasSlowPwR){ctx.fillStyle="rgba(34,187,170,0.06)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
        // Warning flash when about to expire (last 2 seconds = 120 frames)
        if(gs.activePowerups.slowmo_pw && gs.activePowerups.slowmo_pw.timer<=120){
          const warn=Math.sin(gs.frame*0.35)*0.5+0.5;
          ctx.fillStyle=`rgba(34,187,170,${warn*0.18})`;
          ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
          ctx.fillStyle=`rgba(34,187,170,${warn*0.9})`;
          ctx.font="bold 10px 'Courier New'";
          ctx.textAlign="center";
          ctx.fillText("SLOW ENDING!",CANVAS_W/2,CANVAS_H-28);
          ctx.textAlign="left";
        }
      }
      // CursedWall slow overlay
      if((gs.curseSlowTimer||0)>0){
        const t=Math.min(1,gs.curseSlowTimer/90);
        ctx.fillStyle=`rgba(120,40,200,${t*0.10})`;
        ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
        ctx.fillStyle=`rgba(180,80,255,${t*0.7})`;
        ctx.font="bold 10px 'Courier New'";
        ctx.textAlign="center";
        ctx.fillText("CURSED!",CANVAS_W/2,CANVAS_H-28);
        ctx.textAlign="left";
      }
      if(hasGiantR){ctx.fillStyle="rgba(200,68,0,0.07)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
      if(hasGhostR){ctx.fillStyle="rgba(136,136,200,0.07)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
      if(hasFrenzyR){ctx.fillStyle=`rgba(220,30,100,${0.04+Math.sin(gs.frame*0.18)*0.03})`;ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
      if(hasDoublerR){ctx.fillStyle="rgba(255,220,30,0.06)";ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}

      // Anky pulse wave flash on activation
      if(designId==="anky" && (gs.ankyFlashTimer||0) > 0) {
        const fade = gs.ankyFlashTimer / 50;
        const pulse = 0.6 + Math.sin(gs.frame * 0.4) * 0.4;
        const col = `rgba(255,160,0,${fade * pulse})`;
        const f2 = gs.dino.onGround ? Math.floor(gs.frame/5)%2 : 0;
        ctx.save();
        const bx = gs.dino.x + DINO_W/2, by = gs.dino.y + DINO_H;
        const sc2 = hasGiantR ? 1.9 : hasTinyR ? 0.6 : 1;
        if(sc2 !== 1){ ctx.translate(bx,by); ctx.scale(sc2,sc2); ctx.translate(-bx,-by); }
        for(const [ox,oy] of [[-3,0],[3,0],[0,-3],[0,3]])
          drawAnky(ctx, gs.dino.x+ox, gs.dino.y+oy, false, col, col, col, col, gs.dino.ducking, f2);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = fade * 0.10;
        ctx.fillStyle = "#ffaa00";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.restore();
      }

      // Tri horn projectiles flying across screen
      if(designId==="tri" && gs.triHorns && gs.triHorns.length > 0) {
        for(const h of gs.triHorns) {
          ctx.save();
          ctx.translate(h.x, h.y);
          const angle = Math.atan2(h.vy, h.vx);
          ctx.rotate(angle);
          // Horn shape: long pointed triangle
          ctx.fillStyle = "#cc8800";
          ctx.fillRect(-2, -3, 18, 6);   // shaft
          ctx.fillRect(14, -4, 6,  8);   // wide base of tip
          ctx.fillRect(18, -3, 5,  6);   // mid tip
          ctx.fillRect(21, -2, 4,  4);   // narrow tip
          ctx.fillRect(23, -1, 4,  2);   // point
          // highlight
          ctx.fillStyle = "#ffcc44";
          ctx.fillRect(0,  -2, 14, 2);   // top highlight
          ctx.fillRect(14, -3,  5, 2);
          ctx.restore();
        }
      }

      // Tri horn burst flash on activation
      if(designId==="tri" && (gs.triFlashTimer||0) > 0) {
        const fade = gs.triFlashTimer / 50;
        const pulse = 0.6 + Math.sin(gs.frame * 0.4) * 0.4;
        const col = `rgba(220,150,0,${fade * pulse})`;
        const f2 = gs.dino.onGround ? Math.floor(gs.frame/5)%2 : 0;
        ctx.save();
        const bx = gs.dino.x + DINO_W/2, by = gs.dino.y + DINO_H;
        const sc2 = hasGiantR ? 1.9 : hasTinyR ? 0.6 : 1;
        if(sc2 !== 1){ ctx.translate(bx,by); ctx.scale(sc2,sc2); ctx.translate(-bx,-by); }
        for(const [ox,oy] of [[-3,0],[3,0],[0,-3],[0,3]])
          drawTri(ctx, gs.dino.x+ox, gs.dino.y+oy, false, col, col, col, col, col, gs.dino.ducking, f2);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = fade * 0.10;
        ctx.fillStyle = "#cc8800";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.restore();
      }

      // Stego plate armor flash on proc
      if(designId==="stego" && gs.stegoFlashTimer > 0) {
        const fade = gs.stegoFlashTimer / 40;
        const pulse = 0.6 + Math.sin(gs.frame * 0.4) * 0.4;
        const col = `rgba(255,200,50,${fade * pulse})`;
        const f2 = gs.dino.onGround ? Math.floor(gs.frame/5)%2 : 0;
        ctx.save();
        const bx = gs.dino.x + DINO_W/2, by = gs.dino.y + DINO_H;
        const sc2 = hasGiantR ? 1.9 : hasTinyR ? 0.6 : 1;
        if(sc2 !== 1){ ctx.translate(bx,by); ctx.scale(sc2,sc2); ctx.translate(-bx,-by); }
        for(const [ox,oy] of [[-3,0],[3,0],[0,-3],[0,3]])
          drawStego(ctx, gs.dino.x+ox, gs.dino.y+oy, false, col, col, col, gs.dino.ducking, f2);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = fade * 0.12;
        ctx.fillStyle = "#ffcc00";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.restore();
      }

      // Pterodac fly mode: blue pulsing outline while active
      if(designId==="pterodac" && gs.pterodacFlyTimer > 0)
        drawPterodacFlyOutline(ctx, gs.dino.x, gs.dino.y, gs.frame, gs.dino.ducking, hasGiantR, hasTinyR);

      // Pachy headbutt: yellow pulsing outline + forward streaks for full 5s duration
      if(designId==="pachy" && gs.pachyHeadbuttActive > 0)
        drawPachyHeadbuttOutline(ctx, gs.dino.x, gs.dino.y, gs.frame, gs.dino.ducking, gs.pachyHeadbuttActive, hasGiantR, hasTinyR);

      // Raptor speed rush: green outline only while timer is active
      if(designId==="raptor" && gs.raptorOutlineTimer > 0)
        drawSpeedRushOutline(ctx, gs.dino.x, gs.dino.y, gs.frame, gs.dino.ducking, gs.raptorOutlineTimer, hasGiantR, hasTinyR);

      // Draw dino  Epass onGround so legs freeze mid-air
      drawDino(ctx,gs.dino.x,gs.dino.y,gs.frame,gs.dino.dead,
        gs.skin,gs.design,hasGiantR,gs.dino.ducking,hasTinyR,hasGhostR||(designId==="dilopho"&&gs.dilophoPhaseActive>0),
        gs.dino.invTimer, gs.dino.onGround, gs.deathAnim);

      // Meteor rain rendering
      if(gs.meteorAnim && gs.meteorAnim.length > 0){
        for(const ma of gs.meteorAnim){
          ctx.save();
          // Trail
          for(let i=1;i<=5;i++){
            ctx.globalAlpha=0.12*(6-i);
            ctx.fillStyle="#ff4400";
            const tw=14-i*2;
            ctx.fillRect(ma.x-tw/2-ma.vx*i*0.5, ma.y-ma.vy*i*0.4-tw/2, tw, tw);
          }
          // Fireball core
          ctx.globalAlpha=1;
          ctx.fillStyle="#ff6600"; ctx.fillRect(ma.x-9, ma.y-9, 18, 18);
          ctx.fillStyle="#ffcc00"; ctx.fillRect(ma.x-6, ma.y-6, 12, 12);
          ctx.fillStyle="#ffffff"; ctx.fillRect(ma.x-3, ma.y-3, 6,  6);
          ctx.restore();
        }
      }

      // Floating texts
      for(const t of gs.floatingTexts){
        const a=Math.min(1,t.life/t.maxLife*2);
        ctx.globalAlpha=a; ctx.fillStyle=t.color; ctx.font="bold 11px 'Courier New'";
        ctx.fillText(t.text,t.x,t.y); ctx.globalAlpha=1;
      }

      // HUD
      ctx.font="bold 14px 'Courier New'"; ctx.fillStyle=HUD.hudText;
      ctx.textAlign="right";
      ctx.fillText(`${Math.floor(gs.distance)}m`,CANVAS_W-8,24);
      ctx.textAlign="left";
      drawFossilDiamond(ctx,10+13/2,8+13/2,13,HUD.fossil);
      ctx.font="bold 13px 'Courier New'"; ctx.fillStyle=HUD.hudText;
      ctx.fillText(`${Math.floor(gs.fossilsEarned)}`,28,20);

      // Hearts
      if(gs.lives>0){
        const heartSize=14,heartGap=4;
        const totalW=gs.lives*(heartSize+heartGap)-heartGap;
        const startX=CANVAS_W-totalW-8,heartY=CANVAS_H-heartSize-8;
        for(let i=0;i<gs.lives;i++) drawHeart(ctx,startX+i*(heartSize+heartGap),heartY,heartSize,HUD.heart);
      }

      // Shield HUD icons (above hearts)
      if(gs.shieldHitsLeft>0){
        const shieldSize=14,shieldGap=4;
        const totalW=gs.shieldHitsLeft*(shieldSize+shieldGap)-shieldGap;
        const startX=CANVAS_W-totalW-8,shieldY=CANVAS_H-shieldSize*2-14;
        for(let i=0;i<gs.shieldHitsLeft;i++) drawShieldIcon(ctx,startX+i*(shieldSize+shieldGap),shieldY,shieldSize,"#4488dd");
      }

      // Combo
      if(gs.combo>1){
        ctx.fillStyle=HUD.hudText;ctx.font="11px 'Courier New'";
        ctx.fillText(`x${gs.combo} COMBO`,12,40);
      }

      // Active dino passive indicator
      const designId2 = gs.design?.id || "raptor";
      const passive = DINO_PASSIVES[designId2];
      if(passive){
        ctx.fillStyle=HUD.hudText; ctx.globalAlpha=0.55;
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
        }
      }

      // Tri horn burst cooldown bar
      if(designId2==="tri") {
        const frac = Math.min(1, (gs.triHornTimer||0) / (20*60));
        ctx.fillStyle="rgba(0,0,0,0.22)"; ctx.fillRect(12,60,80,5);
        ctx.fillStyle="#cc8800";          ctx.fillRect(12,60,Math.floor(80*frac),5);
        ctx.fillStyle=HUD.hud; ctx.font="8px 'Courier New'";
        ctx.fillText(frac>=1?"HORN READY":"HORN BURST",12,74);
      }

      // Anky pulse wave cooldown bar
      if(designId2==="anky") {
        const frac = Math.min(1, (gs.ankyPulseTimer||0) / (15*60));
        ctx.fillStyle="rgba(0,0,0,0.22)"; ctx.fillRect(12,60,80,5);
        ctx.fillStyle="#ffaa00";          ctx.fillRect(12,60,Math.floor(80*frac),5);
        ctx.fillStyle=HUD.hud; ctx.font="8px 'Courier New'";
        ctx.fillText(frac>=1?"PULSE READY":"PULSE WAVE",12,74);
      }

      // Pachy headbutt cooldown bar
      if(designId2==="pachy") {
        const isActive = gs.pachyHeadbuttActive > 0;
        const frac = isActive
          ? gs.pachyHeadbuttActive / (5*60)
          : Math.min(1, (gs.pachyHeadbuttTimer||0) / (30*60));
        const barCol = isActive ? "#ffee00" : "#ccaa00";
        ctx.fillStyle="rgba(0,0,0,0.22)"; ctx.fillRect(12,60,80,5);
        ctx.fillStyle=barCol;             ctx.fillRect(12,60,Math.floor(80*frac),5);
        ctx.fillStyle=HUD.hud; ctx.font="8px 'Courier New'";
        ctx.fillText(isActive?"HEADBUTTING":frac>=1?"HEADBUTT READY":"HEADBUTT",12,74);
      }

      // Dilopho phase shift cooldown bar
      if(designId2==="dilopho") {
        const isPhasing = gs.dilophoPhaseActive > 0;
        const frac = isPhasing
          ? gs.dilophoPhaseActive / (7*60)
          : Math.min(1, (gs.dilophoPhaseTimer||0) / (30*60));
        const barCol = isPhasing ? "#66ff22" : "#338811";
        ctx.fillStyle="rgba(0,0,0,0.22)"; ctx.fillRect(12,60,80,5);
        ctx.fillStyle=barCol;             ctx.fillRect(12,60,Math.floor(80*frac),5);
        ctx.fillStyle=HUD.hud; ctx.font="8px 'Courier New'";
        ctx.fillText(isPhasing?"PHASING":frac>=1?"PHASE READY":"PHASE SHIFT",12,74);
      }

      // Pterodac fly mode timer bar
      if(designId2==="pterodac") {
        const isFly = gs.pterodacFlyTimer > 0;
        const frac  = isFly
          ? gs.pterodacFlyTimer  / (10*60)
          : 1 - gs.pterodacFlyCooldown / (30*60);
        const barCol = isFly ? "#44aaff" : "#226688";
        ctx.fillStyle="rgba(0,0,0,0.22)"; ctx.fillRect(12,60,80,5);
        ctx.fillStyle=barCol;             ctx.fillRect(12,60,Math.floor(80*Math.min(1,Math.max(0,frac))),5);
        ctx.fillStyle=HUD.hud; ctx.font="8px 'Courier New'";
        ctx.fillText(isFly?"FLYING":"FLY READY",12,74);
      }

      // Raptor speed rush indicator
      if(designId2==="raptor"&&gs.raptorSpeedBonus>0){
        ctx.fillStyle=HUD.hudText;ctx.font="9px 'Courier New'";
        ctx.fillText(`RUSH +${(gs.raptorSpeedBonus*0.5).toFixed(1)}% (${gs.raptorSpeedBonus}/20)`,12,68);
      }

      animRef.current=requestAnimationFrame(loop);
    };

    lastTimeRef.current=null;
    animRef.current=requestAnimationFrame(loop);
    return ()=>{ if(animRef.current) cancelAnimationFrame(animRef.current); };
  },[screen,doJump,playPoint,playDie]);

  // ─── BUY FUNCTIONS ───────────────────────────────────────────────────────
  const buyUpgrade = useCallback((up)=>{
    const level=upgradeLevels[up.id]||0;
    if(level>=up.maxLevel){showNotif(`${up.label} is already maxed out!`);return;}
    if(up.id==="dashCd"&&!(upgradeLevels.dash>=1)&&!(upgradeLevels.backdash>=1)){
      showNotif("Unlock Forward Dash or Back Dash first.");return;
    }
    if(up.id==="speedBonus"&&!(upgradeLevels.runDrip>=1)){
      showNotif("Unlock Fossil Trail first.");return;
    }
    if(up.id==="powerupLuck"&&unlockedPowerups.length===0){
      showNotif("Unlock at least one powerup first.");return;
    }
    const cost=getUpgradeCost(up,level);
    if(fossils<cost){showNotif(`Not enough fossils — need ${cost - Math.floor(fossils)} more.`);return;}
    setFossils(cur=>+(cur-cost).toFixed(1));
    setUpgradeLevels(prev=>{
      const cur = prev[up.id]||0;
      if(cur >= up.maxLevel) return prev;
      return {...prev,[up.id]:cur+1};
    });
    setAchievStats(prev=>{
      const nu=prev.totalUpgrades+1;
      const mvIds=["jump","dblJump","dash","backdash","fastdrop","duck","dashCd"];
      const allMax=mvIds.every(id=>(upgradeLevels[id]||0)>=(UPGRADES.find(u=>u.id===id)?.maxLevel||1));
      return {...prev,totalUpgrades:nu,allMovementMax:allMax};
    });
    showNotif(`${up.label} upgraded to level ${(upgradeLevels[up.id]||0)+1}!`);
  },[upgradeLevels,fossils,showNotif]);

  const buySkin = useCallback((sk)=>{
    if(ownedSkins.includes(sk.id)){setEquippedSkin(sk.id);showNotif(`${sk.label} equipped!`);return;}
    setFossils(cur=>{
      if(cur<sk.cost){showNotif(`Not enough fossils — need ${sk.cost - Math.floor(cur)} more.`);return cur;}
      setOwnedSkins(p=>[...p,sk.id]); setEquippedSkin(sk.id);
      setAchievStats(prev=>({...prev,ownedSkins:prev.ownedSkins+1}));
      showNotif(`${sk.label} skin unlocked!`);
      return cur-sk.cost;
    });
  },[ownedSkins,showNotif]);

  const buyDesign = useCallback((d)=>{
    if(ownedDesigns.includes(d.id)){setEquippedDesign(d.id);showNotif(`${d.label} is now active.`);return;}
    if(d.unlockDist&&bestDist<d.unlockDist){showNotif(`Reach ${d.unlockDist}m to unlock ${d.label}.`);return;}
    if(d.cost>0){
      setFossils(cur=>{
        if(cur<d.cost){showNotif(`Not enough fossils — need ${d.cost - Math.floor(cur)} more.`);return cur;}
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
    if(ownedSceneries.includes(s.id)){setActiveScenery(s.id);showNotif(`${s.label} is now active.`);return;}
    setFossils(cur=>{
      if(cur<s.cost){showNotif(`Not enough fossils — need ${s.cost - Math.floor(cur)} more.`);return cur;}
      setOwnedSceneries(p=>[...p,s.id]); setActiveScenery(s.id);
      setAchievStats(prev=>({...prev,ownedSceneries:prev.ownedSceneries+1}));
      showNotif(`${s.label} unlocked!`);
      return cur-s.cost;
    });
  },[ownedSceneries,showNotif]);

  const unlockPowerup = useCallback((def)=>{
    if(unlockedPowerups.includes(def.id)){showNotif(`${def.label} is already unlocked.`);return;}
    setFossils(cur=>{
      if(cur<def.unlockCost){showNotif(`Not enough fossils — need ${def.unlockCost - Math.floor(cur)} more.`);return cur;}
      setUnlockedPowerups(p=>[...p,def.id]);
      showNotif(`${def.label} powerup unlocked!`);
      return cur-def.unlockCost;
    });
  },[unlockedPowerups,showNotif]);

  const stats=getStats(upgradeLevels);

  // ─── ABYSS UNLOCK ────────────────────────────────────────────────────────
  const abyssUnlocked = REGULAR_SCENERY_IDS.every(id => ownedSceneries.includes(id));

  const startBossFight = useCallback(() => {
    navigate("bossfight");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // Bite skill derived from upgrades
  const hasBiteSkill = (upgradeLevels.bite || 0) >= 1;

  // ─── STYLES ──────────────────────────────────────────────────────────────
  const F      = "'Courier New', monospace";
  const BG     = "#f0ede6";
  const DARK   = "#1a1a1a";
  const BORDER = "#2a2a2a";
  const MUTED  = "#888";

  const outer={minHeight:"100dvh",background:BG,fontFamily:F,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",userSelect:"none",boxSizing:"border-box",width:"100%",overflowX:"hidden"};
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
      startGame={startGame} setScreen={navigate}
      totalRuns={totalRuns} bestDist={bestDist} fossils={fossils} passiveRate={passiveRate}
      notification={notification} achivNotif={achivNotif}
      ownedSkins={ownedSkins} ownedDesigns={ownedDesigns} ownedSceneries={ownedSceneries}
      playerMenuRank={playerMenuRank}
      allMenuRanks={allMenuRanks}
      displayRankIdx={displayRankIdx}
      setDisplayRankIdx={setDisplayRankIdx}
      musicMuted={musicMuted} setMusicMuted={setMusicMuted}
      musicVolume={musicVolume} setMusicVolume={setMusicVolume}
      activeScenery={activeScenery}
      abyssUnlocked={abyssUnlocked} startBossFight={startBossFight}
      touchButtons={touchButtons} setTouchButtons={setTouchButtons}
      touchButtonOpacity={touchButtonOpacity} setTouchButtonOpacity={setTouchButtonOpacity}
      controlsToastSeen={controlsToastSeen} setControlsToastSeen={setControlsToastSeen}
      isTouchDevice={isTouchDevice}
      claimableAch={claimableAch}
      exitWarning={exitWarning}
      F={F} BG={BG} DARK={DARK} BORDER={BORDER} MUTED={MUTED}
    />
  );

  if(screen==="game"||screen==="gameover") return (
    <div style={{...outer,justifyContent:"center",padding:0}}>
      {screen==="game" && (!controlsToastSeen || (isTouchDevice && !landscapeToastSeen)) && (
        <div
          onTouchStart={(e)=>e.stopPropagation()}
          onTouchEnd={(e)=>e.stopPropagation()}
          onMouseDown={(e)=>e.stopPropagation()}
          onMouseUp={(e)=>e.stopPropagation()}
          style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",zIndex:2000,display:"flex",flexDirection:"column",gap:6,width:"calc(100vw - 24px)",maxWidth:480,boxSizing:"border-box",touchAction:"auto"}}>
          {!controlsToastSeen && (
            <div style={{background:"rgba(26,26,26,0.92)",color:BG,padding:"8px 14px",fontSize:"clamp(9px,2.5vw,11px)",letterSpacing:1,border:"1px solid #555",display:"flex",alignItems:"center",gap:10}}>
              <span style={{flex:1,lineHeight:1.5}}>
                {isTouchDevice ? "TIP: Use swipe gestures instead of buttons — toggle in SETTINGS" : "TIP: Enable on-screen button controls in SETTINGS"}
              </span>
              <button onClick={()=>setControlsToastSeen(true)} style={{background:"transparent",color:BG,border:"1px solid #888",padding:"3px 8px",fontSize:"clamp(9px,2.5vw,11px)",fontFamily:F,cursor:"pointer",letterSpacing:1,fontWeight:"bold",flexShrink:0,touchAction:"auto",minWidth:32,minHeight:32}}>✕</button>
            </div>
          )}
          {isTouchDevice && !landscapeToastSeen && (
            <div style={{background:"rgba(26,26,26,0.92)",color:BG,padding:"8px 14px",fontSize:"clamp(9px,2.5vw,11px)",letterSpacing:1,border:"1px solid #555",display:"flex",alignItems:"center",gap:10}}>
              <span style={{flex:1,lineHeight:1.5}}>TIP: Rotate your device to landscape for bigger gameplay area</span>
              <button onClick={()=>setLandscapeToastSeen(true)} style={{background:"transparent",color:BG,border:"1px solid #888",padding:"3px 8px",fontSize:"clamp(9px,2.5vw,11px)",fontFamily:F,cursor:"pointer",letterSpacing:1,fontWeight:"bold",flexShrink:0,touchAction:"auto",minWidth:32,minHeight:32}}>✕</button>
            </div>
          )}
        </div>
      )}
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
              onUpgrades={()=>navigate("shop")}
              onMenu={()=>navigate("menu")}
            />
          )}
        </div>
        {touchButtons && screen==="game" && (
          <TouchButtons keysRef={keysRef} stats={getStats(upgradeLevels)} visible={true} canvasRef={canvasRef} opacity={touchButtonOpacity} />
        )}
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
      startGame={startGame} setScreen={navigate}
      notification={notification} achivNotif={achivNotif}
      abyssUnlocked={abyssUnlocked}
      startBossFight={startBossFight}
      activeScenery={activeScenery}
    />
  );

  if(screen==="skins") return (
    <SkinsScreen
      fossils={fossils} bestDist={bestDist}
      ownedSkins={ownedSkins} ownedDesigns={ownedDesigns} ownedSceneries={ownedSceneries}
      equippedSkin={equippedSkin} equippedDesign={equippedDesign} activeScenery={activeScenery}
      buySkin={buySkin} buyDesign={buyDesign} buyScenery={buyScenery}
      startGame={startGame} setScreen={navigate}
      abyssUnlocked={abyssUnlocked} startBossFight={startBossFight}
      notification={notification} achivNotif={achivNotif}
    />
  );

  if(screen==="achievements") return (
    <AchievementsScreen
      unlockedAch={unlockedAch}
      claimableAch={claimableAch}
      onClaim={(id, reward, rewardLabel)=>{
        setClaimableAch(prev=>prev.filter(x=>x!==id));
        setFossils(f=>f+reward);
        setTotalFossils(f=>f+reward);
        setNotification(`+${rewardLabel || `${reward} fossils`} claimed!`);
        setTimeout(()=>setNotification(null),2200);
      }}
      notification={notification} achivNotif={achivNotif}
      onBack={()=>navigate("menu")}
      F={F} BG={BG} DARK={DARK} BORDER={BORDER} MUTED={MUTED}
    />
  );

  if(screen==="leaderboard") return (
    <LeaderboardScreen
      lbData={lbData} setLbData={setLbData}
      lbLoading={lbLoading} setLbLoading={setLbLoading}
      onBack={()=>navigate("menu")}
      showNotif={showNotif}
    />
  );

  if(screen==="feedback") return (
    <FeedbackScreen onBack={()=>navigate("menu")} showNotif={showNotif} />
  );

  if(screen==="bossfight") return (
    <BossFightScreen
      key={bossKey}
      skin={currentSkin}
      design={currentDesign}
      stats={{ ...stats, hasBite: hasBiteSkill }}
      lives={(equippedDesign==="trex"?2:1)+stats.extraLives}
      fossils={fossils}
      touchButtons={touchButtons}
      touchButtonOpacity={touchButtonOpacity}
      onWin={()=>{
        setFossils(f => f + 5000);
        setTotalFossils(f => f + 5000);
        showNotif("The Horror Entity is defeated! +5000 fossils!");
        navigate("menu");
      }}
      onDeath={()=>setBossKey(k => k + 1)}
      onMenu={()=>navigate("menu")}
      notification={notification}
      achivNotif={achivNotif}
    />
  );

  return null;
}