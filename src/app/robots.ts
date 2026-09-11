import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { DEPLOY_STAGE } from "@/lib/stage";

/**
 * Uretim disinda tek kural: her sey kapali. Sitemap ve host satirlari da duser
 * — acik birakilan bir sitemap tarayiciyi gezmeye cagirir. Uc katmanin ikincisi;
 * digerleri `next.config.ts` (X-Robots-Tag) ve `src/app/layout.tsx` (meta).
 */
export default function robots(): MetadataRoute.Robots {
  if (DEPLOY_STAGE !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
