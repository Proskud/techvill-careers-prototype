# Global typography, 28 October 2026

Scope: all local site routes and their shared source copy: home/technology/people/footer, services, AI, pentest, blog, the Altai article, vacancies and all four vacancy detail pages. React + existing CSS + Vite/Babel, no font-family, asset, navigation or content-structure replacement. Preserved earlier fruit and social-hover fixes.

## Findings and fixes

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | src/data/typography.mjs, scripts/typography-plugin.mjs, vite.config.mjs, src/ArticleDetail.jsx | The formatter ran only in article paragraphs; new data, JSX, inline boundaries and article speaker roles remained unbound | Idempotent build-time formatting for JSX, JS/MJS data, template parts and parsed article roles | Short prepositions/conjunctions and compound names stay with their context without a MutationObserver or React DOM edits |
| MEDIUM | src/styles.css, src/ai.css | Wrapping rules were partial; mobile names broke at hyphens; AI accent span forced nowrap | Balanced headings, pretty prose/captions/tooltips, natural AI wrapping; protected compounds with mobile type scale inside the existing 760px breakpoint | Whole words fit real 320px containers rather than being split or hidden |
| LOW | src/ServicesPage.jsx, src/SecurityPage.jsx, src/ContactForms.jsx, src/data/newsArticle.js, src/data/ai.js | Missing ё and inconsistent final periods in four short card descriptions | Unambiguous ё restored; final periods removed from services value teaser, MCP teaser and two pentest result captions | Consistent editorial typography; full paragraphs, quotations, dates and legal punctuation retained |
| MEDIUM | src/data/vacancy-filters.mjs | A normal keyboard hyphen would not match a protected display hyphen | Normalize NBSP and Unicode hyphens for search only | Typography must not change filtering behavior or input values |

## Coverage

| Category | Evidence | Result |
| --- | --- | --- |
| Typography | Source audit, screenshots, rendered text and width checks | Shared binding/wrapping applied; existing Montserrat retained |
| Surfaces | Headings, cards, form and tooltip bounds | No changed gutters/radii; no horizontal text/page overflow in checked states |
| Animations | No animation source or timing edited | No new animation; slowed-motion playback not repeated |
| Icons | No asset/import/path edits | Existing marks and eight hero fruits preserved; icon redesign not reviewed |
| Performance | Formatting happens during build, not per frame or DOM mutation | No observer, new library, runtime polling or new dependency |

## Browser checks

Browser-rendered evidence is in `qa/2026-10-28-typography/`; `layout-checks.json` includes the inspection history, including early states whose remaining article-role/filter spaces were subsequently fixed. Screenshot dimensions are actual CSS viewport pixels, density 1. Temporary viewport overrides were checked against `innerWidth` before assigning coverage.

- At 320px: home/technology, /services, /ai, /pentest, /blog, /blog/altai, /vacancies and /vacancies/1–4; missing-article and missing-vacancy states. No horizontal text/page overflow. No remaining unprotected preposition/conjunction spaces or ASCII-hyphen company/city names in the final inspected render.
- At 900 and 1129px: home, services, AI, pentest, blog, Altai article, vacancies and vacancy 1. No horizontal text/page overflow or unbound short-word spaces. Remaining vacancy pages share the same layout and were individually checked at 320px, not separately at these wide sizes.
- At 390px: services, AI and home/technology; no overflow or unbound short-word spaces.
- Native mobile services disclosure opens. A service form opens/closes; consent labels and other text remain inside the dialog, input values stay untouched. Nothing was submitted.
- Query `ML-программист` (ordinary hyphen) finds `ML‑программист (КШ)` after selecting Cyberchef. Query and company controls retain their behavior.
- Apple tooltip at actual 320px width measures 288px wide, left 16px/right 304px; full text fits. Escape dismissal retained.
- Restored ё is visible in services values and pentest headings. Corrected article spellings are source-tested. Proper names and ambiguous все/всё were not mechanically rewritten.
- Accessibility names, alt text and placeholders were checked for literal escape sequences after a real Babel→JSX compilation regression test was added; final rendered labels have normal Unicode, not `\\u`/`\\x` text.

## Verification and limits

Run `npm run build`, `node --test tests/*.test.mjs`, and `git diff --check` before packaging. Tests cover idempotence, inline boundaries, names and declined forms, URL/Markdown/input preservation, real JSX attribute decoding, search matching, spelling and CSS rules. Existing Vite bundle-size and Three.Clock deprecation warnings are unrelated.

Visual line breaks were inspected in captures, not asserted from unavailable Range/TreeWalker browser APIs. Browser `pretty`/`balance` are used to avoid unnecessary orphan lines; unavoidable one-word lines in large titles at minimum width are not fixed by shrinking the entire site. Not verified: every possible intermediate width, non-Chromium engines, browser zoom/RTL mirror, and every possible future user-supplied string. No holistic accessibility/color audit is claimed.

Rejected: nonbreaking entire sentences (would overflow), blanket е→ё replacement (would alter meanings/names), removing every period (would damage prose/legal text), DOM text rewriting (would fight React and affect live inputs), changing layouts or fonts to hide wrapping issues.

Verdict: Approve within the typography scope after the final build/test run. Publication uses the existing public Site under the standing instruction.
