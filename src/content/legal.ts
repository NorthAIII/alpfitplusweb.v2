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
  updated: "23 Eylül 2026",
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
    // IP / ip_hash / tarayici bilgisi cumlelerinin dayanagi (TASK-2.16, B-024
    // k.1 ve k.3) -- her biri koda karsi olculdu, "olmasi gerekene" degil
    // OLANA gore yazildi:
    //  - Ham IP yalniz bellekteki sayacta: `api/demo/route.ts` -> HITS /
    //    WINDOW_MS = 10 dk / LIMIT = 5. Hicbir kayda, e-postaya ya da log
    //    satirina girmiyor (toStore govdesi, toEmail ve toLeadEmail metinleri
    //    ham IP tasimiyor; console.error cagrilarinin hicbiri `ip` almiyor).
    //  - Kayda giren ozet: `hashIp` = HMAC-SHA256(ip, IP_HASH_SALT). Depodaki
    //    amaci hiz siniri sayacidir (IP basina saatte 5 -- v1
    //    `pocketbase/README.md` -> Hiz siniri, `ip_hash` indeksi) ve kaydin bir
    //    sutunu oldugu icin 12 ay saklama cron'uyla kayitla BIRLIKTE siliniyor.
    //  - Tarayici bilgisi (`ua`) okunuyor ama HICBIR kalici kayda girmiyor:
    //    depo govdesi beyaz listesi disinda, iki e-posta metninde de yok. Tek
    //    kalicilasma yolu `LEAD_FILE_PATH` ve o yayinda TANIMLI DEGIL (olculdu
    //    2026-09-23, `vercel env ls`: Production/Preview/Development'ta yok).
    //    Bu yuzden liste kalemi cikarildi -- eskiden fazlasini soyluyordu.
    // Olcum ve yurt disi aktarim beyanlari BU TASK'IN DISINDA (TASK-2.17);
    // aktarimin hukuki dayanagi hukukcunundur (B-008).
    {
      title: "İşlenen kişisel veriler",
      blocks: [
        { type: "p", text: "Demo talep formunu doldurduğunuzda aşağıdaki veriler işlenir:" },
        {
          type: "ul",
          items: [
            "Kimlik verisi: ad ve soyad",
            "İletişim verisi: telefon numarası ve elektronik posta adresi",
            "İşletme verisi: kulüp veya stüdyo adı, şube sayısı, kulüp tipi",
            "Serbest metin: formun mesaj alanına yazdıklarınız",
            "İşlem güvenliği verisi: talebin gönderildiği tarih ve saat ile IP adresinizden üretilen özet",
          ],
        },
        {
          type: "p",
          text: "Demo talebinizi gönderdiğinizde IP adresiniz iki yerde kullanılır. Aynı adresten kısa aralıklarla çok sayıda talep gönderilmesini engellemek için, on dakikalık bir pencerede kaç talep geldiğini sayan bir sayaçta kullanılır; bu sayaç yalnızca sunucunun geçici belleğinde durur ve hiçbir kayda yazılmaz. Talebinizin kaydına ise IP adresinizin kendisi değil, gizli bir anahtarla ondan üretilen bir özet yazılır; bu özet de aynı adresten gelen talepleri saymaya yarar ve kaydınız silindiğinde onunla birlikte silinir.",
        },
        {
          type: "p",
          text: "Demo talebinizi işlerken tarayıcınızın kendini tanıttığı bilgi de okunur; bu bilgi talebinizin kaydına yazılmaz ve bize gelen bildirimde yer almaz.",
        },
        {
          type: "p",
          text: "Formu doldurmadan siteyi yalnızca gezdiğinizde, sizden ad, telefon ve elektronik posta gibi kimlik ve iletişim verisi toplanmaz. Buna karşılık her ziyaret, aşağıda Aktarım başlığında anlatılan erişim kaydına bir satır düşürür; o satırda IP adresiniz ve tarayıcınızın kendini tanıttığı bilgi yer alır.",
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
            "Talebinizin bize ulaştığını elektronik posta ile size bildirmek",
            "Kulübünüze uygun bir demo görüşmesi planlamak",
            "Talebiniz üzerine fiyat ve teklif bilgisi iletmek",
            "Talep kayıtlarını tutmak ve hizmet kalitemizi ölçmek",
            "Formun kötüye kullanılmasını önlemek: aynı adresten gelen talep sayısını sınırlamak",
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
    // Aktarim ve olcum beyanlarinin dayanagi (TASK-2.17, B-024 k.2). Her kalem
    // 2026-09-23'te YENIDEN olculdu; devralinan rakam kullanilmadi:
    //  - Barindirma ABD: repoda `vercel.json` ve `preferredRegion` YOK, yani
    //    Vercel'in varsayilani gecerli. Canli olcum: `/api/demo` yanitinin
    //    `x-vercel-id` basligi uc kosumda da `fra1::iad1::…` -> fonksiyon
    //    bolgesi `iad1`. Vercel'in kendi belgesi: iad1 = us-east-1,
    //    Washington, D.C., USA (vercel.com/docs/edge-network/regions).
    //  - Sunucu Almanya: RDAP 178.104.140.36 -> Hetzner Online GmbH, ag adi
    //    CLOUD-NBG1, country DE; ters DNS `…clients.your-server.de`.
    //  - Resend ABD: saglayicinin KENDI beyani, resend.com/legal/dpa ->
    //    "Company's primary processing operations take place in the United
    //    States" (privacy-policy ayni seyi yaziyor). v1'in 2026-07-28 olcumu
    //    bugun de geciyor -- kopyalanmadi, kaynaga geri gidildi.
    //  - Resend gonderim bolgesi: `GET api.resend.com/domains` ->
    //    alpfitplus.com region `eu-west-1` (Irlanda), status verified. Iki
    //    kalem AYRI YAZILIR cunku bolge ayari verinin evini SOYLEMEZ -- v1'in
    //    kendi dersi (`bunker-ortami.md`: "Ireland secildi -> veri AB'de"
    //    yanlis cikmisti). Gonderim Irlanda, saklama ABD.
    //  - Ekip kutusu: `DEMO_TO` alan adi `kiwiailab.com`, MX = aspmx.l.google
    //    .com (Google Workspace). Yalniz "ABD merkezli" yazildi; verinin hangi
    //    bolgede durdugu OLCULMEDI, o yuzden yazilmadi.
    //  - Erisim kaydi: `bunker-nginx` LogConfig `{}` (rotasyon inmiyor),
    //    615.853 satirin 604.452'si ham IPv4 ile basliyor, 5.647 benzersiz IP,
    //    pencere 2026-08-22 -> 2026-09-23 ve rotasyon dosyasi 0. Bu yuzden
    //    metin HICBIR saklama suresi yazmaz, "bugun isletmiyoruz" der.
    //  - Umami semasi: information_schema taramasinda IP sutunu yok (tek iki
    //    eslesme `board.description` / `report.description`). DIKKAT: `session`
    //    yalniz ulke/bolge/sehir DEGIL, ayrica browser/os/device/screen/
    //    language tutuyor -- TASK-2.01'in ozeti bu kalemde eksikti, metin
    //    olculen tam listeye gore yazildi.
    // "Birlestirilmez" bir TAAHHUTTUR, olcum degil. Hukuki sebep bolumune
    // dokunulmadi: m.9 dayanagi hukukcunundur (B-008).
    //
    // Anahtarin yetkisi (QUICK-002 / B-062). Cumle TASK-1.15'te yazildi ve o gun
    // DOGRUYDU; TASK-2.07 bildirim durumunu geri yazan `PATCH` yolunu acinca
    // sessizce bayatladi -- "yalnizca yeni kayit olusturabilir" artik olculenden
    // DARDI. 2026-09-23'te iki taraf da yeniden olculdu (devralinan ozet degil):
    //  - Ucun depoya attigi yontem kumesi: `src/app/api/demo/route.ts` ->
    //    `toStore` POST /lead, `notifyStore` PATCH /lead/{id}. Baska depo
    //    cagrisi yok, okuma cagrisi hic yok.
    //  - Anahtarin yetki yuzeyi (komsu depo, salt okunur):
    //    ../Alpfitplus-website.v1/pocketbase/pb_hooks/lead.pb.js -> token'la
    //    acilan TAM IKI rota (`routerAdd('POST','/lead')` :20 +
    //    `routerAdd('PATCH','/lead/{id}')` :111); PATCH beyaz listesi
    //    lead_lib.js:69-70 -> yalniz `notify_team` / `notify_lead`. Okuma rotasi
    //    yok, yani cumlenin "okuyamaz" yarisi CURUMEDI ve oldugu gibi korundu.
    // Kapi: tests/legal-consistency.test.ts dal 4 -- olculen yontem kumesi ile
    // metnin saydigi yetkiler iki yonlu eslesir; biri kayarsa kirmizi doner.
    {
      title: "Aktarım",
      blocks: [
        {
          type: "p",
          text: "Demo talebiniz, kendi sunucumuzdaki bir kayıt veritabanına yazılır. Sunucu bize aittir ve Almanya'da (Nürnberg) bir veri merkezinde durur; kaydın tutulduğu yer burasıdır ve aşağıda saydığımız tedarikçiler dışında hiç kimseye veri gitmez. Kayıtları yalnızca yetkili yönetici hesabımız görebilir: veritabanının dışarıya açık okuma kuralları kapalıdır ve sitenin kullandığı anahtar yalnızca iki şey yapabilir — yeni bir talep kaydı oluşturabilir, bir de bildirim ve onay e-postalarının gönderilip gönderilmediğini kayda yazabilir; var olan kayıtları okuyamaz.",
        },
        {
          type: "p",
          text: "Kişisel verileriniz, yalnızca demo talebinizin karşılanması amacıyla ve amacın gerektirdiği ölçüde, aşağıdaki hizmetleri aldığımız tedarikçilere aktarılır. Liste her tedarikçinin rolünü ve verinizin işlendiği ülkeyi gösterir:",
        },
        {
          type: "ul",
          items: [
            "Barındırma — sitenin ve demo talep formunun çalıştığı altyapı (Vercel, Amerika Birleşik Devletleri merkezli): form ucumuz sağlayıcının Washington, D.C. bölgesindeki sunucularında çalışır, yani formu gönderdiğinizde verileriniz önce orada işlenir",
            "Sunucu barındırma — kayıt veritabanımızın ve ölçüm yazılımımızın çalıştığı sunucunun bulunduğu veri merkezi (Hetzner, Almanya — Nürnberg)",
            "Elektronik posta gönderimi — talebinizin bize bildirilmesi ve size onay e-postası gönderilmesi (Resend, Amerika Birleşik Devletleri merkezli): gönderim İrlanda bölgesinden yapılır, ancak sağlayıcı kendi veri işleme sözleşmesinde müşteri verisini Amerika Birleşik Devletleri'nde işlediğini yazar",
            "Ekip posta kutusu — bize gelen bildirimin düştüğü kutu (Google Workspace, Amerika Birleşik Devletleri merkezli)",
          ],
        },
        {
          type: "p",
          text: "Bu listenin pratik karşılığı şudur: yurt dışına aktarım koşullu bir ihtimal değil, her demo talebinde olan şeydir. Talebiniz önce Amerika Birleşik Devletleri'ndeki form ucumuzda işlenir, ardından Almanya'daki sunucumuza yazılır; bildirim ve onay e-postaları Amerika Birleşik Devletleri merkezli sağlayıcılar üzerinden iletilir.",
        },
        {
          type: "p",
          text: "Siteyi kaç kişinin gezdiğini ölçmek için, kayıt veritabanıyla aynı sunucuda kendi kurduğumuz, çerezsiz bir ölçüm yazılımı (Umami) kullanıyoruz. Ölçüm için üçüncü bir tarafa veri göndermiyoruz. Bu yazılımın kendi veritabanında IP adresiniz için bir alan yoktur; orada ziyaretten türetilmiş ülke, bölge ve şehir ile tarayıcı, işletim sistemi, cihaz türü, ekran boyutu ve dil bilgisi durur. Bu kayıtlar demo talebinizdeki bilgilerle birleştirilmez.",
        },
        {
          type: "p",
          text: "Ölçüm yazılımı kendi sunucumuzdan yüklendiği için, siteyi her gezişinizde o sunucunun erişim kaydına bir satır düşer ve bu satırda IP adresiniz ile tarayıcınızın kendini tanıttığı bilgi yer alır. Kayıt sunucumuzda kalır; bir başkasına gönderilmez, dışarıya aktarılmaz. Ne kadar saklandığı aşağıda Saklama süresi başlığında yazılıdır.",
        },
        {
          type: "p",
          text: "Verileriniz pazarlama amacıyla üçüncü taraflara satılmaz veya devredilmez.",
        },
      ],
    },
    {
      title: "Saklama süresi",
      blocks: [
        {
          type: "p",
          text: "Demo talebinizin sunucumuzdaki kaydı, oluşturulmasından 12 ay sonra, günlük çalışan bir temizlik işiyle otomatik olarak silinir. Talebiniz üzerine daha erken bir tarihte de silinir, yok edilir veya anonim hâle getirilir.",
        },
        {
          type: "p",
          text: "Talebiniz ayrıca elektronik posta ile bize bildirilir; geçerli bir elektronik posta adresi verdiyseniz size de bir onay e-postası gönderilir. Bize gelen bildirimin bir kopyası ekip posta kutumuzda kalır; her iki e-postanın birer kopyası da e-postayı ileten sağlayıcıda kalır. Bu kopyalar yukarıdaki 12 aylık süreye bağlı değildir; bugün için otomatik bir silme süresi işletmiyoruz.",
        },
        {
          type: "p",
          text: "Siteyi gezdiğinizde sunucumuzun erişim kaydına düşen satırlar da bu 12 aylık süreye bağlı değildir: bugün için o kayıtlar üzerinde otomatik bir silme süresi işletmiyoruz. Bir silme süresi işletmeye başladığımızda bu metne yazılacaktır.",
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
  updated: "23 Eylül 2026",
  intro: `Bu gizlilik politikası ${SITE.domain} tanıtım sitesi için geçerlidir. Alpfit Plus uygulamasında saklanan kulüp ve üye verileri için kulübünüzle imzalanan sözleşme ve uygulamanın kendi gizlilik metni geçerlidir.`,
  sections: [
    {
      title: "Topladığımız veriler",
      blocks: [
        {
          type: "p",
          text: "Siteyi yalnızca gezdiğinizde sizden ad, telefon veya elektronik posta gibi kimlik ve iletişim bilgisi toplamıyoruz; ziyaretinizde sunucumuzun erişim kaydına düşen bilgiler aşağıda «Çerezler ve ölçüm» başlığında yazılıdır. Yalnızca demo talep formunu doldurduğunuzda verdiğiniz bilgileri alıyoruz.",
        },
        {
          type: "ul",
          items: [
            "Ad ve soyad",
            "Telefon ve elektronik posta adresi",
            "Kulüp adı, şube sayısı ve kulüp tipi",
            "Formun mesaj alanına yazdıklarınız",
            "Talebin gönderildiği tarih ve saat ile IP adresinizden üretilen özet",
          ],
        },
        {
          type: "p",
          text: "Tarayıcınızın kendini tanıttığı bilgi talebinizin kaydına yazılmaz. IP adresinizin neden kullanıldığı ve kayda IP'nin kendisi yerine neden bir özetin yazıldığı, KVKK Aydınlatma Metni'nin İşlenen kişisel veriler başlığında yazılıdır.",
        },
      ],
    },
    {
      title: "Çerezler ve ölçüm",
      blocks: [
        {
          type: "p",
          text: "Bu sitede reklam çerezi, reklam ağı kodu veya sizi siteler arasında izleyen bir takip pikseli kullanmıyoruz. Site, çalışması için gerekli olmayan hiçbir çerez yerleştirmez.",
        },
        {
          type: "p",
          text: "Hangi sayfaların ziyaret edildiğini ve demo talep yolunun kullanılıp kullanılmadığını görmek için, kendi sunucumuzda çalışan çerezsiz bir ölçüm yazılımı (Umami) kullanıyoruz. Bu yazılım tarayıcınıza çerez yerleştirmez ve kendi veritabanında IP adresiniz için bir alan tutmaz; orada ziyaretten türetilmiş ülke, bölge ve şehir ile tarayıcı, işletim sistemi, cihaz türü, ekran boyutu ve dil bilgisi durur.",
        },
        {
          type: "p",
          text: "Ölçüm yazılımı kendi sunucumuzdan yüklendiği için, siteyi her gezişinizde o sunucunun erişim kaydına bir satır düşer; bu satırda IP adresiniz ve tarayıcınızın kendini tanıttığı bilgi yer alır. Kayıt sunucumuzda kalır ve bir başkasına gönderilmez. Bu kayıtların ne kadar saklandığı KVKK Aydınlatma Metni'nin Saklama süresi başlığında yazılıdır.",
        },
        {
          type: "p",
          text: "Ölçüme yalnızca ziyaret edilen sayfanın adresi ve tıklanan bağlantının hangi bölümde olduğu gibi bilgiler gider; adres satırında soru işaretinden sonra gelen kısım ölçüme hiç gönderilmez. Adınız, telefon numaranız, elektronik posta adresiniz ve forma yazdığınız mesaj ölçüme gönderilmez.",
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
        {
          type: "p",
          text: "Talebiniz bize elektronik posta ile bildirilir ve kendi sunucumuzdaki kayıt veritabanında saklanır; geçerli bir elektronik posta adresi verdiyseniz talebinizi aldığımıza dair size bir onay e-postası göndeririz. Kaydın nerede durduğu, kimin eriştiği ve ne kadar saklandığı KVKK Aydınlatma Metni'nin Aktarım ve Saklama süresi başlıklarında yazılıdır.",
        },
      ],
    },
    {
      title: "Güvenlik",
      blocks: [
        {
          type: "p",
          text: "Site ve talep kayıtları erişim kontrolü altında tutulur, aktarım şifreli bağlantı üzerinden yapılır. Kayıtlara yalnızca yetkili yönetici hesabımız erişebilir.",
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
