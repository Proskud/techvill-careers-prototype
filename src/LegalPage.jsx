import { useEffect } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { consents, personalDataIntro, privacyPolicy } from "./data/legal.js";

// Consecutive li blocks become one list; h2/h3/p render as they are.
function LegalBlocks({ blocks, headingLevel = 2 }) {
  const items = [];
  blocks.forEach(([tag, text], index) => {
    if (tag === "li") {
      const last = items.at(-1);
      if (last?.list) last.list.push(text);
      else items.push({ list: [text], key: index });
    } else items.push({ tag, text, key: index });
  });
  return items.map((item) => {
    if (item.list) return <ul key={item.key}>{item.list.map((text) => <li key={text}>{text}</li>)}</ul>;
    if (item.tag === "h2") { const H = `h${headingLevel}`; return <H key={item.key}>{item.text}</H>; }
    if (item.tag === "h3") { const H = `h${headingLevel + 1}`; return <H key={item.key}>{item.text}</H>; }
    return <p key={item.key}>{item.text}</p>;
  });
}

export function PrivacyPolicyPage() {
  useEffect(() => { document.title = "Политика конфиденциальности — ТехВилл"; }, []);
  return <article className="legal-page" aria-labelledby="legal-title">
    <h1 id="legal-title">{privacyPolicy.title}</h1>
    <LegalBlocks blocks={privacyPolicy.blocks} />
    <a className="legal-link" href="/personal-data">Согласие на обработку персональных данных <ArrowRight aria-hidden="true" /></a>
  </article>;
}

export function PersonalDataPage() {
  useEffect(() => { document.title = "Согласие на обработку персональных данных — ТехВилл"; }, []);
  return <article className="legal-page" aria-labelledby="legal-title">
    <h1 id="legal-title">Согласие на обработку персональных данных</h1>
    <p className="legal-intro">{personalDataIntro}</p>
    <nav className="legal-toc" aria-label="Виды согласия">
      {consents.map(({ id, label }) => <a key={id} href={`#${id}`}>{label}</a>)}
    </nav>
    {consents.map(({ id, label, title, blocks }) => <section className="legal-section" id={id} key={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{label}</h2>
      <p className="legal-section-title">{title}</p>
      <LegalBlocks blocks={blocks} headingLevel={3} />
    </section>)}
    <a className="legal-link" href="/privacy-policy">Политика конфиденциальности <ArrowRight aria-hidden="true" /></a>
  </article>;
}
