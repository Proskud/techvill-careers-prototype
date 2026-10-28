import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CaretDown,
  List,
  MagnifyingGlass,
  ShieldCheck,
  Shuffle,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { useReducedMotion } from "./hooks/useReducedMotion.js";
import { articleTags, careerArticles, companyPrinciple, companyScale, cultureFacts, jobs, techTeamGroups } from "./data/content.js";
import { ArticleDetail } from "./ArticleDetail.jsx";
import { AiPage } from "./AiPage.jsx";
import { ServicesPage } from "./ServicesPage.jsx";
import { SecurityPage } from "./SecurityPage.jsx";
import { ContactBanner, TalentApplication } from "./ContactForms.jsx";
import { directionLabel, matchesVacancy, salaryLabel, vacancyCountLabel, vacancyDirections } from "./data/vacancy-filters.mjs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./AnimateAccordion.jsx";
import { techCenters } from "./data/tech-centers.js";
import { serviceValueHoverQuery } from "./data/service-value-behavior.mjs";
import { FooterSocials } from "./FooterSocials.jsx";

const ExperienceCanvas = lazy(() => import("./experience/ExperienceCanvas.jsx").then((module) => ({ default: module.ExperienceCanvas })));
const PeopleBentoFruit = lazy(() => import("./experience/PeopleBentoFruit.jsx").then((module) => ({ default: module.PeopleBentoFruit })));
const HeroFruitCanvas = lazy(() => import("./experience/HeroFruitCanvas.jsx").then((module) => ({ default: module.HeroFruitCanvas })));

gsap.registerPlugin(ScrollTrigger);

function Brand() {
  return (
    <a className="brand" href="/" aria-label="ТехВилл — на главную">
      <img className="brand-mark" src="/assets/logo-tech-brandbook-mark.svg" alt="" width="52" height="52" />
      <img className="brand-wordmark" src="/assets/logo-tech-brandbook-wordmark.svg" alt="" width="315" height="52" />
    </a>
  );
}

function Header({ isVacanciesPage = false, isBlogPage = false, isAiPage = false }) {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const frame = window.requestAnimationFrame(() => document.querySelector("#site-navigation a")?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${compact ? "is-compact" : ""}`}>
      <Brand />
      <nav id="site-navigation" className={menuOpen ? "is-open" : ""} aria-label="Основная навигация" onClick={() => setMenuOpen(false)} onKeyDown={(event) => { if (event.key === "Escape") { setMenuOpen(false); document.getElementById("site-menu-toggle")?.focus(); } }}>
        <a href="/blog" aria-current={isBlogPage ? "page" : undefined}>Блог</a>
        <a href="/#technology">Команды</a>
        <a href="/ai" aria-current={isAiPage ? "page" : undefined}>AI в ТехВилле</a>
        <a href="/vacancies" aria-current={isVacanciesPage ? "page" : undefined}>Вакансии</a>
      </nav>
      <a className="button button-small button-lime" href={isVacanciesPage ? (window.location.pathname.replace(/\/$/, "") === "/vacancies" ? "#vacancies" : "#application") : "/vacancies"}>
        Хочу в команду <ArrowRight weight="bold" />
      </a>
      <button className="site-menu-toggle" id="site-menu-toggle" type="button" aria-controls="site-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen((open) => !open)} onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }}>{menuOpen ? <X /> : <List />}</button>
    </header>
  );
}

function WordReveal({ children, className = "" }) {
  const words = String(children).split(" ");
  return (
    <span className={`word-reveal ${className}`} data-reveal-words>
      {words.map((word, index) => (
        <span className="word" key={`${word}-${index}`}>{word}{index < words.length - 1 ? " " : ""}</span>
      ))}
    </span>
  );
}

function usePageMotion(rootRef, reducedMotion, isVacanciesPage) {
  useEffect(() => {
    const hashTarget = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
    if (reducedMotion) {
      const frame = hashTarget ? window.requestAnimationFrame(() => hashTarget.scrollIntoView({ block: "start", behavior: "instant" })) : null;
      return () => { if (frame !== null) window.cancelAnimationFrame(frame); };
    }

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false, wheelMultiplier: 0.86 });
    const onLenisScroll = () => ScrollTrigger.update();
    const tick = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", onLenisScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const hashFrame = hashTarget ? window.requestAnimationFrame(() => lenis.scrollTo(hashTarget, { immediate: true })) : null;

    const ctx = gsap.context(() => {
      if (!isVacanciesPage) gsap.from("[data-hero-line]", {
        opacity: 0,
        y: 52,
        filter: "blur(7px)",
        duration: 0.76,
        stagger: 0.09,
        ease: "power4.out",
        delay: 0.18,
      });

      if (!isVacanciesPage) gsap.from(".hero-photo", {
        clipPath: "inset(14% 10% 18% 10% round 60px)",
        scale: 1.08,
        duration: 1.35,
        ease: "power4.out",
        delay: 0.1,
      });

      gsap.utils.toArray("[data-reveal-line]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 30,
          filter: "blur(6px)",
          duration: 0.76,
          ease: "power4.out",
          scrollTrigger: { trigger: element, start: "top 82%", once: true },
        });
      });

      gsap.utils.toArray("[data-reveal-words]").forEach((element) => {
        gsap.from(element.querySelectorAll(".word"), {
          opacity: 0,
          y: 8,
          duration: 0.7,
          stagger: 0.07,
          ease: "power4.out",
          scrollTrigger: { trigger: element, start: "top 84%", once: true },
        });
      });

      gsap.utils.toArray(".people-story").forEach((card, index) => {
        gsap.timeline({ delay: index * 0.12, scrollTrigger: { trigger: card, start: "top 86%", once: true } })
          .from(card, { opacity: 0, y: 40, duration: 0.8, ease: "power4.out", clearProps: "opacity,transform" })
          .from(card.querySelector(".people-story-portrait"), { yPercent: 24, opacity: 0, duration: 0.9, ease: "power3.out", clearProps: "opacity,transform" }, "<0.14")
          .from(card.querySelectorAll(".people-story-copy > *"), { opacity: 0, y: 12, filter: "blur(4px)", duration: 0.3, stagger: 0.1, ease: "power1.out", clearProps: "opacity,transform,filter" }, "<0.1");
      });

      gsap.utils.toArray("[data-parallax]").forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

    }, rootRef);

    return () => {
      if (hashFrame !== null) window.cancelAnimationFrame(hashFrame);
      ctx.revert();
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, [reducedMotion, rootRef, isVacanciesPage]);
}

function Hero() {
  const pointer = useRef({ x: 0, y: 0, active: false });
  const flightRoot = useRef(null);
  const [visible, setVisible] = useState(true);
  const [turn, setTurn] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(flightRoot.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={flightRoot} className="hero" id="top" onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); pointer.current = { x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height, active: event.pointerType !== "touch" }; }} onPointerLeave={() => { pointer.current.active = false; }}>
      <div className="hero-copy">
        <h1>
          <span data-hero-line>Привет, это</span>
          <span className="accent-line" data-hero-line>ТехВилл!</span>
        </h1>
        <p data-hero-line>
          Мы — айтишка ВкусВилла. Здесь про людей, фрукты и технологии
        </p>
        <div className="hero-actions" data-hero-line>
          <a className="button button-lime" href="#people">О команде <ArrowDown /></a>
          <a className="text-link" href="/vacancies">Смотреть вакансии <ArrowRight /></a>
        </div>
      </div>
      <div className="hero-visual">
        <img className="hero-photo" src="/assets/rut/rut-hero-white.jpg" alt="Белый Рут соединяет код на ноутбуке с клубничкой — технологию с пользой для покупателя" width="1122" height="1402" fetchPriority="high" />
      </div>
        <div className="hero-fruit hero-fruit-field">
          <div className="hero-fruit-object" aria-hidden="true"><Suspense fallback={null}><HeroFruitCanvas pointer={pointer} turn={turn} reducedMotion={reducedMotion} visible={visible} /></Suspense></div>
          <div className="hero-fruit-control" role="group" tabIndex={0} aria-label="3D-фрукты команд. Для поворота используй стрелки влево и вправо" aria-keyshortcuts="ArrowLeft ArrowRight" onKeyDown={(event) => { if (["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); setTurn((current) => current + (event.key === "ArrowRight" ? 1 : -1)); } }} />
        </div>
    </section>
  );
}

function Mission() {
  return (
    <section className="mission chapter" id="impact" aria-labelledby="mission-title">
      <div className="mission-copy">
        <h2 id="mission-title" data-reveal-line>Создаём цифровые продукты для ВкусВилла</h2>
        <p>Разрабатываем приложения и сервисы, чтобы покупателям было проще заказывать полезные продукты, а коллегам — выполнять свою работу.</p>
      </div>
      <dl className="mission-stats" aria-label="Продукты и масштаб ТехВилла">
        <div className="mission-stat">
          <dt>Приложение доставки ВкусВилл №1 по версии Рунет</dt>
          <dd className="mission-stat-value">№1</dd>
        </div>
        <div className="mission-stat mission-stat-users">
          <dt>Пользователей, которые заказывают доставку каждый день</dt>
          <dd className="mission-stat-value">{companyScale.dailyUsers.toLocaleString("ru-RU")}</dd>
        </div>
        <div className="mission-stat">
          <dt>Курьеров доставляют заказы ежедневно через мобильное приложение</dt>
          <dd className="mission-stat-value">{companyScale.couriers.toLocaleString("ru-RU")}+</dd>
        </div>
        <div className="mission-stat">
          <dt>Сотрудников в команде</dt>
          <dd className="mission-stat-value">{companyScale.colleagues.toLocaleString("ru-RU")} +</dd>
        </div>
      </dl>
    </section>
  );
}

function TeamNews() {
  const [factIndex, setFactIndex] = useState(0);
  const nextFact = () => setFactIndex((current) => (current + 1) % cultureFacts.length);

  return (
      <div className="vibe-check">
        <div>
          <span className="mini-label"><Sparkle weight="fill" /> Рандомные факты</span>
          <p key={factIndex}>{cultureFacts[factIndex]}</p>
        </div>
        <button type="button" onClick={nextFact}>Перемешать <Shuffle weight="bold" /></button>
      </div>
  );
}

function CompanyPrinciple() {
  return (
    <section className="company-principle" id="principle" aria-labelledby="company-principle-title">
      <h2 id="company-principle-title">100% технологичный <span>100% человечный</span></h2>
      <p className="company-principle-copy" data-reveal-line>
        {companyPrinciple.sentences.map((sentence) => (
          <span key={sentence.accent}><strong>{sentence.accent}</strong>{sentence.text}</span>
        ))}
      </p>
    </section>
  );
}

const peoplePromises = [
  {
    fruit: "Яблоко",
    sceneIndex: 0,
    title: "Разработка экосистемы ВкусВилл",
    text: "Создаём удобные сервисы для покупателей, курьеров, сборщиков и партнёров: приложения, личные кабинеты и платежи. Клиентское приложение отмечено Премией Рунета в 2023 году",
  },
  {
    fruit: "Манго",
    sceneIndex: 1,
    title: "Культура технологий и здравого смысла",
    text: "Внедряем смелые технологические решения, если видим в них пользу для бизнеса. Пробуем себя в роли сотрудников офлайн-магазинов и дарксторов, чтобы знать, что действительно важно для наших клиентов, курьеров, сборщиков и поставщиков",
  },
  {
    fruit: "Кокос",
    sceneIndex: 2,
    title: "IT со вкусом к жизни",
    text: "С нами ты сможешь самостоятельно управлять своим work-life балансом, ведь мы ценим твоё личное время",
  },
  {
    fruit: "Яблоко · Манго · Кокос",
    sceneIndex: 3,
    title: "Есть стремление — даём возможности",
    text: "У нас прозрачная система развития в компании: понятные грейды, индивидуальные планы развития и матрицы компетенций дают реальную возможность вырасти в течение года. 30% сотрудников повысили свой грейд в 2024 году.",
  },
  {
    fruit: "Это — ТехВилл",
    sceneIndex: 4,
    title: "Команда, где ты найдёшь помощь и взаимопонимание",
    text: "Ты получишь поддержку на всех уровнях, а ещё почувствуешь, что здесь нет «тех, к кому лучше не обращаться»",
  },
];

const peopleBenefitGroups = [
  {
    title: "Бонусы",
    cards: [
      { display: "IT", body: ["Мы — аккредитованная IT‑компания"], tone: "lead", scale: "monogram", copySize: "hero" },
      { display: "15%", body: ["Кэшбэк 15% с покупок во ВкусВилле"], tone: "lime", scale: "xl", copySize: "large" },
      { display: "50 000 ₽", spoken: true, body: ["За рекомендации знакомых специалистов"], tone: "soft", scale: "large", copySize: "medium" },
    ],
  },
  {
    title: "Здоровье и забота",
    cards: [
      { display: "ЗАБОТА", body: ["Компенсируем расходы на услуги врачей", "Покрываем консультации с психологом", "Поощряем донорство"], tone: "lead", scale: "hero", copySize: "lead-medium" },
      { display: "СПОРТ", body: ["Возмещаем расходы на спорт"], tone: "lime", scale: "medium", copySize: "small" },
      { display: "ПОМОЩЬ", body: ["Материальная поддержка. Помогаем в разных жизненных ситуациях"], tone: "soft", scale: "medium", copySize: "small" },
    ],
  },
  {
    title: "Формат работы",
    cards: [
      { display: "УДАЛЁННО", spoken: true, body: ["Самостоятельно управляем своим work-life балансом"], tone: "lead", scale: "lead-compact", copySize: "lead-large" },
      { display: "ОФИС", spoken: true, body: ["Для тех, кто хочет видеться офлайн"], tone: "lime", scale: "large", copySize: "medium" },
    ],
  },
  {
    title: "Старт и инструменты",
    cards: [
      { display: "WELCOME", body: ["Дарим новичкам welcome-pack с шопером, книгой про ВкусВилл и кейкап-брелоком"], tone: "lead", scale: "lead-welcome", copySize: "lead-large" },
      { display: "AI", body: ["Компенсируем стоимость услуг AI-помощников"], tone: "lime", scale: "large", copySize: "medium" },
    ],
  },
];

function TechnologyStories() {
  return (
    <section className="technology-stories" id="technology-stories" aria-label="Технологии с заботой и умом">
      <div className="people-stories">
        <article className="people-story is-care" aria-labelledby="people-care-title">
          <div className="people-story-copy">
          <h2 id="people-care-title">Технологии с заботой</h2>
          <p>Ходим в <a href="https://habr.com/p/882212/" target="_blank" rel="noopener noreferrer">гембу<span className="visually-hidden"> — статья на Habr, откроется в новой вкладке</span></a>, пробуем себя в роли курьеров и сотрудников магазинов, чтобы увидеть процессы глазами пользователей. Так мы создали первый в России <a href="https://habr.com/p/882212/" target="_blank" rel="noopener noreferrer">offline-first PWA<span className="visually-hidden"> — статья на Habr, откроется в новой вкладке</span></a> для курьерской доставки.</p>
          </div>
          <div className="people-story-portrait" aria-hidden="true"><img src="/assets/stories/care-person.webp" alt="" width="768" height="740" loading="lazy" decoding="async" /></div>
        </article>
        <article className="people-story" aria-labelledby="people-purpose-title">
          <div className="people-story-copy">
          <h2 id="people-purpose-title">Технологии с умом</h2>
          <p>Не гонимся за инновациями ради новизны, а выбираем то, что приносит пользу. Например, запустили <a href="https://habr.com/p/981866/" target="_blank" rel="noopener noreferrer">MCP-сервер<span className="visually-hidden"> — статья на Habr, откроется в новой вкладке</span></a>, который позволяет AI-агенту находить товары, изучать состав и КБЖУ и собирать корзину без лишних действий.</p>
          </div>
          <div className="people-story-portrait" aria-hidden="true"><img src="/assets/stories/mind-person.webp" alt="" width="768" height="740" loading="lazy" decoding="async" /></div>
        </article>
      </div>
    </section>
  );
}

function People() {
  const filmRef = useRef(null);
  const benefitTabsRef = useRef([]);
  const reducedMotion = useReducedMotion();
  const [activeBenefitGroup, setActiveBenefitGroup] = useState(0);


  const moveFilm = (direction) => {
    const film = filmRef.current;
    if (!film) return;
    const frames = film.querySelectorAll(".film-frame");
    const step = frames.length > 1 ? frames[1].offsetLeft - frames[0].offsetLeft : film.clientWidth;
    film.scrollBy({ left: direction * step, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const moveBenefitTab = (event, index) => {
    const lastIndex = peopleBenefitGroups.length - 1;
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index === lastIndex ? 0 : index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index === 0 ? lastIndex : index - 1;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = lastIndex;
    else return;

    event.preventDefault();
    setActiveBenefitGroup(nextIndex);
    benefitTabsRef.current[nextIndex]?.focus();
  };

  return (
    <section className="people-stage chapter" id="people" aria-labelledby="people-title">
      <div className="people-intro">
        <h2 id="people-title" data-reveal-line>Работа в ТехВилле</h2>
      </div>
      <div className="people-bento" aria-label="Принципы работы в ТехВилле">
          {peoplePromises.map((promise, index) => (
            <article
              className={`people-bento-card people-bento-card-${index}`}
              key={promise.title}
            >
              <div className="people-bento-copy">
                <h3>{promise.title}</h3>
                <p>{promise.text}</p>
              </div>
              {index !== 3 && <Suspense fallback={null}><PeopleBentoFruit kind={["apple", "mango", "coconut", null, "mix"][index]} label={promise.title} reducedMotion={reducedMotion} /></Suspense>}
            </article>
          ))}
      </div>
      <TeamNews />
      <div className="people-life-intro" data-reveal-line>
        <h3>Наша жизнь</h3>
        <p>Работаем удалённо и делимся друг с другом видами из разных городов и стран. А для любителей офлайна у нас есть офис в Москве и коворкинги в Москве, Санкт‑Петербурге и Казани</p>
        <div className="people-film-controls" aria-label="Навигация по галерее">
          <span id="people-film-help" className="visually-hidden">Галерею можно прокручивать по горизонтали или переключать стрелками</span>
          <button type="button" onClick={() => moveFilm(-1)} aria-label="Предыдущее фото"><ArrowLeft weight="bold" /></button>
          <button type="button" onClick={() => moveFilm(1)} aria-label="Следующее фото"><ArrowRight weight="bold" /></button>
        </div>
      </div>
      <div className="people-film-shell" id="team-gallery">
        <div
          className="people-film"
          ref={filmRef}
          role="region"
          aria-label="Жизнь команды ТехВилла в фотографиях. Горизонтальная галерея"
          aria-describedby="people-film-help"
          tabIndex="0"
        >
          <figure className="film-frame film-wide">
            <img src="/assets/team-life/work-together.jpg" alt="Коллеги за общим столом с ноутбуками" width="1600" height="1195" loading="lazy" decoding="async" />
            <figcaption>Это мы в коворкинге в Питере</figcaption>
          </figure>
          <figure className="film-frame film-wide">
            <img src="/assets/team-life/run-it-2026.jpg" alt="Команда ТехВилл с флагами на забеге RUN IT" width="2000" height="1500" loading="lazy" decoding="async" />
            <figcaption>Это мы на забеге RUN IT</figcaption>
          </figure>
          <figure className="film-frame film-wide">
            <img src="/assets/team-life/team-event.jpg" alt="Коллеги с флагами ТехВилл и ВкусВилл на спортивной площадке" width="1280" height="960" loading="lazy" decoding="async" />
            <figcaption>Это мы на гонке героев</figcaption>
          </figure>
          <figure className="film-frame film-wide">
            <img src="/assets/team-life/talk.jpg" alt="Коллега выступает с микрофоном на сцене" width="1280" height="853" loading="lazy" decoding="async" />
            <figcaption>Это мы на конференциях выступаем</figcaption>
          </figure>
          <figure className="film-frame film-wide">
            <img src="/assets/team-life/altai.jpg" alt="Коллеги в лесу во время поездки на Алтай" width="1600" height="900" loading="lazy" decoding="async" />
            <figcaption>Это мы ходили в поход на Алтай</figcaption>
          </figure>
        </div>
      </div>
      <section className="people-benefits" id="benefits" aria-labelledby="people-benefits-title">
        <div className="people-benefits-heading">
          <h3 id="people-benefits-title">Мы предлагаем</h3>
        </div>
        <div className="people-benefits-content">
          <div className="people-benefit-tabs" role="tablist" aria-label="Категории поддержки">
            {peopleBenefitGroups.map((group, groupIndex) => (
              <button
                key={group.title}
                ref={(node) => { benefitTabsRef.current[groupIndex] = node; }}
                type="button"
                role="tab"
                id={`benefit-tab-${groupIndex}`}
                aria-selected={activeBenefitGroup === groupIndex}
                aria-controls={`benefit-panel-${groupIndex}`}
                tabIndex={activeBenefitGroup === groupIndex ? 0 : -1}
                className={activeBenefitGroup === groupIndex ? "is-active" : ""}
                onClick={() => setActiveBenefitGroup(groupIndex)}
                onKeyDown={(event) => moveBenefitTab(event, groupIndex)}
              >
                <strong>{group.title}</strong>
              </button>
            ))}
          </div>
          {/* All panels share one grid cell, so the block keeps the tallest panel's height on desktop. */}
          <div className="people-benefit-panels">
            {peopleBenefitGroups.map((group, groupIndex) => {
              const isActive = activeBenefitGroup === groupIndex;
              return (
                <section
                  key={group.title}
                  className={`people-benefit-panel${isActive ? " is-active" : ""}`}
                  id={`benefit-panel-${groupIndex}`}
                  role="tabpanel"
                  aria-labelledby={`benefit-tab-${groupIndex}`}
                  tabIndex={isActive ? 0 : -1}
                  inert={!isActive}
                >
                  <div className={`people-benefit-composition has-${group.cards.length}-cards`}>
                    {group.cards.map((card) => (
                      <article className={`people-benefit-card is-${card.tone} scale-${card.scale} copy-${card.copySize}`} key={card.display}>
                        <strong className="people-benefit-display" aria-hidden={card.spoken ? undefined : "true"}>{card.display}</strong>
                        <div className="people-benefit-copy">
                          {card.body.map((line) => <p key={line}>{line}</p>)}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
}

function Technology() {
  const [hoverMode, setHoverMode] = useState(() => typeof window !== "undefined" && window.matchMedia(serviceValueHoverQuery).matches);
  const [expanded, setExpanded] = useState([]);
  const closeTimer = useRef(null);
  const openTimer = useRef(null);
  useEffect(() => {
    const query = window.matchMedia(serviceValueHoverQuery);
    const sync = () => { setHoverMode(query.matches); setExpanded([]); };
    query.addEventListener("change", sync);
    return () => { query.removeEventListener("change", sync); clearTimeout(closeTimer.current); clearTimeout(openTimer.current); };
  }, []);
  // Wide pointer layouts open one overlay panel on hover or keyboard focus; touch and narrow layouts keep the «Подробнее» button.
  useEffect(() => {
    if (!hoverMode || !expanded.length) return undefined;
    const onKey = (event) => { if (event.key === "Escape") setExpanded([]); };
    const onPointer = (event) => { if (!event.target.closest?.(".tech-card[data-state='open']")) setExpanded([]); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, [hoverMode, expanded]);
  const openCard = (area) => { clearTimeout(closeTimer.current); clearTimeout(openTimer.current); setExpanded([area]); };
  const hoverProps = (group) => (!hoverMode || !(group.icons.length || group.stack.length)) ? {} : {
    // A short intent delay keeps a pointer that merely crosses the grid from flashing panels open.
    onPointerEnter: (event) => {
      if (event.pointerType !== "mouse") return;
      clearTimeout(closeTimer.current);
      clearTimeout(openTimer.current);
      openTimer.current = setTimeout(() => openCard(group.area), 90);
    },
    onPointerLeave: (event) => {
      const card = event.currentTarget;
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => { if (!card.querySelector(":focus-visible")) setExpanded((current) => current.filter((area) => area !== group.area)); }, 120);
    },
    onFocus: (event) => { if (event.target.matches(":focus-visible")) openCard(group.area); },
    onBlur: (event) => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded((current) => current.filter((area) => area !== group.area)); },
  };
  return (
    <section className="technology chapter" id="technology" aria-labelledby="technology-title">
      <div className="tech-map">
        <div className="tech-map-heading"><h2 id="technology-title">Направления и команды</h2></div>
        <Accordion value={expanded} onValueChange={(next) => setExpanded(hoverMode ? next.slice(-1) : next)} className={`tech-grid${hoverMode ? " is-hover" : ""}`}>
          {techTeamGroups.map((group) => (
            <AccordionItem className="tech-card" value={group.area} key={group.area} {...hoverProps(group)}>
              <h3 className="tech-map-title">{group.area}</h3>
              {(group.icons.length > 0 || group.stack.length > 0) && <CaretDown className="tech-card-hover-cue" aria-hidden="true" />}
              <ul className="tech-card-teams" aria-label={group.icons.length > 1 ? "Центры разработки" : group.icons.length ? "Центр разработки" : "Команда"}>
                {group.icons.length > 0 ? group.icons.map((icon) => (
                  <li key={icon}><img src={`/assets/paper-fruits/${icon}.jpg`} alt="" width="48" height="48" loading="lazy" decoding="async" /><span className="tech-map-fruit">{techCenters[icon].label}</span></li>
                )) : <li><span className="tech-card-badge" aria-hidden="true"><ShieldCheck /></span><span className="tech-map-fruit">{group.teams}</span></li>}
              </ul>
              <p className="tech-card-description">{group.description}</p>
              <div className="tech-card-actions">
                {(group.icons.length > 0 || group.stack.length > 0) && <AccordionTrigger heading={false} className="tech-map-trigger">
                  <span className="tech-map-toggle-closed">Подробнее</span><span className="tech-map-toggle-open">Свернуть</span><span className="visually-hidden">: {group.area}</span>
                  <CaretDown aria-hidden="true" />
                </AccordionTrigger>}
                {group.href && <a className="tech-map-page-link" href={group.href}>{group.href === "/pentest" ? "Информационная безопасность" : "AI в ТехВилле"} <ArrowRight aria-hidden="true" /></a>}
              </div>
              {/* In hover mode the details hang below the card as an overlay; on touch they open in flow under the button. */}
              {(group.icons.length > 0 || group.stack.length > 0) && <AccordionContent variant="disclosure">
                <div className="tech-map-details">
                  {group.icons.length > 0 && <ul className="tech-card-centers" aria-label="Чем занимаются команды">
                    {group.icons.map((icon) => {
                      const center = techCenters[icon];
                      return <li key={icon}><img src={`/assets/paper-fruits/${icon}.jpg`} alt="" width="32" height="32" loading="lazy" decoding="async" /><span><strong>{center.label}{center.role && <span className="tech-card-role"> · {center.role}</span>}</strong>{center.text}</span></li>;
                    })}
                  </ul>}
                  {group.stack.length > 0 && <ul className="tech-map-stack" aria-label="Стек">{group.stack.map((item) => <li key={item}>{item}</li>)}</ul>}
                </div>
              </AccordionContent>}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function ArticleCard({ article }) {
  const Card = article.href ? "a" : "article";
  return (
    <Card className="career-article-card" href={article.href || undefined} target={article.external ? "_blank" : undefined} rel={article.external ? "noopener noreferrer" : undefined} tabIndex={article.href ? undefined : 0} aria-labelledby={`article-${article.id}-title`} aria-describedby={article.external ? `article-${article.id}-source` : undefined}>
      <div className="career-article-photo">
        {article.photo ? <img src={article.photo} alt={article.photoAlt || ""} loading="lazy" decoding="async" /> : <span aria-hidden="true">Фото статьи</span>}
      </div>
      <div className="career-article-copy">
        <span className={`article-tag tag-${article.tag}`}>{articleTags.find((tag) => tag.id === article.tag)?.label}</span>
        <h3 id={`article-${article.id}-title`}>{article.title}</h3>
        <p>{article.description}</p>
        {article.external && <small className="article-source" id={`article-${article.id}-source`}>Хабр <ArrowRight aria-hidden="true" /><span className="visually-hidden">Откроется в новой вкладке</span></small>}
      </div>
    </Card>
  );
}

function Articles() {
  return (
    <section className="career-articles" id="articles" aria-labelledby="articles-title">
      <div className="career-articles-heading"><h2 id="articles-title">Наш блог</h2></div>
      <div className="home-article-list" aria-label="Материалы блога">
        {careerArticles.filter((article) => !article.blogOnly).slice(0, 4).map((article) => <ArticleCard article={article} key={article.id} />)}
      </div>
      <a className="article-blog-link" href="/blog">Все записи в блоге <ArrowRight /></a>
    </section>
  );
}

function Blog() {
  const readTags = () => [...new Set(new URLSearchParams(window.location.search).getAll("tag").filter((id) => articleTags.some((tag) => tag.id === id)))];
  const [selectedTags, setSelectedTags] = useState(readTags);
  const visibleArticles = careerArticles.filter((article) => selectedTags.length === 0 || selectedTags.includes(article.tag));
  useEffect(() => { document.title = "Блог — ТехВилл"; }, []);
  useEffect(() => {
    const sync = () => setSelectedTags(readTags());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const filter = (tag) => {
    const next = selectedTags.includes(tag) ? selectedTags.filter((id) => id !== tag) : [...selectedTags, tag];
    setSelectedTags(next);
    const params = new URLSearchParams();
    next.forEach((id) => params.append("tag", id));
    window.history.pushState(null, "", next.length ? `/blog?${params}` : "/blog");
  };
  return (
    <section className="blog-page" aria-labelledby="blog-title">
      <header className="blog-heading"><h1 id="blog-title">Блог ТехВилла</h1><p>О продуктах, технологиях и жизни команды</p></header>
      <div className="blog-filters" role="group" aria-label="Темы статей">
        {articleTags.map((tag) => <button key={tag.id} type="button" className={`blog-filter tag-${tag.id}`} aria-pressed={selectedTags.includes(tag.id)} aria-controls="blog-results" onClick={() => filter(tag.id)}>{tag.label}</button>)}
      </div>
      <p className="visually-hidden" aria-live="polite">Показано статей: {visibleArticles.length}</p>
      <div className="career-article-grid" id="blog-results">{visibleArticles.map((article) => <ArticleCard article={article} key={article.id} />)}</div>
    </section>
  );
}

function JobDetail({ job }) {
  useEffect(() => {
    document.title = job ? `${job.title} — ТехВилл` : "Вакансия не найдена — ТехВилл";
  }, [job]);

  if (!job) return <section className="job-detail-page"><a className="job-back-link" href="/vacancies"><ArrowLeft /> Все вакансии</a><h1>Вакансия не найдена</h1><p>Вернитесь к списку и выберите другую роль.</p></section>;
  return (
    <article className="job-detail-page" aria-labelledby="job-title">
      <a className="job-back-link" href="/vacancies"><ArrowLeft /> Все вакансии</a>
      <header className="job-detail-heading">
        <div className="job-detail-tags"><span>{job.team}</span><span>{job.format}</span></div>
        <h1 id="job-title">{job.title}</h1>
        {salaryLabel(job) && <p className="job-salary" aria-label="Зарплата">{salaryLabel(job)}</p>}
        <p>{job.description}</p>
        <a className="button button-lime" href="#application">Откликнуться <ArrowDown /></a>
      </header>
      <div className="job-detail-body">
        {job.stack && <section className="job-detail-section"><h2>Наш стек</h2>{job.stack.map((item) => <p key={item}>{item}</p>)}</section>}
        <section className="job-detail-section"><h2>Задачи</h2><ul>{job.tasks.map((task) => <li key={task}>{task}</li>)}</ul></section>
        <section className="job-detail-section"><h2>Требования</h2><ul>{job.expectations.map((item) => <li key={item}>{item}</li>)}</ul></section>
        {job.advantages && <section className="job-detail-section"><h2>Будет большим плюсом</h2><ul>{job.advantages.map((item) => <li key={item}>{item}</li>)}</ul></section>}
        <section className="job-detail-section"><h2>Условия работы</h2>{job.conditions ? <ul>{job.conditions.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Работу над цифровыми продуктами ВкусВилла, поддержку команды и возможности профессионального развития.</p>}<a className="text-link" href="/#benefits">Подробнее о преимуществах <ArrowRight /></a></section>
        <TalentApplication job={job} />
      </div>
    </article>
  );
}

function Vacancies() {
  useEffect(() => { document.title = "Вакансии — ТехВилл"; }, []);
  const [company, setCompany] = useState("techvill");
  const [directions, setDirections] = useState([]);
  const [query, setQuery] = useState("");
  const companyTabs = [{ key: "techvill", label: "ТехВилл" }, { key: "cyberchef", label: "Кибершеф" }];
  const tabRefs = useRef([]);
  const companyJobs = useMemo(() => jobs.filter((job) => job.company === company), [company]);
  const visibleJobs = useMemo(() => companyJobs.filter((job) => matchesVacancy(job, directions, query)), [companyJobs, directions, query]);
  const selectCompany = (key) => { setCompany(key); setDirections([]); };
  const toggleDirection = key => setDirections(current => current.includes(key) ? current.filter(item => item !== key) : [...current, key]);
  const handleTabKey = (event, index) => {
    const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : event.key === "ArrowRight" || event.key === "ArrowLeft" ? (index + 1) % 2 : null;
    if (next === null) return;
    event.preventDefault();
    selectCompany(companyTabs[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="vacancies chapter" id="vacancies" aria-labelledby="vacancies-title">
      <div className="vacancy-heading">
        <h1 id="vacancies-title">Вакансии</h1>
        <p>Работа в ТехВилле и Кибершефе</p>
      </div>
      <div className="vacancy-company-tabs" role="tablist" aria-label="Компания">
        {companyTabs.map((item, index) => (
          <button key={item.key} ref={(node) => { tabRefs.current[index] = node; }} type="button" role="tab" id={`company-tab-${item.key}`} aria-label={item.label} aria-selected={company === item.key} aria-controls={`company-panel-${item.key}`} tabIndex={company === item.key ? 0 : -1} onClick={() => selectCompany(item.key)} onKeyDown={(event) => handleTabKey(event, index)}>
            {item.key === "techvill" ? <span className="vacancy-techvill-logo"><img src="/assets/logotech.svg" alt="" width="51" height="50" /><span>ТЕХВИЛЛ</span></span> : <img className="vacancy-cyberchef-logo" src="/assets/cyberchef-logo.svg" alt="" width="559" height="191" />}
          </button>
        ))}
      </div>
      {companyTabs.map((item) => (
      <div key={item.key} role="tabpanel" id={`company-panel-${item.key}`} aria-labelledby={`company-tab-${item.key}`} hidden={company !== item.key} tabIndex={0}>
      {company === item.key && <>
      <div className="job-filters">
        <div className="job-direction-filters" role="group" aria-label="Направление">
          <button type="button" className={!directions.length ? "is-active" : ""} aria-pressed={!directions.length} onClick={() => setDirections([])}>Все направления</button>
          {vacancyDirections.filter((filter) => company === "techvill" || filter.key === "ai").map((item) => (
            <button type="button" key={item.key} className={directions.includes(item.key) ? "is-active" : ""} aria-pressed={directions.includes(item.key)} onClick={() => toggleDirection(item.key)}>{item.label}</button>
          ))}
        </div>
        <div className="job-search">
          <MagnifyingGlass aria-hidden="true" />
          <label className="visually-hidden" htmlFor="vacancy-search">Поиск вакансий по названию</label>
          <input id="vacancy-search" type="search" value={query} placeholder="Поиск по названию" onChange={(event) => setQuery(event.target.value)} />
          {query && <button type="button" aria-label="Очистить поиск" onClick={() => setQuery("")}><X aria-hidden="true" /></button>}
        </div>
      </div>
      <div className="job-results-heading"><span role="status">{vacancyCountLabel(visibleJobs.length)} · {item.label} · {directionLabel(directions)}</span></div>
      <div className="job-list">
        {visibleJobs.map((job) => (
          <a className="job-row" key={job.id} href={`/vacancies/${job.id}`}>
            <span className="job-row-main"><strong>{job.title}</strong><small>{job.description}</small></span><span className="job-row-meta"><span>{job.team}</span><span>{job.format}</span></span><ArrowRight />
          </a>
        ))}
        {visibleJobs.length === 0 && <div className="job-empty"><p>{query.trim() ? "По этому запросу вакансий не найдено." : "Сейчас в выбранных направлениях нет открытых вакансий."}</p><button type="button" onClick={() => { setDirections([]); setQuery(""); }}>Сбросить фильтры</button></div>}
      </div>
      </>}
      </div>
      ))}
      <ContactBanner kind="talent" />
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-company">
        <Brand />
        <p>© ООО Технологии ВкусВилл, 2025</p>
        <p>Аккредитованная ИТ-компания (номер в реестре 13167 от 18.12.2020)</p>
        <p>Основной ОКВЭД: 62.01 — разработка компьютерного программного обеспечения</p>
        <div className="footer-legal">
          <a href="https://www.techvill.ru/privacy-policy">Политика конфиденциальности <ArrowRight /></a>
          <a href="https://www.techvill.ru/personal-data">Согласия на обработку персональных данных <ArrowRight /></a>
        </div>
      </div>
      <nav aria-label="Разделы сайта">
        <a href="/services">Решения</a>
        <a href="/ai">AI в ТехВилле</a>
        <a href="/pentest">Информационная безопасность</a>
      </nav>
      <div className="footer-contacts">
        <FooterSocials />
        <p>ИНН: 7751014313</p>
        <p>ОГРН: 5157746165605</p>
        <a href="tel:+74951346363">+7 (495) 134-63-63</a>
        <a href="mailto:info@techvill.ru">info@techvill.ru</a>
        <p className="footer-address">Адрес<br />123592, г. Москва, вн.тер.г. муниципальный округ Строгино, ул. Кулакова, д. 20, к. 1, помещ. 8/1.</p>
      </div>
      <div className="footer-bottom">
        <p className="footer-activity-codes">Коды видов деятельности в области информационных технологий, осуществляемых организацией, в соответствии с перечнем видов деятельности в области информационных технологий, утвержденным приказом Министерства цифрового развития, связи и массовых коммуникаций Российской Федерации от 11 мая 2023 г. N 449: 1.01, 1.03, 11.01.</p>
      </div>
    </footer>
  );
}

export function Prototype() {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const path = window.location.pathname.replace(/\/$/, "");
  const isVacanciesPage = path === "/vacancies" || path.startsWith("/vacancies/");
  const isJobDetail = path.startsWith("/vacancies/");
  const job = isJobDetail ? jobs.find((item) => String(item.id) === path.slice("/vacancies/".length)) : null;
  const isBlogPage = path === "/blog" || path.startsWith("/blog/");
  const isArticleDetail = path.startsWith("/blog/");
  const article = isArticleDetail ? careerArticles.find((item) => item.id === path.slice("/blog/".length) || item.aliases?.includes(path.slice("/blog/".length))) : null;
  const isAiPage = path === "/ai";
  const isServicesPage = path === "/services";
  const isSecurityPage = path === "/pentest";
  const isStandalonePage = isVacanciesPage || isBlogPage || isAiPage || isServicesPage || isSecurityPage;
  usePageMotion(rootRef, reducedMotion, isStandalonePage);

  return (
    <div ref={rootRef} className="app-shell">
      <a className="skip-link" href="#main-content">Перейти к содержанию</a>
      {!isStandalonePage && <Suspense fallback={null}><ExperienceCanvas reducedMotion={reducedMotion} /></Suspense>}
      <Header isVacanciesPage={isVacanciesPage} isBlogPage={isBlogPage} isAiPage={isAiPage} />
      <main id="main-content">{isSecurityPage ? <SecurityPage /> : isServicesPage ? <ServicesPage /> : isAiPage ? <AiPage /> : isBlogPage ? (isArticleDetail ? <ArticleDetail article={article} /> : <Blog />) : isVacanciesPage ? (isJobDetail ? <JobDetail job={job} /> : <Vacancies />) : <><Hero /><Mission /><CompanyPrinciple /><TechnologyStories /><People /><Technology /><Articles /></>}</main>
      <Footer />
    </div>
  );
}
