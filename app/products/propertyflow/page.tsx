import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, Building2, CheckCircle2, Download, Layers3, LockKeyhole, Workflow } from "lucide-react"
import { SiteFooter } from "@/components/common/site-footer"
import { SiteHeader } from "@/components/common/site-header"
import { PropertyFlowPricing } from "@/components/propertyflow/propertyflow-pricing"
import {
  propertyFlowHeroMetrics,
  propertyFlowTemplates,
  propertyFlowTiers,
  propertyFlowVersion
} from "@/content/propertyflow"

export const metadata: Metadata = {
  title: "PropertyFlow - Real estate SaaS kit",
  description:
    "PropertyFlow is a bilingual real-estate catalogue kit with tiered source delivery, Supabase, admin, multi-tenant mode and white-label licensing."
}

const launchChecks = [
  "Stripe Checkout Session per tier and currency",
  "Post-purchase delivery verifies paid session",
  "ZIPs are stored outside public assets",
  "Docs mapped by Starter, Professional and White-Label"
]

const flow = [
  {
    icon: Building2,
    title: "Sell the product",
    copy: "The product page explains the three tiers, currency options, template unlocks and commercial license."
  },
  {
    icon: LockKeyhole,
    title: "Guard the purchase",
    copy: "Checkout sends the buyer to Stripe and returns with a session ID that the server verifies before delivery."
  },
  {
    icon: Download,
    title: "Deliver the tier",
    copy: "The delivery API checks payment status, tier, amount and currency, then streams only the purchased ZIP."
  },
  {
    icon: Workflow,
    title: "Operate the docs",
    copy: "Buyer docs are split by tier, with White-Label receiving the full automation, migration and integration layer."
  }
]

export default function PropertyFlowProductPage() {
  const featuredTier = propertyFlowTiers[1]

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-white/5 py-16 md:py-24">
          <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-hero-glow opacity-80" />
          <div className="container-shell grid gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
            <div>
              <span className="eyebrow">PropertyFlow v{propertyFlowVersion}</span>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white md:text-7xl">
                PropertyFlow turns real-estate listings into a sellable SaaS kit.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                Bilingual property catalogue, polished filters, tiered delivery, Supabase admin, White-Label rights
                and agency-scale docs in one product line.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#pricing" className="button-primary" aria-label="See PropertyFlow pricing">
                  See pricing <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a href={featuredTier.deliveryHref} className="button-secondary" aria-label="Preview delivery area">
                  Preview delivery <Download className="ml-2 h-4 w-4" />
                </a>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {propertyFlowHeroMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-white/10 bg-black/30 px-4 py-3">
                    <div className="text-3xl font-semibold tracking-[-0.05em] text-white">{metric.value}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid gap-4 sm:grid-cols-[0.86fr_1.14fr] sm:items-end">
                <div className="grid gap-4">
                  <Image
                    src="/propertyflow/propertyflow1.webp"
                    alt="PropertyFlow catalogue preview"
                    width={1024}
                    height={1024}
                    priority
                    className="aspect-square rounded-lg border border-white/10 object-cover"
                  />
                  <Image
                    src="/propertyflow/propertyflow2.webp"
                    alt="PropertyFlow key feature visual"
                    width={1024}
                    height={1024}
                    className="aspect-square rounded-lg border border-white/10 object-cover"
                  />
                </div>
                <Image
                  src="/propertyflow/newpropertyflow.webp"
                  alt="PropertyFlow premium product card"
                  width={1400}
                  height={1400}
                  priority
                  className="aspect-square rounded-lg border border-white/10 object-cover shadow-glow"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="container-shell grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <span className="eyebrow">Who this is for</span>
              <h2 className="section-title">Built for property businesses that need software, not a brochure.</h2>
              <p className="section-copy mt-5">
                PropertyFlow fits solo agents, brokerages and agencies that want a reusable real-estate product
                with a clear upgrade path from static catalogue to multi-tenant white-label resale.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {flow.map((item) => {
                const Icon = item.icon

                return (
                  <article key={item.title} className="surface p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-400">{item.copy}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section-space border-y border-white/5">
          <div className="container-shell">
            <div className="mb-10 grid gap-5 lg:grid-cols-[0.75fr_1fr] lg:items-end">
              <div>
                <span className="eyebrow">Grid templates</span>
                <h2 className="section-title">Fifteen layouts make the upgrade ladder visible.</h2>
              </div>
              <p className="section-copy">
                Starter receives the first 3 layouts, Professional unlocks 3 more, and White-Label gets the full
                15-template catalogue for resale and client variation.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {propertyFlowTemplates.map((template) => (
                <div key={template.name} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-white">{template.name}</p>
                  <span className="mt-3 inline-flex rounded-md border border-white/10 px-2 py-1 text-[11px] text-zinc-400">
                    {template.tier}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PropertyFlowPricing />

        <section className="section-space">
          <div className="container-shell grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <span className="eyebrow">Launch guards</span>
              <h2 className="section-title">Checkout and delivery are wired for autonomous selling.</h2>
              <p className="section-copy mt-5">
                This repo now uses server routes where money matters: Stripe creates checkout, delivery verifies the
                paid session, and the purchased ZIP streams from private storage.
              </p>
              <div className="mt-8 grid gap-3">
                {launchChecks.map((check) => (
                  <div key={check} className="flex gap-3 rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface overflow-hidden">
              <Image
                src="/propertyflow/propertyflowofi.webp"
                alt="PropertyFlow white-label product visual"
                width={1024}
                height={1024}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Post-purchase</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Delivery route, docs and ZIP manifest are already in the repo.
                </h3>
                <a href="/dashboard/purchases/propertyflow?tier=white-label&preview=1" className="button-secondary mt-6">
                  Open White-Label delivery <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section-space border-t border-white/5">
          <div className="container-shell">
            <div className="surface p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <span className="eyebrow">Ready to sell</span>
                  <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                    Put PropertyFlow in front of buyers with tiered delivery behind it.
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
                    Use the pricing cards for public demand. Stripe Checkout now returns buyers directly into verified
                    delivery for the pack they bought.
                  </p>
                </div>
                <a href="#pricing" className="button-primary">
                  Choose a tier <Layers3 className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
