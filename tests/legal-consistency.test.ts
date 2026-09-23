import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/demo/route";
import { KVKK, PRIVACY, TERMS, type LegalDoc } from "@/content/legal";
import { CONTACT } from "@/content/site";
import { track } from "@/lib/analytics";
// Gorsel uretim hattinin KENDI tablolari ve KARAR fonksiyonu. `web` konteyneri
// deponun tamamini gorur (arastirma konteyneri yalniz `research/`u) — bu import
// yalniz bu katmanda mumkun; deseni tests/iddia-metinleri.test.ts kurdu.
import {
  FORBIDDEN,
  INITIALS,
  MIN_FORBIDDEN_INITIALS,
  MIN_FORBIDDEN_PARTS,
  REPLACEMENTS,
  auditTexts,
} from "../research/lib/screen-cleanup-v2.mjs";

/**
 * TASK-2.18 (B-060) — YAYINDAKI YASAL BEYANLARIN DEPO ICI DAYANAKLARI.
 *
 * `legal.ts` kendi basliginda "metinler sitenin GERCEK veri akisini anlatir"
 * diyor. Bu dosya o cumlenin kapisidir: her dal bir YAYINDAKI CUMLEYI bir
 * KODDAKI/KONFIGDEKI OLGUYA baglar. Dayanak dustugu gun metin sessizce yalan
 * olmaz — burasi kirilir.
 *
 * YONTEM (v1'in dersi — ../Alpfitplus-website.v1/tests/server/
 * legal-consistency.spec.ts): metin KOPYALANMAZ, ILISKI dogrulanir. Her dal
 * cumleden KISA ve AYIRT EDICI bir parca alir, o parcanin ilgili dokumanda
 * TAM BIR KEZ gectigini olcer, sonra dayanagi ayrica olcer. Parca metinle
 * birlikte bayatlar ve bu BILINCLIDIR: metin yeniden yazildiginda kapinin
 * kirilmasi "bu beyanin dayanagi hala duruyor mu?" sorusunu sordurmak icindir.
 *
 * SESSIZ GECME YASAK — bu dosyanin asil disiplini. Bir kapi "eslesme yok ->
 * gecti" diye okunursa test degildir. Uc katman:
 *   (a) `claimOnce` SIFIR eslesmede de BIRDEN FAZLA eslesmede de kirilir;
 *   (b) her tarama kendi kapsaminin BOS OLMADIGINI ayrica ispatlar (dosya
 *       sayisi tabani + korpusta bilinen bir NISAN dizesi);
 *   (c) `deriveForbidden`/`auditTexts` gibi karar fonksiyonlari bilinen bir
 *       POZITIF CAPA ile sinanir — yesil, kapinin kostugunun kaniti degildir.
 * Asagidaki "bos kapsam bekcisi" bloklari (a)-(c)'yi dogrudan kosar.
 *
 * KAPSAM DEPO ICIDIR. Yasal metnin koda/konfige bagli olgu iddialari SEKIZDEN
 * fazladir ve hepsi bu depodan GORULMEZ:
 *   · "12 ay" saklama  -> komsu depo (v1 pocketbase), TASK-2.19'un dali.
 *   · Sunucu/tedarikci ulkeleri (Hetzner/DE, Resend ABD + eu-west-1, Google MX,
 *     Umami semasinda IP sutunu yoklugu, erisim kaydinda rotasyon yoklugu)
 *     -> DEPO DISI olgular; kaynaklari canli sistemlerdir ve TASK-2.17'de
 *     olculup `legal.ts`'in Aktarim yorumuna capalandi. BURADA CIVILENMEZLER —
 *     depo icinden olculemeyen bir olguyu "olculmus" gibi baglamak, tam da bu
 *     paketin engellemek icin var oldugu sey olurdu.
 * Her dal kendi ÖLÇÜLEMEYEN sinirini kendi yorumunda yazar.
 */

const REPO_ROOT = new URL("../", import.meta.url);
const SRC_DIR = new URL("src/", REPO_ROOT);

/** Korpusun gercekten yuruduguNU ispatlayan nisan: layout.tsx'te durur. */
const SRC_SENTINEL = 'data-exclude-search="true"';
/** `src/` bugun 67 dosya tasiyor (olculdu 2026-09-23). Taban kaba bilincli. */
const MIN_SRC_FILES = 40;

// ---------------------------------------------------------------------------
// Ortak yardimcilar
// ---------------------------------------------------------------------------

/** Bir yasal dokumanin TUM metin degerleri: intro + baslik + paragraf + liste. */
function bodyTexts(doc: LegalDoc): string[] {
  const out: string[] = [doc.intro, doc.title, doc.description];
  for (const section of doc.sections) {
    out.push(section.title);
    for (const block of section.blocks) {
      if (block.type === "p" || block.type === "h") out.push(block.text);
      else out.push(...block.items);
    }
  }
  return out;
}

/**
 * Bir beyan parcasinin dokumanda TAM BIR KEZ gectigini olcer.
 *
 * Iki yonlu kapi: 0 eslesme = cumle metinden dusmus (ya da yeniden yazilmis);
 * >1 eslesme = ayni taahhut ikinci kez yazilmis ve iki ev ayrisabilir. Parca
 * uzunlugu ayrica taban alir — bosaltilmis ya da anlamsiz kisa bir parca her
 * metinle eslesir ve kapi boşa kosardi (v1'in PRECEDENCE_NOTE dersi).
 */
function claimOnce(doc: LegalDoc, docName: string, fragment: string): void {
  expect(
    fragment.length,
    `beyan parcasi anlamsiz kisa ("${fragment}") — kapi bosa kosar`,
  ).toBeGreaterThan(25);

  const hits = bodyTexts(doc).filter((text) => text.includes(fragment));

  expect(
    hits.length,
    `${docName}: «${fragment}» ile eslesen metin sayisi ${hits.length} (1 bekleniyordu) — ` +
      "beyan metinden dustu, yeniden yazildi ya da ikinci kez kopyalandi; " +
      "dayanagi hala duruyor mu, yeniden olcup bu dali guncelle",
  ).toBe(1);
}

/** Depodaki bir dosyayi METIN olarak okur; bos/eksik dosyada kirilir. */
function readRepoFile(relPath: string): string {
  const url = new URL(relPath, REPO_ROOT);
  const path = fileURLToPath(url);
  expect(existsSync(path), `dayanak dosyasi yok: ${relPath}`).toBe(true);
  const source = readFileSync(path, "utf8");
  expect(source.length, `dayanak dosyasi bos: ${relPath}`).toBeGreaterThan(0);
  return source;
}

type SrcFile = { rel: string; source: string };

/**
 * `src/` agacini yurur ve metin dosyalarini dondurur.
 *
 * BOS KAPSAM BEKCISI burada baslar: yuruyusun kendisi bir sey BULMAZSA
 * asagidaki "yokluk" dallari bedava yesil kosardi. Fonksiyon bos donuste
 * FIRLATIR; cagiranlar ayrica dosya sayisi tabanini ve nisan dizesini olcer.
 */
function readSrcFiles(): SrcFile[] {
  const exts = [".ts", ".tsx", ".css", ".mjs", ".js"];
  const out: SrcFile[] = [];

  function walk(dirUrl: URL, prefix: string): void {
    const dir = fileURLToPath(dirUrl);
    for (const entry of readdirSync(dir)) {
      const childUrl = new URL(`${entry}${statSync(`${dir}/${entry}`).isDirectory() ? "/" : ""}`, dirUrl);
      const childPath = fileURLToPath(childUrl);
      if (statSync(childPath).isDirectory()) {
        walk(childUrl, `${prefix}${entry}/`);
        continue;
      }
      if (!exts.some((ext) => entry.endsWith(ext))) continue;
      out.push({ rel: `src/${prefix}${entry}`, source: readFileSync(childPath, "utf8") });
    }
  }

  walk(SRC_DIR, "");
  if (out.length === 0) {
    throw new Error("src/ taramasi HIC dosya bulamadi — kapsam bos, kapi olcum yapamaz");
  }
  return out;
}

const SRC_FILES = readSrcFiles();

/** Bir desene uyan `src/` dosyalarinin yollari (sirali, kararli). */
function srcFilesMatching(pattern: RegExp): string[] {
  return SRC_FILES.filter((file) => pattern.test(file.source))
    .map((file) => file.rel)
    .sort();
}

// ---------------------------------------------------------------------------
// BOS KAPSAM BEKCISI — kapilarin kapsaminin gercekten dolu oldugunu ispatlar
// ---------------------------------------------------------------------------

describe("boş kapsam bekçisi — taramalar gerçekten bir şeye bakıyor", () => {
  it("src/ yürüyüşü dosya buldu ve içinde bilinen bir nişan var", () => {
    expect(SRC_FILES.length).toBeGreaterThanOrEqual(MIN_SRC_FILES);

    // Nisan: yuruyus src/app/layout.tsx'e GERCEKTEN ulasti mi? Ulasmadiysa
    // asagidaki cerez/ucuncu-taraf/bolge "yokluk" dallari hicbir seye bakmadan
    // yesil kosardi — tam da bu paketin yasakladigi sessiz gecme.
    const sentinelFiles = srcFilesMatching(/data-exclude-search="true"/);
    expect(
      sentinelFiles,
      "nişan dizesi korpusta yok — src/ yürüyüşü kırık, yokluk dalları ölçüm yapmıyor",
    ).toContain("src/app/layout.tsx");
    expect(SRC_SENTINEL).toBe('data-exclude-search="true"');
  });

  it("boş bir korpusa karşı yokluk sorgusu ayırt edici (kontrol grubu)", () => {
    // Ayni sorgu BOS korpusta da "eslesme yok" der. Bu yuzden yokluk dallari
    // tek basina yeterli degildir; ustteki nisan olcumu onlarin on kosuludur.
    const bos: SrcFile[] = [];
    expect(bos.filter((f) => /localStorage/.test(f.source))).toHaveLength(0);
    expect(SRC_FILES.filter((f) => /data-exclude-search/.test(f.source)).length).toBeGreaterThan(0);
  });

  it("claimOnce sıfır eşleşmede de fazla eşleşmede de kırılıyor", () => {
    // Kapinin KENDISI sinaniyor: metinde olmayan bir parca gecerse kapi
    // sessizce gecirirdi. Pozitif capa + negatif capa yan yana.
    expect(() =>
      claimOnce(KVKK, "KVKK", "bu cümle yasal metinde kesinlikle geçmiyor — sonda"),
    ).toThrow();
    expect(() => claimOnce(KVKK, "KVKK", "Başvurunuz en geç otuz gün içinde sonuçlandırılır.")).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// DAL 1 — "soru isaretinden sonrasi olcume gitmez"
// ---------------------------------------------------------------------------

describe("dal 1 — adres satırındaki sorgu ölçüme gönderilmiyor", () => {
  const FRAGMENT = "soru işaretinden sonra gelen kısım ölçüme hiç gönderilmez";

  it("beyan Gizlilik metninde tam bir kez geçiyor", () => {
    claimOnce(PRIVACY, "PRIVACY", FRAGMENT);
  });

  it("dayanak: Umami script etiketinde data-exclude-search=\"true\" duruyor", () => {
    // Dayanak TEK bir ozniteliktir (B-060). Dustugu gun izleyicinin varsayilani
    // URL'yi SORGUSUYLA gonderir ve yukaridaki cumle yalan olur.
    //
    // ⚠️ Oznitelik dosya genelinde ARANMAZ: `layout.tsx` kendi JSDoc'unda da
    // oznitelikten soz ediyor (iki yerde, B-056 gerekcesi). Dosya genelinde
    // sayan ilk surum bu yuzden 2 buldu — bir YORUM, dayanak diye okunacakti.
    // Kapi bu yuzden ETIKETIN ICINE bakar: hem yorum yaniltmasini keser hem de
    // ozniteligin DOGRU script'te durdugunu ayrica olcer.
    const layout = readRepoFile("src/app/layout.tsx");

    const basla = layout.indexOf("<Script");
    expect(basla, "layout.tsx'te <Script> etiketi yok — olcum yuklemesi baska eve tasinmis").toBeGreaterThan(-1);
    const bitis = layout.indexOf("/>", basla);
    expect(bitis, "<Script> etiketi kapanmiyor — kaynak okunamadi").toBeGreaterThan(basla);

    const etiket = layout.slice(basla, bitis + 2);
    expect(etiket.length, "<Script> dilimi bos — kapi kapsamsiz kosuyor").toBeGreaterThan(20);

    // Pozitif capa: bu GERCEKTEN olcum script'i mi? Degilse oznitelik sorgusu
    // yanlis etikete bakiyor demektir.
    expect(etiket, "<Script> olcum kaynagini yuklemiyor — dayanak baska etikete tasinmis").toContain(
      "src={UMAMI_SCRIPT_SRC}",
    );
    expect(layout, "UMAMI_SCRIPT_SRC kendi sunucumuzu gostermiyor").toContain(
      'const UMAMI_SCRIPT_SRC = "https://umami.kiwiailab.com/script.js"',
    );

    expect(
      etiket,
      'olcum script etiketinde data-exclude-search="true" yok — izleyici artik adres ' +
        "satirini sorgusuyla birlikte gonderiyor, Gizlilik metninin sorgu cumlesi yalan",
    ).toContain('data-exclude-search="true"');

    // Ikinci bir script etiketi girdiyse yukaridaki dilim yalniz ilkini olcer.
    const etiketSayisi = (layout.match(/<Script/g) ?? []).length;
    expect(
      etiketSayisi,
      `layout.tsx'te ${etiketSayisi} adet <Script> var (1 bekleniyordu) — ikinci bir script ` +
        "girdiyse olcum/ucuncu-taraf beyanlari yeniden okunmali",
    ).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// DAL 2 — "ad, telefon, e-posta ve mesaj olcume gonderilmez"
// ---------------------------------------------------------------------------

describe("dal 2 — form alanları ölçüme gönderilmiyor", () => {
  const FRAGMENT = "forma yazdığınız mesaj ölçüme gönderilmez";

  it("beyan Gizlilik metninde tam bir kez geçiyor", () => {
    claimOnce(PRIVACY, "PRIVACY", FRAGMENT);
  });

  it("dayanak (davranış): track() yalnız { surface } gönderiyor, başka alan yok", () => {
    // Kaynak taramasi degil DAVRANIS olcumu: `track` ne gonderiyorsa o olculur.
    // Imzaya yeni bir parametre eklenip yuke konursa burasi kirilir.
    const umamiTrack = vi.fn();
    // @ts-expect-error -- testte kismi bir window kuruluyor (analytics.test.ts deseni)
    globalThis.window = { umami: { track: umamiTrack } };

    track("demo-submit", "demo-form");

    // Pozitif capa: cagri GERCEKTEN yapildi. Yapilmasaydi asagidaki yuk
    // incelemesi hicbir seye bakmaz ve bedava yesil kosardi.
    expect(umamiTrack, "track() umami'ye hic ulasmadi — olcum yapilamadi").toHaveBeenCalledTimes(1);

    const [eventName, payload] = umamiTrack.mock.calls[0] as [string, Record<string, unknown>];
    expect(eventName).toBe("demo-submit");
    expect(
      Object.keys(payload).sort(),
      "olcum yukunde `surface` disinda alan var — kisisel veri sizma yuzeyi acildi",
    ).toEqual(["surface"]);
    expect(payload.surface).toBe("demo-form");

    // @ts-expect-error -- testte eklenen global temizleniyor
    delete globalThis.window;
  });

  it("dayanak (yüzey): izleyiciyi çağıran tek dosya analytics.ts", () => {
    // Ikinci yarisi: yuk dar olsa bile bir bilesen izleyiciyi DOGRUDAN cagirip
    // yanina kisisel veri koyabilirdi. `track()` tek gecis noktasi olmali.
    //
    // ⚠️ Desen `window.umami` DEGIL, CAGRININ kendisidir. Ilk surum
    // `/window\s*\.\s*umami/` ariyordu ve negatif kontrol onu yakaladi: bir
    // TypeScript cast'i (`(window as unknown as {…}).umami?.track(…)`) iki
    // jetonun arasina girince desen eslesmiyor, dosya gorunmez kaliyordu —
    // fail-open. `umami` ile `.track` arasindaki bag cast'ten etkilenmez ve
    // destructure/takma-ad yazimlarini da yakalar.
    const cagiranlar = srcFilesMatching(/umami\s*\??\s*\.\s*track\s*\(/);

    // Pozitif capa: desen HIC eslesmezse liste bos olurdu ve bos liste
    // "kimse cagirmiyor" diye okunurdu — oysa cagiran biri VAR olmali.
    expect(cagiranlar.length, "izleyiciyi cagiran hicbir dosya bulunamadi — desen kirik").toBeGreaterThan(0);

    expect(
      cagiranlar,
      "izleyiciyi dogrudan cagiran ikinci bir dosya var — olcum yuku artik tek yerden " +
        "gecmiyor, Gizlilik metninin 'form alanlari olcume gonderilmez' cumlesi garanti degil",
    ).toEqual(["src/lib/analytics.ts"]);
  });
});

// ---------------------------------------------------------------------------
// DAL 3 — "gercek bir kisinin verisi gosterilmemektedir"
// ---------------------------------------------------------------------------

describe("dal 3 — ürün görsellerinde gerçek kişi verisi yok", () => {
  const FRAGMENT = "Gerçek bir kulübün veya kişinin verisi gösterilmemektedir.";

  it("beyan Kullanım Koşulları'nda tam bir kez geçiyor", () => {
    claimOnce(TERMS, "TERMS", FRAGMENT);
  });

  it("dayanak: temizlik tabloları dolu ve yasaklı küme tabanın üstünde", () => {
    expect(REPLACEMENTS.length, "ad degistirme tablosu bos").toBeGreaterThan(0);
    expect(INITIALS.length, "avatar bas harfi tablosu bos").toBeGreaterThan(0);
    // `deriveForbidden` zaten tabanin altinda FIRLATIR (import aninda kosar);
    // burada ayrica olculuyor ki taban dusurulurse kapi bunu soylesin.
    expect(FORBIDDEN.parts.length).toBeGreaterThanOrEqual(MIN_FORBIDDEN_PARTS);
    expect(FORBIDDEN.tokens.length).toBeGreaterThanOrEqual(MIN_FORBIDDEN_INITIALS);
  });

  it("dayanak (pozitif çapa): denetim yasaklı kümenin HER parçasını yakalıyor", () => {
    // TABLONUN DOLU OLMASI, DENETIMIN KOSTUGUNUN KANITI DEGILDIR (TASK-2.10/2.13
    // dersi). Karar fonksiyonuna tablodan turemis yasakli parcalarin TAMAMI tek
    // tek veriliyor ve her birinin bulguya dusmesi olculuyor.
    //
    // Neden tek bir ornek degil de hepsi: ilk surum `FORBIDDEN.parts[0]` ile
    // sondaliyordu ve o deger "Weekend" cikti — yani ESKI MARKA parcasi, oysa
    // bu dalin civiledigi cumle GERCEK KISI verisi hakkinda. Tek ornekli sonda
    // hangi sinifi olctugunu secemiyor; tamamini kosmak secmeyi gereksiz kilar.
    //
    // Sarmalayici bilerek kucuk harfli: "iki buyuk harfli sozcuk" kalip dali
    // (ucuncu ayak) devreye girip tablo dalinin korlugunu ORTMESIN — bir ayagin
    // digerini kapatmasi, bu paketin tam da aramadigi sahte yesildir.
    const parcalar = FORBIDDEN.parts as string[];
    expect(parcalar.length, "yasakli parca kumesi bos").toBeGreaterThanOrEqual(MIN_FORBIDDEN_PARTS);

    // Ekran id'si bilerek sozlukte YOK: AUDIT_ALLOW/CLAIM_ALLOW bos gecsin,
    // izin listesi sondayi kortlemesin.
    const gorulmeyen = parcalar.filter(
      (parca) => auditTexts([`kayıtta ${parca} geçiyor`], "__kapi-sondasi__").names.length === 0,
    );
    expect(
      gorulmeyen,
      `denetim su yasakli parcalari gormedi — ad dali o kalemlerde kor kosuyor: ${gorulmeyen.join(", ")}`,
    ).toEqual([]);
  });

  it("dayanak (pozitif çapa): avatar baş harfi dalı da körü körüne geçmiyor", () => {
    // Ad dalinin ikinci ayagi: avatar bas harfleri TAM JETON olarak aranir
    // (alt dize degil — 'SA' ⊂ 'SAHİL' tuzagi). Kendi sondasi olmazsa bu ayak
    // ust daldaki parca sondasinin arkasinda gorunmez kalirdi.
    const jetonlar = FORBIDDEN.tokens as string[];
    expect(jetonlar.length).toBeGreaterThanOrEqual(MIN_FORBIDDEN_INITIALS);

    const gorulmeyen = jetonlar.filter(
      (jeton) => auditTexts([jeton], "__kapi-sondasi__").names.length === 0,
    );
    expect(
      gorulmeyen,
      `denetim su avatar bas harflerini gormedi: ${gorulmeyen.join(", ")}`,
    ).toEqual([]);
  });

  it("dayanak (kontrol grubu): masum metin bulguya düşmüyor", () => {
    // Ust dalin ikizi: her sey bulguya dusuyor olsaydi pozitif capa anlamsiz
    // olurdu. Deger kucuk harfli (iki-buyuk-harfli kalip agina takilmasin) ve
    // eski marka dizesini tasimiyor.
    const bulgu = auditTexts(["aylık gelir 12.500"], "__kapi-sondasi__");
    expect(bulgu.names, "masum metin ad sizintisi sayildi — denetim ayirt etmiyor").toEqual([]);
    expect(bulgu.brands).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// DAL 4 — depoya erisim: site hicbir kaydi OKUMUYOR
// ---------------------------------------------------------------------------

describe("dal 4 — site kayıt deposundan okuma yapmıyor", () => {
  const STORE_URL = "https://fake-lead-store.test";
  const FRAGMENT_READ = "var olan kayıtları okuyamaz";
  const FRAGMENT_RULES = "dışarıya açık okuma kuralları kapalıdır";

  type Cagri = { url: string; method: string };
  const cagrilar: Cagri[] = [];

  const fetchMock = vi.fn(async (input: unknown, init?: RequestInit): Promise<Response> => {
    const url = String(input);
    const method = (init?.method ?? "GET").toUpperCase();
    cagrilar.push({ url, method });
    if (url === `${STORE_URL}/lead` && method === "POST") {
      return new Response(JSON.stringify({ id: "kapi123sonda456", prior_count: 0 }), { status: 201 });
    }
    if (url.startsWith(`${STORE_URL}/lead/`) && method === "PATCH") {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }
    // Beklenmeyen her cagri kaydedilir AMA basarisiz doner — sessizce
    // yutulmasin; asagidaki yontem kumesi olcumu zaten onu yakalar.
    return new Response("{}", { status: 500 });
  });

  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    cagrilar.length = 0;
    process.env.LEAD_STORE_URL = STORE_URL;
    process.env.LEAD_STORE_TOKEN = "kapi-sonda-token";
    process.env.IP_HASH_SALT = "kapi-sonda-tuz";
    delete process.env.LEAD_FILE_PATH;
    delete process.env.RESEND_API_KEY;
    delete process.env.DEMO_TO;
    delete process.env.DEMO_FROM;
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    consoleErrorSpy.mockRestore();
  });

  it("beyanların ikisi de KVKK metninde tam birer kez geçiyor", () => {
    claimOnce(KVKK, "KVKK", FRAGMENT_READ);
    claimOnce(KVKK, "KVKK", FRAGMENT_RULES);
  });

  it("dayanak (davranış): uç depoya yalnız yazma yöntemleriyle gidiyor", async () => {
    vi.stubGlobal("fetch", fetchMock);

    // Hiz siniri IP basina 10 dk / 5 istek sayar ve dogrulamadan ONCE kosar
    // (memory -> hiz-sinirli-uca-test-bataryasi.md): bu senaryo kendi IP'sini
    // tasir, baska dosyalarin kotasina girmez.
    const res = await POST(
      new Request("http://localhost/api/demo", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "10.99.18.1" },
        body: JSON.stringify({
          name: "Sonda Kullanıcı",
          club: "Sonda Kulübü",
          branches: "Merkez",
          phone: "05551112233",
          email: "sonda@example.com",
          message: "Kapı sondası.",
          consent: true,
        }),
      }),
    );
    expect(res.status).toBe(200);

    // Pozitif capa: uc GERCEKTEN dis dunyaya gitti. Gitmeseydi asagidaki
    // "okuma yok" olcumu bos bir kume uzerinde bedava yesil kosardi.
    expect(
      cagrilar.length,
      "uc hic fetch yapmadi — kapsam bos, 'okuma yok' olcumu anlamsiz",
    ).toBeGreaterThan(1);

    // ⚠️ Kume TUM cagrilar uzerinden kurulur, yalniz depo onekiyle eslesenler
    // uzerinden DEGIL. Ilk surum `url.startsWith(STORE_URL)` ile suzuyordu ve
    // negatif kontrol onu yakaladi: baska bicimde kurulmus (orn. goreli) bir
    // okuma cagrisi suzgecin disina dusuyor, kapi yesil kaliyordu — fail-open.
    // Simdi olculen sey "uc bu istek boyunca NEREYE, HANGI YONTEMLE gitti"dir;
    // listede olmayan her cift kapiyi kirar.
    const cagriCiftleri = [...new Set(cagrilar.map((c) => `${c.method} ${c.url}`))].sort();
    expect(
      cagriCiftleri,
      `uc su cagrilari yapti: ${JSON.stringify(cagriCiftleri)} — beklenen yalniz olusturma ` +
        "(POST /lead) ve bildirim durumu geri yazimi (PATCH /lead/{id}). Listede baska bir " +
        "cagri varsa site depodan OKUYOR ya da yeni bir hedefe gidiyor; KVKK'nin " +
        "'var olan kayitlari okuyamaz' cumlesi yeniden olculmeli",
    ).toEqual([`PATCH ${STORE_URL}/lead/kapi123sonda456`, `POST ${STORE_URL}/lead`]);
  });

  /**
   * ÖLÇÜLEMEYEN — bu dal beyanin YALNIZ pratik yarisini civiler.
   *
   * Yukaridaki olcum sunu soyler: SITENIN KODU depodan okuma yapmiyor. Sunu
   * SOYLEMEZ: sitenin anahtari okuyamaz. Anahtarin yetki yuzeyi ve koleksiyon
   * kurallari komsu depoda yasar (../Alpfitplus-website.v1/pocketbase — hook
   * uclari + `List/View/Create/Update/Delete` kurallari) ve BU DEPODAN
   * olculemez; capraz depo dali TASK-2.19'undur.
   *
   * Devralinan bir beyani olculmus gibi baglamamak icin burada yalnizca
   * olculebilen taraf baglandi (memory -> urun-iddiasi-capa-dogrulamasi.md).
   */
});

// ---------------------------------------------------------------------------
// DAL 5 — "olcum icin ucuncu bir tarafa veri gondermiyoruz"
// ---------------------------------------------------------------------------

describe("dal 5 — ölçüm için üçüncü tarafa veri gitmiyor", () => {
  const FRAGMENT = "Ölçüm için üçüncü bir tarafa veri göndermiyoruz.";

  /**
   * `src/` icinde gecen TUM dis host'lar — rolleriyle birlikte DONDURULMUS
   * liste (olculdu 2026-09-23). Kume esitligi bilincli olarak KATIDIR: yeni
   * bir dis host girdiginde kapi kirilir ve "bu host olcum yapiyor mu, yasal
   * metnin ucuncu-taraf cumlesi hala dogru mu?" sorusu sorulur. Denylist
   * (bilinen analitik saglayicilari) bilincle REDDEDILDI — listede olmayan
   * yeni bir saglayici sessizce gecerdi, yani fail-open olurdu.
   */
  const IZINLI_HOSTLAR = [
    "alpfitplus.com", // kendi kanonik adresimiz (SITE.url)
    "api.resend.com", // e-posta gonderimi — SUNUCU tarafi fetch, tarayiciya inmez
    "app.alpfitplus.com", // urunun kendi adresi (SITE.appUrl)
    "instagram.com", // sosyal baglanti (footer)
    "kiwiailab.com", // ureticinin adresi (SITE.maker.url)
    "schema.org", // JSON-LD sozluk URI'si — ag cagrisi degil
    "umami.kiwiailab.com", // KENDI olcum sunucumuz
    "wa.me", // WhatsApp yedegi
  ];

  it("beyan KVKK metninde tam bir kez geçiyor", () => {
    claimOnce(KVKK, "KVKK", FRAGMENT);
  });

  it("dayanak: src/ içindeki dış host kümesi dondurulmuş listeyle birebir", () => {
    const hostlar = new Set<string>();
    for (const file of SRC_FILES) {
      for (const m of file.source.matchAll(/https:\/\/([a-zA-Z0-9.-]+)/g)) {
        hostlar.add(m[1] as string);
      }
    }

    // Pozitif capa: tarama bir sey buldu ve KENDI olcum sunucumuzu gordu.
    expect(hostlar.size, "src/ taramasi hic dis host bulamadi — kapsam bos").toBeGreaterThan(4);
    expect(
      hostlar.has("umami.kiwiailab.com"),
      "olcum sunucusu korpusta yok — tarama kirik ya da olcum baska eve tasindi",
    ).toBe(true);

    expect(
      [...hostlar].sort(),
      "src/ icindeki dis host kumesi degisti — yeni host olcum yapiyor mu? " +
        "yapiyorsa yasal metnin 'ucuncu tarafa veri gondermiyoruz' cumlesi yeniden yazilmali",
    ).toEqual(IZINLI_HOSTLAR);
  });

  /**
   * ÖLÇÜLEMEYEN: olcum sunucusunun KENDI davranisi (Umami kurulumunun cerezsiz
   * oldugu, semasinda IP sutunu olmadigi) depo disi bir olgudur — TASK-2.17'de
   * canli semaya karsi olculdu ve `legal.ts`'in Aktarim yorumuna capalandi.
   * Burada yalniz "yuk baska bir tarafa gitmiyor" tarafi baglanir.
   */
});

// ---------------------------------------------------------------------------
// DAL 6 — "calismasi icin gerekli olmayan hicbir cerez yerlestirmez"
// ---------------------------------------------------------------------------

describe("dal 6 — site çerez ve tarayıcı deposu kullanmıyor", () => {
  const FRAGMENT_SITE = "çalışması için gerekli olmayan hiçbir çerez yerleştirmez";
  const FRAGMENT_OLCUM = "Bu yazılım tarayıcınıza çerez yerleştirmez";

  /** Cerez / tarayici deposu yuzeyleri — biri bile girerse beyan yalan olur. */
  const YUZEYLER: [string, RegExp][] = [
    ["document.cookie", /document\s*\.\s*cookie/],
    ["localStorage", /\blocalStorage\b/],
    ["sessionStorage", /\bsessionStorage\b/],
    ["Set-Cookie başlığı", /set-cookie/i],
    ["next/headers cookies()", /\bcookies\s*\(\s*\)/],
  ];

  it("beyanların ikisi de Gizlilik metninde tam birer kez geçiyor", () => {
    claimOnce(PRIVACY, "PRIVACY", FRAGMENT_SITE);
    claimOnce(PRIVACY, "PRIVACY", FRAGMENT_OLCUM);
  });

  it("dayanak: src/ içinde hiçbir çerez / tarayıcı deposu kullanımı yok", () => {
    // ON KOSUL: yokluk olcumu ancak korpus doluysa anlamlidir. Bekci bloğu
    // bunu ayrica kosar; burada da tekrarlanir cunku bu dal TAMAMEN yokluga
    // dayanir — kapsamsiz kosarsa bedava yesil olur.
    expect(SRC_FILES.length).toBeGreaterThanOrEqual(MIN_SRC_FILES);
    expect(srcFilesMatching(/data-exclude-search/).length).toBeGreaterThan(0);

    for (const [ad, desen] of YUZEYLER) {
      const bulunanlar = srcFilesMatching(desen);
      expect(
        bulunanlar,
        `${ad} kullanimi bulundu — Gizlilik metninin "cerez yerlestirmez" cumlesi artik dogru degil`,
      ).toEqual([]);
    }
  });
});

// ---------------------------------------------------------------------------
// DAL 7 — basvuru kanali: "otuz gun icinde sonuclandirilir"
// ---------------------------------------------------------------------------

describe("dal 7 — başvuru adresi tek kaynaktan geliyor", () => {
  const FRAGMENT_KVKK = "Başvurunuz en geç otuz gün içinde sonuçlandırılır.";
  const FRAGMENT_PRIVACY = "Talebiniz en geç otuz gün içinde sonuçlandırılır.";

  it("otuz gün taahhüdü iki metinde de tam birer kez geçiyor", () => {
    claimOnce(KVKK, "KVKK", FRAGMENT_KVKK);
    claimOnce(PRIVACY, "PRIVACY", FRAGMENT_PRIVACY);
  });

  it("dayanak: taahhüdün yanındaki adres CONTACT.support'tan geliyor", () => {
    // Pozitif capa: tek kaynak gercekten bir adres tasiyor.
    expect(CONTACT.support, "CONTACT.support bos ya da adres degil").toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);

    // Adres uc metinde de RENDER EDILMIS halde gorunuyor.
    for (const [ad, doc] of [
      ["KVKK", KVKK],
      ["PRIVACY", PRIVACY],
      ["TERMS", TERMS],
    ] as [string, LegalDoc][]) {
      const hits = bodyTexts(doc).filter((text) => text.includes(CONTACT.support));
      expect(hits.length, `${ad}: basvuru adresi metinde hic gecmiyor`).toBeGreaterThan(0);
    }
  });

  it("dayanak: adres legal.ts kaynağına elle yazılmamış, sabitten okunuyor", () => {
    // v1'in DemoForm dersi: elle yazilmis bir deger kaynak degisince sessizce
    // ayrisir. Iki yonlu kapi — sabit KULLANILIYOR olmali, duz yazim OLMAMALI.
    const source = readRepoFile("src/content/legal.ts");
    expect(source, "legal.ts CONTACT sabitini hic kullanmiyor").toContain("CONTACT.support");
    expect(
      source.includes(CONTACT.support),
      `basvuru adresi legal.ts'e ELLE yazilmis ("${CONTACT.support}") — tek kaynak atlandi`,
    ).toBe(false);
  });

  /**
   * ÖLÇÜLEMEYEN: adresin gercekten POSTA ALDIGI. O bir DNS/MX olgusudur, ag
   * cagrisi gerektirir ve `npm test` ag cagrisi yapmaz — TASK-2.20'nin isi
   * (B-011). Bu dal yalniz TEK KAYNAK disiplinini civiler: metindeki adres ile
   * sitenin her yerinde kullanilan adres ayni sabittir.
   */
});

// ---------------------------------------------------------------------------
// DAL 8 — form ucunun calistigi bolge (DURUM -> Aktif Task Not blogu)
// ---------------------------------------------------------------------------

describe("dal 8 — form ucu için bölge sabitlenmemiş (platform varsayılanı)", () => {
  const FRAGMENT = "Washington, D.C. bölgesindeki sunucularında çalışır";

  it("beyan KVKK metninde tam bir kez geçiyor", () => {
    claimOnce(KVKK, "KVKK", FRAGMENT);
  });

  it("dayanak: repoda vercel.json ve preferredRegion yok", () => {
    // TASK-2.17 fonksiyon bolgesini CANLI olctu (`x-vercel-id` -> `iad1`). O
    // olcum depo disidir ve burada TEKRARLANMAZ. Depo icinden gorulebilen tek
    // yari sudur: BIZ bir bolge sabitlemiyoruz, yani platform varsayilani
    // gecerli. Biri `preferredRegion` eklerse olculmus cumle bayatlar ve bu
    // kapi onu soyler.
    expect(SRC_FILES.length).toBeGreaterThanOrEqual(MIN_SRC_FILES);
    expect(srcFilesMatching(/data-exclude-search/).length).toBeGreaterThan(0);

    const vercelJson = fileURLToPath(new URL("vercel.json", REPO_ROOT));
    expect(
      existsSync(vercelJson),
      "vercel.json dogmus — bolge/calistirma ayari geldiyse KVKK'nin bolge cumlesi yeniden olculmeli",
    ).toBe(false);

    // Yorum satirlari eslesmesin diye ROUTE SEGMENT CONFIG bicimi aranir;
    // `legal.ts` kendi aciklamasinda bu kelimeyi anar (eslesmemeli).
    expect(
      srcFilesMatching(/export\s+const\s+preferredRegion/),
      "bir rota bolge sabitliyor — KVKK'nin 'Washington, D.C.' cumlesi yeniden olculmeli",
    ).toEqual([]);
  });
});
