import { ArrowRight, ArrowUpRight, Database, Globe, Rocket, ShieldCheck } from "lucide-react";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { ModuleCard } from "@/components/console/ModuleCard";
import { contextPath, getOverview, resolveContext } from "@/lib/console/data";

type Params = { client: string; product: string; env: string };

/**
 * Overview — answers "what's happening?" in under 5 seconds (§18).
 * A hero statement says it in human words; modules below carry the detail.
 * Every module is driven by the contract's ModuleState.
 */
export default async function OverviewPage({ params }: { params: Promise<Params> }) {
  const { client, product, env } = await params;
  const ctx = resolveContext(client, product, env);
  const snap = getOverview(ctx);
  const allQuiet = snap.modules.every((m) => m.module.state === "not_configured");

  return (
    <ConsoleShell ctx={ctx} activeSection="">
      {/* Hero — the state of the product, in one human sentence. */}
      <div className="console-panel-gold px-6 py-8 md:px-10 md:py-10">
        <p className="eyebrow text-[#e3b85c]">Product overview</p>
        <h1 className="font-display mt-4 max-w-2xl text-4xl leading-[1.08] tracking-[-0.01em] text-white md:text-5xl">
          {allQuiet ? (
            <>This product is <span className="text-gold-gradient">flying blind.</span></>
          ) : (
            <>Here&apos;s the <span className="text-gold-gradient">state of things.</span></>
          )}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-zinc-400">
          {allQuiet
            ? "No data sources are connected, so there's nothing to report yet — and we're not going to invent anything. Connect your first integration and this page comes alive."
            : "Live data is flowing. Anything that needs your attention is marked below."}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={contextPath(ctx, "settings")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#e3b85c] px-5 py-2.5 text-[14px] font-semibold text-black transition hover:bg-[#f2d68a]"
          >
            Connect your first integration
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <p className="tnum text-[12px] uppercase tracking-[0.16em] text-zinc-500">
            {snap.identity.contextLabel}
            {snap.identity.vlxId ? ` · ${snap.identity.vlxId}` : " · ID not assigned yet"}
          </p>
        </div>
      </div>

      {/* Module grid — one ModuleCard per operational module. */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {snap.modules.map((m) => (
          <ModuleCard
            key={m.key}
            title={m.name}
            blurb={m.blurb}
            module={m.module}
            guidance={m.guidance}
            action={{ label: m.name, href: m.href }}
          />
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-8">
        <p className="eyebrow mb-3 text-zinc-600">Jump to</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: Rocket, name: "Deployments", href: contextPath(ctx, "deployments") },
            { icon: Database, name: "Backups", href: contextPath(ctx, "backups") },
            { icon: ShieldCheck, name: "Security", href: contextPath(ctx, "security") },
            { icon: Globe, name: "Infrastructure", href: contextPath(ctx, "infrastructure") },
          ].map((l) => (
            <a
              key={l.name}
              href={l.href}
              className="console-panel flex items-center justify-between px-4 py-3.5 text-[13px] font-medium text-zinc-300 transition hover:border-white/20 hover:text-white"
            >
              <span className="flex items-center gap-2.5">
                <l.icon className="h-4 w-4 text-[#e3b85c]" aria-hidden />
                {l.name}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden />
            </a>
          ))}
        </div>
      </div>
    </ConsoleShell>
  );
}
