"use client"

import { Phone, Instagram, Youtube } from "lucide-react"
import type { SiteContent } from "@/lib/types"

export function FinalCTA({ content }: { content: SiteContent }) {
  const { finalCta, contact } = content
  const WA = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent("Bonjour Chabane, je suis prêt à passer à l'action pour mon projet immobilier à Oran.")}`

  return (
    <>
      <section className="relative py-28 md:py-36 overflow-hidden" style={{ backgroundColor: "#0a1628" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,var(--gold) 39px,var(--gold) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,var(--gold) 39px,var(--gold) 40px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10" style={{ background: "var(--gold)", filter: "blur(80px)" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-px" style={{ backgroundColor: "var(--gold)" }} />
            <span style={{ color: "var(--gold)", fontSize: "11px", letterSpacing: "5px", fontFamily: "Georgia, serif" }}>{finalCta.label.toUpperCase()}</span>
            <div className="w-8 h-px" style={{ backgroundColor: "var(--gold)" }} />
          </div>

          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: "700", color: "#ffffff", lineHeight: "1.2", marginBottom: "24px" }}>
            {finalCta.headline}<br />
            <span style={{ color: "var(--gold)" }}>{finalCta.headlineGold}</span>
          </h2>

          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", lineHeight: "1.7", marginBottom: "40px", maxWidth: "520px", margin: "0 auto 40px" }}>{finalCta.subtitle}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="whatsapp-btn text-base px-10 py-4 w-full sm:w-auto justify-center">
              <WaIcon />{finalCta.ctaPrimaryText}
            </a>
            <a href={`tel:+${contact.whatsappNumber}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(201,168,76,0.4)", color: "rgba(255,255,255,0.8)", padding: "14px 40px", borderRadius: "6px", fontSize: "15px", fontFamily: "Georgia, serif", letterSpacing: "1px", textDecoration: "none", transition: "all 0.2s", width: "100%" }}
              className="sm:w-auto justify-center">
              <Phone size={17} />{finalCta.ctaSecondaryText}
            </a>
          </div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", letterSpacing: "1px" }}>{finalCta.availabilityText}</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#07101e", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        {/* Gold top line */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Logo */}
            <div className="text-center md:text-left">
              <div style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "700", color: "#ffffff", letterSpacing: "6px" }}>CHABANO</div>
              <div style={{ height: "1px", background: "var(--gold)", margin: "6px 0", opacity: 0.6 }} />
              <div style={{ fontFamily: "Georgia, serif", fontSize: "9px", color: "var(--gold)", letterSpacing: "5px" }}>OWNING WAHRAN</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "8px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginTop: "8px" }}>IMMOBILIER DE PRESTIGE · ORAN</div>
            </div>

            {/* Nav links */}
            <nav className="flex flex-wrap justify-center gap-6">
              {[["Services","#services"],["Biens","#properties"],["À propos","#about"],["Contact","#contact"]].map(([label, href]) => (
                <a key={href} href={href} style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", fontFamily: "Georgia, serif", letterSpacing: "2px", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "var(--gold)")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                >{label.toUpperCase()}</a>
              ))}
            </nav>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { href: content.footer.instagramUrl, Icon: Instagram },
                { href: content.footer.youtubeUrl, Icon: Youtube },
              ].map(({ href, Icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", transition: "all 0.2s", textDecoration: "none" }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)" }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}
                ><Icon size={15} /></a>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "11px", fontFamily: "Georgia, serif", letterSpacing: "2px" }}>
            © {new Date().getFullYear()} CHABANO — OWNING WAHRAN · ORAN, ALGÉRIE
          </div>
        </div>
      </footer>
    </>
  )
}

function WaIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
