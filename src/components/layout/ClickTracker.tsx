"use client";

import { useEffect } from "react";
import { EVENTS, SURFACES, track, type Surface } from "@/lib/analytics";

const KNOWN_SURFACES = new Set<string>(Object.values(SURFACES));

/**
 * En yakin `[data-surface]` atasindan, yoksa en yakin `section[id]`'den,
 * o da yoksa sayfa yolundan yuzeyi turetir (TASK-1.09). Turetilen deger
 * sozlukte (`SURFACES`) yoksa `SURFACES.other`'a duser -- olay yine
 * gonderilir, panelde cop ad birikmez.
 */
export function resolveSurface(anchor: Element): Surface {
  const fromAttr = anchor.closest<HTMLElement>("[data-surface]")?.dataset.surface;
  if (fromAttr && KNOWN_SURFACES.has(fromAttr)) return fromAttr as Surface;

  const fromSectionId = anchor.closest<HTMLElement>("section[id]")?.id;
  if (fromSectionId && KNOWN_SURFACES.has(fromSectionId)) return fromSectionId as Surface;

  const fromPath = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (fromPath && KNOWN_SURFACES.has(fromPath)) return fromPath as Surface;

  return SURFACES.other;
}

/**
 * TEK global tiklama dinleyicisi (TASK-1.09). Kodda 15 WhatsApp + 5 telefon
 * baglantisi (12 dosya) var; her birine tek tek `data-umami-event` koymak
 * yerine (research-phase karsilastirmasi) `layout.tsx` govdesinde bir kez
 * baglanir -- yeni eklenen her wa.me/tel: baglantisi otomatik sayilir
 * (QUALITY 9). Kisisel veri olaya girmez, yalniz yuzey adi gonderilir.
 *
 * Bubble (capture degil) + passive: WhatsApp baglantilarinin hepsi yeni
 * sekmede aciliyor, telefon `tel:` sayfayi terk etmiyor -- olay istegi hicbir
 * durumda kesilmez, `sendBeacon` gerekmez (Dikkat Noktalari, TASK-1.09).
 */
export function ClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("https://wa.me")) {
        track(EVENTS.whatsapp, resolveSurface(anchor));
      } else if (href.startsWith("tel:")) {
        track(EVENTS.phone, resolveSurface(anchor));
      }
    }

    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
