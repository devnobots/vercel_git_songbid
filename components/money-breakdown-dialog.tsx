"use client"

import { useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MoneyBreakdownDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function MoneyBreakdownDialog({ isOpen, onClose }: MoneyBreakdownDialogProps) {
  // Pause all videos when dialog is open
  useEffect(() => {
    if (isOpen) {
      // Pause all HTML5 videos
      const videos = document.querySelectorAll("video")
      videos.forEach((video) => {
        video.pause()
        video.currentTime = 0
      })

      // Handle Vimeo iframes
      const iframes = document.querySelectorAll("iframe")
      iframes.forEach((iframe) => {
        if (iframe.src.includes("vimeo.com")) {
          // Store original src to restore it later if needed
          const originalSrc = iframe.src
          iframe.setAttribute("data-original-src", originalSrc)

          // Replace with empty src or autoplay=0 version
          if (originalSrc.includes("autoplay=1")) {
            iframe.src = originalSrc.replace("autoplay=1", "autoplay=0")
          } else {
            // If no easy way to modify, just remove src temporarily
            iframe.src = ""
          }
        }
      })
    }

    // No cleanup needed as we want videos to stay paused when dialog closes
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md p-0 bg-[#f5f1e8] rounded-xl overflow-hidden border-0 font-elegant-typewriter [&>button]:hidden"
        style={{ transform: "translate(-50%, calc(-50% - 30px))" }}
        hideCloseButton={true}
      >
        <div className="p-6 pt-4 pb-4 relative">
          {/* Top icon - Added heart icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
              <Heart className="h-7 w-7 text-[#8b7355]" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center mb-5 text-[#8b7355]">Supporting musicians is our priority!</h2>

          {/* Body text - Bulleted format */}
          <ul className="text-[#6b5a47] space-y-3 pl-2">
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span>
                A generous <span className="font-bold">90%</span> of your donation goes directly to the artist, fueling
                their creativity and helping their unique voices be heard.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span>
                <span className="font-bold">3%</span> covers payment processing.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span>
                <span className="font-bold">7%</span> goes back into marketing Song Bid.
              </span>
            </li>
          </ul>

          {/* OK Button */}
          <div className="mt-6">
            <Button
              onClick={onClose}
              className="w-full py-3 bg-[#f5f1e8] hover:bg-[#ede5d8] text-[#8b7355] border border-[#8b7355] rounded-full font-elegant-typewriter"
            >
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
