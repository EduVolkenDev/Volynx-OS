# Migration Toolkit

Bulk-import properties from a CSV. Useful for:
- First migration from an old listings system.
- Periodic sync from an MLS export.
- Bootstrapping a new tenant in a multi-tenant deployment.

## Quick start

```bash
# CSV → static JSON (no backend)
node tools/migrate/import-csv.mjs --file inventory.csv --target json

# CSV → Supabase (single-tenant)
node tools/migrate/import-csv.mjs --file inventory.csv --target supabase --env .env

# CSV → Supabase (multi-tenant — adds tenant_slug column)
node tools/migrate/import-csv.mjs --file inventory.csv --target supabase --tenant-slug acme-realty
```

## CSV shape

Header row required. Columns:

```
title_en,title_pt,city_en,city_pt,country_en,category,type_en,
beds,baths,area_m2,price_eur,currency,status,image,
summary_en,summary_pt,tags_en,tags_pt
```

- `category`: `luxury` | `premium` | `rental` | `commercial`
- `status`: `for-sale` | `for-rent` | `sold` | `rented` | `draft`
- `tags_en` / `tags_pt`: pipe-separated, e.g. `riverside|penthouse|parking`

`id` is auto-generated from `city_en + title_en` if missing.

## Multi-tenant

When using `--tenant-slug`, the importer adds a `tenant_slug` field to every row. Make sure your `properties` table has a `tenant_slug text` column and an RLS policy that filters reads by it. The example policy:

```sql
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS tenant_slug text;
CREATE INDEX IF NOT EXISTS idx_properties_tenant ON public.properties (tenant_slug);

CREATE POLICY "properties_tenant_read" ON public.properties FOR SELECT
  USING (is_active = true AND tenant_slug = current_setting('app.tenant_slug', true));
```

The session sets `app.tenant_slug` from a JWT claim or per-request header.
