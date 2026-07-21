import { randomUUID } from "crypto"
import type { SupabaseClient } from "@supabase/supabase-js"

export const APPLICATION_DOCUMENTS_BUCKET = "application-documents"
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
])

const ALLOWED_EXT = new Set(["pdf", "jpg", "jpeg", "png", "heic", "heif"])

const BLOCKED_EXT = new Set([
  "exe",
  "bat",
  "cmd",
  "com",
  "msi",
  "scr",
  "js",
  "mjs",
  "cjs",
  "ts",
  "tsx",
  "jsx",
  "html",
  "htm",
  "svg",
  "xml",
  "php",
  "sh",
  "ps1",
  "py",
  "rb",
  "jar",
  "dll",
  "so",
])

export type DocumentKind = "drivers_license" | "insurance_card"

export function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "file"
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file"
}

export function validateDocumentFile(
  file: File | null,
  label: string,
):
  | { ok: true; file: File; ext: string }
  | { ok: true; empty: true }
  | { ok: false; error: string } {
  if (!file || file.size === 0) return { ok: true, empty: true }

  if (file.size > MAX_DOCUMENT_BYTES) {
    return { ok: false, error: `${label} must be 10 MB or smaller.` }
  }

  const original = sanitizeFilename(file.name)
  const ext = (original.includes(".") ? original.split(".").pop() : "")?.toLowerCase() ?? ""

  if (!ext || BLOCKED_EXT.has(ext) || !ALLOWED_EXT.has(ext)) {
    return {
      ok: false,
      error: `${label} must be a PDF, JPG, JPEG, PNG, HEIC, or HEIF file.`,
    }
  }

  const mime = (file.type || "").toLowerCase()
  const heicExt = ext === "heic" || ext === "heif"
  if (mime) {
    const mimeOk =
      ALLOWED_MIME.has(mime) || (heicExt && mime.startsWith("image/"))
    if (!mimeOk || mime.includes("svg") || mime.includes("html") || mime.includes("javascript")) {
      return {
        ok: false,
        error: `${label} must be a PDF, JPG, JPEG, PNG, HEIC, or HEIF file.`,
      }
    }
  }

  return { ok: true, file, ext }
}

export async function uploadApplicationDocument(
  supabase: SupabaseClient,
  applicationId: string,
  kind: DocumentKind,
  file: File,
  ext: string,
): Promise<{ path: string } | { error: string }> {
  const safeName = sanitizeFilename(file.name)
  const path = `${applicationId}/${kind}/${randomUUID()}-${safeName.replace(/\.[^.]+$/, "")}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const contentType =
    file.type ||
    (ext === "pdf"
      ? "application/pdf"
      : ext === "png"
        ? "image/png"
        : ext === "heic"
          ? "image/heic"
          : ext === "heif"
            ? "image/heif"
            : "image/jpeg")

  const { error } = await supabase.storage
    .from(APPLICATION_DOCUMENTS_BUCKET)
    .upload(path, buffer, {
      contentType,
      upsert: false,
    })

  if (error) {
    console.error("[storage] Document upload failed:", error.message)
    return { error: "Could not upload document. Please try again." }
  }

  return { path }
}

export async function createSignedDocumentUrl(
  supabase: SupabaseClient,
  path: string,
  expiresInSeconds = 120,
): Promise<{ url: string } | { error: string }> {
  const { data, error } = await supabase.storage
    .from(APPLICATION_DOCUMENTS_BUCKET)
    .createSignedUrl(path, expiresInSeconds)

  if (error || !data?.signedUrl) {
    console.error("[storage] Signed URL failed:", error?.message)
    return { error: "Could not generate document link." }
  }

  return { url: data.signedUrl }
}
