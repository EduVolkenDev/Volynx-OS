import Link from "next/link"

const footerLinks = [
  { href: "/products/propertyflow", label: "PropertyFlow" },
  { href: "/demo/saas", label: "SaaS demo" },
  { href: "/demo/agency", label: "Agency demo" },
  { href: "/demo/portfolio", label: "Portfolio demo" },
  { href: "https://volynx.world/products/", label: "All products", external: true },
]

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund", label: "Refunds" },
  { href: "/license", label: "License" },
  { href: "/cookies", label: "Cookies" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-medium text-white">VolynxOS</p>
          <p className="mt-2 text-sm text-zinc-500">
            Premium operating system for commercial kits and digital products.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-5 lg:justify-end">
            {footerLinks.map((item) => (
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
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            {legalLinks.map((item) => (
              <Link key={item.label} href={item.href} className="text-xs text-zinc-500 transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
