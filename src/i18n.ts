// Строки интерфейса на двух языках. Язык выбирается в трее и запоминается в браузере.
import { createContext, useContext } from 'react';
import type { Lang } from './content/cases.ts';
import type { AppId } from './wm.ts';

export type { Lang };

const ru = {
  appTitle: {
    projects: 'Мои проекты', computer: 'Мой компьютер', about: 'Обо мне', resume: 'Резюме — Блокнот',
    services: 'Услуги и цены — Блокнот', reviews: 'Отзывы', icq: 'ICQ — Написать мне', paint: 'До и после — Paint',
    dashboard: 'Живой дашборд',
  } satisfies Record<AppId, string>,
  icon: {
    projects: 'Мои проекты', computer: 'Мой компьютер', about: 'Обо мне', resume: 'Резюме', services: 'Услуги и цены',
    reviews: 'Отзывы', icq: 'Написать мне', paint: 'До и после', dashboard: 'Живой дашборд',
  } satisfies Record<AppId, string>,
  github: 'GitHub',
  loginHint: 'Чтобы начать, нажмите на Вадим',
  loginRole: 'веб-разработчик',
  loginSound: 'Со звуком: включится по клику, выключить — значок динамика в углу',
  classic: 'Обычная версия',
  start: 'пуск',
  logOff: 'Выйти',
  allPrograms: 'Ещё',
  balloonTitle: 'Добро пожаловать',
  balloon: 'Проекты уже открыты. Двойной клик по значку открывает окно, всё остальное — в кнопке «пуск». Торопитесь? Вот',
  close: 'Закрыть', minimize: 'Свернуть', maximize: 'Развернуть', restore: 'Восстановить',
  soundOn: 'Звук включён', soundOff: 'Звук выключен', langSwitch: 'English',
  back: 'Назад', address: 'Адрес', go: 'Переход',
  allProjects: 'Все проекты', folders: 'Проекты', platforms: 'Платформы', items: (n: number) => `${n} ${plural(n, 'проект', 'проекта', 'проектов')}`,
  openSite: 'Открыть сайт', openDemo: 'Открыть демо', beforeAfter: 'До и после', code: 'Код на GitHub',
  did: 'Что сделал', task: 'Задача', result: 'Результат', stack: 'Чем', status: 'Статус',
  links: 'Ссылки', skills: 'Навыки', software: 'Инструменты',
  writeMe: 'Написать мне', save: 'Скачать PDF',
  reviewsOn: 'Отзывы с Кворка', rating: 'рейтинг', orders: 'заказов', onTime: 'сдано вовремя', repeat: 'повторных',
  icqName: 'Как к вам обращаться', icqContact: 'Телефон, Telegram или почта', icqMessage: 'Задача',
  icqConsent: 'Согласен на обработку персональных данных', policy: 'политика',
  icqSend: 'Отправить', icqSending: 'Отправляю…', icqSent: 'Сообщение у Вадима в Telegram. Он ответит в рабочее время.',
  icqFail: 'Не отправилось. Напишите на Кворке или попробуйте ещё раз.', icqOnline: 'Вадим в сети',
  dashNote: 'Демо на вымышленных данных. Если окно пустое, откройте в новой вкладке.', newTab: 'Открыть в новой вкладке',
  paintPick: 'Сайт', paintBefore: 'Было', paintAfter: 'Стало', paintHint: 'Двигайте ползунок',
  paintSoon: 'Снимки «было» ещё собираю из веб-архива. Пока смотрите, как сейчас.',
  pocketTitle: 'Карманный ПК', pocketHint: 'Нажмите на программу', pocketHome: 'Программы',
  myDocs: 'Документы', links2: 'Ссылки',
  desktop: 'Рабочий стол', openWindows: 'Открытые окна', siteTitle: 'VadimXP — портфолио Вадима', kwork: 'Кворк',
  menuNotepad: ['Файл', 'Правка', 'Формат', 'Вид', 'Справка'], menuExplorer: ['Файл', 'Правка', 'Вид', 'Избранное', 'Сервис', 'Справка'],
};

type Strings = typeof ru;

const en: Strings = {
  appTitle: {
    projects: 'My Projects', computer: 'My Computer', about: 'About Me', resume: 'Resume — Notepad',
    services: 'Services and Prices — Notepad', reviews: 'Reviews', icq: 'ICQ — Message Me', paint: 'Before and After — Paint',
    dashboard: 'Live Dashboard',
  },
  icon: {
    projects: 'My Projects', computer: 'My Computer', about: 'About Me', resume: 'Resume', services: 'Services',
    reviews: 'Reviews', icq: 'Message Me', paint: 'Before & After', dashboard: 'Live Dashboard',
  },
  github: 'GitHub',
  loginHint: 'To begin, click on Vadim',
  loginRole: 'web developer',
  loginSound: 'Sound turns on with your click; mute it with the speaker icon',
  classic: 'Plain version',
  start: 'start',
  logOff: 'Log off',
  allPrograms: 'More',
  balloonTitle: 'Welcome',
  balloon: 'Projects are already open. Double-click an icon to open a window; everything else is under “start”. In a hurry? Try the',
  close: 'Close', minimize: 'Minimize', maximize: 'Maximize', restore: 'Restore',
  soundOn: 'Sound on', soundOff: 'Sound off', langSwitch: 'Русский',
  back: 'Back', address: 'Address', go: 'Go',
  allProjects: 'All projects', folders: 'Projects', platforms: 'Platforms', items: (n: number) => `${n} project${n === 1 ? '' : 's'}`,
  openSite: 'Open site', openDemo: 'Open demo', beforeAfter: 'Before and after', code: 'Code on GitHub',
  did: 'What I did', task: 'The brief', result: 'Result', stack: 'Stack', status: 'Status',
  links: 'Links', skills: 'Skills', software: 'Tools',
  writeMe: 'Message me', save: 'Download PDF',
  reviewsOn: 'Reviews on Kwork', rating: 'rating', orders: 'orders', onTime: 'on time', repeat: 'repeat clients',
  icqName: 'Your name', icqContact: 'Phone, Telegram or email', icqMessage: 'What you need',
  icqConsent: 'I agree to the processing of my personal data', policy: 'policy',
  icqSend: 'Send', icqSending: 'Sending…', icqSent: 'Your message is in Vadim’s Telegram. He replies during working hours.',
  icqFail: 'It didn’t go through. Message me on Kwork or try again.', icqOnline: 'Vadim is online',
  dashNote: 'Demo on made-up data. If the window stays empty, open it in a new tab.', newTab: 'Open in a new tab',
  paintPick: 'Site', paintBefore: 'Before', paintAfter: 'After', paintHint: 'Drag the slider',
  paintSoon: 'Still collecting the “before” shots from the web archive. For now, here is how it looks today.',
  pocketTitle: 'Pocket PC', pocketHint: 'Tap a program', pocketHome: 'Programs',
  myDocs: 'Documents', links2: 'Links',
  desktop: 'Desktop', openWindows: 'Open windows', siteTitle: 'VadimXP, Vadim’s portfolio', kwork: 'Kwork',
  menuNotepad: ['File', 'Edit', 'Format', 'View', 'Help'], menuExplorer: ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'],
};

function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

export const STRINGS: Record<Lang, Strings> = { ru, en };

export const LangContext = createContext<Lang>('ru');
export const useLang = (): Lang => useContext(LangContext);
export const useT = (): Strings => STRINGS[useLang()];
