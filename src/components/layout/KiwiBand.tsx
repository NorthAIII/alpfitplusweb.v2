import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/content/site";

/**
 * Uretici imzasi.
 *
 * BRIEF.md'de imza "footer'da ince, kucuk" olarak kilitlenmisti; kurucu
 * 2026-09-10'da bunu buyutmek istedi. Yine de es-marka olmuyor: kendi bandi
 * var ama Alpfit Plus'in ustune cikmiyor, hero'da ve header'da gorunmuyor.
 * Amaç guven: salon uye saglik verisini emanet ederken "arkasinda kim var"
 * sorusunun cevabi gorunur olsun.
 */

const MARK_ID = "kiwi-band";

function KiwiMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${MARK_ID}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8D96F" />
          <stop offset="100%" stopColor="#5E9A3E" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="21" fill="none" stroke={`url(#${MARK_ID}-g)`} strokeWidth="2" />
      <circle cx="22" cy="22" r="7.5" fill={`url(#${MARK_ID}-g)`} />
      {/* cekirdekler */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <circle
          key={deg}
          cx={22 + 13 * Math.cos((deg * Math.PI) / 180)}
          cy={22 + 13 * Math.sin((deg * Math.PI) / 180)}
          r="1.9"
          fill={`url(#${MARK_ID}-g)`}
          opacity="0.75"
        />
      ))}
    </svg>
  );
}

export function KiwiBand() {
  return (
    <section className="relative overflow-hidden border-t border-white/8 bg-[#0a0c08]">
      <div
        className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(40%_90%_at_15%_50%,rgba(148,208,142,.14),transparent_70%)]"
        aria-hidden
      />
      <Container className="relative">
        <div className="flex flex-col items-start gap-7 py-10 sm:flex-row sm:items-center sm:justify-between sm:py-11">
          <div className="flex items-center gap-5">
            <KiwiMark className="size-12 shrink-0" />
            <div>
              <p className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-sage-br">
                Bir {SITE.maker.name} çözümüdür
              </p>
              <p className="mt-1.5 max-w-md text-[0.9375rem] leading-relaxed text-canvas/60">
                Alpfit Plus'ı geliştiren ekip, İstanbul'da yapay zekâ ve yazılım
                üreten bir stüdyodur. Verinizi emanet ettiğiniz şirket budur.
              </p>
            </div>
          </div>

          <a
            href={SITE.maker.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white/8 px-5 py-3 font-display text-sm font-bold text-canvas ring-1 ring-white/15 transition-colors hover:bg-white/14 hover:ring-white/30"
          >
            {SITE.maker.name}'i tanıyın
            <ArrowUpRight className="size-4" strokeWidth={2.2} aria-hidden />
          </a>
        </div>
      </Container>
    </section>
  );
}
