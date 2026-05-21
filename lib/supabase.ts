import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
