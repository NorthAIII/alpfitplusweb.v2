import { ArrowRight, X } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CHAOS } from "@/content/product";

export function Problem() {
  return (
    <Section tone="canvas" id="sorun">
      <SectionHead
        label="Bugün nasıl yönetiliyor"
        title={
          <>
            Kulübünüzün asıl rakibi bir yazılım değil,{" "}
            <span className="text-gradient-sage">dağınıklık</span>
          </>
        }
        lead="Her araç tek başına çalışıyor ama hiçbiri birbiriyle konuşmuyor. Sonuç: çift kayıt, kaçan randevu, ay sonu mutabakatı ve görünmeyen boş kapasite."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CHAOS.map((c, i) => (
          <Reveal key={c.tool} delay={i * 70}>
            <div className="group relative h-full overflow-hidden rounded-card bg-surface p-6 shadow-sm ring-1 ring-line">
              <span
                className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-neg-wash opacity-70 blur-xl"
                aria-hidden
              />
              <div className="relative">
                <span className="inline-grid size-9 place-items-center rounded-[10px] bg-neg-wash text-neg ring-1 ring-neg/15">
                  <X className="size-4.5" strokeWidth={2.2} aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{c.tool}</h3>
                <p className="mt-1 text-sm text-faint">{c.use}</p>
                <p className="mt-4 border-t border-line pt-4 text-[0.9375rem] leading-relaxed text-muted">
                  {c.pain}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-10 flex flex-col items-start gap-4 rounded-card bg-linear-to-br from-sage-wash to-sage-wash-2 p-7 ring-1 ring-sage/20 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-2xl font-display text-lg font-bold leading-snug text-sage-ink sm:text-xl">
            Bunların hepsi çalışıyor. Sorun şu ki hiçbiri birbiriyle konuşmuyor.
          </p>
          <a
            href="#cozum"
            className="inline-flex shrink-0 items-center gap-2 font-display text-sm font-bold text-sage-deep underline-offset-4 hover:underline"
          >
            Peki alternatifi ne
            <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
