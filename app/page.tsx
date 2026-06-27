import type { Metadata } from "next"
import { getSEOPage } from "@/lib/db"
import { buildMetadata } from "@/lib/seo"
import { HomeClient } from "@/components/home-client"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOPage("home")
  return buildMetadata({
    path: "/",
    fallbackTitle: "CHABANO — Owning Wahran | Immobilier de Prestige à Oran",
    fallbackDescription: "Agent immobilier à Oran, Algérie. Achat, vente, investissement et commercialisation de promotions immobilières. Chabane Chawki — Owning Wahran.",
    seoTitle: seo?.seo_title,
    metaDescription: seo?.meta_description,
    ogTitle: seo?.og_title,
    ogDescription: seo?.og_description,
    ogImage: seo?.og_image,
    canonicalUrl: seo?.canonical_url,
    noindex: seo?.noindex,
  })
}

export default function HomePage() {
  return <HomeClient />
}
