import { describe, expect, it } from "vitest";

import {
  CAPABILITIES,
  type Capability,
  type CapabilityStage,
  capability,
  capabilityProse,
  capabilityTitle,
  moduleProse,
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
