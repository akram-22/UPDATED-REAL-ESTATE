"use client"

import { ArrowDown } from "lucide-react"
import type { SiteContent } from "@/lib/types"

export function HeroSection({ content }: { content: SiteContent }) {
  const { hero, contact } = content
  const WA = `https://wa.me/${contact.whatsappNumber}?text=Bonjour%20Chabane%2C%20je%20cherche%20un%20bien%20immobilier%20%C3%A0%20Oran.`

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#0a1628" }}>
      {/* Background */}
      {hero.backgroundImage && (
        <div style={{ position: "absolute", inset: 0 }}>
          <img src={hero.backgroundImage} alt="Vue d'Oran" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,22,40,0.6), rgba(10,22,40,0.5), rgba(10,22,40,0.85))" }} />
        </div>
      )}

      {/* Gold top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "var(--gold)" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto", padding: "100px 20px 60px", textAlign: "center" }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "100px", padding: "6px 18px", marginBottom: "32px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--gold)", animation: "pulse 2s infinite" }} />
          <span style={{ color: "var(--gold)", fontSize: "11px", letterSpacing: "4px", fontFamily: "Georgia, serif" }}>{hero.badge.toUpperCase()}</span>
        </div>

        {/* Main headline */}
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: "700", color: "#ffffff", lineHeight: "1.2", marginBottom: "24px" }}>
          {hero.headline.includes(",") ? (
            <>{hero.headline.split(",")[0]},<br /><span style={{ color: "var(--gold)" }}>{hero.headline.split(",").slice(1).join(",")}</span></>
          ) : hero.headline}
        </h1>

        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "18px", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto 40px" }}>{hero.subheadline}</p>

        {/* Stats */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px", marginBottom: "48px" }}>
          {[
            { value: hero.stat1Value, label: hero.stat1Label },
            { value: hero.stat2Value, label: hero.stat2Label },
            { value: hero.stat3Value, label: hero.stat3Label },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "36px", fontWeight: "700", color: "var(--gold)" }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "2px", marginTop: "4px", fontFamily: "Georgia, serif" }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "16px" }}>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{ fontSize: "15px", padding: "14px 32px" }}>
            <WaIcon />{hero.ctaPrimaryText}
          </a>
          <a href="#properties"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.85)", padding: "14px 32px", borderRadius: "6px", fontSize: "15px", fontFamily: "Georgia, serif", letterSpacing: "1px", textDecoration: "none", transition: "all 0.2s" }}>
            {hero.ctaSecondaryText}
          </a>
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: "60px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.25)", animation: "bounce 2s infinite" }}>
          <span style={{ fontSize: "10px", letterSpacing: "3px", fontFamily: "Georgia, serif" }}>DÉCOUVRIR</span>
          <ArrowDown size={16} />
        </div>
      </div>
    </section>
  )
}

function WaIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
