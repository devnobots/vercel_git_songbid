"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface FeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackDialog({ isOpen, onClose }: FeedbackDialogProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null)
  const [comment, setComment] = useState("")

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

  const emojis = [
    { emoji: "😔", label: "Disappointed" },
    { emoji: "🙂", label: "Okay" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😊", label: "Good" },
    { emoji: "😄", label: "Great" },
  ]

  const handleSubmit = () => {
    console.log("Feedback submitted:", { selectedEmoji, comment })
    // In a real app, you would send this data to your backend
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 bg-white rounded-xl overflow-hidden border-0">
        <div className="px-6 pt-6 pb-6 relative">
          {/* Top title - Fixed to be center aligned */}
          <div className="flex justify-center items-center mb-8">
            <h3 className="text-lg font-semibold text-center w-full">Leave us Feedback</h3>
          </div>

          {/* Main title - Updated with final copy */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">
              What do you think about
              <br />
              the Song Bid concept?
            </h2>
          </div>

          {/* Emoji selection */}
          <div className="flex justify-center mb-8">
            {emojis.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedEmoji(index)}
                className={`mx-2 p-3 rounded-full transition-all ${
                  selectedEmoji === index ? "bg-[#e84c30] scale-110" : "bg-gray-100 hover:bg-gray-200"
                }`}
                aria-label={item.label}
              >
                <span className="text-2xl">{item.emoji}</span>
              </button>
            ))}
          </div>

          {/* Comment textarea - Fixed for Android with proper padding */}
          <div className="mb-6 px-0">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-4 border border-gray-200 rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#e84c30]"
              style={{ WebkitAppearance: "none" }}
            />
          </div>

          {/* Submit button - Fixed padding */}
          <div className="px-0">
            <Button
              onClick={handleSubmit}
              className="w-full py-5 text-xl bg-[#e84c30] hover:bg-[#e84c30]/90 text-white"
            >
              Send Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
