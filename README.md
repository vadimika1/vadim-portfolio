# VadimXP — портфолио в стиле Windows XP

Живая версия: https://vadim.tabletools.ru, обычная страница без окон: https://vadim.tabletools.ru/classic/

Портфолио веб-разработчика Вадима Антоновича в виде рабочего стола: окна перетаскиваются, сворачиваются и разворачиваются, в «Пуске» лежат программы, в трее — язык, звук и часы. На телефоне тот же контент открывается как «Карманный ПК».

A web developer portfolio styled as a Windows XP desktop: draggable windows, a Start menu, a tray with language, sound and a clock. On phones it turns into a “Pocket PC” launcher. Live: https://vadim.tabletools.ru

## Что внутри

- Свой оконный менеджер: чистый reducer в `src/wm.ts` (открыть, фокус, свернуть, развернуть, перетащить), тесты в `tests/wm.test.ts`.
- Кейсы как данные: `src/content/cases-sites.ts` и `cases-systems.ts`, срезы по типу работ и по платформе. Тест проверяет, что у каждого кейса есть тексты на двух языках и картинки на месте.
- «До и после» в окне Paint: ползунок поверх двух скриншотов.
- Звук синтезирует Web Audio, без готовых семплов. Включается только кликом на экране входа.
- `/classic/` собирается при сборке скриптом `scripts/classic.ts`: обычная страница для поиска и для тех, кто торопится.
- Без внешних ассетов Windows: иконки нарисованы в SVG, `scripts/brand-sweep.mjs` проверяет сборку на остатки чужих названий и файлов.
- CSP без `unsafe-inline` для скриптов, заголовки в `public/vercel.json`.

## Стек

React 19, TypeScript, Vite, Vitest. Без UI-библиотек.

## Запуск

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm test
pnpm build      # dist/ и dist/classic/
```

Номер счётчика Яндекс Метрики берётся из `VITE_METRIKA_ID` (`.env.production`); без него счётчик не грузится.

## Права

Код — Вадим Антонович. Фото обоев — Adrien Olichon, Unsplash License (см. `CREDITS.md`). Скриншоты в `public/cases/` — сайты клиентов и обезличенные экраны; их нельзя переиспользовать.
