import type { Metadata } from "next"
import { BrandLogo } from "@/components/brand-logo"
import { ResetPasswordForm } from "@/components/admin/reset-password-form"

export const metadata: Metadata = {
  title: "Set New Password",
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sidebar px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <BrandLogo variant="light" />
        </div>
        <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
          <h1 className="font-serif text-2xl font-bold">Set a new password</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Choose a new password for your account.</p>
          <div className="mt-6">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}
