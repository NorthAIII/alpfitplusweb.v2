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
 *
 * KONTRAST OLCUMU PIKSELDEDIR (TASK-3.04). Hesaplanmis stil yolu KALDIRILDI:
 * o model gradyan/fotograf zeminini, ata opakligini ve gradyanla boyanmis
 * metni YAPISAL olarak goremiyordu ve <body>'ye tek bir dekoratif gradyan
 * kondugunda olculen eleman 157 -> 0'a duserken kapi yine "TOPLAM SORUN: 0"
 * diyordu (B-031). Yontem `../lib/piksel-kontrast.mjs`'te.
 *
 * Iki kosum kosulu, ikisi de TERCIH DEGIL DOGRULUK KOSULU:
 *   1. Sayfa EKRAN EKRAN gezilir (pencerenin %90'i adimlarla). Tek ekran olcumu
 *      B-032'nin kalemlerinin HICBIRINI gormuyor — 1440 px'te ilk ekranda ihlal
 *      0, sayfa tamaminda 21.
 *   2. Baglam `reducedMotion: 'reduce'` ile acilir. Ata opaklik carpimi
 *      uygulandigi anda Reveal'in gecis ORTASI opakliklari olcume girer ve
 *      sahte ihlal uretir (olculen ara degerler: 0,459 · 0,618 · 0,666 · 0,711
 *      · 0,818). Hareket azaltma altinda `.reveal` kurali hic uygulanmaz
 *      (globals.css:221 `no-preference` ile kapili), yerlesim oturur.
 */
import { chromium } from "playwright";
import { rotalar, BEKLENEN_ROTA } from "../lib/rotalar.mjs";
import {
  ADIM_ORANI,
  KAYDIRMA_CSS,
  adaylariTopla,
  adimiIsle,
  hamPiksel,
  kareCifti,
  kaydirVeDogrula,
  rotaSonucu,
} from "../lib/piksel-kontrast.mjs";

// Varsayilan hedef yayin kopyasidir (arastirma karari, PHASE-3): olculen ile
// yayinlanan ayni sey olur. BASE ile gelistirme sunucusuna yonlendirmek
// BILINCLI OLARAK aciktir -- duzeltme task'larinin ara dogrulamasi icin.
// Bedeli: 3100 bayat olabilir (B-019) -- `docker compose build web-prod` imaji
// tazeler ama konteyneri YENIDEN YARATMAZ, `--profile prod up -d` gerekir.
const BASE = process.env.BASE || "http://localhost:3100";

const PENCERE = { width: 1440, height: 900 };
const SECICI = "p,span,a,li,h1,h2,h3,h4,td,th,label,button,dt,dd";
const TOPLAYICI_AYARI = {
  secici: SECICI,
  // Etkin opaklik bunun altindaysa metin gorsel olarak yok sayilir. Esik
  // BILINCLI OLARAK dusuk: ProductStory'nin soluk kartlari 0,45 tasiyor ve
  // olculmeleri bu task'in ta kendisi.
  minOpaklik: 0.1,
  // sr-only metni (1x1 px, kirpilmis) gorsel kontrast kavraminin disindadir.
  minAlan: 16,
};
const ADIM_TAVANI = 60; // guvenlik: sonsuz dongu kapisi

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
console.log(`Yöntem: piksel (glif maskesi + ata opaklığı) · hareket azaltma: açık · pencere ${PENCERE.width}×${PENCERE.height}`);

const baslangic = Date.now();
const b = await chromium.launch();
let totalIssues = 0;
let visited = 0;
let measuredTotal = 0;
let adimToplam = 0;
const kovaToplam = { yapiskan: 0, gradyan: 0, gorunmez: 0, ekranDisi: 0, kalan: 0 };
const gezilemeyen = [];
const olcumArizasi = [];
const kalanOrnekleri = [];

for (const path of PAGES) {
  const ctx = await b.newContext({
    viewport: PENCERE,
    locale: "tr-TR",
    reducedMotion: "reduce",
  });
  const p = await ctx.newPage();
  try {
    await p.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
  } catch (e) {
    // Tek rotanin dusmesi turu bitirmez ama SESSIZ de gecmez: gezilen rota
    // sayisi esigin altina duser ve kapi kirmiziya doner.
    gezilemeyen.push(path);
    console.log(`\n── ${path}`);
    console.log(`   ✗ sayfa açılamadı — ${e.message.split("\n")[0]}`);
    await ctx.close();
    continue;
  }
  await p.waitForTimeout(800);
  // Yumusak kaydirma kapatilir — olcumun gecerlilik kosulu, gerekcesi lib'de.
  await p.addStyleTag({ content: KAYDIRMA_CSS });

  // --- kontrasttan bagimsiz a11y kontrolleri (tek sefer) -------------------
  const temel = await p.evaluate(() => ({
    noAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
    emptyLinks: [...document.querySelectorAll("a")].filter(
      (a) => !a.textContent.trim() && !a.getAttribute("aria-label"),
    ).length,
    btnNoName: [...document.querySelectorAll("button")].filter(
      (x) => !x.textContent.trim() && !x.getAttribute("aria-label"),
    ).length,
    h1: document.querySelectorAll("h1").length,
  }));

  // --- ekran ekran kontrast olcumu ----------------------------------------
  // Belge yuksekligi HER ADIMDA yeniden okunur: tembel icerik gezerken
  // yukleniyor, bastan hesaplanan adim sayisi sayfanin altini kacirirdi.
  const adimPx = Math.max(1, Math.round(PENCERE.height * ADIM_ORANI));
  const kayit = new Map();
  let y = 0;
  let adim = 0;
  try {
    while (adim < ADIM_TAVANI) {
      // Kaydirmanin hedefe OTURDUGU olculur; oturmazsa cumleyle durulur.
      await kaydirVeDogrula(p, y);
      const toplam = await p.evaluate(adaylariTopla, TOPLAYICI_AYARI);
      const [ka, kb] = await kareCifti(p);
      const [A, B] = await Promise.all([hamPiksel(ka), hamPiksel(kb)]);
      adimiIsle(kayit, toplam, A, B);
      adim++;

      const dh = await p.evaluate(() => document.documentElement.scrollHeight);
      if (y + PENCERE.height >= dh - 2) break;
      y = Math.min(y + adimPx, dh - PENCERE.height);
    }
  } catch (e) {
    // Olcum arizasi SESSIZ gecmez: rota gezilmis sayilmaz, kapsam esigi duser.
    olcumArizasi.push(path);
    console.log(`\n── ${path}`);
    console.log(`   ✗ ölçüm arızası — ${e.message.split("\n")[0]}`);
    await ctx.close();
    continue;
  }

  const { ihlaller, olculen, kovalar, kalanlar } = rotaSonucu(kayit);

  visited++;
  adimToplam += adim;
  measuredTotal += olculen;
  for (const k of Object.keys(kovaToplam)) kovaToplam[k] += kovalar[k];
  if (kovalar.kalan) kalanOrnekleri.push(`${path}:${kovalar.kalan}`);

  totalIssues +=
    ihlaller.length + temel.noAlt + temel.emptyLinks + temel.btnNoName + (temel.h1 === 1 ? 0 : 1);

  console.log(`\n── ${path}`);
  console.log(
    `   h1:${temel.h1} · alt'sız img:${temel.noAlt} · adsız link:${temel.emptyLinks} · adsız buton:${temel.btnNoName} · kontrast ihlali:${ihlaller.length}`,
  );
  console.log(`   adım:${adim} · ölçülen:${olculen} eleman`);
  console.log(
    `   ölçülemeyen → yapışkan borcu:${kovalar.yapiskan} · gradyan metin:${kovalar.gradyan} · görünmez:${kovalar.gorunmez} · ekran dışı:${kovalar.ekranDisi} · kalan:${kovalar.kalan}`,
  );
  for (const t of kalanlar) console.log(`   ? ölçülemedi (kalan) — ${t}`);
  // Teshis satiri p02 ile birlikte min ve med'i de basar: p02 yargi degeridir
  // ama desenli zeminde yargiyi yumusatmak icin otekiler gerekir (B-032).
  for (const x of ihlaller.slice(0, 14)) {
    console.log(
      `   ✗ p02 ${x.p02}:1 (gereken ${x.gereken}) · min ${x.min} · med ${x.med} · ${x.px}px/${x.ag} · glif ${x.n}px — "${x.t}"`,
    );
  }
  await ctx.close();
}
await b.close();

// ---- Kapsam esigi ve cikis kodu -------------------------------------------
// Gecme satiri ile cikis kodu AYNI degiskenden turer.
const kapsamSorunlari = [];
if (visited < BEKLENEN_ROTA) {
  kapsamSorunlari.push(
    `gezilen rota ${visited} < beklenen ${BEKLENEN_ROTA}` +
      (gezilemeyen.length ? ` (açılamayan: ${gezilemeyen.join(", ")})` : "") +
      (olcumArizasi.length ? ` (ölçüm arızası: ${olcumArizasi.join(", ")})` : ""),
  );
}
if (measuredTotal === 0) {
  kapsamSorunlari.push("0 eleman ölçüldü — hedef boş sayfa sunuyor olabilir");
}
// Olculmesi gerekirken TEK PIKSEL bile uretmeyen eleman: sinifi bilinmeyen bir
// kor noktadir. Adi konmus iki muafiyet (yapiskan borcu, gradyan metin) ayri
// sayilir ve kapiyi dusurmez; "kalan" duserir.
if (kovaToplam.kalan > 0) {
  kapsamSorunlari.push(
    `${kovaToplam.kalan} eleman ölçülemedi ve hiçbir muafiyete girmiyor (${kalanOrnekleri.join(", ")})`,
  );
}

const sure = Math.round((Date.now() - baslangic) / 1000);
console.log(
  `\nKAPSAM: ${visited} rota gezildi · ${adimToplam} ekran adımı · ${measuredTotal} eleman ölçüldü · ${sure} sn`,
);
console.log(
  `ÖLÇÜLEMEYEN: yapışkan katman borcu:${kovaToplam.yapiskan} (B-063 — bu fazın kapsamı dışı) · gradyan metin:${kovaToplam.gradyan} (TASK-3.05) · görünmez:${kovaToplam.gorunmez} · ekran dışı:${kovaToplam.ekranDisi} · kalan:${kovaToplam.kalan}`,
);
console.log(`${visited} sayfada TOPLAM SORUN: ${totalIssues}`);

const gecti = totalIssues === 0 && kapsamSorunlari.length === 0;
if (gecti) {
  console.log(`✓ KAPI YEŞİL — ${visited} sayfada 0.`);
} else {
  for (const k of kapsamSorunlari) console.log(`✗ KAPSAM EŞİĞİ: ${k}`);
  console.log(`✗ KAPI KIRMIZI.`);
  process.exitCode = 1;
}
