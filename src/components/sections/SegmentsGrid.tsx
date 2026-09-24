import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SEGMENTS } from "@/content/segments";

/**
 * @param eagerFirst  Ilk kartin fotografini `loading="eager"` yapar.
 *   YALNIZ /segmentler'de acilir ve olcumle secildi (TASK-3.20, B-046 kalem 1):
 *   o sayfada 768 px'te LCP elemani ilk kartin fotografi ve bugun `lazy` --
 *   Next 16'nin kendi uyarisinin kosulu tam olarak budur (`get-img-props.js`:
 *   `lcpImage.loading === 'lazy'`), ve uyarinin onerdigi carе `loading="eager"`.
 *   `priority` SECILMEDI: o ayrica bir preload baglantisi dogurur ve 390 px'te
 *   kart ilk ekranin ALTINDA kaliyor (olculdu; orada LCP bir <p>), yani preload
 *   dar ekranda 63 KB'i one cekerdi. `/` sayfasinda bayrak kapali cunku orada
 *   LCP Hero'nun urun ekrani ve segment kartlari cok asagida.
 */
export function SegmentsGrid({ eagerFirst = false }: { eagerFirst?: boolean }) {
  return (
    <Section tone="soft" id="segmentler">
      <SectionHead
        label="Segmentler"
        title={
          <>
            Reformer, boks ve CrossFit{" "}
            <span className="text-gradient-sage">aynı üründe</span>
          </>
        }
        lead="Yerli ürünler ya sadece pilatese ya sadece spor okuluna ya da turnike ekosistemine odaklanıyor. Üçünü birden, donanımsız ve sade biçimde yapan bir ürün yok."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {SEGMENTS.map((s, i) => (
          <Reveal key={s.slug} delay={i * 70}>
            <Link
              href={`/segmentler/${s.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-sm ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-sage/35"
            >
              {/* baglam fotografi */}
              <div className="relative aspect-16/9 overflow-hidden bg-ink-deep">
                <Image
                  src={s.photo.thumb}
                  alt={s.photo.alt}
                  fill
                  // Olculen yerlesim: <640 tek sutun (100vw - 2x px-5) ·
                  // >=640 iki sutun, (kapsayici - gap-5) / 2 · >=1152
                  // kapsayici max-w-6xl'e oturur ve 534 px'te donar.
                  // Olculen: 350 / 342 / 534 px (390 / 768 / 1440). Eski
                  // beyan 42vw = 605 px idi (@1440), gercek 534 px.
                  sizes="(min-width: 1152px) 534px, (min-width: 640px) calc((100vw - 84px) / 2), calc(100vw - 40px)"
                  loading={eagerFirst && i === 0 ? "eager" : undefined}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                />
                <span
                  className="absolute inset-0 bg-linear-to-t from-ink-deep/90 via-ink-deep/25 to-transparent"
                  aria-hidden
                />
                <p
                  data-over-image
                  className="absolute bottom-4 left-5 right-5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-sage-br"
                >
                  {s.short}
                </p>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="font-display text-xl font-bold leading-snug text-ink sm:text-2xl">
                  {s.name}
                </h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{s.intro}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-display text-sm font-bold text-sage-ink">
                  {s.shortName} için detaylar
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.4}
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
