"use client"

import { useRouter } from "next/navigation"
import type { Neighborhood, Property } from "@/lib/types"
import { FAQBlock } from "@/components/faq-block"
import { Breadcrumb } from "@/components/breadcrumb"

const PLACEHOLDER: Record<string, { intro: string; amenities: string[] }> = {
  "akid-lotfi":    { intro: "Akid Lotfi est un quartier résidentiel calme situé à l'ouest d'Oran, prisé pour ses appartements modernes et son accès facile aux commerces et transports.", amenities: ["École primaire", "Marché couvert", "Mosquée", "Transports en commun", "Pharmacie"] },
  "bir-el-djir":  { intro: "Bir El Djir est l'une des communes les plus dynamiques d'Oran, connue pour ses résidences récentes, ses espaces commerciaux et sa forte demande immobilière.", amenities: ["Mall Bir El Djir", "Cliniques privées", "Universités", "Zone commerciale", "Parcs"] },
  "centre-ville": { intro: "Le Centre-Ville d'Oran offre une position stratégique avec un accès direct à toutes les commodités, les administrations et la vie économique oranaise.", amenities: ["Gare centrale", "Hôpitaux", "Banques", "Restaurants", "Ministères"] },
  "es-senia":     { intro: "Es Senia est une commune proche de l'aéroport international d'Oran, offrant d'excellentes opportunités d'investissement dans l'immobilier résidentiel et commercial.", amenities: ["Aéroport international", "Zone industrielle", "Universités", "Marchés", "Hôtels"] },
}

function PropertyCard({ property }: { property: Property }) {
  const router = useRouter()
  const img = (property.images || [])[0]
  return (
    <div onClick={() => router.push(`/properties/${property.id}`)}
      style={{ cursor: "pointer", borderRadius: "10px", overflow: "hidden", border: "1px solid #e5e7eb", backgroundColor: "white", transition: "all 0.2s" }}
      onMouseOver={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; el.style.borderColor = "rgba(201,168,76,0.4)" }}
      onMouseOut={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.borderColor = "#e5e7eb" }}>
      <div style={{ aspectRatio: "4/3", backgroundColor: "#0a1628" }}>
        {img ? <img src={img} alt={property.title} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "12px" }}>Pas de photo</div>}
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "14px", fontWeight: 700, color: "#0a1628", marginBottom: "4px" }}>{property.title}</div>
        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>{property.surface}{property.rooms ? ` · ${property.rooms} pcs` : ""}</div>
        <div style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--gold)" }}>{property.price}</div>
      </div>
    </div>
  )
}

export function NeighborhoodDetailClient({ neighborhood, properties, slug }: { neighborhood: Neighborhood | null; properties: Property[]; slug: string }) {
  const placeholder = PLACEHOLDER[slug] || { intro: "", amenities: [] }
  const name = neighborhood?.name || slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  const intro = neighborhood?.intro || placeholder.intro
  const amenities = neighborhood?.amenities?.length ? neighborhood.amenities : placeholder.amenities
  const coverImage = neighborhood?.cover_image

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <header style={{ backgroundColor: "#0a1628", borderBottom: "1px solid rgba(201,168,76,0.2)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ height: "2px", background: "var(--gold)" }} />
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 20px", height: "60px", display: "flex", alignItems: "center", gap: "16px" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "13px", textDecoration: "none" }}>← Accueil</a>
          <div style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "16px", fontWeight: 700, color: "#ffffff", letterSpacing: "4px" }}>CHABANO</div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ position: "relative", height: "320px", backgroundColor: "#0a1628", overflow: "hidden" }}>
        {coverImage && <img src={coverImage} alt={`${name}, Oran`} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,22,40,0.4), rgba(10,22,40,0.85))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "32px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ width: "24px", height: "1px", backgroundColor: "var(--gold)" }} />
            <span style={{ color: "var(--gold)", fontSize: "10px", letterSpacing: "4px", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif" }}>QUARTIER · ORAN</span>
          </div>
          <h1 style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "40px", fontWeight: 800, color: "white", lineHeight: 1.15, letterSpacing: "-0.03em" }}>Immobilier à {name}</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", marginTop: "10px" }}>CHABANO — Owning Wahran</p>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 20px 80px" }}>
        <div style={{ marginBottom: "32px" }}>
          <Breadcrumb items={[{ name: "Quartiers", path: "/quartiers" }, { name, path: `/quartiers/${slug}` }]} />
        </div>

        {/* Intro */}
        {intro && (
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "28px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "20px", fontWeight: 700, color: "#0a1628", marginBottom: "12px" }}>Le quartier {name}</h2>
            <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.8" }}>{intro}</p>
          </div>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "28px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "18px", fontWeight: 700, color: "#0a1628", marginBottom: "16px" }}>Équipements à proximité</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {amenities.map((a) => (
                <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(201,168,76,0.08)", color: "#0a1628", border: "1px solid rgba(201,168,76,0.25)", padding: "7px 14px", borderRadius: "100px", fontSize: "13px", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif" }}>✓ {a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Available properties */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "24px", height: "1px", backgroundColor: "var(--gold)" }} />
            <span style={{ color: "var(--gold)", fontSize: "10px", letterSpacing: "4px", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif" }}>BIENS DISPONIBLES</span>
          </div>
          {properties.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
              <p style={{ color: "#9ca3af", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif" }}>Aucun bien disponible dans ce quartier pour le moment.</p>
              <a href={`https://wa.me/213541029014?text=Bonjour Chabane, je cherche un bien à ${name}, Oran.`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "16px", backgroundColor: "#0a1628", color: "white", padding: "10px 24px", borderRadius: "6px", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "13px", textDecoration: "none" }}>
                Contacter Chabane pour ce quartier
              </a>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
              {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>

        {/* FAQ */}
        {neighborhood && <FAQBlock attachType="page" attachRef={`neighborhood-${neighborhood.slug}`} />}

        {/* CTA */}
        <div style={{ backgroundColor: "#0a1628", borderRadius: "12px", padding: "28px", borderTop: "3px solid var(--gold)", textAlign: "center", marginTop: "32px" }}>
          <p style={{ color: "var(--gold)", fontSize: "11px", letterSpacing: "4px", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", marginBottom: "8px" }}>VOTRE EXPERT LOCAL À {name.toUpperCase()}</p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "18px", marginBottom: "20px" }}>Vous cherchez ou vendez un bien dans ce quartier ?</p>
          <a href={`https://wa.me/213541029014?text=Bonjour Chabane, je suis intéressé par l'immobilier à ${name}, Oran.`} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{ justifyContent: "center", display: "inline-flex" }}>
            Parler à Chabane
          </a>
        </div>
      </div>
    </div>
  )
}
