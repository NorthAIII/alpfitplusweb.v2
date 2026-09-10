/** Yatay tasmanin GERCEK kaynagini bul: kirpan bir atasi olmayan en genis eleman. */
import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2, locale: 'tr-TR' });
const p = await ctx.newPage();
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const r = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const clipped = (el) => {
    let n = el.parentElement;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (/hidden|clip|auto|scroll/.test(cs.overflowX)) return true;
      n = n.parentElement;
    }
    return false;
  };
  const bad = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.display === 'none') continue;
    const rc = el.getBoundingClientRect();
    if (rc.width === 0) continue;
    if (rc.right > vw + 1 && !clipped(el)) {
      bad.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 78),
        right: Math.round(rc.right),
        w: Math.round(rc.width),
        depth: (() => { let d = 0, n = el; while ((n = n.parentElement)) d++; return d; })(),
      });
    }
  }
  bad.sort((a, b) => b.right - a.right || a.depth - b.depth);
  return { vw, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 12), n: bad.length };
});
console.log(`viewport ${r.vw} · belge genişliği ${r.scrollW} · kırpılmamış taşan eleman: ${r.n}\n`);
for (const x of r.bad) console.log(`  sağ ${String(x.right).padStart(5)}  gen ${String(x.w).padStart(5)}  derinlik ${x.depth}  <${x.tag}> ${x.cls}`);
await b.close();
