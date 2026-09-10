import { Check } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PriceCalculator } from "./PriceCalculator";
import { INCLUDED, PRICING, tl } from "@/content/pricing";

export function PricingBlock() {
  return (
    <Section tone="canvas" id="fiyat">
      <SectionHead
        align="center"
        label="Şeffaf fiyat"
        title={
          <>
            Paket yok, kademe yok, <span className="text-gradient-sage">sürpriz yok</span>
          </>
        }
        lead="Tek fiyat, şube başına. Eğitmen limiti, üye limiti ve modül kısıtı yoktur. Mobil uygulama için ayrı ücret almıyoruz."
      />

      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
        <Reveal>
          <div>
            <h3 className="font-display text-xl font-bold text-ink">Her şubede dâhil olanlar</h3>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {INCLUDED.map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-[0.9375rem] text-ink">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage-wash-2 text-sage-ink">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {x}
                </li>
              ))}
            </ul>

            <dl className="mt-8 divide-y divide-line overflow-hidden rounded-card bg-surface ring-1 ring-line">
              {[
                ["İlk şube", `${tl(PRICING.firstBranch)} ₺ / ay`],
                ["2. şubeden itibaren", `${tl(PRICING.extraBranch)} ₺ / ay (%${PRICING.extraBranchDiscountPct} indirim)`],
                ["Kurulum, şube başına", `${tl(PRICING.setupPerBranch)} ₺, yıllık peşinde ücretsiz`],
                ["Ücretsiz deneme", `${PRICING.trialDays} gün, demo verisiyle`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="text-right font-display text-sm font-bold tabnum text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <PriceCalculator />
        </Reveal>
      </div>
    </Section>
  );
}
