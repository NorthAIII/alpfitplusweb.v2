import { createHmac } from "node:crypto";

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/demo/route";

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

type FetchCall = { url: string; method: string; headers: Record<string, string>; body: string | undefined };
const fetchCalls: FetchCall[] = [];

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
    return new Response(JSON.stringify({ id: "mock" }), { status: 200 });
  }
  throw new Error(`beklenmeyen fetch cagrisi: ${method} ${url}`);
});

vi.stubGlobal("fetch", fetchMock);

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Ayşe Yılmaz",
    club: "Form Spor Kulübü",
    branches: "Merkez",
    phone: "05551234567",
    email: "ayse@example.com",
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

  it("bal kupu dolu -> 200, depoya cagri yok", async () => {
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

  it("depo 201 + basarili mail -> PATCH notify_team:sent, notify_lead'e dokunulmaz", async () => {
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
    expect(patchBody).toEqual({ notify_team: "sent" });
  });

  it("depo 201 + mail yok (RESEND_* tanimsiz) -> PATCH notify_team:failed", async () => {
    storeMode = "ok";
    const payload = validPayload();
    const res = await POST(request(JSON.stringify(payload), "10.0.7.7"));
    await res.json();

    const patchCall = fetchCalls.find((c) => c.method === "PATCH");
    expect(patchCall).toBeDefined();
    const patchBody = JSON.parse(patchCall?.body ?? "{}") as Record<string, unknown>;
    expect(patchBody).toEqual({ notify_team: "failed" });
  });
});
