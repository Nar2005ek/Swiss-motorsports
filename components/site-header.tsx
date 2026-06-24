"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { BrandLogo } from "@/components/brand-logo"
import { mainNav, siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-accent",
                  active ? "text-accent" : "text-foreground/80",
                )}
              >
                {item.title}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={siteConfig.phoneHref}
            className="flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
          >
            <Phone className="h-4 w-4" />
            {siteConfig.phone}
          </Link>
          <Button asChild>
            <Link href="/apply">Apply for Credit</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="mt-4 px-2">
              <BrandLogo />
            </div>
            <nav className="mt-8 flex flex-col gap-1 px-2">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:bg-secondary",
                    pathname === item.href ? "text-accent" : "text-foreground/90",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-3 px-2">
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/apply">Apply for Credit</Link>
              </Button>
              <Link
                href={siteConfig.phoneHref}
                className="flex items-center justify-center gap-2 text-sm font-medium text-foreground/80"
              >
                <Phone className="h-4 w-4" />
                {siteConfig.phone}
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
