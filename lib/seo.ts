import type { Metadata } from "next"

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://updated-real-estate.vercel.app").replace(/\/$/, "")
export const SITE_NAME = "CHABANO — Owning Wahran"
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`
}

interface BuildMetadataInput {
  /** The canonical path of this page, e.g. "/blog/investir-a-oran" */
  path: string
  /** Fallback title used if no custom seo_title is set */
  fallbackTitle: string
  /** Fallback description used if no custom meta_description is set */
  fallbackDescription: string
  /** Optional per-entity overrides — any of these may be empty strings */
  seoTitle?: string
  metaDescription?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
  noindex?: boolean
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
}

/**
 * Builds a Next.js Metadata object from CMS-managed SEO fields, with sensible
 * fallbacks. Used by every generateMetadata() across the site so that the
 * SEO Manager / per-property / per-article fields actually reach the
 * rendered <head> (title, meta description, Open Graph, canonical, robots).
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const title = input.seoTitle?.trim() || input.fallbackTitle
  const description = input.metaDescription?.trim() || input.fallbackDescription
  const ogTitle = input.ogTitle?.trim() || title
  const ogDescription = input.ogDescription?.trim() || description
  const ogImage = input.ogImage?.trim() ? absoluteUrl(input.ogImage.trim()) : DEFAULT_OG_IMAGE
  const canonical = input.canonicalUrl?.trim() ? absoluteUrl(input.canonicalUrl.trim()) : absoluteUrl(input.path)

  return {
    title,
    description,
    alternates: { canonical },
    robots: input.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      locale: "fr_DZ",
      type: input.type || "website",
      ...(input.type === "article" && input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.type === "article" && input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  }
}

export interface BreadcrumbEntry { name: string; path: string }

export function breadcrumbSchema(items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
