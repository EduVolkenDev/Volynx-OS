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

export function getOverview(ctx: TenantContext): OverviewSnapshot {
  const modules: OverviewSnapshot["modules"] = [
    { key: "health", name: "Health", href: contextPath(ctx, "monitoring"), module: notConfigured<Observation>() },
    { key: "domain", name: "Domain & SSL", href: contextPath(ctx, "infrastructure"), module: notConfigured<Observation>() },
    { key: "deployments", name: "Deployments", href: contextPath(ctx, "deployments"), module: notConfigured<Observation>() },
    { key: "backups", name: "Backups", href: contextPath(ctx, "backups"), module: notConfigured<Observation>() },
    { key: "security", name: "Security", href: contextPath(ctx, "security"), module: notConfigured<Observation>() },
    { key: "care", name: "Care", href: contextPath(ctx, "care"), module: notConfigured<Observation>() },
  ];
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
