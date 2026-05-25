"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [auth, setAuth] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const val = localStorage.getItem("chabano_admin_session")
      setAuth(val === "true")
      setReady(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (ready && !auth) router.replace("/admin/login")
  }, [ready, auth, router])

  if (!ready || !auth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--navy)" }}>
        <svg className="animate-spin" style={{ color: "var(--gold)" }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden md:flex flex-col w-60 flex-shrink-0 h-screen sticky top-0">
        <AdminSidebar />
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 flex flex-col w-64 h-full">
            <AdminSidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-white border-b border-border shadow-sm">
          <button onClick={() => setMobileOpen(true)} className="text-navy"><Menu size={22} /></button>
          <span className="font-serif text-base font-bold text-navy">Chabano CMS</span>
        </header>
        <main className="flex-1 p-5 md:p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
