/**
 * Console data access — Muse domain (UI-side only).
 *
 * Shapes follow contracts/cloud-console-v1.ts (decision 007). There are no
 * endpoints yet, so every operational module honestly reports "not_configured":
 * no provider is wired, nothing is being observed. This is deliberate —
 * protocol §3 forbids inventing uptime, statuses, backups or metrics, and
 * decision 3 forbids any positive state without a source and check time.
 *
 * When the API lands, these functions become thin fetchers of ApiResponse<T>.
 * The server will resolve the product by database UUID inside the authorized
 * tenant (ConsoleContext); URL slugs/vlxId never authorize access.
 */

import type {
  BackupListData,
  CarePlanData,
  DeploymentListData,
  DomainStatus,
  IncidentListData,
  ModuleState,
  Observation,
  ProductHealth,
  ProductListData,
  ResourceListData,
  SecurityPostureData,
  SupportData,
  TenantContext,
  OverviewSnapshot,
} from "./types";

function humanize(slug: string): string {
  return slug
    .split(/[-_]/g)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function resolveContext(client: string, product: string, env: string): TenantContext {
  return { client, product, env };
}

export function contextLabel(ctx: TenantContext): string {
  return `${humanize(ctx.client)} · ${humanize(ctx.product)} · ${humanize(ctx.env)}`;
}

export function contextPath(ctx: TenantContext, section = ""): string {
  const base = `/console/${ctx.client}/${ctx.product}/${ctx.env}`;
  return section ? `${base}/${section}` : base;
}

/** Every module is unconfigured until a real adapter is wired. One honest state, typed per module. */
function notConfigured<T>(): ModuleState<T> {
  return { state: "not_configured", data: null };
}

/** Demo navigation contexts — illustrative only, not tenant data. No IDs are fabricated. */
export const DEMO_CONTEXTS: TenantContext[] = [
  { client: "volynx", product: "volynx-os", env: "production" },
  { client: "volynx", product: "volynx-os", env: "staging" },
];

/**
 * Plain-language guide per module: what it watches, why it matters, and what
 * to do when it's empty. Written for a brand-new employee, not an SRE.
 */
export const MODULE_GUIDE: Record<
  string,
  { blurb: string; guidance: { title: string; body: string } }
> = {
  health: {
    blurb: "Is the product alive? Watches the app, database and storage — and says so in plain words.",
    guidance: {
      title: "No health checks yet",
      body: "Connect a monitoring source and this module will tell you whether each part of your product is working. Until then we show nothing rather than guess — unknown is not operational.",
    },
  },
  domain: {
    blurb: "Can customers reach you? Tracks your domain, DNS and certificate expiry.",
    guidance: {
      title: "No domain connected",
      body: "Point a domain at this product and we'll watch it for you: DNS resolving, certificate valid, CDN in front. One glance tells you if the front door is open.",
    },
  },
  deployments: {
    blurb: "What shipped, when, and whether it worked. Every release, with its story.",
    guidance: {
      title: "No deployment source",
      body: "Connect your repository or hosting provider and every release appears here — what changed, who shipped it, and whether it succeeded. Failed deploys show their reason, never silently.",
    },
  },
  backups: {
    blurb: "If everything broke tomorrow, could you come back? That's what this answers.",
    guidance: {
      title: "Backup capability unknown",
      body: "Tell us where backups live and how long they're kept. We track the last successful backup and whether a restore is actually possible. We never assume your git history counts as a backup.",
    },
  },
  security: {
    blurb: "Are the doors locked? Every protection claim shown with its evidence.",
    guidance: {
      title: "No security evidence yet",
      body: "HTTPS, WAF and DDoS protection appear here only when we can show you the technical evidence behind each claim. No evidence, no badge — that's the rule.",
    },
  },
  care: {
    blurb: "Who keeps this product healthy day to day — and what they're responsible for.",
    guidance: {
      title: "No care plan attached",
      body: "Attach a care plan to see what's covered: preventive maintenance, fixes, support channel and response times. Your product's safety net, spelled out.",
    },
  },
  incidents: {
    blurb: "When something breaks, this is the timeline. What happened, what's being done.",
    guidance: {
      title: "No incident tracking yet",
      body: "Active incidents and their full lifecycle — detected, investigating, mitigating, resolved — appear here once monitoring is connected. No news is not good news; it's unknown news.",
    },
  },
  products: {
    blurb: "Every product under this client, with its identity and status.",
    guidance: {
      title: "No products registered",
      body: "Products appear here once they're registered in the platform, each with its immutable Volynx ID.",
    },
  },
  resources: {
    blurb: "Every service this product runs on — databases, storage, repos and secrets.",
    guidance: {
      title: "No providers connected",
      body: "Cloudflare, database and storage providers appear here once connected — with the resources each one manages.",
    },
  },
  support: {
    blurb: "Talk to the humans who keep your product alive.",
    guidance: {
      title: "Support isn't wired up yet",
      body: "Past requests and their status will live here once the ticketing integration exists.",
    },
  },
};

export function getOverview(ctx: TenantContext): OverviewSnapshot {
  const defs = [
    { key: "health", name: "Health", section: "monitoring" },
    { key: "domain", name: "Domain & SSL", section: "infrastructure" },
    { key: "deployments", name: "Deployments", section: "deployments" },
    { key: "backups", name: "Backups", section: "backups" },
    { key: "security", name: "Security", section: "security" },
    { key: "care", name: "Care", section: "care" },
  ];
  const modules: OverviewSnapshot["modules"] = defs.map((d) => ({
    key: d.key,
    name: d.name,
    href: contextPath(ctx, d.section),
    blurb: MODULE_GUIDE[d.key].blurb,
    guidance: {
      ...MODULE_GUIDE[d.key].guidance,
      action: { label: `Open ${d.name}`, href: contextPath(ctx, d.section) },
    },
    module: notConfigured<Observation>(),
  }));
  const pending = modules.filter((m) => m.module.state === "not_configured").length;
  return {
    identity: {
      // No identity source exists yet: vlxId stays null. Never fabricate VLX-* IDs.
      name: humanize(ctx.product),
      vlxId: null,
      contextLabel: contextLabel(ctx),
    },
    health: notConfigured<ProductHealth>(),
    modules,
    attention:
      pending > 0
        ? [
            `${pending} of ${modules.length} modules are not configured — no data is being collected yet. Connect providers to activate them.`,
          ]
        : [],
  };
}

/* ------------------------- Per-section module states ------------------------ */

export function getProductList(): ModuleState<ProductListData> {
  return notConfigured();
}

export function getDomainStatus(): ModuleState<DomainStatus> {
  return notConfigured();
}

export function getResources(): ModuleState<ResourceListData> {
  return notConfigured();
}

export function getDeployments(): ModuleState<DeploymentListData> {
  return notConfigured();
}

export function getProductHealth(): ModuleState<ProductHealth> {
  return notConfigured();
}

export function getBackups(): ModuleState<BackupListData> {
  return notConfigured();
}

export function getSecurityPosture(): ModuleState<SecurityPostureData> {
  return notConfigured();
}

export function getIncidents(): ModuleState<IncidentListData> {
  return notConfigured();
}

export function getCarePlan(): ModuleState<CarePlanData> {
  return notConfigured();
}

export function getSupportRequests(): ModuleState<SupportData> {
  return notConfigured();
}
