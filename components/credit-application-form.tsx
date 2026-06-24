"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { CheckCircle2, Loader2, Lock } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { submitApplication, type ApplyState } from "@/app/(site)/apply/actions"

const initialState: ApplyState = { success: false, message: "" }

function Section({
  step,
  title,
  description,
  children,
}: {
  step: number
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 font-serif text-sm font-bold text-accent">
          {step}
        </span>
        <div>
          <h2 className="font-serif text-xl font-semibold">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  )
}

function Field({
  label,
  name,
  error,
  required,
  className,
  children,
}: {
  label: string
  name: string
  error?: string
  required?: boolean
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Submitting…
        </>
      ) : (
        "Submit Application"
      )}
    </Button>
  )
}

export function CreditApplicationForm({ defaultVehicle }: { defaultVehicle?: string }) {
  const [state, formAction] = useActionState(submitApplication, initialState)
  const errors = state.errors ?? {}

  useEffect(() => {
    if (state.message && !state.success && !state.errors) {
      toast.error(state.message)
    }
    if (!state.success && state.errors) {
      toast.error(state.message)
    }
  }, [state])

  if (state.success) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-5 font-serif text-2xl font-bold">Application received</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{state.message}</p>
        <Button asChild className="mt-7">
          <a href="/specials">Browse Lease Specials</a>
        </Button>
      </div>
    )
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <form action={formAction} className="grid gap-6">
      <Section step={1} title="Application Details" description="Tell us what you're looking for.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Application Date" name="date">
            <Input id="date" name="date" type="date" defaultValue={today} />
          </Field>
          <Field label="Vehicle Type" name="vehicle_type">
            <Select name="vehicle_type">
              <SelectTrigger id="vehicle_type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lease">Lease</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Purchase">Purchase</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Vehicle of Interest" name="interested_vehicle" className="sm:col-span-2">
            <Input
              id="interested_vehicle"
              name="interested_vehicle"
              placeholder="e.g. 2024 Porsche 911 Carrera"
              defaultValue={defaultVehicle}
            />
          </Field>
          <Field label="Desired Down Payment (USD)" name="down_payment">
            <Input id="down_payment" name="down_payment" inputMode="numeric" placeholder="$5,000" />
          </Field>
        </div>
      </Section>

      <Section step={2} title="Personal Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First Name" name="first_name" required error={errors.first_name}>
            <Input id="first_name" name="first_name" autoComplete="given-name" />
          </Field>
          <Field label="Last Name" name="last_name" required error={errors.last_name}>
            <Input id="last_name" name="last_name" autoComplete="family-name" />
          </Field>
          <Field label="Email" name="email" required error={errors.email}>
            <Input id="email" name="email" type="email" autoComplete="email" />
          </Field>
          <Field label="Phone" name="phone" required error={errors.phone}>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" />
          </Field>
          <Field label="Date of Birth" name="date_of_birth">
            <Input id="date_of_birth" name="date_of_birth" type="date" />
          </Field>
          <Field label="Social Security Number" name="ssn">
            <Input id="ssn" name="ssn" placeholder="•••-••-••••" autoComplete="off" />
          </Field>
        </div>
      </Section>

      <Section step={3} title="Residence">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Country" name="country">
            <Input id="country" name="country" defaultValue="United States" autoComplete="country-name" />
          </Field>
          <Field label="Housing Status" name="residence">
            <Select name="residence">
              <SelectTrigger id="residence">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Own">Own</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Address Line 1" name="address_line_1" className="sm:col-span-2">
            <Input id="address_line_1" name="address_line_1" autoComplete="address-line1" />
          </Field>
          <Field label="Address Line 2" name="address_line_2" className="sm:col-span-2">
            <Input id="address_line_2" name="address_line_2" autoComplete="address-line2" />
          </Field>
          <Field label="City" name="city">
            <Input id="city" name="city" autoComplete="address-level2" />
          </Field>
          <Field label="State" name="state">
            <Input id="state" name="state" autoComplete="address-level1" />
          </Field>
          <Field label="Zip Code" name="zip_code">
            <Input id="zip_code" name="zip_code" autoComplete="postal-code" />
          </Field>
          <Field label="Time at Address" name="years_months_at_address">
            <Input id="years_months_at_address" name="years_months_at_address" placeholder="e.g. 3 yrs 4 mos" />
          </Field>
          <Field label="Monthly Housing Payment (USD)" name="monthly_payment">
            <Input id="monthly_payment" name="monthly_payment" inputMode="numeric" placeholder="$2,500" />
          </Field>
        </div>
      </Section>

      <Section step={4} title="Driver's License">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="License Number" name="drivers_license_number">
            <Input id="drivers_license_number" name="drivers_license_number" />
          </Field>
          <Field label="License Expiration Date" name="drivers_license_expiration_date">
            <Input
              id="drivers_license_expiration_date"
              name="drivers_license_expiration_date"
              type="date"
            />
          </Field>
        </div>
      </Section>

      <Section step={5} title="Employment & Income">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Employer Name" name="employer_name">
            <Input id="employer_name" name="employer_name" autoComplete="organization" />
          </Field>
          <Field label="Position / Title" name="position">
            <Input id="position" name="position" autoComplete="organization-title" />
          </Field>
          <Field label="Employer Phone" name="employer_phone">
            <Input id="employer_phone" name="employer_phone" type="tel" />
          </Field>
          <Field label="Employer Country" name="employer_country">
            <Input id="employer_country" name="employer_country" defaultValue="United States" />
          </Field>
          <Field label="Employer Address Line 1" name="employer_address_line_1" className="sm:col-span-2">
            <Input id="employer_address_line_1" name="employer_address_line_1" />
          </Field>
          <Field label="Employer Address Line 2" name="employer_address_line_2" className="sm:col-span-2">
            <Input id="employer_address_line_2" name="employer_address_line_2" />
          </Field>
          <Field label="Employer City" name="employer_city">
            <Input id="employer_city" name="employer_city" />
          </Field>
          <Field label="Employer State" name="employer_state">
            <Input id="employer_state" name="employer_state" />
          </Field>
          <Field label="Employer Zip Code" name="employer_zip_code">
            <Input id="employer_zip_code" name="employer_zip_code" />
          </Field>
          <Field label="Time with Employer" name="years_months_with_employer">
            <Input
              id="years_months_with_employer"
              name="years_months_with_employer"
              placeholder="e.g. 5 yrs 2 mos"
            />
          </Field>
          <Field label="Monthly Gross Income (USD)" name="monthly_gross_income">
            <Input id="monthly_gross_income" name="monthly_gross_income" inputMode="numeric" placeholder="$12,000" />
          </Field>
          <Field
            label="Additional Source of Income"
            name="additional_source_of_income"
            className="sm:col-span-2"
          >
            <Textarea
              id="additional_source_of_income"
              name="additional_source_of_income"
              rows={3}
              placeholder="Describe any additional income (optional)"
            />
          </Field>
        </div>
      </Section>

      <Section step={6} title="Consent & Authorization">
        <div className="flex items-start gap-3 rounded-lg bg-secondary/60 p-4">
          <Checkbox id="consent_agreed" name="consent_agreed" className="mt-0.5" />
          <Label htmlFor="consent_agreed" className="text-sm font-normal leading-relaxed text-muted-foreground">
            I certify that the information provided is true and complete, and I authorize Swiss
            Motorsports and its financing partners to obtain my credit report and verify the
            information in this application.
            <span className="ml-0.5 text-destructive">*</span>
          </Label>
        </div>
        {errors.consent_agreed ? (
          <p className="text-xs text-destructive">{errors.consent_agreed}</p>
        ) : null}
      </Section>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Your information is transmitted securely and kept confidential.
        </p>
        <SubmitButton />
      </div>
    </form>
  )
}
