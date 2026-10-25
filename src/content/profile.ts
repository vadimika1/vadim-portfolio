// Профиль, услуги, отзывы и резюме. Цены — из кворков Вадима, отзывы — дословно с профиля Кворка (25.10.2026).
import type { Lang, Text } from './cases.ts';

export const LINKS = {
  github: 'https://github.com/vadimika1',
  kwork: 'https://kwork.ru/user/vadimika1',
  freelancer: 'https://www.freelancer.com/u/vadimika1',
  studio: 'https://tabletools.ru/',
  demo: 'https://tabletools.ru/demo/',
  policy: 'https://tabletools.ru/politika-konfidencialnosti/',
} as const;

/** Полное имя для резюме, «Обо мне» и обычной версии; в интерфейсе коротко — «Вадим». EN — как в паспорте. */
export const FULL_NAME: Record<Lang, string> = { ru: 'Вадим Антонович', en: 'Vadzim Antanovich' };

export const ABOUT: Record<Lang, string[]> = {
  ru: [
    'Меня зовут Вадим. Делаю сайты, внутренние системы и сквозную аналитику и остаюсь с ними после запуска.',
    'Сайты: Тильда, 1С-Битрикс, WordPress, Joomla, MODX, Webflow, Astro. Вёрстка по Figma и PSD, SEO-правки по ТЗ, скорость, переезды на другой хостинг, чистка после взлома, 152-ФЗ.',
    'Системы: на Next.js и Python пишу бронирование с оплатой, порталы для команды, CRM, Telegram-ботов и дашборды. Для сети арт-студий в США сделал свою систему бронирования вместо платного сервиса.',
    'Аналитика: GA4, GTM, Метрика с целями, склейка рекламы, визита, заказа и выручки в один отчёт, дашборды, которые сами собирают данные из рекламы, CRM и сервисов.',
    'Сначала смотрю сайт или процесс и говорю, что реально сделать и за сколько. Правки веду на копии, боевой сайт не ломаю.',
    'Дизайн с нуля не рисую: работаю по макету, брендбуку или прототипу.',
  ],
  en: [
    'I’m Vadim. I build websites, internal systems and end-to-end analytics, and stay with them after launch.',
    'Websites: Tilda, 1C-Bitrix, WordPress, Joomla, MODX, Webflow, Astro. Builds from Figma and PSD, SEO fixes from a brief, speed, hosting moves, hack cleanup, Russian privacy law.',
    'Systems: in Next.js and Python I build booking with payments, team portals, CRMs, Telegram bots and dashboards. For an art studio chain in the US I built a booking system to replace a paid SaaS.',
    'Analytics: GA4, GTM, Yandex Metrica goals, one report that ties ad, visit, order and revenue together, dashboards that pull data from ad accounts, CRMs and services on their own.',
    'First I look at the site or process and tell you what is doable and what it costs. I work on a copy, not on the live site.',
    'I don’t design from scratch; I work from a design, a brand book or a prototype.',
  ],
};

export const SKILLS = ['Тильда', '1С-Битрикс', 'WordPress', 'Joomla', 'MODX', 'Webflow', 'Astro', 'Next.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'MySQL', 'Stripe', 'GA4', 'GTM', 'Яндекс Метрика', 'Сквозная аналитика', 'Telegram-боты'];
export const SOFTWARE = ['Figma', 'Git', 'Docker', 'Vercel', 'Cloudflare', 'Playwright', 'Sentry', 'Linux', 'WP-CLI'];

export type Service = { name: Text; price: Text; note?: Text };

export const SERVICES: Service[] = [
  { name: { ru: 'Доработка сайта', en: 'Website fixes' }, price: { ru: 'от 2 500 ₽', en: 'from 2,500 ₽' }, note: { ru: 'правки, блоки, формы, ошибки', en: 'edits, blocks, forms, bugs' } },
  { name: { ru: 'Вёрстка по макету', en: 'Build from a design' }, price: { ru: '6 000 / 12 000 / 20 000 ₽', en: '6,000 / 12,000 / 20,000 ₽' }, note: { ru: 'Figma или PSD, адаптив под телефон', en: 'Figma or PSD, mobile-ready' } },
  { name: { ru: 'Сайт под ключ', en: 'Website end to end' }, price: { ru: '19 000 / 38 000 / 65 000 ₽', en: '19,000 / 38,000 / 65,000 ₽' }, note: { ru: 'по готовому макету', en: 'from a ready design' } },
  { name: { ru: 'Ускорение сайта', en: 'Speed-up' }, price: { ru: '5 000 / 10 000 / 18 000 ₽', en: '5,000 / 10,000 / 18,000 ₽' } },
  { name: { ru: 'Перенос на другой хостинг или VDS', en: 'Hosting or VDS move' }, price: { ru: '5 000 ₽', en: '5,000 ₽' } },
  { name: { ru: 'GA4, GTM, Метрика и цели', en: 'GA4, GTM, Metrica and goals' }, price: { ru: '4 000 ₽', en: '4,000 ₽' } },
  { name: { ru: 'Своя система: кабинет, бронирование, бот', en: 'Custom system: portal, booking, bot' }, price: { ru: 'по задаче', en: 'quoted per task' } },
];

export const KWORK_STATS = { rating: '5.0', orders: 5, reviews: 4, onTime: '80 %', repeat: '40 %' };

export type Review = { project: string; author: string; text: string };

/** Отзывы с Кворка дословно (на русском — так их и оставили заказчики). */
export const REVIEWS: Review[] = [
  { project: 'M3', author: 'Dr_Smolski', text: 'Отличная работа. Исполнитель внимательно отнёсся к требованиям, оперативно исправлял замечания и довёл этап до полного принятия. Коммуникация была спокойной и профессиональной. Продолжаем сотрудничество.' },
  { project: 'M2', author: 'Dr_Smolski', text: 'Вадим качественно выполнил очередной этап работы. Требования соблюдены, результат хорошо документирован, замечания по приёмке оперативно устранены. Ответственный и аккуратный исполнитель, продолжаем сотрудничество.' },
  { project: 'M1', author: 'Dr_Smolski', text: 'Отличная работа. Вадим внимательно разобрал большое техническое ТЗ, строго соблюдал Git-процесс и договорённые границы этапа, регулярно фиксировал результаты и подготовил качественный handoff с проверяемыми evidence. Работа по M1 успешно прошла независимую техническую приёмку. Ответственный и аккуратный исполнитель, продолжаем сотрудничество на следующем этапе.' },
  { project: 'Исправление сайта', author: 'onem-maxim0', text: 'Отличный исполнитель! Рекомендую! эффективный, всегда на связи!' },
];

/** Резюме: первая строка — имя, вторая — роль, дальше блоки через пустую строку (заголовок + строки). */
export const RESUME: Record<Lang, string> = {
  ru: `${FULL_NAME.ru}
Веб-разработчик: сайты, внутренние системы, сквозная аналитика

КОНТАКТЫ
Портфолио и форма для сообщения: vadim.tabletools.ru
GitHub: github.com/vadimika1
Кворк: kwork.ru/user/vadimika1

ЧТО ДЕЛАЮ
- Доработки готовых сайтов: Тильда, 1С-Битрикс, WordPress, Joomla, MODX, Webflow
- Вёрстка по макету Figma и PSD, адаптив
- SEO-правки, скорость, переезды на другой хостинг или VDS
- Аналитика: GA4, GTM, Яндекс Метрика, пиксель Meta
- Свои системы на Next.js и Python: бронирование с оплатой, порталы, CRM, боты, дашборды
- Сквозная аналитика: реклама → визит → заказ → выручка в одном отчёте

ОПЫТ
Shot of Art (сеть арт-студий в США, удалённо)
- Своя система бронирования вместо Peek Pro: виджет, кабинет гостя, консоль
  персонала, больше 4 000 автотестов; пилот в студии Houston впереди
- Сквозная аналитика и дашборды маркетинга, операций и финансов
- Доработки сайта на Webflow для 7 городов, портал команды с ИИ-помощником

Фриланс: Кворк, Freelancer.com
- Больше десяти сайтов на поддержке: Мособлтех, Clever Place, Китаяна,
  Завод Эко Технологий, Дентаграфия, 1991 Coffee, DC Tuning и другие
- Рейтинг на Кворке 5.0, все заказы сданы

TableTools — своя студия
- Дашборды и CRM для малого бизнеса, сайт и демо: tabletools.ru

ОБРАЗОВАНИЕ
Гродненский государственный политехнический колледж, 2021–2025
- Среднее специальное, техник-программист
- Специальность «Программное обеспечение информационных технологий»

НАВЫКИ
Тильда, 1С-Битрикс, WordPress, Joomla, MODX, Webflow, Astro, Next.js,
TypeScript, Python, FastAPI, PostgreSQL, MySQL, Stripe, Git, Docker,
Playwright, Linux`,
  en: `${FULL_NAME.en}
Web developer: websites, internal systems, end-to-end analytics

CONTACT
Portfolio and contact form: vadim.tabletools.ru
GitHub: github.com/vadimika1
Freelancer: freelancer.com/u/vadimika1

WHAT I DO
- Fixes and features on existing sites: Tilda, 1C-Bitrix, WordPress, Joomla, MODX, Webflow
- Builds from Figma and PSD designs, mobile-ready
- SEO fixes, speed, hosting and VDS moves
- Analytics: GA4, GTM, Yandex Metrica, Meta pixel
- Custom systems in Next.js and Python: booking with payments, portals, CRMs, bots, dashboards
- End-to-end analytics: ad → visit → order → revenue in one report

EXPERIENCE
Shot of Art (art studio chain in the US, remote)
- Own booking system to replace Peek Pro: widget, guest portal, staff
  console, 4,000+ automated tests; the Houston studio pilot is next
- End-to-end analytics and marketing, operations and finance dashboards
- Webflow site for 7 cities, a team portal with an AI assistant

Freelance: Kwork, Freelancer.com
- More than ten sites under maintenance: Mosoblteh, Clever Place, Kitayana,
  Zavod Eco Technologies, Dentagrafia, 1991 Coffee, DC Tuning and others
- Kwork rating 5.0, every order delivered

TableTools, my studio
- Dashboards and CRM for small businesses, site and demo: tabletools.ru

EDUCATION
Grodno State Polytechnic College, 2021–2025
- Vocational diploma, technician-programmer
- Major: Software for Information Technologies

SKILLS
Tilda, 1C-Bitrix, WordPress, Joomla, MODX, Webflow, Astro, Next.js,
TypeScript, Python, FastAPI, PostgreSQL, MySQL, Stripe, Git, Docker,
Playwright, Linux`,
};
