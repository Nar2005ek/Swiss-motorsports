"use client"

import { useTransition } from "react"
import { ExternalLink, FileWarning, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getApplicationDocumentUrl } from "@/app/admin/(dashboard)/applications/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  applicationId: string
  driversLicensePath: string | null
  insuranceCardPath: string | null
}

function DocumentRow({
  applicationId,
  kind,
  label,
  path,
}: {
  applicationId: string
  kind: "drivers_license" | "insurance_card"
  label: string
  path: string | null
}) {
  const [isPending, startTransition] = useTransition()

  function openDocument() {
    startTransition(async () => {
      const result = await getApplicationDocumentUrl(applicationId, kind)
      if ("error" in result && result.error) {
        toast.error(result.error)
        return
      }
      if ("url" in result && result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer")
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {path ? "Uploaded — available for secure viewing" : "Not uploaded"}
        </p>
      </div>
      {path ? (
        <Button
          type="button"
          variant="outline"
          className="min-h-10 w-full sm:w-auto"
          onClick={openDocument}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ExternalLink className="size-4" />
          )}
          View / Download
        </Button>
      ) : (
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <FileWarning className="size-4" />
          No file
        </span>
      )}
    </div>
  )
}

export function ApplicationDocumentsCard({
  applicationId,
  driversLicensePath,
  insuranceCardPath,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Uploaded Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <DocumentRow
          applicationId={applicationId}
          kind="drivers_license"
          label="Driver's License"
          path={driversLicensePath}
        />
        <DocumentRow
          applicationId={applicationId}
          kind="insurance_card"
          label="Insurance Card"
          path={insuranceCardPath}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Links expire after two minutes and require an authenticated admin session.
        </p>
      </CardContent>
    </Card>
  )
}
