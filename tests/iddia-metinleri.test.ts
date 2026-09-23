import { describe, expect, it } from "vitest";

import { MODULES } from "@/content/product";
import { SEGMENTS } from "@/content/segments";
import { SHOTS } from "@/content/shots";
// Gorsel uretim hattinin KENDI dusurme tablosu — alt metnin gercekle
// karsilastirilacagi tek kaynak (TASK-2.13). TASK-2.14 ayni dosyadan denetimin
// karar fonksiyonunu ve tablodan turemis yasakli kumesini de okuyor.
import {
  DROP_NODES,
  SHELL_DROP_NODES,
  FORBIDDEN,
  MIN_FORBIDDEN_PARTS,
  MIN_FORBIDDEN_INITIALS,
  REPLACEMENTS,
  CLAIM_REPLACEMENTS,
  TEXT_FIXES,
  auditTexts,
  deriveForbidden,
} from "../research/lib/screen-cleanup-v2.mjs";
// TASK-2.15 — yasakli iddia sozlugu. `research/lib/` altinda cunku arastirma
// konteyneri yalniz orayi goruyor; `web` konteyneri ikisini de gorur, yani bu
// import (ve asagidaki CAPABILITIES capasi) YALNIZ bu katmanda mumkun.
import {
  CLAIM_LEAK,
  MIN_CLAIM_PATTERNS,
  claimLeaks,
  trLower,
} from "../research/lib/claim-leak.mjs";
import { CAPABILITIES } from "@/content/product";

// TASK-2.09 — B-029'un bes karsiliksiz cumlesinin ZIYARETCIYE GORUNEN
// yuzeylerdeki kapisi.
//
// Kardes kapiyla karistirma: tests/capabilities.test.ts SABITI (CAPABILITIES)
// guder — bir kalemin dogru kademede olup olmadigini sorar. Bu dosya ise
// sabitin henuz BAGLANMADIGI yuzeyleri guder: MODULES ve SEGMENTS kendi
// metinlerini hala elle yaziyor (baglanmalari TASK-2.10 + 2.11). Yani
// CAPABILITIES yesil olsa bile modul metni karsiliksiz iddiayi geri
// yazabilirdi — TASK-2.08 kapanirken tam olarak bu bosluk vardi.
//
// Kapsam BILINCLE dar: yalniz B-029'un olctugu bes kalem. Sinifin tamami
// (~124 present-tense yetenek cumlesi) TASK-2.12'nin taramasi.
//
// Olcumun kaynagi ../Alpfit.v1 (salt okunur); dosya/satir kaniti hem
// _dev/bulgular/B-029-*.md'de hem de duzeltilen satirlarin yanindaki
// yorumlarda.

/** Modulun ziyaretciye gorunen tum metni (baslik + blurb + maddeler). */
function modulMetni(key: string): string {
  const m = MODULES.find((x) => x.key === key);
  if (!m) throw new Error(`Bilinmeyen modül: ${key}`);
  return [m.title, m.blurb, ...m.points].join(" | ").toLocaleLowerCase("tr");
}

/** Tum modul metni tek govdede. */
function tumModulMetni(): string {
  return MODULES.map((m) => modulMetni(m.key)).join(" || ");
}

/** Segment sayfalarinin ziyaretciye gorunen tum metni. */
function tumSegmentMetni(): string {
  return SEGMENTS.map((s) =>
    [
      s.hero,
      s.intro,
      ...s.pains.flatMap((p) => [p.title, p.body]),
      ...s.answers.flatMap((a) => [a.title, a.body]),
      ...s.faq.flatMap((f) => [f.q, f.a]),
    ].join(" | "),
  )
    .join(" || ")
    .toLocaleLowerCase("tr");
}

// ── Bos kapsam ───────────────────────────────────────────────────────────
// Asagidaki iddia kontrolleri "metinde su ifade GECMIYOR" diyor; hasat
// fonksiyonu bos donerse hepsi hicbir seye bakmadan yesil kalir. Fail-open
// tam orada olusur, o yuzden hasadin dolu oldugu ayrica civileniyor.
describe("iddia yüzeyleri — boş kapsam", () => {
  it("modül metni hasat ediliyor", () => {
    expect(MODULES.length).toBeGreaterThan(5);
    expect(tumModulMetni().length).toBeGreaterThan(1000);
  });

  it("segment metni hasat ediliyor", () => {
    expect(SEGMENTS.length).toBe(4);
    expect(tumSegmentMetni().length).toBeGreaterThan(2000);
  });

  it("her modülün metni kendi başlığını taşıyor (hasat gerçekten o modülü okuyor)", () => {
    expect(modulMetni("uye360")).toContain("üye 360");
    expect(modulMetni("bildirim")).toContain("bildirim ve bağlılık");
  });
});

// ── B-029 #1 — Üye 360 tek ekranda ───────────────────────────────────────
describe("B-029 #1 — Üye 360 ölçüm grafiği ve diyetisyen notunu 'var' saymıyor", () => {
  // Urun gercegi: panelin Uye 360 ekraninin KENDI "Yakinda" kutusu ikisinin de
  // o fazda olmadigini yaziyor (tr.json -> member.upcoming; render
  // MemberDetailPage.tsx:434). Ikisi de uygulamada var ama BASKA ekranlarda.
  it.each(["ölçüm", "diyetisyen"])("Üye 360 modülü '%s' iddia etmiyor", (ifade) => {
    expect(modulMetni("uye360")).not.toContain(ifade);
  });
});

// ── B-029 #2 — iptal eşiği ───────────────────────────────────────────────
describe("B-029 #2 — iptal eşiğini kulübün belirlediği söylenmiyor", () => {
  // Esik kod sabiti (uc yerde); ayarlanabilirligi urunun kendi notunda v1.5 adayi.
  it.each(["eşiğini siz", "eşiği siz belirl", "eşiği kulüp belirl"])(
    "segment metni '%s' demiyor",
    (ifade) => {
      expect(tumSegmentMetni()).not.toContain(ifade);
    },
  );
});

// ── B-029 #3 — üyelik bitişi bildirimi ───────────────────────────────────
describe("B-029 #3 — üyelik bitişi bildirimi 'gidiyor' diye anlatılmıyor", () => {
  // 14 gonderim fonksiyonunun hicbiri uyelik bitisi gondermiyor; bitise
  // yaklasan uye PANELDE listelenir (rapor + MembershipExpiriesPage).
  // "bitise yaklasan" ifadesinin kendisi YASAK DEGIL — liste gercek; yasak
  // olan onu BILDIRIME baglamak.
  const yasakli = [
    "üyelik bitişi push",
    "bitişine yaklaşan üyeye bildirim",
    "bitişe yaklaşan üyelere bildirim",
    "bitişe yaklaşan üyeye bildirim",
  ];

  it.each(yasakli)("modül metni '%s' demiyor", (ifade) => {
    expect(tumModulMetni()).not.toContain(ifade);
  });

  it.each(yasakli)("segment metni '%s' demiyor", (ifade) => {
    expect(tumSegmentMetni()).not.toContain(ifade);
  });

  it("bitişe yaklaşan üyeler hâlâ liste olarak anlatılıyor (doğru olan silinmedi)", () => {
    expect(modulMetni("uyelik")).toContain("bitişe yaklaşan üyeler listesi");
  });
});

// ── B-029 #5 — kampanya ──────────────────────────────────────────────────
describe("B-029 #5 — modül metni kampanya iddia etmiyor", () => {
  // broadcast var ("toplu duyuru" dogru); campaign/kampanya adli
  // rota-sayfa-servis yok. Ayni sayfanin "Yolda" kolonu zaten kampanyayi
  // yolda gosteriyordu — ic celiski oradan doguyordu.
  it("hiçbir modül 'kampanya' demiyor", () => {
    expect(tumModulMetni()).not.toContain("kampanya");
  });

  it("toplu duyuru korundu (doğru olan silinmedi)", () => {
    expect(modulMetni("bildirim")).toContain("toplu duyuru");
  });
});

// ── B-029 #4 — kasıtlı olarak yasaklı ifadesi YOK ────────────────────────
describe("B-029 #4 — yetki geri alma: ölçümle çürütüldü, cümle yerinde", () => {
  // TASK-2.09 olctu (2026-09-23): geri alma uretimde var — sablon degisimi
  // eski grant'lari ayni transaction'da siliyor (accounts-update.ts:861 ->
  // revokeTemplate -> revokeGrant -> deleteMany; uc PATCH /accounts/:userId,
  // server.ts:375). B-029 yalniz `revokeGrant`'in cagiranina bakip "yok"
  // demisti. Bu yuzden buraya YASAKLI IFADE KONMADI ve konmamali — cumle
  // dogru. Ertelenmis olan yalniz sablondan bagimsiz tek-yetki revoke ucu.
  it("çok şubeli zincir sayfası yetkinin geri alındığını hâlâ söylüyor", () => {
    const zincir = SEGMENTS.find((s) => s.slug === "cok-subeli-zincir");
    expect(zincir).toBeDefined();
    const metin = (zincir?.answers ?? []).map((a) => a.body).join(" | ");
    expect(metin).toContain("geri alınır");
  });
});

// ── TASK-2.12 — riskli alt kume taramasinin bulduklari ───────────────────
// Yukaridaki bloklar B-029'un BES bilinen kalemini civiliyor. Asagidakiler
// taramanin (konu sozcukleri urunun kendi erteleme notlarindan + surum
// haritasindan turedi) bulup duzelttigi IKI yeni karsiliksiz iddiadir.
// Kalici capraz kontrol hala M6 F6.4'un isi; burasi yalniz duzeltilen
// cumlelerin geri yazilmasini engelliyor (B-060 gerekcesi).

describe("TASK-2.12 — rapor filtresi tarih aralığı iddia etmiyor", () => {
  // Urun gercegi (olculdu 2026-09-23, uc katman): reports-catalog.ts
  // filterType 'monthRange' = "v1'de tek ay … gercek baslangic-bitis araligi
  // v1.5"; reports-export.ts:71 tek `month` parametresi; ReportsPage.tsx:185
  // <input type="month">. Aralik girdisi hicbir katmanda yok.
  it("raporlar modülü 'tarih aralığı' demiyor", () => {
    expect(modulMetni("raporlar")).not.toContain("tarih aralığı");
  });

  it("şube filtresi korundu (doğru olan silinmedi)", () => {
    expect(modulMetni("raporlar")).toContain("şube");
  });

  it("hiçbir modül 'tarih aralığı' filtresi iddia etmiyor", () => {
    expect(tumModulMetni()).not.toContain("tarih aralığı");
  });
});

describe("TASK-2.12 — ürün görseli alt metni 'öğrenci tutma' iddia etmiyor", () => {
  // Urun gercegi (olculdu 2026-09-23): "ogrenci tutma" TUM urun kod tabaninda
  // 0 kez geciyor; surum haritasi kalemi adiyla v1.5'e tasimis
  // (../Alpfit.v1/_dev/PRD/VERSIONS.md -> v1.5 Feature Adaylari).
  // TASK-2.13 goruntunun kendisini de temizledi (DROP_NODES.antrenor).
  const tumAlt = Object.values(SHOTS)
    .map((s) => s.alt)
    .join(" || ")
    .toLocaleLowerCase("tr");

  it("alt metinleri hasat ediliyor (boş kapsam)", () => {
    expect(Object.keys(SHOTS).length).toBeGreaterThan(5);
    expect(tumAlt.length).toBeGreaterThan(300);
  });

  it("hiçbir ürün görseli alt metni 'öğrenci tutma' demiyor", () => {
    expect(tumAlt).not.toContain("öğrenci tutma");
  });
});

// ── TASK-2.13 — alt metin, hattin DUSURDUGU karti anamaz ─────────────────
//
// Neden bu blok var: TASK-2.12 "ogrenci tutma"yi alt metinden cikardi ve
// yerine "haftalik doluluk" + "ciro kirilimi" yazdi, uzerine de o iki ifadeyi
// `toContain` ile CIVILEDI. Olculdu (TASK-2.13): o iki kart bu goruntude ZATEN
// YOK — ayni hat onlari TASK-14.06'dan beri dusuruyor ve gerekcesi urunun kendi
// kodu (trainer-performance.service.ts:7 "FINANSAL CIRO DEGIL",
// attendance-count.ts:11 doluluk % kapsam disi). Yani kapi bir karsiliksiz
// iddiayi ikisiyle degistirip sabitlemisti.
//
// Ders: alt metnin dogrulugu elle yazilan bir listeyle guvence altina
// alinamaz — olculecek sey HATTIN KENDI TABLOSUDUR. Bu, fazin gorsel denetim
// icin sectigi ilkenin aynisi (PHASE-2 -> "tablo kaynagin gercegidir, regex
// bir tahmindir"), yalniz metin tarafina uygulanmis hali.
//
// Kapsam: yedi gorselin hepsi, kendi ekraninin dusurme capalarina karsi.
// Capalar `research/lib/`ten okunur; `web` konteyneri deponun tamamini gorur
// (arastirma konteyneri yalniz `research/`u gorur — PHASE-2 arastirmasinda
// olculdu), yani bu import yalniz bu yonde mumkundur.
describe("TASK-2.13 — ürün görseli alt metni, hattın düşürdüğü kartı anmıyor", () => {
  /** SHOTS anahtari -> render-product.mjs ekran id'si (uyeTelefon -> uye-telefon). */
  const ekranId = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

  // DROP_NODES yalniz ekran-OZEL anahtarlari tasir (bugun: antrenor, raporlar,
  // takvim, uye-telefon); kabuk kurali her ekrana ayrica biner. Bilinmeyen
  // anahtar `undefined` doner ve `?? []` ile bos gecer — render-product.mjs'in
  // kendi `DROP_NODES[screen.id] ?? []` davranisiyla birebir ayni.
  const ekranOzelDroplar = DROP_NODES as Record<string, string[][] | undefined>;

  /** Bir ekrandan dusurulen TUM capalar: ortak kabuk + ekran-ozel. */
  const dusurulenCapalar = (screenId: string): string[] =>
    [...SHELL_DROP_NODES, ...(ekranOzelDroplar[screenId] ?? [])].map((girdi) => girdi[1]);

  it("düşürme tablosu okunuyor (boş kapsam bekçisi)", () => {
    // Tablo bos ya da okunamaz dondugunde asagidaki dongu HICBIR SEYE bakmaz
    // ve bedava yesil kosar. Sayilar olculdu (2026-09-23).
    expect(SHELL_DROP_NODES.length).toBeGreaterThan(0);
    // TASK-2.15 antrenor'e iki kural ekledi (".d ~ geçen aya göre" donem
    // kiyasi, ".pill ~ Şubede 1." ustunluk rozeti): 6 → 8.
    expect(dusurulenCapalar("antrenor").length).toBe(8);
    expect(dusurulenCapalar("raporlar").length).toBe(2);
    expect(dusurulenCapalar("cockpit").length).toBe(10);
  });

  it("pozitif çapa: tablo bugün düşürdüğü üç kalemi adıyla taşıyor", () => {
    // Sonda: kapi gercekten bu kalemleri mi oluyor? Biri tablodan duserse
    // asagidaki dongu onu aramayi sessizce birakirdi.
    expect(dusurulenCapalar("antrenor")).toContain("Öğrenci Tutma");
    expect(dusurulenCapalar("raporlar")).toContain("Yenileme & Churn");
    expect(dusurulenCapalar("grup")).toContain("Kampanyalar");
  });

  it("yedi görselin alt metni, kendi ekranından düşen kartı anmıyor", () => {
    for (const [key, shot] of Object.entries(SHOTS)) {
      const alt = shot.alt.toLocaleLowerCase("tr");
      for (const capa of dusurulenCapalar(ekranId(key))) {
        expect(alt, `${key} alt metni düşürülen "${capa}" kartını anıyor`).not.toContain(
          capa.toLocaleLowerCase("tr"),
        );
      }
    }
  });

  it("antrenör alt metni görüntüde gerçekten duran iki yüzeyi anlatıyor", () => {
    // Gozle dogrulandi (2026-09-23, 1200x866 cikti): "Aylik Performans ·
    // PT ders · son 6 ay" grafigi + "Ogrenciler · 28 aktif" tablosu.
    // Ikisinin de karsiligi CAPABILITIES -> simdi (`antrenor-performansi`).
    const alt = SHOTS.antrenor.alt.toLocaleLowerCase("tr");
    expect(alt).toContain("aylık pt ders performansı");
    expect(alt).toContain("öğrenci listesi");
  });
});

// ── TASK-2.14 — denetimin AD DALI tablodan besleniyor ────────────────────
//
// Neden bu blok var: B-018'in kok nedeni "denetim, temizligin KENDI varsayimini
// paylasiyor" idi — ad = iki tam sozcuk. O varsayim yuzunden "Gizem Ö." (ikinci
// sozcuk tek harf) ve "Simge & Gizem" (araya `&` giriyor) hattan gecmisti.
// Duzeltme kalibi buyutmek DEGIL, kaynagi degistirmek: yasakli kume
// REPLACEMENTS/INITIALS tablosunun KAYNAK tarafindan turuyor.
//
// Bu blok denetimin karar fonksiyonunu SENTETIK girdiyle sinar; hattin kendisi
// tarayici ister, bu dosya istemez (v1'in `auditTexts`'i saf birakma gerekcesi
// — screen-cleanup.mjs basligi). Hat seviyesindeki sondalar (bozuk tablo,
// korelmis avatar senkronu, bos kapsam) task dokumaninda rakamiyla duruyor.
describe("TASK-2.14 — görsel denetimin ad dalı temizlik tablosundan türüyor", () => {
  it("yasaklı küme dolu ve tabandan büyük (boş kapsam bekçisi)", () => {
    // Kume cokerse asagidaki senaryolarin HEPSI bedava yesil kosardi.
    // Olculdu 2026-09-23: parca 52, bas harfi 13.
    expect(FORBIDDEN.parts.length).toBeGreaterThanOrEqual(MIN_FORBIDDEN_PARTS);
    expect(FORBIDDEN.tokens.length).toBeGreaterThanOrEqual(MIN_FORBIDDEN_INITIALS);
  });

  it("tablo çökerse türetme hata verir — denetim kapsamsız koşmaz", () => {
    expect(() => deriveForbidden([], [])).toThrow(/yasaklı küme çöktü/);
    // Tek satirlik bir tablo da yeterli degildir.
    expect(() => deriveForbidden([["Gizem Örge", "Yasemin U."]], [["GÖ", "YU"]])).toThrow(
      /yasaklı küme çöktü/,
    );
  });

  it("küme elle yazılmadı: tablonun kaynak tarafından türüyor", () => {
    // Pozitif capa — kume gercekten tablodan geliyorsa bu parcalar ICINDE olmali.
    expect(FORBIDDEN.parts).toContain("Gizem"); // 'Gizem Örge' kaynagindan
    expect(FORBIDDEN.parts).toContain("Simge"); // 'Simge Aköz' kaynagindan
    expect(FORBIDDEN.parts).toContain("Karakurt");
    expect(FORBIDDEN.parts).toContain("Beşiktaş"); // gercek pilot semti
    // Sentetik tabloya yeni bir ad girdiginde kume KENDILIGINDEN buyur.
    const { parts } = deriveForbidden(
      [...Array.from({ length: 45 }, (_, i) => [`Dolgu${i}x`, `Nötr${i}x`] as [string, string]),
       ["Pelinsu Karaağaç", "Derya T."]],
      Array.from({ length: 12 }, (_, i) => [`A${i}`, `B${i}`] as [string, string]),
    );
    expect(parts).toContain("Pelinsu");
    expect(parts).toContain("Karaağaç");
  });

  it("bugün kaçan iki geçiş sınıfını yakalıyor (B-018'in tam nesnesi)", () => {
    // Ikisi de iki-tam-sozcuk kalibinin DISINDA: tek harfli soyadi ve `&`.
    const kisaltilmis = auditTexts(["Box · Gizem Ö. · 17:00 · 60 dk"], "grup");
    expect(kisaltilmis.names.join(" ")).toContain("«Gizem»");

    const veIleBagli = auditTexts(
      ["Simge & Gizem hocaların doluluğu düşük — yeni üye yönlendirmesi buraya."],
      "sube",
    );
    expect(veIleBagli.names.join(" ")).toContain("«Simge»");
    expect(veIleBagli.names.join(" ")).toContain("«Gizem»");
  });

  it("kontrol grubu: eski iki-tam-sözcük kalıbı bu ikisini GÖREMEZ", () => {
    // Sonda: yukaridaki yesil, yeni dalin degil eski dalin eseri olabilir mi?
    // Eski kalip burada birebir yeniden kuruldu; ikisini de kacirdigi
    // gorulmeden yukaridaki testin neyi olctugu bilinemez.
    const eskiKalip = /[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}/g;
    expect("Box · Gizem Ö. · 17:00 · 60 dk".match(eskiKalip)).toBeNull();
    expect("Simge & Gizem hocaların doluluğu düşük".match(eskiKalip)).toBeNull();
  });

  it("nötr hedef adlar yanlış alarm üretmiyor", () => {
    // Tablonun HEDEF tarafi temizligin bilerek yazdigi seydir; denetim kendi
    // ciktisini sizinti sayamaz. Bu ayrim karisirsa hat hic yesile donmez.
    const temiz = auditTexts(
      ["Box · Yasemin U. · 17:00 · 60 dk", "Cüneyt V.", "Zehra G.", "Cansu E.", "Alpfit Plus"],
      "grup",
    );
    expect(temiz.names).toEqual([]);
    expect(temiz.brands).toEqual([]);
  });

  it("avatar baş harfi TAM JETON aranıyor, alt dize değil", () => {
    // Tam jeton: senkronu kacmis bir avatar yakalanir.
    expect(auditTexts(["AG"], "antrenor").names.join(" ")).toContain("«AG»");
    // Alt dize OLSAYDI 'SA' ⊂ 'SAHİL' (hedef semt adi) her ekrani kirmiziya
    // cekerdi; jeton karsilastirmasi bunu dogru birakir.
    expect(auditTexts(["SAHİL"], "cockpit").names).toEqual([]);
    // 'EK' iki yerde birden: kaynakta Ebrar Karakurt, hedefte Ege K. Iki harfli
    // jeton tanim geregi belirsiz (B-044 k.3) — hedef tarafi kazanir ve bu
    // OLCULDU: takvim.html:166 EK tam da "Melissa V." (→ "Ege K.") yanindadir.
    expect(auditTexts(["EK"], "takvim").names).toEqual([]);
  });

  it("ikincil kalıp dalı ve izin listesi hâlâ yaşıyor", () => {
    // Kalip dali TASK-2.13'un kendi kendini dogrulayan kapisini tasiyor:
    // 'Öğrenci Tutma' izin satiri tablodan turetilerek cikarildi, yani dusurme
    // sessizce basarisiz olursa denetim onu ad sizintisi sayar. Kalip dali
    // kaldirilsaydi o kapi sessizce sokulmus olurdu.
    expect(auditTexts(["Öğrenci Tutma"], "antrenor").names).toContain("Öğrenci Tutma");
    // Ayni tamlama izin listesinde duran bir ekranda bulgu DEGILDIR.
    expect(auditTexts(["Aylık Performans"], "antrenor").names).toEqual([]);
    // Marka dali ayri kosuyor ve degismedi.
    expect(auditTexts(["muhasebe@weekendplus.com"], "raporlar").brands.length).toBe(1);
  });
});

// ── TASK-2.15 — gorsel denetimin IDDIA DALI ──────────────────────────────
//
// Neden bu blok var: B-018'in kok nedeninin ikinci yarisi. TASK-2.14 AD dalini
// tablodan besledi; iddia sizintisi icin ise denetimde HIC DAL YOKTU — yuzde,
// ciro, ustunluk ve yol-haritasi kalemleri "kalip kacirdi" degil, hic
// kontrol edilmiyordu (B-044 kalem 3). Sozluk `research/lib/claim-leak.mjs`'te
// TEK KAYNAK olarak durur; ikinci tuketicisi M6 F6.4'un metin denetimi olacak.
//
// Hat seviyesindeki sondalar (cockpit dusurme kurallarinin sokulmesi, kontrol
// gruplu eski denetim, sozlugun budanmasi) task dokumaninda rakamiyla duruyor;
// bu blok saf karar fonksiyonunu sentetik girdiyle sinar.
describe("TASK-2.15 — görsel denetimin iddia dalı", () => {
  it("sözlük dolu ve tabandan büyük (boş kapsam bekçisi)", () => {
    // Sozluk cokerse asagidaki senaryolarin HEPSI bedava yesil kosardi.
    expect(CLAIM_LEAK.length).toBeGreaterThanOrEqual(MIN_CLAIM_PATTERNS);
    // Her satir kendi gerekcesini tasimali — sozluk "neden yasak" bilgisini
    // kaybederse bir sonraki bakimci mesru veriyi siler (ayrac kurali).
    for (const k of CLAIM_LEAK) {
      expect(k.id, "kalıp id'siz").toBeTruthy();
      expect(k.neden, `${k.id} gerekçesiz`).toBeTruthy();
      expect(k.sinif, `${k.id} sınıfsız`).toBeTruthy();
    }
  });

  it("Türkçe kıvrım: BÜYÜK harfli iddia yakalanıyor — ve `/i` bunu yapamıyor", () => {
    // Olculdu 2026-09-23: rozet metni buyuk harfle gecebilir ve Turkce'de
    // I/ı kivrimi `/i` bayragiyla CALISMAZ. Kontrol grubu olmadan asagidaki
    // yesil, dogru mekanizmanin eseri mi bilinemez.
    const rozet = "EN HIZLI BÜYÜYEN ŞUBE";
    expect(claimLeaks(rozet).length).toBeGreaterThan(0);
    expect(/en hızlı/i.test(rozet)).toBe(false); // kontrol grubu
    expect(rozet.toLowerCase().includes("en hızlı")).toBe(false); // kontrol grubu
    expect(trLower(rozet)).toContain("en hızlı");
  });

  it("ayraç kuralı: nötr gösterge serbest, kıyas/üstünlük/projeksiyon yasak", () => {
    // Serbest taraf — urunun ISLEVI. Bunlar kirmiziya donerse hat hic yesile
    // donmez ve bir sonraki bakimci mesru demo verisini siler.
    for (const notr of [
      "₺2.140.000",
      "%82",
      "842",
      "Aktif Üye",
      "Toplam Ciro",
      "%59 pay",
      "+71 bu ay yeni",
      "Doluluk",
      "Aylık Performans",
    ]) {
      expect(claimLeaks(notr), `nötr değer yanlış alarm verdi: ${notr}`).toEqual([]);
    }
    // Yasak taraf — B-018'in ve B-044'un adiyla saydigi dizgeler.
    for (const yasak of [
      "+%34 geçen aya göre",
      "Akşam slotları doldurulursa ciro tek başına ~₺110B/ay artabilir",
      "★ en hızlı büyüyen şube",
      "Merkez ciroda lider, ama yeni şube",
      "Vadi aylık %34 büyümeyle",
      "4 ayda 227 üyeye ulaştı",
      "★ Şubede 1.",
      "1. ciro",
      "Büyüme (MoM)",
      "Şubede en yüksek öğrenci tutma oranı",
      "%91 3 aylık tutma",
    ]) {
      expect(claimLeaks(yasak).length, `yasak dizge kaçtı: ${yasak}`).toBeGreaterThan(0);
    }
  });

  it("temizliğin KENDİ yazdığı hiçbir hedef iddia sayılmıyor", () => {
    // Ad dalinin "hedef tarafi cikarilir" kuralinin iddia karsiligi: denetim
    // kendi ciktisini sizinti sayamaz. Iki tablonun da hedef tarafi taranir.
    for (const [, hedef] of TEXT_FIXES) {
      expect(claimLeaks(hedef), `temizliğin hedefi sızıntı sayıldı: ${hedef}`).toEqual([]);
    }
  });

  it("izin listesi TAM DEĞERE bakar — terim başka cümlede hâlâ yakalanır", () => {
    const mesru =
      "Antrenör seç → gün seç → müsait saat seç → onayla. Admin'in elle telefonla randevu yazması biter — salonun en büyük günlük yükü ortadan kalkar.";
    // Izinli cumle: bulgu DEGIL (musterinin derdini tarif ediyor).
    expect(auditTexts([mesru], "takvim").claims).toEqual([]);
    // uye-telefon ayni belgeden uretiliyor, listeye BAGLI (kopya degil).
    expect(auditTexts([mesru], "uye-telefon").claims).toEqual([]);
    // AYNI terim baska bir cumlede hala yasak — parcaya izin verilseydi bu
    // ekranda "en buyuk" tamamen korelirdi.
    expect(auditTexts(["Türkiye'nin en büyük kulüp yazılımı"], "takvim").claims.length)
      .toBeGreaterThan(0);
    // Izin listesi olmayan bir ekranda mesru cumle de bulgudur (fail-closed).
    expect(auditTexts([mesru], "cockpit").claims.length).toBeGreaterThan(0);
  });

  it("düşürülen çapalar sözlük tarafından BAĞIMSIZ olarak görülüyor", () => {
    // TASK-2.13 bunu rakamla olcmustu: uc dusurme birden kaldirildiginda eski
    // denetim yalniz 1/3'unu goruyordu ("Kampanyalar" tek sozcuk, "Yenileme &
    // Churn" `&` yuzunden kor). Sozluk dusurme tablosundan TURETILMEDIGI icin
    // (dairesellik — claim-leak.mjs basligi) ucunu de gorur: bir dusurme
    // kurali sessizce kalkarsa uretim durur.
    for (const capa of ["Kampanyalar", "Yenileme & Churn", "Öğrenci Tutma"]) {
      expect(claimLeaks(capa).length, `düşürülen çapa korumasız: ${capa}`).toBeGreaterThan(0);
    }
  });

  it("yol haritası terimleri bayatlamıyor: hiçbiri CAPABILITIES.simdi'de değil", () => {
    // Bu, elle tutulan listenin TEK bekcisidir ve yalniz bu katmanda
    // kurulabilir (arastirma konteyneri `src/`i gormuyor — PHASE-2 arastirmasi).
    // Bir kalem "yolda"dan "simdi"ye tasinirsa sozluk onu hala yasaklar ve hat
    // MESRU bir ekrani reddetmeye baslar; bu test o gun kirmizi doner.
    const simdiMetni = CAPABILITIES.simdi.map((c) => trLower(c.label)).join(" | ");
    const yolHaritasi = CLAIM_LEAK.filter((k) => k.sinif === "yol haritası kalemi");
    expect(yolHaritasi.length).toBeGreaterThan(0);
    for (const k of yolHaritasi) {
      expect(k.re.test(simdiMetni), `"${k.id}" artık CAPABILITIES.simdi'de — sözlükten çıkarılmalı`)
        .toBe(false);
    }
    // Pozitif capa: kiyas gercekten CAPABILITIES'i okuyor.
    const yoldaMetni = [...CAPABILITIES.yolda, ...CAPABILITIES.sonra]
      .map((c) => trLower(c.label))
      .join(" | ");
    expect(yoldaMetni).toContain("kampanya");
    expect(yoldaMetni).toContain("churn");
  });

  it("iddia eşlemesi AD tablosuna sızmıyor — kontrol grubuyla", () => {
    // OLCULDU 2026-09-23: bu satir once dogrudan REPLACEMENTS'e konuldu ve hat
    // kirmizi dondu — `[cockpit] ad sizintisi: ["«ciro» ⊂ \"Aylık ciro\""]`.
    // Sebep: deriveForbidden yasakli AD kumesini REPLACEMENTS'in kaynak
    // tarafindan turetir ve iddia cumlesinin her sozcugunu ad sayar.
    expect(CLAIM_REPLACEMENTS.length).toBeGreaterThan(0);
    // Bugunku ayrim: siradan sozcukler yasakli AD kumesinde YOK.
    for (const sozcuk of ["ciro", "doluluk", "sayısı", "eğitmen", "bazlı"]) {
      expect(FORBIDDEN.parts, `"${sozcuk}" yasaklı ad kümesine sızmış`).not.toContain(sozcuk);
    }
    // KONTROL GRUBU: ayni satir ad tablosuna konsaydi kume gercekten bozulurdu.
    const bozuk = deriveForbidden(
      [...REPLACEMENTS, ...CLAIM_REPLACEMENTS] as [string, string][],
      [
        ["GÖ", "YU"] as [string, string],
        ["SA", "CV"] as [string, string],
        ...Array.from({ length: 12 }, (_, i) => [`A${i}`, `B${i}`] as [string, string]),
      ],
    );
    expect(bozuk.parts).toContain("ciro");
    expect(bozuk.parts).toContain("doluluk");
  });

  it("denetim dört dallı: ad · marka · iddia birlikte raporlanıyor", () => {
    const r = auditTexts(
      ["Box · Gizem Ö. · 17:00 · 60 dk", "muhasebe@weekendplus.com", "+%34 geçen aya göre"],
      "grup",
    );
    expect(r.names.join(" ")).toContain("«Gizem»");
    expect(r.brands.length).toBe(1);
    expect(r.claims.join(" ")).toContain("büyüme kıyası");
  });
});
