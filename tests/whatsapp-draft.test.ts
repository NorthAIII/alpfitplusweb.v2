import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CONTACT, WHATSAPP_DRAFT_FIELDS, whatsappDraftHref } from "@/content/site";

/**
 * TASK-3.25 (B-022'nin ikincil onerisi) — 503 KURTARMA BAGLANTISININ KAPISI.
 *
 * Form hedefe yazamayip 503 `no-sink` dondugunde hata kutusundaki WhatsApp
 * baglantisi kullanicinin yazdiklarini `?text=` ile tasir. Tasinan her alan
 * ayni zamanda UCUNCU BIR TARAFIN (wa.me) adres satirina giden bir alandir:
 * kapsam bu yuzden kod tarafinda dar ve OLCULEBILIR tutulur.
 *
 * YONTEM: kapi alan adlarini elle saymaz -- `whatsappDraftHref`'e TUM form
 * kaydi verilir ve ciktida NE CIKTIGI olculur. Boylece alan kumesi iki yerde
 * tutulmaz ve "kaynaga elle yazilmis liste" kilidi kurulmaz
 * (memory/urun-iddiasi-capa-dogrulamasi.md).
 *
 * SESSIZ GECME YASAK: her yokluk iddiasinin yaninda onu ayirt eden bir
 * POZITIF CAPA kosar -- "hic bakmadim" ile "bulamadim" ayni yesili basmasin.
 */

const REPO_ROOT = new URL("../", import.meta.url);
const SRC_DIR = new URL("src/", REPO_ROOT);

/** Gercek bir gonderimde formun uretecegi kayit — alanlar `DemoForm`'daki `name` degerleridir. */
const FORM_KAYDI = {
  name: "Ayşe Yılmaz",
  club: "Örnek Pilates Stüdyo",
  phone: "0555 111 22 33",
  email: "gizli-adres@example.test",
  branches: "2",
  segment: "Diğer",
  message: "randevuları WhatsApp'tan alıyoruz, ciroyu Excel'de tutuyoruz",
  website: "",
  consent: "on",
} as const;

function metni(href: string): string {
  const [, sorgu] = href.split("?text=");
  return sorgu ? decodeURIComponent(sorgu) : "";
}

type SrcFile = { rel: string; source: string };

/** `src/` agacini yurur. Bos donuste FIRLATIR — bos kapsam kapiyi olcumsuz birakirdi. */
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
  if (out.length === 0) throw new Error("src/ taramasi HIC dosya bulamadi — kapsam bos");
  return out;
}

const SRC_FILES = readSrcFiles();

describe("503 kurtarma bağlantısı — taşınan alanlar", () => {
  it("pozitif çapa: ad, kulüp ve telefon adrese giriyor", () => {
    const href = whatsappDraftHref(FORM_KAYDI);
    expect(href.startsWith(`${CONTACT.whatsapp.href}?text=`), `beklenmeyen adres: ${href}`).toBe(true);

    const text = metni(href);
    expect(text, "ad taşınmadı").toContain(FORM_KAYDI.name);
    expect(text, "kulüp taşınmadı").toContain(FORM_KAYDI.club);
    expect(text, "telefon taşınmadı").toContain(FORM_KAYDI.phone);
  });

  it("e-posta ve serbest mesaj adrese GİRMİYOR (tüm kayıt verildiği hâlde)", () => {
    // Kapi alan ADLARINA degil, gercekten cikan DEGERLERE bakar: fonksiyona
    // formun tamami verilir, disarida kalmasi gerekenler ciktida aranir.
    const text = metni(whatsappDraftHref(FORM_KAYDI));
    expect(text, "e-posta adresi üçüncü tarafın adres satırına sızdı").not.toContain(FORM_KAYDI.email);
    expect(text, "serbest mesaj üçüncü tarafın adres satırına sızdı").not.toContain(FORM_KAYDI.message);
    expect(text, "kulüp tipi taşınmamalıydı").not.toContain("Diğer");
  });

  it("taşınan alan kümesi tam olarak üç ve tek kaynakta", () => {
    expect(WHATSAPP_DRAFT_FIELDS.map((f) => f.key)).toEqual(["name", "club", "phone"]);
  });

  it("alanların hepsi boşken ?text= HİÇ eklenmiyor (boş şablon gönderilmez)", () => {
    const href = whatsappDraftHref({ name: "", club: "   ", phone: "", email: "a@b.test", message: "dolu" });
    expect(href).toBe(CONTACT.whatsapp.href);
    expect(href.includes("?"), "boş formda adres satırında sorgu var").toBe(false);
  });

  it("kısmen dolu formda yalnız dolu alanlar satır üretiyor", () => {
    const text = metni(whatsappDraftHref({ name: "Ayşe Yılmaz", club: "", phone: "" }));
    expect(text).toContain("Ad: Ayşe Yılmaz");
    expect(text).not.toContain("Kulüp:");
    expect(text).not.toContain("Telefon:");
  });

  it("çok uzun değer adresi şişirmiyor (tavan uygulanıyor)", () => {
    const uzun = "x".repeat(5000);
    const href = whatsappDraftHref({ name: uzun, club: uzun, phone: uzun });
    expect(href.length, `adres ${href.length} karakter — tavan düşmüş`).toBeLessThan(1000);
    // Pozitif capa: tavan degeri tamamen silmiyor, kirpiyor.
    expect(metni(href)).toContain("Ad: xxxxx");
  });
});

describe("503 kurtarma bağlantısı — tek kaynak ve sayaç korunuyor", () => {
  it("taban adres sorgusuz kalıyor (12 dosyadaki çağrı sitesi etkilenmiyor)", () => {
    expect(CONTACT.whatsapp.href).toBe("https://wa.me/905359375955");
    expect(CONTACT.whatsapp.href.includes("?"), "taban href'e sorgu eklenmiş").toBe(false);
  });

  it("tıklama sayacının deseni ön-doldurulmuş adresi de tanıyor", () => {
    // Desen ELLE yazilmaz, sayacin KENDI kaynagindan cikarilir: sayac baska
    // bir onek kullanmaya baslarsa bu kapi da onunla birlikte kayar.
    const tracker = SRC_FILES.find((f) => f.rel === "src/components/layout/ClickTracker.tsx");
    expect(tracker, "ClickTracker.tsx bulunamadı — sayaç başka eve taşınmış").toBeTruthy();
    const m = /href\.startsWith\("([^"]+)"\)/.exec(tracker!.source);
    expect(m, "sayaçta WhatsApp öneki bulunamadı — desen kırık").toBeTruthy();
    const onek = m![1] as string;
    expect(onek).toBe("https://wa.me");
    expect(
      whatsappDraftHref(FORM_KAYDI).startsWith(onek),
      "ön-doldurulmuş adres sayacın desenine uymuyor — WhatsApp tıklamaları sessizce sayılmaz olur",
    ).toBe(true);
  });

  it("`?text=` üreten tek yer içerik kaynağıdır (kalan çağrı siteleri sade)", () => {
    const uretenler = SRC_FILES.filter((f) => /\?text=/.test(f.source))
      .map((f) => f.rel)
      .sort();
    // Pozitif capa: tarama bilinen tek uretici yeri GORUYOR. Gormeseydi bos
    // liste "hicbir yerde yok" diye okunurdu — fail-open.
    expect(uretenler, "tarama ön-doldurmayı üreten yeri hiç görmedi — desen kırık").toContain(
      "src/content/site.ts",
    );
    expect(
      uretenler,
      "ikinci bir yer WhatsApp adresine sorgu ekliyor — ön-doldurma çağrı yerinde kalmalı",
    ).toEqual(["src/content/site.ts"]);
  });
});
