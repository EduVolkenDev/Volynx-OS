import { notFound } from "next/navigation";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { ModuleCard } from "@/components/console/ModuleCard";
import { DataFreshness } from "@/components/console/DataFreshness";
import { StatusPill } from "@/components/console/StatusPill";
import { AttentionBanner } from "@/components/console/states";
import {
  contextPath,
  getBackups,
  getCarePlan,
  getDeployments,
  getDomainStatus,
  getIncidents,
  getProductHealth,
  getProductList,
  getResources,
  getSecurityPosture,
  getSupportRequests,
  resolveContext,
} from "@/lib/console/data";
import { SECTIONS } from "@/lib/console/nav";

type Params = { client: string; product: string; env: string; section: string };

const VALID = new Set(SECTIONS.map((s) => s.slug).filter(Boolean));

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">{title}</h1>
      <p className="mt-1.5 text-[14px] text-zinc-400">{description}</p>
    </div>
  );
}

function ProductsSection() {
  return (
    <>
      <SectionHeader title="Products" description="Every product under this client, with its identity and status." />
      <ModuleCard title="Products" module={getProductList()}>
        {(data) => (
          <ul className="divide-y divide-white/[0.06]">
            {data.products.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-[13px] font-medium text-zinc-200">{p.name}</p>
                  <p className="tnum mt-0.5 text-[12px] text-zinc-600">{p.vlxId}</p>
                </div>
                <span className="text-[12px] text-zinc-500">{p.productionUrl ?? "URL pending"}</span>
              </li>
            ))}
          </ul>
        )}
      </ModuleCard>
      <p className="mt-4 text-[12px] leading-6 text-zinc-600">
        Deep-links may use the vlxId, but the server always resolves the product by database UUID
        inside the authorized tenant.
      </p>
    </>
  );
}

function InfrastructureSection() {
  return (
    <>
      <SectionHeader title="Infrastructure" description="Connected services, providers and resources." />
      <div className="grid gap-4 md:grid-cols-2">
        <ModuleCard title="Domain & SSL" module={getDomainStatus()}>
          {(data) => (
            <dl className="space-y-2 text-[13px]">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Domain</dt>
                <dd className="font-medium text-zinc-200">{data.domain}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">DNS</dt>
                <dd className="font-medium text-zinc-200">
                  {data.dnsOk === null ? "Not observed" : data.dnsOk ? "OK" : "Failing"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500">SSL issuer</dt>
                <dd className="font-medium text-zinc-200">{data.ssl.issuer ?? "Unknown"}</dd>
              </div>
            </dl>
          )}
        </ModuleCard>
        <ModuleCard title="Resources" module={getResources()}>
          {(data) => (
            <ul className="space-y-2.5">
              {data.resources.map((r) => (
                <li
                  key={r.resource.id}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-zinc-300">{r.resource.name}</p>
                    <p className="text-[12px] text-zinc-600">
                      {r.type} · {r.provider}
                    </p>
                  </div>
                  <span className="ml-auto">
                    <StatusPill status={r.status} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ModuleCard>
      </div>
    </>
  );
}

function DeploymentsSection() {
  return (
    <>
      <SectionHeader title="Deployments" description="Release history with source, status and timestamp." />
      <ModuleCard title="History" module={getDeployments()}>
        {(data) => (
          <ul className="divide-y divide-white/[0.06]">
            {data.deployments.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="tnum text-[13px] font-medium text-zinc-200">
                    {d.source.commitSha ? d.source.commitSha.slice(0, 7) : d.id}
                    {d.source.branch ? ` · ${d.source.branch}` : ""}
                  </p>
                  <p className="mt-0.5 text-[12px] text-zinc-600">
                    {new Date(d.createdAt).toLocaleString()}
                    {d.triggeredBy ? ` · by ${d.triggeredBy}` : ""}
                  </p>
                </div>
                <span className="text-[12px] uppercase tracking-[0.12em] text-zinc-400">{d.status}</span>
              </li>
            ))}
          </ul>
        )}
      </ModuleCard>
      <p className="mt-4 text-[12px] leading-6 text-zinc-600">
        Failed deploys surface here with reason, timestamp and reference ID. Never silently.
      </p>
    </>
  );
}

function MonitoringSection() {
  return (
    <>
      <SectionHeader title="Monitoring" description="Basic health per component — only from valid sources." />
      <ModuleCard title="Health" module={getProductHealth()}>
        {(data) => (
          <ul>
            {data.components.map((c) => (
              <li
                key={c.key}
                className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-2.5 last:border-0 last:pb-0 first:pt-0"
              >
                <span className="text-[13px] font-medium text-zinc-300">{c.name}</span>
                <span className="flex items-center gap-3">
                  <DataFreshness observation={c} />
                  <StatusPill status={c.status} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </ModuleCard>
      <p className="mt-4 text-[12px] leading-6 text-zinc-600">
        A component is only marked healthy when a valid source confirms it. Unknown is not operational.
      </p>
    </>
  );
}

function BackupsSection() {
  return (
    <>
      <SectionHeader title="Backups" description="Capability, status and history — declared, not assumed." />
      <ModuleCard title="Capabilities" module={getBackups()}>
        {(data) => (
          <ul className="divide-y divide-white/[0.06]">
            {data.capabilities.map((b) => (
              <li key={b.resource.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-[13px] font-medium text-zinc-200">{b.resource.name}</p>
                  <p className="mt-0.5 text-[12px] text-zinc-600">
                    {b.provider}
                    {b.lastSuccessfulAt ? ` · last success ${new Date(b.lastSuccessfulAt).toLocaleDateString()}` : " · no successful backup observed"}
                    {b.retentionDays ? ` · ${b.retentionDays}d retention` : ""}
                  </p>
                </div>
                <StatusPill status={b.status} />
              </li>
            ))}
          </ul>
        )}
      </ModuleCard>
      <p className="mt-4 text-[12px] leading-6 text-zinc-600">
        We don&apos;t assume GitHub — or anything else — is your backup. Capability is distinct
        from permission to invoke a restore.
      </p>
    </>
  );
}

function SecuritySection() {
  return (
    <>
      <SectionHeader title="Security" description="Visible protection state — every claim needs evidence." />
      <ModuleCard title="Posture" module={getSecurityPosture()}>
        {(data) =>
          data.posture ? (
            <ul className="divide-y divide-white/[0.06]">
              {data.posture.claims.map((c) => (
                <li key={c.key} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-[13px] font-medium text-zinc-200">{c.key}</p>
                    <p className="mt-0.5 text-[12px] text-zinc-600">
                      {c.evidence ? c.evidence.explanation : "No evidence yet — no badge shown."}
                    </p>
                  </div>
                  <StatusPill status={c.state} />
                </li>
              ))}
            </ul>
          ) : null
        }
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
      <ModuleCard title="Incidents" module={getIncidents()}>
        {(data) => (
          <ul className="divide-y divide-white/[0.06]">
            {data.incidents.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-[13px] font-medium text-zinc-200">{i.title}</p>
                  <p className="mt-0.5 text-[12px] text-zinc-600">
                    {i.severity} · {i.status} · since {new Date(i.startedAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ModuleCard>
    </>
  );
}

function CareSection() {
  return (
    <>
      <SectionHeader title="Care" description="Preventive maintenance, fixes and support included in the plan." />
      <ModuleCard title="Current plan" module={getCarePlan()}>
        {(data) =>
          data.plan ? (
            <div>
              <p className="text-[13px] font-medium text-zinc-200">
                {data.plan.name} · {data.plan.tier}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-zinc-400">
                {data.plan.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {data.plan.slaHours !== null && (
                <p className="mt-2 text-[12px] text-zinc-500">SLA: {data.plan.slaHours}h (contracted)</p>
              )}
            </div>
          ) : null
        }
      </ModuleCard>
    </>
  );
}

function SupportSection() {
  return (
    <>
      <SectionHeader title="Support" description="Request help from the Volynx team." />
      <ModuleCard title="Requests" module={getSupportRequests()}>
        {(data) => (
          <ul className="divide-y divide-white/[0.06]">
            {data.requests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-[13px] font-medium text-zinc-200">{r.subject}</p>
                  <p className="mt-0.5 text-[12px] text-zinc-600">
                    {new Date(r.createdAt).toLocaleDateString()} · {r.messages.length} messages
                  </p>
                </div>
                <span className="text-[12px] uppercase tracking-[0.12em] text-zinc-400">{r.status}</span>
              </li>
            ))}
          </ul>
        )}
      </ModuleCard>
      <div className="mt-4">
        <AttentionBanner
          tone="amber"
          title="Ticketing integration pending"
          description="New requests can't be routed anywhere yet. Submission stays disabled until the integration, authorization and audit trail exist — nothing is lost silently."
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
      </div>
    </>
  );
}

function SettingsSection() {
  return (
    <>
      <SectionHeader title="Settings" description="Safe administrative configuration." />
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
          <header className="border-b border-white/[0.07] px-4 py-3">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-300">Notifications</h3>
          </header>
          <div className="p-4">
            <p className="text-[13px] leading-6 text-zinc-400">
              Alert preferences for this console only. Delivery channels are configured per
              organization once the notification provider is connected.
            </p>
            <div className="mt-4 space-y-2.5">
              {["Incident opened or escalated", "Deployment failed", "Backup verification failed"].map((name) => (
                <label key={name} className="flex cursor-pointer items-center justify-between gap-3 text-[13px] text-zinc-300">
                  {name}
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-zinc-100"
                  />
                </label>
              ))}
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
          <header className="border-b border-white/[0.07] px-4 py-3">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-300">Danger zone</h3>
          </header>
          <div className="p-4">
            <p className="text-[13px] leading-6 text-zinc-400">
              Destructive operations — delete product, restore database, rotate credentials,
              disconnect domain — require explicit confirmation, permission verification and audit
              logging. They unlock here only for authorized roles, and only against real backends.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Disconnect domain", "Rotate credentials", "Delete environment"].map((name) => (
                <button
                  key={name}
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-lg border border-red-400/20 px-3 py-1.5 text-[13px] font-medium text-red-300/50"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default async function SectionPage({ params }: { params: Promise<Params> }) {
  const { client, product, env, section } = await params;
  if (!VALID.has(section)) notFound();
  const ctx = resolveContext(client, product, env);

  return (
    <ConsoleShell ctx={ctx} activeSection={section}>
      {section === "products" && <ProductsSection />}
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
        No data sources connected —{" "}
        <a href={contextPath(ctx)} className="underline-offset-4 hover:underline">
          Back to overview
        </a>
      </p>
    </ConsoleShell>
  );
}
