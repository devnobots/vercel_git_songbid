import type React from "react"
import StickyHeader from "@/components/sticky-header"

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <StickyHeader />
      <div className="pt-24">{children}</div>
    </>
  )
}
