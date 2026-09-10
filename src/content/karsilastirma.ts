/**
 * "Yazilim secerken" sayfasi.
 *
 * RAKIP ADI GECMEZ. Iki gerekce var:
 *  1. Turkiye'de karsilastirmali reklam mevzuati rakibi adiyla anmayi siki
 *     kosullara bagliyor. Hukuk danismani onay verirse adlar eklenebilir.
 *  2. Rekabet dosyasinin kendi kurali: "rakip iddialarini kendi davranisimiza
 *     cevir" (v1 TASK-14.03 ayni yonde geri adim atmisti).
 *
 * Bu yuzden sayfa yalnizca IKI sey soyluyor:
 *  - Piyasada yayinlanmis fiyatlarin bandi (kaynak ve tarihle, adsiz).
 *  - Her saticiya sorulabilecek sorular ve BIZIM cevabimiz.
 * Rakip hakkinda tek bir olumsuz iddia kurulmuyor.
 */
import { PRICING, tl } from "./pricing";

export const ARASTIRMA = {
  /** rekabet/yerli-oyuncular.md — erisim 2026-07-10 */
  date: "Temmuz 2026",
  scanned: 18,
  domestic: 9,
  global: 9,
  publishing: 5,
  note:
    "Türkiye'de satış yapan dokuz yerli ve dokuz global ürünün kendi sayfalarını okuduk. Beşi fiyatını yayınlıyor, kalanı demo sonrası söylüyor. Aşağıdaki band o yayınlanmış fiyatlardan çıktı.",
} as const;

/** Tek sube, aylik, KDV dahile cevrilmis band. Ad yok, bant var. */
export const BAND = {
  low: 990,
  lowHigh: 1188,
  clusterLow: 1100,
  clusterHigh: 2000,
  appHigh: 4799,
  /** Bizim konumumuz, KDV dahil karsiligi. */
  ours: Math.round(PRICING.firstBranch * 1.2),
  oursExVat: PRICING.firstBranch,
} as const;

export type Question = {
  q: string;
  why: string;
  ours: string;
  /** Bu bir farklilasma mi, yoksa giris sarti mi? */
  weight: "fark" | "giriş şartı";
};

/**
 * Kaynak: rekabet/ozet.md §5 itiraz tablosu, notr soruya cevrildi.
 * "ours" alanlari YALNIZCA kendi urunumuz hakkinda.
 */
export const QUESTIONS: Question[] = [
  {
    q: "Antrenörler kendi telefonundan yoklama alabiliyor mu?",
    why: "Yoklama resepsiyonda alınıyorsa dersin içinde kim olduğu her zaman doğru kaydedilmez.",
    ours: "Evet. Antrenörün kendi uygulaması var; günün takvimini görür, tek dokunuşla işaretler, yanlış işaretlerse 48 saat içinde düzeltir.",
    weight: "fark",
  },
  {
    q: "Üye mobil uygulaması fiyata dâhil mi?",
    why: "Bazı ürünlerde mobil uygulama ayrı bir paket ve aylık tutarı belirgin biçimde yükseltiyor.",
    ours: `Dâhil. Üye ve antrenör uygulaması şube fiyatının içinde, ayrı prim yok. Şube başına ${tl(PRICING.firstBranch)} ₺ + KDV.`,
    weight: "fark",
  },
  {
    q: "İkinci şube açarsam ne oluyor?",
    why: "Bazı paketlerde şube limiti bir. Büyüdüğünüzde ya paket değiştirmeniz ya ürün değiştirmeniz gerekir.",
    ours: `Limit yok. Şube başına fiyatlanır, ikinci şubeden itibaren ${tl(PRICING.extraBranch)} ₺. Çok şube cockpit ilk günden açıktır.`,
    weight: "fark",
  },
  {
    q: "Diyetisyen hizmetini aynı platformda verebiliyor muyum?",
    why: "Beslenme hizmeti veriyorsanız ayrı bir kanalda yürütmek üyeyi iki yere bakmaya zorlar.",
    ours: "Evet. Kulübün lisanslı diyetisyeni programı yazar, PDF yükler, ölçümü okur. İncelediğimiz 18 üründe bu modüle rastlamadık.",
    weight: "fark",
  },
  {
    q: "Turnike ya da kart okuyucu almak zorunda mıyım?",
    why: "Donanım merkezli ürünlerde kurulum maliyeti yazılım fiyatının üstüne biner.",
    ours: "Hayır. Panel ve mobil uygulama yeter. QR ve turnike ile giriş yol haritamızda, bugünkü ürünün parçası değil.",
    weight: "fark",
  },
  {
    q: "Ciro ve kalan borç takibi var mı, yoksa yalnız takvim mi?",
    why: "Sadece randevu tutan bir ürün, kulübün para tarafını Excel'de bırakır.",
    ours: "Var. Satış ile tahsilat ayrı tutulur, kalan borç görünür, nakit bazlı ciro PT, üyelik ve grup kırılımıyla raporlanır.",
    weight: "fark",
  },
  {
    q: "Fiyatı görebiliyor muyum, yoksa demo sonrası mı söyleniyor?",
    why: "Fiyatı gizlenen üründe karşılaştırma yapamazsınız; süreç uzar.",
    ours: "Fiyat sitede yazıyor ve tek. Paket, kademe, eğitmen limiti ve üye limiti yok.",
    weight: "fark",
  },
  {
    q: "Verimi kim taşıyor, ne kadar sürüyor?",
    why: "Taşıma size bırakılırsa geçiş haftalarca sürer ve çoğu kulüp yarıda bırakır.",
    ours: "Taşımayı biz yapıyoruz. Tarihi birlikte belirliyoruz, iki sistemi birden kullanmıyorsunuz, ilk hafta yanınızdayız.",
    weight: "fark",
  },
  {
    q: "Grup dersi rezervasyonu ve bekleme listesi var mı?",
    why: "Kontenjanlı çalışan stüdyoda bekleme listesi boşalan yeri doldurur; olmadığında slot ölür.",
    ours: "Var. Kontenjan dolduğunda kayıt bekleme listesine geçer, yer açıldığında sıradakine bildirim gider.",
    weight: "giriş şartı",
  },
  {
    q: "Türkçe arayüz ve KVKK uyumu var mı?",
    why: "Yurt dışı ürünlerde Türkçe, TRY faturalama ve yerel ödeme altyapısı çoğu zaman yok.",
    ours: "Var. Ama bunu bir üstünlük olarak saymıyoruz: Türkiye'deki ürünlerin hepsinde var. Bu bir giriş şartı.",
    weight: "giriş şartı",
  },
  {
    q: "Sözleşme süresi ve çıkış koşulu ne?",
    why: "Uzun taahhüt, ürün size uymadığında bağlar.",
    ours: "Teklif aşamasında yazılı olarak netleştiriyoruz. Önce 15 gün demo verisiyle deneyebilirsiniz, kredi kartı istemiyoruz.",
    weight: "giriş şartı",
  },
];

/** Durustluk bolumu: ne DEGILIZ. */
export const NOT_US = [
  {
    t: "Turnike ve geçiş kontrolü ürünü değiliz",
    b: "Donanım ekosistemi kurmak istiyorsanız bugün doğru adres biz değiliz. QR ve turnike yol haritamızda.",
  },
  {
    t: "Online tahsilat yapmıyoruz",
    b: "Satışı, tahsilatı ve kalan borcu kaydedip raporluyoruz; kartla online ödeme bugünkü sürümde yok.",
  },
  {
    t: "Spor okulu ve veli takibi ürünü değiliz",
    b: "Çocuk grupları, veli iletişimi ve okul takvimi etrafında kurulmuş bir ürün arıyorsanız odağımız o değil.",
  },
  {
    t: "En ucuz seçenek değiliz",
    b: "Piyasada bizden ucuz ürünler var ve bazıları uzun ücretsiz dönem veriyor. Fiyatla değil kapsamla yarışıyoruz.",
  },
  {
    t: "Uzun bir müşteri listemiz yok",
    b: "Ürün pilot aşamasında. Size ciro artışı gibi bir rakam söylemiyoruz çünkü elimizde ölçülmüş bir sonuç yok.",
  },
];
