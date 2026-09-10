/**
 * SSS — kaynak: rekabet/mevcut-duzen.md (degisim maliyeti itirazlari) +
 * fiyat/model.md + SATIS-SPEC.md. Cevaplarda vaat siniri korunur.
 */
export type Faq = { q: string; a: string };

export const FAQ_HOME: Faq[] = [
  {
    q: "Kurulum ne kadar sürüyor, verilerimi kim taşıyor?",
    a: "Kurulumu ve veri taşımayı biz yapıyoruz, kulübünüzü tek başına bırakmıyoruz. Elinizdeki üye listesi hangi biçimde olursa olsun demo görüşmesinde birlikte bakar, taşıma planını netleştiririz. Veri taşıma sözleşme sonrasında yapılır.",
  },
  {
    q: "Antrenörlerim öğrenebilir mi?",
    a: "Antrenörün kullandığı yüzey kendi telefonundaki uygulamadır: günün takvimi, öğrenci listesi ve tek dokunuşla yoklama. Kendimize koyduğumuz kriter net, ekip WhatsApp ve Excel daha kolaydı diyemeyecek kadar akıcı olmak.",
  },
  {
    q: "Bir ay boyunca iki sistemi birden mi kullanacağım?",
    a: "Hayır. Geçiş planını tek seferlik yapıyoruz. 15 günlük deneme demo verisiyle yürür, gerçek verinize dokunmaz. Sözleşme sonrasında taşıma yapılır ve tek sistemde devam edersiniz.",
  },
  {
    q: "Turnike veya kart okuyucu almam gerekiyor mu?",
    a: "Hayır. Alpfit Plus donanıma bağlı değildir. Panel ve mobil uygulama üzerinden çalışır. Turnike ve QR ile giriş kontrolü yol haritasındadır, bugünkü ürünün parçası değildir.",
  },
  {
    q: "Üye mobil uygulaması ayrı ücretli mi?",
    a: "Hayır. Üye uygulaması da antrenör uygulaması da şube fiyatına dâhildir. Mobil uygulama için ayrı bir paket veya ek ücret yoktur.",
  },
  {
    q: "Diyetisyen modülü nasıl çalışıyor, diyetisyenim yoksa ne olur?",
    a: "Kulüp kendi lisanslı diyetisyenini platforma bağlar. Yasal sorumluluk lisanslı uzmanda kalır. Kulübünüzde diyetisyen yoksa modülü yönetim panelinden kapalı tutabilirsiniz, ileride açtığınızda veriler yerinde durur.",
  },
  {
    q: "Kaç şube ve kaç eğitmen ekleyebilirim?",
    a: "Eğitmen ve üye sayısında limit yoktur. Şube sayısında da limit yoktur, fiyat şube başınadır. İlk şube ₺1.500, ikinci şubeden itibaren her şube ₺1.200'dir. Tüm fiyatlar KDV hariçtir.",
  },
  {
    q: "Online ödeme alabiliyor muyum?",
    a: "Bugün hayır. Alpfit Plus satışı, tahsilatı ve kalan borcu kaydeder ve raporlar, ancak kart ile online tahsilat bugünkü sürümde yoktur. Online ödeme yol haritasındadır.",
  },
  {
    q: "Verilerim nerede duruyor?",
    a: "Veri sorumlusu Kiwi AI Lab'dır ve altyapı KVKK ile uyumlu kurgulanmıştır. Sağlık verisi içeren modüller yönetim panelinden açılıp kapatılabilir, hesap kapatıldığında silme zinciri işler. Ayrıntı için KVKK aydınlatma metnimize bakabilir veya demo görüşmesinde sorabilirsiniz.",
  },
  {
    q: "Ürün hangi aşamada?",
    a: "v1 hazır ve şu anda bir stüdyoda pilot olarak test ediliyor. Kampanya derinleşmesi, churn paneli ve gelişmiş raporlama yolda. Online ödeme, QR ve turnike girişi ile yapay zekâ destekli analiz yol haritasında.",
  },
];

export const FAQ_PRICING: Faq[] = [
  {
    q: "Fiyatlar KDV dâhil mi?",
    a: "Hayır, yayınlanan tüm fiyatlar KDV hariçtir. İşletme alıcı olduğu için KDV'yi indirebilirsiniz. Rakiplerin çoğu da fiyatı bu şekilde yayınlar.",
  },
  {
    q: "Kurulum ücretinden nasıl muaf olurum?",
    a: "Yıllık peşin ödemede şube başına ₺3.000 olan kurulum ücreti alınmaz. Aylık ödemede kurulum 2 ila 3 ay taksitlendirilebilir.",
  },
  {
    q: "Yıllık peşin ödemede ayrıca yüzde indirimi var mı?",
    a: "Hayır. Kurulum muafiyeti zaten yıllık ödemenin indirimidir. Üst üste iki indirim uygulamıyoruz. Tek şubede yıllık peşin, aylık yola göre yaklaşık yüzde 14 avantaj sağlar ve şube sayısı arttıkça bu oran büyür.",
  },
  {
    q: "Paket veya kademe var mı?",
    a: "Yok. Tek fiyat, şube başına. Modül kısıtı, eğitmen limiti ve üye limiti yoktur. Diyetisyen modülü, üye uygulaması, antrenör uygulaması ve çok şube cockpit her şubede dâhildir.",
  },
  {
    q: "15 günlük deneme nasıl işliyor?",
    a: "Deneme demo verisiyle yürür. Gerçek bir kulübün akışını görürsünüz, kendi verileriniz taşınmaz ve kurulum ücreti alınmaz. Kredi kartı istemiyoruz.",
  },
  {
    q: "Sözleşmeyi ne zaman bitirebilirim?",
    a: "Sözleşme süresi ve çıkış koşulları teklif aşamasında yazılı olarak netleştirilir. Demo görüşmesinde bunu da konuşuruz.",
  },
];
