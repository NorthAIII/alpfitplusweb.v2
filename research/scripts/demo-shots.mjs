/** Alpfit.v1/demo icindeki kahraman ekranlari yakala (salt-okunur mount: /demo). */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const OUT = '/work/out/product';
await mkdir(OUT, { recursive: true });

const DESKTOP = [
  ['cockpit', 'cockpit.html'],
  ['takvim', 'takvim.html'],
  ['grup', 'grup.html'],
  ['finans', 'finans.html'],
  ['sube', 'sube.html'],
  ['antrenor', 'antrenor.html'],
  ['churn', 'churn.html'],
  ['raporlar', 'raporlar.html'],
  ['kampanya', 'kampanya.html'],
];
const PHONE = [
  ['uye', 'uye.html'],
  ['patron-mobil', 'patron-mobil.html'],
];

const b = await chromium.launch();

for (const [slug, file] of DESKTOP) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'tr-TR' });
  const p = await ctx.newPage();
  await p.goto(`file:///demo/${file}`, { waitUntil: 'load', timeout: 30000 });
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `${OUT}/${slug}.png` });
  console.log('desktop', slug);
  await ctx.close();
}

for (const [slug, file] of PHONE) {
  const ctx = await b.newContext({ viewport: { width: 414, height: 880 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'tr-TR' });
  const p = await ctx.newPage();
  await p.goto(`file:///demo/${file}`, { waitUntil: 'load', timeout: 30000 });
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `${OUT}/${slug}-phone.png` });
  console.log('phone  ', slug);
  await ctx.close();
}

await b.close();
