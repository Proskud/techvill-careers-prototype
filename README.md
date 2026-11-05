# ТехВилл — карьерный лендинг

Интерактивный прототип карьерного лендинга IT-команды ТехВилл.

## Что внутри

- Светлая брендовая визуальная система: графит, фиолетовый сигнал и lime-акценты.
- Первый-персональный рассказ о влиянии работы команды на покупателей ВкусВилла.
- Анимации GSAP и плавная прокрутка Lenis.
- Интерактивная Three.js-сцена с фруктами: клубника, лимон, черника и фруктовый микс.
- Адаптивный блок «Люди», фотогалерея команды и полный набор согласованных текстов и бенефитов.
- Проверенная production-сборка в `dist/` и материалы визуального QA в `qa/`.

## Стек

| Слой | Технологии |
| --- | --- |
| Интерфейс | React 19, JSX без TypeScript, собственный роутинг по `window.location.pathname` (без React Router) |
| Сборка | Vite 6 с `@vitejs/plugin-react` и двумя своими Babel-плагинами: типографика (неразрывные пробелы и дефисы) в `scripts/typography-plugin.mjs` и префикс путей для GitHub Pages в `scripts/base-path-plugin.mjs` |
| Стили | Обычный CSS с переменными (`src/styles.css` и CSS-файлы страниц), без Tailwind и CSS-in-JS; шрифт Montserrat из Google Fonts |
| Анимации | GSAP, Lenis (плавная прокрутка), Motion (раскрытие карточек) |
| 3D | Three.js, React Three Fiber, Drei — фрукты в первом экране и в блоке «Работа в ТехВилле» |
| Компоненты | Radix UI Accordion (раскрытие с клавиатуры и ARIA), иконки Phosphor |
| Тесты | Встроенный тест-раннер Node.js: `node --test tests/*.test.mjs` |
| Хостинг | GitHub Pages через GitHub Actions (`.github/workflows/pages.yml`, сборка `npm run build:pages`); для хостинга на воркере есть `worker/index.js` |

## Быстрый запуск

Требуется Node.js 20 или новее.

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

После запуска откройте `http://localhost:4173/`.

## Команды

```bash
npm run build       # production-сборка в dist/
npm run test:sites  # проверка упаковки для хостинга
node --test tests/*.test.mjs  # все тесты
```

## Передача в разработку

- `src/` — интерфейс, анимации и Three.js-сцены.
- `public/assets/` — фотографии и визуальные референсы.
- `dist/` — последняя собранная версия.
- `design-qa.md` и `qa/` — результаты визуальной проверки, состояния и сравнительные кадры.
