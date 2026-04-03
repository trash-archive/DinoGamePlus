import { useState } from "react";
import { SKINS, DINO_DESIGNS, DINO_PASSIVES, PASSIVE_ICONS, SCENERIES } from "./data/collectionData.jsx";
import { drawDino } from "./rendering/drawDino";

export default function SkinsScreen({
  fossils, bestDist,
  ownedSkins, ownedDesigns, ownedSceneries,
  equippedSkin, equippedDesign, activeScenery,
  buySkin, buyDesign, buyScenery,
  startGame, setScreen,
  notification, achivNotif,
}) {
  const [skinTab, setSkinTab] = useState("dino");
  const [passivePreviewId, setPassivePreviewId] = useState(null);

  const currentSkin   = SKINS.find(s => s.id === equippedSkin) || SKINS[0];
  const currentDesign = DINO_DESIGNS.find(d => d.id === equippedDesign) || DINO_DESIGNS[0];

  const F      = "'Courier New', monospace";
  const BG     = "#f0ede6";
  const DARK   = "#1a1a1a";
  const BORDER = "#2a2a2a";
  const MUTED  = "#888";

  const outer = { minHeight:"100vh", background:BG, fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden" };
  const btn = (primary=false, small=false) => ({ background:primary?DARK:BG, color:primary?BG:DARK, border:`2px solid ${BORDER}`, padding:small?"5px 12px":"10px 20px", fontSize:small?10:12, fontFamily:F, cursor:"pointer", letterSpacing:2, fontWeight:"bold", boxSizing:"border-box" });
  const notifBox     = { position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:DARK, color:BG, padding:"9px 22px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #555" };
  const achivNotifBox= { position:"fixed", top:24,    left:"50%", transform:"translateX(-50%)", background:"#1a1a2a", color:"#ffdd44", padding:"10px 24px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #ffdd44" };

  const renderDinoCanvas = (el, skin, design) => {
    if(!el) return;
    const c = el.getContext("2d");
    c.clearRect(0, 0, 60, 58);
    drawDino(c, 10, 6, 0, false, skin, design, false, false, false, false, 0, true, null);
  };

  return (
    <div style={outer}>
      <div style={{ width:"100%", maxWidth:660, padding:"20px 16px", boxSizing:"border-box", margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:4, color:MUTED }}>COLLECTION</div>
            <div style={{ fontSize:20, fontWeight:"bold", letterSpacing:2 }}>CUSTOMIZE</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:16 }}>◈</span>
            <b style={{ fontSize:15 }}>{Math.floor(fossils)}</b>
          </div>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:14 }}>
          {["dino","palette","scenery"].map(t => (
            <button key={t} style={btn(skinTab===t, true)} onClick={() => setSkinTab(t)}>{t.toUpperCase()}</button>
          ))}
        </div>

        {skinTab==="dino" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {DINO_DESIGNS.map(d => {
              const owned = ownedDesigns.includes(d.id);
              const active = equippedDesign === d.id;
              const passive = DINO_PASSIVES[d.id];
              const showingPassive = passivePreviewId === d.id;
              return (
                <div key={d.id} onClick={() => {
                  if(active && passive){ setPassivePreviewId(showingPassive ? null : d.id); return; }
                  buyDesign(d);
                }} style={{ background:active?"#ece8e0":"#faf8f4", border:`2px solid ${active?BORDER:"#ddd"}`, padding:"12px 10px", textAlign:"center", cursor:"pointer", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
                  {showingPassive && (
                    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.82)", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"10px", zIndex:2 }}>
                      <div style={{ fontSize:10, color:"#88dd88", fontWeight:"bold", marginBottom:6, letterSpacing:1, display:"flex", alignItems:"center" }}>{PASSIVE_ICONS[d.id]}{passive.label}</div>
                      <div style={{ fontSize:9, color:"#ddd", lineHeight:1.6, textAlign:"center" }}>{passive.desc}</div>
                      <div style={{ fontSize:8, color:"#888", marginTop:8 }}>tap to close</div>
                    </div>
                  )}
                  <canvas width={60} height={58} style={{ display:"block", margin:"0 auto 6px" }}
                    ref={el => renderDinoCanvas(el, currentSkin, d)}/>
                  <div style={{ fontSize:12, fontWeight:"bold", letterSpacing:1 }}>{d.label}</div>
                  <div style={{ fontSize:9, color:MUTED, margin:"3px 0 4px", lineHeight:1.5, flex:1 }}>{d.desc}</div>
                  {passive && (
                    <div style={{ fontSize:9, color:"#448844", margin:"3px 0 6px", lineHeight:1.4, textAlign:"left", background:"#e8f0e8", padding:"4px 6px", display:"flex", alignItems:"center", gap:4, minHeight:28 }}>
                      <span style={{ color:"#448844", flexShrink:0 }}>{PASSIVE_ICONS[d.id]}</span>
                      <b>{passive.label}</b>{active && <span style={{ color:MUTED, fontSize:8 }}> (tap)</span>}
                    </div>
                  )}
                  {!passive && <div style={{ minHeight:28 }}/>}
                  <div style={{ fontSize:11, fontWeight:"bold", color:active?"#aaa":owned?"#448844":DARK, marginTop:"auto", paddingTop:4 }}>
                    {active?"ACTIVE":owned?"[ SELECT ]":d.unlockDist?(bestDist>=d.unlockDist?"[ CLAIM FREE ]":`[ ${d.unlockDist}m ]`):`◈ ${d.cost}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {skinTab==="palette" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {SKINS.map(sk => {
              const owned = ownedSkins.includes(sk.id);
              const active = equippedSkin === sk.id;
              return (
                <div key={sk.id} onClick={() => buySkin(sk)} style={{ background:active?"#ece8e0":"#faf8f4", border:`2px solid ${active?BORDER:"#ddd"}`, padding:"14px 10px", textAlign:"center", cursor:"pointer" }}>
                  <canvas width={60} height={58} style={{ display:"block", margin:"0 auto 8px" }}
                    ref={el => renderDinoCanvas(el, sk, currentDesign)}/>
                  <div style={{ fontSize:12, fontWeight:"bold", letterSpacing:1 }}>{sk.label}</div>
                  <div style={{ fontSize:11, fontWeight:"bold", color:active?"#aaa":owned?"#448844":DARK, marginTop:8 }}>
                    {active?"ACTIVE":owned?"[ SELECT ]":sk.cost===0?"FREE":`◈ ${sk.cost}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {skinTab==="scenery" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {SCENERIES.map(s => {
              const owned = ownedSceneries.includes(s.id);
              const active = activeScenery === s.id;
              return (
                <div key={s.id} onClick={() => buyScenery(s)} style={{ background:active?"#ece8e0":"#faf8f4", border:`2px solid ${active?BORDER:"#ddd"}`, padding:"14px", cursor:"pointer", boxSizing:"border-box" }}>
                  <div style={{ width:"100%", height:36, background:s.dayBg, marginBottom:8, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:10, background:s.groundTop }}/>
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:6,  background:s.groundColor }}/>
                    <div style={{ position:"absolute", top:6, left:"30%", width:20, height:8, background:s.cloudColor }}/>
                  </div>
                  <div style={{ fontSize:12, fontWeight:"bold", letterSpacing:1 }}>{s.label}</div>
                  <div style={{ fontSize:10, color:MUTED, margin:"4px 0 8px", lineHeight:1.5 }}>{s.desc}</div>
                  <div style={{ fontSize:11, fontWeight:"bold", color:active?"#aaa":owned?"#448844":DARK }}>
                    {active?"ACTIVE":owned?"[ SELECT ]":s.cost===0?"FREE":`◈ ${s.cost}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display:"flex", gap:8, marginTop:14 }}>
          <button style={{ ...btn(true), flex:1 }} onClick={startGame}>[ RUN ]</button>
          <button style={{ ...btn(false), flex:1 }} onClick={() => setScreen("menu")}>[ MENU ]</button>
        </div>
      </div>
      {notification  && <div style={notifBox}>{notification}</div>}
      {achivNotif    && <div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );
}
