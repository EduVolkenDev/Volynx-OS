import { Hero } from "@/components/sections/hero"

export function HeroShowcase() {
  return (
    <div className="space-y-8">
      <Hero
        variant="centered"
        title="Centered hero for product-first launches."
        subtitle="Use this when your product value proposition is simple, high-confidence and visually restrained."
      />
      <Hero
        variant="split"
        title="Split hero for more context, metrics and visual structure."
        subtitle="Useful for premium systems, agencies and launches that need product cues without a full screenshot."
      />
      <Hero
        variant="minimal"
        title="Minimal hero for technical, editorial or manifesto-driven brands."
        subtitle="Large type and lean composition keep the message immediate."
      />
      <Hero
        variant="product"
        title="Product hero for demo-led pages that still feel controlled."
        subtitle="Combines conversion clarity with a more complete preview module."
      />
    </div>
  )
}
