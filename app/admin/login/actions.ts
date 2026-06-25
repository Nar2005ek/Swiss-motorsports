"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type SignInState = { error?: string } | null

export async function signIn(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const message = error.message.toLowerCase()
    if (message.includes("email not confirmed")) {
      return { error: "Please confirm your email before signing in." }
    }
    if (message.includes("invalid login credentials")) {
      return { error: "Invalid email or password." }
    }
    return { error: error.message }
  }

  revalidatePath("/admin", "layout")
  redirect("/admin")
}
