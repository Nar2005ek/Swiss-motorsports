import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { DealsTable } from "@/components/admin/deals-table"
import { Button } from "@/components/ui/button"
import type { Deal } from "@/lib/types"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDealsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("deals").select("*").order("created_at", { ascending: false })
  const deals = (data ?? []) as Deal[]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Specials</h1>
          <p className="text-muted-foreground">Manage your lease and finance offers.</p>
        </div>
        <Button asChild>
          <Link href="/admin/deals/new">
            <Plus className="size-4" />
            Add Special
          </Link>
        </Button>
      </div>
      <DealsTable deals={deals} />
    </div>
  )
}
