"use client"

import { useState, useEffect, useRef } from "react"
import VideoContainer from "./video-container"
import type { VideoData } from "@/types/video"

interface VideoFeedProps {
  videos: VideoData[]
  loadMoreVideos: () => void
  isMuted: boolean
}

export default function VideoFeed({ videos, loadMoreVideos, isMuted }: VideoFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomLevels, setZoomLevels] = useState<number[]>([])
  const feedRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLDivElement | null)[]>([])
  const ticking = useRef(false)
  const animationFrameId = useRef<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const loadingMoreRef = useRef(false)

  // Initialize zoom levels array
  useEffect(() => {
    setZoomLevels(videos.map(() => 0))
    videoRefs.current = videoRefs.current.slice(0, videos.length)
  }, [videos.length])

  // Monitor for any open dialogs
  useEffect(() => {
    const checkForOpenDialogs = () => {
      // Check if any dialog is open by looking for dialog elements with data-state="open"
      const openDialogs = document.querySelectorAll('[data-state="open"]')
      const isDialogOpen = openDialogs.length > 0

      if (isDialogOpen !== dialogOpen) {
        setDialogOpen(isDialogOpen)

        // If a dialog just opened, pause all videos
        if (isDialogOpen) {
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
      }
    }

    // Check initially
    checkForOpenDialogs()

    // Set up a MutationObserver to detect dialog changes
    const observer = new MutationObserver(checkForOpenDialogs)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
    })

    return () => observer.disconnect()
  }, [dialogOpen])

  // Calculate zoom level for each video based on its position in the viewport - IMPROVED FOR SMOOTH SCROLLING
  const calculateZoomLevels = () => {
    if (!feedRef.current || dialogOpen) return

    const viewportHeight = window.innerHeight
    const viewportCenter = viewportHeight / 2
    const scrollPosition = window.scrollY

    // Special case: If we're at the top of the page, force the first video to be active
    if (scrollPosition < 50) {
      const newZoomLevels = [...zoomLevels]
      newZoomLevels[0] = 1 // Set first video to max zoom

      // Set all other videos to minimum zoom
      for (let i = 1; i < newZoomLevels.length; i++) {
        newZoomLevels[i] = 0
      }

      setZoomLevels(newZoomLevels)
      setActiveIndex(0)
      ticking.current = false
      return
    }

    // Get all video containers
    const containers = videoRefs.current.filter(Boolean)

    // Calculate zoom level for each container based on distance from viewport center
    const newZoomLevels = [...zoomLevels]
    let maxZoom = 0
    let maxIndex = activeIndex

    containers.forEach((container, index) => {
      if (!container) return

      const rect = container.getBoundingClientRect()
      const containerCenter = rect.top + rect.height / 2

      // Calculate distance from the center of the viewport (as a percentage of viewport height)
      const distanceFromCenter = Math.abs(containerCenter - viewportCenter) / (viewportHeight * 0.5)

      // Convert distance to zoom level using a smooth function
      let zoomLevel = Math.max(0, 1 - Math.pow(Math.min(distanceFromCenter, 1), 1.5))

      // Apply easing function to make transitions smoother
      zoomLevel = Math.pow(zoomLevel, 0.8)

      // Ensure zoom level is between 0 and 1
      zoomLevel = Math.max(0, Math.min(1, zoomLevel))

      newZoomLevels[index] = zoomLevel

      // Track which video has the highest zoom level
      if (zoomLevel > maxZoom) {
        maxZoom = zoomLevel
        maxIndex = index
      }
    })

    // Update active index if it changed
    if (maxIndex !== activeIndex) {
      setActiveIndex(maxIndex)
    }

    // Update zoom levels
    setZoomLevels(newZoomLevels)
    ticking.current = false
  }

  // Handle scroll events with requestAnimationFrame for performance
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        animationFrameId.current = requestAnimationFrame(calculateZoomLevels)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initial calculation
    calculateZoomLevels()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [videos.length, zoomLevels.length, dialogOpen])

  // Force first video to be active when page loads or when scrolled to top
  useEffect(() => {
    const checkTopPosition = () => {
      if (window.scrollY < 50 && activeIndex !== 0) {
        setActiveIndex(0)
        const newZoomLevels = [...zoomLevels]
        newZoomLevels[0] = 1
        for (let i = 1; i < newZoomLevels.length; i++) {
          newZoomLevels[i] = 0
        }
        setZoomLevels(newZoomLevels)
      }
    }

    // Check on mount
    checkTopPosition()

    // Add scroll listener specifically for top position
    window.addEventListener("scroll", checkTopPosition, { passive: true })

    return () => {
      window.removeEventListener("scroll", checkTopPosition)
    }
  }, [videos.length, activeIndex, zoomLevels])

  // Force first video to be active on initial load
  useEffect(() => {
    // Set first video as active immediately on component mount
    if (videos.length > 0) {
      setActiveIndex(0)
      const initialZoomLevels = Array(videos.length).fill(0)
      initialZoomLevels[0] = 1 // Set first video to max zoom
      setZoomLevels(initialZoomLevels)

      // Force a recalculation after a short delay to ensure everything is rendered
      setTimeout(() => {
        calculateZoomLevels()
      }, 100)
    }
  }, []) // Empty dependency array ensures this only runs once on mount

  // Setup intersection observer for infinite loading - with debounce
  useEffect(() => {
    if (!feedRef.current || videos.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // If the last element is intersecting (visible) and we're not already loading
        if (entries[0].isIntersecting && !loadingMoreRef.current) {
          loadingMoreRef.current = true

          // Add a small delay to prevent rapid firing of loadMoreVideos
          setTimeout(() => {
            loadMoreVideos()
            // Reset the loading flag after a reasonable timeout
            setTimeout(() => {
              loadingMoreRef.current = false
            }, 2000) // Prevent another load for at least 2 seconds
          }, 300)
        }
      },
      // Adjusted threshold and rootMargin for removed waveform
      { threshold: 0.2, rootMargin: "150px" },
    )

    // Observe the last video container for infinite scroll
    const containers = feedRef.current.querySelectorAll(".video-container")
    if (containers.length > 0) {
      observer.observe(containers[containers.length - 1])
    }

    return () => observer.disconnect()
  }, [videos.length, loadMoreVideos])

  return (
    <div ref={feedRef} className="flex flex-col items-center py-6">
      {videos.map((video, index) => (
        <div
          key={`${video.vimeo_id}-${index}`}
          ref={(el) => (videoRefs.current[index] = el)}
          className="w-full flex flex-col items-center"
        >
          <VideoContainer
            video={video}
            isActive={index === activeIndex && !dialogOpen}
            index={index}
            isMuted={isMuted}
            zoomLevel={dialogOpen ? 0 : zoomLevels[index] || 0}
          />
        </div>
      ))}
    </div>
  )
}
