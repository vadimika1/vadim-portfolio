// Типы и помощники кейсов. Сами кейсы — в cases-sites.ts и cases-systems.ts.
// Картинки — свои скриншоты публичных страниц (public/cases/*.webp), снятые без входа.

import { SITE_CASES } from './cases-sites.ts';
import { SYSTEM_CASES } from './cases-systems.ts';

export type Lang = 'ru' | 'en';
export type Text = Record<Lang, string>;

export const PLATFORMS = ['tilda', 'bitrix', 'wordpress', 'modx', 'joomla', 'astro', 'nextjs', 'python', 'webflow'] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABEL: Record<Platform, Text> = {
  tilda: { ru: 'Тильда', en: 'Tilda' },
  bitrix: { ru: '1С-Битрикс', en: '1C-Bitrix' },
  wordpress: { ru: 'WordPress', en: 'WordPress' },
  modx: { ru: 'MODX', en: 'MODX' },
  joomla: { ru: 'Joomla', en: 'Joomla' },
  astro: { ru: 'Astro', en: 'Astro' },
  nextjs: { ru: 'Next.js', en: 'Next.js' },
  python: { ru: 'Python и Telegram', en: 'Python and Telegram' },
  webflow: { ru: 'Webflow', en: 'Webflow' },
};

/** Второй срез, кроме платформы: что за работа. Системы и аналитика иначе теряются среди сайтов. */
export const KINDS = ['sites', 'systems', 'analytics'] as const;
export type Kind = (typeof KINDS)[number];

export const KIND_LABEL: Record<Kind, Text> = {
  sites: { ru: 'Сайты', en: 'Websites' },
  systems: { ru: 'Системы, кабинеты, боты', en: 'Systems, portals, bots' },
  analytics: { ru: 'Сквозная аналитика', en: 'End-to-end analytics' },
};

/** Папка в окне проектов: платформа или тип работ («kind:systems»). */
export type Folder = Platform | `kind:${Kind}`;

export type Case = {
  id: string;
  platform: Platform;
  title: Text;
  /** Одна строка для карточки в списке. */
  lead: Text;
  kinds: Kind[];
  /** С чем пришёл клиент. */
  task?: Text;
  /** Что сделал — пункты. */
  did: Record<Lang, string[]>;
  /** Что изменилось, по фактам: числа «было → стало», статус. */
  result?: Text;
  stack: string[];
  /** Нет — сайт клиента сейчас нельзя показывать (kursi: без стилей с 10.2026), кейс без ссылки. */
  url?: string;
  /** Подпись ссылки, если домен в адресе не говорит сам за себя. */
  linkNote?: Text;
  /** Свой скриншот публичной страницы или обезличенный экран; нет — рисуется обложка из значка. */
  image?: string;
  /** «До» для окна Paint: старая версия из веб-архива или боевой сайт на старом дизайне. */
  before?: string;
  /** Откуда снимок «до». */
  beforeNote?: Text;
  github?: string;
  /** Кейс открывает окно «Живой дашборд» вместо простой ссылки. */
  demo?: boolean;
};

/** Порядок в «Все проекты»: сначала то, что агентству важнее увидеть, MVP в конце. */
const ORDER = [
  'booking', 'attribution', 'shotofart', 'mosoblteh', 'laser', 'posle', 'clever', 'chinaparts', 'zet', 'denta',
  'dctuning', 'hotel', 'coffee', 'premium7hills', 'huntiq', 'kursi', 'tabletools', 'soa-internal', 'marzhinator', 'mini-crm',
  'tg-booking-bot', 'ai-sales-bot',
];
const ALL: Case[] = [...SITE_CASES, ...SYSTEM_CASES];
export const CASES: Case[] = ORDER.map((id) => {
  const c = ALL.find((x) => x.id === id);
  if (!c) throw new Error(`Кейс ${id} есть в ORDER, но нет в данных`);
  return c;
});

export const caseById = (id: string): Case | undefined => CASES.find((c) => c.id === id);

export const isKindFolder = (f: string): f is `kind:${Kind}` => (KINDS as readonly string[]).includes(f.slice(5)) && f.startsWith('kind:');

export const casesIn = (f: Folder | null): Case[] => {
  if (!f) return CASES;
  if (isKindFolder(f)) return CASES.filter((c) => c.kinds.includes(f.slice(5) as Kind));
  return CASES.filter((c) => c.platform === f);
};

export const folderLabel = (f: Folder, lang: Lang): string => (isKindFolder(f) ? KIND_LABEL[f.slice(5) as Kind][lang] : PLATFORM_LABEL[f][lang]);

export const platformCount = (p: Platform): number => casesIn(p).length;
