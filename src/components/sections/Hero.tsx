import { ArrowRight, Check, MessageCircle, Smartphone, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BrowserFrame, PhoneFrame } from "@/components/ui/Frames";
import { CONTACT } from "@/content/site";
import { PRICING, tl } from "@/content/pricing";
import { SHOTS } from "@/content/shots";

const TRUST = [
  `${PRICING.trialDays} gün ücretsiz deneme`,
  "Üye ve antrenör uygulaması dâhil",
  "Kurulumu biz yapıyoruz",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas pt-8 pb-24 sm:pt-12 sm:pb-32 lg:pt-16">
      {/* zemin dokusu */}
      <div className="pointer-events-none absolute inset-0 bg-glow-sage" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-dotgrid opacity-45 mask-fade-b"
        aria-hidden
      />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-16 sm:gap-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:items-center xl:gap-14">
          {/* ── metin ── */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-xs font-medium text-sage-ink shadow-sm ring-1 ring-sage/25">
              <Sparkles className="size-3.5" strokeWidth={2} aria-hidden />
              Spor kulübü yönetim yazılımı
            </span>

            <h1 className="mt-6 text-[2.5rem] leading-[1.06] font-extrabold sm:text-5xl lg:text-[3.5rem]">
              Kulübünüzün tüm işi{" "}
              <span className="text-gradient-sage">tek platformda</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted">
              Randevu WhatsApp'ta, ciro Excel'de, ölçüm defterde kalmasın. Alpfit Plus
              randevuyu, grup derslerini, üyeliği, tahsilatı, çok şubeyi ve diyetisyen
              hizmetini tek doğru veri kaynağında toplar.
            </p>

            <ul className="mt-7 flex flex-col gap-2.5">
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[0.9375rem] text-ink">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-sage-wash-2 text-sage-ink">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/demo" size="lg">
                Demo İste
                <ArrowRight className="size-4.5" strokeWidth={2.2} aria-hidden />
              </Button>
              <Button href={CONTACT.whatsapp.href} variant="secondary" size="lg">
                <MessageCircle className="size-4.5 text-[#25D366]" strokeWidth={2} aria-hidden />
                WhatsApp'tan yazın
              </Button>
            </div>

            <p className="mt-6 text-sm text-faint">
              Şube başına <strong className="font-semibold text-ink">{tl(PRICING.firstBranch)} ₺ + KDV / ay</strong>.
              {" "}Paket yok, eğitmen limiti yok.{" "}
              <a href="/fiyat" className="font-medium text-sage-ink underline underline-offset-4 hover:text-sage-deep">
                Fiyatı gör
              </a>
            </p>
          </div>

          {/* ── gorsel ── */}
          <div className="relative mx-auto w-full max-w-[36rem] lg:max-w-none">
            {/* arka isik */}
            <div
              className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(58%_58%_at_62%_42%,rgba(116,179,111,.24),transparent_72%)] blur-2xl"
              aria-hidden
            />

            <BrowserFrame
              src={SHOTS.cockpit.src}
              alt={SHOTS.cockpit.alt}
              width={SHOTS.cockpit.width}
              height={SHOTS.cockpit.height}
              priority
              className="relative"
            />

            {/* ust sag: metrik karti */}
            <div className="absolute -top-7 right-2 hidden w-48 rounded-xl bg-surface p-4 shadow-lg ring-1 ring-line sm:block lg:-right-6 lg:w-52">
              <div className="flex items-center gap-2">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sage-wash text-sage-ink">
                  <TrendingUp className="size-4" strokeWidth={2} aria-hidden />
                </span>
                <span className="text-xs font-medium text-faint">Haftalık doluluk</span>
              </div>
              <p className="mt-3 font-display text-2xl font-extrabold tabnum text-ink">%78</p>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <span className="block h-full w-[78%] rounded-full bg-linear-to-r from-sage-br to-sage" />
              </div>
              <p className="mt-2.5 text-[0.6875rem] leading-snug text-faint">Örnek görünüm, demo verisi</p>
            </div>

            {/* sol alt: uye telefonu, panelin uzerine binen */}
            <PhoneFrame
              src={SHOTS.uyeTelefon.src}
              alt={SHOTS.uyeTelefon.alt}
              width={SHOTS.uyeTelefon.width}
              height={SHOTS.uyeTelefon.height}
              className="absolute -bottom-14 -left-1 w-28 sm:-bottom-16 sm:-left-8 sm:w-36 lg:-bottom-16 lg:-left-16 lg:w-[10.5rem]"
            />

            {/* telefon etiketi */}
            <span // Telefonun SAGINDA duruyor: telefon sm'de -left-8 + w-36 (112px sagina kadar),
            // lg'de -left-16 + w-[10.5rem] (104px). 7.75rem = 124px ikisini de gecer.
            className="absolute -bottom-9 left-[7.75rem] hidden items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[0.6875rem] font-medium text-muted shadow-md ring-1 ring-line sm:inline-flex lg:-bottom-10">
              <Smartphone className="size-3.5 text-sage-ink" strokeWidth={2} aria-hidden />
              Üye uygulaması
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
