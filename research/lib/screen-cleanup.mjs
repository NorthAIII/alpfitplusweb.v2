/**
 * Ürün ekranı temizlik tablosu + denetimin KARAR fonksiyonu — Faz 12 / TASK-12.03 (A6 · T10).
 *
 * Neden var: aynı tablo iki bağımsız üretim hattında yaşıyordu (`scripts/build-assets.mjs` ve
 * `instagram/ig-render/screens.mjs`) ve ayrışması **çoktan başlamıştı** — TASK-10.09 site
 * tarafına üç boşluksuz marka satırı ekledi, IG tarafı onları almadı ve `muhasebe@weekendplus…`
 * biçimini ne değiştiriyor ne görüyordu. Faz 10 birleştirmeyi bilinçle elemişti (T4); gerekçesi
 * `theme.mjs`'in bayat token kopyasıydı ve TASK-12.01 o gerekçeyi düşürdü (K10).
 *
 * ## Birleştirmenin YÖNÜ varsayılmadı, ölçüldü (faz araştırması → A6)
 *
 * Beş ekran aynı DOM üzerinde iki tabloyla yan yana koşuldu: `REPLACEMENTS` site **37** ↔ IG
 * **32**, yalnız sitede **5** satır, **yalnız IG'de olan hiçbir şey yok**; `INITIALS` 7 ↔ 7,
 * fark **0**. Allow tarafında sitede **0**, IG'nin düz havuzunda **4 ölü girdi**. Yani site üst
 * kümedir ve bu dosyanın gövdesi onun **birebir** taşınmış hâlidir
 * (`memory/guvence-testi-kirilabilirlik-kanidi.md` → *iki uygulama "bugün eşdeğer" varsayılmadan
 * birleştirilmez; üst küme seçilir, gövdesi korunur*). Satır sadeleştirme / yeniden sıralama /
 * "aynı şeyi anlatan iki satırı tekle" refleksi burada YASAK: uzun eşleşmelerin önce
 * uygulanması (`sort((a, b) => b[0].length - a[0].length)`) davranışın parçasıdır.
 *
 * ## DOM yürüyüşü çağıranda, KARAR burada
 *
 * Metin düğümlerinin bulunması ve değiştirilmesi tarayıcı bağlamı ister; sınıflandırma istemez.
 * Bu yüzden çağıran `page.evaluate` içinde düğümleri yürütüp **değiştirilmiş metin değerlerini**
 * döndürür, karar `auditTexts()` ile Node'da koşar. Kazanç ölçülebilirliktir: sınıflandırıcı
 * çöktüğünde *"temiz"* bedava doğrudur ve o dalın gözlemcisi ancak saf bir fonksiyona sentetik
 * girdi verilerek kurulabilir (`tests/server/screen-pipeline.spec.ts` → (pozitif kontrol)).
 *
 * ## İKİ tüketicisi var ve kapı ikisini birden iddia eder
 *
 * `scripts/build-assets.mjs` (TASK-12.03) ve `instagram/ig-render/screens.mjs` (TASK-12.04 —
 * o turda IG kendi kopyasını bıraktı, yani buranın *"bugün tek tüketici"* sınırı **kapandı**).
 * `tests/server/screen-pipeline.spec.ts` → (tek kaynak) ikisini birden tarar ve listenin
 * **kendisi** de gate'lidir (`MIN_SINGLE_SOURCE_CONSUMERS = 2`): liste tek hatta düşerse
 * (tek kaynak) bedava yeşil koşar, çünkü düşen hat artık hiç taranmaz (TASK-12.04'te ölçüldü).
 *
 * Dosya `scripts/lib/`tedir çünkü site tarafı birincildir ve `ig-render` ondan **okur** (T10 —
 * M6'nın tek yönlü bağ emsali; ters yön M6'nın sınırını çiğnerdi). Yol İZLENEN olmak zorunda:
 * `tests/server/repo-tracking.spec.ts` → `REQUIRED_TRACKED` onu adıyla tutuyor, yoksa taze
 * klonda iki hat da ölür.
 */

/**
 * Metin düzeltmeleri — üst küme (dosya başlığı → A6); kaynağı `screens.mjs`'in tablosuydu.
 * Sıra önemli değil: uygulama sırasında uzundan kısaya sıralanıyor, böylece
 * "Ebrar Karakurt" hiçbir zaman "Ebrar K." kuralına yakalanmaz.
 *
 * KURAL: hiçbir karede tam soyadı ve gerçek semt adı kalmayacak.
 */
export const REPLACEMENTS = [
  // Marka — BOŞLUKSUZ ve KÜÇÜK HARFLİ biçimler ayrıca yazılı: `raporlar.html` içindeki
  // `muhasebe@weekendplus…` yalnız bu satırlarla yakalanıyor (araştırma T4'te ölçüldü;
  // eski tabloda yoktu ve denetim de göremiyordu).
  ['Weekend Plus', 'Alpfit Plus'],
  ['WEEKEND PLUS', 'ALPFIT PLUS'],
  ['weekend plus', 'alpfit plus'],
  ['WeekendPlus', 'AlpfitPlus'],
  ['Weekendplus', 'Alpfitplus'],
  ['weekendplus', 'alpfitplus'],

  // Şubeler — NÖTR adlar (gerçek pilot şubelerini ifşa etmemek için semt adı
  // kullanmıyoruz; jenerik "Merkez/Sahil/Vadi" hiçbir kulüple eşleşmez).
  ['Tuzla', 'Merkez'],
  ['Kadıköy', 'Sahil'],
  ['Beşiktaş', 'Vadi'],
  ['TUZLA', 'MERKEZ'],
  ['KADIKÖY', 'SAHİL'],
  ['BEŞİKTAŞ', 'VADİ'],

  // Tam adlar → kısaltılmış (baş harfleri INITIALS ile senkron tutun)
  ['Ebrar Karakurt', 'Sefa Y.'],
  ['Arda Güler', 'Selin Y.'],
  ['Kenan Yıldız', 'Burak Ş.'],
  ['Alperen Şengün', 'Mert A.'],
  ['Cedi Osman', 'Deniz K.'],
  ['Hakan Çalhanoğlu', 'Ayşe T.'],
  ['Zehra Güneş', 'Zehra G.'],
  ['Orkun Kökçü', 'Cansu E.'],
  ['Furkan Korkmaz', 'Tolga B.'],
  ['Kerem Aktürkoğlu', 'Merve A.'],
  ['Yusuf Yazıcı', 'Onur Ç.'],

  // Zaten kısaltılmış ama tanınır sporcu adları → nötr
  ['Ebrar K.', 'Sefa Y.'],
  ['Melissa V.', 'Ege K.'],
  ['Cansu Ö.', 'Tuğçe A.'],
  ['Simge A.', 'Cüneyt V.'],
  ['Meliha D.', 'Aslıhan A.'],
  ['Kenan Y.', 'Deniz K.'],
  ['Arda G.', 'Selin Y.'],
  ['Cedi O.', 'Kaan B.'],
  ['Hakan Ç.', 'Ayşe T.'],
  ['Uğurcan Ç.', 'Mert A.'],
  ['Salih Ö.', 'Ozan M.'],
  ['Alperen Ş.', 'Elif D.'],
  ['Çağlar S.', 'Burak Ş.'],
  ['Kenan S.', 'Pelin A.'],
];

/**
 * Avatar baş harfleri ayrı düğümlerde duruyor; ad değişince onlar da değişmeli,
 * yoksa "EK" rozetinin yanında "Sefa Y." yazar. Yalnızca avatar elemanlarına
 * uygulanır — çıplak "EK" metnini sayfanın her yerinde değiştirmek tehlikeli.
 */
export const AVATAR_SELECTOR = '.avatar, .av-sm, .big-av';
export const INITIALS = [
  ['EK', 'SY'], // Ebrar Karakurt → Sefa Y.
  ['AG', 'SY'], // Arda Güler     → Selin Y.
  ['KY', 'BŞ'], // Kenan Yıldız   → Burak Ş.
  ['AŞ', 'MA'], // Alperen Şengün → Mert A.
  ['CO', 'DK'], // Cedi Osman     → Deniz K.
  ['HÇ', 'AT'], // Hakan Çalhanoğlu → Ayşe T.
  ['ZG', 'ZG'], // Zehra G. — değişmiyor
];

/**
 * DÜĞÜM DÜŞÜRME — ürünün bugünkü hâlinin KARŞILAMADIĞI iddiaları taşıyan düğümler, denetimli
 * render sırasında DOM'dan kaldırılır (TASK-14.06 · B-037 kalem 3).
 *
 * ## Neden AYRI bir tablo, neden `REPLACEMENTS` değil
 *
 * `REPLACEMENTS`'ın sözleşmesi *gerçek ad/semt/eski marka temizliğidir* (T10) ve mekanizması bir
 * dizeyi başkasıyla değiştirmektir. Buradaki iş bir yeniden adlandırma DEĞİL: iki kalem tam bir
 * karttır ve gövdeleri uydurma ₺ tutarları ile günlük doluluk yüzdeleridir — "başka bir şey yaz"
 * diye bir karşılıkları yok. İki sözleşmeyi tek tabloda toplamak ikisini de bulanıklaştırırdı.
 *
 * Kırpmayı yukarı çekmek de elendi ve gerekçesi mekanizmadadır: `clipBelow` **dikey bir alt
 * çapadır**, düşen iki KPI ise `.mini-kpis`'in tek bir ızgara satırında meşru iki komşuyla
 * (`PT Ders (bu ay)` · `Aktif Öğrenci`) yan yana duruyor — onları kesen her klip komşularını ve
 * altındaki tüm `.detgrid`'i de keserdi.
 *
 * ## Girdi `[seçici, çapa]`
 *
 * Seçici YAPISALDIR (kaynağın kendi ızgara/kart yapısı), çapa ise düğümü kardeşlerinden ayıran
 * kaynağın KENDİ sözcüğüdür. `nth-child` bilinçle kullanılmadı: kaynak demoya bir kart
 * eklendiği gün sıra kayar ve düşürme sessizce YANLIŞ düğümü alır
 * (`memory/uretilen-gorseli-olcumle-degistir.md` → çapayı sayıya değil YAPIYA bağla).
 *
 * Çapa **REPLACEMENTS'tan ÖNCE** okunur, yani kaynağın ham sözcüğüdür; bugünkü dört çapanın
 * hiçbiri temizlik tablosundan etkilenmiyor (ad/semt/marka taşımıyorlar).
 *
 * ## Çağıranın sözleşmesi: her girdi TAM BİR düğüm eşler
 *
 * Sıfır eşleşme çapanın köreldiğini, birden çok eşleşme seçicinin fazlasını aldığını söyler;
 * ikisi de üretimi durdurur. Sessiz "temiz" yok — bu hattın kendi fail-fast disiplini
 * (`memory/uretim-hatti-yesil-kosumla-kapanir.md`) ve klip çapasının (`!clip`) yanındaki
 * emsalin aynısı: yapısal bir çapa bulunamadığında tahminle üretim yapılmaz.
 */
export const DROP_NODES = {
  antrenor: [
    // `../Alpfit.v1/backend/src/services/trainer-performance.service.ts:7` → "FİNANSAL CİRO
    // DEĞİL"; servis Payment/Refund'a HİÇ dokunmuyor. KPI etiketi + `₺248.000` gövdesi.
    ['.mini-kpis .mk', 'Ciro (bu ay)'],
    // `../Alpfit.v1/backend/src/reports/producers/attendance-count.ts:11` → doluluk **%** bu
    // fazda KAPSAM DIŞI. KPI etiketi + `%86` gövdesi.
    ['.mini-kpis .mk', 'Doluluk'],
    // Aynı doluluk kalemi, üstüne HAFTALIK kırılım: rapor filtresi aylık, haftalık kırılım yok.
    // Kartın gövdesi gün gün `%90…` çubukları — yeniden adlandırılamaz.
    ['.detgrid .card', 'Haftalık Doluluk'],
    // Tümü finansal ciro: `₺220.000` · `₺28.000` · `Toplam ciro ₺248.000` — yukarıdaki servis
    // yorumunun adıyla reddettiği kalem.
    ['.detgrid .card', 'Ciro Kırılımı'],
  ],
};

/**
 * Denetimin "Ad Soyad" dalı için MASUM tamlamalar — ekran bazında.
 *
 * Liste büyüdükçe körelir: tek bir havuzda tutulsa bir gün gerçek bir ad listeye
 * sızdığında hangi ekrandan geldiği görünmez olurdu. Değerler ölçülerek dolduruldu
 * (denetim boş listeyle koşuldu, raporladıklarından gerçek ad taşımayanlar alındı).
 */
export const AUDIT_ALLOW = {
  // Ortak kabuk (gizli `aside.side` dahil — metin düğümü olarak hâlâ okunuyor):
  //   "Sahil Müdürü" bir ROLDÜR, kişi değil — kaynaktaki "Kadıköy Müdürü"nün
  //   REPLACEMENTS sonrası hâli.
  cockpit: [
    'Alpfit Plus',
    'Genel Bakış',
    'Grup Dersleri',
    'Sahil Müdürü',
    'Şube Genel',
    'Tüm Şubeler',
    'Toplam Ciro',
    'Aktif Üye',
    'Ortalama Doluluk',
    'Toplam Ekip',
    'Şube Ciro',
    'Şube Karşılaştırma',
  ],
  finans: [
    'Alpfit Plus',
    'Genel Bakış',
    'Grup Dersleri',
    'Sahil Müdürü',
    'Tüm Şubeler',
    'Toplam Ciro',
    'Üyelik Geliri',
    'Ciro Trendi',
    'Gelir Kırılımı',
    'Ödeme Tipi',
    'Şube Bazlı',
    'Ciro Kırılımı',
  ],
  // Aşağıdaki üç liste TASK-10.10'da, aynı yöntemle dolduruldu: kapı önce BOŞ listeyle
  // koşuldu (exit 1), raporladığı 38 tamlamanın her biri kaynakta tek tek arandı ve
  // yalnız etiket/başlık/buton/rapor adı olanlar alındı. Kişi adı taşıyan hiçbiri yok —
  // kaynaktaki gerçek adlar (Ebrar Karakurt · Arda Güler · Orkun Kökçü · Furkan Korkmaz ·
  // Zehra Güneş …) REPLACEMENTS tarafından zaten kısaltılıyor.
  takvim: [
    'Alpfit Plus',
    'Genel Bakış',
    'Grup Dersleri',
    'Sahil Müdürü',
    'Rezervasyon Takvimi', // sayfa başlığı
    'Randevu Ekle', // topbar butonu
    'Randevuyu Onayla', // modal butonu — kaynakta İKİ SATIRA bölünmüş
    'Yeni Üye', // takvim hücresi: "Yeni Üye / Deneme PT"
    'Bekleme Listesi', // kart başlığı
    'Günün Özeti', // kart başlığı
  ],
  // `Haftalık Doluluk` ve `Ciro Kırılımı` satırları TASK-14.06'da ÖLDÜ ve silindi: iki kart
  // artık `DROP_NODES.antrenor` ile DOM'dan kaldırılıyor, yani denetimin gördüğü kütlede hiç
  // yoklar. Ölü satırı bırakmak listeyi körelten sınıftır — mekanizma yaşıyorsa liste de
  // gerçeği tarif etmeli (`memory/bulgu-kapanisi-gerekce-yorumlarini-bayatlatir.md`).
  antrenor: [
    'Alpfit Plus',
    'Genel Bakış',
    'Grup Dersleri',
    'Sahil Müdürü',
    'Antrenör Detayı', // sayfa başlığı
    'Prim Hesabı', // topbar butonu
    'Aktif Öğrenci', // istatistik etiketi
    'Aylık Performans', // kart başlığı
    'Öğrenci Tutma', // kart başlığı
  ],
  raporlar: [
    'Alpfit Plus',
    'Genel Bakış',
    'Grup Dersleri',
    'Sahil Müdürü',
    'Tüm Şubeler',
    'Özel Rapor', // "Özel Rapor Oluştur" butonu
    'Aylık Ciro', // rapor şablonu adı
    'Antrenör Performansı', // rapor şablonu adı
    'Üye Listesi', // rapor şablonu adı
    'Satış Raporu', // "PT Satış Raporu"
    'Grup Dersi', // "Grup Dersi Doluluk"
    'Son Oluşturulan', // "Son Oluşturulan Raporlar" kart başlığı
    'Zamanlanmış Raporlar', // kart başlığı
    'Mayıs Ciro', // tablodaki rapor adı
    'Antrenör Performans', // tablodaki rapor adı
    'Finansal Özet', // tablodaki rapor adı
    'Haftalık Doluluk', // zamanlanmış rapor adı
  ],
};

// `uye-telefon` KOPYA LİSTE TAŞIMAZ, `takvim`inkine BAĞLANIR — ve bu bir kolaylık değil,
// ölçülmüş bir zorunluluk: iki ekran AYNI belgeden (`takvim.html`) render ediliyor ve
// denetimin gördüğü kütle klip değil TÜM DOM'dur (TASK-10.10 → M7 mutasyonu). Yani iki
// listenin ayrışması mümkün değil; kopya yazmak yalnız bayatlama riski üretirdi.
// Ölçüldü (TASK-10.11): `uye-telefon` boş listeyle koşuldu ve `takvim`in on tamlamasının
// ONUNU DA — eksiksiz, fazlasız — raporladı.
AUDIT_ALLOW['uye-telefon'] = AUDIT_ALLOW.takvim;

/**
 * Marka sızıntısı dalı. `Ad Soyad` regex'i `muhasebe@weekendplus…`'ı GÖREMEZ
 * (iki büyük harfli sözcük aramıyor) — bu yüzden ayrı bir dal olarak koşar.
 * `\s*-?\s*` boş dizeyi de eşlediği için hem "Weekend Plus" hem "weekendplus" yakalanır.
 */
export const BRAND_LEAK = /weekend\s*-?\s*plus/i;

/**
 * Denetimin KARAR fonksiyonu — saf: girdi metin değerleri + ekran id'si, çıktı bulgular.
 * `renderScreen()`'in `page.evaluate` gövdesinden **birebir** çıkarıldı; DOM'a, tarayıcıya ve
 * dosya sistemine dokunmaz, o yüzden sentetik girdiyle sınanabilir.
 *
 * İki dal ayrı koşar ve bu bilinçlidir: `Ad Soyad` kalıbı `muhasebe@weekendplus…`'ı GÖREMEZ
 * (iki büyük harfli sözcük aramıyor), marka sızıntısı da bir tamlama değildir.
 *
 * Bilinmeyen bir `screenId` **boş allow listesi** demektir — sessiz bir "her şey serbest" değil,
 * tam tersi: liste yoksa masum tamlamalar da bulgu olarak raporlanır ve üretim durur.
 *
 * @param {string[]} values  metin düğümlerinin DEĞİŞTİRİLMİŞ değerleri (çağıran toplar)
 * @param {string}   screenId `AUDIT_ALLOW` anahtarı
 * @returns {{ names: string[], brands: string[] }}
 */
export function auditTexts(values, screenId) {
  const full = /[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}/g;
  const allowed = new Set(AUDIT_ALLOW[screenId] ?? []);
  const names = new Set();
  const brands = new Set();
  for (const value of values) {
    // `\s+` satır sonunu da eşliyor: kaynakta bir etiket iki satıra bölünmüşse
    // (`takvim.html`de "Randevuyu\n  Onayla") eşleşme girintiyi taşır ve allow-list'in
    // tam-eşleşmesi onu ASLA tutamaz. Karşılaştırma tek boşluğa indirgenmiş biçimde
    // yapılır — kapının gördüğü kütle değişmez, yalnız yazımı okunabilir olur.
    for (const m of value.matchAll(full)) {
      const label = m[0].replace(/\s+/g, ' ');
      if (!allowed.has(label)) names.add(label);
    }
    if (BRAND_LEAK.test(value)) brands.add(value.trim().slice(0, 80));
  }
  return { names: [...names], brands: [...brands] };
}
