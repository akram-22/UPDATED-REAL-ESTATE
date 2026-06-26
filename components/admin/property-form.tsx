"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, X, Save, HelpCircle } from "lucide-react"
import type { Property, PropertyType, PropertyStatus } from "@/lib/types"
import { createProperty, updateProperty } from "@/lib/db"
import { MediaUpload } from "./media-upload"

const BADGE_PRESETS = [
  { label: "Nouveau", value: "Nouveau", color: "bg-gold text-navy" },
  { label: "Coup de cœur", value: "Coup de cœur", color: "bg-navy text-white" },
  { label: "Exclusif", value: "Exclusif", color: "bg-red-600/90 text-white" },
  { label: "Premium", value: "Premium", color: "bg-gold text-navy" },
  { label: "Investissement", value: "Investissement", color: "bg-secondary text-navy border border-gold/30" },
  { label: "Bonne affaire", value: "Bonne affaire", color: "bg-green-700 text-white" },
]

type FormData = Omit<Property, "id" | "created_at" | "updated_at">

function emptyForm(): FormData {
  return {
    type: "F3", title: "", location: "", price: "", surface: "",
    rooms: 3, condition: "", badge: "Nouveau", badge_color: "bg-gold text-navy",
    features: [], description: "", images: [], video_url: "",
    residence_name: "", developer: "", block: "", floor: "", status: "available",
    seo_title: "", meta_description: "", og_title: "", og_description: "", og_image: "", canonical_url: "",
  }
}

function Field({ label, value, onChange, placeholder = "", required = false, multiline = false }: {
  label: string; value: string | number; onChange: (v: string) => void
  placeholder?: string; required?: boolean; multiline?: boolean
}) {
  const cls = "w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
  return (
    <div>
      <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">{label}{required && " *"}</label>
      {multiline
        ? <textarea rows={3} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-none`} />
        : <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      }
    </div>
  )
}

export function PropertyForm({ existing }: { existing?: Property }) {
  const router = useRouter()
  const isEdit = Boolean(existing)
  const [form, setForm] = useState<FormData>(existing ? {
    type: existing.type, title: existing.title, location: existing.location,
    price: existing.price, surface: existing.surface, rooms: existing.rooms,
    condition: existing.condition, badge: existing.badge, badge_color: existing.badge_color,
    features: [...(existing.features || [])], description: existing.description,
    images: [...(existing.images || [])], video_url: existing.video_url || "",
    residence_name: existing.residence_name || "", developer: existing.developer || "",
    block: existing.block || "", floor: existing.floor || "", status: existing.status,
    seo_title: existing.seo_title || "", meta_description: existing.meta_description || "",
    og_title: existing.og_title || "", og_description: existing.og_description || "",
    og_image: existing.og_image || "", canonical_url: existing.canonical_url || "",
  } : emptyForm())
  const [newFeature, setNewFeature] = useState("")
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function addFeature() {
    if (!newFeature.trim()) return
    set("features", [...form.features, newFeature.trim()])
    setNewFeature("")
  }

  async function handleSubmit() {
    const errs: string[] = []
    if (!form.title.trim()) errs.push("Le titre est obligatoire")
    if (!form.location.trim()) errs.push("La localisation est obligatoire")
    if (!form.price.trim()) errs.push("Le prix est obligatoire")
    if (errs.length > 0) { setErrors(errs); return }
    setErrors([])
    setSaving(true)
    if (isEdit && existing) {
      await updateProperty(existing.id, form)
    } else {
      await createProperty(form)
    }
    setSaving(false)
    router.push("/admin/properties")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={() => router.push("/admin/properties")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-navy w-fit">
        <ArrowLeft size={15} /> Retour aux biens
      </button>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          {errors.map((e) => <p key={e} className="text-red-700 text-sm">{e}</p>)}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Main info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-5">Informations principales</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Type</label>
                <select value={form.type} onChange={(e) => set("type", e.target.value as PropertyType)} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold">
                  {["F2","F3","F4","F5+"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Statut</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value as PropertyStatus)} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold">
                  <option value="available">Disponible</option>
                  <option value="reserved">Réservé</option>
                  <option value="sold">Vendu</option>
                </select>
              </div>
              <div className="sm:col-span-2"><Field label="Titre" required value={form.title} onChange={(v) => set("title", v)} placeholder="Ex: F3 Centre-Ville Oran" /></div>
              <Field label="Localisation" required value={form.location} onChange={(v) => set("location", v)} placeholder="Ex: Bir El Djir, Oran" />
              <Field label="Prix" required value={form.price} onChange={(v) => set("price", v)} placeholder="Ex: 12 500 000 DA" />
              <Field label="Surface" value={form.surface} onChange={(v) => set("surface", v)} placeholder="Ex: 78 m²" />
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Pièces</label>
                <input type="number" min={1} max={10} value={form.rooms} onChange={(e) => set("rooms", Number(e.target.value))} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
              </div>
              <Field label="État" value={form.condition} onChange={(v) => set("condition", v)} placeholder="Ex: Rénové, Neuf..." />
              <div className="sm:col-span-2"><Field label="Description" value={form.description} onChange={(v) => set("description", v)} multiline placeholder="Description détaillée..." /></div>
            </div>
          </div>

          {/* Residence info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-5">Résidence & Promoteur</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nom de la résidence" value={form.residence_name} onChange={(v) => set("residence_name", v)} placeholder="Ex: Résidence Olympique" />
              <Field label="Promoteur / Développeur" value={form.developer} onChange={(v) => set("developer", v)} placeholder="Ex: EURL Classique Immo" />
              <Field label="Bloc (optionnel)" value={form.block} onChange={(v) => set("block", v)} placeholder="Ex: Bloc A" />
              <Field label="Étage (optionnel)" value={form.floor} onChange={(v) => set("floor", v)} placeholder="Ex: 5ème étage" />
            </div>
          </div>

          {/* Features */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-4">Caractéristiques</h2>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Ex: Terrasse, Parking..." value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} className="flex-1 px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
              <button type="button" onClick={addFeature} className="btn-primary text-sm px-4 py-2.5 gap-1.5"><Plus size={14} /> Ajouter</button>
            </div>
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.features.map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-secondary text-navy text-xs px-3 py-1.5 rounded-full">
                    {f}
                    <button type="button" onClick={() => set("features", form.features.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-600"><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Media */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-4">Photos & Vidéo</h2>
            <MediaUpload
              images={form.images}
              videoUrl={form.video_url}
              onImagesChange={(urls) => set("images", urls)}
              onVideoChange={(url) => set("video_url", url)}
            />
          </div>

          {/* Badge */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-4">Badge</h2>
            <div className="grid grid-cols-2 gap-2">
              {BADGE_PRESETS.map((preset) => (
                <button key={preset.value} type="button" onClick={() => { set("badge", preset.value); set("badge_color", preset.color) }}
                  className={`text-xs font-semibold px-2 py-2 rounded border-2 transition-all ${preset.color} ${form.badge === preset.value ? "ring-2 ring-offset-1 ring-gold scale-105" : "opacity-70 hover:opacity-100"}`}>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ */}
          {existing && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-navy mb-2">FAQ de ce bien</h2>
              <p className="text-xs text-muted-foreground mb-3">Répondez aux questions fréquentes des acheteurs pour ce bien précis.</p>
              <Link href={`/admin/faq?attach_type=property&attach_ref=${existing.id}`} className="flex items-center gap-1.5 text-sm text-gold hover:text-navy transition-colors">
                <HelpCircle size={14} />Gérer les FAQ
              </Link>
            </div>
          )}

          {/* SEO & Open Graph */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-1">🔍 SEO & Open Graph</h2>
            <p className="text-muted-foreground text-xs mb-4">Ces champs remplacent les valeurs générées automatiquement.</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Titre SEO</label>
                <div className="relative"><input type="text" value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} maxLength={65} placeholder={`${form.title} — ${form.location} | CHABANO`} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{(form.seo_title || "").length}/60</span></div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Meta description</label>
                <textarea rows={2} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} maxLength={165} placeholder={`${form.type}${form.surface ? ` de ${form.surface}` : ""} à vendre à ${form.location || "Oran"}...`} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:border-gold" />
                <div className="text-xs text-right text-muted-foreground">{(form.meta_description || "").length}/160</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Titre OG (partage WhatsApp/Facebook)</label>
                <input type="text" value={form.og_title} onChange={(e) => set("og_title", e.target.value)} placeholder={form.seo_title || form.title} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Description OG</label>
                <textarea rows={2} value={form.og_description} onChange={(e) => set("og_description", e.target.value)} placeholder={form.meta_description} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:border-gold" />
              </div>
            </div>
          </div>

          {/* Save */}
          <button type="button" onClick={handleSubmit} disabled={saving} className="btn-primary justify-center py-4 text-base disabled:opacity-60">
            {saving ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Publier le bien"}
          </button>
        </div>
      </div>
    </div>
  )
}
