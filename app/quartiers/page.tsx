import type { Metadata } from "next"
import { getNeighborhoods, getSEOPage } from "@/lib/db"
import { buildMetadata } from "@/lib/seo"
import { NeighborhoodsListClient } from "@/components/neighborhoods-list-client"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOPage("neighborhoods")
  return buildMetadata({
    path: "/quartiers",
    fallbackTitle: "Quartiers d'Oran — Immobilier par zone | CHABANO",
    fallbackDescription: "Découvrez les quartiers d'Oran : Bir El Djir, Akid Lotfi, Centre-Ville, Es Senia. Biens disponibles et guide immobilier local par CHABANO.",
    seoTitle: seo?.seo_title, metaDescription: seo?.meta_description,
    ogTitle: seo?.og_title, ogDescription: seo?.og_description, ogImage: seo?.og_image,
  })
}

export default async function NeighborhoodsPage() {
  const neighborhoods = await getNeighborhoods()
  return <NeighborhoodsListClient neighborhoods={neighborhoods} />
}
