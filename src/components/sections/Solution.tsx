import { ArrowRight, Check, Database, Monitor, Smartphone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LogoMark } from "@/components/layout/Logo";

const SOURCES = ["Randevu ve iptal", "Grup dersi kaydı", "Satış ve tahsilat", "Yoklama ve ölçüm", "Üye listesi"];
const OUTCOMES = [
  "Anlık ve doğru ciro",
  "Gerçek doluluk oranı",
  "Tek üye kaydı, çift kayıt yok",
  "Şube karşılaştırması",
  "Riskteki üye listesi",
];

export function Solution() {
  return (
    <section id="cozum" className="relative overflow-hidden bg-ink-deep py-20 text-canvas sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(52%_60%_at_50%_0%,rgba(116,179,111,.24),transparent_68%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-linegrid opacity-[0.045]" aria-hidden />

      <Container size="wide" className="relative">
        <SectionHead
          tone="light"
          align="center"
          label="Çözüm"
          title={
            <>
              Dağınık araçların yerine{" "}
              <span className="bg-linear-to-r from-sage-br to-sage bg-clip-text text-transparent">
                tek doğru veri kaynağı
              </span>
            </>
          }
          lead="Kulübünüzde olup biten her şey aynı yere yazılır. Yönetim, antrenör, diyetisyen ve üye aynı gerçeği görür."
        />

        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-[1fr_auto_1.15fr_auto_1fr] lg:gap-5">
          {/* kaynaklar */}
          <Reveal>
            <div className="h-full rounded-card bg-white/4 p-6 ring-1 ring-white/10">
              <p className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-canvas/45">
                Kulüpte olan
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {SOURCES.map((s) => (
                  <li key={s} className="rounded-lg bg-white/5 px-3.5 py-2.5 text-sm text-canvas/75">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Arrow />

          {/* platform */}
          <Reveal delay={90}>
            <div className="relative h-full rounded-lg bg-linear-to-b from-white/12 to-white/4 p-px shadow-xl">
              <div className="h-full rounded-[calc(var(--radius-lg)-1px)] bg-[#14170f] p-7 text-center">
                <span className="inline-grid place-items-center">
                  <LogoMark className="size-14" id="sol" />
                </span>
                <p className="mt-4 font-display text-xl font-extrabold text-canvas">Alpfit Plus</p>
                <p className="mt-1.5 text-sm text-canvas/55">
                  Web yönetim paneli + mobil uygulama
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-sage/12 px-3 py-2.5 text-sm font-medium text-sage-br ring-1 ring-sage/25">
                  <Database className="size-4" strokeWidth={1.9} aria-hidden />
                  Tek veri kaynağı
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[0.6875rem] text-canvas/55">
                  {[
                    ["Üye", "mobil"],
                    ["Antrenör", "mobil"],
                    ["Diyetisyen", "web"],
                    ["Yönetim", "web"],
                  ].map(([who, where]) => (
                    <span
                      key={who}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md bg-white/5 px-2 py-1.5"
                    >
                      {where === "mobil" ? (
                        <Smartphone className="size-3 text-sage/70" strokeWidth={2} aria-hidden />
                      ) : (
                        <Monitor className="size-3 text-sage/70" strokeWidth={2} aria-hidden />
                      )}
                      {who}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Arrow />

          {/* ciktilar */}
          <Reveal delay={180}>
            <div className="h-full rounded-card bg-sage/8 p-6 ring-1 ring-sage/22">
              <p className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-sage-br">
                Yönetimin gördüğü
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {OUTCOMES.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm text-canvas/85">
                    <span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-sage/25 text-sage-br">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center lg:block" aria-hidden>
      <ArrowRight className="size-6 rotate-90 text-sage/50 lg:rotate-0" strokeWidth={1.6} />
    </div>
  );
}
