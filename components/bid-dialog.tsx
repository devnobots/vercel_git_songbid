"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"
import FundSongScreen from "./fund-song-screen"
import ArtistBioDialog from "./artist-bio-dialog"

interface BidDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function BidDialog({ isOpen, onClose }: BidDialogProps) {
  const [showFundScreen, setShowFundScreen] = useState(false)
  const [showArtistBio, setShowArtistBio] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const [profileError, setProfileError] = useState(false)

  // Bob Dylan image from Vercel Blob storage
  const bobDylanImageUrl =
    "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/140624_bob_dylan_1457_fc36cf65fb1e95993f7f2af408bc9600_nbcnews_ux_2880_1000-ixLAmTllDHCcOfmflLPMAqKCn66o9b.jpg"

  const handleFundClick = () => {
    setShowFundScreen(true)
  }

  const handleFundScreenClose = () => {
    setShowFundScreen(false)
  }

  const handleArtistBioClick = () => {
    setShowArtistBio(true)
  }

  // Reset error states when dialog opens
  useEffect(() => {
    if (isOpen) {
      setImageError(false)
      setAvatarError(false)
      setProfileError(false)
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

    // No cleanup needed as we want videos to stay paused when dialog closes
  }, [isOpen])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-md p-0 bg-gray-50 rounded-xl overflow-hidden border-0"
          hideCloseButton={true}
        >
          <div className="p-4 relative">
            {/* Main Card - Removed the title and reduced top padding */}
            <div className="rounded-xl overflow-hidden shadow-md mb-4 relative">
              {/* Rank indicator - positioned on top of the image */}

              {/* Card Image */}
              <div className="relative h-64 bg-gray-200">
                {imageError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <Music className="h-16 w-16 text-gray-400" />
                    <p className="absolute bottom-4 text-gray-600 font-medium">Bob Dylan Performance</p>
                  </div>
                ) : (
                  <>
                    <Image
                      src={bobDylanImageUrl || "/placeholder.svg"}
                      alt="Bob Dylan Performance"
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                      unoptimized
                    />
                    {/* Song title overlay - REMOVED as requested */}
                  </>
                )}
              </div>

              {/* Card Footer - Updated layout with Top Supporter removed */}
              <div className="p-3 flex justify-between items-center bg-gradient-to-r from-amber-700 to-amber-900">
                {/* Avatar and text side by side */}
                <div className="flex items-center">
                  {/* Avatar in square */}
                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-300 flex items-center justify-center">
                    {avatarError ? (
                      <span className="text-sm text-gray-600">JD</span>
                    ) : (
                      <Image
                        src="/top-supporter-avatar.jpg"
                        alt="Top Supporter"
                        width={40}
                        height={40}
                        className="object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    )}
                  </div>

                  {/* Text to the right of avatar */}
                  <div className="flex flex-col ml-2">
                    <span className="text-white font-bold text-xl">$120</span>
                    <span className="text-gray-200 text-sm -mt-1">
                      Top Bid <span className="underline">@macPaul</span>
                    </span>
                  </div>
                </div>

                {/* Fund Song button */}
                <Button
                  className="bg-[#e84c30] hover:bg-[#e84c30]/90 text-white border-none rounded-md px-4 py-2"
                  onClick={handleFundClick}
                >
                  Fund Song
                </Button>
              </div>
            </div>

            {/* Creator Profile - Added 15px top margin to create space between sections */}
            <div
              className="bg-white rounded-xl p-4 shadow border border-gray-100 mt-[15px]"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl">Silver Rayleigh</h3>
                  <p className="text-gray-500 text-sm">Sunnyvale, CA - 1206 Backers</p>
                </div>

                {/* Artist Bio button */}
                <Button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-full px-4"
                  onClick={handleArtistBioClick}
                >
                  Artist Bio
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fund Song Screen */}
      <FundSongScreen
        isOpen={showFundScreen}
        onClose={handleFundScreenClose}
        songTitle="Anchors In The Sun"
        artistName="Silver Rayleigh"
      />

      {/* Artist Bio Dialog */}
      <ArtistBioDialog isOpen={showArtistBio} onClose={() => setShowArtistBio(false)} />
    </>
  )
}
