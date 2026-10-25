// Обычная версия портфолио: статичный HTML из тех же данных (src/content), без JavaScript.
// Запуск после vite build: node scripts/classic.ts dist → dist/classic/index.html и dist/classic/en/index.html.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CASES, PLATFORM_LABEL, PLATFORMS, type Case, type Lang } from '../src/content/cases.ts';
import { ABOUT, FULL_NAME, KWORK_STATS, LINKS, REVIEWS, SERVICES, SKILLS } from '../src/content/profile.ts';

const out = process.argv[2] ?? 'dist';
const SITE = 'https://vadim.tabletools.ru';
// Номер счётчика Метрики берём из того же .env.production, что и Vite; нет файла или номера — без счётчика.
if (existsSync('.env.production')) process.loadEnvFile('.env.production');
const METRIKA_ID = /^\d+$/.test(process.env.VITE_METRIKA_ID ?? '') ? process.env.VITE_METRIKA_ID : '';
const METRIKA_TAG = METRIKA_ID ? `<script src="/ym.js" data-id="${METRIKA_ID}" async></script>\n` : '';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const T = {
  ru: {
    title: 'Вадим — веб-разработчик: кейсы, отзывы, цены',
    desc: 'Сайты на Тильде, Битриксе, WordPress, Joomla, MODX, Webflow и свои системы на Next.js. Кейсы со ссылками на живые сайты.',
    role: 'Веб-разработчик: сайты, внутренние системы, сквозная аналитика',
    desk: 'Открыть рабочий стол VadimXP', other: 'English version', otherHref: '/classic/en/',
    cases: 'Кейсы', systems: 'Системы и сквозная аналитика', task: 'Задача', result: 'Результат', services: 'Услуги и цены', reviews: 'Отзывы с Кворка', contact: 'Связаться',
    open: 'Открыть сайт', resume: 'Резюме (PDF)',
    contactText: 'Напишите в ICQ на рабочем столе — сообщение придёт мне в Telegram. Или на Кворке и Freelancer.',
    stats: `Рейтинг ${KWORK_STATS.rating}, заказов ${KWORK_STATS.orders}, отзывов ${KWORK_STATS.reviews}`,
  },
  en: {
    title: 'Vadim, web developer: cases, reviews, prices',
    desc: 'Websites on Tilda, 1C-Bitrix, WordPress, Joomla, MODX, Webflow and custom systems in Next.js. Cases with links to live sites.',
    role: 'Web developer: websites, internal systems, end-to-end analytics',
    desk: 'Open the VadimXP desktop', other: 'Русская версия', otherHref: '/classic/',
    cases: 'Cases', systems: 'Systems and end-to-end analytics', task: 'The brief', result: 'Result', services: 'Services and prices', reviews: 'Reviews on Kwork', contact: 'Contact',
    open: 'Open site', resume: 'Resume (PDF)',
    contactText: 'Message me via ICQ on the desktop; it lands in my Telegram. Or reach me on Kwork and Freelancer.',
    stats: `Rating ${KWORK_STATS.rating}, ${KWORK_STATS.orders} orders, ${KWORK_STATS.reviews} reviews`,
  },
} as const;

const CSS = `
:root{--ink:#10182a;--ink2:#46526a;--blue:#1846b4;--link:#0a45c2;--line:#d8deea;--sun:#f0a35a}
*{box-sizing:border-box}body{margin:0;font:16px/1.6 Tahoma,Verdana,'Segoe UI',system-ui,sans-serif;color:var(--ink);background:#fff}
a{color:var(--link)}header.top{background:linear-gradient(#2f6de0,var(--blue));color:#fff;border-bottom:3px solid var(--sun)}
.wrap{max-width:980px;margin:0 auto;padding:0 20px}.top .wrap{display:flex;gap:20px;align-items:center;padding-top:28px;padding-bottom:28px;flex-wrap:wrap}
.top img{width:112px;height:112px;border-radius:8px;border:3px solid #fff}.top h1{margin:0;font-size:32px}.top p{margin:4px 0 0;color:#dbe6ff}
.top nav{display:flex;gap:16px;flex-wrap:wrap;margin-top:10px}.top nav a{color:#fff}
main section{padding:28px 0;border-bottom:1px solid var(--line)}h2{font-size:22px;color:var(--blue);margin:0 0 14px}
h3{font-size:16px;margin:22px 0 10px;color:var(--ink2)}.case{display:grid;grid-template-columns:200px 1fr;gap:16px;padding:12px 0;border-top:1px dotted var(--line)}
.case img{width:200px;height:125px;object-fit:cover;object-position:top;border:1px solid var(--line)}.case h4{margin:0;font-size:17px}
.case p{margin:4px 0}.case ul{margin:6px 0;padding-left:18px}.case small{color:var(--ink2)}
table{border-collapse:collapse;width:100%}td,th{padding:8px 4px;border-bottom:1px dotted var(--line);text-align:left;vertical-align:top}td{text-align:right;white-space:nowrap;font-weight:700}
blockquote{margin:0 0 4px}.rev{padding:10px 14px;border-left:4px solid var(--sun);background:#fffdf6;margin-bottom:10px}.rev small{color:var(--ink2)}
.chips{display:flex;flex-wrap:wrap;gap:6px;padding:0;list-style:none}.chips li{border:1px solid var(--line);border-radius:4px;padding:1px 8px;font-size:14px}
footer{padding:24px 0 40px;color:var(--ink2);font-size:14px}
@media (max-width:640px){td{white-space:normal;min-width:7em}.case{grid-template-columns:1fr}.case img{width:100%;height:auto;aspect-ratio:16/10}.top h1{font-size:26px}}
`;

function page(lang: Lang): string {
  const t = T[lang];
  const card = (c: Case) => `
      <article class="case">
        ${c.image ? `<img src="${c.image}" alt="" width="200" height="125" loading="lazy">` : ''}
        <div>
          <h4>${esc(c.title[lang])}</h4>
          <p>${esc(c.lead[lang])}</p>
          ${c.task ? `<p><b>${t.task}:</b> ${esc(c.task[lang])}</p>` : ''}
          <ul>${c.did[lang].map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
          ${c.result ? `<p><b>${t.result}:</b> ${esc(c.result[lang])}</p>` : ''}
          ${c.url ? `<p><a href="${esc(c.url)}" rel="noopener">${t.open}: ${esc(new URL(c.url).host.replace(/^www\./, ''))}</a>${c.linkNote ? ` <small>${esc(c.linkNote[lang])}</small>` : ''}</p>` : ''}
          ${!c.url && c.linkNote ? `<p><small>${esc(c.linkNote[lang])}</small></p>` : ''}
          <small>${esc(c.stack.join(', '))}</small>
        </div>
      </article>`;
  // Системы и аналитика отдельным разделом в начале, сайты — по платформам; каждый кейс показываем один раз.
  const isSystem = (c: Case) => c.kinds.includes('systems') || c.kinds.includes('analytics');
  const systems = CASES.filter(isSystem);
  const groups = `<h3>${esc(t.systems)}</h3>${systems.map(card).join('')}` + PLATFORMS.map((p) => {
    const items = CASES.filter((c) => c.platform === p && !isSystem(c));
    return items.length ? `<h3>${esc(PLATFORM_LABEL[p][lang])}</h3>${items.map(card).join('')}` : '';
  }).join('');
  const prices = SERVICES.map((s) => `<tr><th>${esc(s.name[lang])}${s.note ? `<br><small>${esc(s.note[lang])}</small>` : ''}</th><td>${esc(s.price[lang])}</td></tr>`).join('');
  const reviews = REVIEWS.map((r) => `<div class="rev"><blockquote>${esc(r.text)}</blockquote><small>${esc(r.author)}, «${esc(r.project)}»</small></div>`).join('');
  const url = lang === 'ru' ? `${SITE}/classic/` : `${SITE}/classic/en/`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title><meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ru" href="${SITE}/classic/"><link rel="alternate" hreflang="en" href="${SITE}/classic/en/">
<meta property="og:title" content="${esc(t.title)}"><meta property="og:image" content="${SITE}/img/vadim.webp">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>${CSS.replace(/\n/g, '')}</style>
${METRIKA_TAG}</head>
<body>
<header class="top"><div class="wrap">
  <img src="/img/vadim.webp" alt="" width="112" height="112">
  <div>
    <h1>${FULL_NAME[lang]}</h1>
    <p>${esc(t.role)}</p>
    <nav><a href="/">${t.desk}</a><a href="${t.otherHref}">${t.other}</a><a href="/resume-${lang}.pdf">${t.resume}</a><a href="${LINKS.github}" rel="noopener">GitHub</a></nav>
  </div>
</div></header>
<main class="wrap">
  <section>${ABOUT[lang].map((p) => `<p>${esc(p)}</p>`).join('')}<ul class="chips">${SKILLS.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></section>
  <section><h2>${t.cases}</h2>${groups}</section>
  <section><h2>${t.services}</h2><table><tbody>${prices}</tbody></table></section>
  <section><h2>${t.reviews}</h2><p><a href="${LINKS.kwork}" rel="noopener">${esc(t.stats)}</a></p>${reviews}</section>
  <section><h2>${t.contact}</h2><p>${esc(t.contactText)}</p>
    <p><a href="${LINKS.kwork}" rel="noopener">Kwork</a>, <a href="${LINKS.freelancer}" rel="noopener">Freelancer</a>, <a href="${LINKS.github}" rel="noopener">GitHub</a>, <a href="${LINKS.studio}" rel="noopener">TableTools</a></p></section>
</main>
<footer class="wrap">VadimXP, vadim.tabletools.ru</footer>
</body>
</html>
`;
}

for (const [lang, dir] of [['ru', 'classic'], ['en', 'classic/en']] as const) {
  mkdirSync(join(out, dir), { recursive: true });
  writeFileSync(join(out, dir, 'index.html'), page(lang));
}
console.log('CLASSIC_OK');
