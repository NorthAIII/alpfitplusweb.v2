import Link from "next/link";
import { Mail, MessageCircle, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { CONTACT, SITE } from "@/content/site";
import { SEGMENTS } from "@/content/segments";
import { KiwiBand } from "./KiwiBand";

const COLS = [
  {
    title: "Ürün",
    links: [
      { label: "Özellikler", href: "/ozellikler" },
      { label: "Fiyat", href: "/fiyat" },
      { label: "Demo İste", href: "/demo" },
      { label: "Destek", href: "/destek" },
    ],
  },
  {
    title: "Segmentler",
    links: [
      ...SEGMENTS.map((s) => ({ label: s.name, href: `/segmentler/${s.slug}` })),
      { label: "Tüm segmentler", href: "/segmentler" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { label: "Gizlilik Politikası", href: "/gizlilik" },
      { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
      { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-deep text-canvas">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40 bg-[radial-gradient(60%_100%_at_20%_0%,rgba(116,179,111,.28),transparent_70%)]" />
      <Container className="relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.35fr_repeat(3,1fr)] lg:gap-10 lg:py-20">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-canvas/65">
              {SITE.description}
            </p>
            <div className="mt-6 flex flex-col gap-3 text-[0.9375rem]">
              <a
                href={CONTACT.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-1 inline-flex items-center gap-2.5 py-2 text-canvas/80 transition-colors hover:text-sage-br"
              >
                <MessageCircle className="size-4.5 shrink-0 text-sage-br" strokeWidth={1.7} aria-hidden />
                {CONTACT.whatsapp.display}
              </a>
              <a
                href={CONTACT.phone.href}
                className="-my-1 inline-flex items-center gap-2.5 py-2 text-canvas/80 transition-colors hover:text-sage-br"
              >
                <Phone className="size-4.5 shrink-0 text-sage-br" strokeWidth={1.7} aria-hidden />
                Telefonla arayın
              </a>
              <a
                href={`mailto:${CONTACT.sales}`}
                className="-my-1 inline-flex items-center gap-2.5 py-2 text-canvas/80 transition-colors hover:text-sage-br"
              >
                <Mail className="size-4.5 shrink-0 text-sage-br" strokeWidth={1.7} aria-hidden />
                {CONTACT.sales}
              </a>
              <a
                href={CONTACT.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-1 inline-flex items-center gap-2.5 py-2 text-canvas/80 transition-colors hover:text-sage-br"
              >
                <InstagramIcon className="size-4.5 shrink-0 text-sage-br" />
                {CONTACT.instagram.handle}
              </a>
              <span className="inline-flex items-center gap-2.5 text-canvas/55">
                <MapPin className="size-4.5 shrink-0 text-sage-br/70" strokeWidth={1.7} aria-hidden />
                {CONTACT.city}
              </span>
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-sage-br">
                {col.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="-my-1 inline-block py-2 text-[0.9375rem] text-canvas/70 transition-colors hover:text-canvas"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-canvas/60">
            © {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={SITE.appUrl}
              className="inline-flex items-center gap-1.5 text-sm text-canvas/70 transition-colors hover:text-sage-br"
            >
              Giriş Yap
              <ArrowUpRight className="size-3.5" strokeWidth={2} aria-hidden />
            </a>
          </div>
        </div>
      </Container>

      <KiwiBand />
    </footer>
  );
}
