"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { getArticles, getSiteContent, getBlogCategories } from "@/lib/db"
import { DEFAULT_CONTENT } from "@/lib/seed-data"
import type { Article, SiteContent, BlogCategory } from "@/lib/types"
import { NavBar } from "@/components/navbar"
import { FAQBlock } from "@/components/faq-block"

export function BlogListingClient() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    Promise.all([getArticles(true), getSiteContent(), getBlogCategories()]).then(([a, c, cat]) => {
      setArticles(a); setContent(c); setCategories(cat)
    })
  }, [])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    articles.forEach((a) => (a.tags || []).forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [articles])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return articles.filter((a) => {
      if (activeCategory && a.category_id !== activeCategory) return false
      if (activeTag && !(a.tags || []).includes(activeTag)) return false
      if (q && !(a.title.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q) || a.content?.toLowerCase().includes(q))) return false
      return true
    })
  }, [articles, query, activeCategory, activeTag])

  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <NavBar content={content} />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "1px", backgroundColor: "var(--gold)" }} />
            <span style={{ color: "var(--gold)", fontSize: "11px", letterSpacing: "5px", fontFamily: "Georgia, serif" }}>BLOG & ACTUALITÉS</span>
            <div style={{ width: "32px", height: "1px", backgroundColor: "var(--gold)" }} />
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "42px", fontWeight: "700", color: "#0a1628" }}>
            Immobilier à <span style={{ color: "var(--gold)" }}>Oran</span>
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", marginTop: "12px" }}>Conseils, analyses marché et actualités immobilières</p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <Search size={17} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article..."
            style={{ width: "100%", padding: "13px 16px 13px 44px", borderRadius: "10px", border: "1px solid #e5e7eb", backgroundColor: "white", fontSize: "14px", fontFamily: "Georgia, serif", outline: "none" }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            <button onClick={() => setActiveCategory(null)}
              style={{ fontSize: "12px", fontFamily: "Georgia, serif", padding: "6px 14px", borderRadius: "100px", border: activeCategory === null ? "1px solid #0a1628" : "1px solid #e5e7eb", backgroundColor: activeCategory === null ? "#0a1628" : "white", color: activeCategory === null ? "white" : "#6b7280", cursor: "pointer" }}>
              Toutes catégories
            </button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setActiveCategory(c.id === activeCategory ? null : c.id)}
                style={{ fontSize: "12px", fontFamily: "Georgia, serif", padding: "6px 14px", borderRadius: "100px", border: activeCategory === c.id ? "1px solid #0a1628" : "1px solid #e5e7eb", backgroundColor: activeCategory === c.id ? "#0a1628" : "white", color: activeCategory === c.id ? "white" : "#6b7280", cursor: "pointer" }}>
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "40px" }}>
            {allTags.map((t) => (
              <button key={t} onClick={() => setActiveTag(t === activeTag ? null : t)}
                style={{ fontSize: "11px", fontFamily: "Georgia, serif", padding: "4px 10px", borderRadius: "100px", border: activeTag === t ? "1px solid var(--gold)" : "1px solid #e5e7eb", backgroundColor: activeTag === t ? "rgba(201,168,76,0.12)" : "transparent", color: activeTag === t ? "var(--gold)" : "#9ca3af", cursor: "pointer" }}>
                #{t}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af", fontFamily: "Georgia, serif" }}>
            {articles.length === 0 ? "Aucun article publié pour le moment." : "Aucun article ne correspond à votre recherche."}
          </div>
        ) : (
          <div style={{ display: "grid", gap: "28px" }}>
            {filtered.map((article) => (
              <div key={article.id} onClick={() => router.push(`/blog/${article.slug}`)}
                style={{ backgroundColor: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", cursor: "pointer", display: "grid", gridTemplateColumns: article.cover_image ? "280px 1fr" : "1fr", transition: "all 0.3s" }}
                onMouseOver={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; el.style.borderColor = "rgba(201,168,76,0.4)" }}
                onMouseOut={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.borderColor = "#e5e7eb" }}>
                {article.cover_image && (
                  <img src={article.cover_image} alt={article.cover_alt || article.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                )}
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", color: "var(--gold)", letterSpacing: "3px", fontFamily: "Georgia, serif" }}>
                      {new Date(article.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                    {categoryName(article.category_id) && (
                      <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 10px", borderRadius: "100px", backgroundColor: "#0a1628", color: "white" }}>
                        {categoryName(article.category_id)}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: "700", color: "#0a1628", marginBottom: "10px", lineHeight: "1.3" }}>{article.title}</h2>
                  <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>{article.excerpt}</p>
                  <span style={{ color: "var(--gold)", fontSize: "13px", fontFamily: "Georgia, serif", letterSpacing: "1px" }}>Lire l'article →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "64px" }}>
          <FAQBlock attachType="page" attachRef="blog" />
        </div>
      </div>
    </div>
  )
}
