import { Button } from "@/components/common/button"
import { SectionHeading } from "@/components/common/section-heading"
import { cn } from "@/lib/utils"

type PricingVariant = "single" | "tiered" | "comparison"

type Tier = {
  name: string
  price: string
  description: string
  features: string[]
  highlight?: boolean
}

const tiers: Tier[] = [
  {
    name: "Starter",
    price: "$49",
    description: "For solo builders who want a fast premium launch.",
    features: ["Core sections", "3 hero variants", "1 demo page", "Commercial use"]
  },
  {
    name: "Pro",
    price: "$99",
    description: "For agencies, products and serious client delivery.",
    features: ["Full section library", "3 demo pages", "Tokens + docs", "Priority updates"],
    highlight: true
  },
  {
    name: "Lifetime",
    price: "$149",
    description: "For studios building multiple premium websites.",
    features: ["Everything in Pro", "Future packs", "All demo variants", "Extended license"]
  }
]

function SingleCard() {
  const pro = tiers[1]
  return (
    <div className="mx-auto max-w-xl surface p-8 text-center">
      <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">{pro.name}</p>
      <div className="mt-4 text-6xl font-semibold tracking-[-0.06em]">{pro.price}</div>
      <p className="mx-auto mt-4 max-w-md text-zinc-400">{pro.description}</p>
      <div className="mt-8 grid gap-3 text-left">
        {pro.features.map((feature) => (
          <div key={feature} className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-zinc-300">{feature}</div>
        ))}
      </div>
      <Button href="#" className="mt-8 w-full">Get Pro</Button>
    </div>
  )
}

function TieredCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {tiers.map((tier) => (
        <article key={tier.name} className={cn("surface p-7", tier.highlight && "border-white/20 bg-white/[0.05]")}>
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">{tier.name}</p>
            {tier.highlight ? <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] text-emerald-200">Best value</span> : null}
          </div>
          <div className="mt-5 text-5xl font-semibold tracking-[-0.06em]">{tier.price}</div>
          <p className="mt-4 text-sm leading-7 text-zinc-400">{tier.description}</p>
          <div className="mt-6 grid gap-3">
            {tier.features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">{feature}</div>
            ))}
          </div>
          <Button href="#" variant={tier.highlight ? "primary" : "secondary"} className="mt-7 w-full">
            Choose {tier.name}
          </Button>
        </article>
      ))}
    </div>
  )
}

function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10">
      <div className="grid grid-cols-4 border-b border-white/10 bg-white/[0.03] px-6 py-4 text-sm text-zinc-400">
        <div>Feature</div>
        <div>Starter</div>
        <div>Pro</div>
        <div>Lifetime</div>
      </div>
      {[
        ["Demo pages", "1", "3", "3 + future"],
        ["Hero variants", "3", "4", "4"],
        ["Pricing variants", "1", "3", "3"],
        ["Commercial usage", "Yes", "Yes", "Extended"],
        ["Future updates", "No", "Yes", "Yes"]
      ].map((row) => (
        <div key={row[0]} className="grid grid-cols-4 border-b border-white/5 px-6 py-4 text-sm">
          {row.map((cell, i) => (
            <div key={cell + i} className={i === 0 ? "text-zinc-500" : "text-zinc-300"}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function Pricing({ variant = "tiered" }: { variant?: PricingVariant }) {
  return (
    <section id="pricing" className="section-space">
      <div className="container-shell">
        <SectionHeading
          badge="Pricing"
          title="Price the product like infrastructure, not disposable templates."
          copy="This V2 kit is structured to support global positioning: premium perception, usable architecture and commercial packaging."
          align="center"
        />
        {variant === "single" ? <SingleCard /> : null}
        {variant === "tiered" ? <TieredCards /> : null}
        {variant === "comparison" ? <ComparisonTable /> : null}
      </div>
    </section>
  )
}
