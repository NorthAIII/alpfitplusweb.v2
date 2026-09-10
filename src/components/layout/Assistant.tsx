"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, MessagesSquare, X } from "lucide-react";
import { LogoMark } from "./Logo";
import { CONTACT } from "@/content/site";
import {
  CHAT_INTRO,
  CHAT_ROOT,
  CHAT_TOPICS,
  topicById,
  type ChatTopic,
} from "@/content/chat";
import { cn } from "@/lib/cn";

type Msg =
  | { role: "bot"; lines: string[]; links?: ChatTopic["links"] }
  | { role: "user"; text: string };

/**
 * Site asistani.
 *
 * Bugun MODEL YOK: cevaplar src/content/chat.ts agacindan geliyor, yani
 * sitedeki dogrulanmis iddialarla ayni sinirda ve uydurma riski sifir.
 * Ileride ayni panel bir /api/chat ucuna baglanacak — mesaj listesi, yazma
 * gostergesi ve yedek cevap zaten o akisa gore kuruldu, arayuz ikinci kez
 * yazilmayacak.
 */
export function Assistant() {
  const [open, setOpen] = useState(false);
  const [showFabs, setShowFabs] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", lines: CHAT_INTRO }]);
  const [chips, setChips] = useState<string[]>(CHAT_ROOT);
  const [typing, setTyping] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowFabs(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  function ask(id: string) {
    const topic = topicById(id);
    if (!topic) return;
    setMsgs((m) => [...m, { role: "user", text: topic.q }]);
    setChips([]);
    setTyping(true);
    // Kisa gecikme: cevap aninda belirirse okunmadan kayiyor.
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "bot", lines: topic.a, links: topic.links }]);
      setChips(topic.next?.length ? topic.next : CHAT_ROOT.filter((r) => r !== id));
    }, 420);
  }

  function reset() {
    setMsgs([{ role: "bot", lines: CHAT_INTRO }]);
    setChips(CHAT_ROOT);
  }

  return (
    <>
      {/* ── yuzen dugmeler ── */}
      <div
        className={cn(
          "fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 transition-all duration-300",
          showFabs || open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        {!open ? (
          <a
            href={CONTACT.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp'tan yazın"
            className="group grid size-13 place-items-center rounded-full bg-[#25D366] text-[#06331a] shadow-lg transition-transform duration-200 hover:scale-105"
          >
            <span className="relative grid place-items-center">
              <span className="absolute size-6 rounded-full bg-[#06331a]/25 animate-pulse-ring" aria-hidden />
              <MessageCircle className="relative size-6" strokeWidth={2} aria-hidden />
            </span>
          </a>
        ) : null}

        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="asistan-panel"
          aria-label={open ? "Asistanı kapat" : "Asistana sor"}
          className={cn(
            "inline-flex h-13 items-center gap-2.5 rounded-full pl-4 pr-4 shadow-xl ring-1 transition-transform duration-200 hover:scale-[1.03] sm:pr-5",
            // Acikken panel koyu bir bolumun ustune denk gelebiliyor ve
            // ink-deep dugme zemine karisiyordu (olculdu). Acik durumda
            // acik zeminli varyanta gecer, iki halde de gorunur kalir.
            open
              ? "bg-surface text-ink ring-line-2"
              : "bg-ink-deep text-canvas ring-white/15",
          )}
        >
          {open ? (
            <X className="size-5.5" strokeWidth={2} aria-hidden />
          ) : (
            <MessagesSquare className="size-5.5 text-sage-br" strokeWidth={1.9} aria-hidden />
          )}
          <span className="hidden font-display text-sm font-bold sm:inline">
            {open ? "Kapat" : "Sorunuz mu var?"}
          </span>
        </button>
      </div>

      {/* ── panel ── */}
      {open ? (
        <div
          ref={panelRef}
          id="asistan-panel"
          role="dialog"
          aria-label="Alpfit Plus asistanı"
          className="fixed inset-x-3 bottom-24 z-40 flex max-h-[min(34rem,calc(100dvh-8rem))] flex-col overflow-hidden rounded-lg bg-surface shadow-xl ring-1 ring-line sm:inset-x-auto sm:right-5 sm:w-96"
        >
          {/* baslik */}
          <div className="flex items-center gap-3 border-b border-line bg-ink-deep px-4 py-3.5 text-canvas">
            <LogoMark className="size-9" id="asis" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold">Alpfit Plus Asistanı</p>
              <p className="flex items-center gap-1.5 text-[0.6875rem] text-canvas/60">
                <span className="size-1.5 rounded-full bg-sage" aria-hidden />
                Genelde birkaç dakika içinde dönüyoruz
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg px-2 py-1 text-[0.6875rem] text-canvas/55 transition-colors hover:bg-white/10 hover:text-canvas"
            >
              Baştan
            </button>
          </div>

          {/* akis */}
          <div ref={feedRef} className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3">
              {msgs.map((m, i) =>
                m.role === "bot" ? (
                  <div key={i} className="flex flex-col gap-2">
                    {m.lines.map((l, j) => (
                      <p
                        key={j}
                        className="max-w-[92%] self-start rounded-xl rounded-tl-sm bg-surface-2 px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-ink ring-1 ring-line"
                      >
                        {l}
                      </p>
                    ))}
                    {m.links?.length ? (
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {m.links.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-sage-wash px-3 py-1.5 text-xs font-medium text-sage-ink ring-1 ring-sage/25 transition-colors hover:bg-sage-wash-2"
                          >
                            {l.label}
                            <ArrowRight className="size-3.5" strokeWidth={2.4} aria-hidden />
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p
                    key={i}
                    className="max-w-[88%] self-end rounded-xl rounded-tr-sm bg-sage px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-ink-deep"
                  >
                    {m.text}
                  </p>
                ),
              )}

              {typing ? (
                <span
                  className="inline-flex w-fit gap-1 self-start rounded-xl rounded-tl-sm bg-surface-2 px-3.5 py-3 ring-1 ring-line"
                  aria-label="Yazıyor"
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 animate-bounce rounded-full bg-faint"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </span>
              ) : null}
            </div>
          </div>

          {/* secenekler */}
          <div className="border-t border-line bg-surface-2 px-4 py-3.5">
            {chips.length ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {chips.map((id) => {
                  const t = CHAT_TOPICS.find((x) => x.id === id);
                  if (!t) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => ask(id)}
                      className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink ring-1 ring-line-2 transition-colors hover:bg-sage-wash hover:text-sage-ink hover:ring-sage/35"
                    >
                      {t.q}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <a
              href={CONTACT.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 font-display text-[0.8125rem] font-bold text-[#06331a] transition-[filter] hover:brightness-[1.05]"
            >
              <MessageCircle className="size-4" strokeWidth={2.2} aria-hidden />
              Aradığınızı bulamadınız mı? WhatsApp'tan yazın
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
