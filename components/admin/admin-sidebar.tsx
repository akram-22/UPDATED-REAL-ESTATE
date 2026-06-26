"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, MessageSquare, FileText, LogOut, X, TrendingUp, Search, BookOpen, ArrowRight, HelpCircle, MapPin, BarChart3, Activity } from "lucide-react"

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Biens", href: "/admin/properties", icon: Building2 },
  { label: "Promotions", href: "/admin/promotions", icon: TrendingUp },
  { label: "Leads / CRM", href: "/admin/leads", icon: MessageSquare },
  { label: "Contenu site", href: "/admin/content", icon: FileText },
  { label: "Blog & Articles", href: "/admin/blog", icon: BookOpen },
  { label: "FAQ Manager", href: "/admin/faq", icon: HelpCircle },
  { label: "Quartiers", href: "/admin/neighborhoods", icon: MapPin },
  { label: "SEO Manager", href: "/admin/seo", icon: Search },
  { label: "SEO Health", href: "/admin/seo-health", icon: Activity },
  { label: "SEO Local & GA", href: "/admin/gbp", icon: BarChart3 },
  { label: "Redirections", href: "/admin/redirects", icon: ArrowRight },
]

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  function logout() {
    localStorage.removeItem("chabano_admin_session")
    window.location.href = "/admin/login"
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#0a1628" }}>
      {/* Logo */}
      <div style={{ padding: "20px", borderBottom: "1px solid rgba(201,168,76,0.15)" }} className="flex items-center justify-between">
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: "700", color: "#ffffff", letterSpacing: "5px" }}>CHABANO</div>
          <div style={{ height: "1px", background: "var(--gold)", margin: "4px 0", opacity: 0.6, width: "80px" }} />
          <div style={{ fontFamily: "Georgia, serif", fontSize: "7px", color: "var(--gold)", letterSpacing: "3px" }}>OWNING WAHRAN</div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 12px", borderRadius: "6px",
                fontSize: "13px", fontFamily: "Georgia, serif", letterSpacing: "0.5px",
                textDecoration: "none", transition: "all 0.15s",
                backgroundColor: active ? "rgba(201,168,76,0.15)" : "transparent",
                color: active ? "var(--gold)" : "rgba(255,255,255,0.55)",
                borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
              }}>
              <item.icon size={15} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={logout}
          style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 12px", borderRadius: "6px", fontSize: "13px", fontFamily: "Georgia, serif", color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}>
          <LogOut size={15} />Se déconnecter
        </button>
      </div>
    </div>
  )
}
