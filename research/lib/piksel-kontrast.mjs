/**
 * PIKSEL TABANLI KONTRAST OLCUMU (TASK-3.04).
 *
 * Neden: hesaplanmis stilden turetilen model uc seyi YAPISAL olarak goremez
 * (B-031) — gradyan/fotograf zemini (tek renk yok), ata opakligi (kompozisyon),
 * gradyanla boyanmis metin (renk `transparent`). Yama sayisi arttikca
 * "olculemeyen" buyur, sifir dar kalir.
 *
 * Yontem: ayni kaydirma konumunda IKI KARE alinir — normal, ve glif dolgusu
 * seffaf. Farki GLIF MASKESIDIR. Metin rengi CSS'ten gelir (antialias hic
 * karismaz), zemin maskenin altindaki GERCEK PIKSELDEN okunur.
 *
 * ⚠️ Metin rengini boyanan pikselden ALMA. Arastirma prototipinin ilk turu
 * bunu yapti ve 100 olcumun 95'ini esik alti gosterdi — okunan sey metin degil
 * ANTIALIAS KENARIYDI (`med` 17'ye cikarken `p02` 1,1'de kaliyordu). Glif
 * cekirdegini morfolojik erozyonla ayiklamak ince yazida ise yaramiyor:
 * 11-15 px govde metninin inmesi cogu yerde tek piksel. fg CSS'ten, piksel
 * YALNIZ zemini verir (PHASE-3-ARASTIRMA -> 2. yaklasim).
 *
 * Glif dolgusu `-webkit-text-fill-color` ile seffaflastirilir, `color` ile
 * DEGIL: `color` ayni zamanda `currentColor`un kaynagidir ve Tailwind 4
 * preflight'i kenarliklari `border: 0 solid` (yani currentColor) olarak
 * kuruyor — `color`u degistirmek kenarlik, SVG dolgusu ve alt cizgi renklerini
 * de oynatir ve maskeye metin olmayan piksel sizdirir. `-webkit-text-fill-color`
 * yalnizca glif dolgusunu etkiler; `text-decoration-color` currentColor'da
 * kaldigi icin alt cizgiler iki karede de AYNI kalir ve maskeye girmez.
 *
 * Opaklik modeli: boyanan renk = fg * alfa_etkin + zemin * (1 - alfa_etkin),
 * alfa_etkin = renk alfasi × ata zincirindeki her `opacity`nin carpimi.
 * `opacity` tasiyan kabin KENDI zemini seffafsa model TAM DOGRUDUR (bu projede
 * ProductStory'nin soluk kartlari boyle: `lg:bg-transparent` + `lg:opacity-45`).
 * Kabin kendi zemini varsa yaklasiklik kalir ve gercek degerden biraz
 * IYIMSERDIR — yani kapi bu halde kirmiziyi kacirabilir, sahte kirmizi uretmez.
 */
import sharp from "sharp";

/** WCAG AA — QUALITY 7. Buyuk metin: >= 24 px, ya da >= 18.66 px bold. */
export const ESIK_NORMAL = 4.5;
export const ESIK_BUYUK = 3;

export const esikFor = (px, agirlik) =>
  px >= 24 || (px >= 18.66 && agirlik >= 700) ? ESIK_BUYUK : ESIK_NORMAL;

/** Glif dolgusunu seffaflastiran stil — yalnizca boyama, yerlesim degismez. */
export const GIZLE_CSS = `*{-webkit-text-fill-color:transparent !important}`;

/**
 * Yumusak kaydirmayi kapatan olcum kosmasi.
 *
 * ⚠️ Bu dekoratif DEGIL, olcumun gecerlilik kosuludur. `globals.css:135`
 * `html{scroll-behavior:smooth}` tasiyor ve hareket azaltma bunu KAPATMIYOR
 * (`prefers-reduced-motion: reduce` blogu yalnizca animasyon/gecis suresini
 * sifirliyor). Sonuc: `window.scrollTo` bir ANIMASYON baslatir, DOM olcumu ile
 * ekran karesi FARKLI kaydirma konumunda alinir ve dikdortgen koordinatlari
 * kareyle hizalanmaz. Olculdu (TASK-3.04): bu kosma yokken sayfa altindaki
 * 25 eleman tek piksel bile uretmedi ve "kalan" kovasina — yani sahte kirmiziya
 * — dustu (/kullanim-kosullari'nda 04·05·06 bolumlerinin tamami).
 *
 * Kosma yalniz kaydirmanin ZAMANLAMASINI degistirir; hicbir sey yeniden
 * boyanmaz, yerlesim oynamaz. Yine de tek basina kanit sayilmaz — her adim
 * ayrica `kaydirVeDogrula` ile hedefe oturdugu OLCULEREK teyit edilir.
 */
export const KAYDIRMA_CSS = `html{scroll-behavior:auto !important}`;

/**
 * Bir pikselin "glif" sayilmasi icin iki kare arasindaki en buyuk kanal farki.
 * PNG kayipsizdir, yani gurultu yok; esik yalnizca cok soluk antialias
 * kuyrugunu disarida tutar. Dusurmek olculen piksel sayisini artirir,
 * p02'yi (en kotu %2) asagi ceker.
 */
export const MASKE_ESIGI = 12;

/** Ekran ekran gezme adimi — pencerenin %90'i (PHASE-3-ARASTIRMA -> 3. yaklasim). */
export const ADIM_ORANI = 0.9;

/** Tek elemandan toplanacak azami piksel — cok uzun metinlerde bellek tavani. */
const PIKSEL_TAVANI = 80000;

/** sRGB -> dogrusal isik, 256'lik tablo (piksel basina pow() cagrisi olmasin). */
const LIN = new Float64Array(256);
for (let i = 0; i < 256; i++) {
  const v = i / 255;
  LIN[i] = v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
const isik = (r, g, b) => 0.2126 * LIN[r] + 0.7152 * LIN[g] + 0.0722 * LIN[b];

/**
 * Tek pikselde kontrast orani.
 * @param {number[]} fg  metin rengi [r,g,b] (CSS'ten, alfasiz)
 * @param {number} alfa  etkin alfa (renk alfasi × ata opaklik carpimi)
 */
export function pikselOrani(fg, alfa, br, bg_, bb) {
  const r = Math.round(fg[0] * alfa + br * (1 - alfa));
  const g = Math.round(fg[1] * alfa + bg_ * (1 - alfa));
  const b = Math.round(fg[2] * alfa + bb * (1 - alfa));
  const a = isik(r, g, b) + 0.05;
  const c = isik(br, bg_, bb) + 0.05;
  return (a > c ? a / c : c / a);
}

/**
 * Oran dagiliminin ozeti. `p02` (en kotu %2 piksel) YARGI DEGERIDIR — desenli
 * zeminlerde bilincli olarak kati olcut (B-032'nin kendi yontemi). `min` ve
 * `med` birlikte verilir ki yargi gerektiginde yumusatilabilsin.
 */
export function ozet(oranlar) {
  const n = oranlar.length;
  if (!n) return null;
  const s = Float64Array.from(oranlar).sort();
  const yuvarla = (x) => Math.round(x * 100) / 100;
  return {
    n,
    min: yuvarla(s[0]),
    p02: yuvarla(s[Math.max(0, Math.ceil(0.02 * n) - 1)]),
    med: yuvarla(s[n >> 1]),
  };
}

/** Belge yuksekligine gore ekran adimi sayisi (en az 1). */
export function adimSayisi(belgeBoyu, pencereBoyu) {
  const adim = Math.max(1, Math.round(pencereBoyu * ADIM_ORANI));
  return Math.max(1, Math.ceil(Math.max(0, belgeBoyu - pencereBoyu) / adim) + 1);
}

/**
 * SAYFA ICINDE kosan aday toplayici. `page.evaluate`'e gecirildigi icin
 * KENDI KENDINE YETER — modul kapsamindan hicbir sey kapatmaz.
 *
 * Dondurdugu her kalem bir SINIF tasir:
 *   olculur   — olculecek
 *   yapiskan  — zincirinde position:fixed|sticky var; ekran ekran olcumde her
 *               adimda yeniden gorunur ve koordinati kayar. OLCUM DISI ve bu
 *               bir BORCTUR (B-063) — bu fazin kapsami degil (kullanici karari,
 *               verify-plan 2026-09-23).
 *   gradyan   — `background-clip:text` ile boyanmis metin; rengi CSS'te YOK,
 *               piksel yontemiyle de olculemez. Kendi dali TASK-3.05'te gelir;
 *               "olculemeyen"e ATILMAZ ki sonraki task onu devralabilsin.
 *   gorunmez  — ekran okuyucuya ozel (sr-only), etkin opakligi sifira yakin ya
 *               da alani olmayan metin. Gorsel kontrast kavrami uygulanmaz.
 */
export function adaylariTopla(ayar) {
  const SECICI = ayar.secici;
  const MIN_OPAKLIK = ayar.minOpaklik;
  const MIN_ALAN = ayar.minAlan;
  const W = window.innerWidth;
  const H = window.innerHeight;

  const g = window;
  if (!g.__pkSayac) g.__pkSayac = 0;

  const SC = new Map();
  const st = (el) => {
    let v = SC.get(el);
    if (v === undefined) {
      v = getComputedStyle(el);
      SC.set(el, v);
    }
    return v;
  };

  // Tailwind 4 saydam renkleri oklab() olarak yaziyor. Elle ayristirmak yerine
  // her rengi tuvale cizip pikselini okuyoruz — hangi renk uzayi gelirse gelsin
  // dogru RGBA cikar.
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const toRGBA = (renk) => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = "#000";
    cx.fillStyle = renk;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };

  // --- ata yuruyusleri memoize edilir (T1'de olculdu: ~2 saat -> 4 dakika) ---
  const opM = new Map();
  const opak = (el) => {
    if (!el || el.nodeType !== 1) return 1;
    let v = opM.get(el);
    if (v === undefined) {
      const o = parseFloat(st(el).opacity);
      v = (Number.isFinite(o) ? o : 1) * opak(el.parentElement);
      opM.set(el, v);
    }
    return v;
  };

  const yapM = new Map();
  const yapiskan = (el) => {
    if (!el || el.nodeType !== 1) return false;
    let v = yapM.get(el);
    if (v === undefined) {
      const po = st(el).position;
      v = po === "fixed" || po === "sticky" || yapiskan(el.parentElement);
      yapM.set(el, v);
    }
    return v;
  };

  const kesis = (a, b) => {
    if (!a) return b;
    if (!b) return a;
    const k = {
      l: Math.max(a.l, b.l),
      t: Math.max(a.t, b.t),
      r: Math.min(a.r, b.r),
      b: Math.min(a.b, b.b),
    };
    return k.r <= k.l || k.b <= k.t ? { l: 0, t: 0, r: 0, b: 0 } : k;
  };

  // Metnin gercekten boyandigi kutu. Elemanin KENDI `overflow`'u da sayilir:
  // overflow elemanin KUTUSUNU degil ICERIGINI kirpar, yani kendi metnini de.
  // Bunu atlamak `sr-only` atlama baglantisini ("İçeriğe geç") olculebilir
  // sanip "kalan" kovasina dusuruyordu — metin 1x1 px'lik kutunun disinda
  // yerlesiyor ve hicbir pikseli boyanmiyor (olculdu, TASK-3.04).
  const kpM = new Map();
  const kirpKutu = (el) => {
    if (!el || el.nodeType !== 1) return null; // null = sinirsiz
    let v = kpM.get(el);
    if (v !== undefined) return v;
    const s = st(el);
    let kendi = null;
    if (s.overflowX !== "visible" || s.overflowY !== "visible") {
      const r = el.getBoundingClientRect();
      kendi = { l: r.left, t: r.top, r: r.right, b: r.bottom };
    }
    v = kesis(kirpKutu(el.parentElement), kendi);
    kpM.set(el, v);
    return v;
  };

  // Elemanin KENDI metin dugumlerinin satir kutulari. Cocuk elemanlarin metni
  // disarida kalir — yoksa bir <p>'nin maskesine icindeki <span>'in glifleri de
  // girer ve o glifler BASKA bir renkte olabilir.
  const rg = document.createRange();
  const kendiKutulari = (el) => {
    const out = [];
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) {
        if (r.width > 0.5 && r.height > 0.5) out.push(r);
      }
    }
    return out;
  };

  const kalemler = [];
  for (const el of document.querySelectorAll(SECICI)) {
    const s = st(el);
    if (s.display === "none" || s.visibility === "hidden") continue;
    if (el.closest('[aria-hidden="true"]')) continue; // dekoratif, ekran okuyucudan gizli

    const kutular = kendiKutulari(el);
    if (!kutular.length) continue; // dogrudan metin dugumu yok

    if (el.__pk === undefined) el.__pk = ++g.__pkSayac;
    const k = el.__pk;

    const etiket = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 46);

    const kirp = kirpKutu(el);
    // Alan esigi HAM degil KIRPILMIS kutuya uygulanir: kirpilarak yok edilmis
    // metin olculebilir gorunmemeli.
    const gorunur = kutular.map((r) =>
      kesis(kirp, { l: r.left, t: r.top, r: r.right, b: r.bottom }),
    );
    const alan = gorunur.reduce((a, r) => a + Math.max(0, r.r - r.l) * Math.max(0, r.b - r.t), 0);
    const opaklik = opak(el);
    const renk = toRGBA(s.color);
    const dolgu = s.webkitTextFillColor ? toRGBA(s.webkitTextFillColor) : renk;

    let sinif = "olculur";
    if (alan < MIN_ALAN) sinif = "gorunmez";
    else if (opaklik < MIN_OPAKLIK) sinif = "gorunmez";
    else if (dolgu[3] === 0 || renk[3] === 0) sinif = "gradyan";
    else if (yapiskan(el)) sinif = "yapiskan";

    const kalem = { k, sinif, t: etiket };

    if (sinif === "olculur") {
      const dik = [];
      let tam = true;
      for (const g0 of gorunur) {
        const v = kesis(g0, { l: 0, t: 0, r: W, b: H });
        const x0 = Math.max(0, Math.floor(v.l));
        const y0 = Math.max(0, Math.floor(v.t));
        const x1 = Math.min(W, Math.ceil(v.r));
        const y1 = Math.min(H, Math.ceil(v.b));
        // Kutunun tamami mi pencereye sigdi? Pencere kenarinda yarim kalan
        // kutudan alinan olcum eksiktir ve baska bir adimda tamamlanir.
        if (
          Math.floor(g0.l) < x0 - 1 ||
          Math.floor(g0.t) < y0 - 1 ||
          Math.ceil(g0.r) > x1 + 1 ||
          Math.ceil(g0.b) > y1 + 1
        ) {
          tam = false;
        }
        if (x1 > x0 && y1 > y0) dik.push([x0, y0, x1, y1]);
      }
      const px = parseFloat(s.fontSize) || 16;
      const ag = parseInt(s.fontWeight, 10) || 400;
      // Karsilastirma kirpilmis kutu sayisina gore yapilir: ata kirpmasiyla
      // tumuyle yok olmus bir satir kutusu "eksik olcum" sayilmaz.
      const gorunurSayi = gorunur.filter((r) => r.r > r.l && r.b > r.t).length;
      kalem.dik = dik;
      kalem.tam = tam && dik.length === gorunurSayi;
      kalem.fg = [dolgu[0], dolgu[1], dolgu[2]];
      kalem.alfa = dolgu[3] * opaklik;
      kalem.px = Math.round(px);
      kalem.ag = ag;
    }
    kalemler.push(kalem);
  }

  return { kalemler, sX: window.scrollX, sY: window.scrollY, W, H };
}

/**
 * Hedef konuma kaydir ve OTURDUGUNU OLC.
 *
 * "scrollTo cagirdim" bir olcum degildir: yumusak kaydirma, tembel icerik ve
 * belge boyunun buyumesi hedefi kacirtabilir. Oturmuyorsa CUMLEYLE durulur —
 * yanlis konumda alinan bir kare butun rotayi sessizce bozardi (fail-closed).
 *
 * @returns {Promise<number>} gercekte oturulan kaydirma konumu
 */
export async function kaydirVeDogrula(p, hedefY, deneme = 12) {
  let son = null;
  for (let i = 0; i < deneme; i++) {
    await p.evaluate((yy) => window.scrollTo(0, yy), hedefY);
    // Bekleme NODE tarafinda — sayfa icine konan setTimeout bazi baglamlarda
    // hic cozulmez (memory/arastirma-konteynerinde-tarayici-olcumu.md).
    await new Promise((r) => setTimeout(r, i === 0 ? 140 : 90));
    const d = await p.evaluate(() => ({
      y: Math.round(window.scrollY),
      enBuyuk: Math.round(document.documentElement.scrollHeight - window.innerHeight),
    }));
    son = d.y;
    const beklenen = Math.min(hedefY, Math.max(0, d.enBuyuk));
    if (Math.abs(d.y - beklenen) <= 1) return d.y;
  }
  throw new Error(
    `Kaydırma hedefe oturmadı: istenen ${hedefY}, ulaşılan ${son} — ölçüm karesi ile DOM ölçümü aynı konumda değil, ölçüm yapılmadı.`,
  );
}

/**
 * Sayfanin BIR SONRAKI boyamasini bekle (iki `requestAnimationFrame` + bir tur
 * gorev kuyrugu). Stil degisiminden hemen sonra kare almak YETMEZ: olculdu
 * (TASK-3.04, /kvkk adim 1) — glif gizleme stili eklenip kare hemen alindiginda
 * yalnizca yapiskan basligin kendi bileske katmani yeniden boyanmis, GOVDE
 * METNI kareye hala GORUNUR girmisti. Sonuc: iki kare neredeyse ayni, maske
 * 1.839 piksel (komsu adimlarda 69.000), ve sayfanin ust yarisi "olculemedi"
 * diye kirmiziya dustu. Yani sahte kirmizi, sessiz bir zamanlama yarisi.
 */
const bekleBoyama = (p) =>
  p.evaluate(
    () =>
      new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 0))),
      ),
  );

/** Bir kare cifti cek: normal, sonra glif dolgusu seffaf. */
export async function kareCifti(p) {
  await bekleBoyama(p);
  const a = await p.screenshot();
  const stil = await p.addStyleTag({ content: GIZLE_CSS });
  await bekleBoyama(p);
  const b = await p.screenshot();
  await stil.evaluate((e) => e.remove());
  await bekleBoyama(p);
  return [a, b];
}

/** PNG tamponunu ham piksele cevir. */
export async function hamPiksel(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, en: info.width, boy: info.height, kanal: info.channels };
}

/**
 * Tek adimin olcumunu kayda isle.
 *
 * @param kayit  Map<k, durum> — rota boyunca birikir
 *
 * Strateji: bir eleman pencereye TAM sigdigi adimlarda olculur ve EN COK
 * PIKSEL veren adim kazanir. "Ilk tam adimda olc ve kapan" kurali denendi ve
 * FAIL-OPEN cikti: yapiskan baslik bir elemani ortuyorsa o adimda sifir piksel
 * uretir, eleman "olculdu" diye kapanir ve hicbir orani olmadigi icin "kalan"
 * kovasina — yani sahte kirmiziya — duser (olculdu, TASK-3.04).
 *
 * Hicbir adimda tam sigmiyorsa (pencereden uzun metin) parcali olculur ve
 * pikseller BELGE koordinatiyla tekillestirilir — adimlar %10 ortustugu icin
 * tekillestirme olmadan ayni glif iki kez sayilirdi.
 */
export function adimiIsle(kayit, toplam, kareA, kareB, esik = MASKE_ESIGI) {
  const { data: A } = kareA;
  const { data: B, en, boy, kanal } = kareB;
  const { sX, sY } = toplam;

  for (const kalem of toplam.kalemler) {
    let d = kayit.get(kalem.k);
    if (!d) {
      d = {
        sinif: kalem.sinif,
        t: kalem.t,
        px: kalem.px,
        ag: kalem.ag,
        gorundu: false,
        tamOranlar: [],   // pencereye tam sigan en iyi adimin olcumu
        kismiOranlar: [],  // hicbir adimda sigmayan metin icin birikim
        gorulenPx: null,
      };
      kayit.set(kalem.k, d);
    }
    if (kalem.sinif !== "olculur") continue;
    if (!kalem.dik || !kalem.dik.length) continue;

    d.gorundu = true;
    const tam = kalem.tam;
    if (!tam && !d.gorulenPx) d.gorulenPx = new Set();
    const hedef = tam ? [] : d.kismiOranlar;

    const fg = kalem.fg;
    const alfa = kalem.alfa;
    for (const [x0, y0, ham1, ham2] of kalem.dik) {
      // Kare boyutu ile window.innerWidth kaydirma cubugu genisligi kadar
      // ayrisabilir — koordinat her zaman KARENIN kendi olcusune kirpilir.
      const x1 = Math.min(ham1, en);
      const y1 = Math.min(ham2, boy);
      for (let y = y0; y < y1; y++) {
        const satir = y * en;
        for (let x = x0; x < x1; x++) {
          const i = (satir + x) * kanal;
          const dr = A[i] - B[i];
          const dg = A[i + 1] - B[i + 1];
          const db = A[i + 2] - B[i + 2];
          if (
            (dr < 0 ? -dr : dr) <= esik &&
            (dg < 0 ? -dg : dg) <= esik &&
            (db < 0 ? -db : db) <= esik
          ) {
            continue; // glif degil
          }
          if (!tam) {
            const anahtar = (y + sY) * 100000 + (x + sX);
            if (d.gorulenPx.has(anahtar)) continue;
            d.gorulenPx.add(anahtar);
          }
          if (hedef.length >= PIKSEL_TAVANI) break;
          hedef.push(pikselOrani(fg, alfa, B[i], B[i + 1], B[i + 2]));
        }
      }
    }
    // En cok piksel veren tam adim kazanir — ortulmus bir adim otekini ezmez.
    if (tam && hedef.length > d.tamOranlar.length) d.tamOranlar = hedef;
  }
}

/**
 * Rota kaydini sonuca cevir.
 * @returns {{ihlaller, olculen, kovalar}}
 *   kovalar.kalan — olculmesi gerekirken TEK PIKSEL bile uretmeyen eleman.
 *   Sifir olmayan her deger kapiyi kirmiziya cevirir: "hicbir sey olcmedim"
 *   ile "sorun bulmadim" ayni yesili basmasin (B-030/B-031).
 */
export function rotaSonucu(kayit) {
  const kovalar = { yapiskan: 0, gradyan: 0, gorunmez: 0, ekranDisi: 0, kalan: 0 };
  const ihlaller = [];
  // "kalan" bir kor noktadir ve kapiyi dusurur — o yuzden SAYI YETMEZ,
  // duzeltilebilmesi icin elemanin kendisi de basilir.
  const kalanlar = [];
  let olculen = 0;

  for (const d of kayit.values()) {
    if (d.sinif === "yapiskan") { kovalar.yapiskan++; continue; }
    if (d.sinif === "gradyan") { kovalar.gradyan++; continue; }
    if (d.sinif === "gorunmez") { kovalar.gorunmez++; continue; }
    // Tam sigan bir olcum varsa o gecerlidir; yoksa parcali birikim kullanilir.
    const oranlar = d.tamOranlar.length ? d.tamOranlar : d.kismiOranlar;
    if (!oranlar.length) {
      if (d.gorundu) {
        kovalar.kalan++;
        if (kalanlar.length < 8) kalanlar.push(`${d.px}px "${d.t}"`);
      } else kovalar.ekranDisi++;
      continue;
    }
    olculen++;
    const o = ozet(oranlar);
    const gereken = esikFor(d.px, d.ag);
    if (o.p02 < gereken) {
      ihlaller.push({ ...o, gereken, px: d.px, ag: d.ag, t: d.t });
    }
  }
  ihlaller.sort((a, b) => a.p02 - b.p02);
  return { ihlaller, olculen, kovalar, kalanlar };
}
