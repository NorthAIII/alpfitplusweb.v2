/**
 * Gecis / veri aktarimi sayfasi.
 *
 * Kaynak: rekabet/mevcut-duzen.md — "Bu rakibin gercek gucu: degisim maliyeti".
 * Kulup sahibi "sistem kotu" demiyor, "alistik" diyor. Rakip urun degil,
 * TASINMA KORKUSU. Uc soru her gorusmede cikiyor:
 *   1. Uye verilerimi nasil tasirim?
 *   2. Antrenorler ogrenir mi?
 *   3. Bir ay boyunca iki sistemi birden mi kullanacagim?
 *
 * Bu sayfanin tek isi o uc soruya cevap vermek. Vaat siniri: veri tasima
 * SOZLESME SONRASI yapilir, deneme demo verisiyle yurur.
 */

export const GECIS_FEARS = [
  {
    q: "Üye verilerimi nasıl taşırım?",
    a: "Taşımayı biz yapıyoruz. Elinizdeki liste hangi biçimde olursa olsun önce bakıyoruz, sonra planlıyoruz. Siz tek satır veri girmiyorsunuz.",
  },
  {
    q: "Antrenörlerim öğrenir mi?",
    a: "Antrenörün öğrenmesi gereken tek yüzey kendi telefonundaki uygulama: günün takvimi, öğrenci listesi, tek dokunuşla yoklama. Ekranı ilk açtığında ne yapacağı belli.",
  },
  {
    q: "Bir ay iki sistemi birden mi kullanacağım?",
    a: "Hayır. Geçiş tek seferde yapılır. Denemede gerçek verinize dokunulmaz; taşıma sözleşmeden sonra, üzerinde anlaştığımız günde yapılır ve o günden itibaren tek sistem çalışır.",
  },
];

export type Source = {
  key: string;
  title: string;
  body: string;
  effort: "kolay" | "orta" | "değişken";
  icon: string;
};

/** Kulubun bugun verisini tuttugu yerler ve her birinin tasima yolu. */
export const GECIS_SOURCES: Source[] = [
  {
    key: "excel",
    title: "Excel veya Google Sheets",
    body: "En sık karşılaştığımız durum. Sütun başlıkları ne olursa olsun sizden dosyayı alıp eşlemeyi biz yapıyoruz. Ad, telefon, üyelik tipi, kalan hak ve borç alanları taşınır.",
    effort: "kolay",
    icon: "report",
  },
  {
    key: "defter",
    title: "Defter veya kâğıt",
    body: "Elle tutulan kayıtlar için birlikte bir öncelik listesi çıkarıyoruz: aktif üyeler ve açık borçlar önce girilir, geçmiş yoklama arşiv olarak kalır. Hepsini bir günde girmeye çalışmıyoruz.",
    effort: "orta",
    icon: "user",
  },
  {
    key: "yazilim",
    title: "Başka bir yazılım",
    body: "Kullandığınız üründen dışa aktarım alabiliyorsanız iş kolaylaşır. Alamıyorsanız da birlikte bakarız; hangi verinin taşınacağına siz karar verirsiniz.",
    effort: "değişken",
    icon: "layers",
  },
  {
    key: "whatsapp",
    title: "WhatsApp ve telefon rehberi",
    body: "Randevu geçmişi taşınmaz, taşınmasına da gerek yok. Yeni sistem ilk günden randevu almaya başlar. Üye listesi rehberden çıkarılabiliyorsa onu değerlendiririz.",
    effort: "kolay",
    icon: "bell",
  },
];

/** Ne tasiniyor, ne tasinmiyor — ikisi de yaziliyor. */
export const GECIS_SCOPE = {
  inside: [
    "Üye kimlik ve iletişim bilgileri",
    "Aktif üyelikler ve seans paketleri",
    "Kalan seans hakkı",
    "Açık borç ve tahsilat durumu",
    "Antrenör listesi ve şube ataması",
    "Grup dersi programı",
  ],
  outside: [
    "WhatsApp yazışma geçmişi",
    "Geçmiş yılların yoklama kayıtları (istenirse arşiv olarak eklenir)",
    "Başka bir üründeki özel alanlar (birlikte değerlendirilir)",
    "Muhasebe programınızdaki kayıtlar",
  ],
} as const;

/** Ilk hafta ne oluyor. */
export const GECIS_WEEK = [
  { day: "Sözleşme günü", body: "Taşıma tarihini birlikte belirliyoruz. Hangi verinin taşınacağı yazılı hale geliyor." },
  { day: "Hazırlık", body: "Listenizi alıyoruz, alan eşlemesini yapıyoruz, deneme ortamına yüklüyoruz. Siz mevcut düzeninizle çalışmaya devam ediyorsunuz." },
  { day: "Kontrol", body: "Yüklenen veriyi birlikte gözden geçiriyoruz. Yanlış giden bir şey varsa canlıya geçmeden düzeltiliyor." },
  { day: "Geçiş günü", body: "Hesaplar açılıyor, antrenörler uygulamayı kuruyor, üyelere davet gidiyor. Eski düzen kapanıyor." },
  { day: "İlk hafta", body: "Yanınızdayız. Takıldığınız yerde WhatsApp'tan yazıyorsunuz, aynı gün dönüyoruz." },
];
