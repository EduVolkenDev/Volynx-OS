import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Box,
  Database,
  HeartHandshake,
  LayoutDashboard,
  LifeBuoy,
  Rocket,
  Server,
  Settings,
  ShieldCheck,
} from "lucide-react";

export interface ConsoleSection {
  slug: string; // "" = overview (index route)
  label: string;
  icon: LucideIcon;
  description: string;
}

/** Primary navigation — V1 scope (§20). Order matters: operational first. */
export const SECTIONS: ConsoleSection[] = [
  { slug: "", label: "Overview", icon: LayoutDashboard, description: "Product status at a glance" },
  { slug: "products", label: "Products", icon: Box, description: "Products and product detail" },
  { slug: "infrastructure", label: "Infrastructure", icon: Server, description: "Connected services and providers" },
  { slug: "deployments", label: "Deployments", icon: Rocket, description: "History, status, source" },
  { slug: "monitoring", label: "Monitoring", icon: Activity, description: "Basic health per component" },
  { slug: "backups", label: "Backups", icon: Database, description: "Capability, status, history" },
  { slug: "security", label: "Security", icon: ShieldCheck, description: "Visible protection state" },
  { slug: "incidents", label: "Incidents", icon: AlertTriangle, description: "Active and past incidents" },
  { slug: "care", label: "Care", icon: HeartHandshake, description: "Current plan and support info" },
  { slug: "support", label: "Support", icon: LifeBuoy, description: "Request support" },
  { slug: "settings", label: "Settings", icon: Settings, description: "Safe administrative configuration" },
];

/** Sections shown in the mobile bottom bar; the rest live under "More". */
export const MOBILE_PRIMARY = ["", "deployments", "monitoring", "incidents", "support"];
