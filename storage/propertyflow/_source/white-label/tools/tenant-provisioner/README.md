# Tenant Provisioner

One codebase. Many branded sites. Built for agencies running multiple branded catalogues, or a developer hosting client sites from a single repo.

## Workflow

1. **Register tenants** in `tenants.json` (start from `tenants.example.json`).
2. For each tenant, drop a branding file at `tools/tenant-provisioner/branding/<slug>.ts` (copy from `src/branding/tokens.ts` and edit colours/logo/contact).
3. Drop a property data file at `tools/tenant-provisioner/data/<slug>.json` (same shape as `src/data/properties.json`).
4. Run `node tools/tenant-provisioner/provision.mjs` from the project root.

Each tenant builds into `dist/<slug>/`. Deploy that folder to the tenant's domain (Cloudflare Pages custom domain, S3 bucket, anywhere static).

## Commands

```bash
# Build all tenants
node tools/tenant-provisioner/provision.mjs

# Build only one
node tools/tenant-provisioner/provision.mjs --slug acme-realty

# List registered tenants
node tools/tenant-provisioner/provision.mjs --list
```

## Why this design

- **No SaaS sprawl** — every tenant is a static site, deployable anywhere, billed per-site at $0/mo on Cloudflare Pages.
- **Brand isolation** — tenant tokens overwrite `src/branding/tokens.ts` only at build time; tenants never see each other's colours/data.
- **Versioned per tenant** — each tenant can pin a different feature flag set. Disable `admin` for tenants that just want a public site, keep it for tenants you actively manage.

## Multi-tenant Supabase

If multiple tenants share one Supabase project, scope rows by a `tenant_slug` column on `properties` and add it to the RLS policy. The migration toolkit in `tools/migrate/` includes a `--tenant-slug` flag for bulk imports.

See `docs/MULTI_TENANT.md` for the full architecture (single DB vs DB-per-tenant trade-offs).
