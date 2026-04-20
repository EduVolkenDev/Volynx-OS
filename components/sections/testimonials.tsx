import { testimonials } from "@/content/site"
import { SectionHeading } from "@/components/common/section-heading"

export function Testimonials() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <SectionHeading
          badge="Proof"
          title="Built for teams that sell clarity before decoration."
          copy="VolynxOS is shaped around the work that happens after the first pretty screen: reuse, positioning and faster delivery."
          align="center"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.name} className="surface p-6">
              <blockquote className="text-lg leading-8 text-white">{item.quote}</blockquote>
              <figcaption className="mt-8 border-t border-white/10 pt-5">
                <p className="font-medium text-white">{item.name}</p>
                <p className="mt-1 text-sm text-zinc-500">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
