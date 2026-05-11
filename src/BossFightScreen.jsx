import { useEffect, useRef, useState } from "react";
import { CANVAS_W, CANVAS_H } from "./constants";
import { initBossState, WIN_REWARD }  from "./boss/bossConstants";
import { tickBoss }                   from "./boss/bossTick";
import { renderBoss, CrackOverlay }   from "./boss/bossRender.jsx";
import { playClick } from "./hooks/useSoundEffects";
import TouchButtons from "./TouchButtons";

const F      = "'Courier New', monospace";
const DARK   = "#1a1a1a";
const BG     = "#f0ede6";
const BORDER = "#2a2a2a";
const MUTED  = "#888";

const btn = (primary = false) => ({
  background: primary ? DARK : BG,
  color:      primary ? BG   : DARK,
  border: `2px solid ${BORDER}`,
  padding: "10px 20px", fontSize: 12, fontFamily: F,
  cursor: "pointer", letterSpacing: 2, fontWeight: "bold",
});

const notifStyle = { position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:DARK, color:BG, padding:"9px 22px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #555" };
const achivStyle = { position:"fixed", top:24,    left:"50%", transform:"translateX(-50%)", background:"#1a1a2a", color:"#ffdd44", padding:"10px 24px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #ffdd44" };

// ─── CINEMATIC INTRO ─────────────────────────────────────────────────────────
const INTRO_LINES = [
  { text: "BEYOND THE ABYSS",     delay: 0,    duration: 1800, style: { fontSize: 11, letterSpacing: 8,  color: "#6633aa" } },
  { text: "something stirs.",     delay: 1800, duration: 1600, style: { fontSize: 13, letterSpacing: 4,  color: "#9966cc", fontStyle: "italic" } },
  { text: "IT HAS BEEN WAITING.", delay: 3400, duration: 1800, style: { fontSize: 11, letterSpacing: 6,  color: "#cc44ff" } },
  { text: "waiting for you.",     delay: 5200, duration: 1600, style: { fontSize: 13, letterSpacing: 4,  color: "#aa88dd", fontStyle: "italic" } },
  { text: "DO NOT LET IT SPEAK.", delay: 6800, duration: 2000, style: { fontSize: 11, letterSpacing: 6,  color: "#ff4444" } },
];
const INTRO_TOTAL_MS = 9800;
const GLITCH_NAMES = ["\u2593\u2592\u2591\u2588\u2593\u2592\u2591", "\u2588\u2591\u2592\u2593\u2591\u2592\u2588", "\u2591\u2593\u2588\u2592\u2591\u2593\u2592", "\u2592\u2588\u2591\u2593\u2592\u2591\u2588"];

function CinematicIntro({ onDone }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);
  const rafRef   = useRef(null);
  const doneRef  = useRef(false);

  const finish = () => {
    if(doneRef.current) return;
    doneRef.current = true;
    if(rafRef.current) cancelAnimationFrame(rafRef.current);
    onDone();
  };

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now) => {
      const ms = now - startRef.current;
      setElapsed(ms);
      if(ms < INTRO_TOTAL_MS + 600) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showName = elapsed > INTRO_TOTAL_MS - 1200;
  const nameVariant = GLITCH_NAMES[Math.floor(elapsed / 90) % GLITCH_NAMES.length];

  return (
    <div
      onClick={finish}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: F, cursor: "pointer", userSelect: "none",
      }}
    >
      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)",
      }} />
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.9) 100%)",
      }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 40px", maxWidth: 540 }}>
        {INTRO_LINES.map((line, i) => {
          const fadeIn  = 400, fadeOut = 400;
          const lineEnd = line.delay + line.duration;
          let alpha = 0;
          if(elapsed >= line.delay && elapsed <= lineEnd) {
            alpha = Math.min(
              (elapsed - line.delay) / fadeIn,
              (lineEnd - elapsed) / fadeOut,
              1
            );
          }
          if(alpha <= 0) return null;
          return (
            <div key={i} style={{ opacity: alpha, marginBottom: 10, ...line.style }}>
              {line.text}
            </div>
          );
        })}

        {showName && (
          <div style={{
            marginTop: 36,
            fontSize: 24,
            fontWeight: "bold",
            letterSpacing: 8,
            color: "#cc44ff",
            opacity: Math.min((elapsed - (INTRO_TOTAL_MS - 1200)) / 500, 1),
            textShadow: "0 0 18px #aa00ff, 0 0 36px #6600cc",
          }}>
            {nameVariant}
          </div>
        )}

        <div style={{
          marginTop: 60,
          fontSize: 9, letterSpacing: 3, color: "#333",
          opacity: elapsed > 1200 ? 0.7 : 0,
        }}>
          [ TAP TO SKIP ]
        </div>
      </div>
    </div>
  );
}

export default function BossFightScreen({
  skin, design, stats, lives,
  onWin, onDeath, onMenu,
  fossils,
  notification, achivNotif,
  touchButtons, touchButtonOpacity,
}) {
  const canvasRef   = useRef(null);
  const gsRef       = useRef(null);
  const animRef     = useRef(null);
  const lastTimeRef = useRef(null);
  const keysRef     = useRef({});
  const prevKeysRef = useRef({});
  const [overlay, setOverlay] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [corruption, setCorruption] = useState(0);
  const corruptionRef = useRef(0);
  const lastTapRef    = useRef(0);
  const touchStartRef = useRef(null);

  const triggerOverlay = (val) => { setOverlay(val); };

  useEffect(() => {
    const onDown = e => {
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyW","KeyS","KeyF","KeyB","Enter"].includes(e.code))
        e.preventDefault();
      // B and Enter also trigger bite
      if(e.code === "KeyB" || e.code === "Enter") { keysRef.current["KeyF"] = true; return; }
      keysRef.current[e.code] = true;
    };
    const onUp = e => {
      if(e.code === "KeyB" || e.code === "Enter") { keysRef.current["KeyF"] = false; return; }
      keysRef.current[e.code] = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  // Touch gestures: double-tap = bite (KeyF), swipe = movement
  // Skip if on-screen buttons are enabled — they handle all input
  useEffect(() => {
    if(touchButtons) return;
    const DOUBLE_TAP_MS = 300;
    const onTouchStart = e => {
      if(e.cancelable) e.preventDefault();
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      keysRef.current["Space"] = true;
    };
    const onTouchEnd = e => {
      if(e.cancelable) e.preventDefault();
      if(!touchStartRef.current) return;
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      const now = Date.now();
      const absDx = Math.abs(dx), absDy = Math.abs(dy);
      touchStartRef.current = null;

      // Tap (no significant movement)
      if(absDx < 18 && absDy < 18) {
        keysRef.current["Space"] = false;
        if(now - lastTapRef.current < DOUBLE_TAP_MS) {
          // Double-tap = bite
          lastTapRef.current = 0;
          keysRef.current["KeyF"] = true;
          setTimeout(() => { keysRef.current["KeyF"] = false; }, 80);
        } else {
          // Single tap = jump
          lastTapRef.current = now;
          keysRef.current["Space"] = true;
          setTimeout(() => { keysRef.current["Space"] = false; }, 80);
        }
        return;
      }
      // Swipe gestures
      keysRef.current["Space"] = false;
      if(absDy > absDx) {
        if(dy < 0) { keysRef.current["Space"] = true; setTimeout(() => { keysRef.current["Space"] = false; }, 80); }
        else { keysRef.current["ArrowDown"] = true; setTimeout(() => { keysRef.current["ArrowDown"] = false; }, 120); }
      } else {
        if(dx > 0) { keysRef.current["ArrowRight"] = true; setTimeout(() => { keysRef.current["ArrowRight"] = false; }, 80); }
        else       { keysRef.current["ArrowLeft"]  = true; setTimeout(() => { keysRef.current["ArrowLeft"]  = false; }, 80); }
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchend",   onTouchEnd,   { passive: false });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [touchButtons]);

  useEffect(() => {
    if(showIntro) return; // wait for intro to finish
    gsRef.current       = initBossState(stats, skin, design, lives);
    keysRef.current     = {};
    prevKeysRef.current = {};

    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");

    const loop = ts => {
      if(!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = Math.min((ts - lastTimeRef.current) / 16.67, 3);
      lastTimeRef.current = ts;
      const gs = gsRef.current;
      if(!gs) { animRef.current = requestAnimationFrame(loop); return; }
      if(gs.alive && !gs.won) {
        tickBoss(gs, keysRef.current, prevKeysRef.current, dt,
          () => triggerOverlay("dead"),
          () => triggerOverlay("won"),
        );
        prevKeysRef.current = { ...keysRef.current };
      } else if(gs.alive && gs.won) {
        // Death animation tick — keep running until deathAnim expires
        tickBoss(gs, keysRef.current, prevKeysRef.current, dt,
          () => triggerOverlay("dead"),
          () => { onWin(); },
        );
      }
      renderBoss(ctx, gs);

      // Update corruption: based on HP lost + phase
      const hpLost = 1 - (gs.bossHp / 15);
      const phaseBonus = gs.bossPhase * 0.28;
      const newCorruption = Math.min(1, hpLost * 0.7 + phaseBonus);
      if(Math.abs(newCorruption - corruptionRef.current) > 0.01) {
        corruptionRef.current = newCorruption;
        setCorruption(newCorruption);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = null;
    animRef.current = requestAnimationFrame(loop);
    return () => { if(animRef.current) cancelAnimationFrame(animRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIntro]);

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden" }}>
      {showIntro && <CinematicIntro onDone={() => setShowIntro(false)} />}
      <div style={{ width:"100%", maxWidth:CANVAS_W, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 0 20px" }}>

        <div style={{ width:"100%", display:"flex", justifyContent:"flex-start", alignItems:"center", padding:"6px 4px", boxSizing:"border-box", fontFamily:F, fontSize:11, color:MUTED }}>
          <span style={{ letterSpacing:3, fontSize:10 }}>THE ABYSS</span>
        </div>

        <div style={{ border:`2px solid ${BORDER}`, lineHeight:0, width:"100%", position:"relative" }}>
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{ display:"block", width:"100%" }} />
          <CrackOverlay corruption={corruption} />

          {overlay === "won" && (
            <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,0.96)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
              <div style={{ fontSize:10, letterSpacing:4, color:"#886600" }}>VICTORY</div>
              <div style={{ fontSize:22, fontWeight:"bold", color:"#443300", letterSpacing:2 }}>YOU SURVIVED</div>
              <div style={{ fontSize:12, color:"#886600", letterSpacing:2 }}>+{WIN_REWARD} FOSSILS</div>
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <button style={btn(true)}  onClick={() => { playClick(); onWin(); }}>[ CONTINUE ]</button>
                <button style={btn(false)} onClick={() => { playClick(); onMenu(); }}>[ MENU ]</button>
              </div>
            </div>
          )}

          {overlay === "dead" && (
            <div style={{
              position:"absolute", inset:0,
              background:"#000",
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              gap:0, overflow:"hidden",
            }}>
              {/* Void radial glow */}
              <div style={{
                position:"absolute", inset:0, pointerEvents:"none",
                background:"radial-gradient(ellipse at 50% 60%, rgba(100,0,160,0.22) 0%, transparent 70%)",
              }}/>
              {/* Scanlines */}
              <div style={{
                position:"absolute", inset:0, pointerEvents:"none",
                backgroundImage:"repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)",
              }}/>
              {/* Crack lines from corners */}
              <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", opacity:0.35 }} viewBox="0 0 720 270" preserveAspectRatio="none">
                <line x1="0"   y1="0"   x2="180" y2="135" stroke="#6600aa" strokeWidth="1"/>
                <line x1="720" y1="0"   x2="540" y2="135" stroke="#6600aa" strokeWidth="1"/>
                <line x1="0"   y1="270" x2="200" y2="135" stroke="#440088" strokeWidth="1"/>
                <line x1="720" y1="270" x2="520" y2="135" stroke="#440088" strokeWidth="1"/>
                <line x1="360" y1="0"   x2="360" y2="80"  stroke="#8800cc" strokeWidth="1"/>
                <line x1="360" y1="270" x2="360" y2="190" stroke="#8800cc" strokeWidth="1"/>
              </svg>

              {/* Content */}
              <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>

                {/* Corrupted boss name */}
                <div style={{
                  fontSize:11, letterSpacing:6, color:"#6600aa",
                  fontFamily:F, marginBottom:4,
                }}>
                  ▓▒░█▓▒░
                </div>

                {/* Main title */}
                <div style={{
                  fontSize:9, letterSpacing:5, color:"#880000",
                  fontFamily:F, marginBottom:2,
                }}>
                  CONSUMED
                </div>
                <div style={{
                  fontSize:26, fontWeight:"bold", letterSpacing:3,
                  color:"#cc0000", fontFamily:F,
                  textShadow:"0 0 20px rgba(180,0,0,0.6), 0 0 40px rgba(100,0,0,0.4)",
                  lineHeight:1.1,
                }}>
                  YOU FELL
                </div>
                <div style={{
                  fontSize:26, fontWeight:"bold", letterSpacing:3,
                  color:"#880000", fontFamily:F,
                  lineHeight:1.1, marginBottom:6,
                }}>
                  INTO THE VOID
                </div>

                {/* Divider */}
                <div style={{ width:120, height:1, background:"linear-gradient(90deg, transparent, #440066, transparent)", margin:"4px 0" }}/>

                {/* Flavour line */}
                <div style={{
                  fontSize:9, color:"#553366", letterSpacing:2,
                  fontFamily:F, maxWidth:280, lineHeight:1.8,
                  fontStyle:"italic", marginBottom:4,
                }}>
                  It was never going to let you leave.
                </div>

                {/* Boss HP remaining hint */}
                {gsRef.current && gsRef.current.bossHp > 0 && (
                  <div style={{
                    fontSize:9, color:"#440033", letterSpacing:2,
                    fontFamily:F, marginBottom:8,
                  }}>
                    {gsRef.current.bossHp} {gsRef.current.bossHp === 1 ? "bite" : "bites"} remaining
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display:"flex", gap:10, marginTop:10 }}>
                  <button
                    style={{
                      background:"#1a0000", color:"#ff4444",
                      border:"2px solid #cc0000",
                      padding:"10px 20px", fontSize:11, fontFamily:F,
                      cursor:"pointer", letterSpacing:3, fontWeight:"bold",
                    }}
                    onClick={() => { playClick(); onDeath(); }}
                  >[ TRY AGAIN ]</button>
                  <button
                    style={{
                      background:"transparent", color:"#553366",
                      border:"2px solid #330044",
                      padding:"10px 20px", fontSize:11, fontFamily:F,
                      cursor:"pointer", letterSpacing:3, fontWeight:"bold",
                    }}
                    onClick={() => { playClick(); onMenu(); }}
                  >[ RETREAT ]</button>
                </div>
              </div>
            </div>
          )}
        </div>
        {touchButtons && (
          <TouchButtons keysRef={keysRef} stats={stats} visible={true} canvasRef={canvasRef} opacity={touchButtonOpacity ?? 0.88} />
        )}
      </div>
      {notification && <div style={notifStyle}>{notification}</div>}
      {achivNotif   && <div style={achivStyle}>{achivNotif}</div>}
    </div>
  );
}
