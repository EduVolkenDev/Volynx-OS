import { notFound } from "next/navigation";
import { ArrowUpRight, Database, Globe, Rocket, ShieldCheck } from "lucide-react";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { DataFreshness } from "@/components/console/DataFreshness";
import { StatusPill } from "@/components/console/StatusPill";
import { AttentionBanner, EmptyState, ModuleCard } from "@/components/console/states";
import { contextPath, getOverview, resolveContext } from "@/lib/console/data";
import type { HealthComponent } from "@/lib/console/types";

type Params = { client: string; product: string; env: string };

function HealthRow({ component }: { component: HealthComponent }) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-2.5 last:border-0 last:pb-0 first:pt-0">
      <span className="text-[13px] font-medium text-zinc-300">{component.name}</span>
      <span className="flex items-center gap-3">
        <DataFreshness freshness={component.freshness} />
        <StatusPill status={component.status} />
      </span>
    </li>
  );
}

export default async function OverviewPage({ params }: { params: Promise<Params> }) {
  const { client, product, env } = await params;
  const ctx = resolveContext(client, product, env);
  if (!ctx) notFound();

  const snap = getOverview(ctx);
  const sectionHref = (s: string) => contextPath(ctx, s);

  return (
    <ConsoleShell ctx={ctx} activeSection="">
      {/* Identity header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            {ctx.client.name} · {ctx.env}
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
            {snap.identity.name}
          </h1>
          <p className="tnum mt-1.5 text-[13px] text-zinc-500">
            {snap.identity.vlxId}
            {snap.identity.productionUrl ? ` · ${snap.identity.productionUrl}` : " · URL pending"}
          </p>
        </div>
        <StatusPill status={snap.overall} />
      </div>

      {/* Status band — answers "what's happening?" in under 5 seconds */}
      <div className="mt-6">
        <AttentionBanner
          tone="amber"
          title="No data sources connected yet"
          description="Every module below reports Unknown or Not configured. Nothing here is invented — statuses turn live as integrations are connected."
          action={{ label: "View integrations", href: sectionHref("settings") }}
        />
      </div>

      {/* Module grid */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ModuleCard
          title="Domain & SSL"
          status={snap.domain.status}
          freshness={snap.domain.freshness}
          action={{ label: "Infrastructure", href: sectionHref("infrastructure") }}
        >
          <EmptyState
            variant="not_configured"
            title="Domain not connected"
            description="Connect a domain to start tracking DNS, SSL and CDN state. Until then, nothing is assumed."
          />
        </ModuleCard>

        <ModuleCard
          title="Last deployment"
          status={snap.lastDeployment.status}
          freshness={snap.lastDeployment.freshness}
          action={{ label: "All deployments", href: sectionHref("deployments") }}
        >
          <EmptyState
            variant="not_configured"
            title="No deployment source"
            description="Connect a repository or deployment provider to track releases, their source and their status."
          />
        </ModuleCard>

        <ModuleCard
          title="Health"
          status="unknown"
          freshness={{ lastCheckedAt: null, source: null }}
          action={{ label: "Monitoring", href: sectionHref("monitoring") }}
        >
          <ul>
            {snap.health.map((h) => (
              <HealthRow key={h.name} component={h} />
            ))}
          </ul>
          <p className="mt-3 text-[12px] leading-5 text-zinc-600">
            A component is only marked healthy when a valid source confirms it.
          </p>
        </ModuleCard>

        <ModuleCard
          title="Backups"
          status="not_configured"
          freshness={{ lastCheckedAt: null, source: null }}
          action={{ label: "Backups", href: sectionHref("backups") }}
        >
          <EmptyState
            variant="not_configured"
            title="Backup capability unknown"
            description="We don't assume GitHub — or anything else — is your backup. Declare providers to track capability, last success and restore options."
          />
        </ModuleCard>

        <ModuleCard
          title="Security"
          status="not_configured"
          freshness={{ lastCheckedAt: null, source: null }}
          action={{ label: "Security", href: sectionHref("security") }}
        >
          <EmptyState
            variant="not_configured"
            title="Protection state unknown"
            description="HTTPS, WAF and DDoS mitigation are only shown when each claim has traceable evidence behind it."
          />
        </ModuleCard>

        <ModuleCard
          title="Care plan"
          status={snap.care.status}
          freshness={snap.care.freshness}
          action={{ label: "Care", href: sectionHref("care") }}
        >
          <EmptyState
            variant="not_configured"
            title="No care plan attached"
            description="Attach a plan to surface included maintenance, support channel and SLA here."
          />
        </ModuleCard>
      </div>

      {/* Incidents strip */}
      <div className="mt-4">
        <ModuleCard
          title="Active incidents"
          status={snap.incidents.active.length > 0 ? "incident" : "unknown"}
          freshness={snap.incidents.source}
          action={{ label: "Incident history", href: sectionHref("incidents") }}
        >
          <EmptyState
            variant="no_data"
            title="No incident data source"
            description="Incident tracking starts when monitoring is connected. No news is not good news — it's unknown news."
          />
        </ModuleCard>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { icon: Rocket, label: "Deployments", href: sectionHref("deployments") },
          { icon: Database, label: "Backups", href: sectionHref("backups") },
          { icon: ShieldCheck, label: "Security", href: sectionHref("security") },
          { icon: Globe, label: "Infrastructure", href: sectionHref("infrastructure") },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-[13px] font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
          >
            <span className="flex items-center gap-2.5">
              <l.icon className="h-4 w-4" aria-hidden />
              {l.label}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden />
          </a>
        ))}
      </div>
    </ConsoleShell>
  );
}
