/**
 * Olay gonderme sarmalayicisi -- olay adlari, yuzey etiketleri ve `track()`
 * icin TEK yuzey (TASK-1.08). Iki tuketicisi var: bu dosyayla ayni task'ta
 * bagli DemoForm ve TASK-1.09'daki global tiklama dinleyicisi.
 *
 * Olay adlari v1 ile AYNI olmali (docs/DECISIONS.md, 2026-09-14 karari --
 * onceki "*-click" ekli adlari geriverir): alan adi gecisinde v2, v1'in
 * Umami site kaydina devralinir; adlar farkliysa gecmis ve yeni veri panelde
 * ayri seriye boluner ve geri birlestirilemez. Kaynak (salt-okunur):
 * `../Alpfitplus-website.v1/src/config/analytics.ts`. Sadece bu projede
 * gercekten gonderilen olaylar tanimlanir -- v1'in `email`/`instagram`/`cta`
 * olaylarinin v2'de bugun bir tuketicisi yok, kullanilmayan sabit acilmaz.
 *
 * Yuzey (`surface`) v1'de serbest bir dizeydi; burada TIP DUZEYINDE
 * daraltildi ki panelde dagilan ad kod tarafinda engellensin -- bu, event
 * adlarinin v1 hizasini bozmaz, `surface` olay adindan bagimsiz ayri bir
 * veri alanidir. Liste zamanla buyur (TASK-1.09 yeni ad icat etmez, buradan
 * secer); bugun kullanilmayan ama hazir cepheler de burada (`sorun`,
 * `nasil-calisir`, `cozum` -- ham `<section id>` veren, henuz baglantisiz
 * bolumler).
 */

export const EVENTS = {
  /** Demo formunun basarili gonderimi -- sitenin birincil donusumu. */
  demoSubmit: "demo-submit",
  /** WhatsApp tiklamasi (yuzey `surface` alaninda). */
  whatsapp: "whatsapp",
  /** Telefon tiklamasi. */
  phone: "phone",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export const SURFACES = {
  hero: "hero",
  finalCta: "final-cta",
  footer: "footer",
  header: "header",
  assistant: "assistant",
  demoForm: "demo-form",
  demo: "demo",
  destek: "destek",
  notFound: "404",
  // `<Section id=…>` veren bolumler
  segmentler: "segmentler",
  sss: "sss",
  neden: "neden",
  roller: "roller",
  fiyat: "fiyat",
  moduller: "moduller",
  fayda: "fayda",
  // ham `<section id=…>` veren bolumler
  sorun: "sorun",
  nasilCalisir: "nasil-calisir",
  cozum: "cozum",
} as const;

export type Surface = (typeof SURFACES)[keyof typeof SURFACES];

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Tek gonderme yuzeyi. Kisisel veri parametre olarak ALINMAZ -- imza yalniz
 * olay adi + yuzey kabul eder, serbest veri alani yok (QUALITY 2, KVKK
 * asgarilik). Umami tanimsizsa (reklam engelleyici scripti kesti, script
 * henuz yuklenmedi) veya sunucu tarafinda cagrildiysa (window yok) SESSIZCE
 * doner -- donusum akisi analitige bagimli olmamali.
 */
export function track(event: EventName, surface: Surface): void {
  if (typeof window === "undefined") return;
  window.umami?.track(event, { surface });
}
