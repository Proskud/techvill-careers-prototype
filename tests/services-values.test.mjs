import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/ServicesPage.jsx', import.meta.url), 'utf8');
const behavior = readFileSync(new URL('../src/data/service-value-behavior.mjs', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/services.css', import.meta.url), 'utf8');
const home = readFileSync(new URL('../src/Prototype.jsx', import.meta.url), 'utf8');
const homeCss = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('Services values retain all three exact supplied titles, teasers and full descriptions', () => {
  const expected = [
    'Включённые отношения',
    'Слышим, заботимся, действуем честно',
    'Принимаем решения на основе обратной связи, стремимся давать 101% искреннего сервиса и заботимся об удобстве людей. Честны в словах и поступках',
    'Технологии с заботой',
    'Создаём решения, удобные для людей',
    'Изучаем реальные потребности пользователей, проверяем гипотезы и внедряем полезные изменения, сохраняя стабильность сервисов. Автоматизируем рутину, чтобы уделять больше времени тому, что создаёт ценность для пользователя',
    'Технологии с умом',
    'Выбираем пользу, а не новизну',
    'Изучаем новые технологии и подходы, проверяем их на практике и оцениваем результат по метрикам. Начинаем с простых экспериментов и внедряем только то, что действительно приносит пользу',
  ];
  for (const text of expected) assert.ok(source.includes(JSON.stringify(text)), text);
  assert.ok(source.includes('id="services-values-title">Наши ценности</h2>'));
  assert.doesNotMatch(source, /Миллионы рублей|3 месяца|Технологии с\s+пользой/);
});

test('Service cards reuse AI disclosures with native keyboard controls and reduced-motion fade', () => {
  assert.ok(source.includes('name="services-values" className="ai-direction service-value"'));
  assert.ok(source.includes('initial={false} animate={{ opacity: open ? 1 : 0 }}'));
  assert.ok(source.includes('duration: reducedMotion ? 0 : 0.18'));
  assert.ok(behavior.includes("event.key !== 'Escape'"));
  assert.ok(behavior.includes("item.querySelector('summary')?.focus()"));
  assert.ok(source.includes('document.removeEventListener("pointerdown", closeOutside)'));
  assert.match(css, /repeat\(auto-fit, minmax\(min\(100%, 280px\), 1fr\)\)/);
  assert.match(css, /:is\(h2, h3\) \{ text-wrap: balance;/);
  assert.match(css, /\.services-values p \{ text-wrap: pretty;/);
});

test('Gallery controls precede photos and share the wide-screen description row', () => {
  const start = home.indexOf('<div className="people-life-intro"');
  const photos = home.indexOf('<div className="people-film-shell"', start);
  const controls = home.indexOf('<div className="people-film-controls"', start);
  assert.ok(start < controls && controls < photos);
  assert.equal((home.match(/className="people-film-controls"/g) || []).length, 1);
  assert.match(homeCss, /\.people-life-intro \.people-film-controls \{ grid-column: 2; grid-row: 2;/);
  assert.match(homeCss, /\.people-life-intro \.people-film-controls \{ grid-column: 1; grid-row: 3;/);
});
