export function formatCurrency(value: number | null | undefined, opts?: { decimals?: boolean }) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts?.decimals ? 2 : 0,
    maximumFractionDigits: opts?.decimals ? 2 : 0,
  }).format(value)
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—"
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function dealTitle(deal: {
  year: number | null
  make: string
  model: string
  trim: string | null
}) {
  return [deal.year, deal.make, deal.model, deal.trim].filter(Boolean).join(" ")
}

export function maskSsn(ssn: string | null | undefined) {
  if (!ssn) return "—"
  const digits = ssn.replace(/\D/g, "")
  if (digits.length < 4) return "•••"
  return `•••-••-${digits.slice(-4)}`
}
