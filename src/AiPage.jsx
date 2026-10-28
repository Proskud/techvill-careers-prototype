import { useEffect } from "react";
import { ArrowDown, ArrowRight, BookOpen, CaretDown, ChartLineUp, ChatCircleDots, Sparkle, Basket } from "@phosphor-icons/react";
import { aiArticles, aiDirections, aiPrinciples } from "./data/ai.js";
import "./ai.css";

const principleIcons = { data: "data", target: "ai", experiment: "learning" };
const directionIcons = { forecast: ChartLineUp, recommendations: Sparkle, vvchat: ChatCircleDots, gala: BookOpen, mcp: Basket };

function DirectionVisual({ id }) {
  const Icon = directionIcons[id];
  return <div className={`ai-direction-visual ai-visual-${id}`} aria-hidden="true">
    <div className="ai-visual-grid" />
    <div className="ai-visual-orbit"><span /><span /><span /></div>
    <div className="ai-visual-symbol"><Icon weight="duotone" /></div>
    {id === "forecast" && <svg className="ai-visual-chart" viewBox="0 0 400 130"><path d="M0 115 C55 115 45 72 95 88 S145 50 190 68 S245 23 295 38 S350 10 400 12" /></svg>}
    {id === "recommendations" && <div className="ai-visual-tiles"><span /><span /><span /></div>}
    {id === "vvchat" && <div className="ai-visual-chat"><span /><span /><span /></div>}
    {id === "gala" && <div className="ai-visual-pages"><span /><span /></div>}
  </div>;
}

export function AiPage() {
  useEffect(() => { document.title = "AI в ТехВилле — ТехВилл"; }, []);
  useEffect(() => {
    function closeOutside(event) {
      document.querySelectorAll('.ai-direction[open]').forEach((item) => {
        if (!item.contains(event.target)) item.open = false;
      });
    }
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, []);

  return <div className="ai-page">
    <section className="ai-hero" aria-labelledby="ai-title">
      <div className="ai-hero-copy">
        <p className="ai-page-label">AI в ТехВилле</p>
        <h1 id="ai-title">Культура <span>AI-технологий</span> и здравого смысла</h1>
        <p className="ai-hero-description">Мы используем AI, чтобы каждый день улучшать опыт покупателей и работу команды</p>
        <div className="ai-hero-actions">
          <a className="button button-lime" href="#ai-directions">Наши направления <ArrowDown /></a>
          <a className="ai-text-link" href="/vacancies">Хочу в команду <ArrowRight /></a>
        </div>
      </div>
    </section>

    <section className="ai-principles" aria-label="Как мы работаем с AI">
      {aiPrinciples.map((principle) => {
        return <article className="ai-principle" key={principle.icon}>
          <span className="ai-principle-icon" aria-hidden="true"><img src={`/assets/ai-paper/${principleIcons[principle.icon]}.svg`} width="22" height="22" alt="" /></span>
          <h2>{principle.title}</h2><p>{principle.text}</p>
        </article>;
      })}
    </section>

    <section className="ai-directions" id="ai-directions" aria-labelledby="ai-directions-title">
      <header className="ai-section-heading"><h2 id="ai-directions-title">Наши направления</h2><p>Встраиваем AI в продукты и процессы — от поиска знаний до прогноза спроса и ассортимента</p></header>
      <div className="ai-directions-grid">
        {aiDirections.map((direction) => <details name="ai-directions" className={`ai-direction ai-direction-${direction.id}`} key={direction.id} onKeyDown={(event) => {
          if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus(); }
        }}>
          <summary>
            <DirectionVisual id={direction.id} />
            <div className="ai-direction-copy"><h3>{direction.title}</h3><p>{direction.description}</p></div>
            <span className="ai-direction-toggle"><span className="ai-open-label">Подробнее</span><span className="ai-close-label">Свернуть</span><CaretDown aria-hidden="true" /></span>
          </summary>
          <div className="ai-direction-details">{direction.details.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<button className="ai-direction-dismiss" type="button" aria-label={`Закрыть подробности: ${direction.title}`} onClick={(event) => {
            const item = event.currentTarget.closest('details'); item.open = false; item.querySelector('summary')?.focus();
          }}>Закрыть подробности</button></div>
        </details>)}
      </div>
    </section>

    <section className="ai-blog" aria-labelledby="ai-blog-title">
      <header className="ai-section-heading"><h2 id="ai-blog-title">Как мы создаём AI-решения</h2><a className="ai-text-link" href="/blog">В блог ТехВилла <ArrowRight /></a></header>
      {aiArticles.length ? <div className="ai-blog-grid">{aiArticles.slice(0, 3).map((article) => <a className="ai-blog-card" href={article.href} key={article.id}>{article.image && <img src={article.image} alt="" loading="lazy" />}<h3>{article.title}</h3><p>{article.description}</p><ArrowRight aria-hidden="true" /></a>)}</div> : <>
        <div className="ai-blog-grid">{["Прогнозирование спроса", "Рекомендательные системы", "Корпоративные AI-инструменты"].map((topic) => <article className="ai-blog-card ai-blog-placeholder" key={topic}><div className="ai-blog-placeholder-image" aria-hidden="true"><BookOpen weight="duotone" /></div><p className="ai-blog-status">Материал готовится</p><h3>{topic}</h3></article>)}</div>
      </>}
    </section>

    <section className="ai-careers" aria-labelledby="ai-careers-title">
      <h2 id="ai-careers-title">Хочу в команду</h2>
      <a className="button button-lime" href="/vacancies">Смотреть вакансии <ArrowRight /></a>
    </section>
  </div>;
}
