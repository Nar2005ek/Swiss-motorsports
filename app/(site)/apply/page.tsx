import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import { CreditApplicationForm } from "@/components/credit-application-form"

export const metadata: Metadata = {
  title: "Apply for Credit",
  description:
    "Apply for vehicle financing or leasing online with Swiss Motorsports — any make or model. Secure and confidential.",
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicle?: string }>
}) {
  const { vehicle } = await searchParams

  return (
    <>
      <PageHero
        eyebrow="Financing"
        title="Apply for Credit"
        description="Complete the secure application below and our finance team will follow up with personalized lease and finance options."
      />
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <CreditApplicationForm defaultVehicle={vehicle} />
      </section>
    </>
  )
}
