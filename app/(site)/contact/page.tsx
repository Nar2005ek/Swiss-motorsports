import Link from "next/link"
import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/page-hero"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Swiss Motorsports. Visit our showroom, call, or email our luxury vehicle specialists.",
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="We're here to help"
        description="Reach out to our team with any questions about our inventory, leasing, or financing. We'd be delighted to assist."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <ContactItem icon={MapPin} title="Visit Us">
              {siteConfig.address}
              <br />
              {siteConfig.cityStateZip}
            </ContactItem>

            <ContactItem icon={Phone} title="Call Us">
              <Link href={siteConfig.phoneHref} className="hover:text-accent">
                {siteConfig.phone}
              </Link>
            </ContactItem>

            <ContactItem icon={Mail} title="Email Us">
              <Link href={siteConfig.emailHref} className="hover:text-accent">
                {siteConfig.email}
              </Link>
            </ContactItem>

            <ContactItem icon={Clock} title="Showroom Hours">
              <ul className="space-y-1">
                {siteConfig.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-6">
                    <span>{h.day}</span>
                    <span className="font-medium text-foreground">{h.time}</span>
                  </li>
                ))}
              </ul>
            </ContactItem>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-8">
            <div>
              <h2 className="font-serif text-2xl font-bold">Ready to move forward?</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                The fastest way to get started is to submit a secure credit application. Our
                finance team will review it and reach out with personalized options — typically
                within one business day.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg">
                <Link href="/apply">Apply for Credit</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent">
                <Link href="/specials">Browse Lease Specials</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function ContactItem({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground">
        <h3 className="font-serif text-base font-semibold text-card-foreground">{title}</h3>
        <div className="mt-1.5">{children}</div>
      </div>
    </div>
  )
}
