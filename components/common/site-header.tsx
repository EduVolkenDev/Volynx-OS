import Link from "next/link"
import { Button } from "@/components/common/button"
import { ThemeSwitcher } from "@/components/common/theme-switcher"

const nav = [
  { href: "/#kits", label: "Kits" },
  { href: "/icons-store", label: "Icons" },
  { href: "/demo/saas", label: "SaaS" },
  { href: "/demo/agency", label: "Agency" },
  { href: "/#pricing", label: "Pricing" },
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
            <Link key={item.label} href={item.href} className="text-sm text-zinc-400 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Button href="https://volynx.world/products/" className="hidden md:inline-flex">
            Get VolynxOS
          </Button>
        </div>
      </div>
    </header>
  )
}
