/**
 * Sitenin tek metin/yapilandirma kaynagi.
 * Iddia sinirlari: alpfit-plus-satis/rekabet/ozet.md + fiyat/model.md
 *  - Diyetisyen entegrasyonu: 18 rakip urunde gorulmedi → soylenebilir.
 *  - Antrenor app'i: FitSchedule ve Sportix'te de var → "sadece bizde" DENMEZ.
 *  - TR-odakli/KVKK: yerli rakiplerin hepsinde var → farklilasma DEGIL.
 *  - Urun durumu: bir studyoda PILOT olarak test ediliyor. "Sahada/canli" DENMEZ.
 *  - ROI / musteri sayisi / yuzde iyilesme iddiasi YOK (pilot sonucu cikmadi).
 */

export const SITE = {
  name: "Alpfit Plus",
  domain: "alpfitplus.com",
  url: "https://alpfitplus.com",
  tagline: "Kulübünüzün tüm işi tek platformda",
  description:
    "Randevu, grup dersleri, üyelik ve paket, tahsilat ve ciro, çok şube ve diyetisyen hizmeti. Spor kulübünüzün tamamı tek panelde ve mobilde.",
  maker: { name: "Kiwi AI Lab", url: "https://kiwiailab.com" },
  appUrl: "https://app.alpfitplus.com",
} as const;

export const CONTACT = {
  whatsapp: { display: "+90 535 937 59 55", href: "https://wa.me/905359375955" },
  phone: { display: "0535 937 59 55", href: "tel:+905359375955" },
  sales: "kivanc@kiwiailab.com",
  support: "destek@alpfitplus.com",
  instagram: { handle: "@alpfitplus", href: "https://instagram.com/alpfitplus" },
  city: "Tuzla, İstanbul",
} as const;

export const NAV = [
  { label: "Özellikler", href: "/ozellikler" },
  { label: "Segmentler", href: "/segmentler" },
  { label: "Fiyat", href: "/fiyat" },
  { label: "Destek", href: "/destek" },
] as const;

/** Urunun bugunku durumu — tek yerde, dururust. */
export const PRODUCT_STATUS = {
  version: "v1",
  label: "v1 hazır, bir stüdyoda pilot olarak test ediliyor",
  short: "Pilot aşamada",
} as const;
