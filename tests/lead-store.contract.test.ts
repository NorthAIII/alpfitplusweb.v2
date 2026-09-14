import { beforeAll, describe, expect, it } from "vitest";

/**
 * Depo sozlesme paketi (TASK-1.13) — sitenin kayit adaptorunun (TASK-1.14)
 * dayanacagi depo davranisini, yerel lead-store kopyasina (TASK-1.17) karsi
 * dondurur. Depoyu DEGIL SOZLESMEYI olcer — depo kodu bu reponun disinda,
 * v1'de yasar (../Alpfitplus-website.v1/pocketbase). Kaynak: v1 README →
 * "Uc nokta sozlesmesi", `pb_hooks/lead_lib.js`.
 *
 * ENV KAPISI — sitenin canli LEAD_STORE_* anahtarlarindan bilerek AYRI, yanlislikla
 * canli degerle kosulmasin diye:
 *   LEAD_CONTRACT_URL                          — orn. http://lead-store:8090 (yalniz yerel host)
 *   LEAD_CONTRACT_TOKEN_PREVIEW                — .env'deki LEAD_TOKEN_PREVIEW ile ayni deger
 *   LEAD_CONTRACT_TOKEN_PRODUCTION              — .env'deki LEAD_TOKEN_PRODUCTION ile ayni deger
 *   LEAD_CONTRACT_SUPERUSER_EMAIL / _PASSWORD   — kosumdan hemen once
 *     `pocketbase superuser upsert` ile acilan GECICI superuser. Koleksiyon
 *     kurallari `null` oldugu icin env, notify_* alanlari, mesaj uzunlugu, kayit sayimi gibi
 *     alan-okuyan kriterler yalniz bu kimlikle olculur (task karari — Alt Gorev 2).
 *     PATCH senaryosu bilerek superuser okumasi ISTEMEZ, yalniz "hangi
 *     koleksiyonda" sorusuna bakar (durum kodu yeter).
 *
 * LEAD_CONTRACT_URL TANIMSIZSA paket `describe.skip` ile atlanir — diger testler
 * ve cikis kodu (0) etkilenmez. TANIMLIYKEN host yerel degilse (lead-store /
 * localhost / 127.0.0.1 disinda) paket ISTEK ATMADAN hata verir: canli depoya
 * yanlislikla karsi kosulmayi engelleyen kapi (canli koruma kapisi).
 *
 * Kosum (token degeri komut gecmisine yazilmadan, `.env`'den okunur):
 *   set -a; source .env; set +a
 *   PW=$(openssl rand -hex 16)
 *   docker compose --profile lead up -d lead-store
 *   docker compose exec lead-store pocketbase superuser upsert contract@local.test "$PW" --dir=/pb/pb_data
 *   docker compose exec \
 *     -e LEAD_CONTRACT_URL=http://lead-store:8090 \
 *     -e LEAD_CONTRACT_TOKEN_PREVIEW="$LEAD_TOKEN_PREVIEW" \
 *     -e LEAD_CONTRACT_TOKEN_PRODUCTION="$LEAD_TOKEN_PRODUCTION" \
 *     -e LEAD_CONTRACT_SUPERUSER_EMAIL=contract@local.test \
 *     -e LEAD_CONTRACT_SUPERUSER_PASSWORD="$PW" \
 *     web npm test
 *
 * HER SENARYO KENDI ip_hash'INI VE E-POSTASINI TASIR (memory →
 * hiz-sinirli-uca-test-bataryasi.md'nin buradaki karsiligi): countPrior email
 * VEYA phone'u koleksiyon genelinde sayar ve hacim kosudan kosuya birikir; sabit
 * bir adres kullanmak ikinci kosuda prior_count beklentilerini kirar. Ayni
 * gerekce ip_hash icin de gecerli: paylasilmis bir ip_hash hiz sinirina takilir.
 */

const LOCAL_HOSTS = new Set(["lead-store", "localhost", "127.0.0.1"]);

function assertLocalHost(rawUrl: string): void {
  const { hostname } = new URL(rawUrl);
  if (!LOCAL_HOSTS.has(hostname)) {
    throw new Error(
      `lead-store sozlesme paketi: LEAD_CONTRACT_URL yerel degil ("${hostname}") ` +
        "— canli/uzak depoya karsi kosulmaz (canli koruma kapisi)",
    );
  }
}

function mustEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `lead-store sozlesme paketi: ${name} tanimli olmali (LEAD_CONTRACT_URL tanimliyken zorunlu)`,
    );
  }
  return value;
}

let uniqueCounter = 0;
function unique(label: string): string {
  uniqueCounter += 1;
  return `${label}-${Date.now()}-${uniqueCounter}-${Math.random().toString(36).slice(2, 8)}`;
}
function uniqueIpHash(label: string): string {
  return unique(`ip-${label}`);
}
function uniqueEmail(label: string): string {
  return `${unique(`lead-${label}`)}@example.com`;
}

function runContractSuite(baseUrlRaw: string): void {
  const BASE_URL = baseUrlRaw.replace(/\/+$/, "");
  const TOKEN_PREVIEW = mustEnv("LEAD_CONTRACT_TOKEN_PREVIEW");
  const TOKEN_PRODUCTION = mustEnv("LEAD_CONTRACT_TOKEN_PRODUCTION");
  const SUPERUSER_EMAIL = mustEnv("LEAD_CONTRACT_SUPERUSER_EMAIL");
  const SUPERUSER_PASSWORD = mustEnv("LEAD_CONTRACT_SUPERUSER_PASSWORD");

  async function postLead(
    token: string | undefined,
    body: Record<string, unknown>,
  ): Promise<{ status: number; json: unknown }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token !== undefined) headers["X-Lead-Token"] = token;

    const res = await fetch(`${BASE_URL}/lead`, { method: "POST", headers, body: JSON.stringify(body) });
    const json = (await res.json().catch(() => undefined)) as unknown;
    return { status: res.status, json };
  }

  async function patchLead(
    token: string,
    id: string,
    body: Record<string, unknown>,
  ): Promise<{ status: number; json: unknown }> {
    const res = await fetch(`${BASE_URL}/lead/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "X-Lead-Token": token },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => undefined)) as unknown;
    return { status: res.status, json };
  }

  async function authSuperuser(): Promise<string> {
    const res = await fetch(`${BASE_URL}/api/collections/_superusers/auth-with-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: SUPERUSER_EMAIL, password: SUPERUSER_PASSWORD }),
    });
    if (!res.ok) {
      throw new Error(`lead-store sozlesme paketi: superuser kimlik dogrulamasi basarisiz (status ${res.status})`);
    }
    const data = (await res.json()) as { token?: string };
    if (!data.token) {
      throw new Error("lead-store sozlesme paketi: superuser auth yanitinda token yok");
    }
    return data.token;
  }

  async function getRecord(collection: string, id: string, token: string): Promise<{ status: number; json: unknown }> {
    const res = await fetch(`${BASE_URL}/api/collections/${collection}/records/${id}`, {
      headers: { Authorization: token },
    });
    const json = (await res.json().catch(() => undefined)) as unknown;
    return { status: res.status, json };
  }

  async function countByFilter(collection: string, filter: string, token: string): Promise<number> {
    const url = `${BASE_URL}/api/collections/${collection}/records?filter=${encodeURIComponent(filter)}&perPage=1&page=1`;
    const res = await fetch(url, { headers: { Authorization: token } });
    if (!res.ok) {
      throw new Error(`lead-store sozlesme paketi: sayim sorgusu basarisiz (status ${res.status}, filter=${filter})`);
    }
    const data = (await res.json()) as { totalItems: number };
    return data.totalItems;
  }

  describe("lead-store sozlesme paketi (yerel depo)", () => {
    let superuserToken = "";
    let previewRecordId = "";
    let productionRecordId = "";

    beforeAll(async () => {
      superuserToken = await authSuperuser();
    });

    it("(1) onizleme token + gecerli govde -> 201, id 15 karakter, prior_count 0; kayit leads_preview'da env=preview, notify_* pending", async () => {
      const ip_hash = uniqueIpHash("s1");
      const email = uniqueEmail("s1");
      const { status, json } = await postLead(TOKEN_PREVIEW, {
        name: "Sozlesme Testi",
        club: "Test Kulup",
        ip_hash,
        email,
      });
      const body = json as { id: string; prior_count: number };

      expect(status).toBe(201);
      expect(body.id).toHaveLength(15);
      expect(body.prior_count).toBe(0);
      previewRecordId = body.id;

      const record = await getRecord("leads_preview", body.id, superuserToken);
      expect(record.status).toBe(200);
      const rec = record.json as { env: string; notify_team: string; notify_lead: string };
      expect(rec.env).toBe("preview");
      expect(rec.notify_team).toBe("pending");
      expect(rec.notify_lead).toBe("pending");
    });

    it("(2) uretim token -> kayit leads'te env=production; leads_preview'da yok", async () => {
      const ip_hash = uniqueIpHash("s2");
      const email = uniqueEmail("s2");
      const { status, json } = await postLead(TOKEN_PRODUCTION, {
        name: "Sozlesme Testi",
        club: "Test Kulup",
        ip_hash,
        email,
      });
      const body = json as { id: string };
      expect(status).toBe(201);
      productionRecordId = body.id;

      const inProduction = await getRecord("leads", body.id, superuserToken);
      expect(inProduction.status).toBe(200);
      expect((inProduction.json as { env: string }).env).toBe("production");

      const inPreview = await getRecord("leads_preview", body.id, superuserToken);
      expect(inPreview.status).toBe(404);
    });

    it("(3) govdedeki env=production onizleme token'iyla yok sayilir — kayit yine leads_preview'da env=preview", async () => {
      const ip_hash = uniqueIpHash("s3");
      const email = uniqueEmail("s3");
      const { status, json } = await postLead(TOKEN_PREVIEW, {
        name: "Sozlesme Testi",
        club: "Test Kulup",
        ip_hash,
        email,
        env: "production",
      });
      const body = json as { id: string };
      expect(status).toBe(201);

      const record = await getRecord("leads_preview", body.id, superuserToken);
      expect(record.status).toBe(200);
      expect((record.json as { env: string }).env).toBe("preview");
    });

    it("(4) tokensiz ve yanlis token -> 401 unauthorized, kayit olusmaz", async () => {
      const ipNoToken = uniqueIpHash("s4a");
      const noToken = await postLead(undefined, { name: "X", club: "Y", ip_hash: ipNoToken });
      expect(noToken.status).toBe(401);
      expect(noToken.json).toEqual({ error: "unauthorized" });

      const ipWrongToken = uniqueIpHash("s4b");
      const wrongToken = await postLead("bu-token-yanlis-ve-gecersiz", {
        name: "X",
        club: "Y",
        ip_hash: ipWrongToken,
      });
      expect(wrongToken.status).toBe(401);
      expect(wrongToken.json).toEqual({ error: "unauthorized" });

      expect(await countByFilter("leads_preview", `ip_hash="${ipNoToken}"`, superuserToken)).toBe(0);
      expect(await countByFilter("leads_preview", `ip_hash="${ipWrongToken}"`, superuserToken)).toBe(0);
    });

    it("(5) name/club/ip_hash eksik -> 400 invalid-payload, kayit yok", async () => {
      const ipMissingName = uniqueIpHash("s5a");
      const missingName = await postLead(TOKEN_PREVIEW, { club: "Y", ip_hash: ipMissingName });
      expect(missingName.status).toBe(400);
      expect(missingName.json).toEqual({ error: "invalid-payload" });

      const ipMissingClub = uniqueIpHash("s5b");
      const missingClub = await postLead(TOKEN_PREVIEW, { name: "X", ip_hash: ipMissingClub });
      expect(missingClub.status).toBe(400);
      expect(missingClub.json).toEqual({ error: "invalid-payload" });

      // ip_hash'in kendisi eksik — yoklugu ip_hash filtresiyle degil, bu
      // senaryoya ozgu benzersiz e-posta ile dogrulanir.
      const emailMissingIpHash = uniqueEmail("s5c");
      const missingIpHash = await postLead(TOKEN_PREVIEW, { name: "X", club: "Y", email: emailMissingIpHash });
      expect(missingIpHash.status).toBe(400);
      expect(missingIpHash.json).toEqual({ error: "invalid-payload" });

      expect(await countByFilter("leads_preview", `ip_hash="${ipMissingName}"`, superuserToken)).toBe(0);
      expect(await countByFilter("leads_preview", `ip_hash="${ipMissingClub}"`, superuserToken)).toBe(0);
      expect(await countByFilter("leads_preview", `email="${emailMissingIpHash}"`, superuserToken)).toBe(0);
    });

    it("(6) ayni ip_hash ile alti istek -> [201,201,201,201,201,429], o ip_hash icin tam 5 kayit", async () => {
      const ip_hash = uniqueIpHash("s6");
      const statuses: number[] = [];
      for (let i = 0; i < 6; i += 1) {
        const { status } = await postLead(TOKEN_PREVIEW, {
          name: "Sozlesme Testi",
          club: "Test Kulup",
          ip_hash,
          email: uniqueEmail(`s6-${i}`),
        });
        statuses.push(status);
      }
      expect(statuses).toEqual([201, 201, 201, 201, 201, 429]);

      expect(await countByFilter("leads_preview", `ip_hash="${ip_hash}"`, superuserToken)).toBe(5);
    });

    it("(7) prior_count dedup degildir — yeni e-posta 0, ayni e-postayla ikinci istek 1 doner", async () => {
      const ip_hash = uniqueIpHash("s7");
      const email = uniqueEmail("s7");

      const first = await postLead(TOKEN_PREVIEW, { name: "X", club: "Y", ip_hash, email });
      expect(first.status).toBe(201);
      expect((first.json as { prior_count: number }).prior_count).toBe(0);

      const second = await postLead(TOKEN_PREVIEW, { name: "X", club: "Y", ip_hash, email });
      expect(second.status).toBe(201);
      expect((second.json as { prior_count: number }).prior_count).toBe(1);
    });

    it("(8) 5000'i asan message -> 201, kayitta 5000 karaktere kirpilir (reddedilmez)", async () => {
      const ip_hash = uniqueIpHash("s8");
      const email = uniqueEmail("s8");
      const longMessage = "M".repeat(6000);

      const { status, json } = await postLead(TOKEN_PREVIEW, {
        name: "X",
        club: "Y",
        ip_hash,
        email,
        message: longMessage,
      });
      expect(status).toBe(201);
      const body = json as { id: string };

      const record = await getRecord("leads_preview", body.id, superuserToken);
      expect(record.status).toBe(200);
      expect((record.json as { message: string }).message).toHaveLength(5000);
    });

    // PATCH senaryolari (1) ve (2)'nin kayitlarini kullanir — dosya icinde
    // Vitest varsayilan sirasiyla (concurrent yok) calisir. Bos id durumunda
    // PocketBase'in kafa karistirici bir yanitindansa acik assertion hatasi
    // tercih edilir.
    it("(9a) PATCH /lead/{id} {notify_team:sent} -> 200 {ok:true}", async () => {
      expect(previewRecordId).not.toBe("");
      const { status, json } = await patchLead(TOKEN_PREVIEW, previewRecordId, { notify_team: "sent" });
      expect(status).toBe(200);
      expect(json).toEqual({ ok: true });
    });

    it("(9b) onizleme token'iyla uretim kaydina PATCH -> 404", async () => {
      expect(productionRecordId).not.toBe("");
      const { status } = await patchLead(TOKEN_PREVIEW, productionRecordId, { notify_team: "sent" });
      expect(status).toBe(404);
    });
  });
}

const CONTRACT_URL = process.env.LEAD_CONTRACT_URL;

if (!CONTRACT_URL) {
  describe.skip("lead-store sozlesme paketi (LEAD_CONTRACT_URL tanimsiz — atlandi)", () => {
    it("atlandi", () => {});
  });
} else {
  // Istek atmadan hata verir (canli koruma kapisi) — token/superuser env
  // kontrolu runContractSuite icinde, yine ilk istekten once yapilir.
  assertLocalHost(CONTRACT_URL);
  runContractSuite(CONTRACT_URL);
}
