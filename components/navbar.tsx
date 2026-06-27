"use client"

import { useState, useEffect } from "react"
import type { SiteContent } from "@/lib/types"

export function NavBar({ content }: { content: SiteContent }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { contact } = content
  const WA = `https://wa.me/${contact.whatsappNumber}?text=Bonjour%20Chabane%2C%20je%20souhaite%20en%20savoir%20plus.`

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
    { label: "À propos", href: "#about" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
        transition: "box-shadow 0.3s",
      }}
    >
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 24px",
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
      }}>

        {/* Logo */}
        <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "22px",
            fontWeight: "700",
            color: "#0a1628",
            letterSpacing: "6px",
            lineHeight: "1",
          }}>
            CHABANO<span style={{ color: "var(--gold)" }}>.</span>
          </div>
          <div style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "7px",
            color: "#9ca3af",
            letterSpacing: "4px",
            marginTop: "3px",
          }}>OWNING WAHRAN</div>
        </a>

        {/* Desktop nav */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
          flex: 1,
          justifyContent: "center",
        }} className="hidden md:flex">
          {links.map((l) => (
            
              key={l.href}
              href={l.href}
              style={{
                color: "#111827",
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "0.3px",
                textDecoration: "none",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "var(--gold)")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#111827")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          
            href={`tel:${contact.whatsappNumber}`}
            style={{ color: "#6b7280", fontSize: "12px", fontWeight: "500", textDecoration: "none" }}
            className="hidden md:block"
          >
            {contact.whatsappNumber}
          </a>

          
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#0a1628",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "700",
              padding: "10px 20px",
              borderRadius: "100px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--gold)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0a1628")}
          >
            Nous contacter
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              cursor: "pointer",
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#111827",
              fontSize: "13px",
              fontWeight: "600",
            }}
            className="md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {mobileOpen
                ? <path d="M18 6L6 18M6 6l12 12" />
                : <path d="M3 12h18M3 6h18M3 18h18" />
              }
            </svg>
            Menu
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid #f3f4f6",
          padding: "8px 24px 20px",
        }}>
          {links.map((l) => (
            
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                color: "#111827",
                fontSize: "15px",
                fontWeight: "600",
                padding: "13px 0",
                borderBottom: "1px solid #f3f4f6",
                textDecoration: "none",
              }}
            >
              {l.label}
            </a>
          ))}
          
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "16px",
              backgroundColor: "#0a1628",
              color: "#ffffff",
              padding: "13px",
              borderRadius: "100px",
              fontWeight: "700",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            Nous contacter
          </a>
        </div>
      )}
    </header>
  )
}
