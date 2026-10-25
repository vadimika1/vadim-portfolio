import { describe, expect, test } from 'vitest';
import { focused, iconsWidth, initialDesk, reduce, taskbarClick, TASKBAR_H, type Action, type Desk } from '../src/wm.ts';

const run = (d: Desk, ...as: Action[]) => as.reduce(reduce, d);
const desk = () => initialDesk({ w: 1440, h: 900 });

describe('оконный менеджер', () => {
  test('открытое окно встаёт сверху и в фокус', () => {
    const d = run(desk(), { type: 'open', app: 'projects' }, { type: 'open', app: 'about' });
    expect(d.wins).toHaveLength(2);
    expect(focused(d)?.app).toBe('about');
  });

  test('повторный запуск не плодит окна: поднимает, разворачивает из свёрнутого и меняет папку', () => {
    let d = run(desk(), { type: 'open', app: 'projects' }, { type: 'open', app: 'about' });
    const pid = d.wins[0]!.id;
    d = run(d, { type: 'minimize', id: pid }, { type: 'open', app: 'projects', arg: 'tilda' });
    expect(d.wins).toHaveLength(2);
    expect(focused(d)?.id).toBe(pid);
    expect(d.wins.find((w) => w.id === pid)).toMatchObject({ min: false, arg: 'tilda' });
  });

  test('свёрнутое окно теряет фокус, клик по панели задач возвращает его, повторный — сворачивает', () => {
    let d = run(desk(), { type: 'open', app: 'projects' }, { type: 'open', app: 'icq' });
    const icq = d.wins[1]!.id;
    d = reduce(d, taskbarClick(d, icq));
    expect(d.wins[1]!.min).toBe(true);
    expect(focused(d)?.app).toBe('projects');
    d = reduce(d, taskbarClick(d, icq));
    expect(focused(d)?.id).toBe(icq);
  });

  test('закрытие убирает окно, фокус переходит на следующее', () => {
    let d = run(desk(), { type: 'open', app: 'projects' }, { type: 'open', app: 'resume' });
    d = reduce(d, { type: 'close', id: d.wins[1]!.id });
    expect(d.wins.map((w) => w.app)).toEqual(['projects']);
    expect(focused(d)?.app).toBe('projects');
  });

  test('окно помещается на экран и не уезжает за край целиком', () => {
    const small = initialDesk({ w: 800, h: 600 });
    let d = reduce(small, { type: 'open', app: 'dashboard' });
    const w = d.wins[0]!;
    expect(w.x).toBeGreaterThanOrEqual(0);
    expect(w.x + w.w).toBeLessThanOrEqual(800);
    expect(w.y + w.h).toBeLessThanOrEqual(600 - TASKBAR_H);
    d = reduce(d, { type: 'move', id: w.id, x: 5000, y: -300 });
    const moved = d.wins[0]!;
    expect(moved.x).toBeLessThan(800);
    expect(moved.y).toBe(0);
  });

  test('на широком экране окно не закрывает колонку значков', () => {
    for (const view of [{ w: 1024, h: 768 }, { w: 768, h: 1024 }, { w: 1440, h: 900 }]) {
      let d = initialDesk(view);
      for (const app of ['projects', 'about', 'icq', 'resume', 'dashboard'] as const) d = reduce(d, { type: 'open', app });
      for (const w of d.wins) {
        expect(w.x).toBeGreaterThanOrEqual(iconsWidth(view));
        expect(w.x + w.w).toBeLessThanOrEqual(view.w);
      }
    }
  });

  test('экран уменьшили — окно у правого края возвращается в досягаемость', () => {
    let d = reduce(desk(), { type: 'open', app: 'about' });
    d = reduce(d, { type: 'move', id: d.wins[0]!.id, x: 1300, y: 700 });
    d = reduce(d, { type: 'view', w: 800, h: 600 });
    const w = d.wins[0]!;
    expect(w.x).toBeLessThanOrEqual(800 - 80);
    expect(w.y).toBeLessThanOrEqual(600 - TASKBAR_H - 24);
  });

  test('развернуть и вернуть', () => {
    let d = reduce(desk(), { type: 'open', app: 'paint' });
    const id = d.wins[0]!.id;
    d = reduce(d, { type: 'toggleMax', id });
    expect(d.wins[0]!.max).toBe(true);
    d = reduce(d, { type: 'toggleMax', id });
    expect(d.wins[0]!.max).toBe(false);
  });

  test('выход закрывает все окна', () => {
    const d = run(desk(), { type: 'open', app: 'projects' }, { type: 'open', app: 'icq' }, { type: 'reset' });
    expect(d.wins).toEqual([]);
  });
});
