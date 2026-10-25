// Проверка сборки на остатки оригинала и чужих ассетов (replica-brand): имена автора-референса, обои и шрифты XP,
// XP.css, скриншоты под NDA. Запуск: node scripts/brand-sweep.mjs dist → SWEEP_OK или список находок.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.argv[2] ?? 'dist';
const TEXT = new Set(['.html', '.js', '.css', '.svg', '.json', '.txt', '.xml', '.map']);
// В текстах: имя и домен референса, файлы и названия ассетов Microsoft, закрытые темы.
const TEXT_BANNED = [/mitch/i, /ivin\b/i, /bliss/i, /xp\.css/i, /tahoma\.(ttf|woff2?)/i, /tripworks/i, /roistat/i, /app\.tabletools/i, /svlom|metallservis|onemaker|oneseoo/i];
// В именах файлов: шрифты Tahoma, звуки и обои XP, скриншот админки.
const FILE_BANNED = [/tahoma/i, /bliss/i, /\.wav$/i, /windows/i, /UNSAFE/i, /admin/i];

const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    const rel = relative(root, p);
    for (const re of FILE_BANNED) if (re.test(name)) hits.push(`${rel}: имя файла ${re}`);
    if (!TEXT.has(extname(name))) continue;
    const text = readFileSync(p, 'utf8');
    for (const re of TEXT_BANNED) {
      const m = re.exec(text);
      if (m) hits.push(`${rel}: «${text.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, ' ')}» ${re}`);
    }
  }
}
walk(root);
if (hits.length) {
  console.log(hits.join('\n'));
  process.exit(1);
}
console.log('SWEEP_OK');
