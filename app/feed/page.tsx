"use client"

import Link from "next/link"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import VideoFeed from "@/components/video-feed"
import UploadButton from "@/components/upload-button"
import type { VideoData } from "@/types/video"
import { useVideoStore } from "@/lib/store"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import CopyrightNoticeDialog from "@/components/copyright-notice-dialog"

// Updated hardcoded sample videos as fallback with the new videos
const fallbackVideos = [
  {
    // Video 1
    vimeo_id: "blob_video",
    original_filename: "Tangeld Up In AI Slop!",
    timestamped_filename: "Tangeld_Up_In_AI_Slop_1683657890.mp4",
    upload_timestamp: "2023-05-09T14:31:30Z",
    artist_name: "Zimmer Quarry Man",
    song_title: "Tangeld Up In AI Slop!",
    blob_url: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/dylan_new-1-al3YAXx4Q0yfR3N1AYmL8jmjyiofYi.mp4",
  },
  {
    // Video 2
    vimeo_id: "blob_video",
    original_filename: "River",
    timestamped_filename: "River_1683657891.mp4",
    upload_timestamp: "2023-05-10T10:15:22Z",
    artist_name: "Sierra Eagleson",
    song_title: "River",
    blob_url: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/river_new-5O5rOKkJpl7QmhQ7aEMXyFdZMzjqLp.mp4",
  },
  {
    // Video 3
    vimeo_id: "blob_video",
    original_filename: "Mama Tain't Long Before Day",
    timestamped_filename: "Mama_Taint_Long_Before_Day_1683657894.mp4",
    upload_timestamp: "2023-05-13T13:10:45Z",
    artist_name: "James Limerick Kerr",
    song_title: "Mama Tain't Long Before Day",
    blob_url: "https://dg9gcoxo6erv82nw.public.blob.vercel-storage.com/aint-oPr4xVnZW8lzmdfiTaW4uimKwmefVR.mp4",
  },
]

export default function FeedPage() {
  const searchParams = useSearchParams()
  const { videos: preloadedVideos, isLoaded } = useVideoStore()
  const [videos, setVideos] = useState<VideoData[]>(isLoaded ? preloadedVideos : [])
  const [loading, setLoading] = useState(!isLoaded)
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(searchParams.get("muted") === "true")
  const pageRef = useRef(1)
  const [retryCount, setRetryCount] = useState(0)
  const initialLoadAttemptedRef = useRef(false)
  const isLoadingRef = useRef(false)
  const hasMoreVideosRef = useRef(true)
  const [showCopyrightNotice, setShowCopyrightNotice] = useState(false)

  // Check if this is the first visit to show the copyright notice
  useEffect(() => {
    // Always show the notice for testing
    setShowCopyrightNotice(true)

    // Original code (commented out during testing)
    // const hasSeenNotice = localStorage.getItem("hasSeenCopyrightNotice")
    // if (!hasSeenNotice) {
    //   setShowCopyrightNotice(true)
    // }
  }, [])

  // Handle closing the copyright notice
  const handleCloseCopyrightNotice = () => {
    localStorage.setItem("hasSeenCopyrightNotice", "true")
    setShowCopyrightNotice(false)
  }

  // Function to load videos with debounce
  const loadMoreVideos = async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) return

    // If we know there are no more videos, don't make the API call
    if (!hasMoreVideosRef.current && pageRef.current > 1) return

    // If we already have preloaded videos and this is the initial load, use them
    if (isLoaded && !initialLoadAttemptedRef.current && videos.length === 0) {
      setVideos(preloadedVideos)
      initialLoadAttemptedRef.current = true
      pageRef.current = 2 // Set to page 2 for next load
      return
    }

    isLoadingRef.current = true
    setLoading(true)
    setError(null)
    initialLoadAttemptedRef.current = true

    try {
      // Add cache-busting but with a 30-second window to reduce unique URLs
      const cacheBuster = Math.floor(Date.now() / 30000)

      // Fetch videos from the API
      const response = await fetch(`/api/videos?page=${pageRef.current}&t=${cacheBuster}`)

      if (!response.ok) {
        throw new Error(`Error fetching videos: ${response.status}`)
      }

      const data = await response.json()

      if (data && data.length > 0) {
        // For page 1, replace videos; for other pages, append
        if (pageRef.current === 1) {
          setVideos(data)
        } else {
          setVideos((prev) => [...prev, ...data])
        }
        pageRef.current += 1
      } else if (pageRef.current === 1) {
        // If this is the first page and no videos were returned, use fallback videos
        setVideos(fallbackVideos)
      } else {
        // If we got an empty array for page > 1, mark that we have no more videos
        hasMoreVideosRef.current = false
      }
    } catch (error) {
      console.error("Error loading videos:", error)
      setError("Failed to load videos. Using fallback videos.")

      // Use fallback videos on error
      if (videos.length === 0) {
        setVideos(fallbackVideos)
      }
    } finally {
      setLoading(false)
      // Add a delay before allowing another load
      setTimeout(() => {
        isLoadingRef.current = false
      }, 1000)
    }
  }

  // Load initial videos
  useEffect(() => {
    // If we have preloaded videos, use them immediately
    if (isLoaded && !initialLoadAttemptedRef.current) {
      setVideos(preloadedVideos)
      setLoading(false)
      initialLoadAttemptedRef.current = true
      pageRef.current = 2 // Set to page 2 for next load
    } else if (!initialLoadAttemptedRef.current) {
      // Otherwise load videos normally
      pageRef.current = 1
      loadMoreVideos()
    }
  }, [isLoaded, preloadedVideos]) // Re-run when preloaded videos become available

  // Handle retry
  useEffect(() => {
    if (retryCount > 0) {
      pageRef.current = 1
      hasMoreVideosRef.current = true // Reset this flag on retry
      setVideos([])
      initialLoadAttemptedRef.current = false
      loadMoreVideos()
    }
  }, [retryCount])

  // Handle successful upload
  const handleUploadSuccess = (newVideo: VideoData) => {
    console.log("New video uploaded:", newVideo)
    // Add the new video to the beginning of the videos array
    setVideos((prev) => [newVideo, ...prev.slice(0, 2)]) // Keep only 3 videos total
  }

  // Scroll to top when page loads to ensure first video is visible
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  // Debug log
  useEffect(() => {
    console.log("Current videos state:", videos)
  }, [videos])

  return (
    <main className="min-h-screen bg-paper">
      {/* Copyright Notice Dialog */}
      <Dialog open={showCopyrightNotice} onOpenChange={setShowCopyrightNotice}>
        <DialogContent className="sm:max-w-md p-0 border-0">
          <CopyrightNoticeDialog onClose={handleCloseCopyrightNotice} />
        </DialogContent>
      </Dialog>

      {error && (
        <div className="w-full px-4 mx-auto mt-4 relative z-10">
          <div className="bg-red-100 text-red-700 rounded-md p-4">
            {error}
            <button onClick={handleRetry} className="ml-2 underline">
              Retry
            </button>
          </div>
        </div>
      )}

      {videos.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-16 relative z-10">
          <div className="text-center w-full px-4 mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">No Videos Available</h2>
            <p className="mb-6">There are no videos to display. Upload a new video to get started!</p>
            <div className="flex justify-center gap-4">
              <Link href="/" className="text-blue-500 hover:underline">
                Return to Home
              </Link>
              <button onClick={handleRetry} className="text-primary hover:underline">
                Refresh
              </button>
            </div>
          </div>
        </div>
      ) : loading && videos.length === 0 ? (
        <div className="flex justify-center items-center h-64 relative z-10">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="relative z-10">
          <VideoFeed videos={videos} loadMoreVideos={loadMoreVideos} isMuted={isMuted} />
        </div>
      )}

      <div className="fixed bottom-6 left-6 z-50">
        <UploadButton onUploadSuccess={handleUploadSuccess} />
      </div>
    </main>
  )
}
