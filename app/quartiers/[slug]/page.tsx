import type { Metadata } from "next"
import { getNeighborhoodBySlug, getProperties } from "@/lib/db"
import { buildMetadata, absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo"
import { NeighborhoodDetailClient } from "@/components/neighborhood-detail-client"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const n = await getNeighborhoodBySlug(params.slug)
  if (!n) return buildMetadata({ path: `/quartiers/${params.slug}`, fallbackTitle: "Quartier | CHABANO", fallbackDescription: "", noindex: true })
  return buildMetadata({
    path: `/quartiers/${n.slug}`,
    fallbackTitle: `Immobilier à ${n.name}, Oran | CHABANO`,
    fallbackDescription: n.intro?.slice(0, 155) || `Biens immobiliers à ${n.name}, Oran. Achat, vente, investissement avec CHABANO — Owning Wahran.`,
    seoTitle: n.seo_title, metaDescription: n.meta_description,
    ogTitle: n.og_title, ogDescription: n.og_description, ogImage: n.og_image || n.cover_image,
  })
}

export default async function NeighborhoodPage({ params }: { params: { slug: string } }) {
  const [neighborhood, allProperties] = await Promise.all([getNeighborhoodBySlug(params.slug), getProperties()])
  const properties = allProperties.filter((p) =>
    p.status !== "sold" &&
    (p.location?.toLowerCase().includes(neighborhood?.name?.toLowerCase() || params.slug) ||
     p.location?.toLowerCase().includes(params.slug.replace(/-/g, " ")))
  )

  const schema = neighborhood ? {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${neighborhood.name}, Oran`,
    description: neighborhood.intro,
    image: neighborhood.cover_image ? absoluteUrl(neighborhood.cover_image) : undefined,
    url: absoluteUrl(`/quartiers/${neighborhood.slug}`),
    containedInPlace: { "@type": "City", name: "Oran", containedInPlace: { "@type": "Country", name: "Algérie" } },
    amenityFeature: (neighborhood.amenities || []).map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
  } : null

  return (
    <>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      <NeighborhoodDetailClient neighborhood={neighborhood} properties={properties} slug={params.slug} />
    </>
  )
}
