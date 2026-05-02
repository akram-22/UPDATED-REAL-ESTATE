"use client"

import Link from "next/link"
import { useState } from "react"
import { Plus, Pencil, Trash2, MapPin, Bed, Maximize2, CheckCircle2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { usePropertiesStore } from "@/lib/store"
import type { Property } from "@/lib/types"

const STATUS_LABELS: Record<Property["status"], { label: string; className: string }> = {
  available: { label: "Disponible", className: "bg-green-100 text-green-800" },
  reserved: { label: "Réservé", className: "bg-yellow-100 text-yellow-800" },
  sold: { label: "Vendu", className: "bg-gray-100 text-gray-600" },
}

export default function AdminPropertiesPage() {
  const { properties, deleteProperty, updateProperty } = usePropertiesStore()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "available" | "reserved" | "sold">("all")

  const filtered = filter === "all" ? properties : properties.filter((p) => p.status === filter)

  function handleDelete(id: string) {
    deleteProperty(id)
    setConfirmDelete(null)
  }

  function toggleStatus(p: Property) {
    const next: Property["status"] =
      p.status === "available" ? "reserved" : p.status === "reserved" ? "sold" : "available"
    updateProperty(p.id, { status: next })
  }

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Biens immobiliers</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{properties.length} bien(s) dans la base de données</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary gap-2 text-sm whitespace-nowrap">
          <Plus size={16} />
          Ajouter un bien
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {(["all", "available", "reserved", "sold"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-all duration-150 ${
              filter === f
                ? "bg-navy text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            {f === "all" ? "Tous" : STATUS_LABELS[f].label}
            <span className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full ${filter === f ? "bg-white/20 text-white" : "bg-border text-muted-foreground"}`}>
              {f === "all" ? properties.length : properties.filter((p) => p.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Properties grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <div className="text-5xl mb-4">🏠</div>
          <p className="font-semibold text-navy mb-1">Aucun bien trouvé</p>
          <p className="text-sm mb-6">Commencez par ajouter votre premier bien.</p>
          <Link href="/admin/properties/new" className="btn-primary gap-2 text-sm">
            <Plus size={14} /> Ajouter un bien
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((property) => {
            const statusInfo = STATUS_LABELS[property.status]
            return (
              <div key={property.id} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
                {/* Image */}
                <div className="relative aspect-[16/9] bg-secondary overflow-hidden">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      Pas de photo
                    </div>
                  )}
                  {/* Status badge */}
                  <button
                    onClick={() => toggleStatus(property)}
                    title="Cliquer pour changer le statut"
                    className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </button>
                  {/* Type */}
                  <span className="absolute top-2 left-2 bg-navy text-white text-xs font-bold px-2 py-1 rounded">
                    {property.type}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-serif font-bold text-navy text-base leading-snug mb-1 truncate">{property.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                    <MapPin size={10} className="text-gold flex-shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>
                  <div className="text-gold font-bold text-lg mb-3">{property.price}</div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Maximize2 size={10} className="text-gold" />{property.surface}</span>
                    <span className="flex items-center gap-1"><Bed size={10} className="text-gold" />{property.rooms} pièces</span>
                  </div>

                  {property.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {property.features.slice(0, 3).map((f) => (
                        <span key={f} className="flex items-center gap-1 text-[11px] bg-secondary text-muted-foreground px-2 py-0.5 rounded">
                          <CheckCircle2 size={8} className="text-gold" />{f}
                        </span>
                      ))}
                      {property.features.length > 3 && (
                        <span className="text-[11px] text-muted-foreground">+{property.features.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-3 border-t border-border">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-sm border border-border hover:border-gold hover:text-gold transition-colors duration-150"
                    >
                      <Pencil size={13} /> Modifier
                    </Link>
                    {confirmDelete === property.id ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="px-3 py-2 text-xs font-semibold bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-3 py-2 text-xs font-medium border border-border rounded-sm hover:bg-secondary transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(property.id)}
                        className="px-3 py-2 rounded-sm border border-border text-muted-foreground hover:border-red-300 hover:text-red-600 transition-colors duration-150"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={14} />
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
