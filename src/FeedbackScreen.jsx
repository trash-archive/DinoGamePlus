import { useState, useEffect, useRef, useCallback } from "react";
import { playClick } from "./hooks/useSoundEffects";
import useModalBack from "./hooks/useModalBack";

const F      = "'Courier New', monospace";
const BG     = "#f0ede6";
const DARK   = "#1a1a1a";
const BORDER = "#2a2a2a";
const MUTED  = "#888";

const TYPES = ["FEEDBACK", "SUGGESTION", "BUG REPORT", "OTHER"];
const MAX_IMG_BYTES = 4 * 1024 * 1024; // 4 MB

function useScreenshot() {
  const [preview, setPreview] = useState(null);
  const [b64, setB64]         = useState(null);
  const [mime, setMime]       = useState(null);
  const pick = (file) => {
    if (!file) return;
    if (file.size > MAX_IMG_BYTES) return alert("Image must be under 4 MB.");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target.result; // data:mime;base64,xxx
      const [header, data] = result.split(",");
      setMime(header.replace("data:", "").replace(";base64", ""));
      setB64(data);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };
  const clear = () => { setPreview(null); setB64(null); setMime(null); };
  return { preview, b64, mime, pick, clear };
}
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;
const TYPE_COLOR = { "FEEDBACK": "#448844", "SUGGESTION": "#2266cc", "BUG REPORT": "#cc2200", "OTHER": "#888" };

// votes stored as { [feedbackId]: "up" | "down" }
const VOTES_KEY = "dino_votes_v2";
function getVotes() { try { return JSON.parse(localStorage.getItem(VOTES_KEY) || "{}"); } catch { return {}; } }
function saveVotes(v) { localStorage.setItem(VOTES_KEY, JSON.stringify(v)); }

// module-level reply cache so re-opening is instant
const repliesCache = {};

function ReplySection({ feedbackId, showToast }) {
  const [open,     setOpen]     = useState(false);
  const [replies,  setReplies]  = useState(() => repliesCache[feedbackId] || []);
  const [loading,  setLoading]  = useState(false);
  const [replyMsg, setReplyMsg] = useState("");
  const [replyName,setReplyName]= useState("");
  const [sending,  setSending]  = useState(false);
  const [showForm, setShowForm] = useState(false);
  const replyShot = useScreenshot();

  const fmtDate = (ts) => ts ? new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "";

  const fetchReplies = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${APPS_SCRIPT_URL}?feedbackId=${feedbackId}`);
      const json = await res.json();
      if (json.ok) {
        repliesCache[feedbackId] = json.data || [];
        setReplies(repliesCache[feedbackId]);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  // fetched = cache key exists (even if empty array) meaning getAllReplies already ran
  const [fetched, setFetched] = useState(() => feedbackId in repliesCache);

  const toggle = () => {
    if (!open && !fetched) { fetchReplies(); setFetched(true); }
    setOpen(o => !o);
  };

  const submitReply = async () => {
    if (!replyMsg.trim() || !navigator.onLine) return;
    setSending(true);
    const name = replyName.trim() || "Anonymous";
    const msg  = replyMsg.trim();
    // capture before clear
    const shotB64     = replyShot.b64;
    const shotMime    = replyShot.mime;
    const shotPreview = replyShot.preview;
    const optimistic = { ReplyId: `tmp-${Date.now()}`, FeedbackId: feedbackId, Name: name, Message: msg, Timestamp: new Date().toISOString(), ScreenshotUrl: shotPreview || "" };
    const updated = [...(repliesCache[feedbackId] || []), optimistic];
    repliesCache[feedbackId] = updated;
    setReplies(updated);
    setReplyMsg(""); setReplyName(""); setShowForm(false); replyShot.clear();
    showToast("✓ REPLY POSTED!");
    try {
      const body = { action: "reply", feedbackId, name, message: msg };
      if (shotB64) { body.screenshotBase64 = shotB64; body.screenshotMime = shotMime; }
      const res  = await fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify(body) });
      const json = await res.json();
      if (!json.ok) throw new Error();
      if (json.replyId) {
        const patched = repliesCache[feedbackId].map(r => r.ReplyId === optimistic.ReplyId ? { ...r, ReplyId: json.replyId, ScreenshotUrl: json.screenshotUrl || r.ScreenshotUrl } : r);
        repliesCache[feedbackId] = patched;
        setReplies(patched);
      }
    } catch { showToast("✗ FAILED. CHECK CONNECTION."); }
    setSending(false);
  };

  return (
    <div style={{ marginTop: 8, borderTop: "1px solid #e0ddd6", paddingTop: 6 }}>
      <button onClick={() => { playClick(); toggle(); }}
        style={{ fontFamily: F, fontSize: 9, background: "none", border: "none", cursor: "pointer", color: MUTED, letterSpacing: 2, padding: 0 }}>
        {open ? "▾ HIDE REPLIES" : `▸ REPLIES${replies.length ? ` (${replies.length})` : ""}`}
      </button>

      {open && (
        <div style={{ marginTop: 6 }}>
          {loading ? (
            <div style={{ fontSize: 9, color: MUTED, letterSpacing: 2 }}>LOADING...</div>
          ) : replies.length === 0 ? (
            <div style={{ fontSize: 9, color: MUTED, letterSpacing: 2 }}>NO REPLIES YET.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {replies.map((r, i) => (
                <div key={r.ReplyId || i} style={{ background: "#edeae2", padding: "7px 10px", fontSize: 10, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: "bold", letterSpacing: 1, marginRight: 6 }}>{r.Name || "Anonymous"}</span>
                  <span style={{ color: MUTED, fontSize: 8, marginRight: 8 }}>{fmtDate(r.Timestamp)}</span>
                  <div style={{ marginTop: 2, wordBreak: "break-word" }}>{r.Message}</div>
                  {r.ScreenshotUrl && <ScreenshotThumb url={r.ScreenshotUrl} />}
                </div>
              ))}
            </div>
          )}

          {!showForm ? (
            <button onClick={() => { playClick(); setShowForm(true); }}
              style={{ fontFamily: F, fontSize: 9, background: "none", border: "none", cursor: "pointer", color: "#2266cc", letterSpacing: 2, padding: "6px 0 0", display: "block" }}>
              + ADD REPLY
            </button>
          ) : (
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              <input value={replyName} onChange={e => setReplyName(e.target.value.slice(0, 30))} placeholder="Name (optional)"
                style={{ fontFamily: F, fontSize: 10, padding: "5px 8px", border: `1px solid ${BORDER}`, background: BG, color: DARK, letterSpacing: 1 }} />
              <textarea value={replyMsg} onChange={e => setReplyMsg(e.target.value.slice(0, 300))} placeholder="Write a reply..." rows={2} maxLength={300}
                style={{ fontFamily: F, fontSize: 10, padding: "5px 8px", border: `1px solid ${BORDER}`, background: BG, color: DARK, resize: "vertical", letterSpacing: 1 }} />
              <ScreenshotPicker shot={replyShot} />
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { playClick(); setShowForm(false); setReplyMsg(""); setReplyName(""); }}
                  style={{ fontFamily: F, fontSize: 9, padding: "4px 10px", border: `1px solid ${BORDER}`, background: BG, color: DARK, cursor: "pointer", letterSpacing: 2 }}>CANCEL</button>
                <button onClick={() => { playClick(); submitReply(); }}
                  disabled={!replyMsg.trim() || sending}
                  style={{ fontFamily: F, fontSize: 9, padding: "4px 10px", border: `1px solid ${BORDER}`, background: DARK, color: BG, cursor: "pointer", letterSpacing: 2, opacity: (!replyMsg.trim() || sending) ? 0.5 : 1 }}>
                  {sending ? "SENDING..." : "REPLY"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function driveThumbUrl(url) {
  if (!url) return null;
  if (url.startsWith("data:")) return url; // local preview
  const m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w400` : url;
}

function ScreenshotThumb({ url }) {
  const [open, setOpen] = useState(false);
  const thumb = driveThumbUrl(url);
  return (
    <>
      <img src={thumb} alt="screenshot" onClick={() => setOpen(true)}
        style={{ marginTop: 6, maxWidth: 160, maxHeight: 100, objectFit: "cover", cursor: "pointer", border: `1px solid #ccc`, display: "block" }} />
      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <img src={thumb} alt="screenshot" style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain" }} />
          <div style={{ position: "absolute", top: 16, right: 20, color: "#fff", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</div>
        </div>
      )}
    </>
  );
}

function ScreenshotPicker({ shot }) {
  const inputRef = useRef();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: MUTED }}>SCREENSHOT (OPTIONAL)</div>
      {shot.preview
        ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={shot.preview} alt="preview" style={{ maxWidth: 100, maxHeight: 70, objectFit: "cover", border: `1px solid #ccc` }} />
            <button onClick={() => { playClick(); shot.clear(); }}
              style={{ fontFamily: F, fontSize: 9, background: "none", border: "none", cursor: "pointer", color: "#cc2200", letterSpacing: 2 }}>✕ REMOVE</button>
          </div>
        : <button onClick={() => { playClick(); inputRef.current.click(); }}
            style={{ fontFamily: F, fontSize: 9, padding: "5px 10px", border: `1px solid ${BORDER}`, background: BG, color: DARK, cursor: "pointer", letterSpacing: 2, alignSelf: "flex-start" }}>
            + ATTACH IMAGE
          </button>
      }
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { shot.pick(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}

function sortFeedbacks(list) {
  return [...list].sort((a, b) => {
    const na = (Number(a.Upvotes) || 0) - (Number(a.Downvotes) || 0);
    const nb = (Number(b.Upvotes) || 0) - (Number(b.Downvotes) || 0);
    if (nb !== na) return nb - na;
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });
}

export default function FeedbackScreen({ onBack, showNotif }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [fbLoading, setFbLoading] = useState(true);
  const [votes,     setVotes]     = useState(() => getVotes());
  const votesRef = { current: votes };
  votesRef.current = votes;
  const [showForm,  setShowForm]  = useState(false);
  const closeForm = useCallback(() => setShowForm(false), []);
  useModalBack(showForm, closeForm);
  const [filter,    setFilter]    = useState("ALL");
  const [page,      setPage]      = useState(1);
  const [toast,     setToast]     = useState(null);
  const [isOnline,  setIsOnline]  = useState(() => navigator.onLine);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  // form state
  const [type,    setType]    = useState("FEEDBACK");
  const [message, setMessage] = useState("");
  const [name,    setName]    = useState("");
  const [status,  setStatus]  = useState(null);
  const fbShot = useScreenshot();

  const fetchFeedbacks = async () => {
    if (!navigator.onLine) { setFbLoading(false); return; }
    setFbLoading(true);
    try {
      const [fbRes, repRes] = await Promise.all([
        fetch(APPS_SCRIPT_URL),
        fetch(`${APPS_SCRIPT_URL}?action=getAllReplies`),
      ]);
      const [fbJson, repJson] = await Promise.all([fbRes.json(), repRes.json()]);
      if (fbJson.ok) {
        setFeedbacks(sortFeedbacks(
          (fbJson.data || []).filter(f => f.FeedbackId && String(f.Message || "").trim())
        ));
        setPage(1);
      }
      if (repJson.ok) {
        // clear and rebuild cache to avoid duplicates on refresh
        Object.keys(repliesCache).forEach(k => delete repliesCache[k]);
        (repJson.data || []).forEach(r => {
          if (!r.FeedbackId) return;
          if (!repliesCache[r.FeedbackId]) repliesCache[r.FeedbackId] = [];
          repliesCache[r.FeedbackId].push(r);
        });
      }
    } catch { /* silent */ }
    setFbLoading(false);
  };

  useEffect(() => { fetchFeedbacks(); }, []);
  // Re-fetch automatically when connection is restored (not on initial mount)
  const isOnlineRef = useRef(isOnline);
  useEffect(() => {
    if (isOnline && !isOnlineRef.current) fetchFeedbacks();
    isOnlineRef.current = isOnline;
  }, [isOnline]);

  const btn = (primary = false, small = false) => ({
    background: primary ? DARK : BG, color: primary ? BG : DARK,
    border: `2px solid ${BORDER}`, padding: small ? "5px 12px" : "10px 20px",
    fontSize: small ? 10 : 12, fontFamily: F, cursor: "pointer",
    letterSpacing: 2, fontWeight: "bold", boxSizing: "border-box",
  });

  const submit = async () => {
    if (!message.trim() || !navigator.onLine) return;
    setStatus("sending");
    // capture before clear
    const shotB64     = fbShot.b64;
    const shotMime    = fbShot.mime;
    const localPreview = fbShot.preview;
    try {
      const body = { type, message: message.trim(), name: name.trim() || "Anonymous" };
      if (shotB64) { body.screenshotBase64 = shotB64; body.screenshotMime = shotMime; }
      const res  = await fetch(APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify(body) });
      const json = await res.json();
      if (!json.ok) throw new Error();
      setMessage(""); setName(""); setType("FEEDBACK"); setStatus(null); fbShot.clear();
      setShowForm(false);
      showToast("✓ SUBMITTED! THANK YOU.");
      if (json.feedbackId) {
        const optimistic = { FeedbackId: json.feedbackId, Type: body.type, Message: body.message, Name: body.name, Upvotes: 0, Downvotes: 0, Timestamp: new Date().toISOString(), ScreenshotUrl: json.screenshotUrl || localPreview || "" };
        setFeedbacks(prev => sortFeedbacks([...prev, optimistic]));
      }
      setTimeout(fetchFeedbacks, 3000);
    } catch { setStatus("err"); showToast("✗ FAILED. CHECK CONNECTION."); }
  };

  // direction: "up" | "down"
  const vote = async (fb, direction) => {
    const id = fb.FeedbackId;
    if (!id || !navigator.onLine) return;

    // read fresh votes from ref to avoid stale closure
    const current = votesRef.current[id]; // "up" | "down" | undefined
    const isUndo  = current === direction;

    const newVotes = { ...votesRef.current };
    if (isUndo) delete newVotes[id];
    else        newVotes[id] = direction;
    saveVotes(newVotes);
    setVotes(newVotes);

    // optimistic update — read counts from prev state, apply delta
    setFeedbacks(prev => sortFeedbacks(prev.map(f => {
      if (f.FeedbackId !== id) return f;
      let up   = Number(f.Upvotes)   || 0;
      let down = Number(f.Downvotes) || 0;

      if (isUndo) {
        if (current === "up")   up   = Math.max(0, up   - 1);
        if (current === "down") down = Math.max(0, down - 1);
      } else {
        // undo old vote if switching
        if (current === "up")   up   = Math.max(0, up   - 1);
        if (current === "down") down = Math.max(0, down - 1);
        // apply new
        if (direction === "up")   up   += 1;
        if (direction === "down") down += 1;
      }
      return { ...f, Upvotes: up, Downvotes: down };
    })));

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
    <div style={{ minHeight: "100svh", background: BG, fontFamily: F, display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box", width: "100%", overflowX: "hidden", overflowY: "auto", paddingBottom: 32 }}>
      <div style={{ width: "100%", maxWidth: 520, padding: "24px 16px 0", boxSizing: "border-box" }}>

        {/* Wall card */}
        <div style={{ background: "#faf8f4", border: `2px solid ${BORDER}`, padding: "20px 20px 16px", boxSizing: "border-box" }}>

          {/* Offline banner */}
          {!isOnline && (
            <div style={{ marginBottom: 12, padding: "10px 12px", background: "#fff3cd", border: "1px solid #e6c84a", fontSize: 10, letterSpacing: 1, color: "#7a5c00", lineHeight: 1.6 }}>
              ⚠ YOU'RE OFFLINE — Community Wall is not available without an internet connection. Connect to load posts and submit feedback.
            </div>
          )}

          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14, gap: 8, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: MUTED }}>COMMUNITY</div>
              <div style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 2 }}>WALL</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button style={{ ...btn(false, true), fontSize: 9, opacity: isOnline ? 1 : 0.4 }} disabled={!isOnline} onClick={() => { playClick(); fetchFeedbacks(); }}>[ REFRESH ]</button>
              <button style={{ ...btn(true,  true), fontSize: 9, opacity: isOnline ? 1 : 0.4 }} disabled={!isOnline} onClick={() => { if (!isOnline) return; playClick(); setShowForm(true); setStatus(null); }}>[ ADD ]</button>
            </div>
          </div>

          <div style={{ borderTop: `1px solid #ddd`, marginBottom: 12 }} />

          {/* Category filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 9, letterSpacing: 2, color: MUTED, whiteSpace: "nowrap" }}>FILTER</span>
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
              style={{ fontFamily: F, fontSize: 10, fontWeight: "bold", letterSpacing: 2, padding: "6px 10px",
                border: `2px solid ${BORDER}`, background: BG, color: DARK, cursor: "pointer", flex: "1 1 120px", minWidth: 0, appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%231a1a1a'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: 28 }}>
              <option value="ALL">ALL</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ borderTop: `1px solid #ddd`, marginBottom: 12 }} />

          {/* Feed */}
          {!isOnline ? (
            <div style={{ textAlign: "center", padding: "32px 0", fontSize: 10, color: MUTED, letterSpacing: 2, lineHeight: 1.8 }}>
              No internet connection.<br/>Posts will appear here once you're online.
            </div>
          ) : fbLoading ? (
            <div style={{ textAlign: "center", padding: "32px 0", fontSize: 10, color: MUTED, letterSpacing: 3 }}>LOADING...</div>
          ) : (() => {
            const filtered = filter === "ALL" ? feedbacks : feedbacks.filter(f => f.Type === filter);
            if (filtered.length === 0) return <div style={{ textAlign: "center", padding: "32px 0", fontSize: 10, color: MUTED, letterSpacing: 2 }}>NO FEEDBACK YET. BE THE FIRST!</div>;
            const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
            const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
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
                          {fb.ScreenshotUrl && <ScreenshotThumb url={fb.ScreenshotUrl} />}
                          <ReplySection feedbackId={id} showToast={showToast} />
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
                      style={{ ...btn(false, true), fontSize: 9, opacity: page === 1 ? 0.35 : 1 }}>◀</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => { playClick(); setPage(p); }}
                        style={{ ...btn(page === p, true), fontSize: 9, minWidth: 32 }}>{p}</button>
                    ))}
                    <button onClick={() => { playClick(); setPage(p => Math.min(totalPages, p + 1)); }}
                      disabled={page === totalPages}
                      style={{ ...btn(false, true), fontSize: 9, opacity: page === totalPages ? 0.35 : 1 }}>▶</button>
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
          onClick={() => { setShowForm(false); fbShot.clear(); }}>
          <div style={{ background: "#faf8f4", border: `2px solid ${BORDER}`, padding: "clamp(16px, 5vw, 28px)", width: "100%", maxWidth: 460, overflowY: "auto", maxHeight: "90svh", boxSizing: "border-box", fontFamily: F }}
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

            {/* Screenshot */}
            <div style={{ marginBottom: 14 }}>
              <ScreenshotPicker shot={fbShot} />
            </div>

            {status === "err" && <div style={{ fontSize: 10, color: "#cc2200", letterSpacing: 2, marginBottom: 10 }}>✗ FAILED. CHECK CONNECTION.</div>}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button style={{ ...btn(false), flex: "1 1 120px", minWidth: 0 }} onClick={() => { playClick(); setShowForm(false); fbShot.clear(); }}>[ CANCEL ]</button>
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
      {toast && <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:DARK, color:BG, padding:"9px 22px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #555" }}>{toast}</div>}
    </div>
  );
}
