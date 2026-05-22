"use client"

import { useState, useEffect } from "react"
import type { SiteContent } from "@/lib/types"

export function NavBar({ content }: { content: SiteContent }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { contact } = content
  const WA = `https://wa.me/${contact.whatsappNumber}?text=Bonjour%20Chabane%2C%20je%20souhaite%20en%20savoir%20plus.`

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const links = [
    { label: "Services", href: "#services" },
    { label: "Biens", href: "#properties" },
    { label: "À propos", href: "#about" },
    { label: "Témoignages", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
      style={{ backgroundColor: scrolled ? "rgba(10,22,40,0.97)" : "transparent", backdropFilter: scrolled ? "blur(10px)" : "none" }}>
      
      {/* Gold top line */}
      <div style={{ height: "2px", background: "var(--gold)" }} />
      
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        {/* CHABANO Logo */}
<a href="/" className="flex flex-col leading-none" style={{ textDecoration: "none" }}>
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <div style={{ width: "2px", height: "36px", backgroundColor: "var(--gold)" }} />
    <div>
      <div style={{
        fontFamily: "Georgia, serif",
        fontSize: "20px",
        fontWeight: "700",
        color: "#ffffff",
        letterSpacing: "6px",
        lineHeight: "1"
      }}>CHABANO</div>
      <div style={{
        fontFamily: "Georgia, serif",
        fontSize: "7px",
        color: "var(--gold)",
        letterSpacing: "4px",
        marginTop: "4px"
      }}>OWNING WAHRAN</div>
    </div>
    <div style={{ width: "2px", height: "36px", backgroundColor: "var(--gold)" }} />
  </div>
</a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: "Georgia, serif", letterSpacing: "1px", textDecoration: "none", transition: "color 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "var(--gold)")}
              onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >{l.label}</a>
          ))}
          <a href={WA} target="_blank" rel="noopener noreferrer" className="whatsapp-btn text-sm px-4 py-2">
            <WaIcon />WhatsApp
          </a>
        </nav>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: "white", background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          {mobileOpen
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ backgroundColor: "#0a1628", borderTop: "1px solid rgba(201,168,76,0.2)", padding: "16px 20px" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "14px", fontFamily: "Georgia, serif", letterSpacing: "1px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
          <a href={WA} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{ marginTop: "12px", justifyContent: "center", width: "100%" }}>
            <WaIcon />WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}

function WaIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
