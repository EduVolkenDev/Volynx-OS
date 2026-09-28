import type { ReactNode } from "react";
import { DataFreshness } from "./DataFreshness";
import { StatusPill } from "./StatusPill";
import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  NotConfiguredState,
  PendingState,
  PermissionState,
  StaleNotice,
} from "./states";
import type { ModuleState, Observation } from "@/lib/console/types";
import { cn } from "@/lib/utils";

function Frame({
  title,
  action,
  status,
  observation,
  className,
  children,
}: {
  title: string;
  action?: { label: string; href: string };
  status?: Observation["status"];
  observation?: Pick<Observation, "source" | "lastCheckedAt" | "stale">;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("rounded-2xl border border-white/10 bg-white/[0.025]", className)}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-300">{title}</h3>
          {status ? <StatusPill status={status} /> : null}
        </div>
        <div className="flex items-center gap-3">
          {observation ? <DataFreshness observation={observation} /> : null}
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

/**
 * Standard module frame driven by the contract's ModuleState (§18).
 * Every API state has an explicit rendering — loading is the only
 * client-owned state; everything else comes back from the server.
 */
export function ModuleCard<T extends Observation>({
  title,
  module,
  action,
  children,
  className,
}: {
  title: string;
  module: ModuleState<T>;
  action?: { label: string; href: string };
  /** Rendered only for ready/stale, with the observation as `data`. */
  children?: (data: T) => ReactNode;
  className?: string;
}) {
  switch (module.state) {
    case "loading":
      return (
        <Frame title={title} action={action} className={className}>
          <LoadingSkeleton />
        </Frame>
      );
    case "ready":
      return (
        <Frame title={title} action={action} status={module.data.status} observation={module.data} className={className}>
          {children ? children(module.data) : null}
        </Frame>
      );
    case "stale":
      return (
        <Frame title={title} action={action} status={module.data.status} observation={module.data} className={className}>
          <StaleNotice />
          <div className="mt-3">{children ? children(module.data) : null}</div>
        </Frame>
      );
    case "empty":
      return (
        <Frame title={title} action={action} className={className}>
          <EmptyState
            title={`No ${title.toLowerCase()} yet`}
            description="The source was checked and returned nothing. This is a real answer, not missing data."
            observed={{ source: module.source, lastCheckedAt: module.lastCheckedAt }}
          />
        </Frame>
      );
    case "not_configured":
      return (
        <Frame title={title} action={action} className={className}>
          <NotConfiguredState
            title={`${title} is not configured`}
            description="No provider is connected for this module, so nothing is being observed. Connect one to activate it."
          />
        </Frame>
      );
    case "pending":
      return (
        <Frame title={title} action={action} className={className}>
          <PendingState
            title={`Waiting for the first ${title.toLowerCase()} check`}
            description="This module is configured, but no observation has arrived yet."
          />
        </Frame>
      );
    case "error":
      return (
        <Frame title={title} action={action} className={className}>
          <ErrorState error={module.error} />
        </Frame>
      );
    case "forbidden":
      return (
        <Frame title={title} action={action} className={className}>
          <PermissionState />
        </Frame>
      );
  }
}
