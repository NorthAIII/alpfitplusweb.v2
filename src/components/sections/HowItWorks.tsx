import Image from "next/image";
import { CalendarCheck, Database, MonitorSmartphone, PhoneCall, Rocket } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PRICING } from "@/content/pricing";

/**
 * "Nasil calisir" — kulubun ilk gunden calisir hale gelmesine kadar bes adim.
 * Kurulum ve veri tasima bizde: rekabet/mevcut-duzen.md, degisim maliyetinin
 * asil satin alma engeli oldugunu soyluyor. Bu bolum tam o korkuya cevap verir.
 */
const STEPS = [
  {
    icon: PhoneCall,
    title: "Tanışma ve demo",
    body: "Sizi arayıp kulübünüzü dinliyoruz. 20 dakikalık ekran paylaşımında ürünü kendi akışınız üzerinden gösteriyoruz. Kart bilgisi istemiyoruz.",
    meta: "20 dakika",
  },
  {
    icon: CalendarCheck,
    title: "Ücretsiz deneme",
    body: `İsterseniz ${PRICING.trialDays} gün boyunca demo verisiyle kendiniz kullanıyorsunuz. Gerçek verinize dokunulmuyor, kurulum ücreti alınmıyor.`,
    meta: `${PRICING.trialDays} gün`,
  },
  {
    icon: Database,
    title: "Verilerinizi biz taşıyoruz",
    body: "Üye listeniz Excel'de, defterde ya da başka bir yazılımda olabilir. Taşımayı biz yapıyoruz, siz iki sistemi birden kullanmıyorsunuz.",
    meta: "Kurulum bizde",
  },
  {
    icon: MonitorSmartphone,
    title: "Ekibinizi kuruyoruz",
    body: "Antrenörler kendi telefonlarına uygulamayı kuruyor, yönetim panele giriyor. Üyeleriniz davet koduyla katılıyor.",
    meta: "İlk hafta",
  },
  {
    icon: Rocket,
    title: "Tek sistemde devam",
    body: "WhatsApp, Excel ve defter kapanıyor. Randevu, ciro ve yoklama aynı yerde. İlk hafta yanınızdayız.",
    meta: "Sonrası",
  },
];

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="relative overflow-hidden bg-canvas py-20 sm:py-28">
      <Container size="wide">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* sol: baslik + foto */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionLabel>Nasıl çalışır</SectionLabel>
            <h2 className="mt-4 text-3xl leading-[1.12] sm:text-4xl lg:text-[2.6rem]">
              Kurulumu siz yapmıyorsunuz,{" "}
              <span className="text-gradient-sage">biz yapıyoruz</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Yazılım değiştirmenin asıl maliyeti lisans değil, taşınma. Kulüp sahiplerinin
              üç sorusu hep aynı: verilerimi nasıl taşırım, antrenörler öğrenir mi, bir ay
              iki sistemi birden mi kullanacağım. Üçünün de cevabı burada.
            </p>

            <div className="relative mt-8 hidden overflow-hidden rounded-lg shadow-lg ring-1 ring-line lg:block">
              <Image
                src="/foto/grup-dersi-sm.webp"
                alt="Bir stüdyoda daire şeklinde yapılan grup dersi"
                width={800}
                height={534}
                sizes="40vw"
                className="h-56 w-full object-cover"
              />
              <span
                className="absolute inset-0 bg-linear-to-t from-ink-deep/72 to-transparent"
                aria-hidden
              />
              <p className="absolute bottom-5 left-6 right-6 font-display text-base font-bold leading-snug text-canvas">
                İlk hafta yanınızdayız. Sorun çıkarsa WhatsApp'tan yazarsınız.
              </p>
            </div>

            <Button href="/demo" size="lg" className="mt-8 w-full sm:w-auto">
              Demo İste
            </Button>
          </div>

          {/* sag: adimlar */}
          <ol className="relative flex flex-col">
            {/* dikey hat */}
            <span
              className="absolute bottom-6 left-[1.4375rem] top-6 w-px bg-linear-to-b from-sage/45 via-line-2 to-transparent"
              aria-hidden
            />
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 70} className="relative flex gap-5 pb-9 last:pb-0">
                <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl bg-surface text-sage-ink shadow-sm ring-1 ring-line">
                  <s.icon className="size-5.5" strokeWidth={1.7} aria-hidden />
                  <span className="absolute -bottom-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-sage font-display text-[0.625rem] font-extrabold text-ink-deep">
                    {i + 1}
                  </span>
                </span>
                <div className="pt-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-lg font-bold text-ink">{s.title}</h3>
                    <span className="rounded-full bg-sage-wash px-2.5 py-0.5 text-[0.6875rem] font-medium text-sage-ink">
                      {s.meta}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
