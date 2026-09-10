/** Roller, moduller, faydalar — kaynak: _context/SATIS-SPEC.md + sunum/one-pager.md */

export type Role = {
  key: string;
  name: string;
  device: "mobil" | "web";
  deviceLabel: string;
  summary: string;
  bullets: string[];
};

export const ROLES: Role[] = [
  {
    key: "uye",
    name: "Üye",
    device: "mobil",
    deviceLabel: "Telefon",
    summary: "Kulübüyle olan her şeyi cebinden görür ve yönetir.",
    bullets: [
      "Üyelik ve paket durumu, kalan seans hakkı",
      "Randevu alma, iptal ve bekleme listesi",
      "Grup dersine kayıt ve kontenjan görünürlüğü",
      "Ölçüm grafiği ve gelişim takibi",
      "Diyetisyeninin yazdığı beslenme programı",
    ],
  },
  {
    key: "antrenor",
    name: "Antrenör",
    device: "mobil",
    deviceLabel: "Telefon",
    summary: "Kendi takvimini yönetir, yoklamayı tek dokunuşla alır.",
    bullets: [
      "Günlük takvim ve müsait saat tanımlama",
      "PT randevusu planlama ve iptal",
      "Tek dokunuşla yoklama, grup dersi roster'ı",
      "Öğrenci listesi ve gelişim takibi",
      "Ölçüm girişi ve antrenman programı yazma",
    ],
  },
  {
    key: "diyetisyen",
    name: "Diyetisyen",
    device: "web",
    deviceLabel: "Web paneli",
    summary: "Kulübün beslenme hizmetini aynı platformda verir.",
    bullets: [
      "Atanan danışan listesi ve danışan geçmişi",
      "Beslenme programı yazma ve güncelleme",
      "PDF ve dosya yükleme, üyeye anında bildirim",
      "Ölçüm ve yemek günlüğü okuma",
      "Yönetim panelinden aç/kapa, sözleşme bitince veri korunur",
    ],
  },
  {
    key: "yonetim",
    name: "Yönetim",
    device: "web",
    deviceLabel: "Web paneli",
    summary: "Kulübün gerçek durumunu anlık görür ve yönetir.",
    bullets: [
      "Tüm üyeler, üyelik ve PT satışı, tahsilat",
      "Grup programı, kontenjan ve yoklama yönetimi",
      "Şube bazlı ciro, borç ve doluluk raporu",
      "Antrenör performansı ve prim verisi",
      "Modül aç/kapa, yetki şablonları, denetim izi",
    ],
  },
];

export type Module = {
  key: string;
  title: string;
  blurb: string;
  points: string[];
  icon: string;
  featured?: boolean;
};

export const MODULES: Module[] = [
  {
    key: "takvim",
    title: "Takvim ve Rezervasyon",
    blurb:
      "Ürünün en kritik modülü. Müsaitlik, self servis randevu, bekleme listesi ve no-show adaleti tek akışta.",
    points: [
      "Antrenör müsaitliği ve çakışma kontrolü",
      "Üye kendi telefonundan randevu alır",
      "Bekleme listesi: boşalan yer sıradakine gider",
      "İptal ve no-show'da hak yanması kuralı",
      "Push hatırlatma ve gün kapatma",
    ],
    icon: "calendar",
    featured: true,
  },
  {
    key: "grup",
    title: "Grup Dersleri",
    blurb:
      "Tekrarlı haftalık program, kontenjan, bekleme listesi ve yoklama. Reformer'dan boks'a aynı akış.",
    points: [
      "Haftalık tekrarlı program oluşturma",
      "Kontenjan ve bekleme listesi",
      "Antrenör telefonundan yoklama",
      "Üye self servis kayıt ve iptal",
      "Ders bazlı doluluk ölçümü",
    ],
    icon: "users",
    featured: true,
  },
  {
    key: "uyelik",
    title: "Üyelik ve Paket",
    blurb:
      "Süreli üyelik ve seans paketi bir arada. Kalan hak sayacı her yerde aynı sayıyı gösterir.",
    points: [
      "Süreli üyelik ve seans paketi",
      "Kalan hak sayacı ve açık kayıt tavanı",
      "Bitişe yaklaşan üyeler listesi",
      "Satış iptali ve hak geri alma",
      "Paket yenileme takibi",
    ],
    icon: "card",
  },
  {
    key: "uye360",
    title: "Üye 360",
    blurb:
      "Bir üyenin üyeliği, PT geçmişi, ölçümü, ödemesi ve diyetisyen notu tek ekranda.",
    points: [
      "Üyelik ve paket geçmişi",
      "Randevu ve yoklama kaydı",
      "Ölçüm grafiği",
      "Ödeme zaman çizelgesi ve kalan borç",
      "Diyetisyen programı ve dosyaları",
    ],
    icon: "user",
  },
  {
    key: "finans",
    title: "Finans ve Ciro",
    blurb:
      "Satış ile tahsilat ayrı tutulur. Kalan borç, nakit bazlı ciro ve iade tek yerde.",
    points: [
      "Satış ve ödeme ayrı kayıt, kalan borç takibi",
      "Nakit bazlı ciro: PT, üyelik, grup kırılımı",
      "Şube ve eğitmen bazlı gelir",
      "İade ve satış iptali",
      "Denetim izi ile geriye dönük tahsilat",
    ],
    icon: "wallet",
    featured: true,
  },
  {
    key: "cockpit",
    title: "Çok Şube Cockpit",
    blurb:
      "Şubeler tek ekranda. Ciro, üye ve doluluk yan yana, şube detayına inebilirsiniz.",
    points: [
      "Şubeler arası ciro karşılaştırması",
      "Üye ve doluluk kırılımı",
      "Şube detayına drill-down",
      "Yetki şablonu: patron, şube müdürü, muhasebe",
      "İlk günden çok şube veri modeli",
    ],
    icon: "building",
    featured: true,
  },
  {
    key: "antrenor-perf",
    title: "Antrenör Performansı",
    blurb:
      "Prim ve kadro kararı tahminle değil rakamla. Ders sayısı, ciro ve haftalık doluluk.",
    points: [
      "Verilen ders ve seans sayısı",
      "Eğitmen bazlı ciro katkısı",
      "Haftalık doluluk oranı",
      "Yoklama ve no-show kırılımı",
      "Şube bazında karşılaştırma",
    ],
    icon: "chart",
  },
  {
    key: "diyetisyen",
    title: "Diyetisyen Modülü",
    blurb:
      "Beslenme hizmeti aynı platformda. İncelediğimiz 18 rakip üründe bu modüle rastlamadık.",
    points: [
      "Kulüp kendi lisanslı diyetisyenini bağlar",
      "Program yazma ve PDF yükleme",
      "Üyenin ölçüm ve yemek günlüğünü okuma",
      "Yönetim panelinden aç/kapa",
      "Sözleşme biterse pasif, veri korunur",
    ],
    icon: "leaf",
    featured: true,
  },
  {
    key: "raporlar",
    title: "Raporlar ve Excel",
    blurb: "Hazır şablonlar, tek tık XLSX, CSV ve PDF. Muhasebeye giden dosya elle hazırlanmaz.",
    points: [
      "Aylık ciro ve tahsilat raporu",
      "Doluluk raporu, gelmedi kolonu ayrı",
      "Üye ve üyelik listeleri",
      "XLSX, CSV, PDF dışa aktarma",
      "Şube ve tarih aralığı filtresi",
    ],
    icon: "report",
  },
  {
    key: "bildirim",
    title: "Bildirim ve Bağlılık",
    blurb: "Randevu, grup ve üyelik bitişi push'u. Toplu duyuru ve geri çağırma katmanı.",
    points: [
      "Randevu ve grup dersi hatırlatması",
      "Üyelik bitişine yaklaşan üyeye bildirim",
      "Bekleme listesinden yer açıldı bildirimi",
      "Toplu duyuru ve kampanya",
      "Haftalık aktiflik serisi",
    ],
    icon: "bell",
  },
];

export type Benefit = { title: string; body: string; icon: string };

export const BENEFITS: Benefit[] = [
  {
    title: "Kaçan randevu azalır",
    body: "Otomatik hatırlatma ve bekleme listesi birlikte çalışır. Boşalan slot sıradaki üyeye gider, saat boş kalmaz.",
    icon: "calendar",
  },
  {
    title: "Boş kapasite görünür olur",
    body: "Doluluk verisi hangi saatin, hangi eğitmenin ve hangi şubenin atıl olduğunu ortaya çıkarır.",
    icon: "chart",
  },
  {
    title: "Ciro ve borç anlık ve doğru",
    body: "Satış ile tahsilat ayrı tutulduğu için gün sonu mutabakatı biter. Excel'e ikinci kez yazmazsınız.",
    icon: "wallet",
  },
  {
    title: "Çok şube tek ekranda",
    body: "Hangi şube ne getiriyor, hangi eğitmen nerede duruyor. Karşılaştırma için rapor birleştirmeye gerek yok.",
    icon: "building",
  },
  {
    title: "Eğitmen performansı rakamla",
    body: "Prim ve kadro kararını ders sayısı, ciro katkısı ve doluluk oranı üzerinden verirsiniz.",
    icon: "trophy",
  },
  {
    title: "Riskteki üye fark edilir",
    body: "Bitişe yaklaşan üyeler listesi ve aktiflik takibi, yenileme temasını zamanında kurmanızı sağlar.",
    icon: "shield",
  },
  {
    title: "Çift kayıt biter",
    body: "Randevu, ciro, ölçüm ve üye listesi tek veri kaynağında. WhatsApp, Excel ve defter dağınıklığı kapanır.",
    icon: "layers",
  },
  {
    title: "Beslenme de içeride",
    body: "Kulübünüzün diyetisyeni aynı platformda çalışır. Üye programını uygulamadan görür, ayrı bir kanal gerekmez.",
    icon: "leaf",
  },
];

/** Mevcut dagimik duzen — sitenin 1 numarali rakibi. */
export const CHAOS = [
  { tool: "WhatsApp", use: "Randevu, iptal, duyuru", pain: "Kayıt yok, arama yok, no-show görünmez" },
  { tool: "Excel", use: "Ciro, üye listesi, borç", pain: "Çift kayıt, ay sonu mutabakatı, tek kişi biliyor" },
  { tool: "Defter", use: "Yoklama, ölçüm", pain: "Kayboluyor, okunmuyor, rapora dönmüyor" },
  { tool: "Takvim uygulaması", use: "Sadece randevu", pain: "Ciro, üyelik ve borç dışarıda kalıyor" },
];
