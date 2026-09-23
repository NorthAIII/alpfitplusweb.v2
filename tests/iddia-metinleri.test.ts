import { describe, expect, it } from "vitest";

import { MODULES } from "@/content/product";
import { SEGMENTS } from "@/content/segments";

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
