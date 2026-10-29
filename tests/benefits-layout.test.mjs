import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/Prototype.jsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('every benefits tab controls its own always-mounted panel; inactive panels are inert', () => {
  assert.match(source, /aria-controls=\{`benefit-panel-\$\{groupIndex\}`\}/);
  assert.match(source, /id=\{`benefit-panel-\$\{groupIndex\}`\}/);
  assert.match(source, /inert=\{!isActive\}/);
  assert.match(css, /\.people-benefit-panel \{\s*display: flex;\s*grid-area: 1 \/ 1;/);
  assert.match(css, /\.people-benefit-panel:not\(\.is-active\) \{\s*visibility: hidden;/);
});

test('figures missing from the card copy stay readable by screen readers', () => {
  assert.match(source, /aria-hidden=\{card\.spoken \? undefined : "true"\}/);
  for (const display of ['50\\W000\\W₽', 'УДАЛЁННО', 'ОФИС']) {
    assert.match(source, new RegExp(`display: "${display}", spoken: true`));
  }
  assert.doesNotMatch(source, /people-benefit-card-meta/);
});

test('phones show all four categories as a 2×2 grid instead of a hidden horizontal scroller', () => {
  assert.match(css, /\.people-benefit-tabs \{ display: grid; grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.doesNotMatch(css, /\.people-benefit-tabs \{[^}]*overflow-x: auto/);
  assert.doesNotMatch(css, /\.people-benefit-card\.is-lead \{ min-height: 260px; \}/);
  const block = css.slice(css.indexOf('.people-benefit-display {'), css.indexOf('@keyframes benefit-panel-in'));
  assert.doesNotMatch(block, /line-height: \d+px/);
});

test('home blog teasers: three-line titles, touch-safe hover, stacked covers on narrow phones, 44px blog link', () => {
  assert.match(css, /\.home-article-list \.career-article-copy h3 \{ display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden; overflow-wrap: break-word; \}/);
  assert.match(css, /@media \(hover: hover\) \{ \.career-article-card:hover \{ border-color: var\(--lime\); \} \}/);
  assert.doesNotMatch(css, /^\.career-article-card:hover,/m);
  assert.match(css, /@media \(max-width: 420px\) \{\s*\.home-article-list \.career-article-card \{ grid-template-columns: minmax\(0, 1fr\); \}/);
  assert.match(css, /\.article-blog-link \{[^}]*min-height: 44px;/);
});

test('blog uses only format tags «Читать» / «Смотреть», the page is titled «Блог» and grid titles stop at three lines', async () => {
  const { articleTags, careerArticles } = await import('../src/data/content.js');
  assert.deepEqual(articleTags, [{ id: 'read', label: 'Читать' }, { id: 'watch', label: 'Смотреть' }]);
  assert.ok(careerArticles.every((article) => ['read', 'watch'].includes(article.tag)));
  assert.match(source, /<h1 id="blog-title">Блог<\/h1>/);
  assert.match(source, /className="blog-empty">Видео скоро появятся</);
  assert.match(css, /\.blog-page \.career-article-copy h3 \{ display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;/);
  assert.match(css, /\.blog-page \.article-source \{ align-self: end; \}/);
  assert.doesNotMatch(css, /\.tag-(?:products|technology|team|growth) \{/);
});

test('vacancies: no subtitle under «Вакансии»; the selected company tab is white with a deep-purple ring, not lime', () => {
  assert.doesNotMatch(source, /Работа в[  ]ТехВилле и[  ]Кибершефе/);
  assert.match(css, /\.vacancy-company-tabs button\[aria-selected="true"\] \{ background: white; border-color: var\(--purple-deep\);/);
  assert.doesNotMatch(css, /\.vacancy-company-tabs button\[aria-selected="true"\] \{ background: var\(--lime\)/);
});

test('company switch is compact with concentric radii, 150ms state transitions and a reduced-motion-gated press', () => {
  assert.match(css, /\.vacancy-company-tabs \{[^}]*gap: 6px; max-width: 520px;[^}]*padding: 6px;[^}]*border-radius: 23px; \}/);
  assert.match(css, /\.vacancy-company-tabs button \{[^}]*min-height: 64px;[^}]*border-radius: 16px;[^}]*transition: background-color 150ms ease-out, border-color 150ms ease-out, box-shadow 150ms ease-out, scale 150ms ease-out; \}/);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{ \.vacancy-company-tabs button:active \{ scale: 0\.96; \} \}/);
});

test('vacancies keep only the title search, centred under the company switch at the same 520px width', () => {
  assert.doesNotMatch(source, /job-direction-filters|Все направления|setDirections/);
  assert.match(source, /<span role="status">\{vacancyCountLabel\(visibleJobs\.length\)\} · \{item\.label\}<\/span>/);
  assert.match(source, /Сбросить поиск/);
  assert.match(css, /\.job-filters \{ display: flex; justify-content: center; max-width: 520px; margin: 0 auto 40px; \}/);
  assert.match(css, /\.vacancy-company-tabs \{[^}]*max-width: 520px; margin: 0 auto 12px;/);
});

test('vacancy page: heading + sticky summary card with salary when known; talent form asks for surname', () => {
  const forms = readFileSync(new URL('../src/ContactForms.jsx', import.meta.url), 'utf8');
  assert.match(source, /<aside className="job-summary" aria-label="Коротко о вакансии">/);
  assert.match(source, /\{salaryLabel\(job\) && <p className="job-salary">/);
  assert.doesNotMatch(source, /job-detail-tags/);
  assert.match(css, /\.job-detail-layout \{[^}]*grid-template-columns: minmax\(0, 1fr\) 320px;/);
  assert.match(css, /\.job-summary \{[^}]*position: sticky;/);
  assert.match(forms, /talent && field\("surname", "Фамилия", \{ required: true, autoComplete: "family-name" \}\)/);
});

test('vacancy form sits in the copy column and takes either a resume file or a link', () => {
  const forms = readFileSync(new URL('../src/ContactForms.jsx', import.meta.url), 'utf8');
  assert.match(css, /grid-template-areas: "heading summary" "body summary" "form summary";/);
  assert.match(css, /\.job-detail-page \.job-application \{ grid-area: form;/);
  assert.match(source, /<TalentApplication job=\{job\} \/>\n\s*<\/div>/);
  assert.match(forms, /\[\["file", "Файл"\], \["link", "Ссылка"\]\]/);
  assert.match(forms, /name="resumeUrl" type="url"/);
  assert.match(forms, /input\.type !== "radio"/);
});
