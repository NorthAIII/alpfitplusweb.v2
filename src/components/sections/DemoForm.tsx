"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Loader2, MessageCircle, Send, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CONTACT, whatsappDraftHref } from "@/content/site";
import { SEGMENTS } from "@/content/segments";
import { cn } from "@/lib/cn";
import { SURFACES, track } from "@/lib/analytics";

type State = "idle" | "sending" | "ok" | "error";

// Gecersiz alanin GORSEL isareti (B-055 a): `aria-invalid="true"` alan 2 px
// `neg` halka + `neg-wash` zemin alir. Bugune kadar odakta OLMAYAN gecersiz
// alan ile gecerli alan 8 ozellikte, 4 genislikte tipatip ayniydi (`farklar:
// []`) -- hatanin tek gorsel ifadesi formun sonundaki kutuydu.
//
// Renk TEK isaret degildir (WCAG 1.4.1): alanin hemen altindaki hata metni
// ayni bilgiyi yazili tasir (-> Field, `<alan>-error`).
//
// Kontrast olculdu (STYLE-GUIDE gelenegi): hata metni #b34236 form zemini
// #f7f8f4 uzerinde 5.25 ve alan zemini #fceeec uzerinde 4.96 (esik 4.5);
// gecersiz alanin kendi metni #171a15 / #fceeec 15.55; kirmizi halka form
// zeminine karsi 5.25 (grafik esigi 3, mevcut gri halka yalnizca 1.46).
//
// `aria-invalid:focus:` ikili varyanttir (ozgulluk 0,2,0) ve odak halkasini
// kirmizinin USTUNDE tutar; tek varyantlarin ozgullugu esit oldugu icin
// yazilmazsa gecersiz alanda odak isareti gorunmez olurdu.
// `aria-invalid` varyantinin kendisi Tailwind'de yerlesik DEGILDIR --
// globals.css'te `@custom-variant` ile kayitli (gerekce orada).
const field =
  "w-full rounded-xl bg-surface px-4 py-3 text-[0.9375rem] text-ink ring-1 ring-line-2 " +
  "transition-shadow placeholder:text-faint/70 focus:outline-none focus:ring-2 focus:ring-sage-deep " +
  "aria-invalid:bg-neg-wash aria-invalid:ring-2 aria-invalid:ring-neg aria-invalid:focus:ring-sage-deep";

// Uctan donen `code` -> alan eslemesi (TASK-1.12, B-021). Ayni koda giren
// alanlar aynen isaretlenir; mesaj metni (hangi alanin bozuk oldugu) uctan
// gelir, burada tekrarlanmaz.
const FIELD_ERRORS: Record<string, readonly string[]> = {
  missing: ["name", "club"],
  "missing-contact": ["phone", "email"],
  "bad-contact": ["phone", "email"],
  "no-consent": ["consent"],
};

// Formun sonundaki OZET kutusu (role=alert). Alanlar artik bu kimligi degil
// kendi `<alan>-error` dugumlerini gosterir; kutu ozet olarak ve WhatsApp
// yolunu tasidigi icin yerinde kalir.
const ERROR_ID = "demo-form-error";
const CONSENT_ERROR_ID = "consent-error";

// Hangi alanlarin isaretlenecegi hata KODUNA ve alanin DOLULUGUNA baglidir
// (B-055 a + c). `bad-contact` kullanicinin doldurup BOZDUGU alandir -> dolu
// alanlar; `missing` / `missing-contact` / `no-consent` eksik olani ister ->
// BOS alanlar. Odak bu listenin ILKINE gider.
//
// Ayiklama sarttir, cunku FIELD_ERRORS bir kodun dokunabilecegi TUM alanlari
// sayar: ad doluyken kulup bossa `missing` ikisini birden isaretlerdi. Bu,
// isaret yalniz ekran okuyucuya gorunurken sessiz bir yanlislikti; gorsel
// isaretin eklendigi an (TASK-2.06) dogru doldurulmus alani da kirmiziya
// boyayan bir YANLIS ALARMA donusurdu -- `bad-contact`'ta da bos birakilan
// iletisim alani kirmizi olurdu.
//
// Yuklem TASK-2.05'in odak kuralindan devralindi (ayni `filled` testi), yani
// olculmus odak tablosu (54/54) birebir korunur: eski kural listenin ilk
// uygun elemanini seciyordu, yeni kural ayni listeyi filtreleyip ilkini alir.
// Alana eslenmeyen kod (no-sink, rate-limited) ve ag hatasi BOS liste doner:
// odak hata kutusuna tasinir.
function markedFieldsFor(
  code: string,
  fields: readonly string[],
  data: Record<string, FormDataEntryValue>,
): readonly string[] {
  if (fields.length === 0) return [];
  const filled = (name: string) => String(data[name] ?? "").trim().length > 0;
  const culprits = fields.filter((n) => (code === "bad-contact" ? filled(n) : !filled(n)));
  return culprits.length > 0 ? culprits : fields;
}

export function DemoForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [invalidFields, setInvalidFields] = useState<readonly string[]>([]);
  // Hata kutusundaki kurtarma baglantisinin adresi (TASK-3.25). Varsayilan
  // taban adrestir; YALNIZ uc 503 `no-sink` dondugunde on-doldurulmus surume
  // yukseltilir. Dar tutulmasinin gerekcesi: `no-sink` talebin HICBIR hedefe
  // yazilamadigi haldir, yani kullanicinin yazdiklari gercekten kaybolur ve
  // WhatsApp tek kurtarma yoludur. Dogrulama hatalarinda (`missing`,
  // `missing-contact`, `bad-contact`, `no-consent`) veri kaybolmaz -- alan
  // duzeltilip yeniden gonderilir; oraya on-doldurma koymak hicbir sey
  // kurtarmadan kisisel veriyi ucuncu tarafin adres satirina tasirdi.
  // `rate-limited` ve ag hatasi da bilincle disarida: ikisinde de form dolu
  // kalir ve tekrar denemek islerken, adresin kapsami kendiliginden genisler.
  const [recoveryHref, setRecoveryHref] = useState<string>(CONTACT.whatsapp.href);
  // Sonuc yuzeyi: basari kutusu (role=status) ya da hata kutusu (role=alert).
  // Ikisi ayni anda DOM'da olmaz, tek ref ikisine de yeter.
  const resultRef = useRef<HTMLElement | null>(null);
  // Alana eslenen hatada odaklanacak alan; null ise odak sonuc kutusuna gider.
  const fieldToFocus = useRef<HTMLElement | null>(null);

  // Odak RENDER SONRASINA ertelenir: sonuc kutusu gonderim aninda henuz
  // DOM'da degildir. Kutuya odaklanirken kaydirma AYRICA ve kosulsuz yapilir --
  // `focus()`'un kendi "gerekirse gorunur yap" davranisi kutu zaten ekrandayken
  // hic kaydirmaz ve sayfa basligi yapiskan basligin arkasinda yarim kalir
  // (olculdu: 390/412 px, scrollY 151'de h1 34..168, baslik bandi 0..68).
  // `block: "start"` mevcut `scroll-padding-top: 5.5rem` offsetini
  // onurlandirir (globals.css) -- yerel bir `scroll-margin-top` EKLENMEZ,
  // ayni offseti iki yerden yonetmek olur.
  useEffect(() => {
    if (state !== "ok" && state !== "error") return;
    const field = fieldToFocus.current;
    if (field) {
      // Duz `focus()` alani EKRANIN KENARINA hizalar; hata metni alanin 6-77 px
      // ALTINDA durdugu icin tam o anda ekran disinda kalabiliyordu (olculdu:
      // 390x844'te 3/28 dugum gorunmuyordu -- odaklanan alanin kendi metni).
      // Kaydirma bu yuzden AYRICA ve `block: "center"` ile yapilir: alan
      // ortalandiginda altindaki metin her genislikte ayni ekrana duser.
      // Sonuc kutusunda ayni ders TASK-2.05'te olculmustu, mekanizma ortak.
      field.focus({ preventScroll: true });
      field.scrollIntoView({ block: "center" });
      return;
    }
    const box = resultRef.current;
    if (!box) return;
    box.focus({ preventScroll: true });
    box.scrollIntoView({ block: "start" });
  }, [state]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setError("");
    // Onceki turun isaretleri gonderim BASINDA silinir: kutu DOM'dan kalkarken
    // alanlar `aria-describedby` ile artik DOM'da olmayan bir kimligi
    // gosteriyordu (B-055 e). Kullanici yazarken degil, burada sifirlanir --
    // duzeltilen alanda `aria-invalid`'in yeniden gonderime kadar surmesi
    // yaygin desendir (ARIA 1.2, GOV.UK).
    setInvalidFields([]);
    // Onceki turun on-doldurmasi da burada dusurulur: bir sonraki hata baska
    // bir kod olabilir ve eski taslak adres satirinda asili kalmamali.
    setRecoveryHref(CONTACT.whatsapp.href);
    fieldToFocus.current = null;
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, consent: data.consent === "on" }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        // Yalniz gercek basaride gonderilir -- bal kupu dolu istek de 200
        // doner ama form `json.ok`'a bakiyor, bu dalin disinda kalir
        // (TASK-1.08).
        track("demo-submit", "demo-form");
        setState("ok");
        form.reset();
      } else {
        setState("error");
        setError(json.message ?? "Bir sorun oldu. Lütfen WhatsApp'tan yazın.");
        const code = typeof json.code === "string" ? json.code : "";
        if (code === "no-sink") {
          // TUM form kaydi verilir; hangi alanin tasinacagini tek kaynak
          // (`WHATSAPP_DRAFT_FIELDS`) secer -- burada alan adi sayilmaz ki
          // secim iki yerde tutulmasin.
          const values: Record<string, string> = {};
          for (const [k, v] of Object.entries(data)) {
            if (typeof v === "string") values[k] = v;
          }
          setRecoveryHref(whatsappDraftHref(values));
        }
        const marked = markedFieldsFor(code, FIELD_ERRORS[code] ?? [], data);
        setInvalidFields(marked);
        const target = marked[0] ?? null;
        // Alan elemani bu dalda DOM'dan kalkmiyor, referansi simdi alinir;
        // odagin kendisi yukaridaki efektte, render sonrasinda uygulanir.
        fieldToFocus.current = target
          ? form.querySelector<HTMLElement>(`[name="${target}"]`)
          : null;
      }
    } catch {
      setState("error");
      setError("Bağlantı kurulamadı. Lütfen WhatsApp'tan yazın veya telefonla arayın.");
      // Ag hatasinda isaretlenecek alan yok: odak hata kutusuna gider.
    }
  }

  if (state === "ok") {
    return (
      <div
        ref={(el) => {
          resultRef.current = el;
        }}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        data-surface={SURFACES.demoForm}
        className="rounded-lg bg-sage-wash p-8 text-center ring-1 ring-sage/30"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-sage text-ink-deep">
          <Check className="size-6" strokeWidth={2.8} aria-hidden />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold text-sage-ink">Talebiniz bize ulaştı</h3>
        <p className="mx-auto mt-2.5 max-w-md text-[0.9375rem] leading-relaxed text-ink/75">
          En kısa sürede size dönüp demo için uygun bir saat belirleyeceğiz. Acele ediyorsanız
          WhatsApp'tan yazabilirsiniz, oradan daha hızlı dönüyoruz.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Button href={CONTACT.whatsapp.href} variant="whatsapp" size="md">
            <MessageCircle className="size-4.5" strokeWidth={2} aria-hidden />
            WhatsApp'tan yazın
          </Button>
          <Button onClick={() => setState("idle")} variant="secondary" size="md">
            Yeni talep gönder
          </Button>
        </div>
      </div>
    );
  }

  // Rıza kutusu Field bilesenini kullanmiyor (kendi <label> sarmali var);
  // isareti ve hata dugumu burada elle kurulur.
  //
  // ONAY METNININ KAPSAMI (TASK-2.16, B-024 k.4): metin eskiden yalniz
  // "iletisim bilgilerimin" diyordu, oysa uc ayrica kulup/sube/tip, mesaj,
  // talebin tarih-saati ve IP ozetini (`ip_hash`) isliyor -- onay islenen
  // veriden DARDI. Uc kategori de adiyla sayilir; ayrinti ayni cumledeki
  // KVKK baglantisinda (`content/legal.ts` -> "Islenen kisisel veriler").
  // Uzunluk olculdu (390x844, satir yuksekligi 22.75px): 138 -> 171 karakter,
  // 320px'te 5 -> 6 satir, 390px'te 4 -> 5. "Islem guvenligi verisi" terimi
  // BILEREK kullanilmadi: 46 karakter ve 320px'te bir satir daha goturuyordu
  // (olculdu: 217 karakter / 7 satir), karsiliginda ziyaretcinin
  // anlayabilecegi bir sey eklemiyordu -- kategori adi KVKK metninde durur.
  const consentInvalid = invalidFields.includes("consent");

  return (
    <form
      onSubmit={onSubmit}
      data-surface={SURFACES.demoForm}
      className="rounded-lg bg-surface-2 p-6 ring-1 ring-line sm:p-8"
      noValidate
    >
      {/* bal kupu — gorunmez, gercek kullanici doldurmaz */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Web siteniz</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Adınız ve soyadınız"
          name="name"
          required
          autoComplete="name"
          placeholder="Ayşe Yılmaz"
          error={invalidFields.includes("name") ? error : undefined}
        />
        <Field
          label="Kulüp veya stüdyo adı"
          name="club"
          required
          placeholder="Örnek Pilates Stüdyo"
          error={invalidFields.includes("club") ? error : undefined}
        />
        <Field
          label="Telefon"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="05xx xxx xx xx"
          hint="Telefon veya e-postadan en az birini yazın"
          error={invalidFields.includes("phone") ? error : undefined}
        />
        <Field
          label="E-posta"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ad@kulup.com"
          error={invalidFields.includes("email") ? error : undefined}
        />

        <div>
          <label htmlFor="branches" className="mb-1.5 block text-sm font-medium text-ink">
            Şube sayısı
          </label>
          <select id="branches" name="branches" defaultValue="1" className={cn(field, "appearance-none")}>
            {["1", "2", "3", "4", "5", "6+"].map((n) => (
              <option key={n} value={n}>
                {n} şube
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="segment" className="mb-1.5 block text-sm font-medium text-ink">
            Kulüp tipi
          </label>
          <select id="segment" name="segment" defaultValue="" className={cn(field, "appearance-none")}>
            <option value="">Seçiniz</option>
            {SEGMENTS.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Diğer">Diğer</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          Bugün neyle yönetiyorsunuz <span className="font-normal text-faint">(isteğe bağlı)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Örnek: randevuları WhatsApp'tan alıyoruz, ciroyu Excel'de tutuyoruz."
          className={cn(field, "resize-y")}
        />
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
        <input
          id="consent"
          type="checkbox"
          name="consent"
          required
          aria-invalid={consentInvalid || undefined}
          aria-describedby={consentInvalid ? CONSENT_ERROR_ID : undefined}
          className="mt-0.5 size-4.5 shrink-0 accent-[#3e6b3c] aria-invalid:ring-2 aria-invalid:ring-neg"
        />
        <span>
          <Link href="/kvkk" className="font-medium text-sage-ink underline underline-offset-4">
            Aydınlatma metnini
          </Link>{" "}
          okudum. Formda verdiğim bilgilerin, talebin tarih ve saatiyle IP özetinin demo talebim
          için işlenmesine ve benimle iletişime geçilmesine izin veriyorum.
        </span>
      </label>

      {/* Hata dugumu <label>'in DISINDA durur: label'in icerik modeli phrasing
          content, <p> oraya giremez. Sol bosluk kutu (1.125rem) + gap (0.75rem)
          kadar ki metin, rıza cumlesiyle ayni sutunda hizalansin. */}
      {consentInvalid ? (
        <p
          id={CONSENT_ERROR_ID}
          className="ms-[1.875rem] mt-1.5 text-xs font-medium leading-relaxed text-neg"
        >
          {error}
        </p>
      ) : null}

      {state === "error" ? (
        <p
          id={ERROR_ID}
          ref={(el) => {
            resultRef.current = el;
          }}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="mt-5 flex items-start gap-2.5 rounded-xl bg-neg-wash px-4 py-3.5 text-sm leading-relaxed text-neg ring-1 ring-neg/20"
        >
          <TriangleAlert className="mt-0.5 size-4.5 shrink-0" strokeWidth={2} aria-hidden />
          <span>
            {error}{" "}
            <a
              href={recoveryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4"
            >
              WhatsApp'tan yazın
            </a>
            .
          </span>
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={state === "sending"} className="sm:flex-1">
          {state === "sending" ? (
            <>
              <Loader2 className="size-4.5 animate-spin" strokeWidth={2.2} aria-hidden />
              Gönderiliyor
            </>
          ) : (
            <>
              <Send className="size-4.5" strokeWidth={2.1} aria-hidden />
              Demo talebi gönder
            </>
          )}
        </Button>
        <Button href={CONTACT.whatsapp.href} variant="whatsapp" size="lg" className="sm:flex-1">
          <MessageCircle className="size-4.5" strokeWidth={2} aria-hidden />
          WhatsApp'tan yazın
        </Button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-faint">
        Demoyu ekibimiz planlar. Formu doldurduğunuzda otomatik bir hesap açılmaz ve kart
        bilgisi istenmez.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
  hint,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
  /**
   * Uctan gelen mesaj. Dolu ise alan gecersiz sayilir ve metin alanin hemen
   * altinda gorunur. Metin BURADA URETILMEZ -- hangi alanin neden bozuk
   * oldugunu uc soyler (FIELD_ERRORS yorumu), bileşen yalnizca tasir.
   */
  error?: string;
}) {
  // Alan artik formun sonundaki GENEL kutuyu degil kendi hata dugumunu
  // gosterir (B-055 a): mobilde kutu ekranin altinda kaliyordu, alan basina
  // dugum ise her zaman alanla ayni ekranda. Ipucu dugumu zincirde KALIR;
  // ikisi de yoksa oznitelik hic yazilmaz (mevcut desen) -- boylece zincir
  // hicbir halde DOM'da olmayan bir kimligi gostermez (B-055 e).
  const describedBy = [hint ? `${name}-hint` : null, error ? `${name}-error` : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-neg"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={field}
      />
      {hint ? (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-faint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-xs font-medium leading-relaxed text-neg">
          {error}
        </p>
      ) : null}
    </div>
  );
}
