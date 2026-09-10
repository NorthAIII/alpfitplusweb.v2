import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-display font-bold whitespace-nowrap " +
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
