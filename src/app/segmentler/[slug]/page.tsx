import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { IconBox } from "@/components/ui/Icon";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { PriceCalculator } from "@/components/sections/PriceCalculator";
import { SEGMENTS, segmentBySlug } from "@/content/segments";
import { MODULES } from "@/content/product";
import { PRICING } from "@/content/pricing";

export function generateStaticParams() {
  return SEGMENTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seg = segmentBySlug(slug);
  if (!seg) return {};
  return {
    title: seg.name,
    description: seg.intro.slice(0, 180),
    alternates: { canonical: `/segmentler/${seg.slug}` },
  };
}

export default async function SegmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seg = segmentBySlug(slug);
  if (!seg) notFound();

  const mods = seg.modules
    .map((k) => MODULES.find((m) => m.key === k))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const others = SEGMENTS.filter((s) => s.slug !== seg.slug);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seg.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        crumbs={[
          { label: "Segmentler", href: "/segmentler" },
          { label: seg.name, href: `/segmentler/${seg.slug}` },
        ]}
        label={seg.short}
        title={seg.hero}
        lead={seg.intro}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/demo" size="lg">
            Demo İste
            <ArrowRight className="size-4.5" strokeWidth={2.2} aria-hidden />
          </Button>
          <Button href="/fiyat" variant="secondary" size="lg">
            Fiyatı gör
          </Button>
        </div>
      </PageHero>

      {/* dert → karsilik */}
      <Section tone="soft">
        <SectionHead
          label="Günlük dert"
          title={`${seg.name.split(" ")[0]} tarafında ne aksıyor`}
          lead="Solda bugünün hâli, sağda Alpfit Plus'ın karşılığı. Dört madde, süsleme yok."
        />
        <div className="mt-12 flex flex-col gap-4">
          {seg.pains.map((p, i) => {
            const a = seg.answers[i];
            return (
              <Reveal key={p.title} delay={i * 60}>
                <div className="grid gap-px overflow-hidden rounded-card bg-line ring-1 ring-line md:grid-cols-2">
                  <div className="bg-surface p-6">
                    <span className="inline-grid size-8 place-items-center rounded-lg bg-neg-wash text-neg ring-1 ring-neg/15">
                      <X className="size-4" strokeWidth={2.4} aria-hidden />
                    </span>
                    <h3 className="mt-3.5 font-display text-[1.0625rem] font-bold text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{p.body}</p>
                  </div>
                  <div className="bg-sage-wash/55 p-6">
                    <span className="inline-grid size-8 place-items-center rounded-lg bg-sage-wash-2 text-sage-ink ring-1 ring-sage/25">
                      <Check className="size-4" strokeWidth={2.8} aria-hidden />
                    </span>
                    <h3 className="mt-3.5 font-display text-[1.0625rem] font-bold text-sage-ink">
                      {a?.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/75">{a?.body}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* segmente ozel moduller */}
      <Section tone="canvas">
        <SectionHead
          label="Öne çıkan modüller"
          title={`Bu kulüp tipinde en çok kullanılanlar`}
          lead="Modül kısıtı yok, hepsi dâhil. Aşağıdakiler bu segmentte günlük olarak en çok açılanlar."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mods.map((m, i) => (
            <Reveal key={m.key} delay={i * 55}>
              <div className="h-full rounded-card bg-surface p-6 shadow-sm ring-1 ring-line">
                <IconBox name={m.icon} size="md" />
                <h3 className="mt-4 font-display text-[1.0625rem] font-bold text-ink">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{m.blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* fiyat */}
      <Section tone="soft">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          <SectionHead
            label="Fiyat"
            title="Şube başına tek fiyat"
            lead={`İlk şube ${PRICING.firstBranch.toLocaleString("tr-TR")} ₺, ikinci şubeden itibaren ${PRICING.extraBranch.toLocaleString("tr-TR")} ₺. Aylık, KDV hariç. Eğitmen ve üye limiti yok, mobil uygulama dâhil.`}
          />
          <Reveal delay={80}>
            <PriceCalculator compact />
          </Reveal>
        </div>
      </Section>

      <Faq
        items={seg.faq}
        tone="canvas"
        label="Segment SSS"
        title={`${seg.name.split(" ")[0]} tarafında sık sorulanlar`}
      />

      {/* diger segmentler */}
      <Section tone="soft" size="sm">
        <h2 className="font-display text-xl font-bold text-ink">Diğer segmentler</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/segmentler/${o.slug}`}
              className="group rounded-card bg-surface p-5 shadow-sm ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-sage/35"
            >
              <p className="font-display text-[0.9375rem] font-bold text-ink">{o.name}</p>
              <p className="mt-1.5 text-sm text-muted">{o.short}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sage-ink">
                İncele
                <ArrowRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.4}
                  aria-hidden
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
