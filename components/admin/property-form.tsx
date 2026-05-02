"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Plus, ArrowLeft } from "lucide-react"
import type { Property, PropertyType, PropertyStatus } from "@/lib/types"
import { usePropertiesStore } from "@/lib/store"

const BADGE_PRESETS = [
  { label: "Nouveau", value: "Nouveau", color: "bg-gold text-navy" },
  { label: "Coup de cœur", value: "Coup de cœur", color: "bg-navy text-white" },
  { label: "Exclusif", value: "Exclusif", color: "bg-red-600/90 text-white" },
  { label: "Premium", value: "Premium", color: "bg-gold text-navy" },
  { label: "Investissement", value: "Investissement", color: "bg-secondary text-navy border border-gold/30" },
  { label: "Bonne affaire", value: "Bonne affaire", color: "bg-green-700 text-white" },
]

interface Props {
  existing?: Property
}

type FormData = Omit<Property, "id" | "createdAt" | "updatedAt">

function emptyForm(): FormData {
  return {
    type: "F3",
    title: "",
    location: "",
    price: "",
    surface: "",
    rooms: 3,
    condition: "",
    badge: "Nouveau",
    badgeColor: "bg-gold text-navy",
    features: [],
    description: "",
    image: "",
    status: "available",
  }
}

export function PropertyForm({ existing }: Props) {
  const router = useRouter()
  const { addProperty, updateProperty } = usePropertiesStore()
  const isEdit = Boolean(existing)

  const [form, setForm] = useState<FormData>(
    existing
      ? {
          type: existing.type,
          title: existing.title,
          location: existing.location,
          price: existing.price,
          surface: existing.surface,
          rooms: existing.rooms,
          condition: existing.condition,
          badge: existing.badge,
          badgeColor: existing.badgeColor,
          features: [...existing.features],
          description: existing.description,
          image: existing.image,
          status: existing.status,
        }
      : emptyForm()
  )
  const [newFeature, setNewFeature] = useState("")
  const [imagePreview, setImagePreview] = useState<string>(existing?.image ?? "")
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setImagePreview(dataUrl)
      set("image", dataUrl)
    }
    reader.readAsDataURL(file)
  }

  function addFeature() {
    if (!newFeature.trim()) return
    set("features", [...form.features, newFeature.trim()])
    setNewFeature("")
  }

  function removeFeature(idx: number) {
    set("features", form.features.filter((_, i) => i !== idx))
  }

  function selectBadge(preset: (typeof BADGE_PRESETS)[0]) {
    set("badge", preset.value)
    set("badgeColor", preset.color)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    if (isEdit && existing) {
      updateProperty(existing.id, form)
    } else {
      addProperty(form)
    }
    setSaving(false)
    router.push("/admin/properties")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => router.push("/admin/properties")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-navy transition-colors w-fit"
      >
        <ArrowLeft size={15} /> Retour aux biens
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: main fields */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-5">Informations principales</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => set("type", e.target.value as PropertyType)}
                  className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
                >
                  {["F2", "F3", "F4", "F5+"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Statut</label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as PropertyStatus)}
                  className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="available">Disponible</option>
                  <option value="reserved">Réservé</option>
                  <option value="sold">Vendu</option>
                </select>
              </div>

              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Titre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: F3 Centre-Ville Oran"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Quartier / Localisation *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bir El Djir, Oran"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Prix *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 12 500 000 DA"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Surface */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Surface</label>
                <input
                  type="text"
                  placeholder="Ex: 78 m²"
                  value={form.surface}
                  onChange={(e) => set("surface", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Rooms */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Nombre de pièces</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.rooms}
                  onChange={(e) => set("rooms", Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">État</label>
                <input
                  type="text"
                  placeholder="Ex: Rénové, Neuf, À rénover..."
                  value={form.condition}
                  onChange={(e) => set("condition", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Description</label>
                <textarea
                  rows={4}
                  placeholder="Description détaillée du bien..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-4">Caractéristiques</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Ex: Terrasse, Parking, Vue mer..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                className="flex-1 px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <button type="button" onClick={addFeature} className="btn-primary text-sm px-4 py-2.5 gap-1.5">
                <Plus size={14} /> Ajouter
              </button>
            </div>
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.features.map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-secondary text-navy text-xs px-3 py-1.5 rounded-full">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)} className="text-muted-foreground hover:text-red-600 transition-colors">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: image + badge */}
        <div className="flex flex-col gap-5">
          {/* Image upload */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-4">Photo principale</h2>
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden aspect-[4/3] mb-3">
                <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(""); set("image", "") }}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  aria-label="Supprimer l'image"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full aspect-[4/3] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-gold hover:text-navy transition-colors duration-200 mb-3"
              >
                <Upload size={24} />
                <span className="text-xs font-medium">Cliquer pour uploader</span>
                <span className="text-[11px]">JPG, PNG, WEBP</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />

            {/* Or paste URL */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Ou coller une URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={(e) => { set("image", e.target.value); setImagePreview(e.target.value) }}
                className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-navy mb-4">Badge</h2>
            <div className="grid grid-cols-2 gap-2">
              {BADGE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => selectBadge(preset)}
                  className={`text-xs font-semibold px-2 py-2 rounded border-2 transition-all duration-150 ${preset.color} ${
                    form.badge === preset.value ? "ring-2 ring-offset-1 ring-gold scale-105" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="btn-primary justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                Enregistrement...
              </span>
            ) : isEdit ? "Enregistrer les modifications" : "Publier le bien"}
          </button>
        </div>
      </div>
    </form>
  )
}
