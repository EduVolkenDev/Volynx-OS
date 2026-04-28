#!/usr/bin/env node
/**
 * PropertyFlow White-Label — CSV Migration Toolkit
 *
 * Bulk-imports properties from a CSV file into either:
 *   1. The local src/data/properties.json (static deploys), or
 *   2. A Supabase project (Pro/White-Label deployments).
 *
 * Usage:
 *   node tools/migrate/import-csv.mjs --file inventory.csv --target json
 *   node tools/migrate/import-csv.mjs --file inventory.csv --target supabase --env .env
 *   node tools/migrate/import-csv.mjs --file inventory.csv --target supabase --tenant-slug acme
 *
 * Expected CSV columns (header row required):
 *   title_en,title_pt,city_en,city_pt,country_en,category,type_en,beds,baths,
 *   area_m2,price_eur,currency,status,image,summary_en,summary_pt,tags_en,tags_pt
 *
 * tags_en / tags_pt are pipe-separated: "riverside|penthouse|parking"
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..", "..");

const args = process.argv.slice(2);
function arg(name, def) {
  const i = args.indexOf("--" + name);
  return i >= 0 ? args[i + 1] : def;
}

const file = arg("file");
const target = arg("target", "json");
const envFile = arg("env", ".env");
const tenantSlug = arg("tenant-slug", null);

if (!file) {
  console.error("Usage: --file <path.csv> --target <json|supabase> [--tenant-slug <slug>]");
  process.exit(1);
}

function parseCSV(text) {
  // Minimal CSV parser — handles quoted values + escaped quotes.
  const rows = [];
  let row = [], cell = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], nx = text[i + 1];
    if (inQ) {
      if (ch === '"' && nx === '"') { cell += '"'; i++; }
      else if (ch === '"') { inQ = false; }
      else { cell += ch; }
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
      else if (ch === "\r") { /* skip */ }
      else { cell += ch; }
    }
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function shapeRow(headers, values) {
  const obj = {};
  headers.forEach((h, i) => { obj[h] = values[i] ?? ""; });
  ["beds", "baths", "area_m2", "price_eur"].forEach(k => { obj[k] = Number(obj[k]) || 0; });
  ["tags_en", "tags_pt"].forEach(k => {
    obj[k] = (obj[k] || "").split("|").map(s => s.trim()).filter(Boolean);
  });
  if (!obj.id) obj.id = (obj.city_en + "-" + obj.title_en).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (tenantSlug) obj.tenant_slug = tenantSlug;
  return obj;
}

(async () => {
  const text = await readFile(resolve(file), "utf8");
  const rows = parseCSV(text).filter(r => r.length > 1);
  if (rows.length < 2) { console.error("Empty or malformed CSV"); process.exit(1); }
  const headers = rows[0].map(h => h.trim());
  const records = rows.slice(1).map(v => shapeRow(headers, v));
  console.log(`Parsed ${records.length} records from ${file}`);

  if (target === "json") {
    const out = resolve(projectRoot, "src/data/properties.json");
    await writeFile(out, JSON.stringify(records, null, 2));
    console.log(`✓ wrote ${out}`);
    return;
  }

  if (target === "supabase") {
    if (!existsSync(envFile)) { console.error(`env file not found: ${envFile}`); process.exit(1); }
    const env = Object.fromEntries((await readFile(envFile, "utf8")).split("\n")
      .filter(l => l && !l.startsWith("#") && l.includes("="))
      .map(l => { const [k, ...rest] = l.split("="); return [k.trim(), rest.join("=").trim().replace(/^"|"$/g, "")]; }));
    const url = env.PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY || env.PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) { console.error("Missing SUPABASE_URL or key in env"); process.exit(1); }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.39.3");
    const client = createClient(url, key);
    let ok = 0, fail = 0;
    for (const rec of records) {
      const { id, ...row } = rec; // strip generated id; let Postgres assign uuid
      const { error } = await client.from("properties").insert(row);
      if (error) { fail++; console.error(`✗ ${rec.title_en}: ${error.message}`); }
      else ok++;
    }
    console.log(`\n✓ inserted ${ok} / ${records.length}${fail ? ` (${fail} failed)` : ""}`);
    return;
  }

  console.error("Unknown --target. Use json or supabase.");
  process.exit(1);
})();
