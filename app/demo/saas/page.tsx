import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { ProductBanner } from "@/components/common/product-banner"
import { Hero } from "@/components/sections/hero"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { MetricsBand } from "@/components/sections/metrics-band"
import { ValueGrid } from "@/components/sections/value-grid"
import { FeatureSplit } from "@/components/sections/feature-split"
import { Pricing } from "@/components/sections/pricing"
import { FAQ } from "@/components/sections/faq"
import { FinalCTA } from "@/components/sections/final-cta"

const saasMetrics = [
  { value: "99.9%", label: "Uptime" },
  { value: "2.4k+", label: "Teams" },
  { value: "< 200ms", label: "Response time" },
  { value: "SOC 2", label: "Compliance" },
]

const saasLogos = ["TECH CORP", "SCALE AI", "CLOUD OPS", "DATA FLOW", "INFRA LABS"]

const saasCards = [
  {
    title: "Unified workspace",
    description: "Replace scattered tools with a single platform. Projects, communication and analytics in one place.",
  },
  {
    title: "Real-time collaboration",
    description: "Work together without version conflicts. Live cursors, instant sync and smart conflict resolution.",
  },
  {
    title: "Enterprise-grade security",
    description: "SOC 2 compliant, end-to-end encryption, role-based access and audit logs built in from day one.",
  },
  {
    title: "Developer-first API",
    description: "REST and GraphQL APIs, webhooks, SDKs in 6 languages. Build on top of the platform, not around it.",
  },
]

const saasFaqs = [
  {
    question: "What does the SaaS Landing System include?",
    answer: "A conversion-focused landing page kit with clean sections, SEO structure, copy framework and performance checklist. Ready to deploy on Cloudflare Pages, Vercel or any static host.",
  },
  {
    question: "Can I customize the sections and copy?",
    answer: "Everything is editable. Sections are modular, copy is structured with placeholder guidance, and the design tokens let you match any brand identity.",
  },
  {
    question: "Is this a template or a system?",
    answer: "A system. You get reusable sections, structured variants, design tokens and launch-ready pages — not a one-off layout you need to reverse-engineer.",
  },
]

export default function SaaSDemoPage() {
  return (
    <div className="theme-saas">
      <ProductBanner
        label="SaaS Demo"
        productName="SaaS Landing System"
        href="https://volynx.world/products/saas-landing-system/"
      />
      <SiteHeader />
      <main>
        <Hero
          variant="split"
          title="Stop duct-taping your stack. One platform for your entire workflow."
          subtitle="Replace scattered tools and legacy software with a single system built for modern teams. Set up in minutes, not months."
          primaryCta="Start free trial"
          secondaryCta="Watch demo"
        />
        <LogoCloud logos={saasLogos} />
        <MetricsBand items={saasMetrics} />
        <ValueGrid
          badge="Platform"
          title="Everything your team needs, nothing it doesn't."
          copy="Built for modern teams that want speed, clarity and control without tool sprawl."
          cards={saasCards}
        />
        <FeatureSplit />
        <Pricing variant="tiered" />
        <FAQ
          badge="About the kit"
          title="What you need to know about the SaaS Landing System."
          copy="Real answers about what is included, how it works and what you can build."
          items={saasFaqs}
        />
        <FinalCTA
          eyebrow="Ready to ship?"
          title="Join 2,400+ teams already on the platform."
          subtitle="Start your free trial today. No credit card required."
          primaryCta="Start free trial"
          primaryHref="#pricing"
          secondaryCta="Get the SaaS Kit"
          secondaryHref="https://volynx.world/products/saas-landing-system/"
        />
      </main>
      <SiteFooter />
    </div>
  )
}
