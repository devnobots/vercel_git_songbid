"use client"

import { useState, useEffect } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import UploadModal from "./upload-modal"
import type { VideoData } from "@/types/video"

interface UploadButtonProps {
  onUploadSuccess: (video: VideoData) => void
}

export default function UploadButton({ onUploadSuccess }: UploadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSafari, setIsSafari] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect Safari and mobile on mount
  useEffect(() => {
    // Check if Safari
    const isSafariCheck = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    // Check if mobile
    const isMobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    setIsSafari(isSafariCheck)
    setIsMobile(isMobileCheck)
  }, [])

  const handleButtonClick = () => {
    console.log("Upload button clicked")
    setIsModalOpen(true)
  }

  // Determine button position class based on device
  const buttonPositionClass =
    isSafari || isMobile
      ? "fixed bottom-[20px] left-[20px]" // Increased padding for iOS/mobile
      : "fixed bottom-6 left-6" // Original position for desktop

  return (
    <>
      <Button
        onClick={handleButtonClick}
        className={`${buttonPositionClass} rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 z-50`}
        aria-label="Upload video"
        style={{
          transform: "translateZ(0)",
          willChange: "transform",
          touchAction: "manipulation",
          WebkitAppearance: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <Upload className="h-6 w-6" />
      </Button>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUploadSuccess={onUploadSuccess} />
    </>
  )
}
