import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { siteConfig } from "@/lib/site"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Swiss Motorsports | Luxury Car Brokerage in California",
    template: "%s | Swiss Motorsports",
  },
  description:
    "Swiss Motorsports is a luxury automotive brokerage specializing in BMW, Mercedes-Benz, Porsche, Audi, Lexus, Toyota, and other premium vehicles. We help customers lease, finance, and purchase vehicles throughout California.",
  keywords: [
    "Swiss Motorsports",
    "luxury cars",
    "car brokerage",
    "California",
    "BMW lease",
    "Mercedes lease",
    "Porsche",
    "Lexus",
    "Toyota",
    "Audi",
    "financing",
    "auto broker",
    "Los Angeles",
    "Glendale",
  ],
  authors: [{ name: "Swiss Motorsports" }],
  creator: "Swiss Motorsports",
  publisher: "Swiss Motorsports",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: siteConfig.siteUrl,
    title: "Swiss Motorsports | Luxury Car Brokerage in California",
    description:
      "Swiss Motorsports is a luxury automotive brokerage specializing in BMW, Mercedes-Benz, Porsche, Audi, Lexus, Toyota, and other premium vehicles. We help customers lease, finance, and purchase vehicles throughout California.",
    siteName: "Swiss Motorsports",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 1200,
        alt: "Swiss Motorsports logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swiss Motorsports | Luxury Car Brokerage in California",
    description:
      "Swiss Motorsports is a luxury automotive brokerage specializing in BMW, Mercedes-Benz, Porsche, Audi, Lexus, Toyota, and other premium vehicles. We help customers lease, finance, and purchase vehicles throughout California.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1a1a1a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    additionalType: "https://schema.org/AutomotiveBusiness",
    name: "Swiss Motorsports",
    description:
      "Swiss Motorsports is a luxury automotive brokerage helping customers lease, finance, and purchase premium vehicles across California.",
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/icon.png`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    sameAs: [siteConfig.instagram],
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`light ${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
    >
      <body className="bg-background font-sans antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
