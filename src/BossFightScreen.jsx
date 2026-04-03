import { useEffect, useRef, useState } from "react";
import { CANVAS_W, CANVAS_H } from "./constants";
import { initBossState, WIN_REWARD }  from "./boss/bossConstants";
import { tickBoss }                   from "./boss/bossTick";
import { renderBoss, CrackOverlay }   from "./boss/bossRender.jsx";

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

const notifStyle     = { position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:DARK, color:BG, padding:"9px 22px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #555" };
const achivStyle     = { position:"fixed", top:24,    left:"50%", transform:"translateX(-50%)", background:"#1a1a2a", color:"#ffdd44", padding:"10px 24px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #ffdd44" };

export default function BossFightScreen({
  skin, design, stats, lives,
  onWin, onDeath, onMenu,
  fossils,
  notification, achivNotif,
}) {
  const canvasRef   = useRef(null);
  const gsRef       = useRef(null);
  const animRef     = useRef(null);
  const lastTimeRef = useRef(null);
  const keysRef     = useRef({});
  const prevKeysRef = useRef({});
  const [overlay, setOverlay] = useState(null);

  const triggerOverlay = (val) => { setOverlay(val); };

  // Key listeners
  useEffect(() => {
    const onDown = e => {
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyW","KeyS","KeyF"].includes(e.code))
        e.preventDefault();
      keysRef.current[e.code] = true;
    };
    const onUp = e => { keysRef.current[e.code] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  // Init + game loop
  useEffect(() => {
    gsRef.current     = initBossState(stats, skin, design, lives);
    keysRef.current   = {};
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
      }
      renderBoss(ctx, gs);
      animRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = null;
    animRef.current = requestAnimationFrame(loop);
    return () => { if(animRef.current) cancelAnimationFrame(animRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden" }}>
      <div style={{ width:"100%", maxWidth:CANVAS_W, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 0 20px" }}>

        {/* Top bar */}
        <div style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 4px", boxSizing:"border-box", fontFamily:F, fontSize:11, color:MUTED }}>
          <span style={{ letterSpacing:3, fontSize:10 }}>THE ABYSS</span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:14, color:DARK }}>◈</span>
            <b style={{ color:DARK, fontSize:13 }}>{Math.floor(fossils)}</b>
          </span>
        </div>

        {/* Canvas + cracks */}
        <div style={{ border:`2px solid ${BORDER}`, lineHeight:0, width:"100%", position:"relative" }}>
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{ display:"block", width:"100%" }} />
          <CrackOverlay />

          {/* Win overlay */}
          {overlay === "won" && (
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
              <div style={{ fontSize:10, letterSpacing:4, color:"#ffdd44" }}>VICTORY</div>
              <div style={{ fontSize:22, fontWeight:"bold", color:"#ffdd44", letterSpacing:2 }}>YOU SURVIVED</div>
              <div style={{ fontSize:12, color:"#ffaa44", letterSpacing:2 }}>+{WIN_REWARD} FOSSILS</div>
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <button style={btn(true)}  onClick={onWin}>[ CLAIM REWARD ]</button>
                <button style={btn(false)} onClick={onMenu}>[ MENU ]</button>
              </div>
            </div>
          )}

          {/* Death overlay */}
          {overlay === "dead" && (
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
              <div style={{ fontSize:10, letterSpacing:4, color:"#cc0000" }}>DEFEATED</div>
              <div style={{ fontSize:22, fontWeight:"bold", color:"#cc0000", letterSpacing:2 }}>IT CONSUMED YOU</div>
              <div style={{ fontSize:10, color:"#880000", letterSpacing:2, maxWidth:300, textAlign:"center" }}>
                Upgrade your skills and try again.
              </div>
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <button style={btn(true)}  onClick={onDeath}>[ TRY AGAIN ]</button>
                <button style={btn(false)} onClick={onMenu}>[ MENU ]</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {notification && <div style={notifStyle}>{notification}</div>}
      {achivNotif   && <div style={achivStyle}>{achivNotif}</div>}
    </div>
  );
}
