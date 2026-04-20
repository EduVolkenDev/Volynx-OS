"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { Button } from "@/components/common/button"
import { iconPacks, iconPackStats } from "@/content/icon-packs"
import { iconStoreCategories, iconStoreIcons } from "@/content/icons-store"
import { storeUrl } from "@/content/site"
import { cn } from "@/lib/utils"

export function IconsStoreSection() {
  const [activeCategory, setActiveCategory] = useState<(typeof iconStoreCategories)[number]>("All")
  const visibleIcons = useMemo(() => {
    if (activeCategory === "All") return iconStoreIcons
    return iconStoreIcons.filter((icon) => icon.category === activeCategory)
  }, [activeCategory])

  return (
    <main className="icons-store-page">
      <section className="icons-store-hero">
        <div className="container-shell text-center">
          <p className="icons-store-brand">VolynxOS Assets</p>
          <h1 className="icons-store-title">Icons Store</h1>
          <p className="icons-store-subtitle">Premium · Textured · Futuristic</p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#7c8a9a]">
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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="#ready-packs">Browse ready packs</Button>
            <Button href={storeUrl} variant="secondary">Open product store</Button>
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
                <div key={icon.label} className={cn("source-preview-card", icon.tone !== "cyan" && `tone-${icon.tone}`)}>
                  <div dangerouslySetInnerHTML={{ __html: icon.svg }} />
                </div>
              ))}
            </div>
          </div>
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
          <article key={icon.label} className={cn("neon-icon-card", icon.tone !== "cyan" && `tone-${icon.tone}`)}>
            {icon.badge ? <span className={cn("neon-icon-badge", icon.badgeTone && `badge-${icon.badgeTone}`)}>{icon.badge}</span> : null}
            <div className="neon-icon-svg" dangerouslySetInnerHTML={{ __html: icon.svg }} />
            <p className="neon-icon-label">{icon.label}</p>
          </article>
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
    </main>
  )
}
