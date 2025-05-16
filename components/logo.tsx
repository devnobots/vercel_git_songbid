"use client"
import Link from "next/link"
import { useState } from "react"

interface LogoProps {
  size?: "default" | "large" | "compact"
}

export default function Logo({ size = "default" }: LogoProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link href="/" className="inline-block">
      <div className="flex flex-col items-center">
        {/* Fallback text for Safari */}
        {imageError ? (
          <div className="flex items-center justify-center">
            <h1 className="font-bold tracking-wider text-3xl text-[#0a1c2e]">SONG BID</h1>
          </div>
        ) : (
          /* Use the exact image at its natural size with the provided URL */
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_trans-FA0TDP3k0en9LdsT3UIrnb6MFoqLel.png"
            alt="SONG BID"
            className="w-auto h-auto"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    </Link>
  )
}
