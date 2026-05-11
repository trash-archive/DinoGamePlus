// ─── BOSS MUSIC ───────────────────────────────────────────────────────────────
// Procedural Web Audio soundtrack — dark, pulsing, escalates per phase.
// Call startBossMusic() when the fight begins, stopBossMusic() when it ends.
// setPhase(0|1|2) to escalate intensity.

import { getSoundMuted, getSfxVolume } from "./useSoundEffects";

let _ctx   = null;
let _nodes = [];   // all running nodes so we can stop them cleanly
let _phase = 0;
let _running = false;
let _masterGain = null;

function getAudioCtx() {
  if(!_ctx || _ctx.state === "closed") _ctx = new AudioContext();
  return _ctx;
}

function scheduleNote(ctx, masterGain, freq, type, startTime, duration, vol = 0.18) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(masterGain);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
  gain.gain.setValueAtTime(vol, startTime + duration - 0.02);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
  _nodes.push(osc);
  return osc;
}

// ─── PATTERN DEFINITIONS ──────────────────────────────────────────────────────
// Each phase has: bpm, bass pattern, melody pattern, pulse pattern
const PHASES = [
  {
    // Phase 0 — tense, slow, ominous
    bpm: 80,
    bass: [
      // [beat, freq, dur, vol]
      [0, 55,  0.4, 0.28], [1, 55,  0.2, 0.18], [2, 49,  0.4, 0.24], [3, 52,  0.3, 0.20],
      [4, 55,  0.4, 0.28], [5, 55,  0.2, 0.18], [6, 44,  0.5, 0.26], [7, 44,  0.3, 0.20],
    ],
    melody: [
      [0,   220, 0.3, 0.10], [1.5, 196, 0.2, 0.08], [3,   208, 0.3, 0.10],
      [4.5, 185, 0.4, 0.09], [6,   220, 0.2, 0.10], [7,   196, 0.3, 0.08],
    ],
    pulse: [
      [0, 110, 0.15, 0.14], [2, 110, 0.15, 0.12], [4, 110, 0.15, 0.14], [6, 110, 0.15, 0.12],
    ],
    bars: 2,
  },
  {
    // Phase 1 — faster, more aggressive
    bpm: 110,
    bass: [
      [0, 55,  0.3, 0.30], [0.5, 55, 0.15, 0.20], [1, 49,  0.3, 0.26], [1.5, 52, 0.15, 0.18],
      [2, 55,  0.3, 0.30], [2.5, 55, 0.15, 0.20], [3, 44,  0.4, 0.28], [3.5, 44, 0.15, 0.18],
      [4, 55,  0.3, 0.30], [4.5, 58, 0.15, 0.22], [5, 49,  0.3, 0.26], [5.5, 52, 0.15, 0.18],
      [6, 44,  0.4, 0.28], [6.5, 44, 0.15, 0.20], [7, 41,  0.5, 0.30], [7.5, 41, 0.15, 0.18],
    ],
    melody: [
      [0,   330, 0.2, 0.12], [0.5, 294, 0.15, 0.09], [1,   311, 0.2, 0.11],
      [2,   277, 0.3, 0.10], [3,   330, 0.2, 0.12], [3.5, 311, 0.15, 0.09],
      [4,   349, 0.2, 0.12], [5,   330, 0.2, 0.11], [6,   294, 0.3, 0.10],
      [7,   277, 0.4, 0.12],
    ],
    pulse: [
      [0, 110, 0.1, 0.16], [1, 110, 0.1, 0.14], [2, 110, 0.1, 0.16], [3, 110, 0.1, 0.14],
      [4, 110, 0.1, 0.16], [5, 110, 0.1, 0.14], [6, 110, 0.1, 0.16], [7, 110, 0.1, 0.14],
    ],
    bars: 2,
  },
  {
    // Phase 2 — frantic, chaotic, relentless
    bpm: 145,
    bass: [
      [0,   55,  0.2, 0.32], [0.25, 55, 0.1, 0.22], [0.5, 49, 0.2, 0.28], [0.75, 52, 0.1, 0.20],
      [1,   55,  0.2, 0.32], [1.25, 58, 0.1, 0.24], [1.5, 44, 0.2, 0.30], [1.75, 44, 0.1, 0.20],
      [2,   55,  0.2, 0.32], [2.25, 55, 0.1, 0.22], [2.5, 49, 0.2, 0.28], [2.75, 52, 0.1, 0.20],
      [3,   41,  0.3, 0.34], [3.25, 41, 0.1, 0.22], [3.5, 37, 0.2, 0.30], [3.75, 37, 0.1, 0.20],
    ],
    melody: [
      [0,   440, 0.15, 0.13], [0.25, 392, 0.1, 0.10], [0.5, 415, 0.15, 0.12],
      [1,   370, 0.2,  0.11], [1.5, 440, 0.15, 0.13], [1.75, 415, 0.1, 0.10],
      [2,   466, 0.15, 0.13], [2.5, 440, 0.15, 0.12], [3,   392, 0.2, 0.11],
      [3.5, 370, 0.25, 0.13],
    ],
    pulse: [
      [0,    110, 0.08, 0.18], [0.5,  110, 0.08, 0.16],
      [1,    110, 0.08, 0.18], [1.5,  110, 0.08, 0.16],
      [2,    110, 0.08, 0.18], [2.5,  110, 0.08, 0.16],
      [3,    110, 0.08, 0.18], [3.5,  110, 0.08, 0.16],
    ],
    bars: 1,
  },
];

// ─── LOOP SCHEDULER ───────────────────────────────────────────────────────────
let _loopTimeout = null;

function scheduleLoop(ctx, masterGain, startTime) {
  if(!_running) return;

  const p    = PHASES[_phase];
  const beat = 60 / p.bpm;
  const barLen = beat * 8; // 8 beats per bar
  const loopLen = barLen * p.bars;

  // Bass — sawtooth
  for(const [b, freq, dur, vol] of p.bass) {
    scheduleNote(ctx, masterGain, freq, "sawtooth", startTime + b * beat, dur * beat, vol);
  }

  // Melody — square wave, one octave up
  for(const [b, freq, dur, vol] of p.melody) {
    scheduleNote(ctx, masterGain, freq, "square", startTime + b * beat, dur * beat, vol);
  }

  // Pulse — triangle sub-kick feel
  for(const [b, freq, dur, vol] of p.pulse) {
    scheduleNote(ctx, masterGain, freq, "triangle", startTime + b * beat, dur * beat, vol);
    // Add a tiny pitch drop for kick feel
    const osc2 = ctx.createOscillator();
    const g2   = ctx.createGain();
    osc2.connect(g2); g2.connect(masterGain);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2, startTime + b * beat);
    osc2.frequency.exponentialRampToValueAtTime(freq * 0.5, startTime + b * beat + 0.08);
    g2.gain.setValueAtTime(vol * 0.6, startTime + b * beat);
    g2.gain.exponentialRampToValueAtTime(0.001, startTime + b * beat + 0.12);
    osc2.start(startTime + b * beat);
    osc2.stop(startTime + b * beat + 0.13);
    _nodes.push(osc2);
  }

  // Schedule next loop slightly before this one ends to avoid gaps
  const nextStart = startTime + loopLen;
  const delay = (nextStart - ctx.currentTime - 0.1) * 1000;
  _loopTimeout = setTimeout(() => scheduleLoop(ctx, masterGain, nextStart), Math.max(0, delay));
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
export function startBossMusic() {
  if(_running) return;
  if(getSoundMuted()) return;
  _running = true;
  _phase   = 0;

  try {
    const ctx = getAudioCtx();
    const resume = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
    resume.then(() => {
      if(!_running) return;
      _masterGain = ctx.createGain();
      _masterGain.gain.value = Math.min(0.9, getSfxVolume() * 1.1);
      _masterGain.connect(ctx.destination);
      scheduleLoop(ctx, _masterGain, ctx.currentTime + 0.05);
    });
  } catch(_) {}
}

export function stopBossMusic() {
  _running = false;
  if(_loopTimeout) { clearTimeout(_loopTimeout); _loopTimeout = null; }
  // Fade out master gain then stop all nodes
  if(_masterGain) {
    try {
      _masterGain.gain.setValueAtTime(_masterGain.gain.value, _ctx.currentTime);
      _masterGain.gain.linearRampToValueAtTime(0, _ctx.currentTime + 0.4);
    } catch(_) {}
  }
  setTimeout(() => {
    for(const n of _nodes) { try { n.stop(); } catch(_) {} }
    _nodes = [];
    _masterGain = null;
  }, 450);
}

export function setBossMusicPhase(phase) {
  _phase = Math.max(0, Math.min(2, phase));
}
