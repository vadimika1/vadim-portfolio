// ICQ «Написать мне» (заявка уходит в приём заявок tabletools.ru → Telegram Вадима), Paint «до/после», живой дашборд.
import { useMemo, useRef, useState } from 'react';
import { CASES, caseById } from '../content/cases.ts';
import { LINKS } from '../content/profile.ts';
import { useLang, useT } from '../i18n.ts';
import { goal } from '../metrika.ts';
import { play } from '../sound.ts';
import { Icon } from '../components/Icon.tsx';

const LEAD_URL = 'https://tabletools.ru/api/lead/'; // с косой чертой: без неё 308, и браузер не пройдёт CORS
const SEND_TIMEOUT_MS = 15_000;
const PAGE = 'vadim.tabletools.ru (портфолио)';

type Status = 'idle' | 'sending' | 'sent' | 'fail';

export function Icq() {
  const t = useT();
  const opened = useRef(Date.now());
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch(LEAD_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
        body: JSON.stringify({
          name: f.get('name'), contact: f.get('contact'), message: f.get('message'),
          consent: f.get('consent') === 'on' ? 'yes' : 'no', website: f.get('hp_field'),
          service: 'Портфолио', page: PAGE, elapsed: Date.now() - opened.current,
        }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !json?.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setStatus('sent');
      play('notify');
      goal('icq_sent');
    } catch (err) {
      setStatus('fail');
      // Своё сообщение сервера (например, «Укажите телефон») показываем; сетевые и тайм-аут — общим текстом.
      const own = err instanceof Error && err.name === 'Error' && !err.message.startsWith('HTTP');
      setError(own ? (err as Error).message : null);
      play('error');
    }
  };

  return (
    <div className="icq">
      <header className="icq-head">
        <Icon name="icq" size={28} />
        <div>
          <strong>Вадим</strong>
          <span className="icq-online"><i aria-hidden="true" /> {t.icqOnline}</span>
        </div>
      </header>
      {status === 'sent' ? (
        <p className="icq-done" role="status">{t.icqSent}</p>
      ) : (
        <form className="icq-form" onSubmit={handleSubmit}>
          <label>{t.icqName}<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>
          <label>{t.icqContact}<input name="contact" required minLength={5} maxLength={80} autoComplete="email" /></label>
          <label>{t.icqMessage}<textarea name="message" rows={5} maxLength={2000} /></label>
          <div className="hp" aria-hidden="true"><input name="hp_field" tabIndex={-1} autoComplete="off" aria-label="hp" /></div>
          <label className="icq-consent">
            <input type="checkbox" name="consent" required />
            <span>{t.icqConsent} (<a href={LINKS.policy} target="_blank" rel="noopener noreferrer">{t.policy}</a>)</span>
          </label>
          {status === 'fail' && (
            <p className="icq-error" role="alert">
              {error ?? t.icqFail} <a href={LINKS.kwork} target="_blank" rel="noopener noreferrer">{t.kwork}</a>
            </p>
          )}
          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? t.icqSending : t.icqSend}
          </button>
        </form>
      )}
    </div>
  );
}

export function Paint({ caseId, onPick }: { caseId: string | null; onPick: (id: string) => void }) {
  const t = useT();
  const lang = useLang();
  const withBefore = useMemo(() => CASES.filter((c) => c.before), []);
  const pickable = withBefore.length ? withBefore : CASES;
  const c = caseById(caseId ?? '') ?? pickable[0]!;
  const [split, setSplit] = useState(50);
  return (
    <div className="paint">
      <div className="paint-tools">
        <label>
          {t.paintPick}{' '}
          <select value={c.id} onChange={(e) => onPick(e.target.value)}>
            {pickable.map((x) => <option key={x.id} value={x.id}>{x.title[lang]}</option>)}
          </select>
        </label>
        {c.before && (
          <label className="paint-slider">
            {t.paintHint}
            <input type="range" min={0} max={100} value={split} onChange={(e) => setSplit(Number(e.target.value))} aria-label={`${t.paintBefore} / ${t.paintAfter}`} />
          </label>
        )}
      </div>
      <div className="paint-canvas">
        {c.before ? (
          <>
            <div className="ba" style={{ '--split': `${split}%` } as React.CSSProperties}>
              <img src={c.image} alt={`${c.title[lang]}: ${t.paintAfter}`} />
              <img className="ba-before" src={c.before} alt={`${c.title[lang]}: ${t.paintBefore}`} />
              <span className="ba-label ba-l">{t.paintBefore}</span>
              <span className="ba-label ba-r">{t.paintAfter}</span>
            </div>
            {c.beforeNote && <p className="paint-note">{c.beforeNote[lang]}</p>}
          </>
        ) : (
          <figure>
            <img src={c.image} alt={c.title[lang]} />
            <figcaption>{t.paintSoon}</figcaption>
          </figure>
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  const t = useT();
  return (
    <div className="ie dash">
      <div className="ie-bar">
        <div className="ie-address">
          <span>{t.address}</span>
          <span className="ie-url"><Icon name="globe" size={14} /> tabletools.ru/demo/</span>
        </div>
        <a className="btn" href={LINKS.demo} target="_blank" rel="noopener noreferrer" onClick={() => goal('site_click', { case: 'tabletools' })}>
          {t.newTab} <Icon name="external" size={12} />
        </a>
      </div>
      <p className="dash-note">{t.dashNote}</p>
      <iframe className="dash-frame" src={LINKS.demo} title={t.appTitle.dashboard} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
    </div>
  );
}
