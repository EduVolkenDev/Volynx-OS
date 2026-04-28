/**
 * White-Label branding tokens.
 *
 * One file, one tenant. Edit these values to re-skin the entire catalogue —
 * all CSS variables in src/styles/global.css derive from these tokens at
 * build time via src/branding/apply.ts.
 *
 * For multi-tenant operation, see tools/tenant-provisioner/provision.mjs
 * which reads a tenants.json registry and builds one site per tenant from
 * a base config.
 */

export interface BrandingTokens {
  /** Tenant slug (DNS-safe). Used in build paths and the tenant registry. */
  slug: string;
  /** Public-facing brand name. */
  name: string;
  /** Tagline shown on the homepage. */
  tagline_en: string;
  tagline_pt: string;
  /** Domain the tenant publishes at. */
  domain: string;
  /** Currency symbol + ISO code used for prices. */
  currency: { code: "EUR" | "GBP" | "USD" | "BRL"; symbol: string };
  /** Locale code for default rendering. */
  default_locale: "en" | "pt";
  /** Hex / rgba colour tokens — wired into CSS variables. */
  colors: {
    bg: string;
    bg_card: string;
    text: string;
    muted: string;
    accent: string;       // primary brand colour
    accent_2: string;     // secondary/gradient pair
    gold: string;         // luxury / for-sale chip colour
    border: string;
  };
  /** Logo asset paths (drop into public/branding/<slug>/). */
  logo: { mark: string; wordmark: string };
  /** Optional Google Font family — loaded if set. */
  font?: { family: string; weights: number[] };
  /** Contact info shown in the footer + admin enquiries reply-to. */
  contact: { email: string; phone?: string; address?: string };
  /** Feature flags — disable to hide a layout from the navigation. */
  features: {
    classic: boolean;
    magazine: boolean;
    compact: boolean;
    gallery: boolean;
    split: boolean;
    masonry: boolean;
    map: boolean;
    tabbed: boolean;
    story: boolean;
    carousel: boolean;
    admin: boolean;
    enquiries: boolean;
  };
}

export const branding: BrandingTokens = {
  slug: "default",
  name: "PropertyFlow",
  tagline_en: "Premium real estate, beautifully presented.",
  tagline_pt: "Imobiliário premium, com apresentação à altura.",
  domain: "your-domain.example",
  currency: { code: "EUR", symbol: "€" },
  default_locale: "en",
  colors: {
    bg: "#0a0e1a",
    bg_card: "rgba(255, 255, 255, .035)",
    text: "#f5f5f7",
    muted: "rgba(245, 245, 247, .62)",
    accent: "#59c3ff",
    accent_2: "#8b5cf6",
    gold: "#d6b36a",
    border: "rgba(255, 255, 255, .08)"
  },
  logo: {
    mark: "/branding/default/mark.svg",
    wordmark: "/branding/default/wordmark.svg"
  },
  font: { family: "Inter", weights: [400, 500, 600, 700, 800] },
  contact: { email: "contact@your-domain.example" },
  features: {
    classic: true, magazine: true, compact: true,
    gallery: true, split: true, masonry: true,
    map: true, tabbed: true, story: true, carousel: true,
    admin: true, enquiries: true
  }
};
