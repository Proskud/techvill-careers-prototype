import { useEffect } from "react";
import { ArrowDown, ArrowRight, ShieldCheck, Detective, Code, FileText, Wrench, LockKey } from "@phosphor-icons/react";
import { ContactBanner } from "./ContactForms.jsx";
import "./security.css";

// Copy and section order transferred from https://www.techvill.ru/pentest on 9 October 2026.
// Source marketing claims are preserved, not presented as independently measured results.
const methods = [
  { title: "Чёрный ящик", icon: Detective, text: "Выявляет внешний источник угрозы без прав доступа к приложению" },
  { title: "Серый ящик", icon: LockKey, text: "Выявляет авторизованного источника угрозы с правами обычного клиента" },
  { title: "Белый ящик", icon: Code, text: "Выявляет авторизованного источника угрозы с доступом к исходному коду" },
];
const results = [
  { title: "Технический отчёт", icon: FileText, text: "Подробный документ с описанием всех найденных уязвимостей, PoC (Proof-of-Concept) и сценариями воспроизведения" },
  { title: "Рекомендации по исправлению", icon: Wrench, text: "Приоритетные действия по устранению уязвимостей и снижению рисков для бизнеса" },
  { title: "Практические шаги по повышению защиты", icon: ShieldCheck, text: "Чёткие и конкретные меры для укрепления инфраструктуры, процессов и безопасности приложений" },
];
const RequestLink = () => <a className="security-request" href="#pentest-contact">Оставить заявку<ArrowRight aria-hidden="true" /></a>;

export function SecurityPage() {
  useEffect(() => { document.title = "Информационная безопасность — ТехВилл"; }, []);
  return <div className="security-page">
    <section className="security-hero" aria-labelledby="security-title">
      <p className="security-label">Информационная безопасность</p>
      <h1 id="security-title"><span>Pentest и Red Team</span> от ТехВилла</h1>
      <p className="security-hero-statement">Действуем, как белые хакеры — работаем в интересах вашего бизнеса</p>
      <p className="security-hero-description">ТехВилл предлагает профессиональное тестирование на проникновение (pentest) и Red Team-симуляции, ориентированные на современные сложные атаки, которые уже приводят к масштабным утечкам и сбоям в работе компаний по всему миру</p>
      <div className="security-hero-actions"><a className="button button-lime" href="#pentest-contact">Оставить заявку<ArrowRight aria-hidden="true" /></a><a className="text-link" href="#security-services">Наши решения<ArrowDown aria-hidden="true" /></a></div>
    </section>
    <section className="security-statement" aria-label="Подход к проверке"><p>Мы создаём реалистичные сценарии угроз — от сетевых вторжений до цепочек атак на приложения, API, облачную инфраструктуру и конечное оборудование — с целью выявления критических уязвимостей до того, как их обнаружат злоумышленники</p></section>
    <section className="security-section" id="security-services" aria-labelledby="security-services-title">
      <h2 id="security-services-title">Наши решения по безопасности</h2>
      <div className="security-services-grid">
        <article className="security-service security-service-red"><ShieldCheck aria-hidden="true" /><h3>Red Team <span>(имитация атак)</span></h3><p>Мы моделируем реальные сценарии деятельности APT-групп и злоумышленников с использованием многоканальных подходов: социальная инженерия, эксплуатация уязвимостей, обход средств защиты и т. д.</p><p>Цель — оценить эффективность процессов ИБ в реальном времени</p><RequestLink /></article>
        <article className="security-service"><Detective aria-hidden="true" /><h3>Pentest <span>(тестирование на проникновение)</span></h3><p>Комплексная проверка защищённости ваших активов:</p><ul>{["Внешние сети и инфраструктура", "Внутренние сети (в т. ч. сегментация)", "Веб-сервисы, API", "Мобильные и облачные приложения", "IoT и критические системы"].map((item) => <li key={item}>{item}</li>)}</ul><RequestLink /></article>
      </div>
    </section>
    <section className="security-section security-features" aria-labelledby="security-features-title"><h2 id="security-features-title">Особенности методов</h2><div className="security-feature-grid"><article><h3>Особенности чёрного и серого ящика</h3><ul><li>Фокус на функциональности приложения</li><li>Ограниченное число обнаруживаемых уязвимостей</li></ul></article><article><h3>Особенности белого ящика</h3><ul><li>В 2 раза больше обнаруженных уязвимостей высокой степени риска</li><li>Ограниченное число обнаруживаемых уязвимостей</li></ul></article></div></section>
    <section className="security-section" aria-labelledby="security-methods-title"><h2 id="security-methods-title">Методики анализа защищённости</h2><div className="security-method-grid">{methods.map(({ title, text, icon: Icon }) => <article key={title}><span className="security-icon"><Icon aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="security-section security-results" aria-labelledby="security-results-title"><h2 id="security-results-title">Результаты, которые вы получите</h2><div className="security-method-grid">{results.map(({ title, text, icon: Icon }) => <article key={title}><span className="security-icon"><Icon aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="security-section security-advantage" aria-labelledby="security-advantage-title"><h2 id="security-advantage-title">Наше преимущество</h2><p>Мы интегрируем знания о реальных тенденциях атак и адаптируем проверку к современным угрозам — от сетевых вторжений до целевых стратегий APT-групп, влияющих на крупные корпорации и критическую инфраструктуру</p></section>
    <div className="security-contact" id="pentest-contact"><ContactBanner heading="Оставить заявку" description="Pentest и Red Team от ТехВилла — работаем в интересах вашего бизнеса" buttonText="Обсудить проверку" /></div>
  </div>;
}
