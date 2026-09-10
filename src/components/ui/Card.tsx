import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
  hover = false,
  tone = "white",
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  tone?: "white" | "soft" | "ink" | "sage";
}) {
  const tones = {
    white: "bg-surface ring-1 ring-line",
    soft: "bg-surface-2 ring-1 ring-line",
    ink: "bg-ink-deep text-canvas ring-1 ring-white/10",
    sage: "bg-sage-wash ring-1 ring-sage/25",
  } as const;
  return (
    <div
      className={cn(
        "rounded-card p-6 shadow-sm",
        tones[tone],
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-sage/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Chip({
  children,
  className,
  tone = "sage",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "sage" | "amber" | "neutral" | "light";
}) {
  const tones = {
    sage: "bg-sage-wash text-sage-ink ring-sage/25",
    amber: "bg-amber-wash text-amber ring-amber/25",
    neutral: "bg-surface-2 text-muted ring-line-2",
    light: "bg-white/10 text-canvas ring-white/20",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
