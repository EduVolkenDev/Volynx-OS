# PropertyFlow Professional

Premium real-estate catalogue **with a real backend**. **Six layouts**, an admin CRUD page, Supabase-powered storage, enquiry capture, bilingual EN / PT, deploy-anywhere static.

## What you get over Starter

| | Starter | **Professional** |
|---|---|---|
| Layouts | 3 | **6** (+ Gallery Hero, Split View, Masonry) |
| Filters + bilingual | ✓ | ✓ |
| Data source | static JSON | **Supabase** |
| Admin page (CRUD) | — | **`/admin/`** |
| Enquiry capture | — | **`enquiries` table + form** |
| Image hosting | manual files | files OR Supabase Storage |
| Schema | — | **schema.sql + seed.sql** |

## Quick start

```bash
npm install
cp .env.example .env       # paste your Supabase URL + anon key
npm run dev                # http://localhost:4321
```

Without `.env` the public catalogue runs from the static JSON in `src/data/properties.json` (so you can browse the layouts immediately) but `/admin/` will warn until configured.

## Setup the backend (one-time)

1. Create a Supabase project.
2. Open SQL Editor → paste `supabase/schema.sql` → Run.
3. Optional: paste `supabase/seed.sql` → Run (loads 10 demo properties).
4. Project Settings → API → copy URL + anon key into `.env`.
5. Restart `npm run dev`.

Full guide: `docs/SUPABASE.md` and `docs/ADMIN.md`.

## Layouts

- `/classic/` — Classic Grid (inventory at scale)
- `/magazine/` — Editorial hierarchy
- `/compact/` — Filter-driven list
- `/gallery/` — Cinematic hero + supporting shots
- `/split/` — Split-view list / detail
- `/masonry/` — Discovery-first masonry

All layouts mirror at `/pt/...` for Portuguese.

## License

Commercial use license — see `LICENSE.md`. One commercial deployment per purchase.

## Need more?

Want **multi-tenant** (one codebase, many agencies, branded per-tenant), branding kit and migration tooling? → upgrade to **PropertyFlow White-Label**.
