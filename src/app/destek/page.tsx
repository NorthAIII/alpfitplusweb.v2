import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Phone, MapPin, LifeBuoy } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/ui/Section";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { CONTACT, SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Destek",
  description:
    "Alpfit Plus destek ve iletişim. WhatsApp, telefon ve e-posta ile bize ulaşın.",
  alternates: { canonical: "/destek" },
};

const CHANNELS = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: CONTACT.whatsapp.display,
    href: CONTACT.whatsapp.href,
    note: "En hızlı dönüş buradan olur.",
  },
  {
    icon: Phone,
    title: "Telefon",
    value: CONTACT.whatsapp.display,
    href: CONTACT.phone.href,
    note: "Hafta içi mesai saatlerinde.",
  },
  {
    icon: LifeBuoy,
    title: "Destek e-postası",
    value: CONTACT.support,
    href: `mailto:${CONTACT.support}`,
    note: "Mevcut müşteriler için teknik destek.",
  },
  {
    icon: Mail,
    title: "Satış ve demo",
    value: CONTACT.sales,
    href: `mailto:${CONTACT.sales}`,
    note: "Fiyat, demo ve teklif soruları.",
  },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Destek", href: "/destek" }]}
        label="Destek"
        size="sm"
        title="Size nasıl ulaşabiliriz konusunda seçenek bırakıyoruz"
        lead="Kulüp sahibi olarak gününüz sahada geçiyor. Formu doldurmak zorunda değilsiniz, WhatsApp'tan yazmanız yeterli."
      />

      <Section tone="canvas" size="sm">
        <div className="grid gap-4 sm:grid-cols-2">
          {CHANNELS.map((c) => (
            <a
              key={c.title}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex gap-4 rounded-card bg-surface p-6 shadow-sm ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-sage/35"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sage-wash text-sage-ink ring-1 ring-sage/20">
                <c.icon className="size-5" strokeWidth={1.8} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-base font-bold text-ink">{c.title}</span>
                <span className="mt-0.5 block truncate text-[0.9375rem] text-sage-ink">{c.value}</span>
                <span className="mt-1.5 block text-sm text-muted">{c.note}</span>
              </span>
            </a>
          ))}
        </div>
      </Section>

      <Section tone="soft" size="sm">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHead label="Şirket" title="Arkasında kim var" />
            <div className="mt-6 flex flex-col gap-3 text-[0.9375rem] text-ink">
              <p className="text-muted">
                Alpfit Plus, <strong className="font-semibold text-ink">{SITE.maker.name}</strong>{" "}
                tarafından geliştirilen bir üründür. Kişisel verilerin işlenmesinde veri
                sorumlusu {SITE.maker.name}'dır.
              </p>
              <span className="inline-flex items-center gap-2.5 text-muted">
                <MapPin className="size-4.5 shrink-0 text-sage-ink" strokeWidth={1.8} aria-hidden />
                {CONTACT.city}
              </span>
              <a
                href={CONTACT.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-muted transition-colors hover:text-sage-ink"
              >
                <InstagramIcon className="size-4.5 shrink-0 text-sage-ink" />
                {CONTACT.instagram.handle}
              </a>
              <a
                href={SITE.maker.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-muted transition-colors hover:text-sage-ink"
              >
                <Mail className="size-4.5 shrink-0 text-sage-ink" strokeWidth={1.8} aria-hidden />
                {SITE.maker.url.replace("https://", "")}
              </a>
            </div>
          </div>

          <div>
            <SectionHead label="Yasal" title="Sözleşme ve aydınlatma metinleri" />
            <ul className="mt-6 flex flex-col gap-3">
              {[
                { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
                { href: "/gizlilik", label: "Gizlilik Politikası" },
                { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex items-center justify-between gap-4 rounded-card bg-surface px-5 py-4 text-[0.9375rem] font-medium text-ink shadow-sm ring-1 ring-line transition-colors hover:ring-sage/35"
                  >
                    {l.label}
                    <span aria-hidden className="text-sage-ink">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
