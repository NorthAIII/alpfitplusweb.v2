import { Container } from "@/components/ui/Container";

const ITEMS = [
  "Reformer & Pilates",
  "Boks & Muay Thai",
  "CrossFit",
  "Kişisel Antrenman",
  "Fonksiyonel Antrenman",
  "Yoga",
  "Grup Dersleri",
  "Çok Şubeli Zincirler",
  "Dövüş Sporları",
  "Wellness Stüdyoları",
];

export function Marquee() {
  return (
    <section className="relative border-y border-line bg-surface py-7">
      <Container size="wide">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
          <p className="shrink-0 text-center font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-faint sm:text-left">
            Kimler için
            <br className="hidden sm:block" /> tasarlandı
          </p>
          <div className="relative w-full overflow-hidden mask-fade-x">
            <div className="flex w-max animate-marquee gap-3">
              {[...ITEMS, ...ITEMS].map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="whitespace-nowrap rounded-full bg-surface-2 px-4 py-2 text-sm font-medium text-muted ring-1 ring-line"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
