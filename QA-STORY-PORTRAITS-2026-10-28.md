# Technology story portraits — 28 October 2026

Requested change: use the two supplied cutouts to the left of the existing care/mind stories, with a slight whole-card hover response. Reference: Figma `uJ2n44BeGivetJbZu4rtVo`, node `7400:2`; VkusVill job team-choice cards. Photos are the exact supplied WebPs, not regenerated assets.

## Grouping, alignment and adaptability (better-layout)

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | src/Prototype.jsx:330 | Two text-only cards | Each original story paired with its supplied decorative cutout | Group related image and copy without introducing new controls or claims |
| MEDIUM | src/styles.css:2381 | Left-side photo left only 185px for paragraphs at 900px | Through 1000px, portrait sits beside the title and the paragraph spans the card | Preserve readable text; overall two-to-one column breakpoint remains 760px |
| LOW | src/styles.css:2327 | Copy heights could offset headings | Copy starts at a shared top edge; portraits remain centred | Shared alignment supports scanning |

## Verification

- Local Vite production preview: inspected screenshots at 320, 390, 760, 900, 1129 and 1440 CSS px. No document horizontal overflow; final 320px titles fit their own grid tracks. At 900px final paragraph tracks measure 345px instead of 185px. Photos retain complete cutouts and alpha, without object-fit cropping.
- Exact source files protected by SHA-256 regression checks. Both images loaded at their original 768px intrinsic width. Existing three Habr links and article labels retained; no new fake button/link or tab stop.
- Actual fine-pointer entry: portrait transform advances left while text transform remains `none`; computed transition is 160ms ease-out. Keyboard Tab reaches the existing offline-first PWA link with visible 2px outline and card focus-within. No hidden hover-only content.
- Reduced motion: source guard requires `no-preference` before either hover/focus movement can activate, with a separate no-transition fallback and regression coverage. OS reduced-motion emulation **Not verified** in this browser runtime.
- 200% browser zoom, RTL mirror, pseudo-localization and slowed 10% animation playback: **Not verified**. The site is Russian; layout uses logical margins, minmax tracks and content-driven text heights.
- Build and complete Node test suite passed; Sites worker checks passed. Vite retains the pre-existing large-chunk advisory. No browser error logs during the inspected session.
- Browser evidence is saved under ignored `qa/2026-10-28-story-portraits/`; public publication smoke check follows the source/package handoff.

Approve for inspected Russian layouts and interactions. Unverified coverage is listed above, not claimed as passed.
