import { afterEach, describe, expect, it } from "vitest";

import { resolveSurface } from "@/components/layout/ClickTracker";
import { SURFACES } from "@/lib/analytics";

// vitest.config.ts environment "node" -- gercek DOM yok. `resolveSurface`
// yalniz `Element.closest()` ve `window.location.pathname` okur; ikisi de
// asagida elle sahtelenir (analytics.test.ts'teki `window` deseniyle ayni).
function fakeAnchor(opts: { dataSurface?: string; sectionId?: string }): Element {
  const fake = {
    closest(selector: string) {
      if (selector === "[data-surface]" && opts.dataSurface !== undefined) {
        return { dataset: { surface: opts.dataSurface } };
      }
      if (selector === "section[id]" && opts.sectionId !== undefined) {
        return { id: opts.sectionId };
      }
      return null;
    },
  };
  // Minimal sahte -- `resolveSurface` yalniz `.closest()` cagirir, gercek
  // `Element` arayuzunun gerisi testte kullanilmaz.
  return fake as unknown as Element;
}

function withPath(pathname: string, run: () => void) {
  // @ts-expect-error -- testte eklenen global, gercek ortamda hic yok
  globalThis.window = { location: { pathname } };
  try {
    run();
  } finally {
    // @ts-expect-error -- testte eklenen global, gercek ortamda hic yok
    delete globalThis.window;
  }
}

describe("resolveSurface", () => {
  afterEach(() => {
    // @ts-expect-error -- testte eklenen global, gercek ortamda hic yok
    delete globalThis.window;
  });

  it("en yakin [data-surface] atasini kullanir", () => {
    withPath("/", () => {
      const a = fakeAnchor({ dataSurface: "hero", sectionId: "fiyat" });
      expect(resolveSurface(a)).toBe("hero");
    });
  });

  it("[data-surface] yoksa en yakin section[id]'e duser", () => {
    withPath("/", () => {
      const a = fakeAnchor({ sectionId: "fiyat" });
      expect(resolveSurface(a)).toBe("fiyat");
    });
  });

  it("ikisi de yoksa sayfa yolundan turetir (sozlukte varsa)", () => {
    withPath("/demo", () => {
      const a = fakeAnchor({});
      expect(resolveSurface(a)).toBe(SURFACES.demo);
    });
  });

  it("data-surface degeri sozlukte yoksa SURFACES.other'a duser (cop ad birikmez)", () => {
    withPath("/", () => {
      const a = fakeAnchor({ dataSurface: "icat-edilmis-yuzey" });
      expect(resolveSurface(a)).toBe(SURFACES.other);
    });
  });

  it("hicbir kaynak eslesmezse SURFACES.other'a duser", () => {
    withPath("/segmentler/pilates-reformer", () => {
      const a = fakeAnchor({});
      expect(resolveSurface(a)).toBe(SURFACES.other);
    });
  });
});
