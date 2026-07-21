"use client"

import { useId, useRef, useState } from "react"
import { FileText, Loader2, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.heic,.heif,application/pdf,image/jpeg,image/png,image/heic,image/heif"
const MAX_BYTES = 10 * 1024 * 1024

type DocumentUploadFieldProps = {
  name: string
  label: string
  description?: string
  error?: string
}

export function DocumentUploadField({
  name,
  label,
  description,
  error,
}: DocumentUploadFieldProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [reading, setReading] = useState(false)

  function clearFile() {
    setFileName(null)
    setLocalError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setLocalError(null)
    if (!file) {
      setFileName(null)
      return
    }
    if (file.size > MAX_BYTES) {
      setLocalError("File must be 10 MB or smaller.")
      clearFile()
      return
    }
    setReading(true)
    setFileName(file.name)
    // Brief loading affordance for large mobile picks
    window.setTimeout(() => setReading(false), 200)
  }

  const displayError = error || localError

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId}>
        {label} <span className="font-normal text-muted-foreground">(optional)</span>
      </Label>
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}

      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-dashed border-border bg-secondary/40 p-4 sm:flex-row sm:items-center sm:justify-between",
          displayError && "border-destructive/50",
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
            {reading ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <FileText className="h-5 w-5" aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {fileName ? fileName : "No file selected"}
            </p>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG, HEIC · max 10 MB</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-10"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {fileName ? "Replace" : "Choose file"}
          </Button>
          {fileName ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="min-h-10 text-destructive hover:text-destructive"
              onClick={clearFile}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={onChange}
      />

      {displayError ? <p className="text-xs text-destructive">{displayError}</p> : null}
    </div>
  )
}
