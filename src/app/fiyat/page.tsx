import type { Metadata } from "next";
import { Check, Info, X } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PriceCalculator } from "@/components/sections/PriceCalculator";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { FAQ_PRICING } from "@/content/faq";
import {
  INCLUDED,
  PRICING,
  monthlyFor,
  annualPrepayFor,
  monthlyPathYearOneFor,
  trySavingsPct,
  rivalAppStartFor,
  RIVAL_MULTI_BRANCH,
  tl,
} from "@/content/pricing";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Fiyat",
  description: `Şube başına ${PRICING.firstBranch} TL + KDV / ay. 2. şubeden itibaren ${PRICING.extraBranch} TL. Paket yok, eğitmen limiti yok, mobil uygulama dâhil. ${PRICING.trialDays} gün ücretsiz deneme.`,
  alternates: { canonical: "/fiyat" },
};

const NOT_INCLUDED = [
  "Online kart ile tahsilat (yol haritasında)",
  "Turnike, QR ve parmak izi donanımı (yol haritasında)",
  "Markalı, mağazada ayrı yayınlanan özel mobil uygulama",
  "Kulübünüz için web sitesi yapımı",
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_PRICING.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function PricingPage() {
  const rows = [1, 2, 3, 5, 6];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        crumbs={[{ label: "Fiyat", href: "/fiyat" }]}
        label="Fiyat"
        title={
          <>
            Şube başına tek fiyat.{" "}
            <span className="text-gradient-sage">Kademe yok.</span>
          </>
        }
        lead={`İlk şube ${tl(PRICING.firstBranch)} ₺, ikinci şubeden itibaren her şube ${tl(PRICING.extraBranch)} ₺. Aylık, KDV hariç. Eğitmen ve üye limiti yoktur, mobil uygulama için ayrı ücret almıyoruz.`}
      />

      <Section tone="canvas" size="sm">
        <div className="mx-auto max-w-2xl">
          <PriceCalculator />
        </div>
      </Section>

      {/* dahil / dahil degil */}
      <Section tone="soft">
        <SectionHead
          align="center"
          label="Kapsam"
          title="Neyin dâhil olduğu, neyin olmadığı"
          lead="İkisini de yazıyoruz. Demoda sürpriz çıkmasın."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-card bg-surface p-7 shadow-sm ring-1 ring-line">
              <h3 className="font-display text-lg font-bold text-ink">Her şubede dâhil</h3>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {INCLUDED.map((x) => (
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
              <h3 className="font-display text-lg font-bold text-ink">Bugün dâhil değil</h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {NOT_INCLUDED.map((x) => (
                  <li key={x} className="flex items-start gap-2.5 text-[0.9375rem] text-muted">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-surface-2 text-faint">
                      <X className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-lg bg-surface-2 px-4 py-3.5 text-sm leading-relaxed text-faint">
                Yol haritasındaki kalemler çıktığında mevcut müşterilere ayrı bir üst pakette
                satılmaz. Liste fiyatı artabilir, o gün mevcut müşteri eski fiyatında kalır.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* sube tablosu */}
      <Section tone="canvas">
        <SectionHead
          label="Şube şube"
          title="Şube sayısına göre ne ödersiniz"
          lead="Aşağıdaki tüm rakamlar KDV hariçtir. Yıllık peşin kolonunda kurulum ücreti alınmaz."
        />
        <Reveal>
          <div className="mt-10 overflow-x-auto rounded-card bg-surface shadow-sm ring-1 ring-line">
            <table className="w-full min-w-[44rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-surface-2">
                  {["Şube", "Aylık", "Aylık ödeme, ilk yıl", "Yıllık peşin, ilk yıl", "Avantaj"].map(
                    (h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-5 py-3.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-faint"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((n) => (
                  <tr key={n} className="transition-colors hover:bg-sage-wash/40">
                    <th scope="row" className="px-5 py-4 font-display text-sm font-bold text-ink">
                      {n} şube
                    </th>
                    <td className="px-5 py-4 text-sm tabnum text-ink">{tl(monthlyFor(n))} ₺</td>
                    <td className="px-5 py-4 text-sm tabnum text-muted">
                      {tl(monthlyPathYearOneFor(n))} ₺
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold tabnum text-sage-ink">
                      {tl(annualPrepayFor(n))} ₺
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-sage-wash px-2.5 py-1 text-xs font-medium tabnum text-sage-ink ring-1 ring-sage/25">
                        %{trySavingsPct(n)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* rakip kiyasi */}
        <Reveal>
          <div className="mt-8 rounded-card bg-surface p-7 shadow-sm ring-1 ring-line">
            <h3 className="font-display text-lg font-bold text-ink">
              Çok şubede aradaki fark
            </h3>
            <p className="mt-2 max-w-3xl text-[0.9375rem] leading-relaxed text-muted">
              Mobil uygulamalı çözümlerde şube sayısı arttıkça aylık tutar hızla büyüyor.
              Aşağıdaki karşılaştırma, rakibin kendi paketler sayfasında yayınladığı liste
              fiyatlarından bizim yaptığımız hesaptır.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[38rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    {["Şube", "Alpfit Plus / ay", "OxyFitClub App Start / ay", "Fark"].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="pb-3 pr-5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-faint"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {RIVAL_MULTI_BRANCH.rows.map((r) => {
                    const ours = monthlyFor(r.branches);
                    const theirs = rivalAppStartFor(r.branches);
                    return (
                      <tr key={r.branches}>
                        <th scope="row" className="py-4 pr-5 text-sm font-medium text-ink">
                          {r.label}
                        </th>
                        <td className="py-4 pr-5 font-display text-sm font-bold tabnum text-sage-ink">
                          {tl(ours)} ₺
                        </td>
                        <td className="py-4 pr-5 text-sm tabnum text-muted">{tl(theirs)} ₺</td>
                        <td className="py-4 pr-5">
                          <span className="inline-flex rounded-full bg-sage-wash px-2.5 py-1 text-xs font-medium tabnum text-sage-ink ring-1 ring-sage/25">
                            %{Math.round(((theirs - ours) / theirs) * 100)} ucuz
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-faint">
              <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} aria-hidden />
              <span>
                {RIVAL_MULTI_BRANCH.note} Bu bir teklif karşılaştırması değildir, rakibin size
                vereceği fiyatı bilemeyiz. Kaynak: {RIVAL_MULTI_BRANCH.source}
              </span>
            </p>
          </div>
        </Reveal>
      </Section>

      <Faq
        items={FAQ_PRICING}
        tone="soft"
        label="Fiyat SSS"
        title="Fiyatla ilgili sorular"
        lead={`Yayınlanan her rakam KDV hariçtir. ${SITE.name} paket veya kademe kullanmaz.`}
      />

      <FinalCta
        title="Fiyatı gördünüz, ürünü de görün"
        lead="20 dakikalık demoda kendi kulübünüzün akışı üzerinden ilerler, hangi modülün işinize yaradığını birlikte konuşuruz."
      />
    </>
  );
}
