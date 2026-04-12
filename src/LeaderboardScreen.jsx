import { useState, useEffect } from "react";
import { fetchLeaderboard, fetchMapLeaderboard, isNameTaken } from "./leaderboard";
import { getSavedName, savePlayerName, getPlayerId } from "./supabase";
import { playClick } from "./hooks/useSoundEffects";
import { RUNNABLE_SCENERIES, MAP_ICONS } from "./data/collectionData.jsx";

const F      = "'Courier New', monospace";
const BG     = "#f0ede6";
const DARK   = "#1a1a1a";
const BORDER = "#2a2a2a";
const MUTED  = "#888";
const tierColors = { bronze:"#cd7f32", silver:"#aaa", gold:"#d4a820" };

// Rich pixel globe — matches MenuScreen
const GlobeIcon = ({ size = 16, color = "currentColor", starColor = "#ffe066" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ display:"block", shapeRendering:"crispEdges" }}>
    <rect x="5" y="0" width="6" height="1" fill={color}/>
    <rect x="3" y="1" width="2" height="1" fill={color}/>
    <rect x="11" y="1" width="2" height="1" fill={color}/>
    <rect x="2" y="2" width="1" height="1" fill={color}/>
    <rect x="13" y="2" width="1" height="1" fill={color}/>
    <rect x="1" y="3" width="1" height="2" fill={color}/>
    <rect x="14" y="3" width="1" height="2" fill={color}/>
    <rect x="0" y="5" width="1" height="6" fill={color}/>
    <rect x="15" y="5" width="1" height="6" fill={color}/>
    <rect x="1" y="11" width="1" height="2" fill={color}/>
    <rect x="14" y="11" width="1" height="2" fill={color}/>
    <rect x="2" y="13" width="1" height="1" fill={color}/>
    <rect x="13" y="13" width="1" height="1" fill={color}/>
    <rect x="3" y="14" width="2" height="1" fill={color}/>
    <rect x="11" y="14" width="2" height="1" fill={color}/>
    <rect x="5" y="15" width="6" height="1" fill={color}/>
    <rect x="1" y="7" width="14" height="2" fill={color} opacity="0.45"/>
    <rect x="7" y="1" width="2" height="14" fill={color} opacity="0.45"/>
    <rect x="4" y="2" width="1" height="12" fill={color} opacity="0.28"/>
    <rect x="3" y="4" width="1" height="8" fill={color} opacity="0.18"/>
    <rect x="11" y="2" width="1" height="12" fill={color} opacity="0.28"/>
    <rect x="12" y="4" width="1" height="8" fill={color} opacity="0.18"/>
    <rect x="11" y="3" width="1" height="1" fill={starColor} opacity="0.9"/>
    <rect x="10" y="3" width="1" height="1" fill={starColor} opacity="0.5"/>
    <rect x="11" y="2" width="1" height="1" fill={starColor} opacity="0.5"/>
    <rect x="3" y="2" width="1" height="4" fill="rgba(255,255,255,0.35)"/>
    <rect x="4" y="2" width="1" height="2" fill="rgba(255,255,255,0.2)"/>
  </svg>
);

export default function LeaderboardScreen({ lbData, setLbData, lbLoading, setLbLoading, onBack, showNotif }) {
  const [lbRenaming,  setLbRenaming]  = useState(false);
  const [lbNewName,   setLbNewName]   = useState("");
  const [lbNameError, setLbNameError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isOnline,    setIsOnline]    = useState(() => navigator.onLine);
  const [activeTab,   setActiveTab]   = useState("global");
  const [pickerOpen,  setPickerOpen]  = useState(false);
  const [mapCache,    setMapCache]    = useState({});

  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  const loadMapTab = (map_id, force = false) => {
    if (!force && mapCache[map_id] && !mapCache[map_id].loading) return;
    setMapCache(prev => ({ ...prev, [map_id]: { data: prev[map_id]?.data || [], loading: true } }));
    fetchMapLeaderboard(map_id).then(data =>
      setMapCache(prev => ({ ...prev, [map_id]: { data, loading: false } }))
    );
  };

  const switchTab = (tab) => {
    playClick();
    setActiveTab(tab);
    setPickerOpen(false);
    if (tab !== "global") loadMapTab(tab);
  };

  const myId          = getPlayerId();
  const activeScenery = RUNNABLE_SCENERIES.find(s => s.id === activeTab);
  const activeLabel   = activeTab === "global" ? "GLOBAL" : (activeScenery?.label || activeTab).toUpperCase();
  const activeIcon    = activeTab === "global"
    ? <GlobeIcon size={16} color={BG} />
    : <span style={{ color: activeScenery?.accentColor }}>{MAP_ICONS[activeTab]}</span>;

  const displayData    = activeTab === "global" ? lbData : (mapCache[activeTab]?.data || []);
  const displayLoading = activeTab === "global" ? lbLoading : (mapCache[activeTab]?.loading ?? true);

  const top3 = displayData.slice(0, 3);
  const rest = displayData.slice(3);
  const podiumSlots = [
    { pos:1, h:88,  color:tierColors.silver, label:"2ND" },
    { pos:0, h:120, color:tierColors.gold,   label:"1ST" },
    { pos:2, h:64,  color:tierColors.bronze, label:"3RD" },
  ];

  const outer = { minHeight:"100vh", background:BG, fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden" };
  const wrap  = { width:"100%", maxWidth:showDetails?580:520, padding:"20px 16px", boxSizing:"border-box", margin:"0 auto" };
  const btn   = (primary=false, small=false) => ({ background:primary?DARK:BG, color:primary?BG:DARK, border:`2px solid ${BORDER}`, padding:small?"5px 12px":"10px 20px", fontSize:small?10:12, fontFamily:F, cursor:"pointer", letterSpacing:2, fontWeight:"bold", boxSizing:"border-box" });

  const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(undefined, { month:"short", day:"numeric", year:"numeric" }),
      time: d.toLocaleTimeString(undefined, { hour:"2-digit", minute:"2-digit" }),
    };
  };

  const saveName = (name) => {
    const t = name.trim();
    if (!t) return;
    if (t.toUpperCase() === getSavedName().toUpperCase()) { setLbRenaming(false); setLbNameError(""); return; }
    if (!navigator.onLine) { setLbNameError("Name changes require an internet connection."); return; }
    isNameTaken(t).then(taken => {
      if (taken) setLbNameError("Name already taken!");
      else { savePlayerName(t); showNotif("Name updated!"); setLbRenaming(false); setLbNameError(""); }
    });
  };

  const handleRefresh = async () => {
    playClick();
    if (!isOnline) return;
    if (activeTab === "global") {
      setLbLoading(true);
      setLbData(await fetchLeaderboard());
      setLbLoading(false);
    } else {
      loadMapTab(activeTab, true);
    }
  };

  return (
    <div style={outer}>
      <div style={wrap}>

        {/* ── Header ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          <div>
            <div style={{ fontSize:9, letterSpacing:4, color:MUTED, marginBottom:2 }}>RANKINGS</div>
            <div style={{ fontSize:20, fontWeight:"bold", letterSpacing:2 }}>LEADERBOARD</div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button style={{ ...btn(false,true), fontSize:9 }} onClick={() => { playClick(); setShowDetails(v => !v); }}>
              {showDetails ? "[ LESS ]" : "[ DETAILS ]"}
            </button>
            <button style={{ ...btn(false,true), fontSize:9 }} onClick={handleRefresh}
              disabled={!isOnline} title={!isOnline ? "No internet connection" : ""}>[ REFRESH ]</button>
          </div>
        </div>

        {/* ── Board selector ── */}
        <div style={{ marginBottom:14, position:"relative" }}>

          {/* Pill — icon + centered label + chevron */}
          <div
            onClick={() => { playClick(); setPickerOpen(v => !v); }}
            style={{ display:"grid", gridTemplateColumns:"28px 1fr 20px", alignItems:"center", padding:"10px 14px", background:DARK, color:BG, border:`2px solid ${BORDER}`, cursor:"pointer", gap:8 }}
          >
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              {activeIcon}
            </div>
            <div style={{ textAlign:"center", fontWeight:"bold", fontSize:11, letterSpacing:3 }}>
              {activeLabel}
            </div>
            <div style={{ textAlign:"right", fontSize:10, opacity:0.5 }}>
              {pickerOpen ? "▲" : "▼"}
            </div>
          </div>

          {/* Dropdown — absolutely positioned, scrollable on small screens */}
          {pickerOpen && (
            <div style={{
              position:"absolute", top:"100%", left:0, right:0, zIndex:200,
              border:`2px solid ${BORDER}`, borderTop:"none", background:"#faf8f4",
              maxHeight:"min(420px, 60vh)", overflowY:"auto",
              WebkitOverflowScrolling:"touch",
            }}>
              <div style={{ padding:"10px 12px 6px", fontSize:9, letterSpacing:3, color:MUTED, borderBottom:`1px solid #e0ddd8` }}>
                SELECT A BOARD
              </div>

              {/* Global row */}
              <div
                onClick={() => switchTab("global")}
                style={{ display:"grid", gridTemplateColumns:"28px 1fr auto", alignItems:"center", gap:8, padding:"10px 12px", background:activeTab==="global"?DARK:BG, color:activeTab==="global"?BG:DARK, borderBottom:`1px solid #e0ddd8`, cursor:"pointer" }}
              >
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <GlobeIcon size={16} color={activeTab==="global" ? BG : DARK} />
                </div>
                <span style={{ fontWeight:"bold", fontSize:11, letterSpacing:2 }}>GLOBAL</span>
                {activeTab === "global" && <span style={{ fontSize:9, opacity:0.5, letterSpacing:1 }}>ACTIVE</span>}
              </div>

              {/* Map grid — 2 columns */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:BORDER, margin:"1px 0" }}>
                {RUNNABLE_SCENERIES.map(s => {
                  const isActive = activeTab === s.id;
                  const cached   = mapCache[s.id];
                  const icon     = MAP_ICONS[s.id];
                  return (
                    <div
                      key={s.id}
                      onClick={() => switchTab(s.id)}
                      style={{ padding:"10px 12px", background:isActive?DARK:BG, color:isActive?BG:DARK, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}
                    >
                      <span style={{ color:isActive?s.accentColor+"cc":s.accentColor, flexShrink:0 }}>{icon}</span>
                      <span style={{ fontWeight:"bold", fontSize:10, letterSpacing:1, lineHeight:1.2 }}>{s.label.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Offline banner ── */}
        {!isOnline && (
          <div style={{ marginBottom:14, padding:"10px 12px", background:"#fff3cd", border:"1px solid #e6c84a", fontSize:10, letterSpacing:1, color:"#7a5c00", lineHeight:1.6 }}>
            ⚠ YOU'RE OFFLINE — Leaderboard scores can't be loaded right now. Name changes are disabled until you reconnect.
          </div>
        )}

        {/* ── Rename ── */}
        <div style={{ marginBottom:14, padding:"10px 12px", background:"#f5f2ec", border:"1px solid #ddd" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, color:MUTED, letterSpacing:1 }}>YOUR NAME:</span>
            {lbRenaming ? (
              <>
                <input autoFocus value={lbNewName}
                  onChange={e => { setLbNewName(e.target.value.toUpperCase().slice(0,20)); setLbNameError(""); }}
                  onKeyDown={e => {
                    if (e.key === "Enter") saveName(lbNewName);
                    if (e.key === "Escape") { setLbRenaming(false); setLbNameError(""); }
                  }}
                  style={{ fontFamily:F, fontSize:11, fontWeight:"bold", padding:"4px 8px", border:`2px solid ${lbNameError?"#cc2200":BORDER}`, background:BG, color:DARK, letterSpacing:2, width:130, textTransform:"uppercase" }}
                  maxLength={20} placeholder="ENTER NAME"
                />
                <button style={btn(true,true)} onClick={() => { playClick(); saveName(lbNewName); }}>[ SAVE ]</button>
                <button style={btn(false,true)} onClick={() => { playClick(); setLbRenaming(false); setLbNameError(""); }}>[ CANCEL ]</button>
              </>
            ) : (
              <>
                <span style={{ fontSize:11, fontWeight:"bold", letterSpacing:2, color:DARK }}>{getSavedName()}</span>
                <button style={btn(false,true)} onClick={() => { playClick(); setLbNewName(getSavedName()); setLbRenaming(true); setLbNameError(""); }}>[ RENAME ]</button>
              </>
            )}
          </div>
          {lbNameError && <div style={{ fontSize:10, color:"#cc2200", marginTop:6, letterSpacing:1 }}>{lbNameError}</div>}
        </div>

        {/* ── Board content ── */}
        {!isOnline ? (
          <div style={{ textAlign:"center", padding:40, fontSize:11, color:MUTED, letterSpacing:2, border:"1px solid #ddd", marginBottom:16, lineHeight:1.8 }}>
            You're offline.<br/>Connect to the internet to view the leaderboard.
          </div>
        ) : displayLoading ? (
          <div style={{ textAlign:"center", padding:40, fontSize:11, color:MUTED, letterSpacing:3 }}>LOADING...</div>
        ) : displayData.length === 0 ? (
          <div style={{ textAlign:"center", padding:40, fontSize:11, color:MUTED, letterSpacing:2, border:"1px solid #ddd", marginBottom:16 }}>
            No scores yet for {activeLabel}.<br/>Be the first!
          </div>
        ) : (
          <>
            {/* Podium */}
            <div style={{ background:"#faf8f4", border:`2px solid ${BORDER}`, padding:"20px 16px 0", marginBottom:0 }}>
              <div style={{ fontSize:9, letterSpacing:3, color:MUTED, textAlign:"center", marginBottom:12 }}>{activeLabel} — TOP 3</div>
              <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:8 }}>
                {podiumSlots.map(({ pos, h, color, label }) => {
                  const entry = top3[pos];
                  if (!entry) return <div key={pos} style={{ flex:1, minWidth:0 }} />;
                  const isMe = entry.player_id === myId;
                  const dt   = fmtDate(entry.updated_at);
                  return (
                    <div key={pos} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:"bold", color, letterSpacing:1, textAlign:"center", width:"100%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2, paddingInline:2, boxSizing:"border-box" }}>
                        {entry.name}{isMe && " ◀"}
                      </div>
                      <div style={{ fontSize:showDetails?11:10, fontWeight:"bold", color:DARK, marginBottom:1 }}>{entry.best_dist.toLocaleString()}m</div>
                      {showDetails && <div style={{ fontSize:9, color:MUTED, marginBottom:1 }}>◈ {Math.floor(entry.best_fossils).toLocaleString()}</div>}
                      {showDetails && <div style={{ fontSize:8, color:MUTED, marginBottom:6 }}>{dt.date}</div>}
                      <div style={{ width:"100%", height:h, background:color, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", paddingTop:10, boxSizing:"border-box", outline:isMe?"3px solid #448844":"none" }}>
                        <div style={{ fontSize:18, fontWeight:"bold", color:"#fff", letterSpacing:2 }}>{label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ranks 4–50 */}
            {rest.length > 0 && (
              <div style={{ border:"1px solid #ddd", borderTop:"none", marginBottom:14 }}>
                {rest.map((r, i) => {
                  const isMe = r.player_id === myId;
                  const rank = displayData.filter(e =>
                    e.best_dist > r.best_dist ||
                    (e.best_dist === r.best_dist && e.best_fossils > r.best_fossils) ||
                    (e.best_dist === r.best_dist && e.best_fossils === r.best_fossils && e.updated_at < r.updated_at)
                  ).length + 1;
                  const dt = fmtDate(r.updated_at);
                  return (
                    <div key={r.id} style={{ display:"grid", gridTemplateColumns:showDetails?"32px 1fr 64px 68px 86px":"36px 1fr 72px", padding:"7px 12px", fontSize:11, fontWeight:"bold", background:isMe?"#e8f0e8":i%2===0?"#faf8f4":"#f5f2ec", borderBottom:"1px solid #e8e5e0", borderLeft:isMe?"3px solid #448844":"3px solid transparent", alignItems:"center" }}>
                      <span style={{ color:MUTED, fontSize:10 }}>{rank}</span>
                      <span style={{ letterSpacing:1, color:isMe?"#448844":DARK, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.name}{isMe && " ◀"}</span>
                      <span style={{ textAlign:"right", color:DARK }}>{r.best_dist.toLocaleString()}m</span>
                      {showDetails && <span style={{ textAlign:"right", color:MUTED, fontSize:10 }}>◈ {Math.floor(r.best_fossils).toLocaleString()}</span>}
                      {showDetails && (
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:9, color:MUTED }}>{dt.date}</div>
                          <div style={{ fontSize:8, color:MUTED, opacity:0.7 }}>{dt.time}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <button style={{ ...btn(false), width:"100%", marginTop:4 }} onClick={() => { playClick(); onBack(); }}>[ BACK ]</button>
      </div>
    </div>
  );
}
