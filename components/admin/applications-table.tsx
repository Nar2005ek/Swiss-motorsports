"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate } from "@/lib/format"
import { APPLICATION_STATUSES, type Application } from "@/lib/types"
import { Search } from "lucide-react"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  New: "default",
  "In Review": "outline",
  Approved: "secondary",
  Declined: "secondary",
  Funded: "outline",
}

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      const haystack =
        `${app.first_name} ${app.last_name} ${app.email} ${app.phone} ${app.interested_vehicle ?? ""}`.toLowerCase()
      const matchesQuery = haystack.includes(query.toLowerCase())
      return matchesStatus && matchesQuery
    })
  }, [applications, query, statusFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or vehicle"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-10 pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
          <SelectTrigger className="min-h-10 sm:w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {APPLICATION_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          No applications match your filters.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((app) => (
              <Link
                key={app.id}
                href={`/admin/applications/${app.id}`}
                className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {app.first_name} {app.last_name}
                    </p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">{app.email}</p>
                    <p className="truncate text-sm text-muted-foreground">{app.phone}</p>
                    <p className="mt-2 truncate text-sm">
                      {app.interested_vehicle || app.vehicle_type || "—"}
                    </p>
                  </div>
                  <Badge variant={statusVariant[app.status] ?? "secondary"}>{app.status}</Badge>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{formatDate(app.created_at)}</p>
              </Link>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-muted/40">
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Applicant</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Contact</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Vehicle</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Submitted</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="hover:text-accent"
                      >
                        {app.first_name} {app.last_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div>{app.email}</div>
                      <div>{app.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      {app.interested_vehicle || app.vehicle_type || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[app.status] ?? "secondary"}>
                        {app.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
