# Footer social buttons — 21 October 2026

Scope: only shared FooterSocials on all routes; React, existing CSS palette and Phosphor. AGENTS.md read and updated. Existing legal copy, destinations, footer layout and other interactions retained.

## Findings and implementation

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| LOW — fixed | src/FooterSocials.jsx:3; src/styles.css:2350 | Three text-and-arrow links with generic article/share icons | Icon-only native links, matching 48×48 surfaces, 12px gap, wrapping, accessible network names and native title tooltips | Requested compact control group, shared alignment, distinct controls |
| LOW — fixed | src/styles.css:2351 | Inherited footer text colors, no dedicated hover treatment | Same deep-purple marks/lilac surfaces; 150ms color inversion for hover-capable pointers, visible keyboard outline, static active state, no motion under reduced-motion | Consistent controls and restrained feedback |

Better-layout: grouping and shared edges inspected at 320, 390, 760, 761, 900, 1129, 1440, 1920px. Every social target is 48×48, inside the viewport, same row, 12px gaps. No breakpoint added; normal flex wrapping remains available. Other footer columns are outside this review.

Independent make-interfaces-feel-better, full scope limited to these three controls: Typography — labels moved to accessible names/native titles; Surfaces — shared existing 12px radius, 48px targets; Animations — color-only 150ms transitions, reduced-motion override; Icons — local official Habr/Setka masks plus existing TelegramLogo, currentColor, no redraw; Performance — no dependencies, no transition:all or will-change, no runtime remote image requests. All inspected in source; normal icons and keyboard focus visually verified.

Rejected: separate brand-colored buttons (conflicts with requested one palette); icon bounce/scale (unnecessary movement for a simple external link).

## Verification

- `npm run build` passed; only pre-existing Vite chunk-size warning.
- `node --test tests/*.test.mjs` — 43/43. `git diff --check` passed.
- Actual computed button foreground rgb(33,0,102) for all three, background uses the lilac token. Setka computed mask-mode=luminance. All three marks visibly render; no blank square placeholders.
- Tab/Shift+Tab reaches each named link; each has focus-visible and a solid outline. Destinations and new-tab/noopener attributes retained. External account pages were not opened.
- No console errors observed. Screenshots in qa/socials-2026-10-21/ (ignored by Git).
- Official Setka source: https://setka.ru/brand → icon SVG archive; Habr source: Safari mask linked by https://habr.com/ru/. Asset provenance recorded in public/assets/socials/README.md. Official Setka SVG contains an embedded PNG; original asset preserved.

Not verified: actual pointer hover (browser API has no pointer-hover action), 10% animation replay, OS reduced-motion, actual 200% browser zoom, RTL mirror/pseudo-localization. Hover/active/reduced-motion rules inspected in source; no DOM or style injection used for screenshots.

## Verdict

Approve in the inspected scope, with the verification limitations above. No remaining actionable layout/polish findings for these controls; no holistic footer audit claimed.
