"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { PropertyForm } from "@/components/admin/property-form"
import { getProperty } from "@/lib/db"
import type { Property } from "@/lib/types"

export default function EditPropertyPage() {
  const params = useParams()
  const id = params?.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) getProperty(id).then((p) => { setProperty(p); setLoading(false) })
  }, [id])

  if (loading) return <AdminShell><div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div></AdminShell>
  if (!property) return <AdminShell><div className="text-center py-20 text-muted-foreground">Bien introuvable.</div></AdminShell>

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Modifier le bien</h1>
        <p className="text-muted-foreground text-sm mt-0.5 truncate">{property.title}</p>
      </div>
      <PropertyForm existing={property} />
    </AdminShell>
  )
}
