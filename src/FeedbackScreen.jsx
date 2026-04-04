import { useState } from "react";
import { playClick } from "./hooks/useSoundEffects";

const F      = "'Courier New', monospace";
const BG     = "#f0ede6";
const DARK   = "#1a1a1a";
const BORDER = "#2a2a2a";
const MUTED  = "#888";

const TYPES = ["FEEDBACK", "SUGGESTION", "BUG REPORT", "OTHER"];
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export default function FeedbackScreen({ onBack }) {
  const [type,    setType]    = useState("FEEDBACK");
  const [message, setMessage] = useState("");
  const [name,    setName]    = useState("");
  const [status,  setStatus]  = useState(null); // null | "sending" | "ok" | "err"

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
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ type, message: message.trim(), name: name.trim() || "Anonymous" }),
      });
      setStatus("ok");
      setMessage("");
      setName("");
    } catch {
      setStatus("err");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: F, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxSizing: "border-box", width: "100%", overflowX: "hidden" }}>
      <div style={{ width: "100%", maxWidth: 480, padding: "0 16px", boxSizing: "border-box" }}>
        <div style={{ background: "#faf8f4", border: `2px solid ${BORDER}`, padding: "28px", boxSizing: "border-box" }}>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: MUTED }}>PLAYER</div>
            <div style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 2 }}>FEEDBACK</div>
          </div>

          {/* Type selector */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {TYPES.map(t => (
              <button key={t} style={{ ...btn(type === t, true), fontSize: 9 }} onClick={() => { playClick(); setType(t); }}>
                {type === t ? `▶ ${t}` : t}
              </button>
            ))}
          </div>

          {/* Name */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: MUTED, marginBottom: 4 }}>NAME (OPTIONAL)</div>
            <input
              value={name}
              onChange={e => setName(e.target.value.slice(0, 30))}
              placeholder="Anonymous"
              maxLength={30}
              style={{ width: "100%", fontFamily: F, fontSize: 11, padding: "7px 10px", border: `2px solid ${BORDER}`, background: BG, boxSizing: "border-box", letterSpacing: 1 }}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: MUTED, marginBottom: 4 }}>MESSAGE *</div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 500))}
              placeholder="Write your feedback here..."
              rows={5}
              maxLength={500}
              style={{ width: "100%", fontFamily: F, fontSize: 11, padding: "7px 10px", border: `2px solid ${BORDER}`, background: BG, boxSizing: "border-box", resize: "vertical", letterSpacing: 1 }}
            />
            <div style={{ fontSize: 9, color: MUTED, textAlign: "right" }}>{message.length}/500</div>
          </div>

          {/* Status */}
          {status === "ok"  && <div style={{ fontSize: 10, color: "#448844", letterSpacing: 2, marginBottom: 10 }}>✓ SUBMITTED! THANK YOU.</div>}
          {status === "err" && <div style={{ fontSize: 10, color: "#cc2200", letterSpacing: 2, marginBottom: 10 }}>✗ FAILED. CHECK CONNECTION.</div>}

          {/* Actions */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button style={{ ...btn(false), width: "100%" }} onClick={() => { playClick(); onBack(); }}>[ BACK ]</button>
            <button
              style={{ ...btn(true), width: "100%", opacity: (!message.trim() || status === "sending") ? 0.5 : 1 }}
              onClick={() => { playClick(); submit(); }}
              disabled={!message.trim() || status === "sending"}
            >
              {status === "sending" ? "[ SENDING... ]" : "[ SUBMIT ]"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
