"use client"

import { useEffect, useState } from "react"
import VintageHeader from "./vintage-header"

export default function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Ensure the header is fully rendered after component mounts
  useEffect(() => {
    // Short timeout to ensure fonts are loaded
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-paper pt-[0.3125rem] pb-[0.3125rem] transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      } ${isReady ? "opacity-100" : "opacity-99"}`}
      style={{
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div className="flex justify-center">
        <VintageHeader showSubtitle={true} feedPage={true} />
      </div>
    </header>
  )
}
