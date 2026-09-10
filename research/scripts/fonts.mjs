import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'tr-TR' });
const p = await ctx.newPage();
const got = [];
p.on('response', (r) => {
  if (r.url().includes('.woff2')) got.push({ f: r.url().split('/').pop(), kb: Math.round(Number(r.headers()['content-length'] || 0) / 1024) });
});
await p.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
await p.evaluate(async () => { await new Promise((r) => { let y=0; const s=()=>{window.scrollBy(0,900); y+=900;
  if (y<document.body.scrollHeight && y<40000) setTimeout(s,40); else setTimeout(r,900);}; s(); }); });
console.log('İNEN FONT DOSYALARI');
let t = 0;
for (const g of got.sort((a,b)=>b.kb-a.kb)) { console.log(`  ${String(g.kb).padStart(3)} KB  ${g.f}`); t += g.kb; }
console.log(`  ${'-'.repeat(34)}\n  ${String(t).padStart(3)} KB  toplam (${got.length} dosya)`);

const used = await p.evaluate(() => {
  const m = new Map();
  for (const el of document.querySelectorAll('body *')) {
    if (!el.textContent?.trim()) continue;
    const cs = getComputedStyle(el);
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '');
    const key = `${fam} ${cs.fontWeight}`;
    m.set(key, (m.get(key) || 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
});
console.log('\nSAYFADA KULLANILAN AİLE + AĞIRLIK');
for (const [k, n] of used) console.log(`  ${String(n).padStart(4)} eleman  ${k}`);
await b.close();
