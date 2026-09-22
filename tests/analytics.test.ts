import { afterEach, describe, expect, it, vi } from "vitest";

import { track } from "@/lib/analytics";

// vitest.config.ts environment "node" -- `window` varsayilan olarak yok.
// TASK-1.08: track() Umami tanimsizken/window yokken hata FIRLATMAMALI --
// donusum akisi analitige bagimli olmamali.
describe("track", () => {
  afterEach(() => {
    // @ts-expect-error -- testte eklenen global, gercek ortamda hic yok
    delete globalThis.window;
  });

  it("window tanimsizken (sunucu tarafi) sessizce doner, hata firlatmaz", () => {
    expect(() => track("demo-submit", "demo-form")).not.toThrow();
  });

  it("window var ama umami yoksa (reklam engelleyici) sessizce doner", () => {
    // @ts-expect-error -- testte kismi bir window kuruluyor
    globalThis.window = {};
    expect(() => track("demo-submit", "demo-form")).not.toThrow();
  });

  it("umami varsa olay adi + { surface } ile cagrilir, baska veri gitmez", () => {
    const umamiTrack = vi.fn();
    // @ts-expect-error -- testte kismi bir window kuruluyor
    globalThis.window = { umami: { track: umamiTrack } };

    track("whatsapp", "hero");

    expect(umamiTrack).toHaveBeenCalledTimes(1);
    expect(umamiTrack).toHaveBeenCalledWith("whatsapp", { surface: "hero" });
  });
});
