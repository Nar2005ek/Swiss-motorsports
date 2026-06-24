"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateApplicationStatus, deleteApplication } from "@/app/admin/(dashboard)/applications/actions"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { APPLICATION_STATUSES } from "@/lib/types"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function ApplicationStatusControl({ id, status }: { id: string; status: string }) {
  const router = useRouter()
  const [current, setCurrent] = useState(status)
  const [isPending, startTransition] = useTransition()
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleChange(next: string) {
    const prev = current
    setCurrent(next)
    startTransition(async () => {
      const result = await updateApplicationStatus(id, next)
      if (result?.error) {
        toast.error(result.error)
        setCurrent(prev)
        return
      }
      toast.success("Status updated")
      router.refresh()
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteApplication(id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Application deleted")
      router.push("/admin/applications")
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={current} onValueChange={(value) => value && handleChange(value)} disabled={isPending}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {APPLICATION_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" className="text-destructive" onClick={() => setConfirmOpen(true)}>
        <Trash2 className="size-4" />
        <span className="sr-only">Delete application</span>
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete application?</DialogTitle>
            <DialogDescription>This permanently removes the applicant&apos;s submitted information.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
