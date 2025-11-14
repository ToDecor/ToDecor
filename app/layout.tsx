import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Lora } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const lora = Lora({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "ToDecor - Revêtements de Sol et Mur Haut de Gamme",
  description:
    "ToDecor : Vente et installation de parquet, moquette, vinyle, carrelage et papier peint haut de gamme en Tunisie",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" style={{ "--font-serif": playfairDisplay.style.fontFamily, "--font-sans": lora.style.fontFamily } as React.CSSProperties}>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
