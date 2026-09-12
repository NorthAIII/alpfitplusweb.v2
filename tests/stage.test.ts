import { describe, expect, it } from "vitest";

import { deriveDeployStage } from "@/lib/stage";

// TASK-1.01'de elle (Node tip soyma, scratchpad betigi) kostugu bes senaryo;
// bu dosya onlari kalici hale getirir (TASK-1.16). Kaynak: tasks/archive/TASK-1.01.md
// -> Test Sonuclari.
describe("deriveDeployStage", () => {
  it("VERCEL tanimsizken local doner", () => {
    expect(deriveDeployStage({})).toBe("local");
  });

  it("uretim alani hala .vercel.app ise preview doner (ara hal)", () => {
    expect(
      deriveDeployStage({
        VERCEL: "1",
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "alpfitplus-web-v2.vercel.app",
      }),
    ).toBe("preview");
  });

  it("uretim alani gercek alan adiysa production doner", () => {
    expect(
      deriveDeployStage({
        VERCEL: "1",
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "alpfitplus.com",
      }),
    ).toBe("production");
  });

  it("VERCEL_ENV=preview (dal onizlemesi) preview doner", () => {
    expect(deriveDeployStage({ VERCEL: "1", VERCEL_ENV: "preview" })).toBe("preview");
  });

  it("alan adi env'i tanimsizken fail-safe olarak preview doner", () => {
    expect(deriveDeployStage({ VERCEL: "1", VERCEL_ENV: "production" })).toBe("preview");
  });
});
