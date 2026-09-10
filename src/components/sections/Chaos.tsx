import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Bugun nasil yonetiliyor" bolumu.
 *
 * Kart izgarasi yerine araclarin KENDISI sahneleniyor: WhatsApp mesaji, Excel
 * tablosu, defter sayfasi ve takvim. Hikaye zaten bu dort nesne; jenerik ikon
 * koymak yerine nesneleri cizmek anlatiyi tek bakista okutuyor.
 *
 * Nesneler foto-gercekci degil, stilize: dogru siluet ve dogru renk, hafif
 * egim, yumusak golge, ust uste binme.
 */

export function Chaos() {
  return (
    <section id="sorun" className="relative overflow-hidden bg-canvas-soft py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50 mask-fade-y"
        aria-hidden
      />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-16">
          {/* ── anlati ── */}
          <div>
            <SectionLabel>Bugün nasıl yönetiliyor</SectionLabel>
            <h2 className="mt-4 text-3xl leading-[1.12] sm:text-4xl lg:text-[2.6rem]">
              Kulübünüzün asıl rakibi bir yazılım değil,{" "}
              <span className="text-gradient-sage">dağınıklık</span>
            </h2>

            <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-muted">
              <p>
                Randevu WhatsApp'ta. Ciro Excel'de. Ölçüm defterde. Üye listesi başka
                yerde. Elinizdeki yazılım da yalnızca takvim tutuyor.
              </p>
              <p>
                Dördü de tek başına çalışıyor. Sorun şu ki hiçbiri birbiriyle konuşmuyor.
              </p>
            </div>

            <ul className="mt-8 flex flex-col divide-y divide-line border-y border-line">
              {[
                ["Çift kayıt", "Aynı bilgi üç yere yazılıyor, üçü de farklı."],
                ["Kaçan randevu", "İptal WhatsApp'ta kalıyor, yer kimseye gitmiyor."],
                ["Gün sonu mutabakatı", "Kasa ile tablo tutmuyor, akşam saat kaybı."],
                ["Görünmeyen boş kapasite", "Hangi saat atıl, kimse rakamla bilmiyor."],
              ].map(([t, d]) => (
                <li key={t} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-baseline sm:gap-5">
                  <span className="font-display text-[0.9375rem] font-bold text-ink sm:w-56 sm:shrink-0">
                    {t}
                  </span>
                  <span className="text-[0.9375rem] text-muted">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── daginik masa ── */}
          <Reveal>
            <div aria-hidden>
            {/*
              Yerlesim mutlak konumlandirma DEGIL, 2x2 izgara.
              Mutlak konumda kart yukseklikleri icerikten geliyordu ve
              nesneler birbirini ortuyordu (olculdu: iki turda da bindi).
              Izgara binmeyi yapisal olarak imkansiz kiliyor; dagimiklik
              hissi kucuk egim ve dikey kaydirmayla veriliyor.
            */}
            <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-x-5 gap-y-7 sm:max-w-xl lg:max-w-none lg:gap-x-7 lg:gap-y-9">
              <div className="-rotate-[3deg] translate-y-1">
                <Whatsapp />
              </div>
              <div className="rotate-[2.5deg] -translate-y-2">
                <Sheet />
              </div>
              <div className="rotate-[2deg] self-start">
                <Notebook />
              </div>
              <div className="-rotate-[3deg] translate-y-2 self-start">
                <CalendarApp />
              </div>
            </div>

            </div>
            <p className="mt-7 text-center text-sm text-faint lg:text-right">
              Bir kulübün bugün gerçekten kullandığı dört araç
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ────────────────────────── nesneler ────────────────────────── */

function Paper({
  className,
  children,
  tone = "white",
}: {
  className?: string;
  children: React.ReactNode;
  tone?: "white" | "cream" | "dark";
}) {
  const tones = {
    white: "bg-white ring-black/8",
    cream: "bg-[#fdfaf1] ring-black/8",
    dark: "bg-[#0f1511] ring-black/20",
  } as const;
  return (
    <div
      className={`overflow-hidden rounded-xl shadow-lg ring-1 transition-transform duration-500 hover:rotate-0 ${tones[tone]} ${className}`}
    >
      {children}
    </div>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`absolute z-20 whitespace-nowrap rounded-md bg-neg px-2 py-1 text-[0.625rem] font-semibold text-white shadow-md ${className}`}
    >
      {children}
    </span>
  );
}

function Whatsapp({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Tag className="-left-2 -top-2.5">iptal kayda geçmiyor</Tag>
      <Paper tone="dark">
        <div className="flex items-center gap-2 bg-[#1f2c34] px-3 py-2">
          <span className="grid size-6 place-items-center rounded-full bg-[#25D366]/25 text-[0.5rem] font-bold text-[#25D366]">
            SY
          </span>
          <span className="text-[0.6875rem] font-medium text-white/90">Sefa Y.</span>
          <span className="ml-auto text-[0.5rem] text-white/35">çevrimiçi</span>
        </div>
        <div className="flex flex-col gap-1.5 bg-[#0b141a] px-3 py-3">
          <span className="max-w-[85%] self-start rounded-lg rounded-tl-sm bg-[#1f2c34] px-2.5 py-1.5 text-[0.625rem] leading-snug text-white/85">
            Hocam yarın 11:00 dersine gelemeyeceğim
          </span>
          <span className="max-w-[85%] self-end rounded-lg rounded-tr-sm bg-[#005c4b] px-2.5 py-1.5 text-[0.625rem] leading-snug text-white/90">
            Tamam, hakkınızı yazayım
          </span>
          <span className="max-w-[85%] self-start rounded-lg rounded-tl-sm bg-[#1f2c34] px-2.5 py-1.5 text-[0.625rem] leading-snug text-white/85">
            Kaç seansım kaldı acaba?
          </span>
          <span className="mt-1 self-end text-[0.5rem] text-white/30">09:14</span>
        </div>
      </Paper>
    </div>
  );
}

function Sheet({ className }: { className?: string }) {
  const rows = [
    ["Sefa Y.", "PT 10", "8.000", "ödendi"],
    ["Ege K.", "Reformer", "6.500", "kaldı"],
    ["Deniz A.", "PT 10", "8.000", "?"],
    ["Tolga B.", "Boks", "4.200", "ödendi"],
    ["Merve A.", "Reformer", "6.500", "kaldı"],
  ];
  return (
    <div className={`relative ${className}`}>
      <Tag className="-right-2 -top-2.5">tek kişi biliyor</Tag>
      <Paper>
        <div className="flex items-center gap-1.5 border-b border-black/8 bg-[#f3f4f1] px-2.5 py-1.5">
          <span className="size-2 rounded-full bg-black/12" />
          <span className="size-2 rounded-full bg-black/12" />
          <span className="text-[0.5625rem] font-medium text-black/45">uyeler-haziran.xlsx</span>
        </div>
        <table className="w-full border-collapse text-[0.5625rem]">
          <thead>
            <tr className="bg-[#f7f8f4] text-black/40">
              {["Üye", "Paket", "Tutar", "Durum"].map((h) => (
                <th key={h} className="border border-black/6 px-1.5 py-1 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabnum text-black/70">
            {rows.map((r, i) => (
              <tr key={r[0]} className={i % 2 ? "bg-black/[0.015]" : ""}>
                {r.map((c, j) => (
                  <td
                    key={j}
                    className={`border border-black/6 px-1.5 py-1 ${
                      c === "?" ? "bg-[#fceeec] font-semibold text-neg" : ""
                    }`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-[#f7f8f4] font-semibold">
              <td className="border border-black/6 px-1.5 py-1" colSpan={2}>
                TOPLAM
              </td>
              <td className="border border-black/6 px-1.5 py-1 text-neg">#DEĞER!</td>
              <td className="border border-black/6 px-1.5 py-1" />
            </tr>
          </tbody>
        </table>
      </Paper>
    </div>
  );
}

function Notebook({ className }: { className?: string }) {
  const lines = [
    ["Salı 09:00 grup", "6 kişi geldi"],
    ["Ege K. ölçüm", "bel 74 → 71"],
    ["Tolga aidat", "?? sordum"],
    ["Cuma reformer", "2 boş kaldı"],
  ];
  return (
    <div className={`relative ${className}`}>
      <Tag className="-bottom-2.5 -left-2">rapora dönmüyor</Tag>
      <Paper tone="cream">
        <div className="relative px-4 py-3.5">
          {/* cizgili kagit */}
          <span
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_19px,rgba(23,26,21,.09)_19px,rgba(23,26,21,.09)_20px)]"
            aria-hidden
          />
          <span className="pointer-events-none absolute inset-y-0 left-6 w-px bg-[#e0796f]/35" aria-hidden />
          <p className="relative mb-2 pl-4 font-display text-[0.625rem] font-bold text-black/45">
            HAZİRAN — YOKLAMA
          </p>
          <ul className="relative flex flex-col gap-[7px] pl-4">
            {lines.map(([a, bText]) => (
              <li key={a} className="flex items-baseline justify-between gap-2 text-[0.625rem] leading-5 text-black/65 italic">
                <span>{a}</span>
                <span className="text-black/40">{bText}</span>
              </li>
            ))}
          </ul>
        </div>
      </Paper>
    </div>
  );
}

function CalendarApp({ className }: { className?: string }) {
  // Gunlere yerlestirilmis ders adlari — bos bir isi haritasi degil, gercek
  // bir takvim uygulamasi gibi okunsun diye.
  const events: Record<number, string> = {
    3: "PT", 5: "Grup", 8: "PT", 11: "Reformer",
    13: "Grup", 16: "PT", 19: "Reformer", 24: "PT",
  };
  return (
    <div className={`relative ${className}`}>
      <Tag className="-bottom-2.5 -right-2">ciro yok</Tag>
      <Paper>
        <div className="flex items-baseline justify-between border-b border-black/8 px-3 py-2">
          <p className="text-[0.625rem] font-semibold text-black/60">Haziran 2026</p>
          <p className="text-[0.5rem] text-black/30">Takvim</p>
        </div>
        <div className="px-2.5 pb-2.5 pt-2">
          <div className="grid grid-cols-7 gap-[2px] pb-1 text-center text-[0.4375rem] font-medium text-black/30">
            {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-[2px]">
            {Array.from({ length: 28 }).map((_, i) => {
              const ev = events[i];
              return (
                <span
                  key={i}
                  className={`flex aspect-square flex-col items-center justify-center rounded-[3px] text-[0.4375rem] leading-none ${
                    ev === "Grup"
                      ? "bg-amber/25 text-amber"
                      : ev
                        ? "bg-sage/25 text-sage-ink"
                        : "bg-black/4 text-black/25"
                  }`}
                >
                  <span className="font-medium">{i + 1}</span>
                  {ev ? <span className="mt-px scale-[0.85] font-semibold">{ev}</span> : null}
                </span>
              );
            })}
          </div>
        </div>
      </Paper>
    </div>
  );
}
