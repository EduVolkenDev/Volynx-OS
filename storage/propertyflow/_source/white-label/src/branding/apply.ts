/**
 * Generates a CSS variable block from the active branding tokens.
 * Imported by BaseLayout.astro and injected into <style is:global>.
 *
 * If you change branding/tokens.ts and don't see the new colours,
 * restart the dev server.
 */

import { branding } from "./tokens";

export function brandingVarsCss(): string {
  const c = branding.colors;
  return `
    :root {
      --bg: ${c.bg};
      --bg-card: ${c.bg_card};
      --text: ${c.text};
      --muted: ${c.muted};
      --accent: ${c.accent};
      --accent-2: ${c.accent_2};
      --gold: ${c.gold};
      --border: ${c.border};
    }
  `;
}

export function fontLink(): string | null {
  if (!branding.font) return null;
  const fam = encodeURIComponent(branding.font.family);
  const weights = branding.font.weights.join(";");
  return `https://fonts.googleapis.com/css2?family=${fam}:wght@${weights}&display=swap`;
}
