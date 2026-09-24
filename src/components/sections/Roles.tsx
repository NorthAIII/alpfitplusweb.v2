"use client";

import { useState } from "react";
import { Check, Monitor, Smartphone } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { BrowserFrame, PhoneFrame } from "@/components/ui/Frames";
import { ROLES } from "@/content/product";
import { SHOTS } from "@/content/shots";
import { cn } from "@/lib/cn";

/**
 * Sekme -> urun ekran goruntusu eslemesi.
 *
 * TASK-3.15 (B-046 kalem 2): esleme bir satir kaymisti — `antrenor` rezervasyon
 * takvimini, `diyetisyen` antrenor detay ekranini gosteriyordu. Antrenor satiri
 * duzeltildi; diyetisyen satiri hala VEKILDIR ve bu bilincli, KAPANMAMIS bir
 * bosluktur (B-046 kanvasta acik durur):
 *
 *   Urunun kendisinde diyetisyen ekranlari VAR (../Alpfit.v1/web/src/pages/
 *   DietitianMembersPage.tsx), ama gorsel hattinin kaynagi olan demo destesinde
 *   (../Alpfit.v1/demo/) diyetisyen ekrani YOK — hat bu yuzden uretemiyor.
 *   Deste eklendigi gun (TASK-3.24) bu satir gercek ekrana baglanir.
 *
 * VEKIL NEDEN `grup`: destedeki masaustu yakalamalarin hepsi ayni YONETIM
 * panelidir; hicbiri diyetisyen ekrani degil. Aralarindan `antrenor` secilemez,
 * cunku goruntunun kendi basligi "Antrenor Detayi" yazar — "Diyetisyen"
 * sekmesinin altinda hem gozle hem ekran okuyucuda sekmeyle CELISIR (B-046'nin
 * adiyla sikayet ettigi kusur) ve komsu sekmeyle ayni kareyi tekrarlardi.
 * `grup`un basligi baska bir rolu adlandirmaz ve alt metni ("grup dersleri
 * ekrani: kontenjan, katilimci listesi ve yoklama") goruntude GERCEKTEN duran
 * seyi anlatir — yani vekil, olmadigi bir sey oldugunu iddia etmez
 * (docs/CLAIMS.md -> kanitsiz iddia siniri).
 */
const VISUAL = {
  uye: SHOTS.uyeTelefon,
  antrenor: SHOTS.antrenor,
  diyetisyen: SHOTS.grup,
  yonetim: SHOTS.cockpit,
} as const;

export function Roles() {
  const [active, setActive] = useState(0);
  const role = ROLES[active];
  const shot = VISUAL[role.key as keyof typeof VISUAL];
  // CERCEVE GORSELIN SEKLINDEN TURER, rolun `device` alanindan DEGIL (TASK-3.15).
  // Gerekce: `device` urun gercegini soyler (antrenor kendi TELEFONUNDAN calisir —
  // faq.ts, gecis.ts ve bu bolumun kendi lead cumlesi bunu yaziyor) ama elimizdeki
  // antrenor yakalamasi 1200x866, yani bir masaustu paneli. Rolun `device`ini
  // "web"e cekmek cerceveyi duzeltirdi ama siteye YANLIS bir cumle soyletirdi;
  // cerceveyi goruntunun kendi oranina baglamak ikisini de dogru tutar.
  // Gecicidir ve KENDILIGINDEN geri doner: TASK-3.24 dikey (telefon) bir antrenor
  // yakalamasi ekledigi gun bu kosul yeniden PhoneFrame secer, kod degismez.
  const isPhone = shot.height > shot.width;

  return (
    <Section tone="soft" id="roller">
      <SectionHead
        label="Dört rol, tek platform"
        title={
          <>
            Kulüpte kim ne yapıyorsa,{" "}
            <span className="text-gradient-sage">kendi ekranından</span>
          </>
        }
        lead="Üye ve antrenör kendi telefonundan, diyetisyen ve yönetim web panelinden çalışır. Dördü de aynı veriyi görür."
      />

      {/* min-w-0 SART: izgara ogesinin varsayilani min-width:auto'dur, yani
            icerigin altina inmeyi reddeder. Icerideki overflow-x-auto sekme
            seridi bu yuzden sutunu 614px'e sisirip sayfayi yatay kaydiriyordu
            (390px ekranda olculdu). */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12">
        {/* sekmeler */}
        <div className="min-w-0">
          <div
            role="tablist"
            aria-label="Roller"
            className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {ROLES.map((r, i) => {
              const on = i === active;
              return (
                <button
                  key={r.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={cn(
                    // max-w TAVANI KABA BAGLIDIR, pencereye degil (TASK-3.15).
                    // Kartin dogal genisligi 360 px (`max-w-xs` ozet + 2x20 dolgu);
                    // seridin gorunur genisligi 320 px pencerede 280, 390'da 350 —
                    // yani dar ekranda tek kart bile hicbir zaman tumuyle gorunmuyordu
                    // (WCAG 1.4.10 icerik kaybi; B-033 ikinci kalem). Yuzde, esnek
                    // kabin ICERIK kutusuna gore cozulur, viewport'a gore degil: bu,
                    // kapinin olcutuyle (cocuk genisligi <= kabin clientWidth'i) AYNI
                    // referanstir. 3rem pay bilincli — 8 px gap dusulunce sonraki
                    // karttan 40 px gorunur kalir, yani seridin kaydirilabilir oldugu
                    // gorulur; tavansiz halde ilk kart ekrani tam doldurur ve kalan
                    // uc rol icin hicbir ipucu kalmaz. Tavan yalnizca ~464 px'in
                    // altinda isirir; 640 px ve uzerinde kart genisligi, serit ve
                    // bolum yuksekligi BIREBIR bugunku degerlerdir (olculdu).
                    "group relative shrink-0 rounded-card px-5 py-4 text-left transition-all duration-200 max-w-[calc(100%_-_3rem)] lg:w-full lg:max-w-none",
                    on
                      ? "bg-surface shadow-md ring-1 ring-sage/35"
                      : "bg-surface/55 ring-1 ring-line hover:bg-surface hover:ring-line-2",
                  )}
                >
                  {on ? (
                    <span className="absolute left-0 top-4 bottom-4 hidden w-[3px] rounded-r-full bg-sage lg:block" aria-hidden />
                  ) : null}
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-lg",
                        on ? "bg-sage-wash text-sage-ink" : "bg-surface-2 text-faint",
                      )}
                    >
                      {r.device === "mobil" ? (
                        <Smartphone className="size-4" strokeWidth={1.8} aria-hidden />
                      ) : (
                        <Monitor className="size-4" strokeWidth={1.8} aria-hidden />
                      )}
                    </span>
                    <span className={cn("font-display font-bold", on ? "text-ink" : "text-muted")}>
                      {r.name}
                    </span>
                    <span className="ml-auto hidden text-[0.6875rem] text-faint sm:inline lg:inline">
                      {r.deviceLabel}
                    </span>
                  </span>
                  <span className="mt-1.5 block max-w-xs text-sm text-muted lg:max-w-none">
                    {r.summary}
                  </span>
                </button>
              );
            })}
          </div>

          <ul className="mt-7 flex flex-col gap-3">
            {role.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage-wash-2 text-sage-ink">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* gorsel */}
        <div className="relative flex min-w-0 items-center justify-center">
          <div
            className="pointer-events-none absolute inset-6 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_45%,rgba(116,179,111,.20),transparent_70%)] blur-2xl"
            aria-hidden
          />
          {/* `sizes` OLCULEN yerlesimden (TASK-3.20; sekmeye TIKLANARAK olculdu
              -- ilk boyada yalniz etkin sekmenin gorseli cizilir, B-015).
              Telefon: kutu w-56/w-64, icteki gorsel 212 / 244 px.
              Tarayici: <640 100vw-40 · 640-1023 100vw-64 (tek sutun) ·
              >=1024 (icerik - gap-12) x 1,08/2 = %54 · >=1216 kapsayici
              max-w-6xl'e oturdugu icin 561,6 px'te donuyor. Olculen: 350 /
              704 / 492,5 / 561,6 px (390 / 768 / 1024 / 1440). */}
          {isPhone ? (
            <PhoneFrame
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="(min-width: 640px) 244px, 212px"
              className="relative w-56 sm:w-64"
            />
          ) : (
            <BrowserFrame
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="(min-width: 1216px) 562px, (min-width: 1024px) calc((100vw - 112px) * 0.54), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
              className="relative w-full"
            />
          )}
        </div>
      </div>
    </Section>
  );
}
