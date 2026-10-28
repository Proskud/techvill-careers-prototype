import { useEffect } from "react";
import { articleTags } from "./data/content.js";
import { newsArticle } from "./data/newsArticle.js";
import { bindShortWords } from "./data/typography.mjs";

function InlineText({ text }) {
  return bindShortWords(text).split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("***") && part.endsWith("***")) return <strong key={index}><em>{part.slice(3, -3)}</em></strong>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return part.replace(/\*/g, "");
  });
}

function ArticleBody() {
  return newsArticle.content.split(/\n{2,}/).flatMap((block, index) => {
    const text = block.trim();
    if (!text || text === "---" || text === "&nbsp;") return [];
    const speaker = text.match(/^\*\*([^*]+)\*\*,\s*(.+)$/s);
    if (speaker) return <header className="article-speaker" key={index}><h2>{speaker[1]}</h2><p>{bindShortWords(speaker[2])}</p></header>;
    const images = [...text.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
    const remaining = text.replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim();
    return [
      ...images.map((match, imageIndex) => <figure className="article-body-photo" key={`${index}-image-${imageIndex}`}><img src={new URL(match[2], newsArticle.sourceUrl).href} alt="Фотография из похода команды ТехВилл на Алтай" loading="lazy" decoding="async" /></figure>),
      ...(remaining ? [<p key={`${index}-text`}><InlineText text={remaining} /></p>] : []),
    ];
  });
}

export function ArticleDetail({ article }) {
  useEffect(() => { document.title = article ? `${article.title} — Блог ТехВилла` : "Статья не найдена — ТехВилл"; }, [article]);
  if (!article) return <section className="article-detail-page"><div className="article-reading"><a className="article-back" href="/blog">Все статьи</a><h1>Статья не найдена</h1><p>Вернитесь в блог и выберите другой материал.</p></div></section>;
  if (article.external) return <article className="article-detail-page"><div className="article-reading"><a className="article-back" href="/blog">Все статьи</a><h1>{article.title}</h1><p>{article.description}</p><a className="button button-lime" href={article.href} target="_blank" rel="noopener noreferrer">Читать на Хабре <span className="visually-hidden">в новой вкладке</span></a></div></article>;
  const tag = articleTags.find((item) => item.id === article.tag);
  return <article className="article-detail-page" aria-labelledby="article-detail-title">
    <header className="article-detail-header">
      <a className="article-back" href="/blog">Все статьи</a>
      <div className="article-detail-labels"><a className={`article-tag tag-${article.tag}`} href={`/blog?tag=${article.tag}`}>{tag.label}</a></div>
      <h1 id="article-detail-title">{article.title}</h1>
      {article.fullArticle ? <div className="article-meta"><time dateTime={newsArticle.dateTime}>{newsArticle.date}</time></div> : <p className="article-detail-lead">{article.description}</p>}
    </header>
    {article.fullArticle ? <>
      <figure className="article-cover"><img src={article.photo} alt={article.photoAlt} fetchPriority="high" /></figure>
      <div className="article-reading article-news-body"><ArticleBody /></div>
    </> : <div className="article-reading article-coming-soon"><h2>Материал готовится</h2><p>Пока это анонс будущей статьи. Полный текст и фотографии появятся после подготовки материала.</p><a href="/blog/altai">Читать о походе команды на Алтай</a></div>}
    <div className="article-reading article-end"><a className="article-back" href="/blog">Вернуться в блог</a></div>
  </article>;
}
