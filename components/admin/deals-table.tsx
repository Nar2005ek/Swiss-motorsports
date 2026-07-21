"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { deleteDeal, reorderDeals } from "@/app/admin/(dashboard)/deals/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  hidden: "outline",
  sold: "secondary",
}

function sortDeals(deals: Deal[]) {
  return [...deals].sort((a, b) => {
    const ao = a.sort_order ?? Number.MAX_SAFE_INTEGER
    const bo = b.sort_order ?? Number.MAX_SAFE_INTEGER
    if (ao !== bo) return ao - bo
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

export function DealsTable({ deals }: { deals: Deal[] }) {
  const router = useRouter()
  const [items, setItems] = useState(() => sortDeals(deals))
  const [target, setTarget] = useState<Deal | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dirty, setDirty] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isSavingOrder, startSaveOrder] = useTransition()

  useEffect(() => {
    setItems(sortDeals(deals))
    setDirty(false)
  }, [deals])

  function move(index: number, direction: -1 | 1) {
    const next = index + direction
    if (next < 0 || next >= items.length) return
    setItems((prev) => {
      const copy = [...prev]
      const tmp = copy[index]
      copy[index] = copy[next]
      copy[next] = tmp
      return copy
    })
    setDirty(true)
  }

  function onDragStart(index: number) {
    if (isSavingOrder) return
    setDragIndex(index)
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index || isSavingOrder) return
    setItems((prev) => {
      const copy = [...prev]
      const [removed] = copy.splice(dragIndex, 1)
      copy.splice(index, 0, removed)
      return copy
    })
    setDragIndex(index)
    setDirty(true)
  }

  function onDragEnd() {
    setDragIndex(null)
  }

  function saveOrder() {
    startSaveOrder(async () => {
      const result = await reorderDeals(items.map((d) => d.id))
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Order saved")
      setDirty(false)
      router.refresh()
    })
  }

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

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-muted-foreground">No specials yet. Create your first one.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/deals/new">Add Special</Link>
        </Button>
      </div>
    )
  }

  const busy = isPending || isSavingOrder

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Drag to reorder, or use Move Up / Move Down. Save when ready.
        </p>
        <Button onClick={saveOrder} disabled={!dirty || busy} className="min-h-10 w-full sm:w-auto">
          {isSavingOrder ? <Loader2 className="size-4 animate-spin" /> : null}
          Save order
        </Button>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {items.map((deal, index) => (
          <div
            key={deal.id}
            className={cn(
              "rounded-lg border border-border bg-card p-4",
              dragIndex === index && "opacity-70",
              busy && "pointer-events-none opacity-60",
            )}
            draggable={!busy}
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                className="mt-1 touch-none text-muted-foreground"
                aria-label="Drag to reorder"
                onClick={(e) => e.preventDefault()}
              >
                <GripVertical className="size-5" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-snug">{vehicleTitle(deal)}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {deal.stock_number ? `Stock ${deal.stock_number} · ` : ""}
                  {deal.monthly_payment
                    ? `${formatCurrency(deal.monthly_payment)}/mo`
                    : "No monthly set"}
                </p>
                <Badge
                  variant={statusVariant[deal.status] ?? "secondary"}
                  className="mt-2 capitalize"
                >
                  {deal.status}
                </Badge>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="min-h-10"
                disabled={busy || index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp className="size-4" />
                Up
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="min-h-10"
                disabled={busy || index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown className="size-4" />
                Down
              </Button>
              <Button asChild size="sm" variant="outline" className="min-h-10">
                <Link href={`/admin/deals/${deal.id}`}>
                  <Pencil className="size-4" />
                  Edit
                </Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="min-h-10 text-destructive hover:text-destructive"
                onClick={() => setTarget(deal)}
                disabled={busy}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/40">
            <tr className="border-b border-border text-left">
              <th className="w-10 px-3 py-3 font-medium text-muted-foreground" />
              <th className="px-3 py-3 font-medium text-muted-foreground">Order</th>
              <th className="px-3 py-3 font-medium text-muted-foreground">Vehicle</th>
              <th className="px-3 py-3 font-medium text-muted-foreground">Stock #</th>
              <th className="px-3 py-3 font-medium text-muted-foreground">Monthly</th>
              <th className="px-3 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-3 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((deal, index) => (
              <tr
                key={deal.id}
                className={cn(
                  "border-b border-border last:border-0",
                  dragIndex === index && "bg-muted/30",
                  busy && "opacity-60",
                )}
                draggable={!busy}
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
              >
                <td className="px-3 py-3 text-muted-foreground">
                  <GripVertical className="size-4 cursor-grab active:cursor-grabbing" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <span className="w-6 text-muted-foreground">{index + 1}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      disabled={busy || index === 0}
                      onClick={() => move(index, -1)}
                      aria-label="Move up"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      disabled={busy || index === items.length - 1}
                      onClick={() => move(index, 1)}
                      aria-label="Move down"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                  </div>
                </td>
                <td className="px-3 py-3 font-medium">{vehicleTitle(deal)}</td>
                <td className="px-3 py-3 text-muted-foreground">{deal.stock_number ?? "—"}</td>
                <td className="px-3 py-3">
                  {deal.monthly_payment ? `${formatCurrency(deal.monthly_payment)}/mo` : "—"}
                </td>
                <td className="px-3 py-3">
                  <Badge variant={statusVariant[deal.status] ?? "secondary"} className="capitalize">
                    {deal.status}
                  </Badge>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild size="icon" variant="ghost" className="size-9">
                      <Link href={`/admin/deals/${deal.id}`}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-9 text-destructive hover:text-destructive"
                      onClick={() => setTarget(deal)}
                      disabled={busy}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!target} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete special?</DialogTitle>
            <DialogDescription>
              {target ? `"${vehicleTitle(target)}" will be permanently removed.` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setTarget(null)} className="min-h-10 w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isPending}
              className="min-h-10 w-full sm:w-auto"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
