#!/usr/bin/env bash
# Выкладка на vadim.tabletools.ru. Портфолио живёт внутри проекта Vercel tabletools-site:
# сборка лежит там в public/vadim/, а next.config.ts отдаёт её на хосте vadim.tabletools.ru.
# Собираем у себя, кладём сборку в tabletools-site, коммитим её в main и выкладываем tabletools-site.
# Номер счётчика Метрики — VITE_METRIKA_ID в .env.production.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
SITE="${TABLETOOLS_SITE_DIR:-$HOME/Projects/tabletools-site}"

if [ "$(git -C "$SITE" rev-parse --abbrev-ref HEAD)" != main ]; then
  echo "В $SITE не ветка main: tabletools-site выкладывает только main" >&2; exit 1
fi
bash "$SITE/scripts/sync-static.sh" vadim
git -C "$SITE" add public/vadim
if git -C "$SITE" diff --cached --quiet; then
  echo "Сборка портфолио не изменилась, выкладывать нечего"; exit 0
fi
git -C "$SITE" commit -q -m "chore: портфолио $(git -C "$root" rev-parse --short HEAD)"
bash "$SITE/scripts/deploy.sh"
