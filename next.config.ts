import type { NextConfig } from "next";

/**
 * Guvenlik basliklari v1 denetiminin D-14 bulgusudur: o kurulumda vercel.json
 * yoktu ve platformun HSTS'i disinda hicbir baslik gitmiyordu. Burada baslıklar
 * uygulamanin kendisinden gonderiliyor, yani hangi platforma cikarsa ciksin
 * birlikte tasiniyor.
 *
 * Statik varliklar (D-04): /fonts ve /product altindaki dosyalar icerik-adresli
 * degil, o yuzden immutable yerine uzun max-age + revalidate veriyoruz.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/product/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
