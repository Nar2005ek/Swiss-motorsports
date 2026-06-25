import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
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
  title: {
    default: "Swiss Motorsports | Auto Leasing for All Makes & Models",
    template: "%s | Swiss Motorsports",
  },
  description:
    "Swiss Motorsports offers vehicle leasing, financing, and sales for all makes and models. Explore our lease specials and apply for credit online.",
  icons: {
    icon: "/swiss-logo.png",
    apple: "/swiss-logo.png",
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
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`light ${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
    >
      <body className="bg-background font-sans antialiased" suppressHydrationWarning>
        {children}
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
