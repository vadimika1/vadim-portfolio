// HTML резюме для печати в PDF (scripts/resume-pdf.js через playwright-cli). Текст — RESUME из src/content/profile.ts.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RESUME } from '../src/content/profile.ts';

const out = process.argv[2] ?? 'dist/resume-src';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
mkdirSync(out, { recursive: true });
for (const lang of ['ru', 'en'] as const) {
  const [name, role, ...rest] = RESUME[lang].split('\n');
  const body = rest.join('\n').trim().split(/\n\n+/).map((block) => {
    const [head, ...lines] = block.split('\n');
    return `<section><h2>${esc(head!)}</h2><p>${lines.map(esc).join('<br>')}</p></section>`;
  }).join('');
  writeFileSync(join(out, `${lang}.html`), `<!doctype html><html lang="${lang}"><meta charset="utf-8"><title>${esc(name!)}</title>
<style>@page{size:A4;margin:16mm 18mm}body{font:11pt/1.5 Tahoma,Verdana,sans-serif;color:#10182a;margin:0}
header{display:flex;gap:16px;align-items:center;border-bottom:3px solid #f0a35a;padding-bottom:10px;margin-bottom:6px}
header img{width:72px;height:72px;border-radius:6px}h1{margin:0;font-size:22pt;color:#1846b4}header p{margin:2px 0 0}
h2{font-size:11pt;color:#1846b4;margin:14px 0 4px}section p{margin:0}</style>
<header><img src="${new URL('../public/img/vadim.webp', import.meta.url).href}" alt=""><div><h1>${esc(name!)}</h1><p>${esc(role!)}</p></div></header>${body}</html>`);
}
console.log('RESUME_HTML_OK');
