# Avocado hint — 16 October 2026

Mode: full, restricted to the Avocado hint and the technology rows it touches. React 19, existing plain CSS and Radix/Motion accordion. Earlier logo/AI changes remain untouched. No publication.

## Coverage

| Category | Evidence inspected | Result |
| --- | --- | --- |
| Typography | Exact supplied copy, inherited Montserrat, wrapping and screenshots at 1129/375px | Clear for this hint |
| Surfaces | Native top-layer popover, 16px viewport gutter, shared row insets, button separation | Clear |
| Animations | No new animation or transition; 120ms close grace period bridges pointer travel | Clear; 10% motion replay not applicable |
| Icons | Existing original Avocado image retained; small information cue marks the new interaction | Clear |
| Performance | No new dependencies; geometry read only on opening/visible scroll/resize; listeners/timer cleaned up | Clear |

## Changes by principle

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/Prototype.jsx:481`, `src/TechCenterHint.jsx:51` | Avocado was static content inside the full-row disclosure button | Independent native button and described tooltip; fruit identity groups moved above disclosure headings | Keep controls distinct; avoid nested buttons and accidental accordion activation |
| LOW | `src/styles.css:1561`, `src/TechCenterHint.jsx:18` | No contextual explanation | Readable, wrapping top-layer hint above the fruit when space allows, with 16px viewport gutters and matching responsive row insets | Plan for clipping and align to shared edges; no new breakpoint introduced |

## Considered but rejected

| Location | Candidate | Rejected because |
| --- | --- | --- |
| Avocado | Native `title` attribute alone | Delayed browser-controlled appearance, no reliable keyboard/touch equivalent |
| Existing accordion trigger | Insert another button inside it | Nested interactive controls would conflict with disclosure behavior |
| Tooltip | New animated entrance | A frequent hover needs immediate feedback; existing visual language does not require motion |

## Verification

- `npm run build`: passed; existing large-chunk warning remains outside scope.
- `node --test tests/*.test.mjs`: 31/31 passed after adjusting the placement regression assertion to the final above-first geometry.
- `git diff --check`: passed.
- Browser: live local build reloaded. Keyboard focus opens; Escape closes while retaining trigger focus. Click opens, repeat click closes, outside click dismisses. Opening the hint does not open the accordion. The automation row still expands/collapses and retains `1C / SQL / PHP / Laravel / Lumen`.
- 320, 375, 760, 900, 1129, 1280, 1920px: open hint stays entirely inside viewport; no horizontal page overflow; identity/title retain their shared leading edge. Screenshots inspected at desktop 1129×798 and mobile 375×798.
- Saved `qa/avocado-hint-2026-10-16/desktop.png` and `mobile.png`.
- Not verified: real mouse hover/leave traversal (available in-app control API lacks pointer-move), physical touchscreen, 200% zoom, RTL mirror, legacy browsers without native Popover API. Mouse handlers are source-reviewed; keyboard/click paths are runtime-verified, not claimed as a physical hover test.

No remaining actionable layout/polish finding in inspected scope. Approve for that scope only, with the unverified checks listed above.
