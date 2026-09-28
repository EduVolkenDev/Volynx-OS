"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ConsoleContext } from "@/lib/console/data";
import { contextPath, listClients, listEnvs, listProducts } from "@/lib/console/data";
import { cn } from "@/lib/utils";

/**
 * Client → Product → Environment cascade. Changing context keeps the current
 * section whenever possible (IA §2).
 */
export function ContextSwitcher({ ctx }: { ctx: ConsoleContext }) {
  const router = useRouter();
  const pathname = usePathname();
  const section = pathname.split("/").slice(5).join("/") || "";

  const products = listProducts(ctx.client.slug);
  const envs = listEnvs(ctx.client.slug);

  function go(clientSlug: string, productSlug: string, env: string) {
    const base = `/console/${clientSlug}/${productSlug}/${env}`;
    router.push(section ? `${base}/${section}` : base);
  }

  const selectClass =
    "w-full appearance-none truncate rounded-lg border border-white/10 bg-black/30 px-2.5 py-2 text-[13px] font-medium text-zinc-200 outline-none transition focus:border-white/25 hover:border-white/20";

  return (
    <div className="space-y-1.5" aria-label="Console context">
      <label className="block">
        <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Client</span>
        <select
          className={selectClass}
          value={ctx.client.slug}
          onChange={(e) => {
            const prods = listProducts(e.target.value);
            const first = prods[0];
            if (first) go(e.target.value, first.slug, listEnvs(e.target.value)[0] ?? "production");
          }}
        >
          {listClients().map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Product</span>
        <select
          className={selectClass}
          value={ctx.product.slug}
          onChange={(e) => go(ctx.client.slug, e.target.value, ctx.env)}
        >
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>{p.name} · {p.vlxId}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Environment</span>
        <select
          className={selectClass}
          value={ctx.env}
          onChange={(e) => go(ctx.client.slug, ctx.product.slug, e.target.value)}
        >
          {envs.map((env) => (
            <option key={env} value={env}>{env}</option>
          ))}
        </select>
      </label>
      <p className="tnum pt-1 text-[11px] uppercase tracking-[0.14em] text-zinc-600">
        {ctx.product.vlxId}
      </p>
    </div>
  );
}

/** Compact context link used on pages without a full shell (e.g. context picker). */
export function contextLink(ctx: ConsoleContext, section = ""): string {
  return contextPath(ctx, section);
}

export function useSectionSlug(): string {
  const pathname = usePathname();
  return pathname.split("/").slice(5).join("/") || "";
}

export function NavLink({ href, active, children, className }: { href: string; active: boolean; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition",
        active ? "bg-white/[0.07] text-white" : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200",
        className
      )}
    >
      {children}
    </Link>
  );
}
