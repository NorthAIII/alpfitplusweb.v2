/**
 * Font daraltma.
 *
 * Bugun her agirlik icin IKI dosya iniyor (latin + latin-ext) ve latin-ext
 * dosyasi Latin Extended-A/B'nin TAMAMINI tasiyor. Bize lazim olan yalnizca
 * Turkce harfler. Olculdu: 10 dosya / 219 KB, sayfa agirliginin %82'si.
 *
 * Cozum: Google Fonts css2 ucuna `text=` ile SITEDE GECEN karakter kumesini
 * verip agirlik basina TEK dosya almak.
 *
 * Karakter kumesi tahminle degil OLCUMLE kuruluyor: kaynak dosyalardaki tum
 * metinden cikariliyor, uzerine tam Turkce alfabe ve yazi isaretleri ekleniyor
 * ki ileride yazilacak metinler de karsilansin.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = '/src';
const OUT = '/work/fonts-out';
await mkdir(OUT, { recursive: true });

// 1) Kaynaktaki tum karakterleri topla
async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(tsx?|css|json)$/.test(e.name)) out.push(p);
  }
  return out;
}
const files = await walk(SRC);
const chars = new Set();
for (const f of files) for (const ch of await readFile(f, 'utf8')) chars.add(ch);

// 2) Taban kume — ileride yazilacak metinler icin garanti
const BASE =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`' +
  'abcdefghijklmnopqrstuvwxyz{|}~' +
  'ÇĞİÖŞÜçğıöşü' +          // Turkce
  'ÂÎÛâîû' +                 // duzeltme isaretli, TR metinlerde gecer
  '₺€$' +                    // para
  '“”‘’«»–—…·•' +            // yazi isaretleri
  '×÷±°©®™→←↑↓✓' +
  'ÄÖÜäöüßÉéÈèÁáÍíÓóÚú';     // olasi yabanci ozel adlar
for (const ch of BASE) chars.add(ch);

// 3) Kontrol karakterlerini ve emojiyi at
const set = [...chars].filter((c) => {
  const cp = c.codePointAt(0);
  return cp >= 0x20 && cp !== 0x7f && cp < 0x2500;
}).sort();

const text = set.join('');
console.log(`Karakter kümesi: ${set.length} karakter (kaynaktan + taban)\n`);

// 4) Google Fonts'tan agirlik basina TEK dosya
const WANT = [
  { family: 'Inter', weights: [400, 500, 600] },
  { family: 'Sora', weights: [700, 800] },
];
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

let total = 0;
const faces = [];
for (const w of WANT) {
  for (const weight of w.weights) {
    const url =
      `https://fonts.googleapis.com/css2?family=${w.family}:wght@${weight}` +
      `&text=${encodeURIComponent(text)}&display=swap`;
    const css = await (await fetch(url, { headers: { 'user-agent': UA } })).text();
    const m = css.match(/url\((https:\/\/[^)]+)\)\s*format\('woff2'\)/);
    if (!m) { console.log(`✗ ${w.family} ${weight} → woff2 bulunamadı`); continue; }
    const buf = Buffer.from(await (await fetch(m[1])).arrayBuffer());
    const name = `${w.family.toLowerCase()}-${weight}-tr.woff2`;
    await writeFile(join(OUT, name), buf);
    const kb = Math.round(buf.length / 1024);
    total += kb;
    faces.push({ family: w.family, weight, name, kb });
    console.log(`✓ ${name.padEnd(22)} ${String(kb).padStart(3)} KB`);
  }
}
console.log(`\nTOPLAM ${total} KB  (önceki: 219 KB / 10 dosya)`);
await writeFile(join(OUT, 'faces.json'), JSON.stringify({ chars: set.length, faces }, null, 2));
// Kume ayrica duz metin olarak yazilir: kapsama guvencesi (font-guard.mjs)
// sitede gecen her karakteri BU dosyaya karsi dogrular.
await writeFile(join(OUT, 'charset.txt'), text, 'utf8');
