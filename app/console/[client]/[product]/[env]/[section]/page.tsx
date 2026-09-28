import { notFound } from "next/navigation";
import { GitBranch, KeyRound, Plug2 } from "lucide-react";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { StatusPill } from "@/components/console/StatusPill";
import { DataFreshness } from "@/components/console/DataFreshness";
import { AttentionBanner, EmptyState, ModuleCard } from "@/components/console/states";
import { contextPath, getSecurityClaims, listProducts, pendingFreshness, resolveContext } from "@/lib/console/data";
import { SECTIONS } from "@/lib/console/nav";

type Params = { client: string; product: string; env: string; section: string };

const VALID = new Set(SECTIONS.map((s) => s.slug).filter(Boolean));

/** Module-level so the notification card's own freshness doesn't break render purity. */
const SETTINGS_RENDERED_AT = "2026-09-28T03:00:00.000Z";

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">{title}</h1>
      <p className="mt-1.5 text-[14px] text-zinc-400">{description}</p>
    </div>
  );
}

function ProductsSection({ params }: { params: { client: string; product: string; env: string } }) {
  const products = listProducts(params.client);
  return (
    <>
      <SectionHeader title="Products" description="Every product under this client, with its identity and status." />
      <div className="grid gap-4 md:grid-cols-2">
        {products.map((p) => (
          <ModuleCard
            key={p.slug}
            title={p.name}
            status="unknown"
            freshness={pendingFreshness()}
            action={{ label: "Open overview", href: `/console/${params.client}/${p.slug}/${params.env}` }}
          >
            <dl className="space-y-2 text-[13px]">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Volynx ID</dt>
                <dd className="tnum font-medium text-zinc-200">{p.vlxId}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Production URL</dt>
                <dd className="font-medium text-zinc-200">{p.url ?? "Pending"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Environment</dt>
                <dd className="font-medium text-zinc-200">{params.env}</dd>
              </div>
            </dl>
          </ModuleCard>
        ))}
      </div>
    </>
  );
}

function DeploymentsSection() {
  return (
    <>
      <SectionHeader title="Deployments" description="Release history with source, status and timestamp." />
      <ModuleCard title="History" status="not_configured" freshness={pendingFreshness()}>
        <EmptyState
          variant="not_configured"
          title="No deployment source connected"
          description="Connect a repository or provider (GitHub, Cloudflare) to track every release — what shipped, from which commit, and whether it succeeded. Failed deploys surface here with reason, timestamp and reference ID. Never silently."
        />
      </ModuleCard>
    </>
  );
}

function MonitoringSection() {
  return (
    <>
      <SectionHeader title="Monitoring" description="Basic health per component — only from valid sources." />
      <div className="grid gap-4 md:grid-cols-3">
        {["Application", "Database", "Storage"].map((name) => (
          <ModuleCard key={name} title={name} status="unknown" freshness={pendingFreshness()}>
            <EmptyState
              variant="no_data"
              title="No checks yet"
              description="Health checks haven't reported for this component. Unknown is not operational."
            />
          </ModuleCard>
        ))}
      </div>
    </>
  );
}

function BackupsSection() {
  return (
    <>
      <SectionHeader title="Backups" description="Capability, status and history — declared, not assumed." />
      <div className="grid gap-4 md:grid-cols-2">
        {["Database", "Storage"].map((resource) => (
          <ModuleCard key={resource} title={resource} status="not_configured" freshness={pendingFreshness()}>
            <EmptyState
              variant="not_configured"
              title="Backup capability unknown"
              description="Declare the provider, retention and restore capability for this resource. Last successful backup, verification status and restore options appear here once declared."
            />
          </ModuleCard>
        ))}
      </div>
    </>
  );
}

function SecuritySection() {
  const claims = getSecurityClaims();
  return (
    <>
      <SectionHeader title="Security" description="Visible protection state — every claim needs evidence." />
      <ModuleCard title="Posture" status="not_configured" freshness={pendingFreshness()}>
        <ul className="divide-y divide-white/[0.06]">
          {claims.map((c) => (
            <li key={c.key} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-[13px] font-medium text-zinc-200">{c.label}</p>
                <p className="mt-0.5 text-[12px] text-zinc-600">
                  {c.evidence ?? "No evidence yet — no badge shown."}
                </p>
              </div>
              <StatusPill status={c.state} />
            </li>
          ))}
        </ul>
      </ModuleCard>
      <p className="mt-4 text-[12px] leading-6 text-zinc-600">
        We never show “Protected”, “Secure” or “Encrypted” without being able to explain technically
        why that status exists.
      </p>
    </>
  );
}

function IncidentsSection() {
  return (
    <>
      <SectionHeader title="Incidents" description="Detected → Investigating → Mitigating → Resolved → Postmortem." />
      <ModuleCard title="Active" status="unknown" freshness={pendingFreshness()}>
        <EmptyState
          variant="no_data"
          title="No incident data source"
          description="Active incidents and their lifecycle appear here once monitoring is connected."
        />
      </ModuleCard>
      <div className="mt-4">
        <ModuleCard title="History" status="unknown" freshness={pendingFreshness()}>
          <EmptyState
            variant="no_data"
            title="No incidents recorded"
            description="Past incidents, timelines and postmortems will live here."
          />
        </ModuleCard>
      </div>
    </>
  );
}

function CareSection() {
  return (
    <>
      <SectionHeader title="Care" description="Preventive maintenance, fixes and support included in the plan." />
      <ModuleCard title="Current plan" status="not_configured" freshness={pendingFreshness()}>
        <EmptyState
          variant="not_configured"
          title="No care plan attached"
          description="Attach a plan to surface what's included — preventive maintenance, bug fixes, dependency updates, support channel and SLA."
        />
      </ModuleCard>
    </>
  );
}

function SupportSection() {
  return (
    <>
      <SectionHeader title="Support" description="Request help from the Volynx team." />
      <AttentionBanner
        tone="amber"
        title="Ticketing integration pending"
        description="The form below is ready, but requests can't be routed anywhere yet. Nothing will be lost silently — submission stays disabled until the integration exists."
      />
      <form className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 md:p-6">
        <fieldset disabled className="space-y-4 opacity-60">
          <div>
            <label htmlFor="support-subject" className="mb-1.5 block text-[13px] font-medium text-zinc-300">
              Subject
            </label>
            <input
              id="support-subject"
              type="text"
              placeholder="e.g. Checkout is timing out in production"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-[14px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-white/25"
            />
          </div>
          <div>
            <label htmlFor="support-details" className="mb-1.5 block text-[13px] font-medium text-zinc-300">
              What&apos;s happening?
            </label>
            <textarea
              id="support-details"
              rows={5}
              placeholder="Describe what you see, when it started, and what you've tried."
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-[14px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-white/25"
            />
          </div>
          <button
            type="button"
            className="rounded-lg bg-white px-4 py-2.5 text-[14px] font-semibold text-black"
          >
            Submit request
          </button>
        </fieldset>
      </form>
    </>
  );
}

function InfrastructureSection() {
  return (
    <>
      <SectionHeader title="Infrastructure" description="Connected services, providers and resources." />
      <div className="grid gap-4 md:grid-cols-2">
        <ModuleCard title="Providers" status="not_configured" freshness={pendingFreshness()}>
          <EmptyState
            variant="not_configured"
            title="No providers connected"
            description="Cloudflare, database and storage providers appear here once connected — with the resources each one manages."
          />
        </ModuleCard>
        <ModuleCard title="Resources" status="not_configured" freshness={pendingFreshness()}>
          <ul className="space-y-2.5">
            {[
              { icon: GitBranch, label: "Repository", hint: "GitHub metadata, commit ↔ deploy relation" },
              { icon: Plug2, label: "Integrations", hint: "Connected services and their state" },
              { icon: KeyRound, label: "Secrets", hint: "Metadata only — never values" },
            ].map((r) => (
              <li
                key={r.label}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-3.5 py-3"
              >
                <r.icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
                <div>
                  <p className="text-[13px] font-medium text-zinc-300">{r.label}</p>
                  <p className="text-[12px] text-zinc-600">{r.hint}</p>
                </div>
                <span className="ml-auto">
                  <StatusPill status="not_configured" />
                </span>
              </li>
            ))}
          </ul>
        </ModuleCard>
      </div>
    </>
  );
}

function SettingsSection() {
  return (
    <>
      <SectionHeader title="Settings" description="Safe administrative configuration." />
      <div className="grid gap-4 md:grid-cols-2">
        <ModuleCard title="Notifications" status="operational" freshness={{ lastCheckedAt: SETTINGS_RENDERED_AT, source: "console" }}>
          <p className="text-[13px] leading-6 text-zinc-400">
            Incident and deployment alerts for your role. Delivery channels are configured per
            organization once the notification provider is connected.
          </p>
          <div className="mt-4 space-y-2.5">
            {["Incident opened or escalated", "Deployment failed", "Backup verification failed"].map((label) => (
              <label key={label} className="flex cursor-pointer items-center justify-between gap-3 text-[13px] text-zinc-300">
                {label}
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-zinc-100"
                />
              </label>
            ))}
          </div>
        </ModuleCard>
        <ModuleCard title="Danger zone" status="unknown" freshness={pendingFreshness()}>
          <p className="text-[13px] leading-6 text-zinc-400">
            Destructive operations — delete product, restore database, rotate credentials,
            disconnect domain — require explicit confirmation, permission verification and audit
            logging. They unlock here only for authorized roles, and only against real backends.
          </p>
          <div className="mt-4 flex flex-wrap gap-2" aria-disabled="true">
            {["Disconnect domain", "Rotate credentials", "Delete environment"].map((label) => (
              <button
                key={label}
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg border border-red-400/20 px-3 py-1.5 text-[13px] font-medium text-red-300/50"
              >
                {label}
              </button>
            ))}
          </div>
        </ModuleCard>
      </div>
    </>
  );
}

export default async function SectionPage({ params }: { params: Promise<Params> }) {
  const { client, product, env, section } = await params;
  if (!VALID.has(section)) notFound();
  const ctx = resolveContext(client, product, env);
  if (!ctx) notFound();

  return (
    <ConsoleShell ctx={ctx} activeSection={section}>
      {section === "products" && <ProductsSection params={{ client, product, env }} />}
      {section === "infrastructure" && <InfrastructureSection />}
      {section === "deployments" && <DeploymentsSection />}
      {section === "monitoring" && <MonitoringSection />}
      {section === "backups" && <BackupsSection />}
      {section === "security" && <SecuritySection />}
      {section === "incidents" && <IncidentsSection />}
      {section === "care" && <CareSection />}
      {section === "support" && <SupportSection />}
      {section === "settings" && <SettingsSection />}
      <p className="mt-8 border-t border-white/[0.07] pt-4 text-[12px] text-zinc-600">
        <DataFreshness freshness={pendingFreshness()} /> —{" "}
        <a href={contextPath(ctx)} className="underline-offset-4 hover:underline">
          Back to overview
        </a>
      </p>
    </ConsoleShell>
  );
}
