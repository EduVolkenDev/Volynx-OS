import { SiteHeader } from "@/components/common/site-header"
import { SiteFooter } from "@/components/common/site-footer"
import { ProductBanner } from "@/components/common/product-banner"
import { Hero } from "@/components/sections/hero"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { MetricsBand } from "@/components/sections/metrics-band"
import { ValueGrid } from "@/components/sections/value-grid"
import { FeatureSplit } from "@/components/sections/feature-split"
import { FAQ } from "@/components/sections/faq"
import { FinalCTA } from "@/components/sections/final-cta"

const portfolioMetrics = [
  { value: "8+", label: "Years building" },
  { value: "40+", label: "Projects shipped" },
  { value: "12", label: "Technologies" },
  { value: "3", label: "Countries" },
]

const portfolioLogos = ["VOLYNX", "STUDIOS VALCARCE", "STUDIO PRO", "DEV JOURNEY", "VOLYNX LAB"]

const portfolioCards = [
  {
    title: "Full-stack development",
    description: "React, Vue, Node, Python, Java — end-to-end delivery from architecture to deployment.",
  },
  {
    title: "Product & design thinking",
    description: "Not just code. I think about conversion, UX, brand perception and commercial clarity.",
  },
  {
    title: "Performance-first builds",
    description: "Every project ships fast by default. Lighthouse scores, Core Web Vitals, real-world speed.",
  },
  {
    title: "Clean, maintainable code",
    description: "Production-grade architecture that teams can inherit, extend and scale without rewrites.",
  },
]

const portfolioFaqs = [
  {
    question: "What type of projects do you take on?",
    answer: "Web applications, SaaS products, landing pages, and digital products. I work best on projects that need both strong engineering and visual polish.",
  },
  {
    question: "Do you work with teams or solo?",
    answer: "Both. I can integrate into an existing team or deliver end-to-end as a solo developer, depending on the project scope.",
  },
  {
    question: "What is your typical timeline?",
    answer: "Landing pages and marketing sites: 1-2 weeks. Web applications and SaaS: 4-8 weeks depending on scope. I scope honestly and ship on time.",
  },
]

export default function PortfolioDemoPage() {
  return (
    <div className="theme-portfolio">
      <ProductBanner
        label="Portfolio Demo"
        productName="Portfolio Pro Kit"
        href="https://volynx.world/products/portfolio-pro-kit/"
      />
      <SiteHeader />
      <main>
        <Hero
          variant="minimal"
          title="I design and build digital products that people actually want to use."
          subtitle="Full-stack developer with a design eye. I ship fast, write clean code and obsess over details. Based in Brazil, working globally."
          primaryCta="See my work"
          secondaryCta="Get in touch"
        />
        <LogoCloud logos={portfolioLogos} />
        <MetricsBand items={portfolioMetrics} />
        <ValueGrid
          badge="Skills"
          title="What I bring to the table."
          copy="Engineering depth, design sensibility and commercial awareness — not just technical execution."
          cards={portfolioCards}
        />
        <FeatureSplit />
        <FAQ
          badge="Working together"
          title="Common questions from clients and collaborators."
          copy="Transparent answers so we can move faster."
          items={portfolioFaqs}
        />
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
