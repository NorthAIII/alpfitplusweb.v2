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

/**
 * 503 KURTARMA BAGLANTISI (TASK-3.25, B-022'nin ikincil onerisi).
 *
 * Form hedefe yazamayip 503 `no-sink` dondugunde kullanici WhatsApp'a
 * yonlendiriliyor ama az once yazdigi her seyi elle yeniden yazmak zorunda
 * kaliyordu. Asagidaki yardimci, `?text=` parametresiyle mesaj kutusunu
 * onceden doldurulmus bir taslakla acar.
 *
 * ⚠️ TABAN `CONTACT.whatsapp.href` DEGISMEZ. Olculdu (2026-09-24):
 * `CONTACT.whatsapp` src/ icinde 12 dosyada 23 kez geciyor, 15'i `.href`
 * (Header, Footer, Hero, SSS, 404, asistan, destek, demo sayfasi, kapanis
 * cagrisi, formun kendi iki baglantisi). Tabana `?text=` koymak sitedeki HER
 * WhatsApp baglantisina bos ya da yanlis bir on-doldurma tasirdi; on-doldurma
 * bu yuzden CAGRI YERINDE kurulur (memory/tek-kaynak-atlayan-cagri-sitesi-
 * supurmesi.md).
 *
 * ⚠️ KAPSAM DAR TUTULDU: yalniz kullanicinin KENDI girdigi ad, kulup ve
 * telefon tasinir. Serbest mesaj alani ve e-posta adresi BILINCLE disarida —
 * adres satiri ucuncu bir tarafin (wa.me) sunucusuna gider, yani tasinan her
 * alan ucuncu tarafa acilan bir yuzeydir. Alan kumesi burada, tek yerde,
 * `WHATSAPP_DRAFT_FIELDS` olarak durur; kapi (tests/whatsapp-draft.test.ts)
 * bu sabitten degil DAVRANISTAN olcer -- tum form kaydi verilir, ciktida
 * yalniz uc alanin degeri cikmalidir.
 *
 * Bos alan satir uretmez; hicbir alan dolu degilse `?text=` HIC eklenmez ve
 * baglanti bugunku sade haline duser (adres satirina bos bir sablon konmaz).
 */
export const WHATSAPP_DRAFT_FIELDS = [
  { key: "name", label: "Ad" },
  { key: "club", label: "Kulüp" },
  { key: "phone", label: "Telefon" },
] as const;

/** Taslagin giris cumlesi — metin bilesende degil burada (CLAUDE.md → Kod kuralları). */
const WHATSAPP_DRAFT_INTRO = "Merhaba, siteden demo talebi göndermek istedim ama form gönderilemedi. Bilgilerim:";

/**
 * Alan basina karakter tavani. Tarayici alanlarda `maxlength` tasimiyor, yani
 * istemci tarafinda deger sinirsiz olabilir; adres satirinin uzunlugu ise
 * sinirlidir (tarayici ve wa.me tarafinda). Tavan ucun kendi sinirlarinin
 * (api/demo/route.ts → MAX: name 120, club 160, phone 40) ustunde degil,
 * ALTINDA tutuldu — burada amac dogrulama degil adresi ayakta tutmak.
 */
const WHATSAPP_DRAFT_MAX = 120;

/**
 * Form kaydindan on-doldurulmus WhatsApp adresi uretir. Hicbir alan dolu
 * degilse taban `href` aynen doner.
 */
export function whatsappDraftHref(values: Readonly<Record<string, string>>): string {
  const lines = WHATSAPP_DRAFT_FIELDS.map(({ key, label }) => {
    const value = (values[key] ?? "").replace(/\s+/g, " ").trim().slice(0, WHATSAPP_DRAFT_MAX);
    return value ? `${label}: ${value}` : "";
  }).filter(Boolean);

  if (lines.length === 0) return CONTACT.whatsapp.href;
  const text = [WHATSAPP_DRAFT_INTRO, ...lines].join("\n");
  return `${CONTACT.whatsapp.href}?text=${encodeURIComponent(text)}`;
}

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
