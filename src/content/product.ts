/** Roller, moduller, yetenek/yol haritasi, faydalar — kaynak: _context/SATIS-SPEC.md + sunum/one-pager.md */

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
    // B-029 #1 (TASK-2.09, olculdu 2026-09-23): panelin Uye 360 ekrani
    // ../Alpfit.v1/web/src/pages/MemberDetailPage.tsx — bolumleri kimlik,
    // haklar, randevular, grup kayitlari, odemeler. OLCUM GRAFIGI ve
    // DIYETISYEN NOTU orada YOK; ekranin kendi "Yakinda" kutusu bunu yaziyor
    // (tr.json -> member.upcoming: "... Uye 360 tam fazinda (W8) gelecek",
    // render MemberDetailPage.tsx:434). Ikisi de uygulamada VAR (uyenin
    // mobilinde MeasurementChart, diyetisyen modulunde program/dosya) —
    // karsiligi olmayan iddia "TEK EKRANDA toplanmis olmalari"ydi, o yuzden
    // bu modulden cikti; kalemi CAPABILITIES.yolda -> uye360-tam tasiyor.
    blurb: "Bir üyenin üyeliği, PT geçmişi, grup kayıtları ve ödemesi tek ekranda.",
    points: [
      "Üyelik ve paket geçmişi",
      "Randevu ve yoklama kaydı",
      "Grup dersi kayıtları",
      "Ödeme zaman çizelgesi ve kalan borç",
      "Kimlik bilgileri ve üyenin giriş kodu",
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
    // B-029 #3 ve #5 (TASK-2.09, olculdu 2026-09-23):
    //  · UYELIK BITISI bildirimi YOK. notification.service.ts'in 14 gonderim
    //    fonksiyonunun (B-029 12 olcmustu; urun iki tane daha ekledi) hicbiri
    //    uyelik bitisi gondermiyor. membership-expiry.service.ts'in tuketicileri
    //    okuma ucu + rapor ureticisi + MembershipExpiriesPage — yani bitise
    //    yaklasan uye PANELDE LISTELENIR, bildirim gitmez. O liste zaten
    //    "Uyelik ve Paket" modulunde yaziyor; kalem CAPABILITIES.yolda'da.
    //  · KAMPANYA YOK. broadcasts.ts / BroadcastsPage.tsx var (toplu duyuru
    //    dogru), campaign/kampanya adli rota-sayfa-servis yok. Ayni sayfanin
    //    "Yolda" kolonu zaten "Kampanya ve pazarlama derinlesmesi" diyordu —
    //    ic celiski buradan doguyordu.
    //  · Yerine gecen kalem olculdu: sendComebackT2 — seri sifirlandiktan T+2
    //    gun sonra uyeye geri cagirma push'u (idempotent, sessiz saat erteler).
    blurb: "Randevu, grup ve geri çağırma push'u. Toplu duyuru katmanı.",
    points: [
      "Randevu ve grup dersi hatırlatması",
      "Bekleme listesinden yer açıldı bildirimi",
      "Serisi bozulan üyeye geri çağırma bildirimi",
      "Toplu duyuru",
      "Haftalık aktiflik serisi",
    ],
    icon: "bell",
  },
];

/**
 * YETENEK VE YOL HARITASI — TEK kaynak (B-029, B-040).
 *
 * "Bugun var / yolda / yol haritasinda" ayrimi sitede baska HICBIR yerde elle
 * yazilmaz. Bu liste kurulmadan once ayni ayrim BES evde elle yaziliydi ve ucu
 * birbirinden farkliydi (`/ozellikler`, FounderProgram, chat.ts, faq.ts,
 * `/fiyat`); `legal.ts` ise ziyaretciye "yolda olan ve yol haritasinda bulunan
 * ozellikler ayri ayri belirtilir" taahhudunu veriyordu. Iddia sinirinin tek
 * evi: _dev/docs/CLAIMS.md
 *
 * "simdi" kademesine yalnizca urun koduna (../Alpfit.v1, salt okunur) karsi
 * DOGRULANMIS kalem yazilir. Karsiligi olcumle bulunamayan iddia "yolda"
 * kademesinde durur — bes ornegin olcumu ve dosya/satir kaniti
 * _dev/bulgular/B-029-*.md icindedir.
 *
 * Etiketler CUMLE ICI bicimde yazilir: ilk harf kucuk, ozel ad ve kisaltma
 * kendi buyuk harfini korur ("QR ve turnike ile giris", "Apple Health ve
 * Google Fit"). Liste basligi capabilityTitle() ile turetilir — yalniz
 * BUYUTME yonu kayipsizdir; otomatik kucultme "QR"yi ve "Apple"i bozardi.
 */
export type CapabilityStage = "simdi" | "yolda" | "sonra";

export type Capability = {
  /** Cagri yeri kalemi adiyla cagirsin diye; dizide indeksle aranmaz (B-040). */
  id: string;
  /** Cumle ici bicim: "grup dersleri, kontenjan ve yoklama" */
  label: string;
  /**
   * Modul duzeyindeki kalemin PRODUCT_STATUS.modules cumlesinde gectigi kisa
   * ad. Modul olmayan kalem (mobil uygulama, tekil davranis) bu alani
   * tasimaz: listede gorunur, modul cumlesinde sayilmaz.
   */
  modul?: string;
};

export const STAGE_LABEL: Record<CapabilityStage, string> = {
  simdi: "Bugün var",
  yolda: "Yolda",
  sonra: "Yol haritasında",
};

/**
 * Kademelerin ANLATIM sirasi: once bugun ne var, sonra ne geliyor, en sonda ne
 * planli. Uc kademeyi birlikte gosteren yuzeyler (bugun `/ozellikler`'in uc
 * kolonu) bunun uzerinde doner.
 *
 * Ayri bir dizi olarak duruyor cunku `Object.keys(CAPABILITIES)` sirasi
 * ORTULUDUR: sabitin icinde kademeler yer degistirse sayfanin kolon sirasi
 * sessizce degisir ve bunu hicbir sey yakalamaz. Burada sira aciktir ve
 * kapisi capabilities testindedir.
 */
export const CAPABILITY_STAGES: readonly CapabilityStage[] = ["simdi", "yolda", "sonra"];

export const CAPABILITIES: Record<CapabilityStage, Capability[]> = {
  simdi: [
    { id: "takvim-rezervasyon", label: "takvim, rezervasyon ve bekleme listesi", modul: "randevu" },
    { id: "grup-dersleri", label: "grup dersleri, kontenjan ve yoklama", modul: "grup dersleri" },
    { id: "uyelik-paket", label: "üyelik, seans paketi ve kalan hak", modul: "üyelik ve paket" },
    { id: "finans-ciro", label: "finans, ciro, kalan borç ve iade", modul: "finans ve ciro" },
    {
      id: "cok-sube-cockpit",
      // Sablonlar urunde var ve panelde secilebiliyor. GERI ALMA da var:
      // sablon degisimi eski sablonun grant'larini ayni transaction'da siler
      // (olculdu 2026-09-23 — accounts-update.ts:861 revokeTemplate ->
      // revokeGrant -> permissionGrant.deleteMany; uc PATCH /accounts/:userId,
      // server.ts:375, panel cagrisi web/src/lib/account-mutations.ts).
      // B-029 bunu "yok" diye olcmustu cunku yalniz revokeGrant'in cagiranina
      // bakmisti; araya TASK-54.11'in REPLACE yolu girmis. Hala eksik olan tek
      // sey sablon degistirmeden TEK bir yetkiyi sokmek — o "yolda"da.
      label: "çok şube cockpit ve üç yetki şablonu (patron, şube müdürü, muhasebe)",
      modul: "çok şube cockpit",
    },
    { id: "antrenor-performansi", label: "antrenör performansı", modul: "antrenör performansı" },
    { id: "diyetisyen-modulu", label: "diyetisyen modülü", modul: "diyetisyen modülü" },
    { id: "raporlar", label: "raporlar, XLSX, CSV ve PDF", modul: "raporlar" },
    {
      id: "bildirim-duyuru",
      // Bekleme listesi bildirimi ve toplu duyuru urunde var; UYELIK BITISI
      // push'u ve KAMPANYA yok — ikisi de "yolda"da.
      label: "push bildirim, bekleme listesinden yer açıldı bildirimi ve toplu duyuru",
      modul: "bildirimler",
    },
    { id: "mobil-uygulama", label: "üye ve antrenör mobil uygulaması" },
    {
      id: "yoklama-duzeltme",
      label: "yoklama düzeltme pencereleri: yönetim bu ay ve önceki ay, antrenör 48 saat",
    },
    { id: "aktiflik-serisi", label: "haftalık aktiflik serisi" },
  ],
  yolda: [
    { id: "kampanya", label: "kampanya ve pazarlama derinleşmesi" },
    { id: "gelismis-raporlama", label: "gelişmiş raporlama" },
    { id: "churn-paneli", label: "churn ve risk paneli" },
    // Asagidaki dordu B-029'un olctugu karsiliksiz iddialardir. Urunun KENDI
    // kaydi bunlari erteliyor: Uye 360 tam fazi (W8), iptal esigi v1.5 adayi,
    // uyelik bitisi bildirimi churn panelinin ardina birakilmis, tek-yetki
    // revoke ucu v1.5'e ertelenmis. Site bunlari "bugun var" diye anlatamaz.
    {
      id: "uye360-tam",
      label: "Üye 360'ta ölçüm grafiği ve diyetisyen notunun tek ekranda toplanması",
    },
    { id: "iptal-esigi-ayari", label: "iptal eşiğinin kulüp tarafından ayarlanabilmesi" },
    { id: "uyelik-bitis-bildirimi", label: "üyelik bitişine yaklaşan üyeye bildirim" },
    // TASK-2.09 daralttı (olculdu 2026-09-23): yetkinin panelden geri alinmasi
    // BUGUN VAR (sablon degisimi eski grant'lari siliyor — cok-sube-cockpit
    // kaleminin yorumu). Ertelenmis olan yalniz tek bir yetkiyi sablondan
    // bagimsiz sokmek: permission-templates.ts:15-17 "revoke HTTP endpoint'i
    // v1.5'e ertelendi".
    { id: "yetki-geri-alma", label: "tek bir yetkinin şablon değiştirmeden geri alınması" },
  ],
  sonra: [
    { id: "online-odeme", label: "online ödeme" },
    { id: "qr-turnike", label: "QR ve turnike ile giriş" },
    { id: "saglik-entegrasyonu", label: "Apple Health ve Google Fit" },
    { id: "yapay-zeka-analiz", label: "yapay zekâ destekli gelişim ve beslenme analizi" },
    { id: "kurumsal-uyelik", label: "kurumsal üyelik" },
  ],
};

/** Turkce buyutme: "iptal" → "İptal". Locale verilmezse "Iptal" olurdu. */
function buyutTr(s: string): string {
  return s.charAt(0).toLocaleUpperCase("tr") + s.slice(1);
}

/** "a, b ve c" — tuketicilerin dordu de kalemleri boyle bagliyordu. */
function sirala(parcalar: string[]): string {
  if (parcalar.length < 2) return parcalar[0] ?? "";
  return `${parcalar.slice(0, -1).join(", ")} ve ${parcalar[parcalar.length - 1]}`;
}

/** Liste basligi: "grup dersleri, ..." → "Grup dersleri, ..." */
export function capabilityTitle(c: Capability): string {
  return buyutTr(c.label);
}

/**
 * Kademeyi duzyazida sayar. NOKTA EKLEMEZ — cagri yeri kendi cumlesini kurar
 * (kimi yerde nokta, kimi yerde "... yol haritasinda." eki geliyor).
 *
 * "simdi" BILINCLE disarida (olculdu, TASK-2.08): o kademenin etiketleri kendi
 * iclerinde virgul tasiyor ("takvim, rezervasyon ve bekleme listesi") ve
 * virgulle baglandiklarinda cumle okunamaz hale geliyor. O kademenin duzyazi
 * evi moduleProse(); kademeyi liste olarak gostermek isteyen CAPABILITIES.simdi
 * + capabilityTitle() kullanir. Yeni bir kademe duzyaziya acilacaksa once
 * etiketlerinden virgul cikarilir — kapisi capabilities testindedir.
 */
export function capabilityProse(stage: Exclude<CapabilityStage, "simdi">): string {
  return buyutTr(sirala(CAPABILITIES[stage].map((c) => c.label)));
}

/** "simdi" kademesinin modul duzeyli kalemleri — PRODUCT_STATUS.modules bunu okur. */
export function moduleProse(): string {
  return buyutTr(
    sirala(CAPABILITIES.simdi.flatMap((c) => (c.modul ? [c.modul] : []))),
  );
}

/** Kalemi id'siyle getirir; bilinmeyen id derleme degil calisma hatasi verir. */
export function capability(id: string): Capability {
  for (const stage of CAPABILITY_STAGES) {
    const hit = CAPABILITIES[stage].find((c) => c.id === id);
    if (hit) return hit;
  }
  throw new Error(`Bilinmeyen yetenek kalemi: ${id}`);
}

/** Kalemin BUGUN durdugu kademe; bilinmeyen id hata verir. */
export function capabilityStage(id: string): CapabilityStage {
  for (const stage of CAPABILITY_STAGES) {
    if (CAPABILITIES[stage].some((c) => c.id === id)) return stage;
  }
  throw new Error(`Bilinmeyen yetenek kalemi: ${id}`);
}

/**
 * HENUZ YAYINLANMAMIS bir kalemi duzyazi cumle icinde anmak icin (TASK-2.11).
 * Kalemi dondurur, ama kalem "bugun var" kademesine gectigi gun HATA VERIR.
 *
 * Gerekce: bu cagri yerleri kalemi yalnizca ADIYLA anmiyor, ONUN HENUZ
 * OLMADIGINI soyleyen bir cumle kuruyor ("... yol haritamizda", "... bugunku
 * urunun parcasi degil"). Adi sabitten almak ADI hizalar ama CUMLEYI
 * hizalamaz: kalem yayinlandigi gun ad dogru kalir, cumle sessizce yanlis
 * olur — ve bu, B-040'in olctugu ayrismanin ters yonlu esidir. Sessiz yanlis
 * yerine gurultulu durus: derleme durur ve cumle elden gecirilir. Sinirin
 * kendisi budur; ayrica yorumla tekrarlanmaz.
 */
export function upcomingCapability(id: string): Capability {
  const stage = capabilityStage(id);
  if (stage === "simdi") {
    throw new Error(
      `"${id}" artık "${STAGE_LABEL.simdi}" kademesinde — ` +
        `onu yol haritası kalemi gibi anan cümleler elden geçirilmeli ` +
        `(product.ts → upcomingCapability)`,
    );
  }
  return capability(id);
}

/**
 * Kademenin CUMLE ICI eki: "yolda" ya da "yol haritasında". Cagri yeri kendi
 * ekini yapistirir ("...dır", "(...)"), bu yuzden burada nokta ve parantez yok.
 * "bugun var" kademesinde hata verir — gerekce upcomingCapability'de.
 */
export function stageNote(id: string): string {
  const kalem = upcomingCapability(id);
  return STAGE_LABEL[capabilityStage(kalem.id)].toLocaleLowerCase("tr");
}

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
