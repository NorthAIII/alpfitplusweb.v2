/** Kendi sitemizi yakala. Kullanim: node scripts/shot.mjs [yol] [etiket] [tam|goruntu] */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const [path = '/', label = 'home', mode = 'full'] = process.argv.slice(2);
const OUT = '/work/out/self';
await mkdir(OUT, { recursive: true });
const b = await chromium.launch();
for (const vp of [
  { n: 'desktop', width: 1440, height: 900 },
  { n: 'mobile', width: 390, height: 844 },
]) {
  const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, locale: 'tr-TR' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('http://localhost:3000' + path, { waitUntil: 'networkidle', timeout: 45000 });
  await p.waitForTimeout(1200);
  if (mode === 'full') {
    await p.evaluate(async () => {
      await new Promise((r) => { let y = 0; const s = () => { window.scrollBy(0, 800); y += 800;
        if (y < document.body.scrollHeight && y < 40000) setTimeout(s, 90); else { window.scrollTo(0, 0); setTimeout(r, 700); } }; s(); });
    });
  }
  await p.screenshot({ path: `${OUT}/${label}-${vp.n}.png`, fullPage: mode === 'full' });
  console.log(`${label}-${vp.n}: ${errs.length ? 'KONSOL HATASI → ' + errs.slice(0,3).join(' | ') : 'konsol temiz'}`);
  await ctx.close();
}
await b.close();
