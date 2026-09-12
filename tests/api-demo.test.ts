import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/demo/route";

// TASK-1.05'te elle (ayrı konteyner, 3200) kostugu sozlesme bataryasini
// kalici hale getirir (TASK-1.16). Kaynak: tasks/archive/TASK-1.05.md
// -> Test Kriterleri ve Test Sonuclari.
//
// Sink kurulumu: yalniz LEAD_WEBHOOK_URL tanimli tutulur, LEAD_FILE_PATH
// BILINCLI olarak tanimsiz birakilir. TASK-1.05'in "bes bozuk yanit -> 503"
// olcumu de ayni kurulumla alindi (yalniz webhook, dosya yedegi yok) --
// bir dosya sinki de acik olsaydi bozuk webhook senaryolarinda `toFile`
// sessizce basarili olur, `stored` true'ya doner ve 503 hicbir zaman
// gorulmezdi. RESEND_* de tanimsiz birakilir; toEmail bu yuzden fetch'e hic
// gitmeden false doner, `mailed` her senaryoda false'tur.
//
// Hiz sinirlayici (`HITS`) modul kapsaminda ve dosya boyunca yasar
// (memory -> hiz-sinirli-uca-test-bataryasi.md): her senaryo kendi
// `x-forwarded-for` degerini tasir, yalniz 429 senaryosu paylasilan bir IP'de
// alti istekle olculur.

const RECEIVER_URL = "https://fake-lead-receiver.test/exec";

type ReceiverMode = "ok" | "html" | "ok-false" | "http-500" | "bad-json" | "array-body";

function receiverResponseFor(mode: ReceiverMode): Response {
  switch (mode) {
    case "ok":
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    case "html":
      // Apps Script hata verince donen govde (TASK-1.05 baglami).
      return new Response("<html><body>Yetkisiz erisim</body></html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    case "ok-false":
      return new Response(JSON.stringify({ ok: false, code: "bad-token" }), { status: 200 });
    case "http-500":
      return new Response(JSON.stringify({ ok: true }), { status: 500 });
    case "bad-json":
      return new Response("{ bu json degil", { status: 200 });
    case "array-body":
      return new Response(JSON.stringify([{ ok: true }]), { status: 200 });
  }
}

let receiverMode: ReceiverMode = "ok";

type FetchCall = { url: string; body: string | undefined };
const fetchCalls: FetchCall[] = [];

const fetchMock = vi.fn(async (input: unknown, init?: RequestInit): Promise<Response> => {
  const url = String(input);
  if (url === RECEIVER_URL) {
    fetchCalls.push({ url, body: typeof init?.body === "string" ? init.body : undefined });
    return receiverResponseFor(receiverMode);
  }
  // RESEND_* env'i her testte tanimsiz birakiliyor; toEmail bu durumda
  // fetch'e hic gitmez. Buraya dusulmesi bir regresyon isaretidir.
  throw new Error(`beklenmeyen fetch cagrisi: ${url}`);
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

// "Aranan: alici adresi, token, ad, telefon, e-posta, mesaj" (TASK-1.16).
// `club` bilincli olarak disarida birakildi -- route.ts:244 no-sink logu
// club tasir, TASK-1.05 karari bunu ihlal saymiyordu.
function assertNoLeak(payload: ReturnType<typeof validPayload>) {
  const serialized = JSON.stringify(consoleErrorSpy.mock.calls);
  expect(serialized).not.toContain(RECEIVER_URL);
  expect(serialized).not.toContain(payload.name);
  expect(serialized).not.toContain(payload.phone);
  expect(serialized).not.toContain(payload.email);
  expect(serialized).not.toContain(payload.message);
}

beforeEach(() => {
  fetchMock.mockClear();
  fetchCalls.length = 0;
  consoleErrorSpy.mockClear();
  receiverMode = "ok";
  process.env.LEAD_WEBHOOK_URL = RECEIVER_URL;
  delete process.env.LEAD_FILE_PATH;
  delete process.env.RESEND_API_KEY;
  delete process.env.DEMO_TO;
  delete process.env.DEMO_FROM;
});

afterAll(() => {
  vi.unstubAllGlobals();
  consoleErrorSpy.mockRestore();
});

describe("POST /api/demo — sozlesme bataryasi", () => {
  it("kontrol grubu: {ok:true} -> 200, stored:true, mailed:false", async () => {
    receiverMode = "ok";
    const payload = validPayload();
    const res = await POST(request(JSON.stringify(payload), "10.0.1.1"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, stored: true, mailed: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each<[string, ReceiverMode, string]>([
    ["200 + HTML", "html", "10.0.2.1"],
    ["200 + {ok:false}", "ok-false", "10.0.2.2"],
    ["500 + {ok:true}", "http-500", "10.0.2.3"],
    ["200 + bozuk JSON", "bad-json", "10.0.2.4"],
    ["200 + dizi govde", "array-body", "10.0.2.5"],
  ])("bozuk yanit (%s) -> 503 no-sink", async (_label, mode, ip) => {
    receiverMode = mode;
    const payload = validPayload();
    const res = await POST(request(JSON.stringify(payload), ip));
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json.ok).toBe(false);
    expect(json.code).toBe("no-sink");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    assertNoLeak(payload);
  });

  it("bal kupu dolu -> 200, aliciya cagri yok", async () => {
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

  it("6. istek 429 rate-limited (paylasilan IP, 5/10dk sinir)", async () => {
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

  it("uzun alan 400 dondurmez, MAX sinirina sessizce kirpilir", async () => {
    const longName = "A".repeat(200);
    const longBranches = "B".repeat(50);
    const payload = validPayload({ name: longName, branches: longBranches });
    const res = await POST(request(JSON.stringify(payload), "10.0.6.1"));

    expect(res.status).not.toBe(400);
    expect(res.status).toBe(200);
    expect(fetchCalls).toHaveLength(1);

    const sentLead = JSON.parse(fetchCalls[0].body ?? "{}") as { name: string; branches: string };
    expect(sentLead.name).toHaveLength(120);
    expect(sentLead.branches).toHaveLength(10);
  });
});
