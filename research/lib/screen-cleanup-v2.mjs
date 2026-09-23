/**
 * v2 UZANTISI — v1'in temizlik tablosu (screen-cleanup.mjs) BIREBIR korunur, uzerine
 * yalnizca v2'de YENI acilan ekranlarin (grup, sube) ihtiyaci eklenir.
 *
 * Neden ayri dosya: v1'in tablosu olculmus bir ust kumedir ve dosya basligi onun
 * gerekcesini tasiyor. Govdesini duzenlemek o provenansi bulandirirdi. Burada
 * eklenen her satirin gerekcesi kendi yaninda durur.
 */
import {
  REPLACEMENTS as V1_REPLACEMENTS,
  INITIALS as V1_INITIALS,
  AVATAR_SELECTOR,
  DROP_NODES as V1_DROP_NODES,
  AUDIT_ALLOW as V1_AUDIT_ALLOW,
  BRAND_LEAK,
} from './screen-cleanup.mjs';

/** grup.html ve sube.html'de gecen, v1 tablosunda olmayan gercek sporcu adlari. */
const V2_REPLACEMENTS = [
  // grup.html
  ['Ferdi Kadıoğlu', 'Deniz A.'],
  ['Şehmus Hazer', 'Tolga B.'],
  ['Ferdi K.', 'Deniz A.'],
  ['Şehmus H.', 'Tolga B.'],
  // sube.html — antrenor kadrosu tam adla yaziliydi
  ['Melissa Vargas', 'Ege K.'],
  ['Hande Baladın', 'Nihan T.'],
  ['Cansu Özbay', 'Tuğçe A.'],
  ['İlkin Aydın', 'Berk S.'],
  ['Gizem Örge', 'Yasemin U.'],
  ['Simge Aköz', 'Cüneyt V.'],

  /**
   * B-018 / TASK-2.13 — TAM AD kaliginin DISINDA kalan iki gecis sinifi.
   * Yukaridaki eslemeler tam adi biliyordu; kaynak metinde ad CIPLAK ILK AD ya
   * da KISALTILMIS halde geciyor ve o yuzden hicbiri tutmuyordu:
   *   grup.html:209,564  "Gizem Ö. · 17:00 · 60 dk"   → ana sayfada render ediliyor
   *   sube.html:481      "… Simge & Gizem hocalarin …" → & araya girdigi icin tam ad degil
   * Hedef adlar yukaridaki tam-ad eslemeleriyle AYNI secildi (Gizem→Yasemin,
   * Simge→Cüneyt), yoksa ayni kisi iki karede iki ayri nötr ad alirdi.
   *
   * SIRA TUZAGI — bu satirlar YALNIZ uzundan kisaya uygulama sayesinde guvenli:
   * 'Gizem' kurali 'Gizem Örge'den ONCE kosarsa sonuc "Yasemin Örge" olur.
   * Sirayi uretim ani garanti ediyor (render-product.mjs → reps.sort uzunluga
   * gore azalan), tablo sirasi degil — bu yuzden buraya sona yazilmalari bir
   * tercih degil, sadece okunurluk.
   *
   * INITIALS'e satir GEREKMEDI (olculdu): 'GÖ' → 'YU' ve 'SA' → 'CV' zaten
   * asagidaki tabloda. sube.html:348,363 bu avatarlari .av-sm ile tasiyor,
   * grup.html:209'daki kartta ise ada bitisik avatar yok.
   */
  ['Gizem Ö.', 'Yasemin U.'],
  ['Gizem', 'Yasemin'],
  ['Simge', 'Cüneyt'],
];

export const REPLACEMENTS = [...V1_REPLACEMENTS, ...V2_REPLACEMENTS];
export const INITIALS = [
  ...V1_INITIALS,
  ['FK', 'DA'], ['ŞH', 'TB'],
  ['MV', 'EK'], ['HB', 'NT'], ['CÖ', 'TA'], ['İA', 'BS'], ['GÖ', 'YU'], ['SA', 'CV'],
];
export { AVATAR_SELECTOR, BRAND_LEAK };

/**
 * ORTAK KABUK DUSURME — ekran basina degil, BIR KEZ yazilir ve her ekrana
 * uygulanir (cagiran `DROP_NODES[screen.id]`in onune ekler).
 *
 * "Kampanyalar" sol menu girdisi urunun BUGUN tasimadigi bir kalemdir:
 * karsiligi v1.5'te ve site onu /ozellikler'in "Yolda" kolonunda gosteriyor
 * (`src/content/product.ts` → CAPABILITIES.yolda). Kaynak demoda `kampanya.html`
 * zaten bilincle hattan disarida (README → "Urun gorselleri neden bir hattan
 * geciyor"), ama ona GIDEN menu girdisi her karede duruyordu.
 *
 * Neden ekran basina DEGIL: girdi kaynak HTML'lerin ORTAK kabugunda, her birinde
 * bir kez (olculdu 2026-09-23: cockpit · takvim · grup · finans · antrenor ·
 * raporlar → `grep -c` her birinde 1, hepsi `<a class="nav" href="kampanya.html">`).
 * Ekran basina tekrarlamak ayni kurali alti kez yazmak ve birini unutunca sessizce
 * kacirmak demekti.
 *
 * 'uye-telefon' ayni `takvim.html` belgesinden uretilir; menu `.phone` kokunun
 * disinda kaldigi icin cikti goruntude zaten yok — ama dusurmek denetimin gordugu
 * kutleyi de temizler. Bu, ayni belge cifti icin asagida kurulan SMS karti
 * emsalinin birebir aynisi, yeni bir desen degil.
 *
 * Cagiranin "her girdi TAM BIR dugum esler" sozlesmesi burada da gecerli: bir
 * ekranda girdi 0 ya da 2 cikarsa URETIM DURUR. Capa REPLACEMENTS'tan once okunur
 * ve "Kampanyalar" hicbir esleme tarafindan degistirilmiyor.
 */
export const SHELL_DROP_NODES = [['a.nav', 'Kampanyalar']];

export const DROP_NODES = {
  ...V1_DROP_NODES,
  /**
   * v1'in antrenor listesine DORDUNCU kart: "Ogrenci Tutma" (B-018, TASK-2.13).
   * Kart `%91` + "3 aylik tutma" + "Subede en yuksek ogrenci tutma orani"
   * gosteriyor; TASK-2.12 olctu ki "ogrenci tutma" TUM urun kod tabaninda
   * **0** kez geciyor ve urunun kanonik surum haritasi kalemi adiyla erteliyor
   * (`../Alpfit.v1/_dev/PRD/VERSIONS.md` → "Antrenor performansi — ogrenci tutma
   * gostergesi … kalemi v1.5'e tasidi"). Yani kart, yanindaki iki kardesiyle
   * (Haftalik Doluluk · Ciro Kirilimi) tam ayni sinifta: urunun karsilamadigi
   * iddia. O ikisi TASK-14.06'da dusuruldu, bu ucuncusu kalibin disinda kalmisti
   * cunku denetimin iddia dali HIC yok (B-044 kalem 3).
   * Ayni kartin ustundeki "★ Subede 1." rozeti ve "Ekipte: Mar 2023" B-044'te
   * kalir — bu fazin kapsami disinda (PHASE-2 → Kapsam Disi).
   */
  antrenor: [...V1_DROP_NODES.antrenor, ['.detgrid .card', 'Öğrenci Tutma']],
  /**
   * raporlar.html:242 `<h4>Yenileme &amp; Churn</h4>` — rapor sablonu karti.
   * "churn.html" demo sayfasi zaten bilincle hattan disarida (v1.5 kalemi);
   * ona giden SABLON KARTI duruyordu. Tek yerde, tek kart (olculdu).
   * Secici `.repgrid .rep` YAPISALDIR: `nth-child` degil, cunku kaynaga bir
   * sablon eklendigi gun sira kayar (v1 tablosunun kendi kurali).
   */
  raporlar: [['.repgrid .rep', 'Yenileme & Churn']],
  /**
   * takvim.html sag rayindaki bilgi karti "18:00'de SMS + push gider" diyor.
   * Urunun SMS ucu YOK ve v1 sitesi bu iddiayi zaten fiyat sayfasindan
   * dusurmustu (TASK-14.04). Kirpma capasi (.calwrap alti) bu karti
   * kesmiyordu, cunku sag ray takvim izgarasindan asagi tasiyor.
   * Ayni belge uye-telefon ekranini da uretiyor; orada klip disinda kalsa da
   * dusurmek denetimin gordugu kutleyi de temizliyor.
   */
  takvim: [['.card', 'Otomatik hatırlatma açık.']],
  'uye-telefon': [['.card', 'Otomatik hatırlatma açık.']],
};

/**
 * Ortak kabuk etiketleri — her ekranda ayni sol menu ve ust bar var.
 * v1 bunlari her ekran icin tek tek yaziyordu; tekrari tek yere aliyoruz.
 */
const SHELL = ['Alpfit Plus', 'Genel Bakış', 'Grup Dersleri', 'Sahil Müdürü', 'Ana Sayfa', 'Tüm Şubeler'];

export const AUDIT_ALLOW = {
  ...V1_AUDIT_ALLOW,
  /**
   * 'Öğrenci Tutma' satiri OLDU: kart artik `DROP_NODES.antrenor` ile DOM'dan
   * kalkiyor, yani denetimin gordugu kutlede hic yok. v1 tablosunun kendi kurali
   * bunu emrediyor ("Haftalik Doluluk ve Ciro Kirilimi satirlari TASK-14.06'da
   * OLDU ve silindi … Olu satiri birakmak listeyi korelten siniftir").
   *
   * Satir KOPYALANMADI, v1'den TURETILDI — v1'in govdesi duzenlenmez ve elle
   * yazilmis bir kopya ilk v1 degisiminde sessizce ayrisirdi.
   *
   * Yan etki BILINCLIDIR ve istenen sey: 'Öğrenci Tutma' ad kalibina uyuyor
   * (iki buyuk-harfle baslayan sozcuk). Izin satiri gidince dusurme sessizce
   * basarisiz olursa denetim o tamlamayi ad sizintisi olarak raporlar ve
   * URETIM DURUR. Yani dusurme kendi kendini dogrulayan bir kapiya donusur.
   */
  antrenor: V1_AUDIT_ALLOW.antrenor.filter((t) => t !== 'Öğrenci Tutma'),
  /**
   * grup.html — kapi ONCE bos listeyle kosuldu, raporladigi 12 tamlamanin her biri
   * kaynakta arandi. Iki tanesi gercek sporcu adiydi ve REPLACEMENTS'a tasindi;
   * kalan onu etiket, baslik veya buton adidir, kisi adi tasiyan yok.
   */
  grup: [
    ...SHELL,
    'Ders Tanımla',        // topbar butonu
    'Reformer Pilates',    // ders adi
    'Yoklamayı Kaydet',    // buton
    'Doluluk Raporu',      // kart basligi
    'Bekleme Listesine',   // "Bekleme Listesine Al" butonu
  ],
  /**
   * sube.html — ayni yontem. Kapinin raporladigi 16 tamlamadan ALTISI gercek
   * sporcu adiydi ve REPLACEMENTS'a tasindi; kalanlar kart basligi ve etikettir.
   */
  sube: [
    ...SHELL,
    'Şube Detayı',      // sayfa basligi
    'Şube Raporu',      // topbar butonu
    'Aylık Ciro',       // KPI etiketi
    'Aktif Üye',        // KPI etiketi
    'Gelir Kırılımı',   // kart basligi
    'Hedefe İlerleme',  // kart basligi
  ],
};

/**
 * YASAKLI AD KUMESI — TABLODAN TURER, KALIPTAN DEGIL (B-018 / TASK-2.14).
 *
 * Kok neden olculmustu: denetim temizligin KENDI varsayimini paylasiyordu
 * (ad = iki tam sozcuk), yani temizligin kacirdigini yapisal olarak goremiyordu
 * — "bagimsiz olmayan bir denetim, denetim degil teyittir". Kalibi genisletmek
 * (secenek a) reddedildi: kalibi buyutmek korlugu tasir, kaldirmaz. Tablo
 * kaynagin gercegidir, regex bir tahmindir (PHASE-2 → Degerlendirilen
 * Yaklasimlar #2).
 *
 * KURAL: yasakli kume REPLACEMENTS/INITIALS'in **KAYNAK** tarafindan turetilir
 * — tabloya yeni satir girdigi gun denetim kendiliginden buyur, elle yazilmis
 * hicbir ad listesi yoktur.
 *
 * ## Neden HEDEF tarafi cikariliyor
 *
 * Tablonun hedef tarafi, temizligin BILEREK yazdigi seydir; denetim kendi
 * ciktisini sizinti sayamaz. Cikarma olculdu (2026-09-23) ve bes parca dusuyor:
 *   'Plus' · 'PLUS' · 'plus'  ← 'Weekend Plus' kaynagindan gelir ama hedef
 *                                'Alpfit Plus'in da parcasidir (izin listesinde
 *                                de oyle durur) — cikarilmasaydi yedi ekranin
 *                                yedisi birden kirmizi olurdu
 *   'Zehra'                   ← ['Zehra Güneş','Zehra G.'] — ilk ad BILINCLE
 *                                korunmus, soyadi kisaltilmis
 *   'Cansu'                   ← kaynakta 'Cansu Özbay', hedefte 'Cansu E.'
 * Ayni kural bas harflerde 'EK'i dusurur: kaynak tarafinda Ebrar Karakurt'un
 * bas harfi, hedef tarafinda ['MV','EK'] ile Ege K.'nin bas harfi. Iki harfli
 * bir jeton tanim geregi belirsizdir (B-044 kalem 3 bunu adiyla yaziyor) ve
 * OLCULDU (2026-09-23): takvim.html:166 `<span class="av">EK</span>` tam da
 * `<span class="nm">Melissa V.</span>` (→ "Ege K.") yanindadir, yani oradaki
 * EK bir sizinti degil hedefin kendi bas harfidir. Cikarma dogru sonucu verdi.
 *
 * ## Neden >= 3 harf
 *
 * Kisaltilmis satirlar ('Ebrar K.', 'Cansu Ö.') ikinci parca olarak tek harf +
 * nokta birakir; 'K.' yasaklansa 'Deniz K.' · 'Ege K.' gibi NOTR hedef adlarin
 * hepsi kirmizi olurdu. Esik parcanin kendi uzunlugudur, isim degil.
 *
 * ## Neden harfe DUYARLI
 *
 * Kucuk-harfe indirgeme olculdu (2026-09-23): 45 parcalik bir kume uretiyor ve
 * bugunku yedi ekranda **0 ek vurus** getiriyor — yani bedava degil, bedelsiz
 * de degil: kumeye 'ilkin' · 'aydın' · 'arda' · 'hande' · 'salih' gibi siradan
 * Turkce sozcukler girer ve ileride yanlis alarm uretir. Tablo zaten gereken
 * buyuk/kucuk varyantlari SATIR OLARAK tasiyor (marka 6, semt 6) — yani case
 * bilgisi tablonun kendi gercegidir. (Ters yondeki ders — "grep harfe
 * duyarlidir, B-040'in altinci cumlesini bu yuzden kacirdi" — orada aranan sey
 * bizim yazdigimiz DUZYAZI bir kavramdi; burada aranan, kaynagin kendi ozel
 * adlaridir ve tablo varyantlari sayiyor.) Kucuk harfli bir sizinti gozlenirse
 * care satiri tabloya eklemektir, kurali genisletmek degil.
 *
 * ## Alt siniri neden var (bos kapsam)
 *
 * Kapsamini bir tablodan tureten kapi, tablo boslaninca HICBIR SEYE bakmadan
 * yesil kosar. Alt sinir v1'in kendi `MIN_SINGLE_SOURCE_CONSUMERS` emsalidir:
 * kume olculen degerin belirgin altina duserse denetim kapsamsiz kosmaz, HATA
 * verir. Bugunku degerler: parca 52, bas harfi 13.
 */
export const MIN_FORBIDDEN_PARTS = 40;
export const MIN_FORBIDDEN_INITIALS = 10;

/** Bir tablo dizesini ad PARCALARINA ayirir: bosluk/`&`/virgul ile bol, kenar
 *  noktalamayi soy, >= 3 harfli olanlari tut. `&` ozellikle ayrilir — "Simge &
 *  Gizem" kaliba uymayan gecis sinifinin ta kendisiydi. */
function nameParts(value) {
  return value
    .split(/[\s&,/]+/)
    .map((word) => word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, ''))
    .filter((word) => word.length >= 3);
}

/**
 * Saf turetme — sentetik tabloyla sinanabilir olsun diye disaridan tablo alir.
 * @param {[string,string][]} replacements
 * @param {[string,string][]} initials
 * @returns {{ parts: string[], tokens: string[] }}
 */
export function deriveForbidden(replacements, initials) {
  const source = new Set();
  const target = new Set();
  for (const [from, to] of replacements) {
    for (const part of nameParts(from)) source.add(part);
    for (const part of nameParts(to)) target.add(part);
  }
  const parts = [...source].filter((part) => !target.has(part));

  const initialSource = new Set();
  const initialTarget = new Set();
  for (const [from, to] of initials) {
    if (from !== to) initialSource.add(from);
    initialTarget.add(to);
  }
  const tokens = [...initialSource].filter((token) => !initialTarget.has(token));

  if (parts.length < MIN_FORBIDDEN_PARTS || tokens.length < MIN_FORBIDDEN_INITIALS) {
    throw new Error(
      `[screen-cleanup] yasaklı küme çöktü — parça ${parts.length}/${MIN_FORBIDDEN_PARTS}, ` +
        `baş harf ${tokens.length}/${MIN_FORBIDDEN_INITIALS}. Tablo boşalmış ya da hedef ` +
        `tarafı kaynağı yutmuş olabilir; denetim kapsamsız koşmaz.`,
    );
  }
  return { parts, tokens };
}

export const FORBIDDEN = deriveForbidden(REPLACEMENTS, INITIALS);

/**
 * v1'in `auditTexts`'i kendi modul kapsamindaki AUDIT_ALLOW'u kapatir, yani
 * buradaki genisletilmis listeyi GOREMEZ. Karar fonksiyonu bu yuzden burada
 * yeniden yazildi; saflik korunuyor (girdi metin degerleri + ekran id'si).
 *
 * UC DAL, ve ucuncusu BILINCLE korundu:
 *
 *  1. TABLO — yasakli ad parcalari (birincil). Alt dize aranir, cunku sizinti
 *     cogu zaman bir tamlamanin ICINDE gecer ("… Simge & Gizem hocalarin …").
 *  2. TABLO — avatar bas harfleri (birincil). Burada alt dize DEGIL, TAM JETON
 *     aranir: iki harfli bir dizi sayfanin her yerinde gecer ('SA' ⊂ 'SAHİL',
 *     yani hedef adin kendisi) ve alt dize aramasi kapiyi kullanilamaz kilardi.
 *     Avatar metni kendi dugumunde tek basina durur, tam jeton dogru olcudur.
 *  3. KALIP — iki tam sozcuk (IKINCIL, kaba ag). Kaldirilmadi cunku tabloya
 *     HIC girmemis bir adi yalniz bu dal gorebilir; ustelik TASK-2.13'un kendi
 *     kendini dogrulayan kapisi buna dayaniyor ("Öğrenci Tutma" izin satiri
 *     tablodan turetilerek cikarildi, dusurme sessizce basarisiz olursa bu dal
 *     onu ad sizintisi sayip URETIMI DURDURUYOR — sondayla olculdu). Kaldirmak
 *     o kapiyi sessizce sokerdi. AUDIT_ALLOW bu yuzden rolunu korur.
 *
 * AUDIT_ALLOW yalnizca 3. dali kapatir — 1 ve 2 icin izin YOK ve bu bilinclidir:
 * izin listesi elle yazilmis MASUM TAMLAMA listesidir, tablo ise kaynagin
 * gercegi. Tablodan gelen bir vurus yanlis alarmsa care izin satiri eklemek
 * degil TABLOYU duzeltmektir (yanlis eslemeyi cikarmak ya da hedefi degistirmek).
 * Bugunku olcum: yedi ekran, 859 metin degeri, tablo dallarindan **0 vurus**.
 */
export function auditTexts(values, screenId) {
  const full = /[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}/g;
  const allowed = new Set(AUDIT_ALLOW[screenId] ?? []);
  const forbiddenTokens = new Set(FORBIDDEN.tokens);
  const names = new Set();
  const brands = new Set();
  for (const value of values) {
    // 1) Tablo — ad parcasi
    for (const part of FORBIDDEN.parts) {
      if (value.includes(part)) {
        names.add(`«${part}» ⊂ "${value.trim().replace(/\s+/g, ' ').slice(0, 60)}"`);
      }
    }
    // 2) Tablo — avatar bas harfi (tam jeton)
    const token = value.trim();
    if (forbiddenTokens.has(token)) names.add(`«${token}» (avatar baş harfi)`);
    // 3) Kalip — kaba ag; yalniz bu dal izin listesine tabidir
    for (const m of value.matchAll(full)) {
      const label = m[0].replace(/\s+/g, ' ');
      if (!allowed.has(label)) names.add(label);
    }
    if (BRAND_LEAK.test(value)) brands.add(value.trim().slice(0, 80));
  }
  return { names: [...names], brands: [...brands] };
}
