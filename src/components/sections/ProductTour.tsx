"use client";

import { useState } from "react";
import { BrowserFrame } from "@/components/ui/Frames";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/Section";
import { SHOTS } from "@/content/shots";
import { cn } from "@/lib/cn";

const TABS = [
  { key: "takvim", label: "Takvim", shot: SHOTS.takvim, note: "Antrenör sütunları, saat ızgarası, bekleme listesi ve günün özeti tek ekranda." },
  { key: "grup", label: "Grup Dersleri", shot: SHOTS.grup, note: "Kontenjan, katılımcı listesi ve tek dokunuşla yoklama." },
  { key: "finans", label: "Finans", shot: SHOTS.finans, note: "Ciro trendi, gelir kırılımı ve ödeme tipi dağılımı." },
  { key: "sube", label: "Şube Detayı", shot: SHOTS.sube, note: "Şubenin aylık cirosu, aktif üyesi ve hedefe ilerlemesi." },
  { key: "raporlar", label: "Raporlar", shot: SHOTS.raporlar, note: "Hazır şablonlar ve tek tık XLSX, CSV, PDF çıktısı." },
] as const;

export function ProductTour() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <section className="relative overflow-hidden bg-ink-deep py-20 text-canvas sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(116,179,111,.22),transparent_65%)]"
        aria-hidden
      />
      <Container size="wide" className="relative">
        <SectionHead
          tone="light"
          align="center"
          label="Ürün turu"
          title="Anlatmak yerine göstermek"
          lead="Aşağıdaki ekranlar ürünün kendisinden alındı. Rakamlar demo verisidir."
        />

        <div
          role="tablist"
          aria-label="Ürün ekranları"
          className="mx-auto mt-10 flex max-w-full gap-2 overflow-x-auto pb-2 sm:justify-center"
        >
          {TABS.map((t, i) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 font-display text-sm font-bold transition-all duration-200",
                i === active
                  ? "bg-sage text-ink-deep shadow-sage"
                  : "bg-white/6 text-canvas/65 ring-1 ring-white/12 hover:bg-white/12 hover:text-canvas",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-5xl">
          <BrowserFrame
            src={tab.shot.src}
            alt={tab.shot.alt}
            width={tab.shot.width}
            height={tab.shot.height}
            className="ring-white/10"
          />
          <p className="mt-5 text-center text-[0.9375rem] text-canvas/60">{tab.note}</p>
        </div>
      </Container>
    </section>
  );
}
