"use server"

import { createServiceClient } from "@/lib/supabase/admin"

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

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const errors: Record<string, string> = {}

  // Every field is required except Additional Source of Income and the
  // conventionally-optional Address Line 2 fields.
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

  const required = {
    first_name: str(formData, "first_name"),
    last_name: str(formData, "last_name"),
    email,
    phone: str(formData, "phone"),
  }

  const consent = formData.get("consent_agreed") === "on"
  if (!consent) {
    errors.consent_agreed = "You must agree before submitting."
  }

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
    first_name: required.first_name,
    last_name: required.last_name,
    email: required.email,
    phone: required.phone,
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
  }

  // Use the service-role client so the public can submit without an auth
  // session, while RLS still blocks all direct anon access to this table.
  const supabase = createServiceClient()
  const { error } = await supabase.from("applications").insert(payload)

  if (error) {
    return {
      success: false,
      message: "Something went wrong submitting your application. Please try again.",
    }
  }

  return {
    success: true,
    message: "Your application has been submitted. Our finance team will be in touch shortly.",
  }
}
