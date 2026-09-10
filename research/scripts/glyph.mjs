import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 900, height: 600 } });
const p = await ctx.newPage();
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
const r = await p.evaluate(async () => {
  await document.fonts.ready;
  const probe = (family, ch) => {
    const c = document.createElement('canvas').getContext('2d');
    c.font = `700 64px ${family}`;
    const a = c.measureText(ch).width;
    c.font = '700 64px monospace';
    const m = c.measureText(ch).width;
    return { family, ch, w: Math.round(a * 100) / 100, mono: Math.round(m * 100) / 100 };
  };
  const chars = ['₺', 'ş', 'ğ', 'İ', '₺'];
  const out = [];
  for (const ch of ['₺', 'ş', 'ğ', 'ı', 'Ş']) {
    out.push(probe('Sora', ch));
    out.push(probe('Inter', ch));
  }
  const loaded = [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`);
  return { out, loaded, tlSora: document.fonts.check('700 16px Sora', '₺'), tlInter: document.fonts.check('400 16px Inter', '₺') };
});
console.log('Sora ₺ yuklu mu :', r.tlSora);
console.log('Inter ₺ yuklu mu:', r.tlInter);
console.log('---');
for (const o of r.out) console.log(`${o.family.padEnd(6)} "${o.ch}"  genislik ${String(o.w).padStart(6)}  (mono ${o.mono})`);
console.log('--- yuklu fontlar ---');
console.log(r.loaded.join('\n'));
await b.close();
