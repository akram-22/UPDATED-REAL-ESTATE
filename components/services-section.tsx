"use client"

import { Home, TrendingUp, DollarSign, ArrowRight, Building } from "lucide-react"
import type { SiteContent } from "@/lib/types"

export function ServicesSection({ content }: { content: SiteContent }) {
  const { services, contact } = content
  const wa = (msg: string) => `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(msg)}`

  const service4 = services.service4 || {
    tag: "Promotion", title: "Commercialisation de promotions ?",
    desc: "Vous êtes promoteur immobilier ? Je commercialise vos projets résidentiels à Oran avec une stratégie marketing digitale complète.",
    benefit1: "Stratégie marketing digitale", benefit2: "Présentation vidéo du projet", benefit3: "Base d'acheteurs qualifiés",
    cta: "Commercialiser mon projet"
  }

  const list = [
    { data: services.service1, icon: Home, link: wa("Bonjour Chabane, je cherche à acheter un appartement à Oran."), accent: false },
    { data: services.service2, icon: DollarSign, link: wa("Bonjour Chabane, j'ai un bien à vendre à Oran."), accent: false },
    { data: services.service3, icon: TrendingUp, link: wa("Bonjour Chabane, je cherche des opportunités d'investissement à Oran."), accent: false },
    { data: service4, icon: Building, link: wa("Bonjour Chabane, je suis promoteur immobilier et souhaite commercialiser mon projet à Oran."), accent: true },
  ]

  return (
    <section id="services" style={{ padding: "80px 0", backgroundColor: "#f9fafb" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "1px", backgroundColor: "var(--gold)" }} />
            <span style={{ color: "var(--gold)", fontSize: "11px", letterSpacing: "5px", fontFamily: "Georgia, serif" }}>{services.sectionLabel.toUpperCase()}</span>
            <div style={{ width: "32px", height: "1px", backgroundColor: "var(--gold)" }} />
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: "700", color: "#0a1628", marginBottom: "12px" }}>
            {services.sectionTitle} <span style={{ color: "var(--gold)" }}>quelle que soit votre situation</span>
          </h2>
          <p style={{ color: "#6b7280", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>{services.sectionSubtitle}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
          {list.map(({ data, icon: Icon, link, accent }) => (
            <div key={data.tag} style={{
              backgroundColor: accent ? "#0a1628" : "#ffffff",
              border: accent ? "none" : "1px solid #e5e7eb",
              borderRadius: "12px", padding: "28px",
              display: "flex", flexDirection: "column",
              transition: "all 0.3s",
              borderTop: "3px solid var(--gold)",
              boxShadow: accent ? "0 8px 32px rgba(10,22,40,0.2)" : "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <span style={{ display: "inline-block", fontSize: "10px", fontWeight: "700", letterSpacing: "3px", padding: "3px 12px", borderRadius: "100px", marginBottom: "20px", width: "fit-content", backgroundColor: accent ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.1)", color: "var(--gold)", fontFamily: "Georgia, serif" }}>{data.tag.toUpperCase()}</span>
              <div style={{ width: "44px", height: "44px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
                <Icon size={20} style={{ color: "var(--gold)" }} />
              </div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: accent ? "#ffffff" : "#0a1628" }}>{data.title}</h3>
              <p style={{ fontSize: "13px", lineHeight: "1.7", marginBottom: "16px", flex: 1, color: accent ? "rgba(255,255,255,0.65)" : "#6b7280" }}>{data.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                {[data.benefit1, data.benefit2, data.benefit3].map((b) => (
                  <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: accent ? "rgba(255,255,255,0.7)" : "#6b7280" }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: "1px" }}>✓</span>{b}
                  </li>
                ))}
              </ul>
              <a href={link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", fontFamily: "Georgia, serif", letterSpacing: "1px", color: "var(--gold)", textDecoration: "none" }}>
                {data.cta} <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
