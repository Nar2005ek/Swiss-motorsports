"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateOwnPassword } from "@/app/admin/(dashboard)/settings/actions"

export function ChangePasswordCard() {
  const [isPending, startTransition] = useTransition()
  const [formKey, setFormKey] = useState(0)

  function action(formData: FormData) {
    startTransition(async () => {
      const res = await updateOwnPassword(formData)
      if (res.ok) {
        toast.success(res.message ?? "Password updated.")
        setFormKey((k) => k + 1)
      } else {
        toast.error(res.error ?? "Could not update password.")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Update the password for your own account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form key={formKey} action={action} className="grid max-w-sm gap-4">
          <div className="grid gap-2">
            <Label htmlFor="new_password">New password</Label>
            <Input
              id="new_password"
              name="new_password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm_password">Confirm new password</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <Button type="submit" disabled={isPending} className="justify-self-start">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Update password
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
