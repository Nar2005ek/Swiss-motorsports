export type Deal = {
  id: string
  created_at: string
  year: number | null
  make: string
  model: string
  trim: string | null
  monthly_payment: number | null
  due_at_signing: number | null
  down_payment: number | null
  lease_term: number | null
  miles_per_year: number | null
  msrp: number | null
  exterior_color: string | null
  interior_color: string | null
  stock_number: string | null
  vin: string | null
  description: string | null
  image_url: string | null
  images: string[]
  status: string
  /** Lower values appear first on public lease specials. */
  sort_order?: number | null
}

export const APPLICATION_STATUSES = [
  "New",
  "In Review",
  "Approved",
  "Declined",
  "Funded",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export type Application = {
  id: string
  created_at: string
  date: string | null
  vehicle_type: string | null
  down_payment: number | null
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string | null
  ssn: string | null
  country: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  drivers_license_number: string | null
  drivers_license_expiration_date: string | null
  residence: string | null
  years_months_at_address: string | null
  monthly_payment: number | null
  employer_name: string | null
  position: string | null
  employer_phone: string | null
  employer_country: string | null
  employer_address_line_1: string | null
  employer_address_line_2: string | null
  employer_city: string | null
  employer_state: string | null
  employer_zip_code: string | null
  years_months_with_employer: string | null
  monthly_gross_income: number | null
  additional_source_of_income: string | null
  interested_vehicle: string | null
  consent_agreed: boolean
  status: string
  /** Private storage path for driver's license upload (optional). */
  drivers_license_path: string | null
  /** Private storage path for insurance card upload (optional). */
  insurance_card_path: string | null
  /** Client-generated idempotency key to prevent duplicate submissions. */
  submission_id: string | null
}
