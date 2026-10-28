import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const bento = readFileSync(new URL("../src/experience/PeopleBentoFruit.jsx", import.meta.url), "utf8");
const fruit = readFileSync(new URL("../src/experience/PeopleFruitCanvas.jsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

test("bento retains prepared canvases and renders at bounded rate only while visible", () => {
  assert.match(bento, /prepared && <Canvas/);
  assert.match(bento, /frameloop="demand"/);
  assert.match(bento, /scroll: false/);
  assert.match(bento, /if \(!visible \|\| reducedMotion\) return/);
  assert.match(bento, /setInterval\(invalidate, 1000 \/ 30\)/);
  assert.match(bento, /clearInterval\(timer\)/);
  assert.match(bento, /compileAsync\(scene, camera\)/);
  assert.ok(bento.indexOf("state.gl.render(state.scene, state.camera)") < bento.indexOf("firstFrame.current = true; onReady()"));
});

test("only bento opts into lighter bodies; default fruit quality and wireframes remain", () => {
  assert.match(fruit, /lightweight = false/);
  assert.match(fruit, /lightweight \? 32 : 48/);
  assert.match(fruit, /lightweight \? 24 : 40/);
  assert.match(fruit, /createFruitGeometry\(kind, 18, 14, cut\)/);
  assert.equal((bento.match(/<Fruit[^>]* lightweight/g) || []).length, 3);
});

test("facts never pull upward into the bento at any breakpoint", () => {
  assert.match(css, /\.people-stage > \.vibe-check \{ margin-block: 0 8vh; \}/);
  assert.doesNotMatch(css, /\.people-stage > \.vibe-check\s*\{[^}]*margin-block:\s*-/);
});

test("compact bento: lead card spans two rows beside a 2×2 grid, small fruits stay in a floated top corner", () => {
  assert.match(css, /\.people-bento \{ display: grid; grid-template-columns: minmax\(0, 1\.25fr\) repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.people-bento-card-0 \{[^}]*grid-row: span 2;/);
  assert.match(css, /:has\(\.people-bento-fruit\) \.people-bento-copy::before \{ content: ""; float: inline-end;/);
  assert.doesNotMatch(css, /\.people-bento-card-[134] \{[^}]*padding-(?:bottom|top|inline-start|block-end):/);
  assert.match(css, /\.people-bento-fruit-coconut \{ width: min\(230px, 72%\); aspect-ratio: 1; inset-inline-end: -20px; bottom: -12px; \}/);
  assert.doesNotMatch(css, /\.people-bento-card-0 \{[^}]*min-height: 740px/);
  assert.match(css, /\.people-bento-fruit-apple \{ position: relative; flex: none; align-self: flex-end; width: min\(430px, 125%\)/);
  assert.match(css, /\.people-bento-card-0 \{ display: flex; flex-direction: column; gap: 16px;/);
});
