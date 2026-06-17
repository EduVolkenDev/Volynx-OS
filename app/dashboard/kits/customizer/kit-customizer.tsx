"use client"

import { useMemo, useState } from "react"
import {
  Check,
  Download,
  Eye,
  LayoutTemplate,
  Monitor,
  RotateCcw,
  Smartphone,
  Tablet,
} from "lucide-react"

type KitSlug = "portfolio" | "agency" | "saas"
type Viewport = "desktop" | "tablet" | "mobile"

type EditableState = {
  kit: KitSlug
  brandName: string
  headline: string
  subtitle: string
  primaryCta: string
  primaryHref: string
  secondaryCta: string
  secondaryHref: string
  accent: string
  theme: "dark" | "light"
  metrics: { value: string; label: string }[]
  showLogos: boolean
  showMetrics: boolean
  showFeatures: boolean
  showPricing: boolean
  showFaq: boolean
}

const presets: Record<KitSlug, EditableState> = {
  portfolio: {
    kit: "portfolio",
    brandName: "Your Name",
    headline: "Turn your work into a premium professional surface.",
    subtitle: "A clear portfolio for clients, recruiters and collaborators.",
    primaryCta: "View my work",
    primaryHref: "#work",
    secondaryCta: "Contact me",
    secondaryHref: "#contact",
    accent: "#8fb7ff",
    theme: "dark",
    metrics: [
      { value: "12+", label: "Projects" },
      { value: "5 yrs", label: "Experience" },
      { value: "Global", label: "Available" },
      { value: "24h", label: "Response" }
    ],
    showLogos: true,
    showMetrics: true,
    showFeatures: true,
    showPricing: false,
    showFaq: true
  },
  agency: {
    kit: "agency",
    brandName: "Your Studio",
    headline: "Package your agency like the work is already premium.",
    subtitle: "A sharper sales surface for services, proof, process and client onboarding.",
    primaryCta: "View services",
    primaryHref: "#services",
    secondaryCta: "Start a project",
    secondaryHref: "#contact",
    accent: "#f4c96b",
    theme: "dark",
    metrics: [
      { value: "24h", label: "Lead response" },
      { value: "30+", label: "Launches" },
      { value: "4.9/5", label: "Client score" },
      { value: "Global", label: "Delivery" }
    ],
    showLogos: true,
    showMetrics: true,
    showFeatures: true,
    showPricing: true,
    showFaq: true
  },
  saas: {
    kit: "saas",
    brandName: "Your Product",
    headline: "Turn product value into conviction.",
    subtitle: "A conversion-focused SaaS page with clear proof, pricing and next steps.",
    primaryCta: "Start free",
    primaryHref: "#pricing",
    secondaryCta: "View demo",
    secondaryHref: "#demo",
    accent: "#7dd3a8",
    theme: "dark",
    metrics: [
      { value: "10k+", label: "Users" },
      { value: "99.9%", label: "Uptime" },
      { value: "2 min", label: "Setup" },
      { value: "24/7", label: "Available" }
    ],
    showLogos: true,
    showMetrics: true,
    showFeatures: true,
    showPricing: true,
    showFaq: true
  }
}

const accentOptions = ["#8fb7ff", "#f4c96b", "#7dd3a8", "#f59e9e", "#c4a7ff", "#ffffff"]

const kitExportDefaults: Record<KitSlug, {
  productUrl: string
  bannerLabel: string
  logos: string[]
  valueGrid: {
    badge: string
    title: string
    copy: string
    cards: { title: string; description: string }[]
  }
  pricingVariant: "single" | "tiered"
  workflowSteps: boolean
  faq: {
    badge: string
    title: string
    copy: string
    items: { question: string; answer: string }[]
  }
}> = {
  portfolio: {
    productUrl: "https://volynx.world/products/portfolio-pro-kit/",
    bannerLabel: "Portfolio",
    logos: ["SELECTED WORK", "CLIENTS", "CASE STUDIES", "EXPERIENCE"],
    valueGrid: {
      badge: "Selected strengths",
      title: "Present the professional story, not only the project list.",
      copy: "Use these cards to explain what makes your work valuable.",
      cards: [
        { title: "Positioning", description: "Explain what you do and who you help." },
        { title: "Proof", description: "Show outcomes instead of a loose gallery." },
        { title: "Process", description: "Make collaboration feel clear and predictable." },
        { title: "Next step", description: "Give visitors a confident action to take." }
      ]
    },
    pricingVariant: "single",
    workflowSteps: true,
    faq: {
      badge: "Working together",
      title: "Common questions from clients and collaborators.",
      copy: "Clear answers reduce friction before the first conversation.",
      items: [
        { question: "What type of work do you take on?", answer: "Describe your strongest services and preferred projects." },
        { question: "What is your typical timeline?", answer: "Set a realistic expectation for your usual delivery window." },
        { question: "How can someone contact you?", answer: "Add your preferred email, form or booking link." }
      ]
    }
  },
  agency: {
    productUrl: "https://volynx.world/products/agency-launch-kit/",
    bannerLabel: "Agency",
    logos: ["CLIENT ONE", "CLIENT TWO", "CLIENT THREE", "PARTNER"],
    valueGrid: {
      badge: "Services",
      title: "Everything supports the sales conversation.",
      copy: "Use these cards to make your offer easier to evaluate.",
      cards: [
        { title: "Strategy", description: "Clarify the commercial problem before execution." },
        { title: "Design", description: "Build a premium and coherent customer experience." },
        { title: "Development", description: "Ship reliable work with a clear technical foundation." },
        { title: "Delivery", description: "Set expectations and hand off professionally." }
      ]
    },
    pricingVariant: "tiered",
    workflowSteps: true,
    faq: {
      badge: "About the studio",
      title: "What clients need to know before starting.",
      copy: "Use these answers to reduce sales friction.",
      items: [
        { question: "What is included?", answer: "Describe your standard scope, deliverables and support." },
        { question: "How does the process work?", answer: "Explain discovery, production, review and delivery." },
        { question: "How do we start?", answer: "Add your preferred enquiry or booking path." }
      ]
    }
  },
  saas: {
    productUrl: "https://volynx.world/products/saas-landing-system/",
    bannerLabel: "SaaS",
    logos: ["CUSTOMERS", "PARTNERS", "PRODUCT TEAMS", "FOUNDERS"],
    valueGrid: {
      badge: "Platform",
      title: "The page structure follows the sales argument.",
      copy: "Use these cards to make the product concrete.",
      cards: [
        { title: "Fast setup", description: "Explain how quickly buyers reach value." },
        { title: "Clear workflow", description: "Show the product experience in simple steps." },
        { title: "Reliable operation", description: "Communicate trust, performance and support." },
        { title: "Measurable value", description: "Connect features to a commercial outcome." }
      ]
    },
    pricingVariant: "tiered",
    workflowSteps: false,
    faq: {
      badge: "Product FAQ",
      title: "Answer the questions buyers ask before converting.",
      copy: "Clear answers help buyers move with confidence.",
      items: [
        { question: "What is included?", answer: "Describe the product's core value and main features." },
        { question: "Can I try it?", answer: "Explain your demo, trial or guarantee." },
        { question: "How does support work?", answer: "Set expectations for onboarding and support." }
      ]
    }
  }
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function Field({
  label,
  value,
  onChange,
  multiline = false
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}) {
  const className =
    "mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/30"

  return (
    <label className="block text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
      {label}
      {multiline ? (
        <textarea className={`${className} min-h-24 resize-y`} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={className} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

function SectionToggle({
  label,
  checked,
  onChange
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-white/5 py-3 text-sm text-zinc-300">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-white"
      />
    </label>
  )
}

export function KitCustomizer() {
  const [state, setState] = useState<EditableState>(presets.portfolio)
  const [viewport, setViewport] = useState<Viewport>("desktop")
  const [exported, setExported] = useState(false)

  const brandConfig = useMemo(
    () => {
      const defaults = kitExportDefaults[state.kit]

      return {
        brandName: state.brandName,
        kitSlug: state.kit,
        tier: "starter",
        themeClass: `theme-${state.kit}`,
        productUrl: defaults.productUrl,
        supportUrl: `https://volynx.world/support/?product=${state.kit}-kit`,
        contactEmail: "hello@volynx.world",
        appearance: state.theme,
        accent: state.accent
      }
    },
    [state]
  )

  const contentConfig = useMemo(
    () => {
      const defaults = kitExportDefaults[state.kit]

      return {
        banner: {
          label: defaults.bannerLabel,
          productName: state.brandName,
          href: defaults.productUrl
        },
        hero: {
          variant: state.kit === "portfolio" ? "minimal" : state.kit === "agency" ? "centered" : "product",
          title: state.headline,
          subtitle: state.subtitle,
          primaryCta: state.primaryCta,
          primaryHref: state.primaryHref,
          secondaryCta: state.secondaryCta,
          secondaryHref: state.secondaryHref
        },
        logos: state.showLogos ? defaults.logos : [],
        metrics: state.showMetrics ? state.metrics : [],
        valueGrid: defaults.valueGrid,
        sections: {
          packageMap: state.showFeatures,
          featureSplit: state.showFeatures,
          workflowSteps: state.showFeatures && defaults.workflowSteps,
          pricing: state.showPricing
        },
        pricing: {
          variant: defaults.pricingVariant
        },
        faq: state.showFaq
          ? defaults.faq
          : {
              badge: "FAQ",
              title: "Frequently asked questions",
              copy: "",
              items: []
            },
        finalCta: {
          eyebrow: "Ready to start?",
          title: state.headline,
          subtitle: state.subtitle,
          primaryCta: state.primaryCta,
          primaryHref: state.primaryHref,
          secondaryCta: state.secondaryCta,
          secondaryHref: state.secondaryHref
        }
      }
    },
    [state]
  )

  function patch(patchValue: Partial<EditableState>) {
    setState((current) => ({ ...current, ...patchValue }))
    setExported(false)
  }

  function selectKit(kit: KitSlug) {
    setState(presets[kit])
    setExported(false)
  }

  function exportAll() {
    downloadJson("brand.config.json", brandConfig)
    downloadJson("content.config.json", contentConfig)
    downloadJson("volynx.config.json", {
      product: state.brandName,
      kitSlug: state.kit,
      editOrder: ["content.config.json", "brand.config.json", "public/", "app/page.tsx"],
      generatedBy: "VOLYNX Kit Customizer"
    })
    setExported(true)
  }

  const previewWidth = viewport === "desktop" ? "w-full" : viewport === "tablet" ? "max-w-[760px]" : "max-w-[390px]"
  const previewBackground = state.theme === "dark" ? "#09090b" : "#f4f4f5"
  const previewText = state.theme === "dark" ? "#fafafa" : "#18181b"
  const previewMuted = state.theme === "dark" ? "#a1a1aa" : "#52525b"
  const previewPanel = state.theme === "dark" ? "#151518" : "#ffffff"

  return (
    <section className="container-shell py-8 md:py-10">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Kit Customizer</span>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
            Customize first. Touch code only when needed.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            Configure the buyer-facing content visually, inspect the live preview and export files ready to replace inside a VOLYNX kit.
          </p>
        </div>
        <button type="button" onClick={exportAll} className="button-primary shrink-0">
          {exported ? <Check className="mr-2 h-4 w-4" /> : <Download className="mr-2 h-4 w-4" />}
          {exported ? "Configs downloaded" : "Download configs"}
        </button>
      </div>

      <div className="mt-6 grid min-h-[760px] gap-0 overflow-hidden rounded-lg border border-white/10 bg-black/20 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-[#101013] lg:border-b-0 lg:border-r">
          <div className="border-b border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Kit preset</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["portfolio", "agency", "saas"] as KitSlug[]).map((kit) => (
                <button
                  key={kit}
                  type="button"
                  onClick={() => selectKit(kit)}
                  className={`min-h-10 rounded-md border px-2 text-xs font-medium capitalize transition ${
                    state.kit === kit
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-black/25 text-zinc-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {kit}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[680px] overflow-y-auto p-4">
            <div className="grid gap-4">
              <Field label="Brand name" value={state.brandName} onChange={(brandName) => patch({ brandName })} />
              <Field label="Headline" value={state.headline} onChange={(headline) => patch({ headline })} multiline />
              <Field label="Subtitle" value={state.subtitle} onChange={(subtitle) => patch({ subtitle })} multiline />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Primary CTA" value={state.primaryCta} onChange={(primaryCta) => patch({ primaryCta })} />
                <Field label="Primary link" value={state.primaryHref} onChange={(primaryHref) => patch({ primaryHref })} />
                <Field label="Secondary CTA" value={state.secondaryCta} onChange={(secondaryCta) => patch({ secondaryCta })} />
                <Field label="Secondary link" value={state.secondaryHref} onChange={(secondaryHref) => patch({ secondaryHref })} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Accent</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {accentOptions.map((accent) => (
                    <button
                      key={accent}
                      type="button"
                      aria-label={`Use accent ${accent}`}
                      onClick={() => patch({ accent })}
                      className={`h-8 w-8 rounded-full border-2 ${state.accent === accent ? "border-white" : "border-transparent"}`}
                      style={{ background: accent }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Appearance</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(["dark", "light"] as const).map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => patch({ theme })}
                      className={`min-h-10 rounded-md border text-xs font-medium capitalize ${
                        state.theme === theme ? "border-white bg-white text-black" : "border-white/10 bg-black/25 text-zinc-400"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Visible sections</p>
                <div className="mt-2">
                  <SectionToggle label="Logo cloud" checked={state.showLogos} onChange={(showLogos) => patch({ showLogos })} />
                  <SectionToggle label="Metrics" checked={state.showMetrics} onChange={(showMetrics) => patch({ showMetrics })} />
                  <SectionToggle label="Feature grid" checked={state.showFeatures} onChange={(showFeatures) => patch({ showFeatures })} />
                  <SectionToggle label="Pricing" checked={state.showPricing} onChange={(showPricing) => patch({ showPricing })} />
                  <SectionToggle label="FAQ" checked={state.showFaq} onChange={(showFaq) => patch({ showFaq })} />
                </div>
              </div>

              <button type="button" onClick={() => selectKit(state.kit)} className="button-secondary mt-2 w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset preset
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 bg-[#0b0b0d]">
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Eye className="h-4 w-4" />
              Live preview
            </div>
            <div className="flex items-center gap-1 rounded-md border border-white/10 bg-black/25 p-1">
              {[
                { value: "desktop" as const, icon: Monitor },
                { value: "tablet" as const, icon: Tablet },
                { value: "mobile" as const, icon: Smartphone }
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  title={`${value} preview`}
                  onClick={() => setViewport(value)}
                  className={`grid h-8 w-8 place-items-center rounded ${
                    viewport === value ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-auto p-4 md:p-6">
            <div
              className={`mx-auto min-h-[680px] overflow-hidden border border-white/10 shadow-2xl transition-all ${previewWidth}`}
              style={{ background: previewBackground, color: previewText }}
            >
              <header className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: `${state.accent}33` }}>
                <strong className="text-sm">{state.brandName}</strong>
                <span className="text-xs" style={{ color: previewMuted }}>{state.kit} kit</span>
              </header>

              <section className="px-5 py-14 text-center md:px-10 md:py-20">
                <div className="mx-auto mb-5 grid h-10 w-10 place-items-center rounded-md" style={{ background: state.accent, color: "#09090b" }}>
                  <LayoutTemplate className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: state.accent }}>Launch ready</p>
                <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">{state.headline}</h2>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 md:text-base" style={{ color: previewMuted }}>{state.subtitle}</p>
                <div className="mt-7 flex flex-wrap justify-center gap-2">
                  <span className="rounded-md px-4 py-2 text-sm font-semibold" style={{ background: state.accent, color: "#09090b" }}>{state.primaryCta}</span>
                  <span className="rounded-md border px-4 py-2 text-sm" style={{ borderColor: `${state.accent}55`, color: previewText }}>{state.secondaryCta}</span>
                </div>
              </section>

              {state.showLogos ? (
                <section className="flex flex-wrap justify-center gap-5 border-y px-5 py-5 text-[10px] uppercase tracking-[0.16em]" style={{ borderColor: `${state.accent}22`, color: previewMuted }}>
                  {["Client One", "Studio", "Product Lab", "Global Team"].map((logo) => <span key={logo}>{logo}</span>)}
                </section>
              ) : null}

              {state.showMetrics ? (
                <section className="grid grid-cols-2 gap-2 px-5 py-8 md:grid-cols-4 md:px-10">
                  {state.metrics.map((metric) => (
                    <div key={metric.label} className="border p-4" style={{ borderColor: `${state.accent}22`, background: previewPanel }}>
                      <strong className="text-xl">{metric.value}</strong>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em]" style={{ color: previewMuted }}>{metric.label}</p>
                    </div>
                  ))}
                </section>
              ) : null}

              {state.showFeatures ? (
                <section className="px-5 py-9 md:px-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: state.accent }}>Features</p>
                  <h3 className="mt-3 text-2xl font-semibold">A clear structure buyers can understand.</h3>
                  <div className="mt-5 grid gap-2 md:grid-cols-3">
                    {["Premium positioning", "Reusable sections", "Launch-ready workflow"].map((feature) => (
                      <div key={feature} className="border p-4 text-sm" style={{ borderColor: `${state.accent}22`, background: previewPanel }}>{feature}</div>
                    ))}
                  </div>
                </section>
              ) : null}

              {state.showPricing ? (
                <section className="px-5 py-9 md:px-10">
                  <div className="border p-5" style={{ borderColor: `${state.accent}55`, background: previewPanel }}>
                    <p className="text-xs uppercase tracking-[0.16em]" style={{ color: state.accent }}>Pricing</p>
                    <p className="mt-3 text-3xl font-semibold">Simple, clear offer</p>
                    <p className="mt-2 text-sm" style={{ color: previewMuted }}>Replace this with your real package and price.</p>
                  </div>
                </section>
              ) : null}

              {state.showFaq ? (
                <section className="px-5 py-9 md:px-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: state.accent }}>FAQ</p>
                  <div className="mt-4 grid gap-2">
                    {["What is included?", "Can I customize it?", "How fast can I launch?"].map((question) => (
                      <div key={question} className="border px-4 py-3 text-sm" style={{ borderColor: `${state.accent}22`, background: previewPanel }}>{question}</div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
