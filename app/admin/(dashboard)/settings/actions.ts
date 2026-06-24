"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/admin"

type ActionResult = { ok: boolean; error?: string; message?: string }

/** Update the currently signed-in admin's password. */
export async function updateOwnPassword(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Not authenticated." }

  const newPassword = String(formData.get("new_password") ?? "")
  const confirm = String(formData.get("confirm_password") ?? "")

  if (newPassword.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." }
  }
  if (newPassword !== confirm) {
    return { ok: false, error: "Passwords do not match." }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { ok: false, error: error.message }

  return { ok: true, message: "Password updated successfully." }
}

/** List all staff (admin) accounts. */
export async function listStaff() {
  // Ensure caller is authenticated before exposing the user list.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { users: [], currentUserId: null }

  const admin = createServiceClient()
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
  if (error) return { users: [], currentUserId: user.id }

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    createdAt: u.created_at,
    lastSignInAt: u.last_sign_in_at ?? null,
  }))

  return { users, currentUserId: user.id }
}

/** Create a new staff (admin) account with an initial password. */
export async function inviteStaff(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Not authenticated." }

  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." }
  }
  if (password.length < 8) {
    return { ok: false, error: "Initial password must be at least 8 characters." }
  }

  const admin = createServiceClient()
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "admin" },
  })
  if (error) return { ok: false, error: error.message }

  revalidatePath("/admin/settings")
  return { ok: true, message: `${email} can now sign in.` }
}

/** Remove a staff (admin) account. */
export async function removeStaff(userId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Not authenticated." }
  if (user.id === userId) {
    return { ok: false, error: "You cannot remove your own account." }
  }

  const admin = createServiceClient()
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return { ok: false, error: error.message }

  revalidatePath("/admin/settings")
  return { ok: true, message: "Staff member removed." }
}
