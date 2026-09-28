import Link from "next/link";
import { DataFreshness } from "@/components/console/DataFreshness";
import { StatusPill } from "@/components/console/StatusPill";
import {
  AttentionBanner,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  ModuleCard,
  PermissionState,
} from "@/components/console/states";
import type { SemanticStatus } from "@/lib/console/types";

const SAMPLE_AT = "2026-09-28T03:00:00.000Z";
/** Fixed illustrative timestamps — module-level so render stays pure. */
function sampleAgo(minutes: number): string {
  return new Date(new Date(SAMPLE_AT).getTime() - minutes * 60000).toISOString();
}

const STATUSES: SemanticStatus[] = [
  "operational",
  "degraded",
  "incident",
  "maintenance",
  "unknown",
  "not_configured",
];

/**
 * Component gallery — ILLUSTRATIVE ONLY. Every state below is sample data for
 * design review, explicitly NOT real operational data (§3). Not linked in the
 * console navigation; reachable directly for review.
 */
export default function ConsolePreviewPage() {
  return (
    <div className="console-root min-h-screen bg-[#070807] px-4 py-10 text-zinc-100">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <AttentionBanner
          tone="red"
          title="UI Preview — illustrative states, not real data"
          description="Everything on this page is sample content for design review. The real console never invents statuses."
        />

        <section>
          <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Status scale (§12)
          </h2>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <StatusPill key={s} status={s} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Module cards — every state
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ModuleCard
              title="Domain & SSL (sample: live)"
              status="operational"
              freshness={{ lastCheckedAt: sampleAgo(2), source: "cloudflare-api" }}
              action={{ label: "Details", href: "#" }}
            >
              <dl className="space-y-2 text-[13px]">
                <div className="flex justify-between"><dt className="text-zinc-500">Domain</dt><dd className="font-medium text-zinc-200">example.com</dd></div>
                <div className="flex justify-between"><dt className="text-zinc-500">DNS</dt><dd className="font-medium text-zinc-200">Resolving</dd></div>
                <div className="flex justify-between"><dt className="text-zinc-500">SSL expires</dt><dd className="tnum font-medium text-zinc-200">in 89 days</dd></div>
              </dl>
            </ModuleCard>

            <ModuleCard
              title="Health (sample: degraded)"
              status="degraded"
              freshness={{ lastCheckedAt: sampleAgo(5), source: "uptime-check" }}
            >
              <p className="text-[13px] leading-6 text-zinc-400">
                Storage latency above threshold for 12 minutes. Application and database unaffected.
              </p>
            </ModuleCard>

            <ModuleCard
              title="Backups (sample: stale)"
              status="unknown"
              freshness={{ lastCheckedAt: sampleAgo(47), source: "supabase" }}
            >
              <p className="text-[13px] leading-6 text-zinc-400">
                Last known backup succeeded 47 minutes ago. Source unreachable since — showing last
                known state, labeled as stale, never as live.
              </p>
            </ModuleCard>

            <ModuleCard
              title="Deployments (sample: failed)"
              status="incident"
              freshness={{ lastCheckedAt: sampleAgo(9), source: "github" }}
            >
              <ErrorState
                error={{
                  reason: "Build failed: missing environment variable STRIPE_SECRET_KEY at build step.",
                  at: sampleAgo(9),
                  referenceId: "dpl_8f3ka2",
                }}
              />
            </ModuleCard>

            <ModuleCard
              title="Security (sample: loading)"
              status="unknown"
              freshness={{ lastCheckedAt: null, source: null }}
            >
              <LoadingSkeleton lines={4} />
            </ModuleCard>

            <ModuleCard
              title="Care plan (sample: empty)"
              status="not_configured"
              freshness={{ lastCheckedAt: null, source: null }}
            >
              <EmptyState
                variant="not_configured"
                title="No care plan attached"
                description="Attach a plan to surface included maintenance, support channel and SLA here."
                action={{ label: "View plans", href: "#" }}
              />
            </ModuleCard>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Banners & permission
          </h2>
          <div className="space-y-4">
            <AttentionBanner
              tone="amber"
              title="2 deployments need attention"
              description="One failed 9 minutes ago, one is still queued."
              action={{ label: "View deployments", href: "#" }}
            />
            <div className="rounded-2xl border border-white/10 bg-white/[0.025]">
              <PermissionState />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Freshness chips
          </h2>
          <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <DataFreshness freshness={{ lastCheckedAt: sampleAgo(2), source: "cloudflare-api" }} />
            <DataFreshness freshness={{ lastCheckedAt: sampleAgo(180), source: "supabase" }} />
            <DataFreshness freshness={{ lastCheckedAt: null, source: null }} />
          </div>
        </section>

        <p className="border-t border-white/[0.07] pt-6 text-[13px] leading-6 text-zinc-600">
          End of preview. Real console routes live under{" "}
          <Link href="/console" className="underline underline-offset-4">/console</Link> and show only
          honest Unknown / Not configured states until data sources are connected.
        </p>
      </div>
    </div>
  );
}
