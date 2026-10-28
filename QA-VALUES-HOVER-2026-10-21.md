# Values hover / tap — 21 October 2026

Scope: only the three service-value cards on /services. React, native details/summary, existing AI card surfaces, CSS and Motion. better-layout and its grouping/adaptivity references applied; AGENTS.md updated. Copy, AI page and shared footer unchanged.

## Findings

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| LOW — fixed | src/services.css:42; src/ServicesPage.jsx:46 | Full «Подробнее/Свернуть» row on every device | Above existing 760px boundary with hover/fine pointer: compact heading chevron, no More row, hover/focus disclosure; narrow and coarse-pointer layouts retain explicit tap controls | Requested density and progressive disclosure, without hiding continuation completely |
| MEDIUM — prevented | src/data/service-value-behavior.mjs:3 | Hover-only replacement could exclude touch/keyboard or close text during reading | Keep native disclosure; focus opens; pointer departure keeps keyboard-focused content; Escape suppresses focus-triggered reopening; native touch clicks remain intact | Same full content stays reachable through each input method |

Independent make-interfaces-feel-better full scope: Typography — balance/pretty and exact copy retained, closed text fits tested widths; Surfaces — existing equal-width cards and overlay surface retained, no new decoration; Animations — existing 180ms opacity fade retained, small chevron rotation with reduced-motion override; Icons — existing Phosphor chevron/currentColor, no new library; Performance — no added dependency, timers or layout-height animation. Rejected: removing every disclosure cue (hidden continuation); hover by viewport width alone (would break tablets/hybrid input).

## Verification

- `npm run build` passed; existing Vite bundle-size warning only.
- `node --test tests/*.test.mjs` — 47/47. `git diff --check` passed.
- Four controller regression tests exercise mouse entry/leave, touch/coarse fallback, focus retention, Escape without reopening, pointer clicks versus native keyboard/touch clicks, and CSS/JS media-query agreement.
- Browser at 320/390/620/760px: More row visible, heading cue hidden. At 761/900/1129/1440/1920px with hover/fine pointer: More row hidden, cue visible. CSS and JS agree on the interaction mode. Closed card text has no horizontal clipping.
- Desktop keyboard focus opens the complete text; Escape closes it without reopening, with focus-visible retained. Mobile-width click opens the second card and its explicit Close button closes it. Width/input-mode changes reset open native details.
- At 1129px closed desktop cards are about 323×180px, down from about 323×257px. No fixed text height added. Open content remains an overlay, so neighboring cards do not move.
- No console errors observed. Screenshots in qa/values-hover-2026-10-21/ (ignored by Git).

Not verified: actual mouse hover/leave in the browser (the available API exposes no hover action; an AX drag attempt did not provide reliable pointer-hover evidence). Controller logic is tested directly, not by DOM event injection. Also not verified: true 200% browser zoom, RTL mirror, pseudo-localization, OS reduced-motion, 10%-speed animation replay. Coarse-pointer behavior has controller/source coverage, not a physical-device run. Static content has no loading/error/empty states.

## Verdict

Approve in the inspected layout/interaction scope, with the verification limits above; no complete-site audit claimed.
