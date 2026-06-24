"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { saveDeal } from "@/app/admin/(dashboard)/deals/actions"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Deal } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  prefix,
}: {
  label: string
  name: string
  defaultValue?: string | number | null
  type?: string
  placeholder?: string
  prefix?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          className={prefix ? "pl-7" : undefined}
          step={type === "number" ? "any" : undefined}
        />
      </div>
    </div>
  )
}

export function DealForm({ deal }: { deal?: Deal }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = useState<string[]>(deal?.images?.length ? deal.images : deal?.image_url ? [deal.image_url] : [])
  const [status, setStatus] = useState(deal?.status ?? "active")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await saveDeal(formData)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success(deal ? "Special updated" : "Special created")
      router.push("/admin/deals")
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {deal && <input type="hidden" name="id" value={deal.id} />}
      <input type="hidden" name="status" value={status} />

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Vehicle</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Year" name="year" type="number" defaultValue={deal?.year} placeholder="2025" />
          <Field label="Make" name="make" defaultValue={deal?.make} placeholder="Mercedes-Benz" />
          <Field label="Model" name="model" defaultValue={deal?.model} placeholder="C 300" />
          <Field label="Trim" name="trim" defaultValue={deal?.trim} placeholder="4MATIC Sedan" />
          <Field label="Exterior Color" name="exterior_color" defaultValue={deal?.exterior_color} />
          <Field label="Interior Color" name="interior_color" defaultValue={deal?.interior_color} />
          <Field label="Stock #" name="stock_number" defaultValue={deal?.stock_number} />
          <Field label="VIN" name="vin" defaultValue={deal?.vin} />
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value ?? "active")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Lease / Pricing</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Monthly Payment" name="monthly_payment" type="number" defaultValue={deal?.monthly_payment} prefix="$" />
          <Field label="Due at Signing" name="due_at_signing" type="number" defaultValue={deal?.due_at_signing} prefix="$" />
          <Field label="Down Payment" name="down_payment" type="number" defaultValue={deal?.down_payment} prefix="$" />
          <Field label="Lease Term (months)" name="lease_term" type="number" defaultValue={deal?.lease_term} placeholder="36" />
          <Field label="Miles / Year" name="miles_per_year" type="number" defaultValue={deal?.miles_per_year} placeholder="10000" />
          <Field label="MSRP" name="msrp" type="number" defaultValue={deal?.msrp} prefix="$" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Details & Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={deal?.description ?? ""}
              rows={4}
              placeholder="Highlight features, packages, and what makes this offer special."
            />
          </div>
          <ImageUploader value={images} onChange={setImages} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/deals")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {deal ? "Save Changes" : "Create Special"}
        </Button>
      </div>
    </form>
  )
}
