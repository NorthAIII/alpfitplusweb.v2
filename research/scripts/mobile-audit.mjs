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
 *
 * DOKUNMA HEDEFI IKI KULVARLIDIR (TASK-3.08). Kullanici karari (PHASE-3 ->
 * Alinan Kararlar): "Dokunma hedefi kurali KADEMELI kurulur." Donusume dokunan
 * hedef 44 px'in altindaysa kapiyi KIRMIZIYA dusurur; alt bilgi ve icerik yolu
 * baglantilari olculur, listelenir, DUSURMEZ. Gerekce kullanicinindir: kucuk
 * hedeflerin buyuk cogunlugu gezinme yuzeyidir ve hepsini 44 px'e cikarmak
 * satir araliklarini acarak tipografiyi bozar; ILKELER'in 1. ekseni (donusum)
 * hangi hedefin kritik oldugunu zaten soyluyor. Kumeyi genisletmek/daraltmak
 * yeni bir KARARDIR, betik ayari degil.
 *
 * ESIK 44x44 CSS px ve IKI BOYUT DA sayilir (`h < 44 || w < 44`). Eski dal
 * `h < 40 && w < 200` diyordu -- iki ucu da yanlisti: 40 px esigi WCAG'in
 * rakami degildi, ve `w < 200` kosulu GENIS ama ALCAK hedefleri (form alani
 * 302x47, telefon baglantisi 350x39) kapinin gorus alanindan cikariyordu.
 *
 * KRITIK KUME POZITIF TANIMLIDIR, kalan her olculen hedef gezinme kulvarina
 * duser -- yani ucuncu, sessiz bir kova YOKTUR. Siniflandirma sirasi:
 *   buton/summary/role=button -> form alani -> sekme -> menu (header/nav,
 *   footer disi) -> donusum baglantisi (/demo, wa.me, tel:) -> gezinme
 * Donusum baglantisi NEREDE OLURSA OLSUN kritiktir (alt bilgideki telefon
 * baglantisi dahil): gerekce yine 1. eksendir, alt bilgi kurali gezinme
 * baglantilari icindir. Olculdu: kural "footer'daki donusum baglantisi da
 * gezinmedir" diye kurulsaydi benzersiz kritik kume 19 degil 18 olurdu.
 *
 * HEDEF, KONTROLUN KENDI KUTUSUDUR -- sarmalayan <label>'in tiklanabilir alani
 * DEGIL. Onay kutusu bunun kanonik ornegi: kutu 18x18, sarmalayan etiket ise
 * cok satirli bir riza cumlesi. Etiketin kutusunu hedef saymak 18x18'lik
 * kutuyu kapiya GORUNMEZ yapardi; ziyaretci ise gorunur kontrole nisan alir.
 * (Eski dal `el.closest("label") && INPUT` ile tam bunu yapiyordu ve onay
 * kutusu hic olculmuyordu.) Olcut her koşumda ciktiya da yazilir.
 *
 * BENZERSIZLESTIRME ANAHTARI `<etiket>|<erisilebilir ad>`. Ayni bilesen 16
 * sayfada tekrarlaniyor; rapor benzersiz kumeyi gosterir, yoksa duzeltme
 * listesi 125 satir gibi okunur. Anahtar olculerek secildi (390 px, 16 rota):
 *   tag|ad           -> 19  <- SECILEN, B-033/arastirmanin 19 benzersiz
 *                             kritik hedefini birebir yeniden uretir
 *   tag|ad|genislikxyukseklik -> 22   ·   tag|ad|href -> 20   ·   sinif|ad -> 20
 * Bilgi kaybi yok: her benzersiz satir kendi OLCU VARYANTLARINI ve kac rotada
 * gorundugunu basar, yani duzeltme listesi (TASK-3.17) eksiksiz kalir.
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
 * her iki genislikte de 2054. Sayfa/bolum bilerek SILINIRSE taban elle
 * dusurulur; dusurulmeden kapi kirmizi kalir, ki amac odur.
 *
 * 2038 -> 2054 (TASK-3.16): basliga 1024 px altinda gorunen bir "Demo"
 * baglantisi eklendi ve 16 rotanin hepsinde ciziliyor (+16, olculdu). Taban
 * BILINCLE yukseltildi — eski deger birakilsaydi ileride 16 metin elemaninin
 * sessizce kaybolmasi kapida gorunmezdi (fail-open penceresi).
 */
const BEKLENEN_METIN_ELEMANI = 2054;

/**
 * SERIT dalinin KAPSAM TABANI. Ayni gerekce: kaydirilabilir kap bulunamazsa
 * dal "0 ihlal" deyip sessizce gecerdi. Bugun her genislikte 5 kap olculuyor
 * (Roller seridi x2 rota, /fiyat'in iki tablosu, /gecis).
 */
const BEKLENEN_SERIT = 5;

/** Dokunma hedefi esigi — CSS px. M2 F2.3 kabul kriteri ("≥ 44 px"). */
const HEDEF_ESIK = 44;

/**
 * KRITIK dokunma hedefi dalinin KAPSAM TABANI.
 *
 * Bu dal ihlalin VARLIGINI raporlar, yani korlesmis bir siniflandirici "0
 * kritik ihlal" deyip kapiyi YESIL birakir — T3'un fail-open sondasinin tam
 * karsiligi. Bugun her genislikte 305 kritik hedef olculuyor (buton 111 ·
 * donusum baglantisi 125 · menu 61 · form alani 8; `[role=button]` ve
 * `<summary>` bugun 0 eseliyor, ileriye donuk guvencedir).
 *
 * 289 -> 305 (TASK-3.16): basliga 1024 px altinda gorunen bir "Demo"
 * baglantisi eklendi, 16 rotanin hepsinde cizilir (+16). Kova MENU'dur,
 * "donusum baglantisi" DEGIL — yukaridaki siniflandirma sirasinda `header,
 * nav` icindeki `<a>` donusum dalindan ONCE eslenir; olculdu (menu 45 -> 61,
 * donusum baglantisi 125 -> 125). Iki kova da kritik kumede oldugu icin
 * 44 px kurali yine gecerli ve saglaniyor: esik ALTI sayi degismedi
 * (125 -> 125), cunku baglanti 70x44 olculdu. Taban BILINCLE yukseltildi —
 * yoksa siniflandirici ileride 16 kritik hedefi kaybetse bile kapi sessiz
 * kalirdi.
 *
 * TEK taban bilincli: gezinme kulvari cikis kodunu ETKILEMEZ, o yuzden ona
 * ayri bir taban koymak bakim borcu ekler ama hicbir fail-open kapatmaz —
 * ve kritik kume tum hedef nufusunun alt kumesi oldugu icin secicinin tumden
 * korlesmesi de bu tabanda gorunur. Gezinme nufusu yine de her koşumda
 * BASILIR (rapor yalan soylemesin diye), yalnizca esiklenmez.
 *
 * Sayfa/bolum bilerek SILINIRSE taban elle dusurulur.
 */
const BEKLENEN_KRITIK_HEDEF = 305;

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
const rotayiOlc = (ESIK_PX) => {
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

  // ---- 4) Dokunma hedefi — IKI KULVAR (TASK-3.08) -----------------------
  // Kritik kume kapiyi dusurur, gezinme kulvari yalnizca raporlanir.
  // Gerekcesi, siralamasi ve olcut secimleri dosya basliginda.
  const kritikKucuk = [];
  const gezinmeKucuk = [];
  let kritikNufus = 0;
  let gezinmeNufus = 0;
  let hedefEkranDisi = 0;
  let hedefGorunmez = 0;
  for (const el of document.querySelectorAll(
    'a, button, input, select, textarea, [role="tab"], [role="button"], summary',
  )) {
    const cs = getComputedStyle(el);
    if (cs.display === "contents") continue;
    const rc = el.getBoundingClientRect();
    // Kutusu yoksa render edilmemistir — `display:none` KENDISINDE ya da bir
    // ATASINDA olabilir; ata halini `getComputedStyle(el).display` GORMEZ
    // (kalitilmayan ozellik), geometri gorur.
    if (rc.width === 0 || rc.height === 0) continue;
    // sr-only atlama baglantisi (1x1 kirpilmis kutu) olcum disi.
    if (rc.width <= 2 && rc.height <= 2) continue;
    // BILINCLI EKRAN-DISI YUZEY: bal kupu (`input#website`, sol -9999, ata
    // `aria-hidden`). Olcut kalip degil BEYAN — TASK-3.07'nin tasma dalindaki
    // ile ayni. Muafiyet yazilmasaydi /demo yuzunden kalici bir kritik ihlal
    // dogardi; kimse onu "duzeltmeyecek", cunku tuzagin ekran disi olmasi
    // dogru tasarimdir.
    if (rc.right < 0 && el.closest('[aria-hidden="true"]')) { hedefEkranDisi++; continue; }
    // `visibility` KALITILIR, yani hesaplanmis deger ata zincirini tasir ve
    // tek cagri dogru cevabi verir. Bugun 0 eseliyor (olculdu: susgecli ve
    // susgecsiz sayim ayni, 622) — kutusu olan ama gorunmeyen hedef yok.
    if (cs.visibility !== "visible") { hedefGorunmez++; continue; }

    const tag = el.tagName.toLowerCase();
    const rol = el.getAttribute("role") || "";
    const href = el.getAttribute("href") || "";
    const inFooter = !!el.closest("footer");
    let sinif = null;
    if (tag === "button" || tag === "summary" || rol === "button") sinif = "buton";
    else if (tag === "input" || tag === "select" || tag === "textarea") sinif = "form alanı";
    else if (rol === "tab") sinif = "sekme";
    else if (tag === "a" && !inFooter && el.closest("header, nav")) sinif = "menü";
    else if (tag === "a" && (href === "/demo" || href.startsWith("https://wa.me") || href.startsWith("tel:")))
      sinif = "dönüşüm bağlantısı";

    const w = Math.round(rc.width);
    const h = Math.round(rc.height);
    const kucuk = rc.height < ESIK_PX || rc.width < ESIK_PX;
    // Erisilebilir ad benzersizlestirme ANAHTARIDIR; bos birakilirsa adsiz
    // kontroller (onay kutusu) duzeltme listesinde `""` diye gorunur ve
    // birbirine karisir. Geri dusus kimlik/ad niteligidir — tag'e dusmek
    // farkli kontrolleri tek satira toplardi.
    const ad =
      (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 34) ||
      `#${el.id || el.getAttribute("name") || el.getAttribute("type") || tag}`;

    if (sinif) {
      kritikNufus++;
      if (kucuk) kritikKucuk.push({ tag, ad, w, h, sinif });
    } else {
      gezinmeNufus++;
      // Alt kova yalnizca RAPOR icindir; ucu de cikis kodunun disindadir.
      const alt = inFooter ? "alt bilgi" : el.closest("p, li") ? "gövde metni" : "içerik yolu";
      if (kucuk) gezinmeKucuk.push({ tag, ad, w, h, sinif: alt });
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
    // Kritik liste TAM doner (benzersizlestirme rota-ustu yapilir); gezinme
    // listesi yalnizca ornekleme icin kirpilir.
    kritikKucuk, kritikNufus, gezinmeKucukCount: gezinmeKucuk.length,
    gezinmeOrnek: gezinmeKucuk.slice(0, 3), gezinmeNufus,
    gezinmeKovalari: gezinmeKucuk.reduce((a, g) => ((a[g.sinif] = (a[g.sinif] || 0) + 1), a), {}),
    hedefEkranDisi, hedefGorunmez,
    geom, sections, total: document.body.scrollHeight,
  };
};

const b = await chromium.launch();
const baslangic = Date.now();
let total = 0;
const kapsamSorunlari = [];
const ozet = [];

for (const W of GENISLIKLER) {
  console.log(`\n${"═".repeat(64)}\nGENİŞLİK ${W} px\n${"═".repeat(64)}`);
  let visited = 0, geomTotal = 0;
  let kirpmaTaranan = 0, kirpilanTotal = 0, enAgir = 0;
  const kovalar = { gizli: 0, hareketli: 0, kaydirilabilir: 0, dikeyYalniz: 0 };
  let seritNufus = 0, seritIhlal = 0, tabloMuafTotal = 0, ekranDisiMuafTotal = 0;
  // Dokunma hedefi — iki kulvar. `benzersiz` rota-ustu toplanir: ayni bilesen
  // 16 sayfada tekrarlaniyor ve duzeltme listesi ornek sayisiyla degil
  // BENZERSIZ kumeyle okunur (TASK-3.17'nin girdisi budur).
  let kritikNufusTotal = 0, kritikKucukTotal = 0;
  let gezinmeNufusTotal = 0, gezinmeKucukTotal = 0;
  let hedefEkranDisiTotal = 0, hedefGorunmezTotal = 0;
  const benzersiz = new Map();
  const gezinmeKovalari = {};
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
    const r = await p.evaluate(rotayiOlc, HEDEF_ESIK);
    const hScroll = r.docW > r.vw + 1;
    visited++;
    geomTotal += r.geom;
    kirpmaTaranan += r.kirpma.taranan;
    kirpilanTotal += r.kirpilanCount;
    for (const k of Object.keys(kovalar)) kovalar[k] += r.kirpma[k];
    seritNufus += r.seritSayisi;
    seritIhlal += r.seritCount;
    tabloMuafTotal += r.tabloMuaf;
    ekranDisiMuafTotal += r.ekranDisiMuaf;
    kritikNufusTotal += r.kritikNufus;
    kritikKucukTotal += r.kritikKucuk.length;
    gezinmeNufusTotal += r.gezinmeNufus;
    gezinmeKucukTotal += r.gezinmeKucukCount;
    hedefEkranDisiTotal += r.hedefEkranDisi;
    hedefGorunmezTotal += r.hedefGorunmez;
    for (const k of r.kritikKucuk) {
      const anahtar = `${k.tag}|${k.ad}`;
      let e = benzersiz.get(anahtar);
      if (!e) { e = { ...k, n: 0, rotalar: new Set(), olculer: new Set() }; benzersiz.set(anahtar, e); }
      e.n++; e.rotalar.add(path); e.olculer.add(`${k.w}×${k.h}`);
    }
    for (const [k, v] of Object.entries(r.gezinmeKovalari)) gezinmeKovalari[k] = (gezinmeKovalari[k] || 0) + v;
    enAgir = Math.max(enAgir, ...r.kirpilan.map((k) => k.px), 0);
    // CIKIS KODUNA yalnizca KRITIK kulvar girer. Gezinme kulvari asagida ayri
    // satirda raporlanir — tek cikis kodu, ayrisma raporda.
    total += (hScroll ? 1 : 0) + r.overflowCount + r.kritikKucuk.length + r.kirpilanCount + r.seritCount;

    console.log(`\n── ${path}  (${r.total}px)`);
    console.log(`   yatay kaydırma:${hScroll ? "VAR " + r.docW + ">" + r.vw : "yok"} · taşan eleman:${r.overflowCount} · kırpılmış metin:${r.kirpilanCount} · şerit ihlali:${r.seritCount} · kritik dokunma hedefi:${r.kritikKucuk.length}`);
    console.log(`   kritik hedef: ${r.kritikNufus} ölçüldü · ${r.kritikKucuk.length} eşik altı`);
    console.log(`   gezinme/içerik yolu: ${r.gezinmeNufus} ölçüldü · ${r.gezinmeKucukCount} eşik altı (raporlanır)`);
    console.log(`   ölçülen:${r.geom} eleman / ${r.kirpma.taranan} metin elemanı / ${r.kritikNufus + r.gezinmeNufus} dokunma hedefi / ${r.seritSayisi} kaydırılabilir kap`);
    console.log(`   muaf → ekran dışı beyanlı:${r.ekranDisiMuaf + r.hedefEkranDisi} · görsel gizli:${r.kirpma.gizli} · hareketli şerit:${r.kirpma.hareketli} · kaydırılabilir:${r.kirpma.kaydirilabilir} · dikey kırpma:${r.kirpma.dikeyYalniz} · iki boyutlu içerik:${r.tabloMuaf} · görünmez hedef:${r.hedefGorunmez}`);
    for (const o of r.overflow) console.log(`   ✗ taşma <${o.tag}> ${o.left}→${o.right}  ${o.cls}`);
    for (const k of r.kirpilan) console.log(`   ✗ [kırpma] ${k.px}px kesildi <${k.tag}> · kesen <${k.kesen}> — "${k.t}"`);
    for (const s of r.serit) console.log(`   ✗ [şerit] <${s.tag}> ${s.w}px > kabın görünür genişliği ${s.cw}px — "${s.t}"`);
    for (const s of r.kritikKucuk.slice(0, 6)) console.log(`   ✗ [hedef] ${s.w}×${s.h}px < ${HEDEF_ESIK} · ${s.sinif} <${s.tag}> — "${s.ad}"`);
    for (const s of r.gezinmeOrnek) console.log(`   · [gezinme] ${s.w}×${s.h}px · ${s.sinif} <${s.tag}> — "${s.ad}"  (raporlanır, düşürmez)`);
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
  if (kritikNufusTotal < BEKLENEN_KRITIK_HEDEF) {
    kapsamSorunlari.push(`${W}px: kritik dokunma hedefi ${kritikNufusTotal} ölçüldü < beklenen taban ${BEKLENEN_KRITIK_HEDEF} — sınıflandırıcı körleşmiş olabilir`);
  }

  console.log(`\nKAPSAM ${W}px: ${visited} rota · ${geomTotal} eleman · ${kirpmaTaranan} metin elemanı (taban ${BEKLENEN_METIN_ELEMANI}) · ${kritikNufusTotal + gezinmeNufusTotal} dokunma hedefi · ${seritNufus} kaydırılabilir kap (taban ${BEKLENEN_SERIT})`);
  console.log(`KIRPILMIŞ TAŞMA ${W}px: ${kirpilanTotal} gerçek · en ağır ${enAgir}px · muaf → görsel gizli:${kovalar.gizli} · hareketli şerit:${kovalar.hareketli} · kaydırılabilir:${kovalar.kaydirilabilir} · dikey:${kovalar.dikeyYalniz}`);
  console.log(`ŞERİT ${W}px: ${seritIhlal} ihlal · iki boyutlu içerik muafiyeti:${tabloMuafTotal}`);
  console.log(`EKRAN DIŞI BEYANLI MUAF ${W}px: ${ekranDisiMuafTotal + hedefEkranDisiTotal}`);

  // ---- Dokunma hedefi: iki kulvarin ayri ayri raporu --------------------
  // Olcut ciktiya yazilir (alt gorev 1): hedef KONTROLUN kendi kutusudur,
  // sarmalayan <label>'in tiklanabilir alani degil — onay kutusu bu yuzden
  // 18x18 olarak gorunur.
  const gezinmeDokumu = Object.entries(gezinmeKovalari).map(([k, v]) => `${k}:${v}`).join(" · ") || "yok";
  console.log(`\nDOKUNMA HEDEFİ ${W}px (eşik ${HEDEF_ESIK}×${HEDEF_ESIK} px · ölçülen kutu kontrolün kendisidir, sarmalayan <label> değil)`);
  console.log(`  kritik hedef: ${kritikNufusTotal} ölçüldü · ${kritikKucukTotal} eşik altı · ${benzersiz.size} benzersiz  (taban ${BEKLENEN_KRITIK_HEDEF})`);
  console.log(`  gezinme/içerik yolu: ${gezinmeNufusTotal} ölçüldü · ${gezinmeKucukTotal} eşik altı (raporlanır) → ${gezinmeDokumu}`);
  console.log(`  muaf → ekran dışı beyanlı:${hedefEkranDisiTotal} · görünmez:${hedefGorunmezTotal}`);
  if (benzersiz.size) {
    console.log(`  BENZERSİZ KRİTİK KÜME (düzeltme listesi):`);
    let i = 0;
    for (const e of [...benzersiz.values()].sort((a, b) => b.n - a.n)) {
      console.log(`   ${String(++i).padStart(2)}. ${[...e.olculer].join(",")} px · ${e.n} örnek / ${e.rotalar.size} rota · ${e.sinif} <${e.tag}> — "${e.ad}"`);
    }
  }
  ozet.push(`${W}px: kırpma ${kirpilanTotal} · şerit ${seritIhlal} · kritik hedef ${kritikKucukTotal}/${benzersiz.size} benzersiz`);
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
