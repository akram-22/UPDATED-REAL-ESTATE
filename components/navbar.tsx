"use client"

import { useState, useEffect } from "react"
import type { SiteContent } from "@/lib/types"

export function NavBar({ content }: { content: SiteContent }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { contact } = content
  const WA = "https://wa.me/" + contact.whatsappNumber + "?text=Bonjour%20Chabane"

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const links = [
    { label: "Biens", href: "#properties" },
    { label: "Promotions", href: "#promotions" },
    { label: "Quartiers", href: "/quartiers" },
    { label: "Blog", href: "/blog" },
    { label: "A propos", href: "#about" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "#contact" },
  ]

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: scrolled ? "#ffffff" : "transparent",
    borderBottom: scrolled ? "1px solid #e5e7eb" : "none",
    boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
    transition: "background-color 0.3s, box-shadow 0.3s, border-bottom 0.3s",
  }

  const innerStyle: React.CSSProperties = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px",
    height: "68px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
  }

  const logoNameStyle: React.CSSProperties = {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "22px",
    fontWeight: "700",
    color: scrolled ? "#0a1628" : "#ffffff",
    letterSpacing: "6px",
    lineHeight: "1",
    transition: "color 0.3s",
  }

  const logoSubStyle: React.CSSProperties = {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "7px",
    color: scrolled ? "#9ca3af" : "rgba(255,255,255,0.6)",
    letterSpacing: "4px",
    marginTop: "3px",
    transition: "color 0.3s",
  }

  const navLinkStyle: React.CSSProperties = {
    color: scrolled ? "#111827" : "rgba(255,255,255,0.85)",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "color 0.15s",
  }

  const phoneColor = scrolled ? "#6b7280" : "rgba(255,255,255,0.7)"

  const ctaStyle: React.CSSProperties = {
    backgroundColor: "#0a1628",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    padding: "10px 20px",
    borderRadius: "100px",
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "background-color 0.2s",
  }

  return (
    <header style={headerStyle}>
      <div style={innerStyle}>

        <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <div style={logoNameStyle}>
            CHABANO<span style={{ color: "#c9a84c" }}>.</span>
          </div>
          <div style={logoSubStyle}>OWNING WAHRAN</div>
        </a>

        <nav className="hidden md:flex" style={{ display: "flex", alignItems: "center", gap: "28px", flex: 1, justifyContent: "center" }}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={navLinkStyle}
              onMouseOver={(e) => { e.currentTarget.style.color = "#c9a84c" }}
              onMouseOut={(e) => { e.currentTarget.style.color = scrolled ? "#111827" : "rgba(255,255,255,0.85)" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <a href={"tel:" + contact.whatsappNumber} className="hidden md:block" style={{ color: phoneColor, fontSize: "12px", fontWeight: "500", textDecoration: "none", transition: "color 0.3s" }}>
            {contact.whatsappNumber}
          </a>

          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            style={ctaStyle}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#c9a84c" }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#0a1628" }}
          >
            Nous contacter
          </a>

          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: scrolled ? "1px solid #e5e7eb" : "1px solid rgba(255,255,255,0.4)", borderRadius: "6px", cursor: "pointer", padding: "6px 10px", display: "flex", alignItems: "center", gap: "6px", color: scrolled ? "#111827" : "#ffffff", fontSize: "13px", fontWeight: "600" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
            Menu
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ backgroundColor: "#ffffff", borderTop: "1px solid #f3f4f6", padding: "8px 24px 20px" }}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{ display: "block", color: "#111827", fontSize: "15px", fontWeight: "600", padding: "13px 0", borderBottom: "1px solid #f3f4f6", textDecoration: "none" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", textAlign: "center", marginTop: "16px", backgroundColor: "#0a1628", color: "#ffffff", padding: "13px", borderRadius: "100px", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}
          >
            Nous contacter
          </a>
        </div>
      )}
    </header>
  )
}
