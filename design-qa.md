# TechVill — apple and coconut recognition, 22 October 2026

final result: passed

## Scope and visual truth

Scoped Product Design annotation update, not a redesign. The user's three annotated screenshots request recognisable apples in the lead card, mix card and hero, and a recognisable coconut. Existing live version 41 supplies the unchanged layout, copy, palette and wireframe art direction. Existing native Three.js meshes are edited directly; no source artwork is replaced by a raster approximation. No saved Product Design context exists (preflight checked).

- Source captures: `qa/2026-10-22-fruit-shapes/before-people.png`, `before-mix.png`, captured from the existing public Site before publication.
- Implementation captures: `qa/2026-10-22-fruit-shapes/after-people.png`, `after-mix.png`, `after-keyboard-turn.png`, `tablet-900.png`, `mobile-apple.png`, `mobile-coconut.png`, `hero.png`.
- Full-view comparison: `comparison-people.png`, actual source and implementation combined horizontally. Each source is 1129x798 pixels at a 1129x798 CSS viewport, density 1. No resampling; before/after scroll positions differ by 3px, not a layout change. Comparison file adds only a 30px label strip.
- Focused comparisons: `comparison-detail.png` crops the same 515x360 CSS/pixel region around the large apple and coconut; `comparison-mix.png` crops the same 280x260 region at exactly matching scroll 2991.5px. Both before/after crops are in one comparison input. Important silhouette, stem, leaf and cut-surface details were inspected at this scale.
- Other verified viewports: 900x900 and 390x844, density 1. The existing 1024/760px bento layout rules remain unchanged; no CSS or breakpoint edits.

## Findings, fixes and comparison history

1. P2, original apple: the flattened sphere and short green stalk read as tomato. First revised render (`iteration-2-people.png`) added a curved brown stem and pointed leaf but still needed clearer shoulder/heel contrast. Final geometry has broader shoulders, narrower heel, a deeper stem basin and a slight forward tilt. The revised small apple in `comparison-mix.png` uses the same shared model as the large apple and hero.
2. P2, original cut coconut: a solid white cylinder concealed the interior. Replaced with a thick annular white rim and concave shaded lining; the matte, mottled brown shell retains purple wireframe. Whole coconuts have three eyes and no inappropriate stalk/leaf. Final detail comparison shows the cavity clearly; a quarter-turn was inspected as well.
3. Geometry check found an initially oversized leaf when including wireframe safety margin. Shortened it to .75 local scale and reran all vertex/normal/bounds checks successfully. Existing 1.3-unit collision bound remains sufficient. No hero collision or flight parameter changed.

Final combined comparisons found no remaining actionable P0/P1/P2 issue. The intentional changes are fruit silhouette and coconut material/details only. The original image is not a target for retaining its ambiguous fruit shapes.

## Required fidelity surfaces

| Surface | Evidence and result |
| --- | --- |
| Fonts / typography | Combined full-view comparison: Montserrat, weights, hierarchy and wrapping unchanged. No font or CSS edit. |
| Spacing / layout | Same card edges, gutters, radii, text positions and existing overlaps. Viewport changes at 900 and 390px do not produce horizontal overflow. |
| Colors / tokens | Apple red and purple wireframe unchanged. Only shell/flesh/foliage materials refined as requested. Existing lime/lilac surfaces unchanged. |
| Image quality | Actual interactive meshes, finite normals/vertices, visible stem/leaf and hollow coconut; shared apple in all consumers. No blur, clipping by the fruit canvas or raster substitution. |
| Copy / content | All headings, body copy, labels, routes and counts unchanged. |

## Interface-polish review

Full review within the fruit-only scope; React Three Fiber / Three.js and existing plain CSS. Typography, surfaces, animation, icons and performance were considered. Typography and surfaces are unchanged and match the combined comparison; no icon-system changes. Motion damping and reduced-motion branches are untouched. Performance retains 32x24 bento bodies, 18x14 wires, shader prewarm, persistent canvases and on-demand visible-only 30fps. Small detail geometry is memoized and disposed with the body. Rejected: generated static fruit images (would remove interaction), extra particles/new motion (outside scope), and changing hero flight/collision radii (unnecessary after measured bounds passed).

Verification: `npm run build`, `node --test tests/*.test.mjs` (55 passed), `git diff --check`; real ArrowRight/ArrowLeft apple rotation and coconut click/keyboard return; all four bento scenes reported ready; actual viewport captures at 1129, 900 and 390px; hero rendered using shared model; browser error log empty. Existing Three.Clock deprecation and Vite chunk-size warnings remain unrelated. Reduced-motion behavior is source/test-verified, not re-emulated in the browser; no new motion was introduced, so a slowed-animation review is not claimed. Low-end GPU/cold-network benchmarking is not verified. Verdict: Approve within this scope, with those testing limits.

Implementation checklist: shared models updated; wireframe and responsive composition preserved; geometry tests added; focused before/after comparisons inspected; build/test checks passed; publish to existing Site under standing approval.

## Historical QA follows

# TechVill — brandbook logo sizing follow-up, 13 October 2026

Latest layout correction: user requested a smaller, less dominant wordmark and clearer mark. Original SVG vectors are now cropped into independently sized assets: 32px mark + 10px gap + 20px-high wordmark, total 163.15px. The earlier full-lockup sizing notes below are historical and superseded. Current verification and coverage limits: `QA-LOGO-LAYOUT-2026-10-13.md`; screenshots: `qa/brand-balance-2026-10-13/`.

# TechVill — brandbook logo, 13 October 2026

final result: passed

## Current scoped QA: shared header/footer brand

- Source visual truth: `/Users/proskud/Downloads/logo_tech.svg`, retained byte-for-byte as `public/assets/logo-tech-brandbook.svg`. Intrinsic source size and viewBox: 378 × 52.
- Implementation: `http://127.0.0.1:4174/`, light header/footer. Actual full lockup 218.0703 × 30 CSS px, aspect ratio preserved; below the existing 480px breakpoint header crops the same SVG to its original mark in a 30px square. Footer retains the full lockup.
- Screenshots: `qa/brand-2026-10-13/desktop.png` (1135×799), `desktop-1280.png` (1280×799), `mobile-320.png` (320×799), `footer.png` (1280×799), `source-comparison.png` (1135×799). These browser captures are 1:1 CSS/pixel density. The comparison source is shown at intrinsic 378×52; the UI uniformly scales it to 30px high.
- Full-view comparison: original/light SVG comparison and real 1135px implementation screenshot emitted in the same comparison input. Existing hero hierarchy, typography, imagery and controls are preserved.
- Focused comparison: `source-comparison.png` renders both identical vector outlines together, original white lettering on purple and adapted graphite lettering on light paper. Header/footer captures confirm placement and complete lettering. Automated check confirms that removing the single lettering-color style produces exactly the original SVG.
- Required fidelity surfaces: typography uses official outlined brand letters, not a substitute font; surrounding Montserrat unchanged. Spacing retains 30px mark height and existing mobile breakpoint. Colors preserve #A5F04B and #6C1EFF; only white lettering becomes #17171b. Artwork remains sharp SVG with no path changes or rasterization. Copy, accessible home-link label and routes unchanged.
- Lettering contrast: graphite on paper #fafaf7 = 17.09:1, lilac #f2edff = 15.61:1, footer #f5f7fa = 16.66:1. These values describe the listed opaque palette surfaces, not every pixel of the animated hero backdrop.
- Checks: no overflow at 320, 900, 1135 and 1280 CSS px; wide header navigation does not overlap brand/CTA. Tablet menu opens/closes; footer logo Enter returns to home. Browser error log empty. Build and 25 tests pass; existing bundle-size warning remains unrelated to the logo.
- Comparison history: first post-change comparison found no actionable P0/P1/P2 differences. Intentional changes: official lettering shape/full-lockup width, graphite adaptation, and unchanged mobile mark-only treatment. No unrelated page redesign or publication.
- Implementation checklist: supplied asset preserved; shared brand replaced; responsive checks complete; temporary QA harness removed from dist.

## Historical QA follows (not the source for the current logo)

# TechVill — selected fruit bento and 7 October draft

final result: passed

## Source and captured implementation

- Source visual truth path: `/Users/proskud/.codex/generated_images/01a10c2f-b9d7-7440-b8f5-9aed341097ba/exec-1dff4445-caa9-404f-b961-16288a0eec1b.png` — second displayed concept, selected by the user.
- Implementation: `http://127.0.0.1:4173/#people`, browser tab 13.
- Implementation screenshot path: the Computer Use capture is inline in this conversation; the connected screenshot API does not expose a saved image path. No exported screenshot file is claimed.
- Comparison viewport: 1435 × 1096 CSS px, devicePixelRatio 1. Source 1435 × 1096 px. No density resampling required.
- State: light theme, start of People section, native scroll settled, five full source texts; no team-name labels.
- Full-view evidence: source file emitted together with the browser screenshot in a single comparison call. Additional post-fix desktop screenshot confirms the same state.
- Focused evidence: 320 px capture of apple/culture boundary before and after the mobile spacing fix; desktop copy/fruit boundaries inspected in the combined image and with DOM rectangles. Lower cards inspected in a separate scrolled capture.

## Findings and comparison history

1. P2, initial local form at 320 px: grid children exceeded the form width. Fixed with `minmax(0,1fr)` on the form and `min-width:0` on children. Post-fix form/fields both measure 240 px; dialog scrollWidth equals clientWidth 280 px.
2. P2, initial hero at 900 px: strawberry control extended left of the viewport. Fixed by resetting its leading position below 1023 px. Post-fix rectangle starts at x=45; visual capture preserves both hero actions and the robot.
3. P2, first bento comparison: apple sat inside the card, losing the selected edge integration. Enlarged its source-model slot and moved it toward the trailing/bottom edge. Post-fix desktop comparison shows a large wireframe apple at the lime card edge with readable copy above it.
4. P2, first 320 px bento capture: mango nearly touched the first culture heading line and focus outline could be clipped at the edge. Increased culture top padding to 132 px and inset mobile fruit controls. Post-fix culture capture shows a clear gap above the heading, with no text overlap.

No actionable P0/P1/P2 visual issue remains in the tested states.

## Required fidelity surfaces

- Fonts/typography: Montserrat loaded (`document.fonts.check` true), existing heavy display weights, purple headings and normal body copy. Headings retain their full source text; wrapping grows rows rather than clipping.
- Spacing/layout rhythm: asymmetric two-column grid, lime lead spanning two rows, two lilac side cards and two lower cards. 24 px desktop gap, 32 px radii, responsive single column at 760 px and below. Lead fruit slot reserves space below the body. No detached framed left scene remains.
- Colors/tokens: existing warm white/lilac, purple-deep and lime tokens, graphite/muted body copy. The approved Site palette takes precedence over slight Image Gen shading differences.
- Image quality/assets: actual existing Three.js apple/mango geometry and wireframe materials reused, not raster approximations. Coconut retains that material system and uses a cut face for the selected composition. No extra pear or decorative spheres were introduced. Original Rut media preserved except the explicitly requested white hero edit.
- Copy/content: all five complete approved texts and their original reading order preserved. The generated mock shortened and renamed some themes; those editorial changes were not copied. Rows are intentionally taller than the short-copy mock. Fruit names and “Наши команды” removed from People UI, retained only where appropriate in the separate technology block.

## Interactions and responsive checks

- People fruit controls: cursor response, click rotation, ArrowLeft/ArrowRight, native focus outlines. Objects remain decorative, not team labels. Rendering is paused/unmounted away from the viewport; reduced-motion code uses demand frames and immediate user-triggered state changes.
- Actual measured widths 320, 375, 760, 900, 1135, 1440 and 1920: no document horizontal overflow. The initial 375 loop returned a stale 320 viewport; the 375 width was independently recaptured and confirmed.
- Service form: required fields, missing consent, valid contacts/task, explicit non-transmission state, Escape and return focus tested.
- Talent form: required name/email/phone/CV link/consent, valid completion and non-transmission state tested. Disabled uploaders and no data persistence.
- Five technology rows: each opened, aria-expanded confirmed true across all five; keyboard ArrowDown + Enter confirmed next-row focus/opening. Existing descriptions/stacks retained.
- `/services`: nine services, three genuine source product images, next/select portfolio controls and service form tested. `/ai`: shared service CTA and dialog present and opened.
- Console inspected: no application errors observed. Existing Three.Clock deprecation warnings remain.
- `npm run build`, `npm run test:sites` (5/5), `git diff --check` passed after the final Site-source changes. Existing large-chunk build warning remains.

## Review coverage and remaining gaps

The available better-layout guidance informed grouping, text-first reading order, persistent modal controls and responsive grid sizing. Better-interface owning skills for accessibility, writing, typography, color and polish were unavailable: those skill reviews are **Not reviewed**. Practical browser checks above are not a claim of a full accessibility audit.

- OS reduced-motion setting and 200% browser zoom not runtime-tested.
- RTL/localization not tested; this is a Russian LTR Site.
- No backend, file upload, delivery/storage confirmation or publication tested because none is connected/permitted in this draft.

## Follow-up polish

- P3: optional consolidation of decorative WebGL contexts and further bundle optimization; visibility gating already avoids rendering distant cards.
- P3: the full-copy version is taller than the selected short-copy image by design, not a clipping defect.

## Implementation checklist

- [x] Implement displayed option 2 only after selection.
- [x] Preserve source texts and real 3D models.
- [x] Compare selected visual and browser capture together.
- [x] Fix and recapture actionable mobile/layout findings.
- [x] Validate forms, disclosures, portfolio and responsive routes.
- [x] Keep preview running locally; do not publish this unapproved draft.

Reference research: [Homerun values](https://mobbin.com/sites/sections/fab3a876-94fb-4195-ab6f-9b3ec8daa9ba), [Canva values](https://mobbin.com/sites/sections/179f506e-2b1d-4238-a084-92aa95b8cdd1), [Linktree values](https://mobbin.com/sites/sections/2fd137e3-1a06-494f-889d-c0ceec4bf55f), [YLLW form](https://mobbin.com/sites/sections/a45b58fa-4ac0-49f8-957e-47be93d4f4e1).

## Latest review — 9 October: hero team-fruit flight

This section supersedes earlier hero-only motion coverage, not other historical checks.

- Source visual truth: user annotation screenshot and public hero capture `/private/tmp/techvill-hero-source.png`.
- Implementation: `/private/tmp/techvill-hero-fruits.png`; final motion sample `/private/tmp/techvill-hero-fruits-final.png`.
- Matched comparison: both source and implementation at 1135 × 799 CSS/pixel dimensions, density 1. Both images opened together in one comparison input. Initial unmatched 1280 px implementation capture was discarded from fidelity comparison.
- State: landing hero, menu closed, initial viewport. Moving fruits intentionally have different positions and orientations between samples. The requested eight-fruit field replaces the single pineapple; these differences are not fidelity failures.
- Full-view findings: hero type, copy, CTAs, white Rut illustration, frame shape, colors and grid retained. Muted moving geometry stays behind content. No actionable P0/P1/P2 mismatch in compared state. Close-up not needed: unchanged type and controls are readable at full comparison resolution; scene geometry was also inspected across subsequent motion samples.
- Actual 3D fruit types are derived from unique technology team icons: apple, mango, lychee, pineapple, avocado, coconut, banana, pomegranate. Existing pineapple/apple/mango/coconut geometry reused; remaining types extend the native Three.js scene rather than being flat images.
- Independent random signed angular velocities on X/Y/Z allow full revolutions. Random periods/phases and differing harmonic paths make continuously closed flights; damped local cursor repulsion does not reset the paths.
- Browser interaction: ArrowRight reaches the background fruit control and updates rotation; focus pauses automatic motion. Pointer drag was exercised and subsequent scene captured. One hero canvas; error console empty. At 375 px, document width remained 375 px and both hero actions remained readable.
- Logic tests: seamless closure/bounded paths across all eight configurations; active/inactive/outside/overlapping cursor repulsion and direction/bounds. Both tests passed. Sites tests 5/5, build and diff checks passed.
- Not runtime-verified: OS reduced-motion setting, low-end hardware frame rate, exact measured pointer displacement. Reduced-motion and visibility demand rendering verified in source. Existing large-bundle warning remains.
- Publication: not requested for this revision, kept local.

Latest final result: passed
