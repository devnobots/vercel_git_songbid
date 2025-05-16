"use client"

import { useEffect, useState, useRef } from "react"
import { useVideoStore } from "@/lib/store"

export default function VideoPreloader() {
  const { setVideos, setLoaded, isLoaded } = useVideoStore()
  const [isLoading, setIsLoading] = useState(false)
  const preloadAttemptedRef = useRef(false)

  useEffect(() => {
    // Only load videos if they haven't been loaded already and we haven't attempted to load them
    if (!isLoaded && !isLoading && !preloadAttemptedRef.current) {
      const preloadVideos = async () => {
        preloadAttemptedRef.current = true
        setIsLoading(true)
        try {
          // Add cache-busting but with a 30-second window to reduce unique URLs
          const cacheBuster = Math.floor(Date.now() / 30000)

          const response = await fetch(`/api/videos?page=1&t=${cacheBuster}`)

          if (!response.ok) {
            throw new Error(`Error fetching videos: ${response.status}`)
          }

          const data = await response.json()

          if (data && data.length > 0) {
            setVideos(data)
            setLoaded(true)
          }
        } catch (error) {
          console.error("Error preloading videos:", error)
        } finally {
          setIsLoading(false)
        }
      }

      // Start preloading after a short delay to prioritize main page content
      const timer = setTimeout(() => {
        preloadVideos()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isLoaded, isLoading, setLoaded, setVideos])

  // This component doesn't render anything visible
  return null
}
