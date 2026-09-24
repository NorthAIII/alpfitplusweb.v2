/**
 * Olcum kapilarinin ORTAK ROTA KAYNAGI.
 *
 * Neden HTTP: arastirma konteyneri depoyu degil yalnizca `./research` dizinini
 * goruyor (docker-compose.yml -> research.volumes), yani `src/app/sitemap.ts`
 * ya da `src/content/segments.ts` dogrudan import EDILEMEZ. Liste bu yuzden
 * ayakta olan siteden `/sitemap.xml` ile turetilir; 404 rotasi sitemap'te
 * olmadigi icin (dogrusu budur) elle eklenir.
 *
 * Kazanci: yeni bir sayfa eklendiginde liste kendiliginde buyur. Elle kopyalanan
 * PAGES dizileri senkron kaybediyordu -- a11y 8, mobile-audit 9, font-guard 16
 * (B-012). Ayni liste artik tek yerden gelir.
 *
 * KAPSAM COKMESI SESSIZ GECMEZ: sitemap'ten turetilen liste BEKLENEN_ROTA'nin
 * altina duserse hata firlatilir. Ust sinir YOK -- sayfa eklenmesi mesrudur.
 */

/**
 * Bugunku kapsam: sitemap 15 rota + `/olmayan-sayfa`. Site buyudukce liste
 * buyur, bu sayi yalnizca TABANDIR. Sayfa bilerek SILINIRSE bu sabit de
 * dusurulur -- taban elle dusurulmeden kapi kirmizi kalir, ki amac odur.
 */
export const BEKLENEN_ROTA = 16;

/** Sitemap'te olmayan ama olculmesi gereken rotalar. */
export const EK_ROTALAR = ["/olmayan-sayfa"];

const ZAMAN_ASIMI_MS = 15000;

const yolaCevir = (loc) => {
  let yol;
  try {
    yol = new URL(loc).pathname;
  } catch {
    yol = loc; // mutlak degilse oldugu gibi
  }
  return yol.length > 1 ? yol.replace(/\/+$/, "") : yol;
};

/**
 * @param {string} base  Olcum hedefi, ornegin http://localhost:3100
 * @returns {Promise<{liste: string[], kaynak: string}>}
 * @throws {Error} Mesaj TAM BIR CUMLEDIR -- cagiran onu oldugu gibi basar,
 *   yigin izi basmaz (M6 F6.1 edge-case; B-030 kalem b).
 */
export async function rotalar(base) {
  // Kacis yolu: HTTP calismadiginda ya da dar bir kume olcmek gerektiginde
  // liste elle verilebilir. Bu kaynagi degistirir, ESIGI DEGISTIRMEZ --
  // cagiran betik gezdigi rota sayisini ayrica esikler, yani dar bir liste
  // kapiyi yesil birakmaz (fail-closed).
  const elle = process.env.ROTALAR?.trim();
  if (elle) {
    const liste = elle
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (s.startsWith("/") ? s : `/${s}`));
    if (!liste.length) {
      throw new Error(
        "ROTALAR ortam degiskeni tanimli ama icinde gecerli bir yol yok — olcum yapilmadi.",
      );
    }
    return { liste, kaynak: `ROTALAR ortam degiskeni (${liste.length} rota)` };
  }

  const url = `${base.replace(/\/+$/, "")}/sitemap.xml`;
  let xml;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(ZAMAN_ASIMI_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (e) {
    throw new Error(
      `Ölçüm hedefi ayakta değil ya da site haritası okunamadı: ${url} (${e.message}) — ölçüm yapılmadı.\n` +
        `   Yayın kopyası: docker compose --profile prod up -d --build web-prod   (3100)\n` +
        `   Geliştirme sunucusuna yönlendirmek için: BASE=http://localhost:3000\n` +
        `   Listeyi elle vermek için: ROTALAR=/,/demo,...`,
    );
  }

  const gorulen = new Set();
  const liste = [];
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const yol = yolaCevir(m[1]);
    if (!gorulen.has(yol)) {
      gorulen.add(yol);
      liste.push(yol);
    }
  }
  const sitemapSayisi = liste.length;
  for (const ek of EK_ROTALAR) {
    if (!gorulen.has(ek)) {
      gorulen.add(ek);
      liste.push(ek);
    }
  }

  if (liste.length < BEKLENEN_ROTA) {
    throw new Error(
      `Rota listesi çöktü: site haritası ${sitemapSayisi} rota verdi, toplam ${liste.length} — beklenen taban ${BEKLENEN_ROTA}. Ölçüm yapılmadı.\n` +
        `   Hedef (${url}) yanlış sürümü sunuyor olabilir; yayın kopyasını tazele: docker compose --profile prod up -d --build web-prod`,
    );
  }

  return {
    liste,
    kaynak: `${url} (${sitemapSayisi} rota + ${EK_ROTALAR.length} ek)`,
  };
}
