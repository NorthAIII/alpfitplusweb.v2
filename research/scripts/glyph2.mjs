import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 900, height: 600 } })).newPage();
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
const r = await p.evaluate(async () => {
  await document.fonts.ready;
  const stack = getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim();
  const c = document.createElement('canvas').getContext('2d');
  const w = (font, ch) => { c.font = font; return Math.round(c.measureText(ch).width * 100) / 100; };
  return {
    stack,
    tl_stack: w(`700 64px ${stack}`, '₺'),
    tl_sora: w('700 64px Sora, monospace', '₺'),
    tl_inter: w('700 64px Inter', '₺'),
    tl_mono: w('700 64px monospace', '₺'),
  };
});
console.log('display yigini :', r.stack);
console.log('₺ yiginla      :', r.tl_stack);
console.log('₺ sadece Inter :', r.tl_inter);
console.log('₺ Sora+mono    :', r.tl_sora);
console.log('₺ monospace    :', r.tl_mono);
console.log(r.tl_stack === r.tl_inter ? '\n→ ₺ artik Inter ile ciziliyor.' : '\n→ HALA yedege dusuyor.');
await b.close();
