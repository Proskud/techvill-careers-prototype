import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { techCenters } from '../src/data/tech-centers.js';
import { techTeamGroups } from '../src/data/content.js';
import { heroFruitKinds } from '../src/experience/hero-flight.mjs';

const page = readFileSync(new URL('../src/Prototype.jsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const technology = page.slice(page.indexOf('function Technology()'), page.indexOf('function ArticleCard'));

test('directions follow the 28 October content sheet, with Information Security kept as the sixth card', () => {
  assert.deepEqual(techTeamGroups.map((group) => [group.area, group.icons]), [
    ['Мобильная разработка и исполнение заказа', ['apple', 'lychee']],
    ['Корпоративные сервисы и внутренний учёт', ['pineapple', 'raspberry']],
    ['Магазины, склады и логистика', ['mango']],
    ['AI и Data Science', ['coconut']],
    ['Инфраструктура, платформы, архитектура и техподдержка', ['banana', 'pomegranate', 'avocado']],
    ['Информационная безопасность', []],
  ]);
  assert.equal(techTeamGroups.find((group) => group.area === 'AI и Data Science').href, '/ai');
  assert.equal(techTeamGroups.find((group) => group.teams === 'Отдел ИБ').href, '/pentest');
  assert.deepEqual(techTeamGroups[4].stack, ['1С', 'SQL', 'Python', 'GitLab', 'Jenkins', 'k8s', 'MinIO', 'IaC', 'Kafka', 'Graylog', 'OpenSearch', 'Jaeger']);
});

test('every one of the nine fruit centers appears exactly once with its sheet role and text', () => {
  const used = techTeamGroups.flatMap((group) => group.icons);
  assert.equal(used.length, 9);
  assert.equal(new Set(used).size, 9);
  for (const key of used) {
    assert.ok(techCenters[key]?.label && techCenters[key]?.text, key);
    assert.ok(existsSync(new URL(`../public/assets/paper-fruits/${key}.jpg`, import.meta.url)), key);
  }
  assert.equal(techCenters.coconut.text, 'Реализуем внутренние проекты для бизнеса с помощью ML и AI');
  assert.equal(techCenters.avocado.role, 'Техническая поддержка');
  assert.equal(heroFruitKinds.length, 8);
  assert.ok(!heroFruitKinds.includes('raspberry'));
});

test('two-column cards keep fruits and titles visible and put details behind the native disclosure', () => {
  assert.match(css, /\.tech-grid \{ display: grid; grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(css, /@media \(max-width: 760px\) \{\s*\.tech-grid \{ grid-template-columns: minmax\(0, 1fr\);/);
  const title = technology.indexOf('<h3 className="tech-map-title">');
  const teamsAt = technology.indexOf('tech-card-teams');
  const descriptionAt = technology.indexOf('<p className="tech-card-description">{group.description}</p>');
  const contentAt = technology.indexOf('<AccordionContent ');
  const triggerAt = technology.indexOf('<AccordionTrigger heading={false}');
  assert.ok(title > -1 && title < teamsAt && teamsAt < descriptionAt && descriptionAt < triggerAt && triggerAt < contentAt, 'title → fruits → visible description → disclosure → team details');
  const trigger = technology.slice(triggerAt, technology.indexOf('</AccordionTrigger>'));
  assert.match(trigger, /Подробнее/);
  assert.match(trigger, /visually-hidden">: \{group\.area\}/);
  assert.match(css, /\.tech-card-actions \{ display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-block-start: auto; \}/);
  const teams = technology.slice(teamsAt, contentAt);
  assert.match(teams, /techCenters\[icon\]\.label/);
  const content = technology.slice(technology.indexOf('<AccordionContent '), technology.indexOf('</AccordionContent>'));
  for (const part of ['center.role', 'center.text', 'group.stack.map']) assert.ok(content.includes(part), part);
  assert.ok(!content.includes('group.description'), 'direction description stays outside the cut');
  assert.doesNotMatch(page, /TechCenterHint/);
});

test('home and /ai cards share one hover disclosure: whole card grows over the next row on wide pointers, «Подробнее» on touch', () => {
  const accordion = readFileSync(new URL('../src/AnimateAccordion.jsx', import.meta.url), 'utf8');
  const hook = readFileSync(new URL('../src/hooks/useHoverDisclosure.js', import.meta.url), 'utf8');
  const ai = readFileSync(new URL('../src/AiPage.jsx', import.meta.url), 'utf8');
  const aiCss = readFileSync(new URL('../src/ai.css', import.meta.url), 'utf8');
  assert.match(hook, /import \{ serviceValueHoverQuery \} from "\.\.\/data\/service-value-behavior\.mjs"/);
  assert.match(hook, /setExpanded\(hoverMode \? next\.slice\(-1\) : next\)/);
  assert.match(hook, /setTimeout\(\(\) => openCard\(id\), 90\)/);
  assert.match(hook, /event\.key === "Escape"/);
  for (const source of [technology, ai]) {
    assert.match(source, /useHoverDisclosure\(\)/);
    assert.match(source, /<AccordionContent variant="disclosure">/);
    assert.match(source, /disclosure-grid\$\{hoverMode \? " is-hover" : ""\}/);
  }
  assert.match(accordion, /const disclosureVariants = \{ collapsed: \{ height: 0, opacity: 0 \}, expanded: \{ height: "auto", opacity: 1 \} \};/);
  assert.match(accordion, /type: "spring", bounce: 0/);
  assert.match(accordion, /closest\("\.disclosure-card"\)/);
  assert.match(css, /\.disclosure-grid\.is-hover \.disclosure-card \{ margin-block-end: calc\(-1 \* var\(--drawer-h, 0px\)\); \}/);
  assert.doesNotMatch(css, /\.tech-map-accordion-content \{ position: absolute/);
  assert.match(css, /\.tech-grid\.is-hover \.tech-map-trigger \{ position: absolute; inline-size: 1px;/);
  assert.match(aiCss, /\.ai-directions-grid\.is-hover \.ai-direction-toggle \{ position: absolute; inline-size: 1px;/);
  assert.match(aiCss, /\.ai-directions-grid\.is-hover \.ai-direction > \.tech-map-accordion-heading \{ position: absolute; \}/);
  assert.match(aiCss, /\.ai-directions-grid\.is-hover \{ grid-auto-rows: auto; \}/);
  assert.match(aiCss, /\.ai-directions-grid :is\(\.ai-direction-copy > p, \.ai-direction-details p\) \{ max-inline-size: 70ch; \}/);
});

test('the /ai MCP card links «MCP‑сервер» to the same Habr article as the home story, with the shared marker link', async () => {
  const { aiDirections } = await import('../src/data/ai.js');
  const ai = readFileSync(new URL('../src/AiPage.jsx', import.meta.url), 'utf8');
  assert.deepEqual(aiDirections.find((item) => item.id === 'mcp').link, { text: 'MCP-сервер', href: 'https://habr.com/p/981866/' });
  assert.match(ai, /className="marker-link" href=\{link\.href\} target="_blank" rel="noopener noreferrer"/);
  assert.match(css, /\.people-story a, \.marker-link \{/);
});
