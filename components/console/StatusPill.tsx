import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Siren,
  Unplug,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { SemanticStatus } from "@/lib/console/types";
import { cn } from "@/lib/utils";

const CONFIG: Record<SemanticStatus, { label: string; icon: LucideIcon; classes: string }> = {
  operational: {
    label: "Operational",
    icon: CheckCircle2,
    classes: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  },
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    classes: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  },
  incident: {
    label: "Incident",
    icon: Siren,
    classes: "border-red-400/25 bg-red-400/10 text-red-300",
  },
  maintenance: {
    label: "Maintenance",
    icon: Wrench,
    classes: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  },
  unknown: {
    label: "Unknown",
    icon: CircleDashed,
    classes: "border-zinc-400/25 bg-zinc-400/10 text-zinc-300",
  },
  not_configured: {
    label: "Not configured",
    icon: Unplug,
    classes: "border-dashed border-zinc-500/40 bg-transparent text-zinc-500",
  },
};

/**
 * Semantic status indicator (§12). Never color-only: always icon + label.
 * Unknown is visually quiet — absence of error is not health.
 */
export function StatusPill({ status, className }: { status: SemanticStatus; className?: string }) {
  const { label, icon: Icon, classes } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]",
        classes,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}
