"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Music } from "lucide-react"
import FundSongScreen from "./fund-song-screen"

interface ArtistBioDialogProps {
  isOpen: boolean
  onClose: () => void
  artistName?: string
  artistImage?: string
  location?: string
  bio?: string
}

export default function ArtistBioDialog({
  isOpen,
  onClose,
  artistName = "Silver Rayleigh",
  artistImage = "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/140624_bob_dylan_1457_fc36cf65fb1e95993f7f2af408bc9600_nbcnews_ux_2880_1000-ixLAmTllDHCcOfmflLPMAqKCn66o9b-PYqj1smKspK00S8CVIoXaaKbo8hT3n.jpg",
  location = "Sunnyvale, CA",
  bio = "Bob Dylan is an American singer-songwriter, author and visual artist. Often regarded as one of the greatest songwriters of all time, Dylan has been a major figure in popular culture for more than 50 years. His most celebrated work dates from the 1960s, when songs such as 'Blowin' in the Wind' and 'The Times They Are a-Changin'' became anthems for the civil rights and anti-war movements.",
}: ArtistBioDialogProps) {
  const [showFundScreen, setShowFundScreen] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Reset error states when dialog opens
  useEffect(() => {
    if (isOpen) {
      setImageError(false)
    }
  }, [isOpen])

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
  }, [isOpen])

  const handleSendTip = () => {
    setShowFundScreen(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="w-[90%] max-w-[400px] p-0 bg-gray-800 text-white rounded-xl overflow-hidden border-0"
          hideCloseButton={true}
        >
          <div className="flex flex-col">
            {/* Artist Image Section with location in top right */}
            <div className="relative w-full overflow-hidden" style={{ height: "220px" }}>
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <Music className="h-16 w-16 text-gray-600" />
                </div>
              ) : (
                <Image
                  src={artistImage || "/placeholder.svg"}
                  alt={artistName}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              )}

              {/* Back button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 z-10 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Location in top right */}
              <div className="absolute top-4 right-4 z-10 flex items-center">
                <MapPin className="h-4 w-4 text-[#e84c30] mr-1" />
                <span className="text-white text-sm">{location}</span>
              </div>

              {/* Artist name overlay - positioned directly on the image */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 py-2">
                <h2 className="text-xl font-bold text-white text-center">{artistName}</h2>
              </div>
            </div>

            {/* Content Section - reduced padding and spacing */}
            <div className="px-4 py-2">
              {/* Bio - reduced margins */}
              <div className="mb-3">
                <h3 className="text-lg font-semibold mb-2 text-center">Bio</h3>
                <p className="text-gray-200 text-sm leading-relaxed">{bio}</p>
              </div>

              {/* Instruments - reduced margins */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-center">Instruments</h3>
                <div className="flex justify-center space-x-6">
                  <div className="flex items-center">
                    <span className="text-[#e84c30] mr-1">🎸</span>
                    <span className="text-gray-200 text-sm">Guitar</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#e84c30] mr-1">🎹</span>
                    <span className="text-gray-200 text-sm">Piano</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#e84c30] mr-1">🎤</span>
                    <span className="text-gray-200 text-sm">Vocals</span>
                  </div>
                </div>
              </div>

              {/* Send a Tip Button - Updated text */}
              <div className="mb-3">
                <Button
                  onClick={handleSendTip}
                  className="w-full bg-[#e84c30] hover:bg-[#e84c30]/90 text-white py-3 rounded-md text-base font-medium"
                >
                  Send a Tip
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fund Song Screen - with tip mode enabled */}
      <FundSongScreen
        isOpen={showFundScreen}
        onClose={() => setShowFundScreen(false)}
        songTitle="Support Artist"
        artistName={artistName}
        isTipMode={true} // Enable tip mode
      />
    </>
  )
}
