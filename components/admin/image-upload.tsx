"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  label: string
  currentImage?: string | null
  onImageChange: (url: string) => void
  bucket: "products" | "site-assets"
  multiple?: boolean
  accept?: string
  description?: string
}

export function ImageUpload({
  label,
  currentImage,
  onImageChange,
  bucket,
  multiple = false,
  accept = "image/*",
  description,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 MB")
      return
    }

    setUploading(true)
    console.log("[v0] Uploading image:", file.name, "to bucket:", bucket)

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("[v0] Upload error:", error)
        throw error
      }

      console.log("[v0] Upload successful:", data)

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      console.log("[v0] Public URL:", publicUrl)

      setPreview(publicUrl)
      onImageChange(publicUrl)
    } catch (error: any) {
      console.error("[v0] Error uploading image:", error)
      alert(`Erreur lors du téléchargement: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className="w-full aspect-video rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/70 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-12 h-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cliquez pour télécharger une image</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (max 5MB)</p>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Téléchargement en cours...
        </div>
      )}
    </div>
  )
}
