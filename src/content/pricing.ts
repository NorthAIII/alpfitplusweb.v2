/**
 * Fiyat — kaynak: alpfit-plus-satis/fiyat/model.md (karar 2026-07-10, kurucu).
 * Tum fiyatlar KDV HARIC yayinlanir (B2B alici KDV'yi indiriyor).
 * Tier yok, egitmen limiti yok, tek fiyat salon basina.
 */

export const PRICING = {
  firstBranch: 1500,
  extraBranch: 1200,
  extraBranchDiscountPct: 20,
  setupPerBranch: 3000,
  trialDays: 15,
  vatNote: "Tüm fiyatlar KDV hariçtir.",
  /** Yillik pesin: kurulum ucreti alinmaz. Ayrica yuzde indirimi EKLENMEZ. */
  annualPrepayBenefit: "Yıllık peşin ödemede kurulum ücreti alınmaz.",
} as const;

export const INCLUDED = [
  "v1'in tamamı, modül kısıtı yok",
  "Üye mobil uygulaması",
  "Antrenör mobil uygulaması",
  "Diyetisyen modülü",
  "Çok şube cockpit",
  "Finans, ciro ve borç takibi",
  "Raporlar ve Excel dışa aktarma",
  "Bildirim ve push altyapısı",
  "Sınırsız eğitmen",
  "Sınırsız üye",
] as const;

/** Sube sayisina gore aylik tutar (KDV haric). */
export function monthlyFor(branches: number): number {
  const n = Math.max(1, Math.floor(branches));
  return PRICING.firstBranch + (n - 1) * PRICING.extraBranch;
}

/** Yillik pesin = 12 ay, kurulum yok. */
export function annualPrepayFor(branches: number): number {
  return monthlyFor(branches) * 12;
}

/** Aylik yol = 12 ay + sube basina kurulum. */
export function monthlyPathYearOneFor(branches: number): number {
  const n = Math.max(1, Math.floor(branches));
  return monthlyFor(n) * 12 + PRICING.setupPerBranch * n;
}

export function trySavingsPct(branches: number): number {
  const a = annualPrepayFor(branches);
  const m = monthlyPathYearOneFor(branches);
  return Math.round(((m - a) / m) * 1000) / 10;
}

/**
 * Cok subede piyasa kiyasi.
 *
 * URUN ADI GECMEZ. Turkiye'de karsilastirmali reklam mevzuati rakibi adiyla
 * anmayi siki kosullara bagliyor; ayrica rekabet dosyasinin kendi kurali
 * "rakip iddialarini kendi davranisimiza cevir" diyor. Bu yuzden yalnizca
 * YONTEM ve RAKAM yayinlaniyor: mobil uygulamanin ayri paket oldugu bir
 * kurulumun yayinlanmis liste fiyatlarindan bizim aritmetigimiz.
 *
 * Kaynak (ic referans, sitede yayinlanmaz): rekabet/yerli-oyuncular.md,
 * erisim 2026-07-10.
 */
export const RIVAL_MULTI_BRANCH = {
  note:
    "Karşılaştırma, mobil uygulamanın ayrı paket olarak fiyatlandığı bir kurulumun Temmuz 2026'da yayınlanmış liste fiyatlarından bizim yaptığımız hesaptır. Ürün adı yazmıyoruz ve bu, herhangi bir firmanın size vereceği teklif değildir.",
  /** Ilk sube 3.999 + ek sube 1.199 (KDV haric), yayinlanmis liste fiyati. */
  appStartFirst: 3999,
  appStartExtra: 1199,
  rows: [
    { branches: 2, label: "2 şubeli stüdyo" },
    { branches: 5, label: "5 şubeli zincir" },
    { branches: 6, label: "6 şubeli zincir" },
  ],
} as const;

export function rivalAppStartFor(branches: number): number {
  const n = Math.max(1, Math.floor(branches));
  return RIVAL_MULTI_BRANCH.appStartFirst + (n - 1) * RIVAL_MULTI_BRANCH.appStartExtra;
}

export const TRY = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export function tl(n: number): string {
  return TRY.format(n).replace(/\s?₺/, "").trim();
}
