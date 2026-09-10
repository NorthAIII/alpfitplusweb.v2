"use client";

import { useState } from "react";
import { Check, Monitor, Smartphone } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { BrowserFrame, PhoneFrame } from "@/components/ui/Frames";
import { ROLES } from "@/content/product";
import { SHOTS } from "@/content/shots";
import { cn } from "@/lib/cn";

const VISUAL = {
  uye: SHOTS.uyeTelefon,
  antrenor: SHOTS.takvim,
  diyetisyen: SHOTS.antrenor,
  yonetim: SHOTS.cockpit,
} as const;

export function Roles() {
  const [active, setActive] = useState(0);
  const role = ROLES[active];
  const shot = VISUAL[role.key as keyof typeof VISUAL];
  const isPhone = role.device === "mobil";

  return (
    <Section tone="soft" id="roller">
      <SectionHead
        label="Dört rol, tek platform"
        title={
          <>
            Kulüpte kim ne yapıyorsa,{" "}
            <span className="text-gradient-sage">kendi ekranından</span>
          </>
        }
        lead="Üye ve antrenör kendi telefonundan, diyetisyen ve yönetim web panelinden çalışır. Dördü de aynı veriyi görür."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12">
        {/* sekmeler */}
        <div>
          <div
            role="tablist"
            aria-label="Roller"
            className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {ROLES.map((r, i) => {
              const on = i === active;
              return (
                <button
                  key={r.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group relative shrink-0 rounded-card px-5 py-4 text-left transition-all duration-200 lg:w-full",
                    on
                      ? "bg-surface shadow-md ring-1 ring-sage/35"
                      : "bg-surface/55 ring-1 ring-line hover:bg-surface hover:ring-line-2",
                  )}
                >
                  {on ? (
                    <span className="absolute left-0 top-4 bottom-4 hidden w-[3px] rounded-r-full bg-sage lg:block" aria-hidden />
                  ) : null}
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-lg",
                        on ? "bg-sage-wash text-sage-ink" : "bg-surface-2 text-faint",
                      )}
                    >
                      {r.device === "mobil" ? (
                        <Smartphone className="size-4" strokeWidth={1.8} aria-hidden />
                      ) : (
                        <Monitor className="size-4" strokeWidth={1.8} aria-hidden />
                      )}
                    </span>
                    <span className={cn("font-display font-bold", on ? "text-ink" : "text-muted")}>
                      {r.name}
                    </span>
                    <span className="ml-auto hidden text-[0.6875rem] text-faint sm:inline lg:inline">
                      {r.deviceLabel}
                    </span>
                  </span>
                  <span className="mt-1.5 block max-w-xs text-sm text-muted lg:max-w-none">
                    {r.summary}
                  </span>
                </button>
              );
            })}
          </div>

          <ul className="mt-7 flex flex-col gap-3">
            {role.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage-wash-2 text-sage-ink">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* gorsel */}
        <div className="relative flex items-center justify-center">
          <div
            className="pointer-events-none absolute inset-6 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_45%,rgba(116,179,111,.20),transparent_70%)] blur-2xl"
            aria-hidden
          />
          {isPhone ? (
            <PhoneFrame
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              className="relative w-56 sm:w-64"
            />
          ) : (
            <BrowserFrame
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              className="relative w-full"
            />
          )}
        </div>
      </div>
    </Section>
  );
}
