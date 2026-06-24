"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

function num(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function str(value: FormDataEntryValue | null): string | null {
  if (value === null) return null
  const s = String(value).trim()
  return s === "" ? null : s
}

async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  return supabase
}

export async function saveDeal(formData: FormData) {
  const supabase = await requireAuth()

  const id = str(formData.get("id"))
  const images = (formData.getAll("images") as string[]).map((s) => s.trim()).filter(Boolean)

  const payload = {
    year: num(formData.get("year")),
    make: str(formData.get("make")) ?? "",
    model: str(formData.get("model")) ?? "",
    trim: str(formData.get("trim")),
    monthly_payment: num(formData.get("monthly_payment")),
    due_at_signing: num(formData.get("due_at_signing")),
    down_payment: num(formData.get("down_payment")),
    lease_term: num(formData.get("lease_term")),
    miles_per_year: num(formData.get("miles_per_year")),
    msrp: num(formData.get("msrp")),
    exterior_color: str(formData.get("exterior_color")),
    interior_color: str(formData.get("interior_color")),
    stock_number: str(formData.get("stock_number")),
    vin: str(formData.get("vin")),
    description: str(formData.get("description")),
    image_url: images[0] ?? null,
    images,
    status: str(formData.get("status")) ?? "active",
  }

  if (id) {
    const { error } = await supabase.from("deals").update(payload).eq("id", id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from("deals").insert(payload)
    if (error) return { error: error.message }
  }

  revalidatePath("/admin/deals")
  revalidatePath("/specials")
  revalidatePath("/")
  return { success: true }
}

export async function deleteDeal(id: string) {
  const supabase = await requireAuth()
  const { error } = await supabase.from("deals").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/deals")
  revalidatePath("/specials")
  revalidatePath("/")
  return { success: true }
}
