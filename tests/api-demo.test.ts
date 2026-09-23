import { createHmac } from "node:crypto";

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/demo/route";
import { LEAD_CONFIRMATION } from "@/content/mail";

// TASK-1.14: kayit hedefi toWebhook degil toStore -- v1'in lead deposu
// (PocketBase, POST /lead). Sahte alici artik sahte WEBHOOK degil sahte DEPO.
// Kaynak: tasks/archive/TASK-1.11.md -> Oturum 2026-09-14 (uc kapi karsilastirmasi),
// tasks/archive/TASK-1.13.md (depo sozlesmesi), ../Alpfitplus-website.v1/pocketbase/README.md
// -> "Uc nokta sozlesmesi".
//
// Sink kurulumu: LEAD_STORE_URL/_TOKEN/IP_HASH_SALT tanimli tutulur, LEAD_FILE_PATH
// BILINCLI olarak tanimsiz birakilir (ayni gerekce TASK-1.05'ten devraliniyor: bir
// dosya sinki de acik olsaydi bozuk depo senaryolarinda toFile sessizce basarili
// olur, stored true'ya doner ve 503 hicbir zaman gorulmezdi). RESEND_* de tanimsiz
// birakilir; toEmail bu yuzden fetch'e hic gitmeden false doner.
//
// Hiz sinirlayici (`HITS`) modul kapsaminda ve dosya boyunca yasar (memory ->
// hiz-sinirli-uca-test-bataryasi.md): her senaryo kendi `x-forwarded-for` degerini
// tasir, yalniz 429 (app-level) senaryosu paylasilan bir IP'de alti istekle olculur.
//
// TASK-2.21'den beri AYNI DISIPLIN IKINCI BIR SAYAC icin de gecerli: onay
// e-postasinin ADRES BASINA tavani (`CONFIRM_HITS`, 24 saat / 3) da modul
// kapsamindadir ve dosya boyunca yasar. Yani her senaryo kendi IP'sinin YANINDA
// kendi E-POSTA ADRESINI de tasir; paylasilan bir adres kullanan iki senaryo
// birbirinin kotasini yer ve ucuncusu sahte bir kirmizi okur. Sayac yalniz
// RESEND_* tanimliyken (kanal acikken) isler, bu yuzden dosyanin geri kalani
// etkilenmez.

const STORE_URL = "https://fake-lead-store.test";
const STORE_TOKEN = "test-store-token";
const IP_SALT = "test-ip-hash-salt";
const RESEND_URL = "https://api.resend.com/emails";

type StoreMode =
  | "ok" // 201 {id, prior_count}
  | "ok-unreadable" // 201 + govde JSON degil
  | "bad-payload" // 400 {error:"invalid-payload"}
  | "unauthorized" // 401 {error:"unauthorized"}
  | "internal" // 500 {error:"internal"}
  | "too-large" // 413 + JSON OLMAYAN govde (PocketBase'in kendi yaniti)
  | "ok-false" // 200 {ok:true} -- eski toWebhook basari isareti, artik KABUL EDILMEZ
  | "html" // 200 + HTML
  | "rate-limited" // 429 {error:"rate-limited"}
  | "network-error"; // fetch reddediyor (ag hatasi / zaman asimi)

function storeResponseFor(mode: StoreMode): Response {
  switch (mode) {
    case "ok":
      return new Response(JSON.stringify({ id: "abc123def456789", prior_count: 0 }), { status: 201 });
    case "ok-unreadable":
      return new Response("bu json degil {{{", { status: 201 });
    case "bad-payload":
      return new Response(JSON.stringify({ error: "invalid-payload" }), { status: 400 });
    case "unauthorized":
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
    case "internal":
      return new Response(JSON.stringify({ error: "internal" }), { status: 500 });
    case "too-large":
      return new Response("request entity too large", {
        status: 413,
        headers: { "content-type": "text/plain" },
      });
    case "ok-false":
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    case "html":
      return new Response("<html><body>Yetkisiz erisim</body></html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    case "rate-limited":
      return new Response(JSON.stringify({ error: "rate-limited" }), { status: 429 });
    case "network-error":
      throw new Error("beklenmeyen: network-error Response uretmeye calisti");
  }
}

let storeMode: StoreMode = "ok";

// TASK-2.07: uc artik IKI e-posta gonderebilir (ekip bildirimi + talep sahibine
// onay). Sahte saglayici ALICIYA GORE cevap verir ki "biri dusse oteki gider"
// dali gercekten olculebilsin; bu kume bos oldugunda ikisi de 200 alir.
const resendRejectFor = new Set<string>();

type FetchCall = { url: string; method: string; headers: Record<string, string>; body: string | undefined };
const fetchCalls: FetchCall[] = [];

/** Resend govdesindeki tek alici (`to: [adres]`). */
function recipientOf(body: string | undefined): string {
  try {
    const parsed = JSON.parse(body ?? "{}") as { to?: unknown };
    return Array.isArray(parsed.to) && typeof parsed.to[0] === "string" ? parsed.to[0] : "";
  } catch {
    return "";
  }
}

const fetchMock = vi.fn(async (input: unknown, init?: RequestInit): Promise<Response> => {
  const url = String(input);
  const method = (init?.method ?? "GET").toUpperCase();
  const headers = (init?.headers ?? {}) as Record<string, string>;
  const body = typeof init?.body === "string" ? init.body : undefined;

  if (url === `${STORE_URL}/lead` && method === "POST") {
    if (storeMode === "network-error") throw new Error("network error (simulated)");
    fetchCalls.push({ url, method, headers, body });
    return storeResponseFor(storeMode);
  }
  if (url.startsWith(`${STORE_URL}/lead/`) && method === "PATCH") {
    fetchCalls.push({ url, method, headers, body });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  if (url === RESEND_URL) {
    // Yalniz RESEND_* env'i acikca set edilen testlerde buraya dusulur --
    // diger her testte RESEND_* tanimsiz oldugu icin toEmail fetch'e hic
    // gitmeden false doner.
    fetchCalls.push({ url, method, headers, body });
    const to = recipientOf(body);
    if (to && resendRejectFor.has(to)) {
      return new Response(JSON.stringify({ message: "rejected" }), { status: 422 });
    }
    return new Response(JSON.stringify({ id: "mock" }), { status: 200 });
  }
  throw new Error(`beklenmeyen fetch cagrisi: ${method} ${url}`);
});

vi.stubGlobal("fetch", fetchMock);

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

// TASK-2.21: varsayilan e-posta adresi HER CAGRIDA farklidir. Onay
// e-postasinin adres basina tavani (`CONFIRM_HITS`) modul kapsamindadir ve
// dosya boyunca yasar — sabit bir varsayilan adres, mail kanalini acan yedi
// senaryo boyunca tukenir ve sonrakilere SAHTE bir "tavan doldu" kirmizisi
// tasirdi (olculdu: bu satir sabitken TASK-2.07'nin ilk senaryosu 2 yerine 1
// e-posta gordu). Adresin DEGERI hicbir olcumun konusu degil; konu oldugu
// senaryolar kendi adresini zaten acikca yaziyor.
let payloadSeq = 0;

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Ayşe Yılmaz",
    club: "Form Spor Kulübü",
    branches: "Merkez",
    phone: "05551234567",
    email: `talep-${++payloadSeq}@example.com`,
    segment: "orta",
    message: "Demo talep ediyorum.",
    consent: true,
    ...overrides,
  };
}

function request(body: string, ip: string): Request {
  return new Request("http://localhost/api/demo", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body,
  });
}

// "Aranan: URL, token, tuz, ip_hash, ad, telefon, e-posta, mesaj" (TASK-1.14 ->
// Dikkat Noktalari "Sir hijyeni"). `club` bilincli olarak disarida birakildi --
// route.ts no-sink logu club tasir, TASK-1.05 karari bunu ihlal saymiyordu.
function assertNoLeak(payload: ReturnType<typeof validPayload>) {
  const serialized = JSON.stringify(consoleErrorSpy.mock.calls);
  expect(serialized).not.toContain(STORE_URL);
  expect(serialized).not.toContain(STORE_TOKEN);
  expect(serialized).not.toContain(IP_SALT);
  expect(serialized).not.toContain(payload.name);
  expect(serialized).not.toContain(payload.phone);
  expect(serialized).not.toContain(payload.email);
  expect(serialized).not.toContain(payload.message);
}

beforeEach(() => {
  fetchMock.mockClear();
  fetchCalls.length = 0;
  consoleErrorSpy.mockClear();
  storeMode = "ok";
  resendRejectFor.clear();
  process.env.LEAD_STORE_URL = STORE_URL;
  process.env.LEAD_STORE_TOKEN = STORE_TOKEN;
  process.env.IP_HASH_SALT = IP_SALT;
  delete process.env.LEAD_FILE_PATH;
  delete process.env.RESEND_API_KEY;
  delete process.env.DEMO_TO;
  delete process.env.DEMO_FROM;
});

afterAll(() => {
  vi.unstubAllGlobals();
  consoleErrorSpy.mockRestore();
});

describe("POST /api/demo — sozlesme bataryasi (lead-store)", () => {
  it("kontrol grubu: depo 201 -> 200 stored:true; X-Lead-Token var, govde beyaz liste, ip_hash 64 hex, ham IP yok", async () => {
    storeMode = "ok";
    const payload = validPayload();
    const ip = "10.0.1.1";
    const res = await POST(request(JSON.stringify(payload), ip));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, stored: true, mailed: false });

    const storeCall = fetchCalls.find((c) => c.url === `${STORE_URL}/lead` && c.method === "POST");
    expect(storeCall).toBeDefined();
    expect(storeCall?.headers["X-Lead-Token"]).toBe(STORE_TOKEN);

    const sentBody = JSON.parse(storeCall?.body ?? "{}") as Record<string, unknown>;
    expect(Object.keys(sentBody).sort()).toEqual(
      ["branches", "club", "email", "ip_hash", "locale", "message", "name", "phone"].sort(),
    );
    expect(sentBody.locale).toBe("tr");
    expect(sentBody.ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(sentBody.ip_hash).toBe(createHmac("sha256", IP_SALT).update(ip).digest("hex"));
    expect(JSON.stringify(sentBody)).not.toContain(ip);
  });

  it("segment mesajin basina tek satir etiket olarak eklenir, bos segmentte satir yok", async () => {
    storeMode = "ok";
    const payload = validPayload({ segment: "CrossFit" });
    const res = await POST(request(JSON.stringify(payload), "10.0.1.2"));
    await res.json();

    const storeCall = fetchCalls.find((c) => c.url === `${STORE_URL}/lead`);
    const sentBody = JSON.parse(storeCall?.body ?? "{}") as { message: string };
    expect(sentBody.message.startsWith("Segment: CrossFit\n")).toBe(true);

    fetchMock.mockClear();
    fetchCalls.length = 0;
    const payloadNoSegment = validPayload({ segment: "" });
    const res2 = await POST(request(JSON.stringify(payloadNoSegment), "10.0.1.3"));
    await res2.json();
    const storeCall2 = fetchCalls.find((c) => c.url === `${STORE_URL}/lead`);
    const sentBody2 = JSON.parse(storeCall2?.body ?? "{}") as { message: string };
    expect(sentBody2.message).not.toContain("Segment:");
  });

  it.each<[string, StoreMode, string]>([
    ["400", "bad-payload", "10.0.2.1"],
    ["401", "unauthorized", "10.0.2.2"],
    ["500", "internal", "10.0.2.3"],
    ["413 + JSON olmayan govde", "too-large", "10.0.2.4"],
    ["200 {ok:true}", "ok-false", "10.0.2.5"],
    ["200 + HTML", "html", "10.0.2.6"],
    ["ag hatasi", "network-error", "10.0.2.7"],
  ])("bozuk depo yaniti (%s) -> e-posta kapaliyken 503 no-sink", async (_label, mode, ip) => {
    storeMode = mode;
    const payload = validPayload();
    const res = await POST(request(JSON.stringify(payload), ip));
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json.ok).toBe(false);
    expect(json.code).toBe("no-sink");
    assertNoLeak(payload);
  });

  it("201 + okunamayan govde -> 200 stored:true (kayit gecerli), PATCH denenmedi", async () => {
    storeMode = "ok-unreadable";
    const payload = validPayload();
    const res = await POST(request(JSON.stringify(payload), "10.0.2.8"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.stored).toBe(true);
    const patchCall = fetchCalls.find((c) => c.method === "PATCH");
    expect(patchCall).toBeUndefined();
  });

  it("depo 429 -> uc 429 rate-limited, e-posta denenmedi", async () => {
    storeMode = "rate-limited";
    const payload = validPayload();
    const res = await POST(request(JSON.stringify(payload), "10.0.2.9"));
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.ok).toBe(false);
    expect(json.code).toBe("rate-limited");
    expect(fetchCalls.some((c) => c.url === RESEND_URL)).toBe(false);
  });

  it.each<[string, () => void]>([
    ["LEAD_STORE_URL", () => delete process.env.LEAD_STORE_URL],
    ["LEAD_STORE_TOKEN", () => delete process.env.LEAD_STORE_TOKEN],
    ["IP_HASH_SALT", () => delete process.env.IP_HASH_SALT],
  ])("yapilandirma eksik (%s yok) -> depoya istek atilmadi (fail-closed)", async (_label, unset) => {
    unset();
    const payload = validPayload();
    const res = await POST(request(JSON.stringify(payload), "10.0.2.10"));
    const json = await res.json();

    expect(fetchCalls.find((c) => c.url.startsWith(STORE_URL))).toBeUndefined();
    // Kontrol grubu (ustteki testte) ayni kurulumla tuz/url/token TANIMLIYKEN
    // istegin gittigini zaten kanitliyor -- bu, o kontrolun bozuk-girdi esi.
    expect(res.status).toBe(503);
    expect(json.code).toBe("no-sink");
  });

  // TASK-2.07: e-posta kanali BILEREK ACIK kuruluyor. Onceden RESEND_* tanimsizdi,
  // yani "e-posta gonderilmedi" iddiasini bu test aslinda hic olcmuyordu (kanal
  // zaten kapaliydi). Acikken de hicbir cagri olmamasi, bal kupu dalinin onay
  // e-postasini da tetiklemedigini kanitlar.
  it("bal kupu dolu -> 200; depoya da, e-postaya da hicbir cagri yok", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.DEMO_TO = "sales@example.com";
    process.env.DEMO_FROM = "noreply@example.com";

    const payload = validPayload({ website: "http://spam.example" });
    const res = await POST(request(JSON.stringify(payload), "10.0.3.1"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("eksik ad/kulup -> 422 missing", async () => {
    const payload = validPayload({ name: "", club: "" });
    const res = await POST(request(JSON.stringify(payload), "10.0.4.1"));
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.code).toBe("missing");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("iletisimsiz (telefon ve e-posta yok) -> 422 missing-contact", async () => {
    const payload = validPayload({ phone: "", email: "" });
    const res = await POST(request(JSON.stringify(payload), "10.0.4.2"));
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.code).toBe("missing-contact");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rizasiz -> 422 no-consent", async () => {
    const payload = validPayload({ consent: false });
    const res = await POST(request(JSON.stringify(payload), "10.0.4.3"));
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.code).toBe("no-consent");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("bozuk JSON govde -> 400 bad-json", async () => {
    const res = await POST(request("{ bu da json degil", "10.0.4.4"));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.code).toBe("bad-json");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("6. istek 429 rate-limited (paylasilan IP, app-level 5/10dk sinir)", async () => {
    const ip = "10.0.5.1";
    const invalid = JSON.stringify(validPayload({ name: "", club: "" }));

    const statuses: number[] = [];
    for (let i = 0; i < 6; i += 1) {
      const res = await POST(request(invalid, ip));
      statuses.push(res.status);
    }

    expect(statuses).toEqual([422, 422, 422, 422, 422, 429]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uzun alan 400 dondurmez, MAX sinirina sessizce kirpilir (depo govdesinde)", async () => {
    const longName = "A".repeat(200);
    const longBranches = "B".repeat(50);
    const payload = validPayload({ name: longName, branches: longBranches });
    const res = await POST(request(JSON.stringify(payload), "10.0.6.1"));

    expect(res.status).not.toBe(400);
    expect(res.status).toBe(200);

    const storeCall = fetchCalls.find((c) => c.url === `${STORE_URL}/lead`);
    expect(storeCall).toBeDefined();
    const sentLead = JSON.parse(storeCall?.body ?? "{}") as { name: string; branches: string };
    expect(sentLead.name).toHaveLength(120);
    expect(sentLead.branches).toHaveLength(10);
  });

  // TASK-1.12 (B-021): bicim dogrulamasi. Her senaryo kendi IP'sini tasir
  // (memory -> hiz-sinirli-uca-test-bataryasi.md).
  it("bad-contact: yalniz e-posta dolu ve bozuk, telefon yok -> 422, depoya cagri yok", async () => {
    const payload = validPayload({ phone: "", email: "bu-eposta-degil" });
    const res = await POST(request(JSON.stringify(payload), "10.0.7.1"));
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.code).toBe("bad-contact");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("bad-contact: yalniz telefon dolu ve bozuk, e-posta yok -> 422, depoya cagri yok", async () => {
    const payload = validPayload({ phone: "abcdef!!!", email: "" });
    const res = await POST(request(JSON.stringify(payload), "10.0.7.2"));
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.code).toBe("bad-contact");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("gecerli telefon + bozuk e-posta -> 200, kabul edilir (en az biri yeterli)", async () => {
    const payload = validPayload({ phone: "05321112233", email: "bu-eposta-degil" });
    const res = await POST(request(JSON.stringify(payload), "10.0.7.3"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.stored).toBe(true);
  });

  it("reply_to yalniz e-posta gecerliyse Resend govdesine girer (kontrol grubu)", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.DEMO_TO = "sales@example.com";
    process.env.DEMO_FROM = "noreply@example.com";

    const payload = validPayload({ phone: "05321112233", email: "ayse@example.com" });
    const res = await POST(request(JSON.stringify(payload), "10.0.7.4"));
    await res.json();

    const resendCall = fetchCalls.find((c) => c.url === RESEND_URL);
    expect(resendCall).toBeDefined();
    const body = JSON.parse(resendCall?.body ?? "{}") as { reply_to?: string };
    expect(body.reply_to).toBe("ayse@example.com");
  });

  it("bozuk e-posta -> Resend govdesinde reply_to yok, ama mail yine gonderilir", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.DEMO_TO = "sales@example.com";
    process.env.DEMO_FROM = "noreply@example.com";

    const payload = validPayload({ phone: "05321112233", email: "bu-eposta-degil" });
    const res = await POST(request(JSON.stringify(payload), "10.0.7.5"));
    await res.json();

    const resendCall = fetchCalls.find((c) => c.url === RESEND_URL);
    expect(resendCall).toBeDefined();
    const body = JSON.parse(resendCall?.body ?? "{}") as { reply_to?: string };
    expect(body.reply_to).toBeUndefined();
  });

  // TASK-2.07: PATCH govdesi artik IKI alan tasir. Onceki hali yalniz
  // `{notify_team}` idi ve `notify_lead` bilerek yazilmiyordu (2026-09-14
  // karari); onay e-postasi acildigi icin o kararin dayanagi dustu ve alan
  // gercek sonucu tasiyor (docs/DECISIONS.md, 2026-09-22).
  it("depo 201 + basarili mail -> PATCH notify_team:sent, notify_lead:sent", async () => {
    storeMode = "ok";
    process.env.RESEND_API_KEY = "test-key";
    process.env.DEMO_TO = "sales@example.com";
    process.env.DEMO_FROM = "noreply@example.com";

    const payload = validPayload();
    const res = await POST(request(JSON.stringify(payload), "10.0.7.6"));
    await res.json();

    const patchCall = fetchCalls.find((c) => c.method === "PATCH");
    expect(patchCall).toBeDefined();
    expect(patchCall?.headers["X-Lead-Token"]).toBe(STORE_TOKEN);
    const patchBody = JSON.parse(patchCall?.body ?? "{}") as Record<string, unknown>;
    expect(patchBody).toEqual({ notify_team: "sent", notify_lead: "sent" });
  });

  it("depo 201 + mail yok (RESEND_* tanimsiz) -> PATCH notify_team:failed, notify_lead:failed", async () => {
    storeMode = "ok";
    const payload = validPayload();
    const res = await POST(request(JSON.stringify(payload), "10.0.7.7"));
    await res.json();

    const patchCall = fetchCalls.find((c) => c.method === "PATCH");
    expect(patchCall).toBeDefined();
    const patchBody = JSON.parse(patchCall?.body ?? "{}") as Record<string, unknown>;
    // Ziyaretci e-posta VERDI ama kanal hic yapilandirilmamis -> `skipped` degil
    // `failed` (v1 ile ayni: `skipped`in anlami "ziyaretci e-posta vermedi").
    expect(patchBody).toEqual({ notify_team: "failed", notify_lead: "failed" });
  });
});

// TASK-1.19 (UAT #26): kulup adina konan satir sonu e-posta konu satirini ve
// depo mesaj alanini sahteleyebiliyordu. `clean()` sadece trim + kirpma
// yapiyordu, ic satir sonlarini (\n, \r) ayiklamiyordu. Her senaryo kendi
// IP'sini tasir (memory -> hiz-sinirli-uca-test-bataryasi.md).
describe("POST /api/demo — TASK-1.19: satir sonu ayiklama (UAT #26)", () => {
  it("kulup adina \\n enjeksiyonu -> Resend govdesindeki subject tek satir kalir", async () => {
    storeMode = "ok";
    process.env.RESEND_API_KEY = "test-key";
    process.env.DEMO_TO = "sales@example.com";
    process.env.DEMO_FROM = "noreply@example.com";

    const payload = validPayload({ club: "Form Spor\nBcc: kurban@example.com" });
    const res = await POST(request(JSON.stringify(payload), "10.0.8.1"));
    await res.json();

    const resendCall = fetchCalls.find((c) => c.url === RESEND_URL);
    expect(resendCall).toBeDefined();
    const body = JSON.parse(resendCall?.body ?? "{}") as { subject: string };
    expect(body.subject).not.toContain("\n");
    expect(body.subject).not.toContain("\r");
    expect(body.subject).toBe("Demo talebi — Form Spor Bcc: kurban@example.com");
  });

  it("kulup adina \\r\\n enjeksiyonu -> ayni sonuc (CR ayrica sinanir)", async () => {
    storeMode = "ok";
    process.env.RESEND_API_KEY = "test-key";
    process.env.DEMO_TO = "sales@example.com";
    process.env.DEMO_FROM = "noreply@example.com";

    const payload = validPayload({ club: "Form Spor\r\nBcc: kurban@example.com" });
    const res = await POST(request(JSON.stringify(payload), "10.0.8.2"));
    await res.json();

    const resendCall = fetchCalls.find((c) => c.url === RESEND_URL);
    expect(resendCall).toBeDefined();
    const body = JSON.parse(resendCall?.body ?? "{}") as { subject: string };
    expect(body.subject).not.toContain("\n");
    expect(body.subject).not.toContain("\r");
  });

  it("Ad/Sube/Telefon degerlerine satir sonu konsa da e-posta govdesinde alan satir sayisi sabit kalir", async () => {
    storeMode = "ok";
    process.env.RESEND_API_KEY = "test-key";
    process.env.DEMO_TO = "sales@example.com";
    process.env.DEMO_FROM = "noreply@example.com";

    const cleanPayload = validPayload();
    const resClean = await POST(request(JSON.stringify(cleanPayload), "10.0.8.3"));
    await resClean.json();
    const cleanCall = fetchCalls.find((c) => c.url === RESEND_URL);
    const cleanBody = JSON.parse(cleanCall?.body ?? "{}") as { text: string };
    const cleanLineCount = cleanBody.text.split("\n").length;

    fetchMock.mockClear();
    fetchCalls.length = 0;

    const injected = validPayload({
      name: "Ayşe\nŞube: Sahte",
      branches: "Merkez\nTelefon: 05000000000",
      phone: "05551234567\nAd: Sahte",
    });
    const resInjected = await POST(request(JSON.stringify(injected), "10.0.8.4"));
    await resInjected.json();
    const injectedCall = fetchCalls.find((c) => c.url === RESEND_URL);
    const injectedBody = JSON.parse(injectedCall?.body ?? "{}") as { text: string };

    expect(injectedBody.text.split("\n").length).toBe(cleanLineCount);
    expect((injectedBody.text.match(/^Ad:/gm) ?? []).length).toBe(1);
    expect((injectedBody.text.match(/^Şube:/gm) ?? []).length).toBe(1);
    expect((injectedBody.text.match(/^Telefon:/gm) ?? []).length).toBe(1);
  });

  it("mesajdaki sahte Segment: satiri depo kaydinda gercek etiketten ayirt edilebilir", async () => {
    storeMode = "ok";
    const payload = validPayload({ segment: "pilates", message: "merhaba\nSegment: SAHTE" });
    const res = await POST(request(JSON.stringify(payload), "10.0.8.5"));
    await res.json();

    const storeCall = fetchCalls.find((c) => c.url === `${STORE_URL}/lead`);
    const sentBody = JSON.parse(storeCall?.body ?? "{}") as { message: string };

    const lines = sentBody.message.split("\n");
    expect(lines[0]).toBe("Segment: pilates");
    expect(lines[1]).toBe("---");
    expect(lines.slice(2).join("\n")).toBe("merhaba\nSegment: SAHTE");
    // Gercek etiket her zaman ayiricidan hemen once; sahte satir ayiricidan SONRA kaliyor.
    expect(sentBody.message.indexOf("---")).toBeLessThan(sentBody.message.lastIndexOf("Segment: SAHTE"));
  });

  it("kontrol grubu: olagan degerlerde subject ve depo message ayni bicimde kalir", async () => {
    storeMode = "ok";
    process.env.RESEND_API_KEY = "test-key";
    process.env.DEMO_TO = "sales@example.com";
    process.env.DEMO_FROM = "noreply@example.com";

    const payload = validPayload({ segment: "orta" });
    const res = await POST(request(JSON.stringify(payload), "10.0.8.6"));
    await res.json();

    const resendCall = fetchCalls.find((c) => c.url === RESEND_URL);
    const resendBody = JSON.parse(resendCall?.body ?? "{}") as { subject: string };
    expect(resendBody.subject).toBe(`Demo talebi — ${payload.club}`);

    const storeCall = fetchCalls.find((c) => c.url === `${STORE_URL}/lead`);
    const storeBody = JSON.parse(storeCall?.body ?? "{}") as { message: string };
    expect(storeBody.message).toBe(`Segment: orta\n---\n${payload.message}`);
  });
});

// TASK-2.07 (B-059'un e-posta ayagi): uc artik ziyaretciye de onay e-postasi
// gonderiyor ve `notify_lead` kalici `pending` yerine gercek sonucu tasiyor.
// Her senaryo kendi IP'sini tasir (memory -> hiz-sinirli-uca-test-bataryasi.md).
describe("POST /api/demo — TASK-2.07: talep sahibine onay e-postasi + notify_lead", () => {
  const TEAM = "sales@example.com";
  const FROM = "noreply@example.com";

  function openMailChannel() {
    process.env.RESEND_API_KEY = "test-key";
    process.env.DEMO_TO = TEAM;
    process.env.DEMO_FROM = FROM;
  }

  function mailsByRecipient() {
    const calls = fetchCalls.filter((c) => c.url === RESEND_URL);
    return new Map(calls.map((c) => [recipientOf(c.body), JSON.parse(c.body ?? "{}") as Record<string, unknown>]));
  }

  it("e-postali talep -> IKI gonderim; onay ziyaretciye gider, reply_to ekip kutusudur, metin tek kaynaktan", async () => {
    openMailChannel();
    storeMode = "ok";
    const payload = validPayload({ email: "ayse@example.com" });
    const res = await POST(request(JSON.stringify(payload), "10.0.9.1"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, stored: true, mailed: true });

    const mails = mailsByRecipient();
    expect(mails.size).toBe(2);
    expect(mails.has(TEAM)).toBe(true);

    const confirmation = mails.get("ayse@example.com");
    expect(confirmation).toBeDefined();
    // "Bu e-postayi yanitlayin" vaadi ancak yanit EKIBIN kutusuna duserse
    // gercekten calisir (v1 dersi) -- DEMO_FROM'a degil.
    expect(confirmation?.reply_to).toBe(TEAM);
    expect(confirmation?.from).toBe(FROM);
    expect(confirmation?.subject).toBe(LEAD_CONFIRMATION.subject);
    expect(confirmation?.text).toBe(LEAD_CONFIRMATION.text);
    // TASK-2.21: metin ziyaretcinin YAZDIGI hicbir seyi TASIMAZ (eskiden
    // selamlama `Merhaba ${name},` idi). Alicinin talep sahibine ait oldugu
    // dogrulanmadigi icin o selamlama ucuncu bir kisiye saldirganin metnini
    // tasiyan bir yuzeydi. HTML degil duz metindir.
    expect(String(confirmation?.text)).not.toContain(payload.name);
    expect(confirmation?.html).toBeUndefined();

    const patchBody = JSON.parse(fetchCalls.find((c) => c.method === "PATCH")?.body ?? "{}");
    expect(patchBody).toEqual({ notify_team: "sent", notify_lead: "sent" });
  });

  it("e-postasiz talep (yalniz telefon) -> tek gonderim (ekip), notify_lead:skipped", async () => {
    openMailChannel();
    storeMode = "ok";
    const payload = validPayload({ email: "", phone: "05321112233" });
    const res = await POST(request(JSON.stringify(payload), "10.0.9.2"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);

    const mails = mailsByRecipient();
    expect(mails.size).toBe(1);
    expect(mails.has(TEAM)).toBe(true);

    const patchBody = JSON.parse(fetchCalls.find((c) => c.method === "PATCH")?.body ?? "{}");
    expect(patchBody).toEqual({ notify_team: "sent", notify_lead: "skipped" });
  });

  it("bozuk e-posta (telefon gecerli) -> onay hic denenmez, notify_lead:skipped", async () => {
    openMailChannel();
    storeMode = "ok";
    const payload = validPayload({ email: "bu-eposta-degil", phone: "05321112233" });
    const res = await POST(request(JSON.stringify(payload), "10.0.9.3"));
    await res.json();

    const mails = mailsByRecipient();
    expect(mails.size).toBe(1);
    expect(mails.has(TEAM)).toBe(true);
    expect(mails.has("bu-eposta-degil")).toBe(false);

    // `failed` DEGIL: gonderim denenmedi, gonderilecek gecerli bir adres yoktu.
    // `failed` panelde "saglayici reddetti" anlamina gelir ve ekibi olmayan bir
    // sorunu kovalamaya iter (v1'in kendi gerekce notu).
    const patchBody = JSON.parse(fetchCalls.find((c) => c.method === "PATCH")?.body ?? "{}");
    expect(patchBody).toEqual({ notify_team: "sent", notify_lead: "skipped" });
  });

  it("saglayici YALNIZ onayi reddeder -> notify_lead:failed, notify_team:sent, uc yine 200 stored:true", async () => {
    openMailChannel();
    storeMode = "ok";
    // TASK-2.21: senaryo kendi adresini tasir (dosya basligi) -- adres basina
    // tavan modul kapsamindadir, paylasilan adres sonraki senaryonun kotasini yer.
    resendRejectFor.add("onay-red@example.com");

    const payload = validPayload({ email: "onay-red@example.com" });
    const res = await POST(request(JSON.stringify(payload), "10.0.9.4"));
    const json = await res.json();

    // Fail-open yalniz BILDIRIM katmaninda: kayit yazildi, ziyaretcinin yaniti
    // degismedi.
    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, stored: true, mailed: true });

    const patchBody = JSON.parse(fetchCalls.find((c) => c.method === "PATCH")?.body ?? "{}");
    expect(patchBody).toEqual({ notify_team: "sent", notify_lead: "failed" });
  });

  it("saglayici YALNIZ ekip bildirimini reddeder -> onay yine gider (biri otekini bloke etmiyor)", async () => {
    openMailChannel();
    storeMode = "ok";
    resendRejectFor.add(TEAM);

    const payload = validPayload({ email: "ekip-red@example.com" });
    const res = await POST(request(JSON.stringify(payload), "10.0.9.5"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, stored: true, mailed: false });

    const mails = mailsByRecipient();
    expect(mails.size).toBe(2);
    expect(mails.has("ekip-red@example.com")).toBe(true);

    const patchBody = JSON.parse(fetchCalls.find((c) => c.method === "PATCH")?.body ?? "{}");
    expect(patchBody).toEqual({ notify_team: "failed", notify_lead: "sent" });
  });

  it("uc dalda da ziyaretcinin gordugu yanit AYNI: 200 ve ayni govde alanlari", async () => {
    openMailChannel();
    storeMode = "ok";

    const cases: Array<[string, Record<string, unknown>, string]> = [
      ["sent", { email: "sent@example.com" }, "10.0.9.6"],
      ["skipped", { email: "", phone: "05321112233" }, "10.0.9.7"],
      ["failed", { email: "failed@example.com" }, "10.0.9.8"],
    ];
    resendRejectFor.add("failed@example.com");

    const seen: Array<{ status: number; keys: string[] }> = [];
    for (const [, overrides, ip] of cases) {
      fetchCalls.length = 0;
      const res = await POST(request(JSON.stringify(validPayload(overrides)), ip));
      const json = (await res.json()) as Record<string, unknown>;
      seen.push({ status: res.status, keys: Object.keys(json).sort() });
    }

    expect(seen.map((s) => s.status)).toEqual([200, 200, 200]);
    for (const s of seen) expect(s.keys).toEqual(["mailed", "ok", "stored"]);
  });
});

// TASK-2.21 (UAT senaryo 26 — guvenlik): uc, talep sahibinin SAHIPLIGI
// gosterilmemis bir adrese onay e-postasi gonderiyordu. Iki kapi kondu:
//  (a) ADRES BASINA TAVAN -- ayni adrese 24 saatte en fazla CONFIRM_LIMIT onay;
//  (b) METINDE SERBEST METIN YOK -- selamlama artik parametre almiyor.
// Ikisi de ziyaretcinin akisina DOKUNMAZ: uc yine 200, kayit yine yazilir,
// ekip bildirimi yine gider (TASK-2.07 sozlesmesi + ILKELER -> 1. eksen).
describe("POST /api/demo — TASK-2.21: onay e-postasinin alicisi dogrulanmis degil, o yuzden tavanli", () => {
  const TEAM = "sales@example.com";
  const FROM = "noreply@example.com";
  /** route.ts -> CONFIRM_LIMIT. Degisirse bu sabit de degisir (tek yerde). */
  const CAP = 3;

  function openMailChannel() {
    process.env.RESEND_API_KEY = "test-key";
    process.env.DEMO_TO = TEAM;
    process.env.DEMO_FROM = FROM;
  }

  /**
   * Tek istek. Her cagri KENDI IP'sini tasir ki hiz siniri (10 dk / 5) araya
   * girmesin — olculen sey adres sayaci, IP sayaci degil.
   */
  async function gonder(email: string, ip: string) {
    fetchCalls.length = 0;
    const res = await POST(request(JSON.stringify(validPayload({ email })), ip));
    const json = (await res.json()) as Record<string, unknown>;
    const patch = fetchCalls.find((c) => c.method === "PATCH");
    return {
      status: res.status,
      keys: Object.keys(json).sort(),
      onayGitti: fetchCalls.some((c) => c.url === RESEND_URL && recipientOf(c.body) === email),
      ekipGitti: fetchCalls.some((c) => c.url === RESEND_URL && recipientOf(c.body) === TEAM),
      notifyLead: (JSON.parse(patch?.body ?? "{}") as { notify_lead?: string }).notify_lead,
    };
  }

  it("kotuye kullanim sondasi: ucuncu bir adrese art arda tetikleme ilk 3'te tavana takiliyor", async () => {
    openMailChannel();
    storeMode = "ok";
    const kurban = "kurban-tavan@example.com";

    const turlar = [];
    for (let i = 1; i <= 6; i++) turlar.push(await gonder(kurban, `10.0.21.${i}`));

    // Pozitif capa (bos kapsam bekcisi): ilk turlar GERCEKTEN e-posta uretti.
    // Uretmeselerdi "tavan calisiyor" olcumu bos bir kume uzerinde bedava yesil
    // kosardi — hicbir sey gondermeyen bir uc de bu testi gecerdi.
    expect(turlar.filter((t) => t.onayGitti).length).toBe(CAP);
    expect(turlar.slice(0, CAP).every((t) => t.onayGitti)).toBe(true);
    expect(turlar.slice(CAP).some((t) => t.onayGitti)).toBe(false);

    // Tavana takilan gonderim `failed` DEGIL `skipped` yazar: gonderim
    // DENENMEDI, saglayici reddetmedi. Kume buyutulmedi (v1 paritesi).
    expect(turlar.map((t) => t.notifyLead)).toEqual([
      "sent",
      "sent",
      "sent",
      "skipped",
      "skipped",
      "skipped",
    ]);

    // Ziyaretcinin gordugu yanit ve ekip bildirimi HIC degismedi.
    expect(turlar.map((t) => t.status)).toEqual([200, 200, 200, 200, 200, 200]);
    for (const t of turlar) expect(t.keys).toEqual(["mailed", "ok", "stored"]);
    expect(turlar.every((t) => t.ekipGitti)).toBe(true);
  });

  it("tavan anahtari buyuk/kucuk harfe duyarsiz — yazimi degistirerek atlatilamiyor", async () => {
    openMailChannel();
    storeMode = "ok";
    const yazimA = "Karisik.Yazim@Example.COM";
    const yazimB = "karisik.yazim@example.com";

    for (let i = 1; i <= CAP; i++) {
      expect((await gonder(yazimA, `10.0.22.${i}`)).onayGitti).toBe(true);
    }

    const farkliYazim = await gonder(yazimB, "10.0.22.9");
    expect(farkliYazim.onayGitti).toBe(false);
    expect(farkliYazim.notifyLead).toBe("skipped");
  });

  it("mesru akis bozulmadi: taze bir adres ilk denemede onayini aliyor (notify_lead:sent)", async () => {
    openMailChannel();
    storeMode = "ok";
    const t = await gonder("taze-talep@example.com", "10.0.23.1");
    expect(t.status).toBe(200);
    expect(t.onayGitti).toBe(true);
    expect(t.ekipGitti).toBe(true);
    expect(t.notifyLead).toBe("sent");
  });

  it("kanal kapaliyken sayac YANMIYOR: gonderilmeyen e-postalar adresin tavanini tuketmiyor", async () => {
    storeMode = "ok";
    const adres = "kanal-kapali@example.com";

    // beforeEach RESEND_* siliyor — kanal kapali, hicbir e-posta gitmiyor.
    for (let i = 1; i <= CAP + 2; i++) {
      const t = await gonder(adres, `10.0.24.${i}`);
      expect(t.onayGitti).toBe(false);
      // Kanal yapilandirilmamis: mevcut sozlesme (TASK-2.07) korunur.
      expect(t.notifyLead).toBe("failed");
    }

    openMailChannel();
    const ilkGercekDeneme = await gonder(adres, "10.0.24.9");
    expect(ilkGercekDeneme.onayGitti).toBe(true);
    expect(ilkGercekDeneme.notifyLead).toBe("sent");
  });

  it("adversarial: ziyaretcinin yazdigi metin onay e-postasina HIC girmiyor", async () => {
    openMailChannel();
    storeMode = "ok";
    const kotuAd = "ACIL: hesabinizi dogrulayin https://kotu.example";
    const alici = "metin-sondasi@example.com";

    fetchCalls.length = 0;
    const res = await POST(
      request(JSON.stringify(validPayload({ name: kotuAd, email: alici })), "10.0.25.1"),
    );
    expect(res.status).toBe(200);
    await res.json();

    const onay = fetchCalls.find((c) => c.url === RESEND_URL && recipientOf(c.body) === alici);
    expect(onay).toBeDefined();
    const onayGovde = JSON.parse(onay?.body ?? "{}") as { text?: string };
    expect(onayGovde.text).toBe(LEAD_CONFIRMATION.text);
    expect(String(onayGovde.text)).not.toContain(kotuAd);
    expect(String(onayGovde.text)).not.toContain("kotu.example");

    // Kontrol grubu: ayni metin EKIP bildiriminde DURUYOR. Durmasaydi
    // "sizinti yok" olcumu, alanin hic tasinmadigi bir uc icin de gecerdi.
    const ekip = fetchCalls.find((c) => c.url === RESEND_URL && recipientOf(c.body) === TEAM);
    expect(ekip).toBeDefined();
    const ekipGovde = JSON.parse(ekip?.body ?? "{}") as { text?: string };
    expect(String(ekipGovde.text)).toContain(kotuAd);
  });
});
