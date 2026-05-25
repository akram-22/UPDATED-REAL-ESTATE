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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backgroundColor: "#0a1628", backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(201,168,76,0.05) 39px,rgba(201,168,76,0.05) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(201,168,76,0.05) 39px,rgba(201,168,76,0.05) 40px)" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "700", color: "#ffffff", letterSpacing: "8px" }}>CHABANO</div>
          <div style={{ height: "1px", background: "var(--gold)", margin: "8px auto", width: "120px", opacity: 0.8 }} />
          <div style={{ fontFamily: "Georgia, serif", fontSize: "9px", color: "var(--gold)", letterSpacing: "5px" }}>OWNING WAHRAN</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "8px", color: "rgba(255,255,255,0.3)", letterSpacing: "3px", marginTop: "6px" }}>ADMINISTRATION</div>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "36px", boxShadow: "0 25px 60px rgba(0,0,0,0.4)", borderTop: "3px solid var(--gold)" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: "700", color: "#0a1628", marginBottom: "4px" }}>Connexion</h1>
          <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "28px" }}>Accès réservé à l&apos;administrateur</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#0a1628", marginBottom: "6px", letterSpacing: "2px", fontFamily: "Georgia, serif" }}>IDENTIFIANT</label>
              <div style={{ position: "relative" }}>
                <User size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input type="text" placeholder="chabane" value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={{ width: "100%", paddingLeft: "36px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#0a1628", marginBottom: "6px", letterSpacing: "2px", fontFamily: "Georgia, serif" }}>MOT DE PASSE</label>
              <div style={{ position: "relative" }}>
                <Lock size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={{ width: "100%", paddingLeft: "36px", paddingRight: "40px", paddingTop: "12px", paddingBottom: "12px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "10px 14px", color: "#dc2626", fontSize: "13px" }}>{error}</div>
            )}

            <button type="button" onClick={handleSubmit} disabled={loading}
              style={{ backgroundColor: "#0a1628", color: "#ffffff", border: "none", borderRadius: "6px", padding: "14px", fontSize: "14px", fontFamily: "Georgia, serif", letterSpacing: "2px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "4px", borderBottom: "2px solid var(--gold)" }}>
              {loading ? "CONNEXION..." : "SE CONNECTER"}
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px", color: "rgba(255,255,255,0.2)", fontSize: "11px", fontFamily: "Georgia, serif", letterSpacing: "2px" }}>
          CHABANO · OWNING WAHRAN
        </div>
      </div>
    </div>
  )
}
