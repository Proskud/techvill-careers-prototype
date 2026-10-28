# Logo balance — better-layout

## Order by importance / Group with space

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM, resolved | src/Prototype.jsx:35; src/styles.css:137; shared header and footer | Full 378:52 lockup at 30px high: about 218px wide; heavy lettering competes with a 30px mark | Original mark 32×32px; original lettering 121.15×20px; 10px gap; total 163.15px | Order by importance: reduces lettering dominance and makes the identifying mark visible. Space groups both elements without a separator. |

## Verification

- Original SVG path geometry and colors preserved; only source viewBoxes differ. Lettering remains graphite on light surfaces, not a substituted font or altered glyph weight.
- New sizes are local styling variables, using logical inline/block sizes. Trademark stays LTR; its containing header follows normal layout flow.
- Browser widths checked: 320, 375, 480, 481, 760, 900, 1135, 1221, 1280, 1920 CSS px. Header child rectangles do not overlap or extend outside the viewport; no page overflow. The existing ≤480px mark-only pattern is unchanged, not a newly introduced device breakpoint.
- Real screenshots: `qa/brand-balance-2026-10-13/desktop.png` (1135×799), `wide-1920.png`, `mobile-320.png`, `footer.png`. Both source components stay crisp and vertically centered. Footer home link works with Enter; browser error log empty.
- Build, 26 tests, and git diff whitespace checks pass. Existing bundle-size warning is unrelated.
- 200% browser zoom: Not verified. RTL browser mirror: Not verified; explicit LTR trademark grouping and logical sizes inspected only. Pseudo-localization: Not verified (no labels or copy changed).
- Local draft only; no save/push/deployment performed.

Approve — inspected local LTR layouts only; unverified stress-test coverage is not approved.
