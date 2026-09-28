/**
 * PROVISIONAL UI TYPES — Muse domain (product experience).
 *
 * These types describe what the console UI needs to render. They are NOT the
 * canonical data contracts: those will live in /contracts and are defined by
 * Codex (system architecture). When /contracts exists, this file should be
 * refactored to import from it instead of duplicating critical types (§11).
 *
 * Rule: the UI never invents operational data. Any value without a source and
 * a checked-at timestamp renders as Unknown / Not configured (§3, §12).
 */

export type SemanticStatus =
  | "operational"
  | "degraded"
  | "incident"
  | "maintenance"
  | "unknown"
  | "not_configured";

/** Provenance for every operational datum (§17). Null = no source connected. */
export interface DataFreshness {
  lastCheckedAt: string | null; // ISO-8601 timestamp
  source: string | null; // e.g. "cloudflare-api", "supabase", "uptime-check"
}

export interface OperationError {
  reason: string;
  at: string; // ISO-8601 timestamp
  referenceId: string;
}

/** A renderable module: status + provenance + optional payload or error. */
export interface ModuleState<T> {
  status: SemanticStatus;
  freshness: DataFreshness;
  data: T | null;
  error?: OperationError | null;
}

export interface ProductIdentity {
  vlxId: string; // immutable, e.g. VLX-JP-001
  name: string;
  productionUrl: string | null;
}

export interface DomainInfo {
  domain: string;
  dnsOk: boolean | null;
  ssl: { status: SemanticStatus; issuer: string | null; expiresAt: string | null };
  cdn: string | null;
}

export interface DeploymentInfo {
  id: string;
  status: SemanticStatus;
  commitSha: string | null;
  branch: string | null;
  author: string | null;
  createdAt: string | null;
  durationMs: number | null;
  triggeredBy: string | null;
}

export interface HealthComponent {
  name: string; // e.g. "Application", "Database", "Storage"
  status: SemanticStatus;
  freshness: DataFreshness;
}

export interface BackupInfo {
  resource: string;
  provider: string | null;
  enabled: boolean | null;
  lastSuccessfulAt: string | null;
  retentionDays: number | null;
  restoreCapability: boolean | null;
  verificationStatus: SemanticStatus;
}

export interface SecurityClaim {
  key: string; // https | waf | ddos | rate_limit
  label: string;
  state: SemanticStatus;
  evidence: string | null; // why this state exists (§29)
  lastEvaluatedAt: string | null;
}

export interface CarePlanInfo {
  name: string | null;
  tier: string | null;
  includes: string[];
  supportChannel: string | null;
  slaHours: number | null;
}

export interface IncidentSummary {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "detected" | "investigating" | "mitigating" | "resolved" | "postmortem";
  startedAt: string;
}
