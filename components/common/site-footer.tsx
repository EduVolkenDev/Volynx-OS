import Link from "next/link"

const footerLinks = [
  { href: "/demo/saas", label: "SaaS demo" },
  { href: "/demo/agency", label: "Agency demo" },
  { href: "/demo/portfolio", label: "Portfolio demo" },
  { href: "/icons-store", label: "Icons store" },
  { href: "https://volynx.world/products/", label: "All products", external: true },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-white">VolynxOS</p>
          <p className="mt-2 text-sm text-zinc-500">
            Premium operating system for commercial kits and digital products.
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          {footerLinks.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm text-zinc-400 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
