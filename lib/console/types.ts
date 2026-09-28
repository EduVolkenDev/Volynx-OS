/**
 * Console UI types.
 *
 * Critical domain types live in the shared contract — never duplicate them here.
 * Source of truth: /contracts/cloud-console-v1.ts (decision 007).
 * This module only re-exports the contract and adds UI-only compositions.
 */

import type {
  ApiResponse,
  AuditEvent,
  BackupCapability,
  CarePlan,
  CloudConsoleRole,
  CloudStatus,
  ConsoleContext,
  Deployment,
  DomainStatus,
  FailureCode,
  Incident,
  ModuleState,
  Observation,
  OperationError,
  ProductHealth,
  ProductIdentity,
  ResourceHealth,
  SecurityPosture,
  SupportRequest,
} from "@/contracts/cloud-console-v1";
import { CLOUD_CONSOLE_CONTRACT_VERSION } from "@/contracts/cloud-console-v1";
import { CLOUD_CONSOLE_ROLES, CLOUD_STATUS_VALUES } from "@/contracts/cloud-console";
import type { CloudConsoleRole as DraftRole, CloudStatus as DraftStatus } from "@/contracts/cloud-console";

export type {
  ApiResponse,
  AuditEvent,
  BackupCapability,
  CarePlan,
  CloudConsoleRole,
  CloudStatus,
  ConsoleContext,
  Deployment,
  DomainStatus,
  FailureCode,
  Incident,
  ModuleState,
  Observation,
  OperationError,
  ProductHealth,
  ProductIdentity,
  ResourceHealth,
  SecurityPosture,
  SupportRequest,
  DraftRole,
  DraftStatus,
};
export { CLOUD_CONSOLE_CONTRACT_VERSION, CLOUD_CONSOLE_ROLES, CLOUD_STATUS_VALUES };

/** Navigation section. `name` (not `label`) per the contract's label → name decision. */
export type NavSection = {
  slug: string;
  name: string;
  description: string;
};

/**
 * UI routing context (URL slugs). Slugs and vlxId may appear in deep-links,
 * but they never authorize access: when endpoints land, the server resolves
 * the product by database UUID inside the authorized tenant (ConsoleContext).
 */
export type TenantContext = {
  client: string;
  product: string;
  env: string;
};

/** UI-only compositions over contract DTOs (no duplication of contract shapes). */
export type ProductListData = Observation & { products: ProductIdentity[] };
export type DeploymentListData = Observation & { deployments: Deployment[] };
export type ResourceListData = Observation & { resources: ResourceHealth[] };
export type BackupListData = Observation & { capabilities: BackupCapability[] };
export type IncidentListData = Observation & { incidents: Incident[] };
export type CarePlanData = Observation & { plan: CarePlan | null };
export type SupportData = Observation & { requests: SupportRequest[] };
/** SecurityPosture carries per-claim evidence; the wrapper is the module's own observation. */
export type SecurityPostureData = Observation & { posture: SecurityPosture | null };

/** Overview snapshot. vlxId stays null until a real identity source exists — never fabricated. */
export type OverviewSnapshot = {
  identity: {
    name: string;
    vlxId: string | null;
    contextLabel: string;
  };
  health: ModuleState<ProductHealth>;
  modules: Array<{
    key: string;
    name: string;
    href: string;
    blurb: string;
    guidance: { title: string; body: string; action?: { label: string; href: string } };
    module: ModuleState<Observation>;
  }>;
  attention: string[];
};
