import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { IconBox } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Roles } from "@/components/sections/Roles";
import { ProductStory } from "@/components/sections/ProductStory";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  CAPABILITIES,
  CAPABILITY_STAGES,
  MODULES,
  STAGE_LABEL,
  capabilityTitle,
  type CapabilityStage,
} from "@/content/product";
import { PRICING } from "@/content/pricing";

/**
 * Kolonun GORUNUMU burada, ICERIGI degil (B-040). Kalem listesi ve kademe
 * basligi `product.ts` → CAPABILITIES + STAGE_LABEL'dan gelir; bu sayfa
 * kademelere yalnizca bir ton atar. Sabitte olmayan kalem buraya yazilmaz.
 */
const STAGE_TONE: Record<CapabilityStage, "sage" | "amber" | "neutral"> = {
  simdi: "sage",
  yolda: "amber",
  sonra: "neutral",
};

export const metadata: Metadata = {
  title: "Özellikler",
  description:
    "Takvim ve rezervasyon, grup dersleri, üyelik ve paket, Üye 360, finans ve ciro, çok şube cockpit, antrenör performansı, diyetisyen modülü, raporlar ve bildirimler. Alpfit Plus'ın on modülü.",
  alternates: { canonical: "/ozellikler" },
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Özellikler", href: "/ozellikler" }]}
        label="Özellikler"
        title={
          <>
            On modül, <span className="text-gradient-sage">tek ürün</span>
          </>
        }
        lead="Alpfit Plus bir takvim uygulaması değil. Randevudan tahsilata, yoklamadan beslenme programına kadar kulübün günlük işletmesinin tamamını taşır. Hepsi şube fiyatına dâhildir, modül kısıtı yoktur."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/demo" size="lg">
            Demo İste
          </Button>
          <Button href="/fiyat" variant="secondary" size="lg">
            Fiyatı gör
          </Button>
        </div>
      </PageHero>

      <Roles />

      <Section tone="canvas">
        <SectionHead
          label="Modül modül"
          title="Her modülün ne yaptığı"
          lead={`Aşağıdaki listede ürünün bugün yaptıkları var. Yolda olanları ve yol haritasındakileri ayrıca yazıyoruz, karıştırmıyoruz.`}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {MODULES.map((m, i) => (
            <Reveal key={m.key} delay={(i % 2) * 60}>
              <article className="h-full rounded-card bg-surface p-7 shadow-sm ring-1 ring-line">
                <div className="flex items-start gap-4">
                  <IconBox name={m.icon} size="md" />
                  <div>
                    <h2 className="font-display text-xl font-bold text-ink">{m.title}</h2>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{m.blurb}</p>
                  </div>
                </div>
                <ul className="mt-5 grid gap-2.5 border-t border-line pt-5">
                  {m.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[0.9375rem] text-ink">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage-wash-2 text-sage-ink">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <ProductStory />

      <Section tone="soft">
        <SectionHead
          align="center"
          label="Yol haritası"
          title="Ne var, ne yolda, ne planlı"
          lead="Bu üç kolonu ayrı tutuyoruz. Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {CAPABILITY_STAGES.map((stage) => {
            const tone = STAGE_TONE[stage];
            return (
              <Reveal key={stage}>
                <div
                  className={
                    "h-full rounded-card p-7 ring-1 " +
                    (tone === "sage"
                      ? "bg-sage-wash ring-sage/25"
                      : tone === "amber"
                        ? "bg-amber-wash ring-amber/20"
                        : "bg-surface ring-line")
                  }
                >
                  <p
                    className={
                      "font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] " +
                      (tone === "sage"
                        ? "text-sage-ink"
                        : tone === "amber"
                          ? "text-amber"
                          : "text-faint")
                    }
                  >
                    {STAGE_LABEL[stage]}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {CAPABILITIES[stage].map((c) => (
                      <li key={c.id} className="text-[0.9375rem] leading-snug text-ink">
                        {capabilityTitle(c)}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-faint">
          {PRICING.trialDays} gün ücretsiz deneme demo verisiyle yürür, kredi kartı istemiyoruz.
        </p>
      </Section>

      <FinalCta />
    </>
  );
}
