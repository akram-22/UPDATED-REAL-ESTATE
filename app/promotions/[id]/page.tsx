import type { Metadata } from "next"
import { getPromotion } from "@/lib/db"
import { buildMetadata, absoluteUrl, SITE_NAME } from "@/lib/seo"
import { PromotionDetailClient } from "@/components/promotion-detail-client"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const promo = await getPromotion(params.id)
  if (!promo) {
    return buildMetadata({
      path: `/promotions/${params.id}`,
      fallbackTitle: "Projet introuvable | CHABANO",
      fallbackDescription: "Ce projet immobilier n'existe pas ou n'est plus disponible.",
      noindex: true,
    })
  }
  const fallbackDesc = promo.description?.slice(0, 155) ||
    `Projet immobilier ${promo.title} à ${promo.location}${promo.developer ? ` par ${promo.developer}` : ""}.`

  return buildMetadata({
    path: `/promotions/${promo.id}`,
    fallbackTitle: `${promo.title} — ${promo.location} | CHABANO`,
    fallbackDescription: fallbackDesc,
    seoTitle: promo.seo_title,
    metaDescription: promo.meta_description,
    ogTitle: promo.og_title,
    ogDescription: promo.og_description,
    ogImage: promo.og_image || promo.images?.[0],
    canonicalUrl: promo.canonical_url,
  })
}

export default async function PromotionPage({ params }: { params: { id: string } }) {
  const promo = await getPromotion(params.id)

  const schema = promo ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: promo.title,
    description: promo.description || `Projet immobilier à ${promo.location}`,
    image: (promo.images || []).map((img) => absoluteUrl(img)),
    brand: { "@type": "Organization", name: promo.developer || SITE_NAME },
    category: "Real Estate Development",
    offers: {
      "@type": "AggregateOffer",
      url: absoluteUrl(`/promotions/${promo.id}`),
      ...(promo.price_from ? { lowPrice: promo.price_from.replace(/[^\d]/g, "") } : {}),
      ...(promo.price_to ? { highPrice: promo.price_to.replace(/[^\d]/g, "") } : {}),
      priceCurrency: "DZD",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
    address: { "@type": "PostalAddress", addressLocality: promo.location, addressCountry: "DZ" },
  } : null

  return (
    <>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      <PromotionDetailClient />
    </>
  )
}
