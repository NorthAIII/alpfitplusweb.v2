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
    // TASK-2.12 (olculdu 2026-09-23): alt metni "ogrenci tutma" diyordu — urunde
    // YOK. Kelime tum urun kod tabaninda 0 kez geciyor ve urunun surum haritasi
    // kalemi adiyla erteliyor (../Alpfit.v1/_dev/PRD/VERSIONS.md → v1.5).
    // Goruntunun kendisi o kalemi hala render ediyordu; TASK-2.13 karti hattan
    // dusurdu (DROP_NODES.antrenor) ve gorseli yeniden uretti.
    //
    // TASK-2.13 ayrica 2.12'nin YERINE YAZDIGI alt metni de duzeltti — olculdu:
    // "haftalik doluluk" ve "ciro kirilimi" kartlari bu goruntude ZATEN YOK,
    // TASK-14.06'dan beri ayni hat onlari dusuruyor (DROP_NODES.antrenor) ve
    // gerekcesi urunun kendi kodu: trainer-performance.service.ts:7 "FINANSAL
    // CIRO DEGIL", attendance-count.ts:11 doluluk % kapsam disi. Yani alt metin
    // bir karsiliksiz iddiayi ikisiyle degistirmisti. Bugunku metin goruntude
    // GERCEKTEN duran iki yuzeyi anlatiyor: "Aylik Performans · PT ders · son 6
    // ay" grafigi ve "Ogrenciler" tablosu; ikisinin de karsiligi CAPABILITIES
    // → simdi'de (`antrenor-performansi`).
    src: "/product/antrenor.webp",
    width: 1200,
    height: 866,
    alt: "Alpfit Plus antrenör detay ekranı: aylık PT ders performansı ve öğrenci listesi",
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
