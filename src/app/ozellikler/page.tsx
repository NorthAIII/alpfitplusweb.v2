import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { IconBox } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Roles } from "@/components/sections/Roles";
import { ProductTour } from "@/components/sections/ProductTour";
import { FinalCta } from "@/components/sections/FinalCta";
import { MODULES } from "@/content/product";
import { PRICING } from "@/content/pricing";

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

      <ProductTour />

      <Section tone="soft">
        <SectionHead
          align="center"
          label="Yol haritası"
          title="Ne var, ne yolda, ne planlı"
          lead="Bu üç kolonu ayrı tutuyoruz. Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            {
              tag: "Bugün var",
              tone: "sage" as const,
              items: [
                "Takvim, rezervasyon ve bekleme listesi",
                "Grup dersleri, kontenjan ve yoklama",
                "Üyelik, seans paketi ve kalan hak",
                "Finans, ciro, kalan borç ve iade",
                "Çok şube cockpit ve yetki şablonları",
                "Antrenör performansı",
                "Diyetisyen modülü",
                "Raporlar, XLSX, CSV ve PDF",
                "Push bildirim ve toplu duyuru",
                "Üye ve antrenör mobil uygulaması",
              ],
            },
            {
              tag: "Yolda",
              tone: "amber" as const,
              items: [
                "Kampanya ve pazarlama derinleşmesi",
                "Gelişmiş raporlama",
                "Churn ve risk paneli",
              ],
            },
            {
              tag: "Yol haritasında",
              tone: "neutral" as const,
              items: [
                "Online ödeme",
                "QR ve turnike ile giriş",
                "Apple Health ve Google Fit",
                "Yapay zekâ destekli gelişim ve beslenme analizi",
                "Kurumsal üyelik",
              ],
            },
          ].map((col) => (
            <Reveal key={col.tag}>
              <div
                className={
                  "h-full rounded-card p-7 ring-1 " +
                  (col.tone === "sage"
                    ? "bg-sage-wash ring-sage/25"
                    : col.tone === "amber"
                      ? "bg-amber-wash ring-amber/20"
                      : "bg-surface ring-line")
                }
              >
                <p
                  className={
                    "font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] " +
                    (col.tone === "sage"
                      ? "text-sage-ink"
                      : col.tone === "amber"
                        ? "text-amber"
                        : "text-faint")
                  }
                >
                  {col.tag}
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.items.map((it) => (
                    <li key={it} className="text-[0.9375rem] leading-snug text-ink">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-faint">
          {PRICING.trialDays} gün ücretsiz deneme demo verisiyle yürür, kredi kartı istemiyoruz.
        </p>
      </Section>

      <FinalCta />
    </>
  );
}
