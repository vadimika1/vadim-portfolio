// Оконный менеджер рабочего стола: какие окна открыты, порядок, позиция, свёрнуто или развёрнуто.
// Чистый reducer без React — проверяется юнит-тестами (src/wm.test.ts).

export const APPS = ['projects', 'computer', 'about', 'resume', 'services', 'reviews', 'icq', 'paint', 'dashboard'] as const;
export type AppId = (typeof APPS)[number];

export type Win = {
  id: string;
  app: AppId;
  /** Параметр окна: платформа или кейс для «Моих проектов», кейс для Paint. */
  arg: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  min: boolean;
  max: boolean;
};

export type Desk = { wins: Win[]; z: number; seq: number; view: { w: number; h: number } };

export type Action =
  | { type: 'open'; app: AppId; arg?: string | null }
  | { type: 'close'; id: string }
  | { type: 'focus'; id: string }
  | { type: 'minimize'; id: string }
  | { type: 'toggleMax'; id: string }
  | { type: 'move'; id: string; x: number; y: number }
  | { type: 'arg'; id: string; arg: string | null }
  | { type: 'view'; w: number; h: number }
  | { type: 'reset' };

export const TASKBAR_H = 34;
const CASCADE = 28;
const MIN_VISIBLE = 80; // столько окна остаётся на экране, когда его утащили к краю

/** Размер окна по умолчанию: проекты и дашборд крупные, блокноты и ICQ — поменьше. */
export const DEFAULT_SIZE: Record<AppId, { w: number; h: number }> = {
  projects: { w: 920, h: 620 },
  dashboard: { w: 1000, h: 640 },
  computer: { w: 640, h: 440 },
  about: { w: 760, h: 540 },
  resume: { w: 620, h: 560 },
  services: { w: 560, h: 480 },
  reviews: { w: 600, h: 520 },
  icq: { w: 360, h: 520 },
  paint: { w: 860, h: 600 },
};

export const initialDesk = (view = { w: 1280, h: 800 }): Desk => ({ wins: [], z: 0, seq: 0, view });

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi));

/** Значки слева колонками по ICON_ROW_H; окна по возможности встают правее, чтобы значки оставались под рукой. */
export const DESK_ICONS = 10;
export const ICON_ROW_H = 80;
export const ICON_COL_W = 96;
const ICONS_TOP = 10;

export function iconsWidth(view: { w: number; h: number }): number {
  const rows = Math.max(1, Math.floor((view.h - TASKBAR_H - ICONS_TOP * 2) / ICON_ROW_H));
  return Math.ceil(DESK_ICONS / rows) * ICON_COL_W + 16;
}

function place(d: Desk, app: AppId): Pick<Win, 'x' | 'y' | 'w' | 'h'> {
  const area = { w: d.view.w, h: d.view.h - TASKBAR_H };
  const left = area.w >= 700 ? iconsWidth(d.view) : 8;
  const size = DEFAULT_SIZE[app];
  const w = Math.min(size.w, area.w - left - 8);
  const h = Math.min(size.h, area.h - 16);
  const step = d.wins.filter((x) => !x.min).length % 6;
  const x = clamp(left + Math.round((area.w - left - w) / 2) - 2 * CASCADE + step * CASCADE, left, area.w - w - 8);
  const y = clamp(Math.round((area.h - h) / 2) - 2 * CASCADE + step * CASCADE, 8, area.h - h - 8);
  return { x, y, w, h };
}

const bump = (d: Desk, id: string, patch: Partial<Win> = {}): Desk => ({
  ...d,
  z: d.z + 1,
  wins: d.wins.map((w) => (w.id === id ? { ...w, ...patch, z: d.z + 1 } : w)),
});

export function reduce(d: Desk, a: Action): Desk {
  switch (a.type) {
    case 'open': {
      // Одно окно на приложение: повторный запуск поднимает его и меняет параметр (например, папку платформы).
      const found = d.wins.find((w) => w.app === a.app);
      if (found) return bump(d, found.id, { min: false, ...(a.arg !== undefined && { arg: a.arg }) });
      const id = `${a.app}-${d.seq + 1}`;
      const win: Win = { id, app: a.app, arg: a.arg ?? null, ...place(d, a.app), z: d.z + 1, min: false, max: false };
      return { ...d, seq: d.seq + 1, z: d.z + 1, wins: [...d.wins, win] };
    }
    case 'close':
      return { ...d, wins: d.wins.filter((w) => w.id !== a.id) };
    case 'focus':
      return d.wins.some((w) => w.id === a.id) ? bump(d, a.id, { min: false }) : d;
    case 'minimize':
      return { ...d, wins: d.wins.map((w) => (w.id === a.id ? { ...w, min: true } : w)) };
    case 'toggleMax':
      return bump(d, a.id, { max: !d.wins.find((w) => w.id === a.id)?.max });
    case 'move': {
      const area = { w: d.view.w, h: d.view.h - TASKBAR_H };
      return {
        ...d,
        wins: d.wins.map((w) => (w.id === a.id
          ? { ...w, x: clamp(a.x, MIN_VISIBLE - w.w, area.w - MIN_VISIBLE), y: clamp(a.y, 0, area.h - 24) }
          : w)),
      };
    }
    case 'arg':
      return { ...d, wins: d.wins.map((w) => (w.id === a.id ? { ...w, arg: a.arg } : w)) };
    case 'view': {
      // Окно уменьшили — окна, уехавшие за край, возвращаются так, чтобы их можно было ухватить.
      const area = { w: a.w, h: a.h - TASKBAR_H };
      return {
        ...d,
        view: { w: a.w, h: a.h },
        wins: d.wins.map((w) => ({ ...w, x: clamp(w.x, MIN_VISIBLE - w.w, area.w - MIN_VISIBLE), y: clamp(w.y, 0, area.h - 24) })),
      };
    }
    case 'reset':
      return initialDesk(d.view);
  }
}

/** Окно в фокусе — верхнее из не свёрнутых. */
export function focused(d: Desk): Win | null {
  return d.wins.filter((w) => !w.min).reduce<Win | null>((top, w) => (!top || w.z > top.z ? w : top), null);
}

/** Клик по кнопке окна в панели задач: в фокусе — свернуть, иначе — поднять. */
export function taskbarClick(d: Desk, id: string): Action {
  return focused(d)?.id === id ? { type: 'minimize', id } : { type: 'focus', id };
}
