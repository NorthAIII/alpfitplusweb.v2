import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

import { DEPLOY_STAGE } from "@/lib/stage";

/**
 * Demo talebi ucu.
 *
 * v1 sitesinin denetimi (D-01, İ-08) iki seyi gosterdi:
 *  - Tek e-posta saglayicisina bagli bir uc, anahtar tanimli degilse HER talebi
 *    hata ekranina cevirdi ve lead kayboldu.
 *  - Talebin kalici hicbir kaydi yoktu.
 * Bu yuzden burada once DAYANIKLI KAYIT denenir, e-posta ikincildir. Hicbir
 * hedef yapilandirilmamissa uc BASARILI DONMEZ — kullaniciyi WhatsApp'a
 * yonlendiren durust bir hata doner (sessiz kayip yok).
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
   * Dagitim asamasi (`local` | `preview` | `production`) — onizlemeden gelen
   * test talepleri e-tabloda ve gelen kutusunda boylece ayirt edilir, silinmek
   * zorunda kalmaz. Deger `VERCEL_ENV`'den DEGIL `deployStage`'den gelir
   * (gerekce: src/lib/stage.ts dosya yorumu).
   */
  env: string;
  ua: string;
};

const MAX = { name: 120, club: 160, phone: 40, email: 160, message: 2000, segment: 60, branches: 10 };

// Basit bellek ici hiz siniri. Tek surec icin yeterli; olcek buyurse
// paylasimli bir sayaca tasinir.
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
 * Webhook yazimi SOZLESMEYE bagli dogrulanir; `res.ok` tek basina yetmez.
 *
 * Alici bir Apps Script web app'idir (kaynak: research/lead-sheet.gs) ve betik
 * hata firlatirsa Apps Script **200 + HTML** dondurur. Yalnizca `res.ok`'a
 * bakan bir uc bunu "kaydedildi" sayar, kullaniciya "gonderildi" der ve lead
 * sessizce kaybolur — v1'de yasanan hata sinifi tam olarak budur. Bu yuzden
 * sozlesme uc kapidir: HTTP durumu, govdenin JSON olmasi, ve `ok === true`.
 *
 * Loglama QUALITY 2'ye bagli: hedef adres, token ve kisisel veri loga GIRMEZ —
 * yalnizca durum kodu, alicinin kendi hata kodu ve `lead.at` damgasi yazilir.
 */
async function toWebhook(lead: Lead): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error("[demo] Kayit hedefi HTTP hatasi dondurdu.", { status: res.status, at: lead.at });
      return false;
    }

    const text = await res.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Govde HTML ise buraya duser: betik hatasi ya da yetki/oturum sayfasi.
      console.error("[demo] Kayit hedefi JSON yerine baska bir govde dondurdu.", {
        status: res.status,
        at: lead.at,
      });
      return false;
    }

    if (typeof parsed !== "object" || parsed === null) {
      console.error("[demo] Kayit hedefinin govdesi nesne degil.", { status: res.status, at: lead.at });
      return false;
    }

    const body = parsed as { ok?: unknown; code?: unknown };
    if (body.ok !== true) {
      console.error("[demo] Kayit hedefi ok:true dondurmedi.", {
        status: res.status,
        // Alicinin kendi teshis kodu (bad-token, busy, no-token-configured…).
        // Sir degil, ama yine de sinirlanir.
        code: typeof body.code === "string" ? body.code.slice(0, 40) : undefined,
        at: lead.at,
      });
      return false;
    }

    return true;
  } catch {
    // Ag hatasi ya da 8 sn zaman asimi. Hata nesnesi hedef adresi tasiyabilir,
    // bu yuzden loglanmaz.
    console.error("[demo] Kayit hedefine ulasilamadi (ag hatasi ya da zaman asimi).", { at: lead.at });
    return false;
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
        reply_to: lead.email || undefined,
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
          // Onizleme testi gelen kutusunda ilk bakista ayrilsin.
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

  // Bal kupu — bot doldurursa sessizce basarili gorunur, hicbir yere yazilmaz.
  if (clean(body.website, 100)) {
    return NextResponse.json({ ok: true });
  }

  const lead: Lead = {
    name: clean(body.name, MAX.name),
    club: clean(body.club, MAX.club),
    branches: clean(body.branches, MAX.branches),
    phone: clean(body.phone, MAX.phone),
    email: clean(body.email, MAX.email),
    segment: clean(body.segment, MAX.segment),
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
  if (!lead.consent) {
    return NextResponse.json(
      { ok: false, code: "no-consent", message: "Devam etmek için aydınlatma metnini onaylamanız gerekiyor." },
      { status: 422 },
    );
  }

  // Once dayanikli kayit, sonra e-posta.
  const stored = (await toWebhook(lead)) || (await toFile(lead));
  const mailed = await toEmail(lead);

  if (!stored && !mailed) {
    // Hicbir hedef yok ya da hepsi dustu. Basarili gibi gostermiyoruz.
    console.error("[demo] Talep hicbir hedefe yazilamadi.", { club: lead.club, at: lead.at });
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
