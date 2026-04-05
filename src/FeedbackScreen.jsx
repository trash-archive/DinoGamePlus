import { useState, useEffect } from "react";
import { playClick } from "./hooks/useSoundEffects";

const F      = "'Courier New', monospace";
const BG     = "#f0ede6";
const DARK   = "#1a1a1a";
const BORDER = "#2a2a2a";
const MUTED  = "#888";

const TYPES = ["FEEDBACK", "SUGGESTION", "BUG REPORT", "OTHER"];
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;
const TYPE_COLOR = { "FEEDBACK": "#448844", "SUGGESTION": "#2266cc", "BUG REPORT": "#cc2200", "OTHER": "#888" };

// votes stored as { [feedbackId]: "up" | "down" }
const VOTES_KEY = "dino_votes_v2";
function getVotes() { try { return JSON.parse(localStorage.getItem(VOTES_KEY) || "{}"); } catch { return {}; } }
function saveVotes(v) { localStorage.setItem(VOTES_KEY, JSON.stringify(v)); }

function sortFeedbacks(list) {
  return [...list].sort((a, b) => {
    const na = (Number(a.Upvotes) || 0) - (Number(a.Downvotes) || 0);
    const nb = (Number(b.Upvotes) || 0) - (Number(b.Downvotes) || 0);
    if (nb !== na) return nb - na;
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });
}

export default function FeedbackScreen({ onBack }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [fbLoading, setFbLoading] = useState(true);
  const [votes,     setVotes]     = useState(() => getVotes());
  const [showForm,  setShowForm]  = useState(false);
  const [page,      setPage]      = useState(1);
  const PAGE_SIZE = 10;

  // form state
  const [type,    setType]    = useState("FEEDBACK");
  const [message, setMessage] = useState("");
  const [name,    setName]    = useState("");
  const [status,  setStatus]  = useState(null);

  const fetchFeedbacks = async () => {
    setFbLoading(true);
    try {
      const res  = await fetch(APPS_SCRIPT_URL);
      const json = await res.json();
      if (json.ok) {
        setFeedbacks(sortFeedbacks(
          (json.data || []).filter(f => f.FeedbackId && String(f.Message || "").trim())
        ));
        setPage(1);
      }
    } catch { /* silent */ }
    setFbLoading(false);
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const btn = (primary = false, small = false) => ({
    background: primary ? DARK : BG, color: primary ? BG : DARK,
    border: `2px solid ${BORDER}`, padding: small ? "5px 12px" : "10px 20px",
    fontSize: small ? 10 : 12, fontFamily: F, cursor: "pointer",
    letterSpacing: 2, fontWeight: "bold", boxSizing: "border-box",
  });

  const submit = async () => {
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res  = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ type, message: message.trim(), name: name.trim() || "Anonymous" }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error();
      setMessage(""); setName(""); setType("FEEDBACK"); setStatus(null);
      setShowForm(false);
      await fetchFeedbacks();
    } catch { setStatus("err"); }
  };

  // direction: "up" | "down"
  const vote = async (fb, direction) => {
    const id = fb.FeedbackId;
    if (!id) return;

    const current = votes[id]; // "up" | "down" | undefined
    const isUndo  = current === direction;
    const newVotes = { ...votes };

    // optimistic update
    setFeedbacks(prev => sortFeedbacks(prev.map(f => {
      if (f.FeedbackId !== id) return f;
      let up   = Number(f.Upvotes)   || 0;
      let down = Number(f.Downvotes) || 0;

      if (isUndo) {
        // remove existing vote
        if (current === "up")   up   = Math.max(0, up   - 1);
        if (current === "down") down = Math.max(0, down - 1);
      } else {
        // remove old vote if switching
        if (current === "up")   up   = Math.max(0, up   - 1);
        if (current === "down") down = Math.max(0, down - 1);
        // apply new vote
        if (direction === "up")   up   += 1;
        if (direction === "down") down += 1;
      }
      return { ...f, Upvotes: up, Downvotes: down };
    })));

    if (isUndo) delete newVotes[id];
    else        newVotes[id] = direction;
    saveVotes(newVotes);
    setVotes(newVotes);

    // sync to sheet
    try {
      const action = isUndo
        ? (current === "up" ? "unupvote" : "undownvote")
        : direction === "up" ? "upvote" : "downvote";
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action, feedbackId: id }),
      });
    } catch { /* silent */ }
  };

  const fmtDate = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: F, display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box", width: "100%", overflowX: "hidden", paddingBottom: 32 }}>
      <div style={{ width: "100%", maxWidth: 520, padding: "24px 16px 0", boxSizing: "border-box" }}>

        {/* Wall card */}
        <div style={{ background: "#faf8f4", border: `2px solid ${BORDER}`, padding: "20px 20px 16px", boxSizing: "border-box" }}>

          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14, gap: 8, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: MUTED }}>COMMUNITY</div>
              <div style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 2 }}>WALL</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button style={{ ...btn(false, true), fontSize: 9 }} onClick={() => { playClick(); fetchFeedbacks(); }}>[ REFRESH ]</button>
              <button style={{ ...btn(true,  true), fontSize: 9 }} onClick={() => { playClick(); setShowForm(true); setStatus(null); }}>[ + ADD ]</button>
            </div>
          </div>

          {/* Feed */}
          {fbLoading ? (
            <div style={{ textAlign: "center", padding: "32px 0", fontSize: 10, color: MUTED, letterSpacing: 3 }}>LOADING...</div>
          ) : feedbacks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", fontSize: 10, color: MUTED, letterSpacing: 2 }}>NO FEEDBACK YET. BE THE FIRST!</div>
          ) : (() => {
            const totalPages = Math.ceil(feedbacks.length / PAGE_SIZE);
            const slice = feedbacks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
            return (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {slice.map((fb, i) => {
                    const id        = fb.FeedbackId;
                    const myVote    = votes[id];
                    const upvotes   = Number(fb.Upvotes)   || 0;
                    const downvotes = Number(fb.Downvotes) || 0;
                    const net       = upvotes - downvotes;
                    const color     = TYPE_COLOR[fb.Type] || MUTED;
                    return (
                      <div key={id || i} style={{ background: i % 2 === 0 ? "#f5f2ec" : BG, border: "1px solid #ddd", padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 28, gap: 1 }}>
                          <button onClick={() => { playClick(); vote(fb, "up"); }} title={myVote === "up" ? "Undo upvote" : "Upvote"}
                            style={{ fontFamily: F, fontSize: 13, background: "none", border: "none", cursor: id ? "pointer" : "default",
                              color: myVote === "up" ? "#448844" : MUTED, padding: 0, lineHeight: 1 }}>▲</button>
                          <span style={{ fontSize: 10, fontWeight: "bold", letterSpacing: 1,
                            color: net > 0 ? "#448844" : net < 0 ? "#cc2200" : MUTED }}>{net}</span>
                          <button onClick={() => { playClick(); vote(fb, "down"); }} title={myVote === "down" ? "Undo downvote" : "Downvote"}
                            style={{ fontFamily: F, fontSize: 13, background: "none", border: "none", cursor: id ? "pointer" : "default",
                              color: myVote === "down" ? "#cc2200" : MUTED, padding: 0, lineHeight: 1 }}>▼</button>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 8, fontWeight: "bold", letterSpacing: 2, color: "#fff", background: color, padding: "2px 6px" }}>{fb.Type || "?"}</span>
                            <span style={{ fontSize: 9, fontWeight: "bold", color: DARK, letterSpacing: 1 }}>{fb.Name || "Anonymous"}</span>
                            <span style={{ fontSize: 8, color: MUTED, marginLeft: "auto" }}>{fmtDate(fb.Timestamp)}</span>
                          </div>
                          <div style={{ fontSize: 11, color: DARK, lineHeight: 1.6, wordBreak: "break-word" }}>{fb.Message}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                    <button onClick={() => { playClick(); setPage(p => Math.max(1, p - 1)); }}
                      disabled={page === 1}
                      style={{ ...btn(false, true), fontSize: 9, opacity: page === 1 ? 0.35 : 1 }}>[ ◀ ]</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => { playClick(); setPage(p); }}
                        style={{ ...btn(page === p, true), fontSize: 9, minWidth: 32 }}>{p}</button>
                    ))}
                    <button onClick={() => { playClick(); setPage(p => Math.min(totalPages, p + 1)); }}
                      disabled={page === totalPages}
                      style={{ ...btn(false, true), fontSize: 9, opacity: page === totalPages ? 0.35 : 1 }}>[ ▶ ]</button>
                  </div>
                )}
              </>
            );
          })()}

          {/* Back button */}
          <div style={{ marginTop: 16 }}>
            <button style={{ ...btn(false), width: "100%" }} onClick={() => { playClick(); onBack(); }}>[ BACK ]</button>
          </div>
        </div>
      </div>

      {/* Add feedback modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={() => setShowForm(false)}>
          <div style={{ background: "#faf8f4", border: `2px solid ${BORDER}`, padding: "clamp(16px, 5vw, 28px)", width: "100%", maxWidth: 460, boxSizing: "border-box", fontFamily: F }}
            onClick={e => e.stopPropagation()}>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 9, letterSpacing: 4, color: MUTED }}>PLAYER</div>
              <div style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 2 }}>ADD FEEDBACK</div>
            </div>

            {/* Type */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: MUTED, marginBottom: 6 }}>TYPE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {TYPES.map(t => {
                  const active = type === t;
                  return (
                    <button key={t} onClick={() => { playClick(); setType(t); }}
                      style={{ fontFamily: F, fontSize: 9, fontWeight: "bold", letterSpacing: 2, padding: "6px 12px",
                        cursor: "pointer", boxSizing: "border-box",
                        border: `2px solid ${active ? TYPE_COLOR[t] : BORDER}`,
                        background: active ? TYPE_COLOR[t] : BG,
                        color: active ? "#fff" : MUTED }}>
                      {active ? `▶ ${t}` : t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: MUTED, marginBottom: 4 }}>NAME (OPTIONAL)</div>
              <input value={name} onChange={e => setName(e.target.value.slice(0, 30))} placeholder="Anonymous" maxLength={30}
                style={{ width: "100%", fontFamily: F, fontSize: 11, padding: "7px 10px", border: `2px solid ${BORDER}`, background: BG, color: DARK, boxSizing: "border-box", letterSpacing: 1 }} />
            </div>

            {/* Message */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: MUTED, marginBottom: 4 }}>MESSAGE *</div>
              <textarea value={message} onChange={e => setMessage(e.target.value.slice(0, 500))}
                placeholder="Write your feedback here..." rows={4} maxLength={500}
                style={{ width: "100%", fontFamily: F, fontSize: 11, padding: "7px 10px", border: `2px solid ${BORDER}`, background: BG, color: DARK, boxSizing: "border-box", resize: "vertical", letterSpacing: 1 }} />
              <div style={{ fontSize: 9, color: MUTED, textAlign: "right" }}>{message.length}/500</div>
            </div>

            {status === "ok"  && <div style={{ fontSize: 10, color: "#448844", letterSpacing: 2, marginBottom: 10 }}>✓ SUBMITTED! THANK YOU.</div>}
            {status === "err" && <div style={{ fontSize: 10, color: "#cc2200", letterSpacing: 2, marginBottom: 10 }}>✗ FAILED. CHECK CONNECTION.</div>}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button style={{ ...btn(false), flex: "1 1 120px", minWidth: 0 }} onClick={() => { playClick(); setShowForm(false); }}>[ CANCEL ]</button>
              <button
                style={{ ...btn(true), flex: "2 1 160px", minWidth: 0, opacity: (!message.trim() || status === "sending") ? 0.5 : 1 }}
                onClick={() => { playClick(); submit(); }}
                disabled={!message.trim() || status === "sending"}>
                {status === "sending" ? "[ SENDING... ]" : "[ SUBMIT ]"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
