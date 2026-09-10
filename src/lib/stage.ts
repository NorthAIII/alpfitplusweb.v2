/**
 * Dagitimin hangi asamada kostugu tek yerde turetilir.
 *
 * `VERCEL_ENV` tek basina onizlemeyi ayirmaz: Git bagli projede `main`
 * varsayilan uretim dalidir, her push `<proje>.vercel.app` adresine
 * production dagitimidir ve `VERCEL_ENV=production` doner. Bu yuzden asama
 * uretim ALAN ADININ gercek olup olmadigindan turetilir —
 * `VERCEL_PROJECT_PRODUCTION_URL` hala `.vercel.app` ile bitiyorsa gercek
 * yayin yok demektir. Alan adi baglandiginda (M7 F7.5) deger kendiliginden
 * `production` olur; yayin gunu elle cevrilecek bayrak kalmaz.
 *
 * Turetim `next.config.ts` icinde bir kez calisir ve
 * `NEXT_PUBLIC_DEPLOY_STAGE` olarak derlemeye gomulur; uygulama kodu yalnizca
 * asagidaki `DEPLOY_STAGE` sabitini okur.
 */

export type DeployStage = "local" | "preview" | "production";

/**
 * Saf turetim: girdi bir env sozlugu, cikti asama. Node ile dogrudan
 * cagrilabilir olmasi icin saf tutuldu (`process.env` burada okunmaz).
 */
export function deriveDeployStage(env: Record<string, string | undefined>): DeployStage {
  if (!env.VERCEL) return "local";

  const productionUrl = (env.VERCEL_PROJECT_PRODUCTION_URL ?? "").trim().toLowerCase();

  // Alan adi bilinmiyorsa `preview` kalinir: eksik bilgide noindex acik kalsin,
  // sessizce indekslenen bir onizleme adresi geri alinamaz.
  if (env.VERCEL_ENV === "production" && productionUrl !== "" && !productionUrl.endsWith(".vercel.app")) {
    return "production";
  }

  return "preview";
}

/**
 * Uygulama tarafinin tek okuma yuzeyi. Deger derlemeye gomuludur; tanimsizsa
 * (Vercel disi calistirma, dogrudan `next start`) yerel kabul edilir.
 */
export const DEPLOY_STAGE: DeployStage =
  (process.env.NEXT_PUBLIC_DEPLOY_STAGE as DeployStage | undefined) ?? "local";
