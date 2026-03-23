import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { Hero } from "@/components/sections/hero"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { MetricsBand } from "@/components/sections/metrics-band"
import { ValueGrid } from "@/components/sections/value-grid"
import { FeatureSplit } from "@/components/sections/feature-split"
import { WorkflowSteps } from "@/components/sections/workflow-steps"
import { Pricing } from "@/components/sections/pricing"
import { FAQ } from "@/components/sections/faq"
import { FinalCTA } from "@/components/sections/final-cta"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero
          variant="product"
          title="Build premium positioning with a landing system, not scattered templates."
          subtitle="A Next.js-first kit engineered for developers, agencies and SaaS teams that want clean conversion, visual restraint and faster shipping."
          primaryCta="Explore pricing"
          secondaryCta="Open demo"
        />
        <LogoCloud />
        <MetricsBand />
        <ValueGrid />
        <FeatureSplit />
        <WorkflowSteps />
        <Pricing variant="tiered" />
        <FAQ />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  )
}
