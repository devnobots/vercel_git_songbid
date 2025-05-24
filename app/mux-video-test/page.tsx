"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import VideoContainer from "@/components/video-container"
import type { VideoData } from "@/types/video"

export default function MuxVideoTestPage() {
  const [currentUrl, setCurrentUrl] = useState(
    "https://stream.mux.com/kRZVpHgCzwfk4IM00TXecxxGb6kgdyc6DpqiUsfEMweQ.m3u8",
  )
  const [inputUrl, setInputUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [videoStatus, setVideoStatus] = useState("Loading...")

  useEffect(() => {
    // Load MUX Player script
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/@mux/mux-player"
    script.onload = () => {
      setIsLoading(false)
      setVideoStatus("MUX Player loaded")
    }
    script.onerror = () => {
      setError("Failed to load MUX Player")
      setIsLoading(false)
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const handleUrlChange = () => {
    if (inputUrl.trim()) {
      setCurrentUrl(inputUrl.trim())
      setVideoStatus("Loading new URL...")
      setError("")
    }
  }

  const resetToDefault = () => {
    setCurrentUrl("https://stream.mux.com/kRZVpHgCzwfk4IM00TXecxxGb6kgdyc6DpqiUsfEMweQ.m3u8")
    setInputUrl("")
    setError("")
    setVideoStatus("Reset to default River video")
  }

  // Extract playback ID from MUX URL
  const getPlaybackId = (url: string) => {
    if (url.includes("stream.mux.com/")) {
      const parts = url.split("/")
      const filename = parts[parts.length - 1]
      return filename.replace(".m3u8", "")
    }
    return null
  }

  const playbackId = getPlaybackId(currentUrl)

  // Create mock video data for the feed-style video container
  const mockVideoData: VideoData = {
    vimeo_id: "mux_video",
    original_filename: "River",
    timestamped_filename: "River_1683657891.mp4",
    upload_timestamp: "2023-05-10T10:15:22Z",
    artist_name: "Sierra Eagleson",
    song_title: "River",
    blob_url: currentUrl,
  }

  return (
    <div className="min-h-screen bg-[#f5f1eb] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">MUX Video Service Test</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            Back to Home
          </Link>
        </div>

        {/* URL Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Different HLS URLs</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter MUX HLS URL to test..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleUrlChange} className="px-6">
              Test URL
            </Button>
            <Button onClick={resetToDefault} variant="outline" className="px-6">
              Reset
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Current URL: <span className="font-mono text-xs break-all">{currentUrl}</span>
          </p>
        </div>

        {/* Video Player Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Video Player</h2>

          {isLoading ? (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Loading MUX Player...</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-64 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-red-600">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          ) : playbackId ? (
            <div className="w-full">
              <mux-player
                playback-id={playbackId}
                metadata-video-title="MUX Test Video"
                metadata-viewer-user-id="test-user"
                controls
                style={{
                  width: "100%",
                  height: "400px",
                  borderRadius: "8px",
                }}
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-yellow-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-yellow-800">
                <p className="font-semibold">Invalid URL</p>
                <p>Please enter a valid MUX stream URL</p>
              </div>
            </div>
          )}
        </div>

        {/* Debug Information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Status:</strong> {videoStatus}
            </div>
            <div>
              <strong>Playback ID:</strong> {playbackId || "Not detected"}
            </div>
            <div>
              <strong>MUX Player Loaded:</strong> {!isLoading ? "Yes" : "No"}
            </div>
            <div>
              <strong>Current URL:</strong> <span className="font-mono break-all">{currentUrl}</span>
            </div>
            {error && (
              <div className="text-red-600">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-blue-700">
            <li>The default video is the "River" video from MUX</li>
            <li>Enter any MUX HLS URL in the format: https://stream.mux.com/[PLAYBACK_ID].m3u8</li>
            <li>Click "Test URL" to load a new video</li>
            <li>Click "Reset" to go back to the default River video</li>
            <li>The player will automatically extract the playback ID from the URL</li>
          </ul>
        </div>

        {/* Feed-Style Video Container */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Feed-Style Video Container Test</h2>
          <p className="text-sm text-gray-600 mb-6">
            This uses the exact same VideoContainer component from the feed page with all functionality including
            autoplay, zoom effects, and bid button.
          </p>

          {/* Container with same background as feed page */}
          <div className="bg-paper py-6">
            <div className="flex flex-col items-center">
              <VideoContainer video={mockVideoData} isActive={true} index={0} isMuted={false} zoomLevel={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
