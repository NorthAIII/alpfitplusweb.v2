import Link from "next/link";
import { Mail, MessageCircle, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { CONTACT, SITE } from "@/content/site";
import { SEGMENTS } from "@/content/segments";
import { SURFACES } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { KiwiBand } from "./KiwiBand";

const COLS = [
  {
    title: "Ürün",
    links: [
      { label: "Özellikler", href: "/ozellikler" },
      { label: "Fiyat", href: "/fiyat" },
      { label: "Geçiş ve veri aktarımı", href: "/gecis" },
      { label: "Yazılım seçerken", href: "/yazilim-secerken" },
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
    <footer data-surface={SURFACES.footer} className="relative overflow-hidden bg-ink-deep text-canvas">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40 bg-[radial-gradient(60%_100%_at_20%_0%,rgba(116,179,111,.28),transparent_70%)]" />
      <Container className="relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.35fr_repeat(3,1fr)] lg:gap-10 lg:py-20">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-canvas/65">
              {SITE.description}
            </p>
            <div className="mt-6 flex flex-col gap-3 text-[0.9375rem]">
              {/*
                DOKUNMA HEDEFI (TASK-3.17). Bu iki baglanti `wa.me` ve `tel:`
                hedefli, yani kapinin KRITIK kumesinde (TASK-3.08) ve 44 px
                kuralina tabi. Ayni sutundaki e-posta/Instagram baglantilari
                gezinme kulvarindadir ve BILINCLE bugunku halinde kalir
                (kullanici karari, PHASE-3 -> Alinan Kararlar).
                ⚠️ TELAFI TAM DEGIL, KASITLI OLARAK EKSIK -- ve bu OLCULEREK
                secildi. Ilk deneme `-my-2 py-3` idi: kutu 46,5 px, akistaki yer
                30,5 px'te SABIT, sayfa boyu birebir, gorunus 0 farkli piksel.
                Ama iki baglanti YAN YANA ve ikisi de buyudu: 30,5 + 12 px
                boslukla adim 42,5 px iken iki 46,5 px'lik kutu birbirine 4 px
                giriyordu (olculdu: 16 rota x 2 genislik x 7 kaydirma turunda
                "+90 535 937 59 55 ↔ Telefonla arayin" cifti). Ust uste binen
                hedefte boyama sirasi kazanir, yani WhatsApp baglantisinin
                GERCEK hedefi 42,5 px'e duserdi -- KAPI ise 46,5 gorup yesil
                basardi. Gorunmez genisletmenin fail-open'i tam burada.
                Bu yuzden telafi `-my-1`'de birakilir: kutu 46,5, akistaki yer
                30,5 -> 38,5 px (+8), iki baglantinin arasinda 4 px acik kalir
                ve mailto/Instagram satirlariyla da 4 px. Bedeli yazili: alt
                bilgi 16 px uzar ve bu iki satirin cevresindeki bosluk 8 px
                artar. Bes satir 42,5 px adimla dizilirken hepsine 44 px hedef
                sigdirmak GEOMETRIK OLARAK mumkun degil; secim "gorunmez ama
                cakisan" ile "4 px daha ferah ama gercek" arasindaydi.
              */}
              <a
                href={CONTACT.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-1 inline-flex items-center gap-2.5 py-3 text-canvas/80 transition-colors hover:text-sage-br"
              >
                <MessageCircle className="size-4.5 shrink-0 text-sage-br" strokeWidth={1.7} aria-hidden />
                {CONTACT.whatsapp.display}
              </a>
              <a
                href={CONTACT.phone.href}
                className="-my-1 inline-flex items-center gap-2.5 py-3 text-canvas/80 transition-colors hover:text-sage-br"
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
              {/* h2, h3 DEGIL (TASK-3.13): alt bilgi 16 sayfanin hepsinde
                  duruyor ve kolon basliklari sahipsiz. Govdesinde h2 olmayan
                  bir sayfada (404) dizi h1 -> h3 atlamasina donuyordu. h2
                  seviyesi sayfa govdesine BAGIMLI DEGILDIR, yani duzeltme 16
                  rotanin hepsinde gecerli. Gorunus degismez: globals.css
                  h1-h4'u ayni kurala bagliyor, olcu/agirlik/harf araligi
                  buradaki yardimci siniflardan geliyor. */}
              <h2 className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-sage-br">
                {col.title}
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {/* Kolonun TEK donusum baglantisi `/demo`'dur ve kapinin
                        kritik kumesine oradan girer; kalan 15 baglanti alt
                        bilgi gezinmesidir ve olculur, raporlanir, DUSURMEZ
                        (kullanici karari). Ayrim bu yuzden href'e bakar --
                        ikisine de ayni sinifi vermek ya 256 gezinme hedefini
                        kapsam disi bir ise sokardi ya da donusum baglantisini
                        esigin altinda birakirdi. Iki dal da CAKISMASIZ yazilir
                        (`-my-1 py-2` / `-my-2 py-3`): ayni yardimcinin iki
                        degerini tek sinif dizesine koymak sirayi CSS uretim
                        duzenine birakirdi. */}
                    <Link
                      href={l.href}
                      className={cn(
                        "inline-block text-[0.9375rem] text-canvas/70 transition-colors hover:text-canvas",
                        l.href === "/demo" ? "-my-2 py-3" : "-my-1 py-2",
                      )}
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
