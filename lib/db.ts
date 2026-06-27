import { supabase } from "./supabase"
import type { Property, Promotion, Lead, SiteContent, SEOPage, Article, Redirect, BlogCategory, FAQSection, FAQItem, Neighborhood, SiteSettings } from "./types"
import { DEFAULT_CONTENT } from "./seed-data"

// ── PROPERTIES ────────────────────────────────────────────────
export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getProperty(id: string): Promise<Property | null> {
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).single()
  if (error) { console.error(error); return null }
  return data
}

export async function createProperty(data: Omit<Property, "id" | "created_at" | "updated_at">): Promise<Property | null> {
  const { data: result, error } = await supabase.from("properties").insert([{ ...data, updated_at: new Date().toISOString() }]).select().single()
  if (error) { console.error(error); return null }
  return result
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<Property | null> {
  const { data: result, error } = await supabase.from("properties").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id).select().single()
  if (error) { console.error(error); return null }
  return result
}

export async function deleteProperty(id: string): Promise<void> {
  await supabase.from("properties").delete().eq("id", id)
}

// ── PROMOTIONS ────────────────────────────────────────────────
export async function getPromotions(): Promise<Promotion[]> {
  const { data, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getPromotion(id: string): Promise<Promotion | null> {
  const { data, error } = await supabase.from("promotions").select("*").eq("id", id).single()
  if (error) { console.error(error); return null }
  return data
}

export async function createPromotion(data: Omit<Promotion, "id" | "created_at" | "updated_at">): Promise<Promotion | null> {
  const { data: result, error } = await supabase.from("promotions").insert([{ ...data, updated_at: new Date().toISOString() }]).select().single()
  if (error) { console.error(error); return null }
  return result
}

export async function updatePromotion(id: string, data: Partial<Promotion>): Promise<Promotion | null> {
  const { data: result, error } = await supabase.from("promotions").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id).select().single()
  if (error) { console.error(error); return null }
  return result
}

export async function deletePromotion(id: string): Promise<void> {
  await supabase.from("promotions").delete().eq("id", id)
}

// ── LEADS ─────────────────────────────────────────────────────
export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function createLead(data: Omit<Lead, "id" | "created_at" | "read">): Promise<Lead | null> {
  const { data: result, error } = await supabase.from("leads").insert([{ ...data, read: false }]).select().single()
  if (error) { console.error(error); return null }
  return result
}

export async function markLeadRead(id: string): Promise<void> {
  await supabase.from("leads").update({ read: true }).eq("id", id)
}

export async function deleteLead(id: string): Promise<void> {
  await supabase.from("leads").delete().eq("id", id)
}

// ── SITE CONTENT ──────────────────────────────────────────────
export async function getSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase.from("site_content").select("content").eq("id", 1).single()
  if (error || !data) return DEFAULT_CONTENT
  return data.content as SiteContent
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await supabase.from("site_content").upsert({ id: 1, content })
}

// ── SEO PAGES ─────────────────────────────────────────────────
export async function getSEOPages(): Promise<SEOPage[]> {
  const { data, error } = await supabase.from("seo_pages").select("*").order("page_key")
  if (error) { console.error(error); return [] }
  return data || []
}

export async function upsertSEOPage(page: Omit<SEOPage, "id" | "updated_at">): Promise<void> {
  await supabase.from("seo_pages").upsert({ ...page, updated_at: new Date().toISOString() }, { onConflict: "page_key" })
}

export async function getSEOPage(page_key: string): Promise<SEOPage | null> {
  const { data } = await supabase.from("seo_pages").select("*").eq("page_key", page_key).single()
  return data || null
}

// ── ARTICLES ──────────────────────────────────────────────────
export async function getArticles(publishedOnly = false): Promise<Article[]> {
  let query = supabase.from("articles").select("*").order("created_at", { ascending: false })
  if (publishedOnly) query = query.eq("published", true)
  const { data, error } = await query
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getArticle(id: string): Promise<Article | null> {
  const { data } = await supabase.from("articles").select("*").eq("id", id).single()
  return data || null
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data } = await supabase.from("articles").select("*").eq("slug", slug).eq("published", true).single()
  return data || null
}

export async function createArticle(data: Omit<Article, "id" | "created_at" | "updated_at">): Promise<Article | null> {
  const { data: result, error } = await supabase.from("articles").insert([{ ...data, updated_at: new Date().toISOString() }]).select().single()
  if (error) { console.error(error); return null }
  return result
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<void> {
  await supabase.from("articles").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id)
}

export async function deleteArticle(id: string): Promise<void> {
  await supabase.from("articles").delete().eq("id", id)
}

// ── REDIRECTS ─────────────────────────────────────────────────
export async function getRedirects(): Promise<Redirect[]> {
  const { data } = await supabase.from("redirects").select("*").order("created_at", { ascending: false })
  return data || []
}

export async function createRedirect(data: Omit<Redirect, "id" | "created_at">): Promise<void> {
  await supabase.from("redirects").insert([data])
}

export async function deleteRedirect(id: string): Promise<void> {
  await supabase.from("redirects").delete().eq("id", id)
}

// ── BLOG CATEGORIES ──────────────────────────────────────────────
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const { data, error } = await supabase.from("blog_categories").select("*").order("name")
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getBlogCategory(id: string): Promise<BlogCategory | null> {
  const { data } = await supabase.from("blog_categories").select("*").eq("id", id).single()
  return data || null
}

export async function createBlogCategory(data: Omit<BlogCategory, "id" | "created_at">): Promise<BlogCategory | null> {
  const { data: result, error } = await supabase.from("blog_categories").insert([data]).select().single()
  if (error) { console.error(error); return null }
  return result
}

export async function updateBlogCategory(id: string, data: Partial<BlogCategory>): Promise<void> {
  await supabase.from("blog_categories").update(data).eq("id", id)
}

export async function deleteBlogCategory(id: string): Promise<void> {
  await supabase.from("blog_categories").delete().eq("id", id)
}

// ── FAQ ───────────────────────────────────────────────────────
export async function getFAQSections(): Promise<FAQSection[]> {
  const { data, error } = await supabase.from("faq_sections").select("*").order("position", { ascending: true }).order("created_at", { ascending: true })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getFAQSectionsFor(attachType: string, attachRef: string): Promise<FAQSection[]> {
  const { data, error } = await supabase.from("faq_sections").select("*")
    .eq("attach_type", attachType).eq("attach_ref", attachRef)
    .order("position", { ascending: true })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function createFAQSection(data: Omit<FAQSection, "id" | "created_at" | "updated_at">): Promise<FAQSection | null> {
  const { data: result, error } = await supabase.from("faq_sections").insert([{ ...data, updated_at: new Date().toISOString() }]).select().single()
  if (error) { console.error(error); return null }
  return result
}

export async function updateFAQSection(id: string, data: Partial<FAQSection>): Promise<void> {
  await supabase.from("faq_sections").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id)
}

export async function deleteFAQSection(id: string): Promise<void> {
  await supabase.from("faq_sections").delete().eq("id", id)
}

export async function getFAQItems(sectionId: string): Promise<FAQItem[]> {
  const { data, error } = await supabase.from("faq_items").select("*").eq("section_id", sectionId).order("position", { ascending: true })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getAllFAQItems(): Promise<FAQItem[]> {
  const { data, error } = await supabase.from("faq_items").select("*").order("position", { ascending: true })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function createFAQItem(data: Omit<FAQItem, "id" | "created_at" | "updated_at">): Promise<FAQItem | null> {
  const { data: result, error } = await supabase.from("faq_items").insert([{ ...data, updated_at: new Date().toISOString() }]).select().single()
  if (error) { console.error(error); return null }
  return result
}

export async function updateFAQItem(id: string, data: Partial<FAQItem>): Promise<void> {
  await supabase.from("faq_items").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id)
}

export async function deleteFAQItem(id: string): Promise<void> {
  await supabase.from("faq_items").delete().eq("id", id)
}

export async function reorderFAQItems(items: { id: string; position: number }[]): Promise<void> {
  await Promise.all(items.map((it) => supabase.from("faq_items").update({ position: it.position }).eq("id", it.id)))
}

// ── NEIGHBORHOODS ─────────────────────────────────────────────
export async function getNeighborhoods(): Promise<Neighborhood[]> {
  const { data, error } = await supabase.from("neighborhoods").select("*").order("position", { ascending: true }).order("name")
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getNeighborhood(id: string): Promise<Neighborhood | null> {
  const { data } = await supabase.from("neighborhoods").select("*").eq("id", id).single()
  return data || null
}

export async function getNeighborhoodBySlug(slug: string): Promise<Neighborhood | null> {
  const { data } = await supabase.from("neighborhoods").select("*").eq("slug", slug).single()
  return data || null
}

export async function createNeighborhood(data: Omit<Neighborhood, "id" | "created_at" | "updated_at">): Promise<Neighborhood | null> {
  const { data: result, error } = await supabase.from("neighborhoods").insert([{ ...data, updated_at: new Date().toISOString() }]).select().single()
  if (error) { console.error(error); return null }
  return result
}

export async function updateNeighborhood(id: string, data: Partial<Neighborhood>): Promise<void> {
  await supabase.from("neighborhoods").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id)
}

export async function deleteNeighborhood(id: string): Promise<void> {
  await supabase.from("neighborhoods").delete().eq("id", id)
}

// ── SITE SETTINGS (Google Business Profile + Analytics) ────────
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 1, gbp_business_name: "", gbp_phone: "", gbp_service_area: "", gbp_profile_url: "",
  gbp_review_link: "", gbp_post_ideas: [], ga4_measurement_id: "", gsc_verification_code: "",
  seo_notes: "", updated_at: "",
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single()
  if (error || !data) return DEFAULT_SITE_SETTINGS
  return { ...DEFAULT_SITE_SETTINGS, ...data }
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  await supabase.from("site_settings").upsert({ id: 1, ...data, updated_at: new Date().toISOString() })
}

// ── INTERNAL LINKING ENGINE ─────────────────────────────────────
/** "Biens similaires" — same type or same location, excluding the current one. */
export async function getRelatedProperties(current: Property, limit = 3): Promise<Property[]> {
  const all = await getProperties()
  const others = all.filter((p) => p.id !== current.id && p.status !== "sold")
  const scored = others.map((p) => {
    let score = 0
    if (p.location === current.location) score += 2
    if (p.type === current.type) score += 1
    if (p.residence_name && p.residence_name === current.residence_name) score += 2
    return { p, score }
  }).filter((s) => s.score > 0)
  scored.sort((a, b) => b.score - a.score)
  const picked = scored.slice(0, limit).map((s) => s.p)
  if (picked.length < limit) {
    const fillers = others.filter((p) => !picked.includes(p)).slice(0, limit - picked.length)
    return [...picked, ...fillers]
  }
  return picked
}

/** "Autres résidences à Oran" — other properties in the same general area. */
export async function getOtherResidencesNearby(current: Property, limit = 3): Promise<Property[]> {
  const all = await getProperties()
  return all
    .filter((p) => p.id !== current.id && p.status !== "sold" && p.location === current.location)
    .slice(0, limit)
}

/** "Voir aussi" — related blog articles, by shared category or tags. */
export async function getRelatedArticles(current: Article, limit = 3): Promise<Article[]> {
  const all = await getArticles(true)
  const others = all.filter((a) => a.id !== current.id)
  const scored = others.map((a) => {
    let score = 0
    if (current.category_id && a.category_id === current.category_id) score += 2
    const sharedTags = (a.tags || []).filter((t) => (current.tags || []).includes(t))
    score += sharedTags.length
    return { a, score }
  }).filter((s) => s.score > 0)
  scored.sort((a, b) => b.score - a.score)
  const picked = scored.slice(0, limit).map((s) => s.a)
  if (picked.length < limit) {
    const fillers = others.filter((a) => !picked.includes(a)).slice(0, limit - picked.length)
    return [...picked, ...fillers]
  }
  return picked
}
