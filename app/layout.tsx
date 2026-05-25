export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CHABANO — Owning Wahran | Immobilier de Prestige à Oran",
  description: "Agent immobilier à Oran, Algérie. Achat, vente, investissement et commercialisation de promotions immobilières. Chabane Chawki — Owning Wahran.",
  openGraph: {
    title: "CHABANO — Owning Wahran",
    description: "L'expert immobilier de prestige à Oran, Algérie.",
    type: "website",
    locale: "fr_DZ",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const schemaMarkup = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "name": "CHABANO — Owning Wahran",
      "description": "Agent immobilier de prestige à Oran, Algérie. Spécialisé dans l'achat, la vente, l'investissement et la commercialisation de promotions immobilières.",
      "url": "https://updated-real-estate.vercel.app",
      "telephone": "+213541029014",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Oran",
        "addressCountry": "DZ"
      },
      "areaServed": {
        "@type": "City",
        "name": "Oran"
      },
      "slogan": "Owning Wahran"
    },
    {
      "@type": "LocalBusiness",
      "name": "CHABANO Properties",
      "description": "Agence immobilière à Oran, Algérie.",
      "url": "https://updated-real-estate.vercel.app",
      "telephone": "+213541029014",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Oran",
        "addressCountry": "DZ"
      },
      "openingHours": "Sa-Th 09:00-21:00",
      "priceRange": "$$"
    }
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
