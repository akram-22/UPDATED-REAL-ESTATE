"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getRelatedProperties, getOtherResidencesNearby, getRelatedArticles } from "@/lib/db"
import type { Property, Article } from "@/lib/types"

function SectionShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb" }}>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "700", color: "#0a1628", marginBottom: "16px", letterSpacing: "1px" }}>{title}</h2>
      {children}
    </div>
  )
}

function MiniPropertyCard({ property }: { property: Property }) {
  const router = useRouter()
  const img = (property.images || [])[0]
  return (
    <div onClick={() => router.push(`/properties/${property.id}`)}
      style={{ cursor: "pointer", borderRadius: "10px", overflow: "hidden", border: "1px solid #e5e7eb", transition: "border-color 0.2s" }}
      onMouseOver={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.5)")}
      onMouseOut={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb")}>
      <div style={{ aspectRatio: "4/3", backgroundColor: "#0a1628" }}>
        {img && <img src={img} alt={property.title} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "13px", fontWeight: 700, color: "#0a1628", marginBottom: "2px", lineHeight: "1.3" }}>{property.title}</div>
        <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>📍 {property.location}</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "13px", fontWeight: 700, color: "var(--gold)" }}>{property.price}</div>
      </div>
    </div>
  )
}

function MiniArticleCard({ article }: { article: Article }) {
  const router = useRouter()
  return (
    <div onClick={() => router.push(`/blog/${article.slug}`)}
      style={{ cursor: "pointer", borderRadius: "10px", overflow: "hidden", border: "1px solid #e5e7eb", transition: "border-color 0.2s" }}
      onMouseOver={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.5)")}
      onMouseOut={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb")}>
      {article.cover_image && (
        <div style={{ aspectRatio: "16/9", backgroundColor: "#0a1628" }}>
          <img src={article.cover_image} alt={article.cover_alt || article.title} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div style={{ padding: "12px" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "13px", fontWeight: 700, color: "#0a1628", lineHeight: "1.4" }}>{article.title}</div>
      </div>
    </div>
  )
}

const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "14px" }

/** "Biens similaires" — same type / location / residence. */
export function RelatedProperties({ property }: { property: Property }) {
  const [items, setItems] = useState<Property[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getRelatedProperties(property, 3).then((r) => { setItems(r); setLoaded(true) })
  }, [property.id])

  if (!loaded || items.length === 0) return null
  return (
    <SectionShell title="BIENS SIMILAIRES">
      <div style={gridStyle}>{items.map((p) => <MiniPropertyCard key={p.id} property={p} />)}</div>
    </SectionShell>
  )
}

/** "Autres résidences à [Ville]". */
export function NearbyResidences({ property }: { property: Property }) {
  const [items, setItems] = useState<Property[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getOtherResidencesNearby(property, 3).then((r) => { setItems(r); setLoaded(true) })
  }, [property.id])

  if (!loaded || items.length === 0) return null
  return (
    <SectionShell title={`AUTRES RÉSIDENCES À ${property.location.toUpperCase()}`}>
      <div style={gridStyle}>{items.map((p) => <MiniPropertyCard key={p.id} property={p} />)}</div>
    </SectionShell>
  )
}

/** "Voir aussi" — related articles by category/tags. */
export function RelatedArticles({ article }: { article: Article }) {
  const [items, setItems] = useState<Article[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getRelatedArticles(article, 3).then((r) => { setItems(r); setLoaded(true) })
  }, [article.id])

  if (!loaded || items.length === 0) return null
  return (
    <div style={{ marginTop: "16px" }}>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#0a1628", marginBottom: "16px" }}>Voir aussi</h2>
      <div style={gridStyle}>{items.map((a) => <MiniArticleCard key={a.id} article={a} />)}</div>
    </div>
  )
}
