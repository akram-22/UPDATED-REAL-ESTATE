import { breadcrumbSchema, type BreadcrumbEntry } from "@/lib/seo"

/**
 * Visual breadcrumb trail + BreadcrumbList JSON-LD schema.
 * `items` should NOT include "Accueil" — it's added automatically.
 */
export function Breadcrumb({ items, dark = false }: { items: BreadcrumbEntry[]; dark?: boolean }) {
  const full: BreadcrumbEntry[] = [{ name: "Accueil", path: "/" }, ...items]
  const schema = breadcrumbSchema(full)
  const linkColor = dark ? "rgba(255,255,255,0.6)" : "#9ca3af"
  const activeColor = dark ? "#ffffff" : "#0a1628"

  return (
    <nav aria-label="Fil d'ariane" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", fontSize: "12px", color: linkColor, fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {full.map((item, i) => {
        const isLast = i === full.length - 1
        return (
          <span key={item.path} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isLast ? (
              <span style={{ color: activeColor }} aria-current="page">{item.name}</span>
            ) : (
              <a href={item.path} style={{ color: linkColor, textDecoration: "none" }}>{item.name}</a>
            )}
            {!isLast && <span>/</span>}
          </span>
        )
      })}
    </nav>
  )
}
