import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { Hero } from "@/components/sections/hero"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { LaunchOffer } from "@/components/sections/launch-offer"
import { MetricsBand } from "@/components/sections/metrics-band"
import { ProductKits } from "@/components/sections/product-kits"
import { ValueGrid } from "@/components/sections/value-grid"
import { FeatureSplit } from "@/components/sections/feature-split"
import { WorkflowSteps } from "@/components/sections/workflow-steps"
import { Testimonials } from "@/components/sections/testimonials"
import { Comparison } from "@/components/sections/comparison"
import { Pricing } from "@/components/sections/pricing"
import { FAQ } from "@/components/sections/faq"
import { FinalCTA } from "@/components/sections/final-cta"
import { storeUrl } from "@/content/site"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero
          variant="product"
          title="VolynxOS turns premium kits into launch-ready product lines."
          subtitle="A commercial operating system for portfolio, agency, SaaS and property products. Built to look premium, explain the offer fast and send buyers to the next step today."
          primaryCta="Get VolynxOS"
          primaryHref={storeUrl}
          secondaryCta="Explore kits"
          secondaryHref="#kits"
        />
        <LogoCloud />
        <LaunchOffer />
        <ProductKits />
        <MetricsBand />
        <ValueGrid />
        <FeatureSplit />
        <WorkflowSteps />
        <Testimonials />
        <Comparison />
        <Pricing variant="tiered" />
        <FAQ />
        <FinalCTA
          eyebrow="Launch today"
          title="Stop polishing in private. Put VolynxOS in front of buyers."
          subtitle="The platform has the product lines, pricing logic, documentation and commercial CTAs it needs to start monetizing now."
          primaryCta="Open product store"
          primaryHref={storeUrl}
          secondaryCta="Read docs"
          secondaryHref="/docs"
        />
      </main>
      <SiteFooter />
    </>
  )
}
