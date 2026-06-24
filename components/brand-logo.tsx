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
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label="Swiss Motorsports home">
      <Image
        src="/swiss-logo.png"
        alt="Swiss Motorsports"
        width={112}
        height={112}
        className={cn(
          "object-contain",
          isLg ? "h-24 w-24" : "h-16 w-16",
          variant === "light" && "invert",
        )}
        priority
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif font-bold tracking-wide",
            isLg ? "text-4xl" : "text-2xl",
            variant === "light" ? "text-background" : "text-foreground",
          )}
        >
          SWISS
        </span>
        <span
          className={cn(
            "font-medium uppercase tracking-[0.3em]",
            isLg ? "text-xs" : "text-[0.7rem]",
            variant === "light" ? "text-background/70" : "text-muted-foreground",
          )}
        >
          Motorsports
        </span>
      </span>
    </Link>
  )
}
