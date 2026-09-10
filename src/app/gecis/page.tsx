import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check, X } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { IconBox } from "@/components/ui/Icon";
import { FinalCta } from "@/components/sections/FinalCta";
import { GECIS_FEARS, GECIS_SOURCES, GECIS_SCOPE, GECIS_WEEK } from "@/content/gecis";
import { PRICING } from "@/content/pricing";

export const metadata: Metadata = {
  title: "Geçiş ve Veri Aktarımı",
  description:
    "Üye listenizi Excel'den, defterden ya da başka bir yazılımdan taşımayı biz yapıyoruz. İki sistemi birden kullanmıyorsunuz. Geçişin ilk haftası adım adım.",
  alternates: { canonical: "/gecis" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GECIS_FEARS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function MigrationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PageHero
        crumbs={[{ label: "Geçiş", href: "/gecis" }]}
        label="Geçiş ve veri aktarımı"
        title={
          <>
            Yazılım değiştirmenin asıl maliyeti lisans değil,{" "}
            <span className="text-gradient-sage">taşınma</span>
          </>
        }
        lead="Kulüp sahipleri bize genelde “sistemimiz kötü” demiyor. “Alıştık” diyor. Asıl engel ürün değil, 800 üyenin nasıl taşınacağı korkusu. Bu sayfa o korkuya cevap veriyor."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/demo" size="lg">
            Taşımayı konuşalım
            <ArrowRight className="size-4.5" strokeWidth={2.2} aria-hidden />
          </Button>
          <Button href="/fiyat" variant="secondary" size="lg">
            Fiyatı gör
          </Button>
        </div>
      </PageHero>

      {/* uc korku */}
      <Section tone="soft">
        <SectionHead
          label="Üç soru"
          title="Her görüşmede aynı üç şey soruluyor"
          lead="Cevapları burada. Demoda tekrar sorabilirsiniz, aynı cevabı alırsınız."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {GECIS_FEARS.map((f, i) => (
            <Reveal key={f.q} delay={i * 70}>
              <div className="h-full rounded-card bg-surface p-7 shadow-sm ring-1 ring-line">
                <span className="font-display text-4xl font-extrabold text-sage-wash-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink">{f.q}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{f.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* nereden tasiniyor */}
      <Section tone="canvas">
        <SectionHead
          label="Nereden taşınıyor"
          title="Veriniz nerede duruyorsa oradan alıyoruz"
          lead="Hepsini görüyoruz. Hangisi olduğu taşımanın zorluğunu değiştirir ama kimin yapacağını değiştirmez, taşımayı biz yapıyoruz."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {GECIS_SOURCES.map((s, i) => (
            <Reveal key={s.key} delay={i * 60}>
              <div className="flex h-full gap-4 rounded-card bg-surface p-6 shadow-sm ring-1 ring-line">
                <IconBox name={s.icon} size="md" />
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-[1.0625rem] font-bold text-ink">{s.title}</h3>
                    <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[0.6875rem] font-medium text-faint">
                      {s.effort}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* kapsam */}
      <Section tone="soft">
        <SectionHead
          align="center"
          label="Kapsam"
          title="Ne taşınıyor, ne taşınmıyor"
          lead="İkisini de yazıyoruz. Taşıma günü sürpriz çıkmasın."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-card bg-surface p-7 shadow-sm ring-1 ring-line">
              <h3 className="font-display text-lg font-bold text-ink">Taşınıyor</h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {GECIS_SCOPE.inside.map((x) => (
                  <li key={x} className="flex items-start gap-2.5 text-[0.9375rem] text-ink">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage-wash-2 text-sage-ink">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="h-full rounded-card bg-surface p-7 shadow-sm ring-1 ring-line">
              <h3 className="font-display text-lg font-bold text-ink">Taşınmıyor</h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {GECIS_SCOPE.outside.map((x) => (
                  <li key={x} className="flex items-start gap-2.5 text-[0.9375rem] text-muted">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-surface-2 text-faint">
                      <X className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-lg bg-surface-2 px-4 py-3.5 text-sm leading-relaxed text-faint">
                Listede olmayan bir veriyi taşımak istiyorsanız demoda konuşuruz. Yapılabilir
                olup olmadığını orada söyleriz, taşıma gününde değil.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ilk hafta */}
      <section className="relative bg-ink-deep py-20 text-canvas sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-55 bg-[radial-gradient(50%_55%_at_25%_0%,rgba(116,179,111,.2),transparent_66%)]"
          aria-hidden
        />
        <Container size="wide" className="relative">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHead
                tone="light"
                label="Geçiş haftası"
                title="Gün gün ne oluyor"
                lead="Tarihi birlikte belirliyoruz. O güne kadar mevcut düzeninizle çalışmaya devam ediyorsunuz."
              />
              <div className="relative mt-8 hidden overflow-hidden rounded-lg shadow-lg ring-1 ring-white/10 lg:block">
                <Image
                  src="/foto/cok-subeli-zincir-sm.webp"
                  alt="Sade ve aydınlık bir stüdyo iç mekânı"
                  width={800}
                  height={534}
                  sizes="40vw"
                  className="h-48 w-full object-cover opacity-80"
                />
              </div>
              <Button href="/demo" size="lg" className="mt-8 w-full sm:w-auto">
                Geçiş planını konuşalım
              </Button>
            </div>

            <ol className="relative flex flex-col">
              <span
                className="absolute bottom-6 left-[1.4375rem] top-6 w-px bg-linear-to-b from-sage/45 via-white/15 to-transparent"
                aria-hidden
              />
              {GECIS_WEEK.map((s, i) => (
                <Reveal as="li" key={s.day} delay={i * 60} className="relative flex gap-5 pb-9 last:pb-0">
                  <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl bg-white/8 font-display text-sm font-extrabold text-sage-br ring-1 ring-white/12">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="font-display text-lg font-bold text-canvas">{s.day}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-canvas/65">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <Section tone="canvas" size="sm">
        <Reveal>
          <div className="rounded-card bg-linear-to-br from-sage-wash to-sage-wash-2 px-7 py-8 ring-1 ring-sage/20 sm:px-10 sm:py-10">
            <h2 className="font-display text-xl font-bold text-sage-ink sm:text-2xl">
              Taşımadan önce {PRICING.trialDays} gün deneyebilirsiniz
            </h2>
            <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink/75">
              Deneme demo verisiyle yürür. Gerçek verinize dokunulmaz, kurulum ücreti alınmaz ve
              kredi kartı istemiyoruz. Taşıma yalnızca sözleşmeden sonra, üzerinde anlaştığımız
              günde yapılır.
            </p>
          </div>
        </Reveal>
      </Section>

      <FinalCta
        title="Taşımayı biz yapıyoruz, siz işinize bakın"
        lead="20 dakikalık görüşmede elinizdeki listeye bakıp taşımanın nasıl ilerleyeceğini birlikte netleştiriyoruz."
      />
    </>
  );
}
