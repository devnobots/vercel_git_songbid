"use client"

import { useEffect, useState } from "react"
import Logo from "./logo"

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
      className={`fixed top-0 left-0 right-0 z-50 bg-white pt-[0.5125rem] pb-[0.7125rem] transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="flex justify-center">
        <Logo />
      </div>
    </header>
  )
}
