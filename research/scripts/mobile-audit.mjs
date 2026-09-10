/** Mobil denetimi: yatay tasma, kucuk dokunma hedefi, tasan metin, bolum boylari. */
import { chromium } from 'playwright';
const PAGES = ['/', '/ozellikler', '/fiyat', '/segmentler', '/segmentler/pilates-reformer', '/demo', '/destek'];
const b = await chromium.launch();
let total = 0;
for (const path of PAGES) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, locale: 'tr-TR' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000' + path, { waitUntil: 'networkidle', timeout: 45000 });
  await p.evaluate(async () => {
    await new Promise((r) => { let y = 0; const s = () => { window.scrollBy(0, 700); y += 700;
      if (y < document.body.scrollHeight && y < 40000) setTimeout(s, 45); else { window.scrollTo(0, 0); setTimeout(r, 500); } }; s(); });
  });
  const r = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    // Yatay tasma — YALNIZ kirpan bir atasi olmayanlar sayilir. Kaydirilabilir
    // bir kutunun (ornegin fiyat tablosunun overflow-x-auto sarmalayicisi)
    // icindeki genis icerik tasma DEGILDIR, tasarimin kendisidir.
    const clippedBy = (el) => {
      let n = el.parentElement;
      while (n && n !== document.documentElement) {
        if (/hidden|clip|auto|scroll/.test(getComputedStyle(n).overflowX)) return true;
        n = n.parentElement;
      }
      return false;
    };
    const overflow = [];
    for (const el of document.querySelectorAll('body *')) {
      const rc = el.getBoundingClientRect();
      if (rc.width === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.display === 'none') continue;
      if ((rc.right > vw + 1.5 || rc.left < -1.5) && !clippedBy(el)) {
        overflow.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 60),
          left: Math.round(rc.left), right: Math.round(rc.right),
        });
      }
    }
    // dokunma hedefi < 40px
    const small = [];
    for (const el of document.querySelectorAll('a, button, input, select, [role="tab"]')) {
      const rc = el.getBoundingClientRect();
      if (rc.width === 0 || rc.height === 0) continue;
      if (getComputedStyle(el).display === 'contents') continue;
      // Bir etiketin icindeki onay kutusu: gercek dokunma hedefi etikettir.
      if (el.closest('label') && el.tagName === 'INPUT') continue;
      // sr-only atlama baglantisi olcum disi
      if (rc.width <= 2 && rc.height <= 2) continue;
      if (rc.height < 40 && rc.width < 200) {
        small.push({ t: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 28), h: Math.round(rc.height), w: Math.round(rc.width) });
      }
    }
    // bolum boylari
    const sections = [...document.querySelectorAll('main > section, main > * > section')].map((s) => ({
      id: s.id || (s.className || '').toString().slice(0, 24),
      h: Math.round(s.getBoundingClientRect().height),
    }));
    return {
      docW: document.documentElement.scrollWidth, vw,
      overflow: overflow.slice(0, 6), overflowCount: overflow.length,
      small: small.slice(0, 6), smallCount: small.length,
      sections, total: document.body.scrollHeight,
    };
  });
  const hScroll = r.docW > r.vw + 1;
  total += (hScroll ? 1 : 0) + r.overflowCount + r.smallCount;
  console.log(`\n── ${path}  (${r.total}px)`);
  console.log(`   yatay kaydırma:${hScroll ? 'VAR ' + r.docW + '>' + r.vw : 'yok'} · taşan eleman:${r.overflowCount} · küçük dokunma hedefi:${r.smallCount}`);
  for (const o of r.overflow) console.log(`   ✗ taşma <${o.tag}> ${o.left}→${o.right}  ${o.cls}`);
  for (const s of r.small) console.log(`   ✗ hedef ${s.w}×${s.h}px  "${s.t}"`);
  if (path === '/') for (const s of r.sections) console.log(`     bölüm ${String(s.h).padStart(5)}px  ${s.id}`);
  await ctx.close();
}
console.log(`\nTOPLAM SORUN: ${total}`);
await b.close();
