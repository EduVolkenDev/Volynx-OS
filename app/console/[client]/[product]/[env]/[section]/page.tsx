import { notFound } from "next/navigation";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { ModuleCard } from "@/components/console/ModuleCard";
import { DataFreshness } from "@/components/console/DataFreshness";
import { StatusPill } from "@/components/console/StatusPill";
import { AttentionBanner } from "@/components/console/states";
import {
  MODULE_GUIDE,
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
    <div className="mb-8">
      <p className="eyebrow text-[#e3b85c]">Console</p>
      <h1 className="font-display mt-3 text-4xl tracking-[-0.01em] text-white md:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-zinc-400">{description}</p>
    </div>
  );
}

function guide(key: string, href?: string) {
  const g = MODULE_GUIDE[key];
  return {
    blurb: g.blurb,
    guidance: href ? { ...g.guidance, action: { label: "Learn more", href } } : g.guidance,
  };
}

function ProductsSection() {
  const g = guide("products");
  return (
    <>
      <SectionHeader
        title="Products"
        description="Everything this client runs on Volynx Cloud. Each product has an immutable Volynx ID — names can change, IDs never do."
      />
      <ModuleCard title="Products" module={getProductList()} blurb={g.blurb} guidance={g.guidance}>
        {(data) => (
          <ul className="divide-y divide-white/[0.06]">
            {data.products.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-[14px] font-medium text-zinc-100">{p.name}</p>
                  <p className="tnum mt-0.5 text-[12px] text-zinc-600">{p.vlxId}</p>
                </div>
                <span className="text-[12px] text-zinc-500">{p.productionUrl ?? "URL pending"}</span>
              </li>
            ))}
          </ul>
        )}
      </ModuleCard>
      <p className="mt-5 text-[12px] leading-6 text-zinc-600">
        Deep-links may use the vlxId, but the server always resolves the product by database UUID
        inside the authorized tenant.
      </p>
    </>
  );
}

function InfrastructureSection() {
  const domain = guide("domain");
  const resources = guide("resources");
  return (
    <>
      <SectionHeader
        title="Infrastructure"
        description="The ground your product stands on: the domain customers reach, and every service running underneath it."
      />
      <div className="grid gap-5 md:grid-cols-2">
        <ModuleCard title="Domain & SSL" module={getDomainStatus()} blurb={domain.blurb} guidance={domain.guidance}>
          {(data) => (
            <dl className="space-y-2.5 text-[13px]">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Domain</dt>
                <dd className="font-medium text-zinc-200">{data.domain}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">DNS</dt>
                <dd className="font-medium text-zinc-200">
                  {data.dnsOk === null ? "Not observed" : data.dnsOk ? "Resolving" : "Failing"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500">SSL issuer</dt>
                <dd className="font-medium text-zinc-200">{data.ssl.issuer ?? "Unknown"}</dd>
              </div>
            </dl>
          )}
        </ModuleCard>
        <ModuleCard title="Resources" module={getResources()} blurb={resources.blurb} guidance={resources.guidance}>
          {(data) => (
            <ul className="space-y-2.5">
              {data.resources.map((r) => (
                <li
                  key={r.resource.id}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-zinc-200">{r.resource.name}</p>
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
  const g = guide("deployments");
  return (
    <>
      <SectionHeader
        title="Deployments"
        description="The shipping log. Every release — what changed, who shipped it, whether it worked."
      />
      <ModuleCard title="History" module={getDeployments()} blurb={g.blurb} guidance={g.guidance}>
        {(data) => (
          <ul className="divide-y divide-white/[0.06]">
            {data.deployments.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
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
      <p className="mt-5 text-[12px] leading-6 text-zinc-600">
        Failed deploys surface here with reason, timestamp and reference ID. Never silently.
      </p>
    </>
  );
}

function MonitoringSection() {
  const g = guide("health");
  return (
    <>
      <SectionHeader
        title="Monitoring"
        description="A pulse check on every part of your product. Only from real sources — never assumed."
      />
      <ModuleCard title="Health" module={getProductHealth()} blurb={g.blurb} guidance={g.guidance}>
        {(data) => (
          <ul>
            {data.components.map((c) => (
              <li
                key={c.key}
                className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-3 last:border-0 last:pb-0 first:pt-0"
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
      <p className="mt-5 text-[12px] leading-6 text-zinc-600">
        A component is only marked healthy when a valid source confirms it. Unknown is not operational.
      </p>
    </>
  );
}

function BackupsSection() {
  const g = guide("backups");
  return (
    <>
      <SectionHeader
        title="Backups"
        description="Your way back if everything breaks. Declared and verified — never assumed."
      />
      <ModuleCard title="Capabilities" module={getBackups()} blurb={g.blurb} guidance={g.guidance}>
        {(data) => (
          <ul className="divide-y divide-white/[0.06]">
            {data.capabilities.map((b) => (
              <li key={b.resource.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
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
      <p className="mt-5 text-[12px] leading-6 text-zinc-600">
        We don&apos;t assume GitHub — or anything else — is your backup. Capability is distinct
        from permission to invoke a restore.
      </p>
    </>
  );
}

function SecuritySection() {
  const g = guide("security");
  return (
    <>
      <SectionHeader
        title="Security"
        description="Protection you can verify. Every claim carries its evidence — or it doesn't get shown."
      />
      <ModuleCard title="Posture" module={getSecurityPosture()} blurb={g.blurb} guidance={g.guidance}>
        {(data) =>
          data.posture ? (
            <ul className="divide-y divide-white/[0.06]">
              {data.posture.claims.map((c) => (
                <li key={c.key} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
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
      <p className="mt-5 text-[12px] leading-6 text-zinc-600">
        We never show &ldquo;Protected&rdquo;, &ldquo;Secure&rdquo; or &ldquo;Encrypted&rdquo; without
        being able to explain technically why that status exists.
      </p>
    </>
  );
}

function IncidentsSection() {
  const g = guide("incidents");
  return (
    <>
      <SectionHeader
        title="Incidents"
        description="When something breaks, this is where the story gets told — honestly, in order."
      />
      <ModuleCard title="Incidents" module={getIncidents()} blurb={g.blurb} guidance={g.guidance}>
        {(data) => (
          <ul className="divide-y divide-white/[0.06]">
            {data.incidents.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
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
  const g = guide("care");
  return (
    <>
      <SectionHeader
        title="Care"
        description="The team keeping your product healthy while you sleep. What's covered, spelled out."
      />
      <ModuleCard title="Current plan" module={getCarePlan()} blurb={g.blurb} guidance={g.guidance}>
        {(data) =>
          data.plan ? (
            <div>
              <p className="font-display text-xl text-zinc-100">
                {data.plan.name} <span className="text-zinc-500">· {data.plan.tier}</span>
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] leading-6 text-zinc-400">
                {data.plan.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {data.plan.slaHours !== null && (
                <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-zinc-500">
                  Response SLA: {data.plan.slaHours}h{" "}
                  <span className="normal-case tracking-normal">(contracted, never inferred)</span>
                </p>
              )}
            </div>
          ) : null
        }
      </ModuleCard>
    </>
  );
}

function SupportSection() {
  const g = guide("support");
  return (
    <>
      <SectionHeader
        title="Support"
        description="Real humans, on call for your product. Ask anything."
      />
      <ModuleCard title="Requests" module={getSupportRequests()} blurb={g.blurb} guidance={g.guidance}>
        {(data) => (
          <ul className="divide-y divide-white/[0.06]">
            {data.requests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
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
      <div className="mt-5">
        <AttentionBanner
          tone="amber"
          title="Ticketing integration pending"
          description="New requests can't be routed anywhere yet. Submission stays disabled until the integration, authorization and audit trail exist — nothing is lost silently."
        />
        <form className="console-panel mt-5 p-5 md:p-7">
          <p className="eyebrow mb-5 text-zinc-500">New request</p>
          <fieldset disabled className="space-y-4 opacity-60">
            <div>
              <label htmlFor="support-subject" className="mb-1.5 block text-[13px] font-medium text-zinc-300">
                Subject
              </label>
              <input
                id="support-subject"
                type="text"
                placeholder="e.g. Checkout is timing out in production"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-[14px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-white/25"
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
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-[14px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-white/25"
              />
            </div>
            <button
              type="button"
              className="rounded-xl bg-white px-5 py-2.5 text-[14px] font-semibold text-black"
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
      <SectionHeader
        title="Settings"
        description="Your console, your rules. Nothing here touches your product's infrastructure."
      />
      <div className="grid gap-5 md:grid-cols-2">
        <section className="console-panel">
          <header className="px-5 pb-4 pt-5 md:px-6">
            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-100">Notifications</h3>
            <p className="mt-1.5 text-[13px] leading-6 text-zinc-500">
              What this console tells you about. Stored here, in this console only.
            </p>
          </header>
          <div className="px-5 pb-5 md:px-6 md:pb-6">
            <div className="space-y-1">
              {["Incident opened or escalated", "Deployment failed", "Backup verification failed"].map((name) => (
                <label
                  key={name}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[13px] text-zinc-300 transition hover:bg-white/[0.04]"
                >
                  {name}
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-[#e3b85c]"
                  />
                </label>
              ))}
            </div>
            <p className="mt-4 text-[12px] leading-6 text-zinc-600">
              Delivery channels (email, Slack, webhooks) are configured per organization once the
              notification provider is connected.
            </p>
          </div>
        </section>
        <section className="console-panel">
          <header className="px-5 pb-4 pt-5 md:px-6">
            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-100">Danger zone</h3>
            <p className="mt-1.5 text-[13px] leading-6 text-zinc-500">
              Irreversible actions. Locked until there&apos;s a real backend, a real permission check, and an audit trail.
            </p>
          </header>
          <div className="px-5 pb-5 md:px-6 md:pb-6">
            <div className="flex flex-wrap gap-2">
              {["Disconnect domain", "Rotate credentials", "Delete environment"].map((name) => (
                <button
                  key={name}
                  type="button"
                  disabled
                  title="Unlocks only for authorized roles, against real backends"
                  className="cursor-not-allowed rounded-xl border border-red-400/20 px-3.5 py-2 text-[13px] font-medium text-red-300/50"
                >
                  {name}
                </button>
              ))}
            </div>
            <p className="mt-4 text-[12px] leading-6 text-zinc-600">
              Destructive operations require explicit confirmation — typed, when it really matters —
              plus permission verification and audit logging.
            </p>
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
      <p className="mt-10 border-t border-white/[0.07] pt-5 text-[12px] text-zinc-600">
        No data sources connected —{" "}
        <a href={contextPath(ctx)} className="text-zinc-400 underline-offset-4 hover:text-white hover:underline">
          Back to overview
        </a>
      </p>
    </ConsoleShell>
  );
}
