import Link from "next/link"
import { Button } from "@/components/common/button"
import { ThemeSwitcher } from "@/components/common/theme-switcher"
import { storeUrl } from "@/content/site"

const nav = [
  { href: storeUrl, label: "Products", external: true },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/daily", label: "Daily" },
  { href: "/icons-store", label: "Icons" },
  { href: "/products/propertyflow", label: "PropertyFlow" },
  { href: "/support", label: "Support" },
]

const mobileNav = [
  { href: storeUrl, label: "Products", external: true },
  { href: "/daily", label: "Daily" },
  { href: "/dashboard/purchases", label: "Purchases" },
  { href: "/support", label: "Support" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between py-4">
        <Link href="/" className="text-sm font-semibold tracking-[0.28em] text-white">
          VolynxOS
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Button href="/dashboard/purchases" className="hidden md:inline-flex">
            Purchases
          </Button>
        </div>
      </div>
      <nav className="container-shell flex gap-2 overflow-x-auto border-t border-white/5 pb-3 md:hidden">
        {mobileNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="shrink-0 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
