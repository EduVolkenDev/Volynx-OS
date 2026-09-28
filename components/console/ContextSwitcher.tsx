"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { TenantContext } from "@/lib/console/types";
import { DEMO_CONTEXTS } from "@/lib/console/data";
import { cn } from "@/lib/utils";

/**
 * Client → Product → Environment cascade. Changing context keeps the current
 * section whenever possible (IA §2). Options are demo navigation contexts —
 * explicitly illustrative until tenant data exists.
 */
export function ContextSwitcher({ ctx }: { ctx: TenantContext }) {
  const router = useRouter();
  const pathname = usePathname();
  const section = pathname.split("/").slice(5).join("/") || "";

  const clients = [...new Set(DEMO_CONTEXTS.map((c) => c.client))];
  const products = [...new Set(DEMO_CONTEXTS.filter((c) => c.client === ctx.client).map((c) => c.product))];
  const envs = [...new Set(DEMO_CONTEXTS.filter((c) => c.client === ctx.client && c.product === ctx.product).map((c) => c.env))];

  function go(client: string, product: string, env: string) {
    const base = `/console/${client}/${product}/${env}`;
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
          value={ctx.client}
          onChange={(e) => {
            const next = DEMO_CONTEXTS.find((c) => c.client === e.target.value);
            if (next) go(next.client, next.product, next.env);
          }}
        >
          {clients.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Product</span>
        <select
          className={selectClass}
          value={ctx.product}
          onChange={(e) => go(ctx.client, e.target.value, envs[0] ?? ctx.env)}
        >
          {products.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Environment</span>
        <select
          className={selectClass}
          value={ctx.env}
          onChange={(e) => go(ctx.client, ctx.product, e.target.value)}
        >
          {envs.map((env) => (
            <option key={env} value={env}>{env}</option>
          ))}
        </select>
      </label>
      <p className="pt-1 text-[11px] uppercase tracking-[0.14em] text-zinc-600">
        Demo context — not connected
      </p>
    </div>
  );
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
        "flex items-center gap-2.5 rounded-lg px-3 py-2 pl-4 text-[13px] font-medium transition",
        active
          ? "bg-[#e3b85c]/[0.08] text-white"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200",
        className
      )}
    >
      {children}
    </Link>
  );
}
