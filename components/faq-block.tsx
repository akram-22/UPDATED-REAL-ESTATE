"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { getFAQSectionsFor, getFAQItems } from "@/lib/db"
import type { FAQSection, FAQItem, FAQAttachType } from "@/lib/types"

interface FAQBlockProps {
  attachType: FAQAttachType
  attachRef: string
  /** Optional: render nothing until loaded to avoid layout shift */
  className?: string
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

export function useFAQData(attachType: FAQAttachType, attachRef: string) {
  const [sections, setSections] = useState<FAQSection[]>([])
  const [itemsBySection, setItemsBySection] = useState<Record<string, FAQItem[]>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    setLoaded(false)
    if (!attachRef) { setLoaded(true); return }
    getFAQSectionsFor(attachType, attachRef).then(async (secs) => {
      const entries = await Promise.all(secs.map(async (s) => [s.id, await getFAQItems(s.id)] as const))
      if (!active) return
      setSections(secs)
      setItemsBySection(Object.fromEntries(entries))
      setLoaded(true)
    })
    return () => { active = false }
  }, [attachType, attachRef])

  const allItems = sections.flatMap((s) => itemsBySection[s.id] || [])
  return { sections, itemsBySection, loaded, hasContent: allItems.length > 0, allItems }
}

function AccordionItem({ item, defaultOpen = false }: { item: FAQItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{item.question}</span>
        <ChevronDown size={18} className={`faq-chevron ${open ? "open" : ""}`} />
      </button>
      <div className={`faq-answer-wrap ${open ? "open" : ""}`}>
        <div className="faq-answer-inner">
          <div className="faq-answer" dangerouslySetInnerHTML={{ __html: item.answer }} />
        </div>
      </div>
    </div>
  )
}

/**
 * Fetches FAQ sections attached to a given page/property/article and renders
 * them as accordions, with an automatically generated FAQPage JSON-LD schema
 * for SEO rich results.
 */
export function FAQBlock({ attachType, attachRef, className }: FAQBlockProps) {
  const { sections, itemsBySection, loaded, hasContent, allItems } = useFAQData(attachType, attachRef)

  if (!loaded || !hasContent) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: stripHtml(it.answer) },
    })),
  }

  return (
    <div className={className}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {sections.map((section) => {
        const items = itemsBySection[section.id] || []
        if (items.length === 0) return null
        return (
          <div key={section.id} style={{ marginBottom: "8px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{ width: "24px", height: "1px", backgroundColor: "var(--gold)" }} />
              <span style={{ color: "var(--gold)", fontSize: "10px", letterSpacing: "4px", fontFamily: "Georgia, serif" }}>FAQ</span>
            </div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#0a1628", marginBottom: section.description ? "8px" : "16px" }}>
              {section.title}
            </h2>
            {section.description && (
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>{section.description}</p>
            )}
            <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "4px 20px" }}>
              {items.map((item) => <AccordionItem key={item.id} item={item} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
