import { featureCards } from "@/content/site"
import { SectionHeading } from "@/components/common/section-heading"

export function ValueGrid() {
  return (
    <section id="system" className="section-space">
      <div className="container-shell">
        <SectionHeading
          badge="System"
          title="Designed around clarity, speed and structured shipping."
          copy="The best premium landing pages do not feel crowded. They feel inevitable. This system keeps the visual language disciplined while giving you enough range to build multiple product styles."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((card) => (
            <article key={card.title} className="surface p-6">
              <div className="mb-5 h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.04]" />
              <h3 className="text-xl font-medium tracking-[-0.03em] text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
