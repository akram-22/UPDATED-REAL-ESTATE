"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Plus, Pencil, Trash2, X, Check, ChevronDown, ChevronUp, GripVertical,
  HelpCircle, FileText, Building2, BookOpen,
} from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  getFAQSections, createFAQSection, updateFAQSection, deleteFAQSection,
  getFAQItems, createFAQItem, updateFAQItem, deleteFAQItem, reorderFAQItems,
  getProperties, getArticles,
} from "@/lib/db"
import type { FAQSection, FAQItem, FAQAttachType, Property, Article } from "@/lib/types"

const PAGE_OPTIONS = [
  { value: "home", label: "Page d'accueil" },
  { value: "properties", label: "Biens immobiliers (liste)" },
  { value: "promotions", label: "Promotions (liste)" },
  { value: "blog", label: "Blog (liste)" },
]

function textToHtml(text: string) {
  return text.split(/\n\s*\n/).map((p) => `<p>${p.trim().replace(/\n/g, "<br/>")}</p>`).join("")
}

function htmlToText(html: string) {
  return html.replace(/<\/p>\s*<p>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "").trim()
}

function attachLabel(section: FAQSection, properties: Property[], articles: Article[]) {
  if (section.attach_type === "page") return PAGE_OPTIONS.find((p) => p.value === section.attach_ref)?.label || section.attach_ref
  if (section.attach_type === "property") return properties.find((p) => p.id === section.attach_ref)?.title || "Bien supprimé"
  return articles.find((a) => a.id === section.attach_ref)?.title || "Article supprimé"
}

function attachIcon(type: FAQAttachType) {
  if (type === "page") return <FileText size={12} />
  if (type === "property") return <Building2 size={12} />
  return <BookOpen size={12} />
}

function SectionForm({ initial, properties, articles, onSave, onCancel }: {
  initial?: Partial<FAQSection>
  properties: Property[]; articles: Article[]
  onSave: (data: { title: string; description: string; attach_type: FAQAttachType; attach_ref: string }) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title || "")
  const [description, setDescription] = useState(initial?.description || "")
  const [attachType, setAttachType] = useState<FAQAttachType>(initial?.attach_type || "page")
  const [attachRef, setAttachRef] = useState(initial?.attach_ref || PAGE_OPTIONS[0].value)

  function handleTypeChange(t: FAQAttachType) {
    setAttachType(t)
    if (t === "page") setAttachRef(PAGE_OPTIONS[0].value)
    else if (t === "property") setAttachRef(properties[0]?.id || "")
    else setAttachRef(articles[0]?.id || "")
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="font-semibold text-navy mb-4">{initial?.title !== undefined ? "Modifier la section" : "Nouvelle section FAQ"}</h2>
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Titre de la section</label>
          <input type="text" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Questions fréquentes sur l'achat" className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Description (optionnel)</label>
          <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Attacher à</label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {(["page", "property", "article"] as FAQAttachType[]).map((t) => (
              <button key={t} type="button" onClick={() => handleTypeChange(t)}
                className={`flex items-center justify-center gap-1.5 text-xs px-2 py-2 rounded border transition-colors ${attachType === t ? "bg-navy text-white border-navy" : "border-border hover:bg-secondary"}`}>
                {attachIcon(t)}{t === "page" ? "Page" : t === "property" ? "Bien" : "Article"}
              </button>
            ))}
          </div>
          {attachType === "page" && (
            <select value={attachRef} onChange={(e) => setAttachRef(e.target.value)} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold">
              {PAGE_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          )}
          {attachType === "property" && (
            properties.length === 0 ? <p className="text-xs text-muted-foreground">Aucun bien disponible.</p> : (
              <select value={attachRef} onChange={(e) => setAttachRef(e.target.value)} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold">
                {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            )
          )}
          {attachType === "article" && (
            articles.length === 0 ? <p className="text-xs text-muted-foreground">Aucun article disponible.</p> : (
              <select value={attachRef} onChange={(e) => setAttachRef(e.target.value)} className="w-full px-3 py-2.5 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold">
                {articles.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            )
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button onClick={() => attachRef && title.trim() && onSave({ title: title.trim(), description: description.trim(), attach_type: attachType, attach_ref: attachRef })}
            disabled={!title.trim() || !attachRef} className="btn-primary gap-1.5 text-sm flex-1 justify-center"><Check size={14} />Enregistrer</button>
          <button onClick={onCancel} className="flex items-center justify-center gap-1.5 text-sm px-3 py-2.5 rounded border border-border hover:bg-secondary transition-colors"><X size={14} /></button>
        </div>
      </div>
    </div>
  )
}

function ItemEditor({ item, onSave, onCancel }: {
  item?: FAQItem
  onSave: (q: string, a: string) => void
  onCancel: () => void
}) {
  const [question, setQuestion] = useState(item?.question || "")
  const [answer, setAnswer] = useState(item ? htmlToText(item.answer) : "")
  return (
    <div className="bg-secondary/60 rounded-lg p-4 flex flex-col gap-3">
      <div>
        <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Question</label>
        <input type="text" autoFocus value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ex: Quels sont les frais de notaire à Oran ?" className="w-full px-3 py-2 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:border-gold" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-navy mb-1 tracking-wide uppercase">Réponse</label>
        <textarea rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Rédigez la réponse. Laissez une ligne vide pour créer un nouveau paragraphe." className="w-full px-3 py-2 rounded-sm border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:border-gold" />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => question.trim() && answer.trim() && onSave(question.trim(), textToHtml(answer.trim()))} disabled={!question.trim() || !answer.trim()} className="btn-primary gap-1.5 text-xs px-3 py-2"><Check size={13} />Enregistrer</button>
        <button onClick={onCancel} className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded border border-border hover:bg-background transition-colors"><X size={13} /></button>
      </div>
    </div>
  )
}

function SectionCard({ section, properties, articles, onUpdated, onDeleted }: {
  section: FAQSection; properties: Property[]; articles: Article[]
  onUpdated: () => void; onDeleted: () => void
}) {
  const [items, setItems] = useState<FAQItem[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [expanded, setExpanded] = useState(true)
  const [editingSection, setEditingSection] = useState(false)
  const [addingItem, setAddingItem] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  function loadItems() {
    setLoadingItems(true)
    getFAQItems(section.id).then((it) => { setItems(it); setLoadingItems(false) })
  }

  useEffect(() => { loadItems() }, [section.id])

  async function handleDeleteSection() {
    if (!confirm(`Supprimer la section "${section.title}" et toutes ses questions ?`)) return
    await deleteFAQSection(section.id)
    onDeleted()
  }

  async function handleAddItem(q: string, a: string) {
    await createFAQItem({ section_id: section.id, question: q, answer: a, position: items.length })
    setAddingItem(false)
    loadItems()
  }

  async function handleUpdateItem(id: string, q: string, a: string) {
    await updateFAQItem(id, { question: q, answer: a })
    setEditingItemId(null)
    loadItems()
  }

  async function handleDeleteItem(id: string) {
    if (!confirm("Supprimer cette question ?")) return
    await deleteFAQItem(id)
    loadItems()
  }

  async function moveItem(index: number, dir: -1 | 1) {
    const newIndex = index + dir
    if (newIndex < 0 || newIndex >= items.length) return
    const reordered = [...items]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(newIndex, 0, moved)
    setItems(reordered)
    await reorderFAQItems(reordered.map((it, i) => ({ id: it.id, position: i })))
  }

  if (editingSection) {
    return (
      <SectionForm
        initial={section}
        properties={properties}
        articles={articles}
        onCancel={() => setEditingSection(false)}
        onSave={async (data) => { await updateFAQSection(section.id, data); setEditingSection(false); onUpdated() }}
      />
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4 bg-secondary/40">
        <button onClick={() => setExpanded((e) => !e)} className="flex items-center gap-2 min-w-0 text-left flex-1">
          {expanded ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
          <div className="min-w-0">
            <div className="font-semibold text-navy truncate">{section.title}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              {attachIcon(section.attach_type)}
              <span className="truncate">{attachLabel(section, properties, articles)}</span>
              <span>· {items.length} question{items.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setEditingSection(true)} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded border border-border hover:bg-background transition-colors"><Pencil size={12} /></button>
          <button onClick={handleDeleteSection} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"><Trash2 size={12} /></button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 flex flex-col gap-3">
          {loadingItems ? (
            <div className="text-center py-6"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gold mx-auto" /></div>
          ) : (
            <>
              {items.map((item, i) =>
                editingItemId === item.id ? (
                  <ItemEditor key={item.id} item={item} onCancel={() => setEditingItemId(null)} onSave={(q, a) => handleUpdateItem(item.id, q, a)} />
                ) : (
                  <div key={item.id} className="flex items-start gap-2 border border-border rounded-lg p-3">
                    <div className="flex flex-col gap-0.5 mt-0.5 flex-shrink-0">
                      <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-navy disabled:opacity-20"><ChevronUp size={13} /></button>
                      <button onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="text-muted-foreground hover:text-navy disabled:opacity-20"><ChevronDown size={13} /></button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-navy">{item.question}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{htmlToText(item.answer)}</div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => setEditingItemId(item.id)} className="text-muted-foreground hover:text-navy p-1"><Pencil size={13} /></button>
                      <button onClick={() => handleDeleteItem(item.id)} className="text-muted-foreground hover:text-red-600 p-1"><Trash2 size={13} /></button>
                    </div>
                  </div>
                )
              )}
              {addingItem ? (
                <ItemEditor onCancel={() => setAddingItem(false)} onSave={handleAddItem} />
              ) : (
                <button onClick={() => setAddingItem(true)} className="flex items-center justify-center gap-1.5 text-sm py-2.5 rounded border border-dashed border-border hover:border-gold hover:text-gold text-muted-foreground transition-colors">
                  <Plus size={14} />Ajouter une question
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function FAQManagerContent() {
  const searchParams = useSearchParams()
  const presetType = searchParams.get("attach_type") as FAQAttachType | null
  const presetRef = searchParams.get("attach_ref")

  const [sections, setSections] = useState<FAQSection[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [filterToPreset, setFilterToPreset] = useState(!!(presetType && presetRef))

  function load() {
    Promise.all([getFAQSections(), getProperties(), getArticles()]).then(([s, p, a]) => {
      setSections(s); setProperties(p); setArticles(a); setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const visibleSections = filterToPreset && presetType && presetRef
    ? sections.filter((s) => s.attach_type === presetType && s.attach_ref === presetRef)
    : sections

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy flex items-center gap-2"><HelpCircle size={26} className="text-gold" />FAQ Manager</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Questions fréquentes attachées à vos pages, biens et articles — avec balisage Schema.org automatique.</p>
        </div>
        {!creating && (
          <button onClick={() => setCreating(true)} className="btn-primary gap-2 text-sm whitespace-nowrap"><Plus size={16} />Nouvelle section</button>
        )}
      </div>

      {presetType && presetRef && (
        <div className="mb-6 flex items-center gap-2 text-xs">
          <button onClick={() => setFilterToPreset((f) => !f)} className={`px-3 py-1.5 rounded-full border transition-colors ${filterToPreset ? "bg-navy text-white border-navy" : "border-border text-muted-foreground hover:bg-secondary"}`}>
            {filterToPreset ? "✓ Filtré sur cette page/élément" : "Afficher uniquement cet élément"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
      ) : (
        <div className="flex flex-col gap-4">
          {creating && (
            <SectionForm
              initial={presetType && presetRef ? { attach_type: presetType, attach_ref: presetRef } : undefined}
              properties={properties}
              articles={articles}
              onCancel={() => setCreating(false)}
              onSave={async (data) => { await createFAQSection({ ...data, position: sections.length }); setCreating(false); load() }}
            />
          )}

          {visibleSections.length === 0 && !creating && (
            <div className="text-center py-20 bg-card border border-border rounded-xl text-muted-foreground">
              <p className="text-4xl mb-4">❓</p>
              <p className="font-semibold mb-2">Aucune section FAQ</p>
              <p className="text-sm mb-6">Créez des FAQ pour répondre aux questions de vos visiteurs et améliorer votre SEO grâce au balisage Schema.org FAQPage.</p>
              <button onClick={() => setCreating(true)} className="btn-primary gap-2 mx-auto"><Plus size={16} />Créer une section</button>
            </div>
          )}

          {visibleSections.map((section) => (
            <SectionCard key={section.id} section={section} properties={properties} articles={articles} onUpdated={load} onDeleted={load} />
          ))}
        </div>
      )}
    </AdminShell>
  )
}

export default function AdminFAQPage() {
  return (
    <Suspense fallback={<AdminShell><div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div></AdminShell>}>
      <FAQManagerContent />
    </Suspense>
  )
}
