"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, MessageCircle, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { CONTACT, NAV } from "@/content/site";
import { SURFACES } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Rota degisince menuyu kapat
  useEffect(() => setOpen(false), [pathname]);

  // Esc, disa tiklama, scroll kilidi, odak yonetimi (v1 denetimi D-09)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t) && !triggerRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      data-surface={SURFACES.header}
      // Zemin HER ZAMAN opak. Seffaf birakildiginda koyu fotograf kahraman
      // bolumu tasiyan sayfalarda (segment sayfalari) koyu logo ve koyu nav
      // metni okunmuyordu. Ana sayfanin kahraman zemini zaten canvas oldugu
      // icin ustte gorsel bir fark olusmuyor; kaydirinca yalnizca ince ayrac
      // ve bulaniklik ekleniyor.
      className={cn(
        "sticky top-0 z-50 transition-shadow duration-300",
        scrolled
          ? "bg-canvas/88 backdrop-blur-xl shadow-[0_1px_0_var(--color-line)]"
          : "bg-canvas",
      )}
    >
      <div className="mx-auto flex h-17 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-[0.9375rem] font-medium transition-colors",
                isActive(item.href)
                  ? "bg-sage-wash text-sage-ink"
                  : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <a
            href={CONTACT.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-xl px-3.5 text-[0.9375rem] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <MessageCircle className="size-4.5" strokeWidth={1.7} aria-hidden />
            WhatsApp
          </a>
          <Button href="/demo" size="md">
            Demo İste
            <ArrowRight className="size-4" strokeWidth={2.2} aria-hidden />
          </Button>
        </div>

        {/*
          Mobil kol (TASK-3.16, B-022). 1024 px altinda ustteki "Demo Iste" +
          WhatsApp blogu HIC render edilmiyordu ve yuzen dugme de 480 px
          kaydirmaya kadar gizliydi; sonuc olarak ilk ekranda tiklanacak tek
          sey hamburger'di — 16 sayfanin 13'unde (320 px) ve 6'sinda (390 px)
          hicbir donusum yuzeyi yoktu (olculdu).

          Etiket "Demo Iste" DEGIL "Demo": 320 px'te basliktaki kap 280 px ve
          logo 132,41 + hamburger 44 aliyor; "Demo Iste" (72 px metin + 28 px
          dolgu = 100) satiri tasirdi, "Demo" (42 + 28 = 70) 11,6 px payla
          siğar. Rozet/parilti/dolgu YOK — kullanicinin reddettigi kaliplar
          (docs/STYLE-GUIDE.md) ve "gorunumu neredeyse degistirmemek" kararin
          parcasi. Yukseklik h-11 = 44 px: baglanti `/demo`'ya gittigi icin
          mobil kapinin KRITIK dokunma hedefi kumesine girer (TASK-3.08).
        */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <Link
            href="/demo"
            className="inline-flex h-11 items-center rounded-xl px-3.5 text-[0.9375rem] font-medium text-sage-ink transition-colors hover:bg-sage-wash"
          >
            Demo
          </Link>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobil-menu"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="inline-grid size-11 place-items-center rounded-xl ring-1 ring-line-2 bg-surface text-ink transition-colors hover:ring-sage"
          >
            {open ? <X className="size-5" strokeWidth={1.9} /> : <Menu className="size-5" strokeWidth={1.9} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 top-17 z-40 bg-ink/25 backdrop-blur-[2px] lg:hidden">
          <div
            ref={panelRef}
            id="mobil-menu"
            className="max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-line bg-canvas px-5 pb-8 pt-4 shadow-xl"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobil menü">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                    isActive(item.href) ? "bg-sage-wash text-sage-ink" : "text-ink hover:bg-surface-2",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-5 flex flex-col gap-2.5">
              <Button href="/demo" size="lg" className="w-full">
                Demo İste
                <ArrowRight className="size-4" strokeWidth={2.2} aria-hidden />
              </Button>
              <Button href={CONTACT.whatsapp.href} variant="whatsapp" size="lg" className="w-full">
                <MessageCircle className="size-4.5" strokeWidth={2} aria-hidden />
                WhatsApp'tan yazın
              </Button>
              {/* DOKUNMA HEDEFI (TASK-3.17): `tel:` hedefli, yani proje
                  kuralina gore kritik -- ama KAPI BUNU HIC GORMUYOR: panel
                  yalniz menu aciklen render ediliyor, kapi ise etkilesimsiz
                  hal olcuyor (B-015). Yine de ayni deyimle duzeltildi ve ELLE
                  olculdu; kapiya girdigi gun zaten yesil olacak. Satir ici
                  baglanti -> yalniz dolgu, telafi yok. */}
              <p className="pt-2 text-center text-sm text-faint">
                veya arayın{" "}
                <a href={CONTACT.phone.href} className="py-3.5 font-medium text-sage-ink underline underline-offset-4">
                  {CONTACT.whatsapp.display}
                </a>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
