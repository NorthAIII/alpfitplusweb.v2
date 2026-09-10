import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { IconBox } from "@/components/ui/Icon";
import { MODULES } from "@/content/product";

export function Modules() {
  const featured = MODULES.filter((m) => m.featured);
  const rest = MODULES.filter((m) => !m.featured);

  return (
    <Section tone="canvas" id="moduller">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHead
          label="Modüller"
          title={
            <>
              Kulübün <span className="text-gradient-sage">tamamı</span>, parça parça değil
            </>
          }
          lead="On modül tek üründe. Hepsi şube fiyatına dâhil, modül kısıtı yok."
        />
        <Link
          href="/ozellikler"
          className="inline-flex shrink-0 items-center gap-2 font-display text-sm font-bold text-sage-ink underline-offset-4 hover:underline"
        >
          Tüm özellikleri gör
          <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
        </Link>
      </div>

      {/* one cikan bes modul */}
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((m, i) => (
          <Reveal key={m.key} delay={i * 60}>
            <article className="group relative h-full overflow-hidden rounded-card bg-surface p-6 shadow-sm ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-sage/35">
              <span
                className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-sage-wash opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative">
                <IconBox name={m.icon} size="md" />
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{m.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{m.blurb}</p>
                <ul className="mt-5 flex flex-col gap-2 border-t border-line pt-4">
                  {m.points.slice(0, 4).map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-muted">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-sage" strokeWidth={2.6} aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* kalan moduller — kompakt */}
      <Reveal>
        <div className="mt-5 grid gap-4 rounded-card bg-surface-2 p-6 ring-1 ring-line sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {rest.map((m) => (
            <div key={m.key} className="flex gap-3 lg:flex-col lg:gap-2.5">
              <IconBox name={m.icon} size="sm" />
              <div>
                <h3 className="font-display text-[0.9375rem] font-bold text-ink">{m.title}</h3>
                <p className="mt-1 text-sm leading-snug text-muted">{m.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
