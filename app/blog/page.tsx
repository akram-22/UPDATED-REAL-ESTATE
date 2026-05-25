"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getArticles, getSiteContent } from "@/lib/db"
import { DEFAULT_CONTENT } from "@/lib/seed-data"
import type { Article, SiteContent } from "@/lib/types"
import { NavBar } from "@/components/navbar"

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const router = useRouter()

  useEffect(() => {
    Promise.all([getArticles(true), getSiteContent()]).then(([a, c]) => {
      setArticles(a); setContent(c)
    })
  }, [])

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <NavBar content={content} />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
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

        {articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af", fontFamily: "Georgia, serif" }}>
            Aucun article publié pour le moment.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "28px" }}>
            {articles.map((article) => (
              <div key={article.id} onClick={() => router.push(`/blog/${article.slug}`)}
                style={{ backgroundColor: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", cursor: "pointer", display: "grid", gridTemplateColumns: article.cover_image ? "280px 1fr" : "1fr", transition: "all 0.3s" }}
                onMouseOver={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; el.style.borderColor = "rgba(201,168,76,0.4)" }}
                onMouseOut={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.borderColor = "#e5e7eb" }}>
                {article.cover_image && (
                  <img src={article.cover_image} alt={article.cover_alt || article.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                )}
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: "11px", color: "var(--gold)", letterSpacing: "3px", fontFamily: "Georgia, serif", marginBottom: "8px" }}>
                    {new Date(article.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                  </div>
                  <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: "700", color: "#0a1628", marginBottom: "10px", lineHeight: "1.3" }}>{article.title}</h2>
                  <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>{article.excerpt}</p>
                  <span style={{ color: "var(--gold)", fontSize: "13px", fontFamily: "Georgia, serif", letterSpacing: "1px" }}>Lire l'article →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
