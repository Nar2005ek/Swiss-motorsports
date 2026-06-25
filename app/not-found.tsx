import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-16">
      <section className="w-full max-w-xl rounded-xl border border-border bg-card p-8 text-center shadow-lg sm:p-12">
        <div className="mb-8 flex justify-center">
          <BrandLogo variant="light" />
        </div>
        <p className="text-sm tracking-[0.2em] text-muted-foreground">404</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-card-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          The page you are looking for does not exist or may have moved.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return to homepage</Link>
        </Button>
      </section>
    </main>
  )
}
