import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Assistant } from "@/components/layout/Assistant";
import { SITE, CONTACT } from "@/content/site";
import { PRICING } from "@/content/pricing";
import { DEPLOY_STAGE } from "@/lib/stage";

/**
 * Uc katmanin ucuncusu: HTML sayfalarindaki robots meta etiketi. Deger
 * `next.config.ts` ve `src/app/robots.ts` ile ayni `deployStage`'den gelir;
 * alan adi baglandigi gun (M7 F7.5) ucu birden kendiliginden acilir.
 */
const isPublished = DEPLOY_STAGE === "production";

/**
 * Kendi Umami kurulumu (M7 F7.4) — v1'in de saydigi `umami.kiwiailab.com`.
 * Alan adi gecisinde olcum gecmisi tek kurulumda kalsin diye Cloud degil
 * (`docs/DECISIONS.md` 2026-09-13). Cerezsiz ve kimlik tanimlamayan olcum;
 * riza bandi gerekmez (yasal metin TASK-1.10, kendi kuruluma hizasi TASK-1.15).
 *
 * Betik adresi sir degil ve ortamdan bagimsiz (tek kurulum) — env degil sabit.
 * Site kimligi env'den gelir: ayni kurulumda v2'nin KENDI site kaydi var, v1'in
 * `alpfitplus.com` kaydinin kimligi burada kullanilmaz (v1'in sayilarini kirletir).
 *
 * Anahtar SIR DEGILDIR — `data-website-id` zaten sayfa kaynaginda gorunur.
 * Bos/tanimsizken etiket HIC render edilmez: yerel gelistirmede gurultu olmaz
 * ve anahtar bir ortamda unutulursa panele sahte trafik dusmez. `.trim()`
 * bilincli: Vercel'de bos string tanimlamak `undefined` ile ayni sonucu versin.
 *
 * `data-tag` ortami ayirir ve ayni `deployStage`den gelir — noindex ve lead
 * `env` alani da oradan okur, ucuncu bir ortam kavrami dogmaz.
 *
 * `data-domains` KULLANILMAZ — v1'den bilincli fark: v1 yalniz canli alan adini
 * sayar; v2 bugun yalniz onizleme adresinde yasiyor ve orada da saymali. Yerel
 * ve onizleme trafigi alan adiyla kesilmez, `data-tag` ile ayrilir.
 */
const UMAMI_SCRIPT_SRC = "https://umami.kiwiailab.com/script.js";
const umamiWebsiteId = (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "").trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Spor Kulübü Yönetim Yazılımı`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "spor salonu yönetim programı",
    "spor kulübü yazılımı",
    "pilates stüdyo yazılımı",
    "reformer randevu programı",
    "üye takip programı",
    "grup dersi rezervasyon sistemi",
    "çok şubeli spor salonu yazılımı",
  ],
  authors: [{ name: SITE.maker.name, url: SITE.maker.url }],
  creator: SITE.maker.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: isPublished, follow: isPublished },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#fbfbf9",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}#org`,
      name: SITE.maker.name,
      url: SITE.maker.url,
      address: { "@type": "PostalAddress", addressLocality: "Tuzla", addressRegion: "İstanbul", addressCountry: "TR" },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+90-535-937-59-55",
          contactType: "sales",
          email: CONTACT.sales,
          areaServed: "TR",
          availableLanguage: "Turkish",
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE.url}#app`,
      name: SITE.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      description: SITE.description,
      inLanguage: "tr-TR",
      publisher: { "@id": `${SITE.url}#org` },
      offers: {
        "@type": "Offer",
        price: String(PRICING.firstBranch),
        priceCurrency: "TRY",
        description: `Şube başına aylık, KDV hariç. ${PRICING.trialDays} gün ücretsiz deneme.`,
        url: `${SITE.url}/fiyat`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}#site`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: "tr-TR",
      publisher: { "@id": `${SITE.url}#org` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        {/* Ilk ekranda gorunen iki yuz: govde (Inter 400) ve baslik (Sora 800). */}
        <link rel="preload" href="/fonts/inter-400-tr.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/sora-800-tr.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2.5 focus:font-display focus:text-sm focus:font-bold focus:shadow-lg focus:ring-2 focus:ring-sage-deep"
        >
          İçeriğe geç
        </a>
        <Header />
        <main id="icerik">{children}</main>
        <Footer />
        <Assistant />
        {/* `afterInteractive`: olcum LCP'yi geciktirmez (QUALITY 4). */}
        {umamiWebsiteId ? (
          <Script
            src={UMAMI_SCRIPT_SRC}
            strategy="afterInteractive"
            data-website-id={umamiWebsiteId}
            data-tag={DEPLOY_STAGE}
          />
        ) : null}
      </body>
    </html>
  );
}
