/** Asistan panelini ac, bir soru sor, ekran goruntusu al. */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const OUT = '/work/out/chat';
await mkdir(OUT, { recursive: true });
const b = await chromium.launch();
for (const vp of [{ n: 'desktop', width: 1440, height: 900 }, { n: 'mobile', width: 390, height: 844 }]) {
  const ctx = await b.newContext({ viewport: vp, locale: 'tr-TR' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await p.evaluate(() => window.scrollTo(0, 900));
  await p.waitForTimeout(700);
  await p.getByRole('button', { name: /Asistana sor/i }).click();
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}/${vp.n}-1-acilis.png` });
  await p.getByRole('button', { name: 'Fiyat nasıl işliyor?' }).click();
  await p.waitForTimeout(1100);
  await p.screenshot({ path: `${OUT}/${vp.n}-2-cevap.png` });
  await p.getByRole('button', { name: 'Çok şubem var, ne öderim?' }).click();
  await p.waitForTimeout(1100);
  await p.screenshot({ path: `${OUT}/${vp.n}-3-devam.png` });
  console.log(`${vp.n}: ${errs.length ? 'HATA → ' + errs.slice(0,2).join(' | ') : 'konsol temiz'}`);
  await ctx.close();
}
await b.close();
