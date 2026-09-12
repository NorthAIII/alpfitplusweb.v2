/**
 * Iletisim bicimi dogrulamasi (B-021, TASK-1.12).
 *
 * Katı RFC/E.164 denetimi yok; amac acik copu (`abcdef!!!`, `bu-eposta-degil`)
 * elemek, mesru bir yazimi zorlamamak degil. Tek kisilik ekip ve donusum
 * onceligi: kural gevsek tarafta hata yapsin (TASK-1.12 dikkat notu).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Basit bicim kontrolu: `yerel@alan.uzanti` sinifi. */
export function isValidEmail(value: string): boolean {
  return value.length > 0 && EMAIL_RE.test(value);
}

/**
 * Turkiye telefon yazimlarini kabul eder. Bosluk, tire, parantez ve bastaki
 * `+` atildiktan sonra yalniz rakam kalmali; uzunluk 10 (5xx...), 11
 * (05xx...) ya da 12 + `90` on eki (+90 5xx...) olmali. Harf iceren deger
 * reddedilir.
 */
export function isValidPhone(value: string): boolean {
  if (!value) return false;
  const stripped = value.replace(/[\s\-()]/g, "");
  const digits = stripped.startsWith("+") ? stripped.slice(1) : stripped;
  if (digits.length === 0 || !/^\d+$/.test(digits)) return false;
  if (digits.length === 10 || digits.length === 11) return true;
  return digits.length === 12 && digits.startsWith("90");
}

export type ContactCheck = {
  ok: boolean;
  message?: string;
};

/**
 * "En az biri gecerli olsun" kurali (B-021 onerisi). `phone`/`email` zaten
 * temizlenmis (trim + MAX kirpma) degerler olmali. Ikisi de bosken cagirma —
 * o durum `missing-contact` ile CAGIRAN tarafta ele alinir; bu fonksiyon
 * yalniz en az bir alan doluyken BICIM sorusuna cevap verir.
 */
export function checkContact(phone: string, email: string): ContactCheck {
  const phoneValid = isValidPhone(phone);
  const emailValid = isValidEmail(email);

  if (phoneValid || emailValid) return { ok: true };

  const phoneFilled = phone.length > 0;
  const emailFilled = email.length > 0;

  if (phoneFilled && emailFilled) {
    return {
      ok: false,
      message: "Telefon numarası ve e-posta adresi geçerli görünmüyor. Kontrol edip tekrar deneyin.",
    };
  }
  if (phoneFilled) {
    return { ok: false, message: "Telefon numarası geçerli görünmüyor. Kontrol edip tekrar deneyin." };
  }
  return { ok: false, message: "E-posta adresi geçerli görünmüyor. Kontrol edip tekrar deneyin." };
}
