/**
 * Segment acilis sayfalari.
 * Kaynak: alpfit-plus-satis/README.md segment tablosu + rekabet/ozet.md §4 konumlanma bosluğu.
 * Bosluk tespiti: reformer-pilates + boks/dovus + CrossFit'i AYNI uründe, donanimsiz
 * ve sade bicimde hedefleyen urun yok.
 */

export type Segment = {
  slug: string;
  name: string;
  short: string;
  hero: string;
  intro: string;
  /** Bu segmentin gunluk isletme derdi. */
  pains: { title: string; body: string }[];
  /** Alpfit Plus'in o derde karsiligi. */
  answers: { title: string; body: string }[];
  /** Segmente ozel one cikan moduller (MODULES key'leri). */
  modules: string[];
  /** Segment ozel sorular. */
  faq: { q: string; a: string }[];
  accent: string;
};

export const SEGMENTS: Segment[] = [
  {
    slug: "pilates-reformer",
    name: "Reformer ve Pilates Stüdyoları",
    short: "Sabit kapasite, seans paketi, no-show",
    hero: "Reformer stüdyosu için randevu, seans hakkı ve no-show tek akışta",
    intro:
      "Sekiz reformer'ınız var, bir seans sekiz kişilik. Kapasite sabit olduğu için gelmeyen üye doğrudan ciro kaybı demek. Alpfit Plus bu üç şeyi birbirine bağlar: kim kayıtlı, kaç hakkı kaldı, gelmezse ne olur.",
    pains: [
      {
        title: "Gelmeyen üye slotu öldürüyor",
        body: "Sekiz kişilik seansta iki boş matın karşılığı yok. WhatsApp'tan iptal eden üyenin yeri kimseye gitmiyor.",
      },
      {
        title: "Seans hakkı defterde tutuluyor",
        body: "Kim kaç seans aldı, kaç tanesini kullandı. Üye itiraz ettiğinde elinizde kayıt olmuyor.",
      },
      {
        title: "Telafi seansı kaosu",
        body: "İptal edilen seans telafiye yazılıyor ama nerede tutulduğu belli değil. Ay sonunda kimin ne hakkı olduğu tartışma konusu.",
      },
      {
        title: "Eğitmen primi tahminle hesaplanıyor",
        body: "Hangi eğitmen kaç seans verdi, hangi saat doldu. Prim konuşması her ay yeniden başlıyor.",
      },
    ],
    answers: [
      {
        title: "Bekleme listesi boş matı doldurur",
        body: "Bir üye iptal ettiğinde sıradaki üyeye otomatik bildirim gider. Onay penceresi dolarsa sıra bir sonrakine geçer. Siz aramazsınız.",
      },
      {
        title: "Kalan hak sayacı tek doğru sayıyı gösterir",
        body: "Üye kendi telefonunda, eğitmen kendi ekranında, yönetim panelde aynı sayıyı görür. İtiraz konusu kalmaz.",
      },
      {
        title: "No-show adaleti kural olarak yazılı",
        body: "İptal eşiğini siz belirlersiniz. Eşiğin içinde iptal hakkı iade eder, dışında yakar. Üye basmadan önce ne olacağını görür.",
      },
      {
        title: "Doluluk ve eğitmen performansı rakamla",
        body: "Hangi saat dolu, hangi eğitmen kaç ders verdi, ciro katkısı ne. Prim kararı veriyle verilir.",
      },
    ],
    modules: ["takvim", "uyelik", "grup", "antrenor-perf", "diyetisyen"],
    faq: [
      {
        q: "Seans paketi ve süreli üyeliği bir arada satabiliyor muyum?",
        a: "Evet. Süreli üyelik ve sayaçlı seans paketi ayrı ayrı tanımlanır, aynı üyede ikisi birden bulunabilir.",
      },
      {
        q: "Reformer sayısını kontenjan olarak tanımlayabilir miyim?",
        a: "Evet. Grup dersi programında kontenjan tanımlanır, kontenjan dolduğunda kayıt bekleme listesine düşer.",
      },
      {
        q: "Üye kendi telefonundan grup dersini iptal edebiliyor mu?",
        a: "Evet. Üye iptal ettiğinde hakkının ne olacağını basmadan önce görür, iptal sonrası yer bekleme listesindeki sıradaki üyeye açılır.",
      },
    ],
    accent: "sage",
  },
  {
    slug: "boks-dovus",
    name: "Boks ve Dövüş Sporları",
    short: "Grup dersi, yoklama, aidat ve borç",
    hero: "Boks ve dövüş kulübü için grup programı, yoklama ve aidat takibi",
    intro:
      "Kulübünüz haftalık sabit programla dönüyor. Asıl dert dersin kendisi değil, kimin geldiği ve kimin aidatını ödemediği. Alpfit Plus yoklamayı antrenörün telefonuna, borcu yönetimin ekranına taşır.",
    pains: [
      {
        title: "Yoklama deftere alınıyor",
        body: "Kim geldi kim gelmedi kağıtta kalıyor. Ay sonunda kimin ne kadar geldiğini kimse çıkaramıyor.",
      },
      {
        title: "Aidat takibi kişisel hafızada",
        body: "Kim ödedi kim ödemedi resepsiyonun aklında. Biri izne çıkınca borç takibi duruyor.",
      },
      {
        title: "Sabah ve akşam grupları karışıyor",
        body: "Aynı üye farklı saatlere geliyor, hangi gruba yazılı olduğu net değil.",
      },
      {
        title: "Devam etmeyen üye geç fark ediliyor",
        body: "Üç haftadır gelmeyen üye ancak aidat gecikince görülüyor. O noktada geri kazanmak zor.",
      },
    ],
    answers: [
      {
        title: "Yoklama antrenörün telefonundan",
        body: "Antrenör dersin başında roster'ı açar, tek dokunuşla işaretler. Yanlış işaretlediğinde 48 saat içinde düzeltebilir.",
      },
      {
        title: "Borç ekranda, tahminde değil",
        body: "Satış ile tahsilat ayrı tutulur. Kimin ne kadar kalan borcu var, üye listesinde ve üye detayında görünür.",
      },
      {
        title: "Haftalık tekrarlı program",
        body: "Sabah ve akşam grupları ayrı program olarak tanımlanır. Üye hangi gruba kayıtlı, hem kendi telefonunda hem panelde bellidir.",
      },
      {
        title: "Gelmedi kolonu raporda ayrı",
        body: "Doluluk raporunda gelmeyen sayısı ayrı kolon olarak durur. Devamsızlık trendi rakamla görünür.",
      },
    ],
    modules: ["grup", "takvim", "finans", "uye360", "raporlar"],
    faq: [
      {
        q: "Aynı üye birden fazla gruba kayıtlı olabilir mi?",
        a: "Evet. Üye birden fazla haftalık programa kayıtlı olabilir, her birinin kontenjanı ve yoklaması ayrı işler.",
      },
      {
        q: "Aidatı geciken üyeleri toplu görebiliyor muyum?",
        a: "Evet. Kalan borç üye listesinde görünür ve finans raporunda tahsilat ile satış ayrı ayrı raporlanır.",
      },
      {
        q: "Yanlış alınan yoklamayı düzeltebilir miyim?",
        a: "Evet. Yönetim içinde bulunulan ay ve önceki ay içinde, antrenör ise 48 saat içinde geldi ve gelmedi yönünde düzeltebilir.",
      },
    ],
    accent: "amber",
  },
  {
    slug: "crossfit",
    name: "CrossFit ve Fonksiyonel Antrenman",
    short: "Seans kapasitesi, yoklama, koç performansı",
    hero: "CrossFit box'ı için kapasiteli seans, yoklama ve üyelik takibi",
    intro:
      "Box'ta gün içinde birden çok seans var ve her seansın kapasitesi sınırlı. Alpfit Plus seansları kapasiteli olarak kurar, üyeyi kendi telefonundan kaydeder, koçun yoklamasını ve üyeliğin durumunu tek yerde tutar.",
    pains: [
      {
        title: "Seans kapasitesi kontrolsüz",
        body: "Bazı saatler taşıyor, bazıları boş dönüyor. Kimin geleceği ancak kapıda belli oluyor.",
      },
      {
        title: "Üyelik durumu seans anında bilinmiyor",
        body: "Üyeliği bitmiş kişi seansa giriyor, fark edilmesi haftalar alıyor.",
      },
      {
        title: "Koç performansı ölçülmüyor",
        body: "Hangi koçun seansı doluyor, hangi saat tutuyor. Kadro kararı hissiyatla veriliyor.",
      },
      {
        title: "Devam takibi yok",
        body: "Haftada üç gün gelmesi gereken üye ikiye düştüğünde kimse görmüyor.",
      },
    ],
    answers: [
      {
        title: "Kapasiteli seans ve bekleme listesi",
        body: "Her seansın kontenjanı vardır. Dolduğunda kayıt bekleme listesine geçer, yer açıldığında sıradakine bildirim gider.",
      },
      {
        title: "Üyelik ve hak seans anında görünür",
        body: "Tükenmiş pakette üye işaretlenebilir ama hakkın düşmediği hem panelde hem koçun telefonunda görünür.",
      },
      {
        title: "Koç bazlı doluluk ve ciro",
        body: "Antrenör performansı ekranı ders sayısını, ciro katkısını ve haftalık doluluğu yan yana verir.",
      },
      {
        title: "Aktiflik serisi ve bildirim",
        body: "Haftalık aktiflik takip edilir, bitişe yaklaşan üyelere bildirim gider.",
      },
    ],
    modules: ["grup", "takvim", "uyelik", "antrenor-perf", "bildirim"],
    faq: [
      {
        q: "WOD yazımı için özel bir modül var mı?",
        a: "Hayır. Alpfit Plus'ta WOD'a özel bir modül olduğunu iddia etmiyoruz. Seans kapasitesi, kayıt, yoklama ve üyelik tarafı grup dersleri modülüyle yürür. Antrenman programı yazma tarafı ayrı bir modüldür ve haftalık program olarak çalışır.",
      },
      {
        q: "Gün içinde kaç seans tanımlayabilirim?",
        a: "Sınırı yok. Haftalık tekrarlı programlar tanımlanır, her seansın kendi saati ve kontenjanı olur.",
      },
      {
        q: "Üye kendi telefonundan seansa kaydolabiliyor mu?",
        a: "Evet. Üye mobil uygulamadan kayıt olur, iptal eder ve kontenjan doluysa bekleme listesine girer.",
      },
    ],
    accent: "neg",
  },
  {
    slug: "cok-subeli-zincir",
    name: "Çok Şubeli Zincirler",
    short: "Tek cockpit, şube kırılımı, yetki",
    hero: "Büyüyen zincir için tek cockpit, şube kırılımı ve yetki kontrolü",
    intro:
      "İkinci şubeyi açtığınız gün rapor birleştirme işi başlar. Alpfit Plus ilk günden çok şube veri modeliyle kurulur. Şube başına fiyatlandığı için de büyümek sizi ceza fiyatına maruz bırakmaz.",
    pains: [
      {
        title: "Her şube kendi tablosunu tutuyor",
        body: "Ay sonunda üç ayrı Excel birleştiriliyor. Hangi rakamın güncel olduğu tartışılıyor.",
      },
      {
        title: "Şube müdürüne ne kadar yetki verileceği belirsiz",
        body: "Ya herkes her şeyi görüyor ya da kimse hiçbir şeyi göremiyor.",
      },
      {
        title: "Şube karşılaştırması yapılamıyor",
        body: "Hangi şube ne getiriyor, hangi eğitmen nerede duruyor. Karar için tek ekran yok.",
      },
      {
        title: "Yazılım maliyeti şube başına uçuyor",
        body: "Mobil uygulamalı paketlerde şube sayısı arttıkça aylık tutar hızla büyüyor.",
      },
    ],
    answers: [
      {
        title: "Cockpit: şubeler tek ekranda",
        body: "Ciro, üye ve doluluk yan yana. Bir şubenin detayına inip aynı ekranda geri çıkabilirsiniz.",
      },
      {
        title: "Üç yetki şablonu",
        body: "Patron, şube müdürü ve muhasebe şablonları hazır gelir. Yetkiler şube bazında verilir ve geri alınır.",
      },
      {
        title: "Şube ve eğitmen bazlı finans",
        body: "Ciro, tahsilat ve kalan borç şube kırılımıyla raporlanır. Tek tık XLSX çıktısı alınır.",
      },
      {
        title: "Şube başına şeffaf fiyat",
        body: "İlk şube ₺1.500, ikinci şubeden itibaren ₺1.200. Mobil uygulama her şubede dâhildir, ayrı prim yoktur.",
      },
    ],
    modules: ["cockpit", "finans", "raporlar", "antrenor-perf", "uye360"],
    faq: [
      {
        q: "Üye şubeler arasında geçiş yapabiliyor mu?",
        a: "Üye bir ana şubeye bağlıdır. Şubeler arası çapraz kullanım kurgusu kulübünüzün ihtiyacına göre demoda birlikte gözden geçirilir.",
      },
      {
        q: "Şube müdürü diğer şubelerin cirosunu görüyor mu?",
        a: "Hayır, yetki şube bazında verilir. Şube müdürü yalnızca yetkili olduğu şubeyi görür, patron şablonu tümünü görür.",
      },
      {
        q: "Şube sayısı arttıkça fiyat nasıl işliyor?",
        a: "İlk şube ₺1.500, ikinci şubeden itibaren her şube ₺1.200'dir. Kurulum ücreti şube başınadır ve yıllık peşin ödemede alınmaz.",
      },
    ],
    accent: "sage",
  },
];

export function segmentBySlug(slug: string): Segment | undefined {
  return SEGMENTS.find((s) => s.slug === slug);
}
