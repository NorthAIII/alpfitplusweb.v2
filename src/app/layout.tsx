import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Assistant } from "@/components/layout/Assistant";
import { SITE, CONTACT } from "@/content/site";
import { PRICING } from "@/content/pricing";

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
  robots: { index: true, follow: true },
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
      </body>
    </html>
  );
}
