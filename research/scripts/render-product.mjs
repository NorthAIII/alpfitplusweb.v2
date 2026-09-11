/**
 * Urun ekran goruntusu uretim hatti.
 * Kaynak: /demo (Alpfit.v1/demo, SALT-OKUNUR) → cikti: /work/product-out/*.webp
 *
 * Hat v1 sitesinden devralindi (scripts/build-assets.mjs + lib/screen-cleanup.mjs):
 *  1. Eski marka, gercek sporcu adlari ve gercek semt adlari degistirilir.
 *  2. Urunun bugun karsilamadigi iddialari tasiyan dugumler DOM'dan dusurulur.
 *  3. Denetim: gercek ad veya eski marka sizarsa URETIM DURUR (sessiz "temiz" yok).
 *  4. Yapisal capaya gore kirpilir, DSF 2 render edilir, webp'ye indirilir.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { REPLACEMENTS, INITIALS, AVATAR_SELECTOR, DROP_NODES, auditTexts } from '../lib/screen-cleanup-v2.mjs';

const DEMO = 'file:///demo';
const OUT = '/work/product-out';
const RENDER_VIEWPORT = 1600;
const RENDER_HEIGHT = 1400;
const RENDER_DSF = 2;
const CLIP_GUTTER = 18;

const SCREENS = [
  { id: 'cockpit',  file: 'cockpit.html',  out: 'cockpit.webp',  width: 1440, quality: 84, clipBelow: '.branchgrid' },
  { id: 'takvim',   file: 'takvim.html',   out: 'takvim.webp',   width: 1440, quality: 82, clipBelow: '.calwrap' },
  { id: 'finans',   file: 'finans.html',   out: 'finans.webp',   width: 1440, quality: 82, clipBelow: '.row2' },
  { id: 'antrenor', file: 'antrenor.html', out: 'antrenor.webp', width: 1200, quality: 82, clipBelow: '.detgrid' },
  { id: 'raporlar', file: 'raporlar.html', out: 'raporlar.webp', width: 1200, quality: 82, clipBelow: '.repgrid' },
  { id: 'grup',     file: 'grup.html',     out: 'grup.webp',     width: 1440, quality: 82 },
  // 'sube' EKRANI BILEREK YOK (QUICK-001). sube.html'in kaynagi uc ayri sizinti
  // sinifini birden tasiyor ve denetim ucune de kor: gercek ilk ad ("Simge & Gizem",
  // & ile bagli oldugu icin ad kalibina uymuyor), ciro projeksiyonu / yuzde / ustunluk
  // rozeti (auditTexts'te iddia dali HIC yok) ve gercek pilot semtinin bas harfleri
  // ("BS" avatari; INITIALS tablosu yalniz kisi bas harfi tasiyor). Gorsel hicbir
  // sayfada kullanilmiyordu ama /product/sube.webp adresinden 200 donuyordu.
  // Geri eklemeden once denetimin bu uc dali kapanmali → BULGULAR B-018, B-044.

  // .phone elemani 1400 px viewport'a sigmiyordu ve klip alttan kesiliyordu →
  // bu ekran daha uzun bir viewport ister. Digerlerinde 1400 yeterli ve .app
  // yuksekligi icerik surumlu oldugu icin genel yukseklige dokunulmadi.
  { id: 'uye-telefon', file: 'takvim.html', out: 'uye-telefon.webp', width: 720, quality: 86, root: '.phone', height: 2200 },
];

async function renderScreen(browser, screen) {
  const ctx = await browser.newContext({
    viewport: { width: RENDER_VIEWPORT, height: screen.height ?? RENDER_HEIGHT },
    deviceScaleFactor: RENDER_DSF,
    locale: 'tr-TR',
  });
  const page = await ctx.newPage();
  await page.goto(`${DEMO}/${screen.file}`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(1200);

  // 1+2+3: temizlik, dusurme, denetim girdisi
  const { values, drops, imgs, imgLeaks } = await page.evaluate(
    ({ replacements, initials, avatarSel, dropList }) => {
      // 1) DUGUM DUSURME once kosar. Capa kaynagin HAM sozcugudur, yani
      //    REPLACEMENTS'tan once okunur. Dusurme once oldugu icin denetimin
      //    gordugu kutle de dusen dugumleri ICERMEZ — dusen iddia allow-list'e
      //    yazilmak zorunda kalmaz.
      const drops = [];
      for (const [sel, anchor] of dropList) {
        const hits = [...document.querySelectorAll(sel)].filter((e) =>
          (e.textContent || '').includes(anchor),
        );
        if (hits.length !== 1) { drops.push({ sel, anchor, count: hits.length, ok: false }); continue; }
        hits[0].remove();
        drops.push({ sel, anchor, count: 1, ok: true });
      }

      // 2) Metin duzeltmeleri — uzun eslesmeler once
      const reps = [...replacements].sort((a, b) => b[0].length - a[0].length);
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const values = [];
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const n of nodes) {
        let v = n.nodeValue ?? '';
        for (const [from, to] of reps) if (v.includes(from)) v = v.split(from).join(to);
        n.nodeValue = v;
        if (v.trim()) values.push(v);
      }

      // 3) Avatar bas harfleri adla senkron
      for (const el of document.querySelectorAll(avatarSel)) {
        const t = (el.textContent || '').trim();
        for (const [from, to] of initials) if (t === from) el.textContent = to;
      }

      // 4) MARKA TASIYAN GORSELLER. Metin denetimi yalniz metin dugumlerini
      //    gorur; sol menudeki eski kulup logosu bir <img> oldugu icin uc
      //    turda da sizmisti. Once temizlenir, sonra kapi kurulur.
      const imgs = [];
      for (const el of document.querySelectorAll('img')) {
        const src = el.getAttribute('src') || '';
        const alt = el.getAttribute('alt') || '';
        if (/logo\//i.test(src) || /weekend/i.test(src) || /weekend/i.test(alt)) {
          el.remove();
          imgs.push({ src, alt, removed: true });
        }
      }
      // Kalan gorseller icinde marka izi var mi
      const imgLeaks = [...document.querySelectorAll('img')]
        .map((el) => `${el.getAttribute('src') || ''} ${el.getAttribute('alt') || ''}`)
        .filter((v) => /weekend/i.test(v));

      return { values, drops, imgs, imgLeaks };
    },
    {
      replacements: REPLACEMENTS,
      initials: INITIALS,
      avatarSel: AVATAR_SELECTOR,
      dropList: DROP_NODES[screen.id] ?? [],
    },
  );

  const bad = drops.filter((d) => !d.ok);
  if (bad.length) {
    throw new Error(
      `[${screen.id}] düğüm düşürme çapası tam eşleşmedi: ` +
        bad.map((b) => `${b.sel} ~ "${b.anchor}" → ${b.count} eşleşme`).join(' · '),
    );
  }

  if (imgLeaks.length) {
    throw new Error(`[${screen.id}] GÖRSEL DENETİMİ BAŞARISIZ — marka izi taşıyan img: ${JSON.stringify(imgLeaks)}`);
  }

  const audit = auditTexts(values, screen.id);
  if (audit.names.length || audit.brands.length) {
    const msg =
      `[${screen.id}] DENETİM BAŞARISIZ — ad sızıntısı: ${JSON.stringify(audit.names)} · ` +
      `marka sızıntısı: ${JSON.stringify(audit.brands)}`;
    // DRY modu yalnizca sizinti envanteri cikarmak icindir; uretim yapmaz.
    if (process.env.AUDIT_DRY === '1') { console.log('✗ ' + msg); await ctx.close(); return null; }
    throw new Error(msg);
  }

  // 4: yapisal capaya gore klip
  const rootSel = screen.root ?? '.app';
  const clip = await page.evaluate(
    ({ rootSel, anchorSel, gutter }) => {
      const root = document.querySelector(rootSel);
      if (!root) return null;
      const r = root.getBoundingClientRect();
      if (!anchorSel) {
        return { x: r.x, y: r.y, width: r.width, height: r.height, rootHeight: r.height };
      }
      const a = document.querySelector(anchorSel);
      if (!a) return null;
      const ar = a.getBoundingClientRect();
      return {
        x: r.x, y: r.y, width: r.width,
        height: Math.max(120, ar.bottom - r.y + gutter),
        rootHeight: r.height,
      };
    },
    { rootSel, anchorSel: screen.clipBelow ?? null, gutter: CLIP_GUTTER },
  );
  if (!clip) throw new Error(`[${screen.id}] klip çapası bulunamadı: ${rootSel} / ${screen.clipBelow ?? '-'}`);

  const png = await page.screenshot({
    clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height },
  });
  await ctx.close();
  return { screen, png, clip, drops, imgs };
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });
const manifest = [];
for (const screen of SCREENS) {
  const res = await renderScreen(browser, screen);
  if (!res) continue;
  const { png, clip, drops, imgs } = res;
  const buf = await sharp(png)
    .resize({ width: screen.width })
    .webp({ quality: screen.quality, effort: 5 })
    .toBuffer();
  const meta = await sharp(buf).metadata();
  await writeFile(`${OUT}/${screen.out}`, buf);
  manifest.push({ out: screen.out, width: meta.width, height: meta.height, kb: Math.round(buf.length / 1024) });
  console.log(
    `✓ ${screen.out.padEnd(18)} ${meta.width}×${meta.height}  ${String(Math.round(buf.length / 1024)).padStart(4)} KB` +
      (drops.length ? `  · ${drops.length} düğüm` : '') +
      (imgs.length ? `  · ${imgs.length} görsel temizlendi` : ''),
  );
}
await writeFile(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
await browser.close();
console.log('\nDenetim: her ekran ad, marka ve GÖRSEL sızıntısı için tarandı, sızıntı yok.');
