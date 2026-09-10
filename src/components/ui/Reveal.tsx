"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Scroll ile ortaya cikma. JS calismazsa .reveal sinifi hic eklenmez ve
 * icerik normal gorunur kalir — icerik asla JS'e bagimli degildir.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("reveal");
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  // @ts-expect-error — polymorphic ref
  return <Tag ref={ref} className={cn(className)}>{children}</Tag>;
}
