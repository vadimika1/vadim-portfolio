// «Мои проекты»: окно-браузер. Слева папки платформ, справа плитки кейсов; кейс открывается в том же окне,
// «Назад» возвращает к списку. Путь агентства: папка → кейс → «Открыть сайт».
import { useEffect, useRef, useState } from 'react';
import { caseById, casesIn, CASES, folderLabel, KIND_LABEL, KINDS, PLATFORM_LABEL, PLATFORMS, type Case, type Folder } from '../content/cases.ts';
import { useLang, useT } from '../i18n.ts';
import { goal } from '../metrika.ts';
import { Icon } from '../components/Icon.tsx';

type Props = {
  /** null — все проекты, платформа или «kind:тип» — папка, «case:id» — открытый кейс. */
  view: string | null;
  onView: (view: string | null) => void;
  onBeforeAfter: (caseId: string) => void;
  onDemo: () => void;
};

const FOLDERS: readonly string[] = [...PLATFORMS, ...KINDS.map((k) => `kind:${k}`)];
const isFolder = (v: string | null): v is Folder => FOLDERS.includes(v ?? '');

export function Projects({ view, onView, onBeforeAfter, onDemo }: Props) {
  const t = useT();
  const lang = useLang();
  const [history, setHistory] = useState<(string | null)[]>([]);
  const current = view?.startsWith('case:') ? caseById(view.slice(5)) : undefined;
  const folder: Folder | null = isFolder(view) ? view : current?.platform ?? null;

  const go = (next: string | null) => {
    if (next === view) return;
    setHistory((h) => [...h, view]);
    onView(next);
    if (next?.startsWith('case:')) goal('case_open', { case: next.slice(5) });
  };
  const back = () => {
    const prev = history.at(-1);
    if (prev === undefined) return;
    setHistory((h) => h.slice(0, -1));
    onView(prev);
  };
  const address = `vadim.tabletools.ru/projects/${current ? `${current.platform}/${current.id}/` : folder ? `${folder.replace('kind:', '')}/` : ''}`;
  const folderButton = (f: Folder, label: string) => (
    <li key={f}>
      <button type="button" aria-current={folder === f && !current ? 'page' : undefined} onClick={() => go(f)}>
        <Icon name="folder" size={18} /> {label} <span className="count">{casesIn(f).length}</span>
      </button>
    </li>
  );

  return (
    <div className="ie">
      <div className="ie-bar">
        <button type="button" className="ie-back" onClick={back} disabled={!history.length}>
          <span aria-hidden="true">◀</span> {t.back}
        </button>
        <div className="ie-address">
          <span>{t.address}</span>
          <span className="ie-url"><Icon name="globe" size={14} /> {address}</span>
        </div>
      </div>
      <div className="ie-page">
        <nav className="ie-side" aria-label={t.folders}>
          <h3>{t.folders}</h3>
          <ul>
            <li>
              <button type="button" aria-current={!folder && !current ? 'page' : undefined} onClick={() => go(null)}>
                <Icon name="folder" size={18} /> {t.allProjects} <span className="count">{CASES.length}</span>
              </button>
            </li>
            {KINDS.map((k) => folderButton(`kind:${k}`, KIND_LABEL[k][lang]))}
          </ul>
          <h3>{t.platforms}</h3>
          <ul>{PLATFORMS.map((p) => folderButton(p, PLATFORM_LABEL[p][lang]))}</ul>
        </nav>
        <div className="ie-main">
          {current
            ? <CaseView c={current} onBeforeAfter={onBeforeAfter} onDemo={onDemo} />
            : <Tiles cases={casesIn(folder)} title={folder ? folderLabel(folder, lang) : t.allProjects} onOpen={(id) => go(`case:${id}`)} />}
        </div>
      </div>
    </div>
  );
}

/** Заголовок новой «страницы» получает фокус: кнопка, по которой нажали, исчезла, клавиатура не теряется. */
function useFocusHeading<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, [key]);
  return ref;
}

function Tiles({ cases, title, onOpen }: { cases: Case[]; title: string; onOpen: (id: string) => void }) {
  const t = useT();
  const lang = useLang();
  const head = useFocusHeading<HTMLHeadingElement>(title);
  return (
    <>
      <header className="ie-head">
        <h3 ref={head} tabIndex={-1}>{title}</h3>
        <p>{t.items(cases.length)}</p>
      </header>
      <ul className="tiles">
        {cases.map((c) => (
          <li key={c.id}>
            <button type="button" className="tile" onClick={() => onOpen(c.id)}>
              <Shot c={c} small />
              <span className="tile-text">
                <strong>{c.title[lang]}</strong>
                <span>{c.lead[lang]}</span>
                <em>{PLATFORM_LABEL[c.platform][lang]}</em>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Скриншот кейса или, если его нет, обложка: значок типа работ и причина, почему нет скриншота (под NDA, MVP). */
function Shot({ c, small }: { c: Case; small?: boolean }) {
  const lang = useLang();
  if (c.image) {
    return small
      ? <img src={c.image} alt="" width={240} height={150} loading="lazy" decoding="async" />
      : <img src={c.image} alt={c.title[lang]} width={1200} height={750} decoding="async" />;
  }
  return (
    <span className="cover" data-small={small || undefined} role={small ? undefined : 'img'} aria-label={small ? undefined : c.title[lang]}>
      <Icon name={c.kinds.includes('analytics') ? 'dashboard' : 'computer'} size={small ? 32 : 48} />
      {!small && <span>{c.linkNote?.[lang] ?? c.title[lang]}</span>}
    </span>
  );
}

const hostOf = (url: string) => new URL(url).host.replace(/^www\./, '');

function CaseView({ c, onBeforeAfter, onDemo }: { c: Case; onBeforeAfter: (id: string) => void; onDemo: () => void }) {
  const t = useT();
  const lang = useLang();
  const head = useFocusHeading<HTMLHeadingElement>(c.id);
  return (
    <article className="case">
      <header className="case-head">
        <p className="case-platform">{PLATFORM_LABEL[c.platform][lang]}</p>
        <h3 ref={head} tabIndex={-1}>{c.title[lang]}</h3>
        <p className="case-lead">{c.lead[lang]}</p>
      </header>
      <div className="case-actions">
        {c.url && (
          <a className="btn btn-primary" href={c.url} target="_blank" rel="noopener noreferrer" onClick={() => goal('site_click', { case: c.id })}>
            {c.demo ? t.openDemo : t.openSite}: {hostOf(c.url)} <Icon name="external" size={12} />
          </a>
        )}
        {c.demo && <button type="button" className="btn" onClick={onDemo}>{t.appTitle.dashboard}</button>}
        {c.before && <button type="button" className="btn" onClick={() => onBeforeAfter(c.id)}>{t.beforeAfter}</button>}
        {c.github && <a className="btn" href={c.github} target="_blank" rel="noopener noreferrer">{t.code}</a>}
      </div>
      {c.linkNote && c.image && <p className="case-note">{c.linkNote[lang]}</p>}
      <figure className="case-shot">
        <Shot c={c} />
      </figure>
      {c.task && (
        <>
          <h4>{t.task}</h4>
          <p className="case-text">{c.task[lang]}</p>
        </>
      )}
      <h4>{t.did}</h4>
      <ul className="case-did">{c.did[lang].map((d) => <li key={d}>{d}</li>)}</ul>
      {c.result && (
        <>
          <h4>{t.result}</h4>
          <p className="case-text">{c.result[lang]}</p>
        </>
      )}
      <h4>{t.stack}</h4>
      <p className="case-stack">{c.stack.join(', ')}</p>
    </article>
  );
}
