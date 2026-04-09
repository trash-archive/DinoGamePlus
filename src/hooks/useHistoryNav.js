import { useEffect, useRef, useState } from "react";

/**
 * Syncs React screen state with the browser history stack so the system
 * back button navigates between game screens instead of leaving the app.
 *
 * @param {string}   screen     - current screen name
 * @param {Function} setScreen  - React state setter for screen
 * @param {string[]} noBackScreens - screens where back should be a no-op
 *                                   (re-pushes to trap the user in the app)
 */
export default function useHistoryNav(screen, setScreen, noBackScreens = ["menu"]) {
  const stackRef = useRef([]);
  const exitWarningRef = useRef(false);
  const exitTimerRef = useRef(null);
  const [exitWarning, setExitWarning] = useState(false);

  // Push a new history entry whenever the screen changes
  useEffect(() => {
    history.pushState({ screen }, "", window.location.href);
    // Reset exit warning whenever screen changes
    exitWarningRef.current = false;
    clearTimeout(exitTimerRef.current);
    setExitWarning(false);
  }, [screen]);

  // Handle the system back button
  useEffect(() => {
    const onPopState = (e) => {
      const prev = stackRef.current.pop();

      if (!prev || noBackScreens.includes(screen)) {
        if (noBackScreens.includes(screen)) {
          if (exitWarningRef.current) {
            // Second press within window — let the browser exit naturally
            exitWarningRef.current = false;
            clearTimeout(exitTimerRef.current);
            setExitWarning(false);
            return;
          }
          // First press — warn and re-push
          exitWarningRef.current = true;
          setExitWarning(true);
          exitTimerRef.current = setTimeout(() => {
            exitWarningRef.current = false;
            setExitWarning(false);
          }, 2000);
        }
        history.pushState({ screen }, "", window.location.href);
        return;
      }

      setScreen(prev);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [screen, setScreen, noBackScreens]);

  // Track the outgoing screen before each transition
  const navigate = (nextScreen) => {
    stackRef.current.push(screen);
    setScreen(nextScreen);
  };

  return { navigate, exitWarning };
}
