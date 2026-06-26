export const dynamic = "force-dynamic"

import "./globals.css"
import { getSiteSettings } from "@/lib/db"
import { SITE_NAME, SITE_URL } from "@/lib/seo"

const schemaMarkup = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      name: SITE_NAME,
      description: "Agent immobilier de prestige à Oran, Algérie. Spécialisé dans l'achat, la vente, l'investissement et la commercialisation de promotions immobilières.",
      url: SITE_URL,
      telephone: "+213541029014",
      address: { "@type": "PostalAddress", addressLocality: "Oran", addressCountry: "DZ" },
      areaServed: { "@type": "City", name: "Oran" },
      slogan: "Owning Wahran",
    },
    {
      "@type": "LocalBusiness",
      name: "CHABANO Properties",
      url: SITE_URL,
      telephone: "+213541029014",
      address: { "@type": "PostalAddress", addressLocality: "Oran", addressCountry: "DZ" },
      openingHours: "Sa-Th 09:00-21:00",
      priceRange: "$$",
    },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null)
  const ga4Id = settings?.ga4_measurement_id?.trim()
  const gscCode = settings?.gsc_verification_code?.trim()

  return (
    <html lang="fr">
      <head>
        {/* Business Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
        {/* Google Search Console verification */}
        {gscCode && <meta name="google-site-verification" content={gscCode.replace(/^google-site-verification=/, "")} />}
        {/* Google Analytics 4 */}
        {ga4Id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');` }} />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
