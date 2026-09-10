import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 1440, height: 1200 },
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
});
const p = await ctx.newPage();
for (const url of [
  'https://unsplash.com/s/photos/gym',
  'https://www.pexels.com/search/gym/',
]) {
  try {
    const res = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(5000);
    const info = await p.evaluate(() => ({
      title: document.title,
      figures: document.querySelectorAll('figure').length,
      imgs: document.querySelectorAll('img').length,
      unsplashImgs: document.querySelectorAll('img[src*="images.unsplash.com"]').length,
      pexelsImgs: document.querySelectorAll('img[src*="images.pexels.com"]').length,
      srcs: [...document.querySelectorAll('img')].map((i) => i.currentSrc || i.src).filter(Boolean).slice(0, 5),
      bodyStart: document.body.innerText.slice(0, 180).replace(/\s+/g, ' '),
    }));
    console.log(`\n### ${url}\n  HTTP ${res?.status()}  başlık: ${info.title}`);
    console.log(`  figure:${info.figures} img:${info.imgs} unsplash:${info.unsplashImgs} pexels:${info.pexelsImgs}`);
    console.log(`  gövde: ${info.bodyStart}`);
    for (const s of info.srcs) console.log(`  → ${s.slice(0, 110)}`);
  } catch (e) {
    console.log(`\n### ${url}\n  HATA ${String(e).slice(0, 140)}`);
  }
}
await b.close();
