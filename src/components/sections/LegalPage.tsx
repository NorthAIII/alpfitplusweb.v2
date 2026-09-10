import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import type { LegalDoc } from "@/content/legal";
import { LEGAL_DOCS } from "@/content/legal";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const others = LEGAL_DOCS.filter((d) => d.slug !== doc.slug);

  return (
    <>
      <PageHero
        crumbs={[{ label: doc.title, href: `/${doc.slug}` }]}
        label="Yasal"
        size="sm"
        title={doc.title}
        lead={doc.intro}
      >
        <p className="mt-5 text-sm text-faint">Son güncelleme: {doc.updated}</p>
      </PageHero>

      <Section tone="canvas" size="sm" containerSize="narrow">
        <div className="flex flex-col gap-10">
          {doc.sections.map((s, i) => (
            <section key={s.title}>
              <h2 className="font-display text-xl font-bold text-ink">
                <span className="mr-2 tabnum text-sage-ink">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {s.blocks.map((b, j) => {
                  if (b.type === "p")
                    return (
                      <p key={j} className="text-[0.9375rem] leading-relaxed text-muted">
                        {b.text}
                      </p>
                    );
                  if (b.type === "h")
                    return (
                      <h3 key={j} className="font-display text-base font-bold text-ink">
                        {b.text}
                      </h3>
                    );
                  return (
                    <ul key={j} className="flex flex-col gap-2">
                      {b.items.map((it) => (
                        <li
                          key={it}
                          className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-muted"
                        >
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
                          {it}
                        </li>
                      ))}
                    </ul>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <nav className="mt-14 flex flex-wrap gap-3 border-t border-line pt-8" aria-label="Diğer yasal metinler">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/${o.slug}`}
              className="rounded-xl bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-sm ring-1 ring-line transition-colors hover:ring-sage/35"
            >
              {o.title}
            </Link>
          ))}
        </nav>
      </Section>
    </>
  );
}
