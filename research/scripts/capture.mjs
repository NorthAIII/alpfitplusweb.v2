/**
 * Rakip sitelerinden tam sayfa ekran goruntusu + metin/yapi cikarimi.
 * Kullanim: docker compose --profile research run --rm research node scripts/capture.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = '/work/out';

const TARGETS = [
  { slug: 'oxyfitclub-home',      url: 'https://oxyfitclub.com/' },
  { slug: 'oxyfitclub-paketler',  url: 'https://oxyfitclub.com/paketler' },
  { slug: 'gymkod-home',          url: 'https://gymkod.com/' },
  { slug: 'gymkod-pilates',       url: 'https://gymkod.com/pilates-studyo-yazilimi' },
  { slug: 'fitschedule-home',     url: 'https://fitschedule.net/' },
  { slug: 'bulutgym-home',        url: 'https://www.bulutgym.com/' },
  { slug: 'bulutgym-fiyat',       url: 'https://www.bulutgym.com/fiyatlar.html' },
  { slug: 'gymtekno-home',        url: 'https://gymtekno.com/tr' },
  { slug: 'sportix-home',         url: 'https://sportix.tr/' },
  { slug: 'makropass-home',       url: 'https://www.makropass.com.tr/' },
  { slug: 'alpfitplus-canli',     url: 'https://alpfitplus.com/' },
  // Global referanslar — tasarim/ikna kalitesi icin
  { slug: 'glofox-home',          url: 'https://www.glofox.com/' },
  { slug: 'mindbody-home',        url: 'https://www.mindbodyonline.com/business' },
  { slug: 'momence-home',         url: 'https://momence.com/' },
  { slug: 'arketa-home',          url: 'https://www.arketa.com/' },
  { slug: 'wodify-home',          url: 'https://www.wodify.com/' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile',  width: 390,  height: 844  },
];

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const report = [];

  for (const t of TARGETS) {
    const entry = { slug: t.slug, url: t.url, shots: [], error: null };
    try {
      for (const vp of VIEWPORTS) {
        const ctx = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 1,
          locale: 'tr-TR',
          userAgent:
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
        });
        const page = await ctx.newPage();
        await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(3500);
        // Lazy-load iceriklerini tetiklemek icin sayfayi bastan sona kaydir
        await page.evaluate(async () => {
          await new Promise((res) => {
            let y = 0;
            const step = () => {
              window.scrollBy(0, 900);
              y += 900;
              if (y < document.body.scrollHeight && y < 40000) setTimeout(step, 120);
              else { window.scrollTo(0, 0); setTimeout(res, 600); }
            };
            step();
          });
        });
        const file = join(OUT, `${t.slug}-${vp.name}.png`);
        await page.screenshot({ path: file, fullPage: true });
        entry.shots.push(file);

        if (vp.name === 'desktop') {
          entry.title = await page.title();
          entry.structure = await page.evaluate(() => {
            const txt = (el) => (el?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 220);
            return {
              h1: [...document.querySelectorAll('h1')].map(txt).filter(Boolean),
              h2: [...document.querySelectorAll('h2')].map(txt).filter(Boolean).slice(0, 40),
              h3: [...document.querySelectorAll('h3')].map(txt).filter(Boolean).slice(0, 60),
              nav: [...document.querySelectorAll('header a, nav a')]
                .map((a) => txt(a)).filter(Boolean).slice(0, 40),
              cta: [...document.querySelectorAll('a[class*=btn], button, a[class*=button]')]
                .map(txt).filter(Boolean).slice(0, 30),
              wordCount: (document.body.innerText || '').split(/\s+/).length,
              sections: document.querySelectorAll('section').length,
            };
          });
        }
        await ctx.close();
      }
      console.log(`OK   ${t.slug}`);
    } catch (e) {
      entry.error = String(e).slice(0, 300);
      console.log(`FAIL ${t.slug}: ${entry.error}`);
    }
    report.push(entry);
  }

  await writeFile(join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  await browser.close();
  console.log('\nBitti →', join(OUT, 'report.json'));
}

run();
