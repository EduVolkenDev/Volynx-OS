#!/usr/bin/env node
/**
 * PropertyFlow ZIP build pipeline.
 *
 * Builds the sellable source archives from storage/propertyflow/_source so the
 * buyer ZIPs cannot drift behind the maintained package manifests.
 */

import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const SOURCE_DIR = path.join(ROOT, "storage", "propertyflow", "_source");
const STORAGE_DIR = path.join(ROOT, "storage", "propertyflow");
const DOWNLOADS_DIR = path.join(ROOT, "out", "downloads", "propertyflow");

const TIERS = ["starter", "professional", "white-label"];
const VERSION = "1.1.0";

function log(message) {
  console.log(`  ${message}`);
}

function head(message) {
  console.log(`\n-> ${message}`);
}

async function readPackageJson(tier) {
  const packagePath = path.join(SOURCE_DIR, tier, "package.json");
  const raw = await fs.readFile(packagePath, "utf8");
  const pkg = JSON.parse(raw);

  if (pkg.version !== VERSION) {
    throw new Error(`${tier} package.json version is ${pkg.version}; expected ${VERSION}`);
  }

  if (pkg.dependencies?.astro !== "^6.4.4") {
    throw new Error(`${tier} package.json must use Astro ^6.4.4`);
  }

  return pkg;
}

async function getZipEntries(tier) {
  const tierDir = path.join(SOURCE_DIR, tier);
  const entries = await fs.readdir(tierDir);
  return entries.filter((entry) => !["node_modules", "dist", ".astro"].includes(entry)).sort();
}

async function buildTier(tier) {
  const tierDir = path.join(SOURCE_DIR, tier);
  if (!existsSync(tierDir)) {
    throw new Error(`Missing source directory for ${tier}`);
  }

  const pkg = await readPackageJson(tier);
  const filename = `propertyflow-${tier}-v${VERSION}.zip`;
  const storageZip = path.join(STORAGE_DIR, filename);
  const downloadsZip = path.join(DOWNLOADS_DIR, filename);

  await fs.mkdir(STORAGE_DIR, { recursive: true });
  await fs.mkdir(DOWNLOADS_DIR, { recursive: true });
  await fs.rm(storageZip, { force: true });
  await fs.rm(downloadsZip, { force: true });

  const entries = await getZipEntries(tier);
  execFileSync("zip", ["-r", "-X", "-q", storageZip, ...entries], { cwd: tierDir });
  await fs.copyFile(storageZip, downloadsZip);

  const stat = await fs.stat(storageZip);
  log(`${filename} (${(stat.size / 1024 / 1024).toFixed(2)} MB) - ${pkg.name}`);
}

async function main() {
  const requested = process.argv.slice(2);
  const tiers = requested.length ? requested : TIERS;

  for (const tier of tiers) {
    if (!TIERS.includes(tier)) {
      throw new Error(`Unknown PropertyFlow tier: ${tier}`);
    }
  }

  head(`Building PropertyFlow ${VERSION} archives`);
  for (const tier of tiers) {
    await buildTier(tier);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
