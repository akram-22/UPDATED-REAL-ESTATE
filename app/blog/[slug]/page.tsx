import type { Metadata } from "next"
import { getArticleBySlug } from "@/lib/db"
import { buildMetadata, absoluteUrl, SITE_NAME } from "@/lib/seo"
import { BlogArticleClient } from "@/components/blog-article-client"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  if (!article) {
    return buildMetadata({
      path: `/blog/${params.slug}`,
      fallbackTitle: "Article introuvable | CHABANO",
      fallbackDescription: "Cet article n'existe pas ou plus.",
      noindex: true,
    })
  }
  return buildMetadata({
    path: `/blog/${article.slug}`,
    fallbackTitle: `${article.title} | Blog CHABANO`,
    fallbackDescription: article.excerpt || article.meta_description || "",
    seoTitle: article.seo_title,
    metaDescription: article.meta_description,
    ogImage: article.og_image || article.cover_image,
    type: "article",
    publishedTime: article.created_at,
    modifiedTime: article.updated_at,
  })
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)

  const schema = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image ? [absoluteUrl(article.cover_image)] : undefined,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`),
  } : null

  return (
    <>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      <BlogArticleClient />
    </>
  )
}
