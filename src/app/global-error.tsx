"use client";

/**
 * Kok hata siniri. Kok layout'un YERINE gecer, o yuzden kendi <html> ve <body>
 * etiketlerini tasir ve yonlendirici baglami isteyen hicbir bilesen kullanmaz
 * (Header usePathname cagiriyor — burada render edilemez).
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#fbfbf9",
          color: "#171a15",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p style={{ fontSize: "2.5rem", fontWeight: 800, color: "#dfeddd", margin: 0 }}>Hata</p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "8px 0 0" }}>
            Beklenmedik bir sorun oluştu
          </h1>
          <p style={{ margin: "16px 0 0", lineHeight: 1.7, color: "#545b4d" }}>
            Sayfayı yeniden yüklemeyi deneyebilirsiniz. Sorun sürerse WhatsApp'tan yazın,
            hemen ilgilenelim.
          </p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            <button
              onClick={reset}
              style={{
                background: "#74b36f",
                color: "#0e100c",
                border: 0,
                borderRadius: "12px",
                padding: "12px 22px",
                fontWeight: 700,
                fontSize: "0.9375rem",
                cursor: "pointer",
              }}
            >
              Tekrar dene
            </button>
            <a
              href="/"
              style={{
                background: "#fff",
                color: "#171a15",
                border: "1px solid #d3d7ca",
                borderRadius: "12px",
                padding: "12px 22px",
                fontWeight: 700,
                fontSize: "0.9375rem",
                textDecoration: "none",
              }}
            >
              Ana sayfa
            </a>
            <a
              href="https://wa.me/905359375955"
              style={{
                background: "#25d366",
                color: "#06331a",
                borderRadius: "12px",
                padding: "12px 22px",
                fontWeight: 700,
                fontSize: "0.9375rem",
                textDecoration: "none",
              }}
            >
              WhatsApp
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
