import { TelegramLogo } from "@phosphor-icons/react";

export function FooterSocials() {
  return (
    <nav className="footer-socials" aria-label="ТехВилл в сообществах">
      <a href="https://habr.com/ru/companies/vkusvill/articles/" target="_blank" rel="noopener noreferrer" aria-label="ТехВилл на Хабре — откроется в новой вкладке" title="Хабр">
        <span className="footer-social-mark social-habr" aria-hidden="true" />
      </a>
      <a href="https://t.me/itstechvill" target="_blank" rel="noopener noreferrer" aria-label="ТехВилл в Telegram — откроется в новой вкладке" title="Telegram">
        <TelegramLogo weight="fill" aria-hidden="true" />
      </a>
      <a href="https://setka.ru/communities/019e9171-9a90-7823-9260-78ffe6033d43" target="_blank" rel="noopener noreferrer" aria-label="ТехВилл в Сетке — откроется в новой вкладке" title="Сетка">
        <span className="footer-social-mark social-setka" aria-hidden="true" />
      </a>
    </nav>
  );
}
