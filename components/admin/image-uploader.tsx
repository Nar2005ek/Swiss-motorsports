"use client"

import { useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X, Star } from "lucide-react"
import { toast } from "sonner"

export function ImageUploader({
  value,
  onChange,
}: {
  value: string[]
  onChange: (urls: string[]) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const supabase = createClient()

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg"
        const path = `${crypto.randomUUID()}.${ext}`
        const { error } = await supabase.storage.from("deal-images").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        })
        if (error) {
          toast.error(`Upload failed: ${error.message}`)
          continue
        }
        const { data } = supabase.storage.from("deal-images").getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
      if (uploaded.length) {
        onChange([...value, ...uploaded])
        toast.success(`${uploaded.length} image(s) uploaded`)
      }
    } finally {
      setUploading(false)
    }
  }

  function addUrl() {
    const url = urlInput.trim()
    if (!url) return
    onChange([...value, url])
    setUrlInput("")
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function makePrimary(index: number) {
    if (index === 0) return
    const next = [...value]
    const [item] = next.splice(index, 1)
    next.unshift(item)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <Label>Vehicle Images</Label>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, index) => (
            <div key={url + index} className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
              <Image src={url || "/placeholder.svg"} alt={`Vehicle image ${index + 1}`} fill className="object-cover" />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                  Primary
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                {index !== 0 && (
                  <Button type="button" size="icon" variant="secondary" className="size-7" onClick={() => makePrimary(index)}>
                    <Star className="size-3.5" />
                    <span className="sr-only">Make primary</span>
                  </Button>
                )}
                <Button type="button" size="icon" variant="destructive" className="size-7" onClick={() => removeAt(index)}>
                  <X className="size-3.5" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" disabled={uploading} asChild>
          <label className="cursor-pointer">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? "Uploading..." : "Upload images"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={uploading}
            />
          </label>
        </Button>
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Or paste an image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addUrl()
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addUrl}>
            Add
          </Button>
        </div>
      </div>

      {/* Hidden inputs so images submit with the form */}
      {value.map((url) => (
        <input key={url} type="hidden" name="images" value={url} />
      ))}
    </div>
  )
}
