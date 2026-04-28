# Admin · PropertyFlow Professional

The admin page at **`/admin/`** is a protected CRUD interface for non-technical staff. They can list, search, add, edit and delete properties without touching code or SQL.

## Setup

1. Spin up a Supabase project (Dashboard → New project — free tier is fine).
2. Open **SQL Editor** and paste the contents of `supabase/schema.sql`. Run.
3. (Optional) Open SQL Editor again, paste `supabase/seed.sql`. Run — this loads the 10 demo properties.
4. Copy `.env.example` to `.env` and fill in:
   ```
   PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
   PUBLIC_SUPABASE_ANON_KEY="..."
   ```
5. `npm run dev` and open `http://localhost:4321/admin/`.

The admin client uses **Supabase Auth** — anyone authenticated can write. To restrict to specific staff, replace the `properties_auth_write` policy with one that checks `auth.uid()` against an allow-list:

```sql
DROP POLICY IF EXISTS "properties_auth_write" ON public.properties;
CREATE POLICY "properties_staff_write"
  ON public.properties FOR ALL
  TO authenticated
  USING (auth.uid() IN ('uuid-of-staff-1','uuid-of-staff-2'))
  WITH CHECK (auth.uid() IN ('uuid-of-staff-1','uuid-of-staff-2'));
```

## Public read

Anonymous visitors can read properties where `is_active = true`. Set a property to `is_active = false` to draft it without deleting.

## Bilingual fields

Every text field has an `_en` and `_pt` variant. Save the EN first; the PT copy is optional and falls back to EN at render time.

## Image hosting

The demo SVGs in `public/images/` are placeholders. For production:
- Upload your photos to Supabase Storage (free 1 GB), or
- Use a CDN (Cloudinary, Bunny, etc.), or
- Drop JPG/WebP files into `public/images/property-<id>.jpg` and reference them in the `image` column.

The catalogue templates use `background-image: url(...)`, so any reachable URL works.

## Read more

- `docs/SUPABASE.md` — full Supabase setup guide
- `docs/CUSTOMIZATION.md` — colours, fonts, layouts
- `docs/SETUP.md` — local dev + deployment
