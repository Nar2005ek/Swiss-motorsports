import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site"

type AddressBlockProps = {
  className?: string
  linkClassName?: string
}

/** Clickable business address that opens Google Maps directions. */
export function AddressBlock({ className, linkClassName }: AddressBlockProps) {
  return (
    <a
      href={siteConfig.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-block transition-colors hover:text-accent",
        linkClassName,
      )}
    >
      <span className={cn("block", className)}>
        {siteConfig.address}
        <br />
        {siteConfig.cityStateZip}
        <br />
        {siteConfig.addressCountryLine}
      </span>
    </a>
  )
}
