"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteDeal } from "@/app/admin/(dashboard)/deals/actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency, vehicleTitle } from "@/lib/format"
import type { Deal } from "@/lib/types"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  hidden: "outline",
  sold: "secondary",
}

export function DealsTable({ deals }: { deals: Deal[] }) {
  const router = useRouter()
  const [target, setTarget] = useState<Deal | null>(null)
  const [isPending, startTransition] = useTransition()

  function confirmDelete() {
    if (!target) return
    startTransition(async () => {
      const result = await deleteDeal(target.id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Special deleted")
      setTarget(null)
      router.refresh()
    })
  }

  if (deals.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-muted-foreground">No specials yet. Create your first one.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/deals/new">Add Special</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Stock #</TableHead>
              <TableHead>Monthly</TableHead>
              <TableHead>Due at Signing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell className="font-medium">{vehicleTitle(deal)}</TableCell>
                <TableCell className="text-muted-foreground">{deal.stock_number ?? "—"}</TableCell>
                <TableCell>{deal.monthly_payment ? `${formatCurrency(deal.monthly_payment)}/mo` : "—"}</TableCell>
                <TableCell>{deal.due_at_signing ? formatCurrency(deal.due_at_signing) : "—"}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[deal.status] ?? "secondary"} className="capitalize">
                    {deal.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild size="icon" variant="ghost" className="size-8">
                      <Link href={`/admin/deals/${deal.id}`}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => setTarget(deal)}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!target} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete special?</DialogTitle>
            <DialogDescription>
              {target ? `"${vehicleTitle(target)}" will be permanently removed.` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
