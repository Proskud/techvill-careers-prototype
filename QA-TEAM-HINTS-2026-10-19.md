# Team hints / Raspberry — 19 October 2026

Scope: the 11 supplied technology comments. Local-only follow-up; earlier People edits preserved. No Sites save/deploy.

## Changes

- Shared dictionary `src/data/tech-centers.js` contains the nine unique supplied team descriptions. Ten button instances consume it: Apple is used twice. Coconut retains **ML и AL** exactly as supplied, not silently changed to AI.
- `TechCenterHint` now accepts `text`; the existing top-layer hover/focus/click/Escape behavior is reused. Native buttons stay outside accordion triggers, each with its own tooltip ID and description association. Avocado's text is unchanged.
- Raspberry immediately follows Avocado in automation/1C. Other row memberships, stack chips and navigation links are retained.
- Only final periods were removed from the two selected automation/security descriptions; internal punctuation remains.
- Hero models are now an explicit list of the same approved eight fruits, independent from static team avatars. This prevents the newly added Raspberry from becoming an unintended generic hero model.

## better-layout

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/Prototype.jsx:498`, `src/data/tech-centers.js:2` | Only Avocado exposed a description | Every supplied center is a consistently marked tooltip button, with one shared Apple description | Hint at hidden content; identical interactions and source-owned wording |
| LOW | `src/styles.css:1558` | Four automation centers, existing wrapping row | Five centers; centered cross-axis alignment and a 100% maximum inline size, with existing 16px/28px gaps and native wrapping | Keep controls distinct and plan for growth; no new breakpoint or fixed row height |

## Verification

- `npm run build`: passed; existing large-bundle warning remains outside scope.
- `node --test tests/*.test.mjs`: 36/36 passed. Tests cover all supplied strings, Apple duplication, assets, Raspberry's position, final punctuation, and eight hero models.
- `git diff --check`: passed.
- Live preview after reload: all ten buttons open their correct text; only one native popover is open at a time; ten unique IDs; opening hints does not activate the accordion.
- Raspberry: keyboard focus opens, Escape closes while focus remains on its button. Accordion disclosure still opens full automation/security text without final periods.
- 320, 375, 620, 760, 761, 900, 1129, 1280, 1920px: all five automation buttons stay within their row's bounds, never overlap, and wrap naturally. One row at 1129px and wider, two at 620–900px, five at 320/375px. All tested popovers remain inside viewport gutters.
- The Raspberry image loads at 120×120; desktop/mobile screenshots inspected and saved in `qa/team-hints-2026-10-19/`. No browser console errors observed.
- Not verified: actual mouse hover/leave traversal (in-app API lacks pointer movement), physical touchscreen, 200% zoom, runtime RTL mirror, legacy browsers without the Popover API. Event wiring is source-reviewed; focus/click paths are browser-tested. This is not a whole-site overflow audit; the previously noted footer issue is outside this change.

Approve for the inspected layout scope, with the verification limits above.

## Generated Raspberry asset

Built-in imagegen mode, new asset from style references, no CLI/API fallback. References: existing `lychee.jpg` and `pomegranate.jpg`, visually inspected before generation. Existing assets were not overwritten.

Final asset: `/Users/proskud/Documents/ChatGPT/Внутриком/techvill-careers-prototype/public/assets/paper-fruits/raspberry.jpg` (120×120, about 5.3KB). Generated original retained at `/Users/proskud/.codex/generated_images/01a1301b-6122-7453-b230-2de6974d469a/exec-badc029f-97af-40fc-af57-034c265c0c3e.png`. Only a mechanical downscale/JPEG conversion was applied for delivery; the selected result was visually inspected again at 120px.

Final prompt:

> Use case: stylized-concept. Asset type: one small square fruit icon for the TechVill team list, displayed at 56px. Generate a NEW raspberry icon matching the supplied existing lychee and pomegranate images (both are STYLE REFERENCES, not edit targets). Subject: one clearly recognizable whole ripe red-magenta raspberry, plump clustered drupelets, slightly tapered berry, with a tiny green calyx/leaf at the top. Match the reference collection: polished volumetric 3D fruit, subtle purple wireframe mesh over the fruit, thin glowing violet silhouette, soft violet halo, deep nearly-black violet background. Center the fruit and keep the entire silhouette inside the image, occupying about 65–70% of the square, with generous clean dark margins like the references. Lighting: soft studio highlight from upper left, saturated but natural red-magenta fruit and small lime-green leaf, readable silhouette at 56px. No text, no label, no UI, no frame or enclosing circle, no extra fruits or objects, no watermark. Output a square bitmap.
