"use client"

import { useEffect, useState } from "react"
import VintageHeader from "./vintage-header"

export default function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

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
      className={`fixed top-0 left-0 right-0 z-50 bg-paper pt-[0.1875rem] pb-[0.1875rem] transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="flex justify-center">
        <VintageHeader showSubtitle={true} feedPage={true} />
      </div>
    </header>
  )
}
