import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { createHmac } from "node:crypto";

import { checkContact, isValidEmail } from "@/lib/contact";
import { DEPLOY_STAGE } from "@/lib/stage";
import { LEAD_CONFIRMATION } from "@/content/mail";

/**
 * Demo talebi ucu.
 *
 * v1 sitesinin denetimi (D-01, İ-08) iki şey gösterdi:
 *  - Tek e-posta sağlayıcısına bağlı bir uç, anahtar tanımlı değilse HER talebi
 *    hata ekranına çevirdi ve lead kayboldu.
 *  - Talebin kalıcı hiçbir kaydı yoktu.
 * Bu yüzden burada önce DAYANIKLI KAYIT denenir, e-posta ikincildir. Hiçbir
 * hedef yapılandırılmamışsa uç BAŞARILI DÖNMEZ — kullanıcıyı WhatsApp'a
 * yönlendiren dürüst bir hata döner (sessiz kayıp yok).
 *
 * Kayıt hedefi v1'in lead deposudur (PocketBase, `lead.alpfitplus.com`), Bunker
 * değil — karar: `_dev/docs/DECISIONS.md` 2026-09-14 "Lead hedefi (yeniden, 2)".
 * Depo sözleşmesi: `../Alpfitplus-website.v1/pocketbase/README.md` → "Uç nokta
 * sözleşmesi". Env anahtar adları v1'le AYNIDIR (alan adı geçişinde env taşıması
 * tek hamle olsun diye): `LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT`.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lead = {
  name: string;
  club: string;
  branches: string;
  phone: string;
  email: string;
  segment: string;
  message: string;
  consent: boolean;
  at: string;
  /**
   * Dağıtım aşaması (`local` | `preview` | `production`) — önizlemeden gelen
   * test talepleri e-postada böylece ayırt edilir. Depo KAYDINA girmez: kayda
   * düşen ortam etiketi `LEAD_STORE_TOKEN`'dan türer (token hangi koleksiyona
   * yazılacağını da belirler — aşağı bak → toStore).
   */
  env: string;
  ua: string;
};

const MAX = { name: 120, club: 160, phone: 40, email: 160, message: 2000, segment: 60, branches: 10 };

// Basit bellek içi hız sınırı. Tek süreç için yeterli; ölçek büyürse
// paylaşımlı bir sayaca taşınır.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  const list = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  HITS.set(ip, list);
  if (HITS.size > 5000) HITS.clear();
  return list.length > LIMIT;
}

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Tek satırlık alanlar için `clean()` (TASK-1.19, UAT #26). `clean()` yalnız
 * trim + uzunluk kırpması yapıyordu — kulüp adına konan `\n`/`\r`, Resend'in
 * JSON gövdesindeki `subject`'i ("Demo talebi — Form Spor\nBcc: ...") ve depo
 * e-posta metnindeki `Ad:`/`Şube:`/`Telefon:` alan satırlarını sahteleyebiliyordu.
 * Tüm C0 kontrol karakterleri (`\x00-\x1f`, `\r`/`\n`/`\t` dâhil) ve DEL
 * (`\x7f`) boşluğa çevrilir — KIRPMADAN ÖNCE, ki uzunluk sınırı ayıklanmış
 * metne uygulansın. Çoklu boşluk bilinçli olarak birleştirilmez ("Form
 * Spor\nStüdyo" → "Form Spor Stüdyo", kelimeler yapışmaz). `message` bu
 * fonksiyonu KULLANMAZ — form `<textarea>` sunuyor, satır sonu orada meşru.
 */
function cleanLine(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/[\x00-\x1f\x7f]/g, " ").trim().slice(0, max) : "";
}

/**
 * ip_hash = HMAC-SHA256(ip, IP_HASH_SALT) hex — ham IP hiçbir yere yazılmaz ya
 * da loglanmaz, yalnız bu özet depoya gider (KVKK veri minimizasyonu; kayıt 12
 * ay saklanır — depo README → Saklama politikası).
 */
function hashIp(ip: string, salt: string): string {
  return createHmac("sha256", salt).update(ip).digest("hex");
}

type StoreResult = { stored: boolean; leadId: string; storeStatus: number };

/**
 * Depo yazımı SÖZLEŞMEYE bağlı doğrulanır; `res.ok` (200 dâhil) tek başına
 * yetmez. Depo yalnız **201**'de kayıt oluşturur ve `{id, prior_count}` döner —
 * eski `toWebhook`'un `ok === true` kapısının depoda karşılığı yok (TASK-1.11 →
 * Oturum 2026-09-14, üç kapı karşılaştırması: HTTP durumu tutar, JSON gövde
 * büyük ölçüde tutar — 413 istisna — ama `ok === true` tutmaz).
 *
 * Yapılandırma (URL + token + tuz) eksikse istek hiç GÖNDERİLMEZ — fail-closed
 * (Karar Noktası: tuz eksikse depo denenmez). Tuzsuz IPv4 özeti kaba kuvvetle
 * geri çevrilebilir, yani ham IP'yi saklamakla eşdeğerdir (12 ay saklanır);
 * e-posta yolu açık kaldığı için talep yine kaybolmaz.
 *
 * Loglama QUALITY 2'ye bağlı: URL, token, ip_hash ve kişisel veri loga GİRMEZ —
 * yalnızca durum kodu, deponun kendi hata kodu (40 karaktere kırpılı) ve
 * `lead.at` yazılır. `catch` hata nesnesini loglamaz (hedef adresi taşıyabilir).
 */
async function toStore(lead: Lead, ip: string): Promise<StoreResult> {
  const url = process.env.LEAD_STORE_URL;
  const token = process.env.LEAD_STORE_TOKEN;
  const salt = process.env.IP_HASH_SALT;

  if (!url || !token || !salt) {
    console.error("[demo] Depo yapılandırması eksik, kayıt denenmedi.", { at: lead.at });
    return { stored: false, leadId: "", storeStatus: 0 };
  }

  // Karar Noktası (segment'in yeri — (a) seçildi): tek satır etiket mesajın
  // başına eklenir. Depo şemasında segment kolonu yok (DECISIONS 2026-09-14 →
  // Bedel); boş segmentte satır eklenmez. 2000 (MAX.message) + kısa etiket +
  // ayırıcı deponun kendi 5000 sınırının altında kalır, ayrıca kırpma gerekmez.
  //
  // TASK-1.19 (UAT #26, Karar Noktası — (b) seçildi): etiketle mesaj arasına
  // `---` ayırıcı satırı girer. Ziyaretçi kendi mesajına sahte bir "Segment:"
  // satırı yazsa bile (enjeksiyon denemesi) o satır ayırıcının ALTINDA kalır —
  // gerçek etiket her zaman ayırıcıdan hemen önceki tek satırdır. `message`
  // KIRPILMAZ/DEĞİŞTİRİLMEZ (dikkat notu) — yalnız önüne etiket + ayırıcı eklenir.
  const message = lead.segment ? `Segment: ${lead.segment}\n---\n${lead.message}` : lead.message;

  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/lead`, {
      method: "POST",
      headers: { "content-type": "application/json", "X-Lead-Token": token },
      // Gövde yalnız depo beyaz listesi: env/ua/consent/at gövdeye GİRMEZ.
      // locale sabit "tr" (site tek dilli).
      body: JSON.stringify({
        name: lead.name,
        club: lead.club,
        phone: lead.phone,
        email: lead.email,
        branches: lead.branches,
        message,
        locale: "tr",
        ip_hash: hashIp(ip, salt),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (res.status !== 201) {
      let code = "";
      try {
        const parsed = (await res.json()) as { error?: unknown };
        code = typeof parsed.error === "string" ? parsed.error.slice(0, 40) : "";
      } catch {
        // 413 gibi durumlarda gövde JSON değildir (depo sözleşmesi) — code boş kalır.
      }
      console.error("[demo] Depo kaydı oluşturmadı.", { status: res.status, code, at: lead.at });
      return { stored: false, leadId: "", storeStatus: res.status };
    }

    let leadId = "";
    try {
      const body = (await res.json()) as { id?: unknown };
      leadId = typeof body.id === "string" ? body.id : "";
    } catch {
      // Gövde okunamadı — kayıt yine geçerlidir (v1 davranışı), yalnız id boş
      // kalır ve bildirim durumu geri yazılamaz (PATCH atlanır).
    }

    return { stored: true, leadId, storeStatus: res.status };
  } catch {
    console.error("[demo] Depoya ulaşılamadı (ağ hatası ya da zaman aşımı).", { at: lead.at });
    return { stored: false, leadId: "", storeStatus: 0 };
  }
}

/**
 * Talep sahibinin onay e-postasının sonucu (depo şeması: `notify_lead`).
 * `skipped` = gönderilecek geçerli bir adres yoktu; `failed` = gönderim
 * denendi ve olmadı. Ayrım ekip içindir: `failed` panelde "sağlayıcı reddetti"
 * diye okunur, olmayan bir sorunu kovalatmamalı (v1'in kendi gerekçe notu).
 */
type NotifyLead = "sent" | "failed" | "skipped";

/**
 * Bildirim durumunu kayda geri yazar (Karar Noktası: `notify_*` — (a) seçildi).
 * En fazla 3 sn; sonucu ziyaretçinin yanıtını DEĞİŞTİRMEZ, başarısızlık yalnız
 * loglanır.
 *
 * `notify_lead` 2026-09-14'te bilerek YAZILMIYORDU: site talep sahibine ayrı
 * bir onay e-postası göndermediği için alanı erken `skipped` yazmak, alan adı
 * geçişinde v1'in "ziyaretçi e-posta vermedi" anlamıyla karışırdı. Onay
 * e-postası TASK-2.07'de açıldı (B-059) ve o dayanak düştü — alan artık v1'le
 * AYNI anlamı taşıyor, yani karışma riski tersine döndü: `pending` bırakmak,
 * geçişten sonra aynı koleksiyonda v2 kayıtlarını kalıcı "bildirim beklemede"
 * gösterip alanı okunamaz kılardı. Yeni karar: `docs/DECISIONS.md` 2026-09-22
 * «Onay e-postası açılınca `notify_lead` gerçek sonucu taşır».
 */
async function notifyStore(
  leadId: string,
  notifyTeam: "sent" | "failed",
  notifyLead: NotifyLead,
): Promise<void> {
  const url = process.env.LEAD_STORE_URL;
  const token = process.env.LEAD_STORE_TOKEN;
  if (!leadId || !url || !token) return;

  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/lead/${encodeURIComponent(leadId)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json", "X-Lead-Token": token },
      body: JSON.stringify({ notify_team: notifyTeam, notify_lead: notifyLead }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.error("[demo] Bildirim durumu depoya yazılamadı.", { status: res.status });
    }
  } catch {
    console.error("[demo] Bildirim durumu depoya yazılırken hata (ağ ya da zaman aşımı).");
  }
}

async function toFile(lead: Lead): Promise<boolean> {
  const path = process.env.LEAD_FILE_PATH;
  if (!path) return false;
  try {
    await mkdir(dirname(path), { recursive: true });
    await appendFile(path, JSON.stringify(lead) + "\n", "utf8");
    return true;
  } catch {
    return false;
  }
}

async function toEmail(lead: Lead): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.DEMO_TO;
  const from = process.env.DEMO_FROM;
  if (!key || !to || !from) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email && isValidEmail(lead.email) ? lead.email : undefined,
        subject: `Demo talebi — ${lead.club || lead.name}`,
        text: [
          `Ad: ${lead.name}`,
          `Kulüp: ${lead.club}`,
          `Şube: ${lead.branches}`,
          `Segment: ${lead.segment}`,
          `Telefon: ${lead.phone}`,
          `E-posta: ${lead.email}`,
          ``,
          lead.message,
          ``,
          `KVKK onayı: ${lead.consent ? "verildi" : "YOK"}`,
          `Zaman: ${lead.at}`,
          // Önizleme testi gelen kutusunda ilk bakışta ayrılsın.
          `Ortam: ${lead.env}`,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Talep sahibine onay e-postası (TASK-2.07, B-059 kalem 1 — v1'de vardı, v2'de
 * yoktu). Ekip bildiriminin (`toEmail`) eşidir ve ondan üç yerde ayrılır:
 *
 *  - **Alıcı ziyaretçidir**, `reply_to` ise EKİBİN kutusudur (`DEMO_TO`).
 *    Metnin "bu e-postayı yanıtlamanız yeterli" vaadi ancak böyle gerçekten
 *    çalışır — `DEMO_FROM`'a düşen yanıt kimseye ulaşmaz (v1 dersi).
 *  - **Metin `src/content/mail.ts`'te**, burada değil: ziyaretçiye görünen her
 *    cümle bir iddia yüzeyidir (`_dev/docs/CLAIMS.md`) ve dönüş süresi vaadi
 *    formun onay kutusundakiyle aynı kalmalıdır.
 *  - **Çağrılmadan önce adres doğrulanır** (aşağıda, `isValidEmail`): geçersiz
 *    adrese gönderim denemek garanti bir sağlayıcı reddidir ve kayda
 *    eyleme geçirilemez bir `failed` yazdırırdı.
 *
 * Başarısızlık ziyaretçinin yanıtını DEĞİŞTİRMEZ; sonucu yalnız `notify_lead`
 * taşır. Zaman aşımı `toEmail` ile aynı sınırda (8 sn) — ikisi paralel gider.
 */
async function toLeadEmail(lead: Lead): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const team = process.env.DEMO_TO;
  const from = process.env.DEMO_FROM;
  if (!key || !team || !from) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [lead.email],
        reply_to: team,
        subject: LEAD_CONFIRMATION.subject,
        text: LEAD_CONFIRMATION.text(lead.name),
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "bilinmiyor";

  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, code: "rate-limited", message: "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "bad-json" }, { status: 400 });
  }

  // Bal küpü — bot doldurursa sessizce başarılı görünür, hiçbir yere yazılmaz.
  if (clean(body.website, 100)) {
    return NextResponse.json({ ok: true });
  }

  const lead: Lead = {
    name: cleanLine(body.name, MAX.name),
    club: cleanLine(body.club, MAX.club),
    branches: cleanLine(body.branches, MAX.branches),
    phone: cleanLine(body.phone, MAX.phone),
    email: cleanLine(body.email, MAX.email),
    segment: cleanLine(body.segment, MAX.segment),
    message: clean(body.message, MAX.message),
    consent: body.consent === true,
    at: new Date().toISOString(),
    env: DEPLOY_STAGE,
    ua: (req.headers.get("user-agent") ?? "").slice(0, 200),
  };

  if (!lead.name || !lead.club) {
    return NextResponse.json(
      { ok: false, code: "missing", message: "Ad ve kulüp adı zorunludur." },
      { status: 422 },
    );
  }
  if (!lead.phone && !lead.email) {
    return NextResponse.json(
      { ok: false, code: "missing-contact", message: "Telefon veya e-postadan en az birini yazın." },
      { status: 422 },
    );
  }
  const contact = checkContact(lead.phone, lead.email);
  if (!contact.ok) {
    return NextResponse.json({ ok: false, code: "bad-contact", message: contact.message }, { status: 422 });
  }
  if (!lead.consent) {
    return NextResponse.json(
      { ok: false, code: "no-consent", message: "Devam etmek için aydınlatma metnini onaylamanız gerekiyor." },
      { status: 422 },
    );
  }

  // Önce dayanıklı kayıt (depo, sonra yerel dosya yedeği), sonra e-posta.
  const store = await toStore(lead, ip);

  // Hız sınırı istemciye KADAR taşınır (Karar Noktası: depo 429 — (a) seçildi,
  // v1 davranışı). Burada e-postaya/dosyaya düşülürse zincir sessizce yanlış
  // davranır: aynı IP'den saatte altıncı talep ya bot ya tekrar deneme.
  if (store.storeStatus === 429) {
    return NextResponse.json(
      { ok: false, code: "rate-limited", message: "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  const stored = store.stored || (await toFile(lead));

  // Sıra değişmez: dayanıklı kayıt → bildirimler. İki e-posta ise PARALEL gider
  // (v1'in deseni) — sıralı gönderim ziyaretçinin yanıtını iki zaman aşımı
  // boyunca (8 + 8 sn) bekletirdi ve biri düştüğünde öteki denenmemiş olurdu.
  // İkisi de kendi içinde hata yutup boolean döner, yani `Promise.all` reddetmez.
  const leadAddressable = isValidEmail(lead.email);
  const [mailed, leadMailed] = await Promise.all([
    toEmail(lead),
    leadAddressable ? toLeadEmail(lead) : Promise.resolve(false),
  ]);
  const notifyLead: NotifyLead = !leadAddressable ? "skipped" : leadMailed ? "sent" : "failed";

  // Bildirim durumu kayda geri yazılır (Karar Noktası: notify_* — (a)).
  // Yalnız depo gerçekten yazdıysa (id var) denenir; e-posta denemesinden SONRA.
  if (store.stored && store.leadId) {
    await notifyStore(store.leadId, mailed ? "sent" : "failed", notifyLead);
  }

  if (!stored && !mailed) {
    // Hiçbir hedef yok ya da hepsi düştü. Başarılı gibi göstermiyoruz.
    console.error("[demo] Talep hiçbir hedefe yazılamadı.", { club: lead.club, at: lead.at });
    return NextResponse.json(
      {
        ok: false,
        code: "no-sink",
        message:
          "Talebinizi şu anda kaydedemedik. Lütfen WhatsApp'tan yazın veya telefonla arayın, hemen dönüş yapalım.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, stored, mailed });
}
