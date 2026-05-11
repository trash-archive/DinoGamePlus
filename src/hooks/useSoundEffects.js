import { useRef } from "react";

let _soundMuted = localStorage.getItem("dino_sound_muted") === "true";
let _sfxVolume  = parseFloat(localStorage.getItem("dino_sfx_volume") ?? "0.5");

export function getSoundMuted()  { return _soundMuted; }
export function setSoundMuted(val) {
  _soundMuted = val;
  localStorage.setItem("dino_sound_muted", String(val));
}
export function getSfxVolume()   { return _sfxVolume; }
export function setSfxVolume(val) {
  _sfxVolume = val;
  localStorage.setItem("dino_sfx_volume", String(val));
}

export function playClick() {
  synth((osc, gain, ctx) => {
    osc.type = "square";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.start(); osc.stop(ctx.currentTime + 0.06);
  });
}

let _sharedCtx = null;
function getCtx() {
  if (!_sharedCtx || _sharedCtx.state === "closed") {
    _sharedCtx = new AudioContext();
  }
  return _sharedCtx;
}

function synth(fn) {
  if (_soundMuted) return;
  try {
    const ctx  = getCtx();
    const resume = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
    resume.then(() => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const vol  = ctx.createGain();
      osc.connect(gain);
      gain.connect(vol);
      vol.connect(ctx.destination);
      vol.gain.value = _sfxVolume;
      fn(osc, gain, ctx);
    });
  } catch(_) {}
}

export function playDashForward() {
  synth((osc, gain, ctx) => {
    osc.type = "square";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.13);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
    osc.start(); osc.stop(ctx.currentTime + 0.13);
  });
}

export function playDashBack() {
  synth((osc, gain, ctx) => {
    osc.type = "square";
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.13);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
    osc.start(); osc.stop(ctx.currentTime + 0.13);
  });
}

export function playFastDrop() {
  synth((osc, gain, ctx) => {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  });
}

export function playDuckSlide() {
  synth((osc, gain, ctx) => {
    osc.type = "square";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start(); osc.stop(ctx.currentTime + 0.18);
  });
}

export function playBite() {
  synth((osc, gain, ctx) => {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(); osc.stop(ctx.currentTime + 0.12);
  });
}

// ─── BOSS ATTACK SOUNDS ───────────────────────────────────────────────────────
export function playWaveLow() {
  synth((osc, gain, ctx) => {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(); osc.stop(ctx.currentTime + 0.25);
  });
}

export function playWaveHigh() {
  synth((osc, gain, ctx) => {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.start(); osc.stop(ctx.currentTime + 0.22);
  });
}

export function playAimedShot() {
  synth((osc, gain, ctx) => {
    osc.type = "square";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(); osc.stop(ctx.currentTime + 0.08);
  });
}

export function playGroundSlam() {
  synth((osc, gain, ctx) => {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.32, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  });
}

export function playCeilingDrop() {
  synth((osc, gain, ctx) => {
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  });
}

export function playVoidOrb() {
  synth((osc, gain, ctx) => {
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.setValueAtTime(280, ctx.currentTime + 0.05);
    osc.frequency.setValueAtTime(200, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.24, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(); osc.stop(ctx.currentTime + 0.35);
  });
}

export function playTentacle() {
  synth((osc, gain, ctx) => {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.26, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start(); osc.stop(ctx.currentTime + 0.18);
  });
}

export function playGroundPound() {
  synth((osc, gain, ctx) => {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(50, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(); osc.stop(ctx.currentTime + 0.35);
  });
}

export function playVoidBurst() {
  synth((osc, gain, ctx) => {
    osc.type = "square";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  });
}

export function playTrackingBeam() {
  synth((osc, gain, ctx) => {
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.setValueAtTime(680, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(640, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  });
}

export function playSpikeRain() {
  synth((osc, gain, ctx) => {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(); osc.stop(ctx.currentTime + 0.5);
  });
}

export function playBossHit() {
  // Meaty thud + high crack
  synth((osc, gain, ctx) => {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
  });
  synth((osc, gain, ctx) => {
    osc.type = "square";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(); osc.stop(ctx.currentTime + 0.08);
  });
}

export function playPhaseTransition() {
  // Layer 1: deep sub-bass roar building up
  synth((osc, gain, ctx) => {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(40, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(55, ctx.currentTime + 0.7);
    osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 1.4);
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    osc.start(); osc.stop(ctx.currentTime + 1.4);
  });
  // Layer 2: mid screech — the "voice" of the monster
  synth((osc, gain, ctx) => {
    osc.type = "square";
    osc.frequency.setValueAtTime(180, ctx.currentTime + 0.05);
    osc.frequency.linearRampToValueAtTime(340, ctx.currentTime + 0.25);
    osc.frequency.linearRampToValueAtTime(260, ctx.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(420, ctx.currentTime + 0.75);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.3);
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);
    osc.start(); osc.stop(ctx.currentTime + 1.3);
  });
  // Layer 3: high harmonic shriek on top
  synth((osc, gain, ctx) => {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(900, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 1.0);
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
    osc.start(); osc.stop(ctx.currentTime + 1.0);
  });
  // Layer 4: distorted growl wobble
  synth((osc, gain, ctx) => {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(95, ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(110, ctx.currentTime + 0.3);
    osc.frequency.setValueAtTime(85, ctx.currentTime + 0.45);
    osc.frequency.setValueAtTime(120, ctx.currentTime + 0.6);
    osc.frequency.setValueAtTime(75, ctx.currentTime + 0.75);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.2);
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start(); osc.stop(ctx.currentTime + 1.2);
  });
}

export function playBossDeath() {
  // Layer 1: massive sub-bass collapse
  synth((osc, gain, ctx) => {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.2);
    osc.frequency.exponentialRampToValueAtTime(18, ctx.currentTime + 2.0);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
    osc.start(); osc.stop(ctx.currentTime + 2.0);
  });
  // Layer 2: agonised mid scream that breaks apart
  synth((osc, gain, ctx) => {
    osc.type = "square";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(480, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(380, ctx.currentTime + 0.35);
    osc.frequency.linearRampToValueAtTime(560, ctx.currentTime + 0.55);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.9);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 1.8);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
    osc.start(); osc.stop(ctx.currentTime + 1.8);
  });
  // Layer 3: high-pitched dying wail
  synth((osc, gain, ctx) => {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.5);
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.start(); osc.stop(ctx.currentTime + 1.5);
  });
  // Layer 4: crackling noise burst at the start
  synth((osc, gain, ctx) => {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(); osc.stop(ctx.currentTime + 0.25);
  });
  // Layer 5: low rumble tail that fades out slowly
  synth((osc, gain, ctx) => {
    osc.type = "sine";
    osc.frequency.setValueAtTime(55, ctx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 2.2);
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
    osc.start(); osc.stop(ctx.currentTime + 2.2);
  });
}

export function playTeleport() {
  synth((osc, gain, ctx) => {
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  });
}

export default function useSoundEffects() {
  const sfx = useRef({});

  const play = (name, ext = "wav") => {
    if (_soundMuted) return;
    if (!sfx.current[name]) {
      sfx.current[name] = new Audio(`/${name}.${ext}`);
      sfx.current[name].volume = 0.5;
    }
    const audio = sfx.current[name];
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  return {
    playJump:  () => play("jump"),
    playPoint: () => play("point"),
    playDie:   () => play("die"),
  };
}
