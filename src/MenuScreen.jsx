export default function MenuScreen({
  menuCanvasRef, menuDinoClicks, setMenuDinoClicks, showCredit, setShowCredit,
  startGame, setScreen, totalRuns, bestDist, fossils, passiveRate,
  notification, achivNotif,
  F, BG, DARK, BORDER, MUTED,
}) {
  const outer = { minHeight:"100vh", background:BG, fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden" };
  const card  = { background:"#faf8f4", border:`2px solid ${BORDER}`, padding:"28px", boxSizing:"border-box", width:"100%" };
  const btn   = (primary=false) => ({ background:primary?DARK:BG, color:primary?BG:DARK, border:`2px solid ${BORDER}`, padding:primary?"13px 0":"10px 20px", fontSize:primary?14:12, fontFamily:F, cursor:"pointer", letterSpacing:primary?4:2, fontWeight:"bold", boxSizing:"border-box", transition:"opacity 0.1s" });
  const notifBox     = { position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:DARK, color:BG, padding:"9px 22px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #555" };
  const achivNotifBox= { position:"fixed", top:24,    left:"50%", transform:"translateX(-50%)", background:"#1a1a2a", color:"#ffdd44", padding:"10px 24px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #ffdd44" };

  return (
    <div style={outer}>
      <div style={{ width:"100%", maxWidth:480, padding:"0 16px", boxSizing:"border-box" }}>
        <div style={card}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:36, fontWeight:"bold", letterSpacing:4, marginBottom:2 }}>DINO</div>
            <div style={{ fontSize:14, letterSpacing:6, marginBottom:16, color:MUTED }}>REIMAGINED</div>
            <div style={{ position:"relative", display:"inline-block", margin:"0 auto 16px" }}>
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
              Run. Collect bones. Upgrade. Evolve.<br/>Outlast the digital extinction.
            </p>
          </div>

          <div style={{ marginBottom:8 }}>
            <button style={{ ...btn(true), width:"100%" }} onClick={startGame}>[ RUN ]</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
            <button style={{ ...btn(false), width:"100%" }} onClick={() => setScreen("shop")}>[ UPGRADES ]</button>
            <button style={{ ...btn(false), width:"100%" }} onClick={() => setScreen("skins")}>[ COLLECTION ]</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <button style={{ ...btn(false), width:"100%", padding:"10px 2px", letterSpacing:0 }} onClick={() => setScreen("achievements")}>[ ACHIEVEMENTS ]</button>
            <button style={{ ...btn(false), width:"100%", padding:"10px 2px", letterSpacing:0 }} onClick={() => setScreen("leaderboard")}>[ LEADERBOARDS ]</button>
          </div>

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
        </div>
      </div>
      {notification  && <div style={notifBox}>{notification}</div>}
      {achivNotif    && <div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );
}
