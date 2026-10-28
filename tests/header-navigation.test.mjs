import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/Prototype.jsx', import.meta.url), 'utf8');
const header = source.slice(source.indexOf('function Header('), source.indexOf('function WordReveal('));
const footer = source.slice(source.indexOf('function Footer('), source.indexOf('export function Prototype('));

test('Services is absent from the shared header but remains in the footer', () => {
  assert.doesNotMatch(header, /href="\/services"|Решения/);
  assert.match(footer, /<a href="\/services">Решения<\/a>/);
});

test('The remaining header navigation destinations are preserved', () => {
  for (const href of ['/blog', '/#technology', '/ai', '/vacancies']) {
    assert.ok(header.includes(`href="${href}"`), `Missing header destination: ${href}`);
  }
  assert.match(header, /aria-controls="site-navigation" aria-expanded=\{menuOpen\}/);
});

test('The accidental About page and all navigation links to it are removed', () => {
  assert.doesNotMatch(source, /isAboutPage|about-page|about-hero|href="\/about"/);
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css, /\.about-hero/);
  assert.match(source, /<a className="brand" href="\/" aria-label="ТехВилл — на главную">/);
});

test('Old About bookmarks replace the location with home before mounting React', async () => {
  const { runInNewContext } = await import('node:vm');
  const entry = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');
  const guard = entry.slice(entry.indexOf('if ('), entry.indexOf('} else {') + 1);
  for (const pathname of ['/about', '/about/', '/', '/services', '/about-us']) {
    const redirects = [];
    runInNewContext(guard, { window: { location: { pathname, replace: (target) => redirects.push(target) } } });
    assert.deepEqual(redirects, ['/about', '/about/'].includes(pathname) ? ['/'] : []);
  }
  assert.match(entry, /} else \{\s+createRoot/);
});
