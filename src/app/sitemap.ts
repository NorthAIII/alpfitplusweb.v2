import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { SEGMENTS } from "@/content/segments";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" | "yearly",
  ) => ({ url: `${SITE.url}${path}`, lastModified: now, changeFrequency, priority });

  return [
    page("/", 1, "weekly"),
    page("/ozellikler", 0.9, "monthly"),
    page("/fiyat", 0.9, "monthly"),
    page("/segmentler", 0.8, "monthly"),
    ...SEGMENTS.map((s) => page(`/segmentler/${s.slug}`, 0.8, "monthly")),
    page("/demo", 0.9, "monthly"),
    page("/destek", 0.5, "yearly"),
    page("/kvkk", 0.3, "yearly"),
    page("/gizlilik", 0.3, "yearly"),
    page("/kullanim-kosullari", 0.3, "yearly"),
  ];
}
