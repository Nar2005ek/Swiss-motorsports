"use client"

import { useState, useTransition } from "react"
import { Loader2, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/format"
import { inviteStaff, removeStaff } from "@/app/admin/(dashboard)/settings/actions"

type StaffUser = {
  id: string
  email: string
  createdAt: string
  lastSignInAt: string | null
}

export function StaffManager({
  users,
  currentUserId,
}: {
  users: StaffUser[]
  currentUserId: string | null
}) {
  const [isPending, startTransition] = useTransition()
  const [inviteKey, setInviteKey] = useState(0)
  const [pendingRemoval, setPendingRemoval] = useState<StaffUser | null>(null)

  function handleInvite(formData: FormData) {
    startTransition(async () => {
      const res = await inviteStaff(formData)
      if (res.ok) {
        toast.success(res.message ?? "Staff member added.")
        setInviteKey((k) => k + 1)
      } else {
        toast.error(res.error ?? "Could not add staff member.")
      }
    })
  }

  function handleRemove(user: StaffUser) {
    startTransition(async () => {
      const res = await removeStaff(user.id)
      if (res.ok) {
        toast.success(res.message ?? "Removed.")
      } else {
        toast.error(res.error ?? "Could not remove staff member.")
      }
      setPendingRemoval(null)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff accounts</CardTitle>
        <CardDescription>
          People with access to this admin dashboard. Anyone added here can sign in immediately.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form key={inviteKey} action={handleInvite} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@swissmotorsports.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Initial password</Label>
            <Input
              id="password"
              name="password"
              type="text"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Add staff
          </Button>
        </form>

        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Last sign-in</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.email}
                    {user.id === currentUserId ? (
                      <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastSignInAt ? formatDate(user.lastSignInAt) : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={user.id === currentUserId || isPending}
                      onClick={() => setPendingRemoval(user)}
                      aria-label={`Remove ${user.email}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={!!pendingRemoval} onOpenChange={(open) => !open && setPendingRemoval(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove staff member?</DialogTitle>
            <DialogDescription>
              {pendingRemoval?.email} will immediately lose access to the admin dashboard. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              }
            />
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => pendingRemoval && handleRemove(pendingRemoval)}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
