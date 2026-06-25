"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { BrandLogo } from "@/components/brand-logo"
import { mainNav, siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

const GOLD = "#B8860B"

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-[#ECECEC] bg-white/95 backdrop-blur-md transition-shadow duration-300",
        scrolled && "shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-6 transition-all duration-300 sm:px-8 lg:px-12",
          scrolled ? "h-[72px]" : "h-[88px]",
        )}
      >
        {/* Left: logo */}
        <div className="flex justify-start">
          <BrandLogo
            imgClassName={cn("transition-all duration-300", scrolled ? "h-12" : "h-16")}
          />
        </div>

        {/* Center: nav links */}
        <nav className="hidden items-center justify-center gap-10 lg:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-[15px] font-medium tracking-[0.01em] text-foreground/80 transition-colors duration-200"
                style={active ? { color: GOLD } : undefined}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = ""
                }}
              >
                {item.title}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-[1.5px] transition-all duration-300 ease-out",
                    active ? "w-full" : "w-0 group-hover:w-full",
                  )}
                  style={{ backgroundColor: GOLD }}
                />
              </Link>
            )
          })}
        </nav>

        {/* Right: phone (desktop) + hamburger (mobile) */}
        <div className="flex items-center justify-end">
          <Link
            href={siteConfig.phoneHref}
            className="hidden items-center gap-2 text-[15px] font-medium tracking-[0.01em] text-foreground/80 transition-colors duration-200 lg:flex"
            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            <Phone className="h-[18px] w-[18px]" />
            {siteConfig.phone}
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="lg:hidden"
              render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent
              side="top"
              className="flex h-[100dvh] flex-col bg-white data-[side=top]:h-[100dvh]"
              showCloseButton
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex items-center px-2 pt-2">
                <BrandLogo imgClassName="h-14" />
              </div>

              <nav className="flex flex-1 flex-col items-center justify-center gap-8">
                {mainNav.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="font-serif text-2xl font-medium tracking-wide transition-colors"
                      style={{ color: active ? GOLD : undefined }}
                    >
                      {item.title}
                    </Link>
                  )
                })}
              </nav>

              <div className="flex items-center justify-center border-t border-[#ECECEC] py-8">
                <Link
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-2 text-base font-medium text-foreground/90"
                >
                  <Phone className="h-5 w-5" style={{ color: GOLD }} />
                  {siteConfig.phone}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
