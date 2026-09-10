import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/Section";

export function PageHero({
  label,
  title,
  lead,
  crumbs,
  children,
  size = "default",
}: {
  label?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  crumbs?: { label: string; href: string }[];
  children?: React.ReactNode;
  size?: "default" | "sm";
}) {
  return (
    <section className="relative overflow-hidden bg-canvas pb-14 pt-10 sm:pb-16 sm:pt-14">
      <div className="pointer-events-none absolute inset-0 bg-glow-soft" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-40 mask-fade-b" aria-hidden />
      <Container className="relative">
        {crumbs?.length ? (
          <nav aria-label="Konum" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-faint">
              <li>
                <Link href="/" className="hover:text-sage-ink">
                  Ana sayfa
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1">
                  <ChevronRight className="size-3.5" strokeWidth={2} aria-hidden />
                  {i === crumbs.length - 1 ? (
                    <span className="text-muted">{c.label}</span>
                  ) : (
                    <Link href={c.href} className="hover:text-sage-ink">
                      {c.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="max-w-3xl">
          {label ? <SectionLabel>{label}</SectionLabel> : null}
          <h1
            className={
              label
                ? size === "sm"
                  ? "mt-4 text-3xl font-extrabold leading-[1.12] sm:text-4xl"
                  : "mt-4 text-[2.25rem] font-extrabold leading-[1.1] sm:text-5xl"
                : size === "sm"
                  ? "text-3xl font-extrabold leading-[1.12] sm:text-4xl"
                  : "text-[2.25rem] font-extrabold leading-[1.1] sm:text-5xl"
            }
          >
            {title}
          </h1>
          {lead ? <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p> : null}
          {children}
        </div>
      </Container>
    </section>
  );
}
