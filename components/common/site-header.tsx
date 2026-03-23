import Link from "next/link"
import { Button } from "@/components/common/button"

const nav = [
  { href: "#system", label: "System" },
  { href: "#sections", label: "Sections" },
  { href: "#pricing", label: "Pricing" },
  { href: "/demo/saas", label: "Demo" }
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between py-4">
        <Link href="/" className="text-sm font-semibold tracking-[0.28em] text-white">
          VOLYNX SYSTEM
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm text-zinc-400 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <Button href="/docs" className="hidden md:inline-flex">
          Documentation
        </Button>
      </div>
    </header>
  )
}
