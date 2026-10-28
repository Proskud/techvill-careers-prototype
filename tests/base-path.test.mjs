import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transformSync } from '@babel/core';
import basePathPlugin from '../scripts/base-path-plugin.mjs';

const run = (code, base) => transformSync(code, { plugins: [basePathPlugin(base)], parserOpts: { plugins: ['jsx'] }, babelrc: false, configFile: false }).code;

test('GitHub Pages builds prefix every root-relative site path with the repo folder', () => {
  const out = run('import x from "/src/a.js"; const a = "/assets/x.jpg", b = "/blog", c = "/", d = "/#technology", e = `/vacancies/${id}`, f = "//cdn.example/x", g = /\\/$/;', '/repo/');
  assert.match(out, /"\/repo\/assets\/x\.jpg"/);
  assert.match(out, /"\/repo\/blog"/);
  assert.match(out, /c = "\/repo\/"/);
  assert.match(out, /"\/repo\/#technology"/);
  assert.match(out, /`\/repo\/vacancies\/\$\{id\}`/);
  assert.match(out, /"\/\/cdn\.example\/x"/);
  assert.match(out, /from "\/src\/a\.js"/);
});

test('local and Sites builds at "/" are untouched; Pages build adds noindex robots, SPA 404 and no Jekyll', () => {
  assert.match(run('const a = "/blog";', '/'), /"\/blog"/);
  assert.equal(readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8'), 'User-agent: *\nDisallow: /\n');
  assert.match(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), /<meta name="robots" content="noindex, nofollow" \/>/);
  const pages = readFileSync(new URL('../scripts/prepare-pages-build.mjs', import.meta.url), 'utf8');
  assert.match(pages, /404\.html/);
  assert.match(pages, /\.nojekyll/);
  assert.match(readFileSync(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8'), /VITE_BASE: \/\$\{\{ github\.event\.repository\.name \}\}\//);
});
