"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { CONTACT } from "@/content/site";
import type { Faq as FaqItem } from "@/content/faq";
import { cn } from "@/lib/cn";

export function Faq({
  items,
  title = "Sık sorulan sorular",
  label = "SSS",
  lead,
  tone = "canvas",
}: {
  items: FaqItem[];
  title?: string;
  label?: string;
  lead?: string;
  tone?: "canvas" | "soft" | "white";
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section tone={tone} id="sss">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <SectionHead label={label} title={title} lead={lead} />
          <div className="mt-7 rounded-card bg-surface p-5 ring-1 ring-line">
            <p className="text-sm text-muted">Cevabını bulamadınız mı?</p>
            <a
              href={CONTACT.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 font-display text-sm font-bold text-sage-ink underline-offset-4 hover:underline"
            >
              <MessageCircle className="size-4" strokeWidth={2.1} aria-hidden />
              WhatsApp'tan sorun
            </a>
          </div>
        </div>

        <ul className="divide-y divide-line overflow-hidden rounded-card bg-surface ring-1 ring-line">
          {items.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : i)}
                    aria-expanded={on}
                    aria-controls={`sss-${i}`}
                    className="flex w-full items-start justify-between gap-4 px-5 py-4.5 text-left transition-colors hover:bg-surface-2 sm:px-6"
                  >
                    <span className="font-display text-[0.9375rem] font-bold leading-snug text-ink sm:text-base">
                      {f.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "mt-0.5 size-5 shrink-0 text-faint transition-transform duration-300",
                        on && "rotate-180 text-sage-ink",
                      )}
                      strokeWidth={1.9}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={`sss-${i}`}
                  hidden={!on}
                  className="px-5 pb-5 text-[0.9375rem] leading-relaxed text-muted sm:px-6"
                >
                  {f.a}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
