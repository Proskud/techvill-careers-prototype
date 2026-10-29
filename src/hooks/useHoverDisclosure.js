import { useEffect, useRef, useState } from "react";
import { serviceValueHoverQuery } from "../data/service-value-behavior.mjs";

// Shared card disclosure: on wide fine-pointer layouts (`serviceValueHoverQuery`) one card opens on hover (90ms intent
// delay) or keyboard focus and closes on leave, Escape or an outside press; elsewhere the Radix accordion button
// toggles cards normally. Pair it with `<Accordion value={expanded} onValueChange={onValueChange}>`, the
// `disclosure-grid`/`disclosure-card` classes and `<AccordionContent variant="disclosure">`.
export function useHoverDisclosure() {
  const [hoverMode, setHoverMode] = useState(() => typeof window !== "undefined" && window.matchMedia(serviceValueHoverQuery).matches);
  const [expanded, setExpanded] = useState([]);
  const closeTimer = useRef(null);
  const openTimer = useRef(null);
  useEffect(() => {
    const query = window.matchMedia(serviceValueHoverQuery);
    const sync = () => { setHoverMode(query.matches); setExpanded([]); };
    query.addEventListener("change", sync);
    return () => { query.removeEventListener("change", sync); clearTimeout(closeTimer.current); clearTimeout(openTimer.current); };
  }, []);
  useEffect(() => {
    if (!hoverMode || !expanded.length) return undefined;
    const onKey = (event) => { if (event.key === "Escape") setExpanded([]); };
    const onPointer = (event) => { if (!event.target.closest?.(".disclosure-card[data-state='open']")) setExpanded([]); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, [hoverMode, expanded]);
  const openCard = (id) => { clearTimeout(closeTimer.current); clearTimeout(openTimer.current); setExpanded([id]); };
  const closeCard = (id) => setExpanded((current) => current.filter((value) => value !== id));
  const itemProps = (id, enabled = true) => (!hoverMode || !enabled) ? {} : {
    // A short intent delay keeps a pointer that merely crosses the grid from flashing panels open.
    onPointerEnter: (event) => {
      if (event.pointerType !== "mouse") return;
      clearTimeout(closeTimer.current);
      clearTimeout(openTimer.current);
      openTimer.current = setTimeout(() => openCard(id), 90);
    },
    onPointerLeave: (event) => {
      const card = event.currentTarget;
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => { if (!card.querySelector(":focus-visible")) closeCard(id); }, 120);
    },
    onFocus: (event) => { if (event.target.matches(":focus-visible")) openCard(id); },
    onBlur: (event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeCard(id); },
  };
  const onValueChange = (next) => setExpanded(hoverMode ? next.slice(-1) : next);
  return { hoverMode, expanded, onValueChange, itemProps };
}
