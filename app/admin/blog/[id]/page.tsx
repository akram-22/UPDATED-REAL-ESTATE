"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Save, CheckCircle2, ArrowLeft, Eye, X, Plus, HelpCircle } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getArticle, createArticle, updateArticle, getBlogCategories, createBlogCategory } from "@/lib/db"
import { ImageUpload } from "@/components/admin/image-upload"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import type { Article, BlogCategory } from "@/lib/types"

type FormData = Omit<Article, "id" | "created_at" | "updated_at">

function emptyForm(): FormData {
  return {
    title: "", slug: "", excerpt: "", content: "",
    cover_image: "", cover_alt: "",
    seo_title: "", meta_description: "", og_image: "",
    published: false, category_id: null, tags: [],
  }
}

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
}

function Field({ label, value, onChange, multiline = false, placeholder = "", hint = "", rows = 3, maxLen = 0 }: {
  label: string; value: string; onChange: (v: string) => void
  multiline?: boolean; placeholder?: string; hint?: string; rows?: number; maxLen?: number
}) {
  const cls = "w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
  const len = value?.length || 0
  return (
    <div>
      <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">{label}</label>
      {hint && <p className="text-muted-foreground text-xs mb-1.5">{hint}</p>}
      {multiline
        ? <textarea rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-none`} />
        : <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
      {maxLen > 0 && <div className={`text-xs mt-1 text-right ${len > maxLen ? "text-red-500" : "text-muted-foreground"}`}>{len}/{maxLen}</div>}
    </div>
  )
}

export default function AdminArticleEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === "new"
  const [form, setForm] = useState<FormData>(emptyForm())
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [newTag, setNewTag] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [addingCategory, setAddingCategory] = useState(false)

  useEffect(() => {
    getBlogCategories().then(setCategories)
  }, [])

  useEffect(() => {
    if (!isNew) {
      getArticle(id).then((a) => {
        if (a) setForm({
          title: a.title, slug: a.slug, excerpt: a.excerpt, content: a.content,
          cover_image: a.cover_image, cover_alt: a.cover_alt,
          seo_title: a.seo_title, meta_description: a.meta_description, og_image: a.og_image,
          published: a.published, category_id: a.category_id ?? null, tags: a.tags || [],
        })
        setLoading(false)
      })
    }
  }, [id, isNew])

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function addTag() {
    const t = newTag.trim().toLowerCase().replace(/\s+/g, "-")
    if (!t || form.tags.includes(t)) { setNewTag(""); return }
    set("tags", [...form.tags, t])
    setNewTag("")
  }

  async function addCategory() {
    const name = newCategoryName.trim()
    if (!name) return
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")
    const cat = await createBlogCategory({ name, slug, description: "" })
    if (cat) {
      setCategories((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)))
      set("category_id", cat.id)
    }
    setNewCategoryName("")
    setAddingCategory(false)
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({ ...prev, title, slug: prev.slug || slugify(title) }))
  }

  async function handleSave(publish = false) {
    setSaving(true)
    const data = { ...form, published: publish ? true : form.published }
    if (isNew) {
      await createArticle(data)
    } else {
      await updateArticle(id, data)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    if (isNew) router.push("/admin/blog")
  }

  if (loading) return <AdminShell><div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div></AdminShell>

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/blog")} className="text-muted-foreground hover:text-navy transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-navy">{isNew ? "Nouvel article" : "Modifier l'article"}</h1>
            <p className="text-muted-foreground text-xs mt-0.5">/blog/{form.slug || "slug-de-larticle"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && form.slug && (
            <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gold hover:text-navy border border-gold/30 px-3 py-2 rounded transition-colors">
              <Eye size={14} />Voir
            </a>
          )}
          {!form.published && (
            <button onClick={() => handleSave(true)} disabled={saving} className="flex items-center gap-2 text-sm px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-60">
              Publier
            </button>
          )}
          <button onClick={() => handleSave()} disabled={saving} className="btn-primary gap-2 text-sm">
            {saved ? <CheckCircle2 size={16} className="text-green-400" /> : <Save size={16} />}
            {saved ? "Enregistré !" : saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-5">Contenu de l'article</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Titre de l'article *</label>
                <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Ex: Comment investir dans l'immobilier à Oran en 2025" className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors text-base font-semibold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Slug / URL</label>
                <p className="text-muted-foreground text-xs mb-1.5">URL de l'article — généré automatiquement depuis le titre.</p>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs whitespace-nowrap">/blog/</span>
                  <input type="text" value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="comment-investir-immobilier-oran-2025" className="flex-1 px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold font-mono" />
                </div>
              </div>
              <Field label="Résumé / Chapeau" value={form.excerpt} onChange={(v) => set("excerpt", v)} multiline rows={2} placeholder="Courte introduction visible dans la liste des articles..." />
              <div>
                <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Contenu de l'article</label>
                <p className="text-muted-foreground text-xs mb-1.5">Éditeur enrichi : titres, listes, citations, liens et images.</p>
                <RichTextEditor value={form.content} onChange={(v) => set("content", v)} />
              </div>
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-5">Catégorie & Tags</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Catégorie</label>
                {!addingCategory ? (
                  <div className="flex items-center gap-2">
                    <select value={form.category_id || ""} onChange={(e) => set("category_id", e.target.value || null)} className="flex-1 px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold">
                      <option value="">Aucune catégorie</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="button" onClick={() => setAddingCategory(true)} className="flex items-center gap-1 text-xs px-3 py-2.5 rounded border border-border hover:bg-secondary transition-colors whitespace-nowrap"><Plus size={13} />Nouvelle</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input type="text" autoFocus value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())} placeholder="Nom de la nouvelle catégorie" className="flex-1 px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
                    <button type="button" onClick={addCategory} className="btn-primary text-xs px-3 py-2.5">Créer</button>
                    <button type="button" onClick={() => { setAddingCategory(false); setNewCategoryName("") }} className="flex items-center justify-center px-2.5 py-2.5 rounded border border-border hover:bg-secondary transition-colors"><X size={14} /></button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Tags</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" placeholder="Ex: investissement, F3, Oran..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} className="flex-1 px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
                  <button type="button" onClick={addTag} className="btn-primary text-sm px-4 py-2.5 gap-1.5"><Plus size={14} /> Ajouter</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((t, i) => (
                      <span key={i} className="flex items-center gap-1.5 bg-secondary text-navy text-xs px-3 py-1.5 rounded-full">
                        #{t}
                        <button type="button" onClick={() => set("tags", form.tags.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-600"><X size={11} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-1">🔍 SEO de l'article</h2>
            <p className="text-muted-foreground text-xs mb-5">Optimisez cet article pour Google.</p>
            <div className="flex flex-col gap-4">
              <Field label="Titre SEO" value={form.seo_title} onChange={(v) => set("seo_title", v)} placeholder="Ex: Investir à Oran en 2025 — Guide complet | Chabano" maxLen={60} hint="Idéalement 50-60 caractères." />
              <Field label="Meta description" value={form.meta_description} onChange={(v) => set("meta_description", v)} multiline placeholder="Ex: Découvrez comment investir dans l'immobilier à Oran en 2025..." maxLen={160} hint="Idéalement 150-160 caractères." />
              <div>
                <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Image OG (partage réseaux sociaux)</label>
                <input type="text" value={form.og_image} onChange={(e) => set("og_image", e.target.value)} placeholder="https://..." className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
              </div>

              {/* Google preview */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-2 tracking-wide uppercase">Aperçu Google</label>
                <div className="bg-white border border-border rounded-lg p-4">
                  <div className="text-xs text-green-700 mb-1">updated-real-estate.vercel.app/blog/{form.slug}</div>
                  <div className="text-blue-700 text-base font-medium leading-tight mb-1">{form.seo_title || form.title || "Titre SEO non défini"}</div>
                  <div className="text-gray-600 text-sm leading-relaxed">{form.meta_description || form.excerpt || "Meta description non définie"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-5">
          {/* Status */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-navy mb-4">Publication</h2>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg mb-4">
              <input type="checkbox" id="published" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="w-4 h-4 accent-gold" />
              <label htmlFor="published" className="text-sm text-navy cursor-pointer font-medium">Article publié</label>
            </div>
            <p className="text-xs text-muted-foreground">Un article publié est visible sur votre site et indexé par Google.</p>
            {!isNew && (
              <a href={`/admin/faq?attach_type=article&attach_ref=${id}`} className="flex items-center gap-1.5 text-xs text-gold hover:text-navy mt-3 transition-colors">
                <HelpCircle size={13} />Gérer les FAQ de cet article
              </a>
            )}
          </div>

          {/* Cover image */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-navy mb-4">Image de couverture</h2>
            <ImageUpload label="" value={form.cover_image} onChange={(v) => set("cover_image", v)} hint="Image affichée en haut de l'article." />
            <div className="mt-3">
              <Field label="Texte ALT de l'image" value={form.cover_alt} onChange={(v) => set("cover_alt", v)} placeholder="Ex: Vue panoramique d'Oran Algérie" hint="Décrit l'image pour Google et l'accessibilité." />
            </div>
          </div>

          {/* SEO tips */}
          <div className="bg-gold/5 border border-gold/20 rounded-xl p-5">
            <h2 className="font-semibold text-navy mb-3">💡 Conseils SEO</h2>
            <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-gold mt-0.5">✓</span>Incluez "Oran" et "immobilier" dans le titre</li>
              <li className="flex items-start gap-2"><span className="text-gold mt-0.5">✓</span>Rédigez au moins 500 mots</li>
              <li className="flex items-start gap-2"><span className="text-gold mt-0.5">✓</span>Ajoutez une image de couverture avec texte ALT</li>
              <li className="flex items-start gap-2"><span className="text-gold mt-0.5">✓</span>Remplissez le titre SEO et la meta description</li>
              <li className="flex items-start gap-2"><span className="text-gold mt-0.5">✓</span>Publiez régulièrement (1 article/semaine idéal)</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
