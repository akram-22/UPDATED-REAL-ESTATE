"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { useAdminAuth } from "@/lib/store"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAdminAuth()
  const [form, setForm] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const ok = login(form.username, form.password)
    setLoading(false)
    if (ok) {
      router.push("/admin")
    } else {
      setError("Identifiant ou mot de passe incorrect.")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--navy)" }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 39px,var(--gold) 39px,var(--gold) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,var(--gold) 39px,var(--gold) 40px)",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-serif text-3xl text-white font-bold tracking-tight">Chabano</div>
          <div className="text-xs tracking-[0.25em] uppercase font-medium mt-0.5" style={{ color: "var(--gold)" }}>
            Properties · Admin
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <h1 className="font-serif text-xl font-bold text-navy mb-1">Connexion au dashboard</h1>
          <p className="text-muted-foreground text-sm mb-7">Accès réservé à l&apos;administrateur.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">
                Identifiant
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="chabane"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-9 pr-4 py-3 rounded-sm border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors duration-150"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-9 pr-10 py-3 rounded-sm border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center py-3.5 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Accès protégé — Chabano Properties
          </p>
        </div>
      </div>
    </div>
  )
}
