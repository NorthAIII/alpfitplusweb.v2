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
    src: "/product/antrenor.webp",
    width: 1200,
    height: 866,
    alt: "Alpfit Plus antrenör detay ekranı: aylık performans ve öğrenci tutma",
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
