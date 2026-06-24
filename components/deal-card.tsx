import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Gauge } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Deal } from "@/lib/types"
import { dealTitle, formatCurrency, formatNumber } from "@/lib/format"

export function DealCard({ deal }: { deal: Deal }) {
  const cover = deal.image_url || deal.images?.[0] || "/showroom.png"

  return (
    <Link href={`/specials/${deal.id}`} className="group block">
      <Card className="overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
          <Image
            src={cover || "/placeholder.svg"}
            alt={dealTitle(deal)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {deal.lease_term ? (
            <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
              {deal.lease_term} mo lease
            </Badge>
          ) : null}
        </div>

        <div className="p-5">
          <h3 className="font-serif text-lg font-semibold leading-tight text-card-foreground">
            {dealTitle(deal)}
          </h3>
          {deal.exterior_color ? (
            <p className="mt-1 text-sm text-muted-foreground">{deal.exterior_color}</p>
          ) : null}

          <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Per month</p>
              <p className="font-serif text-2xl font-bold text-card-foreground">
                {formatCurrency(deal.monthly_payment)}
                <span className="ml-1 text-sm font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Due at signing</p>
              <p className="text-sm font-semibold text-card-foreground">
                {formatCurrency(deal.due_at_signing)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="h-3.5 w-3.5" />
              {formatNumber(deal.miles_per_year)} mi/yr
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-accent">
              View details
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
