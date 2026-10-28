import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const original = read('public/assets/logo-tech-brandbook.svg');
const light = read('public/assets/logo-tech-brandbook-light.svg');

test('brandbook geometry and mark colors are unchanged; only lettering is recolored', () => {
  assert.equal(light.replace(/<style>.*?<\/style>\n/, ''), original);
  assert.match(light, /path\[fill="white"\] \{ fill: #17171b; \}/);
  assert.match(light, /viewBox="0 0 378 52"/);
  assert.doesNotMatch(light, /<script|<foreignObject|\son\w+=|href=/i);
});

test('independently sized mark and lettering preserve all brandbook path geometry', () => {
  const paths = (svg) => [...svg.matchAll(/<path[^>]*>/g)].map((match) => match[0]);
  const mark = read('public/assets/logo-tech-brandbook-mark.svg');
  const wordmark = read('public/assets/logo-tech-brandbook-wordmark.svg');
  assert.deepEqual(paths(mark), paths(original));
  assert.deepEqual(paths(wordmark), paths(original));
  assert.match(mark, /viewBox="0 0 52 52"/);
  assert.match(wordmark, /viewBox="63 0 315 52"/);
});

test('shared brand uses original vector mark and lettering with accessible home navigation', () => {
  const source = read('src/Prototype.jsx');
  const component = source.slice(source.indexOf('function Brand()'), source.indexOf('function Header('));
  assert.match(component, /aria-label="ТехВилл — на главную"/);
  assert.match(component, /logo-tech-brandbook-mark\.svg/);
  assert.match(component, /logo-tech-brandbook-wordmark\.svg/);
  assert.doesNotMatch(component, /<span>ТЕХВИЛЛ<\/span>/);
});
