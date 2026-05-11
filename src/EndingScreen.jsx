import { useEffect, useRef, useState, useCallback } from "react";
import { CANVAS_W, CANVAS_H } from "./constants";
import { drawDino } from "./rendering/drawDino";

// ─── DIALOGUE ─────────────────────────────────────────────────────────────────
const LINES = [
  { text: "",                                                          gap: 60  },
  { text: "You did it.",                                               gap: 80  },
  { text: "You ran.",                                                  gap: 60  },
  { text: "You jumped.",                                               gap: 60  },
  { text: "You collected little rocks.",                               gap: 80  },
  { text: "",                                                          gap: 30  },
  { text: "And somehow...",                                            gap: 80  },
  { text: "that was enough.",                                          gap: 100 },
  { text: "",                                                          gap: 40  },
  { text: "Isn't that just life?",                                     gap: 90  },
  { text: "You don't really know what you're running from.",           gap: 80  },
  { text: "You just... run.",                                          gap: 100 },
  { text: "",                                                          gap: 40  },
  { text: "The obstacles keep coming.",                                gap: 70  },
  { text: "Some you jump over.",                                       gap: 60  },
  { text: "Some you duck under.",                                      gap: 60  },
  { text: "Some you just eat.",                                        gap: 90  },
  { text: "(Please don't eat the obstacles.)",                         gap: 80  },
  { text: "",                                                          gap: 40  },
  { text: "You collected fossils.",                                    gap: 70  },
  { text: "Remnants of things that didn't make it.",                   gap: 80  },
  { text: "You turned their extinction into your upgrades.",           gap: 90  },
  { text: "",                                                          gap: 40  },
  { text: "That's either beautiful or deeply disturbing.",             gap: 90  },
  { text: "Probably both.",                                            gap: 100 },
  { text: "",                                                          gap: 40  },
  { text: "And then there was ▓▒░█▓▒░.",                               gap: 80  },
  { text: "A horror beyond comprehension.",                            gap: 70  },
  { text: "Ancient. Unknowable. Terrifying.",                          gap: 70  },
  { text: "",                                                          gap: 40  },
  { text: "You bit it.",                                               gap: 100 },
  { text: "",                                                          gap: 40  },
  { text: "You just... ran up and bit the cosmic horror.",             gap: 90  },
  { text: "Fifteen times.",                                            gap: 100 },
  { text: "",                                                          gap: 40  },
  { text: "There's a lesson here.",                                    gap: 80  },
  { text: "About persistence.",                                        gap: 60  },
  { text: "About courage.",                                            gap: 60  },
  { text: "About showing up even when the world",                      gap: 50  },
  { text: "throws void orbs at you.",                                  gap: 90  },
  { text: "",                                                          gap: 40  },
  { text: "Or maybe the lesson is:",                                   gap: 70  },
  { text: "just keep moving.",                                         gap: 100 },
  { text: "That's it.",                                                gap: 80  },
  { text: "That's the whole thing.",                                   gap: 100 },
  { text: "",                                                          gap: 60  },
  { text: "The sun will set.",                                         gap: 70  },
  { text: "The run will end.",                                         gap: 70  },
  { text: "And you'll sit on your little island",                      gap: 60  },
  { text: "and watch it all go quiet.",                                gap: 100 },
  { text: "",                                                          gap: 40  },
  { text: "And that's okay.",                                          gap: 120 },
  { text: "",                                                          gap: 60  },
  { text: "────────────────────────────────",                          gap: 60  },
  { text: "",                                                          gap: 40  },
  { text: "DINO REIMAGINED",                                           gap: 60  },
  { text: "",                                                          gap: 30  },
  { text: "Made by Hasim",                                             gap: 50  },
  { text: "with hate",                                                 gap: 80  },
  { text: "",                                                          gap: 40  },
  { text: "Special thanks to:",                                        gap: 50  },
  { text: "every obstacle that ever hit you.",                         gap: 60  },
  { text: "you needed it.",                                            gap: 80  },
  { text: "",                                                          gap: 40  },
  { text: "────────────────────────────────",                          gap: 60  },
  { text: "",                                                          gap: 120 },
];

// ─── COLOR LERP ───────────────────────────────────────────────────────────────
function parseColor(c) {
  if(c.startsWith("rgb")) {
    const m = c.match(/rgb\((\d+),(\d+),(\d+)\)/);
    if(m) return [+m[1], +m[2], +m[3]];
  }
  const h = c.replace("#","");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function lerpColor(c1, c2, t) {
  t = Math.max(0, Math.min(1, t));
  const [r1,g1,b1] = parseColor(c1);
  const [r2,g2,b2] = parseColor(c2);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}

// ─── ISLAND SCENE ─────────────────────────────────────────────────────────────
const ISLAND_TOTAL_FRAMES = 720;
const ISLAND_FADEOUT_START = 740;
const ISLAND_FADEOUT_END   = 810;

function drawIsland(ctx, frame, skin, design) {
  const W = CANVAS_W, H = CANVAS_H;
  const t = Math.min(1, frame / ISLAND_TOTAL_FRAMES); // 0=golden hour, 1=deep night

  // ── Sky gradient — golden hour → dusk → deep night ──────────────────────
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.72);
  skyGrad.addColorStop(0,    lerpColor(lerpColor("#1a0a3a","#0d1a4a",t), "#000510", Math.max(0,t-0.5)*2));
  skyGrad.addColorStop(0.45, lerpColor(lerpColor("#7a1a5a","#3a0a6a",t*0.8), "#050818", Math.max(0,t-0.4)*1.6));
  skyGrad.addColorStop(1,    lerpColor(lerpColor("#ff8c3a","#cc3a1a",t*0.6), lerpColor("#1a0a3a","#020510",t), Math.min(1,t*1.4)));
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H * 0.72 + 2);

  // ── Stars — twinkling, fade in from t=0.25 ───────────────────────────────
  const starAlpha = Math.max(0, (t - 0.25) / 0.5);
  if(starAlpha > 0.01) {
    const STARS = [
      [42,10,1],[118,6,2],[198,18,1],[308,4,2],[418,12,1],[528,16,2],[638,8,1],[698,22,1],
      [78,36,1],[258,30,2],[476,34,1],[658,26,2],[158,13,1],[348,24,1],[588,10,2],[728,38,1],
      [22,50,1],[180,44,1],[340,52,2],[500,46,1],[680,54,1],[90,58,1],[440,20,1],[600,42,2],
      [270,8,1],[560,28,1],[730,16,2],[50,28,1],[380,40,1],[710,48,1],
    ];
    for(const [sx, sy, sz] of STARS) {
      const twinkle = 0.5 + 0.5 * Math.sin(frame * 0.04 + sx * 0.3 + sy * 0.7);
      ctx.globalAlpha = starAlpha * (0.4 + twinkle * 0.6);
      ctx.fillStyle = sz === 2 ? "#fffbe8" : "#d8e8ff";
      ctx.fillRect(sx, sy, sz, sz);
    }
    ctx.globalAlpha = 1;
  }

  // ── Moon — rises as sun sets ──────────────────────────────────────────────
  const moonAlpha = Math.max(0, (t - 0.35) / 0.4);
  if(moonAlpha > 0.01) {
    const moonRise = Math.min(1, (t - 0.35) / 0.65);
    const moonY = H * 0.62 - moonRise * H * 0.48;
    const moonX = W * 0.82;
    const moonR = 10;
    // Glow
    for(let dy = -(moonR+5); dy <= moonR+5; dy += 2) {
      const hw = Math.round(Math.sqrt(Math.max(0,(moonR+5)*(moonR+5)-dy*dy))/2)*2;
      if(hw>0){ctx.globalAlpha=moonAlpha*0.1;ctx.fillStyle="#c8d8ff";ctx.fillRect(moonX-hw,moonY+dy,hw*2,2);}
    }
    // Body
    ctx.globalAlpha = moonAlpha * 0.92;
    ctx.fillStyle = "#e8f0ff";
    for(let dy = -moonR; dy <= moonR; dy += 2) {
      const hw = Math.round(Math.sqrt(Math.max(0,moonR*moonR-dy*dy))/2)*2;
      if(hw>0) ctx.fillRect(moonX-hw, moonY+dy, hw*2, 2);
    }
    // Crescent shadow
    ctx.fillStyle = lerpColor("#1a0a3a","#020510",Math.max(0,t-0.5)*2);
    for(let dy = -moonR; dy <= moonR; dy += 2) {
      const hw = Math.round(Math.sqrt(Math.max(0,moonR*moonR-dy*dy))/2)*2;
      if(hw>0) ctx.fillRect(moonX-hw+4, moonY+dy, hw*2, 2);
    }
    ctx.globalAlpha = 1;
  }

  // ── Sun — starts above horizon, slowly sinks ─────────────────────────────
  const sunSink = Math.min(1, t * 1.6);
  const sunY = H * 0.56 + sunSink * H * 0.24;
  const sunVisible = sunY < H * 0.74;
  if(sunVisible) {
    const sunFrac = 1 - sunSink;
    const sunR = 14 + sunFrac * 4;
    const sunCol = lerpColor("#ffee44", "#ff3300", Math.min(1, t * 2));
    // Horizon haze
    if(sunFrac * 0.35 > 0.01) {
      ctx.globalAlpha = sunFrac * 0.35;
      const hazeGrad = ctx.createLinearGradient(0, H*0.60, 0, H*0.74);
      hazeGrad.addColorStop(0, "rgba(255,120,40,0)");
      hazeGrad.addColorStop(0.5, "rgba(255,80,20,0.6)");
      hazeGrad.addColorStop(1, "rgba(255,60,10,0)");
      ctx.fillStyle = hazeGrad;
      ctx.fillRect(0, H*0.60, W, H*0.14);
      ctx.globalAlpha = 1;
    }
    // Glow rings
    for(let ring = 3; ring >= 1; ring--) {
      const gr = sunR * (1 + ring * 0.9);
      ctx.globalAlpha = sunFrac * (0.08 / ring);
      ctx.fillStyle = lerpColor("#ffcc44","#ff4400",t);
      for(let dy = -gr; dy <= gr; dy += 2) {
        const hw = Math.round(Math.sqrt(Math.max(0,gr*gr-dy*dy))/2)*2;
        if(hw>0) ctx.fillRect(W*0.68-hw, sunY+dy, hw*2, 2);
      }
    }
    ctx.globalAlpha = 1;
    // Sun body
    ctx.fillStyle = sunCol;
    for(let dy = -sunR; dy <= sunR; dy += 2) {
      const hw = Math.round(Math.sqrt(Math.max(0,sunR*sunR-dy*dy))/2)*2;
      if(hw>0) ctx.fillRect(W*0.68-hw, sunY+dy, hw*2, 2);
    }
    // Horizon spread
    ctx.globalAlpha = sunFrac * 0.28;
    const horizGrad = ctx.createLinearGradient(0, H*0.65, 0, H*0.73);
    horizGrad.addColorStop(0, lerpColor("#ff8800","#ff2200",t));
    horizGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = horizGrad;
    ctx.fillRect(0, H*0.65, W, H*0.08);
    ctx.globalAlpha = 1;
  }

  // ── Distant silhouette mountains ─────────────────────────────────────────
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = lerpColor("#2a1040","#0a0618",t);
  ctx.beginPath(); ctx.moveTo(0,H);
  for(const [mx,my] of [[0,0.66],[0.08,0.60],[0.18,0.64],[0.28,0.58],[0.38,0.62],[0.5,0.56],[0.62,0.60],[0.72,0.64],[0.82,0.58],[0.92,0.62],[1.0,0.66]])
    ctx.lineTo(mx*W, my*H);
  ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = lerpColor("#1a0830","#060410",t);
  ctx.beginPath(); ctx.moveTo(0,H);
  for(const [mx,my] of [[0,0.70],[0.06,0.65],[0.14,0.68],[0.22,0.63],[0.32,0.67],[0.42,0.61],[0.52,0.65],[0.64,0.62],[0.74,0.67],[0.84,0.63],[0.94,0.68],[1.0,0.70]])
    ctx.lineTo(mx*W, my*H);
  ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;

  // ── Ocean ─────────────────────────────────────────────────────────────────
  const sunFracOcean = Math.max(0, 1 - Math.min(1, t * 1.6));
  const oceanGrad = ctx.createLinearGradient(0, H*0.72, 0, H);
  oceanGrad.addColorStop(0, lerpColor(lerpColor("#1a3a7a","#cc5522",Math.min(1,sunFracOcean*2)),"#030a1a",t));
  oceanGrad.addColorStop(1, lerpColor("#0a1a4a","#020818",t));
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, H*0.72, W, H*0.28);
  // Light path on water
  const shimmerX = sunVisible ? W*0.68 : W*0.82;
  const shimmerCol = sunVisible ? lerpColor("#ffcc44","#ff6622",t) : lerpColor("#334488","#6688cc",Math.max(0,t-0.5)*2);
  const shimmerStr = sunVisible ? sunFracOcean*0.35 : moonAlpha*0.18;
  if(shimmerStr > 0.01) {
    for(let row = 0; row < 12; row++) {
      const ry = H*0.73 + row*6;
      const spread = 8 + row*14;
      const wave = Math.sin(frame*0.05 + row*0.8)*6;
      ctx.globalAlpha = shimmerStr*(1-row/14);
      ctx.fillStyle = shimmerCol;
      ctx.fillRect(shimmerX-spread/2+wave, ry, spread, 2);
    }
    ctx.globalAlpha = 1;
  }
  // Wave lines
  ctx.globalAlpha = 0.12 + Math.sin(frame*0.03)*0.04;
  ctx.fillStyle = lerpColor("#4466aa","#1a2244",t);
  for(let w = 0; w < 6; w++) {
    const wx = ((w*130 + frame*0.5) % (W+60)) - 30;
    const wy = H*0.745 + w*8 + Math.sin(frame*0.04+w)*2;
    ctx.fillRect(wx, wy, 50+w*10, 2);
  }
  ctx.globalAlpha = 1;

  // ── Island ground ─────────────────────────────────────────────────────────
  const nightFade = Math.max(0, t - 0.4) / 0.6;
  const iL = W*0.08, iR = W*0.50, iY = H*0.685, iW = iR - iL;
  const grassTop  = lerpColor("#3a7a20","#0e1e08",nightFade);
  const grassHi   = lerpColor("#5aaa2a","#182808",nightFade);
  const grassEdge = lerpColor("#2a5a18","#0a1606",nightFade);
  const dirtGrad  = ctx.createLinearGradient(0, iY+6, 0, H);
  dirtGrad.addColorStop(0, lerpColor("#6a4a22","#1e1208",nightFade));
  dirtGrad.addColorStop(1, lerpColor("#4a3018","#120c04",nightFade));
  ctx.fillStyle = dirtGrad;
  ctx.fillRect(iL, iY+6, iW, H-iY-6);
  ctx.fillStyle = grassTop;
  ctx.fillRect(iL, iY, iW, 8);
  ctx.fillStyle = grassHi;
  ctx.fillRect(iL+4, iY, iW-8, 3);
  ctx.fillStyle = grassEdge;
  for(let gx = iL; gx < iR; gx += 10) {
    const gh = 3 + Math.floor(Math.sin(gx*0.7)*2);
    ctx.fillRect(gx, iY-gh, 4, gh);
  }
  ctx.fillStyle = grassTop;
  ctx.fillRect(iL-8, iY+4, 12, 6);
  ctx.fillRect(iR-4, iY+4, 12, 6);
  // Rocks
  const rockCol = lerpColor("#4a4a5a","#1a1a22",nightFade);
  const rockHi  = lerpColor("#6a6a7a","#2a2a32",nightFade);
  ctx.fillStyle = rockCol;
  ctx.fillRect(W*0.40, iY-4, 10, 6); ctx.fillRect(W*0.42, iY-7, 6, 4);
  ctx.fillStyle = rockHi;
  ctx.fillRect(W*0.40, iY-4, 4, 2);
  ctx.fillStyle = rockCol;
  ctx.fillRect(W*0.22, iY+2, 4, 3); ctx.fillRect(W*0.25, iY+3, 3, 2);

  // ── Palm tree ─────────────────────────────────────────────────────────────
  const tx = W*0.36, ty = iY;
  const trunkCol = lerpColor("#6a3a12","#1e1006",nightFade);
  const trunkHi  = lerpColor("#8a5a22","#2a1a0a",nightFade);
  const trunkSeg = lerpColor("#5a3010","#180e04",nightFade);
  for(let seg = 0; seg < 7; seg++) {
    const sy = ty - seg*8, lean = seg*0.8;
    ctx.fillStyle = seg%2===0 ? trunkCol : trunkSeg;
    ctx.fillRect(tx+lean, sy-8, 6, 9);
    ctx.fillStyle = trunkHi;
    ctx.fillRect(tx+lean+1, sy-8, 2, 9);
  }
  const frondBase = { x: tx+5, y: ty-56 };
  const fronds = [
    {dx:-22,dy:-8, len:28,droop:0.6},{dx:-14,dy:-18,len:24,droop:0.3},
    {dx:2,  dy:-22,len:26,droop:0.2},{dx:16, dy:-16,len:24,droop:0.35},
    {dx:22, dy:-6, len:26,droop:0.55},
  ];
  const leafDark = lerpColor("#1a5010","#060e04",nightFade);
  const leafMid  = lerpColor("#2a7a18","#0a1806",nightFade);
  const leafHi   = lerpColor("#44aa22","#101e08",nightFade);
  for(const fr of fronds) {
    for(let s = 0; s < 6; s++) {
      const p = s/6;
      const fx = frondBase.x + fr.dx*p;
      const fy = frondBase.y + fr.dy*p + fr.droop*p*p*20;
      const fw = Math.max(1, 4-s);
      ctx.fillStyle = s<2 ? leafHi : s<4 ? leafMid : leafDark;
      ctx.fillRect(Math.round(fx), Math.round(fy), fw, 3);
    }
  }
  ctx.fillStyle = lerpColor("#3a2010","#0e0804",nightFade);
  ctx.fillRect(frondBase.x-2, frondBase.y+2, 5, 5);
  ctx.fillRect(frondBase.x+3, frondBase.y+4, 4, 4);

  // ── Fireflies ─────────────────────────────────────────────────────────────
  const ffAlpha = Math.max(0, (t-0.5)/0.4);
  if(ffAlpha > 0.01) {
    const ffs = [{x:W*0.15,y:iY-20,ph:0.0},{x:W*0.20,y:iY-35,ph:1.2},{x:W*0.28,y:iY-18,ph:2.4},{x:W*0.40,y:iY-28,ph:0.7},{x:W*0.44,y:iY-15,ph:1.9}];
    for(const ff of ffs) {
      const blink = Math.sin(frame*0.08+ff.ph)*0.5+0.5;
      const ffx = ff.x + Math.sin(frame*0.02+ff.ph)*8;
      const ffy = ff.y + Math.cos(frame*0.015+ff.ph)*5;
      ctx.globalAlpha = ffAlpha*blink*0.9;
      ctx.fillStyle = "#aaff44";
      ctx.fillRect(Math.round(ffx), Math.round(ffy), 2, 2);
      ctx.globalAlpha = ffAlpha*blink*0.3;
      ctx.fillStyle = "#ccff88";
      ctx.fillRect(Math.round(ffx)-1, Math.round(ffy)-1, 4, 4);
    }
    ctx.globalAlpha = 1;
  }

  // ── Campfire ──────────────────────────────────────────────────────────────
  const fireX = W*0.13, fireY = iY-2;
  const flicker = Math.sin(frame*0.18)*0.4+0.6;
  const fireNight = Math.max(0, (t-0.3)/0.5);
  if(fireNight > 0.01) {
    ctx.globalAlpha = fireNight*flicker*0.25;
    ctx.fillStyle = "#ff8822";
    ctx.fillRect(fireX-6, fireY-10, 14, 12);
    ctx.globalAlpha = fireNight*flicker;
    ctx.fillStyle = "#ff6600"; ctx.fillRect(fireX,   fireY-6, 4, 6);
    ctx.fillStyle = "#ffaa22"; ctx.fillRect(fireX+1, fireY-8, 2, 4);
    ctx.fillStyle = "#ffee88"; ctx.fillRect(fireX+1, fireY-9, 2, 2);
    ctx.fillStyle = "#ff4400"; ctx.fillRect(fireX-1, fireY,   6, 2);
    ctx.globalAlpha = 1;
  }

  // ── Dino sitting — gentle idle bob ────────────────────────────────────────
  const dinoX = W*0.17;
  const dinoY = iY - 46 + Math.sin(frame*0.022)*1.5;
  drawDino(ctx, dinoX, dinoY, 0, false, skin, design, false, false, false, false, 0, true, null);
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function EndingScreen({ skin, design, onMenu }) {
  const [phase, setPhase] = useState("credits");

  const onMenuRef  = useRef(onMenu);
  useEffect(() => { onMenuRef.current = onMenu; }, [onMenu]);

  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const phaseRef   = useRef("credits"); // drives the single loop without restarts

  // ── Skip credits → island ─────────────────────────────────────────────────
  const skipToIsland = useCallback(() => {
    if(phaseRef.current === "credits") {
      phaseRef.current = "island";
      setPhase("island");
    } else {
      // Skip island → go straight to menu
      onMenuRef.current();
    }
  }, []);

  // ── Single persistent loop — reads phaseRef to decide what to draw ────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");

    // ── Credits state ──────────────────────────────────────────────────────
    const lineHeight = 28;
    const startY = CANVAS_H + 40;
    const positions = [];
    let y = startY;
    for(const line of LINES) {
      positions.push({ text: line.text, y });
      y += lineHeight + (line.gap ? line.gap * 0.18 : 0);
    }
    const scrollToFinish = y;
    let scroll = 0;
    let fadeIn = 0;

    // ── Island state ───────────────────────────────────────────────────────
    let frame    = 0;
    let islandFadeIn = 0;

    let alive = true;

    const loop = () => {
      if(!alive) return;

      if(phaseRef.current === "credits") {
        // ── Draw credits ────────────────────────────────────────────────
        scroll += 0.55;
        fadeIn = Math.min(1, fadeIn + 0.012);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.textAlign = "center";

        for(let i = 0; i < positions.length; i++) {
          const py = positions[i].y - scroll;
          if(py < -40 || py > CANVAS_H + 40) continue;
          const text = positions[i].text;
          if(!text) continue;

          const isTitle   = text === "DINO REIMAGINED";
          const isHate    = text === "with hate";
          const isAuthor  = text === "Made by Hasim";
          const isDivider = text.startsWith("───");
          const isSpecial = text === "just keep moving." || text === "And that's okay.";

          const edgeFade = Math.min(1, Math.min(py + 40, CANVAS_H - py + 40) / 40);
          ctx.globalAlpha = fadeIn * Math.max(0, edgeFade);

          if(isTitle)       { ctx.font = "bold 16px 'Courier New'"; ctx.fillStyle = "#ffffff"; }
          else if(isAuthor) { ctx.font = "bold 12px 'Courier New'"; ctx.fillStyle = "#cccccc"; }
          else if(isHate)   { ctx.font = "italic 11px 'Courier New'"; ctx.fillStyle = "#886644"; }
          else if(isDivider){ ctx.font = "10px 'Courier New'"; ctx.fillStyle = "#333333"; }
          else if(isSpecial){ ctx.font = "bold 13px 'Courier New'"; ctx.fillStyle = "#dddddd"; }
          else              { ctx.font = "11px 'Courier New'"; ctx.fillStyle = "#888888"; }

          ctx.fillText(text, CANVAS_W / 2, py);
          ctx.globalAlpha = 1;
        }

        // Top/bottom fade masks
        const topGrad = ctx.createLinearGradient(0, 0, 0, 50);
        topGrad.addColorStop(0, "#000000"); topGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = topGrad; ctx.fillRect(0, 0, CANVAS_W, 50);
        const botGrad = ctx.createLinearGradient(0, CANVAS_H - 50, 0, CANVAS_H);
        botGrad.addColorStop(0, "rgba(0,0,0,0)"); botGrad.addColorStop(1, "#000000");
        ctx.fillStyle = botGrad; ctx.fillRect(0, CANVAS_H - 50, CANVAS_W, 50);
        ctx.textAlign = "left"; // reset after credits

        // Auto-advance when all lines scrolled off
        if(scroll >= scrollToFinish) {
          phaseRef.current = "island";
          setPhase("island");
        }

      } else {
        // ── Draw island ─────────────────────────────────────────────────
        frame++;
        islandFadeIn = Math.min(1, islandFadeIn + 0.018);

        drawIsland(ctx, frame, skin, design);

        // Fade in from black
        if(islandFadeIn < 1) {
          ctx.globalAlpha = 1 - islandFadeIn;
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
          ctx.globalAlpha = 1;
        }

        // Fade out and return to menu
        if(frame >= ISLAND_FADEOUT_START) {
          const ft = Math.min(1, (frame - ISLAND_FADEOUT_START) / (ISLAND_FADEOUT_END - ISLAND_FADEOUT_START));
          ctx.globalAlpha = ft;
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
          ctx.globalAlpha = 1;
          if(frame >= ISLAND_FADEOUT_END) {
            alive = false;
            onMenuRef.current();
            return;
          }
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      alive = false;
      if(animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs once — phaseRef drives transitions internally

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ position: "relative", width: "100%", maxWidth: CANVAS_W }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ display: "block", width: "100%" }}
        />

        {(phase === "credits" || phase === "island") && (
          <button
            onClick={skipToIsland}
            style={{
              position: "absolute",
              bottom: 14,
              right: 14,
              background: "transparent",
              border: "1px solid #333",
              color: "#444",
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              letterSpacing: 2,
              padding: "5px 10px",
              cursor: "pointer",
              userSelect: "none",
            }}
            onMouseEnter={e => { e.target.style.color = "#888"; e.target.style.borderColor = "#666"; }}
            onMouseLeave={e => { e.target.style.color = "#444"; e.target.style.borderColor = "#333"; }}
          >
            {phase === "credits" ? "SKIP ▶" : "SKIP ▶▶"}
          </button>
        )}
      </div>
    </div>
  );
}
