import type { ReactNode } from "react";
import { AlertOctagon, ArrowRight, Inbox, Lock, Unplug } from "lucide-react";
import { DataFreshness } from "./DataFreshness";
import { StatusPill } from "./StatusPill";
import type { DataFreshness as Freshness, OperationError, SemanticStatus } from "@/lib/console/types";
import { cn } from "@/lib/utils";

/* ---------------------------------- Empty ---------------------------------- */

export function EmptyState({
  variant = "not_configured",
  title,
  description,
  action,
  className,
}: {
  variant?: "not_configured" | "no_data";
  title: string;
  description: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  const Icon = variant === "not_configured" ? Unplug : Inbox;
  return (
    <div className={cn("flex flex-col items-center px-6 py-10 text-center", className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
        <Icon className="h-5 w-5 text-zinc-500" aria-hidden />
      </span>
      <p className="mt-4 text-sm font-semibold text-zinc-200">{title}</p>
      <p className="mt-1.5 max-w-sm text-[13px] leading-6 text-zinc-500">{description}</p>
      {action ? (
        <a
          href={action.href}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] font-medium text-zinc-200 transition hover:bg-white/[0.08]"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}

/* --------------------------------- Loading --------------------------------- */

export function LoadingSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5 px-1 py-2", className)} aria-label="Loading" role="status">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="console-skeleton h-4 rounded-md"
          style={{ width: `${92 - i * 14}%` }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------- Error ---------------------------------- */

/** Explicit failure, never a disappearing spinner (§13). */
export function ErrorState({
  error,
  onRetry,
  className,
}: {
  error: OperationError;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-red-400/20 bg-red-400/[0.06] p-4", className)} role="alert">
      <div className="flex items-start gap-3">
        <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-red-200">Operation failed</p>
          <p className="mt-1 text-[13px] leading-6 text-red-200/70">{error.reason}</p>
          <p className="tnum mt-2 text-[11px] uppercase tracking-[0.14em] text-red-200/40">
            {new Date(error.at).toLocaleString()} · Ref {error.referenceId}
          </p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-lg border border-red-300/25 px-3 py-1.5 text-[13px] font-medium text-red-200 transition hover:bg-red-400/10"
            >
              Retry
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Permission -------------------------------- */

export function PermissionState({ who = "your Volynx operator" }: { who?: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
        <Lock className="h-5 w-5 text-zinc-500" aria-hidden />
      </span>
      <p className="mt-4 text-sm font-semibold text-zinc-200">You don&apos;t have access to this area</p>
      <p className="mt-1.5 max-w-sm text-[13px] leading-6 text-zinc-500">
        Access is controlled on the server, not just hidden in the interface. Ask {who} to grant it.
      </p>
    </div>
  );
}

/* --------------------------------- Banner ---------------------------------- */

export function AttentionBanner({
  tone = "amber",
  title,
  description,
  action,
}: {
  tone?: "amber" | "red";
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  const tones = {
    amber: "border-amber-400/25 bg-amber-400/[0.07]",
    red: "border-red-400/25 bg-red-400/[0.07]",
  } as const;
  return (
    <div className={cn("flex items-center justify-between gap-4 rounded-xl border px-4 py-3", tones[tone])} role="alert">
      <div>
        <p className="text-sm font-semibold text-zinc-100">{title}</p>
        {description ? <p className="mt-0.5 text-[13px] text-zinc-400">{description}</p> : null}
      </div>
      {action ? (
        <a
          href={action.href}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-white/[0.1]"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}

/* -------------------------------- ModuleCard -------------------------------- */

/** Standard module frame: title + status + provenance. Answers "what's happening?" (§18). */
export function ModuleCard({
  title,
  status,
  freshness,
  action,
  children,
  className,
}: {
  title: string;
  status: SemanticStatus;
  freshness: Freshness;
  action?: { label: string; href: string };
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-white/10 bg-white/[0.025]", className)}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-300">{title}</h3>
          <StatusPill status={status} />
        </div>
        <div className="flex items-center gap-3">
          <DataFreshness freshness={freshness} />
          {action ? (
            <a href={action.href} className="text-[13px] font-medium text-zinc-300 underline-offset-4 hover:underline">
              {action.label}
            </a>
          ) : null}
        </div>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
