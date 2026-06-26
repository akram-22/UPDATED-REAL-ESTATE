"use client"

import { AdminShell } from "@/components/admin/admin-shell"
import { PromotionForm } from "@/components/admin/promotion-form"

export default function NewPromotionPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Ajouter un projet immobilier</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Créez une nouvelle promotion immobilière.</p>
      </div>
      <PromotionForm />
    </AdminShell>
  )
}
