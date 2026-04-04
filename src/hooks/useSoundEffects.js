import { useRef } from "react";

let _soundMuted = localStorage.getItem("dino_sound_muted") === "true";

export function getSoundMuted() { return _soundMuted; }
export function setSoundMuted(val) {
  _soundMuted = val;
  localStorage.setItem("dino_sound_muted", String(val));
}

const _sfx = {};
export function playClick() {
  if (_soundMuted) return;
  if (!_sfx.click) {
    _sfx.click = new Audio("/button-click.mp3");
    _sfx.click.volume = 0.6;
  }
  _sfx.click.currentTime = 0;
  _sfx.click.play().catch(() => {});
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
