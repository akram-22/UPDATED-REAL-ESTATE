"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { PropertyForm } from "@/components/admin/property-form"
import { usePropertiesStore } from "@/lib/store"

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { properties } = usePropertiesStore()
  const property = properties.find((p) => p.id === id)

  if (!property) return notFound()

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
