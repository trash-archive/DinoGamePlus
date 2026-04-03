import { useEffect, useRef, useState } from "react";

export default function useCozyMusic() {
  const audioRef   = useRef(null);
  const startedRef = useRef(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const audio = new Audio("/The Adventure Begins 8-bit remix.ogg");
    audio.loop   = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    // Try autoplay immediately
    audio.play().then(() => {
      startedRef.current = true;
    }).catch(() => {
      // Browser blocked it — show prompt
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

  return blocked;
}
