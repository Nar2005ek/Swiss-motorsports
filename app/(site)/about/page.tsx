import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Award, HeartHandshake, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/page-hero"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Swiss Motorsports — a full-service dealership for all makes and models, built on precision, transparency, and white-glove service.",
}

const stats = [
  // { value: "15+", label: "Years of experience" },
  // { value: "2,500+", label: "Vehicles delivered" },
  // { value: "98%", label: "Client satisfaction" },
]

const values = [
  {
    icon: Award,
    title: "Uncompromising Quality",
    description:
      "Every vehicle we offer — any make or model — is inspected to exacting standards.",
  },
  {
    icon: HeartHandshake,
    title: "Relationships First",
    description:
      "Our clients return because we treat every transaction as the start of a long-term relationship.",
  },
  {
    icon: Timer,
    title: "Effortless Process",
    description:
      "From online credit applications to doorstep delivery, we make car buying accessible and simple.",
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Precision, passion, and the pursuit of the perfect drive"
        description="Swiss Motorsports is a full-service dealership dedicated to connecting every client with the right vehicle — any make, any model."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
            <Image src="/showroom.png" alt="Swiss Motorsports showroom" fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold">Built for those who expect more</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Founded on a love for automotive engineering and an obsession with service,
                Swiss Motorsports has become a trusted name for leasing and financing across
                all makes and models. We believe acquiring your next vehicle should be as
                rewarding as driving it.
              </p>
              <p>
                Our specialists combine deep market knowledge with genuine care, guiding you to
                the right vehicle and the right terms — without pressure, and without the
                friction of traditional dealerships.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-3xl font-bold text-accent">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="max-w-xl text-balance font-serif text-3xl font-bold">
          Let&apos;s find your next vehicle
        </h2>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Browse our current specials or apply for credit to get started today.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/specials">
              View Lease Specials
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent">
            <Link href="/apply">Apply for Credit</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
