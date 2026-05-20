"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError("")
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    if (form.username === "chabane" && form.password === "chabano2024") {
      localStorage.setItem("chabano_admin_session", "true")
      router.push("/admin")
    } else {
      setError("Identifiant ou mot de passe incorrect.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--navy)" }}>
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,var(--gold) 39px,var(--gold) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,var(--gold) 39px,var(--gold) 40px)" }} />
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-serif text-3xl text-white font-bold">Chabano</div>
          <div className="text-xs tracking-widest uppercase font-medium mt-0.5" style={{ color: "var(--gold)" }}>Properties · Admin</div>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <h1 className="font-serif text-xl font-bold text-navy mb-1">Connexion au dashboard</h1>
          <p className="text-muted-foreground text-sm mb-7">Accès réservé à l&apos;administrateur.</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Identifiant</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="chabane" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} className="w-full pl-9 pr-4 py-3 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} className="w-full pl-9 pr-10 py-3 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
            <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary justify-center py-3.5 mt-1 disabled:opacity-60">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
