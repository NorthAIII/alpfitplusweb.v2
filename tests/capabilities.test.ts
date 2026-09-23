import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CHAT_ROOT, CHAT_TOPICS } from "@/content/chat";
import { FAQ_HOME } from "@/content/faq";
import {
  CAPABILITIES,
  CAPABILITY_STAGES,
  type Capability,
  type CapabilityStage,
  capability,
  capabilityProse,
  capabilityStage,
  capabilityTitle,
  moduleProse,
  stageNote,
  upcomingCapability,
} from "@/content/product";
import { PRODUCT_STATUS } from "@/content/site";

// TASK-2.08: "bugun var / yolda / yol haritasinda" ayriminin tek kaynagi
// product.ts -> CAPABILITIES. Bu dosya o kaynagin IDDIA kapisidir.
//
// Kapinin isi tek: urun koduna karsi karsiligi OLCULEMEYEN bir yetenek
// "bugun var" kademesine sizmasin. Olcum ve dosya/satir kaniti
// _dev/bulgular/B-029-*.md icinde; burada o olcumun sonucu civileniyor.
//
// Kapi iki ayakli, cunku tek ayak fail-open verirdi:
//   (a) kalem KIMLIGI dogru kademede mi  -> kalemi "yolda"dan "simdi"ye tasimayi yakalar
//   (b) kalem METNI "simdi"de geciyor mu -> ayni iddiayi mevcut bir "simdi"
//       kalemine yeniden yazmayi yakalar (id hic tasinmadan)
// Bos kapsam ayrica sinanir: kademe bosalirsa (a) ve (b) hicbir seye bakmadan
// yesil kalir -- "hic bakmadan PASS basan kapi" tam olarak budur.

const STAGES: CapabilityStage[] = ["simdi", "yolda", "sonra"];

/** Turkce kucultme -- "İPTAL" ve "I" tuzagi icin locale sart. */
const kucult = (s: string) => s.toLocaleLowerCase("tr");

const simdiMetni = () =>
  CAPABILITIES.simdi.map((c) => kucult(`${c.label} ${c.modul ?? ""}`)).join(" | ");

/**
 * B-029'un olctugu bes karsiliksiz iddia. `yasakli` = o iddianin "bugun var"
 * kademesinde gorunmesi demek olan ifadeler (kalem kalem, urunun kendi
 * kaydindaki gerekcesiyle).
 */
const KARSILIKSIZ: { id: string; iddia: string; urunGercegi: string; yasakli: string[] }[] = [
  {
    id: "uye360-tam",
    iddia: "Üye 360: ölçüm grafiği ve diyetisyen notu tek ekranda",
    urunGercegi: "ürünün kendi 'Yakında' kutusu — Üye 360 tam fazı (W8)",
    yasakli: ["üye 360", "ölçüm grafiği", "diyetisyen notu"],
  },
  {
    id: "iptal-esigi-ayari",
    iddia: "İptal eşiğini siz belirlersiniz",
    urunGercegi: "CANCEL_THRESHOLD_MS kod sabiti; ayarlanabilirlik v1.5 adayı",
    yasakli: ["iptal eşiği", "eşiği siz", "eşiğini siz"],
  },
  {
    id: "uyelik-bitis-bildirimi",
    iddia: "Üyelik bitişi push'u / bitişe yaklaşan üyeye bildirim",
    // TASK-2.09 yeniden olctu: 12 degil 14 (urun iki gonderim daha ekledi);
    // hicbiri hala uyelik bitisi degil. Bitise yaklasan uye PANELDE listelenir.
    urunGercegi: "14 gönderim fonksiyonunun hiçbiri üyelik bitişi göndermiyor",
    yasakli: ["üyelik bitiş", "bitişine yaklaşan", "bitişe yaklaşan"],
  },
  {
    // ⚠️ TASK-2.09 (olculdu 2026-09-23) B-029'un bu satirini DARALTTI.
    // B-029 "revokeGrant'in uretim cagirani yok" diye olcmustu; o dogru ama
    // eksik: geri alma uretimde `revokeTemplate` uzerinden kosuyor
    // (accounts-update.ts:861 -> revokeGrant -> permissionGrant.deleteMany),
    // uc PATCH /accounts/:userId server.ts:375'te kayitli ve paneli
    // web/src/lib/account-mutations.ts cagiriyor. Yani "yetkiler sube bazinda
    // verilir ve geri alinir" cumlesi DOGRU ve sitede duruyor.
    // Ertelenmis olan yalniz SABLONDAN BAGIMSIZ tek-yetki revoke ucu.
    // Bu yuzden `yasakli` daraltildi: eski genis liste ("geri alin", "geri
    // alma") artik DOGRU olan cumleyi kirmizi yapardi (yanlis alarm).
    id: "yetki-geri-alma",
    iddia: "Tek bir yetkinin şablon değiştirmeden geri alınması",
    urunGercegi: "revoke HTTP ucu v1.5'e ertelendi (permission-templates.ts:15-17)",
    yasakli: ["şablon değiştirmeden", "tek tek geri al", "yetkiyi sökme"],
  },
  {
    id: "kampanya",
    iddia: "Toplu duyuru ve kampanya",
    urunGercegi: "broadcast var, kampanya adlı rota/sayfa/servis yok",
    yasakli: ["kampanya"],
  },
];

describe("yetenek kademeleri — boş kapsam", () => {
  // Bu blok olmadan asagidaki iddia kapisi bos bir kademede sessizce yesil kalir.
  it.each(STAGES)("%s kademesi boş değil", (stage) => {
    expect(CAPABILITIES[stage].length).toBeGreaterThan(0);
  });

  it("modül cümlesi en az iki modül sayıyor", () => {
    expect(CAPABILITIES.simdi.filter((c) => c.modul).length).toBeGreaterThan(1);
  });
});

describe("B-029 — karşılıksız iddia 'bugün var' kademesine giremez", () => {
  it.each(KARSILIKSIZ)("$iddia → 'yolda' kademesinde ($urunGercegi)", ({ id }) => {
    const yoldaIds = CAPABILITIES.yolda.map((c) => c.id);
    const simdiIds = CAPABILITIES.simdi.map((c) => c.id);
    expect(yoldaIds).toContain(id);
    expect(simdiIds).not.toContain(id);
  });

  it.each(KARSILIKSIZ)("$iddia → metni 'bugün var' kalemlerinde geçmiyor", ({ yasakli }) => {
    const metin = simdiMetni();
    for (const ifade of yasakli) {
      expect(metin).not.toContain(kucult(ifade));
    }
  });
});

describe("kalem kimlikleri", () => {
  it("id'ler kademeler arasında da benzersiz", () => {
    const hepsi = STAGES.flatMap((s) => CAPABILITIES[s].map((c) => c.id));
    expect(new Set(hepsi).size).toBe(hepsi.length);
  });

  it("kalem id'siyle çağrılabiliyor (çağrı yeri indeksle aramaz)", () => {
    expect(capability("qr-turnike").label).toBe("QR ve turnike ile giriş");
    expect(capability("online-odeme").label).toBe("online ödeme");
  });

  it("bilinmeyen id sessizce boş dönmüyor, hata veriyor", () => {
    expect(() => capability("olmayan-kalem")).toThrow(/Bilinmeyen yetenek kalemi/);
  });
});

describe("düzyazı türetmesi", () => {
  // capabilityProse virgulle bagliyor; etiketin KENDI icinde virgul varsa
  // cumle okunamaz hale gelir (olculdu: "simdi" kademesi tam olarak boyle,
  // o yuzden tip duzeyinde disarida). Duzyaziya acik kademeler temiz kalmali.
  it.each(["yolda", "sonra"] as const)("%s kademesinin etiketleri virgül taşımıyor", (stage) => {
    for (const c of CAPABILITIES[stage]) {
      expect(c.label).not.toContain(",");
    }
  });

  it("kademe 'a, b ve c' biçiminde sayılıyor, nokta eklenmiyor", () => {
    const sonra = capabilityProse("sonra");
    expect(sonra).toBe(
      "Online ödeme, QR ve turnike ile giriş, Apple Health ve Google Fit, " +
        "yapay zekâ destekli gelişim ve beslenme analizi ve kurumsal üyelik",
    );
    expect(sonra.endsWith(".")).toBe(false);
  });

  it("özel ad ve kısaltma cümle içinde bozulmuyor", () => {
    const sonra = capabilityProse("sonra");
    expect(sonra).toContain("QR ve turnike");
    expect(sonra).toContain("Apple Health ve Google Fit");
  });

  it("başlık büyütmesi Türkçe — 'iptal' → 'İptal'", () => {
    const iptal = CAPABILITIES.yolda.find((c) => c.id === "iptal-esigi-ayari") as Capability;
    expect(capabilityTitle(iptal).startsWith("İ")).toBe(true);
  });

  it("PRODUCT_STATUS.modules artık elle yazılmıyor, kademeden türüyor", () => {
    expect(PRODUCT_STATUS.modules).toBe(`${moduleProse()}.`);
    expect(PRODUCT_STATUS.modules).toContain("antrenör performansı");
    // Uye 360 modul cumlesine GIRMEZ -- ekran var ama iki kalemi "Yakinda".
    expect(kucult(PRODUCT_STATUS.modules)).not.toContain("üye 360");
  });
});

// ── TASK-2.10 — TUKETICI KAPISI (B-040) ───────────────────────────────────
//
// Yukaridaki bloklar SABITIN kendi dogrulugunu sorar. Bu blok farkli bir soru
// sorar: sabit dogru olsa bile bir bilesen ayni listeyi ELLE yeniden yazabilir
// mi? B-040'in olctugu ayrisma tam olarak buydu — `/ozellikler` 5 yol-haritasi
// kalemi sayarken FounderProgram 4 sayiyordu, ikisi de sabiti gormuyordu.
//
// Kapsam BILINCLE "yolda" + "sonra" kademeleri: B-040'in bes evde ayristigini
// olctugu siniftir ve bu etiketler baska hicbir mesru baglamda gecmez. "simdi"
// kademesi DISARIDA ve bu olculdu — modul duzeyli etiketleri ("antrenör
// performansı", "diyetisyen modülü") sayfanin meta aciklamasinda ve modul
// basliklarinda mesru olarak geciyor; o sinifin taramasi TASK-2.12'nin isi.
// TASK-2.11 listeyi ikiden ALTIYA cikardi (B-040'in kapanisi): chat agaci,
// SSS, karsilastirma sayfasi ve fiyat sayfasi da ayni sabiti okuyor.
// `iceAktarim` ayri bir alan cunku src/content icindekiler goreli yolla
// (`./product`), sayfa ve bilesenler takma adla (`@/content/product`) baglanir
// — tek bir kalibi aramak dordunu sessizce muaf tutardi.
/** Sabite baglanmis tuketiciler + her birinin baglanti kaniti olan sembol. */
const TUKETICILER = [
  {
    yol: "src/app/ozellikler/page.tsx",
    iceAktarim: '@/content/product',
    baglanti: "CAPABILITY_STAGES",
  },
  {
    yol: "src/components/sections/FounderProgram.tsx",
    iceAktarim: '@/content/product',
    baglanti: "capabilityProse",
  },
  { yol: "src/content/chat.ts", iceAktarim: "./product", baglanti: "capabilityProse" },
  { yol: "src/content/faq.ts", iceAktarim: "./product", baglanti: "capabilityProse" },
  { yol: "src/content/karsilastirma.ts", iceAktarim: "./product", baglanti: "upcomingCapability" },
  { yol: "src/app/fiyat/page.tsx", iceAktarim: '@/content/product', baglanti: "stageNote" },
] as const;

const kaynakOku = (yol: string) =>
  readFileSync(fileURLToPath(new URL(`../${yol}`, import.meta.url)), "utf8");

/** Elle yazilmasi yasak kalemler: yol haritasinin iki kademesi. */
const YOL_HARITASI_ETIKETLERI = (["yolda", "sonra"] as const).flatMap((s) =>
  CAPABILITIES[s].map((c) => c.label),
);

describe("tüketiciler — boş kapsam", () => {
  // Bu blok olmadan asagidaki "geçmiyor" kontrolleri iki yoldan sessizce
  // yesil kalirdi: etiket listesi bosalirsa dongu hic donmez, dosya okunamaz
  // ya da bosalirsa da hicbir sey bulunmaz.
  it("yasaklı etiket listesi dolu", () => {
    expect(YOL_HARITASI_ETIKETLERI.length).toBeGreaterThan(5);
  });

  it.each(TUKETICILER)("$yol okunuyor ve sabite bağlı", ({ yol, iceAktarim, baglanti }) => {
    const kaynak = kaynakOku(yol);
    expect(kaynak.length).toBeGreaterThan(1000);
    expect(kaynak).toContain(`from "${iceAktarim}"`);
    expect(kaynak).toContain(baglanti);
  });
});

describe("B-040 — yol haritası kalemi bileşende elle yazılmaz", () => {
  it.each(TUKETICILER)("$yol sabiti atlayan kalem taşımıyor", ({ yol }) => {
    const kaynak = kucult(kaynakOku(yol));
    const elle = YOL_HARITASI_ETIKETLERI.filter((e) => kaynak.includes(kucult(e)));
    expect(elle).toEqual([]);
  });
});

describe("kademe sırası", () => {
  it("üç kademe de açık sırada sayılıyor", () => {
    expect([...CAPABILITY_STAGES]).toEqual(STAGES);
  });
});

// ── TASK-2.11 — YAYIN KAPISI (B-040'in ters yonu) ─────────────────────────
//
// Yukaridaki tuketici kapisi "kalem adi elle yazilmasin" diyor. Bu blok
// baska bir seyi civiliyor: adi sabitten alan bir cumle, kalem YAYINLANDIGI
// gun hala "bu bizde yok" diyor olabilir. Ad hizalanir, cumle yanlis kalir.
// upcomingCapability/stageNote o gun derlemeyi durdurur; burada durdugu
// olculuyor.
describe("yayın kapısı — yayınlanmış kalem yol haritası cümlesinde anılamaz", () => {
  const YOL_HARITASI_CUMLESI_KURAN = ["qr-turnike", "online-odeme"] as const;

  it.each(YOL_HARITASI_CUMLESI_KURAN)("%s hâlâ yayınlanmamış", (id) => {
    expect(capabilityStage(id)).not.toBe("simdi");
    expect(() => upcomingCapability(id)).not.toThrow();
  });

  it.each(YOL_HARITASI_CUMLESI_KURAN)("%s için kademe eki cümleye hazır", (id) => {
    expect(["yolda", "yol haritasında"]).toContain(stageNote(id));
  });

  // Kontrol grubu: kapi gercekten "simdi"yi reddediyor mu? Bu ayak olmadan
  // ustteki iki kontrol, kapi hic calismasa da yesil kalirdi.
  it.each(["takvim-rezervasyon", "mobil-uygulama"])(
    "'bugün var' kalemi %s kapıdan geçemiyor",
    (id) => {
      expect(capabilityStage(id)).toBe("simdi");
      expect(() => upcomingCapability(id)).toThrow(/elden geçirilmeli/);
      expect(() => stageNote(id)).toThrow(/elden geçirilmeli/);
    },
  );

  it("bilinmeyen kalem sessizce geçmiyor", () => {
    expect(() => upcomingCapability("olmayan-kalem")).toThrow(/Bilinmeyen yetenek kalemi/);
  });
});

// ── TASK-2.11 — "Ürün hangi aşamada?" iki evde de sabitle aynı ────────────
//
// B-040'in olctugu ayrisma tam buydu: chat agaci uc kalem sayarken SSS ucu,
// `/ozellikler` besi sayiyordu. Asagisi ikisinin de sabitten turedigini ve
// birbirinden AYRISAMAYACAGINI civiliyor.
const chatAsama = () => {
  const dugum = CHAT_TOPICS.find((t) => t.id === "asama");
  if (!dugum) throw new Error("chat ağacında 'asama' düğümü yok");
  return dugum;
};

const faqAsama = () => {
  const soru = FAQ_HOME.find((f) => f.q === "Ürün hangi aşamada?");
  if (!soru) throw new Error("SSS'de 'Ürün hangi aşamada?' sorusu yok");
  return soru;
};

describe("aşama cevabı — chat ve SSS aynı kaynaktan", () => {
  it("iki ev de hasat ediliyor (boş kapsam)", () => {
    expect(chatAsama().a.join(" ").length).toBeGreaterThan(200);
    expect(faqAsama().a.length).toBeGreaterThan(200);
  });

  it.each([
    ["chat", () => chatAsama().a.join(" ")],
    ["SSS", () => faqAsama().a],
  ])("%s cevabı pilot cümlesini yeniden yazmıyor (B-014)", (_ad, metin) => {
    const govde = metin();
    expect(govde).toContain(PRODUCT_STATUS.sentence);
    expect(govde).toContain(`${PRODUCT_STATUS.version} hazır`);
  });

  it.each([
    ["chat", () => chatAsama().a.join(" ")],
    ["SSS", () => faqAsama().a],
  ])("%s cevabı iki kademeyi de sabitten sayıyor (B-040)", (_ad, metin) => {
    const govde = metin();
    expect(govde).toContain(capabilityProse("yolda"));
    expect(govde).toContain(capabilityProse("sonra"));
  });

  it("chat modül sayımını PRODUCT_STATUS ile aynı listeden alıyor (B-014)", () => {
    expect(chatAsama().a[0]).toContain(moduleProse());
    expect(PRODUCT_STATUS.modules).toBe(`${moduleProse()}.`);
  });
});

// Agacin cikis disiplini F1.3'un kabul kriteri; "asama" dugumu bu turda
// yeniden yazildigi icin kapi burada duruyor (kardesi hemen ustte).
describe("chat ağacı — çıkışsız düğüm yok", () => {
  it("ağaç hasat ediliyor", () => {
    expect(CHAT_TOPICS.length).toBeGreaterThan(5);
    expect(CHAT_ROOT.length).toBeGreaterThan(2);
  });

  it.each(CHAT_TOPICS.map((t) => t.id))("%s düğümü çıkış taşıyor", (id) => {
    const dugum = CHAT_TOPICS.find((t) => t.id === id) as (typeof CHAT_TOPICS)[number];
    expect((dugum.next?.length ?? 0) + (dugum.links?.length ?? 0)).toBeGreaterThan(0);
  });

  it("devam soruları ve kök başlıklar ağaçta karşılığı olan düğümler", () => {
    const idler = new Set(CHAT_TOPICS.map((t) => t.id));
    for (const t of CHAT_TOPICS) for (const sonraki of t.next ?? []) expect(idler).toContain(sonraki);
    for (const kok of CHAT_ROOT) expect(idler).toContain(kok);
  });
});
