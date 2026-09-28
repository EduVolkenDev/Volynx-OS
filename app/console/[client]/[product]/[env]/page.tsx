import { ArrowUpRight, Database, Globe, Rocket, ShieldCheck } from "lucide-react";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { ModuleCard } from "@/components/console/ModuleCard";
import { AttentionBanner } from "@/components/console/states";
import { contextPath, getOverview, resolveContext } from "@/lib/console/data";

type Params = { client: string; product: string; env: string };

/**
 * Overview — answers "what's happening?" in under 5 seconds (§18).
 * Every module is driven by the contract's ModuleState; with no endpoints
 * wired, they honestly report "not configured".
 */
export default async function OverviewPage({ params }: { params: Promise<Params> }) {
  const { client, product, env } = await params;
  const ctx = resolveContext(client, product, env);
  const snap = getOverview(ctx);

  return (
    <ConsoleShell ctx={ctx} activeSection="">
      {/* Identity header — vlxId is shown only when a real identity source exists. */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            {snap.identity.contextLabel}
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
            {snap.identity.name}
          </h1>
          <p className="tnum mt-1.5 text-[13px] text-zinc-500">
            {snap.identity.vlxId ? `Product ID ${snap.identity.vlxId}` : "Product ID not assigned yet"}
          </p>
        </div>
      </div>

      {/* Status band — derived from module states, never hardcoded. */}
      {snap.attention.map((note) => (
        <div key={note} className="mt-6">
          <AttentionBanner
            tone="amber"
            title="No data sources connected yet"
            description={note}
            action={{ label: "Settings", href: contextPath(ctx, "settings") }}
          />
        </div>
      ))}

      {/* Module grid — one ModuleCard per operational module. */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {snap.modules.map((m) => (
          <ModuleCard
            key={m.key}
            title={m.name}
            module={m.module}
            action={{ label: m.name, href: m.href }}
          />
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { icon: Rocket, name: "Deployments", href: contextPath(ctx, "deployments") },
          { icon: Database, name: "Backups", href: contextPath(ctx, "backups") },
          { icon: ShieldCheck, name: "Security", href: contextPath(ctx, "security") },
          { icon: Globe, name: "Infrastructure", href: contextPath(ctx, "infrastructure") },
        ].map((l) => (
          <a
            key={l.name}
            href={l.href}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-[13px] font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
          >
            <span className="flex items-center gap-2.5">
              <l.icon className="h-4 w-4" aria-hidden />
              {l.name}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden />
          </a>
        ))}
      </div>
    </ConsoleShell>
  );
}
