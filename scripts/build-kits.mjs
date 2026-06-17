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
 *   /lib/utils.ts + motion.ts + volynx-public.ts + site-locale.ts — small helpers
 *   /content/*.ts        — shipped so every copied component has its content
 *                          dependencies and buyers can edit core copy
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

const KIT_CONTENT = {
  portfolio: {
    themeClass: "theme-portfolio",
    bannerLabel: "Portfolio Demo",
    heroVariant: "minimal",
    heroTitle: "Launch fast, feel premium and give your personal brand an operating system.",
    heroSubtitle:
      "A portfolio kit for builders who need more than a gallery: positioning, proof, career context and a premium first impression.",
    primaryCta: "Explore sections",
    primaryHref: "#sections",
    secondaryCta: "Open kit",
    metrics: [
      { value: "Personal", label: "Brand system" },
      { value: "Case", label: "Study blocks" },
      { value: "CV", label: "Career bridge" },
      { value: "Global", label: "Client-ready" },
    ],
    logos: ["VOLYNX", "STUDIOS VALCARCE", "STUDIO PRO", "DEV JOURNEY", "VOLYNX LAB"],
    valueGridBadge: "Skills",
    valueGridTitle: "Present the professional story, not only the project list.",
    valueGridCopy:
      "The kit turns experience, outcomes and availability into a clear path for clients, recruiters and collaborators.",
    cards: [
      {
        title: "Personal brand structure",
        description: "Introduce what you do, why it matters and how people should evaluate your work.",
      },
      {
        title: "Case study rhythm",
        description: "Frame projects around context, contribution and outcome instead of a loose gallery.",
      },
      {
        title: "Career operating system",
        description: "Connect portfolio, CV, services and contact into one coherent professional surface.",
      },
      {
        title: "Premium first impression",
        description: "Large type, controlled contrast and lean sections help the work feel more credible.",
      },
    ],
    pricingVariant: "single",
    faqBadge: "Working together",
    faqTitle: "Common questions from clients and collaborators.",
    faqCopy: "Transparent answers so we can move faster.",
    faqs: [
      {
        question: "What type of projects do you take on?",
        answer:
          "Web applications, SaaS products, landing pages, and digital products. I work best on projects that need both strong engineering and visual polish.",
      },
      {
        question: "Do you work with teams or solo?",
        answer:
          "Both. I can integrate into an existing team or deliver end-to-end as a solo developer, depending on the project scope.",
      },
      {
        question: "What is your typical timeline?",
        answer:
          "Landing pages and marketing sites: 1-2 weeks. Web applications and SaaS: 4-8 weeks depending on scope. I scope honestly and ship on time.",
      },
    ],
    finalEyebrow: "Available for hire",
    finalTitle: "Turn scattered work into a premium professional surface.",
    finalSubtitle:
      "Use the kit to connect your projects, CV, services and next step without rebuilding your personal site from scratch.",
    finalPrimaryCta: "Explore sections",
    finalPrimaryHref: "#sections",
    finalSecondaryCta: "Download CV",
    finalSecondaryHref: "#",
    showWorkflowSteps: true,
  },
  agency: {
    themeClass: "theme-agency",
    bannerLabel: "Agency Demo",
    heroVariant: "centered",
    heroTitle: "Close agency work with a site, proposal and scope system that agree.",
    heroSubtitle:
      "A premium agency launch kit for studios that need more than a pretty homepage: positioning, SOW logic and client-ready structure in one place.",
    primaryCta: "View packages",
    primaryHref: "#pricing",
    secondaryCta: "Open kit",
    metrics: [
      { value: "SOW", label: "Scope system" },
      { value: "Proposal", label: "Included flow" },
      { value: "24h", label: "Lead response" },
      { value: "Premium", label: "Positioning" },
    ],
    logos: ["STARTUP LAB", "BRAND STUDIO", "GROWTH OPS", "PRODUCT TEAM", "FOUNDER LED"],
    valueGridBadge: "Services",
    valueGridTitle: "Everything supports the sales conversation.",
    valueGridCopy:
      "The website, proposal and onboarding flow point toward the same promise, so the agency feels sharper before the first call.",
    cards: [
      {
        title: "Proposal path",
        description: "Present the offer, timeline and value in a way that makes the next step feel obvious.",
      },
      {
        title: "SOW discipline",
        description: "Scope, deliverables and revision rules are part of the system instead of a late scramble.",
      },
      {
        title: "Premium web presence",
        description: "Services, proof, process and pricing all work together to make the agency feel established.",
      },
      {
        title: "Client onboarding",
        description: "Reduce friction after the sale with clearer handoff, intake and expectation-setting blocks.",
      },
    ],
    pricingVariant: "tiered",
    faqBadge: "About the kit",
    faqTitle: "What you need to know about the Agency Launch Kit.",
    faqCopy: "Real answers about what is included, licensing and how it works.",
    faqs: [
      {
        question: "What does the Agency Launch Kit include?",
        answer:
          "A ready-to-deploy agency website, proposal template, SOW template, onboarding checklist, and revision rules. Everything you need to look professional from day one.",
      },
      {
        question: "Can I use this for my own agency or client work?",
        answer:
          "Yes. Commercial and Studio licenses allow client delivery. You get the full source code and can customize everything.",
      },
      {
        question: "How is this different from a generic template?",
        answer:
          "It is a business system, not a layout. It includes operational documents (SOW, proposal, onboarding) alongside the website - built for agencies that want to close deals faster.",
      },
    ],
    finalEyebrow: "New project?",
    finalTitle: "Package your agency like the work is already premium.",
    finalSubtitle:
      "Use the kit to align the offer, scope and website before leads start asking hard questions.",
    finalPrimaryCta: "View packages",
    finalPrimaryHref: "#pricing",
    finalSecondaryCta: "Get the Agency Kit",
    showWorkflowSteps: true,
  },
  saas: {
    themeClass: "theme-saas",
    bannerLabel: "SaaS Demo",
    heroVariant: "product",
    heroTitle: "Turn product value into conviction with a SaaS page that moves fast.",
    heroSubtitle:
      "A section-first landing system for founders and teams that need premium positioning, clean proof and a page they can ship without rebuilding from zero.",
    primaryCta: "View pricing",
    primaryHref: "#pricing",
    secondaryCta: "Open kit",
    metrics: [
      { value: "12", label: "Core sections" },
      { value: "3", label: "Pricing blocks" },
      { value: "< 1 day", label: "Launch window" },
      { value: "SEO", label: "Ready structure" },
    ],
    logos: ["PRODUCT LED", "AI TOOLS", "DEV SAAS", "B2B PLATFORM", "STARTUP LAB"],
    valueGridBadge: "Platform",
    valueGridTitle: "The page structure follows the sales argument.",
    valueGridCopy:
      "Each block has a job: establish trust, make the product concrete and give the buyer a confident next step.",
    cards: [
      {
        title: "Section-first story",
        description: "Move from problem, proof and product value into pricing without rebuilding the page logic.",
      },
      {
        title: "Speed-aware layout",
        description: "Lean blocks, controlled effects and clear hierarchy keep the product feeling expensive.",
      },
      {
        title: "Conversion-ready pricing",
        description: "Launch, Growth and Scale tiers give the buyer a clean path from curiosity to commitment.",
      },
      {
        title: "Launch documentation",
        description: "Copy prompts, section map and deployment notes help the kit become a repeatable workflow.",
      },
    ],
    pricingVariant: "tiered",
    faqBadge: "About the kit",
    faqTitle: "What you need to know about the SaaS Landing System.",
    faqCopy: "Real answers about what is included, how it works and what you can build.",
    faqs: [
      {
        question: "What does the SaaS Landing System include?",
        answer:
          "A conversion-focused landing page kit with clean sections, SEO structure, copy framework and performance checklist. Ready to deploy on Cloudflare Pages, Vercel or any static host.",
      },
      {
        question: "Can I customize the sections and copy?",
        answer:
          "Everything is editable. Sections are modular, copy is structured with placeholder guidance, and the design tokens let you match any brand identity.",
      },
      {
        question: "Is this a template or a system?",
        answer:
          "A system. You get reusable sections, structured variants, design tokens and launch-ready pages - not a one-off layout you need to reverse-engineer.",
      },
    ],
    finalEyebrow: "Ready to ship?",
    finalTitle: "Launch the SaaS page before the momentum cools.",
    finalSubtitle:
      "Use the system as the foundation, swap the content layer and ship the page with enough structure to sell.",
    finalPrimaryCta: "View pricing",
    finalPrimaryHref: "#pricing",
    finalSecondaryCta: "Get the SaaS Kit",
    showWorkflowSteps: false,
  },
};

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
        lint: "eslint .",
      },
      dependencies: {
        clsx: "2.1.1",
        "lucide-react": "0.469.0",
        next: "^16.3.0-canary.39",
        react: "18.3.1",
        "react-dom": "18.3.1",
        "tailwind-merge": "2.5.2",
      },
      devDependencies: {
        "@types/node": "22.10.2",
        "@types/react": "18.3.12",
        "@types/react-dom": "18.3.1",
        autoprefixer: "10.4.20",
        eslint: "^9.39.4",
        "eslint-config-next": "^16.3.0-canary.39",
        postcss: "^8.5.15",
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
  const tierHelp =
    meta.rights === "personal"
      ? "This tier is best for one personal or internal project."
      : meta.rights === "commercial"
      ? "This tier is ready for commercial client delivery."
      : "This tier is ready for studio and white-label delivery.";

  return `# ${kit.productName} — ${meta.label}

> Premium kit by Volynx. Buy once, use forever.
> Product page: ${kit.productUrl}

## Start here

If you do not want to use the terminal yet, open \`START-HERE.html\` in your browser first.
That guide gives you the no-terminal path: publish through GitHub + Vercel/Cloudflare,
edit simple text in the browser, and only use the terminal if you want local development.

This kit is a finished Next.js website package. You can:

1. Preview it on your computer.
2. Change the text, links, images and colours.
3. Publish it online with Vercel, Cloudflare Pages or another Next.js host.

${tierHelp}

If you are not technical, follow the steps in order. Do not start by editing random files.

## What you need

- A computer with internet access.
- Node.js 22 or newer.
- VS Code, Cursor or another code editor.
- A hosting account when you are ready to publish.

Node.js download: https://nodejs.org/
VS Code download: https://code.visualstudio.com/

## 1. Open the kit folder

Unzip this file first. You should see files like \`package.json\`, \`app\`, \`components\`, \`content\` and \`public\`.

Open the unzipped folder in VS Code or Cursor.

## 2. Install the kit

\`\`\`bash
npm install
\`\`\`

If this is your first time using the terminal:

1. Open the folder in VS Code.
2. Click **Terminal** in the top menu.
3. Click **New Terminal**.
4. Paste the command above and press Enter.

The first install can take a few minutes.

## 3. Preview locally

\`\`\`bash
npm run dev
\`\`\`

Then open:

\`\`\`text
http://localhost:3000
\`\`\`

If the page opens, the kit is installed correctly.

## 4. Make the common edits

Start with these files:

- \`content.config.json\` — headline, CTAs, logos, metrics, cards, FAQs and final CTA.
- \`brand.config.json\` — brand name, theme class, product URL and support links.
- \`public/\` — images and public assets.
- \`app/page.tsx\` — advanced section order and page structure.

Recommended first edits:

1. Replace the headline and paragraph copy.
2. Update buttons and links.
3. Replace sample images or logos.
4. Update prices, FAQs and contact details.
5. Run \`npm run dev\` again and refresh the browser.

## 5. Check before publishing

Run:

\`\`\`bash
npm run lint
npm run build
\`\`\`

Both commands should finish without errors. If build passes, the kit is ready to publish.

## 6. Publish online

The simplest path is Vercel:

1. Create a free GitHub account if you do not have one.
2. Create a new GitHub repository.
3. Upload this unzipped kit folder to that repository.
4. Go to https://vercel.com/ and import the repository.
5. Click Deploy.

Cloudflare Pages also works. Use the same repository and set the framework to Next.js.

## If you are not a developer

You can still use this kit, but treat it like a professional website package:

- Use the preview steps above to see the site.
- Change simple text and links carefully.
- For deeper design, layout or publish work, send this ZIP to a freelancer or to Volynx support.
- Do not delete folders unless you know what they do.

The safest non-technical workflow is: preview first, list the changes you want, edit one thing at a time, then run \`npm run build\`.

## Troubleshooting

### \`node\` or \`npm\` is not recognized

Install Node.js from https://nodejs.org/ and reopen the terminal.

### \`npm install\` takes a long time

Wait a few minutes. If it is still stuck after 10 minutes, close the terminal, reopen it and run \`npm install\` again.

### Port 3000 is already in use

The terminal may offer another port like \`3001\`. Open that URL instead.

### The browser page is blank

Stop the dev server with \`Ctrl+C\`, run \`npm install\` again, then run \`npm run dev\`.

### Build fails after your edits

Undo the last change and run \`npm run build\` again. Most errors come from missing quotes, deleted imports or broken JSX.

## What's inside

- **\`app/\`** — Next.js 16 App Router pages and layouts.
- **\`content.config.json\`** — first file to edit for page copy and section content.
- **\`brand.config.json\`** — first file to edit for brand/product metadata.
- **\`volynx.config.json\`** — quick map of beginner and advanced workflows.
- **\`components/sections/\`** — ready-made page sections.
- **\`components/common/\`** — shared header, footer, buttons, badges and utilities.
- **\`content/\`** — editable copy and structured content.
- **\`public/\`** — images and static assets.
- **\`app/globals.css\`** — visual tokens and global styling.
- **\`tailwind.config.ts\`** — Tailwind configuration.

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

function generateStartHereHtml(kit, tier) {
  const meta = TIER_META[tier];
  const supportUrl = `https://volynx.world/support/?product=${kit.slug}-kit`;
  const licenseLabel =
    meta.rights === "personal"
      ? "Personal/internal use"
      : meta.rights === "commercial"
      ? "Commercial client delivery"
      : "Studio and white-label delivery";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${kit.productName} - ${meta.label} Start Here</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #09090b;
        --panel: #111114;
        --panel-2: #18181b;
        --text: #fafafa;
        --muted: #a1a1aa;
        --line: rgba(255, 255, 255, 0.1);
        --gold: #f4c96b;
        --green: #7dd3a8;
        --blue: #8fb7ff;
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.55;
      }
      main {
        width: min(1080px, calc(100% - 32px));
        margin: 0 auto;
        padding: 48px 0 64px;
      }
      .eyebrow {
        color: var(--gold);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      h1 {
        margin: 14px 0 12px;
        max-width: 860px;
        font-size: clamp(38px, 6vw, 76px);
        line-height: 0.96;
        letter-spacing: -0.04em;
      }
      .lead {
        max-width: 760px;
        color: var(--muted);
        font-size: 18px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        margin-top: 28px;
      }
      .card, .step, .note {
        border: 1px solid var(--line);
        background: var(--panel);
        border-radius: 8px;
        padding: 20px;
      }
      .card strong, .step strong { display: block; margin-bottom: 8px; }
      .card p, .step p, .note p { margin: 0; color: var(--muted); }
      .section {
        margin-top: 42px;
      }
      h2 {
        margin: 0 0 14px;
        font-size: 28px;
        letter-spacing: -0.02em;
      }
      .steps {
        display: grid;
        gap: 12px;
        counter-reset: steps;
      }
      .step {
        display: grid;
        grid-template-columns: 44px 1fr;
        gap: 16px;
      }
      .step::before {
        counter-increment: steps;
        content: counter(steps);
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        border-radius: 999px;
        background: var(--panel-2);
        color: var(--gold);
        font-weight: 800;
      }
      code {
        border: 1px solid var(--line);
        background: var(--panel-2);
        border-radius: 6px;
        padding: 2px 6px;
        color: var(--green);
      }
      a { color: var(--blue); }
      ul { margin: 10px 0 0; padding-left: 20px; color: var(--muted); }
      li + li { margin-top: 6px; }
      .note {
        border-color: rgba(244, 201, 107, 0.28);
        background: rgba(244, 201, 107, 0.08);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 22px;
      }
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        border: 1px solid var(--line);
        border-radius: 7px;
        padding: 10px 14px;
        color: var(--text);
        text-decoration: none;
        background: var(--panel-2);
      }
      .button.primary {
        border-color: rgba(244, 201, 107, 0.6);
        color: #111;
        background: var(--gold);
        font-weight: 800;
      }
      @media (max-width: 820px) {
        main { padding-top: 32px; }
        .grid { grid-template-columns: 1fr; }
        .step { grid-template-columns: 1fr; }
        .step::before { margin-bottom: 2px; }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="eyebrow">Volynx kit - no-terminal start</div>
      <h1>${kit.productName}<br />${meta.label}</h1>
      <p class="lead">
        This file is for buyers who want the simplest path. You can publish the kit first,
        see it online, and make simple edits in the browser before touching the terminal.
      </p>
      <div class="actions">
        <a class="button primary" href="${supportUrl}">Get Volynx support</a>
        <a class="button" href="${kit.productUrl}">Product page</a>
      </div>

      <section class="grid" aria-label="Kit summary">
        <div class="card">
          <strong>License</strong>
          <p>${licenseLabel}</p>
        </div>
        <div class="card">
          <strong>Best first goal</strong>
          <p>Publish the untouched kit online, then edit one thing at a time.</p>
        </div>
        <div class="card">
          <strong>Safest edit files</strong>
            <p><code>content.config.json</code>, <code>brand.config.json</code>, then <code>public/</code>.</p>
        </div>
      </section>

      <section class="section">
        <h2>Path A: publish without terminal</h2>
        <div class="steps">
          <div class="step">
            <div>
              <strong>Unzip this kit</strong>
              <p>Keep the folder name simple. Example: <code>${kit.slug}-${tier}</code>.</p>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>Create a GitHub repository in the browser</strong>
              <p>Go to <a href="https://github.com/new">github.com/new</a>, create a private repository, then use GitHub's upload button to upload the unzipped kit files.</p>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>Import the repository into Vercel</strong>
              <p>Go to <a href="https://vercel.com/new">vercel.com/new</a>, choose the repository, keep the detected Next.js settings, and click Deploy.</p>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>Open the live preview URL</strong>
              <p>Vercel gives you a temporary URL. Use it to inspect the kit before customising.</p>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>Edit simple text in GitHub</strong>
              <p>Open files inside <code>content/</code>, click the pencil icon, edit carefully, and commit. Vercel redeploys automatically.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Path B: local preview with terminal</h2>
        <div class="steps">
          <div class="step">
            <div>
              <strong>Install Node.js</strong>
              <p>Download it from <a href="https://nodejs.org/">nodejs.org</a>. Reopen your editor after installing.</p>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>Open the folder in VS Code or Cursor</strong>
              <p>Use the editor menu: File -> Open Folder.</p>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>Run the two commands</strong>
              <p>Open Terminal -> New Terminal, then run <code>npm install</code> and <code>npm run dev</code>.</p>
            </div>
          </div>
          <div class="step">
            <div>
              <strong>Preview the kit</strong>
              <p>Open <code>http://localhost:3000</code> in your browser.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>What to edit first</h2>
        <div class="note">
          <p>
            Start with text, links and images. Leave layout and component changes for later.
            This keeps the kit stable while you learn how it works.
          </p>
          <ul>
            <li><code>content.config.json</code> - headline, CTAs, metrics, cards, FAQs and final CTA.</li>
            <li><code>brand.config.json</code> - brand name, theme class and product links.</li>
            <li><code>public/</code> - images and public assets.</li>
            <li><code>app/page.tsx</code> - advanced section order and page structure.</li>
          </ul>
        </div>
      </section>

      <section class="section">
        <h2>When to ask for help</h2>
        <div class="grid">
          <div class="card">
            <strong>Ask Volynx</strong>
            <p>Use support if installation, deploy or checkout delivery is blocking you.</p>
          </div>
          <div class="card">
            <strong>Ask a freelancer</strong>
            <p>Good for brand changes, copy replacement, images and page ordering.</p>
          </div>
          <div class="card">
            <strong>Ask a developer</strong>
            <p>Needed for custom forms, databases, authentication or deeper product logic.</p>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`;
}

function getKitContent(kit) {
  return KIT_CONTENT[kit.slug];
}

function generateBrandConfig(kit, tier) {
  const defaults = getKitContent(kit);

  return JSON.stringify(
    {
      brandName: kit.productName,
      kitSlug: kit.slug,
      tier,
      themeClass: defaults.themeClass,
      productUrl: kit.productUrl,
      supportUrl: `https://volynx.world/support/?product=${kit.slug}-kit`,
      contactEmail: "hello@volynx.world",
    },
    null,
    2,
  );
}

function generateContentConfig(kit) {
  const defaults = getKitContent(kit);

  return JSON.stringify(
    {
      banner: {
        label: defaults.bannerLabel,
        productName: kit.productName,
        href: kit.productUrl,
      },
      hero: {
        variant: defaults.heroVariant,
        title: defaults.heroTitle,
        subtitle: defaults.heroSubtitle,
        primaryCta: defaults.primaryCta,
        primaryHref: defaults.primaryHref,
        secondaryCta: defaults.secondaryCta,
        secondaryHref: kit.productUrl,
      },
      logos: defaults.logos,
      metrics: defaults.metrics,
      valueGrid: {
        badge: defaults.valueGridBadge,
        title: defaults.valueGridTitle,
        copy: defaults.valueGridCopy,
        cards: defaults.cards,
      },
      sections: {
        packageMap: true,
        featureSplit: true,
        workflowSteps: defaults.showWorkflowSteps,
        pricing: true,
      },
      pricing: {
        variant: defaults.pricingVariant,
      },
      faq: {
        badge: defaults.faqBadge,
        title: defaults.faqTitle,
        copy: defaults.faqCopy,
        items: defaults.faqs,
      },
      finalCta: {
        eyebrow: defaults.finalEyebrow,
        title: defaults.finalTitle,
        subtitle: defaults.finalSubtitle,
        primaryCta: defaults.finalPrimaryCta,
        primaryHref: defaults.finalPrimaryHref,
        secondaryCta: defaults.finalSecondaryCta,
        secondaryHref: defaults.finalSecondaryHref ?? kit.productUrl,
      },
    },
    null,
    2,
  );
}

function generateVolynxConfig(kit, tier) {
  return JSON.stringify(
    {
      product: kit.productName,
      kitSlug: kit.slug,
      tier,
      version: VERSION,
      editOrder: [
        "START-HERE.html",
        "content.config.json",
        "brand.config.json",
        "public/",
        "app/page.tsx",
      ],
      noTerminalPath: {
        upload: "Upload the unzipped folder to a private GitHub repository in the browser.",
        publish: "Import that repository into Vercel or Cloudflare Pages.",
        edit: "Edit content.config.json and brand.config.json in GitHub, then commit.",
      },
      advancedPath: {
        install: "npm install",
        preview: "npm run dev",
        check: ["npm run lint", "npm run build"],
      },
    },
    null,
    2,
  );
}

function generateConfiguredHomePage() {
  return `import brand from "@/brand.config.json"
import content from "@/content.config.json"
import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { ProductBanner } from "@/components/common/product-banner"
import { Hero } from "@/components/sections/hero"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { MetricsBand } from "@/components/sections/metrics-band"
import { ValueGrid } from "@/components/sections/value-grid"
import { FeatureSplit } from "@/components/sections/feature-split"
import { WorkflowSteps } from "@/components/sections/workflow-steps"
import { KitPackageMap } from "@/components/sections/kit-package-map"
import { Pricing } from "@/components/sections/pricing"
import { FAQ } from "@/components/sections/faq"
import { FinalCTA } from "@/components/sections/final-cta"

type HeroVariant = "centered" | "split" | "minimal" | "product"
type PricingVariant = "single" | "tiered" | "comparison"
type KitSlug = "portfolio" | "agency" | "saas"

export default function HomePage() {
  return (
    <div className={brand.themeClass}>
      <ProductBanner
        label={content.banner.label}
        productName={content.banner.productName}
        href={content.banner.href}
      />
      <SiteHeader />
      <main>
        <Hero
          variant={content.hero.variant as HeroVariant}
          title={content.hero.title}
          subtitle={content.hero.subtitle}
          primaryCta={content.hero.primaryCta}
          primaryHref={content.hero.primaryHref}
          secondaryCta={content.hero.secondaryCta}
          secondaryHref={content.hero.secondaryHref}
        />
        <LogoCloud logos={content.logos} />
        <MetricsBand items={content.metrics} />
        {content.sections.packageMap ? <KitPackageMap kit={brand.kitSlug as KitSlug} /> : null}
        <ValueGrid
          badge={content.valueGrid.badge}
          title={content.valueGrid.title}
          copy={content.valueGrid.copy}
          cards={content.valueGrid.cards}
        />
        {content.sections.featureSplit ? <FeatureSplit /> : null}
        {content.sections.workflowSteps ? <WorkflowSteps /> : null}
        {content.sections.pricing ? (
          <Pricing
            kit={brand.kitSlug as KitSlug}
            variant={content.pricing.variant as PricingVariant}
          />
        ) : null}
        <FAQ
          badge={content.faq.badge}
          title={content.faq.title}
          copy={content.faq.copy}
          items={content.faq.items}
        />
        <FinalCTA
          eyebrow={content.finalCta.eyebrow}
          title={content.finalCta.title}
          subtitle={content.finalCta.subtitle}
          primaryCta={content.finalCta.primaryCta}
          primaryHref={content.finalCta.primaryHref}
          secondaryCta={content.finalCta.secondaryCta}
          secondaryHref={content.finalCta.secondaryHref}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
`;
}

function generateEslintConfig() {
  return `import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: [
      ".next/**",
      "dist/**",
      "out/**",
      "node_modules/**",
    ],
  },
  {
    settings: {
      react: {
        version: "18.3.1",
      },
    },
    rules: {
      "react/display-name": "off",
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-location-assign-relative-destination": "off",
    },
  },
];

export default eslintConfig;
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
          badge="About"
          title="The story behind this work."
          copy="Replace this copy with your own story. Who you are, what you've built, why this matters to you, and how clients should think about working with you."
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
          badge="Contact"
          title="Let's talk about your project."
          copy="Replace this with your own intake. The simplest version is a clear email + WhatsApp + 'how to start' — that converts better than long forms."
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
          badge={\`Case study · \${params.slug}\`}
          title="Project name goes here."
          copy="One sentence on the result. Skip features, lead with outcome."
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
  log("copy: lib/utils.ts + lib/motion.ts + lib/volynx-public.ts + lib/site-locale.ts");
  await copyFile(path.join(ROOT, "lib", "utils.ts"), path.join(buildDir, "lib", "utils.ts"));
  await copyFile(path.join(ROOT, "lib", "motion.ts"), path.join(buildDir, "lib", "motion.ts"));
  await copyFile(path.join(ROOT, "lib", "volynx-public.ts"), path.join(buildDir, "lib", "volynx-public.ts"));
  await copyFile(path.join(ROOT, "lib", "site-locale.ts"), path.join(buildDir, "lib", "site-locale.ts"));

  // 3. Config-driven home page, app/globals.css, generated layout
  log("write: config-driven app/page.tsx");
  await writeFile(path.join(buildDir, "app", "page.tsx"), generateConfiguredHomePage());
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

  // 5. Content + public — pass the root content modules used by the
  //    shipped sections so the ZIP is self-contained, without bundling the
  //    long internal documentation folder.
  log("copy: content/*.ts");
  await copyDir(path.join(ROOT, "content"), path.join(buildDir, "content"), {
    exclude: ["propertyflow-docs"],
  });

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

  log(`write: START-HERE.html + README.md + configs + LICENSE-${tier}.txt + volynx.json`);
  await writeFile(path.join(buildDir, "START-HERE.html"), generateStartHereHtml(kit, tier));
  await writeFile(path.join(buildDir, "README.md"), generateReadme(kit, tier));
  await writeFile(path.join(buildDir, "brand.config.json"), generateBrandConfig(kit, tier));
  await writeFile(path.join(buildDir, "content.config.json"), generateContentConfig(kit));
  await writeFile(path.join(buildDir, "volynx.config.json"), generateVolynxConfig(kit, tier));
  await writeFile(path.join(buildDir, "eslint.config.mjs"), generateEslintConfig());
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
