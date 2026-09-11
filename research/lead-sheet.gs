/**
 * Alpfit Plus — Demo talebi alicisi (Google Apps Script web app)
 *
 * Ne yapar: /api/demo ucunun POST ettigi JSON lead'i bagli e-tabloya bir satir
 * olarak yazar. Token dogrulamasi, kilit ve JSON yanit sozlesmesi buradadir.
 *
 * BU DOSYA KAYNAKTIR. Google tarafindaki kopya bununla BIRE BIR ayni tutulur —
 * token burada degil Script Properties'te durdugu icin iki kopya hic ayrismaz.
 *
 * ---------------------------------------------------------------------------
 * KURULUM (bir kez)
 *   1. E-tabloyu ac  →  Uzantilar  →  Apps Script
 *   2. Bu dosyanin TAMAMINI editore yapistir (varsayilan Code.gs icerigini sil)
 *   3. Proje ayarlari (disli)  →  Script Properties  →  Add script property
 *        Property: LEAD_TOKEN
 *        Value   : tahmin edilemez, >= 32 karakterlik rastgele dize
 *      Uretmek icin:  openssl rand -hex 24
 *   4. Dagit  →  Yeni dagitim  →  Tur: Web app
 *        Execute as        : Me (e-tablonun sahibi)
 *        Who has access    : Anyone
 *   5. Uretilen /exec adresine token eklenir; LEAD_WEBHOOK_URL degeri budur:
 *        https://script.google.com/macros/s/<ID>/exec?token=<LEAD_TOKEN>
 *      Bu adres bir SIRDIR — repoya, commit mesajina, task dokumanina yazilmaz.
 *
 * KOD DEGISINCE (adres korunur)
 *   Dagit  →  Dagitimlari yonet  →  mevcut dagitimi DUZENLE (kalem)  →
 *   Surum: Yeni surum  →  Dagit.
 *   "Yeni dagitim" acmak /exec adresini DEGISTIRIR ve Vercel env'i gunceller.
 *
 * SOZLESME
 *   Istek : POST <exec>?token=...   govde = application/json, tek lead nesnesi
 *   Yanit : HER YOLDA JSON.  { ok: true }  |  { ok: false, code: "..." }
 *   Not   : Betik hata firlatirsa Apps Script 200 + HTML dondurur; route bu
 *           yuzden res.ok'a degil govdedeki ok alanina bakar (TASK-1.05).
 *           Asagidaki doPost bu yuzden her seyi try/catch icine alir.
 * ---------------------------------------------------------------------------
 */

/** Sayfa adi; yoksa e-tablonun ilk sayfasi kullanilir. */
var SHEET_NAME = "Talepler";

/** Script Properties'teki token anahtari. */
var TOKEN_KEY = "LEAD_TOKEN";

/**
 * Sutun sirasi — src/app/api/demo/route.ts icindeki `type Lead` ile bire bir,
 * arti `env` alani (deployStage degeri, TASK-1.05 ekler).
 * IP KAYDA GIRMEZ (KVKK asgarilik).
 */
var COLUMNS = [
  "at",
  "env",
  "name",
  "club",
  "branches",
  "phone",
  "email",
  "segment",
  "message",
  "consent",
  "ua"
];

/** Tek hucreye yazilacak en uzun metin (route zaten kirpiyor; bu ikinci kemer). */
var MAX_CELL = 4000;

/** Kilit bekleme suresi (ms). Es zamanli appendRow satir kaybedebilir. */
var LOCK_WAIT_MS = 20000;

function doPost(e) {
  try {
    var expected = PropertiesService.getScriptProperties().getProperty(TOKEN_KEY);
    if (!expected) {
      // Kurulum eksik. Fail-open YOK: token tanimli degilse hicbir sey yazilmaz.
      return json({ ok: false, code: "no-token-configured" });
    }

    var given = (e && e.parameter && e.parameter.token) || "";
    if (given !== expected) {
      return json({ ok: false, code: "bad-token" });
    }

    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, code: "no-body" });
    }

    var lead;
    try {
      lead = JSON.parse(e.postData.contents);
    } catch (err) {
      return json({ ok: false, code: "bad-json" });
    }
    if (!lead || typeof lead !== "object" || lead instanceof Array) {
      return json({ ok: false, code: "bad-json" });
    }

    var lock = LockService.getScriptLock();
    if (!lock.tryLock(LOCK_WAIT_MS)) {
      // Route bunu hedef dustu sayar ve e-postaya duser (sessiz kayip yok).
      return json({ ok: false, code: "busy" });
    }

    try {
      var sheet = targetSheet();
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(COLUMNS);
        sheet.setFrozenRows(1);
      }

      var row = COLUMNS.map(function (key) {
        return cell(lead[key]);
      });
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (err) {
    // Beklenmeyen hata da JSON doner — HTML hata sayfasi res.ok'u yaniltir.
    return json({ ok: false, code: "error", message: String(err) });
  }
}

/**
 * Tarayicidan /exec adresine girilirse anlamli bir JSON donsun; boylece
 * "adres calisiyor mu" sorusu HTML hata sayfasina bakmadan yanitlanir.
 */
function doGet() {
  return json({ ok: false, code: "use-post" });
}

function targetSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

/**
 * Degeri hucreye yazilabilir, ZARARSIZ bir metne cevirir.
 *
 * Sheets, "=" ile baslayan metni FORMUL olarak yorumlar; "+", "-", "@" ise
 * e-tablo CSV'ye aktarilip Excel'de acilirsa ayni yuzeyi acar. Lead mesaji
 * disaridan geldigi icin bu bir enjeksiyon yuzeyidir (ornek: =IMPORTXML ile
 * hucre icerigini disari sizdirmak). Tek tirnak oneki hucreyi metne sabitler.
 *
 * YAN ETKI — ilk canli testte DOGRULA: telefon alani her zaman "+90..." ile
 * basladigi icin bu oneki alir. Beklenen davranis, onekin e-tabloda GORUNMEMESI
 * (Sheets onu metin-zorlama isareti sayar, formul cubugunda gorunur, hucrede
 * gorunmez). Hucrede duz olarak "'+90..." goruyorsan onek harfi harfine
 * yazilmis demektir; o zaman kacis kumesi yalniz "=" ile sinirlanir — guvenlik
 * tarafi korunur (asil risk "=" ile gelir), gorunum duzelir.
 */
function cell(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "evet" : "hayir";

  var s = String(value);
  if (s.length > MAX_CELL) s = s.slice(0, MAX_CELL);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
