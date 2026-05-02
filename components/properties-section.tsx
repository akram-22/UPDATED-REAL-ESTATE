"use client"

import { useState } from "react"
import { MapPin, Maximize2, Bed, Play, CheckCircle2 } from "lucide-react"
import { usePropertiesStore, useContentStore } from "@/lib/store"
import type { Property } from "@/lib/types"

const filters = ["Tous", "F2", "F3", "F4"]

export function PropertiesSection() {
  const { properties } = usePropertiesStore()
  const { content } = useContentStore()
  const [active, setActive] = useState("Tous")

  const whatsappNumber = content.contact.whatsappNumber
  const WHATSAPP_BASE = `https://wa.me/${whatsappNumber}?text=Bonjour%20Chabane%2C%20je%20suis%20int%C3%A9ress%C3%A9(e)%20par%20ce%20bien%20:`

  // Only show available properties on the public site
  const visible = properties.filter((p) => p.status === "available")
  const filtered = active === "Tous" ? visible : visible.filter((p) => p.type === active)

  return (
    <section id="properties" className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="section-divider" />
              <span className="text-gold text-xs font-medium tracking-widest uppercase">Biens disponibles</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy text-balance">
              Sélection actuelle de biens
              <br />
              <span className="text-gold">à Oran</span>
            </h2>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-all duration-150 ${
                  active === f
                    ? "bg-navy text-white shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-semibold text-navy text-lg mb-2">Aucun bien disponible pour le moment.</p>
            <p className="text-sm">Contactez-moi directement pour connaître les biens disponibles.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} whatsappBase={WHATSAPP_BASE} whatsappNumber={whatsappNumber} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 text-center bg-cream border border-border rounded-lg p-8">
          <p className="font-serif text-xl font-semibold text-navy mb-2 text-balance">
            Vous ne trouvez pas ce que vous cherchez ?
          </p>
          <p className="text-muted-foreground text-sm mb-6 text-pretty">
            J&apos;ai accès à des biens qui ne sont pas encore publiés. Dites-moi vos critères et je vous trouve votre perle rare.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Bonjour%20Chabane%2C%20je%20cherche%20un%20bien%20pr%C3%A9cis%20%C3%A0%20Oran.`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            <WhatsAppIcon />
            Décrire mon bien idéal
          </a>
        </div>
      </div>
    </section>
  )
}

function PropertyCard({ property, whatsappBase, whatsappNumber }: { property: Property; whatsappBase: string; whatsappNumber: string }) {
  const whatsappMsg = `${whatsappBase}%20${encodeURIComponent(property.title)}`

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.image || "https://placehold.co/600x400?text=Appartement+Oran"}
          alt={`${property.title} — à ${property.location}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${property.badgeColor}`}>
          {property.badge}
        </span>
        {/* Video tour overlay */}
        <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <a
            href={`https://wa.me/${whatsappNumber}?text=Bonjour%2C%20je%20veux%20une%20visite%20vid%C3%A9o%20de%20${encodeURIComponent(property.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-navy text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-gold hover:text-navy transition-colors duration-150"
          >
            <Play size={12} fill="currentColor" />
            Visite vidéo
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-2">
          <MapPin size={11} className="text-gold" />
          {property.location}
        </div>
        <h3 className="font-serif font-bold text-navy text-lg leading-snug mb-1">{property.title}</h3>
        <div className="text-gold font-bold text-xl mb-4">{property.price}</div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          {property.surface && (
            <span className="flex items-center gap-1">
              <Maximize2 size={11} className="text-gold" />
              {property.surface}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bed size={11} className="text-gold" />
            {property.rooms} pièces
          </span>
          {property.condition && (
            <span className="bg-secondary text-navy px-2 py-0.5 rounded-full font-medium">
              {property.condition}
            </span>
          )}
        </div>

        {property.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {property.features.map((f) => (
              <span key={f} className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                <CheckCircle2 size={9} className="text-gold" />
                {f}
              </span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-2 mt-auto">
          <a href={whatsappMsg} target="_blank" rel="noopener noreferrer" className="whatsapp-btn justify-center text-xs py-3">
            <WhatsAppIcon />
            Obtenir les détails
          </a>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Bonjour%2C%20je%20veux%20une%20visite%20vid%C3%A9o%20de%20${encodeURIComponent(property.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-navy hover:text-gold transition-colors duration-150 py-2"
          >
            <Play size={11} />
            Demander la visite vidéo
          </a>
        </div>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
