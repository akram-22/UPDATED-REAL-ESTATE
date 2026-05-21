"use client"

import { useEffect, useState } from "react"
import { Trash2, CheckCircle, Clock, Phone, MessageSquare } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getLeads, markLeadRead, deleteLead } from "@/lib/db"
import type { Lead } from "@/lib/types"

const INTENT_LABELS: Record<string, string> = { buy: "🏠 Achat", sell: "💰 Vente", invest: "📈 Investissement", other: "💬 Autre" }
const INTENT_COLORS: Record<string, string> = { buy: "bg-blue-50 text-blue-700", sell: "bg-green-50 text-green-700", invest: "bg-purple-50 text-purple-700", other: "bg-gray-50 text-gray-700" }

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeads().then((l) => { setLeads(l); setLoading(false) })
  }, [])

  async function handleMarkRead(id: string) {
    await markLeadRead(id)
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, read: true } : l))
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce lead ?")) return
    await deleteLead(id)
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }

  const unread = leads.filter((l) => !l.read).length

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Leads & CRM</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{leads.length} contact(s) — <span className="text-red-600 font-medium">{unread} non lu(s)</span></p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl text-muted-foreground">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun lead pour le moment.</p>
          <p className="text-xs mt-1">Les contacts du formulaire apparaîtront ici automatiquement.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {leads.map((lead) => (
            <div key={lead.id} className={`bg-card border rounded-xl p-5 flex flex-col sm:flex-row gap-4 ${lead.read ? "border-border" : "border-gold/40 bg-gold/5"}`}>
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${lead.read ? "bg-secondary text-muted-foreground" : "bg-navy text-white"}`}>
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-navy">{lead.name}</span>
                    {!lead.read && <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">NOUVEAU</span>}
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${INTENT_COLORS[lead.intent]}`}>{INTENT_LABELS[lead.intent]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2"><Phone size={12} />{lead.phone}</div>
                  {lead.details && <p className="text-sm text-foreground bg-secondary rounded-lg px-3 py-2">{lead.details}</p>}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Clock size={11} />{new Date(lead.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 sm:items-end justify-end">
                <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=Bonjour%20${encodeURIComponent(lead.name)}%2C%20je%20suis%20Chabane.`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-green-500 text-white hover:bg-green-600 transition-colors font-medium whitespace-nowrap">
                  <MessageSquare size={12} />Répondre WA
                </a>
                {!lead.read && (
                  <button onClick={() => handleMarkRead(lead.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-navy/10 text-navy hover:bg-navy hover:text-white border border-navy/20 transition-colors whitespace-nowrap">
                    <CheckCircle size={12} />Marquer lu
                  </button>
                )}
                <button onClick={() => handleDelete(lead.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors">
                  <Trash2 size={12} />Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
