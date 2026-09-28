/**
 * Console data access — Muse domain (UI-side only).
 *
 * This module resolves the console context (client / product / environment)
 * from the URL and exposes "pending" snapshots: every operational module
 * reports Unknown / Not configured until Codex wires real data sources.
 *
 * This is deliberate, not a stub to be filled with fake data: §3 of the
 * protocol forbids inventing uptime, statuses, backups or metrics. When the
 * API contracts in /contracts are ready, these functions become thin
 * fetchers over them — the components already handle every state.
 */

import type {
  BackupInfo,
  CarePlanInfo,
  DataFreshness,
  DeploymentInfo,
  DomainInfo,
  HealthComponent,
  IncidentSummary,
  ModuleState,
  ProductIdentity,
  SecurityClaim,
  SemanticStatus,
} from "./types";

export interface ConsoleClient {
  slug: string;
  name: string;
}

export interface ConsoleProduct {
  slug: string;
  name: string;
  vlxId: string;
  url: string | null;
}

export interface ConsoleContext {
  org: string;
  client: ConsoleClient;
  product: ConsoleProduct;
  env: string;
}

/** Registry of known clients/products — identity config, not operational data. */
const REGISTRY: Array<{
  client: ConsoleClient;
  products: ConsoleProduct[];
  envs: string[];
}> = [
  {
    client: { slug: "volynx", name: "Volynx" },
    products: [
      { slug: "volynx-os", name: "Volynx OS", vlxId: "VLX-VX-001", url: null },
      { slug: "volynx-site", name: "Volynx Platform", vlxId: "VLX-VX-002", url: "https://volynx.world" },
    ],
    envs: ["production", "staging"],
  },
  {
    client: { slug: "jonathan", name: "Jonathan" },
    products: [
      { slug: "property-flow", name: "Property Flow", vlxId: "VLX-JP-001", url: null },
    ],
    envs: ["production", "staging"],
  },
  {
    client: { slug: "pratti", name: "Pratti Beauté" },
    products: [
      { slug: "pratti-beaute", name: "Pratti Beauté", vlxId: "VLX-PB-001", url: null },
    ],
    envs: ["production"],
  },
  {
    client: { slug: "pdu", name: "Palavras do Universo" },
    products: [
      { slug: "pdu-app", name: "Palavras do Universo", vlxId: "VLX-PU-001", url: null },
    ],
    envs: ["production"],
  },
];

export function listClients(): ConsoleClient[] {
  return REGISTRY.map((r) => r.client);
}

export function listProducts(clientSlug: string): ConsoleProduct[] {
  return REGISTRY.find((r) => r.client.slug === clientSlug)?.products ?? [];
}

export function listEnvs(clientSlug: string): string[] {
  return REGISTRY.find((r) => r.client.slug === clientSlug)?.envs ?? ["production"];
}

export function resolveContext(
  clientSlug: string,
  productSlug: string,
  env: string
): ConsoleContext | null {
  const entry = REGISTRY.find((r) => r.client.slug === clientSlug);
  const product = entry?.products.find((p) => p.slug === productSlug);
  if (!entry || !product || !entry.envs.includes(env)) return null;
  return { org: "Volynx Cloud", client: entry.client, product, env };
}

export function contextPath(ctx: ConsoleContext, section = ""): string {
  const base = `/console/${ctx.client.slug}/${ctx.product.slug}/${ctx.env}`;
  return section ? `${base}/${section}` : base;
}

/** Freshness for "no data source connected yet". */
export function pendingFreshness(): DataFreshness {
  return { lastCheckedAt: null, source: null };
}

function pendingState<T>(): ModuleState<T> {
  return { status: "not_configured", freshness: pendingFreshness(), data: null, error: null };
}

function unknownState<T>(): ModuleState<T> {
  return { status: "unknown", freshness: pendingFreshness(), data: null, error: null };
}

export interface OverviewSnapshot {
  identity: ProductIdentity;
  overall: SemanticStatus;
  domain: ModuleState<DomainInfo>;
  lastDeployment: ModuleState<DeploymentInfo>;
  health: HealthComponent[];
  backups: ModuleState<BackupInfo>[];
  security: ModuleState<SecurityClaim>[];
  care: ModuleState<CarePlanInfo>;
  incidents: { active: IncidentSummary[]; source: DataFreshness };
}

/**
 * Honest snapshot: identity comes from the registry (config), everything
 * operational is pending until data sources are connected. Unknown is the
 * default — absence of error is not health (§12).
 */
export function getOverview(ctx: ConsoleContext): OverviewSnapshot {
  const product = ctx.product;
  return {
    identity: { vlxId: product.vlxId, name: product.name, productionUrl: product.url },
    overall: "unknown",
    domain: product.url
      ? { status: "unknown", freshness: pendingFreshness(), data: null, error: null }
      : pendingState<DomainInfo>(),
    lastDeployment: pendingState<DeploymentInfo>(),
    health: [
      { name: "Application", status: "unknown", freshness: pendingFreshness() },
      { name: "Database", status: "unknown", freshness: pendingFreshness() },
      { name: "Storage", status: "unknown", freshness: pendingFreshness() },
    ],
    backups: [pendingState<BackupInfo>(), pendingState<BackupInfo>()],
    security: [
      { ...pendingState<SecurityClaim>(), data: null },
    ],
    care: pendingState<CarePlanInfo>(),
    incidents: { active: [], source: pendingFreshness() },
  };
}

export function getDeployments(): ModuleState<DeploymentInfo>[] {
  return [];
}

export function getSecurityClaims(): SecurityClaim[] {
  return [
    { key: "https", label: "HTTPS", state: "not_configured", evidence: null, lastEvaluatedAt: null },
    { key: "waf", label: "WAF", state: "not_configured", evidence: null, lastEvaluatedAt: null },
    { key: "ddos", label: "DDoS mitigation", state: "not_configured", evidence: null, lastEvaluatedAt: null },
    { key: "rate_limit", label: "Rate limiting", state: "not_configured", evidence: null, lastEvaluatedAt: null },
  ];
}

export { unknownState, pendingState };
export type { SemanticStatus };
