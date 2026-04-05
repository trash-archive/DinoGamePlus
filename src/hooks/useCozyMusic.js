import { useEffect, useRef, useState } from "react";

export default function useCozyMusic(paused = false) {
  const audioRef   = useRef(null);
  const startedRef = useRef(false);
  const [blocked, setBlocked] = useState(false);
  const [muted, setMutedState] = useState(() => localStorage.getItem("dino_music_muted") === "true");
  const [volume, setVolumeState] = useState(() => parseFloat(localStorage.getItem("dino_music_volume") ?? "0.5"));

  useEffect(() => {
    const isMuted = localStorage.getItem("dino_music_muted") === "true";
    const vol     = parseFloat(localStorage.getItem("dino_music_volume") ?? "0.5");
    const audio = new Audio("/The Adventure Begins 8-bit remix.ogg");
    audio.loop   = true;
    audio.volume = isMuted ? 0 : vol;
    audioRef.current = audio;

    audio.play().then(() => {
      startedRef.current = true;
    }).catch(() => {
      setBlocked(true);
    });

    const tryPlay = () => {
      if (startedRef.current) return;
      audio.play().then(() => {
        startedRef.current = true;
        setBlocked(false);
      }).catch(() => {});
    };

    window.addEventListener("keydown",     tryPlay);
    window.addEventListener("pointerdown", tryPlay);

    return () => {
      window.removeEventListener("keydown",     tryPlay);
      window.removeEventListener("pointerdown", tryPlay);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Pause music during gameplay, resume on menu/other screens
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (paused) {
      audio.pause();
    } else if (startedRef.current) {
      audio.play().catch(() => {});
    }
  }, [paused]);

  const setMuted = (val) => {
    setMutedState(val);
    localStorage.setItem("dino_music_muted", String(val));
    if (audioRef.current) audioRef.current.volume = val ? 0 : volume;
  };

  const setVolume = (val) => {
    setVolumeState(val);
    localStorage.setItem("dino_music_volume", String(val));
    if (audioRef.current && !muted) audioRef.current.volume = val;
  };

  return { blocked, muted, setMuted, volume, setVolume };
}
