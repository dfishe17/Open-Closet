import type React from "react"
import { Cinzel, Alegreya, Playfair_Display, Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { HeaderNav } from "@/components/header-nav"
import { CSPToggle } from "@/components/csp-toggle"

import "./globals.css"
import "./animated-cards.css"
import "./scrollbar-hide.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
})

const alegreya = Alegreya({
  subsets: ["latin"],
  variable: "--font-alegreya",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "OpenCloset - Rent Designer Clothes",
  description: "Rent designer clothes for any occasion. Access premium fashion without the commitment.",
  manifest: "/manifest.json",
  themeColor: "#f8f5f0",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OpenCloset",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${alegreya.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Add font stylesheets directly instead of using @import in CSS */}
        <link href="https://fonts.googleapis.com/css2?family=Cinzel&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <HeaderNav />
          <main>{children}</main>
          <Toaster />
          {process.env.NODE_ENV !== "production" && <CSPToggle />}
        </ThemeProvider>
      </body>
    </html>
  )
}
