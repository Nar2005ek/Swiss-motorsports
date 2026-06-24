import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DealForm } from "@/components/admin/deal-form"
import type { Deal } from "@/lib/types"
import { ChevronLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function EditDealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("deals").select("*").eq("id", id).single()

  if (!data) notFound()
  const deal = data as Deal

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
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight">Edit Special</h1>
      </div>
      <DealForm deal={deal} />
    </div>
  )
}
