"use client"

import { useRouter } from "next/navigation"
import type { Neighborhood } from "@/lib/types"

const DEFAULT_NEIGHBORHOODS: Partial<Neighborhood>[] = [
  { name: "Akid Lotfi", slug: "akid-lotfi" },
  { name: "Bir El Djir", slug: "bir-el-djir" },
  { name: "Centre-Ville", slug: "centre-ville" },
  { name: "Es Senia", slug: "es-senia" },
]

export function NeighborhoodsListClient({ neighborhoods }: { neighborhoods: Neighborhood[] }) {
  const router = useRouter()
  const items = neighborhoods.length > 0 ? neighborhoods : DEFAULT_NEIGHBORHOODS as Neighborhood[]

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <header style={{ backgroundColor: "#0a1628", borderBottom: "1px solid rgba(201,168,76,0.2)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ height: "2px", background: "var(--gold)" }} />
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 20px", height: "60px", display: "flex", alignItems: "center", gap: "16px" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Georgia, serif", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>← Accueil</a>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: 700, color: "#ffffff", letterSpacing: "4px" }}>CHABANO</div>
        </div>
      </header>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "1px", backgroundColor: "var(--gold)" }} />
            <span style={{ color: "var(--gold)", fontSize: "11px", letterSpacing: "5px", fontFamily: "Georgia, serif" }}>ORAN — ALGÉRIE</span>
            <div style={{ width: "32px", height: "1px", backgroundColor: "var(--gold)" }} />
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "42px", fontWeight: 700, color: "#0a1628" }}>
            Les quartiers <span style={{ color: "var(--gold)" }}>d'Oran</span>
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", marginTop: "12px" }}>Explorez l'immobilier quartier par quartier avec votre expert local</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
          {items.map((n) => (
            <div key={n.slug} onClick={() => router.push(`/quartiers/${n.slug}`)}
              style={{ backgroundColor: "white", borderRadius: "14px", overflow: "hidden", border: "1px solid #e5e7eb", cursor: "pointer", transition: "all 0.3s" }}
              onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.4)" }}
              onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb" }}>
              <div style={{ aspectRatio: "16/9", backgroundColor: "#0a1628", position: "relative" }}>
                {n.cover_image
                  ? <img src={n.cover_image} alt={n.cover_alt || n.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#0a1628,#162d52)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>🏙️</div>
                }
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,22,40,0.7) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", bottom: "16px", left: "16px", fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 700, color: "white" }}>{n.name}</div>
              </div>
              <div style={{ padding: "16px" }}>
                {n.intro ? <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.6", marginBottom: "12px" }}>{n.intro.slice(0, 100)}{n.intro.length > 100 ? "..." : ""}</p> : null}
                {n.amenities && n.amenities.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {n.amenities.slice(0, 3).map((a) => <span key={a} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "100px", backgroundColor: "rgba(201,168,76,0.1)", color: "#0a1628", border: "1px solid rgba(201,168,76,0.2)" }}>{a}</span>)}
                    {n.amenities.length > 3 && <span style={{ fontSize: "11px", color: "#9ca3af" }}>+{n.amenities.length - 3}</span>}
                  </div>
                )}
                <span style={{ color: "var(--gold)", fontSize: "13px", fontFamily: "Georgia, serif" }}>Explorer ce quartier →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
