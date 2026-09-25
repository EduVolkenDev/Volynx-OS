import path from "node:path"
import { fileURLToPath } from "node:url"

const appRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  turbopack: {
    root: appRoot
  },
  typedRoutes: false,
  outputFileTracingIncludes: {
    "/api/downloads/propertyflow": ["./storage/propertyflow/*.zip"],
    "/api/downloads/propertyflow/entitlement": ["./storage/propertyflow/*.zip"]
  }
}

export default nextConfig

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
