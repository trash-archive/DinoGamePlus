"""
inject_crack_overlay.py  —  clean injection of CrackOverlay into BossFightScreen.jsx
"""
import re

FILE = r"c:\Users\user\Desktop\FUN IDEAS\dino-game-plus\src\BossFightScreen.jsx"

CRACK_COMPONENT = """\n// \u2500\u2500\u2500 CRACK OVERLAY \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function CrackOverlay({ phase }) {
  const glow   = phase === 2 ? "#cc44ff" : phase === 1 ? "#8833cc" : "#6622aa";
  const bright = phase === 2 ? "#ee88ff" : phase === 1 ? "#bb66ee" : "#9944cc";
  const sw     = 1 + phase * 0.6;
  const CRACKS = [
    { side:"T", p:0.15, s:[[0,-2],[1,-2],[-1,-3],[0,-2],[1,-2],[0,-3]] },
    { side:"T", p:0.38, s:[[0,-2],[-1,-3],[0,-2],[1,-2],[0,-3],[-1,-2]] },
    { side:"T", p:0.60, s:[[0,-3],[1,-2],[0,-2],[-1,-3],[0,-2]] },
    { side:"T", p:0.82, s:[[0,-2],[1,-3],[0,-2],[1,-2],[0,-3]] },
    { side:"B", p:0.10, s:[[0,2],[-1,3],[0,2],[1,2],[0,3]] },
    { side:"B", p:0.33, s:[[0,3],[1,2],[0,2],[-1,3],[0,2],[1,2]] },
    { side:"B", p:0.55, s:[[0,2],[1,3],[0,2],[-1,2],[0,3]] },
    { side:"B", p:0.78, s:[[0,3],[-1,2],[0,2],[1,3],[0,2]] },
    { side:"L", p:0.22, s:[[-2,0],[-3,1],[-2,0],[-2,-1],[-3,0]] },
    { side:"L", p:0.50, s:[[-2,0],[-3,-1],[-2,0],[-2,1],[-3,0],[-2,-1]] },
    { side:"L", p:0.74, s:[[-3,0],[-2,1],[-2,0],[-3,-1],[-2,0]] },
    { side:"R", p:0.18, s:[[2,0],[3,-1],[2,0],[2,1],[3,0]] },
    { side:"R", p:0.45, s:[[3,0],[2,1],[2,0],[3,-1],[2,0],[2,1]] },
    { side:"R", p:0.72, s:[[2,0],[3,1],[2,0],[2,-1],[3,0]] },
  ];
  const paths = CRACKS.map((c, ci) => {
    let x = c.side === "L" ? 0 : c.side === "R" ? 100 : c.p * 100;
    let y = c.side === "T" ? 0 : c.side === "B" ? 100 : c.p * 100;
    let d = `M ${x} ${y}`;
    for(const [dx, dy] of c.s) { x += dx; y += dy; d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`; }
    const last = c.s[c.s.length - 1];
    const bx = (x + last[1] * 0.8).toFixed(1);
    const by = (y - last[0] * 0.8).toFixed(1);
    return { main: d, branch: `M ${x.toFixed(1)} ${y.toFixed(1)} L ${bx} ${by}`, key: ci };
  });
  return (
    <svg viewBox="-8 -8 116 116" preserveAspectRatio="none"
      style={{ position:"absolute", inset:"-8%", width:"116%", height:"116%", pointerEvents:"none", zIndex:10, overflow:"visible" }}>
      {paths.map(p => (
        <g key={`g${p.key}`}>
          <path d={p.main}   stroke={glow}   strokeWidth={sw*2.8} fill="none" strokeLinecap="square" opacity="0.45" />
          <path d={p.branch} stroke={glow}   strokeWidth={sw*1.6} fill="none" strokeLinecap="square" opacity="0.3"  />
        </g>
      ))}
      {paths.map(p => (
        <g key={`b${p.key}`}>
          <path d={p.main}   stroke={bright} strokeWidth={sw*1.1} fill="none" strokeLinecap="square" opacity="0.9" />
          <path d={p.branch} stroke={bright} strokeWidth={sw*0.6} fill="none" strokeLinecap="square" opacity="0.7" />
        </g>
      ))}
      {paths.map((p, i) => {
        let x = CRACKS[i].side==="L"?0:CRACKS[i].side==="R"?100:CRACKS[i].p*100;
        let y = CRACKS[i].side==="T"?0:CRACKS[i].side==="B"?100:CRACKS[i].p*100;
        for(const [dx,dy] of CRACKS[i].s){x+=dx;y+=dy;}
        return <rect key={`t${i}`} x={x-0.5} y={y-0.5} width="1" height="1" fill="#ffffff" opacity="0.85" />;
      })}
    </svg>
  );
}

"""

def main():
    with open(FILE, "r", encoding="utf-8") as f:
        content = f.read()

    print(f"File loaded: {len(content)} chars")

    # ── Step 1: Remove any existing CrackOverlay JSX references (all variants) ──
    before = len(content)
    content = re.sub(r'[ \t]*<CrackOverlay[^>]*/>\r?\n?', '', content)
    content = re.sub(r'[ \t]*\{/\*[^*]*[Cc]rack[^*]*\*/\}\r?\n?', '', content)
    print(f"Removed JSX refs: {before - len(content)} chars removed")

    # ── Step 2: Remove any existing CrackOverlay function definition ──
    before = len(content)
    # Match from the comment line through the closing brace of the function
    content = re.sub(
        r'// [─\-]+ CRACK OVERLAY [─\-]+\r?\nfunction CrackOverlay[\s\S]*?\n\}\n',
        '',
        content
    )
    print(f"Removed old function: {before - len(content)} chars removed")

    # ── Step 3: Verify the export default marker exists ──
    marker = "export default function BossFightScreen("
    if marker not in content:
        print("ERROR: export default marker not found")
        return

    # ── Step 4: Insert CrackOverlay function before export default ──
    content = content.replace(marker, CRACK_COMPONENT + marker, 1)
    print("Inserted CrackOverlay function")

    # ── Step 5: Insert JSX reference after the canvas element ──
    # Find the canvas element and insert after it
    canvas_re = re.compile(r'(<canvas ref=\{canvasRef\}[^\n]*/>\r?\n)')
    m = canvas_re.search(content)
    if not m:
        print("ERROR: canvas element not found in JSX")
        return

    insert_pos = m.end()
    jsx_ref = '          <CrackOverlay phase={overlay ? 2 : (gsRef.current?.bossPhase ?? 0)} />\n'
    content = content[:insert_pos] + jsx_ref + content[insert_pos:]
    print("Inserted CrackOverlay JSX reference")

    # ── Step 6: Write back ──
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print("File written successfully")

    # ── Step 7: Verify ──
    with open(FILE, "r", encoding="utf-8") as f:
        check = f.read()

    ok_fn  = "function CrackOverlay(" in check
    ok_jsx = "<CrackOverlay" in check
    print(f"VERIFY function present: {ok_fn}")
    print(f"VERIFY JSX ref present:  {ok_jsx}")

    if ok_fn and ok_jsx:
        print("\nSUCCESS — CrackOverlay is properly injected.")
    else:
        print("\nFAILED — check the file manually.")

if __name__ == "__main__":
    main()
