"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Film } from "lucide-react"
import { uploadFile, deleteFile } from "@/lib/supabase"

interface MediaUploadProps {
  images: string[]
  videoUrl: string
  onImagesChange: (urls: string[]) => void
  onVideoChange: (url: string) => void
}

export function MediaUpload({ images, videoUrl, onImagesChange, onVideoChange }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const imgRef = useRef<HTMLInputElement>(null)
  const vidRef = useRef<HTMLInputElement>(null)

  async function handleImageFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    const urls: string[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue
      const url = await uploadFile(file, "images")
      if (url) urls.push(url)
    }
    onImagesChange([...images, ...urls])
    setUploading(false)
  }

  async function handleVideoFile(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    setUploadingVideo(true)
    const url = await uploadFile(file, "videos")
    if (url) onVideoChange(url)
    setUploadingVideo(false)
  }

  async function removeImage(idx: number) {
    const url = images[idx]
    await deleteFile(url)
    onImagesChange(images.filter((_, i) => i !== idx))
  }

  async function removeVideo() {
    await deleteFile(videoUrl)
    onVideoChange("")
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleImageFiles(e.dataTransfer.files)
  }, [images])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-xs font-semibold text-navy mb-2 tracking-wide uppercase">Photos de l'appartement</label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => imgRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${dragOver ? "border-gold bg-gold/5" : "border-border hover:border-gold hover:bg-gold/5"}`}
        >
          <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium text-navy">{uploading ? "Upload en cours..." : "Glissez vos photos ici ou cliquez"}</p>
          <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WEBP — plusieurs photos possibles</p>
        </div>
        <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageFiles(e.target.files)} />
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {images.map((url, idx) => (
              <div key={url} className="relative group rounded-lg overflow-hidden aspect-square border border-border">
                <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(idx) }} className="bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"><X size={12} /></button>
                </div>
                {idx === 0 && <span className="absolute top-1 left-1 bg-gold text-navy text-[9px] font-bold px-1.5 py-0.5 rounded">PRINCIPALE</span>}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="block text-xs font-semibold text-navy mb-2 tracking-wide uppercase">Vidéo de visite (MP4, MOV)</label>
        {videoUrl ? (
          <div className="relative rounded-lg overflow-hidden border border-border">
            <video src={videoUrl} controls className="w-full max-h-48 object-cover" />
            <button type="button" onClick={removeVideo} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"><X size={12} /></button>
          </div>
        ) : (
          <div onClick={() => vidRef.current?.click()} className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all duration-200">
            <Film size={24} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-navy">{uploadingVideo ? "Upload vidéo en cours..." : "Uploader une vidéo de visite"}</p>
            <p className="text-xs text-muted-foreground mt-1">MP4, MOV — max 500MB</p>
          </div>
        )}
        <input ref={vidRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleVideoFile(e.target.files)} />
      </div>
    </div>
  )
}
