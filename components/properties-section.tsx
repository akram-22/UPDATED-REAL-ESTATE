"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Play, X, Bed, Maximize, Phone } from "lucide-react"
import type { Property, SiteContent } from "@/lib/types"

const STATUS_LABELS: Record<string, string> = { available: "Disponible", reserved: "Réservé", sold: "Vendu" }
const STATUS_COLORS: Record<string, string> = { available: "#16a34a", reserved: "#d97706", sold: "#dc2626" }

function PropertyModal({ property, onClose, whatsappNumber }: { property: Property; onClose: () => void; whatsappNumber: string }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const images = property.images || []
  const WA = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour Chabane, je suis intéressé par : ${property.title} (${property.price}) à ${property.location}.`)}`

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={onClose}>
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflow: "auto", position: "relative" }}
        onClick={(e) => e.stopPropagation()}>

        {/* Close button */}
        <button onClick={onClose} style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
          <X size={18} />
        </button>

        {/* Media section */}
        <div style={{ position: "relative", aspectRatio: "16/9", backgroundColor: "#0a1628", borderRadius: "12px 12px 0 0", overflow: "hidden" }}>
          {showVideo && property.video_url ? (
            <video src={property.video_url} controls autoPlay style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : images.length > 0 ? (
            <img src={images[imgIdx]} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontFamily: "Georgia, serif" }}>Pas de photo</div>
          )}

          {/* Image navigation */}
          {images.length > 1 && !showVideo && (
            <>
              <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
                <ChevronRight size={18} />
              </button>
              <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
                {images.map((_, i) => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: i === imgIdx ? "white" : "rgba(255,255,255,0.4)" }} />)}
              </div>
            </>
          )}

          {/* Video button */}
          {property.video_url && !showVideo && (
            <button onClick={() => setShowVideo(true)}
              style={{ position: "absolute", bottom: "12px", right: "12px", background: "var(--gold)", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0a1628" }}>
              <Play size={16} fill="currentColor" />
            </button>
          )}

          {/* Badge */}
          <span style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#c9a84c", color: "#0a1628", fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "100px", fontFamily: "Georgia, serif", letterSpacing: "1px" }}>{property.badge}</span>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "700", color: "#0a1628", marginBottom: "4px" }}>{property.title}</h2>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>📍 {property.location}</p>
              {property.residence_name && <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>🏢 {property.residence_name}{property.developer ? ` · ${property.developer}` : ""}</p>}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: "700", color: "var(--gold)" }}>{property.price}</div>
              <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "100px", color: "white", backgroundColor: STATUS_COLORS[property.status] }}>{STATUS_LABELS[property.status]}</span>
            </div>
          </div>

          {/* Specs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            {[
              property.surface && { icon: "📐", label: property.surface },
              property.rooms && { icon: "🛏", label: `${property.rooms} pièces` },
              property.condition && { icon: "✨", label: property.condition },
              property.block && { icon: "🏗", label: `Bloc ${property.block}` },
              property.floor && { icon: "⬆", label: property.floor },
            ].filter(Boolean).map((spec: any) => (
              <span key={spec.label} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f3f4f6", padding: "6px 14px", borderRadius: "100px", fontSize: "13px", color: "#374151" }}>
                {spec.icon} {spec.label}
              </span>
            ))}
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {property.features.map((f) => (
                <span key={f} style={{ fontSize: "12px", backgroundColor: "rgba(201,168,76,0.1)", color: "#0a1628", border: "1px solid rgba(201,168,76,0.3)", padding: "4px 12px", borderRadius: "100px", fontFamily: "Georgia, serif" }}>{f}</span>
              ))}
            </div>
          )}

          {/* Description */}
          {property.description && (
            <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", borderLeft: "3px solid var(--gold)" }}>{property.description}</p>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto" }}>
              {images.map((url, i) => (
                <img key={i} src={url} alt={`Photo ${i + 1}`} onClick={() => { setImgIdx(i); setShowVideo(false) }}
                  style={{ width: "72px", height: "54px", objectFit: "cover", borderRadius: "6px", cursor: "pointer", flexShrink: 0, border: i === imgIdx ? "2px solid var(--gold)" : "2px solid transparent", opacity: i === imgIdx ? 1 : 0.6 }} />
              ))}
            </div>
          )}

          {/* CTA */}
          <a href={WA} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "15px", fontFamily: "Georgia, serif", letterSpacing: "1px" }}>
            <WaIcon />Contacter Chabane pour ce bien
          </a>
        </div>
      </div>
    </div>
  )
}

function PropertyCard({ property, onClick }: { property: Property; onClick: () => void }) {
  const images = property.images || []
  const [imgIdx, setImgIdx] = useState(0)

  return (
    <div onClick={onClick} style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "all 0.3s", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)" }}
      onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)" }}>

      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#0a1628", overflow: "hidden" }}>
        {images.length > 0
          ? <img src={images[imgIdx]} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
          <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "4px" }}>
            {images.slice(0,4).map((_, i) => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: i === imgIdx ? "white" : "rgba(255,255,255,0.4)" }} />)}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
          <h3 style={{ fontFamily: "Georgia, serif", fontWeight: "700", color: "#0a1628", fontSize: "15px", lineHeight: "1.3" }}>{property.title}</h3>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#0a1628", backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", padding: "2px 8px", borderRadius: "4px", flexShrink: 0 }}>{property.type}</span>
        </div>
        <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "4px" }}>📍 {property.location}</p>
        {property.residence_name && <p style={{ color: "#6b7280", fontSize: "11px", marginBottom: "8px" }}>🏢 {property.residence_name}</p>}

        <div style={{ display: "flex", gap: "12px", marginBottom: "12px", color: "#9ca3af", fontSize: "12px" }}>
          {property.surface && <span>📐 {property.surface}</span>}
          {property.rooms && <span>🛏 {property.rooms} pcs</span>}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: "700", color: "var(--gold)" }}>{property.price}</span>
          <span style={{ fontSize: "12px", color: "var(--gold)", fontFamily: "Georgia, serif", letterSpacing: "1px" }}>Voir détails →</span>
        </div>
      </div>
    </div>
  )
}

export function PropertiesSection({ properties, content }: { properties: Property[]; content: SiteContent }) {
  const [selected, setSelected] = useState<Property | null>(null)
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
          <p style={{ color: "#6b7280", fontSize: "16px" }}>{available.length} bien(s) disponible(s) à Oran</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {available.map((p) => <PropertyCard key={p.id} property={p} onClick={() => setSelected(p)} />)}
        </div>
      </div>

      {selected && <PropertyModal property={selected} onClose={() => setSelected(null)} whatsappNumber={content.contact.whatsappNumber} />}
    </section>
  )
}

function WaIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
