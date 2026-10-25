import { existsSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { CASES, casesIn, KINDS, PLATFORMS, platformCount } from '../src/content/cases.ts';
import { ABOUT, RESUME, REVIEWS, SERVICES } from '../src/content/profile.ts';

const pub = (p: string) => new URL(`../public${p}`, import.meta.url);

describe('данные кейсов', () => {
  test.each(CASES.map((c) => [c.id, c] as const))('%s: ссылка https, картинка есть (без неё только системы), RU и EN заполнены', (_, c) => {
    if (c.url) expect(c.url).toMatch(/^https:\/\//);
    if (c.image) expect(existsSync(pub(c.image))).toBe(true);
    else expect(c.kinds.includes('sites')).toBe(false);
    expect(c.kinds.length).toBeGreaterThan(0);
    if (c.before) expect(existsSync(pub(c.before))).toBe(true);
    for (const l of ['ru', 'en'] as const) {
      expect(c.title[l].trim()).not.toBe('');
      expect(c.lead[l].trim()).not.toBe('');
      expect(c.did[l].length).toBeGreaterThan(0);
    }
    expect(c.did.ru.length).toBe(c.did.en.length);
  });

  test('id уникальны, у каждой платформы есть кейс', () => {
    expect(new Set(CASES.map((c) => c.id)).size).toBe(CASES.length);
    for (const p of PLATFORMS) expect(platformCount(p)).toBeGreaterThan(0);
  });

  test('без ссылки: из сайтов только kursi (решение Вадима) и архив закрытых сайтов, остальное — закрытые системы и MVP', () => {
    expect(CASES.filter((c) => !c.url && !c.archive && c.kinds.includes('sites')).map((c) => c.id)).toEqual(['kursi']);
    for (const c of CASES.filter((x) => x.archive)) {
      expect(c.url).toBeUndefined();
      expect(c.linkNote).toBeDefined();
      expect(c.image).toBeDefined();
    }
    for (const c of CASES.filter((x) => !x.url && !x.kinds.includes('sites'))) expect(c.linkNote).toBeDefined();
  });

  test('системы и аналитика не теряются: в каждом типе работ есть кейсы, у кейсов с задачей она на двух языках', () => {
    for (const k of KINDS) expect(casesIn(`kind:${k}`).length).toBeGreaterThan(0);
    for (const c of CASES) {
      if (c.task) expect(c.task.ru && c.task.en).toBeTruthy();
      if (c.result) expect(c.result.ru && c.result.en).toBeTruthy();
    }
  });

  test('нет снятых формулировок: устаревшее число тестов и завышенный Meta CAPI', () => {
    const all = JSON.stringify(CASES);
    expect(all).not.toContain('533');
    expect(all).not.toMatch(/Настроил .*Conversions API/);
  });

  test('нет кейсов, которые решили не публиковать', () => {
    const all = JSON.stringify(CASES).toLowerCase();
    for (const banned of ['svlom', 'metallservis', 'onemaker', 'oneseoo', 'app.tabletools', 'tripworks', 'roistat']) {
      expect(all).not.toContain(banned);
    }
  });

  test('профиль: тексты на двух языках, услуги с ценой, отзывы', () => {
    expect(ABOUT.ru.length).toBe(ABOUT.en.length);
    expect(RESUME.ru.split('\n')[0]).toBe('Вадим Антонович');
    expect(RESUME.en.split('\n')[0]).toBe('Vadzim Antanovich');
    expect(RESUME.ru).toContain('ОБРАЗОВАНИЕ');
    expect(RESUME.en).toContain('EDUCATION');
    expect(SERVICES.every((s) => s.price.ru && s.price.en)).toBe(true);
    expect(REVIEWS).toHaveLength(4);
  });
});

import { SHORTCUTS } from '../src/components/Shell.tsx';
import { DESK_ICONS } from '../src/wm.ts';

test('число значков на столе совпадает с расчётом раскладки окон', () => {
  expect(SHORTCUTS).toHaveLength(DESK_ICONS);
});

test('PDF резюме на обоих языках лежат в public', () => {
  for (const l of ['ru', 'en']) expect(existsSync(pub(`/resume-${l}.pdf`))).toBe(true);
});
