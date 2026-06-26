"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, ArrowLeft, Eye } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getNeighborhoods, createNeighborhood, updateNeighborhood, deleteNeighborhood } from "@/lib/db"
import { ImageUpload } from "@/components/admin/image-upload"
import type { Neighborhood } from "@/lib/types"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://updated-real-estate.vercel.app"

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
}

function emptyForm(): Omit<Neighborhood, "id" | "created_at" | "updated_at"> {
  return { name: "", slug: "", intro: "", amenities: [], cover_image: "", cover_alt: "", seo_title: "", meta_description: "", og_title: "", og_description: "", og_image: "", position: 0 }
}

function Field({ label, value, onChange, multiline = false, placeholder = "", hint = "", maxLen = 0 }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string; hint?: string; maxLen?: number }) {
  const len = value?.length || 0
  const over = maxLen > 0 && len > maxLen
  const cls = `w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors ${over ? "border-red-400" : ""}`
  return (
    <div>
      <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">{label}</label>
      {hint && <p className="text-muted-foreground text-xs mb-1.5">{hint}</p>}
      {multiline ? <textarea rows={3} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-none`} /> : <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
      {maxLen > 0 && <div className={`text-xs mt-1 text-right ${over ? "text-red-500" : "text-muted-foreground"}`}>{len}/{maxLen} {over && "⚠ trop long"}</div>}
    </div>
  )
}

export default function AdminNeighborhoodsPage() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [newAmenity, setNewAmenity] = useState("")

  function load() { getNeighborhoods().then((n) => { setNeighborhoods(n); setLoading(false) }) }
  useEffect(() => { load() }, [])

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function startCreate() { setForm(emptyForm()); setEditingId(null); setCreating(true) }
  function startEdit(n: Neighborhood) {
    setForm({ name: n.name, slug: n.slug, intro: n.intro, amenities: [...(n.amenities || [])], cover_image: n.cover_image, cover_alt: n.cover_alt, seo_title: n.seo_title, meta_description: n.meta_description, og_title: n.og_title, og_description: n.og_description, og_image: n.og_image, position: n.position })
    setEditingId(n.id); setCreating(false)
  }
  function resetForm() { setEditingId(null); setCreating(false); setForm(emptyForm()) }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) return
    setSaving(true)
    if (editingId) await updateNeighborhood(editingId, form)
    else await createNeighborhood(form)
    setSaving(false); resetForm(); load()
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce quartier ?")) return
    await deleteNeighborhood(id); load()
  }

  const formOpen = creating || editingId !== null

  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Pages Quartiers</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Pages SEO dédiées pour chaque quartier d'Oran — classement local garanti.</p>
        </div>
        {!formOpen && <button onClick={startCreate} className="btn-primary gap-2 text-sm whitespace-nowrap"><Plus size={16} />Nouveau quartier</button>}
      </div>

      {loading ? <div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div> : (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {neighborhoods.length === 0 && !formOpen && (
              <div className="text-center py-16 bg-card border border-border rounded-xl text-muted-foreground">
                <p className="text-4xl mb-3">🏙️</p>
                <p className="font-semibold mb-1">Aucun quartier</p>
                <p className="text-sm mb-4">Créez des pages pour Bir El Djir, Akid Lotfi, Es Senia...</p>
                <button onClick={startCreate} className="btn-primary gap-2 mx-auto text-sm"><Plus size={14} />Créer</button>
              </div>
            )}
            {neighborhoods.map((n) => (
              <div key={n.id} className={`bg-card border rounded-xl p-4 transition-colors ${editingId === n.id ? "border-gold" : "border-border"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-navy">{n.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">/quartiers/{n.slug}</div>
                    {n.intro && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.intro}</p>}
                    {n.amenities?.length > 0 && <p className="text-xs text-gold mt-1">{n.amenities.length} équipement(s)</p>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <a href={`/quartiers/${n.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded border border-border hover:bg-secondary transition-colors"><Eye size={13} /></a>
                    <button onClick={() => startEdit(n)} className="p-1.5 rounded border border-border hover:bg-secondary transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(n.id)} className="p-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          {formOpen && (
            <div className="lg:col-span-3 flex flex-col gap-5">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-navy mb-5">{editingId ? "Modifier le quartier" : "Nouveau quartier"}</h2>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Nom du quartier" value={form.name} onChange={(v) => { set("name", v); if (!editingId) set("slug", slugify(v)) }} placeholder="Ex: Bir El Djir" />
                    <Field label="Slug URL" value={form.slug} onChange={(v) => set("slug", slugify(v))} placeholder="bir-el-djir" />
                  </div>
                  <Field label="Introduction" value={form.intro} onChange={(v) => set("intro", v)} multiline placeholder="Présentation du quartier pour vos visiteurs..." hint="Présentez le quartier, ses atouts, son ambiance." />
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Équipements à proximité</label>
                    <div className="flex gap-2 mb-2">
                      <input type="text" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const t = newAmenity.trim(); if (t && !form.amenities.includes(t)) { set("amenities", [...form.amenities, t]); setNewAmenity("") } } }} placeholder="Ex: École, Mosquée, Marché..." className="flex-1 px-3 py-2.5 rounded-sm border border-border bg-background text-sm focus:outline-none focus:border-gold" />
                      <button type="button" onClick={() => { const t = newAmenity.trim(); if (t && !form.amenities.includes(t)) { set("amenities", [...form.amenities, t]); setNewAmenity("") } }} className="btn-primary text-sm px-3"><Plus size={14} /></button>
                    </div>
                    {form.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.amenities.map((a, i) => (
                          <span key={i} className="flex items-center gap-1.5 bg-secondary text-navy text-xs px-3 py-1.5 rounded-full">
                            {a}<button type="button" onClick={() => set("amenities", form.amenities.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-600 ml-0.5">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Image de couverture</label>
                    <ImageUpload label="" value={form.cover_image} onChange={(url) => set("cover_image", url)} />
                    {form.cover_image && <input type="text" value={form.cover_alt} onChange={(e) => set("cover_alt", e.target.value)} placeholder="Texte alternatif (pour le SEO)" className="w-full mt-2 px-3 py-2 rounded-sm border border-border bg-background text-sm focus:outline-none focus:border-gold" />}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-navy mb-1">🔍 SEO</h2>
                <p className="text-muted-foreground text-xs mb-5">Ces champs apparaissent dans Google.</p>
                <div className="flex flex-col gap-4">
                  <Field label="Titre SEO" value={form.seo_title} onChange={(v) => set("seo_title", v)} placeholder={`Appartements à ${form.name || "..."} Oran | CHABANO`} maxLen={60} />
                  <Field label="Meta description" value={form.meta_description} onChange={(v) => set("meta_description", v)} multiline placeholder={`Découvrez les biens immobiliers à ${form.name || "..."}, Oran. CHABANO vous propose...`} maxLen={160} />
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-navy mb-1">📱 Open Graph (partage WhatsApp/Facebook)</h2>
                <div className="flex flex-col gap-4 mt-4">
                  <Field label="Titre OG" value={form.og_title} onChange={(v) => set("og_title", v)} maxLen={60} />
                  <Field label="Description OG" value={form.og_description} onChange={(v) => set("og_description", v)} multiline maxLen={160} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handleSave} disabled={saving || !form.name.trim() || !form.slug.trim()} className="btn-primary gap-2 flex-1 justify-center">
                  {saving ? "Enregistrement..." : (editingId ? "Mettre à jour" : "Créer le quartier")}
                </button>
                <button onClick={resetForm} className="px-4 py-2.5 rounded border border-border hover:bg-secondary text-sm transition-colors">Annuler</button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  )
}
