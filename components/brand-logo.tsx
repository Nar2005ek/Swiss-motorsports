import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function BrandLogo({
  className,
  variant = "dark",
  size = "default",
}: {
  className?: string
  variant?: "dark" | "light"
  size?: "default" | "lg"
}) {
  const isLg = size === "lg"
  return (
    <Link href="/" className={cn("flex items-center", className)} aria-label="Swiss Motorsports home">
      <Image
        src="/swiss-logo-full.png"
        alt="Swiss Motorsports"
        width={520}
        height={300}
        className={cn(
          "w-auto object-contain",
          isLg ? "h-28" : "h-16",
          variant === "light" ? "invert mix-blend-screen" : "mix-blend-multiply",
        )}
        priority
      />
    </Link>
  )
}
