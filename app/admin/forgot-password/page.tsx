import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { ForgotPasswordForm } from "@/components/admin/forgot-password-form"

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sidebar px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <BrandLogo variant="light" />
        </div>
        <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
          <h1 className="font-serif text-2xl font-bold">Forgot password</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
          <div className="mt-6">
            <ForgotPasswordForm />
          </div>
        </div>
        <Link
          href="/admin/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
