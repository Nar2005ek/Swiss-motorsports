"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/admin"
import {
  APPLICATION_DOCUMENTS_BUCKET,
  createSignedDocumentUrl,
} from "@/lib/application-documents"

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

  const { data: app } = await supabase
    .from("applications")
    .select("drivers_license_path, insurance_card_path")
    .eq("id", id)
    .maybeSingle()

  const { error } = await supabase.from("applications").delete().eq("id", id)
  if (error) return { error: error.message }

  const paths = [app?.drivers_license_path, app?.insurance_card_path].filter(
    (p): p is string => Boolean(p),
  )
  if (paths.length > 0) {
    const admin = createServiceClient()
    await admin.storage.from(APPLICATION_DOCUMENTS_BUCKET).remove(paths)
  }

  revalidatePath("/admin/applications")
  return { success: true }
}

export async function getApplicationDocumentUrl(
  applicationId: string,
  kind: "drivers_license" | "insurance_card",
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const column = kind === "drivers_license" ? "drivers_license_path" : "insurance_card_path"
  const { data: app, error } = await supabase
    .from("applications")
    .select("drivers_license_path, insurance_card_path")
    .eq("id", applicationId)
    .single()

  if (error || !app) return { error: "Application not found" }

  const path =
    kind === "drivers_license" ? app.drivers_license_path : app.insurance_card_path
  if (!path) return { error: "Document not uploaded" }

  let result = await createSignedDocumentUrl(supabase, path, 120)
  if ("error" in result) {
    const admin = createServiceClient()
    result = await createSignedDocumentUrl(admin, path, 120)
  }

  return result
}
