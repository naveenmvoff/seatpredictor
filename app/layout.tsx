import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import "./globals.css"

export const figtree = Figtree({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree"
})

export const metadata: Metadata = {
  title: "DOC Tutorials - Seat Predictor",
  description: "Medical college seat predictor for NEET PG",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${figtree.className}`}>{children}</body>
    </html>
  )
}
