#!/usr/bin/env node
/**
 * VOLYNX-OS — Kit ZIP build pipeline
 *
 * Generates 9 self-contained Next.js project ZIPs (3 kits × 3 tiers) ready
 * to drop into Supabase Storage and serve via the Volynx stripe-webhook
 * signed-URL flow.
 *
 *   pnpm node scripts/build-kits.mjs           # build all 9
 *   pnpm node scripts/build-kits.mjs portfolio # build just one kit (3 tiers)
 *   pnpm node scripts/build-kits.mjs portfolio:studio  # one tier
 *
 * Output: out/kits/{kit}-{tier}-v1.0.0.zip
 *
 * What's in each ZIP
 *   /app/page.tsx         — copy of app/demo/{kit}/page.tsx (kit's full demo)
 *   /app/layout.tsx       — minimal root layout (no /api, no auth)
 *   /app/globals.css      — Volynx-OS design tokens
 *   /app/about, /contact, /case-study/[slug]  — Studio tier only
 *   /components/common    — full set (12 files)
 *   /components/sections  — full set (16 files) so buyer can use any
 *   /lib/utils.ts + motion.ts — small helpers
 *   /content/kit-offers.ts — shipped so buyer can extend tiers themselves
 *   /public               — only assets actually referenced by sections
 *   /package.json         — minimal deps (next, react, tailwind, lucide,
 *                          clsx, tailwind-merge), no Stripe/Supabase
 *   /tailwind.config.ts, postcss.config.js, tsconfig.json, next.config.mjs
 *   /README.md            — kit-specific setup
 *   /LICENSE-{tier}.txt   — tier-specific rights
 *
 * Tier differentiation
 *   - Starter: page.tsx + sections + common + LICENSE (personal use only)
 *   - Pro:     adds contact page + commercial license (deliver to clients)
 *   - Studio:  adds about page + contact + 1 case-study + dark/light theme
 *              switcher wired into layout + white-label license
 */

import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import path from "node:path";
import url from "node:url";
import { execSync } from "node:child_process";

const __filename = url.fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const OUT_DIR = path.join(ROOT, "out", "kits");

// ── Catalog ────────────────────────────────────────────────────────────────
// Mirrors content/kit-offers.ts structure. Kept inline so the build script
// has zero dependency on the TypeScript runtime — if you change tier section
// counts in kit-offers.ts, mirror the change here.

const KITS = [
  {
    slug: "portfolio",
    productName: "Portfolio Pro Kit",
    shortName: "Portfolio",
    productUrl: "https://volynx.world/products/portfolio-pro-kit/",
    tiers: ["starter", "pro", "studio"],
  },
  {
    slug: "agency",
    productName: "Agency Launch Kit",
    shortName: "Agency",
    productUrl: "https://volynx.world/products/agency-launch-kit/",
    tiers: ["starter", "pro", "studio"],
  },
  {
    slug: "saas",
    productName: "SaaS Landing System",
    shortName: "SaaS",
    productUrl: "https://volynx.world/products/saas-landing-system/",
    tiers: ["starter", "pro", "studio"],
  },
];

// Tier metadata used to pick which extra pages to include + render licenses.
const TIER_META = {
  starter: {
    label: "Starter",
    rights: "personal",
    extraPages: [],
  },
  pro: {
    label: "Pro",
    rights: "commercial",
    extraPages: ["contact"],
  },
  studio: {
    label: "Studio",
    rights: "studio",
    extraPages: ["about", "contact", "case-study"],
  },
};

const VERSION = "v1.0.0";

// ── Tiny logger ────────────────────────────────────────────────────────────
const log = (msg) => console.log(`  ${msg}`);
const head = (msg) => console.log(`\n→ ${msg}`);
const fail = (msg) => { console.error(`✗ ${msg}`); process.exit(1); };

// ── Recursive copy helper ──────────────────────────────────────────────────
async function copyDir(src, dest, opts = {}) {
  const { exclude = [] } = opts;
  if (!existsSync(src)) return;
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d, opts);
    } else {
      await fs.copyFile(s, d);
    }
  }
}

async function copyFile(src, dest) {
  if (!existsSync(src)) return;
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

async function writeFile(dest, content) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, content, "utf8");
}

// ── package.json — minimal, no Stripe/Supabase/wrangler ────────────────────
function generatePackageJson(kit, tier) {
  return JSON.stringify(
    {
      name: `${kit.slug}-${tier}-kit`,
      version: VERSION.replace(/^v/, ""),
      private: true,
      description: `${kit.productName} — ${TIER_META[tier].label} tier. Generated from Volynx-OS.`,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        clsx: "2.1.1",
        "lucide-react": "0.469.0",
        next: "^14.2.35",
        react: "18.3.1",
        "react-dom": "18.3.1",
        "tailwind-merge": "2.5.2",
      },
      devDependencies: {
        "@types/node": "22.10.2",
        "@types/react": "18.3.12",
        "@types/react-dom": "18.3.1",
        autoprefixer: "10.4.20",
        eslint: "^8.57.1",
        "eslint-config-next": "^14.2.35",
        postcss: "8.4.49",
        tailwindcss: "3.4.16",
        typescript: "5.7.2",
      },
    },
    null,
    2,
  );
}

// ── README.md per kit/tier ────────────────────────────────────────────────
function generateReadme(kit, tier) {
  const meta = TIER_META[tier];
  return `# ${kit.productName} — ${meta.label}

> Premium kit by Volynx. Buy once, use forever.
> Product page: ${kit.productUrl}

## Quick start

\`\`\`bash
npm install      # or pnpm install
npm run dev      # http://localhost:3000
\`\`\`

## What's inside

- **\`app/\`** — Next.js 14 App Router. Edit \`app/page.tsx\` to customise the
  main kit page. Extra pages (when included) live in \`app/about/\`,
  \`app/contact/\`, \`app/case-study/\`.
- **\`components/sections/\`** — every section the kit ships with: Hero,
  Logo Cloud, Metrics Band, Value Grid, Feature Split, Workflow Steps,
  Pricing, FAQ, Final CTA, plus extras. Each component takes typed props
  so you can drop your own copy and data without touching the JSX.
- **\`components/common/\`** — header, footer, banner, theme switcher,
  badge, button, section-heading, plus a few utility blocks.
- **\`content/kit-offers.ts\`** — the tier catalogue Volynx itself uses.
  Strip what you don't need; or extend it for your own products.
- **\`app/globals.css\`** — design tokens (gold / blue / violet palette,
  glass blurs, container queries). Tweak the \`:root\` block to re-skin
  the entire kit.
- **\`tailwind.config.ts\`** — Tailwind 3 + custom design tokens.

## Customising

1. Open \`app/page.tsx\`. The page is just a list of section components
   with props — drop your own copy, swap props, reorder, remove.
2. Branding: edit the colour vars in \`app/globals.css\`. Headers/buttons
   re-tint automatically.
3. Add or remove sections by importing from \`components/sections/\` and
   inserting into the JSX. Every section is self-contained.

## License

See \`LICENSE-${tier}.txt\` for the full terms. Summary:
${meta.rights === "personal"
  ? "- Personal use only. One project, one client (you)."
  : meta.rights === "commercial"
  ? "- Commercial use across unlimited client deliveries.\n- May not be repackaged or resold as a template."
  : "- Studio / white-label use across unlimited deliveries.\n- May strip Volynx attribution.\n- May NOT be resold as a competing template kit without substantial transformation."}

## Need help?

- Documentation: ${kit.productUrl}
- Support: https://volynx.world/support/?product=${kit.slug}-kit
- Contact: hello@volynx.world

---

Built with Volynx-OS · ${VERSION}
`;
}

// ── LICENSE per tier ──────────────────────────────────────────────────────
function generateLicense(kit, tier) {
  const meta = TIER_META[tier];
  const baseTitle = `${kit.productName} — ${meta.label} License`;
  const year = new Date().getFullYear();

  if (meta.rights === "personal") {
    return `${baseTitle}
Copyright (c) ${year} Volynx (volynx.world)

PERSONAL USE LICENSE

You may:
- Use this kit on a single project that represents you personally
  (your portfolio, your personal brand, your own startup).
- Modify the source code, layout, copy, branding, sections.
- Deploy on any hosting provider, any domain.

You may not:
- Use this kit to deliver client work.
- Resell, redistribute, sublicense, or republish the source files,
  components, or sections — neither as a competing kit nor as part of
  any product, template marketplace or design system.
- Remove the Volynx attribution comment in app/layout.tsx without
  upgrading to a Pro or Studio license.

To deliver client projects with this kit, upgrade to the Pro tier.
To resell or strip Volynx attribution, upgrade to the Studio tier.

No warranty is provided. Use at your own risk.

License queries: hello@volynx.world
`;
  }

  if (meta.rights === "commercial") {
    return `${baseTitle}
Copyright (c) ${year} Volynx (volynx.world)

COMMERCIAL USE LICENSE

You may:
- Use this kit across unlimited client deliveries.
- Modify the source, layout, branding, copy, components.
- Charge clients for the work that includes this kit as a foundation.
- Deploy on any hosting, any domain.

You may not:
- Resell or redistribute the kit itself as a template, theme, or
  source-code product on any marketplace.
- Repackage components or sections as part of a competing template
  kit, design system, or component library distributed for sale.

The Volynx attribution comment in app/layout.tsx must remain unless
you've upgraded to the Studio tier (white-label rights).

No warranty is provided. Use at your own risk.

License queries: hello@volynx.world
`;
  }

  // studio
  return `${baseTitle}
Copyright (c) ${year} Volynx (volynx.world)

STUDIO / WHITE-LABEL LICENSE

You may:
- Use this kit across unlimited client and internal deliveries.
- Strip all Volynx attribution and ship as your own white-labelled
  template, brand or product.
- Modify, extend, repackage and adapt every file.
- Charge clients, run agencies, deliver SaaS landing surfaces.

You may not:
- Resell THIS kit, verbatim or with trivial modifications, as a
  competing template kit on a public marketplace (ThemeForest,
  Webflow templates, gumroad, similar). Substantial transformation
  and original creative value addition is required for resale.
- Sublicense the source files to third parties as a stand-alone
  source-code product.

No warranty is provided. Use at your own risk.

License queries: hello@volynx.world
`;
}

// ── Minimal app/layout.tsx ────────────────────────────────────────────────
// Strips the parent Volynx-OS layout (which carries cookies, auth, the
// product banner) down to a clean shell.
function generateLayout(kit, tier) {
  return `import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "${kit.productName} — ${TIER_META[tier].label}",
  description: "Premium kit by Volynx. Buy once, use forever. ${kit.productUrl}",
}

// Volynx attribution — required on Personal + Commercial tiers,
// removable on Studio tier per the Studio License.
${TIER_META[tier].rights === "studio"
  ? "// (Studio tier — Volynx attribution removed per white-label rights)"
  : `// Built with Volynx-OS — ${kit.productUrl}`}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="theme-${kit.slug}">
        {children}
      </body>
    </html>
  )
}
`;
}

// ── Studio extras ─────────────────────────────────────────────────────────
function generateAboutPage(kit) {
  return `import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { SectionHeading } from "@/components/common/section-heading"

export default function AboutPage() {
  return (
    <div className="theme-${kit.slug}">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-20 space-y-8">
        <SectionHeading
          eyebrow="About"
          title="The story behind this work."
          description="Replace this copy with your own story. Who you are, what you've built, why this matters to you, and how clients should think about working with you."
        />
        <p className="text-muted-foreground leading-relaxed">
          This page ships as part of the Studio tier. Use it as a long-form
          context layer next to the main kit landing — origin, philosophy,
          team, credentials, anything that would feel out of rhythm in a
          punchy hero.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
`;
}

function generateContactPage(kit) {
  return `import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { SectionHeading } from "@/components/common/section-heading"

export default function ContactPage() {
  return (
    <div className="theme-${kit.slug}">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-20 space-y-8">
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk about your project."
          description="Replace this with your own intake. The simplest version is a clear email + WhatsApp + 'how to start' — that converts better than long forms."
        />
        <ul className="space-y-3 text-base">
          <li><strong>Email:</strong> you@example.com</li>
          <li><strong>Schedule:</strong> https://cal.com/your-handle</li>
          <li><strong>WhatsApp:</strong> +00 0 0000 0000</li>
        </ul>
      </main>
      <SiteFooter />
    </div>
  )
}
`;
}

function generateCaseStudyPage(kit) {
  return `import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { SectionHeading } from "@/components/common/section-heading"

interface CaseStudyPageProps {
  params: { slug: string }
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  return (
    <div className="theme-${kit.slug}">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-20 space-y-10">
        <SectionHeading
          eyebrow={\`Case study · \${params.slug}\`}
          title="Project name goes here."
          description="One sentence on the result. Skip features, lead with outcome."
        />
        <section className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold mb-2">Context</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The situation when the project started. Constraints, audience, why now.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contribution</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              What you brought. Frame it as decisions, not tasks.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Outcome</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The measurable change. Numbers, before/after, qualitative shift.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

// Replace this stub with a real case-study route that reads from your CMS,
// markdown files, or a content/case-studies/ folder you maintain.
`;
}

// ── volynx.json — Builder import manifest ─────────────────────────────────
function generateVolynxManifest(kit, tier) {
  return JSON.stringify(
    {
      kind: "volynx-kit",
      kit_slug: kit.slug,
      tier: tier,
      product_name: kit.productName,
      product_url: kit.productUrl,
      version: VERSION,
      generated_at: new Date().toISOString(),
      builder_compatible: true,
      builder_preset: kit.slug,
      builder_hint:
        "Drag this file onto the Volynx Builder /builder/ to import the kit as a draft project. The Builder reads kit_slug + tier and rebuilds the section list from public/builder/presets.json.",
      license_file: `LICENSE-${tier}.txt`,
      readme_file: "README.md",
    },
    null,
    2,
  );
}

// ── Per-kit builder ───────────────────────────────────────────────────────
async function buildOne(kit, tier) {
  const stamp = `${kit.slug}-${tier}`;
  head(`Building ${stamp} (${VERSION})`);

  const buildDir = path.join(OUT_DIR, "_build", stamp);
  if (existsSync(buildDir)) await fs.rm(buildDir, { recursive: true, force: true });
  await fs.mkdir(buildDir, { recursive: true });

  // 1. Core component libraries — full set, every section + common UI
  log("copy: components/sections + components/common");
  await copyDir(path.join(ROOT, "components", "sections"), path.join(buildDir, "components", "sections"));
  await copyDir(path.join(ROOT, "components", "common"), path.join(buildDir, "components", "common"));

  // 2. lib helpers used by sections (utils for clsx/twMerge, motion if used)
  log("copy: lib/utils.ts + lib/motion.ts");
  await copyFile(path.join(ROOT, "lib", "utils.ts"), path.join(buildDir, "lib", "utils.ts"));
  await copyFile(path.join(ROOT, "lib", "motion.ts"), path.join(buildDir, "lib", "motion.ts"));

  // 3. Demo page → app/page.tsx, app/globals.css, generated layout
  log("copy: app/demo/{kit}/page.tsx → app/page.tsx");
  await copyFile(
    path.join(ROOT, "app", "demo", kit.slug, "page.tsx"),
    path.join(buildDir, "app", "page.tsx"),
  );
  await copyFile(path.join(ROOT, "app", "globals.css"), path.join(buildDir, "app", "globals.css"));
  await writeFile(path.join(buildDir, "app", "layout.tsx"), generateLayout(kit, tier));

  // 4. Tier extras (about / contact / case-study)
  for (const extra of TIER_META[tier].extraPages) {
    log(`extra: app/${extra === "case-study" ? "case-study/[slug]" : extra}/page.tsx`);
    if (extra === "about") {
      await writeFile(path.join(buildDir, "app", "about", "page.tsx"), generateAboutPage(kit));
    } else if (extra === "contact") {
      await writeFile(path.join(buildDir, "app", "contact", "page.tsx"), generateContactPage(kit));
    } else if (extra === "case-study") {
      await writeFile(
        path.join(buildDir, "app", "case-study", "[slug]", "page.tsx"),
        generateCaseStudyPage(kit),
      );
    }
  }

  // 5. Content + public — pass the catalog so buyers can extend tiers, plus
  //    the small subset of public assets the demo page references.
  log("copy: content/kit-offers.ts (catalog reference)");
  await copyFile(path.join(ROOT, "content", "kit-offers.ts"), path.join(buildDir, "content", "kit-offers.ts"));

  // 6. Config files (tailwind, postcss, tsconfig, next.config)
  log("copy: tailwind.config.ts + postcss.config.js + tsconfig.json + next.config.mjs");
  for (const f of ["tailwind.config.ts", "postcss.config.js", "tsconfig.json", "next.config.mjs"]) {
    await copyFile(path.join(ROOT, f), path.join(buildDir, f));
  }

  // 7. Generated files: package.json, .gitignore, README, LICENSE, manifest
  log("write: package.json + .gitignore");
  await writeFile(path.join(buildDir, "package.json"), generatePackageJson(kit, tier));
  await writeFile(
    path.join(buildDir, ".gitignore"),
    [
      "node_modules",
      ".next",
      "out",
      ".env*",
      "!.env.example",
      ".DS_Store",
      "*.log",
    ].join("\n") + "\n",
  );

  log(`write: README.md + LICENSE-${tier}.txt + volynx.json`);
  await writeFile(path.join(buildDir, "README.md"), generateReadme(kit, tier));
  await writeFile(path.join(buildDir, `LICENSE-${tier}.txt`), generateLicense(kit, tier));
  await writeFile(path.join(buildDir, "volynx.json"), generateVolynxManifest(kit, tier));

  // 8. Zip with macOS native zip (-r recursive, -X strip extended attrs,
  //    -q quiet). cd into the parent of buildDir so the archive root is the
  //    folder name itself (e.g. portfolio-starter-v1.0.0/...).
  const zipName = `${stamp}-${VERSION}.zip`;
  const zipPath = path.join(OUT_DIR, zipName);
  if (existsSync(zipPath)) await fs.rm(zipPath, { force: true });

  const archiveRoot = `${stamp}-${VERSION}`;
  const renamedRoot = path.join(OUT_DIR, "_build", archiveRoot);
  if (existsSync(renamedRoot)) await fs.rm(renamedRoot, { recursive: true, force: true });
  await fs.rename(buildDir, renamedRoot);

  log(`zip: ${zipName}`);
  execSync(`zip -r -X -q "${zipPath}" "${archiveRoot}"`, { cwd: path.join(OUT_DIR, "_build") });

  // 9. Cleanup the build dir to keep the workspace tidy
  await fs.rm(renamedRoot, { recursive: true, force: true });

  const stat = await fs.stat(zipPath);
  log(`✓ ${zipName} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  return { zip: zipPath, size: stat.size };
}

// ── Entry point ───────────────────────────────────────────────────────────
async function main() {
  const filter = process.argv[2] || ""; // e.g. "portfolio" or "portfolio:studio"
  let [filterKit, filterTier] = filter.split(":");

  await fs.mkdir(OUT_DIR, { recursive: true });

  const tasks = [];
  for (const kit of KITS) {
    if (filterKit && filterKit !== kit.slug) continue;
    for (const tier of kit.tiers) {
      if (filterTier && filterTier !== tier) continue;
      tasks.push({ kit, tier });
    }
  }

  if (tasks.length === 0) fail(`No kits matched filter '${filter}'`);

  console.log(`Volynx-OS kit build — ${tasks.length} bundle(s)`);
  console.log(`Output: ${OUT_DIR}`);

  const results = [];
  for (const { kit, tier } of tasks) {
    try {
      const r = await buildOne(kit, tier);
      results.push({ kit: kit.slug, tier, ...r });
    } catch (err) {
      fail(`Build failed for ${kit.slug}:${tier} — ${err.message}`);
    }
  }

  // Final summary so a buyer / Eduardo / CI can see at a glance.
  console.log("\nDone.");
  console.log("┌─────────────┬──────────┬────────────┐");
  console.log("│ kit         │ tier     │ size       │");
  console.log("├─────────────┼──────────┼────────────┤");
  for (const r of results) {
    const kitPad = r.kit.padEnd(11);
    const tierPad = r.tier.padEnd(8);
    const sizePad = `${(r.size / 1024 / 1024).toFixed(2)} MB`.padStart(10);
    console.log(`│ ${kitPad} │ ${tierPad} │ ${sizePad} │`);
  }
  console.log("└─────────────┴──────────┴────────────┘");
  console.log(`\nZIPs ready in: ${path.relative(process.cwd(), OUT_DIR)}/`);
  console.log(`Next step: upload to Supabase Storage 'kits' bucket using the same`);
  console.log(`scheme as PropertyFlow:  {kit_slug}_{tier}/${VERSION}.zip`);
}

main().catch((err) => fail(err.stack || err.message));
