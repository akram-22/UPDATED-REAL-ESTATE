"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, AlertCircle, AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getProperties, getPromotions, getArticles } from "@/lib/db"
import type { Property, Promotion, Article } from "@/lib/types"
import Link from "next/link"

interface Issue { type: "error" | "warning" | "info"; entity: string; url: string; message: string; fix: string }

function analyzeProperties(properties: Property[]): Issue[] {
  const issues: Issue[] = []
  const titles = new Map<string, number>()

  properties.forEach((p) => {
    const url = `/admin/properties/${p.id}/edit`
    const displayTitle = p.seo_title || p.title || ""
    titles.set(displayTitle, (titles.get(displayTitle) || 0) + 1)

    if (!p.meta_description) issues.push({ type: "warning", entity: p.title, url, message: "Meta description manquante", fix: "Ajoutez une meta description dans le formulaire du bien." })
    if (!p.seo_title) issues.push({ type: "info", entity: p.title, url, message: "Titre SEO non personnalisé", fix: "Définissez un titre SEO dédié (50-60 caractères)." })
    const missingAlt = (p.images || []).filter((_, i) => i === 0).length > 0 && !p.title
    if (missingAlt) issues.push({ type: "warning", entity: p.title, url, message: "Titre manquant (utilisé comme alt text)", fix: "Ajoutez un titre au bien." })
    if (!p.og_image && !(p.images || []).length) issues.push({ type: "info", entity: p.title, url, message: "Pas d'image (ni OG, ni photo)", fix: "Ajoutez des photos à ce bien." })
  })

  titles.forEach((count, title) => {
    if (count > 1 && title) {
      const dups = properties.filter((p) => (p.seo_title || p.title) === title)
      dups.forEach((p) => issues.push({ type: "error", entity: p.title, url: `/admin/properties/${p.id}/edit`, message: `Titre dupliqué : "${title}"`, fix: "Personnalisez le titre SEO de chaque bien." }))
    }
  })

  return issues
}

function analyzeArticles(articles: Article[]): Issue[] {
  const issues: Issue[] = []
  const slugs = new Map<string, number>()
  const titles = new Map<string, number>()

  articles.forEach((a) => {
    const url = `/admin/blog/${a.id}`
    slugs.set(a.slug, (slugs.get(a.slug) || 0) + 1)
    const t = a.seo_title || a.title
    titles.set(t, (titles.get(t) || 0) + 1)

    if (!a.meta_description) issues.push({ type: "warning", entity: a.title, url, message: "Meta description manquante", fix: "Renseignez la meta description dans l'éditeur d'article." })
    if (!a.seo_title) issues.push({ type: "info", entity: a.title, url, message: "Titre SEO non personnalisé", fix: "Définissez un titre SEO distinct du titre d'article." })
    if (!a.cover_image) issues.push({ type: "info", entity: a.title, url, message: "Image de couverture manquante", fix: "Ajoutez une image de couverture pour le partage social." })
    if (a.cover_image && !a.cover_alt) issues.push({ type: "warning", entity: a.title, url, message: "Alt text manquant sur l'image de couverture", fix: "Renseignez le champ 'Texte alt de l'image' dans l'éditeur." })
    if (!a.published) issues.push({ type: "info", entity: a.title, url, message: "Article en brouillon — non indexé", fix: "Publiez l'article quand il est prêt." })
  })

  slugs.forEach((count, slug) => {
    if (count > 1) {
      const dups = articles.filter((a) => a.slug === slug)
      dups.forEach((a) => issues.push({ type: "error", entity: a.title, url: `/admin/blog/${a.id}`, message: `Slug dupliqué : "${slug}"`, fix: "Chaque article doit avoir un slug unique." }))
    }
  })

  return issues
}

function analyzePromotions(promotions: Promotion[]): Issue[] {
  const issues: Issue[] = []
  promotions.forEach((p) => {
    const url = `/admin/promotions/${p.id}/edit`
    if (!p.meta_description) issues.push({ type: "warning", entity: p.title, url, message: "Meta description manquante", fix: "Ajoutez une meta description pour ce projet." })
    if (!p.description) issues.push({ type: "warning", entity: p.title, url, message: "Description du projet manquante", fix: "Rédigez une description complète du projet." })
    if (!(p.images || []).length) issues.push({ type: "warning", entity: p.title, url, message: "Aucune image", fix: "Ajoutez des photos du projet." })
  })
  return issues
}

const SCORE_COLORS = { good: "#16a34a", average: "#d97706", poor: "#dc2626" }

export default function AdminSEOHealthPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "error" | "warning" | "info">("all")
  const [stats, setStats] = useState({ properties: 0, articles: 0, promotions: 0, total: 0 })

  async function run() {
    setLoading(true)
    const [properties, promotions, articles] = await Promise.all([getProperties(), getPromotions(), getArticles()])
    const all = [
      ...analyzeProperties(properties),
      ...analyzeArticles(articles),
      ...analyzePromotions(promotions),
    ]
    setIssues(all)
    setStats({ properties: properties.length, articles: articles.length, promotions: promotions.length, total: properties.length + articles.length + promotions.length })
    setLoading(false)
  }

  useEffect(() => { run() }, [])

  const errors = issues.filter((i) => i.type === "error")
  const warnings = issues.filter((i) => i.type === "warning")
  const infos = issues.filter((i) => i.type === "info")
  const score = stats.total === 0 ? 100 : Math.max(0, Math.round(100 - (errors.length * 15 + warnings.length * 5 + infos.length * 1)))
  const scoreColor = score >= 80 ? SCORE_COLORS.good : score >= 50 ? SCORE_COLORS.average : SCORE_COLORS.poor
  const filtered = filter === "all" ? issues : issues.filter((i) => i.type === filter)

  const TypeIcon = ({ type }: { type: Issue["type"] }) => {
    if (type === "error") return <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
    if (type === "warning") return <AlertTriangle size={14} className="text-orange-400 flex-shrink-0" />
    return <AlertCircle size={14} className="text-blue-400 flex-shrink-0" />
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">SEO Health Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Analyse automatique des problèmes SEO de votre contenu.</p>
        </div>
        <button onClick={run} disabled={loading} className="btn-primary gap-2 text-sm">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />Relancer l'analyse
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
      ) : (
        <>
          {/* Score */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center">
              <div className="font-serif text-4xl font-bold" style={{ color: scoreColor }}>{score}</div>
              <div className="text-xs text-muted-foreground mt-1 text-center">Score SEO /100</div>
              <div className="text-xs font-semibold mt-1" style={{ color: scoreColor }}>
                {score >= 80 ? "Excellent" : score >= 60 ? "Bon" : score >= 40 ? "À améliorer" : "Critique"}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center">
              <div className="font-serif text-4xl font-bold text-red-500">{errors.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Erreurs critiques</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center">
              <div className="font-serif text-4xl font-bold text-orange-400">{warnings.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Avertissements</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center">
              <div className="font-serif text-4xl font-bold text-blue-400">{infos.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Suggestions</div>
            </div>
          </div>

          {/* Summary */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Biens analysés", value: stats.properties, href: "/admin/properties" },
              { label: "Articles analysés", value: stats.articles, href: "/admin/blog" },
              { label: "Projets analysés", value: stats.promotions, href: "/admin/promotions" },
            ].map((s) => (
              <Link key={s.href} href={s.href} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-gold/30 transition-colors">
                <div>
                  <div className="font-serif text-xl font-bold text-navy">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
                <ExternalLink size={14} className="text-muted-foreground" />
              </Link>
            ))}
          </div>

          {issues.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <p className="font-serif text-xl font-bold text-navy mb-2">Aucun problème détecté !</p>
              <p className="text-muted-foreground text-sm">Votre contenu est parfaitement optimisé pour le SEO.</p>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {(["all", "error", "warning", "info"] as const).map((f) => {
                  const count = f === "all" ? issues.length : issues.filter((i) => i.type === f).length
                  return (
                    <button key={f} onClick={() => setFilter(f)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === f ? "bg-navy text-white border-navy" : "border-border text-muted-foreground hover:bg-secondary"}`}>
                      {f === "all" ? "Tous" : f === "error" ? "Erreurs" : f === "warning" ? "Avertissements" : "Suggestions"} ({count})
                    </button>
                  )
                })}
              </div>

              {/* Issues list */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="divide-y divide-border">
                  {filtered.map((issue, i) => (
                    <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-secondary/40 transition-colors">
                      <TypeIcon type={issue.type} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-navy text-sm truncate">{issue.entity}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${issue.type === "error" ? "bg-red-100 text-red-700" : issue.type === "warning" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                            {issue.type === "error" ? "ERREUR" : issue.type === "warning" ? "ATTENTION" : "INFO"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 italic">→ {issue.fix}</p>
                      </div>
                      <Link href={issue.url} className="flex-shrink-0 text-xs text-gold hover:text-navy transition-colors flex items-center gap-1">
                        Corriger <ExternalLink size={10} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </AdminShell>
  )
}
