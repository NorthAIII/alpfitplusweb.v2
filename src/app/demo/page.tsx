import type { Metadata } from "next";
import { Clock, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { DemoForm } from "@/components/sections/DemoForm";
import { CONTACT } from "@/content/site";
import { PRICING } from "@/content/pricing";

export const metadata: Metadata = {
  title: "Demo İste",
  description:
    "20 dakikalık demo görüşmesinde Alpfit Plus'ı kendi kulübünüzün akışı üzerinden gösteriyoruz. Kart bilgisi istemiyoruz.",
  alternates: { canonical: "/demo" },
};

const STEPS = [
  { n: "1", t: "Formu doldurun", d: "Kulübünüzü ve şube sayınızı öğrenelim, doğru kişiyle konuşalım." },
  { n: "2", t: "Sizi arayalım", d: "Uygun bir saat belirleyip 20 dakikalık ekran paylaşımı planlıyoruz." },
  { n: "3", t: "Ürünü görün", d: "Kendi kulübünüzün akışı üzerinden ilerleriz, sorularınızı canlı cevaplarız." },
  { n: "4", t: "Denemeye başlayın", d: `İsterseniz ${PRICING.trialDays} gün demo verisiyle kendiniz kullanın.` },
];

export default function DemoPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Demo İste", href: "/demo" }]}
        label="Demo"
        size="sm"
        title={
          <>
            20 dakikada kulübünüzün{" "}
            <span className="text-gradient-sage">nasıl yönetileceğini</span> gösterelim
          </>
        }
        lead="Self servis bir kayıt akışı yok. Sizi tanıyıp demoyu birlikte planlıyoruz, böylece görüşmede kendi kulübünüzün akışını konuşabiliyoruz."
      />

      <Section tone="canvas" size="sm">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          <DemoForm />

          <aside className="flex flex-col gap-6">
            <div className="rounded-card bg-surface p-6 shadow-sm ring-1 ring-line">
              <h2 className="font-display text-lg font-bold text-ink">Doğrudan ulaşın</h2>
              <p className="mt-1.5 text-sm text-muted">
                Form doldurmak istemiyorsanız buradan yazın, aynı yere düşüyor.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={CONTACT.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-3.5 transition-colors hover:bg-sage-wash"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#25D366]/15 text-[#128C4A]">
                    <MessageCircle className="size-4.5" strokeWidth={1.9} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">WhatsApp</span>
                    <span className="block text-sm text-muted">{CONTACT.whatsapp.display}</span>
                  </span>
                </a>
                <a
                  href={CONTACT.phone.href}
                  className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-3.5 transition-colors hover:bg-sage-wash"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sage-wash-2 text-sage-ink">
                    <Phone className="size-4.5" strokeWidth={1.9} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">Telefon</span>
                    <span className="block text-sm text-muted">{CONTACT.whatsapp.display}</span>
                  </span>
                </a>
                <a
                  href={`mailto:${CONTACT.sales}`}
                  className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-3.5 transition-colors hover:bg-sage-wash"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sage-wash-2 text-sage-ink">
                    <Mail className="size-4.5" strokeWidth={1.9} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink">E-posta</span>
                    <span className="block truncate text-sm text-muted">{CONTACT.sales}</span>
                  </span>
                </a>
              </div>
            </div>

            <div className="rounded-card bg-surface p-6 shadow-sm ring-1 ring-line">
              <h2 className="font-display text-lg font-bold text-ink">Nasıl ilerliyor</h2>
              <ol className="mt-5 flex flex-col gap-4">
                {STEPS.map((s) => (
                  <li key={s.n} className="flex gap-3.5">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sage-wash font-display text-xs font-bold text-sage-ink ring-1 ring-sage/25">
                      {s.n}
                    </span>
                    <span>
                      <span className="block font-display text-[0.9375rem] font-bold text-ink">{s.t}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-muted">{s.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-3 rounded-card bg-sage-wash p-6 ring-1 ring-sage/25">
              <p className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                <Clock className="mt-0.5 size-4.5 shrink-0 text-sage-ink" strokeWidth={1.9} aria-hidden />
                Demo yaklaşık 20 dakika sürer, ekran paylaşımıyla yapılır.
              </p>
              <p className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-sage-ink" strokeWidth={1.9} aria-hidden />
                Demoda gerçek bir kulübün verisi gösterilmez. Demo hesabı kendi örnek verisiyle çalışır.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
