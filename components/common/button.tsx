import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type ButtonProps = {
  href?: string
  variant?: "primary" | "secondary"
  children: React.ReactNode
  className?: string
}

export function Button({ href = "#", variant = "primary", children, className }: ButtonProps) {
  const styles = variant === "primary" ? "button-primary" : "button-secondary"
  const external = href.startsWith("http")

  return (
    <Link href={href} className={cn(styles, className)} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
      <span>{children}</span>
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  )
}
