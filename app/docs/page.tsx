import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { HeroShowcase } from "@/components/sections/hero-showcase"

const sections = [
  "Hero / 4 variants",
  "Logo cloud",
  "Metrics band",
  "Value grid",
  "Feature split",
  "Workflow steps",
  "Pricing / 3 variants",
  "FAQ",
  "Final CTA",
  "Header + footer"
]

export default function DocsPage() {
  return (
    <>
      <SiteHeader />
      <main className="section-space">
        <div className="container-shell">
          <span className="eyebrow">Documentation</span>
          <h1 className="section-title">System V2 usage and architecture.</h1>
          <p className="section-copy mt-5">
            This kit is organized for product-level reuse: composable sections, coherent tokens and demo pages for SaaS, agency and portfolio positioning.
          </p>

          <div className="mt-12 grid gap-5 lg:grid-cols-[0.55fr_1fr]">
            <aside className="surface h-fit p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Included</p>
              <div className="mt-5 grid gap-3">
                {sections.map((section) => (
                  <div key={section} className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-zinc-300">{section}</div>
                ))}
              </div>
            </aside>

            <div className="surface overflow-hidden p-4 md:p-6">
              <HeroShowcase />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
