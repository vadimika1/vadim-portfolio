// Корень: экран входа → рабочий стол (окна) или «Карманный ПК» на узком экране. Язык и звук — в трее.
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { About, MyComputer, Resume, Reviews, Services } from './apps/Docs.tsx';
import { Dashboard, Icq, Paint } from './apps/Extras.tsx';
import { Projects } from './apps/Projects.tsx';
import { Icon, type IconName } from './components/Icon.tsx';
import { Balloon, DesktopIcons, Login, StartMenu, Taskbar } from './components/Shell.tsx';
import { Wallpaper } from './components/Wallpaper.tsx';
import { Window } from './components/Window.tsx';
import { LINKS } from './content/profile.ts';
import { LangContext, STRINGS, type Lang } from './i18n.ts';
import { goal } from './metrika.ts';
import { play, setSoundEnabled, soundEnabled, unlockAudio } from './sound.ts';
import { APPS, focused, initialDesk, reduce, type AppId, type Win } from './wm.ts';

const POCKET_MAX = 759;
const BALLOON_DELAY_MS = 1200;
const LANG_KEY = 'vadimxp:lang';

const ICON: Record<AppId, IconName> = {
  projects: 'projects', computer: 'computer', about: 'about', resume: 'resume', services: 'services',
  reviews: 'reviews', icq: 'icq', paint: 'paint', dashboard: 'dashboard',
};
const MENU_KIND: Partial<Record<AppId, 'menuNotepad' | 'menuExplorer'>> = {
  resume: 'menuNotepad', services: 'menuNotepad', computer: 'menuExplorer', about: 'menuExplorer',
};

function readLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'ru' || saved === 'en') return saved;
  } catch {
    // нет доступа к хранилищу — по языку браузера
  }
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

function useNarrow(): boolean {
  const query = `(max-width: ${POCKET_MAX}px)`;
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handle = () => setNarrow(mq.matches);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, [query]);
  return narrow;
}

const viewport = () => ({ w: window.innerWidth, h: window.innerHeight });

export function App() {
  const [lang, setLangState] = useState<Lang>(readLang);
  const [stage, setStage] = useState<'login' | 'desk'>('login');
  const [desk, dispatch] = useReducer(reduce, undefined, () => initialDesk(viewport()));
  const [startOpen, setStartOpen] = useState(false);
  const [balloon, setBalloon] = useState(false);
  const [sound, setSound] = useState(soundEnabled);
  const [pocketApp, setPocketApp] = useState<{ app: AppId; arg: string | null } | null>(null);
  const narrow = useNarrow();
  const t = STRINGS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch { /* приватное окно */ }
  }, [lang]);

  useEffect(() => {
    const handle = () => dispatch({ type: 'view', ...viewport() });
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  useEffect(() => {
    if (stage !== 'desk' || narrow) return;
    const id = window.setTimeout(() => { setBalloon(true); play('notify'); }, BALLOON_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [stage, narrow]);

  const open = useCallback((app: AppId, arg?: string | null) => {
    play('open');
    setStartOpen(false);
    if (narrow) setPocketApp({ app, arg: arg ?? null });
    else dispatch({ type: 'open', app, arg });
  }, [narrow]);

  const handleLogin = () => {
    unlockAudio();
    play('startup');
    goal('login');
    setStage('desk');
    if (!narrow) dispatch({ type: 'open', app: 'projects' });
  };
  const handleLogOff = () => {
    play('logoff');
    setStartOpen(false);
    setBalloon(false);
    setPocketApp(null);
    dispatch({ type: 'reset' });
    setStage('login');
  };
  const handleSound = () => {
    unlockAudio();
    setSoundEnabled(!sound);
    setSound(!sound);
  };

  const renderApp = (app: AppId, arg: string | null, setArg: (a: string | null) => void) => {
    switch (app) {
      case 'projects':
        return <Projects view={arg} onView={setArg} onBeforeAfter={(id) => open('paint', id)} onDemo={() => open('dashboard')} />;
      case 'computer':
        return <MyComputer onFolder={(p) => open('projects', p)} onOpen={(a) => open(a)} />;
      case 'about': return <About onWrite={() => open('icq')} />;
      case 'resume': return <Resume />;
      case 'services': return <Services onWrite={() => open('icq')} />;
      case 'reviews': return <Reviews />;
      case 'icq': return <Icq />;
      case 'paint': return <Paint caseId={arg} onPick={setArg} />;
      case 'dashboard': return <Dashboard />;
    }
  };

  const body = (() => {
    if (stage === 'login') return <Login onLogin={handleLogin} lang={lang} onLang={setLangState} />;
    if (narrow) {
      return (
        <Pocket
          app={pocketApp}
          onOpen={open}
          onBack={() => { play('close'); setPocketApp(null); }}
          render={(p) => renderApp(p.app, p.arg, (a) => setPocketApp({ ...p, arg: a }))}
          lang={lang}
          onLang={setLangState}
          onLogOff={handleLogOff}
        />
      );
    }
    const top = focused(desk);
    return (
      <div className="desktop">
        <h1 className="sr-only">{t.siteTitle}</h1>
        <Wallpaper />
        <DesktopIcons onOpen={open} />
        <main className="windows">
          {desk.wins.map((w: Win) => (
            <Window
              key={w.id}
              win={w}
              title={t.appTitle[w.app]}
              icon={ICON[w.app]}
              active={top?.id === w.id}
              menu={MENU_KIND[w.app] && t[MENU_KIND[w.app]!]}
              onFocus={() => { if (top?.id !== w.id) dispatch({ type: 'focus', id: w.id }); }}
              onClose={() => { play('close'); dispatch({ type: 'close', id: w.id }); }}
              onMinimize={() => dispatch({ type: 'minimize', id: w.id })}
              onToggleMax={() => dispatch({ type: 'toggleMax', id: w.id })}
              onMove={(x, y) => dispatch({ type: 'move', id: w.id, x, y })}
            >
              {renderApp(w.app, w.arg, (a) => dispatch({ type: 'arg', id: w.id, arg: a }))}
            </Window>
          ))}
        </main>
        {balloon && <Balloon onClose={() => setBalloon(false)} />}
        {startOpen && <StartMenu onOpen={(a) => open(a)} onClose={() => setStartOpen(false)} onLogOff={handleLogOff} />}
        <Taskbar
          desk={desk}
          dispatch={dispatch}
          titleOf={(a) => t.icon[a]}
          iconOf={(a) => ICON[a]}
          startOpen={startOpen}
          onStart={() => { play('click'); setStartOpen((o) => !o); }}
          sound={sound}
          onSound={handleSound}
          lang={lang}
          onLang={setLangState}
        />
      </div>
    );
  })();

  return <LangContext.Provider value={lang}>{body}</LangContext.Provider>;
}

type PocketProps = {
  app: { app: AppId; arg: string | null } | null;
  onOpen: (app: AppId) => void;
  onBack: () => void;
  render: (p: { app: AppId; arg: string | null }) => React.ReactNode;
  lang: Lang;
  onLang: (l: Lang) => void;
  onLogOff: () => void;
};

/** «Карманный ПК»: плитки программ, каждая открывается на весь экран с кнопкой «Назад». */
function Pocket({ app, onOpen, onBack, render, lang, onLang, onLogOff }: PocketProps) {
  const t = STRINGS[lang];
  const title = useRef<HTMLHeadingElement>(null);
  // Смена экрана уносит нажатую кнопку — фокус на заголовок, чтобы клавиатура и скринридер знали, где они.
  useEffect(() => {
    title.current?.focus({ preventScroll: true });
  }, [app?.app]);
  return (
    <div className="pocket">
      <header className="pocket-bar">
        {app ? (
          <button type="button" className="pocket-back" onClick={onBack}><span aria-hidden="true">◀</span> {t.pocketHome}</button>
        ) : (
          <span className="pocket-brand"><Icon name="logo" size={18} /> {t.pocketTitle}</span>
        )}
        <h1 className="pocket-title" ref={title} tabIndex={-1}>{app ? t.appTitle[app.app] : 'VadimXP'}</h1>
        <button type="button" className="tray-btn" onClick={() => onLang(lang === 'ru' ? 'en' : 'ru')} aria-label={t.langSwitch}>{lang === 'ru' ? 'RU' : 'EN'}</button>
      </header>
      {app ? (
        <main className="pocket-app">{render(app)}</main>
      ) : (
        <main className="pocket-home">
          <p className="pocket-hint">{t.pocketHint}</p>
          <ul className="pocket-grid">
            {APPS.map((a) => (
              <li key={a}>
                <button type="button" onClick={() => onOpen(a)}><Icon name={ICON[a]} size={40} /><span>{t.icon[a]}</span></button>
              </li>
            ))}
            <li>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer"><Icon name="github" size={40} /><span>GitHub</span></a>
            </li>
          </ul>
          <p className="pocket-foot">
            <a href="/classic/" onClick={() => goal('classic_open')}>{t.classic}</a>
            <button type="button" className="linklike" onClick={onLogOff}>{t.logOff}</button>
          </p>
        </main>
      )}
    </div>
  );
}
