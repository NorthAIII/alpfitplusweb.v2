import Image from "next/image";
import { cn } from "@/lib/cn";

/** Tarayici cercevesi — koyu urun ekran goruntusunu acik zeminde tasir. */
export function BrowserFrame({
  src,
  alt,
  className,
  priority = false,
  label = "app.alpfitplus.com",
  width = 1600,
  height = 1000,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  label?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl bg-ink-deep shadow-xl ring-1 ring-ink/10",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/8 bg-[#171914] px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-white/18" />
          <span className="size-2.5 rounded-full bg-white/18" />
          <span className="size-2.5 rounded-full bg-white/18" />
        </span>
        <span className="ml-2 truncate rounded-md bg-white/6 px-2.5 py-1 text-[0.6875rem] text-canvas/60">
          {label}
        </span>
      </div>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 62vw"
        className="block h-auto w-full"
      />
    </figure>
  );
}

/** Telefon cercevesi — uye/antrenor mobil uygulamasi icin. */
export function PhoneFrame({
  src,
  alt,
  className,
  priority = false,
  width = 720,
  height = 1520,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}) {
  // NOT: konumlandirma sinifi (relative/absolute) disaridan gelir. Ic sarmalayici
  // kendi "relative"ini tasir — aksi halde Tailwind sira onceligi disaridan gelen
  // "absolute" sinifini eziyor.
  return (
    <figure className={cn("overflow-hidden rounded-[2rem] bg-ink-deep p-1.5 shadow-xl ring-1 ring-ink/12", className)}>
      <div className="relative">
        <span
          className="absolute left-1/2 top-1.5 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/20"
          aria-hidden
        />
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(max-width: 640px) 55vw, 260px"
          className="block h-auto w-full rounded-[1.6rem]"
        />
      </div>
    </figure>
  );
}
