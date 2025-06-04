"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { VideoData } from "@/types/video"
import UploadGuidelines from "./upload-guidelines"
import VideoRecordingTips from "./video-recording-tips"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: (video: VideoData) => void
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [showGuidelines, setShowGuidelines] = useState(true)
  const [showRecordingTips, setShowRecordingTips] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset showGuidelines to true whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setShowGuidelines(true)
      setShowRecordingTips(false)
    }
  }, [isOpen])

  const [file, setFile] = useState<File | null>(null)
  const [artistName, setArtistName] = useState("")
  const [songTitle, setSongTitle] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Check if all form fields are filled
  const isFormComplete = file && artistName.trim() !== "" && songTitle.trim() !== ""

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check file size (300MB limit)
      if (selectedFile.size > 300 * 1024 * 1024) {
        setError("File size exceeds 300MB limit")
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !artistName || !songTitle) {
      setError("Please fill in all fields and select a video file")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    try {
      // Create form data with metadata
      const formData = new FormData()
      formData.append("fileName", file.name)
      formData.append("fileSize", file.size.toString())
      formData.append("artistName", artistName)
      formData.append("songTitle", songTitle)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 200)

      // Send metadata to our API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }

      const data = await response.json()
      setUploadProgress(100)
      setSuccess("Upload successful! Your video will appear in the feed.")

      // Create video data object
      const newVideo: VideoData = {
        vimeo_id: data.vimeo_id,
        original_filename: data.original_filename,
        timestamped_filename: data.timestamped_filename,
        upload_timestamp: data.upload_timestamp,
        artist_name: data.artist_name,
        song_title: data.song_title,
      }

      // Notify parent component of successful upload
      onUploadSuccess(newVideo)

      // Reset form and close modal after a delay
      setTimeout(() => {
        setFile(null)
        setArtistName("")
        setSongTitle("")
        setIsUploading(false)
        setUploadProgress(0)
        setSuccess(null)
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Upload error:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Upload failed. The demo mode is active - your video metadata was saved but the actual file wasn't uploaded.",
      )
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleShowRecordingTips = () => {
    setShowRecordingTips(true)
    setShowGuidelines(false)
  }

  const handleCloseRecordingTips = () => {
    setShowRecordingTips(false)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95%] mx-auto p-0" hideCloseButton={true}>
        {showGuidelines ? (
          <div className="p-4">
            <UploadGuidelines onAccept={() => setShowGuidelines(false)} onClose={onClose} />
          </div>
        ) : showRecordingTips ? (
          <div className="p-4">
            <VideoRecordingTips onClose={handleCloseRecordingTips} />
          </div>
        ) : (
          <div className="p-4">
            <DialogHeader className="text-center pb-2">
              <DialogTitle className="text-xl">Upload Your Performance</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <Label htmlFor="video" className="block text-left w-full mb-1">
                  Video File (Max 300MB)
                </Label>
                <div className="flex items-center border-b border-gray-300 pb-2">
                  <button
                    type="button"
                    onClick={handleChooseFile}
                    className="text-green-600 mr-2"
                    style={{ fontSize: "14px" }}
                  >
                    Choose File
                  </button>
                  <span className="text-gray-500">{file ? file.name : "no file selected"}</span>
                </div>
                <Input
                  id="video"
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </div>

              <div>
                <Label htmlFor="artistName" className="block text-left w-full mb-1">
                  Artist Name
                </Label>
                <Input
                  id="artistName"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  disabled={isUploading}
                  placeholder="What do you like to be called?"
                  className="w-full border-b border-gray-300 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label htmlFor="songTitle" className="block text-left w-full mb-1">
                  Song Title
                </Label>
                <Input
                  id="songTitle"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  disabled={isUploading}
                  placeholder="What's the name of your song?"
                  className="w-full border-b border-gray-300 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">
                  {success}
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center">{uploadProgress}% uploaded</p>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                {isUploading ? (
                  <Button type="button" disabled className="w-full py-4 bg-[#f8a0a0] text-white">
                    Uploading...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={`w-full py-4 text-white ${
                      isFormComplete ? "bg-[#e84c30] hover:bg-[#e84c30]/90" : "bg-[#f8a0a0] hover:bg-[#f8a0a0]/90"
                    }`}
                    disabled={isUploading || !file}
                  >
                    Upload Performance
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={handleShowRecordingTips}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white"
                >
                  Video Recording Tips
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
