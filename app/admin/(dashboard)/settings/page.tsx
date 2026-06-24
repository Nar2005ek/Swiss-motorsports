import type { Metadata } from "next"
import { ChangePasswordCard } from "@/components/admin/change-password-card"
import { StaffManager } from "@/components/admin/staff-manager"
import { listStaff } from "./actions"

export const metadata: Metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  const { users, currentUserId } = await listStaff()

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and dealership staff access.</p>
      </div>

      <ChangePasswordCard />
      <StaffManager users={users} currentUserId={currentUserId} />
    </div>
  )
}
