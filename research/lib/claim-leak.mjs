/**
 * YASAKLI IDDIA SOZLUGU — TEK KAYNAK (B-018 / TASK-2.15).
 *
 * ## Ne yapar
 *
 * `docs/CLAIMS.md`'nin "Soylenemez" sutununu MAKINE OKUNUR hale getirir. Bugun
 * tek tuketicisi urun ekran goruntusu hatti (`render-product.mjs` ->
 * `screen-cleanup-v2.mjs` -> `auditTexts`); IKINCI tuketicisi M6 F6.4'un metin
 * sizinti denetimi olacak ve AYNI dosyayi okuyacak. Bu yuzden dosya
 * `research/lib/` altinda: olculmus kisit (PHASE-2 arastirmasi) arastirma
 * konteynerinin YALNIZ `research/`u gordugudur (`docker-compose.yml` ->
 * `./research:/work`), `web` konteyneri ise deponun tamamini gorur (`.:/app`).
 * Iki konteynerin ortak gordugu tek dizin burasi. `src/lib/` altina konsaydi
 * render hatti erisemezdi, iki kopya ise tanim geregi drift olurdu.
 *
 * ## AYRAC KURALI — bunu okumadan satir ekleme
 *
 * Yasak olan **projeksiyon / ustunluk / buyume kiyasi**; serbest olan **notr
 * gosterge degeri**. Urun ekrani ciro gosterir, doluluk yuzdesi gosterir — bu
 * urunun ISLEVIDIR, iddia degil. Olculdu (2026-09-23, yedi ekran 859 deger):
 * "ciro" 22 degerde, "doluluk" 15 degerde gecıyor ve neredeyse hepsi mesru.
 * Yani `₺` ya da `%` gormek tek basina sizinti DEGILDIR; sizintiyi yapan sey
 * yanindaki KIYAS ("gecen aya gore"), USTUNLUK ("en hizli") ya da PROJEKSIYON
 * ("artabilir") isaretidir. Kalipler bu yuzden isaretin kendisini arar.
 *
 * ## Neden harfe DUYARSIZ ve neden `/i` DEGIL
 *
 * Burada aranan sey kaynagin ozel adlari degil, BIZIM yazdigimiz duzyazi
 * kavramlardir (ad dalinin tersi — gerekcesi `screen-cleanup-v2.mjs` ->
 * "Neden harfe DUYARLI"). Duzyazi kavram rozette BUYUK harfle gecebilir.
 * Ama `/i` bayragi Turkce'de YETMEZ, olculdu (2026-09-23):
 *
 *   "EN HIZLI BÜYÜYEN ŞUBE"
 *     /en hızlı/i            -> KACIRDI   (I, ı ile kivrilmaz)
 *     .toLowerCase()         -> KACIRDI   ("en hizli")
 *     .toLocaleLowerCase(tr) -> ESLESTI   ("en hızlı")
 *
 * Bu yuzden karsilastirma once `trLower()` ile Turkce yerelde normalize edilir
 * ve TUM kaliplar kucuk harfle yazilir. Kalibina `/i` eklemek sessizce
 * fail-open olurdu.
 *
 * ## Yol haritasi kalemleri neden ELLE ve neden dusurme tablosundan TURETILMEZ
 *
 * Turetmek CEKICI ama DAIRESELDIR: kume `DROP_NODES`tan turetilseydi, bir
 * dusurme kurali tablodan cikarildigi gun onun BEKCISI de kaybolurdu — yani
 * korumasi gereken tek senaryoda hic calismazdi. TASK-2.13 bunu rakamla
 * olcmustu: uc dusurme birden kaldirildiginda denetim yalniz 1/3'unu goruyordu
 * ("Kampanyalar" tek sozcuk oldugu icin, "Yenileme & Churn" `&` kalibi bozdugu
 * icin kor). Buradaki liste tablodan BAGIMSIZ oldugu icin ucunu de gorur.
 * Bagimsizlik B-018'in kendi tesbitidir: "bagimsiz olmayan bir denetim,
 * denetim degil teyittir".
 *
 * Liste `src/content/product.ts` -> CAPABILITIES'ten OKUNAMAZ (arastirma
 * konteyneri `src/`i gormuyor, ayrica TypeScript) — bu kisit PHASE-2
 * arastirmasinda adiyla kayitli. Bayatlamayi onleyen kapi TEST katmanindadir:
 * `web` konteyneri ikisini birden gordugu icin `tests/iddia-metinleri.test.ts`
 * buradaki her yol-haritasi terimini CAPABILITIES'in `yolda`/`sonra`
 * kademesine karsi dogrular.
 *
 * ## B-044'un onerdigi ama BILINCLE ALINMAYAN iki kalip — olculmus gerekce
 *
 * B-044'un Koruma Onerisi sozluge sunlari da oneriyordu: `son N ay`,
 * `Açılış: …`, `Ekipte: …`. Alinmadi, cunku bunlar bir IDDIA sinifi degil bir
 * MAKULLUK sinifidir (pilot yeni ama ekran alti aylik gecmis gosteriyor) ve
 * CLAIMS'in "Soylenemez" sutununda karsiliklari yok. Olculdu (2026-09-23):
 * kalip alinsaydi finans ekraninin "Ciro Trendi · son 6 ay" eksen etiketi ve
 * uc ekrandaki "Haziran 2026" donem basligi kirmiziya duserdi — ucu de urunun
 * mesru rapor yuzeyi. Bu yuzden `Açılış: Şubat 2026 · 4 aylık` ve
 * `Ekipte: Mar 2023` bu kapinin DISINDA kalir ve [B-044]'te acik durur;
 * ayni sekilde avatar bas harfleri (`BŞ` · `TU` · `KA` · `DK` · `EÖ` · `BT` ·
 * `AK`) bu dosyanin degil AD dalinin ve `AVATAR_SELECTOR`in konusudur
 * (B-044 kalem 1 ve 2, bu fazin kapsam disi listesinde).
 *
 * ## Rakip adlari burada DURMAZ — olculmus gerekce
 *
 * CLAIMS "rakip adi sitede gecmez" der; ayni kural depoya da uzanir (M6 F6.4
 * edge case: "rakip adi repoda gecerse kendisi sizintidir"). Olculdu
 * (2026-09-23): satis dosyasindaki 18 gercek rakip urun adinin **0 tanesi**
 * demo kaynagında geciyor — bu hattin girdisi kendi urunumuzun demosudur, yani
 * sinifin bugun HIC GIRDISI YOK. Ayrica kaba bir ad listesi YANLIS ALARM
 * uretiyor: ayni tarama v2 `src/`inde bir "rakip adi" bildirdi, bakildi ve
 * siradan bir Turkce sozcuk cikti. Bu yuzden ne duz metin ne hash listesi
 * tutuluyor; slot adiyla burada durur ve mekanizma girdinin gercekten oldugu
 * yere — F6.4'un metin denetimine — birakildi (karar: `docs/DECISIONS.md`).
 */

/** Turkce yerelde kucult + bosluklari tekle. Kiyas HER ZAMAN bunun uzerinde yapilir. */
export function trLower(value) {
  return value.toLocaleLowerCase('tr').replace(/\s+/g, ' ').trim();
}

/**
 * Kalip kumesi. Her satir: hangi sinif, neden yasak, hangi kalip.
 * `sinif` degerleri CLAIMS.md'nin "Soylenemez" sutununun basliklaridir.
 */
export const CLAIM_LEAK = [
  // ── buyume kiyasi ──────────────────────────────────────────────────────
  {
    id: 'yuzde-delta',
    sinif: 'büyüme kıyası',
    neden: 'işaretli yüzde bir DEĞİŞİM oranıdır (+%34, -%3); CLAIMS "yüzde iyileşme" yasağı',
    re: /[+\-−]\s?%\s?\d/,
  },
  {
    id: 'donem-kiyasi',
    sinif: 'büyüme kıyası',
    neden: 'önceki döneme kıyas, iyileşme iddiasıdır',
    re: /geçen (ay|yıl)[ae] göre|önceki (ay|yıl)a göre/,
  },
  {
    id: 'buyume',
    sinif: 'büyüme kıyası',
    neden: '"büyüme / büyüyen" bir artış iddiasıdır (MoM satırı, "%34 büyümeyle")',
    re: /büyüme|büyüyen|büyüdü/,
  },
  {
    id: 'artis',
    sinif: 'büyüme kıyası',
    neden: '"artış" doğrudan iyileşme iddiası',
    re: /\bartış/,
  },

  // ── ustunluk ───────────────────────────────────────────────────────────
  {
    id: 'ustunluk-superlatifi',
    sinif: 'üstünlük',
    neden: 'performans üstünlüğü iddiası ("en hızlı", "en iyi = ●", "en yüksek")',
    re: /\ben (hızlı|iyi|yüksek|çok|büyük)\b/,
  },
  {
    id: 'rekor',
    sinif: 'üstünlük',
    neden: 'rekor/zirve söylemi',
    re: /\brekor|\bzirve\b/,
  },
  {
    id: 'lider',
    sinif: 'üstünlük',
    neden: 'liderlik iddiası',
    re: /\blider/,
  },
  {
    id: 'sira-rozeti',
    sinif: 'üstünlük',
    neden: 'sıralama rozeti ("1. ciro", "★ Şubede 1.") bir üstünlük gösterimidir',
    re: /\b\d+\.\s?(ciro|sıra)\b|şubede \d+\./,
  },
  {
    id: 'sadece-bizde',
    sinif: 'üstünlük',
    neden: 'CLAIMS: "sadece bizde" yasak — iki yerli rakipte de var',
    re: /(sadece|yalnızca|bir tek) biz(de|im)\b/,
  },
  {
    id: 'grubun-en',
    sinif: 'üstünlük',
    neden: 'grup içi üstünlük kıyası ("grubun en hızlısı")',
    re: /\bgrubun en\b/,
  },

  // ── projeksiyon ────────────────────────────────────────────────────────
  {
    id: 'projeksiyon-fiili',
    sinif: 'ROI / projeksiyon',
    neden: 'gelecek vaadi ("artabilir", "kazanırsınız"); CLAIMS: ROI yasak',
    re: /\b(artab|artar|ulaşab|çıkab|kazanab|kazanırsınız|kazandırır|getirir)/,
  },
  {
    id: 'kosullu-projeksiyon',
    sinif: 'ROI / projeksiyon',
    neden: 'koşullu vaat ("… optimize edilirse hedef %82"); sonuç taahhüdü',
    re: /edilirse\b|ederseniz\b|yaparsanız\b|uygularsanız\b/,
  },
  {
    id: 'tahmini-tutar',
    sinif: 'ROI / projeksiyon',
    neden: 'yaklaşık işaretli para tutarı bir tahmindir ("~₺110B/ay")',
    re: /[~≈]\s*₺/,
  },

  // ── musteri / uye sayisi ovgusu ────────────────────────────────────────
  {
    id: 'uye-sayisi-basarisi',
    sinif: 'müşteri sayısı',
    neden: 'sayıyı BAŞARI olarak sunmak ("227 üyeye ulaştı"); nötr "842 Aktif Üye" serbest',
    re: /\d+\s*(üyeye|müşteriye|kulübe|salona) ulaş/,
  },
  {
    id: 'kullanici-ovgusu',
    sinif: 'müşteri sayısı',
    neden: 'CLAIMS: "X kulüp kullanıyor" yasak',
    re: /\d+\s*(kulüp|salon|stüdyo|işletme)\s*(kullan|tercih)|\bmüşterilerimiz/,
  },

  // ── pilot siniri ───────────────────────────────────────────────────────
  {
    id: 'pilot-siniri',
    sinif: 'pilot aşaması',
    neden: 'CLAIMS: "sahada kullanılıyor / canlıda" denemez — pilot sonucu çıkmadı',
    re: /\bsahada kullan|\bcanlıda\b|\bcanlı kullanım|\byaygın olarak kullan/,
  },

  // ── urunun BUGUN tasimadigi kalemler ───────────────────────────────────
  // Bu satirlar dusurme tablosundan BAGIMSIZDIR (dosya basligi -> "dairesel"
  // gerekcesi) ve TAM OLCULMUSTUR: bugunku 859 degerde dordunun de vurusu 0,
  // cunku hat onlari dusuruyor. Bir dusurme kurali sessizce kalkarsa bu
  // satirlar URETIMI DURDURUR.
  {
    id: 'yol-haritasi-kampanya',
    sinif: 'yol haritası kalemi',
    neden: 'kampanya modülü CAPABILITIES.yolda — ürün bugün taşımıyor',
    re: /\bkampanya/,
  },
  {
    id: 'yol-haritasi-churn',
    sinif: 'yol haritası kalemi',
    neden: 'churn/risk paneli CAPABILITIES.yolda',
    re: /\bchurn\b/,
  },
  {
    id: 'yol-haritasi-ogrenci-tutma',
    sinif: 'yol haritası kalemi',
    neden: '"öğrenci tutma" tüm ürün kod tabanında 0 kez geçiyor (TASK-2.12); kalem v1.5\'te',
    // Kalip B-044'un kendi envanterine karsi olculerek genisletildi: yalniz
    // "ogrenci tutma" aransaydi ayni kartin "%91 3 aylik tutma" gövdesi KOR
    // kalirdi (olculdu 2026-09-23 — dizge sondasi). Uc yazimin da bugunku
    // kutlede yanlis alarmi 0 ("tutma" tum 859 degerde yalniz bu cumlede gecer).
    re: /öğrenci tutma|tutma oranı|\d+ aylık tutma/,
  },
  {
    id: 'yol-haritasi-sms',
    sinif: 'yol haritası kalemi',
    neden: 'ürünün SMS ucu yok; v1 sitesi bu iddiayı TASK-14.04\'te düşürmüştü',
    re: /\bsms\b/,
  },
];

/**
 * ALT SINIR — bos kapsam kapisi (emsal: `screen-cleanup-v2.mjs` ->
 * MIN_FORBIDDEN_PARTS, v1 -> MIN_SINGLE_SOURCE_CONSUMERS).
 * Sozluk bosalirsa ya da budanirsa denetim HICBIR SEYE bakmadan yesil kosar.
 * Bugunku deger: 20 kalip.
 */
export const MIN_CLAIM_PATTERNS = 16;

if (CLAIM_LEAK.length < MIN_CLAIM_PATTERNS) {
  throw new Error(
    `[claim-leak] sözlük çöktü — ${CLAIM_LEAK.length}/${MIN_CLAIM_PATTERNS} kalıp. ` +
      `Denetim kapsamsız koşmaz.`,
  );
}

/**
 * Saf karar fonksiyonu: bir metin degeri hangi yasakli kaliplara takiliyor.
 * @param {string} value ham metin degeri (normalize icerde yapilir)
 * @returns {{id: string, sinif: string, hit: string}[]}
 */
export function claimLeaks(value) {
  const norm = trLower(value);
  const out = [];
  for (const kalip of CLAIM_LEAK) {
    const m = norm.match(kalip.re);
    if (m) out.push({ id: kalip.id, sinif: kalip.sinif, hit: m[0] });
  }
  return out;
}
