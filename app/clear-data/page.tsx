"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function ClearDataPage() {
  const [isClearing, setIsClearing] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    sampleVideosEnabled?: boolean
  } | null>(null)
  const [videoCount, setVideoCount] = useState<number | null>(null)
  const [sampleVideosEnabled, setSampleVideosEnabled] = useState(true)
  const [disableSampleVideos, setDisableSampleVideos] = useState(false)

  // Check current data status
  const checkStatus = async () => {
    try {
      const response = await fetch("/api/clear-data")
      const data = await response.json()
      setVideoCount(data.videoCount)
      setSampleVideosEnabled(data.sampleVideosEnabled)
    } catch (error) {
      console.error("Error checking status:", error)
    }
  }

  // Load status on initial render
  useEffect(() => {
    checkStatus()
  }, [])

  const clearData = async () => {
    if (!confirm("Are you sure you want to clear all video data? This action cannot be undone.")) {
      return
    }

    setIsClearing(true)
    setResult(null)

    try {
      const response = await fetch("/api/clear-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disableSampleVideos,
        }),
      })

      const data = await response.json()
      setResult(data)

      // Refresh the status
      await checkStatus()
    } catch (error) {
      setResult({ error: "An error occurred while clearing data" })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="text-center mb-6">
        <Logo />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clear Application Data</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>

        <div className="mb-6">
          <p className="mb-4">
            This page allows you to clear all video data from the application. This will remove all video references
            from the feed, but <strong>will not</strong> delete the actual videos from Vimeo. You will need to delete
            those manually from your Vimeo account.
          </p>

          {videoCount !== null && (
            <div className="p-4 bg-gray-100 rounded-md mb-4">
              <p>
                Current status: <strong>{videoCount}</strong> videos in the system
              </p>
              <p>
                Sample videos: <strong>{sampleVideosEnabled ? "Enabled" : "Disabled"}</strong>
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="disableSamples"
              checked={disableSampleVideos}
              onCheckedChange={(checked) => setDisableSampleVideos(checked === true)}
            />
            <Label htmlFor="disableSamples">
              Also disable sample videos (feed will be empty until new videos are uploaded)
            </Label>
          </div>

          <div className="flex gap-4">
            <Button onClick={clearData} disabled={isClearing} variant="destructive" className="flex-1">
              {isClearing ? "Clearing Data..." : "Clear All Video Data"}
            </Button>

            <Button onClick={checkStatus} variant="outline">
              Refresh Status
            </Button>
          </div>
        </div>

        {result && (
          <div
            className={`p-4 rounded-md mb-4 ${
              result.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {result.message || result.error}
          </div>
        )}

        <div className="mt-6">
          <h2 className="font-medium mb-2">Important Notes:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>This action only clears the application's record of videos, not the actual videos on Vimeo.</li>
            <li>
              To completely remove videos, you must also delete them from your Vimeo account through the Vimeo
              dashboard.
            </li>
            <li>
              By default, sample videos will still appear in the feed when no real videos are available. Check the
              option above to disable this behavior.
            </li>
            <li>This action cannot be undone.</li>
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="font-medium mb-2">View Feed Without Samples:</h2>
          <p>You can also view the feed without sample videos by using this link:</p>
          <div className="mt-2">
            <Link href="/feed?showSamples=false" className="text-blue-500 hover:underline">
              View Feed Without Sample Videos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
