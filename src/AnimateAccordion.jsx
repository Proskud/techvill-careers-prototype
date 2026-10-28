// Adapted to Techvill's CSS and Phosphor icons from Animate UI's Radix accordion:
// https://github.com/imskyleen/animate-ui/blob/main/apps/www/registry/primitives/radix/accordion/index.tsx
// Radix owns disclosure semantics and keyboard navigation; Motion owns height/mask transitions.
import { createContext, useCallback, useContext, useRef } from "react";
import * as Radix from "@radix-ui/react-accordion";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "./hooks/useReducedMotion.js";

const ValueContext = createContext([]);
const ItemContext = createContext(false);
export function Accordion({ value, onValueChange, children, ...props }) {
  return <ValueContext.Provider value={value}><Radix.Root type="multiple" value={value} onValueChange={onValueChange} {...props}>{children}</Radix.Root></ValueContext.Provider>;
}
export function AccordionItem({ value, children, ...props }) {
  const values = useContext(ValueContext);
  return <ItemContext.Provider value={values.includes(value)}><Radix.Item value={value} {...props}>{children}</Radix.Item></ItemContext.Provider>;
}
// `heading={false}` keeps the trigger out of the heading outline when the card already has its own title.
export function AccordionTrigger({ heading = true, ...props }) {
  if (!heading) return <Radix.Header asChild><div className="tech-map-accordion-heading"><Radix.Trigger {...props} /></div></Radix.Header>;
  return <Radix.Header className="tech-map-accordion-heading"><Radix.Trigger {...props} /></Radix.Header>;
}
// Disclosure motion after Motion Primitives (motion-primitives.com/docs/disclosure): the content's height and opacity
// animate together inside the card, so the card itself grows. A zero-bounce spring keeps the growth soft.
const disclosureVariants = { collapsed: { height: 0, opacity: 0 }, expanded: { height: "auto", opacity: 1 } };
const disclosureTransition = { height: { type: "spring", bounce: 0, duration: 0.5 }, opacity: { duration: 0.3, ease: "easeOut" } };
// `--drawer-h` mirrors the live content height every frame; CSS can cancel it with a negative margin so the card
// overlaps the next row instead of growing its own grid row.
function trackHeight(element) {
  const card = element?.closest(".tech-card");
  if (!card) return undefined;
  const observer = new ResizeObserver(() => card.style.setProperty("--drawer-h", `${element.offsetHeight}px`));
  observer.observe(element);
  return () => { observer.disconnect(); card.style.removeProperty("--drawer-h"); };
}
// Radix's asChild slot hands this body its region id/role/aria attributes and ref; forward them to the motion element.
function DisclosureBody({ children, reduced, ref: slotRef, style, ...props }) {
  const cleanup = useRef(null);
  const ref = useCallback((element) => {
    cleanup.current?.();
    cleanup.current = element ? trackHeight(element) : null;
    if (typeof slotRef === "function") slotRef(element);
    else if (slotRef) slotRef.current = element;
  }, [slotRef]);
  return <motion.div {...props} ref={ref} className="tech-map-accordion-content" variants={disclosureVariants} initial={reduced ? false : "collapsed"} animate="expanded" exit="collapsed" transition={reduced ? { duration: 0 } : disclosureTransition} style={{ ...style, overflow: "hidden" }}>{children}</motion.div>;
}
export function AccordionContent({ children, variant }) {
  const open = useContext(ItemContext);
  const reduced = useReducedMotion();
  if (variant === "disclosure") {
    return <AnimatePresence initial={false}>{open && <Radix.Content forceMount asChild><DisclosureBody reduced={reduced}>{children}</DisclosureBody></Radix.Content>}</AnimatePresence>;
  }
  return <AnimatePresence initial={false}>{open && <Radix.Content forceMount asChild><motion.div className="tech-map-accordion-content" initial={reduced ? false : { height: 0, opacity: 0, "--mask-stop": "0%", y: 20 }} animate={{ height: "auto", opacity: 1, "--mask-stop": "100%", y: 0 }} exit={{ height: 0, opacity: 0, "--mask-stop": "0%", y: reduced ? 0 : 20 }} transition={reduced ? { duration: 0 } : { duration: .35, ease: "easeInOut" }} style={{ overflow: "hidden", maskImage: "linear-gradient(black var(--mask-stop), transparent var(--mask-stop))", WebkitMaskImage: "linear-gradient(black var(--mask-stop), transparent var(--mask-stop))" }} inert={!open ? true : undefined}>{children}</motion.div></Radix.Content>}</AnimatePresence>;
}
