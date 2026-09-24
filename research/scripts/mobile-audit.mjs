/**
 * Mobil denetimi: yatay kaydirma, yatay tasma, KIRPILMIS TASMA, kaydirilabilir
 * serit olcutu, kucuk dokunma hedefi, bolum boylari.
 *
 * KAPI (TASK-3.03): rota listesi tek kaynaktan turer, olcum hedefi varsayilan
 * olarak YAYIN KOPYASIDIR (3100) ve esik altinda betik SIFIR-OLMAYAN CIKIS
 * KODU doner. Gecme satiri ile cikis kodu ayni degiskenden turer (B-030).
 *
 * IKI GENISLIK (TASK-3.07). Betik eskiden yalniz 390 px olcuyordu; 320 px
 * destek kapsamindadir (kapsam karari, PHASE-3) ve WCAG 1.4.10 reflow'un
 * olcum genisligidir. Her genislik AYRI raporlanir ve kendi kapsam esigini
 * tasir -- bir genisligin cokmesi otekinin arkasina saklanamaz.
 *
 * KIRPILMIS TASMA KENDI DALIDIR (TASK-3.07). Dosya basligi bir zamanlar
 * "tasan metin" sayiyordu ama kod onu HIC olcmuyordu (B-030 kalem d):
 * kirpilan icerik `clippedBy()` tarafindan ayiklaniyor, yerine bir sey
 * konmuyordu. Bedeli olculdu -- B-033'un 19 kesik dugumu, sayfa yatay
 * kaydirmasi olmadigi icin kapinin gecme sartini ("yatay kaydirma: yok")
 * SAGLAYARAK sessizce geciyordu. Dal artik olcuyor ve olagan yoldan
 * `TOPLAM SORUN`a girer.
 *
 * DALIN TANIMI OLCULEREK SECILDI (uc aday 320 px'te yan yana kosuldu):
 *   · metin MENZILI (Range)        →  9 kalem / 66 px  — B-033'un dar alt kumesi
 *   · DOGRUDAN metin tasiyan ELEMANIN kutusu → 19 kalem / 70 px  ← SECILEN
 *   · tum elemanlar                → 47 kalem / 2595 px — dekoratif lekeler dahil
 * Secilen tanim B-033'un devralinan rakamini (19 dugum / 70 px) birebir
 * yeniden uretir. "Dogrudan metin" susgeci bir optimizasyon DEGIL, dekoratif
 * kirpmanin (Modules kartlarinin parilti lekesi) MUAFIYETIDIR: o lekeler
 * bilerek kart disina konup kirpilir ve tasidiklari metin yoktur.
 *
 * MUAFIYETLER GIZLEME DEGIL AYRI SAYMADIR ve hepsi BEYANA baglidir, kalba
 * degil. Muafiyetsiz dedektor olculdu: 320 px'te 78 ham isabetin 59'u sahte.
 *
 * SINIFLANDIRMA SIRASI BILINCLIDIR ve sonucu degistirir (olculdu):
 *   1. gorsel olarak gizli (sr-only deyimi)  2. hareketli serit  3. kaydirilabilir
 *   4. gercek kirpma
 * Naif bir "gorunur alani sifira yakin" olcutu 320 px'te 83 kalem yakaliyor
 * ve bunlarin 66'si aslinda KAYDIRILABILIR kovasina ait -- yani sinif calinir
 * ve kaydirilabilir nufusu gorunmez olur. O yuzden gizlilik olcutu alana
 * degil BEYANA bakar: kesen kutunun `clip-path: inset(50%)`i ya da 1x1 kutusu.
 *
 * HAREKET MUAFIYETI ANIMASYONUN ADINA BAKAR, SURESINE DEGIL. Hareket azaltma
 * altinda `animation-duration` .01ms'e iner ama `animation-name` DURUR; sureye
 * bakan bir olcut kayan tanitim seridini sahte pozitif yapardi (olculdu:
 * 390 px'te 18 sahte isabet, tasma 2.638 px'e kadar).
 *
 * KAYDIRILABILIR SERIT OLCUTU (TASK-3.07). Kirpma dedektoru seridi GORMEZ --
 * kaydirilabilir oldugu icin muafiyete duser. Ikinci olcut o bosluğu kapatir:
 * kaydirilabilir bir kapta TEK BIR COCUK ogenin genisligi kabin GORUNUR
 * genisliginden buyukse o oge hicbir zaman tumuyle gorunmez. Muafiyeti
 * WCAG 1.4.10'un KENDI istisnasidir: "kullanimi ya da anlami iki boyutlu
 * yerlesim gerektiren icerik" -- veri tablosu bunun kanonik ornegidir.
 */
import { chromium } from "playwright";
import { rotalar, BEKLENEN_ROTA } from "../lib/rotalar.mjs";

// Varsayilan hedef yayin kopyasidir (arastirma karari, PHASE-3). BASE ile
// gelistirme sunucusuna yonlendirmek BILINCLI OLARAK aciktir. Bedeli: 3100
// bayat olabilir (B-019) — `--profile prod up -d --build web-prod` ile tazelenir.
const BASE = process.env.BASE || "http://localhost:3100";

/**
 * Olculen genislikler. 390 = referans telefon, 320 = WCAG 1.4.10 reflow tabani
 * ve bu projenin beyan ettigi destek sinirinin dar ucu (B-033 kapsam karari).
 */
const GENISLIKLER = [320, 390];

/**
 * KIRPMA dalinin KAPSAM TABANI — BEKLENEN_ROTA ile ayni sozlesme: bu bir
 * TABAN, ust sinir DEGIL.
 *
 * Gerekce dalin seklinde: dal ihlalin YOKLUGUNU raporlar, yani sessiz kalmak
 * onun basari halidir. Secici korlesirse taranan kume bosalir, "0 kirpma"
 * cikar ve kapi YESIL kalir — "bakmadim" ile "hicbir sey kirpilmiyor" ayni
 * ciktiyi verir. Bugun 16 rotada olculen dogrudan metin tasiyan eleman sayisi
 * her iki genislikte de 2038. Sayfa/bolum bilerek SILINIRSE taban elle
 * dusurulur; dusurulmeden kapi kirmizi kalir, ki amac odur.
 */
const BEKLENEN_METIN_ELEMANI = 2038;

/**
 * SERIT dalinin KAPSAM TABANI. Ayni gerekce: kaydirilabilir kap bulunamazsa
 * dal "0 ihlal" deyip sessizce gecerdi. Bugun her genislikte 5 kap olculuyor
 * (Roller seridi x2 rota, /fiyat'in iki tablosu, /gecis).
 */
const BEKLENEN_SERIT = 5;

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
console.log(`Genişlikler: ${GENISLIKLER.join(" · ")} px`);

/** Sayfa baglaminda kosar. Tek bir rotanin tum olcumunu dondurur. */
const rotayiOlc = () => {
  const vw = document.documentElement.clientWidth;
  const EPS = 0.5;
  const kesiyor = (cs) => /hidden|clip|auto|scroll/.test(cs.overflowX + " " + cs.overflowY);

  // ---- 1) Yatay tasma (bugunku dal) ------------------------------------
  // YALNIZ kirpan bir atasi olmayanlar sayilir: kaydirilabilir bir kutunun
  // (ornegin fiyat tablosunun overflow-x-auto sarmalayicisi) icindeki genis
  // icerik tasma DEGILDIR, tasarimin kendisidir.
  const clippedBy = (el) => {
    let n = el.parentElement;
    while (n && n !== document.documentElement) {
      if (/hidden|clip|auto|scroll/.test(getComputedStyle(n).overflowX)) return true;
      n = n.parentElement;
    }
    return false;
  };
  // BILINCLI EKRAN-DISI YUZEY (TASK-3.07). Olcut kalip degil BEYAN: `aria-hidden`
  // tasiyan ve ekranin TAMAMEN disinda (sag kenari 0'in solunda) kalan altagac.
  // Bugunku tek uyesi demo formundaki bal kupu (`input#website`, sol -9999) ve
  // uc dugumu bu dala giriyordu — hicbir duzeltme task'i onlari kaldirmayacak,
  // kaldirmamali da: tuzagin ekran disinda olmasi dogru tasarimdir. Muafiyet
  // yazilmasaydi kapi /demo yuzunden KALICI kirmizi kalirdi.
  const ekranDisiBeyanli = (el, rc) =>
    rc.right < 0 && !!el.closest('[aria-hidden="true"]');

  const overflow = [];
  let geom = 0;
  let ekranDisiMuaf = 0;
  for (const el of document.querySelectorAll("body *")) {
    const rc = el.getBoundingClientRect();
    if (rc.width === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.position === "fixed" || cs.display === "none") continue;
    geom++;
    if (!(rc.right > vw + 1.5 || rc.left < -1.5)) continue;
    // Beyan once sorulur: bal kupu bugun kirpan bir kapta DEGIL, ama ileride
    // olursa `clippedBy` onu sessizce yutardi ve muaf sayisi korlesir.
    if (ekranDisiBeyanli(el, rc)) { ekranDisiMuaf++; continue; }
    if (clippedBy(el)) continue;
    overflow.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || "").toString().slice(0, 60),
      left: Math.round(rc.left), right: Math.round(rc.right),
    });
  }

  // ---- 2) Kirpilmis tasma (TASK-3.07) ----------------------------------
  // Olcut: DOGRUDAN metin tasiyan elemanin sinir kutusu, onu KESEN atasinin
  // kutusunun disina tasiyor mu. Kesen kutu = disaridan ice dogru ilk daraltan
  // ata; sinifi o belirler, cunku kesimi gercekte yapan odur.
  const srOnlyBeyani = (cs, kb) =>
    /inset\(\s*50%/.test(cs.clipPath || "") || (kb.width <= 2 && kb.height <= 2);

  const kirpma = { taranan: 0, gizli: 0, hareketli: 0, kaydirilabilir: 0, dikeyYalniz: 0 };
  const kirpilan = [];
  for (const el of document.querySelectorAll("body *")) {
    if (/^(script|style|noscript|title)$/i.test(el.tagName)) continue;
    let metin = "";
    for (const n of el.childNodes) if (n.nodeType === 3 && n.nodeValue.trim()) metin += n.nodeValue;
    metin = metin.trim();
    if (!metin) continue;
    const rc = el.getBoundingClientRect();
    if (rc.width <= 0 || rc.height <= 0) continue;
    kirpma.taranan++;

    let kalan = { l: rc.left, t: rc.top, r: rc.right, b: rc.bottom };
    let kesen = null;
    let hareketli = null;
    // Animasyon kontrolu elemanin KENDISINDEN baslar: kayan seridin animasyonu
    // seridin uzerindedir ve yalniz atalara bakan bir tarama onu kacirir.
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      // ADA bakilir, SUREYE degil (hareket azaltma sureyi .01ms'e indirir).
      if (!hareketli && cs.animationName && cs.animationName !== "none") hareketli = cs.animationName;
      if (n === el) continue; // elemanin kendi overflow'u kendi kutusunu kesemez
      if (!kesiyor(cs)) continue;
      const kb = n.getBoundingClientRect();
      const yeni = {
        l: Math.max(kalan.l, kb.left), t: Math.max(kalan.t, kb.top),
        r: Math.min(kalan.r, kb.right), b: Math.min(kalan.b, kb.bottom),
      };
      const kesti = kalan.r - yeni.r > EPS || yeni.l - kalan.l > EPS ||
                    kalan.b - yeni.b > EPS || yeni.t - kalan.t > EPS;
      if (kesti && !kesen) kesen = { cs, kb, tag: n.tagName.toLowerCase() };
      kalan = yeni;
    }
    if (!kesen) continue;
    const yatay = Math.round(Math.max(rc.right - kalan.r, kalan.l - rc.left, 0));

    // SIRA: gizli → hareketli → kaydirilabilir → gercek (gerekce dosya basliginda)
    if (srOnlyBeyani(kesen.cs, kesen.kb)) { kirpma.gizli++; continue; }
    if (hareketli) { kirpma.hareketli++; continue; }
    if (/auto|scroll/.test(kesen.cs.overflowX)) { kirpma.kaydirilabilir++; continue; }
    // Dal YATAY kaybi olcer. Dikey kirpma (line-clamp, sabit yukseklikli kutu)
    // cogu yerde BILINCLI kisaltmadir ve ayri bir olcut ister; sayilir ama
    // kapiyi dusurmez — kapsam daralmasi sessiz kalmasin diye raporlanir.
    if (yatay <= 0) { kirpma.dikeyYalniz++; continue; }
    kirpilan.push({
      tag: el.tagName.toLowerCase(),
      px: yatay,
      t: metin.replace(/\s+/g, " ").slice(0, 40),
      kesen: kesen.tag,
    });
  }

  // ---- 3) Kaydirilabilir serit olcutu (TASK-3.07) -----------------------
  const seritler = [];
  let seritSayisi = 0;
  let tabloMuaf = 0;
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (!/auto|scroll/.test(cs.overflowX)) continue;
    const cw = el.clientWidth;
    if (cw <= 0) continue;
    seritSayisi++;
    for (const ch of el.children) {
      const w = ch.getBoundingClientRect().width;
      if (w <= cw + 1) continue;
      // WCAG 1.4.10'un kendi istisnasi: iki boyutlu yerlesim gerektiren icerik.
      // /fiyat'in iki fiyat tablosu (min-w-[44rem] · min-w-[38rem]) bu kalibin
      // MESRU halidir — tablo kolon kolon okunur, tumunu birden gormek gerekmez.
      if (ch.tagName === "TABLE" || ch.querySelector("table")) { tabloMuaf++; continue; }
      seritler.push({
        tag: ch.tagName.toLowerCase(),
        w: Math.round(w), cw,
        t: (ch.textContent || "").replace(/\s+/g, " ").trim().slice(0, 30),
      });
    }
  }

  // ---- 4) Dokunma hedefi < 40px ----------------------------------------
  const small = [];
  let hedef = 0;
  for (const el of document.querySelectorAll('a, button, input, select, [role="tab"]')) {
    const rc = el.getBoundingClientRect();
    if (rc.width === 0 || rc.height === 0) continue;
    if (getComputedStyle(el).display === "contents") continue;
    // Bir etiketin icindeki onay kutusu: gercek dokunma hedefi etikettir.
    if (el.closest("label") && el.tagName === "INPUT") continue;
    // sr-only atlama baglantisi olcum disi
    if (rc.width <= 2 && rc.height <= 2) continue;
    hedef++;
    if (rc.height < 40 && rc.width < 200) {
      small.push({ t: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 28), h: Math.round(rc.height), w: Math.round(rc.width) });
    }
  }

  // ---- 5) Bolum boylari -------------------------------------------------
  const sections = [...document.querySelectorAll("main > section, main > * > section")].map((s) => ({
    id: s.id || (s.className || "").toString().slice(0, 24),
    h: Math.round(s.getBoundingClientRect().height),
  }));

  return {
    docW: document.documentElement.scrollWidth, vw,
    overflow: overflow.slice(0, 6), overflowCount: overflow.length, ekranDisiMuaf,
    kirpma, kirpilan: kirpilan.slice(0, 8), kirpilanCount: kirpilan.length,
    serit: seritler.slice(0, 6), seritCount: seritler.length, seritSayisi, tabloMuaf,
    small: small.slice(0, 6), smallCount: small.length,
    geom, hedef, sections, total: document.body.scrollHeight,
  };
};

const b = await chromium.launch();
const baslangic = Date.now();
let total = 0;
const kapsamSorunlari = [];
const ozet = [];

for (const W of GENISLIKLER) {
  console.log(`\n${"═".repeat(64)}\nGENİŞLİK ${W} px\n${"═".repeat(64)}`);
  let visited = 0, geomTotal = 0, hedefTotal = 0;
  let kirpmaTaranan = 0, kirpilanTotal = 0, enAgir = 0;
  const kovalar = { gizli: 0, hareketli: 0, kaydirilabilir: 0, dikeyYalniz: 0 };
  let seritNufus = 0, seritIhlal = 0, tabloMuafTotal = 0, ekranDisiMuafTotal = 0;
  const gezilemeyen = [];

  for (const path of PAGES) {
    const ctx = await b.newContext({ viewport: { width: W, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, locale: "tr-TR" });
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
    await p.evaluate(async () => {
      await new Promise((r) => { let y = 0; const s = () => { window.scrollBy(0, 700); y += 700;
        if (y < document.body.scrollHeight && y < 40000) setTimeout(s, 45); else { window.scrollTo(0, 0); setTimeout(r, 500); } }; s(); });
    });
    const r = await p.evaluate(rotayiOlc);
    const hScroll = r.docW > r.vw + 1;
    visited++;
    geomTotal += r.geom;
    hedefTotal += r.hedef;
    kirpmaTaranan += r.kirpma.taranan;
    kirpilanTotal += r.kirpilanCount;
    for (const k of Object.keys(kovalar)) kovalar[k] += r.kirpma[k];
    seritNufus += r.seritSayisi;
    seritIhlal += r.seritCount;
    tabloMuafTotal += r.tabloMuaf;
    ekranDisiMuafTotal += r.ekranDisiMuaf;
    enAgir = Math.max(enAgir, ...r.kirpilan.map((k) => k.px), 0);
    total += (hScroll ? 1 : 0) + r.overflowCount + r.smallCount + r.kirpilanCount + r.seritCount;

    console.log(`\n── ${path}  (${r.total}px)`);
    console.log(`   yatay kaydırma:${hScroll ? "VAR " + r.docW + ">" + r.vw : "yok"} · taşan eleman:${r.overflowCount} · kırpılmış metin:${r.kirpilanCount} · şerit ihlali:${r.seritCount} · küçük dokunma hedefi:${r.smallCount}`);
    console.log(`   ölçülen:${r.geom} eleman / ${r.kirpma.taranan} metin elemanı / ${r.hedef} dokunma hedefi / ${r.seritSayisi} kaydırılabilir kap`);
    console.log(`   muaf → ekran dışı beyanlı:${r.ekranDisiMuaf} · görsel gizli:${r.kirpma.gizli} · hareketli şerit:${r.kirpma.hareketli} · kaydırılabilir:${r.kirpma.kaydirilabilir} · dikey kırpma:${r.kirpma.dikeyYalniz} · iki boyutlu içerik:${r.tabloMuaf}`);
    for (const o of r.overflow) console.log(`   ✗ taşma <${o.tag}> ${o.left}→${o.right}  ${o.cls}`);
    for (const k of r.kirpilan) console.log(`   ✗ [kırpma] ${k.px}px kesildi <${k.tag}> · kesen <${k.kesen}> — "${k.t}"`);
    for (const s of r.serit) console.log(`   ✗ [şerit] <${s.tag}> ${s.w}px > kabın görünür genişliği ${s.cw}px — "${s.t}"`);
    for (const s of r.small) console.log(`   ✗ hedef ${s.w}×${s.h}px  "${s.t}"`);
    if (path === "/") for (const s of r.sections) console.log(`     bölüm ${String(s.h).padStart(5)}px  ${s.id}`);
    await ctx.close();
  }

  // ---- Genislige ozel kapsam esikleri ----------------------------------
  // Her genislik KENDI esigini tasir: birinin cokmesi otekinin arkasina
  // saklanamaz (B-030'un "kapsam da esiklenir" kalemi).
  if (visited < BEKLENEN_ROTA) {
    kapsamSorunlari.push(`${W}px: gezilen rota ${visited} < beklenen ${BEKLENEN_ROTA}` +
      (gezilemeyen.length ? ` (açılamayan: ${gezilemeyen.join(", ")})` : ""));
  }
  if (geomTotal === 0) {
    kapsamSorunlari.push(`${W}px: 0 eleman ölçüldü — hedef boş sayfa sunuyor olabilir`);
  }
  if (kirpmaTaranan < BEKLENEN_METIN_ELEMANI) {
    kapsamSorunlari.push(`${W}px: metin taşıyan eleman ${kirpmaTaranan} ölçüldü < beklenen taban ${BEKLENEN_METIN_ELEMANI} — seçici körleşmiş olabilir`);
  }
  if (seritNufus < BEKLENEN_SERIT) {
    kapsamSorunlari.push(`${W}px: kaydırılabilir kap ${seritNufus} bulundu < beklenen taban ${BEKLENEN_SERIT} — şerit dalı körleşmiş olabilir`);
  }

  console.log(`\nKAPSAM ${W}px: ${visited} rota · ${geomTotal} eleman · ${kirpmaTaranan} metin elemanı (taban ${BEKLENEN_METIN_ELEMANI}) · ${hedefTotal} dokunma hedefi · ${seritNufus} kaydırılabilir kap (taban ${BEKLENEN_SERIT})`);
  console.log(`KIRPILMIŞ TAŞMA ${W}px: ${kirpilanTotal} gerçek · en ağır ${enAgir}px · muaf → görsel gizli:${kovalar.gizli} · hareketli şerit:${kovalar.hareketli} · kaydırılabilir:${kovalar.kaydirilabilir} · dikey:${kovalar.dikeyYalniz}`);
  console.log(`ŞERİT ${W}px: ${seritIhlal} ihlal · iki boyutlu içerik muafiyeti:${tabloMuafTotal}`);
  console.log(`EKRAN DIŞI BEYANLI MUAF ${W}px: ${ekranDisiMuafTotal}`);
  ozet.push(`${W}px: kırpma ${kirpilanTotal} · şerit ${seritIhlal}`);
}
await b.close();

// ---- Kapi ------------------------------------------------------------------
// Gecme satiri ile cikis kodu AYNI degiskenden turer.
const sure = Math.round((Date.now() - baslangic) / 1000);
console.log(`\n${"═".repeat(64)}`);
console.log(`ÖZET: ${ozet.join("  |  ")} · ${sure} sn`);
console.log(`${GENISLIKLER.length} genişlik × ${PAGES.length} rota — TOPLAM SORUN: ${total}`);

const gecti = total === 0 && kapsamSorunlari.length === 0;
if (gecti) {
  console.log(`✓ KAPI YEŞİL — ${GENISLIKLER.join("/")} px'te 0.`);
} else {
  for (const k of kapsamSorunlari) console.log(`✗ KAPSAM EŞİĞİ: ${k}`);
  console.log(`✗ KAPI KIRMIZI.`);
  process.exitCode = 1;
}
