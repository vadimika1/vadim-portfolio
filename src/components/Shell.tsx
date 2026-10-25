// Оболочка: экран входа, значки рабочего стола, панель задач с треем, меню «пуск», подсказка-балун.
import { useEffect, useRef, useState } from 'react';
import { LINKS } from '../content/profile.ts';
import { useLang, useT, type Lang } from '../i18n.ts';
import { goal } from '../metrika.ts';
import { focused, taskbarClick, type AppId, type Desk, type Action } from '../wm.ts';
import { Icon, type IconName } from './Icon.tsx';

export const CLASSIC_URL = '/classic/';

type LoginProps = { onLogin: () => void; lang: Lang; onLang: (l: Lang) => void };

export function Login({ onLogin, lang, onLang }: LoginProps) {
  const t = useT();
  return (
    <main className="login">
      <div className="login-top" />
      <div className="login-mid">
        <div className="login-brand">
          <Icon name="logo" size={64} />
          <h1 className="login-logo">Vadim<span>XP</span></h1>
          <p className="login-hint">{t.loginHint}</p>
        </div>
        <div className="login-rule" aria-hidden="true" />
        <button type="button" className="login-user" onClick={onLogin} autoFocus>
          <img src="/img/vadim.webp" alt="" width={64} height={64} />
          <span>
            <strong>{lang === 'ru' ? 'Вадим' : 'Vadim'}</strong>
            <small>{t.loginRole}</small>
          </span>
        </button>
      </div>
      <div className="login-bottom">
        <a href={CLASSIC_URL} className="login-classic" onClick={() => goal('classic_open')}>{t.classic}</a>
        <button type="button" className="login-lang" onClick={() => onLang(lang === 'ru' ? 'en' : 'ru')}>{t.langSwitch}</button>
        <p className="login-sound">{t.loginSound}</p>
      </div>
    </main>
  );
}

export type Shortcut = { app: AppId; icon: IconName } | { href: string; icon: IconName; label: string };

export const SHORTCUTS: Shortcut[] = [
  { app: 'projects', icon: 'projects' },
  { app: 'computer', icon: 'computer' },
  { app: 'about', icon: 'about' },
  { app: 'icq', icon: 'icq' },
  { app: 'resume', icon: 'resume' },
  { app: 'dashboard', icon: 'dashboard' },
  { app: 'paint', icon: 'paint' },
  { app: 'reviews', icon: 'reviews' },
  { app: 'services', icon: 'services' },
  { href: LINKS.github, icon: 'github', label: 'GitHub' },
];

/** Значки слева. Мышью — двойной клик (как привыкли), пальцем — одно касание; клавиатура и скринридер дают клик
 *  с detail = 0 — он открывает сразу (Enter, пробел, активация из режима обзора). */
export function DesktopIcons({ onOpen }: { onOpen: (app: AppId) => void }) {
  const t = useT();
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  return (
    <ul className="desk-icons" aria-label={t.desktop}>
      {SHORTCUTS.map((s) => (
        <li key={'app' in s ? s.app : s.href}>
          {'app' in s ? (
            <button
              type="button"
              className="desk-icon"
              onClick={(e) => { if (coarse || e.detail === 0) onOpen(s.app); }}
              onDoubleClick={() => onOpen(s.app)}
            >
              <Icon name={s.icon} size={40} />
              <span>{t.icon[s.app]}</span>
            </button>
          ) : (
            <a className="desk-icon" href={s.href} target="_blank" rel="noopener noreferrer">
              <Icon name={s.icon} size={40} />
              <span>{s.label} <Icon name="external" size={10} /></span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

type TaskbarProps = {
  desk: Desk;
  dispatch: (a: Action) => void;
  titleOf: (app: AppId) => string;
  iconOf: (app: AppId) => IconName;
  startOpen: boolean;
  onStart: () => void;
  sound: boolean;
  onSound: () => void;
  lang: Lang;
  onLang: (l: Lang) => void;
};

export function Taskbar({ desk, dispatch, titleOf, iconOf, startOpen, onStart, sound, onSound, lang, onLang }: TaskbarProps) {
  const t = useT();
  const top = focused(desk);
  return (
    <footer className="taskbar">
      <button type="button" className="start-btn" aria-expanded={startOpen} aria-controls="start-menu" onClick={onStart}>
        <Icon name="logo" size={20} />
        <span>{t.start}</span>
      </button>
      <ul className="task-list" aria-label={t.openWindows}>
        {desk.wins.map((w) => (
          <li key={w.id}>
            <button type="button" className="task" aria-pressed={top?.id === w.id} onClick={() => dispatch(taskbarClick(desk, w.id))}>
              <Icon name={iconOf(w.app)} size={16} />
              <span>{titleOf(w.app)}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="tray">
        <button type="button" className="tray-btn" onClick={() => onLang(lang === 'ru' ? 'en' : 'ru')} title={t.langSwitch} aria-label={t.langSwitch}>
          {lang === 'ru' ? 'RU' : 'EN'}
        </button>
        <button type="button" className="tray-btn" onClick={onSound} aria-pressed={sound} aria-label={sound ? t.soundOn : t.soundOff} title={sound ? t.soundOn : t.soundOff}>
          <Icon name={sound ? 'speaker' : 'mute'} size={18} />
        </button>
        <Clock lang={lang} />
      </div>
    </footer>
  );
}

function Clock({ lang }: { lang: Lang }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return <time className="clock" dateTime={now.toISOString()}>{now.toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</time>;
}

type StartProps = { onOpen: (app: AppId) => void; onClose: () => void; onLogOff: () => void };

const START_LEFT: AppId[] = ['projects', 'about', 'resume', 'icq', 'services', 'reviews'];
const START_RIGHT: AppId[] = ['computer', 'dashboard', 'paint'];
const ITEM = '[data-start-item]';

/** Меню «пуск» — раскрывающаяся навигация (кнопка с aria-expanded), а не role=menu: внутри есть шапка и ссылки.
 *  Стрелки, Home и End ходят по пунктам; Esc и клик мимо закрывают и возвращают фокус на кнопку «пуск». */
export function StartMenu({ onOpen, onClose, onLogOff }: StartProps) {
  const t = useT();
  const lang = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>(ITEM)?.focus();
    const handleDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (!ref.current?.contains(el) && !el.closest('.start-btn')) closeRef.current();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      closeRef.current();
      document.querySelector<HTMLElement>('.start-btn')?.focus();
    };
    document.addEventListener('pointerdown', handleDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handleDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleKeys = (e: React.KeyboardEvent) => {
    const items = [...(ref.current?.querySelectorAll<HTMLElement>(ITEM) ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    items[(next + items.length) % items.length]?.focus();
  };

  const item = (a: AppId) => (
    <li key={a}>
      <button type="button" data-start-item onClick={() => onOpen(a)}>
        <Icon name={a} size={a === 'projects' ? 32 : 24} />
        <span>{t.icon[a]}</span>
      </button>
    </li>
  );
  const link = (href: string, icon: IconName, label: string) => (
    <li key={href}>
      <a data-start-item href={href} target="_blank" rel="noopener noreferrer" onClick={onClose}>
        <Icon name={icon} size={24} /><span>{label}</span>
      </a>
    </li>
  );

  return (
    <div className="start-menu" id="start-menu" ref={ref} onKeyDown={handleKeys}>
      <header className="start-head">
        <img src="/img/vadim.webp" alt="" width={44} height={44} />
        <strong>{lang === 'ru' ? 'Вадим' : 'Vadim'}</strong>
      </header>
      <nav className="start-cols" aria-label={t.start}>
        <ul className="start-left">{START_LEFT.map(item)}</ul>
        <ul className="start-right">
          {START_RIGHT.map(item)}
          {link(LINKS.github, 'github', 'GitHub')}
          {link(LINKS.kwork, 'reviews', t.kwork)}
          {link(LINKS.freelancer, 'globe', 'Freelancer')}
          <li>
            <a data-start-item href={CLASSIC_URL} onClick={() => goal('classic_open')}>
              <Icon name="resume" size={24} /><span>{t.classic}</span>
            </a>
          </li>
        </ul>
      </nav>
      <footer className="start-foot">
        <button type="button" data-start-item onClick={onLogOff}>{t.logOff}</button>
      </footer>
    </div>
  );
}

export function Balloon({ onClose }: { onClose: () => void }) {
  const t = useT();
  return (
    <div className="balloon" role="status">
      <button type="button" className="balloon-x" aria-label={t.close} onClick={onClose}>×</button>
      <strong><Icon name="logo" size={16} /> {t.balloonTitle}</strong>
      <p>{t.balloon} <a href={CLASSIC_URL} onClick={() => goal('classic_open')}>{t.classic.toLowerCase()}</a>.</p>
    </div>
  );
}
