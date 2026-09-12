import { describe, expect, it } from "vitest";

import { checkContact, isValidEmail, isValidPhone } from "@/lib/contact";

// TASK-1.12 (B-021): iletisim bicimi dogrulamasi. Amac acik copu elemek,
// mesru bir yazimi zorlamamak degil -- senaryo tablosu bu yuzden mesru
// Turkiye telefon yazimlariyla baslar (dikkat notu: "sinir vakalari gevsek
// tarafta hata yapsin").

describe("isValidPhone", () => {
  it.each([
    ["hane basi sifirla, 11 hane", "05321112233"],
    ["hane basi sifirsiz, 10 hane", "5321112233"],
    ["ulke kodu + bosluklu", "+90 532 111 22 33"],
    ["parantez ve tireli", "(0532) 111-22-33"],
  ])("kabul: %s (%s)", (_label, value) => {
    expect(isValidPhone(value)).toBe(true);
  });

  it.each([
    ["harf iceriyor", "abcdef!!!"],
    ["9 haneli rakam dizisi", "532111223"],
    ["rakam + harf karisik", "0532abc1234"],
    ["bos deger", ""],
  ])("red: %s (%s)", (_label, value) => {
    expect(isValidPhone(value)).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("kabul: ad@kulup.com", () => {
    expect(isValidEmail("ad@kulup.com")).toBe(true);
  });

  it.each([
    ["@ yok", "bu-eposta-degil"],
    ["alan adinda nokta yok", "a@b"],
    ["yerel kisim bos", "@x.com"],
    ["bos deger", ""],
  ])("red: %s (%s)", (_label, value) => {
    expect(isValidEmail(value)).toBe(false);
  });
});

describe("checkContact — en az biri gecerli olsun (B-021 onerisi)", () => {
  it("telefon gecerli, e-posta bos -> kabul", () => {
    expect(checkContact("05321112233", "").ok).toBe(true);
  });

  it("e-posta gecerli, telefon bos -> kabul", () => {
    expect(checkContact("", "ad@kulup.com").ok).toBe(true);
  });

  it("telefon gecerli, e-posta bozuk -> kabul (en az biri yeterli)", () => {
    const r = checkContact("05321112233", "bu-eposta-degil");
    expect(r.ok).toBe(true);
  });

  it("e-posta gecerli, telefon bozuk -> kabul (en az biri yeterli)", () => {
    const r = checkContact("abcdef!!!", "ad@kulup.com");
    expect(r.ok).toBe(true);
  });

  it("yalniz e-posta dolu ve bozuk, telefon yok -> red, mesaj e-postadan bahseder", () => {
    const r = checkContact("", "bu-eposta-degil");
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/e-posta/i);
    expect(r.message).not.toMatch(/telefon/i);
  });

  it("yalniz telefon dolu ve bozuk, e-posta yok -> red, mesaj telefondan bahseder", () => {
    const r = checkContact("abcdef!!!", "");
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/telefon/i);
    expect(r.message).not.toMatch(/e-posta/i);
  });

  it("ikisi de dolu ve bozuk -> red, mesaj ikisinden de bahseder", () => {
    const r = checkContact("abcdef!!!", "bu-eposta-degil");
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/telefon/i);
    expect(r.message).toMatch(/e-posta/i);
  });
});
