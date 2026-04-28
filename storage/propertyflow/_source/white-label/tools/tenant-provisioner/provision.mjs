#!/usr/bin/env node
/**
 * PropertyFlow White-Label — Tenant Provisioner
 *
 * Reads a tenants.json registry, builds one Astro site per tenant from this
 * base codebase, with each tenant getting its own branding, properties data
 * and output folder. Designed for the case where one developer hosts many
 * branded agency sites from a single codebase.
 *
 * Usage:
 *   node tools/tenant-provisioner/provision.mjs              # build all tenants
 *   node tools/tenant-provisioner/provision.mjs --slug acme  # build only acme
 *   node tools/tenant-provisioner/provision.mjs --list       # list tenants
 *
 * Each tenant gets:
 *   - dist/<slug>/        ← deploy this folder to <slug>.your-host.com (or
 *                            their own domain via Cloudflare custom domain)
 *
 * Tenants registry format (tools/tenant-provisioner/tenants.json):
 *   [
 *     {
 *       "slug": "acme-realty",
 *       "branding": "./branding/acme-realty.ts",   // overrides src/branding/tokens.ts
 *       "data":     "./data/acme-realty.json",     // overrides src/data/properties.json
 *       "domain":   "listings.acmerealty.com"
 *     }
 *   ]
 */

import { readFile, writeFile, copyFile, mkdir, rm, cp } from "node:fs/promises";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..", "..");

const args = process.argv.slice(2);
const wantList = args.includes("--list");
const slugIdx = args.indexOf("--slug");
const wantSlug = slugIdx >= 0 ? args[slugIdx + 1] : null;

async function readJSON(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function loadRegistry() {
  const path = resolve(__dirname, "tenants.json");
  if (!existsSync(path)) {
    console.log("No tenants.json yet. Create one with:");
    console.log("  cp tools/tenant-provisioner/tenants.example.json tools/tenant-provisioner/tenants.json");
    return [];
  }
  const reg = await readJSON(path);
  if (!Array.isArray(reg)) throw new Error("tenants.json must be an array");
  return reg;
}

async function buildTenant(tenant) {
  const slug = tenant.slug;
  console.log(`\n▸ Building tenant: ${slug}`);

  // 1. Stage branding override (writes the tenant's tokens into src/branding/tokens.ts)
  if (tenant.branding) {
    const src = resolve(__dirname, tenant.branding);
    if (!existsSync(src)) throw new Error(`branding file missing: ${src}`);
    await copyFile(src, resolve(projectRoot, "src/branding/tokens.ts"));
    console.log(`  branding ← ${tenant.branding}`);
  }

  // 2. Stage properties data override
  if (tenant.data) {
    const src = resolve(__dirname, tenant.data);
    if (!existsSync(src)) throw new Error(`data file missing: ${src}`);
    await copyFile(src, resolve(projectRoot, "src/data/properties.json"));
    console.log(`  data ← ${tenant.data}`);
  }

  // 3. Build
  const outDir = resolve(projectRoot, "dist", slug);
  await rm(outDir, { recursive: true, force: true });
  execSync(`npm run build`, { cwd: projectRoot, stdio: "inherit" });

  // 4. Move dist/ → dist/<slug>/
  const tmp = resolve(projectRoot, "dist", "__current");
  await cp(resolve(projectRoot, "dist"), tmp, { recursive: true, filter: (s) => !s.includes("/__current") && !s.endsWith("/dist/" + slug) });
  await mkdir(outDir, { recursive: true });
  await cp(tmp, outDir, { recursive: true });
  await rm(tmp, { recursive: true, force: true });

  console.log(`  ✓ output: dist/${slug}/`);
  if (tenant.domain) console.log(`  → deploy to: ${tenant.domain}`);
}

(async () => {
  const reg = await loadRegistry();

  if (wantList) {
    console.log("Registered tenants:");
    reg.forEach((t) => console.log(`  - ${t.slug}${t.domain ? "  →  " + t.domain : ""}`));
    return;
  }

  const targets = wantSlug ? reg.filter((t) => t.slug === wantSlug) : reg;
  if (targets.length === 0) {
    console.log(wantSlug ? `No tenant matched --slug ${wantSlug}` : "No tenants registered.");
    process.exit(1);
  }

  for (const tenant of targets) {
    try {
      await buildTenant(tenant);
    } catch (e) {
      console.error(`✗ ${tenant.slug} failed:`, e.message);
      process.exit(1);
    }
  }
  console.log("\n✓ all tenants built");
})();
