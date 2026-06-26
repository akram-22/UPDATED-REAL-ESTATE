"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Share2 } from "lucide-react"
import { getArticleBySlug, getSiteContent, getBlogCategories } from "@/lib/db"
import { DEFAULT_CONTENT } from "@/lib/seed-data"
import type { Article, SiteContent, BlogCategory } from "@/lib/types"
import { FAQBlock } from "@/components/faq-block"
import { Breadcrumb } from "@/components/breadcrumb"
import { RelatedArticles } from "@/components/related-content"

function renderableContent(raw: string) {
  if (!raw) return ""
  // Backward-compat: older articles were saved as plain text (no HTML tags).
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(raw)
  if (looksLikeHtml) return raw
  return raw.split(/\n\s*\n/).map((p) => `<p>${p.trim().replace(/\n/g, "<br/>")}</p>`).join("")
}

export function BlogArticleClient() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [article, setArticle] = useState<Article | null>(null)
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getArticleBySlug(slug), getSiteContent(), getBlogCategories()]).then(([a, c, cat]) => {
      setArticle(a); setContent(c); setCategories(cat); setLoading(false)
    })
  }, [slug])

  const categoryName = article ? categories.find((c) => c.id === article.category_id)?.name : null

  function share() {
    if (navigator.share) navigator.share({ title: article?.title, url: window.location.href })
    else { navigator.clipboard.writeText(window.location.href); alert("Lien copié !") }
  }

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0a1628" }}><div style={{ width: "40px", height: "40px", border: "3px solid rgba(201,168,76,0.3)", borderTop: "3px solid var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div>
  if (!article) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ fontFamily: "Georgia, serif", color: "#6b7280" }}>Article introuvable</p></div>

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <header style={{ backgroundColor: "#0a1628", borderBottom: "1px solid rgba(201,168,76,0.2)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ height: "2px", background: "var(--gold)" }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => router.push("/blog")} style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "13px" }}>
            <ArrowLeft size={16} /> Blog
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "1.5px", height: "32px", backgroundColor: "var(--gold)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "700", color: "#ffffff", letterSpacing: "6px" }}>CHABANO</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "6px", color: "var(--gold)", letterSpacing: "3px" }}>OWNING WAHRAN</div>
            </div>
            <div style={{ width: "1.5px", height: "32px", backgroundColor: "var(--gold)" }} />
          </div>
          <button onClick={share} style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "12px" }}>
            <Share2 size={15} /> Partager
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 20px 80px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Breadcrumb items={[{ name: "Blog", path: "/blog" }, { name: article.title, path: `/blog/${article.slug}` }]} />
        </div>
        {article.cover_image && (
          <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "36px", aspectRatio: "16/9" }}>
            <img src={article.cover_image} alt={article.cover_alt || article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ color: "var(--gold)", fontSize: "11px", letterSpacing: "3px", fontFamily: "Georgia, serif", marginBottom: "12px" }}>
          {new Date(article.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
          {categoryName && <span style={{ marginLeft: "12px", fontSize: "10px", fontWeight: 700, padding: "2px 10px", borderRadius: "100px", backgroundColor: "#0a1628", color: "white", letterSpacing: "1px" }}>{categoryName}</span>}
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: "700", color: "#0a1628", lineHeight: "1.25", marginBottom: "20px" }}>{article.title}</h1>
        {article.excerpt && <p style={{ fontSize: "18px", color: "#6b7280", lineHeight: "1.7", marginBottom: "36px", borderLeft: "3px solid var(--gold)", paddingLeft: "16px", fontStyle: "italic" }}>{article.excerpt}</p>}
        <div className="article-prose" dangerouslySetInnerHTML={{ __html: renderableContent(article.content) }} />

        {article.tags && article.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
            {article.tags.map((t) => (
              <span key={t} style={{ fontSize: "12px", fontFamily: "Georgia, serif", padding: "5px 12px", borderRadius: "100px", border: "1px solid #e5e7eb", color: "#6b7280" }}>#{t}</span>
            ))}
          </div>
        )}

        <div style={{ marginTop: "48px", padding: "24px", backgroundColor: "#0a1628", borderRadius: "12px", borderTop: "3px solid var(--gold)", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Georgia, serif", marginBottom: "16px" }}>Vous avez un projet immobilier à Oran ?</p>
          <a href={`https://wa.me/${content.contact.whatsappNumber}?text=Bonjour Chabane, j'ai lu votre article et j'ai un projet immobilier.`} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{ justifyContent: "center", display: "inline-flex" }}>
            Contacter Chabane
          </a>
        </div>

        <RelatedArticles article={article} />

        <div style={{ marginTop: "48px" }}>
          <FAQBlock attachType="article" attachRef={article.id} />
        </div>
      </div>
    </div>
  )
}
