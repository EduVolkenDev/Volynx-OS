import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { Hero } from "@/components/sections/hero"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { MetricsBand } from "@/components/sections/metrics-band"
import { ValueGrid } from "@/components/sections/value-grid"
import { FeatureSplit } from "@/components/sections/feature-split"
import { FAQ } from "@/components/sections/faq"
import { FinalCTA } from "@/components/sections/final-cta"

export default function PortfolioDemoPage() {
  return (
    <div className="theme-portfolio">
      <SiteHeader />
      <main>
        <Hero
          variant="minimal"
          title="I design and build digital products that people actually want to use."
          subtitle="Full-stack developer with a design eye. I ship fast, write clean code and obsess over details."
          primaryCta="See my work"
          secondaryCta="Get in touch"
        />
        <LogoCloud />
        <MetricsBand />
        <ValueGrid />
        <FeatureSplit />
        <FAQ />
        <FinalCTA
          eyebrow="Available for hire"
          title="Got a project? Let's scope it."
          subtitle="I usually reply within 24 hours. No sales pitch — just a real conversation about what you need."
          primaryCta="Get in touch"
          primaryHref="#contact"
          secondaryCta="Download CV"
          secondaryHref="#"
        />
      </main>
      <SiteFooter />
    </div>
  )
}
