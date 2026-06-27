"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Play, ArrowLeft, Bed, Maximize, Phone, Share2 } from "lucide-react"
import { getProperty, getSiteContent } from "@/lib/db"
import type { Property, SiteContent } from "@/lib/types"
import { DEFAULT_CONTENT } from "@/lib/seed-data"
import { FAQBlock } from "@/components/faq-block"
import { Breadcrumb } from "@/components/breadcrumb"
import { RelatedProperties, NearbyResidences } from "@/components/related-content"

const STATUS_LABELS: Record<string, string> = { available: "Disponible", reserved: "Réservé", sold: "Vendu" }
const STATUS_COLORS: Record<string, string> = { available: "#16a34a", reserved: "#d97706", sold: "#dc2626" }

export function PropertyDetailClient() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [lightbox, setLightbox] = useState(false)

  useEffect(() => {
    Promise.all([getProperty(id), getSiteContent()]).then(([p, c]) => {
      setProperty(p); setContent(c); setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0a1628" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid rgba(201,168,76,0.3)", borderTop: "3px solid var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  )

  if (!property) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", backgroundColor: "#f9fafb" }}>
      <p style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "18px", color: "#6b7280" }}>Bien introuvable</p>
      <button onClick={() => router.push("/#properties")} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0a1628", color: "white", border: "none", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif" }}>
        <ArrowLeft size={16} /> Retour aux biens
      </button>
    </div>
  )

  const images = property.images || []
  const WA = `https://wa.me/${content.contact.whatsappNumber}?text=${encodeURIComponent(`Bonjour Chabane, je suis intéressé par : ${property.title} (${property.price}) à ${property.location}.`)}`

  function share() {
    if (navigator.share) {
      navigator.share({ title: property!.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Lien copié !")
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Navbar */}
      <header style={{ backgroundColor: "#0a1628", borderBottom: "1px solid rgba(201,168,76,0.2)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ height: "2px", background: "var(--gold)" }} />
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 20px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "13px", letterSpacing: "1px" }}>
            <ArrowLeft size={16} /> CHABANO
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "1.5px", height: "32px", backgroundColor: "var(--gold)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "16px", fontWeight: "700", color: "#ffffff", letterSpacing: "6px" }}>CHABANO</div>
              <div style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "6px", color: "var(--gold)", letterSpacing: "3px" }}>OWNING WAHRAN</div>
            </div>
            <div style={{ width: "1.5px", height: "32px", backgroundColor: "var(--gold)" }} />
          </div>
          <button onClick={share} style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "12px" }}>
            <Share2 size={15} /> Partager
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: "24px" }}>
          <Breadcrumb items={[{ name: "Biens", path: "/#properties" }, { name: property.title, path: `/properties/${property.id}` }]} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>

          {/* Main image */}
          <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "16/9", backgroundColor: "#0a1628", cursor: "pointer" }}
            onClick={() => !showVideo && setLightbox(true)}>
            {showVideo && property.video_url ? (
              <video src={property.video_url} controls autoPlay style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : images.length > 0 ? (
              <img src={images[imgIdx]} alt={`${property.title} — ${property.location}`} loading="eager" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif" }}>Pas de photo</div>
            )}

            {/* Badge */}
            <span style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: "#c9a84c", color: "#0a1628", fontSize: "11px", fontWeight: "700", padding: "4px 14px", borderRadius: "100px", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", letterSpacing: "1px" }}>{property.badge}</span>

            {/* Status */}
            <span style={{ position: "absolute", top: "16px", right: "16px", backgroundColor: STATUS_COLORS[property.status], color: "white", fontSize: "11px", fontWeight: "700", padding: "4px 14px", borderRadius: "100px" }}>{STATUS_LABELS[property.status]}</span>

            {/* Navigation arrows */}
            {images.length > 1 && !showVideo && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + images.length) % images.length) }}
                  style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
                  <ChevronLeft size={20} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % images.length) }}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
                  <ChevronRight size={20} />
                </button>
                <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
                  {images.map((_, i) => <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: i === imgIdx ? "white" : "rgba(255,255,255,0.4)", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); setImgIdx(i) }} />)}
                </div>
              </>
            )}

            {/* Video button */}
            {property.video_url && !showVideo && (
              <button onClick={(e) => { e.stopPropagation(); setShowVideo(true) }}
                style={{ position: "absolute", bottom: "16px", right: "16px", background: "var(--gold)", border: "none", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0a1628", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                <Play size={18} fill="currentColor" />
              </button>
            )}

            {/* Photo counter */}
            {images.length > 1 && (
              <div style={{ position: "absolute", bottom: "16px", left: "16px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", fontSize: "12px", padding: "4px 10px", borderRadius: "100px", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif" }}>
                {imgIdx + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {images.map((url, i) => (
                <img key={i} src={url} alt={`${property.title} — photo ${i + 1}`} loading="lazy" decoding="async" onClick={() => { setImgIdx(i); setShowVideo(false) }}
                  style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px", cursor: "pointer", flexShrink: 0, border: i === imgIdx ? "2.5px solid var(--gold)" : "2.5px solid transparent", opacity: i === imgIdx ? 1 : 0.65, transition: "all 0.2s" }} />
              ))}
            </div>
          )}

          {/* Two column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", gap: "24px", alignItems: "start" }}>

              {/* Left: Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Title & price */}
                <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                    <h1 style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "26px", fontWeight: "800", color: "#0a1628", lineHeight: "1.15", letterSpacing: "-0.03em" }}>{property.title}</h1>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#0a1628", backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", padding: "3px 10px", borderRadius: "6px", flexShrink: 0, fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif" }}>{property.type}</span>
                  </div>
                  <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "4px" }}>📍 {property.location}</p>
                  {property.residence_name && <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "4px" }}>🏢 {property.residence_name}{property.developer ? ` · ${property.developer}` : ""}</p>}
                  {(property.block || property.floor) && <p style={{ color: "#6b7280", fontSize: "13px" }}>{property.block && `Bloc ${property.block}`}{property.block && property.floor && " · "}{property.floor}</p>}
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "28px", fontWeight: "700", color: "var(--gold)" }}>{property.price}</div>
                    <span style={{ fontSize: "12px", fontWeight: "700", padding: "4px 12px", borderRadius: "100px", color: "white", backgroundColor: STATUS_COLORS[property.status] }}>{STATUS_LABELS[property.status]}</span>
                  </div>
                </div>

                {/* Specs */}
                <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb" }}>
                  <h2 style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "16px", fontWeight: "700", color: "#0a1628", marginBottom: "16px", letterSpacing: "1px" }}>CARACTÉRISTIQUES</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {[
                      property.surface && { icon: "📐", label: "Surface", value: property.surface },
                      property.rooms && { icon: "🛏", label: "Pièces", value: `${property.rooms} pièces` },
                      property.condition && { icon: "✨", label: "État", value: property.condition },
                      property.floor && { icon: "⬆", label: "Étage", value: property.floor },
                      property.block && { icon: "🏗", label: "Bloc", value: property.block },
                      property.type && { icon: "🏠", label: "Type", value: property.type },
                    ].filter(Boolean).map((spec: any) => (
                      <div key={spec.label} style={{ backgroundColor: "#f9fafb", borderRadius: "8px", padding: "12px", borderLeft: "3px solid var(--gold)" }}>
                        <div style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", letterSpacing: "1px", marginBottom: "4px" }}>{spec.icon} {spec.label.toUpperCase()}</div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#0a1628", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif" }}>{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb" }}>
                    <h2 style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "16px", fontWeight: "700", color: "#0a1628", marginBottom: "16px", letterSpacing: "1px" }}>ÉQUIPEMENTS & ATOUTS</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {property.features.map((f) => (
                        <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(201,168,76,0.08)", color: "#0a1628", border: "1px solid rgba(201,168,76,0.3)", padding: "6px 14px", borderRadius: "100px", fontSize: "13px", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif" }}>
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {property.description && (
                  <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb" }}>
                    <h2 style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "16px", fontWeight: "700", color: "#0a1628", marginBottom: "16px", letterSpacing: "1px" }}>DESCRIPTION</h2>
                    <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>{property.description}</p>
                  </div>
                )}

                {/* FAQ */}
                <FAQBlock attachType="property" attachRef={property.id} />

                {/* Internal linking */}
                <RelatedProperties property={property} />
                <NearbyResidences property={property} />
              </div>

              {/* Right: Contact sticky */}
              <div style={{ position: "sticky", top: "80px" }}>
                <div style={{ backgroundColor: "#0a1628", borderRadius: "12px", padding: "24px", borderTop: "3px solid var(--gold)" }}>
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "14px", letterSpacing: "4px", color: "var(--gold)", marginBottom: "4px" }}>CHABANO</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px" }}>OWNING WAHRAN</div>
                    <div style={{ height: "1px", background: "rgba(201,168,76,0.3)", margin: "12px 0" }} />
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", lineHeight: "1.6" }}>Intéressé par ce bien ? Contactez Chabane directement.</p>
                  </div>
                  <a href={WA} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "14px", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", letterSpacing: "1px", marginBottom: "10px", display: "flex" }}>
                    <WaIcon />CONTACTER SUR WHATSAPP
                  </a>
                  <a href={`tel:+${content.contact.whatsappNumber}`}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "1px solid rgba(201,168,76,0.3)", color: "rgba(255,255,255,0.7)", padding: "12px", borderRadius: "6px", fontSize: "13px", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", letterSpacing: "1px", textDecoration: "none", marginBottom: "16px" }}>
                    <Phone size={15} />APPELER CHABANE
                  </a>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", textAlign: "center", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", letterSpacing: "1px" }}>{content.contact.availabilityText}</p>
                </div>

                {/* Share */}
                <button onClick={share} style={{ width: "100%", marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px", cursor: "pointer", color: "#6b7280", fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif", fontSize: "13px", letterSpacing: "1px" }}>
                  <Share2 size={15} />PARTAGER CE BIEN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && images.length > 0 && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, backgroundColor: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setLightbox(false)}>
          <img src={images[imgIdx]} alt={`${property.title} — photo ${imgIdx + 1}`} decoding="async" style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: "8px" }} />
          <button onClick={() => setLightbox(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "40px", height: "40px", color: "white", cursor: "pointer", fontSize: "20px" }}>×</button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + images.length) % images.length) }}
                style={{ position: "absolute", left: "20px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "48px", height: "48px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronLeft size={24} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % images.length) }}
                style={{ position: "absolute", right: "20px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "48px", height: "48px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function WaIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
