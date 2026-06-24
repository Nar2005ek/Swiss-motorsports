import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function BrandLogo({
  className,
  variant = "dark",
}: {
  className?: string
  variant?: "dark" | "light"
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label="Swiss Motorsports home">
      <Image
        src="/swiss-logo.png"
        alt="Swiss Motorsports"
        width={56}
        height={56}
        className={cn("h-11 w-11 object-contain", variant === "light" && "invert")}
        priority
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-lg font-bold tracking-wide",
            variant === "light" ? "text-background" : "text-foreground",
          )}
        >
          SWISS
        </span>
        <span
          className={cn(
            "text-[0.6rem] font-medium uppercase tracking-[0.3em]",
            variant === "light" ? "text-background/70" : "text-muted-foreground",
          )}
        >
          Motorsports
        </span>
      </span>
    </Link>
  )
}
