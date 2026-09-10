import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Gecici marka isareti — nihai logo geldiginde bu bilesen degistirilir.
 * Yuvarlatilmis kare + sage gradyan + "A" glifi; app icon olarak da calisir.
 */
export function LogoMark({ className, id = "lm" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#94D08E" />
          <stop offset="55%" stopColor="#74B36F" />
          <stop offset="100%" stopColor="#3E6B3C" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11.5" fill={`url(#${id}-g)`} />
      {/* A glifi */}
      <path
        d="M11.6 28.4 19.1 11.9a1 1 0 0 1 1.82 0l3.02 6.64"
        fill="none"
        stroke="#0C1A0B"
        strokeOpacity=".92"
        strokeWidth="2.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15.9 22.6h6.6" fill="none" stroke="#0C1A0B" strokeOpacity=".92" strokeWidth="2.9" strokeLinecap="round" />
      {/* arti */}
      <path d="M27.4 23.1v7.2M23.8 26.7h7.2" fill="none" stroke="#0C1A0B" strokeOpacity=".92" strokeWidth="2.9" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
  href = "/",
}: {
  className?: string;
  tone?: "dark" | "light";
  href?: string | null;
}) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "font-display text-[1.0625rem] font-extrabold tracking-[-0.03em]",
          tone === "light" ? "text-canvas" : "text-ink",
        )}
      >
        Alpfit<span className="text-sage-ink">{tone === "light" ? "" : ""}</span>
        <span className={tone === "light" ? "text-sage-br" : "text-sage-ink"}> Plus</span>
      </span>
    </span>
  );
  if (!href) return inner;
  return (
    <Link href={href} className="inline-block rounded-lg py-1.5" aria-label="Alpfit Plus ana sayfa">
      {inner}
    </Link>
  );
}
