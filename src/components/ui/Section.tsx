import { cn } from "@/lib/cn";
import { Container } from "./Container";

export function Section({
  children,
  className,
  innerClassName,
  id,
  tone = "canvas",
  size = "default",
  containerSize = "default",
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  tone?: "canvas" | "soft" | "white" | "ink" | "none";
  size?: "default" | "sm" | "lg";
  containerSize?: "default" | "narrow" | "wide";
}) {
  const tones = {
    canvas: "bg-canvas",
    soft: "bg-canvas-soft",
    white: "bg-surface",
    ink: "bg-ink-deep text-canvas",
    none: "",
  } as const;
  const pads = {
    sm: "py-14 sm:py-16",
    default: "py-18 sm:py-24",
    lg: "py-24 sm:py-32",
  } as const;
  return (
    <section id={id} className={cn("relative", tones[tone], pads[size], className)}>
      <Container size={containerSize} className={innerClassName}>
        {children}
      </Container>
    </section>
  );
}

export function SectionLabel({
  children,
  className,
  tone = "sage",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "sage" | "light";
}) {
  return (
    <p
      className={cn(
        "font-display text-[0.6875rem] font-bold uppercase tracking-[0.16em]",
        tone === "sage" ? "text-sage-ink" : "text-sage-br",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHead({
  label,
  title,
  lead,
  align = "left",
  tone = "dark",
  className,
}: {
  label?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        align === "center" ? "max-w-3xl mx-auto" : "max-w-2xl",
        className,
      )}
    >
      {label ? <SectionLabel tone={tone === "light" ? "light" : "sage"}>{label}</SectionLabel> : null}
      <h2
        className={cn(
          "text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          tone === "light" ? "text-canvas" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p className={cn("text-lg leading-relaxed", tone === "light" ? "text-canvas/70" : "text-muted")}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
