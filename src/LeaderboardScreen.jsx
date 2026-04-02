import { useState } from "react";
import { fetchLeaderboard, isNameTaken } from "./leaderboard";
import { getSavedName, savePlayerName, getPlayerId } from "./supabase";

const F      = "'Courier New', monospace";
const BG     = "#f0ede6";
const DARK   = "#1a1a1a";
const BORDER = "#2a2a2a";
const MUTED  = "#888";
const tierColors = { bronze:"#cd7f32", silver:"#aaa", gold:"#d4a820", legend:"#9944cc" };

export default function LeaderboardScreen({ lbData, setLbData, lbLoading, setLbLoading, onBack, showNotif }) {
  const [lbRenaming,  setLbRenaming]  = useState(false);
  const [lbNewName,   setLbNewName]   = useState("");
  const [lbNameError, setLbNameError] = useState("");

  const myId = getPlayerId();
  const top3 = lbData.slice(0, 3);
  const rest = lbData.slice(3);
  const podiumSlots = [
    { pos:1, h:88,  color:tierColors.silver, label:"2ND" },
    { pos:0, h:120, color:tierColors.gold,   label:"1ST" },
    { pos:2, h:64,  color:tierColors.bronze, label:"3RD" },
  ];

  const outer = { minHeight:"100vh", background:BG, fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden" };
  const wrap  = { width:"100%", maxWidth:520, padding:"20px 16px", boxSizing:"border-box", margin:"0 auto" };
  const btn   = (primary=false, small=false) => ({ background:primary?DARK:BG, color:primary?BG:DARK, border:`2px solid ${BORDER}`, padding:small?"5px 12px":"10px 20px", fontSize:small?10:12, fontFamily:F, cursor:"pointer", letterSpacing:2, fontWeight:"bold", boxSizing:"border-box" });

  const saveName = (name) => {
    const t = name.trim();
    if (!t) return;
    isNameTaken(t).then(taken => {
      if (taken) { setLbNameError("Name already taken!"); }
      else { savePlayerName(t); showNotif("Name updated!"); setLbRenaming(false); setLbNameError(""); }
    });
  };

  return (
    <div style={outer}>
      <div style={wrap}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:4, color:MUTED }}>GLOBAL</div>
            <div style={{ fontSize:20, fontWeight:"bold", letterSpacing:2 }}>LEADERBOARD</div>
          </div>
          <button style={{ ...btn(false,true), fontSize:9 }} onClick={async () => {
            setLbLoading(true);
            const data = await fetchLeaderboard();
            setLbData(data);
            setLbLoading(false);
          }}>[ REFRESH ]</button>
        </div>

        {/* Rename */}
        <div style={{ marginBottom:14, padding:"10px 12px", background:"#f5f2ec", border:"1px solid #ddd" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"nowrap", overflow:"hidden" }}>
            <span style={{ fontSize:10, color:MUTED, letterSpacing:1 }}>YOUR NAME:</span>
            {lbRenaming ? (
              <>
                <input autoFocus value={lbNewName}
                  onChange={e => { setLbNewName(e.target.value.toUpperCase().slice(0,20)); setLbNameError(""); }}
                  onKeyDown={e => {
                    if (e.key === "Enter") saveName(lbNewName);
                    if (e.key === "Escape") { setLbRenaming(false); setLbNameError(""); }
                  }}
                  style={{ fontFamily:F, fontSize:11, fontWeight:"bold", padding:"4px 8px", border:`2px solid ${lbNameError?"#cc2200":BORDER}`, background:BG, letterSpacing:2, width:130, textTransform:"uppercase" }}
                  maxLength={20} placeholder="ENTER NAME"
                />
                <button style={btn(true,true)} onClick={() => saveName(lbNewName)}>[ SAVE ]</button>
                <button style={btn(false,true)} onClick={() => { setLbRenaming(false); setLbNameError(""); }}>[ CANCEL ]</button>
              </>
            ) : (
              <>
                <span style={{ fontSize:11, fontWeight:"bold", letterSpacing:2, color:DARK }}>{getSavedName()}</span>
                <button style={btn(false,true)} onClick={() => { setLbNewName(getSavedName()); setLbRenaming(true); setLbNameError(""); }}>[ RENAME ]</button>
              </>
            )}
          </div>
          {lbNameError && <div style={{ fontSize:10, color:"#cc2200", marginTop:6, letterSpacing:1 }}>{lbNameError}</div>}
        </div>

        {lbLoading ? (
          <div style={{ textAlign:"center", padding:40, fontSize:11, color:MUTED, letterSpacing:3 }}>LOADING...</div>
        ) : lbData.length === 0 ? (
          <div style={{ textAlign:"center", padding:40, fontSize:11, color:MUTED, letterSpacing:2, border:"1px solid #ddd", marginBottom:16 }}>No scores yet. Be the first!</div>
        ) : (
          <>
            {/* Podium (top 3) */}
            <div style={{ background:"#faf8f4", border:`2px solid ${BORDER}`, padding:"20px 16px 0", marginBottom:0 }}>
              <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:8 }}>
                {podiumSlots.map(({ pos, h, color, label }) => {
                  const entry = top3[pos];
                  if (!entry) return <div key={pos} style={{ width:120 }} />;
                  const isMe = entry.player_id === myId;
                  return (
                    <div key={pos} style={{ display:"flex", flexDirection:"column", alignItems:"center", width:120 }}>
                      <div style={{ fontSize:11, fontWeight:"bold", color, letterSpacing:1, textAlign:"center", maxWidth:110, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2 }}>
                        {entry.name}{isMe && " ◀"}
                      </div>
                      <div style={{ fontSize:10, color:MUTED, marginBottom:6 }}>{entry.best_dist.toLocaleString()}m</div>
                      <div style={{ width:"100%", height:h, background:color, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", paddingTop:10, boxSizing:"border-box", outline:isMe ? "3px solid #448844" : "none" }}>
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
                  return (
                    <div key={r.id} style={{ display:"grid", gridTemplateColumns:"36px 1fr 72px", padding:"7px 12px", fontSize:11, fontWeight:"bold", background:isMe?"#e8f0e8":i%2===0?"#faf8f4":"#f5f2ec", borderBottom:"1px solid #e8e5e0", borderLeft:isMe?"3px solid #448844":"3px solid transparent" }}>
                      <span style={{ color:MUTED, fontSize:10 }}>{i+4}</span>
                      <span style={{ letterSpacing:1, color:isMe?"#448844":DARK, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.name}{isMe && " ◀"}</span>
                      <span style={{ textAlign:"right", color:MUTED }}>{r.best_dist.toLocaleString()}m</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <button style={{ ...btn(false), width:"100%" }} onClick={onBack}>[ BACK ]</button>
      </div>
    </div>
  );
}
