"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate } from "@/lib/format"
import { APPLICATION_STATUSES, type Application } from "@/lib/types"
import { Search } from "lucide-react"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  New: "default",
  "In Review": "outline",
  Approved: "secondary",
  Declined: "secondary",
  Contacted: "outline",
}

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      const haystack = `${app.first_name} ${app.last_name} ${app.email} ${app.phone} ${app.interested_vehicle ?? ""}`.toLowerCase()
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
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
          <SelectTrigger className="sm:w-48">
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
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Vehicle</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((app) => (
                <TableRow key={app.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <Link href={`/admin/applications/${app.id}`} className="block hover:text-accent">
                      {app.first_name} {app.last_name}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    <div>{app.email}</div>
                    <div>{app.phone}</div>
                  </TableCell>
                  <TableCell className="hidden text-sm lg:table-cell">
                    {app.interested_vehicle || app.vehicle_type || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(app.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[app.status] ?? "secondary"}>{app.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
