import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { Hero } from "@/components/sections/hero"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { MetricsBand } from "@/components/sections/metrics-band"
import { ValueGrid } from "@/components/sections/value-grid"
import { WorkflowSteps } from "@/components/sections/workflow-steps"
import { Pricing } from "@/components/sections/pricing"
import { FAQ } from "@/components/sections/faq"
import { FinalCTA } from "@/components/sections/final-cta"

export default function AgencyDemoPage() {
  return (
    <div className="theme-agency">
      <SiteHeader />
      <main>
        <Hero
          variant="centered"
          title="We build digital products that actually convert."
          subtitle="Strategy, design and engineering under one roof. No handoff chaos, no communication gaps, no wasted budget."
          primaryCta="Start a project"
          secondaryCta="See our work"
        />
        <MetricsBand />
        <LogoCloud />
        <ValueGrid />
        <WorkflowSteps />
        <Pricing variant="tiered" />
        <FAQ />
        <FinalCTA
          eyebrow="New project?"
          title="Let's build something that converts."
          subtitle="Tell us about your project and get a free consultation within 24 hours."
          primaryCta="Start a project"
          primaryHref="#contact"
          secondaryCta="See case studies"
          secondaryHref="#"
        />
      </main>
      <SiteFooter />
    </div>
  )
}
