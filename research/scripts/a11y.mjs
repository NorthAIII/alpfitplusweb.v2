/** Kontrast ve erisilebilirlik denetimi — WCAG AA (4.5:1 normal, 3:1 buyuk metin). */
import { chromium } from 'playwright';

const PAGES = ['/', '/ozellikler', '/fiyat', '/segmentler', '/segmentler/pilates-reformer', '/demo', '/destek', '/kvkk'];
const b = await chromium.launch();
let totalIssues = 0;

for (const path of PAGES) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'tr-TR' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000' + path, { waitUntil: 'networkidle', timeout: 45000 });
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
    for (const el of document.querySelectorAll('p,span,a,li,h1,h2,h3,h4,td,th,label,button,dt,dd')) {
      if (!el.textContent?.trim()) continue;
      if (el.children.length && !Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.3) continue;
      if (hidden(el)) continue;                       // dekoratif, ekran okuyucudan gizli
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
    return { bad: bad.slice(0, 14), badCount: bad.length, skipped, noAlt, emptyLinks, btnNoName, h1 };
  });

  totalIssues += r.badCount + r.noAlt + r.emptyLinks + r.btnNoName + (r.h1 === 1 ? 0 : 1);
  console.log(`\n── ${path}`);
  console.log(`   h1:${r.h1} · alt'sız img:${r.noAlt} · adsız link:${r.emptyLinks} · adsız buton:${r.btnNoName} · kontrast ihlali:${r.badCount} · ölçülemeyen (gradyan/şeffaf):${r.skipped}`);
  for (const x of r.bad) console.log(`   ✗ ${x.got}:1 (gereken ${x.need}) ${x.size}px ${x.color} — "${x.t}"`);
  await ctx.close();
}
console.log(`\nTOPLAM SORUN: ${totalIssues}`);
await b.close();
