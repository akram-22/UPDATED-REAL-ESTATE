"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, MessageSquare, FileText, LogOut, X } from "lucide-react"

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Biens", href: "/admin/properties", icon: Building2 },
  { label: "Leads / CRM", href: "/admin/leads", icon: MessageSquare },
  { label: "Contenu site", href: "/admin/content", icon: FileText },
]

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  function logout() {
    localStorage.removeItem("chabano_admin_session")
    window.location.href = "/admin/login"
  }

  return (
    <div className="flex flex-col h-full bg-navy text-white">
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div>
          <div className="font-serif text-lg font-bold tracking-tight">Chabano</div>
          <div className="text-[10px] tracking-widest uppercase font-medium mt-0.5" style={{ color: "var(--gold)" }}>Properties · Admin</div>
        </div>
        {onClose && <button onClick={onClose} className="text-white/50 hover:text-white"><X size={18} /></button>}
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
              <item.icon size={17} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 pb-5">
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all w-full">
          <LogOut size={17} /> Se déconnecter
        </button>
      </div>
    </div>
  )
}
