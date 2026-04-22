# PropertyFlow launch guards

This repo now uses Next.js server routes for Stripe Checkout and protected ZIP delivery. It is no longer a pure static export because paid digital delivery needs server-side verification.

## Checkout

- Route: `POST /api/checkout/propertyflow`.
- The public pricing buttons send `{ tier, currency }` to the checkout API.
- The checkout API creates a Stripe Checkout Session in `mode=payment` with tier, currency, version and filename metadata.
- Success URL: `/dashboard/purchases/propertyflow?session_id={CHECKOUT_SESSION_ID}&tier={tier}`.
- Run one low-value live purchase before launch and verify the receipt, webhook, purchase tier and delivery URL.

## Delivery

- Route: `/dashboard/purchases/propertyflow`.
- Preview mode: `/dashboard/purchases/propertyflow?tier=white-label&preview=1`.
- Production unlock requires a paid Stripe Checkout Session ID.
- The delivery client verifies entitlement with `GET /api/downloads/propertyflow/entitlement?session_id=...`.
- The download button calls `POST /api/downloads/propertyflow`, then opens the protected GET URL.
- ZIPs live in `storage/propertyflow`, not `public`, so they cannot be downloaded by guessing a public URL.
- Production rejects unpaid, incomplete, wrong-product, wrong-price and test-mode sessions.
- Webhook endpoint: `POST /api/webhooks/stripe`.

## Tier ZIPs

- `propertyflow-starter-v1.0.0.zip`: Starter README, license, setup/customization docs and local source placeholder.
- `propertyflow-professional-v1.0.0.zip`: Professional README, license, setup/customization/admin/Supabase docs and local source placeholder.
- `propertyflow-white-label-v1.0.0.zip`: White-Label README, license, tier config, all docs, tools/templates placeholders and local source placeholder.

The `propertyflow-complete-FINAL.zip` source package is stored in `storage/propertyflow` for audit and rebuilds.

## Required env vars

- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `PROPERTYFLOW_ENABLE_PREVIEW_DOWNLOADS=false`
