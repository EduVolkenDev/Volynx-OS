import { faqs } from "@/content/site"
import { SectionHeading } from "@/components/common/section-heading"

export function FAQ() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <SectionHeading
          badge="FAQ"
          title="The practical questions buyers ask before they convert."
          copy="Answering these clearly reduces friction, support load and trust gaps."
        />
        <div className="grid gap-4">
          {faqs.map((item) => (
            <article key={item.question} className="surface p-6">
              <h3 className="text-xl font-medium tracking-[-0.03em] text-white">{item.question}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
