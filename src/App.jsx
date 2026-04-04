import DinoIncremental from "./DinoGamePlus";
import useCozyMusic from "./hooks/useCozyMusic";

const F = "'Courier New', monospace";

function App() {
  const { blocked, muted, setMuted } = useCozyMusic();

  return (
    <>
      <DinoIncremental musicMuted={muted} setMusicMuted={setMuted} />
      {blocked && (
        <div style={{
          position: "fixed", bottom: 16, right: 16,
          background: "#1a1a1a", color: "#f0ede6",
          fontSize: 10, fontFamily: F, letterSpacing: 2,
          padding: "8px 14px", border: "1px solid #555",
          zIndex: 9999, cursor: "pointer", userSelect: "none",
        }}>
          ♪ CLICK TO PLAY MUSIC
        </div>
      )}
    </>
  );
}

export default App;
