import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { careerArticles } from "../src/data/content.js";
import { aiDirections } from "../src/data/ai.js";

const spaces = text => text.replaceAll("\u00a0", " ");
test("MCP direction retains the supplied full copy", () => {
  const mcp = aiDirections.find(item => item.id === "mcp");
  assert.equal(spaces(mcp.title), "MCP-сервер для заказа продуктов");
  assert.equal(spaces(mcp.description), "Открываем возможности ВкусВилла для AI-агентов: помогаем им находить товары и собирать продуктовые корзины напрямую через инструменты магазина");
  assert.equal(spaces(mcp.details[0]), "MCP-сервер позволяет AI-агентам взаимодействовать с каталогом ВкусВилла без имитации действий человека в браузере. Инструменты дают доступ к поиску и информации о товарах, аналогам, скидкам, рецептам и магазинам, а также помогают собрать корзину. Пользователь формулирует задачу, агент подбирает продукты, а готовую корзину остаётся открыть на сайте и подтвердить заказ.");
});
test("four home teasers and five Habr publications have real covers and original destinations", () => {
  assert.equal(careerArticles.filter(item => !item.blogOnly).slice(0, 4).length, 4);
  assert.equal(careerArticles.filter(item => item.external).length, 5);
  for(const article of careerArticles.filter(item => item.external)) {
    assert.match(article.href, /^https:\/\/habr\.com\/ru\/companies\/vkusvill\/articles\/\d+\/$/);
    assert.ok(existsSync(new URL(`../public${article.photo}`, import.meta.url)));
  }
});
test("footer legal activity paragraph is kept verbatim", () => {
  const source=readFileSync(new URL('../src/Prototype.jsx',import.meta.url),'utf8');
  assert.ok(source.includes("Коды видов деятельности в области информационных технологий, осуществляемых организацией, в соответствии с перечнем видов деятельности в области информационных технологий, утвержденным приказом Министерства цифрового развития, связи и массовых коммуникаций Российской Федерации от 11 мая 2023 г. N 449: 1.01, 1.03, 11.01."));
});

test('pentest copy: list items start with a capital, standalone paragraphs drop the final period, abbreviations spaced', () => {
  const page = readFileSync(new URL('../src/SecurityPage.jsx', import.meta.url), 'utf8').replace(/ /g, ' ');
  assert.doesNotMatch(page, /<li>[а-яё]/);
  assert.doesNotMatch(page, /"(внешние|внутренние|веб-сервисы|мобильные) /);
  assert.doesNotMatch(page, /[а-яё]{2}\.<\/p>/);
  assert.match(page, /и т\. д\.<\/p>/);
  assert.match(page, /\(в т\. ч\. сегментация\)/);
  assert.doesNotMatch(page, /х2/);
});
