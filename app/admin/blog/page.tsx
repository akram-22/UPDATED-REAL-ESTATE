"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Eye, EyeOff, Tag } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getArticles, deleteArticle, updateArticle, getBlogCategories } from "@/lib/db"
import type { Article, BlogCategory } from "@/lib/types"

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getArticles(), getBlogCategories()]).then(([a, c]) => { setArticles(a); setCategories(c); setLoading(false) })
  }, [])

  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet article ?")) return
    await deleteArticle(id)
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }

  async function togglePublish(id: string, published: boolean) {
    await updateArticle(id, { published: !published })
    setArticles((prev) => prev.map((a) => a.id === id ? { ...a, published: !published } : a))
  }

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Blog & Articles</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{articles.length} article(s) — améliore votre référencement Google</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary gap-2 text-sm whitespace-nowrap"><Plus size={16} />Nouvel article</Link>
      </div>

      <div className="mb-6">
        <Link href="/admin/blog/categories" className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-navy border border-gold/30 px-3 py-1.5 rounded transition-colors">
          <Tag size={14} />Gérer les catégories
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl text-muted-foreground">
          <p className="text-4xl mb-4">✍️</p>
          <p className="font-semibold mb-2">Aucun article pour le moment</p>
          <p className="text-sm mb-6">Les articles de blog améliorent votre référencement Google pour des recherches comme "appartement Oran", "immobilier Oran 2025"...</p>
          <Link href="/admin/blog/new" className="btn-primary gap-2"><Plus size={16} />Écrire votre premier article</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {articles.map((a) => (
            <div key={a.id} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col sm:flex-row">
              <div className="w-full sm:w-36 h-28 flex-shrink-0 bg-secondary">
                {a.cover_image
                  ? <img src={a.cover_image} alt={a.cover_alt || a.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">✍️</div>
                }
              </div>
              <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-navy truncate">{a.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {a.published ? "Publié" : "Brouillon"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{a.excerpt}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    🔗 /blog/{a.slug} · {new Date(a.created_at).toLocaleDateString("fr-FR")}
                  </div>
                  {(categoryName(a.category_id) || (a.tags && a.tags.length > 0)) && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {categoryName(a.category_id) && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-navy/10 text-navy">{categoryName(a.category_id)}</span>
                      )}
                      {(a.tags || []).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => togglePublish(a.id, a.published)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-colors ${a.published ? "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100" : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"}`}>
                    {a.published ? <><EyeOff size={12} />Dépublier</> : <><Eye size={12} />Publier</>}
                  </button>
                  <Link href={`/admin/blog/${a.id}`} className="btn-primary text-xs px-3 py-1.5 gap-1.5"><Pencil size={12} />Modifier</Link>
                  <button onClick={() => handleDelete(a.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"><Trash2 size={12} />Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
