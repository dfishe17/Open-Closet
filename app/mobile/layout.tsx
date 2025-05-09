import type React from "react"
import { Cinzel, Alegreya, Playfair_Display, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { MobileNavigation } from "@/components/mobile/mobile-navigation"
import { RegisterServiceWorker } from "@/app/register-sw"

import "../globals.css"
import "../animated-cards.css"

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

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${alegreya.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} pb-16`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <RegisterServiceWorker />
          <main className="pb-16">{children}</main>
          <MobileNavigation />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
