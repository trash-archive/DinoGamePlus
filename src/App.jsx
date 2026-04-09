import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import DinoIncremental from "./DinoGamePlus";
import { flushPendingScores } from "./leaderboard";

function UpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();
  if (!needRefresh) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: '#1a1a1a', color: '#f0ede6', padding: '10px 18px',
      fontSize: 11, letterSpacing: 2, zIndex: 9999,
      border: '1px solid #555', display: 'flex', alignItems: 'center', gap: 12,
      whiteSpace: 'nowrap',
    }}>
      <span>NEW VERSION AVAILABLE</span>
      <button
        onClick={() => updateServiceWorker(true)}
        style={{ background: '#f0ede6', color: '#1a1a1a', border: 'none', padding: '4px 12px', fontSize: 10, fontFamily: "'Courier New', monospace", fontWeight: 'bold', cursor: 'pointer', letterSpacing: 2 }}
      >UPDATE</button>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Flush any scores that were queued while offline
    flushPendingScores();
    window.addEventListener('online', flushPendingScores);
    return () => window.removeEventListener('online', flushPendingScores);
  }, []);

  return (
    <>
      <DinoIncremental />
      <UpdatePrompt />
    </>
  );
}

export default App;
