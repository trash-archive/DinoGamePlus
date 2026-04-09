import { useEffect } from "react";

/**
 * Pushes a history entry when `open` becomes true so the system back button
 * closes the modal instead of navigating away.
 *
 * @param {boolean}  open     - whether the modal is currently open
 * @param {Function} onClose  - callback to close the modal
 */
export default function useModalBack(open, onClose) {
  useEffect(() => {
    if (!open) return;
    history.pushState({ modal: true }, "");
    const onPopState = (e) => { e.stopImmediatePropagation(); onClose(); };
    window.addEventListener("popstate", onPopState, true);
    return () => window.removeEventListener("popstate", onPopState, true);
  }, [open, onClose]);
}
