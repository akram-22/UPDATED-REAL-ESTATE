"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X } from "lucide-react"
import type { Promotion } from "@/lib/types"
import { createPromotion, updatePromotion } from "@/lib/db"
import { MediaUpload } from "./media-upload"

type FormData = Omit<Promotion, "id" | "created_at" | "updated_at">

function emptyForm(): FormData {
  return {
    title: "", developer: "", location: "", description: "",
    price_from: "", price_to: "", surface_from: "", surface_to: "",
    delivery_date: "", types_available: [], features: [],
    images: [], video_url: "", status: "upcoming", badge: "NOUVEAU",
  }
}

function Field({ label, value, onChange, placeholder = "", multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean
}) {
  const cls = "w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
  return (
    <div>
      <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">{label}</label>
      {multiline
        ? <textarea rows={4} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-none`} />
        : <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      }
    </div>
  )
}

export function PromotionForm({ existing }: { existing?: Promotion }) {
  const router = useRouter()
  const isEdit = Boolean(existing)
  const [form, setForm] = useState<FormData>(existing ? {
    title: existing.title, developer: existing.developer, location: existing.location,
    description: existing.description, price_from: existing.price_from, price_to: existing.price_to,
    surface_from: existing.surface_from, surface_to: existing.surface_to,
    delivery_date: existing.delivery_date, types_available: [...(existing.types_available || [])],
    features: [...(existing.features || [])], images: [...(existing.images || [])],
    video_url: existing.video_url || "", status: existing.status, badge: existing.badge || "NOUVEAU",
  } : emptyForm())
  const [newType, setNewType] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    const errs: string[] = []
    if (!form.title.trim()) errs.push("Le titre est obligatoire")
    if (!form.location.trim()) errs.push("La localisation est obligatoire")
    if (errs.length > 0) { setErrors(errs); return }
    setErrors([])
    setSaving(true)
    if (isEdit && existing) {
      await updatePromotion(existing.id, form)
    } else {
      await createPromotion(form)
    }
    setSaving(false)
    router.push("/admin/promotions")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={() => router.push("/admin/promotions")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-navy w-fit">
        <ArrowLeft size={15} /> Retour aux promotions
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
            <h2 className="font-semibold text-navy mb-5">Informations du projet</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><Field label="Nom du projet *" value={form.title} onChange={(v) => set("title", v)} placeholder="Ex: Résidence Olympique" /></div>
              <Field label="Promoteur / Développeur" value={form.developer} onChange={(v) => set("developer", v)} placeholder="Ex: EURL Classique Immo" />
              <Field label="Localisation *" value={form.location} onChange={(v) => set("location", v)} placeholder="Ex: Bir El Djir, Oran" />
              <Field label="Prix à partir de" value={form.price_from} onChange={(v) => set("price_from", v)} placeholder="Ex: 8 500 000 DA" />
              <Field label="Prix jusqu'à" value={form.price_to} onChange={(v) => set("price_to", v)} placeholder="Ex: 15 000 000 DA" />
              <Field label="Surface min" value={form.surface_from} onChange={(v) => set("surface_from", v)} placeholder="Ex: 65 m²" />
              <Field label="Surface max" value={form.surface_to} onChange={(v) => set("surface_to", v)} placeholder="Ex: 130 m²" />
              <Field label="Date de livraison" value={form.delivery_date} onChange={(v) => set("delivery_date", v)} placeholder="Ex: T4 2026" />
              <Field label="Badge" value={form.badge} onChange={(v) => set("badge", v)} placeholder="Ex: NOUVEAU, EXCLUSIF" />
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Statut</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value as any)} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold">
                  <option value="upcoming">Bientôt disponible</option>
                  <option value="selling">En commercialisation</option>
                  <option value="delivered">Livré</option>
                </select>
              </div>
              <div className="sm:col-span-2"><Field label="Description du projet" value={form.description} onChange={(v) => set("description", v)} multiline placeholder="Décrivez le projet, l'environnement, les atouts..." /></div>
            </div>
          </div>

          {/* Types available */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-4">Types d'appartements disponibles</h2>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Ex: F2, F3, F4, Duplex..." value={newType} onChange={(e) => setNewType(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newType.trim()) { set("types_available", [...form.types_available, newType.trim()]); setNewType("") } } }} className="flex-1 px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
              <button type="button" onClick={() => { if (newType.trim()) { set("types_available", [...form.types_available, newType.trim()]); setNewType("") } }} className="btn-primary text-sm px-4 py-2.5 gap-1.5"><Plus size={14} /> Ajouter</button>
            </div>
            {form.types_available.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.types_available.map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-secondary text-navy text-xs px-3 py-1.5 rounded-full">
                    {t}<button type="button" onClick={() => set("types_available", form.types_available.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-600"><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-4">Prestations & Équipements</h2>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Ex: Piscine, Parking, Gardien 24/7..." value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newFeature.trim()) { set("features", [...form.features, newFeature.trim()]); setNewFeature("") } } }} className="flex-1 px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
              <button type="button" onClick={() => { if (newFeature.trim()) { set("features", [...form.features, newFeature.trim()]); setNewFeature("") } }} className="btn-primary text-sm px-4 py-2.5 gap-1.5"><Plus size={14} /> Ajouter</button>
            </div>
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.features.map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-secondary text-navy text-xs px-3 py-1.5 rounded-full">
                    {f}<button type="button" onClick={() => set("features", form.features.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-600"><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: media + save */}
        <div className="flex flex-col gap-5">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-4">Photos & Vidéo</h2>
            <MediaUpload
              images={form.images}
              videoUrl={form.video_url}
              onImagesChange={(urls) => set("images", urls)}
              onVideoChange={(url) => set("video_url", url)}
            />
          </div>
          <button type="button" onClick={handleSubmit} disabled={saving} className="btn-primary justify-center py-4 text-base disabled:opacity-60">
            {saving ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Publier le projet"}
          </button>
        </div>
      </div>
    </div>
  )
}
