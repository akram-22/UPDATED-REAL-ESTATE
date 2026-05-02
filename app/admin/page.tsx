"use client"

import Link from "next/link"
import { Building2, MessageSquare, FileText, TrendingUp, Plus, ArrowRight, Clock } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { usePropertiesStore, useLeadsStore } from "@/lib/store"

export default function AdminDashboardPage() {
  const { properties } = usePropertiesStore()
  const { leads } = useLeadsStore()

  const available = properties.filter((p) => p.status === "available").length
  const sold = properties.filter((p) => p.status === "sold").length
  const unread = leads.filter((l) => !l.read).length
  const recentLeads = leads.slice(0, 5)

  const stats = [
    {
      label: "Biens actifs",
      value: available,
      sub: `${sold} vendus`,
      icon: Building2,
      href: "/admin/properties",
      color: "text-navy",
      bg: "bg-navy/5 border-navy/10",
    },
    {
      label: "Leads reçus",
      value: leads.length,
      sub: `${unread} non lus`,
      icon: MessageSquare,
      href: "/admin/leads",
      color: "text-gold",
      bg: "bg-gold/5 border-gold/10",
      badge: unread,
    },
    {
      label: "Biens total",
      value: properties.length,
      sub: "dans la base",
      icon: TrendingUp,
      href: "/admin/properties",
      color: "text-green-700",
      bg: "bg-green-50 border-green-100",
    },
    {
      label: "Contenu site",
      value: "Live",
      sub: "Modifiable",
      icon: FileText,
      href: "/admin/content",
      color: "text-purple-700",
      bg: "bg-purple-50 border-purple-100",
    },
  ]

  const intentLabels: Record<string, string> = {
    buy: "Achat",
    sell: "Vente",
    invest: "Investissement",
    other: "Autre",
  }

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Tableau de bord</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Bienvenue, Chabane. Voici un aperçu de votre activité.</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary gap-2 text-sm whitespace-nowrap">
          <Plus size={16} />
          Ajouter un bien
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`relative flex flex-col gap-3 p-5 rounded-xl border ${stat.bg} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
          >
            {stat.badge && stat.badge > 0 ? (
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {stat.badge}
              </span>
            ) : null}
            <stat.icon size={22} className={stat.color} />
            <div>
              <div className={`font-serif text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="font-medium text-sm text-foreground mt-0.5">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two-column grid: recent leads + quick actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy text-sm">Derniers leads</h2>
            <Link href="/admin/leads" className="text-xs text-gold hover:text-navy transition-colors flex items-center gap-1">
              Voir tous <ArrowRight size={11} />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="px-5 py-10 text-center text-muted-foreground text-sm">
              Aucun lead pour le moment.<br />Ils apparaîtront ici après soumission du formulaire.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href="/admin/leads"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-secondary transition-colors duration-100"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${lead.read ? "bg-secondary text-muted-foreground" : "bg-navy text-white"}`}>
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground truncate">{lead.name}</span>
                      {!lead.read && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{intentLabels[lead.intent]} · {lead.phone}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                    <Clock size={10} />
                    {new Date(lead.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy text-sm">Actions rapides</h2>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {[
              { label: "Ajouter un nouveau bien", href: "/admin/properties/new", icon: Plus, desc: "Publier un appartement sur le site" },
              { label: "Gérer les biens", href: "/admin/properties", icon: Building2, desc: "Modifier, supprimer, changer le statut" },
              { label: "Modifier le contenu", href: "/admin/content", icon: FileText, desc: "Hero, À propos, textes du site" },
              { label: "Voir les leads", href: "/admin/leads", icon: MessageSquare, desc: "Contacts reçus depuis le formulaire" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3.5 rounded-lg hover:bg-secondary transition-colors duration-150 group"
              >
                <div className="w-9 h-9 rounded-md bg-navy/5 border border-navy/10 flex items-center justify-center flex-shrink-0 group-hover:bg-navy group-hover:border-navy transition-colors duration-150">
                  <action.icon size={16} className="text-navy group-hover:text-white transition-colors duration-150" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.desc}</div>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-navy transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
