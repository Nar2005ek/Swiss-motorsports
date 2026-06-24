import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { DealCard } from "@/components/deal-card"
import { PageHero } from "@/components/page-hero"
import { createClient } from "@/lib/supabase/server"
import type { Deal } from "@/lib/types"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Lease Specials",
  description:
    "Browse current luxury and exotic vehicle lease specials at Swiss Motorsports.",
}

async function getDeals(): Promise<Deal[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("deals")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
  return (data as Deal[]) ?? []
}

export default async function SpecialsPage() {
  const deals = await getDeals()

  return (
    <>
      <PageHero
        eyebrow="Inventory"
        title="Current Lease Specials"
        description="Explore our latest offers on luxury and exotic vehicles. Every special includes transparent monthly pricing and terms."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {deals.length > 0 ? (
          <>
            <p className="mb-8 text-sm text-muted-foreground">
              Showing {deals.length} {deals.length === 1 ? "special" : "specials"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-16 text-center">
            <h2 className="font-serif text-2xl font-semibold">No active specials right now</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              We&apos;re refreshing our inventory. Reach out and we&apos;ll help you find the perfect
              vehicle.
            </p>
            <Button asChild className="mt-6">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        )}
      </section>
    </>
  )
}
