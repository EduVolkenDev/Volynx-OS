"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/common/button"
import { iconPacks, iconPackStats } from "@/content/icon-packs"
import { type StoreIcon, iconStoreCategories, iconStoreIcons } from "@/content/icons-store"
import { storeUrl } from "@/content/site"
import { cn } from "@/lib/utils"

export function IconsStoreSection() {
  const [activeCategory, setActiveCategory] = useState<(typeof iconStoreCategories)[number]>("All")
  const [selectedIcon, setSelectedIcon] = useState<StoreIcon | null>(null)
  const visibleIcons = useMemo(() => {
    if (activeCategory === "All") return iconStoreIcons
    return iconStoreIcons.filter((icon) => icon.category === activeCategory)
  }, [activeCategory])
  const featuredIcons = useMemo(() => iconStoreIcons.slice(0, 12), [])

  useEffect(() => {
    if (!selectedIcon) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIcon(null)
    }

    window.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [selectedIcon])

  return (
    <main className="icons-store-page">
      <section className="icons-store-hero">
        <div className="container-shell">
          <div className="icons-store-hero-shell">
            <div className="text-center lg:text-left">
              <p className="icons-store-brand">VolynxOS Assets</p>
              <h1 className="icons-store-title">Icons Store</h1>
              <p className="icons-store-subtitle">Premium · Textured · Futuristic</p>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#7c8a9a] lg:mx-0">
                Seventeen launch-ready WebP packs plus the VolynxOS SVG source set, organized for free drops, premium sales and fast product publishing.
              </p>
              <div className="icons-store-stats" aria-label="Icons Store stats">
                <div className="icons-store-stat">
                  <strong>{iconPackStats.packs}</strong>
                  <span>ready packs</span>
                </div>
                <div className="icons-store-stat">
                  <strong>{iconPackStats.icons}</strong>
                  <span>WebP icons</span>
                </div>
                <div className="icons-store-stat">
                  <strong>{iconPackStats.free}</strong>
                  <span>free drops</span>
                </div>
                <div className="icons-store-stat">
                  <strong>{iconPackStats.premium}</strong>
                  <span>premium vaults</span>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button href="#ready-packs">Browse ready packs</Button>
                <Button href={storeUrl} variant="secondary">Open product store</Button>
              </div>
            </div>

            <div className="icons-store-logo-card" aria-label="Icons Store logo card">
              <div className="icons-store-logo-frame">
                <Image
                  src="/icons-store/icons-logo.webp"
                  alt="VolynxOS Icons Store logo"
                  width={320}
                  height={320}
                  priority
                  className="icons-store-logo-image"
                />
              </div>
              <div className="icons-store-logo-copy">
                <p>Source identity</p>
                <strong>Icons logo</strong>
                <span>Use this as the recognisable pack mark while the SVG vault and WebP shelf expand.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ready-packs" className="container-shell py-10">
        <div className="icons-section-heading">
          <p className="icons-store-brand">Ready Packs</p>
          <h2>Free drops and premium vaults ready to publish.</h2>
          <p>
            Each pack uses the WebP folders you separated for launch, with real previews, item counts and direct paths for free or premium conversion.
          </p>
        </div>
        <div className="icons-pack-grid">
          {iconPacks.map((pack) => (
            <article key={pack.slug} className={cn("icons-pack-card", pack.plan === "premium" && "is-premium")}>
              <div className="icons-pack-meta">
                <span className={cn("icons-plan-badge", pack.plan)}>{pack.plan}</span>
                <span>{pack.count} WebP</span>
              </div>
              <div className="icons-pack-preview" aria-hidden="true">
                {pack.preview.map((src, index) => (
                  <div key={src} className="icons-pack-tile">
                    <Image src={src} alt="" width={96} height={96} />
                  </div>
                ))}
              </div>
              <p className="icons-pack-category">{pack.category}</p>
              <h3 className="icons-pack-title">{pack.name}</h3>
              <a
                href={pack.plan === "premium" ? storeUrl : pack.href}
                target={pack.plan === "premium" ? "_blank" : undefined}
                rel={pack.plan === "premium" ? "noopener noreferrer" : undefined}
                className="icons-pack-cta"
              >
                {pack.plan === "premium" ? "Open premium pack" : "Download free ZIP"}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="icons-export-showcase">
          <div>
            <p className="icons-store-brand text-left">Volynx Source Edition</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
              The SVG model set stays as the Volynx source layer.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#7c8a9a]">
              Dark neon cards, textured SVG icons and a premium product surface for SaaS pages, dashboards, stores and kit launches.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={storeUrl}>Get the vault</Button>
              <Button href="#icon-grid" variant="secondary">Continue to icons</Button>
            </div>
          </div>

          <div className="source-preview-shell" aria-label="Volynx source preview">
            <div className="source-preview-topbar">
              <span />
              <span />
              <span />
              <p>volynx-icons-store/source-edition</p>
            </div>
            <div className="source-preview-grid">
              {iconStoreIcons.slice(0, 8).map((icon) => (
                <button
                  key={icon.label}
                  type="button"
                  className={cn("source-preview-card", icon.tone !== "cyan" && `tone-${icon.tone}`)}
                  onClick={() => setSelectedIcon(icon)}
                  aria-label={`Open preview for ${icon.label}`}
                >
                  <div dangerouslySetInnerHTML={{ __html: icon.svg }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="icons-section-heading">
          <p className="icons-store-brand">Featured Source Grid</p>
          <h2>The HTML showcase grid now lives in the page as a real section.</h2>
          <p>
            These twelve cards pull from the source SVG set directly, keep the neon palette visible, and open a larger preview instead of feeling decorative only.
          </p>
        </div>
        <div className="featured-source-grid" aria-label="Featured source icons">
          {featuredIcons.map((icon) => (
            <button
              key={icon.label}
              type="button"
              className={cn("featured-source-card", icon.tone !== "cyan" && `tone-${icon.tone}`)}
              onClick={() => setSelectedIcon(icon)}
              aria-label={`Preview ${icon.label}`}
            >
              {icon.badge ? <span className={cn("neon-icon-badge", icon.badgeTone && `badge-${icon.badgeTone}`)}>{icon.badge}</span> : null}
              <div className="featured-source-svg" dangerouslySetInnerHTML={{ __html: icon.svg }} />
              <div className="featured-source-copy">
                <p>{icon.category}</p>
                <strong>{icon.label}</strong>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="icons-store-filters" aria-label="Icon categories">
        {iconStoreCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn("icons-filter-btn", activeCategory === category && "active")}
          >
            {category}
          </button>
        ))}
      </section>

      <section id="icon-grid" className="icons-store-grid" aria-label="VolynxOS icon store">
        {visibleIcons.map((icon) => (
          <button
            key={icon.label}
            type="button"
            onClick={() => setSelectedIcon(icon)}
            className={cn("neon-icon-card", icon.tone !== "cyan" && `tone-${icon.tone}`)}
            aria-label={`Open preview for ${icon.label}`}
          >
            {icon.badge ? <span className={cn("neon-icon-badge", icon.badgeTone && `badge-${icon.badgeTone}`)}>{icon.badge}</span> : null}
            <div className="neon-icon-svg" dangerouslySetInnerHTML={{ __html: icon.svg }} />
            <p className="neon-icon-label">{icon.label}</p>
          </button>
        ))}
      </section>

      <section className="container-shell pb-20">
        <div className="icons-store-pack">
          <div>
            <p className="icons-store-brand text-left">17 Packs · 645 WebP · 40 SVG Source Icons</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
              The Icons Store is now a real VolynxOS product shelf.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#7c8a9a]">
              Free packs can build trust, premium packs can route to checkout, and the source set keeps the neon card language consistent across the platform.
            </p>
          </div>
          <Button href={storeUrl}>Open product store</Button>
        </div>
      </section>

      {selectedIcon ? (
        <div
          className="icons-modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedIcon(null)
          }}
        >
          <div className={cn("icons-modal-card", selectedIcon.tone !== "cyan" && `tone-${selectedIcon.tone}`)} role="dialog" aria-modal="true" aria-label={selectedIcon.label}>
            <button type="button" className="icons-modal-close" onClick={() => setSelectedIcon(null)} aria-label="Close preview">
              Close
            </button>
            <div className="icons-modal-svg" dangerouslySetInnerHTML={{ __html: selectedIcon.svg }} />
            <p className="icons-modal-category">{selectedIcon.category}</p>
            <h3 className="icons-modal-title">{selectedIcon.label}</h3>
            <p className="icons-modal-copy">
              Source SVG preview from the VolynxOS icon grid. Use the filtered shelf for browsing and the ready packs above for WebP-based product delivery.
            </p>
          </div>
        </div>
      ) : null}
    </main>
  )
}
