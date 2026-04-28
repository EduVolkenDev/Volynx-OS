# PropertyFlow Starter

Premium real-estate catalogue. **Three production-ready layouts**, live filtering, bilingual EN / PT, static JSON data — runs locally with one command, deploys anywhere static (Cloudflare Pages, Netlify, Vercel, GitHub Pages, S3+CloudFront).

## What you get

- **3 layouts**: Classic Grid · Magazine · Compact List — each at `/classic/`, `/magazine/`, `/compact/` (and `/pt/...` mirrors).
- **Live filter bar**: free-text search + 5 category chips (luxury, premium, rental, commercial, all). Pure-vanilla JS, no framework.
- **Bilingual**: every label, status badge and CTA flips between EN and PT via `src/data/i18n.ts`.
- **Responsive**: every layout collapses cleanly down to 360 px.
- **10 demo properties** in `src/data/properties.json` — replace with your real inventory and the site updates automatically.
- **Zero backend**: static data ships with the site. Upgrade to **Professional** for a Supabase backend + admin CRUD, or to **White-Label** for multi-tenant + branding kit.

## Quick start

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # static output → ./dist
npm run preview        # preview the build locally
```

Node 20+ recommended.

## Customise it

| What you want to change | Where |
|---|---|
| Site name + tagline | `src/data/i18n.ts` (`site.name`, `site.tagline`) |
| Add / edit a property | `src/data/properties.json` — add an entry, image goes to `public/images/<id>.jpg` |
| New filter category | Add the slug to `src/components/FilterBar.astro` chips array + tag your property's `category` field |
| Brand colours | `src/styles/global.css` — `--accent`, `--accent-2`, `--gold` |
| Font | `src/layouts/BaseLayout.astro` — replace the system stack in body { font-family: ... } |
| Translations | `src/data/i18n.ts` — add a new key in both `en` and `pt` blocks |

See `docs/SETUP.md` for full deployment recipes and `docs/CUSTOMIZATION.md` for the deeper customisation guide.

## File structure

```
propertyflow-starter/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   └── images/        ← drop your property photos here (named property-<id>.jpg)
└── src/
    ├── components/
    │   ├── FilterBar.astro
    │   └── PropertyCard.astro
    ├── data/
    │   ├── i18n.ts          ← labels EN/PT
    │   └── properties.json  ← your inventory
    ├── layouts/
    │   └── BaseLayout.astro
    ├── pages/
    │   ├── index.astro      ← /  (Classic Grid, default landing)
    │   ├── classic.astro
    │   ├── magazine.astro
    │   ├── compact.astro
    │   └── pt/              ← Portuguese mirrors
    └── styles/
        └── global.css
```

## License

Commercial use license — see `LICENSE.md`. One commercial deployment per purchase.

## Need more?

- Want a Supabase backend + admin dashboard so non-technical staff edit listings? → upgrade to **PropertyFlow Professional**.
- Want multi-tenant (one codebase, many agencies, branded per-tenant)? → upgrade to **PropertyFlow White-Label**.

Both upgrades preserve the layouts, filters and data shape from Starter — you keep your work.
