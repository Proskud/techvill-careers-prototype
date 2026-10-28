import test from "node:test";
import assert from "node:assert/strict";
import { bindShortWords } from "../src/data/typography.mjs";
import { transformSync } from "@babel/core";
import typographyPlugin from "../scripts/typography-plugin.mjs";
import { readFileSync } from "node:fs";
import { matchesVacancy } from "../src/data/vacancy-filters.mjs";
import { transformSync as transformJsx } from "esbuild";
import { runInNewContext } from "node:vm";

test("short words bind across regular and emphasized article copy", () => {
  assert.equal(bindShortWords("в Москве и Казани"), "в\u00a0Москве и\u00a0Казани");
  assert.equal(bindShortWords("с **коллегами**"), "с\u00a0**коллегами**");
  assert.equal(bindShortWords("Это IT-компания."), "Это IT‑компания.");
});

test("city and company names stay intact in every grammatical form", () => {
  assert.equal(bindShortWords("IT-компания, IT-компании, ИТ-компания"), "IT‑компания, IT‑компании, ИТ‑компания");
  assert.equal(bindShortWords("Санкт-Петербург, Санкт-Петербурге, Санкт-Петербурга"), "Санкт‑Петербург, Санкт‑Петербурге, Санкт‑Петербурга");
});

test("hyphenated job/technology names stay whole but URL spelling is unchanged", () => {
  assert.equal(bindShortWords('ML-программист, AI-технологии, веб-разработка'), 'ML‑программист, AI‑технологии, веб‑разработка');
  assert.equal(bindShortWords('Статья на https://example.test/IT-компания и в команде'), 'Статья на\u00a0https://example.test/IT-компания и\u00a0в\u00a0команде');
});

test("vacancy search accepts ordinary spaces and hyphens in typographically bound titles", () => {
  const job = { title: 'ML‑программист в\u00a0команде', direction: 'ai' };
  assert.equal(matchesVacancy(job, [], 'ML-программист в команде'), true);
});

test("short words bind before inline markup, quotes and at JSX text boundaries", () => {
  assert.equal(bindShortWords('Со мной и в «команде»'), 'Со\u00a0мной и\u00a0в\u00a0«команде»');
  assert.equal(bindShortWords('работаем с '), 'работаем с\u00a0');
  assert.equal(bindShortWords('Москве и Казани\nВ команде'), 'Москве и\u00a0Казани\nВ\u00a0команде');
  assert.equal(bindShortWords('директор, разработка, инициатива'), 'директор, разработка, инициатива');
});

test("Babel formats JSX, data and dynamic template copy without DOM observers", () => {
  const source = 'const data = {title: "Работа в IT-компании"}; const template = `Мы в ${city} и в команде`; const card = <p>Живём в <strong>Санкт-Петербурге</strong><input value="в поле" placeholder="Работа в команде" /></p>;';
  const result = transformSync(source, { configFile: false, babelrc: false, ast: true, parserOpts: { plugins: ['jsx'] }, plugins: [typographyPlugin], generatorOpts: { jsescOption: { minimal: true } } });
  // Babel may escape a NBSP as \xA0 in generated JS strings. Check the actual
  // parsed string value, and normalize that harmless encoding for JSX checks.
  assert.equal(result.ast.program.body[0].declarations[0].init.properties[0].value.value, 'Работа в\u00a0IT‑компании');
  assert.ok(result.code.includes('Мы в\u00a0${city} и\u00a0в\u00a0команде'));
  assert.ok(result.code.includes('Живём в\u00a0'));
  assert.ok(result.code.includes('Санкт‑Петербурге'));
  assert.ok(result.code.includes('value="в поле"'));
  assert.equal(result.ast.program.body[2].declarations[0].init.children[2].openingElement.attributes[1].value.expression.value, 'Работа в\u00a0команде');
});

test("real Babel-to-JSX compilation keeps accessibility names and placeholders as Unicode, not escape text", () => {
  const source = 'const node = <input aria-label="Поиск по названию" placeholder="Работа в команде" value="в поле" />; node;';
  const formatted = transformSync(source, { babelrc: false, configFile: false, parserOpts: { plugins: ['jsx'] }, plugins: [typographyPlugin] }).code;
  const compiled = transformJsx(formatted, { loader: 'jsx', jsxFactory: 'h' }).code;
  const node = runInNewContext(compiled, { h: (tag, props) => props });
  assert.equal(node['aria-label'], 'Поиск по\u00a0названию');
  assert.equal(node.placeholder, 'Работа в\u00a0команде');
  assert.equal(node.value, 'в поле');
  assert.doesNotMatch(node.placeholder, /\\[xu]/);
});

test("source URLs, route attributes, Markdown and tagged templates are preserved", () => {
  const source = 'const data = { href: "https://example.test/Работа-в-компании", content: "Статья в Москве ![фото](/assets/фото.jpg)" }; const raw = String.raw`в строке`; const link = <a href="/поиск в Москве">Ссылка на статью</a>;';
  const result = transformSync(source, { configFile: false, babelrc: false, parserOpts: { plugins: ['jsx'] }, plugins: [typographyPlugin] }).code;
  assert.ok(result.includes('https://example.test/Работа-в-компании'));
  assert.ok(result.includes('Статья в Москве ![фото](/assets/фото.jpg)'));
  assert.ok(result.includes('String.raw`в строке`'));
  assert.ok(result.includes('href="/поиск в Москве"'));
});

test("shared text styles balance titles and keep words intact in prose and forms", () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  const ai = readFileSync(new URL('../src/ai.css', import.meta.url), 'utf8');
  assert.match(css, /:where\(h1, h2, h3, h4, h5, h6, \.tech-map-title\) \{ text-wrap: balance;/);
  assert.match(css, /:where\(p, li, dt, dd, label, figcaption\) \{ text-wrap: pretty;/);
  assert.match(css, /\.contact-consent label, \.contact-newsletter \{ overflow-wrap: normal;/);
  assert.doesNotMatch(ai, /\.ai-hero h1 span \{[^}]*white-space: nowrap/);
});

test("known missing ё spellings are corrected in UI copy and the transferred article", () => {
  for (const file of ['ServicesPage.jsx', 'SecurityPage.jsx', 'ContactForms.jsx', 'data/newsArticle.js']) {
    const source = readFileSync(new URL('../src/' + file, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /(?<!\p{L})(включенные|создаем|создает|свое|черный|черного|защищенности|еще|прошел|подъема)(?!\p{L})/giu);
  }
});
test("binding is idempotent and retains words and punctuation", () => {
  const text = "Мы поехали на Алтай, но не одни.\nС друзьями!";
  const bound = bindShortWords(text);
  assert.equal(bindShortWords(bound), bound);
  assert.equal(bound.replaceAll("\u00a0", " "), text);
});
