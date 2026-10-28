import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, Browsers, CaretDown, ChartLineUp, Code, Cube, DeviceMobile, GraduationCap, PencilRuler, ShieldCheck, TreeStructure } from "@phosphor-icons/react";
import { ContactBanner } from "./ContactForms.jsx";
import { useReducedMotion } from "./hooks/useReducedMotion.js";
import { createServiceValueBehavior, serviceValueHoverQuery } from "./data/service-value-behavior.mjs";
import "./services.css";
import "./ai.css";

// Content order and copy: supplied Google Sheet, tab 297920746, read 7 October 2026.
const services = [
  { icon: DeviceMobile, title: "Разработка мобильных приложений", text: "Создаём уникальные приложения для крупного и среднего бизнеса, интегрированные с вашими IT-системами" },
  { icon: ChartLineUp, title: "AI-инструменты", text: "Разрабатываем рекомендательные и антифрод-системы, предсказываем спрос и улучшаем пользовательский опыт", href: "/ai" },
  { icon: Browsers, title: "Веб-приложения и сайты", text: "Создаём современные сайты и веб-сервисы для бизнеса любого масштаба, с уникальным дизайном и высокой производительностью" },
  { icon: PencilRuler, title: "Дизайн и проектирование", text: "UI/UX-дизайн. Создаём и улучшаем дизайн мобильных и web-приложений, сайтов, сервисов" },
  { icon: Cube, title: "1С-интеграция", text: "Интеграция бизнес-процессов и автоматизация учёта с помощью 1С" },
  { icon: Code, title: "DevOps", text: "Бесперебойная работа инфраструктуры, непрерывная интеграция и поставка программного обеспечения, автоматизация DevOps" },
  { icon: ShieldCheck, title: "Информационная безопасность", text: "Pentest и Red Team от ТехВилла — имитация атак на уровне реальных угроз", href: "/pentest" },
  { icon: TreeStructure, title: "Автоматизация бизнес-процессов", text: "Документооборот, отраслевые учётные системы, банковские системы, риск-менеджмент, CRM и многое другое" },
  { icon: GraduationCap, title: "Консалтинг и обучение", text: "Консультации в области разработки программного обеспечения, проектирование архитектуры, анализ существующего кода, организация эффективной работы по Agile" },
];
const products = [
  { title: "Приложение ВкусВилл", image: "customer", alt: "Интерфейс приложения ВкусВилл для покупателей" },
  { title: "Приложение для поставщиков", image: "partner", alt: "Интерфейс приложения для партнёров и поставщиков ВкусВилл" },
  { title: "Приложение для курьеров", image: "courier", alt: "Интерфейс приложения для курьеров ВкусВилл" },
];

export const serviceValues = [
  {
    title: "Включённые отношения",
    text: "Слышим, заботимся, действуем честно",
    details: "Принимаем решения на основе обратной связи, стремимся давать 101% искреннего сервиса и заботимся об удобстве людей. Честны в словах и поступках",
  },
  {
    title: "Технологии с заботой",
    text: "Создаём решения, удобные для людей",
    details: "Изучаем реальные потребности пользователей, проверяем гипотезы и внедряем полезные изменения, сохраняя стабильность сервисов. Автоматизируем рутину, чтобы уделять больше времени тому, что создаёт ценность для пользователя",
  },
  {
    title: "Технологии с умом",
    text: "Выбираем пользу, а не новизну",
    details: "Изучаем новые технологии и подходы, проверяем их на практике и оцениваем результат по метрикам. Начинаем с простых экспериментов и внедряем только то, что действительно приносит пользу",
  },
];

function ServiceValue({ value, reducedMotion }) {
  const [open, setOpen] = useState(false);
  const behavior = useMemo(() => createServiceValueBehavior({
    isHoverMode: () => window.matchMedia(serviceValueHoverQuery).matches,
    activeElement: () => document.activeElement,
  }), []);
  return (
    <details name="services-values" className="ai-direction service-value" onToggle={(event) => setOpen(event.currentTarget.open)}
      onPointerEnter={behavior.pointerEnter} onPointerLeave={behavior.pointerLeave} onPointerDown={behavior.pointerDown}
      onFocus={behavior.focus} onBlur={behavior.blur} onKeyDown={behavior.keyDown}>
      <summary onClick={behavior.summaryClick}>
        <div className="ai-direction-copy"><div className="service-value-heading"><h3>{value.title}</h3><CaretDown className="service-value-hover-cue" aria-hidden="true" /></div><p>{value.text}</p></div>
        <span className="ai-direction-toggle"><span className="ai-open-label">Подробнее</span><span className="ai-close-label">Свернуть</span><CaretDown aria-hidden="true" /></span>
      </summary>
      <motion.div className="ai-direction-details" initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}>
        <p>{value.details}</p>
        <button className="ai-direction-dismiss" type="button" aria-label={`Закрыть подробности: ${value.title}`} onClick={(event) => behavior.dismiss(event.currentTarget.closest("details"))}>Закрыть подробности</button>
      </motion.div>
    </details>
  );
}

export function ServicesPage() {
  const track = useRef(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  useEffect(() => { document.title = "Решения — ТехВилл"; }, []);
  useEffect(() => {
    const closeOutside = (event) => document.querySelectorAll(".service-value[open]").forEach((item) => {
      if (!item.contains(event.target)) item.open = false;
    });
    document.addEventListener("pointerdown", closeOutside);
    const query = window.matchMedia(serviceValueHoverQuery);
    const resetCards = () => document.querySelectorAll(".service-value[open]").forEach((item) => { item.open = false; });
    query.addEventListener("change", resetCards);
    return () => { document.removeEventListener("pointerdown", closeOutside); query.removeEventListener("change", resetCards); };
  }, []);
  const move = (index) => {
    const item = track.current.children[index];
    track.current.scrollTo({ left: item.offsetLeft - track.current.offsetLeft, behavior: reduced ? "instant" : "smooth" });
  };
  const sync = () => {
    const container = track.current;
    const distances = [...container.children].map((item) => Math.abs(item.offsetLeft - container.offsetLeft - container.scrollLeft));
    setActive(distances.indexOf(Math.min(...distances)));
  };
  return <div className="services-page">
    <section className="services-hero" aria-labelledby="services-title">
      <p className="services-label">Решения ТехВилл</p>
      <h1 id="services-title">Создаём <span>цифровые продукты</span></h1>
      <p className="services-intro">От дизайна и разработки до AI и информационной безопасности</p>
      <a className="button button-lime" href="#services-catalog">Наши решения<ArrowDown aria-hidden="true" /></a>
    </section>
    <section className="services-catalog" id="services-catalog" aria-label="Направления решений">
      {services.map(({ icon: Icon, title, text, href }) => <article className="service-entry" key={title}><span className="service-icon" aria-hidden="true"><Icon weight="regular" /></span><h2>{title}</h2><p>{text}</p>{href && <a className={href === "/pentest" ? "button button-lime service-security-action" : undefined} href={href}>{href === "/pentest" ? "Pentest и Red Team" : "AI в ТехВилле"}<ArrowRight aria-hidden="true" /></a>}</article>)}
    </section>
    <section className="services-portfolio" aria-labelledby="services-portfolio-title">
      <header><h2 id="services-portfolio-title">Наши продукты</h2></header>
      <div className="services-product-track" ref={track} onScroll={sync} aria-label="Портфолио приложений" tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight" && active < 2) { event.preventDefault(); move(active + 1); } if (event.key === "ArrowLeft" && active > 0) { event.preventDefault(); move(active - 1); } }}>
        {products.map((product) => <figure key={product.image}><figcaption>{product.title}</figcaption><div className="services-product-media"><img src={`/assets/services/${product.image}.png`} alt={product.alt} loading="lazy" decoding="async" /></div></figure>)}
      </div>
      <div className="services-slider-controls"><button type="button" disabled={active === 0} aria-label="Предыдущий продукт" onClick={() => move(active - 1)}><ArrowLeft /></button><button type="button" disabled={active === products.length - 1} aria-label="Следующий продукт" onClick={() => move(active + 1)}><ArrowRight /></button></div>
      <div className="services-product-picker" aria-label="Выбрать продукт">{products.map((product, index) => <button type="button" aria-pressed={active === index} onClick={() => move(index)} key={product.image}>{product.title}</button>)}</div>
    </section>
    <section className="services-values" id="services-values" aria-labelledby="services-values-title">
      <h2 id="services-values-title">Наши ценности</h2>
      <div className="services-values-grid">{serviceValues.map((value) => <ServiceValue key={value.title} value={value} reducedMotion={reduced} />)}</div>
    </section>
    <div className="services-contact"><ContactBanner /></div>
  </div>;
}
