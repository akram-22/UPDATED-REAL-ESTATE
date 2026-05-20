"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Bed, Maximize, Play } from "lucide-react"
import type { Property, SiteContent } from "@/lib/types"

const STATUS_LABELS: Record<string, string> = { available: "Disponible", reserved: "Réservé", sold: "Vendu" }
const STATUS_COLORS: Record<string, string> = { available: "bg-green-500", reserved: "bg-yellow-500", sold: "bg-red-500" }

function PropertyCard({ property, onContact }: { property: Property; onContact: (p: Property) => void }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const images = property.images && property.images.length > 0 ? property.images : []
  const hasMultiple = images.length > 1

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Media */}
      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
        {showVideo && property.video_url ? (
          <video src={property.video_url} controls autoPlay className="w-full h-full object-cover" />
        ) : images.length > 0 ? (
          <img src={images[imgIdx]} alt={property.title} className="w-full h-full object-cover transition-opacity duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Pas de photo</div>
        )}

        {/* Badge */}
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${property.badge_color}`}>{property.badge}</span>

        {/* Status */}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full text-white ${STATUS_COLORS[property.status]}`}>{STATUS_LABELS[property.status]}</span>

        {/* Image navigation */}
        {hasMultiple && !showVideo && (
          <>
            <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"><ChevronLeft size={16} /></button>
            <button onClick={() => setImgIdx((i) => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"><ChevronRight size={16} /></button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? "bg-white" : "bg-white/50"}`} />)}
            </div>
          </>
        )}

        {/* Video button */}
        {property.video_url && !showVideo && (
          <button onClick={() => setShowVideo(true)} className="absolute bottom-3 right-3 bg-gold text-navy rounded-full p-2 shadow-lg hover:bg-white transition-colors">
            <Play size={14} fill="currentColor" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif font-bold text-navy text-base leading-snug">{property.title}</h3>
          <span className="text-xs font-bold text-navy bg-secondary px-2 py-1 rounded flex-shrink-0">{property.type}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">📍 {property.location}</p>
        {property.residence_name && <p className="text-xs text-muted-foreground mb-1">🏢 {property.residence_name}{property.developer ? ` · ${property.developer}` : ""}</p>}
        {(property.block || property.floor) && <p className="text-xs text-muted-foreground mb-2">{property.block && `Bloc ${property.block}`}{property.block && property.floor && " · "}{property.floor && `${property.floor}`}</p>}

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          {property.surface && <span className="flex items-center gap-1"><Maximize size={11} />{property.surface}</span>}
          {property.rooms && <span className="flex items-center gap-1"><Bed size={11} />{property.rooms} pièces</span>}
          {property.condition && <span className="bg-secondary px-2 py-0.5 rounded">{property.condition}</span>}
        </div>

        {property.features && property.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {property.features.slice(0, 3).map((f) => (
              <span key={f} className="text-[10px] bg-gold/10 text-navy border border-gold/20 px-2 py-0.5 rounded-full">{f}</span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-3">
          <div className="font-serif text-xl font-bold text-gold">{property.price}</div>
          <button onClick={() => onContact(property)} className="whatsapp-btn text-xs px-3 py-2">
            <WaIcon />Contacter
          </button>
        </div>
      </div>
    </div>
  )
}

export function PropertiesSection({ properties, content }: { properties: Property[]; content: SiteContent }) {
  const { contact } = content
  const available = properties.filter((p) => p.status !== "sold")

  function handleContact(p: Property) {
    const msg = `Bonjour Chabane, je suis intéressé par le bien : ${p.title} (${p.price}) à ${p.location}.`
    window.open(`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  if (available.length === 0) return null

  return (
    <section id="properties" className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" /><span className="text-gold text-xs font-medium tracking-widest uppercase">Biens disponibles</span><div className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Les biens <span className="text-gold">du moment</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{available.length} bien(s) disponible(s) à Oran</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {available.map((p) => <PropertyCard key={p.id} property={p} onContact={handleContact} />)}
        </div>
      </div>
    </section>
  )
}

function WaIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
