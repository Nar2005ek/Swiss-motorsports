import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { mainNav, siteConfig } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <BrandLogo variant="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sidebar-foreground/70">
            Swiss Motorsports is your destination for vehicle leasing, financing, and
            sales across all makes and models. White-glove service, transparent terms, and
            a vehicle for every driver.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-base font-semibold text-sidebar-foreground">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sidebar-foreground/70 transition-colors hover:text-sidebar-primary"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-base font-semibold text-sidebar-foreground">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-sidebar-foreground/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
              <span>
                {siteConfig.address}
                <br />
                {siteConfig.cityStateZip}
              </span>
            </li>
            <li>
              <Link href={siteConfig.phoneHref} className="flex items-center gap-3 hover:text-sidebar-primary">
                <Phone className="h-4 w-4 shrink-0 text-sidebar-primary" />
                {siteConfig.phone}
              </Link>
            </li>
            <li>
              <Link href={siteConfig.emailHref} className="flex items-center gap-3 hover:text-sidebar-primary">
                <Mail className="h-4 w-4 shrink-0 text-sidebar-primary" />
                {siteConfig.email}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sidebar-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-sidebar-foreground/50 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Swiss Motorsports. All rights reserved.</p>
          <p>Auto Leasing • Financing • Sales • All Makes &amp; Models</p>
        </div>
      </div>
    </footer>
  )
}
