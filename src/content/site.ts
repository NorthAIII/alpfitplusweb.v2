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
 *
 * `version` TASK-2.10'da tuketicisine baglandi: FounderProgram'in ilk durum
 * satiri ("v1 hazir") artik bu alandan okuyor. Capasi olculdu — urunun kendi
 * surum haritasi v1 icerigini tamamlanmis sayiyor
 * (../Alpfit.v1/_dev/PRD/VERSIONS.md: "v1 icerik tamamlandi, Faz 8-22").
 * "v1 hazir" hala chat.ts ve faq.ts'te elle yazili; onlari TASK-2.11 baglar.
 *
 * `nextVersion` ("v1.5") BILINCLE ACILMADI — TASK-2.08 onu TASK-2.10'a
 * birakmisti, olcum o devri curuttu (2026-09-23, ../Alpfit.v1/_dev/PRD/
 * VERSIONS.md, "Bu dosya source of truth"):
 *   · urunun v1.5 kapsami = kampanya derinlesmesi · gelismis raporlama/Excel ·
 *     bekleme listesi otomasyonu · churn paneli olgunlasmasi
 *   · urunun v2 kapsami = CAPABILITIES.sonra'nin BESI DE, birebir
 *   · ama CAPABILITIES.yolda'ya TASK-2.08'in tasidigi dort B-029 kalemi
 *     (Uye 360 tam fazi, iptal esigi ayari, uyelik bitisi bildirimi, tek-yetki
 *     revoke) surum haritasinin HICBIR satirinda yok — kod yorumunda
 *     "v1.5 adayi / ertelendi" demeleri kapsam taahhudu degil.
 * Yani "yolda" kademesi bir SURUMUN kapsami degil; tumune "v1.5" demek
 * capasiz iddia olurdu (B-029'un ta kendisi). Kademe basligi bu yuzden
 * STAGE_LABEL'dan okunuyor, surum numarasindan degil. Alan ancak kalem
 * duzeyinde surum bilgisi dogarsa anlamli olur; o gun tuketicisiyle acilir.
 */
export const PRODUCT_STATUS = {
  version: "v1",
  sentence: "Şu anda bir stüdyoda pilot olarak test ediliyor.",
  modules: `${moduleProse()}.`,
} as const;
