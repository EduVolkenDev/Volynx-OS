import type { Metadata } from "next"
import { LegalPage } from "@/components/common/legal-page"
import { legalPages } from "@/content/legal-pages"

export const metadata: Metadata = {
  title: "Support - VolynxOS",
  description: legalPages.support.description
}

export default function SupportPage() {
  return <LegalPage page={legalPages.support} />
}
