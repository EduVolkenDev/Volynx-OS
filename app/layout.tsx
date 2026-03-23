import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VOLYNX System V2",
  description: "Premium landing system for developers, agencies and SaaS products."
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
