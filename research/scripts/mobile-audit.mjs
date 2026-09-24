/**
 * Mobil denetimi: yatay kaydirma, yatay tasma, kucuk dokunma hedefi, bolum boylari.
 *
 * Dosya basligi bir zamanlar "tasan metin" de sayiyordu ama kod onu HIC olcmuyordu
 * (B-030 kalem d) — kirpilmis tasma `clippedBy()` tarafindan bilerek ayiklaniyor ve
 * yerine bir sey konmamisti. Baslik olculene indirildi; kirpilmis tasma dedektoru
 * kendi task'inda (TASK-3.07) gelecek ve o gun basliga geri girecek.
 *
 * KAPI (TASK-3.03): rota listesi tek kaynaktan turer, olcum hedefi varsayilan
 * olarak YAYIN KOPYASIDIR (3100) ve esik altinda betik SIFIR-OLMAYAN CIKIS
 * KODU doner. Gecme satiri ile cikis kodu ayni degiskenden turer (B-030).
 */
import { chromium } from "playwright";
import { rotalar, BEKLENEN_ROTA } from "../lib/rotalar.mjs";

// Varsayilan hedef yayin kopyasidir (arastirma karari, PHASE-3). BASE ile
// gelistirme sunucusuna yonlendirmek BILINCLI OLARAK aciktir. Bedeli: 3100
// bayat olabilir (B-019) — `--profile prod up -d --build web-prod` ile tazelenir.
const BASE = process.env.BASE || "http://localhost:3100";

let PAGES;
let ROTA_KAYNAGI;
try {
  const k = await rotalar(BASE);
  PAGES = k.liste;
  ROTA_KAYNAGI = k.kaynak;
} catch (e) {
  console.error(`\n✗ ${e.message}`);
  process.exit(1); // yigin izi degil cumle (M6 F6.1 edge-case)
}

console.log(`Hedef: ${BASE}`);
console.log(`Rota kaynağı: ${ROTA_KAYNAGI}`);

const b = await chromium.launch();
let total = 0;
let visited = 0;
let geomTotal = 0;
let hedefTotal = 0;
const gezilemeyen = [];

for (const path of PAGES) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, locale: 'tr-TR' });
  const p = await ctx.newPage();
  try {
    await p.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 });
  } catch (e) {
    // Tek rotanin dusmesi turu bitirmez ama SESSIZ de gecmez: gezilen rota
    // sayisi esigin altina duser ve kapi kirmiziya doner.
    gezilemeyen.push(path);
    console.log(`\n── ${path}`);
    console.log(`   ✗ sayfa açılamadı — ${e.message.split('\n')[0]}`);
    await ctx.close();
    continue;
  }
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
    let geom = 0;
    for (const el of document.querySelectorAll('body *')) {
      const rc = el.getBoundingClientRect();
      if (rc.width === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.display === 'none') continue;
      geom++;
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
    let hedef = 0;
    for (const el of document.querySelectorAll('a, button, input, select, [role="tab"]')) {
      const rc = el.getBoundingClientRect();
      if (rc.width === 0 || rc.height === 0) continue;
      if (getComputedStyle(el).display === 'contents') continue;
      // Bir etiketin icindeki onay kutusu: gercek dokunma hedefi etikettir.
      if (el.closest('label') && el.tagName === 'INPUT') continue;
      // sr-only atlama baglantisi olcum disi
      if (rc.width <= 2 && rc.height <= 2) continue;
      hedef++;
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
      geom, hedef,
      sections, total: document.body.scrollHeight,
    };
  });
  const hScroll = r.docW > r.vw + 1;
  visited++;
  geomTotal += r.geom;
  hedefTotal += r.hedef;
  total += (hScroll ? 1 : 0) + r.overflowCount + r.smallCount;
  console.log(`\n── ${path}  (${r.total}px)`);
  console.log(`   yatay kaydırma:${hScroll ? 'VAR ' + r.docW + '>' + r.vw : 'yok'} · taşan eleman:${r.overflowCount} · küçük dokunma hedefi:${r.smallCount} · ölçülen:${r.geom} eleman / ${r.hedef} dokunma hedefi`);
  for (const o of r.overflow) console.log(`   ✗ taşma <${o.tag}> ${o.left}→${o.right}  ${o.cls}`);
  for (const s of r.small) console.log(`   ✗ hedef ${s.w}×${s.h}px  "${s.t}"`);
  if (path === '/') for (const s of r.sections) console.log(`     bölüm ${String(s.h).padStart(5)}px  ${s.id}`);
  await ctx.close();
}
await b.close();

// ---- Kapsam esigi ve cikis kodu -------------------------------------------
// Gecme satiri ile cikis kodu AYNI degiskenden turer.
const kapsamSorunlari = [];
if (visited < BEKLENEN_ROTA) {
  kapsamSorunlari.push(`gezilen rota ${visited} < beklenen ${BEKLENEN_ROTA}` +
    (gezilemeyen.length ? ` (açılamayan: ${gezilemeyen.join(', ')})` : ''));
}
if (geomTotal === 0) {
  kapsamSorunlari.push('0 eleman ölçüldü — hedef boş sayfa sunuyor olabilir');
}

console.log(`\nKAPSAM: ${visited} rota gezildi · ${geomTotal} eleman ölçüldü · ${hedefTotal} dokunma hedefi ölçüldü`);
console.log(`${visited} sayfada TOPLAM SORUN: ${total}`);

const gecti = total === 0 && kapsamSorunlari.length === 0;
if (gecti) {
  console.log(`✓ KAPI YEŞİL — ${visited} sayfada 0.`);
} else {
  for (const k of kapsamSorunlari) console.log(`✗ KAPSAM EŞİĞİ: ${k}`);
  console.log(`✗ KAPI KIRMIZI.`);
  process.exitCode = 1;
}
