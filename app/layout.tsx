import type React from "react"
import type { Metadata } from "next"
import { Inter, Special_Elite } from "next/font/google"
import "./globals.css"

// Load the Inter font for general text
const inter = Inter({ subsets: ["latin"] })

// Load Special Elite - a Google Font that resembles a typewriter font
const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
})

export const metadata: Metadata = {
  title: "SongBid - Discover New Acoustic Artists",
  description: "Discover original acoustic music from undiscovered artists, verified by video",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${specialElite.variable}`}>
      <head>
        {/* Add Safari-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* Add viewport meta tag to ensure proper scaling */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
