"use client";

import { useState } from "react";
import { Check, Info, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  PRICING,
  INCLUDED,
  monthlyFor,
  annualPrepayFor,
  monthlyPathYearOneFor,
  trySavingsPct,
  rivalAppStartFor,
  RIVAL_MULTI_BRANCH,
  tl,
} from "@/content/pricing";
import { cn } from "@/lib/cn";

export function PriceCalculator({ compact = false }: { compact?: boolean }) {
  const [branches, setBranches] = useState(1);

  const monthly = monthlyFor(branches);
  const annual = annualPrepayFor(branches);
  const monthlyPath = monthlyPathYearOneFor(branches);
  const savings = trySavingsPct(branches);
  const rival = rivalAppStartFor(branches);
  const cheaperPct = Math.round(((rival - monthly) / rival) * 100);

  return (
    <div className="overflow-hidden rounded-lg bg-surface shadow-lg ring-1 ring-line">
      {/* sube secici */}
      <div className="border-b border-line bg-surface-2 px-6 py-5 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-faint">
              Kaç şubeniz var
            </p>
            <p className="mt-1 text-sm text-muted">Fiyat şube başına hesaplanır</p>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-surface p-1 shadow-sm ring-1 ring-line">
            <button
              type="button"
              onClick={() => setBranches((b) => Math.max(1, b - 1))}
              disabled={branches <= 1}
              aria-label="Şube sayısını azalt"
              className="grid size-9 place-items-center rounded-lg text-ink transition-colors hover:bg-surface-2 disabled:opacity-35 disabled:hover:bg-transparent"
            >
              <Minus className="size-4" strokeWidth={2.4} aria-hidden />
            </button>
            <span
              className="w-12 text-center font-display text-xl font-extrabold tabnum text-ink"
              aria-live="polite"
              aria-label={`${branches} şube`}
            >
              {branches}
            </span>
            <button
              type="button"
              onClick={() => setBranches((b) => Math.min(30, b + 1))}
              disabled={branches >= 30}
              aria-label="Şube sayısını artır"
              className="grid size-9 place-items-center rounded-lg text-ink transition-colors hover:bg-surface-2 disabled:opacity-35"
            >
              <Plus className="size-4" strokeWidth={2.4} aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 5, 6].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setBranches(n)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                branches === n
                  ? "bg-sage-wash-2 text-sage-ink ring-1 ring-sage/35"
                  : "bg-surface text-muted ring-1 ring-line hover:text-ink",
              )}
            >
              {n} şube
            </button>
          ))}
        </div>
      </div>

      {/* tutar */}
      <div className="px-6 py-7 sm:px-7">
        <div className="flex items-end gap-2">
          <span className="font-display text-5xl font-extrabold tabnum leading-none text-ink">
            {tl(monthly)} ₺
          </span>
          <span className="pb-1 text-sm text-muted">/ ay + KDV</span>
        </div>

        <p className="mt-3 text-sm text-muted">
          {branches === 1 ? (
            <>Tek şube: {tl(PRICING.firstBranch)} ₺</>
          ) : (
            <>
              İlk şube {tl(PRICING.firstBranch)} ₺ + {branches - 1} ek şube ×{" "}
              {tl(PRICING.extraBranch)} ₺{" "}
              <span className="text-sage-ink">(%{PRICING.extraBranchDiscountPct} indirimli)</span>
            </>
          )}
        </p>

        {/* iki odeme yolu */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-card bg-surface-2 p-4 ring-1 ring-line">
            <p className="text-xs font-medium text-faint">Aylık ödeme, ilk yıl</p>
            <p className="mt-1.5 font-display text-lg font-bold tabnum text-ink">
              {tl(monthlyPath)} ₺
            </p>
            <p className="mt-1 text-xs leading-snug text-faint">
              12 ay + şube başına {tl(PRICING.setupPerBranch)} ₺ kurulum
            </p>
          </div>
          <div className="relative rounded-card bg-sage-wash p-4 ring-1 ring-sage/30">
            <span className="absolute -top-2.5 right-3 rounded-full bg-sage px-2 py-0.5 font-display text-[0.625rem] font-bold text-ink-deep">
              %{savings} avantaj
            </span>
            <p className="text-xs font-medium text-sage-ink">Yıllık peşin, ilk yıl</p>
            <p className="mt-1.5 font-display text-lg font-bold tabnum text-sage-ink">
              {tl(annual)} ₺
            </p>
            <p className="mt-1 text-xs leading-snug text-sage-ink">
              Kurulum ücreti alınmaz
            </p>
          </div>
        </div>

        {/* cok subede rakip kiyasi */}
        {branches >= 2 ? (
          <div className="mt-5 rounded-card bg-amber-wash p-4 ring-1 ring-amber/20">
            <p className="text-sm leading-relaxed text-ink">
              <strong className="font-semibold">{branches} şubede</strong> aylık{" "}
              <strong className="font-semibold tabnum">{tl(monthly)} ₺</strong> ödersiniz.
              OxyFitClub'ın yayınlanmış App Start liste fiyatlarıyla aynı kurulum{" "}
              <strong className="font-semibold tabnum">{tl(rival)} ₺</strong> ederdi, yani{" "}
              <strong className="font-semibold text-sage-ink">%{cheaperPct} daha ucuz</strong>.
            </p>
            <p className="mt-2.5 flex items-start gap-1.5 text-[0.6875rem] leading-snug text-faint">
              <Info className="mt-px size-3.5 shrink-0" strokeWidth={2} aria-hidden />
              {RIVAL_MULTI_BRANCH.note}
            </p>
          </div>
        ) : null}

        {!compact ? (
          <ul className="mt-6 grid gap-2 border-t border-line pt-5 sm:grid-cols-2">
            {INCLUDED.map((x) => (
              <li key={x} className="flex items-start gap-2 text-sm text-muted">
                <Check className="mt-0.5 size-3.5 shrink-0 text-sage" strokeWidth={2.8} aria-hidden />
                {x}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button href="/demo" size="lg" className="flex-1">
            Demo İste
          </Button>
          <Button href="/fiyat" variant="secondary" size="lg" className="flex-1">
            Fiyat ayrıntısı
          </Button>
        </div>
        <p className="mt-4 text-center text-xs text-faint">
          {PRICING.vatNote} {PRICING.trialDays} gün ücretsiz deneme, kredi kartı istemiyoruz.
        </p>
      </div>
    </div>
  );
}
