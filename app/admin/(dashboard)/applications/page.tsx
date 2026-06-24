import { createClient } from "@/lib/supabase/server"
import { ApplicationsTable } from "@/components/admin/applications-table"
import type { Application } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function AdminApplicationsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false })
  const applications = (data ?? []) as Application[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">
          {applications.length} finance {applications.length === 1 ? "application" : "applications"} received.
        </p>
      </div>
      <ApplicationsTable applications={applications} />
    </div>
  )
}
