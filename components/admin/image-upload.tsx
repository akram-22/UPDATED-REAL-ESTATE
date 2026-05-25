"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { uploadFile, deleteFile } from "@/lib/supabase"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label: string
  hint?: string
}

export function ImageUpload({ value, onChange, label, hint }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith("image/")) return
    setUploading(true)
    if (value) await deleteFile(value)
    const url = await uploadFile(file, "cms")
    if (url) onChange(url)
    setUploading(false)
  }

  async function remove() {
    if (value) await deleteFile(value)
    onChange("")
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">{label}</label>
      {hint && <p className="text-muted-foreground text-xs mb-1.5">{hint}</p>}
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={value} alt="Aperçu" className="w-full h-40 object-cover" />
          <button type="button" onClick={remove} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"><X size={12} /></button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files) }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${dragOver ? "border-gold bg-gold/5" : "border-border hover:border-gold hover:bg-gold/5"}`}
        >
          <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium text-navy">{uploading ? "Upload en cours..." : "Cliquez ou glissez une image"}</p>
          <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WEBP</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files)} />
    </div>
  )
}
