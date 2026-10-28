# People editorial/layout QA — 19 October 2026

Scope: five supplied comments only, React/plain CSS. Used better-layout and make-interfaces-feel-better (full mode within this scope). No new imagery, dependencies, motion, routing or form changes. Local draft; no Sites save/deploy.

## Requested content

- Employee metric: `companyScale.colleagues = 1000`; rendered `1 000 +`. Other metrics and the company-principle figure are unchanged. This remains user-supplied editorial data, not a verified live feed.
- Two new cards below all five original bento cards, before the facts. Supplied copy retained, including the first-in-Russia claim; not independently fact-checked.
- Three inline links on «гембу», «offline-first PWA», «MCP-сервер» use the exact supplied `https://habr.com/p/882212/` and `https://habr.com/p/981866/` URLs. They open a new tab, have noopener/noreferrer and an accessible new-tab notice. Habr destination availability/content could not be verified by the web tool; hrefs verified in the live DOM.
- Entire facts list replaced by the supplied 13 entries, in order. Only `--` → `—` and the missing «в» before «Петербурге» corrected. No old facts appended.
- Help text is one paragraph: «Материальная поддержка. Помогаем в разных жизненных ситуациях». Cashback ends «во ВкусВилле».

## Grouping, shared edges, growth

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/Prototype.jsx` People, `src/styles.css` `.people-stories` | No product examples below existing promises | Two rounded lilac cards; two columns above the existing 760px breakpoint, one below | Order by importance and grouping: examples remain together between promises and facts |
| LOW | `src/styles.css` `.people-story`, `.vibe-check p` | No layout for new paragraphs; old facts were shorter | Content-driven card heights, shared leading edges, 24px internal paragraph spacing, 56px desktop/48px mobile separation between groups, readable fact line-height | Plan for growth/clipping: supplied long text is never clamped or given a fixed height |

## Polish coverage

| Category | Evidence | Result |
| --- | --- | --- |
| Typography | Existing Montserrat retained; heading balance/body pretty wrapping; desktop/mobile screenshots | Clear in changed cards |
| Surfaces | Existing lilac color and bento corner/inset scale; no new elevation or image treatment | Clear |
| Animations | No new animation; fact widget retains its existing animation and global reduced-motion override | No change; 10% replay not applicable to new static cards |
| Icons | No new icons; existing Shuffle icon retained | Clear |
| Performance | Two static HTML articles, no new canvases/assets/libraries | Clear |

Rejected: extending the fruit bento with two additional 3D scenes (unrequested graphics/performance cost); fixed equal pixel heights (would clip supplied paragraphs on mobile); making the entire cards links (each card contains specific inline destinations).

## Verification

- `npm run build`: passed, with the existing large-chunk warning.
- `node --test tests/*.test.mjs`: 34/34 passed, including three new editorial/structure tests.
- `git diff --check`: passed.
- Local live preview: employee metric, both card headings, all three link destinations, help/cashback copy verified in DOM. All 13 facts cycled with the actual button: 13 unique entries, 14th returns to the first.
- Layout widths: 320, 375, 620, 760, 761, 900, 1129, 1280, 1920px. Changed cards/facts have no clipped content; two columns from 761px, one through 760px. Group spacing measured 56px/48px as intended.
- Longest fact tested at 320, 375, 761, 900, 1129px: no text/button overlap or local overflow, widget grows with content (328px at 320px viewport).
- Screenshot QA: `qa/people-editorial-2026-10-19/desktop.png` and `mobile.png`. No console errors observed.
- Pre-existing outside scope: at 761px the footer's desktop grid exceeds the viewport (footer contacts/right edge about 854px); no footer rules changed. New cards/facts themselves remain contained. Do not interpret this as a clean whole-site overflow audit.
- Not verified: 200% browser zoom, runtime RTL mirror, pseudo-localized strings, actual Habr destination navigation. New horizontal spacing uses logical properties and native grid order, but this is source evidence, not runtime RTL verification.

Approve for the inspected changed layout only; unverified checks and the pre-existing footer issue above remain outside that verdict.
