"use client"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Script from "next/script"

declare global {
  interface Window {
    MuxPlayerElement: any
  }
}

export default function MuxTestPage() {
  const playerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [muxPlayerLoaded, setMuxPlayerLoaded] = useState(false)

  // MUX playback ID (extracted from the HLS URL)
  const muxPlaybackId = "kRZVpHgCzwfk4IM00TXecxxGb6kgdyc6DpqiUsfEMweQ"

  useEffect(() => {
    if (muxPlayerLoaded && playerRef.current) {
      const player = playerRef.current

      // Add event listeners
      player.addEventListener("loadeddata", () => {
        console.log("MUX Player: Video loaded")
        setIsLoaded(true)
        setIsError(false)
      })

      player.addEventListener("play", () => {
        console.log("MUX Player: Video playing")
        setIsPlaying(true)
      })

      player.addEventListener("pause", () => {
        console.log("MUX Player: Video paused")
        setIsPlaying(false)
      })

      player.addEventListener("error", (e: any) => {
        console.error("MUX Player error:", e)
        setIsError(true)
        setErrorMessage(`MUX Player error: ${e.detail?.message || "Unknown error"}`)
      })

      return () => {
        // Cleanup event listeners
        if (player) {
          player.removeEventListener("loadeddata", () => {})
          player.removeEventListener("play", () => {})
          player.removeEventListener("pause", () => {})
          player.removeEventListener("error", () => {})
        }
      }
    }
  }, [muxPlayerLoaded])

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err: any) => {
          console.error("Error playing video:", err)
          setIsError(true)
          setErrorMessage(`Play error: ${err.message}`)
        })
    }
  }

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleRetry = () => {
    setIsError(false)
    setErrorMessage("")
    if (playerRef.current) {
      playerRef.current.load()
    }
  }

  return (
    <>
      {/* Load MUX Player library */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@mux/mux-player@2.9.0/dist/mux-player.min.js"
        onLoad={() => {
          console.log("MUX Player library loaded")
          setMuxPlayerLoaded(true)
        }}
        onError={() => {
          console.error("Failed to load MUX Player library")
          setIsError(true)
          setErrorMessage("Failed to load MUX Player library")
        }}
      />

      <div className="min-h-screen bg-paper p-4 flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">MUX Player Test</h1>
            <Link href="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="aspect-video bg-black rounded-md overflow-hidden relative">
              {!muxPlayerLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  <span className="ml-2 text-white">Loading MUX Player...</span>
                </div>
              )}

              {isError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 z-10 p-4">
                  <p className="text-white text-sm mb-2 text-center">Error loading video.</p>
                  <p className="text-red-400 text-xs mb-4 text-center">{errorMessage}</p>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {muxPlayerLoaded && (
                <mux-player
                  ref={playerRef}
                  playback-id={muxPlaybackId}
                  metadata-video-title="River"
                  metadata-viewer-user-id="test-user"
                  controls
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "16/9",
                  }}
                />
              )}
            </div>

            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={handlePlay}
                disabled={!muxPlayerLoaded || isPlaying || isError}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Play
              </button>
              <button
                onClick={handlePause}
                disabled={!muxPlayerLoaded || !isPlaying || isError}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pause
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Video Information</h2>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <p>
                  <strong>Title:</strong> River
                </p>
                <p>
                  <strong>Artist:</strong> Sierra Eagleson
                </p>
                <p>
                  <strong>Playback ID:</strong> <span className="text-xs break-all">{muxPlaybackId}</span>
                </p>
                <p>
                  <strong>Status:</strong> {isPlaying ? "Playing" : isLoaded ? "Paused" : "Loading"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <p>
                  <strong>MUX Player Loaded:</strong> {muxPlayerLoaded ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Video Loaded:</strong> {isLoaded ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Playing:</strong> {isPlaying ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Error:</strong> {isError ? "Yes" : "No"}
                </p>
                {isError && (
                  <p>
                    <strong>Error Message:</strong> {errorMessage}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Implementation Notes</h2>
              <div className="bg-blue-50 p-3 rounded text-sm">
                <p className="mb-2">
                  <strong>Using MUX Player:</strong> This test uses the official MUX Player library instead of a basic
                  HTML5 video element.
                </p>
                <p className="mb-2">
                  <strong>Playback ID:</strong> Using the playback ID extracted from the HLS URL for better
                  compatibility.
                </p>
                <p>
                  <strong>Benefits:</strong> Better HLS support, built-in analytics, and optimized streaming.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
