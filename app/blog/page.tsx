import type { Metadata } from "next"
import { getSEOPage } from "@/lib/db"
import { buildMetadata } from "@/lib/seo"
import { BlogListingClient } from "@/components/blog-listing-client"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOPage("blog")
  return buildMetadata({
    path: "/blog",
    fallbackTitle: "Blog Immobilier Oran — Conseils & Actualités | CHABANO",
    fallbackDescription: "Conseils, analyses marché et actualités immobilières à Oran. Investir, acheter ou vendre un bien avec CHABANO — Owning Wahran.",
    seoTitle: seo?.seo_title,
    metaDescription: seo?.meta_description,
    ogTitle: seo?.og_title,
    ogDescription: seo?.og_description,
    ogImage: seo?.og_image,
    canonicalUrl: seo?.canonical_url,
    noindex: seo?.noindex,
  })
}

export default function BlogPage() {
  return <BlogListingClient />
}
