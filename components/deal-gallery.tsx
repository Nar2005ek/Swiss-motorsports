"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function DealGallery({ images, alt }: { images: string[]; alt: string }) {
  const safe = images.length > 0 ? images : ["/showroom.png"]
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-secondary">
        <Image
          src={safe[active] || "/placeholder.svg"}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {safe.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {safe.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-secondary transition-all",
                active === i ? "border-accent ring-2 ring-accent/40" : "border-border hover:border-foreground/40",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src || "/placeholder.svg"}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
