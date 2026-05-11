import { useEffect, useRef, useState } from "react";

// ─── SINGLE BUTTON ────────────────────────────────────────────────────────────
function Btn({ label, empty, onPress, onRelease, col, row, opacity }) {
  if (empty) return null;

  const handlers = {
    onPointerDown:   (e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); onPress();   },
    onPointerUp:     (e) => { e.preventDefault(); onRelease(); },
    onPointerCancel: (e) => { e.preventDefault(); onRelease(); },
    onPointerLeave:  (e) => { e.preventDefault(); onRelease(); },
    onContextMenu:   (e) => e.preventDefault(),
  };

  return (
    <div
      {...handlers}
      style={{
        gridColumn: col,
        gridRow: row,
        width:  "var(--bsz)",
        height: "var(--bsz)",
        background: "#f0ede6",
        border: "2px solid #2a2a2a",
        boxShadow: "3px 3px 0 #2a2a2a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#1a1a1a",
        fontSize: "var(--bfont)",
        fontFamily: "'Courier New', monospace",
        fontWeight: "bold",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
        cursor: "pointer",
        flexShrink: 0,
        boxSizing: "border-box",
        opacity: opacity,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {label}
    </div>
  );
}

// ─── TOUCH BUTTONS ────────────────────────────────────────────────────────────
export default function TouchButtons({ keysRef, stats, visible, canvasRef, opacity = 0.88 }) {
  const heldKeys = useRef(new Set());
  const [topPx, setTopPx] = useState(null);

  // Measure canvas bottom edge and viewport height, then find the midpoint
  // of the space below the canvas. Re-measure on resize / orientation change.
  useEffect(() => {
    const measure = () => {
      // Only apply midpoint positioning in portrait
      if (window.innerWidth > window.innerHeight) { setTopPx(null); return; }
      const el = canvasRef?.current;
      if (!el) { setTopPx(null); return; }
      const rect = el.getBoundingClientRect();
      const canvasBottom = rect.bottom;
      // Use visualViewport on iOS Safari to get the true visible area
      const viewBottom = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setTopPx(canvasBottom + (viewBottom - canvasBottom) / 2);
    };
    // Delay first measure so the canvas is fully laid out
    const t = setTimeout(measure, 80);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      if (window.visualViewport) window.visualViewport.removeEventListener("resize", measure);
    };
  }, [canvasRef]);

  useEffect(() => {
    return () => {
      if (!keysRef.current) return;
      for (const k of heldKeys.current) keysRef.current[k] = false;
      heldKeys.current.clear();
    };
  }, [keysRef]);

  if (!visible) return null;

  const press = (key) => {
    if (!keysRef.current) return;
    keysRef.current[key] = true;
    heldKeys.current.add(key);
  };
  const release = (key) => {
    if (!keysRef.current) return;
    keysRef.current[key] = false;
    heldKeys.current.delete(key);
  };

  const hasDown  = stats?.hasDuck || stats?.hasFastDrop;
  const hasLeft  = stats?.hasBackDash;
  const hasRight = stats?.hasDash;
  const hasBite  = stats?.hasBite;

  const dpad = (
    <>
      <Btn label="▲" col={2} row={1} opacity={opacity}
        onPress={() => press("Space")} onRelease={() => release("Space")} />
      {hasLeft  && <Btn label="◀" col={1} row={2} opacity={opacity}
        onPress={() => press("ArrowLeft")}  onRelease={() => release("ArrowLeft")} />}
      {hasBite  && <Btn label={
        <svg viewBox="0 0 22 22" width="60%" height="60%" style={{display:"block"}} shapeRendering="crispEdges">
          {/* Top jaw */}
          <rect x="2"  y="2"  width="18" height="4" fill="currentColor"/>
          <rect x="2"  y="6"  width="18" height="3" fill="currentColor"/>
          {/* Top teeth */}
          <rect x="3"  y="9"  width="3" height="4" fill="currentColor"/>
          <rect x="8"  y="9"  width="3" height="5" fill="currentColor"/>
          <rect x="13" y="9"  width="3" height="5" fill="currentColor"/>
          <rect x="17" y="9"  width="3" height="4" fill="currentColor"/>
          {/* Bottom jaw */}
          <rect x="2"  y="16" width="18" height="4" fill="currentColor"/>
          {/* Bottom teeth */}
          <rect x="5"  y="13" width="3" height="3" fill="currentColor"/>
          <rect x="10" y="12" width="3" height="4" fill="currentColor"/>
          <rect x="15" y="13" width="3" height="3" fill="currentColor"/>
          {/* Shine */}
          <rect x="3"  y="3"  width="14" height="2" fill="rgba(255,255,255,0.4)"/>
          {/* Blood tips */}
          <rect x="9"  y="13" width="1" height="1" fill="#cc0000"/>
          <rect x="14" y="13" width="1" height="1" fill="#cc0000"/>
        </svg>
      } col={2} row={2} opacity={opacity}
        onPress={() => press("KeyF")}   onRelease={() => release("KeyF")} />}
      {hasRight && <Btn label="▶" col={3} row={2} opacity={opacity}
        onPress={() => press("ArrowRight")} onRelease={() => release("ArrowRight")} />}
      {hasDown  && <Btn label="▼" col={2} row={3} opacity={opacity}
        onPress={() => press("ArrowDown")}  onRelease={() => release("ArrowDown")} />}
    </>
  );

  // Portrait: fixed, centred horizontally, vertically centred in the gap below the canvas
  // Landscape: fixed bottom-right
  const isPortrait = topPx !== null;

  const portraitStyle = {
    position: "fixed",
    left: "50%",
    top: topPx ?? "50%",
    transform: "translate(-50%, -50%)",
  };

  const landscapeStyle = {
    position: "fixed",
    bottom: "clamp(6px, 2vh, 14px)",
    right:  "clamp(8px, 2vw, 18px)",
  };

  return (
    <>
      <style>{`
        .tb-dpad {
          --bsz:   clamp(44px, 11vw, 64px);
          --bgap:  clamp(3px,  1vw,  6px);
          --bfont: clamp(16px, 4vw,  24px);
          display: grid;
          grid-template-columns: repeat(3, var(--bsz));
          grid-template-rows:    repeat(3, var(--bsz));
          gap: var(--bgap);
          pointer-events: none;
          z-index: 50;
          filter: drop-shadow(2px 4px 0 rgba(0,0,0,0.45));
        }
        .tb-dpad > * { pointer-events: auto; }
        @media (orientation: landscape) {
          .tb-dpad {
            --bsz:   clamp(36px, 8vh, 54px);
            --bfont: clamp(13px, 3vh, 20px);
          }
        }
        @media (min-width: 600px) and (orientation: portrait) {
          .tb-dpad {
            --bsz:   clamp(52px, 8vw, 72px);
            --bfont: clamp(20px, 3vw, 28px);
          }
        }
        .tb-dpad > div:active {
          background: #1a1a1a !important;
          color: #f0ede6 !important;
          box-shadow: 1px 1px 0 #2a2a2a !important;
          transform: translate(2px, 2px);
        }
      `}</style>

      <div className="tb-dpad" style={isPortrait ? portraitStyle : landscapeStyle}>
        {dpad}
      </div>
    </>
  );
}
