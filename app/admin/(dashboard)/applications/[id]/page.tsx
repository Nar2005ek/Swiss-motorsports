import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ApplicationStatusControl } from "@/components/admin/application-status-control"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Application } from "@/lib/types"
import { ChevronLeft } from "lucide-react"

export const dynamic = "force-dynamic"

function Row({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border py-2.5 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium sm:text-right">{value === null || value === undefined || value === "" ? "—" : value}</dd>
    </div>
  )
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("applications").select("*").eq("id", id).single()
  if (!data) notFound()
  const app = data as Application

  const money = (n: number | null) => (n === null ? null : formatCurrency(n))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            Back to applications
          </Link>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight">
            {app.first_name} {app.last_name}
          </h1>
          <p className="text-muted-foreground">Submitted {formatDate(app.created_at)}</p>
        </div>
        <ApplicationStatusControl id={app.id} status={app.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Deal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <Row label="Application Date" value={app.date ? formatDate(app.date) : null} />
              <Row label="Vehicle Type" value={app.vehicle_type} />
              <Row label="Interested Vehicle" value={app.interested_vehicle} />
              <Row label="Down Payment" value={money(app.down_payment)} />
              <Row label="Desired Monthly Payment" value={money(app.monthly_payment)} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <Row label="First Name" value={app.first_name} />
              <Row label="Last Name" value={app.last_name} />
              <Row label="Email" value={app.email} />
              <Row label="Phone" value={app.phone} />
              <Row label="Date of Birth" value={app.date_of_birth ? formatDate(app.date_of_birth) : null} />
              <Row label="SSN" value={app.ssn} />
              <Row label="Driver's License #" value={app.drivers_license_number} />
              <Row
                label="License Expiration"
                value={app.drivers_license_expiration_date ? formatDate(app.drivers_license_expiration_date) : null}
              />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <Row label="Country" value={app.country} />
              <Row label="Address Line 1" value={app.address_line_1} />
              <Row label="Address Line 2" value={app.address_line_2} />
              <Row label="City" value={app.city} />
              <Row label="State" value={app.state} />
              <Row label="ZIP Code" value={app.zip_code} />
              <Row label="Residence" value={app.residence} />
              <Row label="Time at Address" value={app.years_months_at_address} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Employment & Income</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <Row label="Employer" value={app.employer_name} />
              <Row label="Position" value={app.position} />
              <Row label="Employer Phone" value={app.employer_phone} />
              <Row label="Employer Country" value={app.employer_country} />
              <Row label="Employer Address 1" value={app.employer_address_line_1} />
              <Row label="Employer Address 2" value={app.employer_address_line_2} />
              <Row label="Employer City" value={app.employer_city} />
              <Row label="Employer State" value={app.employer_state} />
              <Row label="Employer ZIP" value={app.employer_zip_code} />
              <Row label="Time with Employer" value={app.years_months_with_employer} />
              <Row label="Monthly Gross Income" value={money(app.monthly_gross_income)} />
              <Row label="Additional Income" value={app.additional_source_of_income} />
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-4 text-sm text-muted-foreground">
          Consent to credit check: <span className="font-medium text-foreground">{app.consent_agreed ? "Agreed" : "Not agreed"}</span>
        </CardContent>
      </Card>
    </div>
  )
}
