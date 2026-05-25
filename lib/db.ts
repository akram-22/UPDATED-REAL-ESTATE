import { supabase } from "./supabase"
import type { Property, Promotion, Lead, SiteContent } from "./types"
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
