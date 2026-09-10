/**
 * Performans olcumu — URETIM konteynerine karsi (localhost:3100).
 * Gelistirme sunucusu iyimser degil, kotumser sonuc verir; ikisi karistirilmaz.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3100';
const PAGES = ['/', '/fiyat', '/segmentler/pilates-reformer', '/demo'];
const PROFILES = [
  { name: 'masaüstü', vp: { width: 1440, height: 900 }, mobile: false },
  { name: 'mobil',    vp: { width: 390, height: 844 },  mobile: true  },
];

const b = await chromium.launch();

for (const prof of PROFILES) {
  console.log(`\n════ ${prof.name} ════`);
  for (const path of PAGES) {
    const ctx = await b.newContext({
      viewport: prof.vp, isMobile: prof.mobile, deviceScaleFactor: prof.mobile ? 2 : 1, locale: 'tr-TR',
    });
    const p = await ctx.newPage();

    const res = { count: 0, bytes: 0, byType: {} };
    p.on('response', async (r) => {
      try {
        const h = r.headers();
        const len = Number(h['content-length'] || 0);
        const type = (h['content-type'] || '').split(';')[0] || 'diğer';
        res.count++;
        res.bytes += len;
        res.byType[type] = (res.byType[type] || 0) + len;
      } catch {}
    });

    const t0 = Date.now();
    await p.goto(BASE + path, { waitUntil: 'load', timeout: 45000 });
    const loadMs = Date.now() - t0;

    // ilk ekranda LCP ve CLS
    const vitals = await p.evaluate(() => new Promise((resolve) => {
      let lcp = 0, cls = 0;
      try {
        new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; })
          .observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {}
      setTimeout(() => {
        const nav = performance.getEntriesByType('navigation')[0] || {};
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        resolve({
          lcp: Math.round(lcp),
          cls: Math.round(cls * 1000) / 1000,
          fcp: Math.round(fcp?.startTime || 0),
          ttfb: Math.round(nav.responseStart || 0),
          dom: document.querySelectorAll('*').length,
          imgs: document.querySelectorAll('img').length,
          height: document.body.scrollHeight,
        });
      }, 2600);
    }));

    const kb = (n) => Math.round(n / 1024);
    const top = Object.entries(res.byType).sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([t, v]) => `${t.replace('text/', '').replace('application/', '').replace('image/', '')} ${kb(v)}KB`).join(' · ');

    console.log(
      `  ${path.padEnd(30)} TTFB ${String(vitals.ttfb).padStart(4)}ms · FCP ${String(vitals.fcp).padStart(4)}ms · ` +
      `LCP ${String(vitals.lcp).padStart(4)}ms · CLS ${vitals.cls} · ` +
      `${String(res.count).padStart(3)} istek ${String(kb(res.bytes)).padStart(4)}KB · DOM ${vitals.dom} · img ${vitals.imgs}`,
    );
    console.log(`  ${' '.repeat(30)} ${top}`);
    await ctx.close();
  }
}
await b.close();
