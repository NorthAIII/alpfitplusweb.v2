"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, MessageCircle, Send, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/content/site";
import { SEGMENTS } from "@/content/segments";
import { cn } from "@/lib/cn";

type State = "idle" | "sending" | "ok" | "error";

const field =
  "w-full rounded-xl bg-surface px-4 py-3 text-[0.9375rem] text-ink ring-1 ring-line-2 " +
  "transition-shadow placeholder:text-faint/70 focus:outline-none focus:ring-2 focus:ring-sage-deep";

// Uctan donen `code` -> alan eslemesi (TASK-1.12, B-021). Ayni koda giren
// alanlar aynen isaretlenir; mesaj metni (hangi alanin bozuk oldugu) uctan
// gelir, burada tekrarlanmaz.
const FIELD_ERRORS: Record<string, readonly string[]> = {
  missing: ["name", "club"],
  "missing-contact": ["phone", "email"],
  "bad-contact": ["phone", "email"],
  "no-consent": ["consent"],
};

const ERROR_ID = "demo-form-error";

export function DemoForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [invalidFields, setInvalidFields] = useState<readonly string[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, consent: data.consent === "on" }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setState("ok");
        setInvalidFields([]);
        form.reset();
      } else {
        setState("error");
        setError(json.message ?? "Bir sorun oldu. Lütfen WhatsApp'tan yazın.");
        const fields = FIELD_ERRORS[typeof json.code === "string" ? json.code : ""] ?? [];
        setInvalidFields(fields);
        // "missing-contact"/"bad-contact" iki alanı birden isaretler (tablo,
        // yukarida) ama gercek suclu -- kullanicinin doldurup bozdugu alan --
        // her zaman ilki degildir: yalniz e-posta doluyken bos telefona degil,
        // dolu-ama-bozuk alana odaklan. Hicbiri doluysa (ör. missing-contact,
        // ikisi de bos) ilk alana duser.
        const focusTarget =
          fields.find((name) => String(data[name] ?? "").trim().length > 0) ?? fields[0];
        if (focusTarget) {
          form.querySelector<HTMLElement>(`[name="${focusTarget}"]`)?.focus();
        }
      }
    } catch {
      setState("error");
      setError("Bağlantı kurulamadı. Lütfen WhatsApp'tan yazın veya telefonla arayın.");
      setInvalidFields([]);
    }
  }

  if (state === "ok") {
    return (
      <div
        role="status"
        aria-live="polite"
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

  return (
    <form onSubmit={onSubmit} className="rounded-lg bg-surface-2 p-6 ring-1 ring-line sm:p-8" noValidate>
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
          invalid={invalidFields.includes("name")}
        />
        <Field
          label="Kulüp veya stüdyo adı"
          name="club"
          required
          placeholder="Örnek Pilates Stüdyo"
          invalid={invalidFields.includes("club")}
        />
        <Field
          label="Telefon"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="05xx xxx xx xx"
          hint="Telefon veya e-postadan en az birini yazın"
          invalid={invalidFields.includes("phone")}
        />
        <Field
          label="E-posta"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ad@kulup.com"
          invalid={invalidFields.includes("email")}
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
          aria-invalid={invalidFields.includes("consent") || undefined}
          aria-describedby={invalidFields.includes("consent") ? ERROR_ID : undefined}
          className="mt-0.5 size-4.5 shrink-0 accent-[#3e6b3c]"
        />
        <span>
          <Link href="/kvkk" className="font-medium text-sage-ink underline underline-offset-4">
            Aydınlatma metnini
          </Link>{" "}
          okudum. İletişim bilgilerimin demo talebimle ilgili olarak işlenmesine ve benimle
          iletişime geçilmesine izin veriyorum.
        </span>
      </label>

      {state === "error" ? (
        <p
          id={ERROR_ID}
          role="alert"
          aria-live="assertive"
          className="mt-5 flex items-start gap-2.5 rounded-xl bg-neg-wash px-4 py-3.5 text-sm leading-relaxed text-neg ring-1 ring-neg/20"
        >
          <TriangleAlert className="mt-0.5 size-4.5 shrink-0" strokeWidth={2} aria-hidden />
          <span>
            {error}{" "}
            <a
              href={CONTACT.whatsapp.href}
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
  invalid,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
  invalid?: boolean;
}) {
  const describedBy = [hint ? `${name}-hint` : null, invalid ? ERROR_ID : null].filter(Boolean).join(" ");
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
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy || undefined}
        className={field}
      />
      {hint ? (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
