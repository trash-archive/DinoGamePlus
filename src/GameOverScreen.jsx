import { playClick } from "./hooks/useSoundEffects";

const F      = "'Courier New', monospace";
const BG     = "#f0ede6";
const DARK   = "#1a1a1a";
const BORDER = "#2a2a2a";
const MUTED  = "#888";
const tierColors = { bronze:"#cd7f32", silver:"#aaa", gold:"#d4a820", legend:"#9944cc" };

export default function GameOverScreen({ lastRun, bestDist, lastRunRank, getSavedName, onRunAgain, onUpgrades, onMenu }) {
  const isNewBest = lastRun && lastRun.dist >= bestDist && bestDist > 0;

  // lastRunRank is { rank, boardLabel } or null
  const rankNum   = lastRunRank?.rank ?? null;
  const rankBoard = lastRunRank?.boardLabel ?? "GLOBAL";

  const overlay = {
    position: "fixed", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(10,10,10,0.65)",
    fontFamily: F,
    zIndex: 100,
    padding: "16px",
    boxSizing: "border-box",
  };

  const panel = {
    background: "#faf8f4",
    border: `2px solid ${BORDER}`,
    padding: "28px 24px",
    width: "100%",
    maxWidth: 340,
    boxSizing: "border-box",
    textAlign: "center",
    lineHeight: "normal",
  };

  const btn = (primary = false) => ({
    background: primary ? DARK : BG,
    color: primary ? BG : DARK,
    border: `2px solid ${BORDER}`,
    padding: "10px 0",
    fontSize: 11,
    fontFamily: F,
    cursor: "pointer",
    letterSpacing: 1,
    fontWeight: "bold",
    flex: 1,
    boxSizing: "border-box",
  });

  return (
    <div style={overlay}>
      <div style={panel}>

        {/* Title */}
        <div style={{ fontSize: 9, letterSpacing: 3, color: MUTED, marginBottom: 4 }}>EXTINCT</div>
        <div style={{ fontSize: 24, fontWeight: "bold", letterSpacing: 2, marginBottom: 20 }}>GAME OVER</div>

        {/* Stats */}
        {lastRun && (
          <div style={{ marginBottom: 16 }}>
            {/* Distance — primary, large */}
            <div style={{ background: "#f0ede6", border: `2px solid ${BORDER}`, padding: "14px 12px", marginBottom: 6 }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: MUTED, marginBottom: 6 }}>DISTANCE</div>
              <div style={{ fontSize: 36, fontWeight: "bold", letterSpacing: 2, lineHeight: 1 }}>{lastRun.dist}<span style={{ fontSize: 16, fontWeight: "normal", letterSpacing: 1, marginLeft: 4, color: MUTED }}>m</span></div>
            </div>
            {/* Fossils — secondary, smaller */}
            <div style={{ background: "#f5f2ec", border: "1px solid #ddd", padding: "7px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: MUTED }}>FOSSILS EARNED</div>
              <div style={{ fontSize: 13, fontWeight: "bold", color: DARK }}>◈ {lastRun.fossils}</div>
            </div>
          </div>
        )}

        {/* New best */}
        {isNewBest && (
          <div style={{ marginBottom: 12, padding: "9px 12px", background: DARK, color: "#ffdd44", letterSpacing: 2, fontSize: 10, fontWeight: "bold" }}>
            ★ NEW BEST DISTANCE ★
          </div>
        )}

        {/* Leaderboard rank */}
        {rankNum !== null && (
          <div style={{ marginBottom: 12, padding: "9px 12px", background: "#111", color: BG, letterSpacing: 1, fontSize: 10 }}>
            <div style={{ fontSize: 8, color: "#888", letterSpacing: 2, marginBottom: 4 }}>{rankBoard} LEADERBOARD</div>
            RANKED{" "}
            <span style={{
              color: rankNum <= 3 ? tierColors[rankNum === 1 ? "gold" : rankNum === 2 ? "silver" : "bronze"] : BG,
              fontWeight: "bold", fontSize: 13,
            }}>
              #{rankNum}
            </span>
            {" "}ON THE LEADERBOARD
            <div style={{ fontSize: 8, color: "#888", marginTop: 3, letterSpacing: 1 }}>as {getSavedName()}</div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button style={btn(true)} onClick={() => { playClick(); onRunAgain(); }}>[ RUN AGAIN ]</button>
          <button style={btn(false)} onClick={() => { playClick(); onUpgrades(); }}>[ UPGRADES ]</button>
        </div>
        <button style={{ ...btn(false), width: "100%", border: "2px solid #ccc", color: MUTED, fontSize: 10 }} onClick={() => { playClick(); onMenu(); }}>
          [ MENU ]
        </button>

      </div>
    </div>
  );
}
