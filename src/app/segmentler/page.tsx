import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { SegmentsGrid } from "@/components/sections/SegmentsGrid";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Segmentler",
  description:
    "Reformer ve pilates stüdyoları, boks ve dövüş kulüpleri, CrossFit box'ları ve çok şubeli zincirler. Her segmentin kendi akışı için Alpfit Plus.",
  alternates: { canonical: "/segmentler" },
};

const GAP = [
  {
    camp: "Turnike ve donanım ağırlıklı ürünler",
    problem: "Bir reformer stüdyosu için gereksiz ağır. Cihaz almadan başlayamıyorsunuz.",
  },
  {
    camp: "Yalnız pilates ve reformer'a odaklı ürünler",
    problem: "Boks ve CrossFit tarafı kapsam dışı. Kulüp iki dikeye birden hizmet veremiyor.",
  },
  {
    camp: "Spor okulu ve kulüp yazılımları",
    problem: "Çocuk, veli ve yoklama odaklı. Butik grup dersi akışına birebir oturmuyor.",
  },
];

export default function SegmentsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Segmentler", href: "/segmentler" }]}
        label="Segmentler"
        title={
          <>
            Her kulübün akışı farklı,{" "}
            <span className="text-gradient-sage">ürün aynı</span>
          </>
        }
        lead="Reformer stüdyosunun derdi kapasite ve seans hakkı. Boks kulübünün derdi yoklama ve aidat. Zincirin derdi şube karşılaştırması. Alpfit Plus üçünü de aynı üründe karşılar."
      />

      <SegmentsGrid />

      <Section tone="canvas">
        <SectionHead
          label="Pazardaki boşluk"
          title="Neden üçünü birden yapan bir ürün yok"
          lead="Türkiye'deki dokuz yerli ürünün ürün sayfalarını tek tek okuduk. Üç kampa ayrılıyorlar ve hiçbiri üçünü birden hedeflemiyor."
        />
        <div className="mt-10 flex flex-col gap-4">
          {GAP.map((g, i) => (
            <Reveal key={g.camp} delay={i * 70}>
              <div className="flex flex-col gap-2 rounded-card bg-surface p-6 shadow-sm ring-1 ring-line sm:flex-row sm:items-center sm:gap-8">
                <p className="font-display text-[0.9375rem] font-bold text-ink sm:w-80 sm:shrink-0">
                  {g.camp}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-muted">{g.problem}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 rounded-card bg-linear-to-br from-sage-wash to-sage-wash-2 px-7 py-6 font-display text-lg font-bold leading-snug text-sage-ink ring-1 ring-sage/20">
            Reformer, dövüş sporları ve CrossFit'i aynı üründe, donanım zorunluluğu olmadan
            hedefleyen bir ürün bulamadık. Alpfit Plus bu boşluk için tasarlandı.
          </p>
        </Reveal>
      </Section>

      <FinalCta />
    </>
  );
}
