import { getProperties, getArticles, getPromotions } from "@/lib/db"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://updated-real-estate.vercel.app"

  const [properties, articles, promotions] = await Promise.all([
    getProperties(),
    getArticles(true),
    getPromotions(),
  ])

  type SitemapUrl = {
    url: string
    priority: string
    changefreq: string
    lastmod?: string
  }

  const staticPages: SitemapUrl[] = [
    { url: baseUrl, priority: "1.0", changefreq: "weekly" },
    { url: `${baseUrl}/#services`, priority: "0.8", changefreq: "monthly" },
    { url: `${baseUrl}/#about`, priority: "0.7", changefreq: "monthly" },
    { url: `${baseUrl}/#contact`, priority: "0.8", changefreq: "monthly" },
    { url: `${baseUrl}/blog`, priority: "0.8", changefreq: "weekly" },
  ]

  const propertyPages: SitemapUrl[] = properties.map((p) => ({
    url: `${baseUrl}/properties/${p.id}`,
    priority: "0.9",
    changefreq: "weekly",
    lastmod: p.updated_at,
  }))

  const promoPages: SitemapUrl[] = promotions.map((p) => ({
    url: `${baseUrl}/promotions/${p.id}`,
    priority: "0.9",
    changefreq: "weekly",
    lastmod: p.updated_at,
  }))

  const articlePages: SitemapUrl[] = articles.map((a) => ({
    url: `${baseUrl}/blog/${a.slug}`,
    priority: "0.7",
    changefreq: "monthly",
    lastmod: a.updated_at,
  }))

  const allPages = [...staticPages, ...propertyPages, ...promoPages, ...articlePages]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => `  <url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString().split("T")[0]}</lastmod>` : ""}
  </url>`).join("\n")}
</urlset>`

  return new Response(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
  })
}
