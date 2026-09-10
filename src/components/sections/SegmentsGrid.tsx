import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SEGMENTS } from "@/content/segments";

const ART: Record<string, string> = {
  "pilates-reformer": "from-sage-wash to-sage-wash-2",
  "boks-dovus": "from-amber-wash to-[#f7e7c8]",
  crossfit: "from-neg-wash to-[#f8dcd8]",
  "cok-subeli-zincir": "from-[#e9f0f6] to-[#d8e5ef]",
};

export function SegmentsGrid() {
  return (
    <Section tone="soft" id="segmentler">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
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
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {SEGMENTS.map((s, i) => (
          <Reveal key={s.slug} delay={i * 70}>
            <Link
              href={`/segmentler/${s.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-card bg-surface p-7 shadow-sm ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-sage/35"
            >
              <span
                className={`pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-linear-to-br ${ART[s.slug]} opacity-70 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
                aria-hidden
              />
              <div className="relative flex-1">
                <p className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-sage-ink">
                  {s.short}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-ink">
                  {s.name}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{s.intro}</p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-2 font-display text-sm font-bold text-sage-ink">
                {s.name.split(" ")[0]} için detaylar
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.4}
                  aria-hidden
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
