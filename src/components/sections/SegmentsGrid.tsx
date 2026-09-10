import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SEGMENTS } from "@/content/segments";

export function SegmentsGrid() {
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
                  sizes="(max-width: 640px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                />
                <span
                  className="absolute inset-0 bg-linear-to-t from-ink-deep/80 via-ink-deep/15 to-transparent"
                  aria-hidden
                />
                <p className="absolute bottom-4 left-5 right-5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-sage-br">
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
