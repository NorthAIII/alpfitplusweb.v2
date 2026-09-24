import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { IconBox } from "@/components/ui/Icon";
import { MODULES, type Module } from "@/content/product";
import { cn } from "@/lib/cn";

/**
 * MODUL PANOSU (TASK-3.19, B-051'in ikinci yarisi).
 *
 * Eski hal: one cikan BES modul `md:grid-cols-2 lg:grid-cols-3` izgarada bes
 * ESIT kart (349x378 / 349x358 @1440) ve her kart `IconBox` (44x44 karo) +
 * baslik + blurb + dort madde. Masaustunde 3 + 2 diziliyordu, yani ikinci sira
 * TIRTIKLI bitiyordu. Kalip STYLE-GUIDE -> Kullanicinin Refleksleri ->
 * Kullanma maddesinin tarifi: "Jenerik ikonlu kart izgarasi (3xN esit kart,
 * ikon + baslik + iki satir)".
 *
 * ONE CIKAN SAYISI ICERIKTEN GELIR VE BESTIR — olculdu: bu bolumun ikinci
 * yarisi (kalan moduller seridi, `lg:grid-cols-5`) TASK-3.19'un kapsami
 * DISINDADIR ve kullanici kararyla yerinde kalir. On modulun 5/5 bolunmesi o
 * seridin izgarasiyla birebir ortusur; one cikani 4'e ya da 6'ya cekmek
 * tirtikli satiri duzeltmez, yalnizca DOKUNULMAYACAK seride tasir (4 oge / 5
 * sutun ya da 6 oge / 5 sutun). Yani duzeltilecek olan sayi degil DUZENDIR.
 *
 * Yerine gecen ritim PANODUR, izgara degil: bes hucre TEK bir cerceveli
 * panonun icinde, ic cizgilerle ayrilmis ve ESIT DEGIL. Ust sira iki hucre
 * (0,58 / 0,42), alt sira uc hucre; iki sira da tam dolar, tirtikli satir
 * kalmaz. Omurga hucresi (Takvim — blurb'u zaten "Urunun en kritik modulu"
 * diyor) hem genis hem buyuk puntolu, maddeleri iki sutuna akar. Tek cerceve
 * ayrica bolumun kendi cumlesini gorsellestirir: "Kulubun tamami, parca parca
 * degil".
 *
 * IKON KAROSU DUSTU VE YERINE BASKA BIR IKON KONMADI. Karo, reddedilen
 * kalibin ikinci ayagiydi; satir ici kucuk isaret ise TASK-3.18'in (Faydalar)
 * jesti — ayni hareketi iki bolumde tekrarlamak "duzen cesitliligi" degil
 * kopyadir. Panonun dokusu tipografi ve cizgidir; ikon dokusu bolumun ikinci
 * yarisinda, kalan moduller seridinde zaten duruyor (kapsam disi, dokunulmadi)
 * ve iki yari boylece birbirinden ayrisir.
 *
 * SAYFANIN BUGUNKU RITMINE KARSI SECILDI: ana sayfanin 15 bolumunun 8'i iki
 * sutunlu bolme (Hero · Chaos · Roles · ProductStory · HowItWorks ·
 * PricingBlock · FounderProgram · Faq) — dokuzuncusu ritim degisimi olmazdi.
 * Tam genislikte sac teli dokum TASK-3.18'de Faydalar'a verildi, tekrari
 * olmaz. Esit kartli izgara zaten WhyUs ve SegmentsGrid'in ritmi. Cerceveli,
 * esit olmayan hucreli pano sayfada baska hicbir yerde yok.
 *
 * METIN TASINMADI: bes modulun basligi, blurb'u ve maddeleri
 * `src/content/product.ts` -> MODULES icinde, sirasi da ayni. Madde sayisi
 * eskisi gibi ilk dort (`slice(0, 4)`).
 */

/** Ust sirada kac hucre var — alt sira kalanlari alir (5 = 2 + 3). */
const UST_SIRA = 2;

function Hucre({ m, omurga = false }: { m: Module; omurga?: boolean }) {
  return (
    <>
      <h3
        className={cn(
          "font-display font-bold leading-snug text-ink",
          omurga ? "text-xl sm:text-2xl" : "text-lg",
        )}
      >
        {m.title}
      </h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{m.blurb}</p>
      {/*
        Maddeler `columns` ile akar, GRID ile degil: grid kabi bu bolumun
        cikmaya calistigi kalibin ta kendisidir (dort cocuklu bir izgara kabi
        olcumde yine "izgara" olarak sayilirdi). Isaret de svg degil, tek
        piksellik bir cizgi (`before`) — panonun kendi cizgi dokusu.
        Bosluk `gap` yerine maddenin `mb`'sinde: cok sutunlu akista ikinci
        sutunun ilk maddesi `space-y` ile asagi kayardi.
      */}
      <ul className={cn("mt-4 -mb-2", omurga && "sm:columns-2 sm:gap-x-9")}>
        {m.points.slice(0, 4).map((p) => (
          <li
            key={p}
            className="relative mb-2 break-inside-avoid pl-4.5 text-sm leading-snug text-muted before:absolute before:left-0 before:top-[0.5625rem] before:h-px before:w-2.5 before:bg-line before:content-['']"
          >
            {p}
          </li>
        ))}
      </ul>
    </>
  );
}

export function Modules() {
  const featured = MODULES.filter((m) => m.featured);
  const rest = MODULES.filter((m) => !m.featured);
  const ust = featured.slice(0, UST_SIRA);
  const alt = featured.slice(UST_SIRA);

  return (
    <Section tone="canvas" id="moduller">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHead
          label="Modüller"
          title={
            <>
              Kulübün <span className="text-gradient-sage">tamamı</span>, parça parça değil
            </>
          }
          lead="On modül tek üründe. Hepsi şube fiyatına dâhil, modül kısıtı yok."
        />
        <Link
          href="/ozellikler"
          className="inline-flex shrink-0 items-center gap-2 font-display text-sm font-bold text-sage-ink underline-offset-4 hover:underline"
        >
          Tüm özellikleri gör
          <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
        </Link>
      </div>

      {/* one cikan bes modul — tek pano, esit olmayan hucreler */}
      <div className="mt-12 overflow-hidden rounded-card bg-surface ring-1 ring-line">
        <div className="lg:grid lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
          {ust.map((m, i) => (
            <Reveal
              key={m.key}
              as="article"
              delay={i * 60}
              className={cn(
                "min-w-0 p-6 sm:p-7 lg:p-8",
                // Omurga hucresi yalniz genis ve buyuk puntolu degil, ayrica
                // SOLUK BIR ZEMIN tasir: panonun icindeki hiyerarsi boylece
                // punto farkina kalmadan da okunur. Ton, bolumun ikinci
                // yarisindaki (kapsam disi) seridin zeminiyle AYNI —
                // `surface-2`; iki yari ayni aileden kalir.
                i === 0 && "bg-surface-2",
                i > 0 && "border-t border-line lg:border-l lg:border-t-0",
              )}
            >
              <Hucre m={m} omurga={i === 0} />
            </Reveal>
          ))}
        </div>
        <div className="lg:grid lg:grid-cols-3">
          {alt.map((m, i) => (
            <Reveal
              key={m.key}
              as="article"
              delay={i * 60}
              className={cn(
                "min-w-0 border-t border-line p-6 sm:p-7 lg:p-8",
                i > 0 && "lg:border-l",
              )}
            >
              <Hucre m={m} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* kalan moduller — kompakt (TASK-3.19 KAPSAMI DISI, kullanici karari) */}
      <Reveal>
        <div className="mt-5 grid gap-4 rounded-card bg-surface-2 p-6 ring-1 ring-line sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {rest.map((m) => (
            <div key={m.key} className="flex gap-3 lg:flex-col lg:gap-2.5">
              <IconBox name={m.icon} size="sm" />
              <div>
                <h3 className="font-display text-[0.9375rem] font-bold text-ink">{m.title}</h3>
                <p className="mt-1 text-sm leading-snug text-muted">{m.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
