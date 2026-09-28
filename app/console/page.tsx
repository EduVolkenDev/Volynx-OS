import Link from "next/link";
import { ArrowRight, Cloud } from "lucide-react";
import { contextPath, listClients, listEnvs, listProducts } from "@/lib/console/data";

/**
 * Context picker — first screen of the console (§4 hierarchy).
 * Client → Product → Environment, then into the Overview.
 */
export default function ConsoleIndexPage() {
  const clients = listClients();
  return (
    <div className="console-root min-h-screen bg-[#070807] px-4 py-12 text-zinc-100 md:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
            <Cloud className="h-5 w-5 text-zinc-200" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.1em] text-white">VOLYNX CLOUD</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Console</p>
          </div>
        </div>

        <h1 className="mt-10 max-w-xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
          Choose what you&apos;re operating.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-zinc-400">
          The console is organized by client, product and environment. Pick a product to open its
          Overview — status, domain, deployments, health, backups, security and care, in one place.
        </p>

        <div className="mt-10 space-y-8">
          {clients.map((client) => {
            const products = listProducts(client.slug);
            const envs = listEnvs(client.slug);
            return (
              <section key={client.slug} aria-label={client.name}>
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {client.name}
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {products.map((p) => (
                    <div
                      key={p.slug}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[15px] font-semibold text-white">{p.name}</p>
                          <p className="tnum mt-1 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                            {p.vlxId}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {envs.map((env) => (
                          <Link
                            key={env}
                            href={contextPath({ org: "Volynx Cloud", client, product: p, env })}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] font-medium text-zinc-200 transition hover:bg-white/[0.09]"
                          >
                            {env}
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-12 border-t border-white/[0.07] pt-6 text-[13px] leading-6 text-zinc-600">
          Build it. Launch it. Keep it alive. — Operational data appears here once its source is
          connected. Until then, every module honestly reports Unknown or Not configured.
        </p>
      </div>
    </div>
  );
}
