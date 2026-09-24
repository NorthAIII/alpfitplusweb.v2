/**
 * Kontrast ve erisilebilirlik denetimi — WCAG AA (4.5:1 normal, 3:1 buyuk metin).
 *
 * KAPI (TASK-3.03): rota listesi tek kaynaktan turer, olcum hedefi varsayilan
 * olarak YAYIN KOPYASIDIR (3100) ve esik altinda betik SIFIR-OLMAYAN CIKIS
 * KODU doner. Gecme satiri ile cikis kodu ayni degiskenden turer -- ikisi
 * birbirinden kayamaz (B-030).
 *
 * Kapi kendi KAPSAMINI da esikler: kac rota gezildi, kac eleman olculdu.
 * "0 eleman olculdu" bir kirmizi kosuludur -- bos sayfa sunan bir hedef
 * yoksa "sorun yok" diye gecerdi (B-030 kalem a'nin a11y tarafindaki esi).
 */
import { chromium } from "playwright";
import { rotalar, BEKLENEN_ROTA } from "../lib/rotalar.mjs";

// Varsayilan hedef yayin kopyasidir (arastirma karari, PHASE-3): olculen ile
// yayinlanan ayni sey olur. BASE ile gelistirme sunucusuna yonlendirmek
// BILINCLI OLARAK aciktir -- duzeltme task'larinin ara dogrulamasi icin.
// Bedeli: 3100 bayat olabilir (B-019) -- `docker compose build web-prod` imaji
// tazeler ama konteyneri YENIDEN YARATMAZ, `--profile prod up -d` gerekir.
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
let totalIssues = 0;
let visited = 0;
let measuredTotal = 0;
let skippedTotal = 0;
const gezilemeyen = [];

for (const path of PAGES) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'tr-TR' });
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
  await p.waitForTimeout(800);

  const r = await p.evaluate(() => {
    // Tailwind 4 saydam renkleri oklab() olarak yaziyor. Elle ayristirmak yerine
    // her rengi tuvale cizip pikselini okuyoruz — hangi renk uzayi gelirse gelsin
    // dogru RGBA cikar.
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    const toRGBA = (color) => {
      cx.clearRect(0, 0, 1, 1);
      cx.fillStyle = '#000';
      cx.fillStyle = color;
      cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    };
    const over = (fg, bg) =>
      [0, 1, 2].map((i) => Math.round(fg[i] * fg[3] + bg[i] * (1 - fg[3])));

    const lum = (c) => {
      const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratio = (fg, bg) => {
      const a = lum(fg) + 0.05, c = lum(bg) + 0.05;
      return Math.round((Math.max(a, c) / Math.min(a, c)) * 100) / 100;
    };

    // Zemini kokten asagiya dogru katman katman birlestir. Yol uzerinde bir
    // background-image (gradyan, desen) varsa zemin tek bir renkle temsil
    // EDILEMEZ — o eleman olculemez sayilir ve ayri raporlanir.
    const bgOf = (el) => {
      const chain = [];
      let n = el;
      while (n && n.nodeType === 1) { chain.push(n); n = n.parentElement; }
      let bg = [255, 255, 255];
      let painted = false;
      for (const node of chain.reverse()) {
        const cs = getComputedStyle(node);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') painted = true;
        const c = toRGBA(cs.backgroundColor);
        if (c[3] > 0) bg = over(c, bg);
      }
      return { bg, painted };
    };

    const hidden = (el) => el.closest('[aria-hidden="true"]') !== null;

    const bad = [];
    let skipped = 0;
    let measured = 0;
    for (const el of document.querySelectorAll('p,span,a,li,h1,h2,h3,h4,td,th,label,button,dt,dd')) {
      if (!el.textContent?.trim()) continue;
      if (el.children.length && !Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.3) continue;
      if (hidden(el)) continue;                       // dekoratif, ekran okuyucudan gizli
      // Fotografin uzerinde duran metin: zemin bir <img> ve onun ustundeki
      // gradyan. Ikisi de elemanin ATASI degil KARDESI oldugu icin zemin
      // rengi hesaplanamaz. Bu dugumler isaretli ve olcum disi; okunabilirlik
      // gradyanin opakligiyla garanti ediliyor.
      if (el.closest('[data-over-image]')) { skipped++; continue; }
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;

      // background-clip:text ile gradyan metin — rengi seffaftir, olculemez.
      if (cs.color === 'rgba(0, 0, 0, 0)' || cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)') { skipped++; continue; }

      const { bg, painted } = bgOf(el);
      if (painted) { skipped++; continue; }           // gradyan zemin, tek renkle temsil edilemez
      const fgRaw = toRGBA(cs.color);
      const fg = over(fgRaw, bg);
      const size = parseFloat(cs.fontSize);
      const weight = +cs.fontWeight || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      const got = ratio(fg, bg);
      measured++;
      if (got < need) {
        bad.push({
          t: el.textContent.trim().slice(0, 46),
          got, need,
          size: Math.round(size),
          fg: `rgb(${fg})`, bg: `rgb(${bg})`,
        });
      }
    }

    // diger a11y kontrolleri
    const noAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length;
    const emptyLinks = [...document.querySelectorAll('a')].filter(
      (a) => !a.textContent.trim() && !a.getAttribute('aria-label')).length;
    const btnNoName = [...document.querySelectorAll('button')].filter(
      (x) => !x.textContent.trim() && !x.getAttribute('aria-label')).length;
    const h1 = document.querySelectorAll('h1').length;
    return { bad: bad.slice(0, 14), badCount: bad.length, skipped, measured, noAlt, emptyLinks, btnNoName, h1 };
  });

  visited++;
  measuredTotal += r.measured;
  skippedTotal += r.skipped;
  totalIssues += r.badCount + r.noAlt + r.emptyLinks + r.btnNoName + (r.h1 === 1 ? 0 : 1);
  console.log(`\n── ${path}`);
  console.log(`   h1:${r.h1} · alt'sız img:${r.noAlt} · adsız link:${r.emptyLinks} · adsız buton:${r.btnNoName} · kontrast ihlali:${r.badCount} · ölçülen:${r.measured} · ölçülemeyen (gradyan/şeffaf):${r.skipped}`);
  // Teshis satiri fg/bg degerlerini basar. Onceki hali `${x.color}` okuyordu ve
  // her satirda `undefined` yaziyordu — kontrast hatasini duzeltmek icin gereken
  // iki deger tam da teshis satirinda kayboluyordu (B-030 kalem e).
  for (const x of r.bad) console.log(`   ✗ ${x.got}:1 (gereken ${x.need}) ${x.size}px  metin ${x.fg} / zemin ${x.bg} — "${x.t}"`);
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
if (measuredTotal === 0) {
  kapsamSorunlari.push('0 eleman ölçüldü — hedef boş sayfa sunuyor olabilir');
}

console.log(`\nKAPSAM: ${visited} rota gezildi · ${measuredTotal} eleman ölçüldü · ${skippedTotal} ölçülemeyen (gradyan/şeffaf)`);
console.log(`${visited} sayfada TOPLAM SORUN: ${totalIssues}`);

const gecti = totalIssues === 0 && kapsamSorunlari.length === 0;
if (gecti) {
  console.log(`✓ KAPI YEŞİL — ${visited} sayfada 0.`);
} else {
  for (const k of kapsamSorunlari) console.log(`✗ KAPSAM EŞİĞİ: ${k}`);
  console.log(`✗ KAPI KIRMIZI.`);
  process.exitCode = 1;
}
