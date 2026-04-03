export default function MenuScreen({
  menuCanvasRef, menuDinoClicks, setMenuDinoClicks, showCredit, setShowCredit,
  startGame, setScreen, totalRuns, bestDist, fossils, passiveRate,
  notification, achivNotif,
  ownedSkins, ownedDesigns, ownedSceneries,
  F, BG, DARK, BORDER, MUTED,
}) {
  const outer = { minHeight:"100vh", background:BG, fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden" };
  const card  = { background:"#faf8f4", border:`2px solid ${BORDER}`, padding:"28px", boxSizing:"border-box", width:"100%" };
  const btn   = (primary=false) => ({ background:primary?DARK:BG, color:primary?BG:DARK, border:`2px solid ${BORDER}`, padding:primary?"13px 0":"10px 2px", fontSize:primary?14:12, fontFamily:F, cursor:"pointer", letterSpacing:primary?4:0, fontWeight:"bold", boxSizing:"border-box", transition:"opacity 0.1s" });
  const notifBox     = { position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:DARK, color:BG, padding:"9px 22px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #555" };
  const achivNotifBox= { position:"fixed", top:24,    left:"50%", transform:"translateX(-50%)", background:"#1a1a2a", color:"#ffdd44", padding:"10px 24px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #ffdd44" };

  const hasAllCollection =
    (ownedSkins?.length    >= 12) &&
    (ownedDesigns?.length  >= 12) &&
    (ownedSceneries?.length >= 8);

  return (
    <div style={outer}>
      <div style={{ width:"100%", maxWidth:480, padding:"0 16px", boxSizing:"border-box" }}>
        <div style={card}>
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

          <div style={{ marginBottom:8 }}>
            <button style={{ ...btn(true), width:"100%" }} onClick={startGame}>[ RUN ]</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
            <button style={{ ...btn(false), width:"100%", fontSize:"clamp(9px,2.5vw,12px)" }} onClick={() => setScreen("shop")}>[ UPGRADES ]</button>
            <button style={{ ...btn(false), width:"100%", fontSize:"clamp(9px,2.5vw,12px)" }} onClick={() => setScreen("skins")}>[ COLLECTION ]</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <button style={{ ...btn(false), width:"100%", fontSize:"clamp(9px,2.5vw,12px)" }} onClick={() => setScreen("achievements")}>[ ACHIEVEMENTS ]</button>
            <button style={{ ...btn(false), width:"100%", fontSize:"clamp(9px,2.5vw,12px)" }} onClick={() => setScreen("leaderboard")}>[ LEADERBOARDS ]</button>
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
