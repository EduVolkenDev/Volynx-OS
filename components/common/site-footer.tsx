import Link from "next/link"

const footerLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/demo/agency", label: "Agency demo" },
  { href: "/demo/portfolio", label: "Portfolio demo" }
]

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-white">VOLYNX System V2</p>
          <p className="mt-2 text-sm text-zinc-500">
            Premium landing system for developers, agencies and digital products.
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
