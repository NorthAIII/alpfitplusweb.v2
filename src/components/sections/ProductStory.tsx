"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/Section";
import { SHOTS, type Shot } from "@/content/shots";
import { cn } from "@/lib/cn";

/**
 * Yapiskan kaydirmali urun turu.
 *
 * Sag sutundaki adim goruse girdikce sol sutundaki ekran degisiyor. Sekmeli
 * surumun yerini aldi: sekmede ziyaretcinin tiklamasi gerekiyordu ve cogu
 * ziyaretci tiklamiyor.
 *
 * ISARETLER (callout) yalnizca yerlesimi GOZLE DOGRULANMIS iki ekranda var.
 * Yeri bilinmeyen bir ekrana isaret koymak, hicbir seyi gostermeyen bir ok
 * demek olurdu; kalan ekranlar alt yazi ile geciyor.
 */

/**
 * Ekran uzerindeki isaret.
 *
 * Metin etiketi ekranin UZERINE yazilmiyor: ilk denemede etiketler tam da
 * gostermek istedikleri sayilari ortuyordu (olculdu — "842" ve "Grup/hafta"
 * kapandi). Onun yerine kucuk numarali bir nokta konuyor, karsiligi cerceve
 * ALTINDAKI listede duruyor. Nokta neredeyse hicbir seyi ortmuyor, metin de
 * tam okunuyor.
 */
type Pin = { x: number; y: number; label: string };
type Step = { key: string; title: string; body: string; shot: Shot; pins?: Pin[] };

const STEPS: Step[] = [
  {
    key: "takvim",
    title: "Gün, tek ekranda",
    body:
      "Her antrenörün sütunu, her saatin durumu. Dolu slot, grup dersi, müsait saat ve izin aynı ızgarada. Boş hücreye tıklayıp randevu açarsınız.",
    shot: SHOTS.takvim,
    pins: [
      { x: 29, y: 24, label: "Her antrenörün kendi sütunu" },
      { x: 87, y: 24, label: "Bekleme listesi, sırada kim var" },
      { x: 87, y: 66, label: "Günün doluluk özeti" },
    ],
  },
  {
    key: "grup",
    title: "Grup dersi ve yoklama",
    body:
      "Haftalık tekrarlı program, kontenjan ve bekleme listesi. Antrenör roster'ı kendi telefonundan açıp tek dokunuşla işaretliyor. Yanlış işaretlerse 48 saat içinde düzeltebiliyor.",
    shot: SHOTS.grup,
  },
  {
    key: "finans",
    title: "Satış ile tahsilat ayrı",
    body:
      "Kim ne aldı, ne kadarını ödedi, ne kadar borcu kaldı. Nakit bazlı ciro PT, üyelik ve grup kırılımıyla görünür. Gün sonu mutabakatı biter.",
    shot: SHOTS.finans,
  },
  {
    key: "cockpit",
    title: "Şubeler yan yana",
    body:
      "Ciro, aktif üye ve doluluk şube şube. Hangi şube ne getiriyor tek bakışta belli; detayına inip aynı ekrandan geri çıkıyorsunuz.",
    shot: SHOTS.cockpit,
    pins: [
      { x: 12, y: 31, label: "Tüm şubelerin toplamı" },
      { x: 9, y: 93, label: "Şube detayına inin" },
    ],
  },
  {
    key: "raporlar",
    title: "Muhasebeye giden dosya",
    body:
      "Hazır şablonlar ve tek tık XLSX, CSV, PDF. Doluluk raporunda gelmeyen sayısı ayrı kolon olarak durur, tahminle doldurulmaz.",
    shot: SHOTS.raporlar,
  },
];

export function ProductStory() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        // Ekranin ortasina en yakin adim aktif olur.
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const best = visible.reduce((a, b) =>
          Math.abs(a.boundingClientRect.top - window.innerHeight / 2) <
          Math.abs(b.boundingClientRect.top - window.innerHeight / 2)
            ? a
            : b,
        );
        const i = stepRefs.current.indexOf(best.target as HTMLLIElement);
        if (i >= 0) setActive(i);
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    for (const el of stepRefs.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  const shot = STEPS[active].shot;
  const pins = STEPS[active].pins;

  // NOT: bu bolumde overflow-hidden YOK ve olmamali. Bir ust katmandaki
  // overflow-hidden, position:sticky'yi sessizce oldurur (olculdu: yapiskan
  // sutun kaydirmada yerinde durmuyordu). Dekoratif katmanlar zaten
  // absolute inset-0, tasma uretmiyorlar.
  return (
    <section className="relative bg-ink-deep py-20 text-canvas sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-55 bg-[radial-gradient(48%_46%_at_50%_0%,rgba(116,179,111,.2),transparent_66%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-linegrid opacity-[0.04]" aria-hidden />

      <Container size="wide" className="relative">
        <SectionHead
          tone="light"
          align="center"
          label="Ürün turu"
          title="Anlatmak yerine göstermek"
          lead="Aşağıdaki ekranlar ürünün kendisinden alındı. Rakamlar örnek verilerdir, gerçek bir kulübün verisi gösterilmez."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] lg:gap-14">
          {/* sol: yapiskan gorsel — yalniz genis ekranda */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative overflow-hidden rounded-xl bg-[#111410] shadow-xl ring-1 ring-white/10">
                <div className="flex items-center gap-2 border-b border-white/8 bg-[#171914] px-3.5 py-2.5">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="size-2.5 rounded-full bg-white/18" />
                    <span className="size-2.5 rounded-full bg-white/18" />
                    <span className="size-2.5 rounded-full bg-white/18" />
                  </span>
                  <span className="ml-2 rounded-md bg-white/6 px-2.5 py-1 text-[0.6875rem] text-canvas/60">
                    app.alpfitplus.com
                  </span>
                </div>

                <div className="relative">
                  {STEPS.map((s, i) => (
                    <Image
                      key={s.key}
                      src={s.shot.src}
                      alt={s.shot.alt}
                      width={s.shot.width}
                      height={s.shot.height}
                      sizes="58vw"
                      priority={i === 0}
                      className={cn(
                        "block h-auto w-full transition-opacity duration-500",
                        i === active ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0",
                      )}
                    />
                  ))}

                  {/* isaretler — yalniz numarali nokta, karsiligi asagidaki listede */}
                  {pins?.map((p, pi) => (
                    <span
                      key={p.label}
                      className="absolute z-10 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      aria-hidden
                    >
                      <span className="absolute size-5 rounded-full bg-sage/35 animate-pulse-ring" />
                      <span className="relative grid size-5 place-items-center rounded-full bg-sage font-display text-[0.625rem] font-extrabold text-ink-deep ring-2 ring-ink-deep">
                        {pi + 1}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* isaret listesi */}
              {pins?.length ? (
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {pins.map((p, pi) => (
                    <li key={p.label} className="flex items-center gap-2 text-[0.8125rem] text-canvas/70">
                      <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-sage/20 font-display text-[0.5625rem] font-extrabold text-sage-br">
                        {pi + 1}
                      </span>
                      {p.label}
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* ilerleme */}
              <div className="mt-5 flex gap-1.5" aria-hidden>
                {STEPS.map((s, i) => (
                  <span
                    key={s.key}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors duration-500",
                      i === active ? "bg-sage" : "bg-white/12",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* sag: adimlar */}
          <ol className="flex flex-col gap-6 lg:gap-0">
            {STEPS.map((s, i) => (
              <li
                key={s.key}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="lg:py-16 lg:first:pt-6 lg:last:pb-24"
              >
                <div
                  className={cn(
                    "rounded-card p-6 ring-1 transition-all duration-500 lg:bg-transparent lg:p-0 lg:ring-0",
                    "bg-white/5 ring-white/10",
                    // ETKIN OLMAYAN KARTIN OPAKLIGI WCAG AA'NIN ALTINA INEMEZ
                    // (TASK-3.09, B-032 kalem 1). Bu opaklik kartin ICINDEKI
                    // her metin katmanini carpar, yani tabani EN ZAYIF katman
                    // belirler -- burada govde, cunku onun kendi alfasi da var
                    // (asagida text-canvas/78: 0,78 x 0,70 = 0,55 etkin alfa).
                    // Olculdu (piksel yontemi, p02, 3100 @1440x900, a11y.mjs):
                    //   0,45 -> govde 2,52-2,54 · etiket 2,98-2,99 · baslik 4,39-4,43
                    //   0,70 -> govde 5,82-5,96 · etiket 5,34-5,43 · baslik 9,11-9,28
                    //   esikler:        4,5              4,5             3 (24px/700)
                    // Baslik 0,45'te DE geciyordu (buyuk metin esigi 3) -- kayitta
                    // yazan "1,13:1" olcumde cikmadi; duzeltme onu da yukseltti.
                    // Opakligi tek basina yukseltmek yetmezdi: 0,45'te govdeye
                    // TAM BEYAZ verilse bile ink-deep uzerinde ~4,5 cikiyor
                    // (hesap), yani pay yok -- o yuzden alfa da yukseldi.
                    i === active ? "lg:opacity-100" : "lg:opacity-70",
                  )}
                >
                  <span className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-sage-br">
                    {String(i + 1).padStart(2, "0")} · {s.key === "cockpit" ? "Çok şube" : s.key}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold text-canvas sm:text-2xl">
                    {s.title}
                  </h3>
                  {/* /65 -> /78: govde IKI KEZ soluyordu (kendi alfasi x kartin
                      opakligi), o yuzden esigi zorlayan katman oydu. Alfayi
                      yukseltmek, kart opakligini 0,45'ten yalniz 0,70'e
                      cikarmakla yetinmeyi mumkun kildi -- tek basina opaklikla
                      ayni payi tutturmak 0,80 isterdi ve etkin/etkin-olmayan
                      ayrimi gozle silinirdi. Olculdu (p02, 3100 @1440x900):
                      soluk kart 2,52 -> 5,82 · etkin kart 8,03 -> 11,3. Dar
                      ekranda kart opakligi HIC uygulanmaz (lg:), orada govde
                      zaten geciyordu; bugun 390 px'te 9,70. */}
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-canvas/78">{s.body}</p>

                  {/* dar ekranda gorsel adimin icinde */}
                  <div className="mt-5 overflow-hidden rounded-xl ring-1 ring-white/10 lg:hidden">
                    <Image
                      src={s.shot.src}
                      alt={s.shot.alt}
                      width={s.shot.width}
                      height={s.shot.height}
                      sizes="100vw"
                      className="block h-auto w-full"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
