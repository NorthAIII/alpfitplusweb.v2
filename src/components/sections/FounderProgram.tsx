import { Check, Clock, Gift, Handshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PRICING, tl } from "@/content/pricing";
import { PRODUCT_STATUS } from "@/content/site";

const PERKS = [
  {
    icon: Gift,
    title: "Kurulum ücreti yok",
    body: `Şube sayısı fark etmeksizin şube başına ${tl(PRICING.setupPerBranch)} ₺ olan kurulum ücretini almıyoruz.`,
  },
  {
    icon: Clock,
    title: "Yıllık peşinde 13 ay",
    body: "Yıllık peşin ödeyen ilk kulüpler 12 ay öder, 13 ay kullanır.",
  },
  {
    icon: Handshake,
    title: "Karşılığında tek şey",
    body: "Ürün işine yararsa vaka çalışması, referans olma ve logo kullanımı için yazılı söz veriyorsunuz.",
  },
];

export function FounderProgram() {
  return (
    <section className="relative overflow-hidden bg-ink-deep py-20 text-canvas sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(55%_60%_at_78%_10%,rgba(148,208,142,.22),transparent_66%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-linegrid opacity-[0.04]" aria-hidden />

      <Container size="wide" className="relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <SectionHead
              tone="light"
              label="Kurucu Programı"
              title={
                <>
                  İlk <span className="bg-linear-to-r from-sage-br to-sage bg-clip-text text-transparent">5 kulüp</span>{" "}
                  için özel koşullar
                </>
              }
              lead="Ürünümüz yeni ve bunu saklamıyoruz. İlk kulüplerden istediğimiz tek şey dürüst geri bildirim ve işe yararsa referans olma sözü. Karşılığında kurulum ve ilk yıl koşullarını farklılaştırıyoruz."
            />

            <div className="mt-9 flex flex-col gap-4">
              {PERKS.map((p) => (
                <Reveal key={p.title}>
                  <div className="flex gap-4 rounded-card bg-white/5 p-5 ring-1 ring-white/10">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sage/15 text-sage-br ring-1 ring-sage/25">
                      <p.icon className="size-5" strokeWidth={1.8} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-canvas">{p.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-canvas/65">{p.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="mt-6 text-sm text-canvas/60">
              Kontenjan gerçektir ve beş kulüple sınırlıdır. Dolduğunda bu koşullar geri
              çekilir, geriye dönük uygulanmaz.
            </p>
          </div>

          {/* durum karti */}
          <Reveal delay={110}>
            <div className="rounded-lg bg-white/6 p-7 ring-1 ring-white/12 backdrop-blur-sm sm:p-8">
              <p className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-sage-br">
                Ürün bugün nerede
              </p>

              <div className="mt-5 flex flex-col gap-4">
                <StatusRow
                  state="done"
                  title="v1 hazır"
                  body={`${PRODUCT_STATUS.modules} ${PRODUCT_STATUS.sentence}`}
                />
                <StatusRow
                  state="wip"
                  title="v1.5 yolda"
                  body="Kampanya derinleşmesi, gelişmiş raporlama ve churn paneli."
                />
                <StatusRow
                  state="plan"
                  title="Yol haritasında"
                  body="Online ödeme, QR ve turnike ile giriş, Apple Health ve Google Fit, yapay zekâ destekli gelişim ve beslenme analizi."
                />
              </div>

              <p className="mt-6 rounded-card bg-white/5 px-5 py-4 text-sm leading-relaxed text-canvas/70 ring-1 ring-white/10">
                Pilot sonucumuz henüz çıkmadı. Bu yüzden size yüzde kaç ciro artışı
                sağlayacağımıza dair bir rakam söylemiyoruz. Söyleyebileceğimiz şey ürünün
                bugün ne yaptığı ve demoda bunu göstermek.
              </p>

              <Button href="/demo" size="lg" className="mt-6 w-full">
                Kurucu Programı için konuşalım
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function StatusRow({
  state,
  title,
  body,
}: {
  state: "done" | "wip" | "plan";
  title: string;
  body: string;
}) {
  const dot =
    state === "done"
      ? "bg-sage text-ink-deep"
      : state === "wip"
        ? "bg-amber/70 text-ink-deep"
        : "bg-white/15 text-canvas/60";
  return (
    <div className="flex gap-3.5">
      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${dot}`} aria-hidden>
        {state === "done" ? <Check className="size-3" strokeWidth={3.2} /> : null}
      </span>
      <div>
        <p className="font-display text-[0.9375rem] font-bold text-canvas">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-canvas/60">{body}</p>
      </div>
    </div>
  );
}
