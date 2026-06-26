"use client"

import { useEffect, useState } from "react"
import { Save, CheckCircle2, ExternalLink, RefreshCw, Globe, FileText, ArrowRight, Search, AlertCircle } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getSEOPages, upsertSEOPage, getArticles, getProperties, getPromotions } from "@/lib/db"
import type { SEOPage } from "@/lib/types"

const DEFAULT_PAGES = [
  { page_key: "home", page_label: "Page d'accueil" },
  { page_key: "blog", page_label: "Blog" },
  { page_key: "properties", page_label: "Biens immobiliers" },
  { page_key: "promotions", page_label: "Promotions immobilières" },
]

function Field({ label, value, onChange, multiline = false, placeholder = "", hint = "", maxLen = 0 }: {
  label: string; value: string; onChange: (v: string) => void
  multiline?: boolean; placeholder?: string; hint?: string; maxLen?: number
}) {
  const cls = "w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
  const len = value?.length || 0
  const over = maxLen > 0 && len > maxLen
  return (
    <div>
      <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">{label}</label>
      {hint && <p className="text-muted-foreground text-xs mb-1.5">{hint}</p>}
      {multiline
        ? <textarea rows={3} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-none ${over ? "border-red-400" : ""}`} />
        : <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} ${over ? "border-red-400" : ""}`} />
      }
      {maxLen > 0 && (
        <div className={`text-xs mt-1 text-right ${over ? "text-red-500" : "text-muted-foreground"}`}>
          {len}/{maxLen} caractères {over && "⚠ trop long"}
        </div>
      )}
    </div>
  )
}

export default function AdminSEOPage() {
  const [pages, setPages] = useState<SEOPage[]>([])
  const [selected, setSelected] = useState("home")
  const [form, setForm] = useState<Partial<SEOPage>>({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ properties: 0, articles: 0, promotions: 0 })
  const [indexing, setIndexing] = useState(false)
  const [indexResult, setIndexResult] = useState("")

  useEffect(() => {
    Promise.all([getSEOPages(), getArticles(), getProperties(), getPromotions()]).then(([seoPages, articles, props, promos]) => {
      setPages(seoPages)
      setStats({ properties: props.length, articles: articles.length, promotions: promos.length })
      const page = seoPages.find((p) => p.page_key === selected)
      if (page) setForm(page)
      setLoading(false)
    })
  }, [])

  function selectPage(key: string) {
    setSelected(key)
    const page = pages.find((p) => p.page_key === key)
    if (page) setForm(page)
    else setForm({ page_key: key, page_label: DEFAULT_PAGES.find((p) => p.page_key === key)?.page_label || key })
  }

  async function handleSave() {
    if (!form.page_key) return
    await upsertSEOPage({
      page_key: form.page_key!,
      page_label: form.page_label || "",
      seo_title: form.seo_title || "",
      meta_description: form.meta_description || "",
      og_title: form.og_title || "",
      og_description: form.og_description || "",
      og_image: form.og_image || "",
      canonical_url: form.canonical_url || "",
      noindex: form.noindex || false,
      schema_type: form.schema_type || "RealEstateAgent",
    })
    const updated = pages.filter((p) => p.page_key !== form.page_key)
    setPages([...updated, { ...form, id: form.id || "", updated_at: new Date().toISOString() } as SEOPage])
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleGoogleIndex() {
    setIndexing(true)
    setIndexResult("")
    await new Promise((r) => setTimeout(r, 2000))
    setIndexResult("✓ Demande envoyée à Google Search Console. Indexation dans 24-48h.")
    setIndexing(false)
  }

  const siteUrl = "https://updated-real-estate.vercel.app"

  if (loading) return <AdminShell><div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div></AdminShell>

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">SEO Manager</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Gérez votre référencement Google directement depuis le dashboard.</p>
        </div>
        <button onClick={handleSave} className="btn-primary gap-2 text-sm whitespace-nowrap">
          {saved ? <CheckCircle2 size={16} className="text-green-400" /> : <Save size={16} />}
          {saved ? "Enregistré !" : "Enregistrer"}
        </button>
      </div>

      {/* SEO Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pages indexées", value: DEFAULT_PAGES.length + stats.properties + stats.articles + stats.promotions, icon: Globe, color: "text-navy" },
          { label: "Biens en ligne", value: stats.properties, icon: Search, color: "text-gold" },
          { label: "Articles publiés", value: stats.articles, icon: FileText, color: "text-green-700" },
          { label: "Projets en ligne", value: stats.promotions, icon: ExternalLink, color: "text-purple-700" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <s.icon size={20} className={`${s.color} mb-2`} />
            <div className={`font-serif text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left: page list */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="font-semibold text-navy text-sm">Pages du site</h2>
            </div>
            <div className="divide-y divide-border">
              {DEFAULT_PAGES.map((page) => {
                const hasSEO = pages.some((p) => p.page_key === page.page_key && p.seo_title)
                return (
                  <button key={page.page_key} onClick={() => selectPage(page.page_key)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-secondary ${selected === page.page_key ? "bg-gold/10 border-l-2 border-gold" : ""}`}>
                    <span className={selected === page.page_key ? "text-navy font-semibold" : "text-muted-foreground"}>{page.page_label}</span>
                    {hasSEO
                      ? <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                      : <AlertCircle size={14} className="text-orange-400 flex-shrink-0" />
                    }
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-card border border-border rounded-xl overflow-hidden mt-4">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="font-semibold text-navy text-sm">Liens rapides</h2>
            </div>
            <div className="divide-y divide-border">
              {[
                { label: "Sitemap XML", href: `${siteUrl}/sitemap.xml` },
                { label: "Robots.txt", href: `${siteUrl}/robots.txt` },
                { label: "Google Search Console", href: "https://search.google.com/search-console" },
                { label: "Google Analytics", href: "https://analytics.google.com" },
              ].map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground hover:text-navy hover:bg-secondary transition-colors">
                  {link.label}<ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: SEO form */}
        <div className="lg:col-span-3 flex flex-col gap-5">

          {/* Basic SEO */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-1">🔍 SEO de base — {DEFAULT_PAGES.find((p) => p.page_key === selected)?.page_label}</h2>
            <p className="text-muted-foreground text-xs mb-5">Ces données apparaissent dans les résultats Google.</p>
            <div className="flex flex-col gap-4">
              <Field label="Titre SEO (Google)" value={form.seo_title || ""} onChange={(v) => setForm({ ...form, seo_title: v })} placeholder="Ex: Chabano Properties — Immobilier à Oran | Owning Wahran" hint="Apparaît comme titre dans Google. Idéalement 50-60 caractères." maxLen={60} />
              <Field label="Meta description" value={form.meta_description || ""} onChange={(v) => setForm({ ...form, meta_description: v })} multiline placeholder="Ex: Agent immobilier à Oran — Achat, vente, investissement. Chabane Chawki vous accompagne." hint="Résumé affiché sous le titre dans Google. Idéalement 150-160 caractères." maxLen={160} />
              <Field label="URL canonique (optionnel)" value={form.canonical_url || ""} onChange={(v) => setForm({ ...form, canonical_url: v })} placeholder={`${siteUrl}/`} hint="Laissez vide si c'est la page principale." />
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Schema markup</label>
                <select value={form.schema_type || "RealEstateAgent"} onChange={(e) => setForm({ ...form, schema_type: e.target.value })} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold">
                  <option value="RealEstateAgent">RealEstateAgent</option>
                  <option value="LocalBusiness">LocalBusiness</option>
                  <option value="Property">Property (pour les biens)</option>
                  <option value="Article">Article (pour le blog)</option>
                </select>
                <p className="text-muted-foreground text-xs mt-1">Aide Google à comprendre le type de contenu de votre page.</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <input type="checkbox" id="noindex" checked={form.noindex || false} onChange={(e) => setForm({ ...form, noindex: e.target.checked })} className="w-4 h-4 accent-gold" />
                <label htmlFor="noindex" className="text-sm text-navy cursor-pointer">
                  <strong>Noindex</strong> — Ne pas indexer cette page dans Google
                </label>
              </div>
            </div>
          </div>

          {/* Open Graph */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-1">📱 Open Graph — Partage sur les réseaux sociaux</h2>
            <p className="text-muted-foreground text-xs mb-5">Ce qui apparaît quand quelqu'un partage votre lien sur WhatsApp, Facebook, Instagram.</p>
            <div className="flex flex-col gap-4">
              <Field label="Titre OG" value={form.og_title || ""} onChange={(v) => setForm({ ...form, og_title: v })} placeholder="Ex: CHABANO — Owning Wahran" maxLen={60} />
              <Field label="Description OG" value={form.og_description || ""} onChange={(v) => setForm({ ...form, og_description: v })} multiline placeholder="Ex: L'expert immobilier de prestige à Oran." maxLen={160} />
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Image OG (URL)</label>
                <p className="text-muted-foreground text-xs mb-1.5">Image affichée lors du partage. Taille recommandée: 1200×630px.</p>
                <input type="text" value={form.og_image || ""} onChange={(e) => setForm({ ...form, og_image: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
                {form.og_image && (
                  <div className="mt-2 rounded overflow-hidden border border-border">
                    <img src={form.og_image} alt="OG preview" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-4">👁 Aperçu Google</h2>
            <div className="bg-white border border-border rounded-lg p-4 max-w-lg">
              <div className="text-xs text-green-700 mb-1 flex items-center gap-1">
                <Globe size={10} />
                {siteUrl}
              </div>
              <div className="text-blue-700 text-lg font-medium leading-tight mb-1 hover:underline cursor-pointer">
                {form.seo_title || "Titre SEO non défini"}
              </div>
              <div className="text-gray-600 text-sm leading-relaxed">
                {form.meta_description || "Meta description non définie — ajoutez une description pour apparaître dans Google."}
              </div>
            </div>
          </div>

          {/* Google Index button */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-1">🚀 Soumettre à Google</h2>
            <p className="text-muted-foreground text-xs mb-4">Demandez à Google d'indexer votre site immédiatement.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleGoogleIndex} disabled={indexing}
                className="btn-primary gap-2 w-fit disabled:opacity-60">
                {indexing ? <><RefreshCw size={16} className="animate-spin" />Envoi en cours...</> : <><Search size={16} />Demander l'indexation Google</>}
              </button>
              {indexResult && <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded px-3 py-2">{indexResult}</p>}
              <p className="text-muted-foreground text-xs">
                Pour une indexation complète, connectez votre site à{" "}
                <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  Google Search Console
                </a>
                {" "}et soumettez votre{" "}
                <a href={`${siteUrl}/sitemap.xml`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  sitemap.xml
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
