/**
 * Font kapsama guvencesi — IKI DAL.
 *
 * Fontlar sitede gecen karakter kumesine gore daraltildi (kume
 * research/FONT-KARAKTER-KUMESI.txt, uretim research/scripts/font-subset.mjs).
 * Sozlesmenin iki yuzu var; bu betik ikisini de olcer.
 *
 * DAL 1 — site metni ⊆ kume
 *   Siteyi gezip EKRANDA GERCEKTEN CIZILEN her karakteri toplar ve kumeye
 *   karsi dogrular. Kumede olmayan bir karakter, o glifin sistem fontuna
 *   dusmesi demektir — gozle fark edilmesi zor, bu yuzden olculuyor.
 *
 * DAL 2 — kume ⊆ woff2 glifleri                    (TASK-3.23, B-046 kalem 4)
 *   Dal 1 kumeyi DOGRU VARSAYAR. Oysa uretim tarafi Google Fonts'un `text=`
 *   ucundan aliyor ve o uc YALNIZ fontta gercekten var olan glifleri
 *   dondurur: kumeye yazilmis ama fontta olmayan bir karakter sessizce
 *   yedege duser ve hicbir kosumda gorunmez. Yani olculmeyen sey, uretim
 *   (font-subset.mjs) ile tuketim arasindaki SOZLESME.
 *
 *   Yontem — her woff2 dosyasi TEKIL bir aile adina izole edilir. Gerekce
 *   olculdu: ayni ailede iki agirlik varsa (Sora 700 + Sora 800) tarayici
 *   eksik glif icin once obur AGIRLIGI dener, yani "aile" uzerinden olcum
 *   dosya basina cevap vermez. Izolasyondan sonra karakter basina bir
 *   <span> icine SENTINEL + karakter yazilir ve CDP
 *   `CSS.getPlatformFontsForNode` ile hangi platform fontunun cizdigi
 *   okunur. Sentinel her zaman o dosyada oldugu icin liste ASLA bos
 *   donmez — arastirma turunda (B-046) iki karakterde bos liste gelip
 *   "sonucsuz" kalmisti, sentinel o sinifi kapatiyor (olculdu 2026-09-25:
 *   765 olcumun 765'i kesin, 0 sonucsuz).
 *
 * MUAFIYET — adiyla durur, sinif olarak degil.
 *   Olculdu (2026-09-25, yayin kopyasi): Sora 700 ve Sora 800 kumedeki BES
 *   karakteri tasimiyor — ₺ (U+20BA) Unifont'a, dort ok ←↑→↓ (U+2190-2193)
 *   Liberation Serif'e dusuyor. Inter'in uc agirligi 153/153 tam.
 *   Besi de ayni sinifta: kume TABAN kumesinden geliyorlar (ileride
 *   yazilacak metinler karsilansin diye — font-subset.mjs -> BASE), Sora'da
 *   yok, Inter'de VAR ve sitenin iki yigininda da Inter Sora'dan HEMEN
 *   SONRA geliyor; yani karakter her baglamda INDIRILMIS bir yuzle ciziliyor.
 *   Kumeden dusurulmediler: `→` sitede gercekten geciyor (`/` Chaos defteri
 *   1 kez, `/destek` 3 kez — hepsi Inter baglaminda) ve dusurmek onu sistem
 *   fontuna atardi; ustelik kume degisimi bes dosyayi yeniden urettirir ve
 *   TASK-3.22'nin metrik eslemesi Google'in o gunku surumune bagli.
 *
 *   Muafiyetin KENDI fail-open'i kapatildi, iki yandan:
 *     (a) muafiyet yalniz `aile` alanindaki yuzler icin gecerli ve `tasiyan`
 *         ailenin o karakteri GERCEKTEN tasidigi ayrica dogrulanir — Inter'den
 *         de duserse yedek kalmaz ve kapi kirmiziya doner;
 *     (b) muaf her karakter sitenin GERCEK yiginlarinda olculur (16 rotada
 *         kullanilan her (yigin, agirlik) cifti) ve INDIRILMIS bir yuzden
 *         gelmek zorundadir. Yigindan Inter cikarilirsa karakter sistem
 *         fontuna duser ve kapi kirmizi doner. Negatif kontrol olculdu:
 *         yedeksiz `"Sora"` yigininda besinin besi de custom=false donuyor.
 */
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const charset = new Set(await readFile('/work/FONT-KARAKTER-KUMESI.txt', 'utf8'));
const BASE = process.env.BASE || 'http://localhost:3100';
const PAGES = ['/', '/ozellikler', '/fiyat', '/segmentler', '/segmentler/pilates-reformer',
  '/segmentler/boks-dovus', '/segmentler/crossfit', '/segmentler/cok-subeli-zincir',
  '/gecis', '/yazilim-secerken',
  '/demo', '/destek', '/kvkk', '/gizlilik', '/kullanim-kosullari', '/olmayan-sayfa'];

/* KAPSAM TABANLARI (dal 2) — bir seciciyi korlestiren degisiklik "0 buldum"
   deyip yesil kalmasin diye. Bu dal ihlalin YOKLUGUNU raporluyor, yani
   sessiz kalmak basari hali; tabansiz olsa kirilmis bir olcum de basari
   gorunurdu. Ucu de 2026-09-25'te yayin kopyasina (3100) karsi olculdu. */
const BEKLENEN_YUZ = 5;       // servis edilen CSS'te woff2 tasiyan @font-face
const BEKLENEN_SINAMA = 765;  // 5 yuz × 153 karakter — KESIN olculen (yuz, karakter) cifti
const BEKLENEN_YIGIN = 6;     // 16 rotada kullanilan farkli (aile yigini, agirlik) cifti

// Her olcum spanina eklenen capa. O dosyada MUTLAKA bulunmasi gerekir —
// bulunmazsa olcum duzeneginin kendisi kirilmistir (pozitif kontrol).
const SENTINEL = 'A';

const MUAF = [
  { ch: '₺', aile: 'Sora', tasiyan: 'Inter', neden: 'fiyat rakamlari; STYLE-GUIDE -> Tipografi' },
  { ch: '←', aile: 'Sora', tasiyan: 'Inter', neden: 'taban kumesi oku; sitede hic gecmiyor' },
  { ch: '↑', aile: 'Sora', tasiyan: 'Inter', neden: 'taban kumesi oku; sitede hic gecmiyor' },
  { ch: '→', aile: 'Sora', tasiyan: 'Inter', neden: 'Chaos defteri + /destek listesi, Inter baglaminda' },
  { ch: '↓', aile: 'Sora', tasiyan: 'Inter', neden: 'taban kumesi oku; sitede hic gecmiyor' },
];

const b = await chromium.launch();
let kirmizi = false;

/* ══════════════════ DAL 1 — site metni ⊆ kume ══════════════════ */
const missing = new Map();
let scanned = 0;
// Muafiyet dalinin girdisi: hangi (yigin, agirlik) cifti sitede GERCEKTEN
// kullaniliyor. Elle yazilmis bir liste bayatlar; bu 16 rotadan turer.
const yiginCifti = new Map();

for (const path of PAGES) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'tr-TR' });
  const p = await ctx.newPage();
  await p.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 });
  // asistan panelini de ac — icindeki metin de sayilsin
  try {
    await p.evaluate(() => window.scrollTo(0, 900));
    await p.waitForTimeout(400);
    const btn = await p.$('button[aria-controls="asistan-panel"]');
    if (btn) { await btn.click(); await p.waitForTimeout(500); }
  } catch {}
  const text = await p.evaluate(() => document.body.innerText);
  for (const ch of text) {
    scanned++;
    if (/\s/.test(ch)) continue;
    if (!charset.has(ch)) {
      const k = `${ch} (U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')})`;
      missing.set(k, (missing.get(k) || 0) + 1);
    }
  }
  const cift = await p.evaluate(() => {
    const out = {};
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      const el = n.parentElement;
      if (!el || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;
      const cs = getComputedStyle(el);
      const k = `${cs.fontFamily}##${cs.fontWeight}`;
      out[k] = (out[k] || 0) + 1;
    }
    return out;
  });
  for (const [k, v] of Object.entries(cift)) yiginCifti.set(k, (yiginCifti.get(k) || 0) + v);
  await ctx.close();
}
console.log(`Kümede ${charset.size} karakter · ${PAGES.length} sayfa · ${scanned} karakter tarandı`);
if (missing.size === 0) {
  console.log('✓ DAL 1 — site metni ⊆ küme: kümede olmayan karakter YOK.');
} else {
  console.log(`✗ DAL 1 — KAPSAMA AÇIĞI: ${missing.size} karakter kümede yok:`);
  for (const [k, n] of [...missing].sort((a, b) => b[1] - a[1])) console.log(`   ${k}  ${n} kez`);
  kirmizi = true;
}

/* ══════════════════ DAL 2 — küme ⊆ woff2 glifleri ══════════════════ */
const ctx = await b.newContext({ viewport: { width: 1200, height: 800 }, locale: 'tr-TR' });
const p = await ctx.newPage();
await p.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 45000 });

// 2a) Yuzler servis edilen CSS'ten kesfedilir — elle liste bayatlar, bu
//     dogrudan sitenin kendi beyani. `local()` yedek yuzleri woff2 url'i
//     tasimadigi icin kendiliginden disarida kalir.
const cssHrefs = await p.evaluate(() =>
  [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href));
let cssAll = '';
for (const h of cssHrefs) cssAll += await (await p.request.get(h)).text();
const faces = [];
for (const m of cssAll.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
  const blok = m[1];
  const u = blok.match(/url\(\s*["']?([^"')]+\.woff2)["']?\s*\)/);
  if (!u) continue;
  const fam = (blok.match(/font-family\s*:\s*([^;]+)/) || [])[1]?.trim().replace(/^["']|["']$/g, '');
  const w = (blok.match(/font-weight\s*:\s*([^;]+)/) || [])[1]?.trim();
  faces.push({ fam, w, url: new URL(u[1], BASE).href });
}
console.log(`\nDAL 2 — ${cssHrefs.length} stil dosyası · woff2 taşıyan @font-face: ${faces.length}`);
for (const f of faces) {
  const r = await p.request.get(f.url);
  console.log(`   ${f.fam} ${f.w}  ${f.url.replace(BASE, '')}  HTTP ${r.status()}`);
  if (!r.ok()) { console.log('   ✗ font dosyası servis edilmiyor'); kirmizi = true; }
}
if (faces.length < BEKLENEN_YUZ) {
  console.log(`✗ KAPSAM EŞİĞİ — ${faces.length} yüz bulundu, beklenen ≥ ${BEKLENEN_YUZ}. Keşif kırılmış, ölçüm geçersiz.`);
  kirmizi = true;
}
if (!charset.has(SENTINEL)) {
  console.log(`✗ Ölçüm çapası "${SENTINEL}" kümede yok — düzenek geçersiz.`);
  kirmizi = true;
}

const chars = [...charset];
await p.evaluate(({ faces, chars, SENTINEL }) => {
  const st = document.createElement('style');
  // font-weight: 100 900 → tek yuzlu aile her agirligi kendisi karsilar,
  // yani aile ici yedek hic devreye girmez. font-display: block → olcum
  // yedek yuzle yapilmaz.
  st.textContent = faces.map((f, i) =>
    `@font-face{font-family:"GUARD${i}";src:url("${f.url}") format("woff2");` +
    `font-weight:100 900;font-style:normal;font-display:block}`).join('\n');
  document.head.appendChild(st);
  const box = document.createElement('div');
  // white-space:pre → bosluk karakteri de olculebilsin (daraltilmasin)
  box.style.cssText = 'position:absolute;left:0;top:0;white-space:pre;font-size:32px;z-index:-1';
  for (let i = 0; i < faces.length; i++) {
    const k = document.createElement('span');
    k.setAttribute('data-g', `${i}:KAL`);
    k.style.fontFamily = `"GUARD${i}"`;
    k.textContent = SENTINEL;
    box.appendChild(k);
    for (let j = 0; j < chars.length; j++) {
      const s = document.createElement('span');
      s.setAttribute('data-g', `${i}:${j}`);
      s.style.fontFamily = `"GUARD${i}"`;
      s.textContent = SENTINEL + chars[j];
      box.appendChild(s);
    }
  }
  document.body.appendChild(box);
}, { faces, chars, SENTINEL });
for (let i = 0; i < faces.length; i++) await p.evaluate((i) => document.fonts.load(`32px "GUARD${i}"`), i);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(300);

const cdp = await ctx.newCDPSession(p);
await cdp.send('DOM.enable');
await cdp.send('CSS.enable');
async function platformFonts(selector) {
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector });
  const out = [];
  for (const nodeId of nodeIds) {
    const { attributes } = await cdp.send('DOM.getAttributes', { nodeId });
    const attr = selector.replace(/[[\]]/g, '');
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    out.push({ key: attributes[attributes.indexOf(attr) + 1], fonts });
  }
  return out;
}
const olcum = await platformFonts('[data-g]');

// 2b) Kalibrasyon: her dosyanin KENDI bildirdigi ad olcumden gelir, elle
//     yazilmaz (Inter 500 kendini "Inter Medium", Sora 800 "Sora ExtraBold"
//     diye bildiriyor — elle yazilmis bir ad listesi burada yanilir).
const kalAd = {};
for (const o of olcum) {
  const [i, j] = o.key.split(':');
  if (j !== 'KAL') continue;
  if (o.fonts.length !== 1) {
    console.log(`✗ Kalibrasyon kırıldı — ${faces[i].fam} ${faces[i].w} çapası ${o.fonts.length} font bildirdi.`);
    kirmizi = true;
    continue;
  }
  kalAd[i] = o.fonts[0].familyName;
}

const eksikTablo = {};
let kesin = 0;
const sonucsuz = [];
const muafKullanilan = new Set();
const tasiyanVar = new Map();   // "ch|aile" -> true  (tasiyan dogrulamasi icin)

for (const o of olcum) {
  const [i, j] = o.key.split(':');
  if (j === 'KAL') continue;
  const ch = chars[+j];
  const u = 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
  const ad = kalAd[i];
  const toplam = o.fonts.reduce((a, f) => a + f.glyphCount, 0);
  const yabanci = o.fonts.filter((f) => f.familyName !== ad);
  if (ad === undefined || o.fonts.length === 0) { sonucsuz.push(`${u} @ ${faces[i].fam} ${faces[i].w} (boş liste)`); continue; }
  if (yabanci.length === 0 && toplam === 2) {
    kesin++;
    tasiyanVar.set(`${ch}|${faces[i].fam}`, true);
    continue;
  }
  if (yabanci.length > 0) {
    kesin++;
    const m = MUAF.find((x) => x.ch === ch && faces[i].fam.startsWith(x.aile));
    if (m) muafKullanilan.add(`${ch}|${faces[i].fam}`);
    (eksikTablo[i] ||= []).push({ ch, u, dusen: yabanci.map((f) => f.familyName).join(','), muaf: !!m });
    continue;
  }
  sonucsuz.push(`${u} @ ${faces[i].fam} ${faces[i].w} (glyphCount=${toplam})`);
}

let eksikToplam = 0, muafToplam = 0;
console.log('');
for (let i = 0; i < faces.length; i++) {
  const list = eksikTablo[i] || [];
  const muaf = list.filter((x) => x.muaf);
  const acik = list.filter((x) => !x.muaf);
  eksikToplam += acik.length;
  muafToplam += muaf.length;
  const yaz = list.length
    ? list.map((x) => `${x.ch} ${x.u}→${x.dusen}${x.muaf ? ' [MUAF]' : ''}`).join(' · ')
    : 'tam';
  console.log(`   ${faces[i].fam} ${faces[i].w} (${kalAd[i] ?? '?'}): ${yaz}`);
}
console.log(`   kesin ölçüm: ${kesin} / beklenen ≥ ${BEKLENEN_SINAMA}` + (sonucsuz.length ? ` · SONUÇSUZ ${sonucsuz.length}: ${sonucsuz.join(' · ')}` : ' · sonuçsuz 0'));
if (kesin < BEKLENEN_SINAMA) {
  console.log(`✗ KAPSAM EŞİĞİ — ${kesin} kesin ölçüm, beklenen ≥ ${BEKLENEN_SINAMA}. Ölçüm körleşmiş.`);
  kirmizi = true;
}

// 2c) Muafiyetin iki yanli dogrulanmasi.
console.log('');
for (const m of MUAF) {
  const u = 'U+' + m.ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
  // Bu bilgi satiri yalniz olcum GECERLIYSE anlamli — kapsam esigi dustugunde
  // "glif artik var" demek yanlis sinyal olurdu (sonda 3'te olculdu).
  if (kesin >= BEKLENEN_SINAMA && !muafKullanilan.has(`${m.ch}|${m.aile}`)) {
    // Muafiyet artik gerekmiyor olabilir (font yeniden uretildi ve glif geldi).
    // Kirmizi degil — ama yazili kalsin ki liste sessizce bayatlamasin.
    console.log(`   ℹ ${m.ch} ${u} muafiyeti ${m.aile}'da KULLANILMADI — glif artık var, satır düşürülebilir.`);
  }
  if (!tasiyanVar.has(`${m.ch}|${m.tasiyan}`)) {
    console.log(`   ✗ ${m.ch} ${u} muaf ama TAŞIYAN aile (${m.tasiyan}) de taşımıyor — yedek kalmadı.`);
    kirmizi = true;
  }
}

console.log(`\nDAL 2 — muafiyet, sitenin GERÇEK yığınlarına karşı (${yiginCifti.size} çift / beklenen ≥ ${BEKLENEN_YIGIN}):`);
if (yiginCifti.size < BEKLENEN_YIGIN) {
  console.log(`✗ KAPSAM EŞİĞİ — ${yiginCifti.size} (yığın, ağırlık) çifti toplandı, beklenen ≥ ${BEKLENEN_YIGIN}.`);
  kirmizi = true;
}
const indirilmisAdlar = new Set(Object.values(kalAd));
const ciftler = [...yiginCifti.keys()].map((k) => k.split('##'));
await p.evaluate(({ ciftler, muaf, SENTINEL }) => {
  const box = document.createElement('div');
  box.style.cssText = 'position:absolute;left:0;top:400px;white-space:pre;font-size:32px;z-index:-1';
  for (let a = 0; a < ciftler.length; a++) for (let k = 0; k < muaf.length; k++) {
    const s = document.createElement('span');
    s.setAttribute('data-y', `${a}:${k}`);
    s.style.fontFamily = ciftler[a][0];
    s.style.fontWeight = ciftler[a][1];
    s.textContent = SENTINEL + muaf[k];
    box.appendChild(s);
  }
  document.body.appendChild(box);
}, { ciftler, muaf: MUAF.map((m) => m.ch), SENTINEL });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(300);
const yiginOlcum = await platformFonts('[data-y]');
let yiginSorun = 0;
for (const o of yiginOlcum) {
  const [a, k] = o.key.split(':');
  const ch = MUAF[+k].ch;
  const u = 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
  const sistem = o.fonts.filter((f) => !indirilmisAdlar.has(f.familyName));
  if (o.fonts.length === 0 || sistem.length > 0) {
    console.log(`   ✗ ${ch} ${u} @ ${ciftler[a][1]} ${ciftler[a][0]} → ${o.fonts.map((f) => f.familyName).join(',') || 'BOŞ'} (indirilmiş yüz değil)`);
    yiginSorun++;
  }
}
console.log(yiginSorun === 0
  ? `   ✓ ${MUAF.length} muaf karakter × ${ciftler.length} çift = ${yiginOlcum.length} ölçüm: hepsi indirilmiş bir yüzle çiziliyor.`
  : `   ${yiginSorun} ölçümde muaf karakter sistem fontuna düştü — muafiyetin dayanağı yok.`);
if (yiginSorun > 0) kirmizi = true;

console.log(`\nküme: ${charset.size} karakter · woff2'de eksik: ${eksikToplam} (muaf: ${muafToplam})`);
if (eksikToplam > 0) {
  console.log('✗ DAL 2 — küme ⊆ woff2 SAĞLANMIYOR: muaf olmayan eksik glif var.');
  kirmizi = true;
} else {
  console.log('✓ DAL 2 — küme ⊆ woff2: muaf olmayan eksik glif YOK.');
}

await b.close();
if (kirmizi) process.exitCode = 1;
