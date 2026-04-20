import { Check, Minus } from "lucide-react"
import { comparisonRows } from "@/content/site"
import { SectionHeading } from "@/components/common/section-heading"

export function Comparison() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <SectionHeading
          badge="Comparison"
          title="VolynxOS beats a folder of attractive pages."
          copy="The platform is structured for repeatable launches, client delivery and product pages that keep their premium shape as the scope grows."
        />
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="hidden grid-cols-[0.8fr_1fr_1fr] border-b border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-medium text-white md:grid">
            <div>Decision point</div>
            <div>Template pack</div>
            <div>VolynxOS</div>
          </div>
          {comparisonRows.map((row) => (
            <div key={row.feature} className="grid gap-0 border-b border-white/5 last:border-b-0 md:grid-cols-[0.8fr_1fr_1fr]">
              <div className="border-b border-white/5 px-5 py-5 text-sm font-medium text-white md:border-b-0 md:border-r">{row.feature}</div>
              <div className="flex gap-3 px-5 py-5 text-sm leading-7 text-zinc-500 md:border-r md:border-white/5">
                <Minus className="mt-1 h-4 w-4 shrink-0" />
                <span><strong className="mb-1 block text-xs uppercase tracking-[0.18em] text-zinc-500 md:hidden">Template pack</strong>{row.templatePack}</span>
              </div>
              <div className="flex gap-3 bg-white/[0.02] px-5 py-5 text-sm leading-7 text-zinc-300">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-200" />
                <span><strong className="mb-1 block text-xs uppercase tracking-[0.18em] text-zinc-500 md:hidden">VolynxOS</strong>{row.volynx}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
