"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getPromotions, deletePromotion, updatePromotion } from "@/lib/db"
import type { Promotion } from "@/lib/types"

const STATUS_LABELS: Record<string, string> = { upcoming: "Bientôt", selling: "En vente", delivered: "Livré" }
const STATUS_COLORS: Record<string, string> = { upcoming: "bg-purple-100 text-purple-800", selling: "bg-green-100 text-green-800", delivered: "bg-gray-100 text-gray-800" }

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPromotions().then((p) => { setPromotions(p); setLoading(false) })
  }, [])

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette promotion ?")) return
    await deletePromotion(id)
    setPromotions((prev) => prev.filter((p) => p.id !== id))
  }

  async function handleStatus(id: string, status: string) {
    await updatePromotion(id, { status: status as any })
    setPromotions((prev) => prev.map((p) => p.id === id ? { ...p, status: status as any } : p))
  }

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Promotions immobilières</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{promotions.length} projet(s) en cours</p>
        </div>
        <Link href="/admin/promotions/new" className="btn-primary gap-2 text-sm whitespace-nowrap"><Plus size={16} />Ajouter un projet</Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="mb-4">Aucun projet immobilier pour le moment.</p>
          <Link href="/admin/promotions/new" className="btn-primary gap-2"><Plus size={16} />Ajouter votre premier projet</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {promotions.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col sm:flex-row">
              <div className="w-full sm:w-36 h-36 flex-shrink-0 bg-secondary">
                {p.images && p.images[0]
                  ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl">🏗</div>
                }
              </div>
              <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-navy truncate">{p.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status]}`}>{STATUS_LABELS[p.status]}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{p.location}</div>
                  {p.developer && <div className="text-xs text-muted-foreground mt-0.5">🏢 {p.developer}</div>}
                  {p.price_from && <div className="text-sm font-semibold text-gold mt-1">À partir de {p.price_from}</div>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select value={p.status} onChange={(e) => handleStatus(p.id, e.target.value)} className="text-xs border border-border rounded px-2 py-1.5 bg-background focus:outline-none focus:border-gold">
                    <option value="upcoming">Bientôt</option>
                    <option value="selling">En vente</option>
                    <option value="delivered">Livré</option>
                  </select>
                  <Link href={`/admin/promotions/${p.id}/edit`} className="btn-primary text-xs px-3 py-1.5 gap-1.5"><Pencil size={12} />Modifier</Link>
                  <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"><Trash2 size={12} />Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
