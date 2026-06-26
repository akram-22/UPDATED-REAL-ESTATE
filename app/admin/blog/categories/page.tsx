"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory, getArticles } from "@/lib/db"
import type { BlogCategory, Article } from "@/lib/types"

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
}

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)

  function load() {
    Promise.all([getBlogCategories(), getArticles()]).then(([c, a]) => {
      setCategories(c); setArticles(a); setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  function resetForm() {
    setName(""); setSlug(""); setDescription(""); setEditingId(null); setCreating(false)
  }

  function startEdit(cat: BlogCategory) {
    setEditingId(cat.id); setCreating(false)
    setName(cat.name); setSlug(cat.slug); setDescription(cat.description || "")
  }

  function startCreate() {
    resetForm(); setCreating(true)
  }

  async function handleSave() {
    if (!name.trim() || !slug.trim()) return
    setSaving(true)
    if (editingId) {
      await updateBlogCategory(editingId, { name: name.trim(), slug: slug.trim(), description: description.trim() })
    } else {
      await createBlogCategory({ name: name.trim(), slug: slug.trim(), description: description.trim() })
    }
    setSaving(false)
    resetForm()
    load()
  }

  async function handleDelete(id: string) {
    const count = articles.filter((a) => a.category_id === id).length
    const msg = count > 0
      ? `Cette catégorie est utilisée par ${count} article(s). Ils ne seront pas supprimés mais perdront leur catégorie. Continuer ?`
      : "Supprimer cette catégorie ?"
    if (!confirm(msg)) return
    await deleteBlogCategory(id)
    load()
  }

  const formOpen = creating || editingId !== null

  return (
    <AdminShell>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/blog" className="text-muted-foreground hover:text-navy transition-colors"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Catégories de blog</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Organisez vos articles par thématique</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-3">
            {categories.length === 0 && (
              <div className="text-center py-16 bg-card border border-border rounded-xl text-muted-foreground">
                <p className="text-3xl mb-3">🏷️</p>
                <p className="font-semibold mb-1">Aucune catégorie</p>
                <p className="text-sm">Créez votre première catégorie pour organiser vos articles.</p>
              </div>
            )}
            {categories.map((cat) => {
              const count = articles.filter((a) => a.category_id === cat.id).length
              return (
                <div key={cat.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-navy">{cat.name}</span>
                      <span className="text-xs text-muted-foreground">/{cat.slug}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-navy">{count} article{count !== 1 ? "s" : ""}</span>
                    </div>
                    {cat.description && <p className="text-sm text-muted-foreground mt-1 truncate">{cat.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(cat)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-border hover:bg-secondary transition-colors"><Pencil size={12} />Modifier</button>
                    <button onClick={() => handleDelete(cat.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"><Trash2 size={12} />Supprimer</button>
                  </div>
                </div>
              )
            })}
          </div>

          <div>
            {!formOpen ? (
              <button onClick={startCreate} className="btn-primary gap-2 text-sm w-full justify-center"><Plus size={16} />Nouvelle catégorie</button>
            ) : (
              <div className="bg-card border border-border rounded-xl p-5 sticky top-5">
                <h2 className="font-semibold text-navy mb-4">{editingId ? "Modifier la catégorie" : "Nouvelle catégorie"}</h2>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Nom</label>
                    <input type="text" value={name} onChange={(e) => { setName(e.target.value); if (!editingId) setSlug(slugify(e.target.value)) }} placeholder="Ex: Conseils investissement" className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Slug</label>
                    <input type="text" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="conseils-investissement" className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Description (optionnel)</label>
                    <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:border-gold" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={handleSave} disabled={saving || !name.trim() || !slug.trim()} className="btn-primary gap-1.5 text-sm flex-1 justify-center"><Check size={14} />{saving ? "..." : "Enregistrer"}</button>
                    <button onClick={resetForm} className="flex items-center justify-center gap-1.5 text-sm px-3 py-2.5 rounded border border-border hover:bg-secondary transition-colors"><X size={14} /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  )
}
