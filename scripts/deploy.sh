#!/usr/bin/env bash
# Выкладка на vadim.tabletools.ru (Vercel, проект vadim-portfolio).
# Собираем у себя и выкладываем готовую dist статикой: на проде ровно то, что проверено локально.
# Номер счётчика Метрики — VITE_METRIKA_ID в .env.production.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
SCOPE=admin-70536476s-projects

pnpm build
pnpm sweep
mkdir -p dist/.vercel
if [ -f .vercel/project.json ]; then
  cp .vercel/project.json dist/.vercel/
else
  echo "Нет .vercel/project.json: pnpm dlx vercel@latest link --yes --project vadim-portfolio --scope $SCOPE" >&2; exit 1
fi
cd dist
pnpm dlx vercel@latest deploy --prod --yes --scope "$SCOPE"
# Привязку проекта храним рядом с кодом: vite при сборке очищает dist.
[ -f .vercel/project.json ] && mkdir -p ../.vercel && cp .vercel/project.json ../.vercel/
