/**
 * Sitenin tek metin/yapilandirma kaynagi.
 * Iddia siniri (ne soylenir, ne soylenmez) TEK evde: _dev/docs/CLAIMS.md
 * Dayanak: alpfit-plus-satis/rekabet/ozet.md + fiyat/model.md
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
  { label: "Geçiş", href: "/gecis" },
] as const;

/**
 * Urunun bugunku durumu — TEK kaynak. Sitede pilot iddiasi baska bir cumleyle
 * yazilmaz. Satis dosyasinin siniri: "canli / sahada kullaniliyor" DENMEZ.
 */
export const PRODUCT_STATUS = {
  version: "v1",
  short: "Pilot aşamada",
  sentence: "Şu anda bir stüdyoda pilot olarak test ediliyor.",
  modules:
    "Randevu, grup dersleri, üyelik ve paket, finans ve ciro, çok şube cockpit, raporlar, diyetisyen modülü ve bildirimler.",
} as const;
