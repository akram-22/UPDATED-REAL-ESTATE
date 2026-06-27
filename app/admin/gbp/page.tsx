"use client"

import { useEffect, useState } from "react"
import { Save, CheckCircle2, ExternalLink, Plus, X, Lightbulb, Search, BarChart3 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getSiteSettings, updateSiteSettings } from "@/lib/db"
import type { SiteSettings } from "@/lib/types"

function Field({ label, value, onChange, placeholder = "", hint = "", multiline = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; multiline?: boolean }) {
  const cls = "w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
  return (
    <div>
      <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">{label}</label>
      {hint && <p className="text-muted-foreground text-xs mb-1.5">{hint}</p>}
      {multiline ? <textarea rows={3} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-none`} /> : <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
    </div>
  )
}

const POST_TEMPLATES = [
  "🏠 Nouveau bien disponible à Oran — {titre} {prix} — Contactez Chabane",
  "📈 Analyse marché : Les prix à Oran ont évolué de X% ce trimestre",
  "✅ Vendu ! Un appartement à {quartier} trouvé en moins de {délai}",
  "💡 Conseil du jour : {conseil immobilier à Oran}",
  "🔑 Client satisfait : {témoignage anonymisé}",
]

export default function AdminGBPPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newPostIdea, setNewPostIdea] = useState("")

  useEffect(() => { getSiteSettings().then((s) => { setSettings(s); setLoading(false) }) }, [])

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev)
  }

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    await updateSiteSettings(settings)
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000)
  }

  function addPostIdea(idea: string) {
    const t = idea.trim()
    if (!t || !settings) return
    if (!(settings.gbp_post_ideas || []).includes(t)) set("gbp_post_ideas", [...(settings.gbp_post_ideas || []), t])
    setNewPostIdea("")
  }

  if (loading) return <AdminShell><div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div></AdminShell>
  if (!settings) return null

  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">SEO Local & Analytiques</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Google Business Profile, Google Analytics et Search Console.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary gap-2 text-sm">
          {saved ? <CheckCircle2 size={16} className="text-green-400" /> : <Save size={16} />}
          {saved ? "Enregistré !" : saving ? "..." : "Enregistrer"}
        </button>
      </div>

      <div className="flex flex-col gap-6">

        {/* GBP */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Search size={18} className="text-gold" />
            <h2 className="font-semibold text-navy">Google Business Profile</h2>
          </div>
          <p className="text-muted-foreground text-xs mb-5">Informations pour le référencement local à Oran. Renseignez votre fiche Google.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nom de l'agence" value={settings.gbp_business_name} onChange={(v) => set("gbp_business_name", v)} placeholder="CHABANO — Owning Wahran" />
            <Field label="Téléphone" value={settings.gbp_phone} onChange={(v) => set("gbp_phone", v)} placeholder="+213 541 029 014" hint="Format international recommandé." />
            <Field label="Zone de service" value={settings.gbp_service_area} onChange={(v) => set("gbp_service_area", v)} placeholder="Oran, Bir El Djir, Es Senia, Akid Lotfi..." hint="Quartiers et zones couverts." />
            <Field label="URL du profil Google Business" value={settings.gbp_profile_url} onChange={(v) => set("gbp_profile_url", v)} placeholder="https://g.page/..." />
            <Field label="Lien d'avis Google" value={settings.gbp_review_link} onChange={(v) => set("gbp_review_link", v)} placeholder="https://g.page/r/..." hint="Lien direct pour demander des avis clients." />
          </div>
          {settings.gbp_profile_url && (
            <div className="mt-4">
              <a href={settings.gbp_profile_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-navy transition-colors">
                <ExternalLink size={12} />Voir votre profil Google Business
              </a>
            </div>
          )}
        </div>

        {/* Post ideas */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb size={18} className="text-gold" />
            <h2 className="font-semibold text-navy">Idées de posts Google Business</h2>
          </div>
          <p className="text-muted-foreground text-xs mb-4">Préparez vos publications hebdomadaires pour améliorer votre visibilité locale.</p>
          <div className="flex gap-2 mb-3">
            <input type="text" value={newPostIdea} onChange={(e) => setNewPostIdea(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPostIdea(newPostIdea))} placeholder="Ajouter une idée de post..." className="flex-1 px-3 py-2.5 rounded-sm border border-border bg-background text-sm focus:outline-none focus:border-gold" />
            <button onClick={() => addPostIdea(newPostIdea)} className="btn-primary text-sm px-3"><Plus size={14} /></button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Modèles rapides :</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {POST_TEMPLATES.map((t, i) => (
              <button key={i} onClick={() => addPostIdea(t)} className="text-xs px-3 py-1.5 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors">{t.slice(0, 40)}...</button>
            ))}
          </div>
          {(settings.gbp_post_ideas || []).length > 0 && (
            <div className="flex flex-col gap-2">
              {settings.gbp_post_ideas.map((idea, i) => (
                <div key={i} className="flex items-start gap-2 bg-secondary rounded-lg px-3 py-2.5">
                  <span className="flex-1 text-sm text-navy">{idea}</span>
                  <button onClick={() => set("gbp_post_ideas", settings.gbp_post_ideas.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-600 flex-shrink-0"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
          {settings.gbp_review_link && (
            <div className="mt-4 p-3 bg-gold/5 border border-gold/20 rounded-lg">
              <p className="text-xs font-semibold text-navy mb-1">💡 Astuce : Demandez des avis automatiquement</p>
              <p className="text-xs text-muted-foreground mb-2">Copiez ce lien et envoyez-le à vos clients satisfaits sur WhatsApp :</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-background border border-border px-2 py-1 rounded flex-1 truncate">{settings.gbp_review_link}</code>
                <button onClick={() => navigator.clipboard.writeText(settings.gbp_review_link)} className="text-xs px-2 py-1 bg-navy text-white rounded hover:bg-navy/80 transition-colors whitespace-nowrap">Copier</button>
              </div>
            </div>
          )}
        </div>

        {/* Analytics */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={18} className="text-gold" />
            <h2 className="font-semibold text-navy">Google Analytics & Search Console</h2>
          </div>
          <p className="text-muted-foreground text-xs mb-5">Connectez Google Analytics 4 et Search Console pour suivre vos performances.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="GA4 Measurement ID" value={settings.ga4_measurement_id} onChange={(v) => set("ga4_measurement_id", v)} placeholder="G-XXXXXXXXXX" hint="Trouvable dans Google Analytics > Admin > Flux de données." />
            <Field label="GSC Verification Code" value={settings.gsc_verification_code} onChange={(v) => set("gsc_verification_code", v)} placeholder="google-site-verification=..." hint="Code de vérification HTML de Google Search Console." />
          </div>

          {settings.ga4_measurement_id && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs font-semibold text-green-700 mb-1">✓ GA4 configuré — {settings.ga4_measurement_id}</p>
              <p className="text-xs text-green-600">Le tag sera automatiquement inclus dans votre site après enregistrement.</p>
            </div>
          )}
          {settings.gsc_verification_code && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-700 mb-1">✓ Search Console configuré</p>
              <p className="text-xs text-blue-600">La balise de vérification sera ajoutée à votre site.</p>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Google Analytics", href: "https://analytics.google.com", icon: "📊" },
              { label: "Search Console", href: "https://search.google.com/search-console", icon: "🔍" },
              { label: "PageSpeed Insights", href: "https://pagespeed.web.dev", icon: "⚡" },
              { label: "Structured Data Test", href: "https://search.google.com/test/rich-results", icon: "✅" },
            ].map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs px-3 py-2.5 rounded border border-border hover:bg-secondary hover:border-gold/30 transition-colors">
                <span>{link.icon}</span>{link.label}<ExternalLink size={10} className="ml-auto text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-navy mb-4">📝 Notes SEO internes</h2>
          <textarea rows={5} value={settings.seo_notes} onChange={(e) => set("seo_notes", e.target.value)} placeholder="Notes de suivi SEO : mots-clés à cibler, actions en cours, observations..." className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold resize-none" />
        </div>
      </div>
    </AdminShell>
  )
}
