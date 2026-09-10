"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/content/site";

/** Sabit WhatsApp dugmesi — TR KOBI kitlesinde form doldurandan cok yazan var. */
export function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={CONTACT.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp'tan yazın"
      className={`group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] py-3.5 pl-4 pr-4 text-[#06331a] shadow-lg transition-all duration-300 hover:shadow-xl sm:pr-5 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="relative grid place-items-center">
        <span className="absolute inline-block size-6 rounded-full bg-[#06331a]/25 animate-pulse-ring" />
        <MessageCircle className="relative size-6" strokeWidth={2} aria-hidden />
      </span>
      <span className="hidden font-display text-sm font-bold sm:inline">WhatsApp</span>
    </a>
  );
}
