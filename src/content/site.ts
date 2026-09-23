/**
 * Sitenin tek metin/yapilandirma kaynagi.
 * Iddia siniri (ne soylenir, ne soylenmez) TEK evde: _dev/docs/CLAIMS.md
 * Dayanak: alpfit-plus-satis/rekabet/ozet.md + fiyat/model.md
 */

import { moduleProse } from "./product";

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
 *
 * `modules` artik elle yazilmiyor: "bugun var" kademesinin MODUL duzeyli
 * kalemlerinden turuyor (product.ts → CAPABILITIES). Eski elle yazilmis cumle
 * urunun on modulunun sekizini sayiyordu; turetilmis hali dokuzu sayar —
 * "antrenor performansi" eksikti ve urunde karsiligi olculdu
 * (../Alpfit.v1: routes/finance-trainer-performance.ts, TrainerPerformancePage.tsx).
 * "Uye 360" bilincle DISARIDA: ekran var ama olcum grafigi ve diyetisyen notu
 * urunun kendi "Yakinda" kutusunda (B-029) — o kalem "yolda" kademesinde.
 *
 * `short` ("Pilot aşamada") 2026-09-23'te SILINDI: hic tuketicisi yoktu ve
 * planlanmiyordu; pilot iddiasini `sentence` tasiyor (karar: docs/DECISIONS.md).
 * `version` KALDI — "v1 hazir" bugun uc yerde elle yazili (chat.ts, faq.ts,
 * FounderProgram.tsx) ve TASK-2.10/2.11 onlari buraya baglayacak.
 */
export const PRODUCT_STATUS = {
  version: "v1",
  sentence: "Şu anda bir stüdyoda pilot olarak test ediliyor.",
  modules: `${moduleProse()}.`,
} as const;
