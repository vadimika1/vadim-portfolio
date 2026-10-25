// Текстовые окна: «Мой компьютер», «Обо мне» (проводник), резюме и услуги (Блокнот), отзывы.
import { casesIn, folderLabel, KINDS, PLATFORMS, type Folder } from '../content/cases.ts';
import { ABOUT, FULL_NAME, KWORK_STATS, LINKS, RESUME, REVIEWS, SERVICES, SKILLS, SOFTWARE } from '../content/profile.ts';
import { useLang, useT } from '../i18n.ts';
import { goal } from '../metrika.ts';
import type { AppId } from '../wm.ts';
import { Icon } from '../components/Icon.tsx';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

const COMPUTER_FOLDERS: Folder[] = [...KINDS.map((k) => `kind:${k}` as const), ...PLATFORMS];

export function MyComputer({ onFolder, onOpen }: { onFolder: (f: Folder) => void; onOpen: (app: AppId) => void }) {
  const t = useT();
  const lang = useLang();
  return (
    <div className="explorer">
      <section>
        <h3>{t.folders}</h3>
        <ul className="icon-grid">
          {COMPUTER_FOLDERS.map((f) => (
            <li key={f}>
              <button type="button" onClick={() => onFolder(f)}>
                <Icon name="folder" size={32} />
                <span>{folderLabel(f, lang)}<small>{t.items(casesIn(f).length)}</small></span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>{t.myDocs}</h3>
        <ul className="icon-grid">
          {(['resume', 'services', 'reviews', 'paint'] as const).map((a) => (
            <li key={a}>
              <button type="button" onClick={() => onOpen(a)}><Icon name={a} size={32} /><span>{t.icon[a]}</span></button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>{t.links2}</h3>
        <ul className="icon-grid">
          <li><a href={LINKS.github} {...ext}><Icon name="github" size={32} /><span>GitHub</span></a></li>
          <li><a href={LINKS.kwork} {...ext}><Icon name="reviews" size={32} /><span>{t.kwork}</span></a></li>
          <li><a href={LINKS.freelancer} {...ext}><Icon name="globe" size={32} /><span>Freelancer</span></a></li>
          <li><a href={LINKS.studio} {...ext}><Icon name="dashboard" size={32} /><span>TableTools</span></a></li>
        </ul>
      </section>
    </div>
  );
}

export function About({ onWrite }: { onWrite: () => void }) {
  const t = useT();
  const lang = useLang();
  return (
    <div className="about">
      <aside className="about-side">
        <section className="panel">
          <h3>{t.links}</h3>
          <ul>
            <li><a href={LINKS.github} {...ext}>GitHub (vadimika1)</a></li>
            <li><a href={LINKS.kwork} {...ext}>{t.kwork} (vadimika1)</a></li>
            <li><a href={LINKS.freelancer} {...ext}>Freelancer (vadimika1)</a></li>
            <li><a href={LINKS.studio} {...ext}>TableTools</a></li>
            <li><button type="button" className="linklike" onClick={onWrite}>{t.writeMe}</button></li>
          </ul>
        </section>
        <section className="panel">
          <h3>{t.skills}</h3>
          <p className="chips">{SKILLS.map((s) => <span key={s}>{s}</span>)}</p>
        </section>
        <section className="panel">
          <h3>{t.software}</h3>
          <p className="chips">{SOFTWARE.map((s) => <span key={s}>{s}</span>)}</p>
        </section>
      </aside>
      <div className="about-main">
        <header className="about-head">
          <img src="/img/vadim.webp" alt={lang === 'ru' ? 'Вадим у Казанского собора' : 'Vadim at Kazan Cathedral'} width={112} height={112} />
          <div>
            <h3>{FULL_NAME[lang]}</h3>
            <p>{t.loginRole}</p>
          </div>
        </header>
        {ABOUT[lang].map((p) => <p key={p}>{p}</p>)}
      </div>
    </div>
  );
}

export function Resume() {
  const t = useT();
  const lang = useLang();
  return (
    <div className="notepad">
      <div className="notepad-tools">
        <a className="btn" href={`/resume-${lang}.pdf`} download onClick={() => goal('resume_pdf', { lang })}>{t.save}</a>
      </div>
      <pre className="notepad-text" tabIndex={0}>{RESUME[lang]}</pre>
    </div>
  );
}

export function Services({ onWrite }: { onWrite: () => void }) {
  const t = useT();
  const lang = useLang();
  return (
    <div className="notepad">
      <div className="notepad-text" tabIndex={0}>
        <table className="price">
          <tbody>
            {SERVICES.map((s) => (
              <tr key={s.name.ru}>
                <th scope="row">{s.name[lang]}{s.note && <small>{s.note[lang]}</small>}</th>
                <td>{s.price[lang]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          {lang === 'ru'
            ? 'Точную цену называю после того, как посмотрю сайт и задачу. Работаю на копии, боевой сайт не трогаю до вашего «да».'
            : 'I quote the exact price after looking at the site and the task. I work on a copy and touch the live site only after your OK.'}
        </p>
        <button type="button" className="btn btn-primary" onClick={onWrite}>{t.writeMe}</button>
      </div>
    </div>
  );
}

export function Reviews() {
  const t = useT();
  const lang = useLang();
  return (
    <div className="reviews">
      <header className="reviews-head">
        <a href={LINKS.kwork} {...ext}>{t.reviewsOn} <Icon name="external" size={12} /></a>
        <dl>
          <div><dt>{t.rating}</dt><dd>{KWORK_STATS.rating}</dd></div>
          <div><dt>{t.orders}</dt><dd>{KWORK_STATS.orders}</dd></div>
        </dl>
      </header>
      {lang === 'en' && <p className="reviews-note">Clients wrote these reviews in Russian; quoted as is.</p>}
      <ul>
        {REVIEWS.map((r) => (
          <li key={`${r.author}-${r.project}`}>
            <blockquote>{r.text}</blockquote>
            <p><Icon name="reviews" size={14} /> {r.author}, «{r.project}»</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
