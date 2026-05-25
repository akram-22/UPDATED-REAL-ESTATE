"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Play, Bed, Maximize } from "lucide-react"
import type { Property, SiteContent } from "@/lib/types"

const STATUS_LABELS: Record<string, string> = { available: "Disponible", reserved: "Réservé", sold: "Vendu" }
const STATUS_COLORS: Record<string, string> = { available: "#16a34a", reserved: "#d97706", sold: "#dc2626" }

function PropertyCard({ property }: { property: Property }) {
  const router = useRouter()
  const images = property.images || []
  const [imgIdx, setImgIdx] = useState(0)

  return (
    <div onClick={() => router.push(`/properties/${property.id}`)}
      style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "all 0.3s", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      onMouseOver={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)"; el.style.borderColor = "rgba(201,168,76,0.4)" }}
      onMouseOut={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; el.style.borderColor = "#e5e7eb" }}>

      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#0a1628", overflow: "hidden" }}>
        {images.length > 0
          ? <img src={images[imgIdx]} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontFamily: "Georgia, serif", fontSize: "13px" }}>Pas de photo</div>
        }
        <span style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#c9a84c", color: "#0a1628", fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "100px", fontFamily: "Georgia, serif", letterSpacing: "1px" }}>{property.badge}</span>
        <span style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: STATUS_COLORS[property.status], color: "white", fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "100px" }}>{STATUS_LABELS[property.status]}</span>
        {property.video_url && (
          <div style={{ position: "absolute", bottom: "10px", right: "10px", backgroundColor: "var(--gold)", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={12} fill="#0a1628" color="#0a1628" />
          </div>
        )}
        {images.length > 1 && (
          <div style={{ position: "absolute", bottom: "10px", left: "10px", backgroundColor: "rgba(0,0,0,0.5)", color: "white", fontSize: "10px", padding: "2px 8px", borderRadius: "100px", fontFamily: "Georgia, serif" }}>
            {images.length} photos
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
          <h3 style={{ fontFamily: "Georgia, serif", fontWeight: "700", color: "#0a1628", fontSize: "15px", lineHeight: "1.3" }}>{property.title}</h3>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#0a1628", backgroundColor: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", padding: "2px 8px", borderRadius: "4px", flexShrink: 0, fontFamily: "Georgia, serif" }}>{property.type}</span>
        </div>
        <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "4px" }}>📍 {property.location}</p>
        {property.residence_name && <p style={{ color: "#6b7280", fontSize: "11px", marginBottom: "8px" }}>🏢 {property.residence_name}</p>}

        <div style={{ display: "flex", gap: "12px", marginBottom: "12px", color: "#9ca3af", fontSize: "12px" }}>
          {property.surface && <span>📐 {property.surface}</span>}
          {property.rooms && <span>🛏 {property.rooms} pcs</span>}
          {property.condition && <span style={{ backgroundColor: "#f3f4f6", padding: "1px 8px", borderRadius: "4px" }}>{property.condition}</span>}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: "700", color: "var(--gold)" }}>{property.price}</span>
          <span style={{ fontSize: "12px", color: "var(--gold)", fontFamily: "Georgia, serif", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "4px" }}>
            Voir détails →
          </span>
        </div>
      </div>
    </div>
  )
}

export function PropertiesSection({ properties, content }: { properties: Property[]; content: SiteContent }) {
  const available = properties.filter((p) => p.status !== "sold")
  if (available.length === 0) return null

  return (
    <section id="properties" style={{ padding: "80px 0", backgroundColor: "#ffffff" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "1px", backgroundColor: "var(--gold)" }} />
            <span style={{ color: "var(--gold)", fontSize: "11px", letterSpacing: "5px", fontFamily: "Georgia, serif" }}>BIENS DISPONIBLES</span>
            <div style={{ width: "32px", height: "1px", backgroundColor: "var(--gold)" }} />
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: "700", color: "#0a1628", marginBottom: "12px" }}>
            Les biens <span style={{ color: "var(--gold)" }}>du moment</span>
          </h2>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>{available.length} bien(s) disponible(s) à Oran — Cliquez pour voir les détails</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {available.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      </div>
    </section>
  )
}
