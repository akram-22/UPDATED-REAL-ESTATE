"use client"

import { useState } from "react"
import { Trash2, MessageSquare, Phone, CheckCircle2, Clock } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { useLeadsStore } from "@/lib/store"
import type { Lead } from "@/lib/types"

const INTENT_LABELS: Record<Lead["intent"], { label: string; color: string }> = {
  buy: { label: "Achat", color: "bg-blue-100 text-blue-800" },
  sell: { label: "Vente", color: "bg-purple-100 text-purple-800" },
  invest: { label: "Investissement", color: "bg-green-100 text-green-800" },
  other: { label: "Autre", color: "bg-gray-100 text-gray-700" },
}

export default function AdminLeadsPage() {
  const { leads, markAsRead, deleteLead } = useLeadsStore()
  const [filter, setFilter] = useState<"all" | "unread" | Lead["intent"]>("all")
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = leads.filter((l) => {
    if (filter === "all") return true
    if (filter === "unread") return !l.read
    return l.intent === filter
  })

  const unread = leads.filter((l) => !l.read).length

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function handleWhatsApp(lead: Lead) {
    markAsRead(lead.id)
    const msg = encodeURIComponent(
      `Bonjour ${lead.name}, je suis Chabane de Chabano Properties. J'ai bien reçu votre demande concernant : ${INTENT_LABELS[lead.intent].label}. Comment puis-je vous aider ?`
    )
    window.open(`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${msg}`, "_blank")
  }

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Leads & contacts</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {leads.length} lead(s) au total
            {unread > 0 && <span className="text-red-500 font-medium"> · {unread} non lu(s)</span>}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {([
          { id: "all", label: "Tous" },
          { id: "unread", label: "Non lus" },
          { id: "buy", label: "Achat" },
          { id: "sell", label: "Vente" },
          { id: "invest", label: "Investissement" },
          { id: "other", label: "Autre" },
        ] as const).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-all duration-150 ${
              filter === f.id
                ? "bg-navy text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            {f.label}
            {f.id === "unread" && unread > 0 && (
              <span className="ml-1.5 text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[16px] h-4 inline-flex items-center justify-center px-1">
                {unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Leads list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquare size={40} className="mx-auto mb-4 text-border" />
          <p className="font-semibold text-navy mb-1">Aucun lead trouvé</p>
          <p className="text-sm">Les contacts soumis via le formulaire du site apparaîtront ici.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((lead) => {
            const intentInfo = INTENT_LABELS[lead.intent]
            return (
              <div
                key={lead.id}
                className={`bg-card border rounded-xl p-5 transition-all duration-200 ${
                  !lead.read ? "border-gold/40 shadow-sm shadow-gold/10" : "border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-base flex-shrink-0 ${!lead.read ? "bg-navy text-white" : "bg-secondary text-navy"}`}>
                    {lead.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-navy text-base">{lead.name}</span>
                      {!lead.read && (
                        <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">Nouveau</span>
                      )}
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${intentInfo.color}`}>
                        {intentInfo.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                      <Phone size={11} />
                      <span>{lead.phone}</span>
                    </div>

                    {lead.details && (
                      <p className="text-sm text-muted-foreground bg-secondary rounded px-3 py-2 mt-2 text-pretty leading-relaxed">
                        {lead.details}
                      </p>
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-3">
                      <Clock size={10} />
                      {formatDate(lead.createdAt)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleWhatsApp(lead)}
                      className="whatsapp-btn text-xs px-3 py-2 gap-1.5"
                      title="Répondre sur WhatsApp"
                    >
                      <WhatsAppIcon />
                      Répondre
                    </button>

                    {!lead.read && (
                      <button
                        onClick={() => markAsRead(lead.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-navy transition-colors px-3 py-2 border border-border rounded hover:border-navy"
                      >
                        <CheckCircle2 size={12} />
                        Marquer lu
                      </button>
                    )}

                    {confirmDelete === lead.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => { deleteLead(lead.id); setConfirmDelete(null) }} className="text-[11px] font-semibold bg-red-600 text-white px-2 py-1.5 rounded hover:bg-red-700 transition-colors">
                          Supprimer
                        </button>
                        <button onClick={() => setConfirmDelete(null)} className="text-[11px] px-2 py-1.5 border border-border rounded hover:bg-secondary transition-colors">
                          Non
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(lead.id)}
                        className="p-2 rounded border border-border text-muted-foreground hover:text-red-600 hover:border-red-200 transition-colors self-end"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminShell>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
