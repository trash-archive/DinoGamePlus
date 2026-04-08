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
