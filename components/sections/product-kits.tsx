import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { productKits } from "@/content/site"
import { volynxCardIcons } from "@/content/volynx-card-icons"
import { SectionHeading } from "@/components/common/section-heading"

export function ProductKits() {
  return (
    <section id="kits" className="section-space">
      <div className="container-shell">
        <SectionHeading
          badge="Kits"
          title="Four product lines ready to sell from the same operating system."
          copy="VolynxOS turns portfolio, agency, SaaS and property products into a coherent commercial platform with clear use cases and direct buying paths."
        />
        <div className="grid gap-5 lg:grid-cols-4">
          {productKits.map((kit, index) => {
            const icon = volynxCardIcons.kits[index % volynxCardIcons.kits.length]

            return (
              <article key={kit.name} className="surface flex min-h-[420px] flex-col overflow-hidden p-6">
                <div className="mb-6 flex h-28 items-center justify-center rounded-lg border border-white/10 bg-black/30">
                  <Image src={icon} alt="" width={160} height={160} className="h-24 w-24 object-contain" />
                </div>
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{kit.label}</p>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">{kit.name}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">{kit.description}</p>
                <div className="mt-6 grid gap-3">
                  {kit.points.map((point) => (
                    <div key={point} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-zinc-300">
                      {point}
                    </div>
                  ))}
                </div>
                <a
                  href={kit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-white"
                >
                  Open kit <ArrowUpRight className="h-4 w-4" />
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
