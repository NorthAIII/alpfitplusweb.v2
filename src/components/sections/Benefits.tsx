import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { IconBox } from "@/components/ui/Icon";
import { BENEFITS } from "@/content/product";

export function Benefits() {
  return (
    <Section tone="canvas" id="fayda">
      <SectionHead
        label="Salona ne kazandırır"
        title={
          <>
            Yazılım değişince <span className="text-gradient-sage">işletme değişir</span>
          </>
        }
        lead="Alpfit Plus bir takvim uygulaması değil. Kulübün para, kapasite ve üye tarafına aynı anda dokunur."
      />

      <div className="mt-12 grid gap-px overflow-hidden rounded-card bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} delay={i * 45}>
            <div className="group h-full bg-surface p-6 transition-colors duration-300 hover:bg-sage-wash/45">
              <IconBox name={b.icon} size="md" />
              <h3 className="mt-4 font-display text-[1.0625rem] font-bold leading-snug text-ink">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
