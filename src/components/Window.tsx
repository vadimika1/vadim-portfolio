// Окно рабочего стола: заголовок с перетаскиванием (pointer-события), свернуть, развернуть, закрыть.
// Фокус переходит в окно при открытии; Esc закрывает окно в фокусе.
import { useEffect, useRef, type ReactNode } from 'react';
import { useT } from '../i18n.ts';
import type { Win } from '../wm.ts';
import { Icon, type IconName } from './Icon.tsx';

type Props = {
  win: Win;
  title: string;
  icon: IconName;
  active: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onMove: (x: number, y: number) => void;
  /** Строка меню под заголовком (как в Блокноте и проводнике). */
  menu?: string[];
  children: ReactNode;
};

export function Window({ win, title, icon, active, onFocus, onClose, onMinimize, onToggleMax, onMove, menu, children }: Props) {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  // Окно, ставшее верхним (открыли, развернули из панели, закрыли то, что было сверху), получает фокус,
  // если фокус ещё не внутри: клавиатура не теряется на body.
  useEffect(() => {
    if (active && !win.min && !ref.current?.contains(document.activeElement)) ref.current?.focus({ preventScroll: true });
  }, [active, win.min]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (win.max || e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current) onMove(e.clientX - drag.current.dx, e.clientY - drag.current.dy);
  };
  const handlePointerUp = () => {
    drag.current = null;
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Esc в поле ввода — для подсказок браузера, а не закрытие окна с недописанным текстом.
    const field = (e.target as HTMLElement).closest('input, textarea, select');
    if (e.key === 'Escape' && !field && !e.defaultPrevented) {
      e.stopPropagation();
      onClose();
    }
  };

  const style = win.max
    ? { zIndex: win.z }
    : { zIndex: win.z, transform: `translate(${win.x}px, ${win.y}px)`, width: win.w, height: win.h };

  return (
    <section
      ref={ref}
      className="win"
      data-active={active}
      data-max={win.max}
      hidden={win.min}
      style={style}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      onPointerDownCapture={onFocus}
      onKeyDown={handleKeyDown}
    >
      <div
        className="win-title"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={onToggleMax}
      >
        <Icon name={icon} size={16} />
        <h2 className="win-caption">{title}</h2>
        <div className="win-buttons">
          <button type="button" className="win-btn" aria-label={t.minimize} title={t.minimize} onClick={onMinimize}>
            <span className="glyph-min" />
          </button>
          <button type="button" className="win-btn" aria-label={win.max ? t.restore : t.maximize} title={win.max ? t.restore : t.maximize} onClick={onToggleMax}>
            <span className={win.max ? 'glyph-restore' : 'glyph-max'} />
          </button>
          <button type="button" className="win-btn win-close" aria-label={t.close} title={t.close} onClick={onClose}>
            <span className="glyph-close" />
          </button>
        </div>
      </div>
      {menu && (
        <div className="win-menu" aria-hidden="true">
          {menu.map((m) => <span key={m}>{m}</span>)}
        </div>
      )}
      <div className="win-body">{children}</div>
    </section>
  );
}
