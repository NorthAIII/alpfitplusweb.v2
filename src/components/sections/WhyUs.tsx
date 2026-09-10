import { Leaf, Smartphone, Building2, Cpu, Info } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Farklilasma sirasi rekabet/ozet.md §2'ye gore. Iki iddia bilincli olarak
 * ZAYIF isaretlendi: antrenor app'i rakiplerin ikisinde de var, TR-odaklilik
 * yerli rakiplerin hepsinde var — dolayisiyla o ikisi burada "fark" diye
 * satilmaz.
 */
const AXES = [
  {
    icon: Leaf,
    rank: "01",
    title: "Diyetisyen aynı platformda",
    body: "Kulübünüzün lisanslı diyetisyeni programı yazar, PDF yükler, üyenin ölçümünü okur. Üye programını uygulamadan görür.",
    proof: "İncelediğimiz 9 yerli ve 9 global üründe bu modüle rastlamadık.",
    strong: true,
  },
  {
    icon: Smartphone,
    rank: "02",
    title: "Hem üye hem antrenör uygulaması",
    body: "Antrenör kendi telefonundan takvimini yönetir ve tek dokunuşla yoklama alır. Üye randevusunu kendi alır.",
    proof: "Yerli rakiplerin çoğunda antrenör uygulaması yok. İkisinde var, bunu biliyoruz.",
    strong: true,
  },
  {
    icon: Building2,
    rank: "03",
    title: "Çok şube, butik fiyatına",
    body: "Cockpit ilk günden var. İkinci şubeden itibaren şube başı 1.200 ₺ ve mobil uygulama her şubede dâhil.",
    proof: "Rakiplerde çok şube ya üst pakette ya da mobil uygulama ayrı fiyatlanıyor.",
    strong: true,
  },
  {
    icon: Cpu,
    rank: "04",
    title: "Donanımsız ve sade",
    body: "Turnike, kart okuyucu veya parmak izi cihazı almanız gerekmez. Panel ve mobil uygulama yeter.",
    proof: "Donanım merkezli ürünler butik bir reformer stüdyosu için gereksiz ağır kalıyor.",
    strong: false,
  },
];

export function WhyUs() {
  return (
    <Section tone="soft" id="neden">
      <SectionHead
        label="Neden Alpfit Plus"
        title={
          <>
            Dört fark, <span className="text-gradient-sage">abartısız</span>
          </>
        }
        lead="Rakiplerin yayınladığı özellikleri tek tek okuduk. Aşağıdakiler o karşılaştırmadan çıkan gerçek farklar."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {AXES.map((a, i) => (
          <Reveal key={a.title} delay={i * 70}>
            <article className="relative h-full overflow-hidden rounded-card bg-surface p-7 shadow-sm ring-1 ring-line">
              <span
                className="pointer-events-none absolute right-5 top-4 font-display text-5xl font-extrabold text-sage-wash-2 select-none"
                aria-hidden
              >
                {a.rank}
              </span>
              <span className="relative inline-grid size-11 place-items-center rounded-xl bg-sage-wash text-sage-ink ring-1 ring-sage/20">
                <a.icon className="size-5.5" strokeWidth={1.7} aria-hidden />
              </span>
              <h3 className="relative mt-4 font-display text-xl font-bold text-ink">{a.title}</h3>
              <p className="relative mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{a.body}</p>
              <p className="relative mt-4 flex items-start gap-2 rounded-lg bg-surface-2 px-3.5 py-3 text-sm leading-snug text-faint">
                <Info className="mt-0.5 size-4 shrink-0 text-sage" strokeWidth={1.9} aria-hidden />
                {a.proof}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-8 flex items-start gap-2.5 rounded-card bg-surface px-6 py-5 text-sm leading-relaxed text-muted ring-1 ring-line">
          <Info className="mt-0.5 size-4.5 shrink-0 text-faint" strokeWidth={1.8} aria-hidden />
          <span>
            Türkçe arayüz ve KVKK uyumunu bir üstünlük olarak saymıyoruz. Türkiye'deki
            rakiplerin hepsi bunu zaten sunuyor. Bu bir giriş şartı, fark değil.
          </span>
        </p>
      </Reveal>
    </Section>
  );
}
