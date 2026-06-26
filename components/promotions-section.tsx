"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Play, ChevronRight } from "lucide-react"
import { getPromotions } from "@/lib/db"
import type { Promotion, SiteContent } from "@/lib/types"

const STATUS_LABELS: Record<string, string> = { upcoming: "Bientôt disponible", selling: "En commercialisation", delivered: "Livré" }
const STATUS_COLORS: Record<string, string> = { upcoming: "#7c3aed", selling: "#16a34a", delivered: "#0a1628" }

export function PromotionsSection({ content }: { content: SiteContent }) {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const router = useRouter()

  useEffect(() => {
    getPromotions().then(setPromotions)
  }, [])

  if (promotions.length === 0) return null

  return (
    <section id="promotions" style={{ padding: "80px 0", backgroundColor: "#f9fafb" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "1px", backgroundColor: "var(--gold)" }} />
            <span style={{ color: "var(--gold)", fontSize: "11px", letterSpacing: "5px", fontFamily: "Georgia, serif" }}>{content.promotions.sectionLabel.toUpperCase()}</span>
            <div style={{ width: "32px", height: "1px", backgroundColor: "var(--gold)" }} />
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: "700", color: "#0a1628", marginBottom: "12px" }}>
            {content.promotions.headline} <span style={{ color: "var(--gold)" }}>à Oran</span>
          </h2>
          <p style={{ color: "#6b7280", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>{content.promotions.subtitle}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "28px" }}>
          {promotions.map((promo) => (
            <div key={promo.id} onClick={() => router.push(`/promotions/${promo.id}`)}
              style={{ backgroundColor: "white", borderRadius: "12px", overflow: "hidden", cursor: "pointer", border: "1px solid #e5e7eb", transition: "all 0.3s", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              onMouseOver={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)"; el.style.borderColor = "rgba(201,168,76,0.4)" }}
              onMouseOut={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; el.style.borderColor = "#e5e7eb" }}>

              {/* Image */}
              <div style={{ position: "relative", aspectRatio: "16/9", backgroundColor: "#0a1628", overflow: "hidden" }}>
                {promo.images && promo.images[0]
                  ? <img src={promo.images[0]} alt={promo.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0a1628, #162d52)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "rgba(201,168,76,0.3)" }}>🏗</div>
                        <div style={{ fontFamily: "Georgia, serif", fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "8px", letterSpacing: "2px" }}>PROJET IMMOBILIER</div>
                      </div>
                    </div>
                }
                <span style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#c9a84c", color: "#0a1628", fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "100px", fontFamily: "Georgia, serif", letterSpacing: "1px" }}>{promo.badge || "NOUVEAU"}</span>
                <span style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: STATUS_COLORS[promo.status], color: "white", fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "100px" }}>{STATUS_LABELS[promo.status]}</span>
                {promo.video_url && (
                  <div style={{ position: "absolute", bottom: "10px", right: "10px", backgroundColor: "var(--gold)", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Play size={12} fill="#0a1628" color="#0a1628" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "20px" }}>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: "700", color: "#0a1628", marginBottom: "4px" }}>{promo.title}</h3>
                <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "4px" }}>📍 {promo.location}</p>
                {promo.developer && <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "12px" }}>🏢 {promo.developer}</p>}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  {promo.types_available && promo.types_available.map((t) => (
                    <span key={t} style={{ fontSize: "11px", backgroundColor: "rgba(201,168,76,0.1)", color: "#0a1628", border: "1px solid rgba(201,168,76,0.3)", padding: "2px 10px", borderRadius: "100px", fontFamily: "Georgia, serif" }}>{t}</span>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
                  <div>
                    {promo.price_from && (
                      <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "700", color: "var(--gold)" }}>
                        À partir de {promo.price_from}
                      </div>
                    )}
                    {promo.delivery_date && <div style={{ color: "#9ca3af", fontSize: "11px", marginTop: "2px" }}>Livraison: {promo.delivery_date}</div>}
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--gold)", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: "4px" }}>
                    Voir le projet <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
