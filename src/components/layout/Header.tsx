"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, MessageCircle, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { CONTACT, NAV } from "@/content/site";
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
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-canvas/85 backdrop-blur-xl shadow-[0_1px_0_var(--color-line)]"
          : "bg-transparent",
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

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobil-menu"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          className="inline-grid size-11 place-items-center rounded-xl ring-1 ring-line-2 bg-surface text-ink transition-colors hover:ring-sage lg:hidden"
        >
          {open ? <X className="size-5" strokeWidth={1.9} /> : <Menu className="size-5" strokeWidth={1.9} />}
        </button>
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
              <p className="pt-2 text-center text-sm text-faint">
                veya arayın{" "}
                <a href={CONTACT.phone.href} className="font-medium text-sage-ink underline underline-offset-4">
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
