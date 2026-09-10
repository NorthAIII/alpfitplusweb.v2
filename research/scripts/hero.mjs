import { chromium } from 'playwright';
const OUT = '/work/out/hero';
import { mkdir } from 'node:fs/promises';
const T = [
  ['oxyfitclub', 'https://oxyfitclub.com/'],
  ['glofox', 'https://www.glofox.com/'],
  ['momence', 'https://momence.com/'],
  ['mindbody', 'https://www.mindbodyonline.com/business'],
  ['gymkod', 'https://gymkod.com/'],
  ['fitschedule', 'https://fitschedule.net/'],
  ['alpfitplus', 'https://alpfitplus.com/'],
];
await mkdir(OUT, { recursive: true });
const b = await chromium.launch();
for (const [slug, url] of T) {
  try {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'tr-TR' });
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForTimeout(3500);
    await p.screenshot({ path: `${OUT}/${slug}-1-hero.png` });
    for (const [i, y] of [1, 2].entries()) {
      await p.evaluate((yy) => window.scrollTo(0, yy * 950), y);
      await p.waitForTimeout(1200);
      await p.screenshot({ path: `${OUT}/${slug}-${i + 2}-scroll.png` });
    }
    await ctx.close();
    console.log('OK', slug);
  } catch (e) { console.log('FAIL', slug, String(e).slice(0, 120)); }
}
await b.close();
