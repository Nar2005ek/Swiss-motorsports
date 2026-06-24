import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DealGallery } from "@/components/deal-gallery"
import { createClient } from "@/lib/supabase/server"
import { dealTitle, formatCurrency, formatNumber } from "@/lib/format"
import { siteConfig } from "@/lib/site"
import type { Deal } from "@/lib/types"

export const dynamic = "force-dynamic"

async function getDeal(id: string): Promise<Deal | null> {
  const supabase = await createClient()
  const { data } = await supabase.from("deals").select("*").eq("id", id).single()
  return (data as Deal) ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const deal = await getDeal(id)
  if (!deal) return { title: "Vehicle not found" }
  return {
    title: dealTitle(deal),
    description: deal.description ?? `Lease the ${dealTitle(deal)} at Swiss Motorsports.`,
  }
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const deal = await getDeal(id)
  if (!deal) notFound()

  const gallery = [deal.image_url, ...(deal.images ?? [])].filter(Boolean) as string[]

  const specs: { label: string; value: string }[] = [
    { label: "MSRP", value: formatCurrency(deal.msrp) },
    { label: "Down Payment", value: formatCurrency(deal.down_payment) },
    { label: "Lease Term", value: deal.lease_term ? `${deal.lease_term} months` : "—" },
    { label: "Miles / Year", value: formatNumber(deal.miles_per_year) },
    { label: "Exterior", value: deal.exterior_color ?? "—" },
    { label: "Interior", value: deal.interior_color ?? "—" },
    { label: "Stock #", value: deal.stock_number ?? "—" },
    { label: "VIN", value: deal.vin ?? "—" },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" className="mb-6 -ml-2 text-muted-foreground">
        <Link href="/specials">
          <ArrowLeft className="h-4 w-4" />
          Back to specials
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <DealGallery images={gallery} alt={dealTitle(deal)} />

          {deal.description ? (
            <div className="mt-8">
              <h2 className="font-serif text-xl font-semibold">Overview</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
                {deal.description}
              </p>
            </div>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h1 className="text-balance font-serif text-2xl font-bold leading-tight">
              {dealTitle(deal)}
            </h1>

            <div className="mt-5 rounded-lg bg-secondary/60 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Lease from</p>
                  <p className="font-serif text-4xl font-bold text-card-foreground">
                    {formatCurrency(deal.monthly_payment)}
                    <span className="ml-1 text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Due at signing</p>
                  <p className="font-semibold text-card-foreground">
                    {formatCurrency(deal.due_at_signing)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{spec.label}</p>
                  <p className="mt-0.5 break-words text-sm font-medium text-card-foreground">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col gap-3">
              <Button asChild size="lg">
                <Link href={`/apply?vehicle=${encodeURIComponent(dealTitle(deal))}`}>
                  Apply for This Vehicle
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent">
                <Link href={siteConfig.phoneHref}>
                  <Phone className="h-4 w-4" />
                  Call {siteConfig.phone}
                </Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
