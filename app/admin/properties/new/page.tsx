"use client"

import { AdminShell } from "@/components/admin/admin-shell"
import { PropertyForm } from "@/components/admin/property-form"

export default function NewPropertyPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Ajouter un bien</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Remplissez les informations et uploadez les photos.</p>
      </div>
      <PropertyForm />
    </AdminShell>
  )
}
