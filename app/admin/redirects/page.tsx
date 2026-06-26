"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, ArrowRight } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getRedirects, createRedirect, deleteRedirect } from "@/lib/db"
import type { Redirect } from "@/lib/types"

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ from_path: "", to_path: "", type: "301" as "301" | "302" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getRedirects().then((r) => { setRedirects(r); setLoading(false) })
  }, [])

  async function handleAdd() {
    if (!form.from_path.trim() || !form.to_path.trim()) return
    setSaving(true)
    await createRedirect(form)
    setRedirects(await getRedirects())
    setForm({ from_path: "", to_path: "", type: "301" })
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette redirection ?")) return
    await deleteRedirect(id)
    setRedirects((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Gestionnaire de redirections</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Gérez vos redirections 301/302 pour préserver votre SEO.</p>
      </div>

      {/* Add new */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-navy mb-5">Ajouter une redirection</h2>
        <div className="grid sm:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide">De (ancienne URL)</label>
            <input type="text" value={form.from_path} onChange={(e) => setForm({ ...form, from_path: e.target.value })} placeholder="/ancien-chemin" className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-sm focus:outline-none focus:border-gold font-mono" />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide">Vers (nouvelle URL)</label>
            <input type="text" value={form.to_path} onChange={(e) => setForm({ ...form, to_path: e.target.value })} placeholder="/nouveau-chemin" className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-sm focus:outline-none focus:border-gold font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "301" | "302" })} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-sm focus:outline-none focus:border-gold">
              <option value="301">301 — Permanent (SEO)</option>
              <option value="302">302 — Temporaire</option>
            </select>
          </div>
          <button onClick={handleAdd} disabled={saving} className="btn-primary gap-2 whitespace-nowrap">
            <Plus size={16} />{saving ? "Ajout..." : "Ajouter"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">💡 Utilisez le 301 (permanent) pour préserver votre SEO. Le 302 est temporaire et ne transfère pas le "jus SEO".</p>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
      ) : redirects.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl text-muted-foreground">
          <p className="text-3xl mb-3">↗️</p>
          <p>Aucune redirection configurée.</p>
          <p className="text-xs mt-1">Les redirections sont utiles quand vous changez l'URL d'une page.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border grid grid-cols-4 gap-4 text-xs font-semibold text-navy uppercase tracking-wide">
            <span>De</span><span>Vers</span><span>Type</span><span>Action</span>
          </div>
          <div className="divide-y divide-border">
            {redirects.map((r) => (
              <div key={r.id} className="px-5 py-3 grid grid-cols-4 gap-4 items-center hover:bg-secondary transition-colors">
                <span className="font-mono text-sm text-muted-foreground truncate">{r.from_path}</span>
                <span className="flex items-center gap-1 font-mono text-sm text-navy truncate"><ArrowRight size={12} className="text-gold flex-shrink-0" />{r.to_path}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${r.type === "301" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{r.type}</span>
                <button onClick={() => handleDelete(r.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors w-fit">
                  <Trash2 size={12} />Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  )
}
