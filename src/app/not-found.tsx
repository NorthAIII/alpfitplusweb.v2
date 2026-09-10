import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NAV, CONTACT } from "@/content/site";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-canvas py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-glow-soft" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-40 mask-fade-b" aria-hidden />
      <Container size="narrow" className="relative text-center">
        <p className="font-display text-[5rem] font-extrabold leading-none text-sage-wash-2 sm:text-[7rem]">
          404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Bu sayfayı bulamadık</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-muted">
          Adres değişmiş veya sayfa kaldırılmış olabilir. Aşağıdaki bağlantılardan devam
          edebilirsiniz.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Ana sayfaya dön
            <ArrowRight className="size-4.5" strokeWidth={2.2} aria-hidden />
          </Button>
          <Button href={CONTACT.whatsapp.href} variant="secondary" size="lg">
            <MessageCircle className="size-4.5 text-[#128C4A]" strokeWidth={2} aria-hidden />
            WhatsApp'tan sorun
          </Button>
        </div>

        <nav className="mt-12 flex flex-wrap justify-center gap-2.5" aria-label="Öne çıkan sayfalar">
          {[...NAV, { label: "Demo İste", href: "/demo" }].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-xl bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-sm ring-1 ring-line transition-colors hover:ring-sage/35"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  );
}
