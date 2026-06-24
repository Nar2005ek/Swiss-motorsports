import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { LoginForm } from "@/components/admin/login-form"

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sidebar px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <BrandLogo variant="light" />
        </div>
        <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
          <h1 className="font-serif text-2xl font-bold">Admin Sign In</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to manage deals and applications.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>
      </div>
    </div>
  )
}
