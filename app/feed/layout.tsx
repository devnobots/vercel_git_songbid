import type React from "react"
import StickyHeader from "@/components/sticky-header"

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <StickyHeader />
      <div className="pt-32">{children}</div>
    </div>
  )
}
