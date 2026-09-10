/** Sayfayi ekran ekran gez, her karede konsol hatalarini da topla.
 *  Kullanim: node scripts/scan.mjs [yol] [etiket] [genislik] [yukseklik] */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const [path = '/', label = 'home', w = '1440', h = '900'] = process.argv.slice(2);
const OUT = `/work/out/scan/${label}`;
await mkdir(OUT, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, locale: 'tr-TR' });
const p = await ctx.newPage();
const errs = [];
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
p.on('pageerror', (e) => errs.push(String(e)));
await p.goto('http://localhost:3000' + path, { waitUntil: 'networkidle', timeout: 60000 });
// reveal animasyonlarini tetikle
await p.evaluate(async () => {
  await new Promise((r) => { let y = 0; const s = () => { window.scrollBy(0, 600); y += 600;
    if (y < document.body.scrollHeight && y < 60000) setTimeout(s, 60); else setTimeout(r, 900); }; s(); });
});
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(500);
const total = await p.evaluate(() => document.body.scrollHeight);
const step = +h;
const frames = Math.min(20, Math.ceil(total / step));
for (let i = 0; i < frames; i++) {
  await p.evaluate((y) => window.scrollTo(0, y), i * step);
  await p.waitForTimeout(420);
  await p.screenshot({ path: `${OUT}/${String(i + 1).padStart(2, '0')}.png` });
}
console.log(`${label}: ${frames} kare · sayfa ${total}px · ${errs.length ? 'KONSOL HATASI: ' + errs.slice(0,3).join(' | ') : 'konsol temiz'}`);
await b.close();
