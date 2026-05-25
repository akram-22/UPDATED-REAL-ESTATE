"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Play, ArrowLeft, Phone, Share2 } from "lucide-react"
import { getPromotion, getSiteContent } from "@/lib/db"
import type { Promotion, SiteContent } from "@/lib/types"
import { DEFAULT_CONTENT } from "@/lib/seed-data"

const STATUS_LABELS: Record<string, string> = { upcoming: "Bientôt disponible", selling: "En commercialisation", delivered: "Livré" }
const STATUS_COLORS: Record<string, string> = { upcoming: "#7c3aed", selling: "#16a34a", delivered: "#0a1628" }

export default function PromotionPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [promo, setPromo] = useState<Promotion | null>(null)
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    Promise.all([getPromotion(id), getSiteContent()]).then(([p, c]) => {
      setPromo(p); setContent(c); setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0a1628" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid rgba(201,168,76,0.3)", borderTop: "3px solid var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  )

  if (!promo) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
      <p style={{ fontFamily: "Georgia, serif", color: "#6b7280" }}>Promotion introuvable</p>
      <button onClick={() => router.push("/#promotions")} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0a1628", color: "white", border: "none", borderRadius: "6px", padding: "10px 20px", cursor: "pointer", fontFamily: "Georgia, serif" }}>
        <ArrowLeft size={16} /> Retour
      </button>
    </div>
  )

  const images = promo.images || []
  const WA = `https://wa.me/${content.contact.whatsappNumber}?text=${encodeURIComponent(`Bonjour Chabane, je suis intéressé par le projet : ${promo.title} à ${promo.location}.`)}`

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <header style={{ backgroundColor: "#0a1628", borderBottom: "1px solid rgba(201,168,76,0.2)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ height: "2px", background: "var(--gold)" }} />
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 20px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "13px" }}>
            <ArrowLeft size={16} /> CHABANO
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "1.5px", height: "32px", backgroundColor: "var(--gold)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "700", color: "#ffffff", letterSpacing: "6px" }}>CHABANO</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "6px", color: "var(--gold)", letterSpacing: "3px" }}>OWNING WAHRAN</div>
            </div>
            <div style={{ width: "1.5px", height: "32px", backgroundColor: "var(--gold)" }} />
          </div>
          <div style={{ width: "80px" }} />
        </div>
      </header>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 20px 80px" }}>
        {/* Hero image */}
        <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "16/9", backgroundColor: "#0a1628", marginBottom: "24px" }}>
          {showVideo && promo.video_url ? (
            <video src={promo.video_url} controls autoPlay style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : images.length > 0 ? (
            <img src={images[imgIdx]} alt={promo.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0a1628, #162d52)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px" }}>🏗</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "12px", letterSpacing: "3px" }}>PROJET IMMOBILIER</div>
              </div>
            </div>
          )}
          <span style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: "#c9a84c", color: "#0a1628", fontSize: "11px", fontWeight: "700", padding: "4px 14px", borderRadius: "100px", fontFamily: "Georgia, serif" }}>{promo.badge || "NOUVEAU PROJET"}</span>
          <span style={{ position: "absolute", top: "16px", right: "16px", backgroundColor: STATUS_COLORS[promo.status], color: "white", fontSize: "11px", fontWeight: "700", padding: "4px 14px", borderRadius: "100px" }}>{STATUS_LABELS[promo.status]}</span>
          {images.length > 1 && !showVideo && (
            <>
              <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}><ChevronLeft size={20} /></button>
              <button onClick={() => setImgIdx((i) => (i + 1) % images.length)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}><ChevronRight size={20} /></button>
            </>
          )}
          {promo.video_url && !showVideo && (
            <button onClick={() => setShowVideo(true)} style={{ position: "absolute", bottom: "16px", right: "16px", background: "var(--gold)", border: "none", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0a1628" }}>
              <Play size={18} fill="currentColor" />
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb" }}>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "700", color: "#0a1628", marginBottom: "8px" }}>{promo.title}</h1>
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "4px" }}>📍 {promo.location}</p>
              {promo.developer && <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>🏢 Promoteur : <strong>{promo.developer}</strong></p>}
              {(promo.price_from || promo.price_to) && (
                <div style={{ padding: "16px", backgroundColor: "rgba(201,168,76,0.08)", borderRadius: "8px", borderLeft: "3px solid var(--gold)" }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: "700", color: "var(--gold)" }}>
                    {promo.price_from && `À partir de ${promo.price_from}`}
                    {promo.price_from && promo.price_to && " — "}
                    {promo.price_to && `jusqu'à ${promo.price_to}`}
                  </div>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb" }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "700", color: "#0a1628", marginBottom: "16px", letterSpacing: "1px" }}>INFORMATIONS DU PROJET</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  promo.surface_from && { label: "Surface min", value: promo.surface_from },
                  promo.surface_to && { label: "Surface max", value: promo.surface_to },
                  promo.delivery_date && { label: "Livraison", value: promo.delivery_date },
                  promo.status && { label: "Statut", value: STATUS_LABELS[promo.status] },
                ].filter(Boolean).map((item: any) => (
                  <div key={item.label} style={{ backgroundColor: "#f9fafb", borderRadius: "8px", padding: "12px", borderLeft: "3px solid var(--gold)" }}>
                    <div style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "Georgia, serif", letterSpacing: "1px", marginBottom: "4px" }}>{item.label.toUpperCase()}</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#0a1628", fontFamily: "Georgia, serif" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {promo.types_available && promo.types_available.length > 0 && (
              <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "700", color: "#0a1628", marginBottom: "16px", letterSpacing: "1px" }}>TYPES DISPONIBLES</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {promo.types_available.map((t) => (
                    <span key={t} style={{ backgroundColor: "rgba(201,168,76,0.1)", color: "#0a1628", border: "1px solid rgba(201,168,76,0.3)", padding: "8px 16px", borderRadius: "100px", fontFamily: "Georgia, serif", fontSize: "14px", fontWeight: "600" }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {promo.description && (
              <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "700", color: "#0a1628", marginBottom: "16px", letterSpacing: "1px" }}>DESCRIPTION DU PROJET</h2>
                <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>{promo.description}</p>
              </div>
            )}

            {promo.features && promo.features.length > 0 && (
              <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "700", color: "#0a1628", marginBottom: "16px", letterSpacing: "1px" }}>PRESTATIONS & ÉQUIPEMENTS</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {promo.features.map((f) => (
                    <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(201,168,76,0.08)", color: "#0a1628", border: "1px solid rgba(201,168,76,0.3)", padding: "6px 14px", borderRadius: "100px", fontSize: "13px", fontFamily: "Georgia, serif" }}>✓ {f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky contact */}
          <div style={{ position: "sticky", top: "80px" }}>
            <div style={{ backgroundColor: "#0a1628", borderRadius: "12px", padding: "24px", borderTop: "3px solid var(--gold)" }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "14px", letterSpacing: "4px", color: "var(--gold)", marginBottom: "4px" }}>CHABANO</div>
                <div style={{ height: "1px", background: "rgba(201,168,76,0.3)", margin: "10px 0" }} />
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: "Georgia, serif", lineHeight: "1.6" }}>Intéressé par ce projet ? Contactez Chabane pour plus d&apos;informations.</p>
              </div>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "14px", fontFamily: "Georgia, serif", letterSpacing: "1px", marginBottom: "10px", display: "flex" }}>
                <WaIcon />CONTACTER SUR WHATSAPP
              </a>
              <a href={`tel:+${content.contact.whatsappNumber}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "1px solid rgba(201,168,76,0.3)", color: "rgba(255,255,255,0.7)", padding: "12px", borderRadius: "6px", fontSize: "13px", fontFamily: "Georgia, serif", letterSpacing: "1px", textDecoration: "none" }}>
                <Phone size={15} />APPELER CHABANE
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WaIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
