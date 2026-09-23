/**
 * Ziyaretciye giden e-posta metinleri — TEK kaynak.
 *
 * Demo talebinin onay e-postasi (TASK-2.07, B-059) bir IDDIA YUZEYIDIR:
 * _dev/docs/CLAIMS.md burada da gecerlidir. Ozellikle DONUS SURESI VAADI
 * YENIDEN YAZILMAZ — formun onay kutusundaki cumlenin aynisi kullanilir
 * (`components/sections/DemoForm.tsx` -> "En kisa surede size donup demo icin
 * uygun bir saat belirleyecegiz"). Sitede bugun ucu birden ayrisan donus suresi
 * ifadeleri var (BULGULAR B-026: "birkac dakika" / "ayni gun" / "en kisa
 * surede"); dorduncu bir sure eklemek o ayrismayi buyutur. v1'in metnindeki
 * "(genelde 1 is gunu icinde)" parantezi bu yuzden TASINMADI.
 *
 * EKIBE giden bildirim e-postasi burada DEGIL — o ziyaretciye gorunmeyen bir ic
 * bildirimdir ve alan dokumu gonderim koduyla birlikte yasar
 * (`app/api/demo/route.ts` -> toEmail).
 */

import { CONTACT } from "./site";

export const LEAD_CONFIRMATION = {
  subject: "Talebiniz bize ulaştı — Alpfit Plus",

  /**
   * DUZ METIN, HTML degil (v1 HTML gonderiyordu). Iki gerekce: uc zaten ekip
   * bildirimini duz metin gonderiyor (tek bicim), ve duz metinde kacis /
   * enjeksiyon yuzeyi hic acilmaz.
   *
   * ⚠️ METIN PARAMETRE ALMAZ — TASK-2.21 (UAT senaryo 26). Selamlama eskiden
   * `Merhaba ${name},` idi ve ziyaretcinin yazdigi 120 karaktere kadar metni
   * ALICIYA tasiyordu. Alicinin talep sahibine ait oldugu dogrulanmadigi icin
   * bu, ucuncu bir kisiye bizim dogrulanmis alan adimizdan saldirganin yazdigi
   * metni gonderme yuzeyiydi. Sabit metin bu yuzeyi BICIMSEL olarak kapatir:
   * parametre yoksa enjekte edilecek bir yer de yoktur. Kisisellestirmeyi geri
   * isteyen her degisiklik ayni soruyu yeniden acar — `route.ts` ->
   * `confirmCapped` yalnizca HACMI kirpar, ICERIGI degil.
   *
   * "Bu e-postayi yanitlayin" vaadi ancak yanit EKIBIN kutusuna duserse
   * gercekten calisir — gonderim `reply_to`'yu DEMO_TO yapar (v1 dersi).
   */
  text: [
    `Merhaba,`,
    ``,
    `Demo talebinizi aldık. En kısa sürede size dönüp demo için uygun bir saat belirleyeceğiz.`,
    ``,
    `Acele ediyorsanız bu e-postayı yanıtlamanız yeterli — doğrudan ekibimize ulaşır.`,
    `WhatsApp: ${CONTACT.whatsapp.display}`,
    ``,
    `Alpfit Plus — Kiwi AI Lab`,
  ].join("\n"),
} as const;
