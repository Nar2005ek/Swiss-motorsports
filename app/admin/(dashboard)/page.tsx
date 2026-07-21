import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatRelativeDate, vehicleTitle } from "@/lib/format"
import type { Application, Deal } from "@/lib/types"
import { Car, FileText, Plus, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [{ data: deals }, { data: applications }] = await Promise.all([
    supabase
      .from("deals")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase.from("applications").select("*").order("created_at", { ascending: false }),
  ])

  const dealList = (deals ?? []) as Deal[]
  const appList = (applications ?? []) as Application[]

  const activeDeals = dealList.filter((d) => d.status === "active").length
  const newApps = appList.filter((a) => a.status === "New").length
  const recentApps = appList.slice(0, 5)

  const stats = [
    { label: "Active Specials", value: activeDeals, icon: Car, href: "/admin/deals" },
    { label: "Total Applications", value: appList.length, icon: FileText, href: "/admin/applications" },
    { label: "New Applications", value: newApps, icon: TrendingUp, href: "/admin/applications" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your inventory and finance applications.</p>
        </div>
        <Button asChild>
          <Link href="/admin/deals/new">
            <Plus className="size-4" />
            Add Special
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:border-accent">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex size-12 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground">
                  <stat.icon className="size-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-xl">Recent Applications</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/applications">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentApps.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No applications yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentApps.map((app) => (
                <li key={app.id}>
                  <Link
                    href={`/admin/applications/${app.id}`}
                    className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-accent"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {app.first_name} {app.last_name}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {app.interested_vehicle || app.vehicle_type || "General inquiry"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge variant={app.status === "New" ? "default" : "secondary"}>{app.status}</Badge>
                      <span className="hidden text-sm text-muted-foreground sm:inline">
                        {formatRelativeDate(app.created_at)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-xl">Current Specials</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/deals">Manage</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {dealList.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No specials yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {dealList.slice(0, 5).map((deal) => (
                <li key={deal.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="truncate font-medium">{vehicleTitle(deal)}</span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {deal.monthly_payment ? `${formatCurrency(deal.monthly_payment)}/mo` : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
