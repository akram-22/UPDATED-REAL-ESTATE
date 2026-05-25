import { supabase } from "./supabase"
import type { Property, Promotion, Lead, SiteContent, SEOPage, Article, Redirect } from "./types"
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
