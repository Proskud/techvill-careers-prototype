import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/FooterSocials.jsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('Icon-only social links preserve all destinations and have accessible new-tab names', () => {
  for (const href of ['https://habr.com/ru/companies/vkusvill/articles/', 'https://t.me/itstechvill', 'https://setka.ru/communities/019e9171-9a90-7823-9260-78ffe6033d43']) {
    assert.ok(source.includes(`href="${href}"`));
  }
  assert.equal((source.match(/target="_blank" rel="noopener noreferrer" aria-label="[^"]+откроется в новой вкладке" title="[^"]+"/g) || []).length, 3);
  assert.doesNotMatch(source, /ArrowRight|ShareNetwork|<Article/);
  assert.equal((source.match(/aria-hidden="true"/g) || []).length, 3);
});

test('Social buttons share 48px targets, 12px spacing and color-only interaction', () => {
  assert.match(css, /\.site-footer \.footer-socials \{[^}]*flex-wrap: wrap; gap: 12px/);
  assert.match(css, /\.footer-socials a \{[^}]*inline-size: 48px; block-size: 48px/);
  assert.match(css, /@media \(hover: hover\) \{ \.site-footer \.footer-socials a:hover/);
  assert.match(css, /\.footer-socials a:focus-visible \{ outline: 3px solid/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{ \.site-footer \.footer-socials a \{ transition: none/);
});

test('Official local marks retain safe SVG content and use shared currentColor masks', () => {
  for (const name of ['habr.svg', 'logo-icon-dark.svg']) {
    const svg = readFileSync(new URL(`../public/assets/socials/${name}`, import.meta.url), 'utf8');
    assert.match(svg, /<svg/);
    assert.doesNotMatch(svg, /<script|<foreignObject|onload=|href="https?:/i);
  }
  assert.match(css, /\.footer-social-mark \{[^}]*background-color: currentColor/);
  assert.match(css, /\.social-setka \{[^}]*mask-mode: luminance/);
});

test('Social icon buttons never generate the navigation hover underline', () => {
  assert.match(css, /\.site-footer \.footer-socials a::after\s*\{\s*content: none;\s*\}/);
  assert.match(css, /\.site-footer nav a:hover::after\s*\{\s*right: 0;/);
  assert.match(css, /\.footer-socials a:focus-visible \{ outline: 3px solid/);
});
