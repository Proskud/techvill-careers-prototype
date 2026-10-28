import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { companyScale, cultureFacts } from '../src/data/content.js';

const source = readFileSync(new URL('../src/Prototype.jsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const spaces = text => text.replaceAll('\u00a0', ' ');

test('October 19 employee metric and benefit copy match the requested correction', () => {
  assert.equal(companyScale.colleagues, 1000);
  assert.ok(spaces(source).includes('Кэшбэк 15% с покупок во ВкусВилле'));
  assert.ok(spaces(source).includes('body: ["Материальная поддержка. Помогаем в разных жизненных ситуациях"]'));
});

test('Only the 13 newly supplied culture facts remain, in their supplied order', () => {
  assert.deepEqual(cultureFacts, [
    'Если Антон Михайлов предложил пойти в поход — подумайте, готовы ли вы выживать',
    'В команде Mint & Mojito не разливают новичкам мохито, только старичкам',
    'ВкусТех? Мы — ТехВилл, но дадим шанс исправиться',
    'Мы работаем на удалёнке, но строго в рамках земной орбиты',
    'Если у тебя необычное хобби — с вероятностью 90% у кого-то в команде найдётся такое же',
    'Пробуем рабочие сценарии в магазинах и дарксторах, чтобы лучше понимать коллег',
    'Технологии выбираем по пользе, а не по моде',
    'Можно менять продукт и направление внутри ТехВилла',
    'Работали из разных мест: на Китайской стене, на фуникулёре в Сочи, в метро, в лесу, в сугробе в усадьбе Деда Мороза, на байке под ливнем на Бали',
    'Бежали Гонку героев, заняли пятнадцатое место среди ста команд, в команде был фламинго',
    'Несколько коллег настолько вдохновились котиками в корпоративном канале, что завели себе питомцев. Пёсопятницы тоже не остались без последствий',
    'Работаем удалённо, но для ценителей офлайна есть офис в Москве, коворкинги в Петербурге и Казани',
    'На рабочих созвонах замечены яблоки, бананы и другие фрукты. Всё по плану: это команды разработки',
  ]);
});

test('Two independent stories follow the company principle, retaining the supplied links', () => {
  const cards = source.slice(source.indexOf('function TechnologyStories()'), source.indexOf('function People()'));
  assert.ok(source.includes('<CompanyPrinciple /><TechnologyStories /><People />'));
  assert.equal((source.match(/<TechnologyStories \/>/g) || []).length, 1);
  assert.ok(cards.includes('<section className="technology-stories"'));
  assert.equal((cards.match(/<h2 /g) || []).length, 2);
  assert.equal((cards.match(/<article /g) || []).length, 2);
  assert.equal((cards.match(/href="https:\/\/habr.com\/p\/882212\/"/g) || []).length, 2);
  assert.equal((cards.match(/href="https:\/\/habr.com\/p\/981866\/"/g) || []).length, 1);
  assert.equal((cards.match(/rel="noopener noreferrer"/g) || []).length, 3);
  assert.ok(cards.includes('>гембу<'));
  assert.ok(cards.includes('>offline-first PWA<'));
  assert.ok(cards.includes('>MCP-сервер<'));
  const rule = css.match(/\.people-story \{([^}]+)\}/)?.[1];
  assert.ok(rule);
  assert.doesNotMatch(rule, /(?:^|;)\s*(?:height|block-size):/);
  assert.match(css, /\.people-stories \{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
});

test('Compact gallery has container-driven peeking cards and one-frame reduced-motion-aware navigation', () => {
  assert.match(css, /--film-width: calc\(\(100% - 3 \* var\(--film-gap\)\) \/ 3\.5\)/);
  assert.match(css, /@container team-gallery \(max-width: 900px\)/);
  assert.match(css, /@container team-gallery \(max-width: 600px\)/);
  assert.match(css, /aspect-ratio: 4 \/ 3/);
  assert.match(source, /frames\[1\]\.offsetLeft - frames\[0\]\.offsetLeft/);
  assert.match(source, /behavior: reducedMotion \? "auto" : "smooth"/);
  assert.equal((source.match(/<figure className="film-frame film-wide">/g) || []).length, 5);
  assert.doesNotMatch(source, /addEventListener\(["']wheel/);
});
