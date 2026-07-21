"use server"

import { headers } from "next/headers"
import { createServiceClient } from "@/lib/supabase/admin"
import {
  uploadApplicationDocument,
  validateDocumentFile,
} from "@/lib/application-documents"
import { sendApplicationNotificationEmail } from "@/lib/email/application-notification"

export type ApplyState = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

function str(form: FormData, key: string): string | null {
  const v = form.get(key)
  if (typeof v !== "string") return null
  const trimmed = v.trim()
  return trimmed.length ? trimmed : null
}

function num(form: FormData, key: string): number | null {
  const v = str(form, key)
  if (v === null) return null
  const cleaned = Number(v.replace(/[^0-9.-]/g, ""))
  return Number.isFinite(cleaned) ? cleaned : null
}

/** Simple in-memory rate limit: 5 submissions / IP / 15 minutes. */
const rateBuckets = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const max = 5
  const recent = (rateBuckets.get(ip) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= max) {
    rateBuckets.set(ip, recent)
    return false
  }
  recent.push(now)
  rateBuckets.set(ip, recent)
  return true
}

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const hdrs = await headers()
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown"

  if (!checkRateLimit(ip)) {
    return {
      success: false,
      message: "Too many submissions. Please wait a few minutes and try again.",
    }
  }

  const errors: Record<string, string> = {}

  const requiredKeys = [
    "date",
    "vehicle_type",
    "interested_vehicle",
    "down_payment",
    "first_name",
    "last_name",
    "email",
    "phone",
    "date_of_birth",
    "ssn",
    "country",
    "residence",
    "address_line_1",
    "city",
    "state",
    "zip_code",
    "drivers_license_number",
    "drivers_license_expiration_date",
    "years_months_at_address",
    "monthly_payment",
    "employer_name",
    "position",
    "employer_phone",
    "employer_country",
    "employer_address_line_1",
    "employer_city",
    "employer_state",
    "employer_zip_code",
    "years_months_with_employer",
    "monthly_gross_income",
  ] as const

  for (const key of requiredKeys) {
    if (!str(formData, key)) errors[key] = "This field is required."
  }

  const email = str(formData, "email")
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errors.email = "Please enter a valid email address."
  }

  const consent = formData.get("consent_agreed") === "on"
  if (!consent) {
    errors.consent_agreed = "You must agree before submitting."
  }

  const submissionId = str(formData, "submission_id")
  if (!submissionId || submissionId.length < 16) {
    errors.submission_id = "Please refresh the page and try again."
  }

  const licenseFileRaw = formData.get("drivers_license_file")
  const insuranceFileRaw = formData.get("insurance_card_file")
  const licenseFile = licenseFileRaw instanceof File ? licenseFileRaw : null
  const insuranceFile = insuranceFileRaw instanceof File ? insuranceFileRaw : null

  const licenseCheck = validateDocumentFile(licenseFile, "Driver's license")
  if (!licenseCheck.ok) errors.drivers_license_file = licenseCheck.error

  const insuranceCheck = validateDocumentFile(insuranceFile, "Insurance card")
  if (!insuranceCheck.ok) errors.insurance_card_file = insuranceCheck.error

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors,
    }
  }

  const payload = {
    date: str(formData, "date"),
    vehicle_type: str(formData, "vehicle_type"),
    interested_vehicle: str(formData, "interested_vehicle"),
    down_payment: num(formData, "down_payment"),
    first_name: str(formData, "first_name")!,
    last_name: str(formData, "last_name")!,
    email: email!,
    phone: str(formData, "phone")!,
    date_of_birth: str(formData, "date_of_birth"),
    ssn: str(formData, "ssn"),
    country: str(formData, "country"),
    address_line_1: str(formData, "address_line_1"),
    address_line_2: str(formData, "address_line_2"),
    city: str(formData, "city"),
    state: str(formData, "state"),
    zip_code: str(formData, "zip_code"),
    drivers_license_number: str(formData, "drivers_license_number"),
    drivers_license_expiration_date: str(formData, "drivers_license_expiration_date"),
    residence: str(formData, "residence"),
    years_months_at_address: str(formData, "years_months_at_address"),
    monthly_payment: num(formData, "monthly_payment"),
    employer_name: str(formData, "employer_name"),
    position: str(formData, "position"),
    employer_phone: str(formData, "employer_phone"),
    employer_country: str(formData, "employer_country"),
    employer_address_line_1: str(formData, "employer_address_line_1"),
    employer_address_line_2: str(formData, "employer_address_line_2"),
    employer_city: str(formData, "employer_city"),
    employer_state: str(formData, "employer_state"),
    employer_zip_code: str(formData, "employer_zip_code"),
    years_months_with_employer: str(formData, "years_months_with_employer"),
    monthly_gross_income: num(formData, "monthly_gross_income"),
    additional_source_of_income: str(formData, "additional_source_of_income"),
    consent_agreed: consent,
    status: "New",
    submission_id: submissionId,
    drivers_license_path: null as string | null,
    insurance_card_path: null as string | null,
  }

  const supabase = createServiceClient()

  // Idempotency: if this submission_id already exists, treat as success.
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("submission_id", submissionId!)
    .maybeSingle()

  if (existing?.id) {
    return {
      success: true,
      message:
        "Your application has already been received. Our finance team will be in touch shortly.",
    }
  }

  const { data: inserted, error } = await supabase
    .from("applications")
    .insert(payload)
    .select("id, created_at")
    .single()

  if (error) {
    // Unique violation on submission_id → duplicate submit
    if (error.code === "23505") {
      return {
        success: true,
        message:
          "Your application has already been received. Our finance team will be in touch shortly.",
      }
    }
    console.error("[apply] Insert failed:", error.message)
    return {
      success: false,
      message: "Something went wrong submitting your application. Please try again.",
    }
  }

  const applicationId = inserted.id as string
  let driversLicensePath: string | null = null
  let insuranceCardPath: string | null = null

  if (licenseCheck.ok && "file" in licenseCheck) {
    const uploaded = await uploadApplicationDocument(
      supabase,
      applicationId,
      "drivers_license",
      licenseCheck.file,
      licenseCheck.ext,
    )
    if ("path" in uploaded) {
      driversLicensePath = uploaded.path
    } else {
      console.error("[apply] License upload failed after save")
    }
  }

  if (insuranceCheck.ok && "file" in insuranceCheck) {
    const uploaded = await uploadApplicationDocument(
      supabase,
      applicationId,
      "insurance_card",
      insuranceCheck.file,
      insuranceCheck.ext,
    )
    if ("path" in uploaded) {
      insuranceCardPath = uploaded.path
    } else {
      console.error("[apply] Insurance upload failed after save")
    }
  }

  if (driversLicensePath || insuranceCardPath) {
    const { error: updateError } = await supabase
      .from("applications")
      .update({
        drivers_license_path: driversLicensePath,
        insurance_card_path: insuranceCardPath,
      })
      .eq("id", applicationId)

    if (updateError) {
      console.error("[apply] Could not save document paths:", updateError.message)
    }
  }

  // Email after successful save — never roll back the application on failure.
  const emailResult = await sendApplicationNotificationEmail({
    ...payload,
    id: applicationId,
    created_at: inserted.created_at,
    hasDriversLicenseDoc: Boolean(driversLicensePath),
    hasInsuranceCardDoc: Boolean(insuranceCardPath),
  })

  if (!emailResult.ok) {
    console.error("[apply] Application saved but notification email failed")
  }

  return {
    success: true,
    message:
      "Your application has been submitted successfully. Our finance team will review it and contact you shortly — typically within one business day.",
  }
}
