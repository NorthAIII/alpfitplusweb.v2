/**
 * Site asistaninin bilgi agaci.
 *
 * Bugun AI YOK: cevaplar sabit ve hepsi sitedeki dogrulanmis iddialarla ayni
 * sinirda. Ileride ayni arayuzun arkasi bir /api/chat ucuna baglanacak; o zaman
 * bu agac modelin sistem talimatinin BILGI TABANI olur, yani tek kaynak korunur.
 *
 * Iddia siniri (rekabet/ozet.md + fiyat/model.md):
 *  - Diyetisyen modulu soylenir, antrenor app'i "sadece bizde" DENMEZ.
 *  - TR-odaklilik fark sayilmaz. Urun PILOT asamada.
 *  - ROI, musteri sayisi ve yuzde iyilesme iddiasi YOK.
 *  - Bilmedigimiz sey uydurulmaz, kisiye baglanir.
 */
import { PRICING, monthlyFor, tl } from "./pricing";

export type ChatTopic = {
  id: string;
  /** Ziyaretcinin gorecegi kisa soru. */
  q: string;
  /** Cevap paragraflari. */
  a: string[];
  /** Cevabin altinda cikan baglantilar. */
  links?: { label: string; href: string }[];
  /** Devam sorulari. */
  next?: string[];
};

export const CHAT_INTRO = [
  "Merhaba. Alpfit Plus hakkında merak ettiklerinizi buradan sorabilirsiniz.",
  "Aşağıdaki başlıklardan birini seçin. Cevabını bilmediğim bir şey sorarsanız sizi doğrudan ekibe bağlarım.",
];

/** Panelin ilk ekraninda gosterilen basliklar. */
export const CHAT_ROOT = ["fiyat", "kurulum", "donanim", "mobil", "asama"];

export const CHAT_TOPICS: ChatTopic[] = [
  {
    id: "fiyat",
    q: "Fiyat nasıl işliyor?",
    a: [
      `Tek fiyat, şube başına. İlk şube ${tl(PRICING.firstBranch)} ₺, ikinci şubeden itibaren her şube ${tl(PRICING.extraBranch)} ₺. Aylık ve KDV hariç.`,
      `Paket, kademe, eğitmen limiti ve üye limiti yok. Üye ve antrenör mobil uygulaması ile diyetisyen modülü her şubede dâhil.`,
      `Kurulum şube başına ${tl(PRICING.setupPerBranch)} ₺, yıllık peşin ödemede alınmaz.`,
    ],
    links: [{ label: "Şube sayısına göre hesapla", href: "/fiyat" }],
    next: ["cok-sube", "deneme", "kurulum"],
  },
  {
    id: "cok-sube",
    q: "Çok şubem var, ne öderim?",
    a: [
      `Şube başına hesaplanır. Örnek: 3 şube için aylık ${tl(monthlyFor(3))} ₺, 5 şube için ${tl(monthlyFor(5))} ₺, 6 şube için ${tl(monthlyFor(6))} ₺. Hepsi KDV hariç.`,
      "Mobil uygulama her şubede dâhildir, ayrı bir prim yoktur. Çok şubeli kurulumlarda aradaki fark burada açılıyor.",
      "Şubeler tek cockpit ekranında görünür ve yetkiler şube bazında verilir.",
    ],
    links: [
      { label: "Fiyat hesaplayıcı", href: "/fiyat" },
      { label: "Zincirler için sayfa", href: "/segmentler/cok-subeli-zincir" },
    ],
    next: ["fiyat", "kurulum"],
  },
  {
    id: "kurulum",
    q: "Verilerimi kim taşıyor?",
    a: [
      "Kurulumu ve veri taşımayı biz yapıyoruz. Üye listeniz Excel'de, defterde ya da başka bir yazılımda olabilir; demo görüşmesinde birlikte bakıp taşıma planını netleştiriyoruz.",
      "Veri taşıma sözleşme sonrasında yapılır. İki sistemi bir ay birden kullanmanız gerekmez.",
      "İlk hafta yanınızdayız, takıldığınız yerde WhatsApp'tan yazarsınız.",
    ],
    links: [{ label: "Nasıl çalıştığını gör", href: "/#nasil-calisir" }],
    next: ["deneme", "antrenor-ogrenir", "fiyat"],
  },
  {
    id: "antrenor-ogrenir",
    q: "Antrenörlerim öğrenebilir mi?",
    a: [
      "Antrenörün kullandığı yüzey kendi telefonundaki uygulama: günün takvimi, öğrenci listesi ve tek dokunuşla yoklama.",
      "Kendimize koyduğumuz kriter şu: ekip 'WhatsApp ve Excel daha kolaydı' diyemeyecek kadar akıcı olmak.",
    ],
    next: ["mobil", "kurulum"],
  },
  {
    id: "donanim",
    q: "Turnike almam gerekiyor mu?",
    a: [
      "Hayır. Alpfit Plus donanıma bağlı değildir, web paneli ve mobil uygulama üzerinden çalışır.",
      "QR ve turnike ile giriş kontrolü yol haritasındadır, bugünkü ürünün parçası değildir. Yolda olanı bugün varmış gibi anlatmıyoruz.",
    ],
    links: [{ label: "Ne var, ne yolda", href: "/ozellikler" }],
    next: ["asama", "mobil"],
  },
  {
    id: "mobil",
    q: "Mobil uygulama ayrı ücretli mi?",
    a: [
      "Hayır. Üye uygulaması da antrenör uygulaması da şube fiyatına dâhildir.",
      "Üye randevusunu kendi telefonundan alır, grup dersine kaydolur, kalan seans hakkını ve ölçüm grafiğini görür. Antrenör kendi takvimini yönetir ve yoklamayı tek dokunuşla alır.",
    ],
    links: [{ label: "Dört rolü incele", href: "/ozellikler" }],
    next: ["diyetisyen", "fiyat"],
  },
  {
    id: "diyetisyen",
    q: "Diyetisyen modülü nedir?",
    a: [
      "Kulübünüzün lisanslı diyetisyeni aynı platformda çalışır: beslenme programı yazar, PDF yükler, üyenin ölçümünü ve yemek günlüğünü okur. Üye programını uygulamadan görür.",
      "İncelediğimiz 9 yerli ve 9 global üründe bu modüle rastlamadık.",
      "Kulübünüzde diyetisyen yoksa modülü kapalı tutabilirsiniz; sonradan açtığınızda veriler yerinde durur.",
    ],
    next: ["mobil", "asama"],
  },
  {
    id: "deneme",
    q: "Ücretsiz deneme var mı?",
    a: [
      `Evet, ${PRICING.trialDays} gün. Deneme demo verisiyle yürür; gerçek verinize dokunulmaz ve kurulum ücreti alınmaz.`,
      "Kredi kartı istemiyoruz. Self servis bir kayıt akışı yok, denemeyi görüşmeden sonra birlikte kuruyoruz.",
    ],
    links: [{ label: "Demo iste", href: "/demo" }],
    next: ["kurulum", "fiyat"],
  },
  {
    id: "asama",
    q: "Ürün hangi aşamada?",
    a: [
      "v1 hazır ve şu anda bir stüdyoda pilot olarak test ediliyor. Randevu, grup dersleri, üyelik ve paket, finans ve ciro, çok şube cockpit, raporlar, diyetisyen modülü ve bildirimler bugün çalışıyor.",
      "Kampanya derinleşmesi, gelişmiş raporlama ve churn paneli yolda. Online ödeme, QR ve turnike girişi ile yapay zekâ destekli analiz yol haritasında.",
      "Pilot sonucumuz henüz çıkmadı, bu yüzden size ciro artışı gibi bir rakam söylemiyoruz.",
    ],
    links: [{ label: "Yol haritası", href: "/ozellikler" }],
    next: ["kvkk", "deneme"],
  },
  {
    id: "kvkk",
    q: "Verilerim nerede duruyor?",
    a: [
      "Veri sorumlusu Kiwi AI Lab'dır ve altyapı KVKK ile uyumlu kurgulanmıştır.",
      "Sağlık verisi içeren modüller yönetim panelinden açılıp kapatılabilir. Hesap kapatıldığında silme zinciri işler.",
      "Ayrıntıyı aydınlatma metninde bulabilir ya da demo görüşmesinde sorabilirsiniz.",
    ],
    links: [{ label: "KVKK aydınlatma metni", href: "/kvkk" }],
    next: ["asama", "kurulum"],
  },
];

export function topicById(id: string): ChatTopic | undefined {
  return CHAT_TOPICS.find((t) => t.id === id);
}

/** Agacta karsiligi olmayan her soru icin tek cevap: uydurma yok, kisiye bagla. */
export const CHAT_FALLBACK = [
  "Bunun cevabını burada uydurmak istemem.",
  "Sizi doğrudan ekibe bağlayayım. WhatsApp'tan yazarsanız aynı gün dönüş yapıyoruz.",
];
