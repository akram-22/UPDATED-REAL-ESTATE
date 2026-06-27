import { getProperties, getArticles, getPromotions, getNeighborhoods } from "@/lib/db"

export const dynamic = "force-dynamic"

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://updated-real-estate.vercel.app").replace(/\/$/, "")

function url(path: string, lastmod?: string, changefreq = "monthly", priority = "0.6", images: string[] = [], videoUrl?: string) {
  const imageXml = images.slice(0, 6).map((img) => `
    <image:image>
      <image:loc>${escXml(img.startsWith("http") ? img : `${BASE}${img}`)}</image:loc>
    </image:image>`).join("")

  const videoXml = videoUrl ? `
    <video:video>
      <video:thumbnail_loc>${escXml(`${BASE}/og-default.jpg`)}</video:thumbnail_loc>
      <video:title>${escXml(path)}</video:title>
      <video:content_loc>${escXml(videoUrl)}</video:content_loc>
    </video:video>` : ""

  return `
  <url>
    <loc>${BASE}${path}</loc>
    ${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    ${imageXml}
    ${videoXml}
  </url>`
}

function escXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

export async function GET() {
  let properties: Awaited<ReturnType<typeof getProperties>> = []
  let articles: Awaited<ReturnType<typeof getArticles>> = []
  let promotions: Awaited<ReturnType<typeof getPromotions>> = []
  let neighborhoods: Awaited<ReturnType<typeof getNeighborhoods>> = []

  try {
    [properties, articles, promotions, neighborhoods] = await Promise.all([
      getProperties(), getArticles(true), getPromotions(), getNeighborhoods(),
    ])
  } catch (err) {
    console.error("sitemap.xml: fetch error", err)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  ${url("/", undefined, "weekly", "1.0")}
  ${url("/blog", undefined, "daily", "0.9")}
  ${url("/quartiers", undefined, "monthly", "0.7")}

  ${neighborhoods.map((n) => url(`/quartiers/${n.slug}`, n.updated_at, "weekly", "0.8", n.cover_image ? [n.cover_image] : [])).join("")}

  ${properties.map((p) => url(`/properties/${p.id}`, p.updated_at, "weekly", "0.8", p.images || [], p.video_url || undefined)).join("")}

  ${promotions.map((p) => url(`/promotions/${p.id}`, p.updated_at, "monthly", "0.7", p.images || [], p.video_url || undefined)).join("")}

  ${articles.map((a) => url(`/blog/${a.slug}`, a.updated_at, "monthly", "0.7", a.cover_image ? [a.cover_image] : [])).join("")}

</urlset>`

  return new Response(xml.replace(/\n\s*\n/g, "\n"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
