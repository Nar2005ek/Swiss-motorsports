import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function BrandLogo({
  className,
  variant = "dark",
  size = "default",
  showWordmark = false,
  imgClassName,
}: {
  className?: string
  variant?: "dark" | "light"
  size?: "default" | "lg"
  showWordmark?: boolean
  imgClassName?: string
}) {
  const isLg = size === "lg"
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3", className)}
      aria-label="Swiss Motorsports home"
    >
      <Image
        src="/swiss-logo-full.png"
        alt="Swiss Motorsports"
        width={520}
        height={300}
        className={cn(
          "w-auto object-contain",
          isLg ? "h-28" : "h-16",
          variant === "light" ? "invert mix-blend-screen" : "mix-blend-multiply",
          imgClassName,
        )}
        priority
      />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-serif font-bold tracking-wide",
              isLg ? "text-3xl" : "text-2xl",
              variant === "light" ? "text-background" : "text-foreground",
            )}
          >
            SWISS
          </span>
          <span
            className={cn(
              "font-medium uppercase tracking-[0.3em]",
              isLg ? "text-sm" : "text-xs",
              variant === "light" ? "text-background/70" : "text-muted-foreground",
            )}
          >
            Motorsports
          </span>
        </span>
      )}
    </Link>
  )
}
