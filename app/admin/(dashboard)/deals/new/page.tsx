import Link from "next/link"
import { DealForm } from "@/components/admin/deal-form"
import { ChevronLeft } from "lucide-react"

export default function NewDealPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/deals"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to specials
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight">Add Special</h1>
      </div>
      <DealForm />
    </div>
  )
}
