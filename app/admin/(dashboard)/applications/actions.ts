"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateApplicationStatus(id: string, status: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("applications").update({ status }).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/applications")
  revalidatePath(`/admin/applications/${id}`)
  return { success: true }
}

export async function deleteApplication(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("applications").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/applications")
  return { success: true }
}
