import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NAV, CONTACT } from "@/content/site";
import { SURFACES } from "@/lib/analytics";

export default function NotFound() {
  return (
    <section data-surface={SURFACES.notFound} className="relative overflow-hidden bg-canvas py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-glow-soft" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-40 mask-fade-b" aria-hidden />
      <Container size="narrow" className="relative text-center">
        {/* Dekoratif tipografi jesti. `sage-wash-2` canvas uzerinde 1,12:1
            (gereken 3) ve karar GORUNUSU KORUMA yonunde (PHASE-3 -> Alinan
            Kararlar), yani renk koyulastirilmaz. `aria-hidden` ile hem ekran
            okuyucudan hem kontrast olcumunden cikar; hatayi asagidaki h1
            zaten soyluyor, bilgi kaybi yok. Emsal: WhyUs.tsx dev sira no. */}
        <p
          className="font-display text-[5rem] font-extrabold leading-none text-sage-wash-2 sm:text-[7rem]"
          aria-hidden
        >
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
          {/* DOKUNMA HEDEFI (TASK-3.17): `nav` icindeki bu cipler kritik
              kumede. Burada tercih sirasinin BIRINCISI uygulanir -- gorunur
              kutu buyur (`min-h-11` = 44 px), cunku cipin kendi zemini ve
              halkasi var; dolguyu gizlemek yerine hedefi gostermek dogru.
              Bedeli olculdu: 40 -> 44 px, sayfa 320/390'da +8 px. */}
          {[...NAV, { label: "Demo İste", href: "/demo" }].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="inline-flex min-h-11 items-center rounded-xl bg-surface px-4 text-sm font-medium text-ink shadow-sm ring-1 ring-line transition-colors hover:ring-sage/35"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  );
}
