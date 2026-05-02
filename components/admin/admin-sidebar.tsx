"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  FileText,
  MessageSquare,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react"
import { useAdminAuth, useLeadsStore } from "@/lib/store"

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/properties", label: "Biens immobiliers", icon: Building2 },
  { href: "/admin/content", label: "Contenu du site", icon: FileText },
  { href: "/admin/leads", label: "Leads & contacts", icon: MessageSquare },
]

interface Props {
  onClose?: () => void
}

export function AdminSidebar({ onClose }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAdminAuth()
  const { leads } = useLeadsStore()
  const unreadCount = leads.filter((l) => !l.read).length

  function handleLogout() {
    logout()
    router.push("/admin/login")
  }

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <aside className="flex flex-col h-full bg-white border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-border">
        <Link href="/admin" className="flex flex-col leading-none">
          <span className="font-serif text-lg text-navy font-bold tracking-tight">Chabano</span>
          <span className="text-[10px] tracking-[0.2em] text-gold uppercase font-medium">Properties · CMS</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground md:hidden" aria-label="Fermer le menu">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Navigation admin">
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-navy text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon size={16} className={active ? "text-gold" : "text-muted-foreground group-hover:text-foreground"} />
                <span className="flex-1">{item.label}</span>
                {item.href === "/admin/leads" && unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-4" />

        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
        >
          <ExternalLink size={16} />
          Voir le site
        </a>
      </nav>

      {/* Footer / logout */}
      <div className="px-3 py-4 border-t border-border">
        <div className="px-3 py-2 mb-2">
          <div className="text-xs font-semibold text-navy">Chabane Chawki</div>
          <div className="text-[11px] text-muted-foreground">Administrateur</div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all duration-150"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
