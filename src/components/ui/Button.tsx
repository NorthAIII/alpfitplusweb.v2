import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light" | "whatsapp";
type Size = "sm" | "md" | "lg";

/**
 * `whitespace-nowrap` DAR TELEFONDA KALKAR (`sm:` = 640 px, TASK-3.14 / B-033).
 *
 * Tabandaki kosulsuz `nowrap` her butona kirilamaz bir min-content tabani
 * dayatiyordu: "Kurucu Programi icin konusalim" 314 px, `p-7` kartinda 370 px,
 * ve izgara cocugunun `min-width:auto` varsayilani bunu track'e gecirince
 * bolumun `overflow-hidden`'i 320 px'te sagdan 70 px kesiyordu — yalniz icerik
 * degil ISLEV kaybi (CTA'nin kendi etiketi okunmuyordu). Olculdu: 320 px'te 19
 * kirpilmis metin dugumu, hepsi tek bolumden.
 *
 * `sm:` SINIRI OLCULEREK SECILDI (3100, 16 rota x 6 genislik, enjekte CSS ile
 * iki aday yan yana): nowrap'i tamamen kaldirmak da bu sinirla kaldirmak da
 * 320/390 px'te ayni sonucu verir (kirpma 19 -> 0, hicbir butonda dikey/yatay
 * tasma yok). Fark yalniz 1024 px'te: tamamen kaldirmak /demo'daki iki butonu
 * iki satira dusuruyordu, `sm:` sinirli hal 640 px ve ustunde bugunku hali
 * BIREBIR koruyor (640/768/1024/1440'ta sarilan 0). WCAG 1.4.10 reflow'un
 * olcum genisligi ve bu projenin kapisi (mobile-audit.mjs) zaten 320/390'dir.
 *
 * Sabit yukseklikler (h-9/h-11/h-13) iki satiri TASIYOR: olculdu, alti
 * genislikte dikey tasma 0 — `lg` butonunda iki satir 48 px, kutu 52 px.
 * Bir cagri sarmayi kaldirmiyorsa cozum tabana degil O CAGRIYA yerel
 * `whitespace-nowrap` vermektir.
 */
const base =
  "inline-flex items-center justify-center gap-2 font-display font-bold sm:whitespace-nowrap " +
  "transition-all duration-200 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-linear-to-b from-sage-br to-sage text-ink-deep shadow-sage " +
    "hover:from-sage hover:to-sage-deep hover:text-white hover:shadow-lg",
  secondary:
    "bg-surface text-ink ring-1 ring-line-2 shadow-sm hover:ring-sage hover:text-sage-ink hover:shadow-md",
  ghost: "text-ink hover:text-sage-ink hover:bg-sage-wash",
  light:
    "bg-white/10 text-canvas ring-1 ring-white/25 backdrop-blur-sm hover:bg-white/18 hover:ring-white/45",
  whatsapp:
    "bg-[#25D366] text-[#06331a] shadow-md hover:brightness-[1.06] hover:shadow-lg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 rounded-lg px-3.5 text-[0.8125rem]",
  md: "h-11 rounded-xl px-5 text-[0.9375rem]",
  lg: "h-13 rounded-xl px-6.5 text-base",
};

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  external,
  ...rest
}: Props) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (href) {
    if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return (
        <a
          href={href}
          className={classes}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
