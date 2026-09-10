import {
  Bell, Building2, CalendarDays, ChartNoAxesColumn, CreditCard, FileSpreadsheet,
  Layers, Leaf, ShieldCheck, Trophy, User, Users, Wallet,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  calendar: CalendarDays,
  users: Users,
  card: CreditCard,
  user: User,
  wallet: Wallet,
  building: Building2,
  chart: ChartNoAxesColumn,
  leaf: Leaf,
  report: FileSpreadsheet,
  bell: Bell,
  trophy: Trophy,
  shield: ShieldCheck,
  layers: Layers,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.6,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const C = MAP[name] ?? Layers;
  return <C className={className} strokeWidth={strokeWidth} aria-hidden />;
}

export function IconBox({
  name,
  tone = "sage",
  size = "md",
}: {
  name: string;
  tone?: "sage" | "ink" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const tones = {
    sage: "bg-sage-wash text-sage-ink ring-sage/20",
    ink: "bg-ink-deep text-sage-br ring-white/10",
    light: "bg-white/10 text-sage-br ring-white/15",
  } as const;
  const sizes = {
    sm: "size-9 rounded-[10px]",
    md: "size-11 rounded-xl",
    lg: "size-14 rounded-2xl",
  } as const;
  const icon = { sm: "size-4.5", md: "size-5.5", lg: "size-7" } as const;
  return (
    <span className={`inline-grid place-items-center ring-1 ${tones[tone]} ${sizes[size]}`}>
      <Icon name={name} className={icon[size]} />
    </span>
  );
}
