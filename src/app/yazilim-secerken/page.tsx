import type { Metadata } from "next";
import { ArrowRight, Check, Info, Minus } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { FinalCta } from "@/components/sections/FinalCta";
import { ARASTIRMA, BAND, QUESTIONS, NOT_US } from "@/content/karsilastirma";
import { PRICING, tl } from "@/content/pricing";

export const metadata: Metadata = {
  title: "Spor Kulübü Yazılımı Seçerken",
  description:
    "Spor salonu yönetim programı ararken hangi soruları sormalı? Yayınlanmış fiyat bandı, on bir soru ve Alpfit Plus'ın her birine cevabı.",
  alternates: { canonical: "/yazilim-secerken" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUESTIONS.map((q) => ({
    "@type": "Question",
    name: q.q,
    acceptedAnswer: { "@type": "Answer", text: q.ours },
  })),
};

export default function ChoosingPage() {
  const farks = QUESTIONS.filter((q) => q.weight === "fark");
  const girisler = QUESTIONS.filter((q) => q.weight === "giriş şartı");

  // Bant uzerindeki konumlar ELLE yazilmaz, sayilardan hesaplanir. Elle
  // yazildiginda fiyat degistigi gun isaret yanlis yeri gosterir ve bunu
  // kimse fark etmez.
  const span = BAND.appHigh - BAND.low;
  const pos = (v: number) => ((v - BAND.low) / span) * 100;
  const clusterLeft = pos(BAND.clusterLow);
  const clusterWidth = pos(BAND.clusterHigh) - clusterLeft;
  const oursLeft = pos(BAND.ours);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PageHero
        crumbs={[{ label: "Yazılım seçerken", href: "/yazilim-secerken" }]}
        label="Karar rehberi"
        title={
          <>
            Kulübünüze yazılım ararken{" "}
            <span className="text-gradient-sage">neyi sormalı</span>
          </>
        }
        lead={`${ARASTIRMA.scanned} ürünün kendi sayfalarını okuduk. Aşağıdaki sorular o araştırmadan çıktı. Her birinin altında kendi cevabımızı yazdık; başka ürünler hakkında iddia kurmuyoruz, onu satıcısına sorun.`}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/demo" size="lg">
            Demo İste
            <ArrowRight className="size-4.5" strokeWidth={2.2} aria-hidden />
          </Button>
          <Button href="/fiyat" variant="secondary" size="lg">
            Fiyatımızı gör
          </Button>
        </div>
      </PageHero>

      {/* fiyat bandi */}
      <Section tone="soft">
        <SectionHead
          label="Piyasa"
          title="Fiyatlar nerede duruyor"
          lead={ARASTIRMA.note}
        />

        <Reveal>
          <div className="mt-12 rounded-lg bg-surface p-7 shadow-sm ring-1 ring-line sm:p-9">
            <p className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-faint">
              Tek şube · aylık · KDV dâhile çevrilmiş · {ARASTIRMA.date}
            </p>

            {/* band cizgisi */}
            <div className="relative mt-10 mb-16">
              <div className="h-2.5 rounded-full bg-linear-to-r from-surface-2 via-sage-wash-2 to-surface-2" />
              {/* yogunlasma araligi */}
              <div
                className="absolute top-0 h-2.5 rounded-full bg-linear-to-r from-sage/45 to-sage/70"
                style={{ left: `${clusterLeft}%`, width: `${clusterWidth}%` }}
                aria-hidden
              />
              {/* bizim konum */}
              <div
                className="absolute -top-1 flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${oursLeft}%` }}
              >
                <span className="grid size-4.5 place-items-center rounded-full bg-sage ring-4 ring-surface" aria-hidden />
                <span className="mt-2 whitespace-nowrap rounded-lg bg-sage-wash px-2.5 py-1 text-xs font-semibold text-sage-ink ring-1 ring-sage/30">
                  Alpfit Plus {tl(BAND.ours)} ₺
                </span>
              </div>
              {/* uc etiketleri */}
              <span className="absolute -bottom-8 left-0 text-xs text-faint">
                {tl(BAND.low)} ₺
              </span>
              <span className="absolute -bottom-8 right-0 text-right text-xs text-faint">
                {tl(BAND.appHigh)} ₺
              </span>
            </div>

            <dl className="grid gap-5 border-t border-line pt-7 sm:grid-cols-3">
              {[
                ["Fiyatların yoğunlaştığı aralık", `${tl(BAND.clusterLow)} – ${tl(BAND.clusterHigh)} ₺`, "Butik kulüplerin çoğu bu bandın içinde"],
                ["Mobil uygulamalı üst uç", `${tl(BAND.appHigh)} ₺`, "Mobil uygulamanın ayrı paket olduğu kurulumlar"],
                ["Alpfit Plus", `${tl(BAND.ours)} ₺`, `${tl(BAND.oursExVat)} ₺ + KDV, mobil uygulama dâhil`],
              ].map(([k, v, n]) => (
                <div key={k}>
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="mt-1.5 font-display text-2xl font-extrabold tabnum text-ink">{v}</dd>
                  <p className="mt-1 text-xs leading-snug text-faint">{n}</p>
                </div>
              ))}
            </dl>

            <p className="mt-7 flex items-start gap-2 border-t border-line pt-5 text-xs leading-relaxed text-faint">
              <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} aria-hidden />
              <span>
                Band, ürünlerin kendi sayfalarında {ARASTIRMA.date} tarihinde yayınlanmış liste
                fiyatlarından hesaplandı ve karşılaştırılabilmesi için tek şube, aylık ve KDV
                dâhile çevrildi. Ürün adı yazmıyoruz. Fiyatlar o tarihten sonra değişmiş
                olabilir; bağlayıcı olan, ilgili firmanın size vereceği tekliftir.
              </span>
            </p>
          </div>
        </Reveal>
      </Section>

      {/* sorular */}
      <Section tone="canvas">
        <SectionHead
          label="Sorulacaklar"
          title="Hangi satıcıyla konuşursanız konuşun, bunları sorun"
          lead="Sağ sütun bizim cevabımız. Aynı soruları başka ürünlere de sorun, cevapları yan yana koyun."
        />

        <div className="mt-12 flex flex-col gap-4">
          {farks.map((q, i) => (
            <Reveal key={q.q} delay={i * 45}>
              <div className="grid gap-px overflow-hidden rounded-card bg-line ring-1 ring-line md:grid-cols-2">
                <div className="bg-surface p-6">
                  <h3 className="font-display text-[1.0625rem] font-bold leading-snug text-ink">
                    {q.q}
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{q.why}</p>
                </div>
                <div className="bg-sage-wash p-6">
                  <p className="flex items-center gap-2 font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-sage-ink">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    Bizim cevabımız
                  </p>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink/80">{q.ours}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* giris sartlari */}
        <Reveal>
          <div className="mt-8 rounded-card bg-surface-2 p-7 ring-1 ring-line">
            <h3 className="font-display text-lg font-bold text-ink">
              Bunlar fark değil, giriş şartı
            </h3>
            <p className="mt-2 max-w-3xl text-[0.9375rem] leading-relaxed text-muted">
              Aşağıdakileri de sorun ama cevabın “evet” gelmesi bir üstünlük göstergesi
              değil. Türkiye'de satılan ciddi ürünlerin çoğunda zaten var.
            </p>
            <div className="mt-6 flex flex-col gap-5">
              {girisler.map((q) => (
                <div key={q.q} className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                  <p className="font-display text-[0.9375rem] font-bold text-ink sm:w-80 sm:shrink-0">
                    {q.q}
                  </p>
                  <p className="text-[0.9375rem] leading-relaxed text-muted">{q.ours}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ne degiliz */}
      <Section tone="soft">
        <SectionHead
          align="center"
          label="Dürüstlük"
          title="Alpfit Plus ne değil"
          lead="Ürünü herkese satmaya çalışmıyoruz. Aşağıdakilerden biri sizin önceliğinizse başka bir ürün daha doğru olabilir."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NOT_US.map((n, i) => (
            <Reveal key={n.t} delay={i * 55}>
              <div className="h-full rounded-card bg-surface p-6 shadow-sm ring-1 ring-line">
                <span className="inline-grid size-9 place-items-center rounded-[10px] bg-surface-2 text-faint ring-1 ring-line">
                  <Minus className="size-4.5" strokeWidth={2.4} aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-[1.0625rem] font-bold leading-snug text-ink">
                  {n.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{n.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mx-auto mt-8 max-w-3xl text-center text-[0.9375rem] leading-relaxed text-muted">
            Bunları yazıyoruz çünkü demoya girip yarısında “bu bizde yok” demek ikimizin de
            vaktini alıyor. Listedekiler sizin için engel değilse{" "}
            <a href="/demo" className="font-medium text-sage-ink underline underline-offset-4">
              konuşalım
            </a>
            .
          </p>
        </Reveal>
      </Section>

      <FinalCta
        title="Sorularınızı bize de sorun"
        lead={`20 dakikalık görüşmede bu sayfadaki her soruyu tekrar sorabilirsiniz. ${PRICING.trialDays} gün ücretsiz deneme var, kredi kartı istemiyoruz.`}
      />
    </>
  );
}
