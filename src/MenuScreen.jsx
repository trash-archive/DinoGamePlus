import { useState } from "react";
import { playClick, getSoundMuted, setSoundMuted, getSfxVolume, setSfxVolume } from "./hooks/useSoundEffects";

export default function MenuScreen({
  menuCanvasRef, menuDinoClicks, setMenuDinoClicks, showCredit, setShowCredit,
  startGame, setScreen, totalRuns, bestDist, fossils, passiveRate,
  notification, achivNotif,
  ownedSkins, ownedDesigns, ownedSceneries,
  playerMenuRank,
  musicMuted, setMusicMuted, musicVolume, setMusicVolume,
  activeScenery,
  abyssUnlocked, startBossFight,
  touchButtons, setTouchButtons,
  F, BG, DARK, BORDER, MUTED,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [tabVisible, setTabVisible] = useState(false);
  const [showTrapMenu, setShowTrapMenu] = useState(false);
  const [soundMuted, setSoundMutedState] = useState(() => getSoundMuted());
  const [sfxVolume,  setSfxVolumeState]  = useState(() => getSfxVolume());

  const outer = { minHeight:"100vh", background:BG, fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden" };
  const card  = { background:"#faf8f4", border:`2px solid ${BORDER}`, padding:"28px", boxSizing:"border-box", width:"100%", position:"relative", overflow:"visible" };
  const btn   = (primary=false) => ({ background:primary?DARK:BG, color:primary?BG:DARK, border:`2px solid ${BORDER}`, padding:primary?"13px 0":"10px 2px", fontSize:primary?14:12, fontFamily:F, cursor:"pointer", letterSpacing:primary?4:0, fontWeight:"bold", boxSizing:"border-box", transition:"opacity 0.1s" });
  const notifBox      = { position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:DARK, color:BG, padding:"9px 22px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #555" };
  const achivNotifBox = { position:"fixed", top:24,    left:"50%", transform:"translateX(-50%)", background:"#1a1a2a", color:"#ffdd44", padding:"10px 24px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #ffdd44" };

  const hasAllCollection =
    (ownedSkins?.length    >= 12) &&
    (ownedDesigns?.length  >= 12) &&
    (ownedSceneries?.length >= 8);

  const rankLabel  = playerMenuRank === 1 ? "1ST" : playerMenuRank === 2 ? "2ND" : playerMenuRank === 3 ? "3RD" : `${playerMenuRank}TH`;
  const bannerBg   = playerMenuRank === 1 ? "#c9a227" : playerMenuRank === 2 ? "#7a8fa6" : playerMenuRank === 3 ? "#a0522d" : DARK;
  const bannerColor = playerMenuRank <= 3 ? "#fff" : BG;

  return (
    <div style={outer}>

      {/* Settings modal */}
      {showSettings && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"16px", overflowY:"auto" }}
          onClick={() => setShowSettings(false)}>
          <div style={{ background:"#faf8f4", border:`2px solid ${BORDER}`, padding:"24px", width:"100%", maxWidth:340, fontFamily:F, boxSizing:"border-box", margin:"auto" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:13, fontWeight:"bold", letterSpacing:4, marginBottom:18, color:DARK }}>SETTINGS</div>

            {/* Audio */}
            <div style={{ fontSize:10, fontWeight:"bold", letterSpacing:3, color:DARK, marginBottom:10 }}>AUDIO</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:11, letterSpacing:2, color:DARK }}>MUSIC</span>
              <button onClick={() => { playClick(); setMusicMuted(!musicMuted); }}
                style={{ background:musicMuted?BG:DARK, color:musicMuted?MUTED:BG, border:`2px solid ${BORDER}`, padding:"4px 14px", fontSize:10, fontFamily:F, cursor:"pointer", letterSpacing:2, fontWeight:"bold" }}
              >{musicMuted ? "OFF" : "ON"}</button>
            </div>
            <div style={{ marginBottom:14 }}>
              <input type="range" min="0" max="1" step="0.05" value={musicVolume} disabled={musicMuted}
                onChange={e => setMusicVolume(parseFloat(e.target.value))}
                style={{ width:"100%", accentColor:DARK, opacity:musicMuted?0.3:1 }}
              />
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:11, letterSpacing:2, color:DARK }}>SOUND FX</span>
              <button onClick={() => { const next = !soundMuted; setSoundMuted(next); setSoundMutedState(next); if(!next) playClick(); }}
                style={{ background:soundMuted?BG:DARK, color:soundMuted?MUTED:BG, border:`2px solid ${BORDER}`, padding:"4px 14px", fontSize:10, fontFamily:F, cursor:"pointer", letterSpacing:2, fontWeight:"bold" }}
              >{soundMuted ? "OFF" : "ON"}</button>
            </div>
            <div style={{ marginBottom:18 }}>
              <input type="range" min="0" max="1" step="0.05" value={sfxVolume} disabled={soundMuted}
                onChange={e => { const v = parseFloat(e.target.value); setSfxVolume(v); setSfxVolumeState(v); }}
                style={{ width:"100%", accentColor:DARK, opacity:soundMuted?0.3:1 }}
              />
            </div>

            {/* Touch Buttons */}
            <div style={{ borderTop:`1px solid #ddd`, paddingTop:16, marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:"bold", letterSpacing:3, color:DARK, marginBottom:3 }}>ON-SCREEN BUTTONS</div>
                  <div style={{ fontSize:9, color:MUTED, letterSpacing:1 }}>Auto-enabled on touch devices</div>
                </div>
                <button onClick={() => { playClick(); setTouchButtons(!touchButtons); }}
                  style={{ background:touchButtons?DARK:BG, color:touchButtons?BG:MUTED, border:`2px solid ${BORDER}`, padding:"4px 14px", fontSize:10, fontFamily:F, cursor:"pointer", letterSpacing:2, fontWeight:"bold", flexShrink:0 }}
                >{touchButtons ? "ON" : "OFF"}</button>
              </div>
              <div style={{ fontSize:9, color:MUTED, letterSpacing:1, lineHeight:1.6 }}>Shows ▲▼◀▶ D-pad during gameplay. Only unlocked moves appear.</div>
            </div>

            {/* Controls */}
            <div style={{ borderTop:`1px solid #ddd`, paddingTop:16, marginBottom:10 }}>
              <div style={{ fontSize:10, fontWeight:"bold", letterSpacing:3, color:DARK, marginBottom:12 }}>CONTROLS</div>

              <div style={{ fontSize:10, letterSpacing:2, color:MUTED, marginBottom:6 }}>KEYBOARD</div>
              {[
                ["JUMP",      "Space / W / ↑"],
                ["DASH FWD",  "D / →"],
                ["DASH BACK", "A / ←"],
                ["FAST DROP", "S / ↓"],
                ["DUCK",      "S / ↓  (ground)"],
              ].map(([action, key]) => (
                <div key={action} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7, gap:8 }}>
                  <span style={{ fontSize:10, color:MUTED, letterSpacing:1, flexShrink:0 }}>{action}</span>
                  <span style={{ fontSize:10, color:DARK, fontWeight:"bold", letterSpacing:1, textAlign:"right" }}>{key}</span>
                </div>
              ))}

              <div style={{ fontSize:10, letterSpacing:2, color:MUTED, marginBottom:6, marginTop:14 }}>TOUCH / MOBILE</div>
              <div style={{ fontSize:9, color:MUTED, letterSpacing:1, lineHeight:1.6, marginBottom:8 }}>
                {touchButtons ? "On-screen D-pad active — swipe gestures disabled." : "Swipe gestures active — enable On-Screen Buttons above for D-pad."}
              </div>
              {!touchButtons && [
                ["JUMP",      "Tap / Swipe up"],
                ["FAST DROP", "Swipe down"],
                ["DASH FWD",  "Swipe right"],
                ["DASH BACK", "Swipe left"],
              ].map(([action, key]) => (
                <div key={action} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7, gap:8 }}>
                  <span style={{ fontSize:10, color:MUTED, letterSpacing:1, flexShrink:0 }}>{action}</span>
                  <span style={{ fontSize:10, color:DARK, fontWeight:"bold", letterSpacing:1, textAlign:"right" }}>{key}</span>
                </div>
              ))}
              {touchButtons && [
                ["JUMP",      "▲ button"],
                ["DASH FWD",  "▶ button (if unlocked)"],
                ["DASH BACK", "◀ button (if unlocked)"],
                ["FAST DROP", "▼ button (if unlocked)"],
              ].map(([action, key]) => (
                <div key={action} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7, gap:8 }}>
                  <span style={{ fontSize:10, color:MUTED, letterSpacing:1, flexShrink:0 }}>{action}</span>
                  <span style={{ fontSize:10, color:DARK, fontWeight:"bold", letterSpacing:1, textAlign:"right" }}>{key}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ borderTop:`1px solid #ddd`, paddingTop:14, marginTop:4, display:"flex", flexDirection:"column", gap:8 }}>
              <button style={{ ...btn(true), width:"100%", fontSize:11 }} onClick={() => { playClick(); setShowSettings(false); }}>[ CLOSE ]</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ width:"100%", maxWidth:480, padding:"0 16px", boxSizing:"border-box" }}>
        <div style={card}>

          {/* Rank banner */}
          {playerMenuRank && (
            <div style={{ position:"absolute", top:0, left:14, zIndex:10 }}>
              <div style={{ background:bannerBg, color:bannerColor, fontFamily:F, padding:"5px 8px 0", fontSize:9, letterSpacing:2, textAlign:"center", clipPath:"polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)", width:"clamp(34px,8vw,44px)", height:"clamp(52px,14vw,68px)" }}>
                <div style={{ fontSize:"clamp(6px,1.5vw,7px)", letterSpacing:2, opacity:0.8, marginBottom:0 }}>RANK</div>
                <div style={{ fontSize:"clamp(10px,2.8vw,13px)", fontWeight:"bold", letterSpacing:1 }}>{rankLabel}</div>
              </div>
            </div>
          )}

          {/* Desktop: invisible hover strip + vertical tab on right edge */}
          <div className="settings-hover-strip"
            style={{ position:"absolute", top:0, left:"100%", width:24, height:"100%", zIndex:99 }}
            onMouseEnter={() => setTabVisible(true)}
            onMouseLeave={() => setTabVisible(false)}
          />
          <div className="settings-tab-desktop"
            onMouseEnter={() => setTabVisible(true)}
            onMouseLeave={() => setTabVisible(false)}
            onClick={() => { playClick(); setShowSettings(true); }}
            style={{
              position:"absolute", top:0, left:"100%",
              background:DARK, color:BG,
              writingMode:"vertical-rl", textOrientation:"mixed",
              fontSize:9, letterSpacing:3, fontWeight:"bold", fontFamily:F,
              padding:"12px 5px", cursor:"pointer",
              border:`2px solid ${BORDER}`, borderLeft:"none",
              borderRadius:"0",
              userSelect:"none",
              opacity: tabVisible ? 1 : 0,
              pointerEvents: tabVisible ? "auto" : "none",
              transition:"opacity 0.18s ease",
              zIndex:100,
            }}
          >SETTINGS</div>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:36, fontWeight:"bold", letterSpacing:4, marginBottom:2 }}>DINO</div>
            <div style={{ fontSize:14, letterSpacing:6, marginBottom:16, color:MUTED }}>REIMAGINED</div>
            <div style={{ position:"relative", display:"inline-block", margin:"0 auto 16px" }}>
              {hasAllCollection && (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  style={{ position:"absolute", top:-30, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
                  <path d="M12.0001 3C12.3334 3 12.6449 3.16613 12.8306 3.443L16.6106 9.07917L21.2523 3.85213C21.5515 3.51525 22.039 3.42002 22.4429 3.61953C22.8469 3.81904 23.0675 4.26404 22.9818 4.70634L20.2956 18.5706C20.0223 19.9812 18.7872 21 17.3504 21H6.64977C5.21293 21 3.97784 19.9812 3.70454 18.5706L1.01833 4.70634C0.932635 4.26404 1.15329 3.81904 1.55723 3.61953C1.96117 3.42002 2.44865 3.51525 2.74781 3.85213L7.38953 9.07917L11.1696 3.443C11.3553 3.16613 11.6667 3 12.0001 3Z" fill="#f5c842"/>
                  <path d="M12.0001 5.79533L8.33059 11.2667C8.1582 11.5237 7.8765 11.6865 7.56772 11.7074C7.25893 11.7283 6.95785 11.6051 6.75234 11.3737L3.67615 7.90958L5.66802 18.1902C5.75913 18.6604 6.17082 19 6.64977 19H17.3504C17.8293 19 18.241 18.6604 18.3321 18.1902L20.324 7.90958L17.2478 11.3737C17.0423 11.6051 16.7412 11.7283 16.4324 11.7074C16.1236 11.6865 15.842 11.5237 15.6696 11.2667L12.0001 5.79533Z" fill="#f5c842"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.0001 3C12.3334 3 12.6449 3.16613 12.8306 3.443L16.6106 9.07917L21.2523 3.85213C21.5515 3.51525 22.039 3.42002 22.4429 3.61953C22.8469 3.81904 23.0675 4.26404 22.9818 4.70634L20.2956 18.5706C20.0223 19.9812 18.7872 21 17.3504 21H6.64977C5.21293 21 3.97784 19.9812 3.70454 18.5706L1.01833 4.70634C0.932635 4.26404 1.15329 3.81904 1.55723 3.61953C1.96117 3.42002 2.44865 3.51525 2.74781 3.85213L7.38953 9.07917L11.1696 3.443C11.3553 3.16613 11.6667 3 12.0001 3ZM12.0001 5.79533L8.33059 11.2667C8.1582 11.5237 7.8765 11.6865 7.56772 11.7074C7.25893 11.7283 6.95785 11.6051 6.75234 11.3737L3.67615 7.90958L5.66802 18.1902C5.75913 18.6604 6.17082 19 6.64977 19H17.3504C17.8293 19 18.241 18.6604 18.3321 18.1902L20.324 7.90958L17.2478 11.3737C17.0423 11.6051 16.7412 11.7283 16.4324 11.7074C16.1236 11.6865 15.842 11.5237 15.6696 11.2667L12.0001 5.79533Z" fill={DARK}/>
                </svg>
              )}
              <canvas ref={menuCanvasRef} width={80} height={70} style={{ display:"block", cursor:"pointer" }}
                onClick={() => {
                  const next = menuDinoClicks + 1;
                  setMenuDinoClicks(next);
                  if(next >= 5){ setShowCredit(true); setMenuDinoClicks(0); setTimeout(() => setShowCredit(false), 3000); }
                }}/>
              {showCredit && (
                <div style={{ position:"absolute", top:-20, left:"50%", transform:"translateX(-50%)", fontSize:9, color:"#888", whiteSpace:"nowrap", letterSpacing:1, pointerEvents:"none" }}>
                  By Hasim Tordios
                </div>
              )}
            </div>
            <p style={{ fontSize:11, color:MUTED, marginBottom:22, lineHeight:2, letterSpacing:1 }}>
              Run. Collect fossils. Upgrade. Survive.<br/>Outlast the digital extinction.
            </p>
          </div>

          {/* Buttons */}
          <div style={{ marginBottom:8 }}>
            {activeScenery === "abyss" && abyssUnlocked
              ? <button style={{ ...btn(true), width:"100%", background:"#b52d2d", color:"#ffffff", border:"2px solid #b52d2d" }} onClick={() => { playClick(); startBossFight(); }}>[ BATTLE ]</button>
              : <button style={{ ...btn(true), width:"100%" }} onClick={() => { playClick(); startGame(); }}>[ RUN ]</button>
            }
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
            <button style={{ ...btn(false), width:"100%", fontSize:"clamp(9px,2.5vw,12px)" }} onClick={() => { playClick(); setScreen("shop"); }}>[ UPGRADES ]</button>
            <button style={{ ...btn(false), width:"100%", fontSize:"clamp(9px,2.5vw,12px)" }} onClick={() => { playClick(); setScreen("skins"); }}>[ COLLECTION ]</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <button style={{ ...btn(false), width:"100%", fontSize:"clamp(9px,2.5vw,12px)" }} onClick={() => { playClick(); setScreen("achievements"); }}>[ ACHIEVEMENTS ]</button>
            <button style={{ ...btn(false), width:"100%", fontSize:"clamp(9px,2.5vw,12px)" }} onClick={() => { playClick(); setScreen("leaderboard"); }}>[ LEADERBOARDS ]</button>
          </div>

          {/* Stats */}
          {totalRuns > 0 && (
            <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid #ddd", fontSize:11, color:MUTED, textAlign:"center" }}>
              <div style={{ lineHeight:2 }}>BEST <b style={{ color:DARK }}>{bestDist}m</b> &nbsp;|&nbsp; RUNS <b style={{ color:DARK }}>{totalRuns}</b></div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, lineHeight:1 }}>
                <span style={{ fontSize:16, color:DARK }}>◈</span>
                <b style={{ color:DARK }}>{Math.floor(fossils)}</b>
                {passiveRate > 0 && <span style={{ color:MUTED, fontSize:10 }}>(+{passiveRate.toFixed(1)}/s)</span>}
              </div>
            </div>
          )}

          {/* Mobile/tablet: trapezoid handle + slide-down drawer */}
          <div className="settings-btn-mobile" style={{ position:"absolute", bottom:0, left:0, right:0, display:"flex", flexDirection:"column", alignItems:"center" }}>
            {/* Trapezoid handle */}
            <button
              onClick={() => { playClick(); setShowTrapMenu(v => !v); }}
              style={{
                background:DARK, border:"none", cursor:"pointer",
                padding:"6px 32px 4px",
                clipPath:"polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)",
                display:"flex", alignItems:"center", justifyContent:"center",
                width:120, position:"relative", zIndex:2,
              }}
            >
              <svg width="16" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={showTrapMenu ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} stroke={BG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {/* Slide-down drawer */}
            <div style={{
              overflow:"hidden",
              maxHeight: showTrapMenu ? 120 : 0,
              transition:"max-height 0.28s ease",
              width:"100%",
              background:DARK,
              display:"flex", flexDirection:"column",
            }}>
              <button
                onClick={() => { playClick(); setShowTrapMenu(false); setShowSettings(true); }}
                style={{ background:"transparent", color:BG, border:"none", borderBottom:`1px solid rgba(255,255,255,0.12)`, padding:"10px 0", fontSize:10, fontFamily:F, cursor:"pointer", letterSpacing:2, fontWeight:"bold", width:"100%" }}
              >SETTINGS</button>
              <button
                onClick={() => { playClick(); setShowTrapMenu(false); setScreen("feedback"); }}
                style={{ background:"transparent", color:BG, border:"none", padding:"10px 0", fontSize:10, fontFamily:F, cursor:"pointer", letterSpacing:2, fontWeight:"bold", width:"100%" }}
              >COMMUNITY WALL</button>
            </div>
          </div>

        </div>
      </div>

      {notification  && <div style={notifBox}>{notification}</div>}
      {achivNotif    && <div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );
}
