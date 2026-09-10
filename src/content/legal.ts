/**
 * Yasal metinler.
 *
 * KAPSAM SINIRI: Bu metinler ALPFITPLUS.COM TANITIM SITESI ve demo talep formu
 * icindir. Uygulamanin (app.alpfitplus.com) kendi aydinlatma metni ayridir ve
 * uye saglik verisi gibi ozel nitelikli veriyi orada ele alir.
 *
 * v1 denetimi (D-03) yayindaki metinlerde "bu metin ornektir" ibaresi buldu ve
 * bunu guven kaybi + hukuki acik olarak isaretledi. Bu yuzden burada ibare YOK;
 * metinler sitenin GERCEK veri akisini anlatir. Yayina cikmadan once hukuk
 * danismani gozden gecirmelidir.
 */
import { CONTACT, SITE } from "./site";

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "h"; text: string };

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: { title: string; blocks: LegalBlock[] }[];
};

const CONTROLLER = `${SITE.maker.name} (${CONTACT.city})`;

export const KVKK: LegalDoc = {
  slug: "kvkk",
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında alpfitplus.com ziyaretçileri ve demo talep edenler için aydınlatma metni.",
  updated: "10 Eylül 2026",
  intro: `Bu aydınlatma metni, ${SITE.domain} adresini ziyaret ettiğinizde ve demo talep formunu doldurduğunuzda kişisel verilerinizin nasıl işlendiğini açıklar. Alpfit Plus uygulamasının kendisinde (kulüp üyesi, antrenör, diyetisyen ve yönetim hesapları) işlenen veriler için ayrı bir aydınlatma metni uygulanır ve bu metin onu kapsamaz.`,
  sections: [
    {
      title: "Veri sorumlusu",
      blocks: [
        {
          type: "p",
          text: `Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla ${CONTROLLER} tarafından işlenmektedir.`,
        },
        {
          type: "p",
          text: `İletişim: ${CONTACT.support} · ${CONTACT.whatsapp.display}`,
        },
      ],
    },
    {
      title: "İşlenen kişisel veriler",
      blocks: [
        { type: "p", text: "Demo talep formunu doldurduğunuzda aşağıdaki verileri iletmiş olursunuz:" },
        {
          type: "ul",
          items: [
            "Kimlik verisi: ad ve soyad",
            "İletişim verisi: telefon numarası ve elektronik posta adresi",
            "İşletme verisi: kulüp veya stüdyo adı, şube sayısı, kulüp tipi",
            "Serbest metin: formun mesaj alanına yazdıklarınız",
            "İşlem güvenliği verisi: talebin gönderildiği tarih ve saat ile tarayıcı bilgisi",
          ],
        },
        {
          type: "p",
          text: "Formu doldurmadan siteyi yalnızca gezdiğinizde, sizden kimlik veya iletişim verisi toplanmaz.",
        },
      ],
    },
    {
      title: "İşleme amaçları",
      blocks: [
        {
          type: "ul",
          items: [
            "Demo talebinizi karşılamak ve sizinle iletişime geçmek",
            "Kulübünüze uygun bir demo görüşmesi planlamak",
            "Talebiniz üzerine fiyat ve teklif bilgisi iletmek",
            "Talep kayıtlarını tutmak ve hizmet kalitemizi ölçmek",
          ],
        },
      ],
    },
    {
      title: "Hukuki sebep",
      blocks: [
        {
          type: "p",
          text: "Verileriniz, KVKK'nın 5. maddesinin ikinci fıkrasının (c) bendi uyarınca bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması ve (f) bendi uyarınca veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması hukuki sebeplerine dayanılarak, form üzerinden verdiğiniz açık rıza ile birlikte işlenir.",
        },
      ],
    },
    {
      title: "Aktarım",
      blocks: [
        {
          type: "p",
          text: "Kişisel verileriniz, yalnızca demo talebinizin karşılanması amacıyla ve amacın gerektirdiği ölçüde, barındırma ve elektronik posta gönderimi hizmeti aldığımız tedarikçilerimize aktarılabilir. Verileriniz pazarlama amacıyla üçüncü taraflara satılmaz veya devredilmez.",
        },
      ],
    },
    {
      title: "Saklama süresi",
      blocks: [
        {
          type: "p",
          text: "Demo talebinize ilişkin veriler, talebin sonuçlanmasından itibaren en fazla iki yıl saklanır. Bu sürenin sonunda veya talebiniz üzerine daha erken bir tarihte silinir, yok edilir veya anonim hâle getirilir.",
        },
      ],
    },
    {
      title: "Haklarınız",
      blocks: [
        { type: "p", text: "KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:" },
        {
          type: "ul",
          items: [
            "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
            "İşlenmişse buna ilişkin bilgi talep etme",
            "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
            "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
            "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
            "Silinmesini veya yok edilmesini isteme",
            "Düzeltme, silme ve yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme",
            "Münhasıran otomatik sistemler ile analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
            "Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
          ],
        },
        {
          type: "p",
          text: `Taleplerinizi ${CONTACT.support} adresine iletebilirsiniz. Başvurunuz en geç otuz gün içinde sonuçlandırılır.`,
        },
      ],
    },
  ],
};

export const PRIVACY: LegalDoc = {
  slug: "gizlilik",
  title: "Gizlilik Politikası",
  description:
    "alpfitplus.com tanıtım sitesinin gizlilik politikası: hangi verileri topluyoruz, neden topluyoruz ve nasıl koruyoruz.",
  updated: "10 Eylül 2026",
  intro: `Bu gizlilik politikası ${SITE.domain} tanıtım sitesi için geçerlidir. Alpfit Plus uygulamasında saklanan kulüp ve üye verileri için kulübünüzle imzalanan sözleşme ve uygulamanın kendi gizlilik metni geçerlidir.`,
  sections: [
    {
      title: "Topladığımız veriler",
      blocks: [
        {
          type: "p",
          text: "Siteyi yalnızca gezdiğinizde sizden kimlik veya iletişim bilgisi toplamıyoruz. Yalnızca demo talep formunu doldurduğunuzda verdiğiniz bilgileri alıyoruz.",
        },
        {
          type: "ul",
          items: [
            "Ad ve soyad",
            "Telefon ve elektronik posta adresi",
            "Kulüp adı, şube sayısı ve kulüp tipi",
            "Formun mesaj alanına yazdıklarınız",
          ],
        },
      ],
    },
    {
      title: "Çerezler",
      blocks: [
        {
          type: "p",
          text: "Bu sitede reklam çerezi veya üçüncü taraf takip pikseli kullanmıyoruz. Site, çalışması için gerekli olmayan hiçbir çerez yerleştirmez.",
        },
      ],
    },
    {
      title: "Verilerin kullanımı",
      blocks: [
        {
          type: "p",
          text: "Verilerinizi yalnızca demo talebinize dönüş yapmak ve size uygun bir görüşme planlamak için kullanırız. Verilerinizi satmayız, reklam amacıyla üçüncü taraflarla paylaşmayız.",
        },
      ],
    },
    {
      title: "Güvenlik",
      blocks: [
        {
          type: "p",
          text: "Site ve talep kayıtları erişim kontrolü altında tutulur, aktarım şifreli bağlantı üzerinden yapılır. Verilere yalnızca demo süreciyle ilgilenen ekip üyeleri erişebilir.",
        },
      ],
    },
    {
      title: "Silme talebi",
      blocks: [
        {
          type: "p",
          text: `Bize ilettiğiniz bilgilerin silinmesini istiyorsanız ${CONTACT.support} adresine yazmanız yeterlidir. Talebiniz en geç otuz gün içinde sonuçlandırılır.`,
        },
      ],
    },
    {
      title: "Uygulama mağazaları",
      blocks: [
        {
          type: "p",
          text: "Alpfit Plus mobil uygulamaları kulüp üyelerine ve antrenörlerine yöneliktir ve kulübünüz aracılığıyla kullanılır. Uygulamada işlenen veriler, kulübünüz ile aramızdaki sözleşme ve uygulamanın kendi gizlilik metni kapsamındadır.",
        },
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  slug: "kullanim-kosullari",
  title: "Kullanım Koşulları",
  description: "alpfitplus.com tanıtım sitesinin kullanım koşulları.",
  updated: "10 Eylül 2026",
  intro: `Bu koşullar ${SITE.domain} tanıtım sitesinin kullanımı için geçerlidir. Alpfit Plus yazılımının kullanımı, kulübünüzle imzalanan ayrı bir hizmet sözleşmesine tabidir.`,
  sections: [
    {
      title: "Sitenin amacı",
      blocks: [
        {
          type: "p",
          text: "Bu site Alpfit Plus ürününü tanıtmak ve demo talebi almak için yayımlanmıştır. Site üzerinden hesap açılmaz, ödeme alınmaz ve yazılım kullanıma sunulmaz.",
        },
      ],
    },
    {
      title: "İçeriğin doğruluğu",
      blocks: [
        {
          type: "p",
          text: "Sitedeki ürün açıklamaları yayın tarihindeki ürün durumunu yansıtır. Yolda olan ve yol haritasında bulunan özellikler ayrı ayrı belirtilir ve bunlar bir taahhüt oluşturmaz.",
        },
        {
          type: "p",
          text: "Yayınlanan fiyatlar Türk lirası cinsindendir ve aksi belirtilmedikçe katma değer vergisi hariçtir. Fiyatlar güncellenebilir; bağlayıcı fiyat, size iletilen yazılı tekliftir.",
        },
      ],
    },
    {
      title: "Rakip ürünlere ilişkin bilgiler",
      blocks: [
        {
          type: "p",
          text: "Sitede yer alan karşılaştırmalar, ilgili firmaların kendi internet sitelerinde yayımladığı bilgilere dayanır ve erişim tarihi belirtilir. Bu karşılaştırmalar bizim hesabımızdır, üçüncü firmaların size vereceği teklifi göstermez.",
        },
      ],
    },
    {
      title: "Fikri mülkiyet",
      blocks: [
        {
          type: "p",
          text: `Sitedeki metin, görsel ve arayüz tasarımları ${SITE.maker.name}'a aittir. İzinsiz kopyalanamaz ve çoğaltılamaz.`,
        },
      ],
    },
    {
      title: "Ekran görüntüleri",
      blocks: [
        {
          type: "p",
          text: "Sitede kullanılan ürün ekran görüntüleri örnek verilerle üretilmiştir. Gerçek bir kulübün veya kişinin verisi gösterilmemektedir.",
        },
      ],
    },
    {
      title: "İletişim",
      blocks: [
        { type: "p", text: `Sorularınız için ${CONTACT.support} adresine yazabilirsiniz.` },
      ],
    },
  ],
};

export const LEGAL_DOCS = [KVKK, PRIVACY, TERMS];
