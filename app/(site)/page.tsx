import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BadgeCheck, Car, KeyRound, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DealCard } from "@/components/deal-card"
import { createClient } from "@/lib/supabase/server"
import type { Deal } from "@/lib/types"

export const dynamic = "force-dynamic"

async function getFeaturedDeals(): Promise<Deal[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("deals")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(3)
  return (data as Deal[]) ?? []
}

const features = [
  {
    icon: Car,
    title: "Curated Inventory",
    description: "Hand-selected luxury and exotic vehicles from the world's most coveted marques.",
  },
  {
    icon: BadgeCheck,
    title: "Transparent Terms",
    description: "Clear, competitive lease and finance offers with no hidden fees or surprises.",
  },
  {
    icon: ShieldCheck,
    title: "White-Glove Service",
    description: "A dedicated specialist guides you from selection to delivery and beyond.",
  },
  {
    icon: KeyRound,
    title: "Fast Approvals",
    description: "Apply online in minutes and get a quick decision from our finance team.",
  },
]

export default async function HomePage() {
  const deals = await getFeaturedDeals()

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-sidebar text-sidebar-foreground">
        <Image
          src="/hero-supercar.png"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/70 to-sidebar/30" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
          <span className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.25em] text-sidebar-primary">
            <Sparkles className="h-4 w-4" />
            Luxury &amp; Exotic Auto Leasing
          </span>
          <h1 className="mt-5 max-w-3xl text-balance font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Drive the extraordinary. Lease with confidence.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-sidebar-foreground/75 sm:text-lg">
            Swiss Motorsports brings you an exclusive selection of premium vehicles with
            tailored lease and finance solutions. Find your next car and apply for credit
            entirely online.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/specials">
                View Lease Specials
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Link href="/apply">Apply for Credit</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured specials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Featured</p>
            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Current Lease Specials</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              A glimpse of what&apos;s on offer. New specials are added regularly.
            </p>
          </div>
          <Button asChild variant="ghost" className="text-accent hover:text-accent">
            <Link href="/specials">
              View all specials
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {deals.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-dashed border-border bg-secondary/40 p-12 text-center">
            <p className="font-serif text-lg font-medium">New specials arriving soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Our latest lease offers are being prepared. Check back shortly or contact us directly.
            </p>
            <Button asChild className="mt-6">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Why choose us */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">The Swiss Motorsports Standard</h2>
            <p className="mt-3 text-muted-foreground">
              Every detail is designed around an effortless, premium ownership experience.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-sidebar text-sidebar-foreground">
        <Image src="/keys-handover.png" alt="" fill className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-sidebar/70" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="max-w-2xl text-balance font-serif text-3xl font-bold sm:text-4xl">
            Ready to get behind the wheel?
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-sidebar-foreground/75">
            Start your secure credit application now. It only takes a few minutes, and there&apos;s
            no obligation.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/apply">
              Apply for Credit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
