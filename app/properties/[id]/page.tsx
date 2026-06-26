import type { Metadata } from "next"
import { getProperty } from "@/lib/db"
import { buildMetadata, absoluteUrl, SITE_NAME } from "@/lib/seo"
import { PropertyDetailClient } from "@/components/property-detail-client"

function parsePrice(price: string): number | undefined {
  const digits = price.replace(/[^\d]/g, "")
  return digits ? Number(digits) : undefined
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const property = await getProperty(params.id)
  if (!property) {
    return buildMetadata({
      path: `/properties/${params.id}`,
      fallbackTitle: "Bien introuvable | CHABANO",
      fallbackDescription: "Ce bien n'existe pas ou n'est plus disponible.",
      noindex: true,
    })
  }
  const fallbackDesc = property.description?.slice(0, 155) ||
    `${property.type} ${property.surface ? `de ${property.surface}` : ""} à vendre à ${property.location}, ${property.price}. ${property.residence_name || ""}`.trim()

  return buildMetadata({
    path: `/properties/${property.id}`,
    fallbackTitle: `${property.title} — ${property.location} | ${property.price} | CHABANO`,
    fallbackDescription: fallbackDesc,
    seoTitle: property.seo_title,
    metaDescription: property.meta_description,
    ogTitle: property.og_title,
    ogDescription: property.og_description,
    ogImage: property.og_image || property.images?.[0],
    canonicalUrl: property.canonical_url,
  })
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id)

  const price = property ? parsePrice(property.price) : undefined
  const schema = property ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: property.description || `${property.type} à ${property.location}`,
    image: (property.images || []).map((img) => absoluteUrl(img)),
    brand: { "@type": "Organization", name: SITE_NAME },
    category: "Real Estate",
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/properties/${property.id}`),
      ...(price ? { price, priceCurrency: "DZD" } : {}),
      availability: property.status === "available"
        ? "https://schema.org/InStock"
        : property.status === "reserved"
          ? "https://schema.org/LimitedAvailability"
          : "https://schema.org/SoldOut",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
    address: { "@type": "PostalAddress", addressLocality: property.location, addressCountry: "DZ" },
  } : null

  return (
    <>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      <PropertyDetailClient />
    </>
  )
}
