import { Resend } from "resend"

const DEFAULT_TO = "swiss.motorsportss@gmail.com"

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "boolean") return value ? "Yes" : "No"
  return String(value)
}

export type ApplicationEmailPayload = {
  id: string
  created_at?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date?: string | null
  vehicle_type?: string | null
  interested_vehicle?: string | null
  down_payment?: number | null
  date_of_birth?: string | null
  ssn?: string | null
  country?: string | null
  address_line_1?: string | null
  address_line_2?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  residence?: string | null
  years_months_at_address?: string | null
  monthly_payment?: number | null
  drivers_license_number?: string | null
  drivers_license_expiration_date?: string | null
  employer_name?: string | null
  position?: string | null
  employer_phone?: string | null
  employer_country?: string | null
  employer_address_line_1?: string | null
  employer_address_line_2?: string | null
  employer_city?: string | null
  employer_state?: string | null
  employer_zip_code?: string | null
  years_months_with_employer?: string | null
  monthly_gross_income?: number | null
  additional_source_of_income?: string | null
  consent_agreed?: boolean
  hasDriversLicenseDoc?: boolean
  hasInsuranceCardDoc?: boolean
}

function buildSections(app: ApplicationEmailPayload) {
  return [
    {
      title: "Application",
      rows: [
        ["Application ID", app.id],
        ["Submitted", app.created_at ?? new Date().toISOString()],
        ["Application Date", app.date],
        ["Vehicle Type", app.vehicle_type],
        ["Interested Vehicle", app.interested_vehicle],
        ["Down Payment", app.down_payment],
      ],
    },
    {
      title: "Applicant",
      rows: [
        ["Name", `${app.first_name} ${app.last_name}`.trim()],
        ["Email", app.email],
        ["Phone", app.phone],
        ["Date of Birth", app.date_of_birth],
        ["SSN", app.ssn],
        ["Driver's License #", app.drivers_license_number],
        ["License Expiration", app.drivers_license_expiration_date],
      ],
    },
    {
      title: "Address",
      rows: [
        ["Country", app.country],
        ["Address Line 1", app.address_line_1],
        ["Address Line 2", app.address_line_2],
        ["City", app.city],
        ["State", app.state],
        ["ZIP", app.zip_code],
        ["Residence", app.residence],
        ["Time at Address", app.years_months_at_address],
        ["Monthly Housing Payment", app.monthly_payment],
      ],
    },
    {
      title: "Employment & Income",
      rows: [
        ["Employer", app.employer_name],
        ["Position", app.position],
        ["Employer Phone", app.employer_phone],
        ["Employer Country", app.employer_country],
        ["Employer Address 1", app.employer_address_line_1],
        ["Employer Address 2", app.employer_address_line_2],
        ["Employer City", app.employer_city],
        ["Employer State", app.employer_state],
        ["Employer ZIP", app.employer_zip_code],
        ["Time with Employer", app.years_months_with_employer],
        ["Monthly Gross Income", app.monthly_gross_income],
        ["Additional Income", app.additional_source_of_income],
      ],
    },
    {
      title: "Documents",
      rows: [
        [
          "Driver's License Upload",
          app.hasDriversLicenseDoc
            ? "Uploaded — view in admin dashboard"
            : "Not provided",
        ],
        [
          "Insurance Card Upload",
          app.hasInsuranceCardDoc
            ? "Uploaded — view in admin dashboard"
            : "Not provided",
        ],
        ["Consent Agreed", app.consent_agreed],
      ],
    },
  ] as const
}

function buildHtml(app: ApplicationEmailPayload): string {
  const sections = buildSections(app)
  const body = sections
    .map((section) => {
      const rows = section.rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:500;">${escapeHtml(formatValue(value))}</td></tr>`,
        )
        .join("")
      return `<h2 style="font-size:16px;margin:24px 0 8px;">${escapeHtml(section.title)}</h2><table style="width:100%;border-collapse:collapse;">${rows}</table>`
    })
    .join("")

  return `<!DOCTYPE html><html><body style="font-family:Georgia,serif;color:#111;line-height:1.5;max-width:640px;margin:0 auto;padding:24px;">
    <h1 style="font-size:22px;margin:0 0 8px;">New Credit Application</h1>
    <p style="margin:0 0 16px;color:#555;">${escapeHtml(app.first_name)} ${escapeHtml(app.last_name)}</p>
    ${body}
    <p style="margin-top:28px;font-size:13px;color:#777;">Documents are stored privately. Open the authenticated admin dashboard to view uploads securely.</p>
  </body></html>`
}

function buildText(app: ApplicationEmailPayload): string {
  const sections = buildSections(app)
  return sections
    .map((section) => {
      const rows = section.rows
        .map(([label, value]) => `${label}: ${formatValue(value)}`)
        .join("\n")
      return `${section.title}\n${rows}`
    })
    .join("\n\n")
}

/**
 * Sends a credit-application notification. Never throws for delivery failures —
 * callers should keep the saved application regardless of email outcome.
 */
export async function sendApplicationNotificationEmail(
  app: ApplicationEmailPayload,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not configured")
    return { ok: false, error: "Email provider not configured" }
  }

  const to = process.env.CREDIT_APPLICATION_NOTIFICATION_EMAIL || DEFAULT_TO
  const from =
    process.env.CREDIT_APPLICATION_FROM_EMAIL ||
    "Swiss Motorsports <onboarding@resend.dev>"
  const applicantName = `${app.first_name} ${app.last_name}`.trim() || "Applicant"

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: app.email,
      subject: `New Credit Application — ${applicantName}`,
      html: buildHtml(app),
      text: buildText(app),
    })

    if (error) {
      console.error("[email] Resend delivery failed:", error.message ?? error)
      return { ok: false, error: "Email delivery failed" }
    }

    return { ok: true }
  } catch (err) {
    console.error(
      "[email] Unexpected error sending application notification:",
      err instanceof Error ? err.message : "unknown",
    )
    return { ok: false, error: "Email delivery failed" }
  }
}
