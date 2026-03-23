import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { Hero } from "@/components/sections/hero"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { MetricsBand } from "@/components/sections/metrics-band"
import { ValueGrid } from "@/components/sections/value-grid"
import { FeatureSplit } from "@/components/sections/feature-split"
import { Pricing } from "@/components/sections/pricing"
import { FAQ } from "@/components/sections/faq"
import { FinalCTA } from "@/components/sections/final-cta"

export default function SaaSDemoPage() {
  return (
    <div className="theme-saas">
      <SiteHeader />
      <main>
        <Hero
          variant="split"
          title="Stop duct-taping your stack. One platform for your entire workflow."
          subtitle="Replace scattered tools and legacy software with a single system built for modern teams. Set up in minutes, not months."
          primaryCta="Start free trial"
          secondaryCta="Watch demo"
        />
        <LogoCloud />
        <MetricsBand />
        <ValueGrid />
        <FeatureSplit />
        <Pricing variant="tiered" />
        <FAQ />
        <FinalCTA
          eyebrow="Ready to ship?"
          title="Join 2,400+ teams already on the platform."
          subtitle="Start your free trial today. No credit card required."
          primaryCta="Start free trial"
          primaryHref="#pricing"
          secondaryCta="Book a demo"
          secondaryHref="#"
        />
      </main>
      <SiteFooter />
    </div>
  )
}
