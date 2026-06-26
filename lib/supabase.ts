import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
}

// createClient() throws synchronously if given an empty/invalid URL. That's a
// problem because this module gets imported (and therefore evaluated) during
// `next build` for routes like /sitemap.xml, even before any of our code
// actually runs — so a missing env var would crash the whole build rather
// than just failing the specific data fetch. Falling back to a syntactically
// valid placeholder keeps client construction safe; if the real env vars are
// genuinely missing, calls will fail gracefully at request time instead
// (each lib/db.ts function already handles that and returns empty data).
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
)

export async function uploadFile(file: File, folder: string = "media"): Promise<string | null> {
  const ext = file.name.split(".").pop()
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { data, error } = await supabase.storage.from("media").upload(filename, file, {
    cacheControl: "3600",
    upsert: false,
  })
  if (error) { console.error("Upload error:", error); return null }
  const { data: urlData } = supabase.storage.from("media").getPublicUrl(data.path)
  return urlData.publicUrl
}

export async function deleteFile(url: string): Promise<void> {
  const path = url.split("/media/")[1]
  if (!path) return
  await supabase.storage.from("media").remove([path])
}
