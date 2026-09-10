/**
 * Baglam fotograflari — Pexels.
 * Lisans: Pexels License, ticari kullanim serbest, atif gerekmez.
 * Unsplash bot korumasina takildigi icin (401) kaynak Pexels secildi.
 * Her secilen dosyanin kaynagi KAYNAK.txt icine yazilir.
 *
 * Bu betik ADAY toplar ve her kategori icin bir kontakt sayfasi uretir.
 * Secim gozle yapilir; rastgele indirilmez.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const OUT = '/work/photos-out';
await mkdir(`${OUT}/adaylar`, { recursive: true });

const QUERIES = [
  { slug: 'reformer', q: 'pilates reformer studio' },
  { slug: 'boks',     q: 'boxing gym training' },
  { slug: 'crossfit', q: 'crossfit gym workout' },
  { slug: 'salon',    q: 'modern gym interior' },
  { slug: 'grup',     q: 'group fitness class' },
  { slug: 'antrenor', q: 'personal trainer coaching' },
];
const PER = 8;

const b = await chromium.launch();
const manifest = [];

for (const item of QUERIES) {
  const ctx = await b.newContext({
    viewport: { width: 1600, height: 1200 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
  });
  const p = await ctx.newPage();
  const url = `https://www.pexels.com/search/${encodeURIComponent(item.q).replace(/%20/g, '%20')}/`;
  try {
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForTimeout(4500);
    for (let i = 0; i < 3; i++) { await p.evaluate(() => window.scrollBy(0, 1400)); await p.waitForTimeout(1600); }

    const hits = await p.evaluate(() => {
      const out = [];
      for (const a of document.querySelectorAll('a[href*="/photo/"]')) {
        const img = a.querySelector('img[src*="images.pexels.com/photos/"]')
          || a.parentElement?.querySelector('img[src*="images.pexels.com/photos/"]');
        if (!img) continue;
        const src = img.currentSrc || img.src;
        const id = (src.match(/\/photos\/(\d+)\//) || [])[1];
        if (!id) continue;
        out.push({
          id,
          page: new URL(a.getAttribute('href'), location.origin).href,
          alt: (img.getAttribute('alt') || '').slice(0, 120),
          w: img.naturalWidth, h: img.naturalHeight,
        });
      }
      return out;
    });

    const uniq = [];
    const seen = new Set();
    for (const h of hits) {
      if (seen.has(h.id) || h.w < h.h) continue;   // yalniz yatay
      seen.add(h.id);
      uniq.push(h);
      if (uniq.length >= PER) break;
    }

    // adaylari indir + kontakt sayfasi
    const tiles = [];
    for (const [i, h] of uniq.entries()) {
      const dl = `https://images.pexels.com/photos/${h.id}/pexels-photo-${h.id}.jpeg?auto=compress&cs=tinysrgb&w=900`;
      // Tek bir bozuk indirme tum kategoriyi dusurmesin: icerik tipi
      // dogrulanir, cozulemeyen kare atlanir.
      let buf;
      try {
        const res = await fetch(dl);
        if (!res.ok) { console.log(`  atlandi id ${h.id} → HTTP ${res.status}`); continue; }
        const ct = res.headers.get('content-type') || '';
        if (!ct.startsWith('image/')) { console.log(`  atlandi id ${h.id} → ${ct}`); continue; }
        buf = Buffer.from(await res.arrayBuffer());
        await sharp(buf).metadata();
      } catch {
        console.log(`  atlandi id ${h.id} → çözülemedi`);
        continue;
      }
      tiles.push(await sharp(buf).resize(440, 290, { fit: 'cover' })
        .composite([{
          input: Buffer.from(
            `<svg width="440" height="290"><rect x="0" y="252" width="440" height="38" fill="rgba(0,0,0,.62)"/>` +
            `<text x="12" y="277" font-family="DejaVu Sans" font-size="19" fill="#fff">${i + 1} · id ${h.id}</text></svg>`),
          top: 0, left: 0,
        }]).jpeg({ quality: 80 }).toBuffer());
      h.download = dl;
    }
    if (tiles.length) {
      const cols = 4, rows = Math.ceil(tiles.length / cols);
      const sheet = sharp({ create: { width: cols * 444, height: rows * 294, channels: 3, background: '#111' } });
      await sheet.composite(tiles.map((t, i) => ({
        input: t, left: (i % cols) * 444 + 2, top: Math.floor(i / cols) * 294 + 2,
      }))).jpeg({ quality: 82 }).toFile(`${OUT}/adaylar/${item.slug}.jpg`);
    }

    console.log(`${item.slug.padEnd(10)} ${uniq.length} aday`);
    manifest.push({ ...item, hits: uniq });
  } catch (e) {
    console.log(`${item.slug.padEnd(10)} HATA ${String(e).slice(0, 100)}`);
    manifest.push({ ...item, hits: [] });
  }
  await ctx.close();
}
await b.close();
await writeFile(`${OUT}/adaylar.json`, JSON.stringify(manifest, null, 2));
console.log('\nKontakt sayfalari →', `${OUT}/adaylar/`);
