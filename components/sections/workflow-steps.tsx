import { workflow } from "@/content/site"
import { SectionHeading } from "@/components/common/section-heading"

export function WorkflowSteps() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <SectionHeading
          badge="Workflow"
          title="A repeatable launch process, not a gallery of disconnected pages."
          copy="Use the system the same way serious studios operate: pick an archetype, swap the right blocks, then ship with documentation and speed."
          align="center"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {workflow.map((item) => (
            <article key={item.step} className="surface p-6 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{item.step}</p>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
