import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Chabano Properties — Immobilier à Oran",
  description: "Agent immobilier à Oran, Algérie. Achat, vente, investissement.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
