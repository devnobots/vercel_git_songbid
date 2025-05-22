"use client"

import { useEffect, useRef } from "react"
import type { VideoData } from "@/types/video"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import VideoRecordingTips from "./video-recording-tips"
import BidButton from "./bid-button"
import BidDialog from "./bid-dialog"

interface VideoContainerProps {
  video: VideoData
  isActive: boolean
  index: number
  isMuted: boolean
  zoomLevel?: number // Value between 0 and 1 indicating zoom level
}

export default function VideoContainer({
  video,
  isActive,
  index,
  isMuted,
  zoomLevel = isActive ? 1 : 0,
}: VideoContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const wasActiveRef = useRef(false)
  const previousActiveState = useRef<boolean>(false)
  const [showTips, setShowTips] = useState(false)
  const [showBidDialog, setShowBidDialog] = useState(false)
  const videoLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if this is a blob video (either by ID or by having a blob_url)
  const isSpecialBlobVideo = video.vimeo_id === "blob_video" || !!video.blob_url

  // Calculate new dimensions (10% larger for active from the previous size)
  // Previous active: 280px width, 231px height
  // Previous inactive: 224px width, 185px height
  const activeWidth = 370 // 308 * 1.2 = 370
  const activeHeight = 305 // 254 * 1.2 = 305
  const inactiveWidth = 224
  const inactiveHeight = 185

  // Update container size based on zoom level with smoother transitions
  useEffect(() => {
    if (!containerRef.current) return

    // Calculate size based on zoom level (0 to 1)
    // When zoom level is 0, use inactive size; when 1, use active size
    const width = inactiveWidth + (activeWidth - inactiveWidth) * zoomLevel
    const height = inactiveHeight + (activeHeight - inactiveHeight) * zoomLevel

    containerRef.current.style.width = `${width}px`
    containerRef.current.style.height = `${height}px`

    if (isActive) {
      wasActiveRef.current = true
    }
  }, [isActive, zoomLevel, activeWidth, activeHeight, inactiveWidth, inactiveHeight])

  // Enhanced video control based on active state
  useEffect(() => {
    // If active state changed
    if (isActive !== previousActiveState.current) {
      // If video becomes active
      if (isActive) {
        if (isSpecialBlobVideo && videoRef.current) {
          // Always reset to beginning and play for HTML5 video
          videoRef.current.currentTime = 0
          videoRef.current.play().catch((err) => console.error(`Error playing video ${index}:`, err))
        } else if (iframeRef.current) {
          // Force reload for iframe to restart the video
          const currentSrc = iframeRef.current.src
          iframeRef.current.src = ""
          setTimeout(() => {
            if (iframeRef.current) {
              iframeRef.current.src = currentSrc
            }
          }, 50)
        }
      } else {
        // If video becomes inactive - ALWAYS pause and reset
        if (isSpecialBlobVideo && videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
        } else if (iframeRef.current) {
          // For iframe videos, reload with autoplay=0 or remove src
          const currentSrc = iframeRef.current.src
          // Remove autoplay parameter if present
          const newSrc = currentSrc.replace("autoplay=1", "autoplay=0")
          iframeRef.current.src = newSrc
        }
      }

      // Update previous state
      previousActiveState.current = isActive
    }
  }, [isActive, index, isSpecialBlobVideo])

  // Additional effect to ensure videos are paused when not visible or active
  useEffect(() => {
    // If not visible or not active, ensure video is paused
    if (!isVisible || !isActive) {
      if (isSpecialBlobVideo && videoRef.current) {
        videoRef.current.pause()
        // Reset to beginning when inactive
        videoRef.current.currentTime = 0
      }
    }

    // If visible and active, ensure video is playing
    if (isVisible && isActive) {
      if (isSpecialBlobVideo && videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch((err) => console.error(`Error playing video ${index}:`, err))
      }
    }
  }, [isVisible, isActive, isSpecialBlobVideo, index])

  // Reset error state when video changes or becomes active
  useEffect(() => {
    if (isActive && isError && retryCount < 3) {
      // Retry loading the video when it becomes active
      setIsError(false)
      setRetryCount((prev) => prev + 1)
    }
  }, [isActive, isError, retryCount])

  // Setup visibility observer
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        const wasVisible = isVisible
        setIsVisible(entry.isIntersecting)

        // If visibility changed from visible to not visible, pause video
        if (wasVisible && !entry.isIntersecting) {
          if (isSpecialBlobVideo && videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
          }
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [isSpecialBlobVideo])

  // Add timeout to detect video loading failures
  useEffect(() => {
    // Clear any existing timeout
    if (videoLoadTimeoutRef.current) {
      clearTimeout(videoLoadTimeoutRef.current)
    }

    // Set a new timeout to detect loading failures
    if (!isLoaded && !isError) {
      videoLoadTimeoutRef.current = setTimeout(() => {
        if (!isLoaded) {
          console.log(`Video ${index} load timeout - retrying...`)
          setIsError(true)
          handleRetry()
        }
      }, 10000) // 10 second timeout
    }

    return () => {
      if (videoLoadTimeoutRef.current) {
        clearTimeout(videoLoadTimeoutRef.current)
      }
    }
  }, [isLoaded, isError, index])

  // Format the filename for display - use the full filename as shown in the screenshot
  const displayFilename = video.original_filename || video.timestamped_filename || "Untitled"

  // Construct the correct Vimeo embed URL using the exact ID
  // Add parameters to control the appearance and behavior of the video
  const embedUrl = `https://player.vimeo.com/video/${video.vimeo_id}?autoplay=${
    isActive ? 1 : 0
  }&loop=1&background=1&muted=${isMuted ? 1 : 0}&transparent=0&dnt=1&quality=1080p`

  const handleRetry = () => {
    setIsError(false)
    setIsLoaded(false)
    setRetryCount((prev) => prev + 1)

    // Reload the iframe or video
    if (isSpecialBlobVideo && videoRef.current) {
      videoRef.current.load()
    } else if (iframeRef.current) {
      const src = iframeRef.current.src
      iframeRef.current.src = ""
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = src
      }, 100)
    }
  }

  // Calculate zoom scale based on zoom level with smoother curve
  // Use a more gradual easing function for smoother transitions
  const zoomScale = 0.933 + zoomLevel * 0.063

  // Get the correct video URL
  const videoUrl = video.blob_url || ""

  // Calculate grayscale filter based on zoom level
  // When zoom level is 0, apply 100% grayscale; when zoom level is 1, apply 0% grayscale
  const grayscaleAmount = 100 - Math.round(zoomLevel * 100)
  const videoFilter = `grayscale(${grayscaleAmount}%)`

  return (
    <div className="flex flex-col items-center w-full">
      {/* Video container */}
      <div
        ref={containerRef}
        data-index={index}
        data-active={isActive}
        className="video-container relative overflow-hidden rounded-lg transition-all duration-300 ease-out"
        style={{
          width: `${inactiveWidth + (activeWidth - inactiveWidth) * zoomLevel}px`,
          height: `${inactiveHeight + (activeHeight - inactiveHeight) * zoomLevel}px`,
          backgroundColor: "#333",
          cursor: isActive ? "pointer" : "default",
          border: "1px solid black", // Changed to black border for all videos
        }}
        onClick={() => {
          // Only open bid dialog when video is active
          if (isActive && isLoaded) {
            setShowBidDialog(true)
          }
        }}
      >
        {!isLoaded && !isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-600 z-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}

        {isError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 z-10 p-4">
            <p className="text-white text-sm mb-4 text-center">
              Error loading video. The video may still be processing or unavailable.
            </p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Video wrapper with zoom effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="w-full h-full relative transition-all duration-300 ease-out"
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: "center center",
              filter: videoFilter, // Apply grayscale filter based on zoom level
              transition: "filter 0.3s ease-out", // Smooth transition for the filter
            }}
          >
            {isSpecialBlobVideo ? (
              // Use HTML5 video for blob videos
              <video
                ref={videoRef}
                src={videoUrl}
                className={`absolute inset-0 w-full h-full object-cover ${
                  isLoaded ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
                muted={isMuted}
                loop
                playsInline
                onLoadedData={() => setIsLoaded(true)}
                onError={() => setIsError(true)}
              />
            ) : (
              // Use iframe for Vimeo videos
              <iframe
                ref={iframeRef}
                src={embedUrl}
                className={`absolute inset-0 w-full h-full ${
                  isLoaded ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoaded(true)}
                onError={() => setIsError(true)}
                style={{ width: "100%", height: "100%" }}
              ></iframe>
            )}
          </div>
        </div>
        {/* BID Button - Only visible when video is active/playing */}
        {isActive && isLoaded && (
          <div className="absolute bottom-4 right-4 z-30">
            <BidButton
              onClick={(e) => {
                e.stopPropagation() // Prevent the container's onClick from also firing
                setShowBidDialog(true)
              }}
            />
          </div>
        )}

        {/* Recording Tips Dialog */}
        <Dialog open={showTips} onOpenChange={setShowTips}>
          <DialogContent className="sm:max-w-md" hideCloseButton={true}>
            <VideoRecordingTips onClose={() => setShowTips(false)} />
          </DialogContent>
        </Dialog>

        {/* Bid Dialog */}
        <BidDialog isOpen={showBidDialog} onClose={() => setShowBidDialog(false)} />
      </div>

      {/* Song title with styling to match the image exactly */}
      <p
        className="text-center mt-3 mb-1 font-elegant-typewriter"
        style={{
          fontWeight: 500,
          color: "#333333",
          fontSize: "18px", // Changed from 16px to 18px (+2px)
          letterSpacing: "0.02em",
        }}
      >
        {displayFilename}
      </p>

      {/* Artist name below song title - with elegant typewriter font */}
      <p
        className="text-center mb-2 font-elegant-typewriter"
        style={{
          fontWeight: 400,
          color: "#333333",
          fontSize: "14px",
          letterSpacing: "0.02em",
          opacity: 0.85,
        }}
      >
        {video.artist_name || "A New Musician"}
      </p>

      {/* Add bottom margin to create space between videos - adjusted for removed waveform */}
      <div className="h-[30px]"></div>
    </div>
  )
}
