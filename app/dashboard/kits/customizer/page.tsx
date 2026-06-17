import type { Metadata } from "next"
import { SiteFooter } from "@/components/common/site-footer"
import { SiteHeader } from "@/components/common/site-header"
import { KitCustomizer } from "./kit-customizer"

export const metadata: Metadata = {
  title: "Kit Customizer - VOLYNX",
  description: "Visually customize VOLYNX Portfolio, Agency and SaaS kits, then export ready configuration files."
}

export default function KitCustomizerPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen border-t border-white/5">
        <KitCustomizer />
      </main>
      <SiteFooter />
    </>
  )
}
