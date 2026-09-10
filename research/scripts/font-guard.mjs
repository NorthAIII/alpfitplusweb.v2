/**
 * Font kapsama guvencesi.
 *
 * Fontlar sitede gecen karakter kumesine gore daraltildi. Bu betik siteyi
 * gezip EKRANDA GERCEKTEN CIZILEN her karakteri toplar ve kumeye karsi
 * dogrular. Kumede olmayan bir karakter, o glifin sistem fontuna dusmesi
 * demektir — gozle fark edilmesi zor, bu yuzden olculuyor.
 */
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const charset = new Set(await readFile('/work/FONT-KARAKTER-KUMESI.txt', 'utf8'));
const BASE = process.env.BASE || 'http://localhost:3100';
const PAGES = ['/', '/ozellikler', '/fiyat', '/segmentler', '/segmentler/pilates-reformer',
  '/segmentler/boks-dovus', '/segmentler/crossfit', '/segmentler/cok-subeli-zincir',
  '/gecis', '/yazilim-secerken',
  '/demo', '/destek', '/kvkk', '/gizlilik', '/kullanim-kosullari', '/olmayan-sayfa'];

const b = await chromium.launch();
const missing = new Map();
let scanned = 0;

for (const path of PAGES) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'tr-TR' });
  const p = await ctx.newPage();
  await p.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 });
  // asistan panelini de ac — icindeki metin de sayilsin
  try {
    await p.evaluate(() => window.scrollTo(0, 900));
    await p.waitForTimeout(400);
    const btn = await p.$('button[aria-controls="asistan-panel"]');
    if (btn) { await btn.click(); await p.waitForTimeout(500); }
  } catch {}
  const text = await p.evaluate(() => document.body.innerText);
  for (const ch of text) {
    scanned++;
    if (/\s/.test(ch)) continue;
    if (!charset.has(ch)) {
      const k = `${ch} (U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')})`;
      missing.set(k, (missing.get(k) || 0) + 1);
    }
  }
  await ctx.close();
}
await b.close();
console.log(`Kümede ${charset.size} karakter · ${PAGES.length} sayfa · ${scanned} karakter tarandı`);
if (missing.size === 0) {
  console.log('✓ Kümede olmayan karakter YOK. Font kapsaması tam.');
} else {
  console.log(`✗ KAPSAMA AÇIĞI — ${missing.size} karakter kümede yok:`);
  for (const [k, n] of [...missing].sort((a, b) => b[1] - a[1])) console.log(`   ${k}  ${n} kez`);
  process.exitCode = 1;
}
