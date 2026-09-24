import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/content/site";
import { PRICING } from "@/content/pricing";
import { SURFACES } from "@/lib/analytics";

export function FinalCta({
  title = "Kulübünüzü 20 dakikada gösterelim",
  lead = "Demoyu biz planlıyoruz. Kendi kulübünüzün akışı üzerinden ilerleriz, hangi modülün işinize yaradığını birlikte görürüz.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section data-surface={SURFACES.finalCta} className="relative overflow-hidden bg-canvas py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-sage-deep via-sage to-sage-br px-7 py-12 shadow-xl sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(50%_70%_at_85%_20%,#fff,transparent_60%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linegrid opacity-[0.09]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold leading-tight text-ink-deep sm:text-4xl">
              {title}
            </h2>
            {/*
              Kapanis paragrafi TAM OPAK — opaklik bir tercih degil, olcumun
              zorladigi deger (TASK-3.10, B-032 kalem 2). Sage gradyan bandi
              uzerinde `ink-deep`in etkin rengi alfayla birlikte zemine yaklasir
              ve kontrast duser; 10 sayfada olculdu (p02, yayin kopyasi):
                /75 → 3,92-4,17 @1440 · 3,55-3,65 @390 · 3,42-3,98 @320   (esik 4,5)
                /90 → 4,37-4,55 @390 — HALA ESIK ALTI (`/` 4,48 · `/fiyat` 4,37)
                1,0 → 4,81-5,00 @390 · 4,93-5,59 @320 · gecer
              Yani ara bir deger yok: paragraf tam opak olmak zorunda.
              Hiyerarsi opaklikla degil punto ve agirlikla tasinir (STYLE-GUIDE) —
              baslik 30/36px 800, bu paragraf 17px 400.
            */}
            <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-deep">
              {lead}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="/demo"
                size="lg"
                className="w-full bg-ink-deep from-ink-deep to-ink-deep text-canvas shadow-lg hover:from-ink hover:to-ink hover:text-canvas sm:w-auto"
              >
                Demo İste
                <ArrowRight className="size-4.5" strokeWidth={2.2} aria-hidden />
              </Button>
              <Button
                href={CONTACT.whatsapp.href}
                size="lg"
                className="w-full bg-white/85 from-white/85 to-white/85 text-ink shadow-md hover:from-white hover:to-white hover:text-ink sm:w-auto"
              >
                <MessageCircle className="size-4.5 text-[#128C4A]" strokeWidth={2} aria-hidden />
                WhatsApp'tan yazın
              </Button>
            </div>

            {/*
              Ayni bandin ikinci satiri. Task yalniz ustteki paragrafi
              adlandiriyordu; kapi bu satiri da sayiyor ve /70 ile esigin
              altindaydi — biri duzeltilip oteki birakilsa kapi kirmizi kalirdi.
              Olculdu (p02, 10 sayfa, yayin kopyasi):
                /70 → "15 gun ucretsiz deneme" 4,44-4,49 her uc genislikte;
                      "Kredi karti istemiyoruz" 320 px'te 4,45-4,49 (390/1440'ta gecer)
                1,0 → 7,67-7,76 (gereginden fazla; ustteki paragrafla ayni tona duser)
                /80 → 5,50-5,70 — secilen: esikten pay var ve satir hala
                      paragraftan daha sessiz (tam opak degil).
            */}
            <p className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink-deep/80">
              <span>{PRICING.trialDays} gün ücretsiz deneme</span>
              <span aria-hidden>·</span>
              <span>Kredi kartı istemiyoruz</span>
              <span aria-hidden>·</span>
              <a
                href={CONTACT.phone.href}
                className="inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline"
              >
                <Phone className="size-3.5" strokeWidth={2.2} aria-hidden />
                {CONTACT.whatsapp.display}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
