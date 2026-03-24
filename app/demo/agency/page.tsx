import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { ProductBanner } from "@/components/common/product-banner"
import { Hero } from "@/components/sections/hero"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { MetricsBand } from "@/components/sections/metrics-band"
import { ValueGrid } from "@/components/sections/value-grid"
import { WorkflowSteps } from "@/components/sections/workflow-steps"
import { Pricing } from "@/components/sections/pricing"
import { FAQ } from "@/components/sections/faq"
import { FinalCTA } from "@/components/sections/final-cta"

const agencyMetrics = [
  { value: "120+", label: "Projects delivered" },
  { value: "4.9", label: "Client rating" },
  { value: "35", label: "Active clients" },
  { value: "< 48h", label: "Response time" },
]

const agencyLogos = ["STARTUP LAB", "FINTECH CO", "SCALE WORKS", "BRAND STUDIO", "GROWTH OPS"]

const agencyCards = [
  {
    title: "Strategy & positioning",
    description: "We define your market angle before writing a single line of code. Clarity drives conversion.",
  },
  {
    title: "Design & brand systems",
    description: "Visual identity, UI systems and brand guidelines that scale across every touchpoint.",
  },
  {
    title: "Development & engineering",
    description: "Full-stack delivery with clean architecture, performance and production-grade infrastructure.",
  },
  {
    title: "Launch & growth support",
    description: "We don't disappear after delivery. Ongoing support, analytics and iteration as you scale.",
  },
]

const agencyFaqs = [
  {
    question: "What does the Agency Launch Kit include?",
    answer: "A ready-to-deploy agency website, proposal template, SOW template, onboarding checklist, and revision rules. Everything you need to look professional from day one.",
  },
  {
    question: "Can I use this for my own agency or client work?",
    answer: "Yes. Commercial and Studio licenses allow client delivery. You get the full source code and can customize everything.",
  },
  {
    question: "How is this different from a generic template?",
    answer: "It is a business system, not a layout. It includes operational documents (SOW, proposal, onboarding) alongside the website — built for agencies that want to close deals faster.",
  },
]

export default function AgencyDemoPage() {
  return (
    <div className="theme-agency">
      <ProductBanner
        label="Agency Demo"
        productName="Agency Launch Kit"
        href="https://volynx.world/products/agency-launch-kit/"
      />
      <SiteHeader />
      <main>
        <Hero
          variant="centered"
          title="We build digital products that actually convert."
          subtitle="Strategy, design and engineering under one roof. No handoff chaos, no communication gaps, no wasted budget."
          primaryCta="Start a project"
          secondaryCta="See our work"
        />
        <MetricsBand items={agencyMetrics} />
        <LogoCloud logos={agencyLogos} />
        <ValueGrid
          badge="Services"
          title="Full-service delivery, not isolated tasks."
          copy="From strategy to launch, everything under one team. No broken handoffs, no misaligned expectations."
          cards={agencyCards}
        />
        <WorkflowSteps />
        <Pricing variant="tiered" />
        <FAQ
          badge="About the kit"
          title="What you need to know about the Agency Launch Kit."
          copy="Real answers about what is included, licensing and how it works."
          items={agencyFaqs}
        />
        <FinalCTA
          eyebrow="New project?"
          title="Let's build something that converts."
          subtitle="Tell us about your project and get a free consultation within 24 hours."
          primaryCta="Start a project"
          primaryHref="#contact"
          secondaryCta="Get the Agency Kit"
          secondaryHref="https://volynx.world/products/agency-launch-kit/"
        />
      </main>
      <SiteFooter />
    </div>
  )
}
