import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/Prototype.jsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('every benefits tab controls its own always-mounted panel; inactive panels are inert', () => {
  assert.match(source, /aria-controls=\{`benefit-panel-\$\{groupIndex\}`\}/);
  assert.match(source, /id=\{`benefit-panel-\$\{groupIndex\}`\}/);
  assert.match(source, /inert=\{!isActive\}/);
  assert.match(css, /\.people-benefit-panel \{\s*display: flex;\s*grid-area: 1 \/ 1;/);
  assert.match(css, /\.people-benefit-panel:not\(\.is-active\) \{\s*visibility: hidden;/);
});

test('figures missing from the card copy stay readable by screen readers', () => {
  assert.match(source, /aria-hidden=\{card\.spoken \? undefined : "true"\}/);
  for (const display of ['50\\W000\\W₽', 'УДАЛЁННО', 'ОФИС']) {
    assert.match(source, new RegExp(`display: "${display}", spoken: true`));
  }
  assert.doesNotMatch(source, /people-benefit-card-meta/);
});

test('phones show all four categories as a 2×2 grid instead of a hidden horizontal scroller', () => {
  assert.match(css, /\.people-benefit-tabs \{ display: grid; grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.doesNotMatch(css, /\.people-benefit-tabs \{[^}]*overflow-x: auto/);
  assert.doesNotMatch(css, /\.people-benefit-card\.is-lead \{ min-height: 260px; \}/);
  const block = css.slice(css.indexOf('.people-benefit-display {'), css.indexOf('@keyframes benefit-panel-in'));
  assert.doesNotMatch(block, /line-height: \d+px/);
});

test('home blog teasers: three-line titles, touch-safe hover, stacked covers on narrow phones, 44px blog link', () => {
  assert.match(css, /\.home-article-list \.career-article-copy h3 \{ display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden; overflow-wrap: break-word; \}/);
  assert.match(css, /@media \(hover: hover\) \{ \.career-article-card:hover \{ border-color: var\(--lime\); \} \}/);
  assert.doesNotMatch(css, /^\.career-article-card:hover,/m);
  assert.match(css, /@media \(max-width: 420px\) \{\s*\.home-article-list \.career-article-card \{ grid-template-columns: minmax\(0, 1fr\); \}/);
  assert.match(css, /\.article-blog-link \{[^}]*min-height: 44px;/);
});
