import { useState } from "react";
import { SKINS, DINO_DESIGNS, DINO_PASSIVES, PASSIVE_ICONS, SCENERIES, REGULAR_SCENERY_IDS } from "./data/collectionData.jsx";
import { drawDino } from "./rendering/drawDino";
import { playClick } from "./hooks/useSoundEffects";

export default function SkinsScreen({
  fossils, bestDist,
  ownedSkins, ownedDesigns, ownedSceneries,
  equippedSkin, equippedDesign, activeScenery,
  buySkin, buyDesign, buyScenery,
  startGame, setScreen,
  abyssUnlocked, startBossFight,
  notification, achivNotif,
}) {
  const [skinTab, setSkinTab] = useState("dino");
  const [passivePreviewId, setPassivePreviewId] = useState(null);

  const currentSkin   = SKINS.find(s => s.id === equippedSkin) || SKINS[0];
  const currentDesign = DINO_DESIGNS.find(d => d.id === equippedDesign) || DINO_DESIGNS[0];

  const isMobile = window.innerWidth < 600;
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
            <button key={t} style={btn(skinTab===t, true)} onClick={() => { playClick(); setSkinTab(t); }}>{t.toUpperCase()}</button>
          ))}
        </div>

        {skinTab==="dino" && (
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(3,1fr)", gap:10 }}>
            {DINO_DESIGNS.map(d => {
              const owned = ownedDesigns.includes(d.id);
              const active = equippedDesign === d.id;
              const passive = DINO_PASSIVES[d.id];
              const showingPassive = passivePreviewId === d.id;
              return (
                <div key={d.id} onClick={() => {
                  if(active && passive){ playClick(); setPassivePreviewId(showingPassive ? null : d.id); return; }
                  playClick(); buyDesign(d);
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
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(3,1fr)", gap:10 }}>
            {SKINS.map(sk => {
              const owned = ownedSkins.includes(sk.id);
              const active = equippedSkin === sk.id;
              return (
                <div key={sk.id} onClick={() => { playClick(); buySkin(sk); }} style={{ background:active?"#ece8e0":"#faf8f4", border:`2px solid ${active?BORDER:"#ddd"}`, padding:"14px 10px", textAlign:"center", cursor:"pointer" }}>
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
          <>
            {/* Regular maps — 2-column grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {SCENERIES.filter(s => !s.isFinalMap).map(s => {
                const owned  = ownedSceneries.includes(s.id);
                const active = activeScenery === s.id;
                return (
                  <div key={s.id} onClick={() => { playClick(); buyScenery(s); }} style={{ background:active?"#ece8e0":"#faf8f4", border:`2px solid ${active?BORDER:"#ddd"}`, padding:"14px", cursor:"pointer", boxSizing:"border-box" }}>
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

            {/* The Abyss — full-width special card */}
            {(() => {
              const s = SCENERIES.find(sc => sc.isFinalMap);
              if(!s) return null;
              const owned  = ownedSceneries.includes(s.id);
              const active = activeScenery === s.id;
              const allRegularOwned = REGULAR_SCENERY_IDS.every(id => ownedSceneries.includes(id));
              const isLocked = !allRegularOwned;

              if(isLocked) return (
                <div style={{ marginTop:10, background:"#06000f", border:"2px solid #1a0030", padding:"18px 16px", boxSizing:"border-box", position:"relative", overflow:"hidden" }}>
                  {/* Animated scanline effect via CSS */}
                  <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg, rgba(80,0,120,0.06) 0px, rgba(80,0,120,0.06) 1px, transparent 1px, transparent 4px)", pointerEvents:"none" }}/>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    {/* Mystery icon */}
                    <div style={{ width:52, height:52, background:"#0d0018", border:"2px solid #2a0044", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:22, color:"#330055" }}>▓</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:"bold", letterSpacing:3, color:"#330055" }}>? ? ? ? ? ? ? ? ?</div>
                      <div style={{ fontSize:9, color:"#220033", margin:"4px 0 6px", lineHeight:1.6 }}>Own all other maps to reveal what lurks beyond.</div>
                      <div style={{ fontSize:10, fontWeight:"bold", color:"#330055", letterSpacing:2 }}>[ LOCKED ]</div>
                    </div>
                  </div>
                </div>
              );

              return (
                <div
                  onClick={() => { playClick(); buyScenery(s); }}
                  style={{
                    marginTop:10,
                    background: active ? "#0d0020" : "#08000e",
                    border: `2px solid ${active ? "#cc44ff" : "#3a0066"}`,
                    padding:"0",
                    cursor:"pointer",
                    boxSizing:"border-box",
                    position:"relative",
                    overflow:"hidden",
                    boxShadow: active ? "0 0 18px rgba(180,0,255,0.25)" : "none",
                  }}
                >
                  {/* Scanlines */}
                  <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg, rgba(100,0,160,0.07) 0px, rgba(100,0,160,0.07) 1px, transparent 1px, transparent 4px)", pointerEvents:"none", zIndex:1 }}/>

                  {/* Wide preview banner */}
                  <div style={{ width:"100%", height:56, background:"#0d0018", position:"relative", overflow:"hidden" }}>
                    {/* Void gradient */}
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, #0d0018 0%, #1a0030 60%, #3d1a5c 100%)" }}/>
                    {/* Floating void orbs */}
                    <div style={{ position:"absolute", top:10, left:"15%", width:6, height:6, background:"#cc44ff", opacity:0.6, borderRadius:0 }}/>
                    <div style={{ position:"absolute", top:18, left:"40%", width:4, height:4, background:"#8800cc", opacity:0.5 }}/>
                    <div style={{ position:"absolute", top:8,  left:"65%", width:8, height:8, background:"#aa00ff", opacity:0.4 }}/>
                    <div style={{ position:"absolute", top:22, left:"80%", width:4, height:4, background:"#cc44ff", opacity:0.7 }}/>
                    <div style={{ position:"absolute", top:14, left:"55%", width:3, height:3, background:"#ff44ff", opacity:0.5 }}/>
                    {/* Ground */}
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:12, background:"#3d1a5c" }}/>
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:7,  background:"#1a0a2e" }}/>
                    {/* Crack lines */}
                    <div style={{ position:"absolute", bottom:7, left:"20%", width:2, height:14, background:"#6600aa", opacity:0.6 }}/>
                    <div style={{ position:"absolute", bottom:7, left:"50%", width:2, height:20, background:"#8800cc", opacity:0.5 }}/>
                    <div style={{ position:"absolute", bottom:7, left:"75%", width:2, height:12, background:"#6600aa", opacity:0.6 }}/>
                    {/* "THE ABYSS" label in preview */}
                    <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:9, letterSpacing:5, color:"rgba(180,80,255,0.35)", fontFamily:F, fontWeight:"bold", whiteSpace:"nowrap", zIndex:2 }}>
                      THE ABYSS
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding:"12px 16px", position:"relative", zIndex:2 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:"bold", letterSpacing:3, color:"#cc44ff" }}>THE ABYSS</div>
                        <div style={{ fontSize:9, color:"#7733aa", margin:"4px 0 0", lineHeight:1.6 }}>{s.desc}</div>
                      </div>
                      <div style={{ fontSize:10, fontWeight:"bold", letterSpacing:2, color: active?"#cc44ff": owned?"#8833cc":"#cc44ff", textAlign:"right", paddingLeft:12, paddingTop:2 }}>
                        {active ? "ACTIVE" : owned ? "[ SELECT ]" : "FREE"}
                      </div>
                    </div>

                    {/* Warning strip */}
                    {owned && (
                      <div style={{ marginTop:10, background:"#0d0018", border:"1px solid #3a0066", padding:"6px 10px", display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ color:"#cc44ff", fontSize:12 }}>⚠</span>
                        <span style={{ fontSize:9, color:"#7733aa", letterSpacing:1 }}>BOSS ENCOUNTER — No regular run. Enter to fight.</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </>
        )}

        <div style={{ display:"flex", gap:8, marginTop:14 }}>
          {activeScenery === "abyss" && abyssUnlocked
            ? <button style={{ ...btn(true), flex:1, background:"#b52d2d", color:"#ffffff", border:"2px solid #b52d2d" }} onClick={() => { playClick(); startBossFight(); }}>[ BATTLE ]</button>
            : <button style={{ ...btn(true), flex:1 }} onClick={() => { playClick(); startGame(); }}>[ RUN ]</button>
          }
          <button style={{ ...btn(false), flex:1 }} onClick={() => { playClick(); setScreen("menu"); }}>[ MENU ]</button>
        </div>
      </div>
      {notification  && <div style={notifBox}>{notification}</div>}
      {achivNotif    && <div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );
}
