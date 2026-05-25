"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { PromotionForm } from "@/components/admin/promotion-form"
import { getPromotion } from "@/lib/db"
import type { Promotion } from "@/lib/types"

export default function EditPromotionPage() {
  const params = useParams()
  const id = params?.id as string
  const [promo, setPromo] = useState<Promotion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) getPromotion(id).then((p) => { setPromo(p); setLoading(false) })
  }, [id])

  if (loading) return <AdminShell><div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div></AdminShell>
  if (!promo) return <AdminShell><div className="text-center py-20 text-muted-foreground">Promotion introuvable.</div></AdminShell>

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Modifier le projet</h1>
        <p className="text-muted-foreground text-sm mt-0.5 truncate">{promo.title}</p>
      </div>
      <PromotionForm existing={promo} />
    </AdminShell>
  )
}
