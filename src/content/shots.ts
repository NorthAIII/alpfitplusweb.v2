/**
 * Urun ekran goruntusu kunyesi — boyutlar research/scripts/render-product.mjs
 * hattinin uretim ciktisidir (research/product-out/manifest.json).
 * Gorseller o hattan gecer: eski marka, gercek ad ve karsilanmayan iddia temizlenir.
 */
export type Shot = { src: string; width: number; height: number; alt: string };

export const SHOTS = {
  cockpit: {
    src: "/product/cockpit.webp",
    width: 1440,
    height: 655,
    alt: "Alpfit Plus çok şube cockpit ekranı: şube bazlı ciro, aktif üye ve doluluk yan yana",
  },
  takvim: {
    src: "/product/takvim.webp",
    width: 1440,
    height: 760,
    alt: "Alpfit Plus rezervasyon takvimi: antrenör sütunları, saat ızgarası ve bekleme listesi",
  },
  grup: {
    src: "/product/grup.webp",
    width: 1440,
    height: 721,
    alt: "Alpfit Plus grup dersleri ekranı: kontenjan, katılımcı listesi ve yoklama",
  },
  finans: {
    src: "/product/finans.webp",
    width: 1440,
    height: 601,
    alt: "Alpfit Plus finans ekranı: ciro trendi, gelir kırılımı ve ödeme tipi dağılımı",
  },
  antrenor: {
    // TASK-2.12 (olculdu 2026-09-23): alt metni "ogrenci tutma" diyordu —
    // urunde YOK. Kelime tum urun kod tabaninda 0 kez geciyor (backend/src +
    // web/src + mobile/src + shared tarandi) ve urunun surum haritasi kalemi
    // adiyla erteliyor: "Antrenor performansi — ogrenci tutma gostergesi …
    // v1'de … hic yapilmadi … Faz 45 … kalemi v1.5'e tasidi"
    // (../Alpfit.v1/_dev/PRD/VERSIONS.md). Alt metni goruntude GERCEKTEN duran
    // ve urunde KARSILIGI OLAN uc karta daraltildi (Aylik Performans ·
    // Haftalik Doluluk · Ciro Kirilimi — VERSIONS v1 satiri "Antrenor
    // Performansi"). ⚠️ Goruntunun KENDISI hala "Ogrenci Tutma" kartini
    // render ediyor (demo/antrenor.html) — o bir gorsel sizintisidir ve
    // metin tarafinin isi degil: B-018 / TASK-2.13-2.15, kayit BULGULAR.
    src: "/product/antrenor.webp",
    width: 1200,
    height: 866,
    alt: "Alpfit Plus antrenör detay ekranı: aylık performans, haftalık doluluk ve ciro kırılımı",
  },
  raporlar: {
    src: "/product/raporlar.webp",
    width: 1200,
    height: 519,
    alt: "Alpfit Plus raporlar ekranı: hazır rapor şablonları ve Excel dışa aktarma",
  },
  uyeTelefon: {
    src: "/product/uye-telefon.webp",
    width: 720,
    height: 1521,
    alt: "Alpfit Plus üye mobil uygulaması: antrenör seçimi, gün ve müsait saat seçimi",
  },
} satisfies Record<string, Shot>;
